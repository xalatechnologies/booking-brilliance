/**
 * PR-review agent — the reviewer core. Pulls a PR's metadata + diff via
 * `gh --repo <slug>` and asks Claude (best model, capable mode on the Max
 * subscription) to review it like an experienced senior engineer would: short,
 * opinionated, leading with what actually matters — not an exhaustive checklist.
 *
 * Returns { event, body }: the reviewer's own verdict (approve / request-changes
 * / comment) and the human-voice review text. The agent never merges.
 */
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { runCapableAgent } from "../../content-agent/src/claude-agent";
import type { ContentAgentConfig } from "../../content-agent/src/config";
import { anthropic } from "../../content-agent/src/generate";
import { extractJson, parallel } from "../../content-agent/src/orchestrate";

const exec = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export type ReviewEvent = "approve" | "request-changes" | "comment";

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

export interface ReviewResult {
  pr: PullRequest;
  event: ReviewEvent;
  body: string; // human-voice markdown review (no marker / template)
  model: string;
}

const MAX_DIFF = 60_000;

// The voice. A 30+-year veteran staff engineer's PR comment — not a checklist.
const SYSTEM = `Du er en staff-ingeniør med 30+ års erfaring som ser over en kollegas PR i Digilist (kommunal booking-SaaS: React-marketing + Convex-app). Du har sett tusenvis av PR-er, vet hva som faktisk går galt i produksjon, og har verken tid eller behov for å vise deg fram. Skriv som et menneske til et menneske.

Slik en veteran reviewer:
- Instinkt for hva som betyr noe: du ser rett på den reelle risikoen — en bug, et RBAC-hull, en regresjon, et designvalg som vil svi senere — og lar resten ligge. Vanligvis 1-3 poeng.
- Du gjetter ikke: du åpner koden (repository-map: search_graph/get_code_snippet, Read) og sjekker kallere, typer, RBAC og tester. Pek på fil:linje for det som teller.
- Du forklarer kort HVORFOR det biter og hva du ville gjort — som en mentor, ikke en linter. Del gjerne en kort "sett dette gå galt før"-innsikt når den er relevant.
- Du bryr deg ikke om nitplukk (stil, navn, mikro-optimalisering) med mindre det faktisk skaper problemer.

Stemme:
- Kort, rolig, direkte. Naturlig norsk prosa, som en erfaren kollega på Slack.
- INGEN maler: ingen "Risiko/Funn/Styrker/Tester"-seksjoner, ingen emoji-overskrifter, ingen poengsummer.
- INGEN AI-fyll: ikke "Denne PR-en...", "Samlet sett", "Det er verdt å merke seg", "Her er...". Ikke ramse opp alt som er bra — hvis den er solid, si det på én linje og gå videre.
- 3-8 setninger. Maks 2-3 korte kulepunkter, og bare hvis det gjør konkrete funn tydeligere.

Konkluder som en anmelder:
- approve: grei å merge (småting kan nevnes uten å blokkere).
- request-changes: noe MÅ fikses først (reell bug/regresjon/sikkerhetshull).
- comment: verdt å se på, men ikke en hard blokker.

Svar til slutt med JSON på siste linje (ingen kodeblokk):
{"verdict":"approve|request-changes|comment","review":"<reviewen i kort markdown, menneskelig stemme>"}`;

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

interface RawReview {
  verdict?: string;
  review?: string;
}

function coerce(raw: RawReview | null): { event: ReviewEvent; body: string } | null {
  const body = (raw?.review ?? "").trim();
  if (!body) return null;
  const v = String(raw?.verdict ?? "").toLowerCase();
  const event: ReviewEvent = v.includes("request") || v.includes("change") ? "request-changes" : v.includes("approve") ? "approve" : "comment";
  return { event, body };
}

function prContext(pr: PullRequest, diff: string): string {
  const capped = diff.length > MAX_DIFF ? `${diff.slice(0, MAX_DIFF)}\n\n[diff avkortet ved ${MAX_DIFF} tegn]` : diff;
  return `PR #${pr.number}: ${pr.title}
${pr.headRefName} → ${pr.baseRefName} · +${pr.additions}/-${pr.deletions} i ${pr.changedFiles} filer

BESKRIVELSE:
${(pr.body || "(ingen)").slice(0, 2000)}

DIFF:
\`\`\`diff
${capped}
\`\`\``;
}

/** Review one PR as a single senior reviewer (capable mode when on claude-cli). */
export async function reviewPr(cfg: ContentAgentConfig, repo: string, number: number): Promise<ReviewResult> {
  const pr = await fetchPr(repo, number);
  const diff = await fetchDiff(repo, number);
  const checkout = localCheckout(repo);
  const prompt = `${prContext(pr, diff)}\n\nReview denne som en erfaren kollega. Svar til slutt med JSON: {"verdict":"...","review":"..."}`;

  let text: string;
  let model: string;
  if (cfg.llmProvider === "claude-cli") {
    const r = await runCapableAgent({ prompt, systemPrompt: SYSTEM, model: cfg.anthropicReviewModel, cwd: checkout, maxTurns: 40, timeoutMin: 12 });
    text = r.text;
    model = r.model;
  } else {
    const call = await anthropic(cfg, { model: cfg.anthropicReviewModel, systemPrompt: SYSTEM, userMessage: prompt, maxTokens: 2048 });
    text = call.text;
    model = call.model;
  }
  const out = coerce(extractJson<RawReview>(text));
  if (!out) throw new Error(`no review parsed. Tail: ${text.slice(-300).replace(/\n/g, " ")}`);
  return { pr, event: out.event, body: out.body, model };
}

// ── Multi-lens: deep parallel analysis, one concise human synthesis ─────────

const LENSES: { key: string; focus: string }[] = [
  { key: "korrekthet", focus: "reelle bugs og regresjoner: gjør endringen det den påstår? Sjekk kallere (trace_path/search_graph), grenseverdier, ruting (redirect-løkker, feil målrute)." },
  { key: "sikkerhet", focus: "sikkerhet/RBAC: tenant-scoping og cross-tenant-lekkasje, auth (ID-porten/BankID/Entra), secrets/PII." },
  { key: "design", focus: "designvalg verdt å utfordre og manglende testdekning på de risikofylte stiene (inkl. om testene faktisk kjøres i CI)." },
];

/**
 * Multi-agent review: lenses dig deep in parallel (each grounds in the repo
 * map) and report ONLY the real problems they find, then one synthesizer writes
 * a single short, human review picking what actually matters. Depth without the
 * exhaustive-checklist bloat.
 */
export async function reviewPrMultiLens(cfg: ContentAgentConfig, repo: string, number: number): Promise<ReviewResult> {
  const pr = await fetchPr(repo, number);
  const diff = await fetchDiff(repo, number);
  const checkout = localCheckout(repo);
  const context = prContext(pr, diff);

  const notes = await parallel(
    LENSES.map((lens) => async (): Promise<string> => {
      const r = await runCapableAgent({
        prompt: `${context}\n\nDu ser KUN på: ${lens.focus}\nGrunn deg i koden (repo-map + Read). List de REELLE problemene du finner, kort og med fil:linje. Skriv "ingen" hvis alt er greit på din dimensjon. Ikke nitplukk.`,
        systemPrompt: `Du er senior Digilist-reviewer med ansvar for ${lens.key}. Vær presis og kodegrunnet. Bare reelle problemer.`,
        model: cfg.anthropicReviewModel,
        cwd: checkout,
        maxTurns: 30,
        timeoutMin: 10,
      });
      return `[${lens.key}] ${r.text.trim()}`;
    }),
  );
  const lensNotes = notes.filter((n): n is string => Boolean(n)).join("\n\n");

  // Synthesize one concise human review from the lens notes.
  const synthPrompt = `${context}\n\nSpesialist-reviewers rapporterte dette (rådata, kan inneholde støy og "ingen"):\n${lensNotes}\n\nSkriv ÉN kort, menneskelig review som en erfaren kollega. Plukk KUN det som faktisk betyr noe (ignorer "ingen" og nitplukk). Konkluder. Svar til slutt med JSON: {"verdict":"...","review":"..."}`;
  const r = await runCapableAgent({ prompt: synthPrompt, systemPrompt: SYSTEM, model: cfg.anthropicReviewModel, cwd: checkout, maxTurns: 8, timeoutMin: 6 });
  const out = coerce(extractJson<RawReview>(r.text));
  if (!out) throw new Error(`multi-lens synthesis produced no review. Tail: ${r.text.slice(-300).replace(/\n/g, " ")}`);
  return { pr, event: out.event, body: out.body, model: `${cfg.anthropicReviewModel} (max-cli · ${LENSES.length}-lens)` };
}
