// Guards against SEO's "content.thin" rule. The rule fires on what actually
// ships in dist/blogg/<slug>/index.html, not on the markdown source — a post
// can have a 900-word .md file and still ship a 3-word page if SSR baked in
// only the Suspense fallback (see the XAL-313 warm-up-race fix in
// scripts/prerender.mjs). So the real check here is against the prerendered
// HTML; the markdown check is kept underneath as a cheap floor that catches
// an accidentally-empty or too-short source before it ever reaches SSR.

import { promises as fs } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, "..", "src", "content", "blog");
const DIST_BLOG_DIR = join(__dirname, "..", "dist", "blogg");
const MIN_WORDS = 200;

function bodyOf(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  return match ? match[2] : raw;
}

function frontmatterSlug(raw, fallback) {
  const m = raw.match(/^---[\s\S]*?\nslug:\s*"?([^"\n]+?)"?\s*\n[\s\S]*?---/);
  return m ? m[1] : fallback;
}

function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function renderedArticleText(html) {
  const m = html.match(/<article[^>]*>([\s\S]*?)<\/article>/);
  if (!m) return "";
  return m[1]
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function main() {
  const files = (await fs.readdir(CONTENT_DIR)).filter((f) => f.endsWith(".md"));
  const thinSource = [];
  const posts = [];
  for (const file of files) {
    const raw = await fs.readFile(join(CONTENT_DIR, file), "utf-8");
    const words = wordCount(bodyOf(raw));
    if (words < MIN_WORDS) thinSource.push({ file, words });
    posts.push({ file, slug: frontmatterSlug(raw, file.replace(/\.md$/, "")) });
  }

  if (thinSource.length > 0) {
    console.error(
      `\n✗ ${thinSource.length} blog post(s) have fewer than ${MIN_WORDS} words in the markdown source (content.thin risk):`,
    );
    for (const { file, words } of thinSource) {
      console.error(`  - ${file}: ${words} words`);
    }
    console.error("");
    process.exit(1);
  }
  console.log(`✓ All ${files.length} blog posts have at least ${MIN_WORDS} words in the markdown source.`);

  let distExists = true;
  try {
    await fs.access(DIST_BLOG_DIR);
  } catch {
    distExists = false;
  }
  if (!distExists) {
    console.log(
      "  (skipping prerendered-HTML check — dist/blogg not built; this runs automatically as part of `pnpm build`)",
    );
    return;
  }

  const thinRendered = [];
  for (const { file, slug } of posts) {
    const htmlPath = join(DIST_BLOG_DIR, slug, "index.html");
    let html;
    try {
      html = await fs.readFile(htmlPath, "utf-8");
    } catch {
      thinRendered.push({ file, slug, words: 0, reason: "no prerendered index.html found" });
      continue;
    }
    const text = renderedArticleText(html);
    const words = wordCount(text);
    if (text.includes("Laster…") || words < MIN_WORDS) {
      thinRendered.push({
        file,
        slug,
        words,
        reason: text.includes("Laster…") ? "Suspense fallback baked in" : undefined,
      });
    }
  }

  if (thinRendered.length > 0) {
    console.error(
      `\n✗ ${thinRendered.length} blog post(s) render fewer than ${MIN_WORDS} words of body text in dist/blogg/*/index.html (content.thin):`,
    );
    for (const { file, slug, words, reason } of thinRendered) {
      console.error(`  - ${file} (/blogg/${slug}): ${words} words${reason ? ` — ${reason}` : ""}`);
    }
    console.error("");
    process.exit(1);
  }

  console.log(`✓ All ${posts.length} blog posts render at least ${MIN_WORDS} words in dist/blogg/*/index.html.`);
}

main().catch((err) => {
  console.error("check-blog-word-count failed:", err?.message ?? err);
  process.exit(1);
});
