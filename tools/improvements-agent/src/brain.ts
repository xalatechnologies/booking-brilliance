/**
 * Open Brain — the shared, persistent memory that ties the self-improving loop
 * together (inspired by OB1: capture + recall + provenance,
 * https://github.com/NateBJones-Projects/OB1).
 *
 * Every stage reads and writes here, cross-linked by a stable `item_key`:
 *   items        — actionable inputs (product ideas + intelligence findings)
 *   verdicts     — the code-aware analysis of each item (@ a code sha)
 *   improvements — Linear issues we filed for genuine/actionable items
 *   prepared     — isolated implementation branches we set up on approval
 *   code_snapshots / repo_status — what the code looked like when we analyzed
 *   learnings    — compounding notes (e.g. recurring false positives)
 *   signals      — raw captured signals for the knowledge layer (undistilled)
 *   knowledge    — distilled, provenance-tracked fleet-wide learnings
 *
 * The knowledge layer (tools/knowledge-agent) extends THIS store rather than
 * standing up a competing one: `signals` is its capture inbox and `knowledge`
 * is its distilled output, both rendered to the human-readable wiki on distill.
 *
 * Lightweight by design: a single JSON file, no external infra. Recall lets a
 * run skip re-analysing an item whose code context (sha) hasn't changed.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BRAIN_DIR = path.resolve(__dirname, "..", "brain");
const BRAIN_FILE = path.join(BRAIN_DIR, "brain.json");

export type ItemKind = "idea" | "finding";

export interface BrainItem {
  key: string;
  kind: ItemKind;
  source_ref: string; // gh issue #, or finding id
  title: string;
  category: string; // seo | ytelse | security | a11y | sla | uptime | feature | ...
  severity: string; // error | warn | info | (idea)
  target_repo: string; // "digilist" | "booking-brilliance"
  seen_at: string;
}

export interface CodeEvidence {
  ref: string; // file / module / symbol
  note: string;
}

export interface Verdict {
  item_key: string;
  actionable: boolean;
  confidence: number; // 0..1
  status: string; // exists | partial | gap | fixable | not-found
  type?: string; // bug | feature | improvement | nice-to-have
  severity?: string; // critical | major | minor
  priority?: string; // P0 | P1 | P2 | P3
  code_evidence: CodeEvidence[];
  fix: string; // the concrete improvement / fix summary
  goal_prompt: string; // the self-contained Claude /loop goal
  analyzed_at: string;
  code_sha: string; // repo sha the analysis was grounded on
  model: string;
}

export interface Improvement {
  item_key: string;
  linear_id: string;
  linear_identifier: string;
  linear_url: string;
  state: string;
  created_at: string;
}

export interface Prepared {
  item_key: string;
  repo: string;
  branch: string;
  worktree_path: string;
  goal_file: string;
  goal?: string; // the /loop goal, for the auto-implement stage
  linear_id?: string;
  prepared_at: string;
  implemented_at?: string;
  pr_url?: string;
}

export interface CodeSnapshot {
  project: string;
  repo: string;
  nodes: number;
  edges: number;
  git_sha: string;
  indexed_at: string;
}

/** Where a captured signal came from — the raw material the distiller reads. */
export type SignalKind =
  | "pr-review" // a request-changes / blocking review verdict
  | "ci-fix" // a CI failure an agent then fixed
  | "false-positive" // a verdict that flagged something already shipped
  | "blocked-run" // an implement run that ended BLOCKED/CLARIFICATION
  | "no-pr" // an implement run that produced no PR
  | "user-feedback" // a human correction
  | "content-signal"; // a blog/keyword signal from the content memory

export interface Signal {
  id: string;
  kind: SignalKind;
  agent: string; // which agent produced it (pr-review, improvements, content, user, ...)
  text: string; // the raw observation, verbatim-ish
  source_ref: string; // PR url, branch, item key, "user", ...
  applies_to?: string[]; // best-effort hints (agent | domain | path glob)
  created_at: string;
  distilled?: boolean; // set once the distiller has consumed it
}

/** The six knowledge sources the self-learning layer distils into rules. */
export type LearningType =
  | "repo-pattern"
  | "best-practice"
  | "mistake"
  | "user-feedback"
  | "content-signal"
  | "tech-trend";

export interface Learning {
  id: string;
  type: LearningType;
  statement: string; // the actionable rule, one sentence
  why: string; // the rationale / evidence
  applies_to: string[]; // agent names | domains | path globs it is relevant to
  source_ref: string; // provenance — never fabricated
  confidence: number; // 0..1
  created_at: string;
  updated_at?: string;
  hits: number; // times injected/applied
  last_applied?: string;
  status?: "active" | "demoted"; // demoted = kept for history, not injected
}

export interface Brain {
  items: BrainItem[];
  verdicts: Verdict[];
  improvements: Improvement[];
  prepared: Prepared[];
  code_snapshots: CodeSnapshot[];
  repo_status: Record<string, { branch: string; sha: string; dirty: boolean; checked_at: string }>;
  learnings: string[];
  signals: Signal[];
  knowledge: Learning[];
  updated_at: string;
}

const EMPTY: Brain = {
  items: [],
  verdicts: [],
  improvements: [],
  prepared: [],
  code_snapshots: [],
  repo_status: {},
  learnings: [],
  signals: [],
  knowledge: [],
  updated_at: "",
};

/** Stable key for an item so every stage can cross-reference it. */
export function itemKey(kind: ItemKind, ref: string): string {
  return `${kind}:${ref}`;
}

export class OpenBrain {
  private data: Brain;

  private constructor(data: Brain) {
    this.data = data;
  }

  static load(): OpenBrain {
    try {
      const raw = JSON.parse(fs.readFileSync(BRAIN_FILE, "utf-8")) as Partial<Brain>;
      return new OpenBrain({
        ...EMPTY,
        ...raw,
        repo_status: raw.repo_status ?? {},
        signals: raw.signals ?? [],
        knowledge: raw.knowledge ?? [],
      });
    } catch {
      return new OpenBrain(structuredClone(EMPTY));
    }
  }

  save(nowIso: string): void {
    this.data.updated_at = nowIso;
    fs.mkdirSync(BRAIN_DIR, { recursive: true });
    // Merge the capture inbox with whatever is on disk before writing. A signal
    // is captured via its OWN fresh OpenBrain (capture.ts) that loads → adds →
    // saves; a caller holding a long-lived instance would otherwise clobber that
    // signal on its next save(). Union by id — a signal counts as distilled if
    // either copy is — so no captured signal is ever lost to a stale writer.
    this.data.signals = mergeSignals(this.data.signals, readDiskSignals());
    fs.writeFileSync(BRAIN_FILE, `${JSON.stringify(this.data, null, 2)}\n`, "utf-8");
  }

  get raw(): Brain {
    return this.data;
  }

  // ── recall ────────────────────────────────────────────────────────────────

  /** A fresh verdict exists for this item at this code sha → skip re-analysis. */
  recallVerdict(itemKey: string, codeSha: string): Verdict | null {
    return (
      this.data.verdicts.find((v) => v.item_key === itemKey && v.code_sha === codeSha) ?? null
    );
  }

  improvementFor(itemKey: string): Improvement | null {
    return this.data.improvements.find((i) => i.item_key === itemKey) ?? null;
  }

  preparedFor(itemKey: string): Prepared | null {
    return this.data.prepared.find((p) => p.item_key === itemKey) ?? null;
  }

  // ── capture (upserts keyed by item, newest wins) ────────────────────────────

  upsertItem(item: BrainItem): void {
    upsert(this.data.items, item, (x) => x.key === item.key);
  }

  recordVerdict(v: Verdict): void {
    // one verdict per (item, sha)
    this.data.verdicts = this.data.verdicts.filter(
      (x) => !(x.item_key === v.item_key && x.code_sha === v.code_sha),
    );
    this.data.verdicts.unshift(v);
  }

  recordImprovement(i: Improvement): void {
    upsert(this.data.improvements, i, (x) => x.item_key === i.item_key);
  }

  recordPrepared(p: Prepared): void {
    upsert(this.data.prepared, p, (x) => x.item_key === p.item_key);
  }

  recordSnapshot(s: CodeSnapshot): void {
    this.data.code_snapshots.unshift(s);
    this.data.code_snapshots = this.data.code_snapshots.slice(0, 50);
  }

  recordRepoStatus(repo: string, status: { branch: string; sha: string; dirty: boolean; checked_at: string }): void {
    this.data.repo_status[repo] = status;
  }

  addLearning(note: string): void {
    if (note && !this.data.learnings.includes(note)) this.data.learnings.unshift(note);
    this.data.learnings = this.data.learnings.slice(0, 40);
  }

  // ── knowledge layer: raw signals (capture) ──────────────────────────────────

  /** Append a raw signal. Deduped on (kind, source_ref, text) so wiring the same
   *  capture point twice in one run cannot spam the inbox. */
  addSignal(s: Signal): void {
    const dup = this.data.signals.some(
      (x) => x.kind === s.kind && x.source_ref === s.source_ref && x.text === s.text,
    );
    if (!dup) this.data.signals.unshift(s);
    this.data.signals = this.data.signals.slice(0, 500);
  }

  /** Signals the distiller has not consumed yet. */
  pendingSignals(): Signal[] {
    return this.data.signals.filter((s) => !s.distilled);
  }

  markSignalsDistilled(ids: string[]): void {
    const set = new Set(ids);
    for (const s of this.data.signals) if (set.has(s.id)) s.distilled = true;
  }

  // ── knowledge layer: distilled learnings ────────────────────────────────────

  get knowledge(): Learning[] {
    return this.data.knowledge;
  }

  upsertLearning(l: Learning): void {
    upsert(this.data.knowledge, l, (x) => x.id === l.id);
  }

  setKnowledge(list: Learning[]): void {
    this.data.knowledge = list;
  }
}

function upsert<T>(arr: T[], item: T, match: (x: T) => boolean): void {
  const idx = arr.findIndex(match);
  if (idx >= 0) arr[idx] = item;
  else arr.unshift(item);
}

/** Read just the signals array off disk (empty if the file is missing/unreadable). */
function readDiskSignals(): Signal[] {
  try {
    const raw = JSON.parse(fs.readFileSync(BRAIN_FILE, "utf-8")) as Partial<Brain>;
    return raw.signals ?? [];
  } catch {
    return [];
  }
}

/**
 * Union two signal lists by id so a stale writer can't drop signals another
 * instance/process captured. In-memory wins the field values (it's the newer
 * intent), but `distilled` is OR-ed across both copies so neither a concurrent
 * capture nor markSignalsDistilled can undo the other. Newest first, capped at
 * 500 like addSignal. Pure — no I/O — so it is unit-testable.
 */
export function mergeSignals(memory: Signal[], onDisk: Signal[]): Signal[] {
  const byId = new Map<string, Signal>();
  for (const s of onDisk) byId.set(s.id, s);
  for (const s of memory) {
    const prev = byId.get(s.id);
    byId.set(s.id, prev ? { ...s, distilled: Boolean(s.distilled || prev.distilled) } : s);
  }
  return [...byId.values()]
    .sort((a, b) => (a.created_at < b.created_at ? 1 : a.created_at > b.created_at ? -1 : 0))
    .slice(0, 500);
}
