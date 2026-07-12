/**
 * The reasoning stage - the CTO's judgement. Given the gathered FleetState, it
 * asks the best model (Opus, via the shared runClaudeAgent so it can consult the
 * codebase graph + docs) to decide what matters now: which specialist should
 * own each non-Todo item, a suggested priority/severity, and any blockers that
 * need the human. It returns a structured plan { assignments, blockers, summary }.
 *
 * buildReasoningPrompt + parsePlan are pure so they can be unit-tested with no
 * network.
 */
import { runClaudeAgent } from "../../content-agent/src/claude-agent";
import type { ContentAgentConfig } from "../../content-agent/src/config";
import type { FleetState } from "./state";

/** The specialists the CTO can route work to. */
export const SPECIALISTS = [
  "content-agent",
  "improvements-agent",
  "pr-review-agent",
  "e2e-agent",
  "docs-rag",
  "cto",
] as const;
export type Specialist = (typeof SPECIALISTS)[number];

export interface Assignment {
  item: string; // Linear identifier (e.g. XAL-123) or a short label
  specialist: string;
  priority?: string; // Urgent | High | Normal | Low, or P0..P3
  severity?: string; // critical | major | minor
  rationale?: string;
  promote?: boolean; // recommend moving into the approval queue (autopilot only)
}

export interface Blocker {
  item: string;
  question: string; // exactly what the human needs to answer
}

export interface Plan {
  assignments: Assignment[];
  blockers: Blocker[];
  summary: string;
}

export const EMPTY_PLAN: Plan = { assignments: [], blockers: [], summary: "" };

const SYSTEM = `You are the technical lead (CTO) for Digilist, a municipal SaaS booking platform. You run a fleet of specialist agents:
- content-agent: blog and marketing content.
- improvements-agent: analyzes the code, proposes and builds improvements (analyze/prepare/implement).
- pr-review-agent: reviews open PRs.
- e2e-agent: end-to-end tests of the product.
- docs-rag: documentation and knowledge lookup.

You are given a FLEET STATE (Linear issues, Open Brain, open PRs). The Todo queue is already driven automatically toward PRs, so do NOT assign Todo issues. Focus on EVERYTHING ELSE:
- Which specialist should own each issue that is NOT in Todo, and why.
- Suggested priority (Urgent/High/Normal/Low) and severity (critical/major/minor).
- Real blockers that need a human: ask ONE precise question per blocker.
- promote=true only for issues you think should be approved (moved to Todo). This happens only in autopilot.

Be concise and concrete. English, no em dash as a separator.

Return ONLY valid JSON, nothing else:
{"summary":"brief situation assessment","assignments":[{"item":"XAL-123 or short label","specialist":"improvements-agent","priority":"High","severity":"major","rationale":"brief","promote":false}],"blockers":[{"item":"XAL-124","question":"precise question"}]}`;

function issueLine(i: FleetState["issues"][number]): string {
  const flags = [i.hasGoal ? "has-goal" : "missing-goal", ...i.labels].join(", ");
  return `- ${i.identifier} [${i.stateName} · ${i.priorityLabel}] ${i.title.slice(0, 80)}${flags ? ` (${flags})` : ""}`;
}

/** Render the FleetState into the reasoning prompt (pure). */
export function buildReasoningPrompt(state: FleetState): string {
  const nonTodo = state.issues.filter((i) => i.stateName.toLowerCase() !== "todo");
  const prLines = state.prs.map(
    (p) =>
      `- ${p.repo}#${p.number} "${p.title.slice(0, 70)}" [${p.isDraft ? "draft" : "open"}${p.reviewDecision ? ` · ${p.reviewDecision}` : ""}] checks ${p.checks.passed}✓/${p.checks.failed}✗/${p.checks.pending}…`,
  );
  return [
    `FLEET STATE (${state.generatedAt})`,
    ``,
    `TODO (already driven toward PRs, ${state.todo.length} issue(s) - do NOT assign these):`,
    ...state.todo.map((i) => `- ${i.identifier} [${i.priorityLabel}] ${i.title.slice(0, 80)}`),
    ``,
    `OTHER ISSUES (${nonTodo.length}):`,
    ...(nonTodo.length ? nonTodo.map(issueLine) : ["- (none)"]),
    ``,
    `OPEN PRs (${state.prs.length}):`,
    ...(prLines.length ? prLines : ["- (none)"]),
    ``,
    `OPEN BRAIN: ${state.brain.items} items, ${state.brain.verdicts} verdicts, ${state.brain.prepared} prepared branches.`,
    state.brain.learnings.length ? `Learnings: ${state.brain.learnings.slice(0, 6).join(" | ")}` : "",
    ``,
    `Assess the situation, assign specialists to non-Todo issues, flag blockers. The last message must be ONLY the JSON object.`,
  ]
    .filter((l) => l !== "")
    .join("\n");
}

/** Extract the plan JSON from the model's reply (pure, tolerant). */
export function parsePlan(text: string): Plan {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return { ...EMPTY_PLAN, summary: text.trim().slice(0, 400) };
  let raw: unknown;
  try {
    raw = JSON.parse(m[0]);
  } catch {
    return { ...EMPTY_PLAN, summary: text.trim().slice(0, 400) };
  }
  const obj = (raw ?? {}) as Record<string, unknown>;
  const assignments: Assignment[] = Array.isArray(obj.assignments)
    ? (obj.assignments as Record<string, unknown>[])
        .filter((a) => a && typeof a.item === "string" && typeof a.specialist === "string")
        .map((a) => ({
          item: String(a.item),
          specialist: String(a.specialist),
          priority: typeof a.priority === "string" ? a.priority : undefined,
          severity: typeof a.severity === "string" ? a.severity : undefined,
          rationale: typeof a.rationale === "string" ? a.rationale : undefined,
          promote: a.promote === true,
        }))
    : [];
  const blockers: Blocker[] = Array.isArray(obj.blockers)
    ? (obj.blockers as Record<string, unknown>[])
        .filter((b) => b && typeof b.question === "string")
        .map((b) => ({ item: typeof b.item === "string" ? b.item : "", question: String(b.question) }))
    : [];
  const summary = typeof obj.summary === "string" ? obj.summary : "";
  return { assignments, blockers, summary };
}

/** Run the Opus reasoning pass over the fleet state and return a parsed plan. */
export async function orchestrate(state: FleetState, cfg: ContentAgentConfig): Promise<Plan> {
  const model = process.env.CTO_REASON_MODEL || cfg.anthropicReviewModel || "claude-opus-4-8";
  const prompt = buildReasoningPrompt(state);
  const r = await runClaudeAgent({
    prompt,
    systemPrompt: SYSTEM,
    model,
    maxTurns: 20,
    idleMin: 10,
    timeoutMin: 12,
    label: "cto-reason",
  });
  return parsePlan(r.text);
}
