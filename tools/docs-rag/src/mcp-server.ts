/**
 * docs-rag MCP server — exposes the Digilist documentation corpus to any Claude
 * agent as a retrieval tool. Self-contained stdio JSON-RPC (no SDK dependency,
 * runs under tsx), TF-IDF retrieval over the committed index
 * (apps/docs/dist-rag/docs-rag-index.json — same logic as server/index.mjs).
 *
 * Tools:
 *   docs_search({ query, k? })  → top-k doc chunks (title · section · href · body)
 *   docs_get({ id })            → the full chunk body by id
 *
 * Register (VPS, user scope so every agent gets it):
 *   claude mcp add -s user docs-rag -- \
 *     /root/booking-brilliance/node_modules/.bin/tsx \
 *     /root/booking-brilliance/tools/docs-rag/src/mcp-server.ts
 *
 * IMPORTANT: stdout carries ONLY JSON-RPC messages; all logs go to stderr.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface Chunk {
  id: string;
  slug: string;
  href: string;
  pageTitle: string;
  section: string;
  content: string;
  tokens: number;
  embedding: number[] | null;
}
interface Index {
  generatedAt: string;
  model: string;
  chunks: Chunk[];
}

const STOPWORDS = new Set([
  "og", "i", "en", "et", "på", "for", "til", "av", "med", "som", "er", "den",
  "det", "de", "har", "ikke", "kan", "vi", "du", "din", "om", "fra", "ved",
  "men", "eller", "der", "her", "ble", "blir", "vil", "skal", "også", "etter",
  "før", "noen", "andre", "alle", "mer", "mest", "kun", "bare", "slik", "denne",
  "dette", "disse", "hva", "hvor", "hvordan",
  "the", "a", "and", "to", "of", "in", "is", "it", "for", "with", "on", "or",
  "as", "by", "be", "are", "this", "that", "from",
]);

function tokenize(s: string): string[] {
  return String(s)
    .toLowerCase()
    .normalize("NFC")
    .replace(/[^a-zà-ÿæøå0-9\s]/gi, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOPWORDS.has(w));
}

// ── load index ──────────────────────────────────────────────────────────────
const CANDIDATES = [
  process.env.DOCS_RAG_INDEX || "",
  "/var/www/digilist-api/docs-rag-index.json",
  path.resolve(__dirname, "..", "..", "..", "apps", "docs", "dist-rag", "docs-rag-index.json"),
].filter(Boolean);

let index: Index = { generatedAt: "", model: "none", chunks: [] };
for (const c of CANDIDATES) {
  if (fs.existsSync(c)) {
    index = JSON.parse(fs.readFileSync(c, "utf-8")) as Index;
    console.error(`[docs-rag-mcp] loaded ${index.chunks.length} chunks (model=${index.model}) from ${c}`);
    break;
  }
}

// ── build TF-IDF (matches server/index.mjs) ─────────────────────────────────
const N = index.chunks.length || 1;
const df = new Map<string, number>();
const tfs = index.chunks.map((c) => {
  const toks = tokenize(`${c.pageTitle} ${c.section} ${c.content}`);
  const tf = new Map<string, number>();
  for (const t of toks) tf.set(t, (tf.get(t) || 0) + 1);
  for (const t of new Set(toks)) df.set(t, (df.get(t) || 0) + 1);
  return tf;
});
const idf = new Map<string, number>();
for (const [t, d] of df) idf.set(t, Math.log((N + 1) / (d + 1)) + 1);
const tfidf = tfs.map((tf) => {
  const v = new Map<string, number>();
  for (const [t, c] of tf) v.set(t, c * (idf.get(t) || 0));
  return v;
});

function cosine(a: Map<string, number>, b: Map<string, number>): number {
  let na = 0;
  let nb = 0;
  for (const v of a.values()) na += v * v;
  for (const v of b.values()) nb += v * v;
  if (na === 0 || nb === 0) return 0;
  const [small, big] = a.size < b.size ? [a, b] : [b, a];
  let dot = 0;
  for (const [k, v] of small) {
    const w = big.get(k);
    if (w !== undefined) dot += v * w;
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function search(query: string, k: number): Array<Chunk & { score: number }> {
  const qToks = tokenize(query);
  const qTf = new Map<string, number>();
  for (const t of qToks) qTf.set(t, (qTf.get(t) || 0) + 1);
  const qVec = new Map<string, number>();
  for (const [t, c] of qTf) qVec.set(t, c * (idf.get(t) || 0));
  return tfidf
    .map((cv, i) => ({ i, s: cosine(qVec, cv) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, k)
    .filter((x) => x.s > 0)
    .map((x) => ({ ...index.chunks[x.i], score: Number(x.s.toFixed(4)) }));
}

// ── MCP tools ───────────────────────────────────────────────────────────────
const TOOLS = [
  {
    name: "docs_search",
    description:
      "Søk i Digilist-dokumentasjonen (produkt, compliance/SSA-L, arkitektur, API, drift). Returnerer de mest relevante seksjonene. Bruk dette for autoritative fakta om hva Digilist gjør og hvordan.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Free-text query in English or Norwegian" },
        k: { type: "number", description: "Antall treff (default 5)" },
      },
      required: ["query"],
    },
  },
  {
    name: "docs_get",
    description: "Hent hele innholdet i én dokumentasjons-seksjon via id-en fra docs_search.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string", description: "Chunk-id, f.eks. compliance/ssa-l#samsvarsmatrise" } },
      required: ["id"],
    },
  },
];

function callTool(name: string, args: Record<string, unknown>): string {
  if (name === "docs_search") {
    const hits = search(String(args.query ?? ""), Number(args.k) || 5);
    if (hits.length === 0) return "Ingen treff i Digilist-dokumentasjonen for det søket.";
    return hits
      .map((h) => `## ${h.pageTitle} — ${h.section}\n(${h.href} · id: ${h.id} · score ${h.score})\n\n${h.content.slice(0, 800)}`)
      .join("\n\n---\n\n");
  }
  if (name === "docs_get") {
    const c = index.chunks.find((x) => x.id === args.id);
    return c ? `# ${c.pageTitle} — ${c.section}\n(${c.href})\n\n${c.content}` : `Fant ingen seksjon med id: ${args.id}`;
  }
  throw new Error(`ukjent verktøy: ${name}`);
}

// ── stdio JSON-RPC loop ─────────────────────────────────────────────────────
function send(msg: unknown): void {
  process.stdout.write(`${JSON.stringify(msg)}\n`);
}

function handle(msg: { id?: unknown; method?: string; params?: any }): void {
  const { id, method, params } = msg;
  switch (method) {
    case "initialize":
      send({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: params?.protocolVersion ?? "2025-06-18",
          capabilities: { tools: {} },
          serverInfo: { name: "docs-rag", version: "1.0.0" },
        },
      });
      break;
    case "notifications/initialized":
    case "initialized":
      break; // notification — no reply
    case "tools/list":
      send({ jsonrpc: "2.0", id, result: { tools: TOOLS } });
      break;
    case "tools/call":
      try {
        const text = callTool(params?.name, params?.arguments ?? {});
        send({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text }] } });
      } catch (e) {
        send({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text: `Feil: ${String(e)}` }], isError: true } });
      }
      break;
    case "resources/list":
      send({ jsonrpc: "2.0", id, result: { resources: [] } });
      break;
    case "prompts/list":
      send({ jsonrpc: "2.0", id, result: { prompts: [] } });
      break;
    case "ping":
      send({ jsonrpc: "2.0", id, result: {} });
      break;
    default:
      if (id !== undefined) send({ jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${method}` } });
  }
}

let buf = "";
process.stdin.setEncoding("utf-8");
process.stdin.on("data", (chunk) => {
  buf += chunk;
  let nl: number;
  while ((nl = buf.indexOf("\n")) >= 0) {
    const line = buf.slice(0, nl).trim();
    buf = buf.slice(nl + 1);
    if (!line) continue;
    try {
      handle(JSON.parse(line));
    } catch {
      /* ignore non-JSON line */
    }
  }
});
// When the client disconnects (stdin EOF), shut down cleanly.
process.stdin.on("end", () => process.exit(0));
console.error(`[docs-rag-mcp] ready — ${index.chunks.length} chunks indexed (model=${index.model})`);
