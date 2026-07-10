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
import { spawn } from "node:child_process";
import { promisify } from "node:util";
import { execFile } from "node:child_process";

const exec = promisify(execFile);

/** Run the coding session in the worktree until it finishes (or times out). */
export function implementGoal(
  worktree: string,
  goal: string,
  opts: { model?: string; timeoutMin?: number } = {},
): Promise<{ ok: boolean; result: string }> {
  return new Promise((resolve) => {
    const env = { ...process.env };
    delete env.ANTHROPIC_API_KEY; // use the Max login, not the dead key
    delete env.ANTHROPIC_AUTH_TOKEN;
    const args = [
      "-p",
      "--output-format", "json",
      "--model", opts.model ?? "claude-opus-4-8",
      "--dangerously-skip-permissions",
    ];
    const child = spawn("claude", args, { cwd: worktree, env, stdio: ["pipe", "pipe", "pipe"] });
    let out = "";
    let err = "";
    const timer = setTimeout(() => child.kill("SIGKILL"), (opts.timeoutMin ?? 45) * 60_000);
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (err += d));
    child.on("error", (e) => {
      clearTimeout(timer);
      resolve({ ok: false, result: String(e) });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      let result = "";
      try {
        const j = JSON.parse(out) as { result?: string; is_error?: boolean };
        result = j.result ?? "";
        resolve({ ok: code === 0 && !j.is_error, result: result.slice(0, 2000) });
      } catch {
        resolve({ ok: code === 0, result: (out || err).slice(-1500) });
      }
    });
    // Reinforce the guardrails on top of the AGENT-GOAL.md goal.
    child.stdin.write(
      `${goal}\n\nRegler: jobb kun i denne worktreen på gjeldende branch (aldri main). ` +
        `Implementer, kjør bygg og tester til de er grønne, commit med en klar melding, ` +
        `push branchen, og åpne en PR (aldri merge direkte). Slett AGENT-GOAL.md før PR.\n\n` +
        `VIKTIG: Hvis du blir BLOKKERT, mangler kontekst, eller trenger en AVKLARING, ` +
        `ikke gjett — avslutt med en tydelig siste melding som starter med "BLOKKERT:" eller ` +
        `"AVKLARING:" og forklarer nøyaktig hva som stopper deg og hvilket svar du trenger. ` +
        `Commit gjerne det du har kommet frem til først.`,
    );
    child.stdin.end();
  });
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
