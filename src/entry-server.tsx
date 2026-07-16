/**
 * SSR entry. Imported by scripts/prerender.mjs at build time. Renders the
 * AppShell with a StaticRouter so each route produces a string of HTML that
 * we can inject into the SPA shell. The client bundle still hydrates on
 * top of that HTML — this is just to give crawlers + AI scrapers the full
 * content without executing JS.
 *
 * renderToString is synchronous and renders React.lazy Suspense fallbacks
 * (our "Laster…" shell) instead of the real component — so lazily-imported
 * route pages like BlogPost would prerender with NO <h1>/<main>/content,
 * invisible to crawlers and a11y auditors.
 *
 * The chunks these lazy() components import are only loaded into Node's
 * module cache on first use. That first dynamic import() is a real disk
 * read + module evaluation, and empirically takes on the order of
 * hundreds of milliseconds the very first time the process does it — far
 * longer than a handful of retried renderToString() passes can wait for,
 * and a retry loop that just checks "did the output change since last
 * pass" can't tell a still-pending import from an already-stable
 * fallback (both render identically until the import resolves). That
 * mismatch was silently prerendering the first several blog posts in
 * every build with an empty "Laster…" shell instead of their article
 * body — including /blogg/bookingkalender-for-innbygger-og-saksbehandler.
 *
 * Fix: deterministically pre-load every lazily-imported page module that
 * a prerendered route can render, once, before render() is ever called.
 * By the time AppShell's React.lazy() issues the *same* import()
 * specifier, Node's ESM loader returns the already-resolved module from
 * cache, so the very first renderToString() pass sees real content.
 */
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppShell } from "./App";

const warmup = Promise.all([
  import("./pages/BlogPost"),
  import("./pages/Status"),
  import("./components/ConvexScope"),
]);

export async function render(url: string): Promise<string> {
  await warmup;
  const tree = (
    <StaticRouter location={url}>
      <AppShell />
    </StaticRouter>
  );
  let html = renderToString(tree);
  for (let pass = 0; pass < 5; pass++) {
    // Let any dynamic import() kicked off during the last render resolve.
    await new Promise((resolve) => setTimeout(resolve, 0));
    const next = renderToString(tree);
    if (next === html) break;
    html = next;
  }
  return html;
}
