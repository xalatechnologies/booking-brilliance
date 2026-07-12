/**
 * The CTO briefing - a human-readable snapshot of each heartbeat, written to
 * tools/orchestrator-agent/state/briefing-<sha>.md (gitignored). It captures
 * what the driver did, the reasoning plan, the assignments, and any blockers so
 * a person can catch up on the fleet in one read.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { DriveResult } from "./drive";
import type { Plan } from "./orchestrate";
import type { FleetState } from "./state";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const STATE_DIR = path.resolve(__dirname, "..", "state");

/** Render the briefing markdown (pure). */
export function renderBriefing(state: FleetState, plan: Plan, drive: DriveResult, autopilot: boolean): string {
  const lines: string[] = [
    `# CTO briefing ${state.generatedAt}`,
    ``,
    `Mode: ${autopilot ? "autopilot" : "advisory"} (never merge or deploy).`,
    ``,
    `## Todo driver`,
    `- Approved issues: ${drive.todoCount}`,
    `- Enhanced (new /loop goals): ${drive.enhanced}`,
    `- Prepared branches: ${drive.prepared}`,
    `- Implementations run: ${drive.implemented}`,
    ``,
    `## Situation assessment`,
    plan.summary || "(none)",
    ``,
    `## Assignments`,
    ...(plan.assignments.length
      ? plan.assignments.map(
          (a) =>
            `- **${a.item}** -> ${a.specialist}${a.priority ? ` · ${a.priority}` : ""}${a.severity ? ` · ${a.severity}` : ""}${a.promote ? " · suggested for approval" : ""}${a.rationale ? `\n  ${a.rationale}` : ""}`,
        )
      : ["- (none)"]),
    ``,
    `## Blockers (needs a human)`,
    ...(plan.blockers.length
      ? plan.blockers.map((b) => `- **${b.item || "general"}**: ${b.question}`)
      : ["- (none)"]),
    ``,
    `## Open PRs (${state.prs.length})`,
    ...(state.prs.length
      ? state.prs.map(
          (p) => `- ${p.repo}#${p.number} ${p.title.slice(0, 70)} (${p.checks.passed}✓/${p.checks.failed}✗/${p.checks.pending}…)${p.reviewDecision ? ` · ${p.reviewDecision}` : ""}`,
        )
      : ["- (none)"]),
    ``,
  ];
  return lines.join("\n");
}

/** Write the briefing to state/briefing-<sha>.md and return its path + text. */
export function writeBriefing(
  state: FleetState,
  plan: Plan,
  drive: DriveResult,
  autopilot: boolean,
  sha: string,
): { path: string; text: string } {
  const text = renderBriefing(state, plan, drive, autopilot);
  fs.mkdirSync(STATE_DIR, { recursive: true });
  const file = path.join(STATE_DIR, `briefing-${(sha || "latest").slice(0, 12)}.md`);
  fs.writeFileSync(file, text, "utf-8");
  fs.writeFileSync(path.join(STATE_DIR, "briefing-latest.md"), text, "utf-8");
  return { path: file, text };
}
