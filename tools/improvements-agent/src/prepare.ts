/**
 * Prepare stage — when you approve a goal in Linear (move it to the approval
 * state), set up an isolated implementation branch so you can run Claude to
 * build it. We do NOT auto-code: we create a git worktree on a fresh branch,
 * drop the goal as a committed task file, and comment the ready `/loop` command
 * back on the issue. You open the worktree and run Claude, which implements →
 * tests → commits → pushes → opens a PR (never main).
 */
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import type { LinearClient, LinearIssue } from "../../content-agent/src/linear";
import { OpenBrain } from "./brain";

const exec = promisify(execFile);
const nowIso = () => new Date().toISOString();

export interface ParsedGoal {
  repoPath: string;
  goal: string;
}

/** Extract the target repo path + the /loop goal from a filed issue body. */
export function parseGoal(body: string): ParsedGoal | null {
  const repo = body.match(/Kjør som Claude-loop \(i `([^`]+)`/);
  const goal = body.match(/```[^\n]*\n\/loop ([\s\S]*?)\n```/);
  if (!repo || !goal) return null;
  return { repoPath: repo[1].trim(), goal: goal[1].trim() };
}

function slugify(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[æ]/g, "ae").replace(/[ø]/g, "o").replace(/[å]/g, "a")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
}

async function git(repo: string, args: string[]): Promise<string> {
  return (await exec("git", ["-C", repo, ...args], { timeout: 60_000, maxBuffer: 32 * 1024 * 1024 })).stdout.trim();
}

export interface PrepareResult {
  branch: string;
  worktree: string;
  pushed: boolean;
}

/**
 * The repo path is baked into the issue body at filing time (from the filing
 * machine), but prepare may run elsewhere (e.g. the VPS). Resolve it to where
 * the repo actually is on THIS machine: honour it if it exists, else map by
 * name to DIGILIST_REPO_PATH / the local booking-brilliance checkout.
 */
export function resolveRepoPath(p: string): string {
  if (fs.existsSync(path.join(p, ".git"))) return p;
  const lower = p.toLowerCase();
  if (lower.includes("digilist") && !lower.includes("booking-brilliance")) {
    return process.env.DIGILIST_REPO_PATH ?? "/root/Digilist";
  }
  if (lower.includes("booking-brilliance")) {
    return path.resolve(fileURLToPath(import.meta.url), "..", "..", "..", "..");
  }
  return p;
}

/** Create an isolated worktree + branch with the goal as a task file. */
export async function prepareBranch(issue: LinearIssue, parsed: ParsedGoal): Promise<PrepareResult> {
  const repoPath = resolveRepoPath(parsed.repoPath);
  const { goal } = parsed;
  const branch = `agent/${slugify(issue.identifier)}-${slugify(issue.title)}`;
  const worktree = path.resolve(repoPath, "..", `${path.basename(repoPath)}--${slugify(issue.identifier)}`);
  const base = await git(repoPath, ["symbolic-ref", "refs/remotes/origin/HEAD"])
    .then((r) => r.replace("refs/remotes/origin/", ""))
    .catch(() => "main");

  await git(repoPath, ["fetch", "origin", "--quiet"]).catch(() => "");
  // Idempotent: remove a stale worktree/branch from a prior prepare of this issue.
  if (fs.existsSync(worktree)) await git(repoPath, ["worktree", "remove", "--force", worktree]).catch(() => "");
  await git(repoPath, ["branch", "-D", branch]).catch(() => "");
  await git(repoPath, ["worktree", "add", "-b", branch, worktree, `origin/${base}`]);

  const goalFile = path.join(worktree, "AGENT-GOAL.md");
  fs.writeFileSync(
    goalFile,
    [
      `# ${issue.identifier}: ${issue.title}`,
      ``,
      `> Auto-forberedt av Digilist Improvements Agent. Kjør Claude i denne worktreen:`,
      `> \`/loop ${goal}\``,
      ``,
      `## Mål`,
      goal,
      ``,
      `## Regler`,
      `- Jobb kun på denne branchen (\`${branch}\`), aldri main.`,
      `- Kjør bygg + tester. Åpne PR bare når de er grønne (ellers draft-PR med notat).`,
      `- Slett denne filen før du åpner PR.`,
      ``,
      `Linear: ${issue.url}`,
      ``,
    ].join("\n"),
    "utf-8",
  );
  await git(worktree, ["add", "AGENT-GOAL.md"]);
  await git(worktree, ["-c", "user.name=digilist-improvements-agent", "-c", "user.email=bot@digilist.no",
    "commit", "-m", `chore(agent): prepare ${issue.identifier} — ${issue.title.slice(0, 60)}`]);

  // Push so it's a remote branch you can pull + work on from anywhere.
  let pushed = false;
  try {
    await git(worktree, ["push", "-u", "origin", branch]);
    pushed = true;
  } catch (e) {
    console.warn(`[prepare] ${issue.identifier}: push failed (branch is local only) — ${String(e).slice(0, 120)}`);
  }
  return { branch, worktree, pushed };
}

/** Prepare every approval-state issue not already prepared, and comment back. */
export async function prepareApproved(
  client: LinearClient,
  projectId: string,
  approveState: string,
  brain: OpenBrain,
  dryRun: boolean,
  teamId?: string,
): Promise<number> {
  const issues = await client.issuesInState(projectId, approveState);
  const inProgressState = process.env.IMPROVEMENTS_INPROGRESS_STATE ?? "In Progress";
  let prepared = 0;
  for (const issue of issues) {
    const key = `linear:${issue.id}`;
    if (brain.preparedFor(key)) continue;
    const full = await client.gql<{ issue: { description: string } }>(
      `query($id:String!){ issue(id:$id){ description } }`, { id: issue.id },
    );
    const parsed = parseGoal(full.issue?.description ?? "");
    if (!parsed) { console.warn(`[prepare] ${issue.identifier}: no /loop goal in body — skip`); continue; }
    if (dryRun) { console.log(`[prepare] would prepare ${issue.identifier} in ${parsed.repoPath}`); prepared++; continue; }

    const { branch, worktree, pushed } = await prepareBranch(issue, parsed);
    const howto = pushed
      ? `Hent den lokalt:\n\`\`\`\ngit fetch origin && git checkout ${branch}\n\`\`\``
      : `Åpne worktreen \`${worktree}\` (branchen er kun lokal på agent-maskinen).`;
    await client.addComment(
      issue.id,
      `🌿 Branch **\`${branch}\`** klargjort${pushed ? " og pushet" : ""}.\n\n${howto}\n\nKjør så:\n\`\`\`\n/loop ${parsed.goal.split("\n")[0]}…\n\`\`\`\nSe \`AGENT-GOAL.md\` for hele målet. Claude implementerer → tester → commit → push → PR (aldri main).`,
    );
    // Reflect on the board that the agent has picked it up.
    if (teamId) await client.moveIssue(issue.id, teamId, inProgressState).catch(() => false);
    brain.recordPrepared({ item_key: key, repo: resolveRepoPath(parsed.repoPath), branch, worktree_path: worktree, goal_file: "AGENT-GOAL.md", goal: parsed.goal, linear_id: issue.id, prepared_at: nowIso() });
    console.log(`[prepare] ✓ ${issue.identifier} → ${branch}`);
    prepared++;
  }
  return prepared;
}
