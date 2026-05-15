/**
 * Shared types for the Digilist content agent ("Paperclip").
 *
 * The pipeline has four phases:
 *   discover → analyze → generate → publish
 *
 * Each phase reads/writes the SQLite store in tools/content-agent/reports/.
 */

export type KeywordSource =
  | "gtrends"      // Google Trends rising queries (NO region)
  | "reddit"       // r/Norge, r/kommune, r/Lillestrom, etc.
  | "hackernews"   // HN front page, ranked by score
  | "rss"          // industry RSS (digi.no, kommunal-rapport, regjeringen.no)
  | "serpapi"      // SerpAPI keyword volume + SERP gap (paid)
  | "seed-expand"; // user seed list → Claude re-rank + expand

export type Channel = "blog" | "linkedin" | "x";

export type DraftStatus =
  | "pending"   // generated, awaiting human review
  | "approved"  // approved, queued for publish
  | "rejected"  // human said no — kept for retraining the prompts
  | "published" // actually went out
  | "failed";   // publish attempt errored

export type ContentRunPhase =
  | "discover"
  | "analyze"
  | "generate"
  | "publish";

export interface Keyword {
  id: number;
  term: string;
  normalized: string;        // lowercased, NFC, trimmed — for dedup
  source: KeywordSource;
  sampled_at: string;        // ISO timestamp when this datapoint was captured
  score: number;             // source-relative 0–100 (rising rank, HN points, etc.)
  region: string;            // "NO", "NO-OS", "GLOBAL"
  language: string;          // "no", "en"
  metadata_json: string;     // source-specific extra fields
}

export interface KeywordCluster {
  id: number;
  label: string;             // human label ("kommunal cybersikkerhet")
  centroid_term: string;     // best representative term
  member_ids: number[];      // keyword.id[]
  composite_score: number;   // 0–100, gap-weighted
  topic_summary: string;     // 1-paragraph LLM summary of the cluster
  created_at: string;
}

export interface CoverageRow {
  cluster_id: number;
  /**
   * 0  → no existing content covers this cluster (max opportunity)
   * 100 → site fully covers this cluster (skip)
   */
  gap_score: number;
  best_match_url: string | null;   // most-relevant existing page if any
  best_match_score: number;        // 0..1 cosine-ish similarity
}

export interface Brief {
  id: number;
  cluster_id: number;
  channel: Channel;
  audience: string;          // "kommunal IT-leder", "innbygger", etc.
  angle: string;             // 1-sentence editorial angle
  outline_json: string;      // [{heading, bullets:[]}, ...] for blog; tweet-thread struct for X
  cta: string;               // "Book demo", "Les whitepaper", etc.
  created_at: string;
  model: string;             // claude model id that generated this brief
}

export interface Draft {
  id: number;
  brief_id: number;
  channel: Channel;
  title: string;
  body: string;              // full markdown (blog) / plain text (linkedin/x)
  frontmatter_json: string;  // blog only — slug, tag, keywords, cover, etc.
  hashtags_json: string;     // ["#kommune", "#booking"]
  status: DraftStatus;
  reviewer_notes: string;
  created_at: string;
  approved_at: string | null;
  published_at: string | null;
  published_url: string | null;
  external_id: string | null;  // LinkedIn URN / X tweet id
  model: string;
}

export interface PublishConnection {
  id: number;
  provider: "linkedin" | "x";
  status: "disconnected" | "connected" | "expired";
  account_handle: string;     // "@digilistno" / "Digilist AS"
  account_urn: string;        // LinkedIn person/org URN, X user id
  scopes: string;
  token_expires_at: string | null;
  last_checked_at: string;
}

export interface ContentRun {
  id: number;
  phase: ContentRunPhase | "all";
  started_at: string;
  finished_at: string | null;
  trigger: "cli" | "dashboard" | "cron";
  status: "running" | "ok" | "error";
  keywords_discovered: number;
  clusters_created: number;
  drafts_generated: number;
  drafts_published: number;
  log: string;
}

// ─────────────────────────────────────────────────────────────
// Agent harness governance

export type AgentTier = "v1" | "v1plus" | "deferred";
export type AgentStatus = "active" | "paused" | "deferred";
export type RiskLevel = "low" | "med" | "high";

export interface AgentRecord {
  id: number;
  slug: string;
  name: string;
  role: string;
  description: string;
  status: AgentStatus;
  tier: AgentTier;
  owner: string;
  allowed_tools: string[];
  reports_to: string;
  budget_usd_month: number;
  risk_default: RiskLevel;
  source: string;          // "content-agent" | "site-intelligence" | external
  created_at: string;
  updated_at: string;
}

export type AgentActionKind =
  | "tool-call"
  | "recommendation"
  | "draft"
  | "publish"
  | "task";

export interface AgentAction {
  id: number;
  agent_slug: string;
  run_id: number | null;
  kind: AgentActionKind;
  tool: string;
  input_summary: string;
  output_summary: string;
  trace_ref: string;
  risk: RiskLevel;
  requires_review: boolean;
  reviewed_at: string | null;
  reviewed_by: string | null;
  cost_usd: number;
  tokens_in: number;
  tokens_out: number;
  created_at: string;
}

export type TaskCategory =
  | "dev"
  | "content"
  | "security"
  | "wcag"
  | "seo";

export type TaskStatus = "open" | "in_progress" | "done" | "wontfix";

export interface AgentTask {
  id: number;
  source_agent: string;
  category: TaskCategory;
  title: string;
  summary: string;
  acceptance: string[];
  test_scenarios: string[];
  trace_ref: string;
  priority: "low" | "med" | "high";
  status: TaskStatus;
  github_issue_url: string | null;
  created_at: string;
  closed_at: string | null;
}
