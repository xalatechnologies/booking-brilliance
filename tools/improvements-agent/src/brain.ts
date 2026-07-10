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
  prepared_at: string;
}

export interface CodeSnapshot {
  project: string;
  repo: string;
  nodes: number;
  edges: number;
  git_sha: string;
  indexed_at: string;
}

export interface Brain {
  items: BrainItem[];
  verdicts: Verdict[];
  improvements: Improvement[];
  prepared: Prepared[];
  code_snapshots: CodeSnapshot[];
  repo_status: Record<string, { branch: string; sha: string; dirty: boolean; checked_at: string }>;
  learnings: string[];
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
      return new OpenBrain({ ...EMPTY, ...raw, repo_status: raw.repo_status ?? {} });
    } catch {
      return new OpenBrain(structuredClone(EMPTY));
    }
  }

  save(nowIso: string): void {
    this.data.updated_at = nowIso;
    fs.mkdirSync(BRAIN_DIR, { recursive: true });
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
}

function upsert<T>(arr: T[], item: T, match: (x: T) => boolean): void {
  const idx = arr.findIndex(match);
  if (idx >= 0) arr[idx] = item;
  else arr.unshift(item);
}
