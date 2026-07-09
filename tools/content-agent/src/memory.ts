/**
 * Content memory — the agent's compounding learning loop (inspired by OB1's
 * Auto-Capture + Aiception self-improvement pattern,
 * https://github.com/NateBJones-Projects/OB1).
 *
 * Every generate run:
 *   1. LEARNS — reads the already-published corpus (so a new post picks a
 *      complementary angle instead of duplicating one) plus the durable
 *      house-style rules and the recurring issues past editorial reviews
 *      flagged, and injects all of it into the brief/blog/review prompts.
 *   2. CAPTURES — after the deep-review, records the review's verdict + issues
 *      and distills anything that recurs into a durable style note, so the
 *      lessons compound across runs.
 *
 * The store is a git-tracked JSON file, so the learning is durable, reviewable
 * in diffs, and travels with the repo the daily-blogs workflow checks out.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ContentAgentConfig } from "./config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MEMORY_DIR = path.resolve(__dirname, "..", "memory");
const MEMORY_FILE = path.join(MEMORY_DIR, "content-memory.json");

export interface ContentLesson {
  date: string;
  slug: string;
  score: number;
  verdict: string;
  issues: string[];
}

export interface ContentMemory {
  /** Durable house rules distilled from issues that recur across reviews. */
  style_notes: string[];
  /** Rolling log of per-review lessons (newest first, capped). */
  lessons: ContentLesson[];
  updated_at: string;
}

const MAX_LESSONS = 60;
const EMPTY: ContentMemory = { style_notes: [], lessons: [], updated_at: "" };

export function loadMemory(): ContentMemory {
  try {
    const raw = JSON.parse(fs.readFileSync(MEMORY_FILE, "utf-8")) as Partial<ContentMemory>;
    return {
      style_notes: raw.style_notes ?? [],
      lessons: raw.lessons ?? [],
      updated_at: raw.updated_at ?? "",
    };
  } catch {
    return { ...EMPTY };
  }
}

function saveMemory(m: ContentMemory): void {
  fs.mkdirSync(MEMORY_DIR, { recursive: true });
  fs.writeFileSync(MEMORY_FILE, `${JSON.stringify(m, null, 2)}\n`, "utf-8");
}

// ── "What's in the system": a light read of the published corpus ────────────

export interface CorpusEntry {
  slug: string;
  title: string;
  tag: string;
  description: string;
  date: string;
}

function readFrontmatter(md: string): Record<string, string> {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const fm: Record<string, string> = {};
  if (!m) return fm;
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, "").trim();
  }
  return fm;
}

/** Published posts on disk, newest first — the corpus a new post must not
 * duplicate and should complement. */
export function readPublishedCorpus(cfg: ContentAgentConfig): CorpusEntry[] {
  try {
    return fs
      .readdirSync(cfg.blogDir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => {
        const fm = readFrontmatter(fs.readFileSync(path.join(cfg.blogDir, f), "utf-8"));
        return {
          slug: fm.slug || f.replace(/\.md$/, ""),
          title: fm.title || f.replace(/\.md$/, ""),
          tag: fm.tag || "",
          description: fm.description || "",
          date: fm.date || "",
        };
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch {
    return [];
  }
}

// ── Learn: build the context string injected into the prompts ───────────────

/** Issue phrases that recur at least `min` times across recent lessons —
 * the raw material for durable style notes and "avoid these" guidance. */
function recurringIssues(lessons: ContentLesson[], min: number): string[] {
  const counts = new Map<string, { text: string; n: number }>();
  for (const l of lessons) {
    for (const raw of l.issues) {
      const norm = raw.toLowerCase().replace(/[^a-zæøå0-9 ]/gi, "").replace(/\s+/g, " ").trim();
      if (norm.length < 8) continue;
      const cur = counts.get(norm);
      if (cur) cur.n++;
      else counts.set(norm, { text: raw.trim(), n: 1 });
    }
  }
  return [...counts.values()]
    .filter((c) => c.n >= min)
    .sort((a, b) => b.n - a.n)
    .map((c) => c.text);
}

export interface Learnings {
  context: string; // compact block injected into brief/blog/review prompts
  memory: ContentMemory;
  corpus: CorpusEntry[];
}

export function buildLearnings(cfg: ContentAgentConfig): Learnings {
  const memory = loadMemory();
  const corpus = readPublishedCorpus(cfg);
  const published = corpus
    .slice(0, 40)
    .map((c) => `- "${c.title}"${c.tag ? ` (${c.tag})` : ""} → /blogg/${c.slug}`)
    .join("\n");
  const recurring = recurringIssues(memory.lessons, 2).slice(0, 8);

  const sections: string[] = [];
  if (published) {
    sections.push(
      `ALLEREDE PUBLISERT (${corpus.length} artikler; ikke dupliser en eksisterende vinkel, velg en komplementær):\n${published}`,
    );
  }
  if (memory.style_notes.length) {
    sections.push(
      `HUSREGLER SOM HAR SATT SEG (lærdommer fra tidligere arbeid):\n${memory.style_notes
        .slice(0, 12)
        .map((s) => `- ${s}`)
        .join("\n")}`,
    );
  }
  if (recurring.length) {
    sections.push(
      `TILBAKEVENDENDE FEIL FRA TIDLIGERE REDAKSJONELLE GJENNOMGANGER (unngå disse):\n${recurring
        .map((s) => `- ${s}`)
        .join("\n")}`,
    );
  }
  const context = sections.length
    ? `LÆRDOM FRA SYSTEMET (bruk dette aktivt):\n\n${sections.join("\n\n")}`
    : "";
  return { context, memory, corpus };
}

// ── Capture: record a lesson and compound recurring ones into style notes ────

export function recordLesson(
  memory: ContentMemory,
  lesson: ContentLesson,
): ContentMemory {
  const lessons = [lesson, ...memory.lessons].slice(0, MAX_LESSONS);
  // Anything that has now recurred >= 3 times becomes a durable house rule
  // (Aiception-style: distil completed work into a reusable rule).
  const promoted = recurringIssues(lessons, 3).map((s) => s.replace(/\.$/, ""));
  const style_notes = [...new Set([...memory.style_notes, ...promoted])].slice(0, 24);
  const next: ContentMemory = {
    style_notes,
    lessons,
    updated_at: lesson.date,
  };
  saveMemory(next);
  return next;
}
