import { describe, expect, it } from "vitest";
import { itemFromIssue, routeIssueRepo } from "../drive";
import { buildReasoningPrompt, parsePlan } from "../orchestrate";
import { toNativePriority } from "../run";
import {
  classifyChecks,
  normalizeIssue,
  normalizePr,
  sortIssuesByPriority,
  type FleetIssue,
  type FleetState,
  type RawLinearIssue,
} from "../state";

const GOAL_BODY = [
  "## Run as a Claude loop (in `/root/Digilist`, on a new branch)",
  "```",
  "/loop Build something concrete and get the tests green.",
  "```",
].join("\n");

function raw(over: Partial<RawLinearIssue> = {}): RawLinearIssue {
  return {
    id: "id-1",
    identifier: "XAL-1",
    title: "Add export of bookings",
    url: "https://linear.app/x/XAL-1",
    priority: 3,
    createdAt: "2026-07-01T00:00:00.000Z",
    state: { name: "Todo", type: "unstarted" },
    labels: { nodes: [{ name: "feature" }] },
    description: "A short sentence.",
    ...over,
  };
}

describe("normalizeIssue", () => {
  it("maps priority to a label and detects a missing /loop goal", () => {
    const i = normalizeIssue(raw());
    expect(i.priorityLabel).toBe("Normal");
    expect(i.hasGoal).toBe(false);
    expect(i.labels).toEqual(["feature"]);
    expect(i.stateName).toBe("Todo");
  });

  it("detects a present /loop goal", () => {
    const i = normalizeIssue(raw({ description: GOAL_BODY }));
    expect(i.hasGoal).toBe(true);
  });

  it("treats null priority as 'None' (0)", () => {
    const i = normalizeIssue(raw({ priority: null }));
    expect(i.priority).toBe(0);
    expect(i.priorityLabel).toBe("None");
  });
});

describe("sortIssuesByPriority", () => {
  const mk = (priority: number, createdAt: string, id: string): FleetIssue =>
    normalizeIssue(raw({ id, identifier: id, priority, createdAt }));

  it("orders Urgent first, then High/Normal/Low, with none last", () => {
    const sorted = sortIssuesByPriority([
      mk(0, "2026-01-01T00:00:00Z", "none"),
      mk(4, "2026-01-01T00:00:00Z", "low"),
      mk(1, "2026-01-01T00:00:00Z", "urgent"),
      mk(2, "2026-01-01T00:00:00Z", "high"),
      mk(3, "2026-01-01T00:00:00Z", "normal"),
    ]);
    expect(sorted.map((i) => i.identifier)).toEqual(["urgent", "high", "normal", "low", "none"]);
  });

  it("breaks priority ties by createdAt ascending (oldest first)", () => {
    const sorted = sortIssuesByPriority([
      mk(2, "2026-02-01T00:00:00Z", "newer"),
      mk(2, "2026-01-01T00:00:00Z", "older"),
    ]);
    expect(sorted.map((i) => i.identifier)).toEqual(["older", "newer"]);
  });
});

describe("classifyChecks / normalizePr", () => {
  it("buckets check conclusions", () => {
    const c = classifyChecks([
      { status: "COMPLETED", conclusion: "SUCCESS" },
      { status: "COMPLETED", conclusion: "SKIPPED" },
      { status: "COMPLETED", conclusion: "FAILURE" },
      { status: "IN_PROGRESS", conclusion: "" },
      { status: "COMPLETED", conclusion: "" },
    ]);
    expect(c).toEqual({ passed: 2, failed: 1, pending: 2 });
  });

  it("normalizes a raw PR", () => {
    const pr = normalizePr("xalatechnologies/Digilist", {
      number: 42,
      title: "Fix export",
      url: "https://github.com/x/pull/42",
      headRefName: "agent/xal-1",
      isDraft: false,
      reviewDecision: "APPROVED",
      createdAt: "2026-07-01T00:00:00Z",
      statusCheckRollup: [{ status: "COMPLETED", conclusion: "SUCCESS" }],
    });
    expect(pr.repo).toBe("xalatechnologies/Digilist");
    expect(pr.number).toBe(42);
    expect(pr.checks).toEqual({ passed: 1, failed: 0, pending: 0 });
    expect(pr.reviewDecision).toBe("APPROVED");
  });
});

describe("routeIssueRepo / itemFromIssue", () => {
  it("routes app work to digilist and marketing work to booking-brilliance", () => {
    expect(routeIssueRepo("Eksport av bookinger", "")).toBe("digilist");
    expect(routeIssueRepo("Ny landingsside for blogg", "")).toBe("marketing");
  });

  it("builds an analyzer item from a bare issue", () => {
    const item = itemFromIssue(raw());
    expect(item.kind).toBe("idea");
    expect(item.target_repo).toBe("digilist");
    expect(item.source_ref).toBe("XAL-1");
    expect(item.probe_hints.length).toBeGreaterThan(0);
  });
});

describe("toNativePriority", () => {
  it("maps words and P-codes to Linear native priority", () => {
    expect(toNativePriority("Urgent")).toBe(1);
    expect(toNativePriority("high")).toBe(2);
    expect(toNativePriority("P2")).toBe(3);
    expect(toNativePriority("Low")).toBe(4);
    expect(toNativePriority("tull")).toBeUndefined();
    expect(toNativePriority(undefined)).toBeUndefined();
  });
});

describe("parsePlan", () => {
  it("parses a clean JSON plan", () => {
    const plan = parsePlan(
      `{"summary":"Everything looks good","assignments":[{"item":"XAL-2","specialist":"pr-review-agent","priority":"High","severity":"major"}],"blockers":[{"item":"XAL-3","question":"Which region?"}]}`,
    );
    expect(plan.summary).toBe("Everything looks good");
    expect(plan.assignments).toHaveLength(1);
    expect(plan.assignments[0].specialist).toBe("pr-review-agent");
    expect(plan.blockers[0].question).toBe("Which region?");
  });

  it("extracts JSON embedded in prose", () => {
    const plan = parsePlan(`Here is the plan:\n{"summary":"ok","assignments":[],"blockers":[]}\nDone.`);
    expect(plan.summary).toBe("ok");
    expect(plan.assignments).toEqual([]);
  });

  it("drops malformed assignments and blockers", () => {
    const plan = parsePlan(
      `{"summary":"x","assignments":[{"item":"XAL-4"},{"item":"XAL-5","specialist":"e2e-agent"}],"blockers":[{"item":"XAL-6"}]}`,
    );
    expect(plan.assignments).toHaveLength(1);
    expect(plan.assignments[0].item).toBe("XAL-5");
    expect(plan.blockers).toHaveLength(0);
  });

  it("falls back to a summary when there is no JSON", () => {
    const plan = parsePlan("No structure here, just text.");
    expect(plan.assignments).toEqual([]);
    expect(plan.summary).toContain("No structure");
  });
});

describe("buildReasoningPrompt", () => {
  it("lists Todo separately and never asks to assign it", () => {
    const state: FleetState = {
      generatedAt: "2026-07-11T00:00:00Z",
      todo: [normalizeIssue(raw({ identifier: "XAL-10", state: { name: "Todo", type: "unstarted" } }))],
      issues: [
        normalizeIssue(raw({ identifier: "XAL-10", state: { name: "Todo", type: "unstarted" } })),
        normalizeIssue(raw({ identifier: "XAL-11", state: { name: "Backlog", type: "backlog" } })),
      ],
      prs: [],
      brain: { items: 0, verdicts: 0, prepared: 0, learnings: [], openPrepared: [] },
    };
    const prompt = buildReasoningPrompt(state);
    expect(prompt).toContain("XAL-10");
    expect(prompt).toContain("XAL-11");
    expect(prompt).toContain("do NOT assign these");
  });
});
