/**
 * Draft mutations — approve, reject, edit, publish.
 *
 * Replaces tools/content-agent/src/cli.ts approve/reject/edit/publish
 * commands. The publish action is split: the mutation only flips
 * status, while actual external posting (LinkedIn UGC, X tweets, blog
 * file write) lives in `publish.ts` as a Convex action because it
 * needs `fetch` and isn't a deterministic mutation.
 */
import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { requireAdmin } from "../auth";

const ISO = () => new Date().toISOString();

// ─────────────────────────────────────────────────────────────
// list + get

export const listByStatus = query({
  args: {
    adminToken: v.string(),
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const limit = args.limit ?? 100;
    if (args.status) {
      return await ctx.db
        .query("drafts")
        .withIndex("by_status_created", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(limit);
    }
    return await ctx.db.query("drafts").order("desc").take(limit);
  },
});

export const get = query({
  args: { adminToken: v.string(), id: v.id("drafts") },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    return await ctx.db.get(args.id);
  },
});

// ─────────────────────────────────────────────────────────────
// create — called by tools/content-agent/src/generate.ts

export const create = mutation({
  args: {
    adminToken: v.string(),
    brief_id: v.id("briefs"),
    channel: v.string(),
    title: v.string(),
    body: v.string(),
    frontmatter_json: v.optional(v.string()),
    hashtags_json: v.optional(v.string()),
    model: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const id = await ctx.db.insert("drafts", {
      brief_id: args.brief_id,
      channel: args.channel,
      title: args.title,
      body: args.body,
      frontmatter_json: args.frontmatter_json ?? "{}",
      hashtags_json: args.hashtags_json ?? "[]",
      status: "pending",
      reviewer_notes: "",
      created_at: ISO(),
      approved_at: null,
      published_at: null,
      published_url: null,
      external_id: null,
      model: args.model ?? "",
    });
    return { id };
  },
});

// ─────────────────────────────────────────────────────────────
// approve / reject / edit

export const approve = mutation({
  args: {
    adminToken: v.string(),
    id: v.id("drafts"),
    reviewer: v.optional(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const draft = await ctx.db.get(args.id);
    if (!draft) throw new Error(`Draft ${args.id} not found`);
    const now = ISO();
    await ctx.db.patch(args.id, {
      status: "approved",
      approved_at: now,
      reviewer_notes: args.note ?? "",
    });
    await ctx.db.insert("agent_actions", {
      agent_slug: "approval-queue",
      run_id: null,
      kind: "recommendation",
      tool: "drafts:approve",
      input_summary: `draft:${args.id} channel=${draft.channel}`,
      output_summary: "approved",
      trace_ref: `draft:${args.id}`,
      risk: "med",
      requires_review: false,
      reviewed_at: now,
      reviewed_by: args.reviewer ?? "admin",
      cost_usd: 0,
      tokens_in: 0,
      tokens_out: 0,
      created_at: now,
    });
    return { ok: true };
  },
});

export const reject = mutation({
  args: {
    adminToken: v.string(),
    id: v.id("drafts"),
    reviewer: v.optional(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const draft = await ctx.db.get(args.id);
    if (!draft) throw new Error(`Draft ${args.id} not found`);
    const now = ISO();
    await ctx.db.patch(args.id, {
      status: "rejected",
      reviewer_notes: args.note ?? "",
    });
    await ctx.db.insert("agent_actions", {
      agent_slug: "approval-queue",
      run_id: null,
      kind: "recommendation",
      tool: "drafts:reject",
      input_summary: `draft:${args.id}`,
      output_summary: `rejected: ${(args.note ?? "").slice(0, 80)}`,
      trace_ref: `draft:${args.id}`,
      risk: "low",
      requires_review: false,
      reviewed_at: now,
      reviewed_by: args.reviewer ?? "admin",
      cost_usd: 0,
      tokens_in: 0,
      tokens_out: 0,
      created_at: now,
    });
    return { ok: true };
  },
});

export const edit = mutation({
  args: {
    adminToken: v.string(),
    id: v.id("drafts"),
    title: v.optional(v.string()),
    body: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const draft = await ctx.db.get(args.id);
    if (!draft) throw new Error(`Draft ${args.id} not found`);
    if (args.title === undefined && args.body === undefined) {
      throw new Error("nothing to edit (need --title or --body)");
    }
    const patch: { title?: string; body?: string } = {};
    if (args.title !== undefined) patch.title = args.title;
    if (args.body !== undefined) patch.body = args.body;
    await ctx.db.patch(args.id, patch);
    return { ok: true };
  },
});

// ─────────────────────────────────────────────────────────────
// publish — called by the publish action after it succeeds/fails

export const markPublished = mutation({
  args: {
    adminToken: v.string(),
    id: v.id("drafts"),
    externalId: v.optional(v.string()),
    externalUrl: v.optional(v.string()),
    reviewer: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const draft = await ctx.db.get(args.id);
    if (!draft) throw new Error(`Draft ${args.id} not found`);
    if (draft.status !== "approved") {
      throw new Error(
        `Draft ${args.id} is not approved (status=${draft.status})`,
      );
    }
    const now = ISO();
    await ctx.db.patch(args.id, {
      status: "published",
      published_at: now,
      published_url: args.externalUrl ?? null,
      external_id: args.externalId ?? null,
    });
    await ctx.db.insert("agent_actions", {
      agent_slug: "approval-queue",
      run_id: null,
      kind: "publish",
      tool: `publish:${draft.channel}`,
      input_summary: `draft:${args.id}`,
      output_summary: `published → ${args.externalUrl ?? args.externalId ?? "ok"}`,
      trace_ref: `draft:${args.id}`,
      risk: "high",
      requires_review: false,
      reviewed_at: now,
      reviewed_by: args.reviewer ?? "admin",
      cost_usd: 0,
      tokens_in: 0,
      tokens_out: 0,
      created_at: now,
    });
    return { ok: true };
  },
});

export const markPublishFailed = mutation({
  args: {
    adminToken: v.string(),
    id: v.id("drafts"),
    error: v.string(),
    errorCode: v.optional(v.string()),
    reviewer: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const draft = await ctx.db.get(args.id);
    if (!draft) throw new Error(`Draft ${args.id} not found`);
    const now = ISO();
    // We deliberately do NOT flip status to "failed" — keep it as
    // "approved" so a human can retry publish without re-approving.
    await ctx.db.insert("agent_actions", {
      agent_slug: "approval-queue",
      run_id: null,
      kind: "publish",
      tool: `publish:${draft.channel}`,
      input_summary: `draft:${args.id}`,
      output_summary: `failed: ${args.errorCode ?? "unknown"} — ${args.error.slice(0, 120)}`,
      trace_ref: `draft:${args.id}`,
      risk: "high",
      requires_review: true,
      reviewed_at: null,
      reviewed_by: null,
      cost_usd: 0,
      tokens_in: 0,
      tokens_out: 0,
      created_at: now,
    });
    return { ok: false, error: args.error };
  },
});
