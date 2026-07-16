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
 * the route's dynamic import(s) (rendering fallbacks); we await a macrotask
 * so the chunk resolves; React.lazy caches the resolved module, so the next
 * renderToString emits the real content. Repeat until the output stabilises
 * (covers nested lazy) or a small cap is hit. This runs at build time only,
 * so the extra passes cost nothing at runtime.
 *
 * The BlogPost chunk itself (react-markdown + remark-gfm pulled in
 * transitively) is heavy enough that its cold import() doesn't always settle
 * within that per-route retry loop — whichever blog post prerenders first
 * would still ship the "Laster…" shell instead of the article body. warm()
 * pre-loads it once, before any route is rendered, so every post benefits.
 */
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppShell } from "./App";

export async function warm(): Promise<void> {
  await import("./pages/BlogPost");
}

export async function render(url: string): Promise<string> {
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
