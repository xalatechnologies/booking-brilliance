/**
 * improvements:implement — the autonomous coding stage. For each prepared issue
 * not yet implemented, runs Claude in its worktree (Max) to build the goal, then
 * records the PR and comments it on the Linear issue.
 *
 * OPT-IN: full autonomous code-writing. The human gate is upstream (only issues
 * you moved to "Todo" get prepared, and only prepared ones get here). Work is
 * isolated to a worktree and lands as a PR you review — never a merge.
 *
 * Flags: --dry-run (list, run nothing) · --limit N. Env: LINEAR_API_KEY (for the
 * PR comment; optional).
 */
import fs from "node:fs";
import path from "node:path";
import { LinearClient } from "../../content-agent/src/linear";
import { OpenBrain } from "./brain";
import { findPrForBranch, implementGoal } from "./implement";

const nowIso = () => new Date().toISOString();

/** Implement every prepared-but-unbuilt issue. Reused by the prepare chain. */
export async function implementPending(opts: { dryRun?: boolean; limit?: number } = {}): Promise<number> {
  const dryRun = opts.dryRun ?? false;
  const limit = opts.limit ?? Infinity;

  const brain = OpenBrain.load();
  const pending = brain.raw.prepared.filter((p) => !p.implemented_at).slice(0, limit);
  console.log(`[implement] ${pending.length} prepared issue(s) awaiting implementation${dryRun ? " (dry run)" : ""}`);
  if (pending.length === 0) return 0;

  const linearKey = process.env.LINEAR_API_KEY ?? "";
  const linear = linearKey ? new LinearClient(linearKey) : null;
  const teamId = linear ? (await linear.resolveTeam(process.env.LINEAR_TEAM_KEY ?? "XAL")).id : "";
  const S_PROGRESS = process.env.IMPROVEMENTS_INPROGRESS_STATE ?? "In Progress";
  const S_REVIEW = process.env.IMPROVEMENTS_REVIEW_STATE ?? "In Review";
  const S_BLOCKED = process.env.IMPROVEMENTS_BLOCKED_STATE ?? "Blocked";
  const move = async (id?: string, state?: string) => {
    if (linear && id && state) await linear.moveIssue(id, teamId, state).catch(() => false);
  };
  const comment = async (id?: string, body?: string) => {
    if (linear && id && body) await linear.addComment(id, body).catch(() => {});
  };

  for (const p of pending) {
    const goal = p.goal ?? readGoalFile(p.worktree_path, p.goal_file);
    if (!goal) {
      console.warn(`[implement] ${p.branch}: no goal — skip`);
      continue;
    }
    if (!fs.existsSync(p.worktree_path)) {
      console.warn(`[implement] ${p.branch}: worktree ${p.worktree_path} missing — skip`);
      continue;
    }
    if (dryRun) {
      console.log(`  ▸ would implement ${p.branch} in ${p.worktree_path}`);
      continue;
    }

    await move(p.linear_id, S_PROGRESS); // board reflects: agent is coding
    console.log(`  ⚙ implementing ${p.branch} (Claude Max, this can take a while)…`);
    const { ok, result } = await implementGoal(p.worktree_path, goal, { model: "claude-opus-4-8" });
    const pr = await findPrForBranch(p.worktree_path, p.branch);
    const blocked = /^(blokkert|avklaring)\b/i.test(result.trim());
    brain.recordPrepared({ ...p, implemented_at: nowIso(), pr_url: pr ?? undefined });
    brain.save(nowIso());

    if (pr && !blocked) {
      console.log(`  ✓ ${p.branch} → ${pr}`);
      await comment(p.linear_id, `🤖 Implementert av agenten på Claude Max. **PR:** ${pr}\n\nGjennomgå og merge når du er klar.`);
      if (linear && p.linear_id) await linear.removeLabel(p.linear_id, teamId, "blokkert").catch(() => {});
      await move(p.linear_id, S_REVIEW);
    } else if (blocked) {
      console.log(`  🚧 ${p.branch} BLOCKED — needs clarification`);
      await comment(p.linear_id, `🚧 **Agenten er blokkert / trenger avklaring** på branch \`${p.branch}\`:\n\n> ${result.slice(0, 800).replace(/\n/g, "\n> ")}\n\nSvar her, så plukker agenten den opp igjen.`);
      // The XAL board has no "Blocked" state, so flag it with a label too
      // (moveIssue is a graceful no-op if the state is ever added later).
      if (linear && p.linear_id) await linear.addLabel(p.linear_id, teamId, "blokkert").catch(() => {});
      await move(p.linear_id, S_BLOCKED);
    } else {
      console.log(`  ⚠ ${p.branch} — ran, no PR detected`);
      await comment(p.linear_id, `🤖 Agenten kjørte på branch \`${p.branch}\`${ok ? "" : " (stoppet underveis)"}, men ingen PR ble oppdaget. Kort logg:\n\n> ${result.slice(0, 500).replace(/\n/g, " ")}`);
    }
  }
  console.log(`[implement] done.`);
  return pending.length;
}

function readGoalFile(worktree: string, goalFile: string): string {
  try {
    const md = fs.readFileSync(path.join(worktree, goalFile), "utf-8");
    const m = md.match(/`\/loop ([\s\S]*?)`/) ?? md.match(/## Mål\n([\s\S]*?)\n\n/);
    return (m?.[1] ?? md).trim();
  } catch {
    return "";
  }
}

// CLI entry (skipped when imported by the prepare chain).
const isCli = import.meta.url === `file://${process.argv[1]}`;
if (isCli) {
  const args = process.argv.slice(2);
  const li = args.indexOf("--limit");
  implementPending({
    dryRun: args.includes("--dry-run"),
    limit: li >= 0 ? Number(args[li + 1]) || Infinity : Infinity,
  }).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
