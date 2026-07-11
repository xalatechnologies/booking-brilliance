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
import { parallel } from "../../content-agent/src/orchestrate";
import { OpenBrain, type Prepared } from "./brain";
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

  const numEnv = (k: string, d: number) => {
    const v = process.env[k];
    return v !== undefined && v !== "" ? Number(v) : d;
  };
  // Model-per-task: coding defaults to Sonnet 5 (cost-efficient); override to Opus
  // for complex builds via env. Idle-watchdog kills only genuine stalls; no total
  // cap by default. CONCURRENCY runs N builds at once — keep it modest (one Max
  // login + shared VPS: 2-3 is a sane ceiling; each build can spike ~4 GB).
  const model = process.env.IMPROVEMENTS_IMPLEMENT_MODEL || "claude-sonnet-5";
  const timeoutMin = numEnv("IMPROVEMENTS_IMPLEMENT_TIMEOUT_MIN", 0);
  const idleMin = numEnv("IMPROVEMENTS_IMPLEMENT_IDLE_MIN", 25);
  const concurrency = Math.max(1, numEnv("IMPROVEMENTS_IMPLEMENT_CONCURRENCY", 1));
  console.log(`  (model: ${model} · cap: ${timeoutMin > 0 ? timeoutMin + "m" : "none"} · idle: ${idleMin}m · concurrency: ${concurrency})`);

  // Serialize Open Brain writes — concurrent builds share one brain.json and
  // would otherwise race and lose each other's records. Chain writes on a lock.
  let brainLock: Promise<void> = Promise.resolve();
  const saveBrain = (p: Prepared, pr?: string): Promise<void> => {
    brainLock = brainLock.then(() => {
      brain.recordPrepared({ ...p, implemented_at: nowIso(), pr_url: pr });
      brain.save(nowIso());
    });
    return brainLock;
  };

  const runOne = async (p: Prepared): Promise<void> => {
    const goal = p.goal ?? readGoalFile(p.worktree_path, p.goal_file);
    if (!goal) { console.warn(`[implement] ${p.branch}: no goal — skip`); return; }
    if (!fs.existsSync(p.worktree_path)) { console.warn(`[implement] ${p.branch}: worktree ${p.worktree_path} missing — skip`); return; }
    if (dryRun) { console.log(`  ▸ would implement ${p.branch} in ${p.worktree_path}`); return; }

    await move(p.linear_id, S_PROGRESS); // board reflects: agent is coding
    console.log(`  ⚙ implementing ${p.branch} (Claude Max, this can take a while)…`);
    const { ok, result } = await implementGoal(p.worktree_path, goal, { model, timeoutMin, idleMin });
    const pr = await findPrForBranch(p.worktree_path, p.branch);
    // Match the English guardrail keywords; keep the Norwegian ones too so a
    // worktree prepared before the switch still signals "blocked" correctly.
    const blocked = /^(blocked|clarification|blokkert|avklaring)\b/i.test(result.trim());
    await saveBrain(p, pr ?? undefined);

    if (pr && !blocked) {
      console.log(`  ✓ ${p.branch} → ${pr}`);
      await comment(p.linear_id, `🤖 Implemented by the agent on Claude Max. **PR:** ${pr}\n\nReview and merge when you're ready.`);
      if (linear && p.linear_id) await linear.removeLabel(p.linear_id, teamId, "blocked").catch(() => {});
      await move(p.linear_id, S_REVIEW);
    } else if (blocked) {
      console.log(`  🚧 ${p.branch} BLOCKED — needs clarification`);
      await comment(p.linear_id, `🚧 **The agent is blocked / needs clarification** on branch \`${p.branch}\`:\n\n> ${result.slice(0, 800).replace(/\n/g, "\n> ")}\n\nReply here and the agent will pick it up again.`);
      // The XAL board has no "Blocked" state, so flag it with a label too
      // (moveIssue is a graceful no-op if the state is ever added later).
      if (linear && p.linear_id) await linear.addLabel(p.linear_id, teamId, "blocked").catch(() => {});
      await move(p.linear_id, S_BLOCKED);
    } else {
      console.log(`  ⚠ ${p.branch} — ran, no PR detected`);
      await comment(p.linear_id, `🤖 The agent ran on branch \`${p.branch}\`${ok ? "" : " (stopped partway)"}, but no PR was detected. Short log:\n\n> ${result.slice(0, 500).replace(/\n/g, " ")}`);
    }
  };

  // Run the queue with bounded concurrency; a thrown task never sinks the batch.
  await parallel(
    pending.map((p) => () => runOne(p).catch((e) => console.error(`  ✗ ${p.branch}: ${String(e).slice(0, 200)}`))),
    concurrency,
  );
  await brainLock; // flush any pending brain write
  console.log(`[implement] done.`);
  return pending.length;
}

function readGoalFile(worktree: string, goalFile: string): string {
  try {
    const md = fs.readFileSync(path.join(worktree, goalFile), "utf-8");
    const m = md.match(/`\/loop ([\s\S]*?)`/) ?? md.match(/## (?:Goal|Mål)\n([\s\S]*?)\n\n/);
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
