# XAL-648: LCP 5.55s (kritisk — mål <2,5s) (cwv.lcp)

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Fix critical LCP (measured 5.55s, target <2.5s) on the Digilist marketing homepage https://digilist.no in the marketing repo (this repo, booking-brilliance). The LCP element is the prerendered H1 headline text (already present in dist/index.html), so the bottleneck is first-paint blocking, not the hero image. Two confirmed causes to fix:

1) RENDER-BLOCKING STYLESHEET. The build ships a plain render-blocking `<link rel="stylesheet" crossorigin href="/assets/index-*.css">` (~109KB) even though scripts/prerender.mjs (lines ~1058-1097) inlines critical CSS via Beasties with preload:'swap'. In the built dist/index.html the full-sheet link is NOT converted to non-blocking. Investigate why (likely the `crossorigin` attribute or a silent per-page catch). Make the full stylesheet load non-blocking on every prerendered page: either fix the Beasties swap, or add a deterministic post-process fallback that rewrites the app-CSS link to `rel="preload" as="style" onload="this.rel='stylesheet'"` (with a <noscript> fallback). Add a build assertion in scripts/prerender.mjs that fails the build if any prerendered HTML still contains a render-blocking app-CSS `<link rel="stylesheet">` for /assets/*.css, so this cannot silently regress.

2) MODULEPRELOAD BANDWIDTH CONTENTION. dist/index.html eagerly `<link rel="modulepreload">`s ~752KB of vendor JS (vendor-*, vendor-convex 81KB, vendor-motion 118KB, vendor-radix 60KB, vendor-icons 40KB) at high priority, starving the CSS/font/text critical path on slow 4G. Trim the modulepreloads emitted for the marketing home route: drop convex, framer-motion and other non-above-the-fold chunks from eager preload, and lazy-load them (React.lazy / dynamic import) so they load after first paint. Confirm the marketing homepage does not need the Convex client at initial render; if it doesn't, remove it from the initial bundle entirely.

Files: index.html, scripts/prerender.mjs, vite.config.ts (build.rollupOptions manualChunks / modulepreload config), src/main.tsx, src/entry-server.tsx, and the home page component under src/pages. Do NOT re-add a hero image preload (intentionally removed in c26b6ba) and keep the display=optional font strategy.

Acceptance criteria: (a) After `pnpm build`, no prerendered HTML under dist/ contains a render-blocking `<link rel="stylesheet">` pointing at /assets/*.css; the app stylesheet loads non-blocking with a working noscript fallback. (b) The marketing home route no longer eagerly modulepreloads convex/motion; eager modulepreload total for '/' drops materially below the current ~752KB. (c) The H1 headline still renders correctly with no FOUC (critical CSS covers above-the-fold). (d) A build-time assertion guards against reintroducing a render-blocking app-CSS link. (e) `pnpm lint` and `pnpm test` (vitest, including the entry-server h1/main-landmark tests) are green before opening the PR. In the PR description, note the expected LCP improvement and that it should be re-measured against https://digilist.no after deploy.`

## Implementation contract — complete this before writing code
- **Problem:** Fix critical LCP (measured 5.55s, target <2.5s) on the Digilist marketing homepage https://digilist.no in the marketing repo (this repo, booking-brilliance). The LCP element is the prerendered H1 headline text (already present in dist/index.html), so the bottleneck is first-paint blocking, not the hero image. Two confirmed causes to fix:

1) RENDER-BLOCKING STYLESHEET. The build ships a plain render-blocking `<link rel="stylesheet" crossorigin href="/assets/index-*.css">` (~109KB) even though scripts/prerender.mjs (lines ~1058-1097) inlines critical CSS via Beasties with preload:'swap'. In the built dist/index.html the full-sheet link is NOT converted to non-blocking. Investigate why (likely the `crossorigin` attribute or a silent per-page catch). Make the full stylesheet load non-blocking on every prerendered page: either fix the Beasties swap, or add a deterministic post-process fallback that rewrites the app-CSS link to `rel="preload" as="style" onload="this.rel='stylesheet'"` (with a <noscript> fallback). Add a build assertion in scripts/prerender.mjs that fails the build if any prerendered HTML still contains a render-blocking app-CSS `<link rel="stylesheet">` for /assets/*.css, so this cannot silently regress.

2) MODULEPRELOAD BANDWIDTH CONTENTION. dist/index.html eagerly `<link rel="modulepreload">`s ~752KB of vendor JS (vendor-*, vendor-convex 81KB, vendor-motion 118KB, vendor-radix 60KB, vendor-icons 40KB) at high priority, starving the CSS/font/text critical path on slow 4G. Trim the modulepreloads emitted for the marketing home route: drop convex, framer-motion and other non-above-the-fold chunks from eager preload, and lazy-load them (React.lazy / dynamic import) so they load after first paint. Confirm the marketing homepage does not need the Convex client at initial render; if it doesn't, remove it from the initial bundle entirely.

Files: index.html, scripts/prerender.mjs, vite.config.ts (build.rollupOptions manualChunks / modulepreload config), src/main.tsx, src/entry-server.tsx, and the home page component under src/pages. Do NOT re-add a hero image preload (intentionally removed in c26b6ba) and keep the display=optional font strategy.

Acceptance criteria: (a) After `pnpm build`, no prerendered HTML under dist/ contains a render-blocking `<link rel="stylesheet">` pointing at /assets/*.css; the app stylesheet loads non-blocking with a working noscript fallback. (b) The marketing home route no longer eagerly modulepreloads convex/motion; eager modulepreload total for '/' drops materially below the current ~752KB. (c) The H1 headline still renders correctly with no FOUC (critical CSS covers above-the-fold). (d) A build-time assertion guards against reintroducing a render-blocking app-CSS link. (e) `pnpm lint` and `pnpm test` (vitest, including the entry-server h1/main-landmark tests) are green before opening the PR. In the PR description, note the expected LCP improvement and that it should be re-measured against https://digilist.no after deploy.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-648-lcp-5-55s-kritisk-mal-2-5s-cwv-lcp`
- **Scope:** _the one change this branch delivers_
- **Out of scope:** _what you will NOT touch — no opportunistic refactor, no formatting sweeps_
- **Acceptance criteria:** _observable, demonstrable outcomes_
- **Architecture constraints:** _boundaries + patterns to follow_
- **Files likely affected:** _list them; if this grows well beyond the list, escalate_
- **Testing requirements:** _what proves it works_
- **Security considerations:** _secrets, RBAC, injection, dependencies_
- **Rollback strategy:** _how to revert safely_
- **Definition of done:** compiled · tests green · acceptance demonstrated with evidence · one reviewable change · no attribution

## Delivery rules
- One issue → one branch (`agent/xal-648-lcp-5-55s-kritisk-mal-2-5s-cwv-lcp`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

## Full issue — from Linear (the source of truth for scope & acceptance)
> The Linear MCP in this environment may be bound to the WRONG workspace, so
> do NOT rely on it to read this ticket — everything you need is below. If
> something essential is genuinely missing here (e.g. a screenshot), STOP and
> end with "CLARIFICATION:" rather than guessing.

<!-- xaheen-triage -->

## Problem Statement

The marketing homepage ([digilist.no](<http://digilist.no>)) has a measured LCP of 5.55s against a <2.5s target. The LCP element is the prerendered H1 headline text (already in dist/index.html), so the bottleneck is first-paint blocking, not the hero image. Code analysis identifies two confirmed causes: (1) the ~109KB app stylesheet ships as a plain render-blocking `<link rel="stylesheet" href="/assets/index-*.css">` even though scripts/prerender.mjs:1058-1097 runs Beasties critical-CSS inlining with preload:'swap' — the inline <style> appears but the full-sheet link is NOT converted to non-blocking in the built output; and (2) five `<link rel="modulepreload">` entries eagerly fetch ~752KB of vendor JS (vendor ~452KB, vendor-convex 81KB, vendor-motion 118KB, radix 60KB, icons 40KB) at high priority, starving the CSS/font/text critical path.

## Scope

**Innenfor:**

* Make the full app stylesheet load non-blocking on every prerendered page: fix the Beasties preload:'swap' rewrite of the /assets/index-*.css link, or add a deterministic post-process fallback that rewrites it to rel=preload as=style onload swap with a <noscript> fallback
* Investigate why the swap does not take effect in the shipped build (issue suggests the crossorigin attribute or a silent per-page catch that only warns)
* Add a build assertion in scripts/prerender.mjs that fails the build if any prerendered HTML still contains a render-blocking app-CSS `<link rel="stylesheet">` for /assets/*.css
* Trim/defer the eager modulepreload of heavy vendor chunks (convex, motion, radix and other non-above-the-fold chunks) on the marketing home route and lazy-load them (React.lazy / dynamic import) so they load after first paint
* Confirm whether the marketing homepage needs the Convex client at initial render; if not, remove it from the initial bundle

**Utenfor:**

* Changes outside the marketing (booking-brilliance) repository
* Re-adding a hero image preload (intentionally removed in c26b6ba)
* Changing the display=optional / media=print font strategy for the Fraunces font (per the analysis the font is not the primary blocker)
* Unrelated refactors, drive-by fixes, or direct merges to main

## Acceptance Criteria

- [ ] After `pnpm build`, no prerendered HTML under dist/ contains a render-blocking `<link rel="stylesheet">` pointing at /assets/*.css; the app stylesheet loads non-blocking with a working <noscript> fallback
- [ ] The marketing home route ('/') no longer eagerly modulepreloads the convex and motion vendor chunks, and total eagerly-preloaded JS for '/' drops materially below the current ~752KB
- [ ] The H1 headline still renders correctly with no FOUC (critical CSS covers above-the-fold)
- [ ] A build-time assertion fails the build if a render-blocking app-CSS link for /assets/*.css is reintroduced
- [ ] `pnpm lint` and `pnpm test` (vitest, including the entry-server h1/main-landmark tests) are green
- [ ] LCP is re-measured against [https://digilist.no](<https://digilist.no>) after deploy and the observed value recorded for comparison against the 5.55s baseline (the PR description notes the expected improvement)

## Testing Scenario

* Given a fresh `pnpm build`, When every dist/**/*.html is scanned for `<link rel="stylesheet" ... href="/assets/*.css">`, Then no render-blocking app-CSS link is found (only inlined critical CSS plus a preload/onload swap and a <noscript> fallback)
* Given the built dist/index.html for '/', When its modulepreload links are inspected, Then the convex and motion vendor chunks are absent and the total eagerly-preloaded JS is materially below ~752KB
* Given the homepage loaded with JavaScript disabled, When it renders, Then the H1 headline and above-the-fold styles still appear via the <noscript> fallback with no FOUC
* Given a change that reintroduces a render-blocking app-CSS `<link rel="stylesheet">`, When `pnpm build` runs, Then the build fails on the new assertion
* Given the deployed [digilist.no](<http://digilist.no>), When LCP is re-measured with the same tool/conditions that produced 5.55s, Then the new LCP value is recorded against the baseline

## Alvorlighetsgrad: minor

Framed as a defect because a mechanism that was supposed to ship — Beasties converting the app-CSS link to non-blocking — is confirmed not taking effect in the built output. Severity set to minor, the lower choice, because the homepage still renders and functions, only one page is affected, and the issue provides a Core Web Vitals metric but no evidence of users blocked, traffic lost, or revenue impact to size it higher. The raw 'P1 / major' is the scanner's classification, not impact evidence.

## Målrepo: `marketing`

*Valgt av triage fra sakens innhold; ruter forberedelsen dit.*

## Åpne spørsmål

* Must the fix actually reach LCP <2.5s to be accepted, or is materially reducing render-blocking CSS + modulepreload sufficient? The issue targets <2.5s but its own acceptance criteria only require 'unblocking' the LCP.
* Is there any evidence of user or business impact (bounce rate, lost traffic/conversions, SEO ranking) beyond the raw CWV number? None is given, which is why severity was kept low.
* Does the marketing homepage actually use the Convex client at initial render, or can it be removed from the initial bundle entirely? Needs code confirmation in booking-brilliance.
* What tool and conditions produced the 5.55s figure (lab vs field, device/network throttling)? Needed to reproduce and to verify the fix consistently.

---

*Strukturert av triage-agenten. Originalteksten er bevart under.*

<details><summary>Opprinnelig beskrivelse</summary>

**Classification:** improvement · severity major · priority P1

## Problem statement

LCP 5.55s (kritisk — mål <2,5s) (cwv.lcp). LCP 5.55s (kritisk — mål <2,5s) Regel: cwv.lcp Overflate: Marketing — [digilist.no](<http://digilist.no>) Affiserte sider: 1 Eksempel-URL: [https://digilist.no](<https://digilist.no>) Observed a

Linear: https://linear.app/xala-technologies/issue/XAL-648/lcp-555s-kritisk-mal-25s-cwvlcp
