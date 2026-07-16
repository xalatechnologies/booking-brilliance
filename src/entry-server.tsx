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
 * invisible to crawlers and a11y auditors. To fix this without giving up
 * client-side code-splitting, we render in a loop: the first pass triggers
 * the route's dynamic import(s) (rendering fallbacks); we wait for the chunk
 * to resolve; React.lazy caches the resolved module, so the next
 * renderToString emits the real content. Repeat until the output stabilises
 * (covers nested lazy) or a cap is hit. This runs at build time only, so the
 * extra passes cost nothing at runtime.
 *
 * The wait between passes has to be real wall-clock time, not just a single
 * macrotask: a dynamic import() reads + evaluates a chunk from disk, which
 * can take tens of ms. A single `setTimeout(resolve, 0)` yields for one
 * tick, which isn't enough on a slow/cold build machine — the loop would
 * exhaust its passes and settle on the "Laster…" fallback, i.e. an
 * effectively empty prerendered page (this is what caused blog posts to
 * intermittently ship with only a handful of visible words).
 */
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppShell } from "./App";

const MAX_PASSES = 8;
const PASS_DELAY_MS = 25;

export async function render(url: string): Promise<string> {
  const tree = (
    <StaticRouter location={url}>
      <AppShell />
    </StaticRouter>
  );
  let html = renderToString(tree);
  for (let pass = 0; pass < MAX_PASSES; pass++) {
    // Let any dynamic import() kicked off during the last render resolve.
    await new Promise((resolve) => setTimeout(resolve, PASS_DELAY_MS));
    const next = renderToString(tree);
    if (next === html) break;
    html = next;
  }
  return html;
}
