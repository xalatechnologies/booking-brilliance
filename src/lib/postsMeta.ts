import manifest from "virtual:blog-manifest";
import type { PostFrontmatter } from "./posts";

// Frontmatter-only post list, generated at build/dev time by the
// blog-manifest Vite plugin. Use this instead of `getAllPosts()` from
// "./posts" anywhere that doesn't need the markdown body — it keeps the
// ~800KB of raw post content out of that caller's bundle.
export function getAllPostsMeta(): PostFrontmatter[] {
  return manifest;
}

export { formatPostDate } from "./frontmatter";
