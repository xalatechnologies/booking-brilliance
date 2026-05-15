/**
 * Audit orchestrator. Runs one or more auditors against one or more targets,
 * persisting everything to the unified SQLite store.
 *
 *   pnpm audit:all
 *   pnpm audit:all -- --target marketing --type seo
 */

import { fileURLToPath } from "node:url";
import {
  TARGETS,
  activeTargets,
  findTarget,
  type Target,
} from "./targets";
import {
  upsertTarget,
  startRun,
  finishRun,
  insertPages,
  insertFindings,
} from "./convex-write";
import type { AuditResult, AuditType } from "./types";
import { runSeoAudit } from "./auditors/seo";
import { runA11yAudit } from "./auditors/a11y";
import { runSecurityAudit } from "./auditors/security";
import { runLinkAudit } from "./auditors/links";
import { runUptimeAudit } from "./auditors/uptime";

type AuditFn = (target: Target) => Promise<AuditResult>;

// Only the auditors with concrete implementations are wired. `performance`
// and `vulns` are listed in AuditType but require external runners
// (Lighthouse CI, npm-audit/Snyk import) — gated behind separate phases.
const AUDITORS: Partial<Record<AuditType, AuditFn>> = {
  uptime: runUptimeAudit,
  seo: runSeoAudit,
  a11y: runA11yAudit,
  security: runSecurityAudit,
  links: runLinkAudit,
};

const ALL_AUDIT_TYPES: AuditType[] = [
  "uptime",
  "seo",
  "a11y",
  "security",
  "links",
];

interface CliArgs {
  targetNames: string[];     // empty = all active
  auditTypes: AuditType[];   // empty = all
  trigger: "cli" | "dashboard" | "cron";
}

function parseArgs(argv: string[]): CliArgs {
  const out: CliArgs = { targetNames: [], auditTypes: [], trigger: "cli" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--target") out.targetNames.push(argv[++i]);
    else if (a === "--type") out.auditTypes.push(argv[++i] as AuditType);
    else if (a === "--trigger")
      out.trigger = argv[++i] as CliArgs["trigger"];
  }
  return out;
}

export async function run(args: CliArgs): Promise<{ runIds: string[] }> {
  // Seed target rows in Convex so subsequent startRun calls can resolve
  // a target_name → audit_target document.
  for (const t of TARGETS) {
    await upsertTarget({
      name: t.name,
      label: t.label,
      origin: t.origin,
      description: t.description,
      isActive: t.active,
    });
  }

  const targets =
    args.targetNames.length > 0
      ? args.targetNames
          .map(findTarget)
          .filter((t): t is Target => Boolean(t))
      : activeTargets();

  const requestedTypes: AuditType[] =
    args.auditTypes.length > 0 ? args.auditTypes : ALL_AUDIT_TYPES;

  if (targets.length === 0) {
    console.error("[audit] no active targets");
    return { runIds: [] };
  }

  console.log(
    `[audit] ${targets.length} target(s) × up to ${requestedTypes.length} audit(s) (per-surface gated)`,
  );

  const runIds: string[] = [];

  for (const target of targets) {
    // Per-surface gating: only run audits this surface opted into.
    const surfaceTypes = requestedTypes.filter((t) =>
      target.checks.includes(t),
    );
    if (surfaceTypes.length === 0) {
      console.log(
        `  [${target.name}] skipped — no audits in target.checks intersect requested set`,
      );
      continue;
    }

    for (const type of surfaceTypes) {
      const fn = AUDITORS[type];
      if (!fn) {
        console.log(
          `  [${target.name} · ${type}] skipped — auditor not implemented yet`,
        );
        continue;
      }
      const runId = await startRun(target.name, type, args.trigger);
      runIds.push(runId);
      console.log(
        `  [${target.name} · ${type}] run ${runId} started`,
      );
      try {
        const result = await fn(target);
        await insertPages(runId, result.pages);
        await insertFindings(runId, result.findings);
        const avg =
          result.pages.length === 0
            ? 0
            : result.pages.reduce((s, p) => s + p.score, 0) /
              result.pages.length;
        await finishRun(runId, {
          pages: result.pages.length,
          findings: result.findings.length,
          avgScore: avg,
          status: "ok",
        });
        console.log(
          `  [${target.name} · ${type}] ${result.pages.length} pages · ${result.findings.length} findings · avg ${avg.toFixed(1)}`,
        );
      } catch (err) {
        console.error(`  [${target.name} · ${type}] FAILED:`, err);
        await finishRun(runId, {
          pages: 0,
          findings: 0,
          avgScore: 0,
          status: "error",
        });
      }
    }
  }

  return { runIds };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run(parseArgs(process.argv.slice(2)))
    .then(({ runIds }) => {
      console.log(`\n[audit] done — ${runIds.length} run(s) persisted.`);
    })
    .catch((err) => {
      console.error("[audit] fatal:", err);
      process.exit(1);
    });
}

// Silence unused param warning when file is imported as a module
void fileURLToPath;
