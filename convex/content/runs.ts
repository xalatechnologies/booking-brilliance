/**
 * Pipeline run tracking — called by tools/content-agent/src/orchestrator.ts
 * at the start/end of each phase.
 */
import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireAdmin } from "../auth";

const ISO = () => new Date().toISOString();

export const start = mutation({
  args: {
    adminToken: v.string(),
    phase: v.string(),
    trigger: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const id = await ctx.db.insert("content_runs", {
      phase: args.phase,
      started_at: ISO(),
      finished_at: null,
      trigger: args.trigger ?? "cli",
      status: "running",
      keywords_discovered: 0,
      clusters_created: 0,
      drafts_generated: 0,
      drafts_published: 0,
      log: "",
    });
    return { id };
  },
});

export const finish = mutation({
  args: {
    adminToken: v.string(),
    id: v.id("content_runs"),
    status: v.string(), // ok | error
    keywords_discovered: v.optional(v.number()),
    clusters_created: v.optional(v.number()),
    drafts_generated: v.optional(v.number()),
    drafts_published: v.optional(v.number()),
    log: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const patch: Record<string, unknown> = {
      finished_at: ISO(),
      status: args.status,
    };
    if (args.keywords_discovered !== undefined)
      patch.keywords_discovered = args.keywords_discovered;
    if (args.clusters_created !== undefined)
      patch.clusters_created = args.clusters_created;
    if (args.drafts_generated !== undefined)
      patch.drafts_generated = args.drafts_generated;
    if (args.drafts_published !== undefined)
      patch.drafts_published = args.drafts_published;
    if (args.log !== undefined) patch.log = args.log;
    await ctx.db.patch(args.id, patch);
    return { ok: true };
  },
});

export const logAction = mutation({
  args: {
    adminToken: v.string(),
    agent_slug: v.string(),
    run_id: v.optional(v.id("content_runs")),
    kind: v.string(),
    tool: v.optional(v.string()),
    input_summary: v.optional(v.string()),
    output_summary: v.optional(v.string()),
    trace_ref: v.optional(v.string()),
    risk: v.optional(v.string()),
    requires_review: v.optional(v.boolean()),
    cost_usd: v.optional(v.number()),
    tokens_in: v.optional(v.number()),
    tokens_out: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const id = await ctx.db.insert("agent_actions", {
      agent_slug: args.agent_slug,
      run_id: args.run_id ?? null,
      kind: args.kind,
      tool: args.tool ?? "",
      input_summary: args.input_summary ?? "",
      output_summary: args.output_summary ?? "",
      trace_ref: args.trace_ref ?? "",
      risk: args.risk ?? "low",
      requires_review: args.requires_review ?? false,
      reviewed_at: null,
      reviewed_by: null,
      cost_usd: args.cost_usd ?? 0,
      tokens_in: args.tokens_in ?? 0,
      tokens_out: args.tokens_out ?? 0,
      created_at: ISO(),
    });
    return { id };
  },
});
