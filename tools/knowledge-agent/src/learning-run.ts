/**
 * learning:run — the distill stage of the self-learning loop.
 *
 *   pull content signals → gather pending raw signals + existing knowledge →
 *   run a capable Opus agent (repo-pattern mining + best-practice + latest
 *   stack docs/trends) → distill deduped, provenance-tracked learnings →
 *   demote stale ones → render the wiki → auto-file advisory upgrade issues.
 *
 * Flags: --dry-run (distill + print, persist nothing, file nothing) ·
 *   --no-web (skip trend research) · --no-file (persist + render, don't file
 *   Linear issues) · --limit N (cap signals fed to the distiller) ·
 *   --render-only (re-render the wiki from the store; no agent call).
 *
 * Env: LLM_PROVIDER=claude-cli (Max) · LINEAR_API_KEY (for advisory upgrade
 *   issues; optional) · LINEAR_TEAM_KEY (default XAL) ·
 *   KNOWLEDGE_LINEAR_PROJECT (default "Digilist - Improvements Agent") ·
 *   KNOWLEDGE_BACKLOG_STATE (default "Backlog") · DIGILIST_REPO_PATH ·
 *   KNOWLEDGE_MODEL (default claude-opus-4-8).
 */
import { runClaudeAgent } from "../../content-agent/src/claude-agent";
import { LinearClient } from "../../content-agent/src/linear";
import { OpenBrain } from "../../improvements-agent/src/brain";
import { captureContentSignals } from "./capture";
import { applyDistilled, buildDistillPrompt, parseDistilled, upgradeGoalMarkdown } from "./distill";
import { renderWikiFromStore } from "./knowledge";

const nowIso = () => new Date().toISOString();

function parseArgs(argv: string[]) {
  const li = argv.indexOf("--limit");
  return {
    dryRun: argv.includes("--dry-run"),
    noWeb: argv.includes("--no-web"),
    noFile: argv.includes("--no-file"),
    renderOnly: argv.includes("--render-only"),
    limit: li >= 0 ? Number(argv[li + 1]) || Infinity : Infinity,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const repoPath = process.env.DIGILIST_REPO_PATH ?? process.cwd();
  const model = process.env.KNOWLEDGE_MODEL ?? "claude-opus-4-8";

  const brain = OpenBrain.load();

  if (args.renderOnly) {
    const r = renderWikiFromStore(brain, nowIso());
    console.log(`[learning] re-rendered wiki: KNOWLEDGE.md + ${r.topics.length} topic file(s).`);
    return;
  }

  // 1. pull the latest content-memory signals into the inbox --------------------
  const contentN = await captureContentSignals();
  if (contentN) console.log(`[learning] captured ${contentN} content signal(s).`);

  // reload so the freshly captured signals are visible.
  const store = OpenBrain.load();
  const pending = store.pendingSignals().slice(0, args.limit);
  console.log(`[learning] ${pending.length} pending signal(s), ${store.knowledge.length} existing learning(s).`);

  // 2. distill via a capable Opus agent ----------------------------------------
  const prompt = buildDistillPrompt({
    signals: pending,
    existing: store.knowledge,
    allowWeb: !args.noWeb,
    repoPath,
  });
  console.log(`[learning] distilling with ${model}${args.noWeb ? " (no web)" : " (web on)"}…`);
  const res = await runClaudeAgent({
    prompt,
    model,
    cwd: repoPath,
    maxTurns: 40,
    idleMin: 15,
    label: "learning:distill",
  });
  if (!res.ok) {
    console.warn(`[learning] agent did not finish cleanly (${res.model}); parsing whatever it returned.`);
  }
  const output = parseDistilled(res.text);
  console.log(`[learning] distilled ${output.learnings.length} learning(s), ${output.demote?.length ?? 0} demotion(s).`);

  if (args.dryRun) {
    for (const l of output.learnings) {
      console.log(`  ▸ [${l.type}] ${l.statement}  (${Math.round(l.confidence * 100)}% · ${l.source_ref})`);
    }
    console.log("[learning] DRY RUN — nothing persisted, nothing filed.");
    return;
  }

  // 3. apply (dedup/compound + demote) + render wiki ---------------------------
  const applied = applyDistilled(store, output, nowIso());
  store.markSignalsDistilled(pending.map((s) => s.id));
  store.save(nowIso());
  console.log(`[learning] upserted ${applied.upserted.length}, demoted ${applied.demoted.length}.`);

  const rendered = renderWikiFromStore(store, nowIso());
  console.log(`[learning] wiki rendered: KNOWLEDGE.md + ${rendered.topics.length} topic file(s).`);

  // 4. auto-file advisory upgrade issues (Backlog, behind the human Todo gate) --
  const linearKey = process.env.LINEAR_API_KEY ?? "";
  if (args.noFile || !linearKey) {
    if (applied.upgrades.length) {
      console.log(`[learning] ${applied.upgrades.length} upgrade suggestion(s) — not filed (${args.noFile ? "--no-file" : "no LINEAR_API_KEY"}).`);
    }
    console.log("[learning] done.");
    return;
  }
  if (applied.upgrades.length) {
    await fileUpgrades(linearKey, applied.upgrades);
  }
  console.log("[learning] done.");
}

async function fileUpgrades(
  linearKey: string,
  upgrades: import("./distill").DistilledLearning[],
): Promise<void> {
  const client = new LinearClient(linearKey);
  const team = await client.resolveTeam(process.env.LINEAR_TEAM_KEY ?? "XAL");
  const projectName = process.env.KNOWLEDGE_LINEAR_PROJECT ?? "Digilist - Improvements Agent";
  const project = await client.ensureProject(projectName, team.id, "Auto-suggestions from the Digilist agent fleet.");
  const backlogState = process.env.KNOWLEDGE_BACKLOG_STATE ?? "Backlog";
  const norm = (s: string) => s.toLowerCase().replace(/[^a-zæøå0-9 ]/gi, "").replace(/\s+/g, " ").trim();
  const existing = new Set((await client.issuesInProject(project.id)).map((i) => norm(i.title)));

  for (const u of upgrades) {
    const up = u.upgrade;
    if (!up) continue;
    const title = up.title.length > 120 ? `${up.title.slice(0, 117)}…` : up.title;
    if (existing.has(norm(title))) {
      console.log(`  · upgrade "${title}" already filed — skip`);
      continue;
    }
    const issue = await client.createIssue({
      teamId: team.id,
      projectId: project.id,
      title,
      description: upgradeGoalMarkdown(up, u.source_ref),
      priority: 4, // low — advisory
    });
    // Park it in Backlog so it stays behind the human Todo gate.
    await client.moveIssue(issue.id, team.id, backlogState).catch(() => false);
    await client.addLabel(issue.id, team.id, "tech-trend", "#0ea5e9").catch(() => {});
    existing.add(norm(title));
    console.log(`  ✓ filed advisory upgrade ${issue.identifier} → Backlog: ${title}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
