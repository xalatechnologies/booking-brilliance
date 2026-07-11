/**
 * Distillation — the DISTILL half of capture -> distill -> inject. A capable
 * Opus agent reviews the raw signals, mines repo patterns via codebase-memory,
 * and pulls current industry best practice + latest stack docs/trends via web
 * search, then emits concrete, provenance-tracked, deduped learnings across the
 * six sources. When a tech trend implies an upgrade (e.g. a new TS/React major)
 * it flags an advisory improvement so the fleet proposes its own evolution.
 *
 * This module holds the DETERMINISTIC, testable pieces: the prompt contract, the
 * parser, and apply/demote logic. The agent call + Linear filing live in the CLI
 * (learning-run.ts) so the units here need no network.
 */
import { type Learning, type LearningType, type Signal } from "../../improvements-agent/src/brain";
import { normStatement, upsertLearning, type KnowledgeStore } from "./knowledge";

const LEARNING_TYPES: LearningType[] = [
  "repo-pattern",
  "best-practice",
  "mistake",
  "user-feedback",
  "content-signal",
  "tech-trend",
];

/** One learning as the distiller must emit it. */
export interface DistilledLearning {
  type: LearningType;
  statement: string;
  why: string;
  applies_to: string[];
  source_ref: string;
  confidence: number;
  /** For tech-trend: when set, an advisory upgrade issue should be filed. */
  upgrade?: {
    title: string;
    goal: string; // the /loop goal body
    rationale: string;
  };
}

export interface DistillOutput {
  learnings: DistilledLearning[];
  /** Statements to demote (no longer apply). Matched by normalized statement. */
  demote?: string[];
}

/** The stacks the distiller must keep current — drives the web-search prompt. */
export const STACK_WATCH = [
  "TypeScript",
  "Convex",
  "React",
  "Vite",
  "Node.js",
  "WCAG / a11y",
  "web security (OWASP)",
];

export function buildDistillPrompt(input: {
  signals: Signal[];
  existing: Learning[];
  allowWeb: boolean;
  repoPath: string;
}): string {
  const signalsText = input.signals.length
    ? input.signals
        .map((s, i) => `${i + 1}. [${s.kind} · ${s.agent}] ${s.text} (source: ${s.source_ref})`)
        .join("\n")
    : "(no new raw signals this run)";
  const existingText = input.existing.length
    ? input.existing
        .slice(0, 60)
        .map((l) => `- [${l.type}] ${l.statement}`)
        .join("\n")
    : "(empty knowledge base)";

  return `You are the knowledge distiller for the Digilist agent fleet. Your goal: turn raw signals + repo patterns + industry practice + the latest stack news into CONCRETE, actionable, deduped learnings that get injected into every agent.

Six sources (cover all the relevant ones):
1. repo patterns: how this codebase actually does things (use codebase-memory: search_graph / get_code_snippet / get_architecture).
2. industry practice (best-practice): established principles for the stack.
3. own mistakes (mistake): from the raw signals below (reviews that requested changes, blocked runs, false positives).
4. user feedback (user-feedback): from the raw signals.
5. content signals (content-signal): from the raw signals.
6. technology trends (tech-trend): ${input.allowWeb ? "use WebSearch/docs to spot new major versions, deprecations and shifts in best practice for: " + STACK_WATCH.join(", ") + "." : "web is off this run. Skip trend research, use only what you know for certain."}

RAW SIGNALS TO DISTILL:
${signalsText}

EXISTING LEARNINGS (do NOT duplicate; improve/dedupe against these; propose demote for ones that no longer apply):
${existingText}

Repo to inspect: ${input.repoPath}

Requirements for each learning:
- statement: one sentence, actionable, precise. Write in English.
- why: short rationale/evidence. NEVER make it up. Every learning must trace to a signal, a file/symbol, or a named source/URL.
- applies_to: list of agent names (pr-review, improvements, implement, content, e2e), domains (security, a11y, convex, react, seo) or path globs. Use ["*"] only when it applies to the whole fleet.
- source_ref: exact source (signal source, file:symbol, or URL). Never empty.
- confidence: 0..1. Be honest; low for speculative.
- Only for a tech-trend that IMPLIES an upgrade (e.g. a new TS major): set "upgrade" with { title, goal, rationale }, an advisory upgrade job the fleet can propose.

Don't fabricate. If a source is thin, skip it rather than guess. Max ~15 learnings per run; quality over quantity.

End with ONLY one JSON object of this shape (no text after):
{"learnings":[{"type":"...","statement":"...","why":"...","applies_to":["..."],"source_ref":"...","confidence":0.0,"upgrade":{"title":"...","goal":"...","rationale":"..."}}],"demote":["old statement that no longer applies"]}`;
}

/** Extract the last JSON object from the agent transcript and validate it into a
 *  DistillOutput. Returns empty output on any parse failure (never throws). */
export function parseDistilled(text: string): DistillOutput {
  const obj = extractLastJsonObject(text);
  if (!obj || typeof obj !== "object") return { learnings: [] };
  const raw = obj as { learnings?: unknown; demote?: unknown };
  const learnings: DistilledLearning[] = Array.isArray(raw.learnings)
    ? raw.learnings.map(coerceLearning).filter((l): l is DistilledLearning => l !== null)
    : [];
  const demote = Array.isArray(raw.demote)
    ? raw.demote.filter((d): d is string => typeof d === "string" && d.trim().length > 0)
    : [];
  return { learnings, demote };
}

function coerceLearning(x: unknown): DistilledLearning | null {
  if (!x || typeof x !== "object") return null;
  const o = x as Record<string, unknown>;
  const type = String(o.type ?? "");
  const statement = String(o.statement ?? "").trim();
  if (!LEARNING_TYPES.includes(type as LearningType) || statement.length < 8) return null;
  const applies_to = Array.isArray(o.applies_to)
    ? o.applies_to.map((a) => String(a).trim()).filter(Boolean)
    : [];
  const conf = Number(o.confidence);
  const learning: DistilledLearning = {
    type: type as LearningType,
    statement,
    why: String(o.why ?? "").trim(),
    applies_to: applies_to.length ? applies_to : ["*"],
    source_ref: String(o.source_ref ?? "").trim(),
    confidence: Number.isFinite(conf) ? Math.max(0, Math.min(1, conf)) : 0.5,
  };
  // Only honour a well-formed upgrade suggestion on a tech-trend.
  if (learning.type === "tech-trend" && o.upgrade && typeof o.upgrade === "object") {
    const u = o.upgrade as Record<string, unknown>;
    const title = String(u.title ?? "").trim();
    const goal = String(u.goal ?? "").trim();
    if (title && goal) {
      learning.upgrade = { title, goal, rationale: String(u.rationale ?? "").trim() };
    }
  }
  return learning;
}

/** Best-effort: find and parse the last balanced `{...}` block in the text. */
function extractLastJsonObject(text: string): unknown {
  const end = text.lastIndexOf("}");
  if (end < 0) return null;
  let depth = 0;
  for (let i = end; i >= 0; i--) {
    const c = text[i];
    if (c === "}") depth++;
    else if (c === "{") {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(text.slice(i, end + 1));
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

export interface ApplyResult {
  upserted: Learning[];
  demoted: string[];
  upgrades: DistilledLearning[]; // learnings carrying an upgrade suggestion
}

/**
 * Apply a distill output to the store: upsert (deduped/compounded) each learning,
 * demote statements that no longer apply, and collect any upgrade suggestions.
 * Does NOT save or file to Linear — the caller decides that (so it stays pure
 * and testable). Reject learnings with an empty source_ref (never fabricate).
 */
export function applyDistilled(store: KnowledgeStore, output: DistillOutput, now: string): ApplyResult {
  const upserted: Learning[] = [];
  const upgrades: DistilledLearning[] = [];
  for (const d of output.learnings) {
    if (!d.source_ref) continue; // provenance is mandatory
    const l = upsertLearning(store, d, now);
    upserted.push(l);
    if (d.upgrade) upgrades.push(d);
  }

  const demoted: string[] = [];
  for (const stmt of output.demote ?? []) {
    const norm = normStatement(stmt);
    const rec = store.knowledge.find((l) => normStatement(l.statement) === norm);
    if (rec && rec.status !== "demoted") {
      rec.status = "demoted";
      rec.updated_at = now;
      store.upsertLearning(rec);
      demoted.push(rec.statement);
    }
  }
  return { upserted, demoted, upgrades };
}

/** Render an upgrade suggestion as a runnable /loop goal for Linear (advisory —
 *  the human Todo gate decides whether it ever runs). */
export function upgradeGoalMarkdown(u: NonNullable<DistilledLearning["upgrade"]>, sourceRef: string): string {
  return [
    `**Advisory upgrade proposed by the knowledge agent** (from an observed technology trend).`,
    ``,
    `## Goal`,
    u.goal,
    ``,
    `## Rationale`,
    u.rationale || "(none)",
    ``,
    `## Source`,
    sourceRef,
    ``,
    `## Run as a Claude loop (on a new branch, never main)`,
    "```",
    `/loop ${u.goal}`,
    "```",
    ``,
    `---`,
    `_Auto-filed by the Digilist knowledge agent. This is a SUGGESTION in Backlog. Move it to Todo only after a human has reviewed it._`,
  ].join("\n");
}
