import { promises as fs } from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { extractFrontmatter } from "../src/lib/blogFrontmatter";

export const BLOG_META_MODULE_ID = "virtual:blog-meta";
const RESOLVED_BLOG_META_MODULE_ID = "\0" + BLOG_META_MODULE_ID;

/**
 * Exposes every blog post's frontmatter (title, description, date, etc.) as
 * a single small module, computed here in Node at build/dev/test time — not
 * by eagerly importing the raw .md files in browser code, which would inline
 * each file's full article text (~560KB combined) into whichever chunk
 * imports it. src/lib/posts.ts (metadata only) imports this; the full body
 * is read separately by src/lib/postContent.ts, which only BlogPost.tsx
 * imports, so that text stays in BlogPost's own lazy-loaded chunk.
 *
 * Shared by vite.config.ts (dev server + build) and vitest.config.ts (unit
 * tests) so both resolve `virtual:blog-meta` the same way.
 */
export function blogMetaPlugin(): Plugin {
  return {
    name: "digilist-blog-meta",
    resolveId(id) {
      if (id === BLOG_META_MODULE_ID) return RESOLVED_BLOG_META_MODULE_ID;
    },
    async load(id) {
      if (id !== RESOLVED_BLOG_META_MODULE_ID) return;
      const dir = path.resolve(__dirname, "..", "src/content/blog");
      const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".md"));
      const metas = await Promise.all(
        files.map(async (file) => {
          const raw = await fs.readFile(path.join(dir, file), "utf-8");
          return extractFrontmatter(`/src/content/blog/${file}`, raw);
        }),
      );
      return `export default ${JSON.stringify(metas)};`;
    },
  };
}
