import { parseFrontmatter } from "./frontmatter";

export interface PostFrontmatter {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  role?: string;
  readingMinutes?: number;
  tag?: string;
  cover?: string;
  keywords?: string[];
}

export interface Post extends PostFrontmatter {
  content: string;
}

const modules = import.meta.glob("/src/content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const posts: Post[] = Object.entries(modules)
  .map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw);
    const slug =
      (data.slug as string) ||
      path
        .split("/")
        .pop()!
        .replace(/\.md$/, "");
    return {
      slug,
      title: (data.title as string) || "",
      description: (data.description as string) || "",
      date: data.date ? new Date(data.date as string).toISOString().slice(0, 10) : "",
      author: (data.author as string) || "",
      role: data.role as string | undefined,
      readingMinutes: data.readingMinutes as number | undefined,
      tag: data.tag as string | undefined,
      cover: data.cover as string | undefined,
      keywords: data.keywords as string[] | undefined,
      content,
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getAllPosts(): Post[] {
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export { formatPostDate } from "./frontmatter";
