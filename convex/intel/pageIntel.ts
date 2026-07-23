/**
 * Website Intelligence Graph — the page-object store (XAL-686, phase 1).
 *
 * Every page is ONE row carrying all disciplines' signals. Each agent upserts
 * only its own slice (seo | aeo | a11y | perf | security | business) via
 * `upsertPageSignal`, so writers never clobber each other and the row grows into
 * a cross-discipline view of the page. This is the semantic-brain foundation the
 * Opportunity + Experiment agents will reason over.
 *
 * Admin-gated exactly like seo_runs: pass base64(ADMIN_BASIC_AUTH) as `adminToken`.
 */
import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { requireAdmin } from "../auth";

const DISCIPLINES = ["seo", "aeo", "a11y", "perf", "security", "business"] as const;
const disciplineValidator = v.union(
  v.literal("seo"),
  v.literal("aeo"),
  v.literal("a11y"),
  v.literal("perf"),
  v.literal("security"),
  v.literal("business"),
);

/** Upsert one discipline's signal slice for a page (idempotent by site+url).
 *  Patches just that slice + its timestamp; other disciplines are untouched. */
export const upsertPageSignal = mutation({
  args: {
    adminToken: v.string(),
    site: v.string(),
    url: v.string(),
    discipline: disciplineValidator,
    data: v.any(),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const now = ISO();
    const existing = await ctx.db
      .query("page_intel")
      .withIndex("by_site_url", (q) => q.eq("site", args.site).eq("url", args.url))
      .first();
    if (existing) {
      const updated = { ...((existing.updated as Record<string, string>) ?? {}), [args.discipline]: now };
      // Dynamic slice write: the field is v.optional(v.any()), so the value is
      // untyped; the computed key needs the cast.
      await ctx.db.patch(existing._id, { [args.discipline]: args.data, updated } as Record<string, unknown>);
      return { id: existing._id, created: false };
    }
    const id = await ctx.db.insert("page_intel", {
      site: args.site,
      url: args.url,
      [args.discipline]: args.data,
      updated: { [args.discipline]: now },
      created_at: now,
    } as unknown as { site: string; url: string; updated: unknown; created_at: string });
    return { id, created: true };
  },
});

/** The full cross-discipline object for one page. */
export const getPage = query({
  args: { site: v.string(), url: v.string() },
  handler: async (ctx, { site, url }) => {
    return await ctx.db
      .query("page_intel")
      .withIndex("by_site_url", (q) => q.eq("site", site).eq("url", url))
      .first();
  },
});

/** Per-site rollup: how many pages carry each discipline's signal, so the
 *  intelligence layer can see coverage gaps at a glance. */
export const siteRollup = query({
  args: { site: v.string() },
  handler: async (ctx, { site }) => {
    const pages = await ctx.db
      .query("page_intel")
      .withIndex("by_site", (q) => q.eq("site", site))
      .collect();
    const coverage: Record<string, number> = {};
    for (const p of pages) {
      for (const d of DISCIPLINES) {
        if ((p as Record<string, unknown>)[d] != null) coverage[d] = (coverage[d] ?? 0) + 1;
      }
    }
    return { site, pages: pages.length, coverage };
  },
});

function ISO(): string {
  return new Date().toISOString();
}
