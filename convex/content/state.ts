/**
 * Reactive snapshot — replaces `/api/content/state` + the JSON file
 * at /var/www/digilist-audit/content-snapshot.json.
 *
 * Returns the exact shape that ContentSnapshot in
 * src/pages/admin/IntelligenceVekst.tsx already consumes, so the
 * dashboard migration is a hook-swap rather than a type rewrite.
 *
 * Because this is a Convex `query`, every Vekst page that calls
 * `useQuery(api.content.state.snapshot)` auto-updates the moment any
 * mutation changes any table read here. No more polling, no race.
 */
import { v } from "convex/values";
import { query } from "../_generated/server";
import { requireAdmin } from "../auth";

export const snapshot = query({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);

    const [
      agentsRaw,
      clustersRaw,
      coverageRows,
      pendingD,
      approvedD,
      publishedD,
      rejectedD,
      runsRaw,
      actionsRaw,
      connectionsRaw,
      tasksRaw,
      keywordsRaw,
    ] = await Promise.all([
      ctx.db.query("agents").collect(),
      ctx.db.query("keyword_clusters").take(100),
      ctx.db.query("coverage").collect(),
      ctx.db
        .query("drafts")
        .withIndex("by_status_created", (q) => q.eq("status", "pending"))
        .order("desc")
        .take(100),
      ctx.db
        .query("drafts")
        .withIndex("by_status_created", (q) => q.eq("status", "approved"))
        .order("desc")
        .take(50),
      ctx.db
        .query("drafts")
        .withIndex("by_status_created", (q) => q.eq("status", "published"))
        .order("desc")
        .take(50),
      ctx.db
        .query("drafts")
        .withIndex("by_status_created", (q) => q.eq("status", "rejected"))
        .order("desc")
        .take(50),
      ctx.db.query("content_runs").withIndex("by_started").order("desc").take(30),
      ctx.db.query("agent_actions").withIndex("by_created").order("desc").take(200),
      ctx.db.query("publish_connections").collect(),
      ctx.db.query("tasks").withIndex("by_created").order("desc").take(200),
      ctx.db
        .query("keywords")
        .withIndex("by_sampled_at")
        .order("desc")
        .take(200),
    ]);

    // monthly spend per agent — sum cost_usd of last-30d actions
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400_000).toISOString();
    const spend: Record<string, number> = {};
    for (const a of actionsRaw) {
      if (a.created_at < thirtyDaysAgo) continue;
      spend[a.agent_slug] = (spend[a.agent_slug] ?? 0) + (a.cost_usd ?? 0);
    }

    const agents = agentsRaw.map((a) => ({
      slug: a.slug,
      name: a.name,
      role: a.role,
      description: a.description,
      status: a.status,
      tier: a.tier as "v1" | "v1plus" | "deferred",
      owner: a.owner,
      allowed_tools: safeJsonArray(a.allowed_tools_json),
      reports_to: a.reports_to,
      budget_usd_month: a.budget_usd_month,
      risk_default: a.risk_default as "low" | "med" | "high",
      source: a.source,
      monthly_spend_usd: spend[a.slug] ?? 0,
    }));

    const coverageByCluster = new Map(
      coverageRows.map((c) => [c.cluster_id, c]),
    );
    const clusters = clustersRaw.map((c) => {
      const cov = coverageByCluster.get(c._id);
      return {
        id: legacyOrLocal(c.legacyId, c._id),
        label: c.label,
        centroid_term: c.centroid_term,
        composite_score: c.composite_score,
        topic_summary: c.topic_summary,
        coverage: cov
          ? {
              gap_score: cov.gap_score,
              best_match_url: cov.best_match_url,
              best_match_score: cov.best_match_score,
            }
          : null,
      };
    });

    const mapDraft = (d: typeof pendingD[number]) => ({
      id: legacyOrLocal(d.legacyId, d._id),
      _id: d._id, // keep the real Convex id so the dashboard can call mutations
      brief_id: 0, // legacy field — clients don't use it for display
      channel: d.channel as "blog" | "linkedin" | "x",
      title: d.title,
      body: d.body,
      hashtags_json: d.hashtags_json,
      status: d.status as
        | "pending"
        | "approved"
        | "rejected"
        | "published"
        | "failed",
      reviewer_notes: d.reviewer_notes,
      created_at: d.created_at,
      approved_at: d.approved_at,
      published_at: d.published_at,
      published_url: d.published_url,
      model: d.model,
    });

    const mapRun = (r: typeof runsRaw[number]) => ({
      id: legacyOrLocal(r.legacyId, r._id),
      phase: r.phase,
      started_at: r.started_at,
      finished_at: r.finished_at,
      trigger: r.trigger,
      status: r.status,
      keywords_discovered: r.keywords_discovered,
      clusters_created: r.clusters_created,
      drafts_generated: r.drafts_generated,
    });

    const mapAction = (a: typeof actionsRaw[number]) => ({
      id: a._id as unknown as number,
      agent_slug: a.agent_slug,
      run_id: a.run_id as unknown as number | null,
      kind: a.kind,
      tool: a.tool,
      input_summary: a.input_summary,
      output_summary: a.output_summary,
      trace_ref: a.trace_ref,
      risk: a.risk as "low" | "med" | "high",
      requires_review: a.requires_review,
      reviewed_at: a.reviewed_at,
      cost_usd: a.cost_usd,
      tokens_in: a.tokens_in,
      tokens_out: a.tokens_out,
      created_at: a.created_at,
    });

    // recent keywords (last 14d)
    const fourteenDaysAgo = new Date(Date.now() - 14 * 86400_000).toISOString();
    const recentKeywords = keywordsRaw
      .filter((k) => k.sampled_at >= fourteenDaysAgo)
      .map((k) => ({
        id: legacyOrLocal(k.legacyId, k._id),
        term: k.term,
        source: k.source,
        score: k.score,
        region: k.region,
        sampled_at: k.sampled_at,
      }));

    return {
      generatedAt: new Date().toISOString(),
      agents,
      clusters,
      drafts: {
        pending: pendingD.map(mapDraft),
        approved: approvedD.map(mapDraft),
        published: publishedD.map(mapDraft),
        rejected: rejectedD.map(mapDraft),
      },
      keywords: { recent: recentKeywords },
      runs: runsRaw.map(mapRun),
      actions: actionsRaw.map(mapAction),
      connections: connectionsRaw.map((c) => ({
        provider: c.provider as "linkedin" | "x",
        status: c.status as "disconnected" | "connected" | "expired",
        account_handle: c.account_handle,
        scopes: c.scopes,
        token_expires_at: c.token_expires_at,
        last_checked_at: c.last_checked_at,
      })),
      tasks: tasksRaw.map((t) => ({
        id: t._id as unknown as number,
        source_agent: t.source_agent,
        category: t.category,
        title: t.title,
        priority: t.priority,
        status: t.status,
      })),
    };
  },
});

function safeJsonArray(s: string): string[] {
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

function legacyOrLocal(legacy: number | undefined, id: string): number {
  // During the migration window we serve the SQLite legacy id when
  // present so existing dashboard URLs/links don't break. New rows
  // get a stable numeric hash from the Convex id; this is only used
  // for display, never for cross-references.
  if (typeof legacy === "number") return legacy;
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}
