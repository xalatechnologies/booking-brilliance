import { describe, expect, it } from "vitest";
import { render } from "./entry-server";
import { getAllPosts } from "@/lib/posts";

/**
 * Regression coverage for a11y.landmark.main: the SSR retry loop in
 * entry-server.tsx used to treat a still-suspended lazy route (identical
 * "Laster…" fallback HTML on two consecutive passes) as "settled", so the
 * first several lazy routes rendered in a process shipped static HTML with
 * no <main> at all. Asserting on the *first* render() call in this file —
 * for a lazily-loaded route (BlogPost) — reproduces that failure mode.
 */
function assertSingleMainLandmark(html: string, route: string) {
  const mainOpenTags = html.match(/<main[ >]/g) ?? [];
  expect(mainOpenTags.length, `expected exactly one <main> for ${route}`).toBe(1);

  const mainStart = html.indexOf("<main");
  const mainEnd = html.indexOf("</main>");
  const navStart = html.indexOf("<nav");
  const lastFooterStart = html.lastIndexOf("<footer");

  expect(navStart, `expected a <nav> for ${route}`).toBeGreaterThanOrEqual(0);
  expect(navStart, `expected header nav before <main> for ${route}`).toBeLessThan(mainStart);
  expect(lastFooterStart, `expected a <footer> for ${route}`).toBeGreaterThanOrEqual(0);
  expect(lastFooterStart, `expected footer after </main> for ${route}`).toBeGreaterThan(mainEnd);
}

describe("SSR <main> landmark", () => {
  it("wraps a lazily-loaded blog post in exactly one <main>, even as the first route rendered", async () => {
    const [firstPost] = getAllPosts();
    const route = `/blogg/${firstPost.slug}`;
    const html = await render(route);
    assertSingleMainLandmark(html, route);
  });

  it("wraps a Convex-scoped route (/transparens) in exactly one <main>", async () => {
    const html = await render("/transparens");
    assertSingleMainLandmark(html, "/transparens");
  });

  it("wraps an eagerly-bundled marketing page (/) in exactly one <main>", async () => {
    const html = await render("/");
    assertSingleMainLandmark(html, "/");
  });
});
