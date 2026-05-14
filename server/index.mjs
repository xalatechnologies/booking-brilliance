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
import { readFileSync, existsSync } from "node:fs";

// ---------- env loading (supports a simple .env at /etc/digilist-api.env)
function loadEnv() {
  const candidates = [
    "/etc/digilist-api.env",
    new URL("./.env", import.meta.url).pathname,
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

// ---------- helpers
const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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

  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  if (req.method === "GET" && (req.url === "/api/health" || req.url === "/health")) {
    return json(res, 200, {
      ok: true,
      uptime: process.uptime(),
      anthropicConfigured: Boolean(ANTHROPIC_API_KEY),
      resendConfigured: Boolean(RESEND_API_KEY),
    });
  }

  if (req.method !== "POST") {
    return json(res, 405, { error: "Method Not Allowed" });
  }

  let body;
  try {
    body = await readJson(req);
  } catch (e) {
    return json(res, 400, { error: String(e.message || e) });
  }

  if (req.url === "/api/chat" || req.url === "/chat") {
    return handleChat(req, res, body, ip);
  }
  if (req.url === "/api/inquiry" || req.url === "/inquiry") {
    return handleInquiry(req, res, body, ip);
  }
  return json(res, 404, { error: "Not Found" });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[digilist-api] listening on 127.0.0.1:${PORT}`);
  console.log(
    `[digilist-api] anthropic=${ANTHROPIC_API_KEY ? "on" : "off"} resend=${RESEND_API_KEY ? "on" : "off"}`,
  );
});
