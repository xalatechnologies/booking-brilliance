/**
 * Content agent orchestrator. Mirrors tools/site-intelligence/src/orchestrator.ts.
 *
 *   pnpm content:all                      # full pipeline
 *   pnpm content:all -- --phase discover  # just trends
 *   pnpm content:all -- --phase analyze   # cluster + coverage
 *   pnpm content:all -- --phase generate  # drafts only (uses latest clusters)
 *
 * Trigger types match site-intelligence: cli | dashboard | cron.
 * The full pipeline takes ~2-4 minutes (mostly Anthropic latency).
 */

import { loadConfig } from "./config";
import {
  finishContentRun,
  insertBrief,
  insertCluster,
  insertDraft,
  insertKeywords,
  listClustersWithCoverage,
  logAgentAction,
  recentKeywords,
  startContentRun,
  upsertAgent,
  upsertCoverage,
} from "./convex-write";
import { AGENT_REGISTRY } from "./agent-registry";
import { discoverAllSources } from "./sources";
import {
  buildCoverageContext,
  clusterKeywords,
  computeCoverage,
  resolveClusterIds,
} from "./analyze";
import {
  generateBlogDraft,
  generateBrief,
  generateSocialDrafts,
  riskForChannel,
} from "./generate";
import type {
  ContentRunPhase,
  Keyword,
  KeywordCluster,
} from "./types";

interface CliArgs {
  phase: ContentRunPhase | "all";
  trigger: "cli" | "dashboard" | "cron";
  draftsCap?: number;
}

function parseArgs(argv: string[]): CliArgs {
  const out: CliArgs = { phase: "all", trigger: "cli" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--phase") out.phase = argv[++i] as CliArgs["phase"];
    else if (a === "--trigger") out.trigger = argv[++i] as CliArgs["trigger"];
    else if (a === "--drafts") out.draftsCap = Number(argv[++i]);
  }
  return out;
}

export async function runContentAgent(args: CliArgs = { phase: "all", trigger: "cli" }) {
  const cfg = loadConfig();
  // All writes go through ConvexHttpClient via ./convex-write.
  // The Convex deployment URL + admin token come from env vars; see
  // tools/content-agent/src/convex-client.ts for the bootstrap.
  for (const def of AGENT_REGISTRY) await upsertAgent(def);

  const runId = await startContentRun(args.phase, args.trigger);
  const logLines: string[] = [];
  const log = (msg: string) => {
    const line = `[${new Date().toISOString()}] ${msg}`;
    logLines.push(line);
    console.log(line);
  };

  let keywordsDiscovered = 0;
  let clustersCreated = 0;
  let draftsGenerated = 0;
  let status: "ok" | "error" = "ok";

  try {
    // ─── Phase 1: discover ─────────────────────────────────────
    if (args.phase === "all" || args.phase === "discover") {
      log("discover: starting");
      const rows = await discoverAllSources(cfg, log);
      keywordsDiscovered = await insertKeywords(rows);
      log(`discover: inserted ${keywordsDiscovered} keywords`);
      await logAgentAction({
        agent_slug: "keyword",
        run_id: runId,
        kind: "tool-call",
        tool: "sources:discoverAllSources",
        input_summary: `${cfg.rssFeeds.length} RSS + ${cfg.redditSubs.length} subs + seeds`,
        output_summary: `${keywordsDiscovered} keywords`,
        trace_ref: `run:${runId}`,
        risk: "low",
        requires_review: false,
        reviewed_at: null,
        reviewed_by: null,
        cost_usd: 0,
        tokens_in: 0,
        tokens_out: 0,
      });
    }

    // ─── Phase 2: analyze (cluster + coverage) ─────────────────
    if (args.phase === "all" || args.phase === "analyze") {
      log("analyze: clustering keywords");
      const recent = await recentKeywords({ sinceDays: 14, limit: 600 });
      const rawClusters = await clusterKeywords(
        cfg,
        recent.map(stripId),
        log,
      );
      const resolved = resolveClusterIds(rawClusters, recent);
      let inserted = 0;
      const insertedClusters: Array<KeywordCluster & { _convexId: string }> =
        [];
      for (const c of resolved) {
        const id = await insertCluster(c);
        inserted++;
        insertedClusters.push({ ...c, id: 0, _convexId: id });
      }
      clustersCreated = inserted;
      log(`analyze: ${inserted} clusters inserted`);

      log("analyze: computing coverage vs existing content");
      const ctx = buildCoverageContext(cfg);
      log(`analyze: indexed ${ctx.docs.length} existing docs`);
      for (const c of insertedClusters) {
        const cov = computeCoverage(ctx, c, c._convexId as unknown as number);
        await upsertCoverage(cov);
      }
      await logAgentAction({
        agent_slug: "keyword",
        run_id: runId,
        kind: "recommendation",
        tool: "analyze:cluster+coverage",
        input_summary: `${recent.length} keywords`,
        output_summary: `${inserted} clusters, ${ctx.docs.length} site docs indexed`,
        trace_ref: `run:${runId}`,
        risk: "low",
        requires_review: false,
        reviewed_at: null,
        reviewed_by: null,
        cost_usd: 0,
        tokens_in: 0,
        tokens_out: 0,
      });
    }

    // ─── Phase 3: generate (briefs + drafts) ──────────────────
    if (args.phase === "all" || args.phase === "generate") {
      const top = await listClustersWithCoverage(50);
      // Rank by composite_score × gap_score — opportunity is signal
      // strength × how poorly we already cover it.
      const ranked = top
        .map((c) => ({
          cluster: c,
          opportunity:
            (c.composite_score / 100) *
            ((c.coverage?.gap_score ?? 100) / 100) *
            100,
        }))
        .sort((a, b) => b.opportunity - a.opportunity);
      const cap = args.draftsCap ?? cfg.draftsPerRun;
      const picks = ranked.slice(0, cap);
      log(`generate: ${picks.length} clusters selected for drafting`);
      for (const { cluster, opportunity } of picks) {
        try {
          const { brief, call: briefCall } = await generateBrief(
            cfg,
            { ...cluster, id: 0, member_ids: [] },
          );
          const briefId = await insertBrief({
            ...brief,
            cluster_id: cluster.id,
          });
          await logAgentAction({
            agent_slug: "content-draft",
            run_id: runId,
            kind: "tool-call",
            tool: "anthropic:brief",
            input_summary: `cluster:${cluster.id} (${cluster.label})`,
            output_summary: `brief:${briefId} audience=${brief.audience}`,
            trace_ref: `brief:${briefId}`,
            risk: "low",
            requires_review: false,
            reviewed_at: null,
            reviewed_by: null,
            cost_usd: briefCall.costUsd,
            tokens_in: briefCall.inputTokens,
            tokens_out: briefCall.outputTokens,
          });

          const { draft: blog, call: blogCall } = await generateBlogDraft(
            cfg,
            { ...brief, id: 0, cluster_id: 0 },
            { ...cluster, id: 0, member_ids: [] },
          );
          const blogId = await insertDraft({ ...blog, brief_id: briefId });
          draftsGenerated++;
          await logAgentAction({
            agent_slug: "content-draft",
            run_id: runId,
            kind: "draft",
            tool: "anthropic:blog",
            input_summary: `brief:${briefId}`,
            output_summary: `draft:${blogId} "${blog.title}"`,
            trace_ref: `draft:${blogId}`,
            risk: riskForChannel("blog"),
            requires_review: true,
            reviewed_at: null,
            reviewed_by: null,
            cost_usd: blogCall.costUsd,
            tokens_in: blogCall.inputTokens,
            tokens_out: blogCall.outputTokens,
          });

          const { linkedin, x, call: socialCall } = await generateSocialDrafts(
            cfg,
            { ...brief, id: 0, cluster_id: 0 },
            { ...cluster, id: 0, member_ids: [] },
          );
          const liId = await insertDraft({ ...linkedin, brief_id: briefId });
          draftsGenerated++;
          await logAgentAction({
            agent_slug: "content-draft",
            run_id: runId,
            kind: "draft",
            tool: "anthropic:linkedin",
            input_summary: `brief:${briefId}`,
            output_summary: `draft:${liId} "${linkedin.title}"`,
            trace_ref: `draft:${liId}`,
            risk: riskForChannel("linkedin"),
            requires_review: true,
            reviewed_at: null,
            reviewed_by: null,
            cost_usd: socialCall.costUsd / 2, // split LI/X
            tokens_in: Math.round(socialCall.inputTokens / 2),
            tokens_out: Math.round(socialCall.outputTokens / 2),
          });
          const xId = await insertDraft({ ...x, brief_id: briefId });
          draftsGenerated++;
          await logAgentAction({
            agent_slug: "content-draft",
            run_id: runId,
            kind: "draft",
            tool: "anthropic:x",
            input_summary: `brief:${briefId}`,
            output_summary: `draft:${xId} "${x.title}"`,
            trace_ref: `draft:${xId}`,
            risk: riskForChannel("x"),
            requires_review: true,
            reviewed_at: null,
            reviewed_by: null,
            cost_usd: socialCall.costUsd / 2,
            tokens_in: Math.round(socialCall.inputTokens / 2),
            tokens_out: Math.round(socialCall.outputTokens / 2),
          });
          log(
            `generate: cluster:${cluster.id} (${cluster.label}) → 3 drafts ` +
              `(opportunity=${opportunity.toFixed(1)})`,
          );
        } catch (e) {
          log(`generate: cluster:${cluster.id} failed → ${String(e)}`);
        }
      }
    }
  } catch (e) {
    status = "error";
    log(`run failed: ${String(e)}`);
  } finally {
    await finishContentRun(runId, {
      keywords_discovered: keywordsDiscovered,
      clusters_created: clustersCreated,
      drafts_generated: draftsGenerated,
      drafts_published: 0,
      log: logLines.slice(-200).join("\n"),
      status,
    });
  }
  return {
    runId,
    keywordsDiscovered,
    clustersCreated,
    draftsGenerated,
    status,
  };
}

function stripId(k: Keyword): Omit<Keyword, "id"> {
  const { id: _id, ...rest } = k;
  return rest;
}

// CLI entry — only when invoked directly, not when imported.
const isMain = (() => {
  try {
    const argv1 = process.argv[1];
    return typeof argv1 === "string" && argv1.endsWith("orchestrator.ts");
  } catch {
    return false;
  }
})();

if (isMain) {
  const args = parseArgs(process.argv.slice(2));
  runContentAgent(args)
    .then((r) => {
      console.log(JSON.stringify(r, null, 2));
      process.exit(r.status === "ok" ? 0 : 1);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
