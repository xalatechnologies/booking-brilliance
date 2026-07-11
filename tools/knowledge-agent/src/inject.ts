/**
 * Injection — the INJECT half of capture -> distill -> inject. Pulls the most
 * relevant learnings for an agent + context and renders a compact,
 * token-budgeted block to prepend to that agent's system prompt, so every agent
 * APPLIES the fleet's accumulated learnings automatically. This closes the loop:
 * a mistake becomes a learning becomes an injected rule becomes not-repeated.
 *
 * Budgeted on purpose: injection must stay small (a handful of high-signal
 * rules), never a data dump — a bloated preamble drowns the task.
 */
import { OpenBrain, type Learning } from "../../improvements-agent/src/brain";
import { recall, type LearningType } from "./knowledge";

export interface InjectOptions {
  context?: string; // free-text about the current task, for keyword ranking
  type?: LearningType;
  maxLearnings?: number; // hard cap on count (default 6)
  maxChars?: number; // token budget proxy (default 1200 chars ~= 300 tokens)
  now?: number; // epoch ms for recency ranking (defaults to Date.now())
  markApplied?: boolean; // bump hits/last_applied + persist (default false)
}

const TYPE_TAG: Record<LearningType, string> = {
  "repo-pattern": "pattern",
  "best-practice": "practice",
  mistake: "avoid",
  "user-feedback": "user",
  "content-signal": "content",
  "tech-trend": "trend",
};

/** One learning on one compact line: `- [avoid] statement (source)`. */
function line(l: Learning): string {
  const src = l.source_ref ? ` (${l.source_ref})` : "";
  return `- [${TYPE_TAG[l.type]}] ${l.statement}${src}`;
}

/**
 * The top learnings for `agent` under the char budget. Deterministic given a
 * fixed `now`. Returns the raw list plus the rendered block so callers can log
 * what was applied.
 */
export function relevantLearnings(
  agent: string,
  opts: InjectOptions = {},
): { learnings: Learning[]; block: string } {
  const now = opts.now ?? Date.now();
  const maxChars = opts.maxChars ?? 1200;
  const store = OpenBrain.load();

  const ranked = recall(store, {
    agent,
    query: opts.context,
    type: opts.type,
    limit: opts.maxLearnings ?? 6,
    now,
  });

  // Greedily fit lines under the char budget, best-ranked first.
  const chosen: Learning[] = [];
  let used = 0;
  for (const l of ranked) {
    const len = line(l).length + 1;
    if (chosen.length && used + len > maxChars) break;
    chosen.push(l);
    used += len;
  }

  if (opts.markApplied && chosen.length) {
    const nowIso = new Date(now).toISOString();
    for (const l of chosen) {
      const rec = store.knowledge.find((x) => x.id === l.id);
      if (rec) {
        rec.hits += 1;
        rec.last_applied = nowIso;
        store.upsertLearning(rec);
      }
    }
    try {
      store.save(nowIso);
    } catch {
      /* best-effort; injection must never break the caller */
    }
  }

  const block = chosen.length
    ? [
        "FLEET LEARNINGS (use these actively; they are distilled from our own mistakes, reviews, user feedback, repo patterns and industry practice):",
        ...chosen.map(line),
      ].join("\n")
    : "";
  return { learnings: chosen, block };
}

/**
 * Compose a system prompt with the relevant learnings prepended. The main entry
 * for wiring injection into an agent: pass the agent name + its base system
 * prompt and get one back with the learnings block on top (or the original,
 * unchanged, when there is nothing relevant). Never throws.
 */
export function injectLearnings(agent: string, systemPrompt: string, opts: InjectOptions = {}): string {
  try {
    const { block } = relevantLearnings(agent, opts);
    if (!block) return systemPrompt;
    return systemPrompt ? `${block}\n\n${systemPrompt}` : block;
  } catch {
    return systemPrompt;
  }
}
