/**
 * Async drop-in replacements for the db.ts write functions used by
 * orchestrator.ts. Each function takes the same shape of arguments
 * but writes to Convex via ConvexHttpClient instead of better-sqlite3.
 *
 * Every call passes `adminToken: adminToken()` as the first arg — the
 * Convex backend (convex/auth.ts) compares it to ADMIN_BASIC_AUTH_B64
 * on the deployment env and rejects on mismatch.
 */
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { adminToken, getConvex } from "./convex-client";
import type {
  AgentRecord,
  Brief,
  ContentRunPhase,
  CoverageRow,
  Draft,
  Keyword,
  KeywordCluster,
} from "./types";

export type ClusterId = Id<"keyword_clusters">;
export type BriefId = Id<"briefs">;
export type DraftId = Id<"drafts">;
export type RunId = Id<"content_runs">;

export async function upsertAgent(
  def: Omit<AgentRecord, "id" | "created_at" | "updated_at">,
): Promise<void> {
  await getConvex().mutation(api.content.agents.upsertAgent, {
    adminToken: adminToken(),
    slug: def.slug,
    name: def.name,
    role: def.role,
    description: def.description ?? "",
    status: def.status ?? "active",
    tier: def.tier ?? "v1",
    owner: def.owner ?? "",
    allowed_tools_json: JSON.stringify(def.allowed_tools ?? []),
    reports_to: def.reports_to ?? "",
    budget_usd_month: def.budget_usd_month ?? 0,
    risk_default: def.risk_default ?? "low",
    source: def.source ?? "content-agent",
  });
}

export async function startContentRun(
  phase: ContentRunPhase | "all",
  trigger: string,
): Promise<RunId> {
  const { id } = await getConvex().mutation(api.content.runs.start, {
    adminToken: adminToken(),
    phase,
    trigger,
  });
  return id as RunId;
}

export async function finishContentRun(
  runId: RunId,
  patch: {
    keywords_discovered: number;
    clusters_created: number;
    drafts_generated: number;
    drafts_published: number;
    log: string;
    status: "ok" | "error";
  },
): Promise<void> {
  await getConvex().mutation(api.content.runs.finish, {
    adminToken: adminToken(),
    id: runId,
    status: patch.status,
    keywords_discovered: patch.keywords_discovered,
    clusters_created: patch.clusters_created,
    drafts_generated: patch.drafts_generated,
    drafts_published: patch.drafts_published,
    log: patch.log,
  });
}

export async function logAgentAction(input: {
  agent_slug: string;
  run_id: RunId | null;
  kind: string;
  tool: string;
  input_summary: string;
  output_summary: string;
  trace_ref: string;
  risk: "low" | "med" | "high";
  requires_review: boolean;
  reviewed_at: string | null;
  reviewed_by: string | null;
  cost_usd: number;
  tokens_in: number;
  tokens_out: number;
}): Promise<void> {
  await getConvex().mutation(api.content.runs.logAction, {
    adminToken: adminToken(),
    agent_slug: input.agent_slug,
    run_id: input.run_id ?? undefined,
    kind: input.kind,
    tool: input.tool,
    input_summary: input.input_summary,
    output_summary: input.output_summary,
    trace_ref: input.trace_ref,
    risk: input.risk,
    requires_review: input.requires_review,
    cost_usd: input.cost_usd,
    tokens_in: input.tokens_in,
    tokens_out: input.tokens_out,
  });
}

export async function insertKeywords(
  rows: Array<Omit<Keyword, "id">>,
): Promise<number> {
  if (rows.length === 0) return 0;
  const BATCH = 20;
  let count = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    await Promise.all(
      batch.map((k) =>
        getConvex().mutation(api.content.keywords.upsertKeyword, {
          adminToken: adminToken(),
          term: k.term,
          normalized: k.normalized,
          source: k.source,
          score: k.score,
          region: k.region,
          language: k.language,
          metadata_json: k.metadata_json,
        }),
      ),
    );
    count += batch.length;
  }
  return count;
}

export interface RecentKeywordsOpts {
  sinceDays?: number;
  limit?: number;
}

export async function recentKeywords(
  opts: RecentKeywordsOpts = {},
): Promise<Keyword[]> {
  const rows = (await getConvex().query(api.content.keywords.listRecent, {
    adminToken: adminToken(),
    sinceDays: opts.sinceDays,
    limit: opts.limit,
  })) as Array<Keyword & { _id: string }>;
  return rows.map((r) => ({ ...r, id: hashId(r._id) }));
}

export async function insertCluster(
  c: Omit<KeywordCluster, "id">,
): Promise<ClusterId> {
  const { id } = await getConvex().mutation(api.content.keywords.createCluster, {
    adminToken: adminToken(),
    label: c.label,
    centroid_term: c.centroid_term,
    member_ids_json: JSON.stringify(c.member_ids ?? []),
    composite_score: c.composite_score,
    topic_summary: c.topic_summary,
  });
  return id as ClusterId;
}

export async function upsertCoverage(cov: CoverageRow): Promise<void> {
  await getConvex().mutation(api.content.keywords.upsertCoverage, {
    adminToken: adminToken(),
    cluster_id: cov.cluster_id as unknown as ClusterId,
    gap_score: cov.gap_score,
    best_match_url: cov.best_match_url ?? null,
    best_match_score: cov.best_match_score,
  });
}

export async function insertBrief(
  b: Omit<Brief, "id" | "cluster_id"> & { cluster_id: ClusterId },
): Promise<BriefId> {
  const { id } = await getConvex().mutation(api.content.agents.createBrief, {
    adminToken: adminToken(),
    cluster_id: b.cluster_id,
    channel: b.channel,
    audience: b.audience,
    angle: b.angle,
    outline_json: b.outline_json,
    cta: b.cta,
    model: b.model,
  });
  return id as BriefId;
}

export async function insertDraft(
  d: Omit<Draft, "id" | "brief_id"> & { brief_id: BriefId },
): Promise<DraftId> {
  const { id } = await getConvex().mutation(api.content.drafts.create, {
    adminToken: adminToken(),
    brief_id: d.brief_id,
    channel: d.channel,
    title: d.title,
    body: d.body,
    frontmatter_json: d.frontmatter_json,
    hashtags_json: d.hashtags_json,
    model: d.model,
  });
  return id as DraftId;
}

/** Overwrite a draft's body (used to apply the deep-review rewrite). */
export async function editDraftBody(
  id: DraftId,
  body: string,
  title?: string,
): Promise<void> {
  await getConvex().mutation(api.content.drafts.edit, {
    adminToken: adminToken(),
    id,
    body,
    ...(title ? { title } : {}),
  });
}

/** Reject a draft so the auto-publish gate skips it (deep-review verdict). */
export async function rejectDraft(id: DraftId, note: string): Promise<void> {
  await getConvex().mutation(api.content.drafts.reject, {
    adminToken: adminToken(),
    id,
    reviewer: "content-review",
    note: note.slice(0, 500),
  });
}

export interface ClusterWithCoverage
  extends Omit<KeywordCluster, "id"> {
  id: ClusterId;
  coverage: CoverageRow | null;
}

export async function listClustersWithCoverage(
  _limit: number,
): Promise<ClusterWithCoverage[]> {
  const snap = (await getConvex().query(api.content.state.snapshot, {
    adminToken: adminToken(),
  })) as {
    clusters: Array<{
      _id?: ClusterId;
      id: number;
      label: string;
      centroid_term: string;
      composite_score: number;
      topic_summary: string;
      coverage: {
        gap_score: number;
        best_match_url: string | null;
        best_match_score: number;
      } | null;
    }>;
  };
  return snap.clusters.map((c) => ({
    id: (c._id ?? (c.id as unknown as ClusterId)) as ClusterId,
    label: c.label,
    centroid_term: c.centroid_term,
    member_ids: [],
    composite_score: c.composite_score,
    topic_summary: c.topic_summary,
    created_at: new Date().toISOString(),
    coverage: c.coverage
      ? ({
          cluster_id: 0,
          gap_score: c.coverage.gap_score,
          best_match_url: c.coverage.best_match_url,
          best_match_score: c.coverage.best_match_score,
        } satisfies CoverageRow)
      : null,
  }));
}

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function normalizeTerm(term: string): string {
  return term
    .normalize("NFC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}
