/**
 * The Todo driver - the heartbeat's core behavior. On each cycle it reads the
 * human-approved queue (Linear "Todo"), and for EVERY issue, in priority order,
 * drives it toward a PR:
 *
 *   1. ENHANCE in place when the issue is a bare one-liner with no /loop goal
 *      (the normal case: a human drops a title + a sentence and moves it to
 *      Todo). We build an item from title + description, run the improvements
 *      agent's analyze stage (grounded in the codebase graph) to draft a proper
 *      detailed description AND a self-contained /loop goal, then write that back
 *      onto the Linear issue in the agent format - human-reviewable.
 *   2. PREPARE + IMPLEMENT by REUSING prepareApproved + implementPending exactly
 *      as the improvements agent does: prepareApproved creates the branch and
 *      moves Todo -> In Progress; implementPending runs the coding agent on the
 *      shared runner, opens a PR, and moves the issue -> In Review (or flags it
 *      BLOCKED). We never merge or deploy - the output is always a PR to review.
 *
 * Todo is the human approval gate, so this whole loop is safe by design.
 */
import fs from "node:fs";
import path from "node:path";
import type { ContentAgentConfig } from "../../content-agent/src/config";
import type { LinearClient } from "../../content-agent/src/linear";
import { analyzeItem } from "../../improvements-agent/src/analyze";
import type { OpenBrain } from "../../improvements-agent/src/brain";
import { projectForPath, repoStatus } from "../../improvements-agent/src/code-map";
import { REPOS, type Item, type RepoKey } from "../../improvements-agent/src/inputs";
import { goalMarkdown } from "../../improvements-agent/src/linear-goals";
import { parseGoal, prepareApproved } from "../../improvements-agent/src/prepare";
import { implementPending } from "../../improvements-agent/src/implement-run";
import { PRIORITY_LABEL, type RawLinearIssue } from "./state";

const nowIso = () => new Date().toISOString();

const WORD = /[a-zæøå0-9]{4,}/gi;
function probeHints(text: string): string[] {
  const stop = new Set(["side", "page", "digilist", "kommune", "http", "https", "blogg", "med", "for", "som"]);
  return [...new Set((text.toLowerCase().match(WORD) ?? []).filter((w) => !stop.has(w)))].slice(0, 8);
}

/**
 * Which repo would this bare issue be built in? Product work goes to Digilist;
 * marketing-site / blog work goes to booking-brilliance. Default to Digilist
 * (the app is where most approved product work lands).
 */
export function routeIssueRepo(title: string, description: string): RepoKey {
  const t = `${title} ${description}`.toLowerCase();
  if (/booking-brilliance|markedsf|landingsside|blogg|nettside|marketing/.test(t)) return "marketing";
  return "digilist";
}

/** Build an analyzer Item from a bare Linear issue. */
export function itemFromIssue(issue: RawLinearIssue): Item {
  const description = issue.description ?? "";
  const target_repo = routeIssueRepo(issue.title, description);
  return {
    key: `idea:linear-${issue.id}`,
    kind: "idea",
    source_ref: issue.identifier,
    title: issue.title,
    category: "feature",
    severity: "idea",
    target_repo,
    detail: description || issue.title,
    url: issue.url,
    probe_hints: probeHints(`${issue.title} ${description}`),
  };
}

/**
 * Enhance a bare Todo issue in place: analyze it against the codebase graph to
 * produce a detailed description + a runnable /loop goal, then write both back
 * to Linear via issueUpdate. Returns true when the issue body was rewritten.
 *
 * A human-approved issue is always enhanced even if the analyzer judges it
 * "not-actionable": goalMarkdown falls back to the title, so the issue still
 * ends up with a valid /loop block prepareApproved can pick up. We never skip a
 * Todo issue for lacking a goal - we give it one.
 */
export async function enhanceIssue(
  client: LinearClient,
  cfg: ContentAgentConfig,
  issue: RawLinearIssue,
  brain: OpenBrain,
  dryRun: boolean,
): Promise<boolean> {
  const item = itemFromIssue(issue);
  const repo = REPOS[item.target_repo];
  const project = (await projectForPath(repo.path).catch(() => null))?.name ?? repo.project;
  const sha = (await repoStatus(repo.path, nowIso()).catch(() => null))?.sha ?? "unknown";

  const { verdict, call } = await analyzeItem(cfg, item, project);
  // Keep provenance in the brain so later stages can recall this analysis.
  brain.recordVerdict({
    item_key: item.key,
    actionable: verdict.actionable,
    confidence: verdict.confidence,
    status: verdict.status,
    type: verdict.type,
    severity: verdict.severity,
    priority: verdict.priority,
    code_evidence: verdict.code_evidence,
    fix: verdict.fix,
    goal_prompt: verdict.goal_prompt,
    analyzed_at: nowIso(),
    code_sha: sha,
    model: call.model,
  });

  const body = goalMarkdown(item, verdict, sha);
  if (dryRun) {
    console.log(`  [enhance] would rewrite ${issue.identifier} (${item.target_repo}) with a /loop goal`);
    return true;
  }
  await client.gql(
    `mutation($id: String!, $description: String!) {
      issueUpdate(id: $id, input: { description: $description }) { success } }`,
    { id: issue.id, description: body },
  );
  await client.addComment(
    issue.id,
    `🧭 **CTO** has enhanced the issue: added a detailed description and a self-contained \`/loop\` goal (in \`${repo.path}\`). The agent is preparing a branch and building it now. See the description for the full goal.`,
  );
  console.log(`  [enhance] ✓ ${issue.identifier} enriched with a /loop goal (${item.target_repo})`);
  return true;
}

export interface DriveResult {
  todoCount: number;
  enhanced: number;
  prepared: number;
  implemented: number;
}

/**
 * Drive the whole approved queue: enhance bare issues in priority order, then
 * reuse prepareApproved + implementPending to take every prepared issue to a PR.
 */
export async function driveTodo(opts: {
  client: LinearClient;
  cfg: ContentAgentConfig;
  projectId: string;
  teamId: string;
  approveState: string;
  brain: OpenBrain;
  dryRun: boolean;
  limit?: number;
}): Promise<DriveResult> {
  const { client, cfg, projectId, teamId, approveState, brain, dryRun } = opts;

  // Pull the approved issues WITH their bodies so we can detect + enhance the
  // bare ones. Sort by native priority (Urgent first), ties by createdAt.
  const { issues } = await client.gql<{ issues: { nodes: RawLinearIssue[] } }>(
    `query($id: ID!) { issues(filter: { project: { id: { eq: $id } } }, first: 250) {
      nodes { id identifier title url priority createdAt state { name } description } } }`,
    { id: projectId },
  );
  const rank = (p?: number | null) => (!p ? 5 : p);
  const todo = (issues.nodes ?? [])
    .filter((i) => (i.state?.name ?? "").toLowerCase() === approveState.toLowerCase())
    .sort((a, b) => {
      const d = rank(a.priority) - rank(b.priority);
      if (d !== 0) return d;
      return (a.createdAt ?? "").localeCompare(b.createdAt ?? "");
    });

  console.log(`[cto] Todo-driver: ${todo.length} approved issue(s) in "${approveState}"${dryRun ? " (dry run)" : ""}`);
  let enhanced = 0;
  for (const issue of todo) {
    const label = PRIORITY_LABEL[issue.priority ?? 0] ?? "None";
    const needsGoal = parseGoal(issue.description ?? "") === null;
    console.log(`  · ${issue.identifier} [${label}] "${issue.title.slice(0, 60)}"${needsGoal ? " - needs a goal, enhancing" : " - has a goal"}`);
    if (!needsGoal) continue;
    try {
      if (await enhanceIssue(client, cfg, issue, brain, dryRun)) enhanced++;
    } catch (e) {
      console.warn(`  [enhance] ${issue.identifier} failed: ${String(e).slice(0, 160)}`);
    }
  }
  brain.save(nowIso());

  // Reuse the improvements agent's prepare + implement verbatim. prepareApproved
  // creates a branch per approved issue (Todo -> In Progress); implementPending
  // runs the coding agent on the shared runner and opens a PR (-> In Review).
  const prepared = await prepareApproved(client, projectId, approveState, brain, dryRun, teamId);
  brain.save(nowIso());
  const implemented = dryRun ? 0 : await implementPending({ dryRun, limit: opts.limit });

  return { todoCount: todo.length, enhanced, prepared, implemented };
}

// Small guard used by run.ts to skip the driver when no worktree base exists.
export function digilistRepoAvailable(): boolean {
  const p = process.env.DIGILIST_REPO_PATH ?? "/root/Digilist";
  return fs.existsSync(path.join(p, ".git"));
}
