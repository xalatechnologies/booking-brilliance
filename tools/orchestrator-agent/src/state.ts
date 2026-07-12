/**
 * FleetState gathering - the CTO agent's read of the whole fleet on each
 * heartbeat. Pulls Linear issues (all states, with native priority + labels),
 * the Open Brain, and open PRs across the Digilist repos via `gh`, then
 * normalizes them into one plain object the reasoning stage can summarize.
 *
 * The normalization helpers (normalizeIssue, sortIssuesByPriority, normalizePr,
 * classifyChecks) are pure so they can be unit-tested without any live network.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { LinearClient } from "../../content-agent/src/linear";
import { OpenBrain } from "../../improvements-agent/src/brain";
import { parseGoal } from "../../improvements-agent/src/prepare";

const exec = promisify(execFile);

/** Linear native priority (0 none, 1 urgent, 2 high, 3 normal, 4 low) to label. */
export const PRIORITY_LABEL: Record<number, string> = {
  0: "None",
  1: "Urgent",
  2: "High",
  3: "Normal",
  4: "Low",
};

export interface FleetIssue {
  id: string;
  identifier: string;
  title: string;
  url: string;
  stateName: string;
  stateType: string;
  priority: number; // Linear native 0..4
  priorityLabel: string;
  labels: string[];
  createdAt: string;
  hasGoal: boolean; // a runnable /loop goal is present in the body
  descriptionLength: number;
}

export interface FleetPr {
  repo: string;
  number: number;
  title: string;
  url: string;
  headRefName: string;
  isDraft: boolean;
  reviewDecision: string; // APPROVED | CHANGES_REQUESTED | REVIEW_REQUIRED | ""
  createdAt: string;
  checks: { passed: number; failed: number; pending: number };
}

export interface FleetBrain {
  items: number;
  verdicts: number;
  prepared: number;
  learnings: string[];
  openPrepared: { branch: string; pr_url?: string; linear_id?: string; implemented: boolean }[];
}

export interface FleetState {
  generatedAt: string;
  todo: FleetIssue[]; // sorted by priority (highest first)
  issues: FleetIssue[]; // every issue in the project
  prs: FleetPr[];
  brain: FleetBrain;
}

// The raw shapes we read from Linear / gh before normalizing.
export interface RawLinearIssue {
  id: string;
  identifier: string;
  title: string;
  url: string;
  priority?: number | null;
  createdAt?: string | null;
  state?: { name?: string; type?: string } | null;
  labels?: { nodes?: { name: string }[] } | null;
  description?: string | null;
}

export interface RawCheck {
  status?: string; // QUEUED | IN_PROGRESS | COMPLETED | ...
  conclusion?: string; // SUCCESS | FAILURE | NEUTRAL | SKIPPED | ...
}

export interface RawPr {
  number: number;
  title: string;
  url: string;
  headRefName: string;
  isDraft?: boolean;
  reviewDecision?: string | null;
  createdAt?: string;
  statusCheckRollup?: RawCheck[] | null;
}

// ── pure normalizers (unit-tested) ──────────────────────────────────────────

/** Map one raw Linear issue to a normalized FleetIssue. */
export function normalizeIssue(raw: RawLinearIssue): FleetIssue {
  const priority = typeof raw.priority === "number" ? raw.priority : 0;
  const description = raw.description ?? "";
  return {
    id: raw.id,
    identifier: raw.identifier,
    title: raw.title,
    url: raw.url,
    stateName: raw.state?.name ?? "",
    stateType: raw.state?.type ?? "",
    priority,
    priorityLabel: PRIORITY_LABEL[priority] ?? "None",
    labels: (raw.labels?.nodes ?? []).map((l) => l.name),
    createdAt: raw.createdAt ?? "",
    hasGoal: parseGoal(description) !== null,
    descriptionLength: description.trim().length,
  };
}

/**
 * Sort by Linear priority the way a human triages: Urgent (1) first, then High
 * (2), Normal (3), Low (4). "No priority" (0) sinks to the bottom. Ties break by
 * createdAt ascending, so the oldest approved work goes first.
 */
export function sortIssuesByPriority(issues: FleetIssue[]): FleetIssue[] {
  const rank = (p: number) => (p === 0 ? 5 : p);
  return [...issues].sort((a, b) => {
    const d = rank(a.priority) - rank(b.priority);
    if (d !== 0) return d;
    return (a.createdAt || "").localeCompare(b.createdAt || "");
  });
}

/** Bucket a gh statusCheckRollup into passed / failed / pending counts. */
export function classifyChecks(rollup: RawCheck[] | null | undefined): {
  passed: number;
  failed: number;
  pending: number;
} {
  const out = { passed: 0, failed: 0, pending: 0 };
  for (const c of rollup ?? []) {
    const status = (c.status ?? "").toUpperCase();
    const concl = (c.conclusion ?? "").toUpperCase();
    if (status && status !== "COMPLETED") {
      out.pending++;
    } else if (["SUCCESS", "NEUTRAL", "SKIPPED"].includes(concl)) {
      out.passed++;
    } else if (concl) {
      out.failed++;
    } else {
      out.pending++;
    }
  }
  return out;
}

/** Map one raw gh PR to a normalized FleetPr. */
export function normalizePr(repo: string, raw: RawPr): FleetPr {
  return {
    repo,
    number: raw.number,
    title: raw.title,
    url: raw.url,
    headRefName: raw.headRefName,
    isDraft: Boolean(raw.isDraft),
    reviewDecision: raw.reviewDecision ?? "",
    createdAt: raw.createdAt ?? "",
    checks: classifyChecks(raw.statusCheckRollup),
  };
}

// ── gatherers (live) ────────────────────────────────────────────────────────

/** Fetch every issue in a project with the fields the CTO needs to reason. */
export async function fetchProjectIssues(client: LinearClient, projectId: string): Promise<FleetIssue[]> {
  const { issues } = await client.gql<{ issues: { nodes: RawLinearIssue[] } }>(
    `query($id: ID!) { issues(filter: { project: { id: { eq: $id } } }, first: 250) {
      nodes { id identifier title url priority createdAt
        state { name type } labels { nodes { name } } description } } }`,
    { id: projectId },
  );
  return (issues.nodes ?? []).map(normalizeIssue);
}

/** Open PRs across the given repos via the locally-authenticated gh CLI. */
export async function fetchOpenPrs(repos: string[], nowIso: string): Promise<FleetPr[]> {
  void nowIso;
  const out: FleetPr[] = [];
  for (const repo of repos) {
    try {
      const { stdout } = await exec(
        "gh",
        [
          "pr", "list", "--repo", repo, "--state", "open", "--limit", "50",
          "--json", "number,title,url,headRefName,isDraft,reviewDecision,statusCheckRollup,createdAt",
        ],
        { env: { ...process.env, GITHUB_TOKEN: "" }, maxBuffer: 16 * 1024 * 1024 },
      );
      const raws = JSON.parse(stdout) as RawPr[];
      out.push(...raws.map((r) => normalizePr(repo, r)));
    } catch (e) {
      console.warn(`[cto] gh pr list ${repo} failed: ${String(e).slice(0, 120)}`);
    }
  }
  return out;
}

/** Summarize the Open Brain for the reasoning stage. */
export function summarizeBrain(brain: OpenBrain): FleetBrain {
  const raw = brain.raw;
  return {
    items: raw.items.length,
    verdicts: raw.verdicts.length,
    prepared: raw.prepared.length,
    learnings: raw.learnings.slice(0, 12),
    openPrepared: raw.prepared.slice(0, 20).map((p) => ({
      branch: p.branch,
      pr_url: p.pr_url,
      linear_id: p.linear_id,
      implemented: Boolean(p.implemented_at),
    })),
  };
}

/** The default Digilist repos the CTO scans for open PRs. Overridable via env. */
export function ctoRepos(): string[] {
  const raw = process.env.CTO_REPOS;
  if (raw) return raw.split(",").map((s) => s.trim()).filter(Boolean);
  return ["xalatechnologies/booking-brilliance", "xalatechnologies/Digilist"];
}

/** Read the whole fleet state in one pass. Todo issues come out priority-sorted. */
export async function gatherFleetState(
  client: LinearClient,
  projectId: string,
  brain: OpenBrain,
  nowIso: string,
): Promise<FleetState> {
  const [issues, prs] = await Promise.all([
    fetchProjectIssues(client, projectId).catch((e) => {
      console.warn(`[cto] fetch issues failed: ${String(e).slice(0, 120)}`);
      return [] as FleetIssue[];
    }),
    fetchOpenPrs(ctoRepos(), nowIso).catch(() => [] as FleetPr[]),
  ]);
  const todoState = (process.env.IMPROVEMENTS_APPROVE_STATE ?? "Todo").toLowerCase();
  const todo = sortIssuesByPriority(issues.filter((i) => i.stateName.toLowerCase() === todoState));
  return { generatedAt: nowIso, todo, issues, prs, brain: summarizeBrain(brain) };
}
