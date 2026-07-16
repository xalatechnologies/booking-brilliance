// Post-deploy LIVE verification — proves the site actually serves what we built,
// not just that the homepage returns 200. Fetches the real pages over HTTP (no
// JS) and asserts each blog post is PRE-RENDERED with its own title (text) and
// its own topical cover wired into og:image, and that the cover file resolves as
// a real image. This is what makes the daily blog pipeline trustworthy: a green
// deploy now means "posts are live, readable, and share the right image" — the
// exact failure mode (generic shell / shared og-image) that shipped silently
// before is now a hard deploy failure.
//
// Usage:
//   node scripts/verify-live.mjs                 # verify homepage + N newest posts
//   BASE=https://digilist.no node scripts/verify-live.mjs
//   VERIFY_SAMPLE=all node scripts/verify-live.mjs   # every post (slower)
//   node scripts/verify-live.mjs --self-test     # offline unit-check of the parsers
//
// Exit code: 0 = all critical checks passed · 1 = at least one failed.

import { promises as fs } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, "..", "src", "content", "blog");
const BASE = (process.env.BASE || "https://digilist.no").replace(/\/$/, "");
const GENERIC_TITLE = "Digilist — Én plattform for alt som leies ut";
const GENERIC_OG = "/og-image.png";
const SAMPLE = process.env.VERIFY_SAMPLE || "10";
const MAX_TITLE_LEN = 65;

// ── pure helpers (kept small + side-effect free so --self-test can check them) ──

/** Minimal frontmatter parse — same shape as prerender.mjs's loader. */
export function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fm = {};
  m[1].split("\n").forEach((line) => {
    const kv = line.match(/^(\w+):\s*"?([^"]*?)"?$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^"|"$/g, "");
  });
  return fm;
}

/** The title prerender.mjs writes for a post (mirrors its ~65-char rule). */
export function expectedTitle(postTitle) {
  return postTitle.length > 50 ? postTitle : `${postTitle} — Digilist`;
}

/** Resolve a frontmatter cover into the absolute URL prerender.mjs emits. */
export function coverUrl(cover, base = BASE) {
  if (!cover) return `${base}${GENERIC_OG}`;
  return cover.startsWith("http") ? cover : `${base}${cover}`;
}

/** Google truncates SERP titles past ~65 chars — the 'title.long' SEO check. */
export function titleTooLong(postTitle) {
  return postTitle.length > MAX_TITLE_LEN;
}

export function extractTitle(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].trim() : null;
}

export function extractOgImage(html) {
  const m = html.match(/property="og:image"\s+content="([^"]*)"/i);
  return m ? m[1].trim() : null;
}

/** Decide a single post's verdict from the served HTML + its expected values. */
export function judgePost(html, status, post) {
  const problems = [];
  if (status !== 200) problems.push(`HTTP ${status}`);
  const title = extractTitle(html);
  if (!title) problems.push("no <title>");
  else if (title === GENERIC_TITLE) problems.push("served the generic SPA shell (not pre-rendered)");
  else if (post.title && !title.startsWith(post.title.slice(0, 40))) {
    problems.push(`title mismatch (got "${title.slice(0, 50)}")`);
  }
  const og = extractOgImage(html);
  if (!og) problems.push("no og:image");
  else if (og.endsWith(GENERIC_OG) && post.cover) {
    problems.push("og:image is the generic fallback, not the post cover");
  } else if (post.cover && og !== coverUrl(post.cover)) {
    problems.push(`og:image ${og} != expected cover ${coverUrl(post.cover)}`);
  }
  return { ok: problems.length === 0, problems, title, og };
}

// ── I/O ──────────────────────────────────────────────────────────────────────

async function loadPosts() {
  let files;
  try {
    files = await fs.readdir(CONTENT_DIR);
  } catch {
    return [];
  }
  const posts = [];
  for (const f of files) {
    if (!f.endsWith(".md")) continue;
    const fm = parseFrontmatter(await fs.readFile(join(CONTENT_DIR, f), "utf-8"));
    if (!fm) continue;
    posts.push({
      slug: fm.slug || f.replace(/\.md$/, ""),
      title: fm.title || "",
      cover: fm.cover || "",
      date: fm.date || "",
    });
  }
  // newest first — so a small sample still covers the posts we just published
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

async function fetchText(url) {
  const res = await fetch(url, { redirect: "follow", headers: { "user-agent": "digilist-verify-live" } });
  return { status: res.status, body: await res.text(), ctype: res.headers.get("content-type") || "" };
}

async function fetchHead(url) {
  const res = await fetch(url, { method: "GET", redirect: "follow", headers: { "user-agent": "digilist-verify-live" } });
  return { status: res.status, ctype: res.headers.get("content-type") || "" };
}

async function main() {
  if (process.argv.includes("--self-test")) return selfTest();

  const all = await loadPosts();
  if (all.length === 0) {
    console.error("verify-live: no blog posts found — nothing to verify.");
    process.exit(1);
  }
  const posts = SAMPLE === "all" ? all : all.slice(0, Math.max(1, Number(SAMPLE) || 10));
  console.log(`verify-live: BASE=${BASE} · ${posts.length}/${all.length} post(s) (newest first)\n`);

  const failures = [];

  // 0) every post's frontmatter title must fit the SERP (no network needed) —
  // regression guard for the 'title.long' SEO warning.
  for (const post of all) {
    const ok = !titleTooLong(post.title);
    if (!ok) failures.push(`${post.slug}: title is ${post.title.length} chars (max ${MAX_TITLE_LEN}): "${post.title}"`);
  }
  console.log(`  ${failures.length === 0 ? "✓" : "✗"} title length ≤ ${MAX_TITLE_LEN} chars (${all.length} posts checked)`);

  // 1) homepage + blog index must be live
  for (const [label, path] of [["homepage", "/"], ["blog index", "/blogg"]]) {
    const { status } = await fetchText(`${BASE}${path}`);
    const ok = status === 200;
    console.log(`  ${ok ? "✓" : "✗"} ${label} → HTTP ${status}`);
    if (!ok) failures.push(`${label} HTTP ${status}`);
  }

  // 2) each sampled post: pre-rendered text + topical cover, and cover resolves
  const seenCovers = new Set();
  for (const post of posts) {
    const url = `${BASE}/blogg/${post.slug}`;
    let verdict, coverStatus = "—";
    try {
      const { status, body } = await fetchText(url);
      verdict = judgePost(body, status, post);
      if (verdict.og && !verdict.og.endsWith(GENERIC_OG)) {
        const h = await fetchHead(verdict.og);
        seenCovers.add(verdict.og);
        if (h.status !== 200 || !h.ctype.startsWith("image/")) {
          verdict.ok = false;
          verdict.problems.push(`cover ${h.status}/${h.ctype || "?"} not a live image`);
        }
        coverStatus = `${h.status} ${h.ctype}`;
      }
    } catch (err) {
      verdict = { ok: false, problems: [`fetch failed: ${err?.message ?? err}`] };
    }
    console.log(`  ${verdict.ok ? "✓" : "✗"} /blogg/${post.slug}${verdict.ok ? "" : "  — " + verdict.problems.join("; ")}`);
    if (!verdict.ok) failures.push(`/blogg/${post.slug}: ${verdict.problems.join("; ")}`);
  }

  // 3) image diversity — a shared cover across many posts is the "same image" smell
  if (posts.length >= 3 && seenCovers.size === 1) {
    console.log(`  ⚠ all ${posts.length} sampled posts share ONE cover image — covers are not topic-diverse`);
  }

  console.log("");
  if (failures.length > 0) {
    console.error(`verify-live: ${failures.length} FAILURE(S):`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log(`verify-live: all checks passed (${posts.length} posts, ${seenCovers.size} distinct cover(s)).`);
}

// Offline sanity check of the pure parsers — runnable without a network.
function selfTest() {
  const assert = (cond, msg) => { if (!cond) { console.error("self-test FAIL:", msg); process.exit(1); } };
  const fm = parseFrontmatter('---\nslug: "abc"\ntitle: "Hei der"\ncover: "/images/x.webp"\n---\nbody');
  assert(fm.slug === "abc" && fm.title === "Hei der" && fm.cover === "/images/x.webp", "frontmatter");
  assert(parseFrontmatter("no frontmatter") === null, "no-frontmatter → null");
  assert(expectedTitle("Kort") === "Kort — Digilist", "short title suffix");
  assert(expectedTitle("x".repeat(60)) === "x".repeat(60), "long title no suffix");
  assert(coverUrl("/img.webp", "https://d.no") === "https://d.no/img.webp", "rel cover");
  assert(coverUrl("https://cdn/x.png", "https://d.no") === "https://cdn/x.png", "abs cover");
  assert(coverUrl("", "https://d.no") === "https://d.no/og-image.png", "no cover fallback");
  const good = judgePost(
    '<title>Hei der — Digilist</title><meta property="og:image" content="https://d.no/images/x.webp">',
    200, { title: "Hei der", cover: "/images/x.webp" });
  // coverUrl uses the module BASE, so just assert the pre-render/text checks pass
  assert(good.title === "Hei der — Digilist", "judge title parse");
  const shell = judgePost(`<title>${GENERIC_TITLE}</title>`, 200, { title: "Hei der", cover: "/x.webp" });
  assert(!shell.ok && shell.problems.some((p) => /SPA shell/.test(p)), "detect SPA shell");
  const notfound = judgePost("<title>x</title>", 404, { title: "x", cover: "" });
  assert(!notfound.ok && notfound.problems.some((p) => /HTTP 404/.test(p)), "detect non-200");
  assert(!titleTooLong("x".repeat(65)), "65 chars is within the limit");
  assert(titleTooLong("x".repeat(66)), "66 chars is over the limit");
  console.log("verify-live self-test: all parser checks passed.");
}

main().catch((e) => { console.error("verify-live crashed:", e); process.exit(1); });
