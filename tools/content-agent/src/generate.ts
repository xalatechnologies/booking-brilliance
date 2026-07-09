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

// Approximate Sonnet 4.6 pricing as of 2026-05 — used for budget
// enforcement and the per-action cost_usd log. Update when Anthropic
// pricing changes; the harness uses these for the budget_usd_month gate.
const PRICE_PER_M = {
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

Du får ett keyword-cluster og skal lage en kort editorial brief som dekker:
- audience  (én konkret målgruppe over)
- angle     (én setning: den unike vinklingen som differensierer Digilist)
- outline   (4-7 punkter: det blog-posten skal dekke)
- cta       (eksakt CTA-tekst, typisk "Book demo" eller "Last ned PDF")

Returner KUN gyldig JSON, ingen forklaring:
{"audience":"...","angle":"...","outline":["...","..."],"cta":"..."}`;

export async function generateBrief(
  cfg: ContentAgentConfig,
  cluster: KeywordCluster,
): Promise<{
  brief: Omit<Brief, "id" | "cluster_id"> & { cluster_id: number };
  call: AnthropicCallResult;
}> {
  const userMessage = `Cluster: ${cluster.label}
Centroid term: ${cluster.centroid_term}
Topic summary: ${cluster.topic_summary}
Composite score: ${cluster.composite_score}

Lag editorial brief som JSON.`;
  const call = await anthropic(cfg, {
    model: cfg.anthropicCheapModel,
    systemPrompt: BRIEF_SYSTEM,
    userMessage,
    maxTokens: 1024,
  });
  const parsed = tryExtractJson<{
    audience?: string;
    angle?: string;
    outline?: string[];
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

Krav til selve teksten:
- 800-1500 ord (readingMinutes = ord/200)
- Norsk bokmål, konkret og nøktern
- Bruk H2 (##) og H3 (###), ikke H1, det kommer fra frontmatter
- Inkluder minst ett konkret tall eller eksempel (ikke "mange kommuner", skriv "Lillestrøm kommune")
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
): Promise<{
  draft: Omit<Draft, "id" | "brief_id">;
  call: AnthropicCallResult;
}> {
  const outline = JSON.parse(brief.outline_json) as string[];
  const userMessage = `Cluster: ${cluster.label}
Centroid term: ${cluster.centroid_term}
Topic summary: ${cluster.topic_summary}

Brief:
- audience: ${brief.audience}
- angle: ${brief.angle}
- outline:
${outline.map((o, i) => `  ${i + 1}. ${o}`).join("\n")}
- cta: ${brief.cta}

Skriv hele blog-posten som markdown, inkludert frontmatter. Bruk dato ${new Date().toISOString().slice(0, 10)}.`;
  const call = await anthropic(cfg, {
    model: cfg.anthropicDraftModel,
    systemPrompt: BLOG_SYSTEM,
    userMessage,
    maxTokens: 6144,
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
    model: cfg.anthropicDraftModel,
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
