// Pure frontmatter parsing — no Vite-specific APIs, so it's importable both
// from browser code (src/lib/posts.ts) and from vite.config.ts's blog
// manifest plugin, which runs in Node before Vite's module graph exists.
export function parseFrontmatter(raw: string): {
  data: Record<string, unknown>;
  content: string;
} {
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

export function formatPostDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
