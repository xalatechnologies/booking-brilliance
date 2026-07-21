/**
 * SEO run history — one summary row per seo-agent run, written by the fleet's
 * tools/seo-agent (tools/seo-agent/src/convex-mirror.ts) via ConvexHttpClient,
 * and read by the /admin/intelligence SEO history view.
 *
 * Same admin-token convention as convex/audits/runs.ts: the caller sends
 * base64(ADMIN_BASIC_AUTH) as `adminToken`; `requireAdmin` compares it to the
 * deployment's ADMIN_BASIC_AUTH_B64 env var.
 */
import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { requireAdmin } from "../auth";

/** Record one SEO run's summary (crawl score + SERP + AEO baselines). */
export const recordRun = mutation({
  args: {
    adminToken: v.string(),
    origin: v.string(),
    run_at: v.string(),
    avg_score: v.number(),
    pages_scanned: v.number(),
    findings_total: v.number(),
    serp_keywords_tracked: v.number(),
    serp_our_top10: v.number(),
    aeo_brand_mention_rate: v.union(v.number(), v.null()),
    aeo_citation_rate: v.union(v.number(), v.null()),
    aeo_share_of_voice: v.union(v.number(), v.null()),
    aeo_queries: v.union(v.number(), v.null()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const { adminToken: _t, ...row } = args;
    return await ctx.db.insert("seo_runs", row);
  },
});

/** Most-recent SEO runs, newest first — the dashboard's SEO history feed. */
export const history = query({
  args: { adminToken: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    return await ctx.db
      .query("seo_runs")
      .withIndex("by_run_at")
      .order("desc")
      .take(args.limit ?? 60);
  },
});
