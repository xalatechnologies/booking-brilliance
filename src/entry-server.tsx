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
 * invisible to crawlers and a11y auditors (h1.missing / a11y.landmark.main:
 * blog posts and /transparens were shipping with an empty <div id="root">,
 * no <h1>, and no <main> in the static HTML a non-JS crawler sees).
 *
 * The dynamic import() a lazy route chunk kicks off can take more event-loop
 * ticks to fully settle (transitively pulling in react-markdown/remark-gfm
 * for BlogPost, or the Convex client for ConvexScope) than a couple of
 * `setTimeout(0)` passes cover. The render loop below retries until React's
 * own "unresolved boundary" marker is gone from the output, rather than
 * until two passes look byte-identical — a still-pending Suspense boundary
 * renders byte-identical fallback HTML every pass, so byte-equality alone is
 * a false "settled" signal. If the marker is still present after a
 * wall-clock deadline, render() throws instead of returning the shell, so a
 * stuck route fails the build loudly instead of silently shipping a
 * no-<h1> page.
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
  // A boundary that's still unresolved after the deadline means the loop gave
  // up, not that the page finished rendering — returning html here would ship
  // the no-<h1> loading shell as if it were real content, exactly the bug
  // this loop exists to prevent. Fail the build instead of shipping it.
  if (html.includes(UNRESOLVED_SUSPENSE_MARKER)) {
    throw new Error(
      `SSR prerender for ${url} did not resolve within ${RETRY_DEADLINE_MS}ms (unresolved Suspense boundary)`,
    );
  }
  return html;
}
