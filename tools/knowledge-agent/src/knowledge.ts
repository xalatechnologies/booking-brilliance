/**
 * Knowledge store — the fleet-wide, provenance-tracked learning store.
 *
 * This does NOT stand up a competing store: it extends the Open Brain JSON
 * (tools/improvements-agent/brain/brain.json, gitignored) via its `signals`
 * (capture inbox) and `knowledge` (distilled learnings) arrays. It generalizes
 * two existing loops into one: the content agent's OB1-style content-memory and
 * the improvements agent's `learnings[]`.
 *
 * A Learning is concrete, actionable and traceable to a source (never
 * fabricated). recall() ranks by relevance to an agent/query/type, weighing
 * applies_to match + keyword overlap + confidence + recency, so injection can
 * pull a compact, on-topic top-N. Dedup is by normalized statement so the same
 * lesson learned twice compounds (confidence + hits) instead of duplicating.
 *
 * The single source of truth is the Open Brain; renderWiki() materializes it to
 * a human-readable wiki (KNOWLEDGE.md + docs/knowledge/<topic>.md) so a person
 * can browse/curate it and docs-rag can index it for semantic recall.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Learning, LearningType } from "../../improvements-agent/src/brain";

/** The minimal store surface the knowledge helpers need. OpenBrain satisfies it;
 *  tests can pass a plain in-memory object so no file I/O is involved. */
export interface KnowledgeStore {
  readonly knowledge: Learning[];
  upsertLearning(l: Learning): void;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/**
 * Where the rendered wiki is written. The knowledge is distilled from the
 * PRIVATE Digilist app repo's internals, so it must NOT land in the public
 * booking-brilliance tree. Resolution order:
 *   1. KNOWLEDGE_WIKI_ROOT   — explicit override (the VPS runner sets this)
 *   2. DIGILIST_REPO_PATH    — the private app repo (default target)
 *   3. this repo root        — local fallback ONLY; the wiki is .gitignored here
 *                              so it can never be committed to the public repo.
 */
export const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");
export const WIKI_ROOT =
  process.env.KNOWLEDGE_WIKI_ROOT || process.env.DIGILIST_REPO_PATH || REPO_ROOT;
export const KNOWLEDGE_INDEX = path.join(WIKI_ROOT, "KNOWLEDGE.md");
export const KNOWLEDGE_DIR = path.join(WIKI_ROOT, "docs", "knowledge");

export type { Learning, LearningType };

/** Normalized statement — the dedup key. Lowercase, strip punctuation, collapse
 *  whitespace, drop a trailing period. Norwegian letters preserved. */
export function normStatement(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-zæøå0-9 ]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Deterministic id from type + normalized statement — so the same learning
 *  distilled on two runs lands on the same record (idempotent upsert). */
export function learningId(type: LearningType, statement: string): string {
  const norm = normStatement(statement);
  let h = 0;
  for (let i = 0; i < norm.length; i++) h = (Math.imul(31, h) + norm.charCodeAt(i)) | 0;
  return `${type}:${(h >>> 0).toString(36)}`;
}

const KEYWORD_STOP = new Set([
  "og", "i", "på", "for", "som", "det", "en", "et", "til", "av", "er", "the", "a", "an",
  "to", "of", "in", "on", "for", "with", "and", "or", "bruk", "ikke", "må", "skal",
]);

function keywords(text: string): string[] {
  return normStatement(text)
    .split(" ")
    .filter((w) => w.length >= 3 && !KEYWORD_STOP.has(w));
}

/**
 * Upsert a learning with dedup by normalized statement. When a matching
 * statement already exists we COMPOUND it (bump confidence toward 1, add a hit,
 * merge applies_to, keep the richer why) rather than duplicate. Returns the
 * stored record. Confidence is clamped to [0,1]; a demoted learning that is
 * seen again is reactivated.
 */
export function upsertLearning(
  store: KnowledgeStore,
  input: Omit<Learning, "id" | "created_at" | "hits"> & Partial<Pick<Learning, "id" | "created_at" | "hits">>,
  now: string,
): Learning {
  const id = input.id ?? learningId(input.type, input.statement);
  const existing = store.knowledge.find(
    (l) => l.id === id || (l.type === input.type && normStatement(l.statement) === normStatement(input.statement)),
  );
  if (existing) {
    existing.why = input.why || existing.why;
    existing.applies_to = [...new Set([...existing.applies_to, ...input.applies_to])];
    existing.source_ref = input.source_ref || existing.source_ref;
    // Two independent observations of the same rule → higher confidence.
    existing.confidence = clamp01(Math.max(existing.confidence, input.confidence) + 0.05);
    existing.updated_at = now;
    existing.status = "active";
    store.upsertLearning(existing);
    return existing;
  }
  const learning: Learning = {
    id,
    type: input.type,
    statement: input.statement.trim(),
    why: (input.why ?? "").trim(),
    applies_to: [...new Set(input.applies_to)].filter(Boolean),
    source_ref: input.source_ref,
    confidence: clamp01(input.confidence),
    created_at: input.created_at ?? now,
    updated_at: now,
    hits: input.hits ?? 0,
    status: "active",
  };
  store.upsertLearning(learning);
  return learning;
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

export interface RecallQuery {
  agent?: string; // rank learnings whose applies_to targets this agent/domain
  query?: string; // free-text context to keyword-match against
  type?: LearningType; // restrict to one source type
  limit?: number; // default 8
  now?: number; // epoch ms for recency; defaults to created_at ordering only
  includeDemoted?: boolean;
}

interface Scored {
  learning: Learning;
  score: number;
}

/**
 * Rank learnings by relevance. Score = applies_to match + keyword overlap +
 * confidence + recency, so the most on-topic, trusted, recent rules surface
 * first. Deterministic given the inputs (recency needs `now`).
 */
export function recall(store: KnowledgeStore, q: RecallQuery = {}): Learning[] {
  const limit = q.limit ?? 8;
  const qkw = q.query ? new Set(keywords(q.query)) : null;
  const agent = q.agent?.toLowerCase();
  const scored: Scored[] = [];

  for (const l of store.knowledge) {
    if (l.status === "demoted" && !q.includeDemoted) continue;
    if (q.type && l.type !== q.type) continue;

    let score = 0;
    // applies_to: exact agent/domain hit is the strongest signal.
    if (agent) {
      const applies = l.applies_to.map((a) => a.toLowerCase());
      if (applies.includes(agent)) score += 3;
      else if (applies.includes("*") || applies.includes("all") || applies.length === 0) score += 1;
      else if (applies.some((a) => agent.includes(a) || a.includes(agent))) score += 1.5;
    }
    // keyword overlap between the query context and the learning text.
    if (qkw && qkw.size) {
      const lkw = new Set([...keywords(l.statement), ...keywords(l.why), ...l.applies_to.flatMap(keywords)]);
      let hits = 0;
      for (const w of qkw) if (lkw.has(w)) hits++;
      score += Math.min(3, hits);
    }
    // confidence: trust the rule proportionally.
    score += clamp01(l.confidence) * 2;
    // recency: newer learnings gently preferred (half-life ~30 days).
    if (q.now) {
      const ref = Date.parse(l.updated_at ?? l.created_at);
      if (Number.isFinite(ref)) {
        const days = Math.max(0, (q.now - ref) / 86_400_000);
        score += Math.exp(-days / 30);
      }
    }
    // a learning that has proven useful keeps a small edge.
    score += Math.min(0.5, l.hits * 0.05);

    if (score > 0 || (!agent && !qkw && !q.type)) scored.push({ learning: l, score });
  }

  scored.sort((a, b) => b.score - a.score || (b.learning.confidence - a.learning.confidence));
  return scored.slice(0, limit).map((s) => s.learning);
}

// ── Wiki rendering ────────────────────────────────────────────────────────────

const TYPE_META: Record<LearningType, { title: string; slug: string }> = {
  "repo-pattern": { title: "Repository patterns", slug: "repo-patterns" },
  "best-practice": { title: "Industry principles (best practice)", slug: "best-practices" },
  mistake: { title: "Our own mistakes (avoid these)", slug: "mistakes" },
  "user-feedback": { title: "User feedback", slug: "user-feedback" },
  "content-signal": { title: "Content signals", slug: "content-signals" },
  "tech-trend": { title: "Technology trends and stack updates", slug: "tech-trends" },
};

const TYPE_ORDER: LearningType[] = [
  "mistake",
  "user-feedback",
  "repo-pattern",
  "best-practice",
  "tech-trend",
  "content-signal",
];

function renderLearning(l: Learning): string {
  const conf = `${Math.round(clamp01(l.confidence) * 100)} %`;
  const applies = l.applies_to.length ? l.applies_to.join(", ") : "the whole fleet";
  const lines = [
    `### ${l.statement}`,
    "",
    `- **Why:** ${l.why || "(not specified)"}`,
    `- **Applies to:** ${applies}`,
    `- **Confidence:** ${conf} · **hits:** ${l.hits}`,
    `- **Source:** ${l.source_ref || "(unknown)"}`,
  ];
  if (l.status === "demoted") lines.push(`- _Demoted. No longer shown to the agents._`);
  return lines.join("\n");
}

export interface RenderResult {
  index: string; // KNOWLEDGE.md contents
  topics: { file: string; content: string }[]; // docs/knowledge/*.md
}

/** Build the wiki text from the current learnings. Pure (no I/O) so it is
 *  testable; writeWiki() persists what this returns. */
export function renderWiki(learnings: Learning[], now: string): RenderResult {
  const active = learnings.filter((l) => l.status !== "demoted");
  const byType = new Map<LearningType, Learning[]>();
  for (const l of active) {
    const arr = byType.get(l.type) ?? [];
    arr.push(l);
    byType.set(l.type, arr);
  }
  const sortByConf = (a: Learning, b: Learning) => b.confidence - a.confidence;

  const topics: { file: string; content: string }[] = [];
  const indexLines: string[] = [
    "# Digilist fleet: knowledge base",
    "",
    "> Auto-generated from the Open Brain by the knowledge agent (`pnpm learning:run`).",
    "> Single source of truth: the Open Brain. Edit here for curation if you like, but",
    "> remember the next distill run rewrites these files from the brain.",
    "",
    `Last updated: ${now.slice(0, 10)} · ${active.length} active learnings.`,
    "",
    "## Contents",
    "",
  ];

  for (const type of TYPE_ORDER) {
    const items = (byType.get(type) ?? []).slice().sort(sortByConf);
    const meta = TYPE_META[type];
    indexLines.push(`- [${meta.title}](docs/knowledge/${meta.slug}.md): ${items.length} learning(s)`);
    const body = [
      `# ${meta.title}`,
      "",
      `> Auto-generated from the Open Brain. ${items.length} learning(s). Last: ${now.slice(0, 10)}.`,
      "",
      items.length ? items.map(renderLearning).join("\n\n") : "_No learnings recorded yet._",
      "",
    ].join("\n");
    topics.push({ file: `${meta.slug}.md`, content: body });
  }

  indexLines.push("", "## How this is used", "");
  indexLines.push(
    "Agents pull relevant learnings automatically (injected into the system prompt) via",
    "`relevantLearnings(agent, context)`. The loop is: **capture -> distill -> inject**.",
    "",
  );
  return { index: indexLines.join("\n"), topics };
}

/** Persist the wiki to disk (KNOWLEDGE.md + docs/knowledge/*.md). */
export function writeWiki(result: RenderResult): void {
  fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
  fs.writeFileSync(KNOWLEDGE_INDEX, `${result.index.replace(/\n+$/, "")}\n`, "utf-8");
  for (const t of result.topics) {
    fs.writeFileSync(path.join(KNOWLEDGE_DIR, t.file), `${t.content.replace(/\n+$/, "")}\n`, "utf-8");
  }
}

/** Convenience: render + write from a loaded store. */
export function renderWikiFromStore(store: KnowledgeStore, now: string): RenderResult {
  const result = renderWiki(store.knowledge, now);
  writeWiki(result);
  return result;
}
