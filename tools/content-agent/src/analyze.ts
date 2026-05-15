/**
 * Keyword analyzer — two phases:
 *
 *   1. cluster()  — group raw keywords into semantic topic clusters
 *                   using a cheap Claude call. Falls back to a
 *                   prefix-string heuristic if the LLM is unavailable.
 *
 *   2. coverage() — for each cluster, measure how well Digilist's
 *                   existing content already covers the topic via a
 *                   small in-process TF-IDF index over blog markdown
 *                   + page <title>/<meta description> snippets.
 *
 * The gap_score (0..100) is what the Content Draft Agent ranks on:
 * higher = bigger opportunity = generate a draft.
 */

import fs from "node:fs";
import path from "node:path";
import type {
  CoverageRow,
  Keyword,
  KeywordCluster,
} from "./types";
import type { ContentAgentConfig } from "./config";

// ─────────────────────────────────────────────────────────────
// 1. Clustering

interface RawCluster {
  label: string;
  centroid_term: string;
  member_terms: string[];
  composite_score: number;     // 0..100, LLM-suggested
  topic_summary: string;
}

const CLUSTER_PROMPT = `Du er Digilists Keyword Intelligence Agent.

Du får en liste over rå søkefraser fra ulike kilder (Google Trends, Reddit, HN, RSS, SerpAPI, LLM-utvidelse). Hver frase har en kilde og en score 0..100.

Oppgave: Grupper fraser i 8..16 semantiske emnegrupper (clusters). Hver gruppe skal:
- handle om ETT konkret emne en kommunal IT-leder, saksbehandler eller innbygger ville søkt etter
- ha en kort, beskrivende norsk label ("Idrettshall-booking for lag og foreninger")
- ha en "centroid_term" — den mest representative frasen i gruppa
- ha en composite_score 0..100 som vekter (a) hvor mye signal det er, (b) hvor relevant det er for Digilists posisjon (kommunal booking-SaaS, ID-porten, idrettshaller, kulturhus, møterom)
- ha en 1-setnings topic_summary som forklarer hvorfor dette emnet er interessant for Digilist
- Filtrer bort grupper som er totalt irrelevante for Digilist (politikk, tilfeldige reddit-titler om mat, internasjonale tech-trender uten kommunal vinkling).

Returner KUN gyldig JSON, ingen forklaring:
{
  "clusters": [
    {
      "label": "...",
      "centroid_term": "...",
      "member_terms": ["...", "..."],
      "composite_score": 0-100,
      "topic_summary": "..."
    }
  ]
}`;

function buildKeywordCorpus(keywords: Array<Omit<Keyword, "id">>): string {
  return keywords
    .map(
      (k) =>
        `- "${k.term}" [src=${k.source} score=${Math.round(k.score)} region=${k.region}]`,
    )
    .join("\n");
}

export async function clusterKeywords(
  cfg: ContentAgentConfig,
  keywords: Array<Omit<Keyword, "id">>,
  log: (m: string) => void,
): Promise<RawCluster[]> {
  if (keywords.length === 0) return [];
  if (!cfg.anthropicApiKey) {
    log("clusterKeywords: no ANTHROPIC_API_KEY → falling back to prefix heuristic");
    return heuristicCluster(keywords);
  }
  const corpus = buildKeywordCorpus(keywords);
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": cfg.anthropicApiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: cfg.anthropicCheapModel,
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: `${CLUSTER_PROMPT}\n\nRå keywords:\n${corpus}`,
          },
        ],
      }),
    });
    if (!r.ok) {
      log(`clusterKeywords: anthropic ${r.status} → heuristic fallback`);
      return heuristicCluster(keywords);
    }
    const json = (await r.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };
    const text = (json.content ?? [])
      .filter((c) => c.type === "text")
      .map((c) => c.text ?? "")
      .join("\n");
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return heuristicCluster(keywords);
    const parsed = JSON.parse(match[0]) as { clusters?: RawCluster[] };
    if (!parsed.clusters || parsed.clusters.length === 0) {
      return heuristicCluster(keywords);
    }
    return parsed.clusters
      .filter((c) => c.label && c.centroid_term && (c.member_terms?.length ?? 0) > 0)
      .slice(0, cfg.maxClusters);
  } catch (e) {
    log(`clusterKeywords: ${String(e)} → heuristic fallback`);
    return heuristicCluster(keywords);
  }
}

function heuristicCluster(
  keywords: Array<Omit<Keyword, "id">>,
): RawCluster[] {
  // Group by first content word. Crude but better than nothing if
  // Claude is unavailable. Used in CI / offline dev.
  const buckets = new Map<string, Array<Omit<Keyword, "id">>>();
  for (const k of keywords) {
    const head = k.normalized.split(" ").find((w) => w.length > 3) ?? k.normalized;
    const arr = buckets.get(head) ?? [];
    arr.push(k);
    buckets.set(head, arr);
  }
  const out: RawCluster[] = [];
  for (const [head, arr] of buckets) {
    if (arr.length < 2) continue;
    const avg = arr.reduce((s, k) => s + k.score, 0) / arr.length;
    out.push({
      label: head,
      centroid_term: arr[0].term,
      member_terms: arr.map((k) => k.term),
      composite_score: Math.round(avg),
      topic_summary: `Heuristic cluster around "${head}" (${arr.length} terms).`,
    });
  }
  return out.sort((a, b) => b.composite_score - a.composite_score).slice(0, 16);
}

// Convert RawCluster → KeywordCluster (DB row shape) by resolving
// member_terms back to keyword.id values. The orchestrator calls this
// after inserting keywords to get their assigned ids.
export function resolveClusterIds(
  clusters: RawCluster[],
  keywordsWithIds: Keyword[],
): Array<Omit<KeywordCluster, "id">> {
  const byNormalized = new Map<string, number>();
  for (const k of keywordsWithIds) byNormalized.set(k.normalized, k.id);
  const now = new Date().toISOString();
  return clusters.map((c) => ({
    label: c.label,
    centroid_term: c.centroid_term,
    member_ids: c.member_terms
      .map((t) => byNormalized.get(t.toLowerCase().normalize("NFC").trim().replace(/\s+/g, " ")))
      .filter((id): id is number => typeof id === "number"),
    composite_score: c.composite_score,
    topic_summary: c.topic_summary,
    created_at: now,
  }));
}

// ─────────────────────────────────────────────────────────────
// 2. Coverage / gap analysis
//
// We build a tiny TF-IDF index over Digilist's blog + page metadata,
// then score each cluster's centroid_term against the corpus. High
// similarity = topic already covered = low gap. Zero similarity = max
// opportunity.
//
// This is intentionally low-tech (no embeddings, no vector DB).
// Norwegian stemming is overkill for V1; a stopword list + tokenization
// gives surprisingly decent results for cluster-vs-page matching.

interface Doc {
  url: string;
  text: string;
  title: string;
}

const NO_STOPWORDS = new Set([
  "og", "i", "en", "et", "på", "for", "til", "av", "med", "som", "er",
  "den", "det", "de", "har", "ikke", "kan", "vi", "du", "din", "om",
  "fra", "ved", "men", "eller", "der", "her", "ble", "blir", "vil",
  "skal", "også", "etter", "før", "noen", "andre", "alle", "mer", "mest",
  "kun", "bare", "slik", "denne", "dette", "disse",
  "the", "a", "and", "to", "of", "in", "is", "it", "for", "with", "on",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFC")
    .replace(/[^a-zà-ÿæøå\s]/gi, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !NO_STOPWORDS.has(w));
}

function tf(tokens: string[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const t of tokens) m.set(t, (m.get(t) ?? 0) + 1);
  return m;
}

function idf(docs: Doc[]): Map<string, number> {
  const df = new Map<string, number>();
  for (const d of docs) {
    const seen = new Set(tokenize(d.text));
    for (const t of seen) df.set(t, (df.get(t) ?? 0) + 1);
  }
  const N = Math.max(1, docs.length);
  const out = new Map<string, number>();
  for (const [t, c] of df) out.set(t, Math.log((N + 1) / (c + 1)) + 1);
  return out;
}

function tfidfVec(text: string, idfMap: Map<string, number>): Map<string, number> {
  const tokens = tokenize(text);
  const t = tf(tokens);
  const out = new Map<string, number>();
  for (const [w, c] of t) {
    const i = idfMap.get(w) ?? 0;
    out.set(w, c * i);
  }
  return out;
}

function cosine(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (const [, v] of a) na += v * v;
  for (const [, v] of b) nb += v * v;
  if (na === 0 || nb === 0) return 0;
  // iterate smaller map
  const [small, big] = a.size < b.size ? [a, b] : [b, a];
  for (const [k, v] of small) {
    const w = big.get(k);
    if (w !== undefined) dot += v * w;
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function stripFrontmatter(md: string): {
  body: string;
  fm: Record<string, string>;
} {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return { body: md, fm: {} };
  const fm: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
  }
  return { body: m[2], fm };
}

function readBlogCorpus(blogDir: string, siteOrigin: string): Doc[] {
  if (!fs.existsSync(blogDir)) return [];
  const entries = fs.readdirSync(blogDir, { withFileTypes: true });
  const out: Doc[] = [];
  for (const e of entries) {
    if (!e.isFile() || !e.name.endsWith(".md")) continue;
    const fp = path.join(blogDir, e.name);
    const raw = fs.readFileSync(fp, "utf-8");
    const { body, fm } = stripFrontmatter(raw);
    const slug = fm.slug ?? e.name.replace(/\.md$/, "");
    const keywords = (fm.keywords ?? "")
      .replace(/^\[|\]$/g, "")
      .replace(/"/g, "");
    out.push({
      url: `${siteOrigin}/blogg/${slug}`,
      title: fm.title ?? slug,
      // give frontmatter keywords + title extra weight by repeating
      text: [fm.title, fm.description, keywords, keywords, body].join("\n"),
    });
  }
  return out;
}

function readPagesCorpus(pagesDir: string, siteOrigin: string): Doc[] {
  if (!fs.existsSync(pagesDir)) return [];
  const out: Doc[] = [];
  const walk = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const fp = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name === "admin") continue; // exclude admin
        walk(fp);
        continue;
      }
      if (!/\.tsx?$/.test(e.name)) continue;
      const raw = fs.readFileSync(fp, "utf-8");
      // Extract <SEO ... title="" description="" /> and obvious copy
      const titles = [...raw.matchAll(/title=\{?["'`]([^"'`]+)["'`]\}?/g)].map((m) => m[1]);
      const descs = [...raw.matchAll(/description=\{?["'`]([^"'`]+)["'`]\}?/g)].map((m) => m[1]);
      const headings = [...raw.matchAll(/<h[1-3][^>]*>([^<{]+)</g)].map((m) => m[1]);
      const text = [...titles, ...descs, ...headings].join("\n");
      if (!text.trim()) continue;
      const route = pagesRouteGuess(e.name);
      out.push({
        url: `${siteOrigin}${route}`,
        title: titles[0] ?? route,
        text,
      });
    }
  };
  walk(pagesDir);
  return out;
}

function pagesRouteGuess(filename: string): string {
  const base = filename.replace(/\.tsx?$/, "");
  // Conventions used in this repo — best-effort, not authoritative.
  const map: Record<string, string> = {
    Index: "/",
    Blog: "/blogg",
    BlogPost: "/blogg/:slug",
    BookDemo: "/book-demo",
    BookingsystemKommune: "/bookingsystem-kommune",
    BookingLokalerMoterom: "/booking-av-lokaler-og-moterom",
    UseCaseIdrettshaller: "/bruksomrader/idrettshaller-gymsaler",
    UseCaseKulturhus: "/bruksomrader/kulturhus-kantiner",
    UseCaseMoterom: "/bruksomrader/moterom",
    UseCaseSelskapslokaler: "/bruksomrader/selskapslokaler",
    FAQ: "/faq",
    Personvern: "/personvern",
    Salgsvilkar: "/salgsvilkar",
    Cookies: "/cookies",
    Transparens: "/transparens",
  };
  return map[base] ?? `/${base.toLowerCase()}`;
}

export interface CoverageContext {
  docs: Doc[];
  idf: Map<string, number>;
}

export function buildCoverageContext(cfg: ContentAgentConfig): CoverageContext {
  const blog = readBlogCorpus(cfg.blogDir, cfg.siteOrigin);
  const pages = readPagesCorpus(cfg.pagesDir, cfg.siteOrigin);
  const docs = [...blog, ...pages];
  return { docs, idf: idf(docs) };
}

export function computeCoverage(
  ctx: CoverageContext,
  cluster: Pick<KeywordCluster, "centroid_term" | "topic_summary" | "label">,
  clusterId: number,
): CoverageRow {
  const query = [cluster.centroid_term, cluster.label, cluster.topic_summary].join(" ");
  const qv = tfidfVec(query, ctx.idf);
  let best: { url: string; score: number } | null = null;
  for (const d of ctx.docs) {
    const dv = tfidfVec(`${d.title}\n${d.text}`, ctx.idf);
    const sim = cosine(qv, dv);
    if (!best || sim > best.score) best = { url: d.url, score: sim };
  }
  // Map cosine 0..1 → coverage 0..100 with a soft curve. Anything
  // below ~0.10 means basically uncovered; anything above 0.45 is
  // confidently covered.
  const cov = best
    ? Math.min(100, Math.max(0, Math.round((best.score / 0.45) * 100)))
    : 0;
  return {
    cluster_id: clusterId,
    gap_score: 100 - cov,
    best_match_url: best?.url ?? null,
    best_match_score: best?.score ?? 0,
  };
}
