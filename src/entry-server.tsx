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
 * renderToString emits the real content. Repeat until a pass comes back
 * without React's "did not finish this Suspense boundary" marker (covers
 * nested lazy) or a cap is hit. This runs at build time only, so the extra
 * passes cost nothing at runtime.
 *
 * The loop keys off that marker rather than "output unchanged from the
 * previous pass": the first two passes are often byte-identical (the lazy
 * chunk's import() — disk read + module eval — is still pending, so both
 * renders emit the same fallback), and a single 0ms macrotask tick isn't
 * always enough wall-clock time for that import to finish. Treating
 * "unchanged" as "stable" made the loop quit before the chunk resolved,
 * silently baking the loading shell into the static HTML for whichever
 * route happened to be the first to touch that chunk.
 */
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppShell } from "./App";

const SUSPENSE_NOT_FINISHED_MARKER = "did not finish this Suspense boundary";

export async function render(url: string): Promise<string> {
  const tree = (
    <StaticRouter location={url}>
      <AppShell />
    </StaticRouter>
  );
  let html = renderToString(tree);
  for (
    let pass = 0;
    pass < 20 && html.includes(SUSPENSE_NOT_FINISHED_MARKER);
    pass++
  ) {
    // Let the dynamic import() kicked off during the last render resolve.
    await new Promise((resolve) => setTimeout(resolve, 25));
    html = renderToString(tree);
  }
  return html;
}
