/**
 * The analyzer — grounds each item in the actual codebase before deciding
 * anything. It probes the code graph (searchGraph) for the symbols an item
 * implies, then asks the best model to judge:
 *   - idea    → exists | partial | gap (don't re-propose what's already built)
 *   - finding → where the fix lives + a concrete fix
 * and to draft a self-contained Claude `/loop` goal for the genuine ones.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runCapableAgent } from "../../content-agent/src/claude-agent";
import type { ContentAgentConfig } from "../../content-agent/src/config";
import { anthropic, type AnthropicCallResult } from "../../content-agent/src/generate";
import { searchGraph, type GraphSymbol } from "./code-map";
import { REPOS, type Item, type RepoKey } from "./inputs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Code-derived inventory of what a repo already ships (regenerated from the
 * graph). Authoritative context so a probe that misses (wrong wording) can't
 * make the analyzer call an existing feature a "gap". */
export function loadCapabilities(repo: RepoKey): string {
  try {
    return fs.readFileSync(path.resolve(__dirname, "..", "brain", `capabilities-${repo}.md`), "utf-8");
  } catch {
    return "";
  }
}

export type IssueType = "bug" | "feature" | "improvement" | "nice-to-have";
export type Severity = "critical" | "major" | "minor";
export type Priority = "P0" | "P1" | "P2" | "P3";

export interface Verdict {
  status: "exists" | "partial" | "gap" | "fixable" | "not-actionable";
  actionable: boolean;
  confidence: number; // 0..1
  type: IssueType;
  severity: Severity;
  priority: Priority;
  code_evidence: { ref: string; note: string }[];
  fix: string;
  goal_prompt: string;
}

const SYSTEM = `Du er teknisk produkt- og arkitektur-analytiker for Digilist, en kommunal SaaS-bookingplattform (Convex-backend + React, pakker: booking-core, discovery-core, billing, ticketing-core, ds, digilist).

Du får ETT arbeidsemne (enten en produktidé, eller et skann-funn fra kvalitetsovervåkingen) sammen med BEVIS fra kodegrafen: hvilke symboler/moduler som finnes eller mangler. Bruk bevisene strengt, ikke gjett.

Avgjør status:
- For en IDÉ: "exists" (finnes allerede i koden), "partial" (delvis dekket), eller "gap" (ekte manglende funksjon).
- For et FUNN: "fixable" (reelt problem med en klar fiks), eller "not-actionable" (falsk positiv / ikke noe å gjøre i koden).

Sett actionable=true bare når det er reelt arbeid å gjøre (gap, partial-forbedring, eller fixable funn). Ikke foreslå å bygge noe som allerede finnes.

Kategoriser hvert actionable emne:
- type: "bug" (noe er ødelagt/feil), "feature" (ny funksjon / ekte gap), "improvement" (forbedring av noe som finnes), "nice-to-have" (lav verdi, kosmetisk).
- severity: "critical" (blokkerer bruk / sikkerhet / datatap), "major" (tydelig funksjons- eller kvalitetstap), "minor" (liten effekt).
- priority: "P0" (haster nå), "P1" (høy), "P2" (medium), "P3" (lav). Utled fra severity + brukerpåvirkning + søkeetterspørsel/bevis.

For actionable emner, lag et SELVSTENDIG Claude-mål (goal_prompt) som en utvikler kan kjøre med /loop i riktig repo: konkret hva som skal bygges/fikses, hvilke filer/moduler (fra bevisene), akseptansekriterier, og at tester skal være grønne før PR. Norsk bokmål, ingen tankestrek som skilletegn.

Returner KUN gyldig JSON:
{"status":"...","actionable":true|false,"confidence":0.0-1.0,"type":"bug|feature|improvement|nice-to-have","severity":"critical|major|minor","priority":"P0|P1|P2|P3","code_evidence":[{"ref":"fil/symbol","note":"kort"}],"fix":"hva som skal gjøres","goal_prompt":"selvstendig /loop-mål"}`;

function tryJson<T>(text: string): T | null {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    return JSON.parse(m[0]) as T;
  } catch {
    return null;
  }
}

/** Probe the graph for the symbols an item implies. Returns evidence text. */
async function gatherEvidence(
  project: string,
  item: Item,
): Promise<{ text: string; hits: GraphSymbol[] }> {
  const all: GraphSymbol[] = [];
  const lines: string[] = [];
  for (const hint of item.probe_hints.slice(0, 6)) {
    const hits = await searchGraph(project, hint, 4).catch(() => []);
    all.push(...hits);
    lines.push(
      hits.length
        ? `- "${hint}": ${hits.length} treff, f.eks. ${hits
            .slice(0, 3)
            .map((h) => `${h.name} (${h.file_path})`)
            .join("; ")}`
        : `- "${hint}": 0 treff (finnes ikke i koden)`,
    );
  }
  return { text: lines.join("\n") || "(ingen prober kjørt)", hits: all };
}

export async function analyzeItem(
  cfg: ContentAgentConfig,
  item: Item,
  project: string,
): Promise<{ verdict: Verdict; call: AnthropicCallResult }> {
  const { text: evidence } = await gatherEvidence(project, item);
  const capabilities = loadCapabilities(item.target_repo);
  const capBlock = capabilities
    ? `KJENTE FUNKSJONER I KODEN (autoritativ, kodeavledet oversikt over hva repoet ALLEREDE har — kryss emnet mot denne FØRST; hvis det dekkes her, er status "exists"/"partial" selv om graf-prober ga null treff, fordi prober kan bruke feil ordlyd):\n${capabilities}\n\n`
    : "";
  const userMessage = `${capBlock}EMNE (${item.kind === "idea" ? "produktidé" : `skann-funn: ${item.category}/${item.severity}`}):
Tittel: ${item.title}
Detaljer: ${item.detail}
Mål-repo: ${item.target_repo}

KODEGRAF-BEVIS (navnesøk i mål-repo; null treff kan skyldes ordlyd, ikke fravær):
${evidence}

Avgjør status (kryss mot KJENTE FUNKSJONER først) og lag et /loop-mål bare hvis genuint actionable. Returner JSON.`;

  let call: AnthropicCallResult;
  if (cfg.llmProvider === "claude-cli") {
    // Capable mode: let the analyzer use the repository map + Read to verify the
    // CLI-gathered evidence in the actual checkout before judging.
    const cwd = REPOS[item.target_repo]?.path;
    const r = await runCapableAgent({
      prompt: `${userMessage}\n\nDin SISTE melding skal være KUN JSON-objektet.`,
      systemPrompt: SYSTEM,
      model: cfg.anthropicReviewModel,
      cwd: cwd && fs.existsSync(path.join(cwd, ".git")) ? cwd : undefined,
      maxTurns: 30,
      timeoutMin: 10,
    });
    call = { text: r.text, inputTokens: 0, outputTokens: 0, costUsd: 0, model: r.model };
  } else {
    call = await anthropic(cfg, {
      model: cfg.anthropicReviewModel, // best model — architectural judgement
      systemPrompt: SYSTEM,
      userMessage,
      maxTokens: 2048,
    });
  }
  const parsed = tryJson<Partial<Verdict>>(call.text);
  // Sensible fallbacks when the model omits a field: ideas → feature/improvement,
  // findings → bug; severity from the finding severity; priority from severity.
  const defaultType: IssueType =
    item.kind === "idea" ? (parsed?.status === "partial" ? "improvement" : "feature") : "bug";
  const defaultSeverity: Severity = item.severity === "error" ? "major" : "minor";
  const okType = ["bug", "feature", "improvement", "nice-to-have"];
  const okSev = ["critical", "major", "minor"];
  const okPrio = ["P0", "P1", "P2", "P3"];
  const severity = (okSev.includes(parsed?.severity as string) ? parsed!.severity : defaultSeverity) as Severity;
  const verdict: Verdict = {
    status: (parsed?.status as Verdict["status"]) ?? "not-actionable",
    actionable: Boolean(parsed?.actionable),
    confidence: typeof parsed?.confidence === "number" ? Math.max(0, Math.min(1, parsed.confidence)) : 0.5,
    type: (okType.includes(parsed?.type as string) ? parsed!.type : defaultType) as IssueType,
    severity,
    priority: (okPrio.includes(parsed?.priority as string)
      ? parsed!.priority
      : severity === "critical" ? "P0" : severity === "major" ? "P1" : "P2") as Priority,
    code_evidence: Array.isArray(parsed?.code_evidence) ? parsed!.code_evidence!.slice(0, 8) : [],
    fix: parsed?.fix ?? "",
    goal_prompt: parsed?.goal_prompt ?? "",
  };
  return { verdict, call };
}
