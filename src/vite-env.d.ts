/// <reference types="vite/client" />

declare module "virtual:blog-manifest" {
  import type { PostFrontmatter } from "@/lib/posts";
  const manifest: PostFrontmatter[];
  export default manifest;
}
