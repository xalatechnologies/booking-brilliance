// Pre-push redirect-collision guard — the INVERSE of verify-live.mjs, run BEFORE
// the commit instead of after the deploy. It catches the exact failure class from
// the 2026-07-23 incident: the blog agent generates a post whose slug collides
// with a standing server-side 301 consolidation redirect (nginx, VPS-only — not
// in this repo), so /blogg/<slug> (no trailing slash) 301s to a DIFFERENT,
// canonical article. verify-live.mjs fetches with redirect:"follow", lands on the
// canonical, sees a title/og mismatch, and reddens EVERY deploy — after the posts
// are already committed and pushed to main.
//
// This guard probes each newly-generated slug the SAME way verify-live does
// (GET /blogg/<slug>, no trailing slash) but with redirect:"manual", so it can
// see the 301 itself. Any slug that redirects OFF-slug is "claimed" by an earlier
// consolidation — the topic was deliberately merged away — so the post must not
// be published. The guard QUARANTINES it (deletes the just-synced .md) so the
// runner's `git add` never stages it and the good posts still ship. This is what
// makes a claimed slug a no-op at generation time instead of a red deploy.
//
// Usage:
//   node scripts/guard-blog-redirects.mjs            # probe CHANGED posts, quarantine claimed, exit 0
//   node scripts/guard-blog-redirects.mjs --all      # probe every post (slower)
//   node scripts/guard-blog-redirects.mjs --check     # dry-run: don't delete; exit 1 if any claimed (CI)
//   node scripts/guard-blog-redirects.mjs --dry-run   # alias of --check
//   BASE=https://digilist.no node scripts/guard-blog-redirects.mjs
//   node scripts/guard-blog-redirects.mjs --self-test # offline unit-check of the parsers
//
// Exit code: 0 = nothing claimed, or claimed posts were quarantined (pipeline may
// proceed). 1 = --check/--dry-run found a claimed slug, or a usage error.

import { promises as fs } from "node:fs";
import { execFileSync } from "node:child_process";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, "..", "src", "content", "blog");
const BASE = (process.env.BASE || "https://digilist.no").replace(/\/$/, "");

// ── pure helpers (side-effect free so --self-test can check them) ─────────────

/** Minimal frontmatter parse — same shape as verify-live.mjs / prerender.mjs. */
export function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = {};
  m[1].split(/\r?\n/).forEach((line) => {
    const kv = line.match(/^(\w+):\s*"?([^"]*?)"?$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^"|"$/g, "");
  });
  return fm;
}

/** The URL slug for a post file: frontmatter `slug:` wins, else the filename.
 *  Mirrors src/lib/posts.ts, scripts/prerender.mjs and scripts/verify-live.mjs —
 *  the three places that already resolve a post's slug the same way. */
export function resolveSlug(filePath, raw) {
  const fm = parseFrontmatter(raw ?? "");
  if (fm?.slug) return fm.slug.trim();
  return basename(filePath).replace(/\.md$/, "");
}

/** Strip surrounding slashes so "abc/" and "abc" compare equal. */
export function normalizeSlug(s) {
  return String(s || "").replace(/^\/+|\/+$/g, "");
}

/** Resolve a redirect Location (absolute or relative) to the bare blog slug it
 *  points at, or "" if it does not target a /blogg/<slug> page (e.g. it redirects
 *  to the homepage — which still means the post was consolidated away). */
export function slugFromLocation(location, base = BASE) {
  if (!location) return "";
  let pathname;
  try {
    pathname = new URL(location, `${base}/`).pathname;
  } catch {
    return "";
  }
  const m = pathname.match(/^\/blogg\/([^/]+)\/?$/);
  return m ? m[1] : "";
}

/** Classify a candidate slug from the served status + redirect Location.
 *   "free"    — 2xx/4xx/5xx: not redirected, safe to publish.
 *   "self"    — 3xx to the SAME slug (benign trailing-slash normalization).
 *   "claimed" — 3xx to a DIFFERENT slug (or off /blogg entirely): a standing
 *               consolidation redirect owns this slug — must NOT publish. */
export function classifyRedirect(slug, status, location, base = BASE) {
  if (status >= 300 && status < 400) {
    const target = slugFromLocation(location, base);
    return normalizeSlug(target) === normalizeSlug(slug) ? "self" : "claimed";
  }
  return "free";
}

// ── I/O ──────────────────────────────────────────────────────────────────────

/** GET /blogg/<slug> WITHOUT following redirects, so a 301 is visible. */
async function probe(slug, base = BASE) {
  const res = await fetch(`${base}/blogg/${slug}`, {
    method: "GET",
    redirect: "manual",
    headers: { "user-agent": "digilist-guard-redirects" },
  });
  return { status: res.status, location: res.headers.get("location") };
}

/** Probe with a couple of retries — a transient network blip must not be read as
 *  "claimed" and delete a good post. Returns null status if unreachable. */
async function probeWithRetry(slug, base = BASE, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await probe(slug, base);
    } catch (err) {
      lastErr = err;
    }
  }
  return { status: null, location: null, error: lastErr?.message ?? String(lastErr) };
}

/** The blog .md files changed in this run (added/modified/untracked), from git.
 *  Renames report the new path. Deletions are ignored. */
function changedBlogFiles() {
  const out = execFileSync(
    "git",
    ["status", "--porcelain", "--untracked-files=all", "--", "src/content/blog"],
    { encoding: "utf-8" },
  );
  const files = [];
  for (const line of out.split("\n")) {
    if (!line.trim()) continue;
    const code = line.slice(0, 2);
    if (code.includes("D")) continue; // already deleted — nothing to guard
    let p = line.slice(3).trim();
    if (p.includes(" -> ")) p = p.split(" -> ")[1].trim(); // rename
    if (p.endsWith(".md")) files.push(p);
  }
  return files;
}

async function allBlogFiles() {
  const names = await fs.readdir(CONTENT_DIR);
  return names.filter((f) => f.endsWith(".md")).map((f) => join("src/content/blog", f));
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("--self-test")) return selfTest();
  const dryRun = argv.includes("--check") || argv.includes("--dry-run");
  const all = argv.includes("--all");

  let files;
  if (all) {
    files = await allBlogFiles();
  } else {
    try {
      files = changedBlogFiles();
    } catch (err) {
      console.warn(`guard-redirects: git changed-set failed (${err?.message ?? err}) — checking ALL posts.`);
      files = await allBlogFiles();
    }
  }

  console.log(`guard-redirects: BASE=${BASE} · ${files.length} post(s) to check${dryRun ? " (dry-run)" : ""}`);
  if (files.length === 0) {
    console.log("guard-redirects: no posts to check — nothing to do.");
    return;
  }

  const claimed = [];
  const indeterminate = [];
  for (const file of files) {
    const abs = join(__dirname, "..", file);
    let raw;
    try {
      raw = await fs.readFile(abs, "utf-8");
    } catch {
      continue; // vanished between git-status and now
    }
    const slug = resolveSlug(file, raw);
    const { status, location, error } = await probeWithRetry(slug);
    if (status == null) {
      indeterminate.push({ file, slug, error });
      console.warn(`  ? /blogg/${slug} — unreachable (${error}); left in place`);
      continue;
    }
    const verdict = classifyRedirect(slug, status, location);
    if (verdict === "claimed") {
      const target = slugFromLocation(location) || location || "(off /blogg)";
      claimed.push({ file, slug, target });
      if (!dryRun) {
        await fs.rm(abs, { force: true });
        console.error(`  ✗ /blogg/${slug} → 301 → ${target}  — QUARANTINED (removed ${file})`);
      } else {
        console.error(`  ✗ /blogg/${slug} → 301 → ${target}  — CLAIMED (would remove ${file})`);
      }
    } else {
      console.log(`  ✓ /blogg/${slug} → HTTP ${status}${verdict === "self" ? " (self)" : ""}`);
    }
  }

  console.log("");
  if (claimed.length === 0) {
    console.log(`guard-redirects: all ${files.length} post(s) clear${indeterminate.length ? ` (${indeterminate.length} unreachable, left in place)` : ""}.`);
    return;
  }
  const verb = dryRun ? "CLAIMED" : "QUARANTINED";
  console.error(`guard-redirects: ${verb} ${claimed.length} of ${files.length} — slug collides with a standing 301:`);
  for (const c of claimed) console.error(`  - ${c.slug} → ${c.target}`);
  if (dryRun) process.exit(1);
  // Not a dry run: the colliding files are removed, so the pipeline proceeds with
  // the surviving posts. Exit 0 — quarantine IS the remediation, not a failure.
  console.log(`guard-redirects: removed ${claimed.length} colliding post(s); ${files.length - claimed.length} remain.`);
}

// Offline sanity check of the pure parsers — runnable without a network.
function selfTest() {
  const assert = (cond, msg) => { if (!cond) { console.error("self-test FAIL:", msg); process.exit(1); } };
  // slugFromLocation: absolute, relative, trailing slash, off-blogg
  assert(slugFromLocation("https://digilist.no/blogg/abc/", BASE) === "abc", "abs+slash");
  assert(slugFromLocation("https://digilist.no/blogg/abc", BASE) === "abc", "abs");
  assert(slugFromLocation("/blogg/abc", BASE) === "abc", "relative");
  assert(slugFromLocation("https://digilist.no/", BASE) === "", "off-blogg → empty");
  assert(slugFromLocation("", BASE) === "", "empty location → empty");
  assert(slugFromLocation("::not a url::", BASE) === "", "garbage → empty");
  // classifyRedirect: the four real incident cases + self + non-3xx
  assert(classifyRedirect("leie-sal-pris-kommune", 301, "https://digilist.no/blogg/leie-sal-billigst-kommune", BASE) === "claimed", "off-slug 301 → claimed");
  assert(classifyRedirect("bryllupslokale-kommune-pris", 301, "https://digilist.no/blogg/leie-bryllupslokale", BASE) === "claimed", "off-slug 301 (2) → claimed");
  assert(classifyRedirect("abc", 301, "https://digilist.no/blogg/abc/", BASE) === "self", "trailing-slash 301 → self");
  assert(classifyRedirect("abc", 301, "/blogg/abc/", BASE) === "self", "relative same-slug → self");
  assert(classifyRedirect("gone", 301, "https://digilist.no/", BASE) === "claimed", "redirect to homepage → claimed");
  assert(classifyRedirect("gone", 302, null, BASE) === "claimed", "3xx no Location → claimed");
  assert(classifyRedirect("leie-sal-billigst-kommune", 200, null, BASE) === "free", "200 → free");
  assert(classifyRedirect("missing", 404, null, BASE) === "free", "404 → free (not a redirect)");
  // resolveSlug: frontmatter slug wins, else filename
  assert(resolveSlug("src/content/blog/idrettshall.md", '---\nslug: idrettshall-ledige-tider-booking\ntitle: "x"\n---\nbody') === "idrettshall-ledige-tider-booking", "fm slug wins");
  assert(resolveSlug("src/content/blog/leie-sal-pris-kommune.md", '---\ntitle: "x"\n---\nbody') === "leie-sal-pris-kommune", "filename fallback");
  assert(resolveSlug("src/content/blog/x.md", "no frontmatter") === "x", "no frontmatter → filename");
  assert(normalizeSlug("/abc/") === "abc" && normalizeSlug("abc") === "abc", "normalizeSlug");
  console.log("guard-redirects self-test: all parser checks passed.");
}

// Only run main() when invoked directly (not when imported by a test).
const invokedDirectly = process.argv[1] && process.argv[1].endsWith("guard-blog-redirects.mjs");
if (invokedDirectly) {
  main().catch((e) => { console.error("guard-redirects crashed:", e); process.exit(1); });
}
