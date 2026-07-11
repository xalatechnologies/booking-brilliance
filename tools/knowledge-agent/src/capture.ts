/**
 * Capture — records raw signals into the Open Brain's `signals` inbox, the raw
 * material the distiller later turns into learnings. This is the CAPTURE half of
 * the capture -> distill -> inject loop.
 *
 * Every helper is BEST-EFFORT: it swallows its own errors and never throws, so
 * wiring a capture point into an existing agent can never break that agent's
 * real work. Signals are deduped in the store, so double-wiring is safe.
 *
 * The obvious capture points wired in the fleet:
 *   - pr-review verdict      → capturePrReview  (request-changes = a blocker we missed)
 *   - implement blocked/no-PR→ captureBlockedRun / captureNoPr
 *   - analyze verdict        → captureFalsePositive (scanner flagged shipped code)
 *   - user corrections       → captureUserFeedback
 *   - content memory         → captureContentSignals
 */
import { OpenBrain, type Signal, type SignalKind } from "../../improvements-agent/src/brain";

const nowIso = () => new Date().toISOString();

/** Stable-ish id without external deps: kind + time + short hash of the text. */
function signalId(kind: SignalKind, text: string): string {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (Math.imul(31, h) + text.charCodeAt(i)) | 0;
  return `${kind}-${Date.now().toString(36)}-${(h >>> 0).toString(36)}`;
}

/** Low-level: append one signal. Best-effort — returns false on any failure. */
export function captureSignal(input: {
  kind: SignalKind;
  agent: string;
  text: string;
  source_ref: string;
  applies_to?: string[];
}): boolean {
  const text = (input.text ?? "").trim();
  if (!text) return false;
  try {
    const brain = OpenBrain.load();
    const signal: Signal = {
      id: signalId(input.kind, text),
      kind: input.kind,
      agent: input.agent,
      text: text.slice(0, 2000),
      source_ref: input.source_ref,
      applies_to: input.applies_to?.filter(Boolean),
      created_at: nowIso(),
    };
    brain.addSignal(signal);
    brain.save(nowIso());
    return true;
  } catch {
    return false;
  }
}

/**
 * A PR review that requested changes / blocked — the reviewer caught something
 * the author (often another agent) shipped. Only blocking verdicts are worth
 * learning from; clean approvals carry no lesson.
 */
export function capturePrReview(input: {
  repo: string;
  number: number;
  event: string; // approve | request-changes | comment
  body: string;
  branch?: string;
}): boolean {
  if (input.event !== "request-changes") return false;
  const agentBranch = (input.branch ?? "").startsWith("agent/");
  return captureSignal({
    kind: "pr-review",
    agent: "pr-review",
    text: `PR review requested changes on ${input.repo}#${input.number}${input.branch ? ` (${input.branch})` : ""}: ${input.body}`,
    source_ref: `${input.repo}#${input.number}`,
    // Blocking reviews of agent branches are the fleet learning from itself.
    applies_to: agentBranch ? ["improvements", "implement"] : ["pr-review"],
  });
}

/** An implement run that ended BLOCKED / CLARIFICATION — a recurring blocker the
 *  fleet should learn to avoid or clarify up front. */
export function captureBlockedRun(input: { branch: string; result: string; linearId?: string }): boolean {
  return captureSignal({
    kind: "blocked-run",
    agent: "implement",
    text: `Implement run blocked on ${input.branch}: ${input.result}`,
    source_ref: input.linearId ?? input.branch,
    applies_to: ["improvements", "implement"],
  });
}

/** An implement run that finished but produced no PR — usually the goal was
 *  under-specified or the branch was already done. */
export function captureNoPr(input: { branch: string; result: string; linearId?: string }): boolean {
  return captureSignal({
    kind: "no-pr",
    agent: "implement",
    text: `Implement run produced no PR on ${input.branch}: ${input.result}`,
    source_ref: input.linearId ?? input.branch,
    applies_to: ["improvements", "implement"],
  });
}

/**
 * A verdict where the scanner flagged a "gap" for something that already exists
 * (or was not-actionable) — a recurring false positive the analyzer should stop
 * re-raising. Only records the false-positive shape, not genuine work.
 */
export function captureFalsePositive(input: {
  itemKey: string;
  title: string;
  status: string; // exists | not-actionable | not-found | ...
  category?: string;
}): boolean {
  if (!["exists", "not-actionable", "not-found"].includes(input.status)) return false;
  return captureSignal({
    kind: "false-positive",
    agent: "improvements",
    text: `The scanner flagged "${input.title}" (${input.category ?? "?"}) but analysis found status "${input.status}" — likely false positive.`,
    source_ref: input.itemKey,
    applies_to: ["improvements", "site-intelligence"],
  });
}

/** A CI failure an agent then fixed — the fix is a durable lesson. */
export function captureCiFix(input: { branch: string; failure: string; fix: string }): boolean {
  return captureSignal({
    kind: "ci-fix",
    agent: "implement",
    text: `CI failed (${input.failure}) and was fixed: ${input.fix}`,
    source_ref: input.branch,
    applies_to: ["implement", "improvements"],
  });
}

/**
 * A direct human correction — the highest-signal input. `applies_to` lets the
 * caller target the agent/domain the feedback is about; defaults to fleet-wide.
 */
export function captureUserFeedback(text: string, opts: { appliesTo?: string[]; sourceRef?: string } = {}): boolean {
  return captureSignal({
    kind: "user-feedback",
    agent: "user",
    text,
    source_ref: opts.sourceRef ?? "user",
    applies_to: opts.appliesTo ?? ["*"],
  });
}

/**
 * Content signals from the content agent's memory — durable house-style rules
 * and recurring editorial issues become fleet signals so the content lessons
 * are visible to (and distilled alongside) everything else. Best-effort import
 * of the content-memory module; a no-op if it is unavailable.
 */
export async function captureContentSignals(): Promise<number> {
  try {
    const mem = await import("../../content-agent/src/memory");
    const memory = mem.loadMemory();
    let n = 0;
    for (const note of memory.style_notes.slice(0, 20)) {
      if (
        captureSignal({
          kind: "content-signal",
          agent: "content",
          text: `Content house rule: ${note}`,
          source_ref: "content-memory:style_notes",
          applies_to: ["content"],
        })
      )
        n++;
    }
    return n;
  } catch {
    return 0;
  }
}
