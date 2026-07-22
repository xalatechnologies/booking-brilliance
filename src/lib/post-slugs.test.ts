import { describe, expect, it } from "vitest";
import { getAllPosts } from "@/lib/posts";

/**
 * Every post prerenders to /blogg/<slug>/index.html. If two .md files resolve to
 * the same slug (e.g. one file's frontmatter `slug:` matches another file's
 * name), they collide: one silently overwrites the other at build, and the
 * shadowed post serves the wrong title/cover with no error. That shipped once
 * (idrettshall.md claimed idrettshall-ledige-tider-booking's slug) and only
 * surfaced when verify-live happened to sample it. Guard the invariant directly.
 */
describe("blog post slugs", () => {
  it("are unique — no two posts prerender to the same /blogg/<slug>", () => {
    const bySlug = new Map<string, string[]>();
    for (const p of getAllPosts()) {
      bySlug.set(p.slug, [...(bySlug.get(p.slug) ?? []), p.title || "(untitled)"]);
    }
    const dupes = [...bySlug.entries()].filter(([, titles]) => titles.length > 1);
    expect(
      dupes,
      `duplicate slugs collide at build (one silently overwrites the other): ${JSON.stringify(dupes)}`,
    ).toEqual([]);
  });
});
