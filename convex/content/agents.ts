/**
 * Agent catalog mutations + briefs/connections/tasks helpers.
 * Bundled together because each is small and the dashboard reads
 * them all via the snapshot query.
 */
import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireAdmin } from "../auth";

const ISO = () => new Date().toISOString();

export const upsertAgent = mutation({
  args: {
    adminToken: v.string(),
    slug: v.string(),
    name: v.string(),
    role: v.string(),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    tier: v.optional(v.string()),
    owner: v.optional(v.string()),
    allowed_tools_json: v.optional(v.string()),
    reports_to: v.optional(v.string()),
    budget_usd_month: v.optional(v.number()),
    risk_default: v.optional(v.string()),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const existing = await ctx.db
      .query("agents")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    const now = ISO();
    const fields = {
      name: args.name,
      role: args.role,
      description: args.description ?? "",
      status: args.status ?? "active",
      tier: args.tier ?? "v1",
      owner: args.owner ?? "",
      allowed_tools_json: args.allowed_tools_json ?? "[]",
      reports_to: args.reports_to ?? "",
      budget_usd_month: args.budget_usd_month ?? 0,
      risk_default: args.risk_default ?? "low",
      source: args.source ?? "content-agent",
      updated_at: now,
    };
    if (existing) {
      await ctx.db.patch(existing._id, fields);
      return { id: existing._id, updated: true };
    }
    const id = await ctx.db.insert("agents", {
      ...fields,
      slug: args.slug,
      created_at: now,
    });
    return { id, updated: false };
  },
});

export const upsertConnection = mutation({
  args: {
    adminToken: v.string(),
    provider: v.string(),
    status: v.string(),
    account_handle: v.optional(v.string()),
    account_urn: v.optional(v.string()),
    scopes: v.optional(v.string()),
    token_expires_at: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const existing = await ctx.db
      .query("publish_connections")
      .withIndex("by_provider", (q) => q.eq("provider", args.provider))
      .first();
    const fields = {
      status: args.status,
      account_handle: args.account_handle ?? "",
      account_urn: args.account_urn ?? "",
      scopes: args.scopes ?? "",
      token_expires_at: args.token_expires_at ?? null,
      last_checked_at: ISO(),
    };
    if (existing) {
      await ctx.db.patch(existing._id, fields);
      return { id: existing._id, updated: true };
    }
    const id = await ctx.db.insert("publish_connections", {
      ...fields,
      provider: args.provider,
    });
    return { id, updated: false };
  },
});

export const createTask = mutation({
  args: {
    adminToken: v.string(),
    source_agent: v.optional(v.string()),
    category: v.string(),
    title: v.string(),
    summary: v.optional(v.string()),
    acceptance_json: v.optional(v.string()),
    test_scenarios_json: v.optional(v.string()),
    trace_ref: v.optional(v.string()),
    priority: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const id = await ctx.db.insert("tasks", {
      source_agent: args.source_agent ?? "manual",
      category: args.category,
      title: args.title,
      summary: args.summary ?? "",
      acceptance_json: args.acceptance_json ?? "[]",
      test_scenarios_json: args.test_scenarios_json ?? "[]",
      trace_ref: args.trace_ref ?? "",
      priority: args.priority ?? "med",
      status: "open",
      github_issue_url: null,
      created_at: ISO(),
      closed_at: null,
    });
    return { id };
  },
});

export const updateTaskStatus = mutation({
  args: {
    adminToken: v.string(),
    id: v.id("tasks"),
    status: v.string(),
    github_issue_url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const patch: Record<string, unknown> = { status: args.status };
    if (args.status === "done" || args.status === "wontfix") {
      patch.closed_at = ISO();
    }
    if (args.github_issue_url !== undefined) {
      patch.github_issue_url = args.github_issue_url;
    }
    await ctx.db.patch(args.id, patch);
    return { ok: true };
  },
});

export const createBrief = mutation({
  args: {
    adminToken: v.string(),
    cluster_id: v.id("keyword_clusters"),
    channel: v.string(),
    audience: v.string(),
    angle: v.string(),
    outline_json: v.string(),
    cta: v.optional(v.string()),
    model: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const id = await ctx.db.insert("briefs", {
      cluster_id: args.cluster_id,
      channel: args.channel,
      audience: args.audience,
      angle: args.angle,
      outline_json: args.outline_json,
      cta: args.cta ?? "",
      created_at: ISO(),
      model: args.model ?? "",
    });
    return { id };
  },
});
