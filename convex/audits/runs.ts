/**
 * Audit pipeline mutations — called by tools/site-intelligence/src/
 * orchestrator.ts via ConvexHttpClient.
 */
import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireAdmin } from "../auth";

const ISO = () => new Date().toISOString();

export const upsertTarget = mutation({
  args: {
    adminToken: v.string(),
    name: v.string(),
    label: v.string(),
    origin: v.string(),
    description: v.optional(v.string()),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const existing = await ctx.db
      .query("audit_targets")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();
    const fields = {
      label: args.label,
      origin: args.origin,
      description: args.description ?? "",
      is_active: args.is_active ?? true,
    };
    if (existing) {
      await ctx.db.patch(existing._id, fields);
      return { id: existing._id, updated: true };
    }
    const id = await ctx.db.insert("audit_targets", {
      ...fields,
      name: args.name,
    });
    return { id, updated: false };
  },
});

export const startRun = mutation({
  args: {
    adminToken: v.string(),
    target_name: v.string(),
    audit_type: v.string(),
    trigger: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const target = await ctx.db
      .query("audit_targets")
      .withIndex("by_name", (q) => q.eq("name", args.target_name))
      .first();
    if (!target) throw new Error(`Unknown target: ${args.target_name}`);
    const id = await ctx.db.insert("audit_runs", {
      target_id: target._id,
      audit_type: args.audit_type,
      started_at: ISO(),
      finished_at: null,
      pages_scanned: 0,
      findings_total: 0,
      avg_score: 0,
      trigger: args.trigger ?? "cli",
      status: "running",
    });
    return { id };
  },
});

export const finishRun = mutation({
  args: {
    adminToken: v.string(),
    id: v.id("audit_runs"),
    status: v.string(),
    pages_scanned: v.optional(v.number()),
    findings_total: v.optional(v.number()),
    avg_score: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const patch: Record<string, unknown> = {
      finished_at: ISO(),
      status: args.status,
    };
    if (args.pages_scanned !== undefined)
      patch.pages_scanned = args.pages_scanned;
    if (args.findings_total !== undefined)
      patch.findings_total = args.findings_total;
    if (args.avg_score !== undefined) patch.avg_score = args.avg_score;
    await ctx.db.patch(args.id, patch);
    return { ok: true };
  },
});

export const addPage = mutation({
  args: {
    adminToken: v.string(),
    run_id: v.id("audit_runs"),
    url: v.string(),
    score: v.number(),
    metrics_json: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    await ctx.db.insert("audit_pages", {
      run_id: args.run_id,
      url: args.url,
      score: args.score,
      metrics_json: args.metrics_json ?? "{}",
    });
    return { ok: true };
  },
});

export const addFinding = mutation({
  args: {
    adminToken: v.string(),
    run_id: v.id("audit_runs"),
    url: v.string(),
    rule: v.string(),
    severity: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    await ctx.db.insert("audit_findings", {
      run_id: args.run_id,
      url: args.url,
      rule: args.rule,
      severity: args.severity,
      message: args.message,
    });
    return { ok: true };
  },
});

/**
 * Admin maintenance — wipe historical audit runs for a target older
 * than `beforeIso`. Used to scrub pre-existence noise (e.g.
 * status.digilist.no runs from before DNS was configured). Cascades
 * the deletion to that run's pages + findings.
 */
export const purgeRunsForTarget = mutation({
  args: {
    adminToken: v.string(),
    target_name: v.string(),
    beforeIso: v.string(),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const target = await ctx.db
      .query("audit_targets")
      .withIndex("by_name", (q) => q.eq("name", args.target_name))
      .first();
    if (!target) throw new Error(`Unknown target: ${args.target_name}`);
    const runs = await ctx.db
      .query("audit_runs")
      .withIndex("by_target_type", (q) => q.eq("target_id", target._id))
      .collect();
    let deletedRuns = 0;
    let deletedFindings = 0;
    let deletedPages = 0;
    for (const r of runs) {
      if (r.started_at >= args.beforeIso) continue;
      const findings = await ctx.db
        .query("audit_findings")
        .withIndex("by_run", (q) => q.eq("run_id", r._id))
        .collect();
      for (const f of findings) {
        await ctx.db.delete(f._id);
        deletedFindings++;
      }
      const pages = await ctx.db
        .query("audit_pages")
        .withIndex("by_run_url", (q) => q.eq("run_id", r._id))
        .collect();
      for (const p of pages) {
        await ctx.db.delete(p._id);
        deletedPages++;
      }
      await ctx.db.delete(r._id);
      deletedRuns++;
    }
    return { deletedRuns, deletedFindings, deletedPages };
  },
});
