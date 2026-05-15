/**
 * Keyword + cluster mutations called by the discover/analyze phases
 * (tools/content-agent/src/sources.ts, analyze.ts) via ConvexHttpClient.
 */
import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { requireAdmin } from "../auth";

const ISO = () => new Date().toISOString();

export const upsertKeyword = mutation({
  args: {
    adminToken: v.string(),
    term: v.string(),
    normalized: v.string(),
    source: v.string(),
    score: v.number(),
    region: v.optional(v.string()),
    language: v.optional(v.string()),
    metadata_json: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const existing = await ctx.db
      .query("keywords")
      .withIndex("by_normalized_source", (q) =>
        q.eq("normalized", args.normalized).eq("source", args.source),
      )
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        score: args.score,
        sampled_at: ISO(),
        metadata_json: args.metadata_json ?? existing.metadata_json,
      });
      return { id: existing._id, updated: true };
    }
    const id = await ctx.db.insert("keywords", {
      term: args.term,
      normalized: args.normalized,
      source: args.source,
      sampled_at: ISO(),
      score: args.score,
      region: args.region ?? "NO",
      language: args.language ?? "no",
      metadata_json: args.metadata_json ?? "{}",
    });
    return { id, updated: false };
  },
});

export const createCluster = mutation({
  args: {
    adminToken: v.string(),
    label: v.string(),
    centroid_term: v.string(),
    member_ids_json: v.string(),
    composite_score: v.number(),
    topic_summary: v.string(),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const id = await ctx.db.insert("keyword_clusters", {
      label: args.label,
      centroid_term: args.centroid_term,
      member_ids_json: args.member_ids_json,
      composite_score: args.composite_score,
      topic_summary: args.topic_summary,
      created_at: ISO(),
    });
    return { id };
  },
});

export const upsertCoverage = mutation({
  args: {
    adminToken: v.string(),
    cluster_id: v.id("keyword_clusters"),
    gap_score: v.number(),
    best_match_url: v.union(v.string(), v.null()),
    best_match_score: v.number(),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const existing = await ctx.db
      .query("coverage")
      .withIndex("by_cluster", (q) => q.eq("cluster_id", args.cluster_id))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        gap_score: args.gap_score,
        best_match_url: args.best_match_url,
        best_match_score: args.best_match_score,
        computed_at: ISO(),
      });
      return { id: existing._id, updated: true };
    }
    const id = await ctx.db.insert("coverage", {
      cluster_id: args.cluster_id,
      gap_score: args.gap_score,
      best_match_url: args.best_match_url,
      best_match_score: args.best_match_score,
      computed_at: ISO(),
    });
    return { id, updated: false };
  },
});

export const listRecent = query({
  args: { adminToken: v.string(), sinceDays: v.optional(v.number()), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const days = args.sinceDays ?? 14;
    const limit = args.limit ?? 200;
    const cutoff = new Date(Date.now() - days * 86400_000).toISOString();
    const rows = await ctx.db
      .query("keywords")
      .withIndex("by_sampled_at")
      .order("desc")
      .take(limit);
    return rows.filter((k) => k.sampled_at >= cutoff);
  },
});
