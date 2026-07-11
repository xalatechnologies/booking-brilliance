/**
 * PR-review agent — the reviewer core. Pulls a PR's metadata + diff via
 * `gh --repo <slug>` and asks Claude (best model, capable mode on the Max
 * subscription) to review it like an experienced senior engineer would: short,
 * opinionated, leading with what actually matters — not an exhaustive checklist.
 *
 * Returns { event, body }: the reviewer's own verdict (approve / request-changes
 * / comment) and the human-voice review text. The agent never merges.
 */
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { runCapableAgent } from "../../content-agent/src/claude-agent";
import type { ContentAgentConfig } from "../../content-agent/src/config";
import { anthropic } from "../../content-agent/src/generate";
import { extractJson, parallel } from "../../content-agent/src/orchestrate";

const exec = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export type ReviewEvent = "approve" | "request-changes" | "comment";

/** Local checkout for a repo slug, if present — lets the reviewer use the
 *  repository map (codebase-memory) + Read to ground the review in real code. */
export function localCheckout(repo: string): string | undefined {
  const name = (repo.split("/")[1] ?? repo).toLowerCase();
  const candidates =
    name === "digilist"
      ? [process.env.DIGILIST_REPO_PATH ?? "/root/Digilist"]
      : name === "booking-brilliance"
        ? [path.resolve(__dirname, "..", "..", ".."), "/root/booking-brilliance"]
        : [];
  return candidates.find((p) => p && fs.existsSync(path.join(p, ".git")));
}

/** gh needs a valid token; a broken GITHUB_TOKEN in env shadows the keyring. */
function ghEnv(): NodeJS.ProcessEnv {
  return { ...process.env, GITHUB_TOKEN: process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN ?? "" };
}

export interface PullRequest {
  number: number;
  title: string;
  body: string;
  headRefName: string;
  headRefOid: string;
  baseRefName: string;
  author: string;
  isDraft: boolean;
  additions: number;
  deletions: number;
  changedFiles: number;
  url: string;
  files: string[];
}

export interface ReviewResult {
  pr: PullRequest;
  event: ReviewEvent;
  body: string; // human-voice markdown review (no marker / template)
  model: string;
}

const MAX_DIFF = 60_000;

// The voice. A 30+-year veteran staff engineer's PR comment — not a checklist.
const SYSTEM = `You are a staff engineer with 30+ years of experience looking over a colleague's PR in Digilist (municipal booking SaaS: React marketing site + Convex app). You've seen thousands of PRs, you know what actually breaks in production, and you have neither the time nor the need to show off. Write like a human to a human.

How a veteran reviewer works:
- Instinct for what matters: you go straight at the real risk — a bug, an RBAC hole, a regression, a design choice that'll hurt later — and leave the rest alone. Usually 1-3 points.
- You don't guess: you open the code (repository map: search_graph/get_code_snippet, Read) and check callers, types, RBAC and tests. Point to file:line for what counts.
- You briefly explain WHY it bites and what you'd do instead — like a mentor, not a linter. Share a short "I've seen this go wrong before" insight when it's relevant.
- You don't care about nitpicks (style, naming, micro-optimization) unless they actually cause problems.

Voice:
- Short, calm, direct. Natural English prose, like an experienced colleague on Slack.
- NO templates: no "Risk/Findings/Strengths/Tests" sections, no emoji headings, no scores.
- NO AI filler: no "This PR...", "Overall", "It's worth noting", "Here's...". Don't list everything that's good — if it's solid, say so in one line and move on.
- 3-8 sentences. At most 2-3 short bullets, and only when they make concrete findings clearer.

Conclude like a reviewer:
- approve: fine to merge (small things can be mentioned without blocking).
- request-changes: something MUST be fixed first (real bug/regression/security hole).
- comment: worth a look, but not a hard blocker.

End your reply with JSON on the last line (no code block):
{"verdict":"approve|request-changes|comment","review":"<the review in short markdown, human voice>"}`;

/** Fetch a PR's metadata + file list via gh (by repo slug, no checkout). */
export async function fetchPr(repo: string, number: number): Promise<PullRequest> {
  const { stdout } = await exec(
    "gh",
    ["pr", "view", String(number), "--repo", repo, "--json",
      "number,title,body,headRefName,headRefOid,baseRefName,author,isDraft,additions,deletions,changedFiles,url,files"],
    { env: ghEnv(), timeout: 30_000, maxBuffer: 16 * 1024 * 1024 },
  );
  const j = JSON.parse(stdout) as Record<string, unknown>;
  return {
    number: j.number as number,
    title: (j.title as string) ?? "",
    body: (j.body as string) ?? "",
    headRefName: (j.headRefName as string) ?? "",
    headRefOid: (j.headRefOid as string) ?? "",
    baseRefName: (j.baseRefName as string) ?? "",
    author: (j.author as { login?: string })?.login ?? "",
    isDraft: Boolean(j.isDraft),
    additions: (j.additions as number) ?? 0,
    deletions: (j.deletions as number) ?? 0,
    changedFiles: (j.changedFiles as number) ?? 0,
    url: (j.url as string) ?? "",
    files: Array.isArray(j.files) ? (j.files as { path: string }[]).map((f) => f.path) : [],
  };
}

/** Fetch the unified diff for a PR (capped). */
export async function fetchDiff(repo: string, number: number): Promise<string> {
  const { stdout } = await exec("gh", ["pr", "diff", String(number), "--repo", repo], {
    env: ghEnv(), timeout: 40_000, maxBuffer: 64 * 1024 * 1024,
  });
  return stdout;
}

interface RawReview {
  verdict?: string;
  review?: string;
}

function coerce(raw: RawReview | null): { event: ReviewEvent; body: string } | null {
  const body = (raw?.review ?? "").trim();
  if (!body) return null;
  const v = String(raw?.verdict ?? "").toLowerCase();
  const event: ReviewEvent = v.includes("request") || v.includes("change") ? "request-changes" : v.includes("approve") ? "approve" : "comment";
  return { event, body };
}

function prContext(pr: PullRequest, diff: string): string {
  const capped = diff.length > MAX_DIFF ? `${diff.slice(0, MAX_DIFF)}\n\n[diff truncated at ${MAX_DIFF} chars]` : diff;
  return `PR #${pr.number}: ${pr.title}
${pr.headRefName} → ${pr.baseRefName} · +${pr.additions}/-${pr.deletions} in ${pr.changedFiles} files

DESCRIPTION:
${(pr.body || "(none)").slice(0, 2000)}

DIFF:
\`\`\`diff
${capped}
\`\`\``;
}

/** Review one PR as a single senior reviewer (capable mode when on claude-cli). */
export async function reviewPr(cfg: ContentAgentConfig, repo: string, number: number): Promise<ReviewResult> {
  const pr = await fetchPr(repo, number);
  const diff = await fetchDiff(repo, number);
  const checkout = localCheckout(repo);
  const prompt = `${prContext(pr, diff)}\n\nReview this like an experienced colleague. End your reply with JSON: {"verdict":"...","review":"..."}`;

  let text: string;
  let model: string;
  if (cfg.llmProvider === "claude-cli") {
    const r = await runCapableAgent({ prompt, systemPrompt: SYSTEM, model: cfg.anthropicReviewModel, cwd: checkout, maxTurns: 40, timeoutMin: 12 });
    text = r.text;
    model = r.model;
  } else {
    const call = await anthropic(cfg, { model: cfg.anthropicReviewModel, systemPrompt: SYSTEM, userMessage: prompt, maxTokens: 2048 });
    text = call.text;
    model = call.model;
  }
  const out = coerce(extractJson<RawReview>(text));
  if (!out) throw new Error(`no review parsed. Tail: ${text.slice(-300).replace(/\n/g, " ")}`);
  return { pr, event: out.event, body: out.body, model };
}

// ── Multi-lens: deep parallel analysis, one concise human synthesis ─────────

const LENSES: { key: string; focus: string }[] = [
  { key: "correctness", focus: "real bugs and regressions: does the change do what it claims? Check callers (trace_path/search_graph), boundary values, routing (redirect loops, wrong target route)." },
  { key: "security", focus: "security/RBAC: tenant scoping and cross-tenant leaks, auth (ID-porten/BankID/Entra), secrets/PII." },
  { key: "design", focus: "design choices worth challenging and missing test coverage on the risky paths (including whether the tests actually run in CI)." },
];

/**
 * Multi-agent review: lenses dig deep in parallel (each grounds in the repo
 * map) and report ONLY the real problems they find, then one synthesizer writes
 * a single short, human review picking what actually matters. Depth without the
 * exhaustive-checklist bloat.
 */
export async function reviewPrMultiLens(cfg: ContentAgentConfig, repo: string, number: number): Promise<ReviewResult> {
  const pr = await fetchPr(repo, number);
  const diff = await fetchDiff(repo, number);
  const checkout = localCheckout(repo);
  const context = prContext(pr, diff);

  const notes = await parallel(
    LENSES.map((lens) => async (): Promise<string> => {
      const r = await runCapableAgent({
        prompt: `${context}\n\nYou look ONLY at: ${lens.focus}\nGround yourself in the code (repo map + Read). List the REAL problems you find, briefly and with file:line. Write "none" if everything's fine on your dimension. Don't nitpick.`,
        systemPrompt: `You are a senior Digilist reviewer responsible for ${lens.key}. Be precise and code-grounded. Real problems only.`,
        model: cfg.anthropicReviewModel,
        cwd: checkout,
        maxTurns: 30,
        timeoutMin: 10,
      });
      return `[${lens.key}] ${r.text.trim()}`;
    }),
  );
  const lensNotes = notes.filter((n): n is string => Boolean(n)).join("\n\n");

  // Synthesize one concise human review from the lens notes.
  const synthPrompt = `${context}\n\nSpecialist reviewers reported this (raw notes, may contain noise and "none"):\n${lensNotes}\n\nWrite ONE short, human review like an experienced colleague. Pick ONLY what actually matters (ignore "none" and nitpicks). Conclude. End your reply with JSON: {"verdict":"...","review":"..."}`;
  const r = await runCapableAgent({ prompt: synthPrompt, systemPrompt: SYSTEM, model: cfg.anthropicReviewModel, cwd: checkout, maxTurns: 8, timeoutMin: 6 });
  const out = coerce(extractJson<RawReview>(r.text));
  if (!out) throw new Error(`multi-lens synthesis produced no review. Tail: ${r.text.slice(-300).replace(/\n/g, " ")}`);
  return { pr, event: out.event, body: out.body, model: `${cfg.anthropicReviewModel} (max-cli · ${LENSES.length}-lens)` };
}
