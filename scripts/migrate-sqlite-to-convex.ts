/**
 * One-shot migration: copy every row from the legacy SQLite files
 * (tools/content-agent/reports/content.sqlite and
 *  tools/site-intelligence/reports/intelligence.sqlite) into the Convex
 * deployment configured by VITE_CONVEX_URL + ADMIN_BASIC_AUTH.
 *
 * Run with:
 *   pnpm convex:migrate
 */
import Database from "better-sqlite3";
import { ConvexHttpClient } from "convex/browser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CONVEX_URL =
  process.env.VITE_CONVEX_URL ?? process.env.CONVEX_URL ?? "";
const ADMIN = process.env.ADMIN_BASIC_AUTH ?? "";

if (!CONVEX_URL) {
  console.error("VITE_CONVEX_URL is not set. Run `npx convex dev` first.");
  process.exit(1);
}
if (!ADMIN) {
  console.error("ADMIN_BASIC_AUTH is not set in env.");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);
const token = Buffer.from(ADMIN, "utf-8").toString("base64");

const contentDbPath = path.resolve(
  __dirname,
  "..",
  "tools",
  "content-agent",
  "reports",
  "content.sqlite",
);
const auditDbPath = path.resolve(
  __dirname,
  "..",
  "tools",
  "site-intelligence",
  "reports",
  "intelligence.sqlite",
);

async function migrateContent() {
  let db: Database.Database;
  try {
    db = new Database(contentDbPath, { readonly: true, fileMustExist: true });
  } catch {
    console.log(`[skip] no content.sqlite at ${contentDbPath}`);
    return;
  }
  console.log(`[content] opened ${contentDbPath}`);

  const agents = db
    .prepare("SELECT * FROM agents")
    .all() as Array<Record<string, unknown>>;
  for (const a of agents) {
    await client.mutation(api.content.agents.upsertAgent, {
      adminToken: token,
      slug: String(a.slug),
      name: String(a.name),
      role: String(a.role),
      description: String(a.description ?? ""),
      status: String(a.status ?? "active"),
      tier: String(a.tier ?? "v1"),
      owner: String(a.owner ?? ""),
      allowed_tools_json: String(a.allowed_tools_json ?? "[]"),
      reports_to: String(a.reports_to ?? ""),
      budget_usd_month: Number(a.budget_usd_month ?? 0),
      risk_default: String(a.risk_default ?? "low"),
      source: String(a.source ?? "content-agent"),
    });
  }
  console.log(`[content] migrated ${agents.length} agents`);

  const clusterIdMap = new Map<number, Id<"keyword_clusters">>();
  const clusters = db
    .prepare("SELECT * FROM keyword_clusters")
    .all() as Array<Record<string, unknown>>;
  for (const c of clusters) {
    const res = await client.mutation(api.content.keywords.createCluster, {
      adminToken: token,
      label: String(c.label),
      centroid_term: String(c.centroid_term),
      member_ids_json: String(c.member_ids_json ?? "[]"),
      composite_score: Number(c.composite_score ?? 0),
      topic_summary: String(c.topic_summary ?? ""),
    });
    clusterIdMap.set(Number(c.id), res.id);
  }
  console.log(`[content] migrated ${clusters.length} clusters`);

  const coverage = db
    .prepare("SELECT * FROM coverage")
    .all() as Array<Record<string, unknown>>;
  for (const cov of coverage) {
    const newId = clusterIdMap.get(Number(cov.cluster_id));
    if (!newId) continue;
    await client.mutation(api.content.keywords.upsertCoverage, {
      adminToken: token,
      cluster_id: newId,
      gap_score: Number(cov.gap_score ?? 0),
      best_match_url: (cov.best_match_url as string | null) ?? null,
      best_match_score: Number(cov.best_match_score ?? 0),
    });
  }
  console.log(`[content] migrated ${coverage.length} coverage rows`);

  const briefIdMap = new Map<number, Id<"briefs">>();
  const briefs = db
    .prepare("SELECT * FROM briefs")
    .all() as Array<Record<string, unknown>>;
  for (const b of briefs) {
    const clusterId = clusterIdMap.get(Number(b.cluster_id));
    if (!clusterId) continue;
    const res = await client.mutation(api.content.agents.createBrief, {
      adminToken: token,
      cluster_id: clusterId,
      channel: String(b.channel),
      audience: String(b.audience ?? ""),
      angle: String(b.angle ?? ""),
      outline_json: String(b.outline_json ?? "[]"),
      cta: String(b.cta ?? ""),
      model: String(b.model ?? ""),
    });
    briefIdMap.set(Number(b.id), res.id);
  }
  console.log(`[content] migrated ${briefs.length} briefs`);

  const drafts = db
    .prepare("SELECT * FROM drafts")
    .all() as Array<Record<string, unknown>>;
  let draftsMigrated = 0;
  for (const d of drafts) {
    const briefId = briefIdMap.get(Number(d.brief_id));
    if (!briefId) continue;
    await client.mutation(api.content.drafts.create, {
      adminToken: token,
      brief_id: briefId,
      channel: String(d.channel),
      title: String(d.title),
      body: String(d.body),
      frontmatter_json: String(d.frontmatter_json ?? "{}"),
      hashtags_json: String(d.hashtags_json ?? "[]"),
      model: String(d.model ?? ""),
    });
    draftsMigrated++;
  }
  console.log(`[content] migrated ${draftsMigrated}/${drafts.length} drafts`);

  const conns = db
    .prepare("SELECT * FROM publish_connections")
    .all() as Array<Record<string, unknown>>;
  for (const c of conns) {
    await client.mutation(api.content.agents.upsertConnection, {
      adminToken: token,
      provider: String(c.provider),
      status: String(c.status ?? "disconnected"),
      account_handle: String(c.account_handle ?? ""),
      account_urn: String(c.account_urn ?? ""),
      scopes: String(c.scopes ?? ""),
      token_expires_at: (c.token_expires_at as string | null) ?? null,
    });
  }
  console.log(`[content] migrated ${conns.length} connections`);

  const tasks = db
    .prepare("SELECT * FROM tasks")
    .all() as Array<Record<string, unknown>>;
  for (const t of tasks) {
    await client.mutation(api.content.agents.createTask, {
      adminToken: token,
      source_agent: String(t.source_agent ?? "manual"),
      category: String(t.category ?? "dev"),
      title: String(t.title),
      summary: String(t.summary ?? ""),
      acceptance_json: String(t.acceptance_json ?? "[]"),
      test_scenarios_json: String(t.test_scenarios_json ?? "[]"),
      trace_ref: String(t.trace_ref ?? ""),
      priority: String(t.priority ?? "med"),
    });
  }
  console.log(`[content] migrated ${tasks.length} tasks`);

  db.close();
}

async function migrateAudits() {
  let db: Database.Database;
  try {
    db = new Database(auditDbPath, { readonly: true, fileMustExist: true });
  } catch {
    console.log(`[skip] no intelligence.sqlite at ${auditDbPath}`);
    return;
  }
  console.log(`[audits] opened ${auditDbPath}`);

  const targets = db
    .prepare("SELECT * FROM targets")
    .all() as Array<Record<string, unknown>>;
  for (const t of targets) {
    await client.mutation(api.audits.runs.upsertTarget, {
      adminToken: token,
      name: String(t.name),
      label: String(t.label),
      origin: String(t.origin),
      description: String(t.description ?? ""),
      is_active: Number(t.is_active) === 1,
    });
  }
  console.log(`[audits] migrated ${targets.length} targets`);

  const sqliteTargets = new Map<number, string>();
  for (const t of targets) {
    sqliteTargets.set(Number(t.id), String(t.name));
  }
  const runs = db
    .prepare("SELECT * FROM audit_runs ORDER BY id ASC")
    .all() as Array<Record<string, unknown>>;
  const runIdMap = new Map<number, Id<"audit_runs">>();
  for (const r of runs) {
    const targetName = sqliteTargets.get(Number(r.target_id));
    if (!targetName) continue;
    const { id: newRunId } = await client.mutation(api.audits.runs.startRun, {
      adminToken: token,
      target_name: targetName,
      audit_type: String(r.audit_type),
      trigger: String(r.trigger ?? "cli"),
    });
    runIdMap.set(Number(r.id), newRunId);
    if (r.finished_at) {
      await client.mutation(api.audits.runs.finishRun, {
        adminToken: token,
        id: newRunId,
        status: String(r.status ?? "ok"),
        pages_scanned: Number(r.pages_scanned ?? 0),
        findings_total: Number(r.findings_total ?? 0),
        avg_score: Number(r.avg_score ?? 0),
      });
    }
  }
  console.log(`[audits] migrated ${runs.length} runs`);

  const pages = db
    .prepare("SELECT * FROM audit_pages")
    .all() as Array<Record<string, unknown>>;
  let pagesDone = 0;
  for (const p of pages) {
    const runId = runIdMap.get(Number(p.run_id));
    if (!runId) continue;
    await client.mutation(api.audits.runs.addPage, {
      adminToken: token,
      run_id: runId,
      url: String(p.url),
      score: Number(p.score ?? 0),
      metrics_json: String(p.metrics_json ?? "{}"),
    });
    pagesDone++;
  }
  console.log(`[audits] migrated ${pagesDone}/${pages.length} pages`);

  const findings = db
    .prepare("SELECT * FROM audit_findings")
    .all() as Array<Record<string, unknown>>;
  let findingsDone = 0;
  for (const f of findings) {
    const runId = runIdMap.get(Number(f.run_id));
    if (!runId) continue;
    await client.mutation(api.audits.runs.addFinding, {
      adminToken: token,
      run_id: runId,
      url: String(f.url),
      rule: String(f.rule),
      severity: String(f.severity),
      message: String(f.message),
    });
    findingsDone++;
  }
  console.log(`[audits] migrated ${findingsDone}/${findings.length} findings`);

  db.close();
}

async function main() {
  console.log(`[migrate] target: ${CONVEX_URL}`);
  await migrateContent();
  await migrateAudits();
  console.log("[migrate] done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
