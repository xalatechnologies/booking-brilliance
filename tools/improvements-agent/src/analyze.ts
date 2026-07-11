/**
 * The analyzer — grounds each item in the actual codebase before deciding
 * anything. It probes the code graph (searchGraph) for the symbols an item
 * implies, then asks the best model to judge:
 *   - idea    → exists | partial | gap (don't re-propose what's already built)
 *   - finding → where the fix lives + a concrete fix
 * and to draft a self-contained Claude `/loop` goal for the genuine ones.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runCapableAgent } from "../../content-agent/src/claude-agent";
import type { ContentAgentConfig } from "../../content-agent/src/config";
import { anthropic, type AnthropicCallResult } from "../../content-agent/src/generate";
import { parallel } from "../../content-agent/src/orchestrate";
import { searchGraph, type GraphSymbol } from "./code-map";
import { REPOS, type Item, type RepoKey } from "./inputs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Code-derived inventory of what a repo already ships (regenerated from the
 * graph). Authoritative context so a probe that misses (wrong wording) can't
 * make the analyzer call an existing feature a "gap". */
export function loadCapabilities(repo: RepoKey): string {
  try {
    return fs.readFileSync(path.resolve(__dirname, "..", "brain", `capabilities-${repo}.md`), "utf-8");
  } catch {
    return "";
  }
}

export type IssueType = "bug" | "feature" | "improvement" | "nice-to-have";
export type Severity = "critical" | "major" | "minor";
export type Priority = "P0" | "P1" | "P2" | "P3";

export interface Verdict {
  status: "exists" | "partial" | "gap" | "fixable" | "not-actionable";
  actionable: boolean;
  confidence: number; // 0..1
  type: IssueType;
  severity: Severity;
  priority: Priority;
  code_evidence: { ref: string; note: string }[];
  fix: string;
  goal_prompt: string;
}

const SYSTEM = `You are a technical product and architecture analyst for Digilist, a municipal SaaS booking platform (Convex backend + React, packages: booking-core, discovery-core, billing, ticketing-core, ds, digilist).

You get ONE work item (either a product idea, or a scan finding from quality monitoring) together with EVIDENCE from the code graph: which symbols/modules exist or are missing. Use the evidence strictly, don't guess.

Decide status:
- For an IDEA: "exists" (already in the code), "partial" (partially covered), or "gap" (genuinely missing feature).
- For a FINDING: "fixable" (real problem with a clear fix), or "not-actionable" (false positive / nothing to do in the code).

Set actionable=true only when there is real work to do (gap, partial improvement, or fixable finding). Don't propose building something that already exists.

Categorize each actionable item:
- type: "bug" (something is broken/wrong), "feature" (new capability / genuine gap), "improvement" (improving something that exists), "nice-to-have" (low value, cosmetic).
- severity: "critical" (blocks use / security / data loss), "major" (clear loss of function or quality), "minor" (small effect).
- priority: "P0" (urgent now), "P1" (high), "P2" (medium), "P3" (low). Derive from severity + user impact + search demand/evidence.

For actionable items, write a SELF-CONTAINED Claude goal (goal_prompt) a developer can run with /loop in the right repo: concrete what to build/fix, which files/modules (from the evidence), acceptance criteria, and that tests must be green before a PR. Write in English.

Return ONLY valid JSON:
{"status":"...","actionable":true|false,"confidence":0.0-1.0,"type":"bug|feature|improvement|nice-to-have","severity":"critical|major|minor","priority":"P0|P1|P2|P3","code_evidence":[{"ref":"file/symbol","note":"short"}],"fix":"what to do","goal_prompt":"self-contained /loop goal"}`;

function tryJson<T>(text: string): T | null {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    return JSON.parse(m[0]) as T;
  } catch {
    return null;
  }
}

/** Probe the graph for the symbols an item implies. Returns evidence text. */
async function gatherEvidence(
  project: string,
  item: Item,
): Promise<{ text: string; hits: GraphSymbol[] }> {
  const all: GraphSymbol[] = [];
  const lines: string[] = [];
  for (const hint of item.probe_hints.slice(0, 6)) {
    const hits = await searchGraph(project, hint, 4).catch(() => []);
    all.push(...hits);
    lines.push(
      hits.length
        ? `- "${hint}": ${hits.length} hits, e.g. ${hits
            .slice(0, 3)
            .map((h) => `${h.name} (${h.file_path})`)
            .join("; ")}`
        : `- "${hint}": 0 hits (not present in the code)`,
    );
  }
  return { text: lines.join("\n") || "(no probes run)", hits: all };
}

export async function analyzeItem(
  cfg: ContentAgentConfig,
  item: Item,
  project: string,
): Promise<{ verdict: Verdict; call: AnthropicCallResult }> {
  const { text: evidence } = await gatherEvidence(project, item);
  const capabilities = loadCapabilities(item.target_repo);
  const capBlock = capabilities
    ? `KNOWN FEATURES IN THE CODE (authoritative, code-derived overview of what the repo ALREADY has — check the item against this FIRST; if it's covered here, status is "exists"/"partial" even if the graph probes returned zero hits, because probes can use the wrong wording):\n${capabilities}\n\n`
    : "";
  const userMessage = `${capBlock}ITEM (${item.kind === "idea" ? "product idea" : `scan finding: ${item.category}/${item.severity}`}):
Title: ${item.title}
Details: ${item.detail}
Target repo: ${item.target_repo}

CODE-GRAPH EVIDENCE (name search in the target repo; zero hits may be wording, not absence):
${evidence}

Decide status (check against KNOWN FEATURES first) and write a /loop goal only if genuinely actionable. Return JSON.`;

  const repoCwd = REPOS[item.target_repo]?.path;
  const cwd = repoCwd && fs.existsSync(path.join(repoCwd, ".git")) ? repoCwd : undefined;
  const multiLens = cfg.llmProvider === "claude-cli" && process.env.IMPROVEMENTS_MULTILENS === "1";

  let call: AnthropicCallResult;
  let parsed: Partial<Verdict> | null;
  if (multiLens) {
    // Panel of independent analysts (each grounds in the repo map) with distinct
    // framings, merged conservatively — precision-first, to kill the analyzer's
    // known failure mode of re-proposing features that already exist.
    const framings = [
      "", // balanced
      "LENS: Be EXTRA skeptical of 'gap'. Assume the feature exists fully/partially until you've disproven it in the code (search_graph/get_code_snippet/Read). Don't propose anything already covered.",
      "LENS: Judge VALUE and priority strictly. Is this genuinely worth building NOW for a municipal booking SaaS? Be honest about low value (nice-to-have).",
    ];
    const parts = await parallel(
      framings.map((f) => async () => {
        const r = await runCapableAgent({
          prompt: `${userMessage}${f ? `\n\n${f}` : ""}\n\nYour LAST message must be ONLY the JSON object.`,
          systemPrompt: SYSTEM,
          model: cfg.anthropicReviewModel,
          cwd,
          maxTurns: 25,
          timeoutMin: 8,
        });
        return tryJson<Partial<Verdict>>(r.text);
      }),
    );
    parsed = reconcileVerdicts(parts.filter((p): p is Partial<Verdict> => Boolean(p)));
    call = { text: JSON.stringify(parsed ?? {}), inputTokens: 0, outputTokens: 0, costUsd: 0, model: `${cfg.anthropicReviewModel} (max-cli · ${framings.length}-lens)` };
  } else if (cfg.llmProvider === "claude-cli") {
    // Capable mode: let the analyzer use the repository map + Read to verify the
    // CLI-gathered evidence in the actual checkout before judging.
    const r = await runCapableAgent({
      prompt: `${userMessage}\n\nYour LAST message must be ONLY the JSON object.`,
      systemPrompt: SYSTEM,
      model: cfg.anthropicReviewModel,
      cwd,
      maxTurns: 30,
      timeoutMin: 10,
    });
    call = { text: r.text, inputTokens: 0, outputTokens: 0, costUsd: 0, model: r.model };
    parsed = tryJson<Partial<Verdict>>(call.text);
  } else {
    call = await anthropic(cfg, {
      model: cfg.anthropicReviewModel, // best model — architectural judgement
      systemPrompt: SYSTEM,
      userMessage,
      maxTokens: 2048,
    });
    parsed = tryJson<Partial<Verdict>>(call.text);
  }
  // Sensible fallbacks when the model omits a field: ideas → feature/improvement,
  // findings → bug; severity from the finding severity; priority from severity.
  const defaultType: IssueType =
    item.kind === "idea" ? (parsed?.status === "partial" ? "improvement" : "feature") : "bug";
  const defaultSeverity: Severity = item.severity === "error" ? "major" : "minor";
  const okType = ["bug", "feature", "improvement", "nice-to-have"];
  const okSev = ["critical", "major", "minor"];
  const okPrio = ["P0", "P1", "P2", "P3"];
  const severity = (okSev.includes(parsed?.severity as string) ? parsed!.severity : defaultSeverity) as Severity;
  const verdict: Verdict = {
    status: (parsed?.status as Verdict["status"]) ?? "not-actionable",
    actionable: Boolean(parsed?.actionable),
    confidence: typeof parsed?.confidence === "number" ? Math.max(0, Math.min(1, parsed.confidence)) : 0.5,
    type: (okType.includes(parsed?.type as string) ? parsed!.type : defaultType) as IssueType,
    severity,
    priority: (okPrio.includes(parsed?.priority as string)
      ? parsed!.priority
      : severity === "critical" ? "P0" : severity === "major" ? "P1" : "P2") as Priority,
    code_evidence: Array.isArray(parsed?.code_evidence) ? parsed!.code_evidence!.slice(0, 8) : [],
    fix: parsed?.fix ?? "",
    goal_prompt: parsed?.goal_prompt ?? "",
  };
  return { verdict, call };
}

/**
 * Merge N independent analyst verdicts into one, precision-first (the analyzer's
 * failure mode is false "gap"s, so we bias toward NOT filing): if any analyst
 * sees the feature as existing/partial, that wins; actionable needs a strict
 * majority AND a non-"exists" status. Goal/fix come from the most-developed
 * actionable verdict; classification by mode; evidence unioned.
 */
function reconcileVerdicts(ps: Partial<Verdict>[]): Partial<Verdict> | null {
  if (ps.length === 0) return null;
  if (ps.length === 1) return ps[0];
  const mode = <T,>(vals: (T | undefined)[]): T | undefined => {
    const m = new Map<T, number>();
    for (const v of vals) if (v !== undefined) m.set(v, (m.get(v) ?? 0) + 1);
    let best: T | undefined;
    let n = 0;
    for (const [k, c] of m) if (c > n) { n = c; best = k; }
    return best;
  };
  const statuses = ps.map((p) => p.status);
  let status: Verdict["status"] | undefined;
  if (statuses.includes("exists")) status = "exists";
  else if (statuses.includes("partial")) status = "partial";
  else status = mode(statuses) as Verdict["status"] | undefined;

  const votes = ps.filter((p) => p.actionable).length;
  let actionable = votes * 2 > ps.length; // strict majority
  if (status === "exists") actionable = false;
  const agree = actionable ? votes : ps.length - votes;

  const best =
    ps.filter((p) => p.actionable && p.goal_prompt).sort((a, b) => (b.goal_prompt?.length ?? 0) - (a.goal_prompt?.length ?? 0))[0] ?? ps[0];
  const ev = new Map<string, { ref: string; note: string }>();
  for (const p of ps) for (const e of p.code_evidence ?? []) if (e?.ref) ev.set(e.ref, e);

  return {
    status,
    actionable,
    confidence: Number((agree / ps.length).toFixed(2)),
    type: mode(ps.map((p) => p.type)),
    severity: mode(ps.map((p) => p.severity)),
    priority: mode(ps.map((p) => p.priority)),
    fix: best.fix ?? "",
    goal_prompt: actionable ? best.goal_prompt ?? "" : "",
    code_evidence: [...ev.values()].slice(0, 8),
  };
}
