/**
 * Content Draft Agent — turns ranked keyword clusters into:
 *   1. An editorial brief  (audience, angle, outline, CTA)
 *   2. Three channel drafts:  blog (markdown w/ frontmatter), LinkedIn,
 *      and an X thread (1–5 posts).
 *
 * Every draft is saved with status='pending'. Nothing ever publishes
 * from this module. The Approval Queue is the only path out.
 *
 * Risk levels assigned by this module flow into the agent_actions log:
 *   - blog draft        → med   (long-form, brand voice critical)
 *   - linkedin post     → med   (B2B audience, kommunal IT-ledere read these)
 *   - x thread          → low   (short, low-stakes)
 *
 * Each draft records the model used + Claude token counts so the
 * harness can enforce the budget_usd_month gate.
 */

import type { ContentAgentConfig } from "./config";
import type {
  Brief,
  Channel,
  Draft,
  KeywordCluster,
} from "./types";

// Approximate per-model pricing ($/1M tokens) — used for budget enforcement
// and the per-action cost_usd log. Update when Anthropic pricing changes; the
// harness uses these for the budget_usd_month gate.
const PRICE_PER_M = {
  "claude-opus-4-8": { input: 15, output: 75 },
  "claude-sonnet-5": { input: 3, output: 15 },
  "claude-sonnet-4-6": { input: 3, output: 15 },
  "claude-haiku-4-5-20251001": { input: 0.8, output: 4 },
} as const;

interface AnthropicResponse {
  content?: Array<{ type: string; text?: string }>;
  usage?: { input_tokens?: number; output_tokens?: number };
  model?: string;
}

interface AnthropicCallResult {
  text: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  model: string;
}

async function anthropic(
  cfg: ContentAgentConfig,
  opts: {
    model: string;
    systemPrompt: string;
    userMessage: string;
    maxTokens?: number;
  },
): Promise<AnthropicCallResult> {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": cfg.anthropicApiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: opts.model,
      max_tokens: opts.maxTokens ?? 4096,
      system: opts.systemPrompt,
      messages: [{ role: "user", content: opts.userMessage }],
    }),
  });
  if (!r.ok) {
    const err = await r.text();
    throw new Error(`anthropic ${r.status}: ${err.slice(0, 200)}`);
  }
  const json = (await r.json()) as AnthropicResponse;
  const text = (json.content ?? [])
    .filter((c) => c.type === "text")
    .map((c) => c.text ?? "")
    .join("\n");
  const tIn = json.usage?.input_tokens ?? 0;
  const tOut = json.usage?.output_tokens ?? 0;
  const pricing =
    PRICE_PER_M[opts.model as keyof typeof PRICE_PER_M] ??
    PRICE_PER_M["claude-sonnet-4-6"];
  const costUsd =
    (tIn / 1_000_000) * pricing.input + (tOut / 1_000_000) * pricing.output;
  return {
    text,
    inputTokens: tIn,
    outputTokens: tOut,
    costUsd,
    model: opts.model,
  };
}

function tryExtractJson<T>(text: string): T | null {
  // Tolerant JSON extractor — the model occasionally prefaces with prose
  // even when told not to. We grab the first {...} or [...] block.
  const match = text.match(/[\[{][\s\S]*[\]}]/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as T;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Phase 1 — brief

const BRIEF_SYSTEM = `Du er Digilists Content Strategy Agent.

Digilist er en kommunal SaaS-plattform for booking av lokaler (idrettshaller, møterom, kulturhus, gymsaler, selskapslokaler). Målgruppene er:
- innbygger (norske kommuneinnbyggere som vil leie et lokale)
- saksbehandler (kommune-ansatte som godkjenner/avviser/kommuniserer)
- driftsleder (eier idrettsanlegg, kulturhus, kantiner)
- IT-leder (innkjøper, SSA-L, GDPR, datalokasjon Norge, ID-porten/BankID)
- lag og foreninger (idrettslag, kor, korps, speidergrupper)

Stemme: konkret, nøktern, datadrevet, norsk bokmål. Aldri "transformere", "revolusjonere", "neste generasjon", "synergier". Skriv som en erfaren senior product manager: fakta, eksempel, nytteverdi. Aldri bruk tankestrek (— eller –) som skilletegn; bruk komma, kolon eller punktum. Unngå AI-klisjeer og fyllfraser ("Her er hva...", "La oss se på...", "Det er verdt å merke seg at...", "kort fortalt").

Du får ETT keyword-cluster, altså en GRUPPE beslektede søk som hører sammen (ikke ett enkelt søkeord). Oppgaven er å planlegge ÉN grundig, autoritativ pilar-artikkel som besvarer HELE klyngen av relaterte søk, ikke en tynn post om bare det ene sentrale ordet. Tenk søkeintensjon: hvilke ulike, men beslektede spørsmål stiller folk i denne klyngen, og hvordan dekker én sammenhengende artikkel dem alle?

Lag en editorial brief som dekker:
- audience  (én konkret målgruppe over — den som eier flest av søkene i klyngen)
- angle     (én setning: den unike vinklingen som differensierer Digilist)
- outline   (6-9 H2-seksjoner som til sammen dekker bredden i klyngen; hver seksjon svarer på en distinkt underintensjon slik at artikkelen rangerer for flere søk samtidig)
- subtopics (3-8 konkrete underemner/søkevarianter fra klyngen som teksten må berøre naturlig)
- cta       (eksakt CTA-tekst, typisk "Book demo" eller "Last ned PDF")

Returner KUN gyldig JSON, ingen forklaring:
{"audience":"...","angle":"...","outline":["...","..."],"subtopics":["...","..."],"cta":"..."}`;

export async function generateBrief(
  cfg: ContentAgentConfig,
  cluster: KeywordCluster,
): Promise<{
  brief: Omit<Brief, "id" | "cluster_id"> & { cluster_id: number };
  subtopics: string[];
  call: AnthropicCallResult;
}> {
  const userMessage = `Keyword-cluster (en gruppe beslektede søk): ${cluster.label}
Sentralt søkeord: ${cluster.centroid_term}
Klyngens tema (oppsummering av alle søkeordene i klyngen): ${cluster.topic_summary}
Signalstyrke (composite score): ${cluster.composite_score}

Planlegg ÉN grundig pilar-artikkel som besvarer hele denne klyngen. Returner brief som JSON.`;
  const call = await anthropic(cfg, {
    model: cfg.anthropicBriefModel,
    systemPrompt: BRIEF_SYSTEM,
    userMessage,
    maxTokens: 1536,
  });
  const parsed = tryExtractJson<{
    audience?: string;
    angle?: string;
    outline?: string[];
    subtopics?: string[];
    cta?: string;
  }>(call.text);
  if (!parsed?.audience || !parsed.angle) {
    throw new Error("brief: model returned invalid JSON");
  }
  return {
    brief: {
      cluster_id: cluster.id,
      channel: "blog",
      audience: parsed.audience,
      angle: parsed.angle,
      outline_json: JSON.stringify(parsed.outline ?? []),
      cta: parsed.cta ?? "Book demo",
      created_at: new Date().toISOString(),
      model: call.model,
    },
    subtopics: (parsed.subtopics ?? []).filter(Boolean),
    call,
  };
}

// ─────────────────────────────────────────────────────────────
// Phase 2 — blog draft (Norwegian markdown matching src/content/blog format)

const BLOG_SYSTEM = `Du er Digilists Content Writer Agent.

Du skriver én blog-post på norsk bokmål basert på en editorial brief. Formatet matcher Digilists eksisterende blog (src/content/blog/*.md):

\`\`\`markdown
---
slug: <kebab-case>
title: "<60-70 tegn, en konkret påstand>"
description: "<150-160 tegn, hva leseren får ut av den>"
date: <YYYY-MM-DD>
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: <integer 4-9>
tag: "<Innbygger | Saksbehandler | Driftsleder | IT-leder | Lag og foreninger>"
cover: "/images/blog/<existing-cover>.webp"
keywords: ["<3-7 keywords>"]
---

<artikkelen>
\`\`\`

Dette er en PILAR-artikkel som skal dekke en hel klynge av beslektede søk, ikke ett enkelt søkeord. Skriv bredt nok til å rangere for flere relaterte søk samtidig, men hold hver seksjon konkret og uten fyll.

Krav til selve teksten:
- 1200-2000 ord (readingMinutes = ord/200), grundig men uten fyllstoff
- Dekk ALLE underemnene fra briefen; hver H2 svarer på en distinkt søkeintensjon i klyngen
- Norsk bokmål, konkret og nøktern
- Bruk H2 (##) og H3 (###), ikke H1, det kommer fra frontmatter
- Start med en kort ingress (2-3 setninger) som slår an temaet uten fyllfraser
- Inkluder minst to konkrete tall eller navngitte eksempler (ikke "mange kommuner", skriv "Lillestrøm kommune"); finn ikke opp statistikk, bruk realistiske, etterprøvbare størrelsesordener
- Vurder en kort punktliste eller sammenligning der det gjør stoffet lettere å skanne
- Inkluder en avsluttende seksjon med CTA fra briefen
- Aldri "transformere", "revolusjonere", "neste generasjon"
- Aldri promote competitors negativt; fokuser på Digilists styrker
- Aldri bruk tankestrek (— eller –) som skilletegn. Bruk komma, kolon eller punktum. Bindestrek i sammensatte ord (SSA-L, IT-leder) og tallintervaller (95–100, 2024–2026) er greit.
- Skriv naturlig, enkelt norsk. Unngå AI-klisjeer og fyllfraser ("Her er hva...", "La oss se på...", "Det er verdt å merke seg at...", "kort fortalt", "når alt kommer til alt"), og ikke oversignaliser eller overhedge.

Returner KUN markdown-filen, inkludert frontmatter. Ingen forklaring før eller etter.`;

export async function generateBlogDraft(
  cfg: ContentAgentConfig,
  brief: Brief,
  cluster: KeywordCluster,
  subtopics: string[] = [],
): Promise<{
  draft: Omit<Draft, "id" | "brief_id">;
  call: AnthropicCallResult;
}> {
  const outline = JSON.parse(brief.outline_json) as string[];
  const subtopicBlock = subtopics.length
    ? `\n- underemner/søkevarianter å dekke naturlig (rangér for hele klyngen):\n${subtopics.map((s) => `  • ${s}`).join("\n")}`
    : "";
  const userMessage = `Keyword-cluster (gruppe beslektede søk): ${cluster.label}
Sentralt søkeord: ${cluster.centroid_term}
Klyngens tema: ${cluster.topic_summary}

Brief:
- audience: ${brief.audience}
- angle: ${brief.angle}
- outline (én H2 per punkt):
${outline.map((o, i) => `  ${i + 1}. ${o}`).join("\n")}${subtopicBlock}
- cta: ${brief.cta}

Skriv ÉN samlet pilar-artikkel som besvarer hele klyngen, som markdown inkludert frontmatter. Bruk dato ${new Date().toISOString().slice(0, 10)}.`;
  const call = await anthropic(cfg, {
    model: cfg.anthropicDraftModel,
    systemPrompt: BLOG_SYSTEM,
    userMessage,
    maxTokens: 8192,
  });
  const text = call.text.trim();
  // Pull frontmatter to populate the draft record's structured fields.
  const fmMatch = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  const frontmatter: Record<string, string> = {};
  let title = cluster.label;
  let body = text;
  if (fmMatch) {
    for (const line of fmMatch[1].split(/\r?\n/)) {
      const kv = line.match(/^(\w+):\s*(.*)$/);
      if (kv) frontmatter[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
    }
    title = frontmatter.title ?? title;
    body = text; // keep full markdown — when published, the whole text becomes the .md file
  }
  return {
    draft: {
      channel: "blog",
      title,
      body,
      frontmatter_json: JSON.stringify(frontmatter),
      hashtags_json: JSON.stringify([]),
      status: "pending",
      reviewer_notes: "",
      created_at: new Date().toISOString(),
      approved_at: null,
      published_at: null,
      published_url: null,
      external_id: null,
      model: call.model,
    },
    call,
  };
}

// ─────────────────────────────────────────────────────────────
// Phase 2.5 — deep editorial review. A separate, more-critical pass over the
// draft before it can auto-publish: catches vague claims, AI-tells, weak
// structure, thin cluster coverage, and factual over-reach, and returns a
// publication-ready rewrite plus a pass/revise/reject verdict.

const REVIEW_SYSTEM = `Du er Digilists ansvarlige redaktør (senior editor-in-chief). Du gjør en KRITISK sluttgjennomgang av et blogg-utkast før det publiseres automatisk på digilist.no. Du er den siste kvalitetskontrollen, så vær streng men rettferdig.

Digilist er en kommunal SaaS-plattform for booking av lokaler. Publikum er kommune-ansatte, IT-ledere, driftsledere, innbyggere og lag/foreninger. Stemme: konkret, nøktern, datadrevet, norsk bokmål.

Vurder utkastet mot denne sjekklisten:
1. Faktisk presisjon: konkrete tall og navngitte eksempler, ingen vage "mange kommuner". Ingen oppdiktet statistikk presentert som fakta.
2. Klyngedekning: dekker artikkelen bredden i søkeklyngen (flere beslektede intensjoner), ikke bare ett søkeord?
3. Stemme og AI-støy: ingen tankestrek (— –) som skilletegn, ingen AI-klisjeer/fyllfraser, ingen "transformere/revolusjonere/neste generasjon", ikke overhedging.
4. Struktur: tydelige H2/H3, skannbar, logisk flyt, ingen gjentakelser.
5. Korrekthet: ingen usanne eller injurierende påstander om konkurrenter; interne påstander om Digilist er rimelige.
6. Lengde og verdi: 1200-2000 ord, hver seksjon bærer sin egen vekt.
7. CTA til stede og naturlig.
8. Frontmatter intakt og gyldig.

Du SKAL returnere en forbedret, publiseringsklar versjon som retter alle problemene du finner. Behold frontmatter-feltene slug, cover, date, author, role og tag NØYAKTIG som i originalen (ikke endre dem); du kan forbedre title og description. Ikke legg til tankestrek. Behold markdown-strukturen (frontmatter + brødtekst).

Svar NØYAKTIG i dette formatet, ingenting annet:
VERDICT: pass | revise | reject
SCORE: <heltall 0-100>
ISSUES:
- <kort punkt per problem du fant og rettet; skriv "ingen vesentlige" hvis ren>
REVISED_MARKDOWN:
<hele den korrigerte markdown-filen inkludert frontmatter, uten kodefence>

Bruk verdict "reject" bare hvis utkastet er fundamentalt ubrukelig (feil tema, tomt, ikke-norsk). Bruk "revise" hvis du gjorde reelle forbedringer, "pass" hvis originalen allerede var sterk.`;

export interface BlogReview {
  verdict: "pass" | "revise" | "reject";
  score: number;
  issues: string[];
  finalBody: string; // revised markdown if valid, else the original
  revised: boolean;
}

/** Validate that a candidate markdown still has YAML frontmatter with the
 * critical fields, so a garbled review output can't ship a broken post. */
function looksLikeValidPost(md: string): boolean {
  const fm = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n[\s\S]+/);
  if (!fm) return false;
  return /\btitle:/.test(fm[1]) && md.replace(/^---[\s\S]*?---/, "").trim().length > 400;
}

export async function reviewBlogDraft(
  cfg: ContentAgentConfig,
  draftBody: string,
  cluster: KeywordCluster,
  brief: Brief,
): Promise<{ review: BlogReview; call: AnthropicCallResult }> {
  const outline = JSON.parse(brief.outline_json) as string[];
  const userMessage = `Søkeklynge: ${cluster.label} (sentralt: ${cluster.centroid_term})
Klyngens tema: ${cluster.topic_summary}
Tiltenkt målgruppe: ${brief.audience}
Planlagt outline: ${outline.join(" / ")}

UTKAST TIL GJENNOMGANG:
${draftBody}`;
  const call = await anthropic(cfg, {
    model: cfg.anthropicReviewModel,
    systemPrompt: REVIEW_SYSTEM,
    userMessage,
    maxTokens: 8192,
  });
  const text = call.text;
  const verdictM = text.match(/VERDICT:\s*(pass|revise|reject)/i);
  const scoreM = text.match(/SCORE:\s*(\d{1,3})/i);
  const issuesM = text.match(/ISSUES:\s*([\s\S]*?)\nREVISED_MARKDOWN:/i);
  const revisedM = text.match(/REVISED_MARKDOWN:\s*\n([\s\S]*)$/i);

  const verdict = (verdictM?.[1]?.toLowerCase() as BlogReview["verdict"]) ?? "revise";
  const score = scoreM ? Math.min(100, Math.max(0, Number(scoreM[1]))) : 70;
  const issues = (issuesM?.[1] ?? "")
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*[-•]\s*/, "").trim())
    .filter(Boolean);

  // Strip an accidental ```markdown fence around the revised body.
  let candidate = (revisedM?.[1] ?? "").trim();
  candidate = candidate
    .replace(/^```(?:markdown|md)?\s*\r?\n/, "")
    .replace(/\r?\n```\s*$/, "")
    .trim();

  // Only accept the rewrite if it's a structurally valid post; otherwise keep
  // the original body so a malformed review can never ship a broken file.
  const accepted = candidate && looksLikeValidPost(candidate);
  const finalBody = accepted ? candidate : draftBody;

  return {
    review: {
      verdict,
      score,
      issues,
      finalBody,
      revised: Boolean(accepted) && finalBody !== draftBody,
    },
    call,
  };
}

// ─────────────────────────────────────────────────────────────
// Phase 3 — LinkedIn + X drafts. Generated together so they stay
// stylistically aligned but channel-appropriate.

const SOCIAL_SYSTEM = `Du er Digilists Content Writer Agent.

Du lager TO sosiale-medier-drafts samtidig, én LinkedIn-post og én X-tråd, basert på samme brief. Begge på norsk bokmål. Aldri bruk tankestrek (— eller –) som skilletegn; bruk komma, kolon eller punktum. Skriv naturlig, enkelt norsk og unngå AI-klisjeer og fyllfraser.

LinkedIn-post:
- 800-1200 tegn (LinkedIn cutter ved ~1300, men kortere = bedre engasjement)
- Krok i første linje (1 setning, konkret, nysgjerrighet-skapende)
- 3-5 punkter eller en mini-historie
- Slutt med en tydelig CTA + 2-4 hashtags som matcher norsk B2B-publikum (#kommune #booking #offentligsektor osv.)
- Aldri emojis utover sparsom bruk (max 1-2 totalt)
- Ingen "I'm excited to announce" / "Husk å like og dele"

X-tråd:
- 2-5 tweets
- Hver tweet 240-275 tegn (rom for citat-tweet retweets)
- Første tweet skal stå alene som en sterk hook + nummerering (1/X)
- Siste tweet inneholder CTA
- 1-3 hashtags TOTALT, plassert i siste tweet

Returner KUN gyldig JSON, ingen forklaring:
{
  "linkedin": { "title":"<hook line>", "body":"<full post>", "hashtags":["..."] },
  "x_thread": { "title":"<hook line>", "tweets":["...","..."], "hashtags":["..."] }
}`;

export async function generateSocialDrafts(
  cfg: ContentAgentConfig,
  brief: Brief,
  cluster: KeywordCluster,
): Promise<{
  linkedin: Omit<Draft, "id" | "brief_id">;
  x: Omit<Draft, "id" | "brief_id">;
  call: AnthropicCallResult;
}> {
  const outline = JSON.parse(brief.outline_json) as string[];
  const userMessage = `Cluster: ${cluster.label}
Centroid term: ${cluster.centroid_term}

Brief:
- audience: ${brief.audience}
- angle: ${brief.angle}
- outline: ${outline.join(" / ")}
- cta: ${brief.cta}

Lag LinkedIn-post og X-tråd som JSON.`;
  const call = await anthropic(cfg, {
    model: cfg.anthropicBriefModel,
    systemPrompt: SOCIAL_SYSTEM,
    userMessage,
    maxTokens: 2048,
  });
  const parsed = tryExtractJson<{
    linkedin?: { title?: string; body?: string; hashtags?: string[] };
    x_thread?: { title?: string; tweets?: string[]; hashtags?: string[] };
  }>(call.text);
  if (!parsed?.linkedin?.body || !parsed.x_thread?.tweets) {
    throw new Error("social: model returned invalid JSON");
  }
  const now = new Date().toISOString();
  return {
    linkedin: {
      channel: "linkedin",
      title: parsed.linkedin.title ?? cluster.label,
      body: parsed.linkedin.body,
      frontmatter_json: "{}",
      hashtags_json: JSON.stringify(parsed.linkedin.hashtags ?? []),
      status: "pending",
      reviewer_notes: "",
      created_at: now,
      approved_at: null,
      published_at: null,
      published_url: null,
      external_id: null,
      model: call.model,
    },
    x: {
      channel: "x",
      title: parsed.x_thread.title ?? cluster.label,
      // Store the thread as newline-joined; the publisher splits back.
      body: (parsed.x_thread.tweets ?? []).join("\n---\n"),
      frontmatter_json: JSON.stringify({ tweetCount: parsed.x_thread.tweets.length }),
      hashtags_json: JSON.stringify(parsed.x_thread.hashtags ?? []),
      status: "pending",
      reviewer_notes: "",
      created_at: now,
      approved_at: null,
      published_at: null,
      published_url: null,
      external_id: null,
      model: call.model,
    },
    call,
  };
}

export function riskForChannel(channel: Channel): "low" | "med" | "high" {
  // The Approval Queue ("only path to publish") is a hard gate, so
  // these risk levels drive UI badges + budget alerts, not gating.
  switch (channel) {
    case "blog":
      return "med";
    case "linkedin":
      return "med";
    case "x":
      return "low";
  }
}
