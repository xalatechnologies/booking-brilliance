import { describe, expect, it } from "vitest";
import { mergeSignals, type Learning, type Signal } from "../../../improvements-agent/src/brain";
import {
  applyDistilled,
  parseDistilled,
  type DistillOutput,
} from "../distill";
import {
  learningId,
  normStatement,
  recall,
  renderWiki,
  upsertLearning,
  type KnowledgeStore,
} from "../knowledge";

const NOW = "2026-07-11T00:00:00.000Z";
const NOW_MS = Date.parse(NOW);

/** In-memory store — no file I/O, so tests never touch the real brain.json. */
class FakeStore implements KnowledgeStore {
  knowledge: Learning[] = [];
  upsertLearning(l: Learning): void {
    const i = this.knowledge.findIndex((x) => x.id === l.id);
    if (i >= 0) this.knowledge[i] = l;
    else this.knowledge.unshift(l);
  }
}

function seed(store: FakeStore, partial: Partial<Learning> & Pick<Learning, "type" | "statement">): Learning {
  return upsertLearning(
    store,
    {
      type: partial.type,
      statement: partial.statement,
      why: partial.why ?? "fordi",
      applies_to: partial.applies_to ?? ["*"],
      source_ref: partial.source_ref ?? "test",
      confidence: partial.confidence ?? 0.6,
    },
    NOW,
  );
}

describe("normStatement + learningId", () => {
  it("normalizes punctuation/case/whitespace and keeps Norwegian letters", () => {
    expect(normStatement("  Bruk RBAC-scoping, ALLTID.  ")).toBe("bruk rbac scoping alltid");
    expect(normStatement("Ærlig Øving på Åsen")).toBe("ærlig øving på åsen");
  });

  it("is deterministic and stable across equivalent statements", () => {
    expect(learningId("mistake", "Ikke gjør X.")).toBe(learningId("mistake", "ikke gjør x"));
    expect(learningId("mistake", "A")).not.toBe(learningId("best-practice", "A"));
  });
});

describe("upsertLearning — dedup + compounding", () => {
  it("creates a new learning with clamped confidence and deduped applies_to", () => {
    const store = new FakeStore();
    const l = seed(store, { type: "mistake", statement: "Test dette", confidence: 5, applies_to: ["a", "a", "b"] });
    expect(store.knowledge).toHaveLength(1);
    expect(l.confidence).toBe(1); // clamped
    expect(l.applies_to).toEqual(["a", "b"]);
    expect(l.hits).toBe(0);
    expect(l.status).toBe("active");
  });

  it("compounds a repeated statement instead of duplicating", () => {
    const store = new FakeStore();
    seed(store, { type: "best-practice", statement: "Valider input", confidence: 0.5, applies_to: ["convex"] });
    const again = upsertLearning(
      store,
      { type: "best-practice", statement: "valider input.", why: "richer", applies_to: ["security"], source_ref: "s2", confidence: 0.6 },
      NOW,
    );
    expect(store.knowledge).toHaveLength(1); // deduped by normalized statement
    expect(again.confidence).toBeCloseTo(0.65, 5); // max(0.5,0.6)+0.05
    expect(again.applies_to.sort()).toEqual(["convex", "security"]);
    expect(again.why).toBe("richer");
  });

  it("reactivates a demoted learning when it is seen again", () => {
    const store = new FakeStore();
    const l = seed(store, { type: "tech-trend", statement: "TS 7 er ute" });
    l.status = "demoted";
    upsertLearning(store, { type: "tech-trend", statement: "TS 7 er ute", why: "", applies_to: ["*"], source_ref: "x", confidence: 0.7 }, NOW);
    expect(store.knowledge[0].status).toBe("active");
  });
});

describe("recall — ranking + filtering", () => {
  it("ranks an exact agent match above a fleet-wide one", () => {
    const store = new FakeStore();
    seed(store, { type: "best-practice", statement: "Global regel", applies_to: ["*"], confidence: 0.9 });
    seed(store, { type: "mistake", statement: "Spesifikk for pr review", applies_to: ["pr-review"], confidence: 0.5 });
    const out = recall(store, { agent: "pr-review", now: NOW_MS });
    expect(out[0].applies_to).toContain("pr-review");
  });

  it("respects the type filter and the limit", () => {
    const store = new FakeStore();
    seed(store, { type: "mistake", statement: "M en" });
    seed(store, { type: "mistake", statement: "M to" });
    seed(store, { type: "best-practice", statement: "BP en" });
    expect(recall(store, { type: "mistake" })).toHaveLength(2);
    expect(recall(store, { limit: 1 })).toHaveLength(1);
  });

  it("excludes demoted learnings unless asked", () => {
    const store = new FakeStore();
    const l = seed(store, { type: "mistake", statement: "Skjult" });
    l.status = "demoted";
    expect(recall(store, {})).toHaveLength(0);
    expect(recall(store, { includeDemoted: true })).toHaveLength(1);
  });

  it("boosts by keyword overlap with the query context", () => {
    const store = new FakeStore();
    seed(store, { type: "best-practice", statement: "Håndter tenant scoping i alle Convex-spørringer", applies_to: ["convex"], confidence: 0.4 });
    seed(store, { type: "best-practice", statement: "Skriv gode commit-meldinger", applies_to: ["*"], confidence: 0.4 });
    const out = recall(store, { query: "tenant scoping convex", now: NOW_MS });
    expect(out[0].statement).toContain("tenant scoping");
  });
});

describe("renderWiki", () => {
  it("renders an index with every type section and per-topic files", () => {
    const store = new FakeStore();
    seed(store, { type: "mistake", statement: "Ikke gjenta feil", applies_to: ["improvements"], confidence: 0.8, source_ref: "pr#1" });
    seed(store, { type: "tech-trend", statement: "Vite 7 tilgjengelig", applies_to: ["*"], confidence: 0.6 });
    const { index, topics } = renderWiki(store.knowledge, NOW);
    expect(index).toContain("# Digilist fleet: knowledge base");
    expect(index).toContain("docs/knowledge/mistakes.md");
    expect(index).toContain("docs/knowledge/tech-trends.md");
    expect(topics.map((t) => t.file)).toContain("mistakes.md");
    const mistakes = topics.find((t) => t.file === "mistakes.md")!;
    expect(mistakes.content).toContain("Ikke gjenta feil");
    expect(mistakes.content).toContain("pr#1");
    expect(index).not.toContain("—"); // no em-dash anywhere in the user-facing wiki
  });

  it("omits demoted learnings from the wiki", () => {
    const store = new FakeStore();
    const l = seed(store, { type: "mistake", statement: "Utdatert regel" });
    l.status = "demoted";
    const { topics } = renderWiki(store.knowledge, NOW);
    const mistakes = topics.find((t) => t.file === "mistakes.md")!;
    expect(mistakes.content).not.toContain("Utdatert regel");
    expect(mistakes.content).toContain("No learnings");
  });
});

describe("parseDistilled", () => {
  it("extracts the last JSON object from noisy agent output", () => {
    const text = `Her er analysen min.\n\nOppsummering...\n{"learnings":[{"type":"mistake","statement":"Sjekk RBAC","why":"lekkasjer","applies_to":["security"],"source_ref":"pr#9","confidence":0.8}],"demote":["gammel regel"]}`;
    const out = parseDistilled(text);
    expect(out.learnings).toHaveLength(1);
    expect(out.learnings[0].statement).toBe("Sjekk RBAC");
    expect(out.demote).toEqual(["gammel regel"]);
  });

  it("drops malformed learnings and returns empty on no JSON", () => {
    const out = parseDistilled(`{"learnings":[{"type":"bogus","statement":"x"},{"type":"mistake","statement":"kort"},{"type":"mistake","statement":"Gyldig lang setning","why":"","applies_to":[],"source_ref":"s","confidence":2}]}`);
    expect(out.learnings).toHaveLength(1);
    expect(out.learnings[0].confidence).toBe(1); // clamped
    expect(out.learnings[0].applies_to).toEqual(["*"]); // defaulted
    expect(parseDistilled("ingen json her").learnings).toHaveLength(0);
  });

  it("only keeps a well-formed upgrade on a tech-trend", () => {
    const out = parseDistilled(
      `{"learnings":[{"type":"tech-trend","statement":"TS 7 er ute","why":"raskere","applies_to":["*"],"source_ref":"https://x","confidence":0.7,"upgrade":{"title":"Oppgrader til TS 7","goal":"Migrer tsconfig","rationale":"ytelse"}}]}`,
    );
    expect(out.learnings[0].upgrade?.title).toBe("Oppgrader til TS 7");
  });
});

describe("applyDistilled", () => {
  it("upserts, demotes stale statements, collects upgrades, and rejects fabrication", () => {
    const store = new FakeStore();
    seed(store, { type: "best-practice", statement: "Gammel praksis som skal bort" });
    const output: DistillOutput = {
      learnings: [
        { type: "mistake", statement: "Ny lærdom", why: "grunn", applies_to: ["improvements"], source_ref: "pr#3", confidence: 0.7 },
        { type: "tech-trend", statement: "React 20 kommer", why: "", applies_to: ["react"], source_ref: "url", confidence: 0.6, upgrade: { title: "Bump React", goal: "gjør det", rationale: "r" } },
        { type: "mistake", statement: "Uten kilde", why: "", applies_to: ["*"], source_ref: "", confidence: 0.9 }, // rejected: no provenance
      ],
      demote: ["Gammel praksis som skal bort"],
    };
    const res = applyDistilled(store, output, NOW);
    expect(res.upserted).toHaveLength(2); // the no-source one is rejected
    expect(res.upgrades).toHaveLength(1);
    expect(res.demoted).toEqual(["Gammel praksis som skal bort"]);
    expect(store.knowledge.find((l) => l.statement === "Gammel praksis som skal bort")?.status).toBe("demoted");
    expect(store.knowledge.some((l) => l.statement === "Uten kilde")).toBe(false);
  });
});

describe("mergeSignals — capture durability (no signal loss)", () => {
  const sig = (id: string, over: Partial<Signal> = {}): Signal => ({
    id,
    kind: "pr-review",
    agent: "pr-review",
    text: `signal ${id}`,
    source_ref: `ref-${id}`,
    created_at: `2026-07-11T00:00:0${id.length}.000Z`,
    ...over,
  });

  it("keeps a signal a concurrent capture wrote to disk after we loaded", () => {
    // We loaded [a]; capture.ts wrote [b, a] to disk via its own instance; we now
    // save our stale [a]. Without merge, b is clobbered. With merge, both survive.
    const memory = [sig("a")];
    const onDisk = [sig("b"), sig("a")];
    const merged = mergeSignals(memory, onDisk);
    expect(merged.map((s) => s.id).sort()).toEqual(["a", "b"]);
  });

  it("never un-distills: OR-s the flag across both copies", () => {
    // Disk marked `a` distilled; our in-memory copy predates that. Merge must keep
    // it distilled so the distiller doesn't reprocess it forever (and vice-versa).
    const distilledOnDisk = mergeSignals([sig("a", { distilled: false })], [sig("a", { distilled: true })]);
    expect(distilledOnDisk.find((s) => s.id === "a")?.distilled).toBe(true);
    const distilledInMem = mergeSignals([sig("a", { distilled: true })], [sig("a", { distilled: false })]);
    expect(distilledInMem.find((s) => s.id === "a")?.distilled).toBe(true);
  });

  it("dedupes by id (no duplicate when the same signal is in both)", () => {
    const merged = mergeSignals([sig("a")], [sig("a")]);
    expect(merged).toHaveLength(1);
  });

  it("caps the inbox at 500, newest first", () => {
    const many = Array.from({ length: 600 }, (_, i) =>
      sig(`m${i}`, { created_at: `2026-07-11T00:00:00.${String(i).padStart(3, "0")}Z` }),
    );
    const merged = mergeSignals(many, []);
    expect(merged).toHaveLength(500);
    expect(merged[0].created_at > merged[merged.length - 1].created_at).toBe(true);
  });
});
