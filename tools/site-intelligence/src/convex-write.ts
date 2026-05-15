/**
 * Async drop-in replacements for the db.ts write functions used by
 * tools/site-intelligence/src/orchestrator.ts.
 */
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

let cached: ConvexHttpClient | null = null;
let cachedToken: string | null = null;

function getConvex(): ConvexHttpClient {
  if (cached) return cached;
  const url = process.env.CONVEX_URL ?? process.env.VITE_CONVEX_URL ?? "";
  if (!url) {
    throw new Error(
      "CONVEX_URL not set. Run `npx convex dev` and copy the URL into /etc/digilist-api.env.",
    );
  }
  cached = new ConvexHttpClient(url);
  return cached;
}

function token(): string {
  if (cachedToken !== null) return cachedToken;
  const admin = process.env.ADMIN_BASIC_AUTH ?? "";
  if (!admin) {
    throw new Error("ADMIN_BASIC_AUTH not set.");
  }
  cachedToken = Buffer.from(admin, "utf-8").toString("base64");
  return cachedToken;
}

export type AuditRunId = Id<"audit_runs">;

export async function upsertTarget(input: {
  name: string;
  label: string;
  origin: string;
  description: string;
  isActive: boolean;
}): Promise<void> {
  await getConvex().mutation(api.audits.runs.upsertTarget, {
    adminToken: token(),
    name: input.name,
    label: input.label,
    origin: input.origin,
    description: input.description,
    is_active: input.isActive,
  });
}

export async function startRun(
  targetName: string,
  auditType: string,
  trigger: string,
): Promise<AuditRunId> {
  const { id } = await getConvex().mutation(api.audits.runs.startRun, {
    adminToken: token(),
    target_name: targetName,
    audit_type: auditType,
    trigger,
  });
  return id as AuditRunId;
}

export async function finishRun(
  id: AuditRunId,
  patch: {
    pages: number;
    findings: number;
    avgScore: number;
    status: string;
  },
): Promise<void> {
  await getConvex().mutation(api.audits.runs.finishRun, {
    adminToken: token(),
    id,
    status: patch.status,
    pages_scanned: patch.pages,
    findings_total: patch.findings,
    avg_score: patch.avgScore,
  });
}

export async function insertPages(
  runId: AuditRunId,
  pages: Array<{ url: string; score: number; metrics?: unknown }>,
): Promise<void> {
  const BATCH = 20;
  for (let i = 0; i < pages.length; i += BATCH) {
    await Promise.all(
      pages.slice(i, i + BATCH).map((p) =>
        getConvex().mutation(api.audits.runs.addPage, {
          adminToken: token(),
          run_id: runId,
          url: p.url,
          score: p.score,
          metrics_json: JSON.stringify(p.metrics ?? {}),
        }),
      ),
    );
  }
}

export async function insertFindings(
  runId: AuditRunId,
  findings: Array<{
    url: string;
    rule: string;
    severity: string;
    message: string;
  }>,
): Promise<void> {
  const BATCH = 20;
  for (let i = 0; i < findings.length; i += BATCH) {
    await Promise.all(
      findings.slice(i, i + BATCH).map((f) =>
        getConvex().mutation(api.audits.runs.addFinding, {
          adminToken: token(),
          run_id: runId,
          url: f.url,
          rule: f.rule,
          severity: f.severity,
          message: f.message,
        }),
      ),
    );
  }
}
