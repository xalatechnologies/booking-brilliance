/**
 * Public, NO-AUTH status data for status.digilist.no.
 *
 * Returns scrubbed per-surface signals only — never finding messages,
 * never URLs, never sensitive paths. Safe to expose to anonymous web
 * visitors. The dashboard's `state.snapshot` query is admin-only and
 * carries the raw data; this one is the public face.
 *
 * What we return:
 *   - generatedAt
 *   - surfaces[]: id, label, type, environment, overall (0..100 score),
 *     status ("operational" | "degraded" | "down"), uptime90d (0..100),
 *     lastIncidentAt (ISO or null)
 *   - ecosystem: overall status + rolled-up counts (errors/warns clipped
 *     to ranges to avoid information leaks)
 *   - incidents[]: last 10 outage entries — { surface, startedAt, durationMin }
 */
import { query } from "../_generated/server";
import { TARGETS, type SurfaceType, type Environment } from "./targets";

type RunRow = {
  _id: string;
  target_id: string;
  audit_type: string;
  started_at: string;
  finished_at: string | null;
  avg_score: number;
  findings_total: number;
  status: string;
};

export const summary = query({
  args: {},
  handler: async (ctx) => {
    const [targetRows, runs] = await Promise.all([
      ctx.db.query("audit_targets").collect(),
      ctx.db
        .query("audit_runs")
        .withIndex("by_started")
        .order("desc")
        .take(500),
    ]);

    const targetById = new Map(targetRows.map((t) => [t._id as string, t]));
    const targetMeta = new Map(TARGETS.map((t) => [t.name, t]));

    // Per-target allowed audit types. Runs whose audit_type isn't in the
    // current checks[] for that target are excluded — keeps the public
    // page honest even when targets.ts is tightened and historical
    // (now-disabled) runs are still in Convex.
    const allowedByTargetId = new Map<string, Set<string>>();
    for (const t of targetRows) {
      const meta = targetMeta.get(t.name);
      allowedByTargetId.set(
        t._id as unknown as string,
        new Set(meta?.checks ?? []),
      );
    }
    const isAllowed = (r: RunRow) => {
      const allowed = allowedByTargetId.get(r.target_id as string);
      return !allowed || allowed.has(r.audit_type);
    };

    const ninetyDaysAgo = new Date(
      Date.now() - 90 * 86_400_000,
    ).toISOString();
    const thirtyDaysAgo = new Date(
      Date.now() - 30 * 86_400_000,
    ).toISOString();
    const latestByKey = new Map<string, RunRow>();
    const runsByTarget = new Map<string, RunRow[]>();
    for (const r of runs as unknown as RunRow[]) {
      if (r.started_at < ninetyDaysAgo) continue;
      if (!isAllowed(r)) continue;
      const k = `${r.target_id}::${r.audit_type}`;
      const cur = latestByKey.get(k);
      if (!cur || r.started_at > cur.started_at) latestByKey.set(k, r);
      const arr = runsByTarget.get(r.target_id) ?? [];
      arr.push(r);
      runsByTarget.set(r.target_id, arr);
    }

    const pct = (runs: RunRow[]) => {
      const finished = runs.filter((r) => r.status !== "running");
      if (finished.length === 0) return null;
      const ok = finished.filter(
        (r) => r.status === "ok" && r.avg_score > 0,
      ).length;
      return Math.round((ok / finished.length) * 1000) / 10;
    };

    // Public status page only shows production surfaces — staging
     // flakiness is an internal signal, not something to broadcast to
     // visitors of status.digilist.no. The admin dashboard still sees
     // staging via /admin/intelligence.
    const surfaces = targetRows
      .filter((t) => t.is_active)
      .filter((t) => {
        const meta = targetMeta.get(t.name);
        return (meta?.environment ?? "production") === "production";
      })
      .map((t) => {
        const meta = targetMeta.get(t.name);
        const latestRuns = Array.from(latestByKey.values()).filter(
          (r) => r.target_id === (t._id as unknown as string),
        );
        const targetRuns = runsByTarget.get(t._id as unknown as string) ?? [];
        const targetRuns30 = targetRuns.filter(
          (r) => r.started_at >= thirtyDaysAgo,
        );

        const overall =
          latestRuns.length === 0
            ? null
            : Math.round(
                latestRuns.reduce((s, r) => s + r.avg_score, 0) /
                  latestRuns.length,
              );

        const uptime30d = pct(targetRuns30);
        const uptime90d = pct(targetRuns);

        // Status bucket — purely score-driven so a single check failing
        // shows up as "degraded" rather than "down".
        let status: "operational" | "degraded" | "down" = "operational";
        if (overall === null) status = "operational";
        else if (overall < 50) status = "down";
        else if (overall < 80) status = "degraded";

        // Last incident = most recent run with status != "ok" or avg < 50
        const incident = targetRuns
          .filter((r) => r.status === "error" || r.avg_score < 50)
          .sort((a, b) => (a.started_at < b.started_at ? 1 : -1))[0];

        return {
          id: t.name,
          label: t.label,
          type: (meta?.type ?? null) as SurfaceType | null,
          environment: (meta?.environment ?? null) as Environment | null,
          origin: t.origin,
          overall,
          status,
          uptime30d,
          uptime90d,
          lastIncidentAt: incident?.started_at ?? null,
        };
      });

    // Ecosystem roll-up — fuzzy buckets, no exact counts
    const downCount = surfaces.filter((s) => s.status === "down").length;
    const degradedCount = surfaces.filter(
      (s) => s.status === "degraded",
    ).length;
    let ecosystemStatus: "operational" | "degraded" | "outage";
    if (downCount > 0) ecosystemStatus = "outage";
    else if (degradedCount > 0) ecosystemStatus = "degraded";
    else ecosystemStatus = "operational";

    // Recent incidents — last 10, scrubbed (no rule text, no URL).
    // Same allowed-checks filter as above so a tightened audit profile
    // doesn't keep showing historical structural failures.
    const allIncidents = (runs as unknown as RunRow[])
      .filter((r) => isAllowed(r))
      .filter((r) => r.status === "error" || r.avg_score < 50)
      .map((r) => {
        const t = targetById.get(r.target_id as string);
        const finishedMs = r.finished_at
          ? Date.parse(r.finished_at)
          : Date.parse(r.started_at);
        const startedMs = Date.parse(r.started_at);
        return {
          surface: t?.name ?? "",
          surfaceLabel: t?.label ?? "",
          auditType: r.audit_type,
          startedAt: r.started_at,
          durationMin: Math.max(
            0,
            Math.round((finishedMs - startedMs) / 60_000),
          ),
        };
      })
      .filter((i) => i.surface)
      .slice(0, 10);

    return {
      generatedAt: new Date().toISOString(),
      surfaces,
      ecosystem: {
        status: ecosystemStatus,
        surfacesTotal: surfaces.length,
        surfacesHealthy: surfaces.filter((s) => s.status === "operational")
          .length,
        surfacesDegraded: degradedCount,
        surfacesDown: downCount,
      },
      incidents: allIncidents,
    };
  },
});
