// Shared by src/lib/posts.ts (browser, metadata only) and the
// `virtual:blog-meta` Vite plugin (vite.config.ts, Node build-time). Kept
// dependency-free (no glob, no fs) so it's safe to import from both.

export interface BlogFrontmatter {
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

export function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  const data: Record<string, unknown> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    let value: string = kv[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (value.startsWith("[") && value.endsWith("]")) {
      const inner = value.slice(1, -1).trim();
      data[key] = inner
        ? inner
            .split(",")
            .map((s) => s.trim().replace(/^["']|["']$/g, ""))
            .filter(Boolean)
        : [];
      continue;
    }
    if (/^-?\d+$/.test(value)) {
      data[key] = parseInt(value, 10);
      continue;
    }
    if (/^-?\d+\.\d+$/.test(value)) {
      data[key] = parseFloat(value);
      continue;
    }
    data[key] = value;
  }
  return { data, content: match[2] };
}

/** Derives a post's frontmatter fields from a raw .md file's contents. */
export function extractFrontmatter(path: string, raw: string): BlogFrontmatter {
  const { data } = parseFrontmatter(raw);
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
  };
}
