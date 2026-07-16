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
 * the route's dynamic import(s) (rendering fallbacks); we wait for it to
 * resolve; React.lazy caches the resolved module, so a later renderToString
 * emits the real content. This runs at build time only, so the extra passes
 * cost nothing at runtime.
 *
 * The loop retries until React's own "unresolved boundary" marker is gone
 * from the output, not until two passes look byte-identical — a cold
 * dynamic import() of an on-disk chunk (e.g. BlogPost's react-markdown/
 * remark-gfm graph) is real file I/O that can outlast a couple of 0ms
 * macrotask ticks, so two consecutive passes can both still be the pending
 * fallback shell and look "stable" while actually unresolved.
 */
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppShell } from "./App";

const UNRESOLVED_SUSPENSE_MARKER = "<!--$!-->";
const RETRY_DEADLINE_MS = 5000;
const RETRY_INTERVAL_MS = 20;

export async function render(url: string): Promise<string> {
  const tree = (
    <StaticRouter location={url}>
      <AppShell />
    </StaticRouter>
  );
  let html = renderToString(tree);
  const deadline = Date.now() + RETRY_DEADLINE_MS;
  while (html.includes(UNRESOLVED_SUSPENSE_MARKER) && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL_MS));
    html = renderToString(tree);
  }
  return html;
}
