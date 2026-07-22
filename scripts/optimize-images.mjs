// Generates WebP siblings for the homepage's raster images so the browser
// can request a modern-format, appropriately-sized asset instead of the
// legacy JPG/PNG originals (Lighthouse's modern-image-formats /
// uses-responsive-images opportunities on the prerendered homepage).
// Committed to the repo like the existing -640/-1024 jpg siblings; re-run
// (part of `pnpm build`) whenever a source image changes.

import { promises as fs } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC = join(ROOT, "public");
const CONTENT_BLOG = join(ROOT, "src", "content", "blog");

async function exists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

/** Category tile photos (public/images/cat/<slug>[-640|-1024].jpg) used by
 * MarketplaceSection (homepage) and CategoryVisual (leie/utstyr/etc pages). */
async function optimizeCategoryPhotos() {
  const dir = join(PUBLIC, "images", "cat");
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".jpg"));
  let count = 0;
  for (const file of files) {
    const src = join(dir, file);
    const dest = join(dir, file.replace(/\.jpg$/, ".webp"));
    await sharp(src).webp({ quality: 76 }).toFile(dest);
    count++;
  }
  console.log(`  optimize-images: ${count} category photo webp variants (images/cat/*.webp)`);
}

/** The tiny client-logo thumbnail rendered on the homepage hero + testimonial
 * rail — shipped as a full-resolution PNG for a ~72px box. */
async function optimizeClientLogo() {
  const src = join(PUBLIC, "clients", "ronning.png");
  if (!(await exists(src))) return;
  const dest = join(PUBLIC, "clients", "ronning.webp");
  await sharp(src).resize({ width: 200 }).webp({ quality: 82 }).toFile(dest);
  console.log("  optimize-images: clients/ronning.webp");
}

/** Blog cover photos are authored at full detail-page size (1600w) but the
 * homepage's BlogPreviewSection only ever renders them in a small teaser
 * card — generate a 640w preview variant for that use, keyed off every
 * distinct `cover:` referenced from blog frontmatter (not just the current
 * homepage top-6, so the set stays correct as posts/order change). */
async function optimizeBlogCovers() {
  const files = (await fs.readdir(CONTENT_BLOG)).filter((f) => f.endsWith(".md"));
  const covers = new Set();
  for (const file of files) {
    const raw = await fs.readFile(join(CONTENT_BLOG, file), "utf8");
    const match = raw.match(/^cover:\s*"?([^"\r\n]+?)"?\s*$/m);
    if (match) covers.add(match[1]);
  }
  let count = 0;
  for (const cover of covers) {
    const m = cover.match(/^\/images\/blog\/(.+)\.(webp|jpg|jpeg|png)$/i);
    if (!m) continue; // skip svg placeholders — already tiny vectors
    const src = join(PUBLIC, "images", "blog", `${m[1]}.${m[2]}`);
    if (!(await exists(src))) continue;
    const dest = join(PUBLIC, "images", "blog", `${m[1]}-preview.webp`);
    await sharp(src).resize({ width: 640 }).webp({ quality: 75 }).toFile(dest);
    count++;
  }
  console.log(`  optimize-images: ${count} blog cover preview variants (images/blog/*-preview.webp)`);
}

async function main() {
  console.log("Generating optimized image variants…");
  await optimizeCategoryPhotos();
  await optimizeClientLogo();
  await optimizeBlogCovers();
}

main().catch((err) => {
  // The webp variants this script generates are committed to the repo, so
  // a build only needs to regenerate them when a source image changed —
  // it doesn't need sharp's native bindings to succeed every time. Warn
  // and let the build continue with whatever variants are already
  // committed, instead of hard-failing a deploy/CI env that lacks them.
  console.warn(
    "  optimize-images: skipped — could not run (sharp unavailable or a source image is missing). " +
      "Build will continue using the committed webp variants.",
  );
  console.warn(`  optimize-images: ${err?.message ?? err}`);
});
