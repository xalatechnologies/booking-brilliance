/**
 * Fleet orchestration — the headless counterpart to the in-session Workflow
 * tool. A plain `claude -p` is a single agent and its Task tool isn't reliable
 * headlessly, so the fleet gets deterministic multi-agent orchestration here in
 * code: compose runCapableAgent() calls (each a full-capability agent with the
 * repo map, docs-RAG, tools) with parallel() and pipeline().
 *
 *   parallel(thunks)          — run concurrently, barrier, collect all (nulls on error)
 *   pipeline(items, ...stages) — each item flows through every stage independently
 *   runStructured(...)        — one capable agent whose final message is JSON, parsed
 *
 * These are intentionally tiny and dependency-free (mirrors the Workflow
 * primitives): the value is that each unit of work is a code-grounded agent.
 */
import { runCapableAgent } from "./claude-agent";

/** Run thunks concurrently (bounded), returning results in order; a thrown thunk
 *  becomes null (like the Workflow parallel() barrier). */
export async function parallel<T>(thunks: Array<() => Promise<T>>, concurrency = 4): Promise<Array<T | null>> {
  const results: Array<T | null> = new Array(thunks.length).fill(null);
  let next = 0;
  async function worker(): Promise<void> {
    while (next < thunks.length) {
      const idx = next++;
      try {
        results[idx] = await thunks[idx]();
      } catch {
        results[idx] = null;
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, thunks.length) }, worker));
  return results;
}

/** Run each item through all stages independently (no barrier between stages).
 *  A stage that throws drops that item to null. Each stage gets (prev, item, i). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function pipeline<I>(items: I[], ...stages: Array<(prev: any, item: I, index: number) => Promise<any>>): Promise<any[]> {
  return Promise.all(
    items.map(async (item, i) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let acc: any = item;
      for (const stage of stages) {
        try {
          acc = await stage(acc, item, i);
        } catch {
          return null;
        }
      }
      return acc;
    }),
  );
}

/** Extract the first parseable balanced-brace / bracket JSON from agent output. */
export function extractJson<T>(text: string): T | null {
  const objs: string[] = [];
  let depth = 0;
  let start = -1;
  let inStr = false;
  let esc = false;
  let opener = "";
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === "{" || c === "[") { if (depth === 0) { start = i; opener = c; } depth++; }
    else if (c === "}" || c === "]") { depth--; if (depth === 0 && start >= 0) { objs.push(text.slice(start, i + 1)); start = -1; opener = ""; } }
  }
  void opener;
  for (const o of objs.sort((a, b) => b.length - a.length)) {
    try {
      return JSON.parse(o) as T;
    } catch {
      /* next */
    }
  }
  return null;
}

/** One capable agent that must answer with JSON; returns the parsed object (or null). */
export async function runStructured<T>(opts: {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  cwd?: string;
  maxTurns?: number;
  timeoutMin?: number;
}): Promise<T | null> {
  const r = await runCapableAgent({
    ...opts,
    prompt: `${opts.prompt}\n\nEnd with the answer as PURE JSON on the last line — no code block, no text after.`,
  });
  return extractJson<T>(r.text);
}
