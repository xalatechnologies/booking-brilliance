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
 * the route's dynamic import(s) (rendering fallbacks); we wait for the
 * chunk to resolve; React.lazy caches the resolved module, so the next
 * renderToString emits the real content. This runs at build time only, so
 * the extra passes cost nothing at runtime.
 *
 * A resolved React.lazy() promise doesn't mean the wait was long enough —
 * heavier chunks (e.g. BlogPost's react-markdown/remark-gfm chain) can take
 * several hundred ms of real wall-clock time to import(), far more than a
 * single setTimeout(0) macrotask. React marks an unfinished Suspense
 * boundary in the SSR output with an "<!--$!-->" comment (vs "<!--$-->"
 * once resolved), so we use that as the retry signal instead of guessing —
 * comparing output for byte-equality can't tell "fully resolved" apart from
 * "still pending, so unchanged", which previously caused the loop to bail
 * out early with the fallback baked into the static HTML.
 */
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppShell } from "./App";

const PENDING_BOUNDARY_MARKER = "<!--$!-->";

export async function render(url: string): Promise<string> {
  const tree = (
    <StaticRouter location={url}>
      <AppShell />
    </StaticRouter>
  );
  let html = renderToString(tree);
  for (let pass = 0; pass < 20 && html.includes(PENDING_BOUNDARY_MARKER); pass++) {
    await new Promise((resolve) => setTimeout(resolve, 75));
    html = renderToString(tree);
  }
  return html;
}
