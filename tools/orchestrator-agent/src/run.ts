/**
 * cto:run - one heartbeat cycle.
 *
 *   1. Drive the human-approved Todo queue toward PRs (enhance -> prepare ->
 *      implement), reusing the improvements agent's prepare/implement.
 *   2. Gather the rest of the fleet state (Linear, Open Brain, open PRs).
 *   3. Reason with Opus: which specialist owns each non-Todo item, suggested
 *      priority/severity, and blockers needing the human.
 *   4. Apply the SAFE parts: set Linear priority/labels, record learnings, write
 *      a CTO briefing. Never merges, never deploys, and never moves work INTO
 *      Todo unless CTO_AUTOPILOT=1.
 *
 * Flags: --dry-run (read + reason, change nothing) · --no-reason (skip the Opus
 * pass) · --limit N (cap implementations this cycle).
 *
 * Env: LINEAR_API_KEY, LINEAR_TEAM_KEY (default XAL), IMPROVEMENTS_LINEAR_PROJECT
 *   (default "Digilist - Improvements Agent"), IMPROVEMENTS_APPROVE_STATE
 *   (default "Todo"), CTO_AUTOPILOT, CTO_REPOS, CTO_BRIEFING_ISSUE.
 */
import { loadConfig } from "../../content-agent/src/config";
import { LinearClient } from "../../content-agent/src/linear";
import { OpenBrain } from "../../improvements-agent/src/brain";
import { repoStatus } from "../../improvements-agent/src/code-map";
import { writeBriefing } from "./briefing";
import { driveTodo, type DriveResult } from "./drive";
import { orchestrate, EMPTY_PLAN, type Assignment, type Plan } from "./orchestrate";
import { gatherFleetState, type FleetState } from "./state";

const nowIso = () => new Date().toISOString();

/** Map a plan priority (Urgent/High/... or P0..P3) to Linear native 1..4. */
export function toNativePriority(p?: string): number | undefined {
  if (!p) return undefined;
  const key = p.trim().toLowerCase();
  const byWord: Record<string, number> = { urgent: 1, high: 2, normal: 3, medium: 3, low: 4 };
  const byP: Record<string, number> = { p0: 1, p1: 2, p2: 3, p3: 4 };
  return byWord[key] ?? byP[key];
}

export interface CycleOptions {
  dryRun?: boolean;
  noReason?: boolean;
  limit?: number;
}

export interface CycleResult {
  drive: DriveResult;
  state: FleetState;
  plan: Plan;
  briefingPath: string;
}

/**
 * Apply only the safe, reversible parts of the plan: nudge non-Todo issues'
 * priority + severity label, and (autopilot only) promote recommended issues to
 * the approval state. Never touches Todo issues' state (the driver owns those)
 * and never merges or deploys.
 */
async function applySafe(
  client: LinearClient,
  teamId: string,
  state: FleetState,
  plan: Plan,
  brain: OpenBrain,
  approveState: string,
  autopilot: boolean,
  dryRun: boolean,
): Promise<void> {
  const byIdent = new Map(state.issues.map((i) => [i.identifier.toLowerCase(), i]));
  for (const a of plan.assignments) {
    const issue = byIdent.get(a.item.toLowerCase());
    if (!issue) continue;
    if (issue.stateName.toLowerCase() === approveState.toLowerCase()) continue; // driver owns Todo
    const native = toNativePriority(a.priority);
    if (dryRun) {
      console.log(`  [apply] would set ${issue.identifier} -> ${a.specialist}${native ? ` · pri ${native}` : ""}${a.severity ? ` · ${a.severity}` : ""}`);
      continue;
    }
    if (native && native !== issue.priority) {
      await client.gql(
        `mutation($id: String!, $priority: Int!) { issueUpdate(id: $id, input: { priority: $priority }) { success } }`,
        { id: issue.id, priority: native },
      ).catch((e) => console.warn(`  [apply] priority ${issue.identifier} failed: ${String(e).slice(0, 100)}`));
    }
    if (a.severity && ["critical", "major", "minor"].includes(a.severity)) {
      await client.addLabel(issue.id, teamId, a.severity).catch(() => {});
    }
    // A recommendation to promote into the approval queue is a human decision by
    // default; only autopilot may act on it.
    if (a.promote && autopilot) {
      await client.moveIssue(issue.id, teamId, approveState).catch(() => false);
      console.log(`  [apply] (autopilot) promoted ${issue.identifier} -> ${approveState}`);
    }
  }

  // Record the situation + blockers as compounding learnings.
  if (plan.summary) brain.addLearning(`CTO ${nowIso().slice(0, 10)}: ${plan.summary.slice(0, 200)}`);
  for (const b of plan.blockers) brain.addLearning(`BLOCKED ${b.item}: ${b.question}`.slice(0, 200));

  // Optional: post the briefing summary as a comment on a designated issue.
  const briefTo = process.env.CTO_BRIEFING_ISSUE;
  if (!dryRun && briefTo && plan.summary) {
    const target = byIdent.get(briefTo.toLowerCase())?.id ?? briefTo;
    const blockerLines = plan.blockers.length
      ? `\n\n**Blockers:**\n${plan.blockers.map((b) => `- ${b.item}: ${b.question}`).join("\n")}`
      : "";
    await client.addComment(target, `🧭 **CTO briefing**\n\n${plan.summary}${blockerLines}`).catch(() => {});
  }
}

export async function runCycle(opts: CycleOptions = {}): Promise<CycleResult> {
  const dryRun = opts.dryRun ?? false;
  const cfg = loadConfig();
  const linearKey = process.env.LINEAR_API_KEY ?? "";
  if (!linearKey) throw new Error("LINEAR_API_KEY required");
  if (cfg.llmProvider === "api" && !cfg.anthropicApiKey)
    throw new Error("ANTHROPIC_API_KEY required (or set LLM_PROVIDER=claude-cli to use the Claude Max subscription)");

  const projectName = process.env.IMPROVEMENTS_LINEAR_PROJECT ?? "Digilist - Improvements Agent";
  const approveState = process.env.IMPROVEMENTS_APPROVE_STATE ?? "Todo";
  const autopilot = process.env.CTO_AUTOPILOT === "1";

  const client = new LinearClient(linearKey);
  const team = await client.resolveTeam(process.env.LINEAR_TEAM_KEY ?? "XAL");
  const project = await client.ensureProject(projectName, team.id);
  const brain = OpenBrain.load();

  console.log(`[cto] heartbeat @ ${nowIso()} - project "${project.name}", mode ${autopilot ? "autopilot" : "advisory"}${dryRun ? " (dry run)" : ""}`);

  // 1. drive the approved queue toward PRs (the active part).
  const drive = await driveTodo({
    client,
    cfg,
    projectId: project.id,
    teamId: team.id,
    approveState,
    brain,
    dryRun,
    limit: opts.limit,
  });

  // 2. read the rest of the fleet.
  const state = await gatherFleetState(client, project.id, brain, nowIso());

  // 3. reason (Opus). Skippable for a cheap, driver-only cycle.
  let plan: Plan = EMPTY_PLAN;
  if (!opts.noReason && (state.issues.length || state.prs.length)) {
    console.log(`[cto] reasoning over ${state.issues.length} issue(s) + ${state.prs.length} PR(s)…`);
    plan = await orchestrate(state, cfg).catch((e) => {
      console.warn(`[cto] reasoning failed: ${String(e).slice(0, 160)}`);
      return EMPTY_PLAN;
    });
  }

  // 4. apply the safe parts + write the briefing.
  await applySafe(client, team.id, state, plan, brain, approveState, autopilot, dryRun);
  const sha = (await repoStatus(process.cwd(), nowIso()).catch(() => null))?.sha ?? "latest";
  const { path: briefingPath } = writeBriefing(state, plan, drive, autopilot, sha);
  brain.save(nowIso());

  console.log(
    `[cto] done - drove ${drive.enhanced} enhanced / ${drive.prepared} prepared / ${drive.implemented} implemented; ${plan.assignments.length} assignment(s), ${plan.blockers.length} blocker(s). Briefing: ${briefingPath}`,
  );
  if (plan.blockers.length) {
    console.log(`[cto] BLOCKERS that need you:`);
    for (const b of plan.blockers) console.log(`  - ${b.item}: ${b.question}`);
  }
  return { drive, state, plan, briefingPath };
}

function summarizeAssignments(as: Assignment[]): string {
  return as.map((a) => `${a.item}->${a.specialist}`).join(", ") || "(none)";
}

// CLI entry (skipped when imported, e.g. by loop.ts).
const isCli = import.meta.url === `file://${process.argv[1]}`;
if (isCli) {
  const argv = process.argv.slice(2);
  const li = argv.indexOf("--limit");
  runCycle({
    dryRun: argv.includes("--dry-run"),
    noReason: argv.includes("--no-reason"),
    limit: li >= 0 ? Number(argv[li + 1]) || undefined : undefined,
  })
    .then((r) => console.log(`[cto] assignments: ${summarizeAssignments(r.plan.assignments)}`))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
