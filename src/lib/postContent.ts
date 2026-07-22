// Full article body — only import this from the article page (BlogPost.tsx).
// Deliberately kept out of src/lib/posts.ts (metadata, imported eagerly from
// the homepage + sitewide search) so the ~560KB of combined markdown text
// stays out of the main bundle and only loads as part of BlogPost's own
// lazy-loaded route chunk.
import { parseFrontmatter } from "./blogFrontmatter";
import { getAllPosts, type Post } from "./posts";

export interface PostWithContent extends Post {
  content: string;
}

const rawModules = import.meta.glob("/src/content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const contentBySlug = new Map<string, string>();
for (const [path, raw] of Object.entries(rawModules)) {
  const { data, content } = parseFrontmatter(raw);
  const slug =
    (data.slug as string) ||
    path
      .split("/")
      .pop()!
      .replace(/\.md$/, "");
  contentBySlug.set(slug, content);
}

export function getPostBySlug(slug: string): PostWithContent | undefined {
  const meta = getAllPosts().find((p) => p.slug === slug);
  const content = contentBySlug.get(slug);
  if (!meta || content === undefined) return undefined;
  return { ...meta, content };
}
