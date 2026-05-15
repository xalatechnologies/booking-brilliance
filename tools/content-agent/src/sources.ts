/**
 * Keyword discovery sources. Each returns a flat list of Keyword rows
 * (without id — DB assigns) that the orchestrator merges and dedupes.
 *
 * Design rules:
 *   - Every source is independently optional. If credentials/network
 *     fail, the source returns []. The pipeline carries on.
 *   - Every source normalizes its score onto a 0..100 scale so the
 *     analyzer can compare apples to apples.
 *   - Every source records a small structured metadata blob (subreddit,
 *     trend rank, HN points, RSS source-feed) for traceability.
 */

import type { Keyword, KeywordSource } from "./types";
import { normalizeTerm } from "./convex-write";
import type { ContentAgentConfig } from "./config";
import { SEED_TERMS } from "./seed-keywords";

// ─────────────────────────────────────────────────────────────
// Common helpers

const NOW = () => new Date().toISOString();

async function fetchWithTimeout(
  url: string,
  init: RequestInit & { timeoutMs?: number } = {},
): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), init.timeoutMs ?? 15_000);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

function k(
  term: string,
  source: KeywordSource,
  score: number,
  region: string,
  language: string,
  metadata: Record<string, unknown>,
): Omit<Keyword, "id"> {
  return {
    term: term.trim(),
    normalized: normalizeTerm(term),
    source,
    sampled_at: NOW(),
    score: Math.max(0, Math.min(100, score)),
    region,
    language,
    metadata_json: JSON.stringify(metadata),
  };
}

// Very loose Norwegian-ish detector — used to flag terms that probably
// aren't relevant to the Digilist audience. Not perfect; the LLM clustering
// stage filters more rigorously.
const NORWEGIAN_HINT = /[æøåÆØÅ]|\b(og|eller|ikke|kommune|booking|leie|lokale|hall|rom)\b/i;

function looksRelevant(term: string): boolean {
  if (term.length < 3 || term.length > 80) return false;
  if (/^https?:|@\w+|^\d+$/.test(term)) return false;
  return true;
}

// ─────────────────────────────────────────────────────────────
// 1. Google Trends — rising queries (NO region)
//
// google-trends-api is an unofficial wrapper that scrapes
// trends.google.com. We treat it as best-effort: missing module or
// scrape failure → empty list, never throw.

export async function fetchGoogleTrends(
  cfg: ContentAgentConfig,
): Promise<Array<Omit<Keyword, "id">>> {
  let trendsApi: typeof import("google-trends-api") | null = null;
  try {
    // dynamic import keeps the module optional — if the dep isn't
    // installed (which is the default to avoid bloating CI), we
    // silently skip this source.
    trendsApi = await import("google-trends-api");
  } catch {
    return [];
  }
  const out: Array<Omit<Keyword, "id">> = [];
  const seeds = ["booking kommune", "idrettshall", "møterom", "kulturhus", "sesongleie"];
  for (const seed of seeds) {
    try {
      const raw = await trendsApi.relatedQueries({
        keyword: seed,
        geo: cfg.region,
        hl: cfg.language,
      });
      const parsed = JSON.parse(raw);
      const rising =
        parsed?.default?.rankedList?.[1]?.rankedKeyword ?? [];
      const top =
        parsed?.default?.rankedList?.[0]?.rankedKeyword ?? [];
      for (const r of rising.slice(0, cfg.maxKeywordsPerSource)) {
        if (!looksRelevant(r.query)) continue;
        // rising queries are scored relative to their breakout; "Breakout"
        // strings → 100, otherwise the value is a percent change capped at 100.
        const score =
          typeof r.value === "string"
            ? 100
            : Math.min(100, Number(r.value) || 50);
        out.push(
          k(r.query, "gtrends", score, cfg.region, cfg.language, {
            seed,
            rising: true,
            link: r.link,
          }),
        );
      }
      for (const r of top.slice(0, 10)) {
        if (!looksRelevant(r.query)) continue;
        out.push(
          k(r.query, "gtrends", Math.min(80, Number(r.value) || 40),
            cfg.region, cfg.language, { seed, rising: false }),
        );
      }
    } catch {
      // single-seed failure shouldn't kill the whole source
      continue;
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────
// 2. Reddit — r/Norge etc. public JSON, no auth needed for reads

export async function fetchReddit(
  cfg: ContentAgentConfig,
): Promise<Array<Omit<Keyword, "id">>> {
  const out: Array<Omit<Keyword, "id">> = [];
  for (const sub of cfg.redditSubs) {
    try {
      const r = await fetchWithTimeout(
        `https://www.reddit.com/r/${encodeURIComponent(sub)}/hot.json?limit=50`,
        {
          headers: { "User-Agent": cfg.redditUserAgent },
          timeoutMs: 10_000,
        },
      );
      if (!r.ok) continue;
      const json = (await r.json()) as {
        data?: { children?: Array<{ data?: { title?: string; score?: number; ups?: number; permalink?: string } }> };
      };
      const children = json?.data?.children ?? [];
      // Map post titles → keyword candidates. We don't try to extract
      // n-grams here — the LLM cluster stage handles topic extraction.
      // Highest-upvote posts get the highest source-score.
      const maxUps = Math.max(1, ...children.map((c) => c.data?.ups ?? 0));
      for (const c of children) {
        const title = c.data?.title?.trim() ?? "";
        const ups = c.data?.ups ?? 0;
        if (!looksRelevant(title)) continue;
        out.push(
          k(
            title,
            "reddit",
            Math.round((ups / maxUps) * 100),
            cfg.region,
            cfg.language,
            { subreddit: sub, ups, permalink: c.data?.permalink ?? "" },
          ),
        );
      }
    } catch {
      continue;
    }
  }
  return out.slice(0, cfg.maxKeywordsPerSource * 4);
}

// ─────────────────────────────────────────────────────────────
// 3. HackerNews — Algolia front-page search

export async function fetchHackerNews(
  cfg: ContentAgentConfig,
): Promise<Array<Omit<Keyword, "id">>> {
  const out: Array<Omit<Keyword, "id">> = [];
  // Pull two days of front-page stories. HN as a whole is mostly
  // English so it's a weaker signal for Norwegian municipal content
  // but it catches infra/security/SaaS trends.
  const since = Math.floor((Date.now() - 2 * 86_400_000) / 1000);
  for (const tag of cfg.hnTags) {
    try {
      const r = await fetchWithTimeout(
        `https://hn.algolia.com/api/v1/search?tags=${encodeURIComponent(tag)}&numericFilters=created_at_i>${since}&hitsPerPage=50`,
        { timeoutMs: 10_000 },
      );
      if (!r.ok) continue;
      const json = (await r.json()) as {
        hits?: Array<{ title?: string; points?: number; objectID?: string; url?: string }>;
      };
      const hits = json.hits ?? [];
      const maxPts = Math.max(1, ...hits.map((h) => h.points ?? 0));
      for (const h of hits) {
        const title = h.title?.trim() ?? "";
        if (!looksRelevant(title)) continue;
        out.push(
          k(
            title,
            "hackernews",
            Math.round(((h.points ?? 0) / maxPts) * 100),
            "GLOBAL",
            "en",
            { tag, points: h.points ?? 0, hn_id: h.objectID, url: h.url ?? "" },
          ),
        );
      }
    } catch {
      continue;
    }
  }
  return out.slice(0, cfg.maxKeywordsPerSource * 2);
}

// ─────────────────────────────────────────────────────────────
// 4. RSS — tiny built-in XML title extractor (no parser dep)

function extractRssTitles(xml: string): string[] {
  const titles: string[] = [];
  // First <title> is the channel; subsequent <title>s are items.
  const re = /<title>([\s\S]*?)<\/title>/gi;
  let m: RegExpExecArray | null;
  let skipFirst = true;
  while ((m = re.exec(xml))) {
    if (skipFirst) {
      skipFirst = false;
      continue;
    }
    const t = m[1]
      .replace(/<!\[CDATA\[/g, "")
      .replace(/\]\]>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/<[^>]+>/g, "")
      .trim();
    if (t) titles.push(t);
  }
  return titles;
}

export async function fetchRss(
  cfg: ContentAgentConfig,
): Promise<Array<Omit<Keyword, "id">>> {
  const out: Array<Omit<Keyword, "id">> = [];
  for (const feed of cfg.rssFeeds) {
    try {
      const r = await fetchWithTimeout(feed, {
        headers: { "User-Agent": cfg.redditUserAgent },
        timeoutMs: 10_000,
      });
      if (!r.ok) continue;
      const xml = await r.text();
      const titles = extractRssTitles(xml).slice(0, 40);
      // RSS feeds give no native scoring — flat 60 for the top half
      // and 40 for the rest. The cluster stage re-ranks by topical fit.
      titles.forEach((t, i) => {
        if (!looksRelevant(t)) return;
        const score = i < titles.length / 2 ? 60 : 40;
        out.push(
          k(t, "rss", score, cfg.region, cfg.language, { feed }),
        );
      });
    } catch {
      continue;
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────
// 5. SerpAPI — paid, gated on env. Pulls "People also ask" + related
//    searches for the seed terms. Bigger SEO signal than the rest.

export async function fetchSerpApi(
  cfg: ContentAgentConfig,
): Promise<Array<Omit<Keyword, "id">>> {
  if (!cfg.serpApiKey) return [];
  const out: Array<Omit<Keyword, "id">> = [];
  // Sample a small set of seeds to keep the bill bounded; the cluster
  // stage will expand. Each request is ~$0.003 on SerpAPI's $50/mo plan.
  const seeds = SEED_TERMS.slice(0, 8).map((s) => s.term);
  for (const q of seeds) {
    try {
      const r = await fetchWithTimeout(
        `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(q)}&google_domain=google.no&gl=no&hl=no&api_key=${cfg.serpApiKey}`,
        { timeoutMs: 15_000 },
      );
      if (!r.ok) continue;
      const json = (await r.json()) as {
        related_questions?: Array<{ question?: string }>;
        related_searches?: Array<{ query?: string }>;
      };
      for (const rq of json.related_questions ?? []) {
        const t = rq.question?.trim();
        if (t && looksRelevant(t)) {
          out.push(k(t, "serpapi", 85, cfg.region, cfg.language,
            { seed: q, kind: "paa" }));
        }
      }
      for (const rs of json.related_searches ?? []) {
        const t = rs.query?.trim();
        if (t && looksRelevant(t)) {
          out.push(k(t, "serpapi", 70, cfg.region, cfg.language,
            { seed: q, kind: "related-search" }));
        }
      }
    } catch {
      continue;
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────
// 6. Seed + Claude expansion
//
// Always available since the chatbot already uses Anthropic. This is
// the cheapest, most reliable source — and the one whose output is
// guaranteed to be domain-aligned.

export async function fetchSeedExpand(
  cfg: ContentAgentConfig,
): Promise<Array<Omit<Keyword, "id">>> {
  if (!cfg.anthropicApiKey) return [];
  const seedList = SEED_TERMS.map((s) => `- ${s.term} [${s.intent}]`).join("\n");
  const prompt = `Du er Digilists Keyword Intelligence Agent. Gitt seed-listen under, generer 40 nye, beslektede søkefraser på norsk bokmål som en innbygger, lag-koordinator, saksbehandler eller kommunal IT-leder faktisk ville tastet inn i Google.

Krav:
- Bare fraser folk virkelig søker på (ikke markedsføringsslagord).
- Bland intent: informational, commercial, municipal, venue, event, booking.
- Aldri duplisere seed-listen.
- Inkluder long-tails (4-7 ord) — det er der gull-mulighetene er.
- Returner KUN gyldig JSON: {"terms":[{"term":"...","intent":"...","score":0-100,"reason":"..."}]}

Seed-liste:
${seedList}`;

  try {
    const r = await fetchWithTimeout("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": cfg.anthropicApiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      timeoutMs: 60_000,
      body: JSON.stringify({
        model: cfg.anthropicCheapModel,
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!r.ok) return [];
    const json = (await r.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };
    const text = (json.content ?? [])
      .filter((c) => c.type === "text")
      .map((c) => c.text ?? "")
      .join("\n");
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return [];
    const parsed = JSON.parse(match[0]) as {
      terms?: Array<{ term?: string; intent?: string; score?: number; reason?: string }>;
    };
    const out: Array<Omit<Keyword, "id">> = [];
    for (const t of parsed.terms ?? []) {
      const term = t.term?.trim();
      if (!term || !looksRelevant(term)) continue;
      out.push(
        k(
          term,
          "seed-expand",
          Math.min(100, Math.max(40, Number(t.score) || 60)),
          cfg.region,
          cfg.language,
          { intent: t.intent ?? "", reason: t.reason ?? "" },
        ),
      );
    }
    return out;
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────
// Orchestration helper

export async function discoverAllSources(
  cfg: ContentAgentConfig,
  log: (msg: string) => void,
): Promise<Array<Omit<Keyword, "id">>> {
  const results = await Promise.allSettled([
    (async () => {
      const t = Date.now();
      const r = await fetchGoogleTrends(cfg);
      log(`gtrends: ${r.length} terms (${Date.now() - t}ms)`);
      return r;
    })(),
    (async () => {
      const t = Date.now();
      const r = await fetchReddit(cfg);
      log(`reddit: ${r.length} terms (${Date.now() - t}ms)`);
      return r;
    })(),
    (async () => {
      const t = Date.now();
      const r = await fetchHackerNews(cfg);
      log(`hackernews: ${r.length} terms (${Date.now() - t}ms)`);
      return r;
    })(),
    (async () => {
      const t = Date.now();
      const r = await fetchRss(cfg);
      log(`rss: ${r.length} terms (${Date.now() - t}ms)`);
      return r;
    })(),
    (async () => {
      const t = Date.now();
      const r = await fetchSerpApi(cfg);
      log(`serpapi: ${r.length} terms (${Date.now() - t}ms)`);
      return r;
    })(),
    (async () => {
      const t = Date.now();
      const r = await fetchSeedExpand(cfg);
      log(`seed-expand: ${r.length} terms (${Date.now() - t}ms)`);
      return r;
    })(),
  ]);
  const flat: Array<Omit<Keyword, "id">> = [];
  for (const r of results) {
    if (r.status === "fulfilled") flat.push(...r.value);
    else log(`source error: ${String(r.reason)}`);
  }
  // Dedupe across sources by (normalized, source) — same term from
  // two sources counts twice (different signals). Same term + same
  // source within a run gets collapsed to the highest-scoring entry.
  const dedup = new Map<string, Omit<Keyword, "id">>();
  for (const row of flat) {
    const key = `${row.source}::${row.normalized}`;
    const existing = dedup.get(key);
    if (!existing || row.score > existing.score) dedup.set(key, row);
  }
  return Array.from(dedup.values());
}
