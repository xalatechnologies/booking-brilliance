/**
 * PR-review agent — the reviewer core. Given a GitHub repo slug (owner/name) +
 * PR number, it pulls the PR metadata and diff via `gh --repo <slug>` (no local
 * checkout needed — it scans GitHub directly), then asks Claude (best model, on
 * the Max subscription when LLM_PROVIDER=claude-cli) for a senior code review of
 * the change. Returns a structured verdict the poster turns into a GitHub review.
 *
 * Deliberately diff-based and read-only: it reviews the patch + PR context, does
 * not check out or run the code, and never approves or merges — it posts an
 * advisory COMMENT review only.
 */
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { runCapableAgent } from "../../content-agent/src/claude-agent";
import type { ContentAgentConfig } from "../../content-agent/src/config";
import { anthropic } from "../../content-agent/src/generate";

const exec = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Local checkout for a repo slug, if present — lets the reviewer use the
 *  repository map (codebase-memory) + Read to ground the review in real code. */
export function localCheckout(repo: string): string | undefined {
  const name = (repo.split("/")[1] ?? repo).toLowerCase();
  const candidates =
    name === "digilist"
      ? [process.env.DIGILIST_REPO_PATH ?? "/root/Digilist"]
      : name === "booking-brilliance"
        ? [path.resolve(__dirname, "..", "..", ".."), "/root/booking-brilliance"]
        : [];
  return candidates.find((p) => p && fs.existsSync(path.join(p, ".git")));
}

/** gh needs a valid token; a broken GITHUB_TOKEN in env shadows the keyring. */
function ghEnv(): NodeJS.ProcessEnv {
  return { ...process.env, GITHUB_TOKEN: process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN ?? "" };
}

export interface PullRequest {
  number: number;
  title: string;
  body: string;
  headRefName: string;
  headRefOid: string;
  baseRefName: string;
  author: string;
  isDraft: boolean;
  additions: number;
  deletions: number;
  changedFiles: number;
  url: string;
  files: string[];
}

export interface ReviewFinding {
  severity: "blocker" | "major" | "minor" | "nit";
  file?: string;
  note: string;
}

export interface ReviewVerdict {
  summary: string;
  risk: "low" | "medium" | "high";
  blocking: boolean; // true → the reviewer thinks changes are needed before merge
  findings: ReviewFinding[];
  strengths: string[];
  tests: string; // note on test coverage / whether tests were added
}

const MAX_DIFF = 60_000; // chars — keep the prompt within a single turn

const SYSTEM = `Du er en senior kode-reviewer for Digilist (norsk kommunal booking-SaaS: Vite+React marketing-site og en Convex-basert app). Du gjør grundige, presise PR-reviews.

Vurder endringen for: korrekthet og regresjoner, sikkerhet (auth/RBAC, injection, secrets, PII), tilgjengelighet (WCAG) der UI endres, ytelse, testdekning, og om PR-en faktisk løser det den sier. Vær konkret og pek på fil/linje når du kan. Ikke finn opp problemer — hvis endringen er god, si det.

Svar KUN med JSON på dette skjemaet:
{
  "summary": "2-4 setninger: hva PR-en gjør og din helhetsvurdering",
  "risk": "low|medium|high",
  "blocking": true|false,
  "findings": [{"severity":"blocker|major|minor|nit","file":"sti (valgfritt)","note":"konkret funn + forslag"}],
  "strengths": ["det som er bra"],
  "tests": "vurdering av testdekning"
}
blocking=true kun ved reelle blocker/major-funn. Maks 12 findings, viktigst først.`;

/** Fetch a PR's metadata + file list via gh (by repo slug, no checkout). */
export async function fetchPr(repo: string, number: number): Promise<PullRequest> {
  const { stdout } = await exec(
    "gh",
    ["pr", "view", String(number), "--repo", repo, "--json",
      "number,title,body,headRefName,headRefOid,baseRefName,author,isDraft,additions,deletions,changedFiles,url,files"],
    { env: ghEnv(), timeout: 30_000, maxBuffer: 16 * 1024 * 1024 },
  );
  const j = JSON.parse(stdout) as Record<string, unknown>;
  return {
    number: j.number as number,
    title: (j.title as string) ?? "",
    body: (j.body as string) ?? "",
    headRefName: (j.headRefName as string) ?? "",
    headRefOid: (j.headRefOid as string) ?? "",
    baseRefName: (j.baseRefName as string) ?? "",
    author: (j.author as { login?: string })?.login ?? "",
    isDraft: Boolean(j.isDraft),
    additions: (j.additions as number) ?? 0,
    deletions: (j.deletions as number) ?? 0,
    changedFiles: (j.changedFiles as number) ?? 0,
    url: (j.url as string) ?? "",
    files: Array.isArray(j.files) ? (j.files as { path: string }[]).map((f) => f.path) : [],
  };
}

/** Fetch the unified diff for a PR (capped). */
export async function fetchDiff(repo: string, number: number): Promise<string> {
  const { stdout } = await exec("gh", ["pr", "diff", String(number), "--repo", repo], {
    env: ghEnv(), timeout: 40_000, maxBuffer: 64 * 1024 * 1024,
  });
  return stdout;
}

/** All balanced {...} substrings (tolerates prose / markdown fences around them). */
function extractJsonObjects(text: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let start = -1;
  let inStr = false;
  let esc = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === "{") { if (depth === 0) start = i; depth++; }
    else if (c === "}") { depth--; if (depth === 0 && start >= 0) { out.push(text.slice(start, i + 1)); start = -1; } }
  }
  return out;
}

/** Robustly pull the review verdict JSON from a capable agent's free-form final
 *  message: prefer a balanced object that has the review keys, largest first. */
function tryJson<T>(text: string): T | null {
  const candidates = extractJsonObjects(text).sort((a, b) => b.length - a.length);
  // Prefer objects that look like a verdict.
  const ordered = [
    ...candidates.filter((c) => /"(summary|findings|risk)"\s*:/.test(c)),
    ...candidates,
  ];
  for (const c of ordered) {
    try {
      return JSON.parse(c) as T;
    } catch {
      /* try next */
    }
  }
  return null;
}

/** Review one PR: pull metadata + diff, ask Claude, return a structured verdict. */
export async function reviewPr(
  cfg: ContentAgentConfig,
  repo: string,
  number: number,
): Promise<{ pr: PullRequest; verdict: ReviewVerdict; model: string }> {
  const pr = await fetchPr(repo, number);
  let diff = await fetchDiff(repo, number);
  let truncated = "";
  if (diff.length > MAX_DIFF) {
    diff = diff.slice(0, MAX_DIFF);
    truncated = `\n\n[diff avkortet ved ${MAX_DIFF} tegn — ${pr.changedFiles} filer totalt]`;
  }

  const checkout = localCheckout(repo);
  const groundingNote = checkout
    ? `\nDu står i repoet (${repo}). Du HAR verktøy: repository-map (codebase-memory: search_graph/get_code_snippet/get_architecture/trace_path), Read/Grep/Glob. Bruk dem til å verifisere at diffen henger sammen med resten av koden (kallere, typer, tester, RBAC) før du konkluderer. Kun review — ikke endre filer.`
    : "";
  const userMessage = `PR #${pr.number}: ${pr.title}
Forfatter: ${pr.author} · ${pr.headRefName} → ${pr.baseRefName}
Endringer: +${pr.additions} / -${pr.deletions} i ${pr.changedFiles} filer

BESKRIVELSE:
${(pr.body || "(ingen)").slice(0, 3000)}

FILER:
${pr.files.slice(0, 60).join("\n")}

DIFF:
\`\`\`diff
${diff}
\`\`\`${truncated}
${groundingNote}
Gi en grundig review. Din SISTE melding skal være KUN JSON-objektet (ingen prosa rundt).`;

  let text: string;
  let model: string;
  if (cfg.llmProvider === "claude-cli") {
    // Capable mode: full tools + the repository map, grounded in the checkout.
    const r = await runCapableAgent({
      prompt: `${userMessage}\n\nAvslutt med verdict-objektet som REN JSON på siste linje — ingen \`\`\`-kodeblokk, ingen tekst etter.`,
      systemPrompt: SYSTEM,
      model: cfg.anthropicReviewModel,
      cwd: checkout,
      maxTurns: 40,
      timeoutMin: 12,
    });
    text = r.text;
    model = r.model;
  } else {
    // Local/API fallback: tool-free single call over the diff.
    const call = await anthropic(cfg, { model: cfg.anthropicReviewModel, systemPrompt: SYSTEM, userMessage, maxTokens: 3072 });
    text = call.text;
    model = call.model;
  }
  const parsed = tryJson<Partial<ReviewVerdict>>(text);
  if (!parsed || !parsed.summary) {
    // Don't post an empty/garbage review — skip and let the next cycle retry.
    throw new Error(`no JSON verdict parsed. Tail: ${text.slice(-300).replace(/\n/g, " ")}`);
  }
  const okSev = ["blocker", "major", "minor", "nit"];
  const verdict: ReviewVerdict = {
    summary: parsed?.summary ?? "Klarte ikke å produsere et sammendrag.",
    risk: (["low", "medium", "high"].includes(parsed?.risk as string) ? parsed!.risk : "medium") as ReviewVerdict["risk"],
    blocking: Boolean(parsed?.blocking),
    findings: Array.isArray(parsed?.findings)
      ? parsed!.findings!
          .filter((f) => f && typeof f.note === "string")
          .map((f) => ({ severity: (okSev.includes(f.severity as string) ? f.severity : "minor") as ReviewFinding["severity"], file: f.file, note: f.note }))
          .slice(0, 12)
      : [],
    strengths: Array.isArray(parsed?.strengths) ? parsed!.strengths!.filter((s) => typeof s === "string").slice(0, 6) : [],
    tests: parsed?.tests ?? "",
  };
  return { pr, verdict, model };
}
