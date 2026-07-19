#!/usr/bin/env node
// Regenerate the small cover-image variants BlogPreviewSection uses on the
// homepage (public/images/blog/preview/*.webp). Run this whenever a new
// blog post's cover image is added under public/images/blog/ — the
// homepage renders these at ~320-600px CSS width, so the full-size hero
// image (used by the blog detail page) is oversized for that context.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const BLOG_DIR = path.resolve(import.meta.dirname, "../public/images/blog");
const OUT_DIR = path.join(BLOG_DIR, "preview");

fs.mkdirSync(OUT_DIR, { recursive: true });

const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".webp"));

for (const file of files) {
  const inPath = path.join(BLOG_DIR, file);
  const outPath = path.join(OUT_DIR, file);
  await sharp(inPath)
    .resize(640, 640, { fit: "cover" })
    .webp({ quality: 75 })
    .toFile(outPath);
  console.log(`  ✓ preview/${file}`);
}

console.log(`Generated ${files.length} blog preview image variants.`);
