/**
 * The self-implementing stage — runs Claude autonomously in a prepared worktree
 * to build an approved goal. Unlike the content agents (pure text, tools off),
 * this is FULL agentic Claude Code: tools on, `--dangerously-skip-permissions`
 * so it can edit files, run tests, commit, push and open a PR without prompts.
 *
 * Safety rails (all present by construction): only prepared issues (which only
 * come from the human "Todo" gate) are eligible; work happens in an isolated
 * git worktree, never main or your checkout; the goal instructs tests-green →
 * PR (never a direct merge), so you still review every change.
 *
 * Runs on the Claude Max subscription (no API key), like the rest of the fleet.
 */
import { promisify } from "node:util";
import { execFile } from "node:child_process";
import { runClaudeAgent } from "../../content-agent/src/claude-agent";

const exec = promisify(execFile);

/**
 * Run the coding session in the worktree until it finishes. Delegates to the
 * shared fleet runner (streaming + idle watchdog + heartbeat + configurable
 * model). No fixed total timeout by default: the idle watchdog kills only on a
 * genuine stall, so a multi-hour migration runs to completion.
 */
export async function implementGoal(
  worktree: string,
  goal: string,
  opts: { model?: string; timeoutMin?: number; idleMin?: number } = {},
): Promise<{ ok: boolean; result: string }> {
  const prompt =
    `${goal}\n\nRules: work only in this worktree on the current branch (never main). ` +
    `Implement, run the build and tests until they're green, commit with a clear message, ` +
    `push the branch, and open a PR (never merge directly). Delete AGENT-GOAL.md before the PR.\n\n` +
    `IMPORTANT: If you get BLOCKED, are missing context, or need a CLARIFICATION, ` +
    `don't guess — end with a clear final message that starts with "BLOCKED:" or ` +
    `"CLARIFICATION:" and explains exactly what's stopping you and what answer you need. ` +
    `Commit what you've got so far first if you can.`;
  const r = await runClaudeAgent({
    prompt,
    model: opts.model ?? "claude-opus-4-8",
    cwd: worktree,
    maxTurns: 200, // migrations need many turns
    idleMin: opts.idleMin ?? 25,
    timeoutMin: opts.timeoutMin ?? 0, // no total cap — rely on the idle watchdog
    heartbeatMin: 3,
    label: "implement",
  });
  return { ok: r.ok, result: r.text };
}

/** Find an open PR for a branch (to record the result), best-effort via gh. */
export async function findPrForBranch(repoPath: string, branch: string): Promise<string | null> {
  try {
    const { stdout } = await exec(
      "gh",
      ["pr", "list", "--head", branch, "--state", "all", "--json", "url", "--limit", "1"],
      { cwd: repoPath, env: { ...process.env, GITHUB_TOKEN: process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN ?? "" }, timeout: 30_000 },
    );
    const arr = JSON.parse(stdout) as { url: string }[];
    return arr[0]?.url ?? null;
  } catch {
    return null;
  }
}
