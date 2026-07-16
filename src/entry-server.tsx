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
 * invisible to crawlers and a11y auditors (a11y.landmark.main: 7 blog posts
 * and /transparens were shipping with an empty <div id="root">, so no
 * <main> at all in the static HTML a non-JS crawler sees).
 *
 * The dynamic import() a lazy route chunk kicks off can take more event-loop
 * ticks to fully settle (transitively pulling in react-markdown/remark-gfm
 * for BlogPost, or the Convex client for ConvexScope) than a couple of
 * `setTimeout(0)` passes cover — and once the render output stops changing
 * for two passes in a row we assumed it had "settled", even though a still-
 * pending Suspense boundary renders byte-identical fallback HTML every
 * pass. That false convergence is what let the first several prerendered
 * routes in a run through with the "Laster…" shell instead of real content.
 *
 * Node's ESM loader caches a module by specifier, so awaiting these same
 * import()s once up front — before the retry loop below ever starts —
 * resolves the same promise React.lazy() will pick up when AppShell
 * renders, with no race left to lose.
 */
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppShell } from "./App";

let lazyChunksWarmed: Promise<unknown> | null = null;

/** Pre-resolve every route-level lazy() chunk this SSR pass can hit, once per process. */
function warmLazyChunks(): Promise<unknown> {
  if (!lazyChunksWarmed) {
    lazyChunksWarmed = Promise.all([
      import("./pages/BlogPost"),
      import("./pages/Status"),
      import("./components/ConvexScope"),
    ]);
  }
  return lazyChunksWarmed;
}

export async function render(url: string): Promise<string> {
  await warmLazyChunks();
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
