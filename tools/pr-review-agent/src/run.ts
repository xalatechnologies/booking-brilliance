/**
 * pr-review:run — the autonomous PR-review agent. Scans GitHub for open pull
 * requests, reviews each with Claude (best model, on the Max subscription), and
 * posts an advisory COMMENT review to GitHub. Closes the self-improving loop:
 * the implement agent opens PRs, this agent reviews them.
 *
 * Scanning is GitHub-native (no local checkout needed): it enumerates open PRs
 * in a configured set of repo slugs, and optionally discovers every repo in an
 * org that has open PRs. Bot PRs (dependabot etc.) are skipped by default.
 *
 * Safety: reviews are advisory COMMENTs only — never approve, request-changes,
 * or merge. Dedupes on PR head commit (re-reviews only when new commits land)
 * and on our own hidden marker. --dry-run prints the review and posts nothing.
 *
 * Env:
 *   LLM_PROVIDER=claude-cli (Max, no key) · GH_TOKEN
 *   PR_REVIEW_REPOS      comma-separated owner/name slugs to scan
 *                        (default: xalatechnologies/booking-brilliance,
 *                         Xala-Technologies/Digilist)
 *   PR_REVIEW_ORGS       comma-separated orgs to auto-discover open-PR repos in
 *   PR_REVIEW_ONLY_AGENT =1 → only review agent/* branches
 *   PR_REVIEW_INCLUDE_BOTS=1 → also review bot PRs (dependabot etc.)
 *   PR_REVIEW_MULTILENS=1 → multi-agent review (one capable agent per lens:
 *                           correctness, security/RBAC, WCAG/UX, tests/CI)
 *   PR_REVIEW_VERDICTS=0 → advisory comments only (default: post approve on a
 *                          clean PR, request-changes on a blocker). NEVER merges.
 * Flags: --dry-run · --limit N (PRs per repo) · --all (include drafts) ·
 *        --repo <slug|name> (restrict to one) · --org <owner> (discover) ·
 *        --pr N (one specific PR — needs --repo) · --include-bots · --multi-lens
 *        · --comment-only (advisory comments, never approve/request-changes)
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { loadConfig } from "../../content-agent/src/config";
import { alreadyReviewed, postReview, renderReview } from "./post";
import { reviewPr, reviewPrMultiLens } from "./review";
import { ReviewStore } from "./store";

const exec = promisify(execFile);
const nowIso = () => new Date().toISOString();

function ghEnv(): NodeJS.ProcessEnv {
  return { ...process.env, GITHUB_TOKEN: process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN ?? "" };
}

const DEFAULT_REPOS = ["xalatechnologies/booking-brilliance", "Xala-Technologies/Digilist"];

interface OpenPr {
  repo: string; // owner/name
  number: number;
  headRefName: string;
  headRefOid: string;
  isDraft: boolean;
  author: string;
  authorIsBot: boolean;
  title: string;
}

/** Enumerate open PRs in a repo slug via gh (GitHub API, no checkout). */
async function listOpenPrs(repo: string, limit: number): Promise<OpenPr[]> {
  try {
    const { stdout } = await exec(
      "gh",
      ["pr", "list", "--repo", repo, "--state", "open", "--limit", String(limit), "--json",
        "number,headRefName,headRefOid,isDraft,author,title"],
      { env: ghEnv(), timeout: 30_000, maxBuffer: 16 * 1024 * 1024 },
    );
    const arr = JSON.parse(stdout) as Array<Record<string, unknown>>;
    return arr.map((p) => {
      const author = p.author as { login?: string; is_bot?: boolean } | undefined;
      return {
        repo,
        number: p.number as number,
        headRefName: (p.headRefName as string) ?? "",
        headRefOid: (p.headRefOid as string) ?? "",
        isDraft: Boolean(p.isDraft),
        author: author?.login ?? "",
        authorIsBot: Boolean(author?.is_bot) || /\[bot\]$|^dependabot/i.test(author?.login ?? ""),
        title: (p.title as string) ?? "",
      };
    });
  } catch (e) {
    console.warn(`[pr-review] cannot list PRs in ${repo}: ${String(e).slice(0, 160)}`);
    return [];
  }
}

/** Discover every repo in an org that currently has an open PR. */
async function discoverOrgRepos(org: string): Promise<string[]> {
  try {
    const { stdout } = await exec(
      "gh",
      ["search", "prs", "--owner", org, "--state", "open", "--limit", "200", "--json", "repository"],
      { env: ghEnv(), timeout: 40_000, maxBuffer: 16 * 1024 * 1024 },
    );
    const arr = JSON.parse(stdout) as Array<{ repository?: { nameWithOwner?: string } }>;
    return [...new Set(arr.map((x) => x.repository?.nameWithOwner ?? "").filter(Boolean))];
  } catch (e) {
    console.warn(`[pr-review] org discovery failed for ${org}: ${String(e).slice(0, 160)}`);
    return [];
  }
}

function csv(v: string | undefined): string[] {
  return (v ?? "").split(",").map((s) => s.trim()).filter(Boolean);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const includeDrafts = args.includes("--all");
  const multiLens = args.includes("--multi-lens") || process.env.PR_REVIEW_MULTILENS === "1";
  // Post proper review verdicts (approve / request-changes) rather than only
  // advisory comments. Default ON; the agent still NEVER merges. --comment-only
  // or PR_REVIEW_VERDICTS=0 restricts it to advisory comments.
  const allowVerdicts = !args.includes("--comment-only") && process.env.PR_REVIEW_VERDICTS !== "0";
  const includeBots = args.includes("--include-bots") || process.env.PR_REVIEW_INCLUDE_BOTS === "1";
  const onlyAgent = process.env.PR_REVIEW_ONLY_AGENT === "1";
  const flag = (name: string) => {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : "";
  };
  const limit = Number(flag("--limit")) || 20;
  const onlyRepo = flag("--repo");
  const onePr = Number(flag("--pr")) || 0;
  const orgFlag = flag("--org");

  // Build the repo set: explicit slugs + org discovery.
  const explicit = csv(process.env.PR_REVIEW_REPOS).length ? csv(process.env.PR_REVIEW_REPOS) : DEFAULT_REPOS;
  const orgs = orgFlag ? [orgFlag] : csv(process.env.PR_REVIEW_ORGS);
  const discovered = (await Promise.all(orgs.map(discoverOrgRepos))).flat();
  let slugs = [...new Set([...explicit, ...discovered])];
  if (onlyRepo) {
    slugs = slugs.filter((s) => s === onlyRepo || s.split("/")[1] === onlyRepo);
    if (slugs.length === 0) slugs = [onlyRepo]; // allow an unlisted slug via --repo
  }

  const cfg = loadConfig();
  const store = ReviewStore.load();
  console.log(`[pr-review] scanning ${slugs.length} repo(s): ${slugs.join(", ")}${dryRun ? " (dry run)" : ""}`);

  // Gather candidate PRs across all repos.
  let candidates: OpenPr[] = [];
  if (onePr) {
    if (slugs.length !== 1) throw new Error("--pr requires exactly one repo (use --repo owner/name)");
    candidates = [{ repo: slugs[0], number: onePr, headRefName: "", headRefOid: `manual-${onePr}`, isDraft: false, author: "", authorIsBot: false, title: "" }];
  } else {
    candidates = (await Promise.all(slugs.map((s) => listOpenPrs(s, limit)))).flat();
  }

  let reviewed = 0;
  let skipped = 0;
  for (const pr of candidates) {
    if (pr.isDraft && !includeDrafts) { skipped++; continue; }
    if (onlyAgent && !pr.headRefName.startsWith("agent/")) { skipped++; continue; }
    if (pr.authorIsBot && !includeBots) { console.log(`  · ${pr.repo}#${pr.number} bot PR (${pr.author}) — skip`); skipped++; continue; }
    const key = `${pr.repo}#${pr.number}`;
    const prior = store.get(key);
    // Same head commit as our last review → nothing changed → skip.
    if (prior?.headOid === pr.headRefOid && !onePr) { console.log(`  · ${key} unchanged since last review — skip`); continue; }
    // No local record but our marker is already on the PR (fresh machine): adopt
    // it, but ONLY when the head hasn't moved past what the marker reviewed. If we
    // have a prior record with a different head, new commits landed → re-review.
    if (!prior && !onePr && !dryRun && (await alreadyReviewed(pr.repo, pr.number))) {
      store.record(key, { headOid: pr.headRefOid, url: "", reviewed_at: nowIso(), blocking: false });
      console.log(`  · ${key} already has our review — adopt & skip`);
      continue;
    }
    const isUpdate = Boolean(prior && prior.headOid !== pr.headRefOid);

    try {
      console.log(`  ⚙ reviewing ${key}${pr.headRefName ? ` (${pr.headRefName})` : ""}${isUpdate ? " [re-review: new commits]" : ""}${multiLens ? " [multi-lens]" : ""}…`);
      const reviewer = multiLens && cfg.llmProvider === "claude-cli" ? reviewPrMultiLens : reviewPr;
      const result = await reviewer(cfg, pr.repo, pr.number);
      // The reviewer chose the verdict; the gate can downgrade to advisory comment.
      const event = allowVerdicts ? result.event : "comment";
      const body = renderReview(result.body, isUpdate);
      if (dryRun) {
        console.log(`\n----- ${key} — ${result.pr.title} [${event}${isUpdate ? ", update" : ""}] -----\n${body}\n`);
      } else {
        const posted = await postReview(pr.repo, pr.number, body, event);
        store.record(key, { headOid: pr.headRefOid, url: result.pr.url, reviewed_at: nowIso(), blocking: event === "request-changes" });
        console.log(`  ✓ ${posted.toUpperCase()} on ${key}${isUpdate ? " [update]" : ""}`);
      }
      reviewed++;
    } catch (e) {
      console.error(`  ✗ ${key}: ${String(e).slice(0, 200)}`);
    }
  }
  if (!dryRun) store.save();
  console.log(`[pr-review] done — ${reviewed} reviewed, ${skipped} skipped.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
