/**
 * Reactive audit snapshot — replaces `/api/audits/state` + the JSON
 * file at /var/www/digilist-audit/state.json. Ports the aggregation
 * logic from tools/site-intelligence/src/snapshot.ts:buildSnapshot().
 *
 * Returns the same `Snapshot` shape that
 * src/pages/admin/intelligence-shared.ts exports, so IntelligenceShell
 * and every audit page swaps to `useQuery(api.audits.state.snapshot)`
 * without touching types.
 */
import { v } from "convex/values";
import { query } from "../_generated/server";
import { requireAdmin } from "../auth";
import {
  TARGETS,
  findTarget,
  type AuditType,
  type SurfaceType,
} from "./targets";

export const snapshot = query({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);

    const [targetRows, allRuns, allFindings] = await Promise.all([
      ctx.db.query("audit_targets").collect(),
      ctx.db.query("audit_runs").withIndex("by_started").order("desc").take(500),
      ctx.db.query("audit_findings").collect(),
    ]);

    const targetById = new Map(targetRows.map((t) => [t._id, t]));
    const findingsByRun = new Map<string, typeof allFindings>();
    for (const f of allFindings) {
      const arr = findingsByRun.get(f.run_id as unknown as string) ?? [];
      arr.push(f);
      findingsByRun.set(f.run_id as unknown as string, arr);
    }

    // Enrich DB rows with the runtime catalog (TARGETS).
    const enrichedTargets = targetRows.map((row) => {
      const def = findTarget(row.name);
      return {
        id: legacyHash(row._id),
        name: row.name,
        label: row.label,
        origin: row.origin,
        description: row.description,
        is_active: row.is_active ? 1 : 0,
        type: def?.type ?? null,
        environment: def?.environment ?? null,
        indexable: def?.indexable ?? false,
        requiresAuth: def?.requiresAuth ?? false,
        checks: def?.checks ?? [],
      };
    });

    // latestRunsByTargetAndType — keep the newest run per (target_id, audit_type)
    const latestKey = new Map<
      string,
      typeof allRuns[number]
    >();
    for (const r of allRuns) {
      const k = `${r.target_id}::${r.audit_type}`;
      const cur = latestKey.get(k);
      if (!cur || r.started_at > cur.started_at) {
        latestKey.set(k, r);
      }
    }

    const checksByTarget = new Map<string, Set<string>>();
    for (const t of TARGETS) {
      checksByTarget.set(t.name, new Set(t.checks));
    }

    const latest = Array.from(latestKey.values())
      .map((r) => {
        const t = targetById.get(r.target_id);
        return {
          run: r,
          target_name: t?.name ?? "",
          target_label: t?.label ?? "",
          target_origin: t?.origin ?? "",
        };
      })
      .filter(({ run, target_name }) => {
        const allowed = checksByTarget.get(target_name);
        return !allowed || allowed.has(run.audit_type);
      })
      .map(({ run, target_name, target_label, target_origin }) => ({
        id: legacyHash(run._id),
        target_id: legacyHash(run.target_id),
        target_name,
        target_label,
        target_origin,
        audit_type: run.audit_type as AuditType,
        started_at: run.started_at,
        finished_at: run.finished_at,
        pages_scanned: run.pages_scanned,
        findings_total: run.findings_total,
        avg_score: run.avg_score,
        trigger: run.trigger,
        status: run.status,
      }));

    // Top findings + issue feed aggregation
    type FindingRow = typeof allFindings[number];
    const topFindings: Array<{
      audit_type: AuditType;
      rule: string;
      severity: "error" | "warn" | "info";
      count: number;
    }> = [];
    const issues: Array<{
      surface: string;
      surfaceLabel: string;
      surfaceType: SurfaceType | null;
      auditType: AuditType;
      rule: string;
      severity: "error" | "warn" | "info";
      message: string;
      url: string;
      lastSeen: string;
      affected: number;
    }> = [];

    for (const lr of latest) {
      const runDocId = allRuns.find((r) => r.started_at === lr.started_at && r.audit_type === lr.audit_type);
      if (!runDocId) continue;
      const rows: FindingRow[] =
        findingsByRun.get(runDocId._id as unknown as string) ?? [];
      const surfaceDef = findTarget(lr.target_name);
      type Sample = {
        sample: FindingRow;
        severity: string;
        affected: Set<string>;
      };
      const ruleSamples = new Map<string, Sample>();
      for (const r of rows) {
        const cur = ruleSamples.get(r.rule);
        if (cur) cur.affected.add(r.url);
        else
          ruleSamples.set(r.rule, {
            sample: r,
            severity: r.severity,
            affected: new Set([r.url]),
          });
      }
      for (const [rule, { sample, severity, affected }] of ruleSamples) {
        topFindings.push({
          audit_type: lr.audit_type,
          rule,
          severity: severity as "error" | "warn" | "info",
          count: affected.size,
        });
        issues.push({
          surface: lr.target_name,
          surfaceLabel: lr.target_label,
          surfaceType: surfaceDef?.type ?? null,
          auditType: lr.audit_type,
          rule,
          severity: severity as "error" | "warn" | "info",
          message: sample.message,
          url: sample.url,
          lastSeen: lr.started_at,
          affected: affected.size,
        });
      }
    }

    const severityRank = (s: string) =>
      s === "error" ? 0 : s === "warn" ? 1 : 2;
    topFindings.sort(
      (a, b) =>
        severityRank(a.severity) - severityRank(b.severity) ||
        b.count - a.count,
    );
    issues.sort(
      (a, b) =>
        severityRank(a.severity) - severityRank(b.severity) ||
        b.affected - a.affected ||
        a.surface.localeCompare(b.surface),
    );

    // Ecosystem roll-up
    const surfaceScores = new Map<string, number[]>();
    const surfaceErrorCount = new Map<string, number>();
    let errorCount = 0;
    let warnCount = 0;
    let infoCount = 0;
    for (const r of latest) {
      const arr = surfaceScores.get(r.target_name) ?? [];
      arr.push(r.avg_score);
      surfaceScores.set(r.target_name, arr);
    }
    for (const issue of issues) {
      if (issue.severity === "error") {
        errorCount += issue.affected;
        surfaceErrorCount.set(
          issue.surface,
          (surfaceErrorCount.get(issue.surface) ?? 0) + issue.affected,
        );
      } else if (issue.severity === "warn") warnCount += issue.affected;
      else infoCount += issue.affected;
    }
    const surfacesTotal = enrichedTargets.filter((t) => t.is_active).length;
    const surfacesWithErrors = Array.from(surfaceErrorCount.values()).filter(
      (n) => n > 0,
    ).length;
    const avgScore =
      surfaceScores.size === 0
        ? 0
        : Array.from(surfaceScores.values())
            .map((arr) => arr.reduce((s, x) => s + x, 0) / arr.length)
            .reduce((s, x) => s + x, 0) / surfaceScores.size;

    const recent = allRuns.slice(0, 30).map((r) => {
      const t = targetById.get(r.target_id);
      return {
        id: legacyHash(r._id),
        target_name: t?.name ?? "",
        target_label: t?.label ?? "",
        audit_type: r.audit_type as AuditType,
        started_at: r.started_at,
        finished_at: r.finished_at,
        pages_scanned: r.pages_scanned,
        findings_total: r.findings_total,
        avg_score: r.avg_score,
        status: r.status,
        trigger: r.trigger,
      };
    });

    return {
      generatedAt: new Date().toISOString(),
      targets: enrichedTargets,
      latest,
      recent,
      topFindings: topFindings.slice(0, 30),
      issues: issues.slice(0, 200),
      ecosystemSummary: {
        surfacesTotal,
        surfacesHealthy: surfacesTotal - surfacesWithErrors,
        surfacesWithErrors,
        errorCount,
        warnCount,
        infoCount,
        avgScore,
      },
    };
  },
});

function legacyHash(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}
