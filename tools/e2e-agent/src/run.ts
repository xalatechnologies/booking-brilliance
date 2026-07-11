/**
 * E2E agent — runs the Playwright public-surface suite against the live site and
 * files each failing journey into Linear as a categorized bug (reusing the
 * improvements agent's Linear client + type/severity/priority + /loop goal
 * format). Deduped against the project, so a persistent failure is one issue.
 *
 * Flags: --dry-run (run + print, file nothing).
 * Env: LINEAR_API_KEY, LINEAR_TEAM_KEY (XAL), IMPROVEMENTS_LINEAR_PROJECT
 *   (default "Digilist - Improvements Agent"), E2E_BASE_URL (default digilist.no).
 * Runs on the Claude Max box like the other agents, but needs no LLM — it's the
 * deterministic guardrail; Claude comes in when you /loop the filed fix goals.
 */
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { LinearClient } from "../../content-agent/src/linear";
import type { Verdict } from "../../improvements-agent/src/analyze";
import { CATEGORY_LABELS, fileGoal } from "../../improvements-agent/src/linear-goals";
import type { Item } from "../../improvements-agent/src/inputs";

const exec = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AGENT_DIR = path.resolve(__dirname, "..");
const nowIso = () => new Date().toISOString();

interface PwTest {
  title: string;
  ok: boolean;
  results: { status: string; error?: { message?: string } }[];
}
interface PwSpec {
  title: string;
  ok: boolean;
  tests: PwTest[];
}
interface PwSuite {
  specs?: PwSpec[];
  suites?: PwSuite[];
}

function collectFailures(suite: PwSuite, acc: { title: string; error: string }[] = []) {
  for (const s of suite.specs ?? []) {
    if (!s.ok) {
      const err = s.tests
        .flatMap((t) => t.results)
        .map((r) => r.error?.message)
        .find(Boolean);
      acc.push({ title: s.title, error: (err ?? "test failed").replace(/\[[0-9;]*m/g, "").slice(0, 400) });
    }
  }
  for (const child of suite.suites ?? []) collectFailures(child, acc);
  return acc;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const baseUrl = process.env.E2E_BASE_URL ?? "https://digilist.no";
  console.log(`[e2e] running public-surface suite against ${baseUrl}${dryRun ? " (dry run)" : ""}`);

  // Run Playwright (non-zero exit on failures is expected — we parse the report).
  await exec("npx", ["playwright", "test", "--config", path.join(AGENT_DIR, "playwright.config.ts")], {
    cwd: AGENT_DIR,
    env: { ...process.env, E2E_BASE_URL: baseUrl },
    maxBuffer: 64 * 1024 * 1024,
    timeout: 15 * 60_000,
  }).catch(() => {});

  const reportPath = path.join(AGENT_DIR, "report.json");
  if (!fs.existsSync(reportPath)) throw new Error("[e2e] no report.json produced");
  const report = JSON.parse(fs.readFileSync(reportPath, "utf-8")) as PwSuite;
  const failures = collectFailures(report);
  console.log(`[e2e] ${failures.length} failing journey(s).`);
  if (failures.length === 0) {
    console.log("[e2e] all public surfaces healthy ✓");
    return;
  }

  // Home/blog/book-demo are critical journeys.
  const critical = /home|blog|book-demo|form/i;
  const target = baseUrl.includes("app.") ? "digilist" : "marketing";

  const linearKey = process.env.LINEAR_API_KEY ?? "";
  let ctx: { client: LinearClient; teamId: string; projectId: string; existingTitles: Set<string>; labelMap: Record<string, string> } | null = null;
  if (!dryRun && linearKey) {
    const client = new LinearClient(linearKey);
    const team = await client.resolveTeam(process.env.LINEAR_TEAM_KEY ?? "XAL");
    const project = await client.ensureProject(process.env.IMPROVEMENTS_LINEAR_PROJECT ?? "Digilist - Improvements Agent", team.id);
    const existing = await client.issuesInProject(project.id);
    const labelMap = await client.ensureLabels(CATEGORY_LABELS, team.id).catch(() => ({}));
    ctx = {
      client,
      teamId: team.id,
      projectId: project.id,
      existingTitles: new Set(existing.map((i) => i.title.toLowerCase().replace(/[^a-zæøå0-9 ]/gi, "").replace(/\s+/g, " ").trim())),
      labelMap,
    };
  }

  let filed = 0;
  for (const f of failures) {
    const severity: Verdict["severity"] = critical.test(f.title) ? "critical" : "major";
    const item: Item = {
      key: `e2e:${f.title}`,
      kind: "finding",
      source_ref: `e2e/${f.title}`,
      title: `E2E-feil: ${f.title}`,
      category: "e2e",
      severity: "error",
      target_repo: target,
      detail: `Playwright-journey feilet mot ${baseUrl}.\nFeil: ${f.error}`,
      probe_hints: [],
    };
    const verdict: Verdict = {
      status: "fixable",
      actionable: true,
      confidence: 0.9,
      type: "bug",
      severity,
      priority: severity === "critical" ? "P0" : "P1",
      code_evidence: [],
      fix: `Fix the failing E2E journey "${f.title}" on the ${target} surface.`,
      goal_prompt: `Fix the E2E failure "${f.title}" (against ${baseUrl}). Error: ${f.error}. Reproduce with the Playwright suite in tools/e2e-agent (pnpm e2e:test), find and fix the root cause in the code, verify the journey goes green, run the full test/build and open a PR. Do not work on main.`,
    };
    if (!ctx) {
      console.log(`  ▸ [bug/${verdict.severity}/${verdict.priority}] ${f.title}\n    ${f.error.slice(0, 120)}`);
      continue;
    }
    const issue = await fileGoal(ctx.client, ctx, item, verdict, "live");
    if (issue) {
      console.log(`  ✓ ${issue.identifier} ${f.title}`);
      filed++;
    } else {
      console.log(`  · already open: ${f.title}`);
    }
  }
  console.log(`[e2e] done — ${filed} bug(s) filed to Linear.` + (nowIso() ? "" : ""));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
