import { describe, expect, it } from "vitest";
import { render } from "./entry-server";

/**
 * Guards the SEO claim behind XAL-640: route-splitting ~40 marketing pages
 * and the homepage's below-the-fold sections behind React.lazy/Suspense
 * must NOT change what crawlers see in dist/, because the SSR retry loop
 * in entry-server.tsx (see XAL-310, PR #74) resolves every Suspense
 * boundary into real HTML before prerender writes the file. If that loop
 * ever regressed for these boundaries specifically, these routes would
 * ship near-empty <div id="root"> pages instead of the assertions below.
 */
describe("SSR prerender: route-split pages ship real content, not the loading shell", () => {
  it("renders full content for a page newly moved behind React.lazy (/leie/moterom)", async () => {
    const html = await render("/leie/moterom");
    expect(html).not.toContain("<!--$!-->");
    expect(html).toMatch(/<h1[^>]*>\s*Leie møterom/);
    expect(html).toContain("Hva koster det å leie et møterom?");
  });

  it("renders the homepage's below-the-fold sections (Suspense-wrapped) as real HTML", async () => {
    const html = await render("/");
    expect(html).not.toContain("<!--$!-->");
    // AiAgentsSection..CTASection, inside the first <Suspense fallback={null}>
    expect(html).toContain('id="kontakt"');
    expect(html).toContain("BOOK EN DEMO");
    // Footer, inside the second <Suspense fallback={null}>
    expect(html).toContain('<nav aria-label="Navigasjon">');
  });
});
