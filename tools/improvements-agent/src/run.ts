/**
 * improvements:run — the analyze + file stage of the self-improving loop.
 *
 *   index target repos → load items (ideas + findings) → analyze each vs the
 *   code graph → file high-confidence, genuine work as Linear /loop goals →
 *   record everything in the Open Brain.
 *
 * Flags: --dry-run (analyze + print, file nothing) · --no-index (reuse the
 * current graph) · --limit N.
 *
 * Env: VITE_CONVEX_URL, ADMIN_BASIC_AUTH, ANTHROPIC_API_KEY, LINEAR_API_KEY,
 *   LINEAR_TEAM_KEY (default XAL), IMPROVEMENTS_LINEAR_PROJECT
 *   (default "Digilist - Improvements Agent"), IMPROVEMENTS_IDEAS_REPO
 *   (default xalatechnologies/booking-brilliance), IMPROVEMENTS_MIN_CONFIDENCE
 *   (default 0.7).
 */
import { loadConfig } from "../../content-agent/src/config";
import { LinearClient } from "../../content-agent/src/linear";
import { analyzeItem } from "./analyze";
import { OpenBrain } from "./brain";
import { indexRepo, projectForPath, repoStatus } from "./code-map";
import { githubIdeas, intelligenceFindings, REPOS, type Item, type RepoKey } from "./inputs";
import { fileGoal, goalMarkdown } from "./linear-goals";

const nowIso = () => new Date().toISOString();

function parseArgs(argv: string[]) {
  return {
    dryRun: argv.includes("--dry-run"),
    noIndex: argv.includes("--no-index"),
    limit: (() => {
      const i = argv.indexOf("--limit");
      return i >= 0 ? Number(argv[i + 1]) || Infinity : Infinity;
    })(),
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const cfg = loadConfig();
  const convexUrl = process.env.VITE_CONVEX_URL ?? process.env.CONVEX_URL ?? "";
  const admin = process.env.ADMIN_BASIC_AUTH ?? "";
  const linearKey = process.env.LINEAR_API_KEY ?? "";
  const ideasRepo = process.env.IMPROVEMENTS_IDEAS_REPO ?? "xalatechnologies/booking-brilliance";
  const minConf = Number(process.env.IMPROVEMENTS_MIN_CONFIDENCE ?? 0.7) || 0.7;
  const projectName = process.env.IMPROVEMENTS_LINEAR_PROJECT ?? "Digilist - Improvements Agent";
  if (!cfg.anthropicApiKey) throw new Error("ANTHROPIC_API_KEY required");
  if (!convexUrl || !admin) throw new Error("VITE_CONVEX_URL + ADMIN_BASIC_AUTH required");

  const brain = OpenBrain.load();
  const filing = !args.dryRun && Boolean(linearKey);
  console.log(`[improvements] ${args.dryRun ? "DRY RUN" : filing ? "filing to Linear" : "no LINEAR_API_KEY → dry run"}`);

  // 1. index target repos + capture code sha per repo -----------------------
  const repoMeta = {} as Record<RepoKey, { project: string; sha: string }>;
  for (const key of Object.keys(REPOS) as RepoKey[]) {
    const r = REPOS[key];
    const status = await repoStatus(r.path, nowIso()).catch(() => null);
    let project: string = r.project;
    if (!args.noIndex) {
      console.log(`[improvements] indexing ${key} (${r.path}) …`);
      const p = await indexRepo(r.path, "moderate").catch((e) => {
        console.warn(`[improvements] index ${key} failed: ${String(e).slice(0, 120)}`);
        return null;
      });
      project = p?.name ?? project;
    }
    if (!project) project = (await projectForPath(r.path))?.name ?? "";
    const sha = status?.sha ?? "unknown";
    repoMeta[key] = { project, sha };
    if (status) {
      brain.recordRepoStatus(key, status);
      if (project) brain.recordSnapshot({ project, repo: key, nodes: 0, edges: 0, git_sha: sha, indexed_at: nowIso() });
    }
  }

  // 2. load items -----------------------------------------------------------
  const items: Item[] = [
    ...(await githubIdeas(ideasRepo).catch((e) => {
      console.warn(`[improvements] github ideas failed: ${String(e).slice(0, 120)}`);
      return [];
    })),
    ...(await intelligenceFindings(convexUrl, admin).catch((e) => {
      console.warn(`[improvements] findings failed: ${String(e).slice(0, 120)}`);
      return [];
    })),
  ];
  console.log(`[improvements] ${items.length} item(s): ${items.filter((i) => i.kind === "idea").length} ideas, ${items.filter((i) => i.kind === "finding").length} findings`);

  // 3. Linear context (only when filing) ------------------------------------
  let linearCtx: { client: LinearClient; teamId: string; projectId: string; existingTitles: Set<string> } | null = null;
  if (filing) {
    const client = new LinearClient(linearKey);
    const team = await client.resolveTeam(process.env.LINEAR_TEAM_KEY ?? "XAL");
    const project = await client.ensureProject(projectName, team.id, "Auto-forslag fra Digilist Improvements Agent.");
    const existing = await client.issuesInProject(project.id);
    linearCtx = {
      client,
      teamId: team.id,
      projectId: project.id,
      existingTitles: new Set(existing.map((i) => i.title.toLowerCase().replace(/[^a-zæøå0-9 ]/gi, "").replace(/\s+/g, " ").trim())),
    };
    console.log(`[improvements] Linear project "${project.name}" (${existing.length} existing issues)`);
  }

  // 4. analyze + file -------------------------------------------------------
  let analyzed = 0, filed = 0, skipped = 0, notActionable = 0;
  for (const item of items.slice(0, args.limit)) {
    const meta = repoMeta[item.target_repo];
    if (!meta?.project) { console.warn(`[improvements] no graph for ${item.target_repo} — skip "${item.title.slice(0, 50)}"`); continue; }

    if (brain.recallVerdict(item.key, meta.sha) && brain.improvementFor(item.key)) { skipped++; continue; }
    brain.upsertItem({ ...item, seen_at: nowIso() });

    const { verdict, call } = await analyzeItem(cfg, item, meta.project);
    analyzed++;
    brain.recordVerdict({
      item_key: item.key,
      actionable: verdict.actionable,
      confidence: verdict.confidence,
      status: verdict.status,
      code_evidence: verdict.code_evidence,
      fix: verdict.fix,
      goal_prompt: verdict.goal_prompt,
      analyzed_at: nowIso(),
      code_sha: meta.sha,
      model: call.model,
    });

    const genuine = verdict.actionable && verdict.confidence >= minConf;
    if (!genuine) {
      notActionable++;
      console.log(`  · ${verdict.status} (${(verdict.confidence * 100).toFixed(0)}%) — ${item.title.slice(0, 64)}`);
      continue;
    }
    if (!filing || !linearCtx) {
      console.log(`\n  ▸ GENUINE [${verdict.status} ${(verdict.confidence * 100).toFixed(0)}%] ${item.title}`);
      console.log(goalMarkdown(item, verdict, meta.sha).split("\n").map((l) => `    ${l}`).join("\n"));
      continue;
    }
    if (brain.improvementFor(item.key)) { skipped++; continue; }
    const issue = await fileGoal(linearCtx.client, linearCtx, item, verdict, meta.sha);
    if (issue) {
      brain.recordImprovement({ item_key: item.key, linear_id: issue.id, linear_identifier: issue.identifier, linear_url: issue.url, state: "filed", created_at: nowIso() });
      console.log(`  ✓ ${issue.identifier} ${item.title.slice(0, 60)}`);
      filed++;
    } else skipped++;
  }

  brain.save(nowIso());
  console.log(`\n[improvements] done — analyzed ${analyzed}, filed ${filed}, not-actionable ${notActionable}, skipped ${skipped}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
