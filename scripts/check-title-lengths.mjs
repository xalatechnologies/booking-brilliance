// Reports blog post title lengths against the ~65-char SEO recommendation.
// Mirrors the rendering rule in scripts/prerender.mjs / scripts/verify-live.mjs:
// a title is rendered verbatim if >50 chars, otherwise suffixed with " — Digilist".
//
// Usage: node scripts/check-title-lengths.mjs
// Exit code: 0 if every post is within the limit, 1 if any exceed it (informational —
// not wired into lint/build, since pre-existing violations are tracked separately).

import { promises as fs } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, "..", "src", "content", "blog");
const LIMIT = 65;

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fm = {};
  m[1].split("\n").forEach((line) => {
    const kv = line.match(/^(\w+):\s*"?([^"]*?)"?$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^"|"$/g, "");
  });
  return fm;
}

function renderedTitle(title) {
  return title.length > 50 ? title : `${title} — Digilist`;
}

const files = (await fs.readdir(CONTENT_DIR)).filter((f) => f.endsWith(".md"));
const rows = [];
for (const file of files) {
  const raw = await fs.readFile(join(CONTENT_DIR, file), "utf8");
  const fm = parseFrontmatter(raw);
  if (!fm?.title) continue;
  const rendered = renderedTitle(fm.title);
  rows.push({ file, length: rendered.length, title: rendered });
}

rows.sort((a, b) => b.length - a.length);
const overLimit = rows.filter((r) => r.length > LIMIT);

for (const r of rows) {
  const flag = r.length > LIMIT ? "OVER" : "ok  ";
  console.log(`${flag} ${r.length} ${r.file}`);
}

console.log(`\n${overLimit.length}/${rows.length} post(s) exceed ${LIMIT} chars.`);
process.exit(overLimit.length > 0 ? 1 : 0);
