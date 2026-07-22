/// <reference types="vite/client" />

declare module "virtual:blog-meta" {
  import type { BlogFrontmatter } from "@/lib/blogFrontmatter";
  const posts: BlogFrontmatter[];
  export default posts;
}
