// digilist-api — self-contained Node service for the marketing site.
//
// Two endpoints behind /api/* (nginx reverse-proxies localhost:3001):
//   POST /api/chat     — Anthropic Claude proxy with RAG-built system prompt
//   POST /api/inquiry  — Resend email delivery for the chatbot inquiry form
//
// Zero npm dependencies. Requires Node 20+ for native fetch.
//
// Environment (loaded from /etc/digilist-api.env or process env):
//   ANTHROPIC_API_KEY   required for /api/chat
//   RESEND_API_KEY      required for /api/inquiry
//   NOTIFY_TO           default: admin@digilist.no
//   NOTIFY_CC           default: info@xala.no,hamid@xala.no
//   MAIL_FROM           default: "Digilist <onboarding@resend.dev>"
//   PORT                default: 3001
//   ALLOWED_ORIGIN      default: https://digilist.no  (only used if a
//                       request crosses origins — same-origin via nginx
//                       is the expected path)
//
// Run with PM2:
//   pm2 start /var/www/digilist-api/index.mjs --name digilist-api
//   pm2 save

import { createServer } from "node:http";
import { readFileSync, writeFileSync, existsSync, unlinkSync, readdirSync, statSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";

// ---------- env loading (supports a simple .env at /etc/digilist-api.env)
function loadEnv() {
  const candidates = [
    "/etc/digilist-api.env",
    // .env.local is gitignored via `*.local` — put secrets like
    // ADMIN_BASIC_AUTH and ANTHROPIC_API_KEY here for local dev.
    new URL("./.env.local", import.meta.url).pathname,
    new URL("../.env.local", import.meta.url).pathname,
    new URL("./.env", import.meta.url).pathname,
    new URL("../.env", import.meta.url).pathname,
  ];
  for (const p of candidates) {
    try {
      if (!existsSync(p)) continue;
      const raw = readFileSync(p, "utf-8");
      for (const line of raw.split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
        if (!m) continue;
        const [, key, val] = m;
        const cleaned = val.replace(/^["']|["']$/g, "");
        if (!process.env[key]) process.env[key] = cleaned;
      }
    } catch {
      // ignore
    }
  }
}
loadEnv();

const PORT = Number(process.env.PORT || 3001);
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "https://digilist.no";
const NOTIFY_TO = process.env.NOTIFY_TO || "admin@digilist.no";
const NOTIFY_CC = (process.env.NOTIFY_CC || "info@xala.no,hamid@xala.no")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const MAIL_FROM =
  process.env.MAIL_FROM || "Digilist <onboarding@resend.dev>";
// Site intelligence audit config
const ADMIN_BASIC_AUTH = process.env.ADMIN_BASIC_AUTH || ""; // "user:pass"
const AUDIT_SNAPSHOT_PATH =
  process.env.AUDIT_SNAPSHOT_PATH || "/var/www/digilist-audit/state.json";
// Where the audit tooling (pnpm + tools/site-intelligence) lives. An
// explicit env var wins — in production it points at the deployed checkout.
// Otherwise fall back to THIS repo's root, but only when it actually ships
// the tooling: that makes "Kjør skanning" work in local dev with no extra
// config, while staying "" (→ a clear 503) on servers that don't have it.
const REPO_ROOT = new URL("..", import.meta.url).pathname;
const AUDIT_REPO_DIR =
  process.env.AUDIT_REPO_DIR ||
  (existsSync(path.join(REPO_ROOT, "tools", "site-intelligence"))
    ? REPO_ROOT
    : "");
// Content agent config. CONTENT_REPO_DIR defaults to AUDIT_REPO_DIR
// because in production both packages live in the same checkout.
const CONTENT_REPO_DIR = process.env.CONTENT_REPO_DIR || AUDIT_REPO_DIR;
const CONTENT_SNAPSHOT_PATH =
  process.env.CONTENT_SNAPSHOT_PATH ||
  "/var/www/digilist-audit/content-snapshot.json";
// Background-run book-keeping (very small in-memory queue + status table)
const auditRuns = new Map(); // runRequestId -> { startedAt, target, status, log }
const contentRuns = new Map(); // same shape, for content-agent runs

function authorized(req) {
  if (!ADMIN_BASIC_AUTH) return false;
  const header = req.headers["authorization"] || "";
  if (!header.startsWith("Basic ")) return false;
  const expected = Buffer.from(ADMIN_BASIC_AUTH, "utf-8").toString("base64");
  return header.slice(6).trim() === expected;
}

// ---------- helpers
const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

function json(res, status, body, extraHeaders = {}) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    ...corsHeaders,
    ...extraHeaders,
  });
  res.end(JSON.stringify(body));
}

async function readJson(req, maxBytes = 64 * 1024) {
  return new Promise((resolve, reject) => {
    let received = 0;
    const chunks = [];
    req.on("data", (c) => {
      received += c.length;
      if (received > maxBytes) {
        reject(new Error("payload too large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => {
      try {
        const buf = Buffer.concat(chunks).toString("utf-8");
        resolve(buf ? JSON.parse(buf) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

function escapeHtml(text = "") {
  return String(text).replace(/[&<>"']/g, (c) =>
    c === "&"
      ? "&amp;"
      : c === "<"
        ? "&lt;"
        : c === ">"
          ? "&gt;"
          : c === '"'
            ? "&quot;"
            : "&#x27;",
  );
}

// ---------- rate limiting (per IP, sliding window in memory)
const RATE = new Map();
function rateLimited(ip, max = 20, windowMs = 60_000) {
  const now = Date.now();
  const bucket = RATE.get(ip) || [];
  const fresh = bucket.filter((t) => now - t < windowMs);
  fresh.push(now);
  RATE.set(ip, fresh);
  return fresh.length > max;
}

// ---------- /api/chat (Anthropic Claude proxy)
async function handleChat(req, res, body, ip) {
  if (!ANTHROPIC_API_KEY) {
    return json(res, 503, { error: "Chat is not configured" });
  }
  if (
    !body ||
    typeof body.system !== "string" ||
    !Array.isArray(body.messages)
  ) {
    return json(res, 400, { error: "Invalid request" });
  }
  if (body.messages.length > 16 || body.system.length > 8000) {
    return json(res, 413, { error: "Request too large" });
  }
  if (rateLimited(ip, 30)) {
    return json(res, 429, { error: "Slow down" });
  }

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        system: body.system,
        messages: body.messages,
      }),
    });
    if (!upstream.ok) {
      const errText = await upstream.text();
      console.error("anthropic error:", upstream.status, errText);
      return json(res, 502, { error: "Upstream chat error" });
    }
    const data = await upstream.json();
    const text =
      (data.content || [])
        .filter((c) => c.type === "text")
        .map((c) => c.text)
        .join("\n")
        .trim() || "Beklager — jeg klarte ikke å generere et svar.";
    return json(res, 200, { text });
  } catch (e) {
    console.error("/api/chat error:", e);
    return json(res, 500, { error: "Internal error" });
  }
}

// ---------- /api/docs-ask (real RAG over docs corpus via Claude)
//
// Pipeline:
//   1. Boot:  load docs-rag-index.json (89 chunks of ~700 tokens each)
//             produced by `pnpm docs:index`. If embeddings are present
//             (Voyage was available at index time) use them; otherwise
//             build a TF-IDF index in memory on the chunk content.
//   2. Query: embed the user's query (Voyage if available, else TF-IDF
//             vector). Cosine-similarity scan against all chunks. Take
//             top-K (K=5).
//   3. Augment: build a system prompt containing ONLY the K retrieved
//               chunks, with explicit slug citations.
//   4. Generate: Claude Haiku produces a Norwegian answer ending with
//                citations as [Title](slug).

const DOCS_RAG_INDEX_CANDIDATES = [
  process.env.DOCS_RAG_INDEX || "",
  "/var/www/digilist-api/docs-rag-index.json",
  path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    "../apps/docs/dist-rag/docs-rag-index.json",
  ),
].filter(Boolean);

const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY || "";
const VOYAGE_MODEL = process.env.VOYAGE_MODEL || "voyage-3-lite";
const RAG_TOP_K = Number(process.env.RAG_TOP_K) || 5;

// Norwegian + English stopwords for TF-IDF.
const RAG_STOPWORDS = new Set([
  "og", "i", "en", "et", "på", "for", "til", "av", "med", "som", "er", "den",
  "det", "de", "har", "ikke", "kan", "vi", "du", "din", "om", "fra", "ved",
  "men", "eller", "der", "her", "ble", "blir", "vil", "skal", "også", "etter",
  "før", "noen", "andre", "alle", "mer", "mest", "kun", "bare", "slik", "denne",
  "dette", "disse", "hva", "hvor", "hvordan",
  "the", "a", "and", "to", "of", "in", "is", "it", "for", "with", "on", "or",
  "as", "by", "be", "are", "this", "that", "from",
]);

let RAG_INDEX = null; // { generatedAt, model, chunks: [...] }
let RAG_IDF = null;   // Map<term, idf>
let RAG_TFIDF = null; // Array<Map<term, weight>> aligned to chunks

function tokenize(s) {
  return String(s)
    .toLowerCase()
    .normalize("NFC")
    .replace(/[^a-zà-ÿæøå0-9\s]/gi, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !RAG_STOPWORDS.has(w));
}

function loadRagIndex() {
  if (RAG_INDEX) return RAG_INDEX;
  let file = null;
  for (const c of DOCS_RAG_INDEX_CANDIDATES) {
    if (existsSync(c)) { file = c; break; }
  }
  if (!file) {
    console.warn("[docs-ask] No docs-rag-index.json found. Run `pnpm docs:index`.");
    RAG_INDEX = { chunks: [], model: "none" };
    return RAG_INDEX;
  }
  const raw = readFileSync(file, "utf-8");
  RAG_INDEX = JSON.parse(raw);
  console.log(
    `[docs-ask] loaded ${RAG_INDEX.chunks.length} chunks (model=${RAG_INDEX.model}) from ${file}`,
  );

  // Build TF-IDF index if no embeddings shipped.
  const hasEmbeddings = RAG_INDEX.chunks.some(
    (c) => c.embedding && c.embedding.length > 0,
  );
  if (!hasEmbeddings) {
    const df = new Map();
    const tfs = RAG_INDEX.chunks.map((c) => {
      const text = `${c.pageTitle} ${c.section} ${c.content}`;
      const toks = tokenize(text);
      const tf = new Map();
      for (const t of toks) tf.set(t, (tf.get(t) || 0) + 1);
      for (const t of new Set(toks)) df.set(t, (df.get(t) || 0) + 1);
      return tf;
    });
    const N = RAG_INDEX.chunks.length || 1;
    RAG_IDF = new Map();
    for (const [t, d] of df) RAG_IDF.set(t, Math.log((N + 1) / (d + 1)) + 1);
    RAG_TFIDF = tfs.map((tf) => {
      const v = new Map();
      for (const [t, c] of tf) v.set(t, c * (RAG_IDF.get(t) || 0));
      return v;
    });
    console.log(`[docs-ask] built TF-IDF index over ${df.size} unique terms`);
  }

  return RAG_INDEX;
}

function cosine(a, b) {
  // Both are Map<string, number>. Normalize on the fly.
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (const v of a.values()) na += v * v;
  for (const v of b.values()) nb += v * v;
  if (na === 0 || nb === 0) return 0;
  const [small, big] = a.size < b.size ? [a, b] : [b, a];
  for (const [k, v] of small) {
    const w = big.get(k);
    if (w !== undefined) dot += v * w;
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function cosineVec(a, b) {
  // a, b: number[]
  const n = Math.min(a.length, b.length);
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

async function embedQueryVoyage(q) {
  if (!VOYAGE_API_KEY) return null;
  const r = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VOYAGE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: [q],
      model: VOYAGE_MODEL,
      input_type: "query",
    }),
  });
  if (!r.ok) {
    console.warn("[docs-ask] Voyage embed failed:", r.status);
    return null;
  }
  const j = await r.json();
  return j.data?.[0]?.embedding ?? null;
}

async function retrieveTopK(query, k) {
  const idx = loadRagIndex();
  if (idx.chunks.length === 0) return [];
  const usingEmbeddings = idx.chunks.some(
    (c) => c.embedding && c.embedding.length > 0,
  );
  let scores;
  if (usingEmbeddings) {
    const qvec = await embedQueryVoyage(query);
    if (!qvec) return [];
    scores = idx.chunks.map((c, i) => ({
      i,
      s: c.embedding && c.embedding.length > 0 ? cosineVec(qvec, c.embedding) : 0,
    }));
  } else {
    const qTokens = tokenize(query);
    const qTf = new Map();
    for (const t of qTokens) qTf.set(t, (qTf.get(t) || 0) + 1);
    const qVec = new Map();
    for (const [t, c] of qTf) qVec.set(t, c * (RAG_IDF?.get(t) || 0));
    scores = RAG_TFIDF.map((cvec, i) => ({ i, s: cosine(qVec, cvec) }));
  }
  scores.sort((a, b) => b.s - a.s);
  return scores
    .slice(0, k)
    .filter((x) => x.s > 0)
    .map((x) => ({ ...idx.chunks[x.i], _score: x.s }));
}

async function handleDocsAsk(req, res, body, ip) {
  if (!ANTHROPIC_API_KEY) {
    return json(res, 503, { error: "AI search not configured" });
  }
  if (rateLimited(ip, 20)) {
    return json(res, 429, { error: "Slow down" });
  }
  const query = typeof body?.query === "string" ? body.query.trim() : "";
  if (!query || query.length > 500) {
    return json(res, 400, { error: "Ugyldig søk" });
  }

  const top = await retrieveTopK(query, RAG_TOP_K);
  if (top.length === 0) {
    return json(res, 200, {
      answer:
        "Beklager — jeg fant ingen relevante seksjoner i dokumentasjonen for spørsmålet. Prøv å omformulere, eller bla i sidemenyen.",
      citations: [],
      retrieved: [],
      model: "claude-haiku-4-5",
      generatedAt: new Date().toISOString(),
    });
  }

  const contextBlock = top
    .map(
      (c, i) =>
        `[#${i + 1}] (slug=${c.href}) ${c.pageTitle} — ${c.section}\n${c.content}`,
    )
    .join("\n\n---\n\n");

  const system = `Du er Digilists dokumentasjons-assistent. Du svarer ALLTID på norsk bokmål basert KUN på utdragene under, som er hentet via semantisk søk i dokumentasjonen.

Krav:
- Hold svaret kort og handlingsorientert (1-3 korte avsnitt).
- Bruk konkrete eksempler fra utdragene — aldri generelle SaaS-fraser.
- Avslutt med "Kilder:" og en kort liste med [TITLE](slug) for de utdragene du faktisk brukte.
- Hvis utdragene ikke besvarer spørsmålet, si det rett ut og foreslå hvilken side brukeren bør lese.
- Aldri finn opp funksjoner, endepunkter eller fakta som ikke er i utdragene.

Utdrag (rangert etter relevans):

${contextBlock}`;

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 800,
        system,
        messages: [{ role: "user", content: query }],
      }),
    });
    if (!upstream.ok) {
      const errText = await upstream.text();
      console.error("docs-ask anthropic error:", upstream.status, errText.slice(0, 200));
      return json(res, 502, { error: "AI-tjenesten svarte med feil" });
    }
    const data = await upstream.json();
    const answer = (data.content || [])
      .filter((c) => c.type === "text")
      .map((c) => c.text)
      .join("\n")
      .trim();

    const citations = [];
    const seen = new Set();
    const re = /\[([^\]]+)\]\((\/[^\s)]+)\)/g;
    let m;
    while ((m = re.exec(answer))) {
      const href = m[2];
      if (seen.has(href)) continue;
      seen.add(href);
      const chunk = top.find((c) => c.href === href || c.href === href.replace(/\/$/, ""));
      citations.push({
        title: m[1],
        href,
        page_title: chunk?.pageTitle ?? m[1],
        section: chunk?.section ?? null,
      });
    }

    return json(res, 200, {
      answer,
      citations,
      retrieved: top.map((c) => ({
        href: c.href,
        page_title: c.pageTitle,
        section: c.section,
        score: Number(c._score?.toFixed(4) || 0),
      })),
      model: "claude-haiku-4-5",
      retrieval: RAG_INDEX?.model || "tfidf",
      generatedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error("/api/docs-ask error:", e);
    return json(res, 500, { error: "Intern feil" });
  }
}

// ---------- /api/inquiry (Resend email delivery)
async function handleInquiry(req, res, body, ip) {
  if (!RESEND_API_KEY) {
    return json(res, 503, { error: "Mail is not configured" });
  }
  if (rateLimited(ip, 10)) {
    return json(res, 429, { error: "Slow down" });
  }
  const required = ["name", "email", "organization", "topic"];
  for (const k of required) {
    if (!body || !body[k] || String(body[k]).trim() === "") {
      return json(res, 400, { error: `Missing required field: ${k}` });
    }
  }
  if (typeof body.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return json(res, 400, { error: "Ugyldig e-postadresse" });
  }

  const summary = body.summary || `${body.topic} — ${body.organization}`;
  const html = `
    <h2 style="font-family: Georgia, serif;">Ny forespørsel fra digilist.no</h2>
    <table style="font-family: system-ui, sans-serif; font-size: 14px; border-collapse: collapse;">
      <tr><td style="padding:4px 12px 4px 0;color:#666;">Persona</td><td>${escapeHtml(body.persona ?? "—")}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666;">Tema</td><td>${escapeHtml(body.topic)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666;">Organisasjon</td><td>${escapeHtml(body.organization)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666;">Navn</td><td>${escapeHtml(body.name)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666;">E-post</td><td>${escapeHtml(body.email)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666;">Telefon</td><td>${escapeHtml(body.phone || "—")}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666;">Kilde</td><td>${escapeHtml(body.source || "chatbot")}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666;">Side</td><td>${escapeHtml(body.page || "/")}</td></tr>
    </table>
    <h3 style="font-family: Georgia, serif; margin-top: 24px;">Melding</h3>
    <p style="white-space: pre-wrap; font-family: Georgia, serif; line-height: 1.6;">${escapeHtml(body.message || "(ingen melding)")}</p>
    ${
      body.contextSummary
        ? `<h3 style="font-family: Georgia, serif; margin-top: 24px;">Samtaleutdrag</h3>
           <pre style="white-space: pre-wrap; background: #FBF8F3; padding: 12px; border-left: 2px solid #1F2F6E; font-family: ui-monospace, monospace; font-size: 13px;">${escapeHtml(body.contextSummary)}</pre>`
        : ""
    }
    <p style="margin-top: 32px; font-size: 11px; color: #999; font-family: ui-monospace, monospace;">
      Mottatt ${escapeHtml(body.timestamp || new Date().toISOString())} ·
      IP: ${escapeHtml(ip)} ·
      User-Agent: ${escapeHtml(body.userAgent || "—")}
    </p>
  `;

  try {
    const upstream = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: MAIL_FROM,
        to: [NOTIFY_TO],
        cc: NOTIFY_CC,
        reply_to: body.email,
        subject: `[Chat] ${summary}`,
        html,
      }),
    });
    if (!upstream.ok) {
      const errText = await upstream.text();
      console.error("resend error:", upstream.status, errText);
      return json(res, 502, { error: "Kunne ikke sende e-post" });
    }
    return json(res, 200, { ok: true });
  } catch (e) {
    console.error("/api/inquiry error:", e);
    return json(res, 500, { error: "Internal error" });
  }
}

// ---------- server
const server = createServer(async (req, res) => {
  const ip =
    (req.headers["x-forwarded-for"]?.toString().split(",")[0].trim()) ||
    req.socket.remoteAddress ||
    "unknown";

  // Strip query string + trailing slash so a cache-bust like ?t=123 doesn't
  // bypass our exact-match route table. Falls back to raw url if parsing fails.
  let pathname = req.url || "/";
  try {
    pathname = new URL(req.url, "http://localhost").pathname;
  } catch {
    // ignore
  }
  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }

  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  if (req.method === "GET" && (pathname === "/api" || pathname === "/api/")) {
    return json(res, 200, {
      service: "digilist-api",
      docs: "https://docs.digilist.no/api/",
      endpoints: {
        "GET  /api/health": "Liveness + which integrations are configured",
        "POST /api/chat": "Chatbot (Anthropic Claude proxy, same-origin only)",
        "POST /api/inquiry": "Send a contact / book-demo form via Resend",
        "POST /api/docs-ask":
          "RAG over docs corpus → Claude answer + citations",
        "GET  /api/audits/public-summary":
          "Scrubbed surface scores for the public Transparens page",
        "GET  /api/audits/state":
          "Full audit snapshot (admin basic-auth required)",
        "POST /api/audits/run":
          "Trigger a fresh audit run (admin basic-auth required)",
        "POST /api/audits/recommend":
          "Claude fix recommendation for a single finding (admin)",
        "GET  /api/content/state": "Vekst-harness state (admin basic-auth)",
        "POST /api/content/run": "Trigger content pipeline (admin)",
        "POST /api/content/drafts/:id/{approve,reject,edit,publish}":
          "Draft mutations (admin)",
        "GET  /api/agents": "Specialist agent catalog (admin)",
        "POST /api/agents/chat": "Multi-agent chat (admin)",
      },
    });
  }

  if (req.method === "GET" && (pathname === "/api/health" || pathname === "/health")) {
    return json(res, 200, {
      ok: true,
      uptime: process.uptime(),
      anthropicConfigured: Boolean(ANTHROPIC_API_KEY),
      resendConfigured: Boolean(RESEND_API_KEY),
      auditConfigured: Boolean(ADMIN_BASIC_AUTH),
    });
  }

  if (req.method === "GET" && pathname === "/api/agents") {
    if (!authorized(req)) {
      res.writeHead(401, {
        ...corsHeaders,
        // "WWW-Authenticate" intentionally omitted — would trigger the browser's native basic-auth dialog. The React app handles 401 by clearing localStorage and rendering its own login card.
      });
      res.end(JSON.stringify({ error: "Unauthorized" }));
      return;
    }
    const list = Object.entries(AGENT_CATALOG).map(([id, a]) => ({
      id,
      name: a.name,
      description: a.description,
      tier: a.model && a.model.includes("sonnet") ? "expert" : "standard",
    }));
    return json(res, 200, { agents: list });
  }

  if (req.method === "GET" && pathname === "/api/audits/public-summary") {
    // Public, no-auth, scrubbed summary for /transparens. Returns only:
    //  - per-target scores (no findings, no URLs)
    //  - ecosystem roll-up
    //  - compliance posture (implementation % per framework)
    //  - generatedAt
    // Never includes specific finding messages, URLs, or sensitive paths.
    try {
      // Fetch compliance posture from Convex (public, no-auth query).
      // Best-effort — if Convex is unreachable, we omit posture rather
      // than failing the whole endpoint.
      let posture = null;
      const convexUrl = process.env.VITE_CONVEX_URL || process.env.CONVEX_URL;
      if (convexUrl) {
        try {
          const r = await fetch(`${convexUrl.replace(/\/$/, "")}/api/query`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              path: "compliance/state:publicSummary",
              args: {},
              format: "json",
            }),
          });
          if (r.ok) {
            const body = await r.json();
            if (body.status === "success") posture = body.value;
          }
        } catch {
          /* silent fallback */
        }
      }

      if (!existsSync(AUDIT_SNAPSHOT_PATH)) {
        return json(res, 200, {
          generatedAt: new Date().toISOString(),
          surfaces: [],
          ecosystem: null,
          posture,
        });
      }
      const raw = readFileSync(AUDIT_SNAPSHOT_PATH, "utf-8");
      const snap = JSON.parse(raw);
      const byTarget = new Map();
      for (const r of snap.latest || []) {
        const arr = byTarget.get(r.target_name) || [];
        arr.push(r);
        byTarget.set(r.target_name, arr);
      }
      const surfaces = (snap.targets || [])
        .filter((t) => t.is_active)
        .map((t) => {
          const runs = byTarget.get(t.name) || [];
          const scores = {};
          for (const r of runs) {
            scores[r.audit_type] = Math.round(r.avg_score);
          }
          const overall =
            runs.length === 0
              ? null
              : Math.round(
                  runs.reduce((s, r) => s + r.avg_score, 0) / runs.length,
                );
          return {
            id: t.name,
            label: t.label,
            type: t.type,
            environment: t.environment,
            indexable: t.indexable,
            origin: t.origin,
            overall,
            scores,
          };
        });
      return json(res, 200, {
        generatedAt: snap.generatedAt,
        surfaces,
        ecosystem: snap.ecosystemSummary || null,
        posture,
      });
    } catch (e) {
      return json(res, 500, { error: String(e?.message || e) });
    }
  }

  // /api/audits/state and /api/content/state are deprecated — the
  // dashboard now reads convex/audits/state.snapshot and
  // convex/content/state.snapshot via useQuery hooks. The JSON
  // snapshot files are no longer written; remove this branch after
  // any external consumers (none known) have migrated.

  if (req.method !== "POST") {
    return json(res, 405, { error: "Method Not Allowed" });
  }

  let body;
  try {
    body = await readJson(req);
  } catch (e) {
    return json(res, 400, { error: String(e.message || e) });
  }

  if (pathname === "/api/chat" || pathname === "/chat") {
    return handleChat(req, res, body, ip);
  }
  if (pathname === "/api/inquiry" || pathname === "/inquiry") {
    return handleInquiry(req, res, body, ip);
  }
  if (pathname === "/api/docs-ask") {
    return handleDocsAsk(req, res, body, ip);
  }
  if (pathname === "/api/audits/run") {
    if (!authorized(req)) {
      res.writeHead(401, {
        ...corsHeaders,
        // "WWW-Authenticate" intentionally omitted — would trigger the browser's native basic-auth dialog. The React app handles 401 by clearing localStorage and rendering its own login card.
      });
      res.end(JSON.stringify({ error: "Unauthorized" }));
      return;
    }
    return handleAuditRun(res, body || {});
  }
  if (pathname === "/api/agents/chat") {
    if (!authorized(req)) {
      res.writeHead(401, {
        ...corsHeaders,
        // "WWW-Authenticate" intentionally omitted — would trigger the browser's native basic-auth dialog. The React app handles 401 by clearing localStorage and rendering its own login card.
      });
      res.end(JSON.stringify({ error: "Unauthorized" }));
      return;
    }
    return handleAgentChat(res, body || {}, ip);
  }
  if (pathname === "/api/audits/recommend") {
    if (!authorized(req)) {
      res.writeHead(401, {
        ...corsHeaders,
        // "WWW-Authenticate" intentionally omitted — would trigger the browser's native basic-auth dialog. The React app handles 401 by clearing localStorage and rendering its own login card.
      });
      res.end(JSON.stringify({ error: "Unauthorized" }));
      return;
    }
    return handleAuditRecommend(res, body || {}, ip);
  }
  if (pathname === "/api/content/run") {
    if (!authorized(req)) {
      res.writeHead(401, {
        ...corsHeaders,
        // "WWW-Authenticate" intentionally omitted — would trigger the browser's native basic-auth dialog. The React app handles 401 by clearing localStorage and rendering its own login card.
      });
      res.end(JSON.stringify({ error: "Unauthorized" }));
      return;
    }
    return handleContentRun(res, body || {});
  }
  // /api/content/drafts/:id/{approve|reject|edit|publish} was the
  // legacy CLI-driven mutation path. The dashboard now calls Convex
  // mutations directly (convex/content/drafts.ts) and the publish
  // action runs LinkedIn/X posting from inside Convex
  // (convex/content/publish.ts). Route deleted.
  return json(res, 404, { error: "Not Found" });
});

// Catalog of specialized AI agents for the intelligence dashboard. Each
// agent has a tightly scoped system prompt + access to the current snapshot
// for context. The client passes `agent` (id) + `messages` (multi-turn).
//
// Per-agent overrides:
//   model      — defaults to claude-haiku-4-5-20251001; specialists upgraded to Sonnet
//   maxTokens  — defaults to 768; smart specialists allowed 2048 for depth
const AGENT_CATALOG = {
  sikkerhet: {
    name: "Sikkerhets-rådgiver",
    description: "Cybersecurity-rådgiver med fokus på OWASP, headers, secrets, supply chain.",
    model: "claude-sonnet-4-6",
    maxTokens: 6144,
    thinkingBudget: 3000,
    tools: ["fetch_url", "list_findings", "list_blog_posts"],
    system: `Du er Digilists Chief Security Strategist — en cybersikkerhets-ekspert med dyp domenekunnskap om SaaS for norsk offentlig sektor. Du svarer alltid på norsk bokmål, presist og handlingsorientert. Du gir aldri generiske "følg best practices"-svar — bare konkrete, navngitte teknikker med eksakte verdier, header-syntax, og verifiserbar dokumentasjon.

## Digilists stack (du kjenner alle detaljer)
- **Frontend:** Vite + React 18 SPA, deployed via prerendert SSR til Nginx på Hostinger VPS (digilist.no, app.digilist.no, dashboard.digilist.no, api.digilist.no)
- **Backend:** Convex (self-hosted) som queries/mutations/actions; PostgreSQL som reporting-DB; Node.js /api-tjeneste foran Convex
- **Betaling:** Stripe Connect Express (tenant per onboarded utleier) + Vipps Mobilepay + EHF/Peppol B2B-fakturering
- **Identitet:** ID-porten via Signicat OIDC, BankID, magic-link med signed JWT (HS256, 15-min TTL + refresh)
- **Hemmeligheter:** platformSecrets-tabell, AES-256-GCM med AAD, kun SECRETS_MASTER_KEY i env, step-up auth for skriving
- **Komponenter:** 27 Convex-komponenter med isolerte schemaer; facade-pattern krever v.string() på tvers av komponenter
- **Webhooks:** Stripe (sig-validation via webhook secret), Vipps (HMAC-SHA256 med shared secret), Signicat (JWS), alle på api.digilist.no/webhooks

## Compliance-rammeverk du mestrer
- **NSM grunnprinsipper for IKT-sikkerhet v2.2** — alle 12 prinsipper (identifiser, beskytt, oppdage, håndtere, gjenopprette), kontroll-IDs (1.1, 2.1.3, 3.4 osv.)
- **ISO 27001:2022** + **27701** (PIMS) — kontroll-IDs (A.5.1, A.8.16, A.8.28), Statement of Applicability for SaaS-leverandør
- **GDPR + Personopplysningsloven** — art. 5/25/32/33/34, krav til DPA, sub-processor-liste, databehandleravtale-mal
- **DigSiF** — Forskrift om sikkerhet i digitale tjenester for kommuner (under utforming, parallell til NIS2)
- **NIS2** — Norges implementering via Sikkerhetsloven + sektorforskrifter; meldeplikt 24t/72t
- **SSA-L 2026 sikkerhetsbilag (bilag 7)** — Statens standardavtaler, kravspesifikasjon for SaaS-leveranser til kommuner

## Verktøy + scoring du kan tolke
- **Mozilla Observatory v5** — vekting per header (CSP 25, HSTS 20, X-Frame-Options 5 osv.), du kan beregne fra B (75) til A+ (135+)
- **SSL Labs** — TLS 1.3-only, OCSP stapling, HSTS preload registry-krav (max-age ≥ 31536000; includeSubDomains; preload)
- **Mozilla CSP-evaluator** — strict-dynamic, nonce-baserte CSP-er for React-SPA, hash-fallback for inline JSON-LD
- **OWASP ZAP / Burp / Nuclei** — automatisert skanning, baseline-template for å unngå falsk-positives
- **Semgrep + CodeQL** — SAST-regler for React/Node/TypeScript
- **Snyk + npm audit + Renovate** — supply chain, SBOM via CycloneDX

## Norske sikkerhetshendelser du har lært av
- **Østre Toten kommune (2021-01-09)** — ransomware, 8 dager nede, krav om kryptografi + offsite backup
- **Akershus universitetssykehus (2018-05-14)** — utdaterte servere, 600 MNOK i kostnad
- **Sør-Varanger kommune (2023-11)** — phishing-kompromittert e-postsystem
- **Stortinget (2020-09-01)** — e-postkonti tilgang fra utenlandske aktører via password spraying
- **Hydro (2019-03-18)** — LockerGoga ransomware, 800 MNOK
Du peker tilbake på disse når du forklarer "hvorfor": konkret risiko = konkret kostnad.

## OWASP Top 10 2021 — du kan alle 10 med konkret Digilist-mapping
A01 Broken Access Control · A02 Cryptographic Failures · A03 Injection · A04 Insecure Design · A05 Security Misconfiguration · A06 Vulnerable Components · A07 Auth/Identification Failures · A08 Data Integrity · A09 Logging Failures · A10 SSRF. ASVS Level 2 er Digilists baseline.

## Header-fasit (konkrete verdier du anbefaler)
\`\`\`
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{random}' 'strict-dynamic'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.digilist.no https://api.stripe.com https://*.convex.cloud; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(self), payment=(self "https://api.stripe.com"), interest-cohort=()
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
\`\`\`

## Svarformat
1. **Risiko + kontekst** (1-2 setninger, henvis til OWASP-ID eller NSM-prinsipp)
2. **Konkret fiks** (kodelinje, header-syntax, eller systemd/nginx-snippet)
3. **Prioritet** (Kritisk/Høy/Medium/Lav) med begrunnelse
4. **Verifisering** (hvilket verktøy + forventet output)
5. (valgfritt) **Etterlevelse** — hvilken ISO/NSM-kontroll dette løser

Henvis aldri til "kontakt en ekspert" eller "vurder å bruke". Anbefal eksakt løsning, med eksakt syntax, med eksakt forventet resultat. Når du er usikker, si det eksplisitt og foreslå proof-of-concept.`,
  },
  seo: {
    name: "SEO-strateg",
    description: "SEO + GEO for norsk offentlig sektor — kommune-søk, SSA-L, AI-search, Schema.org.",
    model: "claude-sonnet-4-6",
    maxTokens: 6144,
    thinkingBudget: 3000,
    tools: ["fetch_url", "list_findings", "list_blog_posts"],
    system: `Du er Digilists Head of Search Strategy — en SEO + GEO-ekspert (Generative Engine Optimization) med dyp forståelse av norsk B2B-søk i kommunal sektor. Du svarer alltid på norsk bokmål, konkret og målbart. Hvert råd må kunne implementeres, måles og verifiseres. Aldri "skriv god innhold" — alltid eksakt keyword, eksakt struktur, eksakt verktøy.

## Markedet du jobber i
- **Målgruppe:** Kommunal CIO, IT-sjef, kultursjef, kulturkonsulent, anskaffelsesansvarlig. Beslutter SaaS-kjøp via SSA-L 2026, ofte mellom 200K-2M NOK årlig kontraktverdi.
- **Konkurrenter (Norge):** Bestillingssentralen.no, Bookup, Bookwhen, Visma Pro, Skedda. Digilist differensierer på Digdir-designsystemet, BankID/ID-porten innebygd, EHF-faktura, og dedikert kommune-fokus.
- **Beslutningsreise:** Søkemotor → blogg/landingsside → demo → SSA-L-kravspesifikasjon → tilbudsinnhenting (Doffin/Mercell/TED) → tildeling. SEO-treff må skje TIDLIG (research-fase), ikke sent.

## Kjernemarkedet — keyword-intent ladder du har memorert
**Top-funnel (research, høyt volum, lav konvertering):**
- "bookingsystem kommune" (~480/mnd, KD 35)
- "hva er bookingsystem" (~120/mnd, KD 18)
- "digital booking offentlig sektor"
- "møterom booking system"
- "kalender system kommune"

**Mid-funnel (evaluering, medium volum, høy konvertering):**
- "SSA-L bookingsystem" — null konkurranse, eier dette
- "kommunal bookingplattform 2026"
- "ID-porten booking integrasjon"
- "EHF faktura booking"
- "anskaffelse bookingsystem" — kjøp-intent
- "tilskudd lag foreninger booking"

**Bottom-funnel (kjøp, lavt volum, ekstrem konvertering):**
- "bookingsystem [kommune-navn]" — long-tail per kommune
- "[konkurrent] vs Digilist"
- "Digilist priser kommune"
- "bytte fra excel til bookingsystem"

**GEO-prompt-mapping (hvordan ChatGPT/Claude/Perplexity spør):**
- "best booking platform for norwegian municipalities"
- "norway municipal booking software comparison"
- "open booking SaaS GDPR compliant norway"
- Dette krever **named entity-tetthet** + verifiserbar fakta + sitatevennlige avsnitt.

## Schema.org JSON-LD du kan skrive for hånd
- **Organization** med areaServed=Norway, knowsAbout=["municipal booking", "SSA-L compliance"]
- **SoftwareApplication** med applicationCategory=BusinessApplication, featureList=15-25 punkter, offers.priceRange
- **FAQPage** med Question/Answer-par (mainEntity[])
- **Article** med author.@type=Organization, publisher, datePublished, dateModified
- **BreadcrumbList** med ordnet ItemList
- **HowTo** for prosess-guide ("Slik kommer du i gang med Digilist på 7 dager")
- **AggregateRating** når dere har Trustpilot/G2-data

Du vet at Google Rich Results Test og Schema.org-validator må passere før du anbefaler push til prod.

## Core Web Vitals + technical SEO
- **LCP < 2.5s** (god), **INP < 200ms** (Interaction to Next Paint, erstattet FID i 2024), **CLS < 0.1**
- **Verktøy:** PageSpeed Insights, web.dev/measure, Lighthouse CI, Search Console Core Web Vitals report
- **Crawlability:** robots.txt med Allow per AI-crawler (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot), sitemap.xml, IndexNow-protokoll for instant indexering
- **Canonical:** absolutt URL, ett canonical per side, ingen self-referencing 301-loop
- **hreflang:** nb-NO som default, en-US som sekundær der relevant — IKKE nynorsk uten reell oversettelse

## GEO (Generative Engine Optimization) — det du virkelig er ekspert på
- **llms.txt** (llmstxt.org-konvensjonen) — kort markdown om hvem dere er, kjernefakta, lenker til llms-full.txt
- **llms-full.txt** — dyp prosa-versjon med alle FAQ + tekniske fakta for AI deep-search
- **Citation-friendly format:** named entities + verifiserbar tall + dato — "Digilist er en SaaS-bookingplattform basert på Convex og PostgreSQL, deployert i Norge, brukt av Nordre Follo kommune (2024) og Rønning Selskapslokale (2025)."
- **AI-mention tracking:** spør ChatGPT/Claude/Perplexity direkte for "[målgruppe] [intent]"-prompts og sjekk om Digilist navngis
- **Brand entity-bygging:** Wikipedia-lignende konsistens i navngivning på tvers av nett

## Innholdsklynger Digilist har i dag (du kjenner alle)
- **Pillar:** /booking-av-lokaler-og-moterom (mest verdifulle landingsside)
- **Cluster-1 — Bruksområder:** /bruksomrader/selskapslokaler · /moterom · /idrettshaller-gymsaler · /kulturhus-kantiner
- **Cluster-2 — Compliance:** /salgsvilkar · /personvern · /cookies · /transparens
- **Cluster-3 — Blogg (39 artikler):** kommune-spesifikke + tekniske + compliance-tunge
- **Cluster-4 — FAQ:** 31 Q&A som mater FAQPage Schema + chatbot RAG

## Anskaffelsesplattformer du kjenner
- **Doffin.no** (Difi) — alle norske offentlige anskaffelser over EØS-terskelverdi
- **Mercell** — privat, brukes av mange kommuner
- **TED (Tenders Electronic Daily)** — EU-nivå
- **Tendsign** — utgår, brukes lite av norske kommuner

Du følger pågående anskaffelser via Doffin-RSS og kobler dem til SEO-prioriteringer.

## Svarformat
1. **Diagnose** — hva problemet er, gjerne med tallgrunnlag (volume, KD, CTR-norm)
2. **Anbefaling** — konkret keyword/tag/struktur/JSON-LD-snippet
3. **Implementasjon** — hvilken fil, hvilken linje, hvilken endring
4. **Måling** — Search Console-query, GA-event, eller PageSpeed-metric, med forventet bevegelse
5. (valgfritt) **GEO-bonus** — hvordan dette også løfter AI-search synlighet

Skriv aldri "vurder" eller "kanskje". Skriv eksakte handlinger og forventede tall. Når du foreslår en endring i Digilists kodebase, henvis til faktisk filsti i \`/Volumes/Laravel/Loveable/booking-brilliance/\`. Når du foreslår en ny blogg-post, gi forslag til tittel + slug + meta-description + 3 H2-overskrifter i ett svar.`,
  },
  wcag: {
    name: "WCAG-revisor",
    description: "Universell utforming og WCAG 2.1 AA for kommunale tjenester.",
    model: "claude-sonnet-4-6",
    maxTokens: 6144,
    thinkingBudget: 3000,
    tools: ["fetch_url", "list_findings", "list_blog_posts"],
    system: `Du er Digilists Head of Universal Design — en WCAG- og UU-ekspert med dyp forståelse av norsk forvaltningsrett for digitale tjenester. Du svarer alltid på norsk bokmål, presist og handlingsorientert. Hvert råd må kunne implementeres i kode samme dag, med eksakt suksesskriterium-referanse og forventet test-resultat.

## Lovverk + retningslinjer du behersker
- **Likestillings- og diskrimineringsloven §17–§18** — krav til universell utforming av IKT i offentlig sektor
- **Forskrift om universell utforming av IKT** (FOR-2013-06-21-732) — minimum WCAG 2.0 AA + 2.1 AA + tre tilleggskrav
- **WCAG 2.1 AA** — 50 suksesskriterier, alle 4 prinsipper (Perceivable, Operable, Understandable, Robust)
- **WCAG 2.2** — 9 nye kriterier (kommer inn i forskriften 2026 — vurder allerede nå)
- **EN 301 549 v3.2.1** — EU-standarden som norsk forskrift bygger på
- **Digdir Designsystemet** — referansestandard for komponenter i offentlig sektor; du kjenner alle Designsystemet-tokens og komponent-API
- **DUT (Digitaliseringstilsynet)** — etterfølger av Difi UU-tilsyn; du forstår tilsynsmetodikken

## Norske tilsynsrunder + sanksjoner du har lært av
- **Tilsynet UU 2023** — 30 kommuner sjekket, 67% feilet på heading-hierarki + alt-tekst
- **NRK 2022** — 1,2 MNOK tvangsmulkt for manglende teksting
- **Tilsynet på selvbetjeningskiosker 2024** — krav om tastatur + skjermleser-støtte
Du peker tilbake på disse når du forklarer "hvorfor": tilsyn = pålegg = tvangsmulkt opptil 20K NOK/dag.

## WCAG 2.1 AA — alle 50 SC du kan ut av minnet
**Perceivable:** 1.1.1 (Non-text Content), 1.2.1-5 (Time-based Media), 1.3.1-5 (Adaptable), 1.4.1-13 (Distinguishable — inkluderer 1.4.3 kontrast 4.5:1 normal, 3:1 large; 1.4.10 reflow 320px; 1.4.11 non-text contrast 3:1; 1.4.12 text spacing; 1.4.13 hover/focus content)
**Operable:** 2.1.1-4 (Keyboard), 2.2.1-6 (Enough Time), 2.3.1-3 (Seizures), 2.4.1-7 (Navigable — inkluderer 2.4.1 skip-to-main; 2.4.4 link purpose in context; 2.4.7 focus visible), 2.5.1-4 (Input Modalities)
**Understandable:** 3.1.1-2 (Readable — lang attribute, lang for parts), 3.2.1-4 (Predictable), 3.3.1-4 (Input Assistance — labels, errors)
**Robust:** 4.1.1-3 (Compatible — parsing, name/role/value, status messages)

## Verktøy du kan tolke (med eksakte regler)
- **axe-core** — du kjenner alle ~90 regler (color-contrast, aria-required-attr, button-name, label, region, etc.)
- **WAVE** + **Lighthouse a11y-score**
- **NVDA / JAWS / VoiceOver** — du vet hva som faktisk leses opp og hvilken rotor-/elementliste-gruppe det havner i
- **Pa11y CI** — automatisert testing i pipeline
- **Color Oracle / Sim Daltonism** — fargesynssimulator

## Digilists kontekst
- **Designsystem:** @digilist/ds basert på Digdir Designsystemet — alle komponenter har innebygd a11y. Aldri raw <button> — alltid <Button> fra DS.
- **Token-system:** --ds-color-* tokens er pre-validert WCAG AA. Hardkodet hex er en a11y-risiko.
- **Site:** marketing (Editorial Nordic, Fraunces+PublicSans, paper-tone #FBF8F3 → ink #0A1228 = 13.5:1 kontrast OK)
- **Dashboard:** Designsystemet-strict, brukes av kommune-saksbehandlere — krav om 100% keyboard-navigable
- **Konkret app-spesifikt:** kalenderkomponent må ha aria-live="polite" for tilgjengelighetsstatus per slot; bookingflow-veiviser krever 3.3.1 aria-describedby for valideringsfeil

## Kodefiks-eksempler du gir
\`\`\`tsx
// FEIL — bryter SC 4.1.2 (Name, Role, Value) og SC 2.1.1 (Keyboard)
<div onClick={handleClick} className="...">Book nå</div>

// RIKTIG — semantisk button + DS-komponent
<Button onClick={handleClick} variant="primary">Book nå</Button>

// Hvis et div MÅ være interaktivt (eks. card med stort klikkflate):
<div role="button" tabIndex={0} onClick={h} onKeyDown={(e) =>
  (e.key === 'Enter' || e.key === ' ') && h()}>
\`\`\`

## Svarformat
1. **Suksesskriterium-brudd** (SC X.Y.Z + nivå) med forklart konsekvens for sluttbruker
2. **Hvem rammes** (skjermleser / kun-tastatur / lavt syn / motorisk / kognitivt)
3. **Konkret kodefiks** (faktisk JSX/HTML/CSS, gjerne med @digilist/ds komponent)
4. **Verifisering** (hvilket verktøy + forventet output, f.eks. "axe-core color-contrast skal returnere 0 violations")
5. **Forskrifts-implikasjon** (eksplisitt: er dette tvangsmulkt-risiko eller bare best practice)

Aldri "bruk semantisk HTML" alene. Alltid "endre <X> til <Y> fordi suksesskriterium Z.W.V krever …". Når DS har en komponent som løser problemet (95% av tilfellene), foreslå alltid DS-komponenten først.`,
  },
  ytelse: {
    name: "Ytelses-ingeniør",
    description: "Core Web Vitals, bundle size, caching, CDN, runtime profiling.",
    model: "claude-sonnet-4-6",
    maxTokens: 6144,
    thinkingBudget: 3000,
    tools: ["fetch_url", "list_findings", "list_blog_posts"],
    system: `Du er Digilists Principal Performance Engineer — en ekspert på web performance fra wire til pixel. Du svarer alltid på norsk bokmål, målbart og handlingsorientert. Hvert råd må komme med tallgrunnlag (current → target), eksakt verktøy for å verifisere, og estimert impact.

## Digilists stack — du kjenner hvordan ytelse oppstår
- **Frontend:** Vite + React 18 SPA, prerendert via custom prerender.mjs (entry-server → static HTML per route) → hydrering på klient. Tailwind v3 (JIT). Framer Motion på utvalgte komponenter.
- **Bundle topp 5 (du vet hvor vekten er):** React 18 (~45 KB gz), Framer Motion (~50 KB gz), lucide-react (~30 KB gz ved full import — krever per-icon import), react-router-dom (~20 KB gz), eget app-kode
- **Bilder:** WebP/AVIF (avif først, webp fallback, jpg sist) — Vite optimizeImage plugin
- **Fonts:** Fraunces (variabel, alle akser, ~80 KB gz), Public Sans (variabel, ~35 KB gz), JetBrains Mono (variabel, ~40 KB gz) — preloaded med rel="preload" + font-display:swap
- **Hosting:** Hostinger VPS, Nginx serverer dist/, ingen CDN per i dag (potensielt kritisk gap)
- **Backend:** Convex (self-hosted) for queries/mutations — globally distributed via tenants

## Core Web Vitals — kravsverdier 2026 (du kan dem)
| Metric | Good | Needs Improvement | Poor |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | ≤2.5s | 2.5-4s | >4s |
| **INP** (Interaction to Next Paint) — erstattet FID 2024-03 | ≤200ms | 200-500ms | >500ms |
| **CLS** (Cumulative Layout Shift) | ≤0.1 | 0.1-0.25 | >0.25 |
| **FCP** (First Contentful Paint) — diagnostic | ≤1.8s | 1.8-3s | >3s |
| **TTFB** (Time to First Byte) — diagnostic | ≤800ms | 800ms-1.8s | >1.8s |
| **TBT** (Total Blocking Time) — diagnostic | ≤200ms | 200-600ms | >600ms |

## Verktøy + målemetodikk
- **Lighthouse CI** — i CI/CD, breakdown per kategori (perf/a11y/bp/seo)
- **PageSpeed Insights** — felt-data (CrUX) + lab-data
- **WebPageTest** — waterfall, filmstrip, og spesielt First Byte over Last Mile-tracerute
- **Chrome DevTools Performance** — flame chart for INP-bottlenecks
- **Coverage tab** — unused JS/CSS per route
- **Bundlephobia** + **bundle-analyzer plugin** — pre-deploy bundle audit

## Kjente Digilist-spesifikke optimaliseringsvinduer (du kjenner dem)
1. **Hero LCP** = Fraunces hero-tittel rendert med variabelfont → preload Fraunces-subset + font-display:swap
2. **Framer Motion ved scroll** — lat-load via dynamic import for tunge scroll-animasjoner
3. **Blog index page** — 39 cards → virtualize liste eller paginer (10/side)
4. **lucide-react** — sørg for at hver ikon-import er navngitt (import { ArrowUpRight }) ikke wildcard
5. **Tailwind unused CSS** — JIT bør stripe ubrukt; verifiser med Coverage tab
6. **SSR hydration mismatch** — sjekk at prerendrert HTML matcher klient (gir reflows/CLS)
7. **/admin/intelligence** — Sonnet-agenter genererer 10-30s; UI bør streame respons (deferred for nå)

## Caching-strategi du anbefaler
\`\`\`nginx
# Statiske assets med hash i filnavn — cache 1 år, immutable
location ~* \\.(js|css|woff2)$ {
    add_header Cache-Control "public, max-age=31536000, immutable";
}
# HTML — kort cache for at navigasjon kan revalidere
location ~* \\.html$ {
    add_header Cache-Control "public, max-age=300, must-revalidate";
}
# Images — lang cache, hashed paths
location ~* \\.(webp|avif|jpg|png|svg)$ {
    add_header Cache-Control "public, max-age=31536000, immutable";
}
\`\`\`

## CDN-anbefalinger (Digilist mangler dette per i dag)
- **Cloudflare** — gratis tier dekker det meste; aktiver Brotli, HTTP/3, Argo
- **bunny.net** — billigere ved skala; perfekt for image-heavy
- **Vercel Edge Network** — om Digilist en gang flytter fra Hostinger til Vercel

## Svarformat
1. **Diagnose** — hvilken metric, hva er current, hva er target, hvor stort er gapet
2. **Rotårsak** — er det rendering / network / bundle / runtime
3. **Konkret fiks** — kodeendring, config-snippet, eller package-install + bruk
4. **Impact-estimat** — eksempel: "LCP fra 3.1s → 1.9s (~−1.2s)"
5. **Verifisering** — hvilket verktøy, hvilken metric, hvilken forventet endring

Aldri vage anbefalinger. Aldri "bruk en CDN". Alltid eksakt: "Aktiver Cloudflare proxy på A-record digilist.no, slå på Brotli 5, sett cache-rule \`*.js\` til Edge TTL 1y, sjekk via curl -I — forventet TTFB 380→90ms i Europa."`,
  },
  triage: {
    name: "Triage-agent",
    description: "Klassifiserer og prioriterer funn, peker deg til riktig spesialist.",
    tools: ["list_findings"],
    system: `Du er triage-agent for Digilist Intelligence Center. Du klassifiserer brukerens spørsmål og foreslår om de skal snakke med Sikkerhets-rådgiver, SEO-strateg, WCAG-revisor eller Ytelses-ingeniør. Du gir også et kort førsteinntrykk av problemet før eskalering.

Når brukeren spør om "hva bør jeg fikse først" eller "hvilke funn er kritiske", bruk verktøyet \`list_findings\` for å hente faktiske funn fra siste skanning. Aldri gjett — bruk verktøyet.

Svar på norsk bokmål, maks 200 ord. Format: 1 setning om hva du forstår problemet til å være, 1-3 konkrete funn (hvis relevant) med severity + surface, 1 setning om foreslått neste steg (med navn på riktig spesialist-agent), 1-2 setninger med umiddelbar handling brukeren kan ta selv.`,
  },
};

// Tools the agents can call. Each has a schema + an executor. Executors
// run server-side, fetch live data, and return a string. The model picks
// when to call them.
const TOOL_REGISTRY = {
  fetch_url: {
    schema: {
      name: "fetch_url",
      description:
        "Henter en URL og returnerer enten response-headers, ren tekst eller full HTML. Bruk dette for å verifisere reelle headers (CSP, HSTS), meta-tags, eller faktisk innhold på en side. Maks 80 KB per kall.",
      input_schema: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "Full URL inkludert protokoll, f.eks. https://digilist.no/transparens",
          },
          mode: {
            type: "string",
            enum: ["headers", "text", "html"],
            description:
              "'headers' = bare response headers + status; 'text' = innhold uten HTML-tags; 'html' = rå HTML (kappet ved 60 KB).",
          },
        },
        required: ["url", "mode"],
      },
    },
    async run({ url, mode }) {
      if (!/^https?:\/\//.test(url)) {
        return JSON.stringify({ error: "URL må starte med http(s)://" });
      }
      try {
        const r = await fetch(url, {
          method: mode === "headers" ? "HEAD" : "GET",
          redirect: "follow",
          headers: { "user-agent": "DigilistIntelligenceAgent/1.0" },
        });
        const headers = Object.fromEntries(r.headers.entries());
        if (mode === "headers") {
          return JSON.stringify({
            status: r.status,
            url: r.url,
            headers,
          });
        }
        const raw = (await r.text()).slice(0, 60_000);
        if (mode === "html") {
          return JSON.stringify({ status: r.status, url: r.url, headers, html: raw });
        }
        // mode === "text"
        const text = raw
          .replace(/<script[\s\S]*?<\/script>/gi, " ")
          .replace(/<style[\s\S]*?<\/style>/gi, " ")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 30_000);
        // Also extract <title>, meta description, og:title
        const titleMatch = raw.match(/<title[^>]*>([^<]*)<\/title>/i);
        const descMatch = raw.match(
          /<meta\s+name=["']description["']\s+content=["']([^"']*)/i,
        );
        const ogMatch = raw.match(
          /<meta\s+property=["']og:title["']\s+content=["']([^"']*)/i,
        );
        return JSON.stringify({
          status: r.status,
          url: r.url,
          title: titleMatch?.[1] ?? null,
          description: descMatch?.[1] ?? null,
          ogTitle: ogMatch?.[1] ?? null,
          text,
        });
      } catch (e) {
        return JSON.stringify({ error: String(e instanceof Error ? e.message : e) });
      }
    },
  },
  list_findings: {
    schema: {
      name: "list_findings",
      description:
        "Henter aktive funn (issues) fra siste skanning. Filtrér etter severity og audit-kategori. Returnerer opptil 20 funn med surface, regel, melding og berørte sider.",
      input_schema: {
        type: "object",
        properties: {
          severity: {
            type: "string",
            enum: ["error", "warn", "info"],
            description: "Filtrer på alvorlighetsgrad. Utelat for alle.",
          },
          auditType: {
            type: "string",
            enum: ["uptime", "seo", "a11y", "security", "links", "performance"],
            description: "Filtrer på audit-kategori. Utelat for alle.",
          },
          surface: {
            type: "string",
            description: "Filtrer på spesifikk surface, f.eks. 'marketing' eller 'app'.",
          },
        },
      },
    },
    async run({ severity, auditType, surface }) {
      if (!existsSync(AUDIT_SNAPSHOT_PATH)) {
        return JSON.stringify({ error: "Ingen snapshot tilgjengelig" });
      }
      try {
        const snap = JSON.parse(readFileSync(AUDIT_SNAPSHOT_PATH, "utf-8"));
        const issues = (snap.issues || [])
          .filter((i) => !severity || i.severity === severity)
          .filter((i) => !auditType || i.auditType === auditType)
          .filter((i) => !surface || i.surface === surface)
          .slice(0, 20);
        return JSON.stringify({
          count: issues.length,
          issues: issues.map((i) => ({
            surface: i.surface,
            auditType: i.auditType,
            rule: i.rule,
            severity: i.severity,
            message: i.message,
            url: i.url,
            affected: i.affected,
          })),
        });
      } catch (e) {
        return JSON.stringify({ error: String(e instanceof Error ? e.message : e) });
      }
    },
  },
  list_blog_posts: {
    schema: {
      name: "list_blog_posts",
      description:
        "Lister alle blogg-poster i Digilist-økosystemet med tittel, slug og excerpt. Bruk for å sjekke hva som allerede dekkes, finne content-gaps, eller foreslå internlenker.",
      input_schema: {
        type: "object",
        properties: {
          search: {
            type: "string",
            description: "Filter-streng som matches mot tittel og slug (case-insensitive).",
          },
        },
      },
    },
    async run({ search }) {
      try {
        const blogDir = "/var/www/digilist/blog-meta.json";
        // The deployed audit bundle persists a small metadata index, but we
        // can fall back to reading the live sitemap if not present.
        if (existsSync(blogDir)) {
          const data = JSON.parse(readFileSync(blogDir, "utf-8"));
          const filtered = search
            ? data.filter((p) =>
                (p.title + " " + p.slug)
                  .toLowerCase()
                  .includes(search.toLowerCase()),
              )
            : data;
          return JSON.stringify({ count: filtered.length, posts: filtered.slice(0, 30) });
        }
        // Fallback — fetch sitemap and extract blog URLs
        const r = await fetch("https://digilist.no/sitemap.xml");
        const xml = await r.text();
        const urls = Array.from(xml.matchAll(/<loc>([^<]*)<\/loc>/g))
          .map((m) => m[1])
          .filter((u) => u.includes("/blogg/") && !u.endsWith("/blogg/"));
        const posts = urls.map((u) => ({
          slug: u.replace(/^.*\/blogg\//, "").replace(/\/$/, ""),
          url: u,
        }));
        const filtered = search
          ? posts.filter((p) =>
              p.slug.toLowerCase().includes(search.toLowerCase()),
            )
          : posts;
        return JSON.stringify({ count: filtered.length, posts: filtered.slice(0, 30) });
      } catch (e) {
        return JSON.stringify({ error: String(e instanceof Error ? e.message : e) });
      }
    },
  },
};

async function handleAgentChat(res, body, ip) {
  if (!ANTHROPIC_API_KEY) {
    return json(res, 503, { error: "AI ikke konfigurert" });
  }
  if (rateLimited(ip, 40)) {
    return json(res, 429, { error: "Slow down" });
  }
  const agentId = typeof body.agent === "string" ? body.agent : "";
  const agent = AGENT_CATALOG[agentId];
  if (!agent) {
    return json(res, 400, {
      error: "Ukjent agent",
      validAgents: Object.keys(AGENT_CATALOG),
    });
  }
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return json(res, 400, { error: "Mangler messages[]" });
  }
  if (body.messages.length > 16) {
    return json(res, 413, { error: "Samtale for lang" });
  }

  // Optional snapshot context: caller can pass a slice of the current
  // snapshot so the agent answers in context of real findings.
  // Soft-capped at 8000 chars; longer payloads truncated with a marker.
  let contextStr = "";
  if (typeof body.context === "string" && body.context.length > 0) {
    const cap = 8000;
    const trimmed =
      body.context.length > cap
        ? body.context.slice(0, cap) + "\n[…trunkert]"
        : body.context;
    contextStr = `\n\n# Kontekst fra siste skanning\n${trimmed}`;
  }

  const model = agent.model || "claude-haiku-4-5-20251001";
  const maxTokens = agent.maxTokens || 768;
  const thinkingBudget = agent.thinkingBudget;
  const agentTools = Array.isArray(agent.tools) ? agent.tools : [];

  // Tool-use loop. Max 4 iterations to prevent runaway. For each iteration
  // the model can either: (1) return text/thinking blocks (done), or
  // (2) return tool_use blocks that we execute and feed back.
  const conversation = body.messages.map(({ role, content }) => ({
    role,
    content,
  }));
  const toolTrace = []; // emitted to client for transparency
  const thinkingChunks = []; // accumulated across iterations

  try {
    for (let iteration = 0; iteration < 4; iteration++) {
      const requestBody = {
        model,
        max_tokens: maxTokens,
        system: agent.system + contextStr,
        messages: conversation,
      };
      if (thinkingBudget && thinkingBudget > 0) {
        requestBody.thinking = {
          type: "enabled",
          budget_tokens: thinkingBudget,
        };
      }
      if (agentTools.length > 0) {
        requestBody.tools = agentTools
          .map((id) => TOOL_REGISTRY[id]?.schema)
          .filter(Boolean);
      }

      const upstream = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!upstream.ok) {
        const errText = await upstream.text();
        console.error("agent chat error:", upstream.status, errText);
        return json(res, 502, { error: "AI-tjenesten svarte med feil" });
      }
      const data = await upstream.json();
      const content = data.content || [];

      // If the model used tools, execute them and continue the loop.
      // Accumulate thinking blocks from this iteration regardless of branch
      for (const c of content) {
        if (c.type === "thinking" && c.thinking) {
          thinkingChunks.push(c.thinking);
        }
      }
      const toolUses = content.filter((c) => c.type === "tool_use");
      if (toolUses.length > 0 && data.stop_reason === "tool_use") {
        // Append assistant turn (must include thinking + tool_use blocks
        // verbatim so they remain part of the conversation history).
        conversation.push({ role: "assistant", content });
        // Execute each tool and prepare the tool_result block.
        const toolResults = [];
        for (const tu of toolUses) {
          const tool = TOOL_REGISTRY[tu.name];
          let result = "";
          if (!tool) {
            result = JSON.stringify({ error: `Ukjent verktøy: ${tu.name}` });
          } else {
            try {
              result = await tool.run(tu.input || {});
            } catch (e) {
              result = JSON.stringify({
                error: String(e instanceof Error ? e.message : e),
              });
            }
          }
          toolTrace.push({
            tool: tu.name,
            input: tu.input,
            resultPreview: result.slice(0, 200),
          });
          toolResults.push({
            type: "tool_result",
            tool_use_id: tu.id,
            content: result,
          });
        }
        conversation.push({ role: "user", content: toolResults });
        continue; // run another iteration
      }

      // Done — emit accumulated thinking + final text.
      const thinking = thinkingChunks.length > 0
        ? thinkingChunks.join("\n\n---\n\n").trim()
        : null;
      const text =
        content
          .filter((c) => c.type === "text")
          .map((c) => c.text)
          .join("\n")
          .trim() || "Beklager — ingen svar.";
      return json(res, 200, {
        text,
        thinking,
        toolTrace,
        agent: agentId,
        agentName: agent.name,
        model,
      });
    }

    // Loop budget exceeded.
    return json(res, 200, {
      text:
        "(Agenten brukte for mange verktøy-iterasjoner uten å konkludere. Prøv å avgrense spørsmålet.)",
      thinking: null,
      toolTrace,
      agent: agentId,
      agentName: agent.name,
      model,
    });
  } catch (e) {
    console.error("/api/agents/chat error:", e);
    return json(res, 500, { error: "Intern feil" });
  }
}

// Expose catalog (no auth) so client can render agent list without hardcoding it
// — but only via GET /api/agents (handled separately below).

// AI fix recommendations: takes one finding (rule + severity + message + url + auditType)
// and asks Claude for a structured fix proposal. Cheap, single-shot, ~512 tokens.
async function handleAuditRecommend(res, body, ip) {
  if (!ANTHROPIC_API_KEY) {
    return json(res, 503, { error: "AI recommendations not configured" });
  }
  if (rateLimited(ip, 30)) {
    return json(res, 429, { error: "Slow down" });
  }
  const required = ["rule", "severity", "message", "auditType"];
  for (const k of required) {
    if (!body || typeof body[k] !== "string" || body[k].trim() === "") {
      return json(res, 400, { error: `Missing field: ${k}` });
    }
  }
  const url = typeof body.url === "string" ? body.url : "";
  const surface = typeof body.surface === "string" ? body.surface : "marketing";
  const affected =
    typeof body.affected === "number" ? body.affected : 1;

  const system = `Du er en sikkerhets- og kvalitetsekspert for Digilist, en SaaS-bookingplattform for norske kommuner. Du svarer alltid på norsk bokmål med presis, handlingsorientert tekst. Du vet at plattformen kjører på Convex + PostgreSQL, deployes via vite + nginx + Node service på Hostinger VPS, og bruker @digilist/ds designsystem.

Strukturer svaret strengt i fire avsnitt med disse overskriftene som markdown ## headers:

## Problem
Forklar i 1-2 setninger hva det betyr at denne regelen utløses og hva som er risikoen.

## Anbefalt fiks
Konkret hva som skal endres. Hvis det er kode, hvilken fil/komponent. Hvis det er konfigurasjon, hvilken header/policy. Hold svaret praktisk og kort (3-6 punktliste-items maks).

## Akseptansekriterier
2-4 sjekkbare punkter (markdown bullet list med - prefiks) som bekrefter at fikset er korrekt utført.

## Prioritet
Én linje: kritisk / høy / middels / lav, med begrunnelse.`;

  const userMsg = `Audit-funn:
- Regel: ${body.rule}
- Severity: ${body.severity}
- Audit-type: ${body.auditType}
- Overflate: ${surface}
- Berørt URL: ${url || "(ikke spesifisert)"}
- Antall berørte sider: ${affected}
- Melding: ${body.message}

Foreslå en fiks.`;

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 768,
        system,
        messages: [{ role: "user", content: userMsg }],
      }),
    });
    if (!upstream.ok) {
      const errText = await upstream.text();
      console.error("anthropic recommend error:", upstream.status, errText);
      return json(res, 502, { error: "AI-tjenesten svarte med feil" });
    }
    const data = await upstream.json();
    const text =
      (data.content || [])
        .filter((c) => c.type === "text")
        .map((c) => c.text)
        .join("\n")
        .trim() || "Ingen anbefaling tilgjengelig.";
    return json(res, 200, {
      recommendation: text,
      model: "claude-haiku-4-5",
      generatedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error("/api/audits/recommend error:", e);
    return json(res, 500, { error: "Intern feil" });
  }
}

function handleAuditRun(res, body) {
  if (!AUDIT_REPO_DIR || !existsSync(AUDIT_REPO_DIR)) {
    return json(res, 503, {
      error:
        "Audit runner not configured on this server. Set AUDIT_REPO_DIR to a checkout that has pnpm + tools/site-intelligence available.",
    });
  }
  const target = typeof body.target === "string" ? body.target : "";
  const args = ["audit:all"];
  if (target) {
    args.push("--", "--target", target, "--trigger", "dashboard");
  } else {
    args.push("--", "--trigger", "dashboard");
  }
  const runRequestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const child = spawn("pnpm", args, {
    cwd: AUDIT_REPO_DIR,
    env: { ...process.env, FORCE_COLOR: "0" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  auditRuns.set(runRequestId, {
    startedAt: new Date().toISOString(),
    target: target || "all",
    status: "running",
    log: "",
  });
  const append = (chunk) => {
    const state = auditRuns.get(runRequestId);
    if (state) state.log += chunk.toString();
  };
  child.stdout.on("data", append);
  child.stderr.on("data", append);
  child.on("close", (code) => {
    const state = auditRuns.get(runRequestId);
    if (!state) return;
    state.status = code === 0 ? "ok" : "error";
    state.finishedAt = new Date().toISOString();
  });

  // Fire PSI performance scan in parallel — runs in Convex (talks to
  // Google PageSpeed Insights API directly). The dashboard's "Kjør
  // full skanning" expects "everything" to run, including CWV.
  const psiArgs = ["audit:psi"];
  if (target) psiArgs.push("--", "--target", target);
  const psiChild = spawn("pnpm", psiArgs, {
    cwd: AUDIT_REPO_DIR,
    env: { ...process.env, FORCE_COLOR: "0" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  psiChild.stdout.on("data", (c) => append(`[psi] ${c.toString()}`));
  psiChild.stderr.on("data", (c) => append(`[psi:err] ${c.toString()}`));
  // Reap older entries
  if (auditRuns.size > 50) {
    const first = auditRuns.keys().next().value;
    if (first) auditRuns.delete(first);
  }
  return json(res, 202, { runRequestId, status: "accepted" });
}

// ─────────────────────────────────────────────────────────────
// Content agent endpoints
//
// Mirrors the audit run pattern: HTTP server stays zero-dep, all
// DB writes happen in a spawned `tsx tools/content-agent/src/cli.ts`.
// Drafts mutations (approve/reject/edit/publish) are synchronous
// (cli exits in <1s) and return the cli's JSON output verbatim.
// content:all is async like audits:run — we return 202 with a runId.

function handleContentRun(res, body) {
  if (!CONTENT_REPO_DIR || !existsSync(CONTENT_REPO_DIR)) {
    return json(res, 503, {
      error:
        "Content agent runner not configured on this server. Set CONTENT_REPO_DIR to a checkout that has pnpm + tools/content-agent available.",
    });
  }
  const phase = ["discover", "analyze", "generate", "all"].includes(body.phase)
    ? body.phase
    : "all";
  const script =
    phase === "all" ? "content:all" : `content:${phase}`;
  const runRequestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const child = spawn("pnpm", [script, "--", "--trigger", "dashboard"], {
    cwd: CONTENT_REPO_DIR,
    env: { ...process.env, FORCE_COLOR: "0" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  contentRuns.set(runRequestId, {
    startedAt: new Date().toISOString(),
    phase,
    status: "running",
    log: "",
  });
  const append = (chunk) => {
    const state = contentRuns.get(runRequestId);
    if (state) state.log += chunk.toString();
  };
  child.stdout.on("data", append);
  child.stderr.on("data", append);
  child.on("close", (code) => {
    const state = contentRuns.get(runRequestId);
    if (!state) return;
    state.status = code === 0 ? "ok" : "error";
    state.finishedAt = new Date().toISOString();
    // Convex-backed orchestrator writes results directly to the
    // deployment; dashboard re-renders reactively. No snapshot regen.
  });
  if (contentRuns.size > 50) {
    const first = contentRuns.keys().next().value;
    if (first) contentRuns.delete(first);
  }
  return json(res, 202, { runRequestId, status: "accepted", phase });
}

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[digilist-api] listening on 127.0.0.1:${PORT}`);
  console.log(
    `[digilist-api] anthropic=${ANTHROPIC_API_KEY ? "on" : "off"} resend=${RESEND_API_KEY ? "on" : "off"} admin-auth=${ADMIN_BASIC_AUTH ? "on" : "OFF"}`,
  );
  if (!ADMIN_BASIC_AUTH) {
    console.warn(
      "[digilist-api] WARNING: ADMIN_BASIC_AUTH is unset — every /api/audits, /api/content and /api/agents request will 401. " +
        "Add `ADMIN_BASIC_AUTH=user:password` to .env.local (gitignored) and restart `pnpm dev:api`.",
    );
  }
});
