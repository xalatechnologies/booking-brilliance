import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { TILES } from "@/components/MarketplaceSection";
import { IMAGES, bundledWebpSrcSet } from "@/components/CategoryVisual";
import { getAllPosts, previewCover } from "@/lib/posts";

/**
 * A <picture> <source type="image/webp"> that 404s does not fall back to
 * the <img> — it just renders broken, with no recovery. These sources are
 * only safe because scripts/optimize-images.mjs generates and commits the
 * webp siblings ahead of time; that script can silently skip a file (missing
 * source image, sharp unavailable) or simply not have run yet for a newly
 * added tile/post. Guard the invariant directly: every webp path these
 * components would emit as a <source> must already exist on disk.
 */
const PUBLIC_DIR = join(process.cwd(), "public");

function srcSetPaths(srcSet: string | undefined): string[] {
  if (!srcSet) return [];
  return srcSet.split(",").map((entry) => entry.trim().split(/\s+/)[0]);
}

describe("committed webp siblings for every <picture> <source>", () => {
  it("MarketplaceSection homepage tiles", () => {
    for (const tile of TILES) {
      const paths = srcSetPaths(bundledWebpSrcSet(tile.image));
      expect(paths.length).toBeGreaterThan(0);
      for (const path of paths) {
        expect(existsSync(join(PUBLIC_DIR, path))).toBe(true);
      }
    }
  });

  it("CategoryVisual category photos", () => {
    for (const image of Object.values(IMAGES)) {
      const paths = srcSetPaths(bundledWebpSrcSet(image));
      expect(paths.length).toBeGreaterThan(0);
      for (const path of paths) {
        expect(existsSync(join(PUBLIC_DIR, path))).toBe(true);
      }
    }
  });

  it("BlogPreviewSection cover previews", () => {
    for (const post of getAllPosts()) {
      const preview = previewCover(post.cover);
      const hasWebpPreview = preview && preview !== post.cover;
      if (!hasWebpPreview) continue;
      expect(existsSync(join(PUBLIC_DIR, preview))).toBe(true);
    }
  });
});
