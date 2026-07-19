import fs from "fs";
import path from "path";
import type { Plugin } from "vite";
import { parseFrontmatter } from "../src/lib/frontmatter";

const BLOG_MANIFEST_ID = "virtual:blog-manifest";
const RESOLVED_BLOG_MANIFEST_ID = "\0" + BLOG_MANIFEST_ID;

// Homepage's BlogPreviewSection (and the header search index) only need post
// frontmatter (title, cover, date, ...) — not the full markdown body.
// `src/lib/posts.ts` eagerly inlines all 82 posts' raw markdown (~800KB) via
// import.meta.glob for the blog list/detail pages, which is correct there
// but would drag that whole payload into the homepage's entry chunk if
// eagerly-rendered components imported it directly. This plugin parses just
// the frontmatter at build/dev/test time into a small virtual module instead.
export function blogManifestPlugin(): Plugin {
  const blogDir = path.resolve(__dirname, "../src/content/blog");
  return {
    name: "blog-manifest",
    resolveId(id) {
      if (id === BLOG_MANIFEST_ID) return RESOLVED_BLOG_MANIFEST_ID;
    },
    load(id) {
      if (id !== RESOLVED_BLOG_MANIFEST_ID) return;
      const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".md"));
      const posts = files
        .map((file) => {
          const raw = fs.readFileSync(path.join(blogDir, file), "utf-8");
          const { data } = parseFrontmatter(raw);
          const slug = (data.slug as string) || file.replace(/\.md$/, "");
          return {
            slug,
            title: (data.title as string) || "",
            description: (data.description as string) || "",
            date: data.date
              ? new Date(data.date as string).toISOString().slice(0, 10)
              : "",
            author: (data.author as string) || "",
            role: data.role as string | undefined,
            readingMinutes: data.readingMinutes as number | undefined,
            tag: data.tag as string | undefined,
            cover: data.cover as string | undefined,
            keywords: data.keywords as string[] | undefined,
          };
        })
        .sort((a, b) => (a.date < b.date ? 1 : -1));
      return `export default ${JSON.stringify(posts)};`;
    },
  };
}
