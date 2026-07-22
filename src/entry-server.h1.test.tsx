import { describe, expect, it } from "vitest";
import { render } from "./entry-server";
import { getPostBySlug } from "@/lib/postContent";

/**
 * Guards the actual template-level invariant behind XAL-310: every
 * prerendered page must expose exactly one <h1>. The SSR retry loop already
 * fails the build on an unresolved Suspense boundary (missing content
 * entirely), but that wouldn't catch a template regression that renders
 * zero or two <h1>s once content *does* resolve — this test covers that gap.
 */
function assertSingleH1(html: string, route: string) {
  const h1OpenTags = html.match(/<h1[ >]/g) ?? [];
  expect(h1OpenTags.length, `expected exactly one <h1> for ${route}`).toBe(1);
}

describe("SSR <h1> template invariant", () => {
  it("renders the post title as the sole <h1> on a blog post", async () => {
    const slug = "automatisert-avbooking-og-refusjon-kommunal-saksbehandling";
    const post = getPostBySlug(slug);
    expect(post, `fixture post ${slug} should exist`).toBeDefined();

    const route = `/blogg/${slug}`;
    const html = await render(route);
    assertSingleH1(html, route);
    expect(html).toContain(`>${post!.title}<`);
  });

  it("renders exactly one <h1> on a use-case landing page", async () => {
    const route = "/bruksomrader/selskapslokaler";
    const html = await render(route);
    assertSingleH1(html, route);
  });

  it("renders exactly one <h1> on a static page", async () => {
    const route = "/personvern";
    const html = await render(route);
    assertSingleH1(html, route);
  });

  it("renders exactly one <h1> on the homepage", async () => {
    const html = await render("/");
    assertSingleH1(html, "/");
  });
});
