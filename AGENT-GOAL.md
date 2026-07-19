# XAL-640: Lighthouse Ytelse-score 66/100 (mål ≥90). (lighthouse.performance)

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop In the `marketing` repo (Vite SSR + prerender site for digilist.no), raise the mobile Lighthouse Performance score of the homepage from ~66 to >=90.

Measure correctly: build the production artifact with `pnpm build` (this runs `vite build`, the SSR build, `scripts/prerender.mjs`, and word-count check), serve `dist/` with `pnpm preview`, and run Lighthouse in mobile emulation against the prerendered homepage (`/`). Record the baseline score and the top opportunities/diagnostics (LCP, Total Blocking Time, unused/legacy JavaScript, render-blocking resources, image delivery, CLS) BEFORE making changes.

Then fix the highest-impact contributors. Do not guess; drive each change by a measured Lighthouse opportunity. Likely levers in this codebase:
- Reduce initial JS: extend/verify route-level `React.lazy` + `Suspense` code-splitting so only the homepage's above-the-fold JS ships on first paint; review `vite.config.ts` manualChunks so the homepage does not pull admin/convex/charts/markdown/date chunks.
- Font cost: the three variable fonts (Fraunces, Public Sans, JetBrains Mono) load cross-origin from Google Fonts in `index.html`. Consider self-hosting subset woff2 files (latin subset, only used axes/weights) served same-origin with `preload` to cut connection + transfer cost, keeping the existing non-blocking/`display=optional` behavior.
- Images: ensure the hero (`festsal`) and any above-the-fold images are served as AVIF/WebP at correct dimensions with explicit `width`/`height` (or aspect-ratio) to avoid CLS and oversized transfers.
- Third-party/JS: keep Plausible deferred; remove any dead render-blocking scripts.
- Inline critical CSS if render-blocking CSS is flagged.

Acceptance criteria:
- Mobile Lighthouse Performance for the prerendered homepage is >=90 (paste the before/after scores and the resolved opportunities into the PR description).
- No visual/functional regression: the H1 hero, fonts, and hero image render correctly in light and dark mode; existing entry-server SSR tests (`entry-server*.test.tsx`) still pass.
- `pnpm build` succeeds (prerender + word-count checks pass), `pnpm lint` clean, and `pnpm test` green before opening the PR.
- Do NOT touch tracked-but-gitignored `dist-server/*` as part of the change set.`

## Implementation contract — complete this before writing code
- **Problem:** In the `marketing` repo (Vite SSR + prerender site for digilist.no), raise the mobile Lighthouse Performance score of the homepage from ~66 to >=90.

Measure correctly: build the production artifact with `pnpm build` (this runs `vite build`, the SSR build, `scripts/prerender.mjs`, and word-count check), serve `dist/` with `pnpm preview`, and run Lighthouse in mobile emulation against the prerendered homepage (`/`). Record the baseline score and the top opportunities/diagnostics (LCP, Total Blocking Time, unused/legacy JavaScript, render-blocking resources, image delivery, CLS) BEFORE making changes.

Then fix the highest-impact contributors. Do not guess; drive each change by a measured Lighthouse opportunity. Likely levers in this codebase:
- Reduce initial JS: extend/verify route-level `React.lazy` + `Suspense` code-splitting so only the homepage's above-the-fold JS ships on first paint; review `vite.config.ts` manualChunks so the homepage does not pull admin/convex/charts/markdown/date chunks.
- Font cost: the three variable fonts (Fraunces, Public Sans, JetBrains Mono) load cross-origin from Google Fonts in `index.html`. Consider self-hosting subset woff2 files (latin subset, only used axes/weights) served same-origin with `preload` to cut connection + transfer cost, keeping the existing non-blocking/`display=optional` behavior.
- Images: ensure the hero (`festsal`) and any above-the-fold images are served as AVIF/WebP at correct dimensions with explicit `width`/`height` (or aspect-ratio) to avoid CLS and oversized transfers.
- Third-party/JS: keep Plausible deferred; remove any dead render-blocking scripts.
- Inline critical CSS if render-blocking CSS is flagged.

Acceptance criteria:
- Mobile Lighthouse Performance for the prerendered homepage is >=90 (paste the before/after scores and the resolved opportunities into the PR description).
- No visual/functional regression: the H1 hero, fonts, and hero image render correctly in light and dark mode; existing entry-server SSR tests (`entry-server*.test.tsx`) still pass.
- `pnpm build` succeeds (prerender + word-count checks pass), `pnpm lint` clean, and `pnpm test` green before opening the PR.
- Do NOT touch tracked-but-gitignored `dist-server/*` as part of the change set.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-640-lighthouse-ytelse-score-66-100-mal-90-lighthouse`
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
- One issue → one branch (`agent/xal-640-lighthouse-ytelse-score-66-100-mal-90-lighthouse`) → one independently reviewable change. Never main.
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

The Lighthouse Performance score for the [digilist.no](<http://digilist.no>) homepage (Marketing surface) is 66/100, below the stated target of ≥90. The homepage renders and functions; the issue is that measured performance falls short of the goal. The production artifact to audit is the prerendered dist/ output (Vite SSR build via `pnpm build` + scripts/prerender.mjs), not the dev server. The issue cites likely contributors — JS payload / TBT, cross-origin Google Fonts cost, image delivery, render-blocking resources — but these are stated as hypotheses, not measured facts.

## Scope

**Innenfor:**

* Build the production artifact (`pnpm build`: vite build + SSR build + scripts/prerender.mjs) and run Lighthouse against the prerendered homepage served from dist/, not the dev server
* Record a baseline Lighthouse Performance score and its top opportunities/diagnostics (LCP, Total Blocking Time, unused/legacy JS, render-blocking resources, image delivery, CLS) before making changes
* Remediate the highest-impact measured contributors until the homepage Performance score reaches ≥90
* Candidate levers named in the issue (to pursue only where a measurement justifies them): reducing initial JS via route-level lazy-loading and manualChunks review in vite.config.ts; self-hosting/subsetting the variable fonts loaded from Google Fonts in index.html; ensuring above-the-fold images are correctly sized in modern formats (AVIF/WebP) with explicit dimensions; inlining critical CSS; keeping Plausible deferred
* Touch points named: vite.config.ts, index.html, package.json (build), scripts/prerender.mjs

**Utenfor:**

* Changes outside the target (marketing) repository
* Unrelated refactors, drive-by fixes, or direct merges to main
* Scope creep beyond raising this page's Performance score
* Modifying tracked-but-gitignored dist-server/* as part of the change set

## Acceptance Criteria

- [ ] Lighthouse Performance for the prerendered [digilist.no](<http://digilist.no>) homepage is ≥90, with before/after scores and the resolved opportunities recorded in the PR description
- [ ] The score is measured against the prerendered production artifact (dist/ served via preview), not the dev server
- [ ] `pnpm build` succeeds (including prerender and word-count checks)
- [ ] `pnpm lint` is clean and `pnpm test` is green (including existing entry-server SSR tests)
- [ ] No visual or functional regression: H1 hero, fonts, and hero image render correctly in light and dark mode

## Testing Scenario

* Given a clean checkout of the marketing repo, When `pnpm build` runs, Then it completes successfully and produces a prerendered homepage in dist/.
* Given the prerendered dist/ served via `pnpm preview`, When Lighthouse is run against the homepage (/) in the same emulation profile used for the baseline, Then the reported Performance score is ≥90.
* Given the built site, When the homepage is loaded in both light and dark mode, Then the H1 hero, the three fonts, and the hero image render correctly with no visible layout shift or missing assets.
* Given the branch before opening the PR, When `pnpm lint` and `pnpm test` run, Then both pass with no failures.

## Verdi: unknown — ingen prioritet satt; et menneske vurderer verdien

Enhancement, so no severity. Value is unknown because the issue provides no evidence of business impact — it cites an internal Lighthouse target (≥90) and one affected page, but names no blocked users, revenue at stake, commitment, or downstream work that cannot proceed. Per the rules, 'unknown' is the correct answer when no evidence of value is given, rather than guessing 'low'. The missing evidence is requested in openQuestions.

## Målrepo: `marketing`

*Valgt av triage fra sakens innhold; ruter forberedelsen dit.*

## Åpne spørsmål

* Which emulation profile does the 66/100 baseline refer to? The top-line issue states '66/100' without a profile, while the loop instructions assume mobile — the target ≥90 must be measured under a consistent, agreed profile.
* Is the ≥90 target a formal commitment (e.g. an SLA, a launch gate, an SEO/ranking requirement) or an internal quality aspiration? This determines the value/priority of the work.
* Is there evidence of real-world impact (bounce rate, conversion, SEO ranking, user complaints) tied to the current score, or is 66 known only from the Lighthouse scan?
* The issue reports 1 affected page (the homepage) — is raising other Marketing pages to ≥90 also expected, or is this scoped strictly to /?

---

*Strukturert av triage-agenten. Originalteksten er bevart under.*

<details><summary>Opprinnelig beskrivelse</summary>

**Classification:** improvement · severity major · priority P2

## Problem statement

Lighthouse Ytelse-score 66/100 (mål ≥90). (lighthouse.performance). Lighthouse Ytelse-score 66/100 (mål ≥90). Regel: lighthouse.performance Overflate: Marketing — [digilist.no](<http://digilist.no>) Affiserte sider: 1 Eksempel-URL: [https://digilist.no](<https://digilist.no>) Observed at [https://digilist.no](<https://digilist.no>). Classification: improvement/major — fixable. Relevant code: vite.config.ts, index.html, package.json (build), scripts/prerender.mjs.

## Scope

Run Lighthouse against the production build of the homepage, identify the concrete audit opportunities (LCP, Total Blocking Time, unused/legacy JS, render-blocking resources, image formats, CLS), and remediate the top contributors until mobile Performance >=90. Likely levers: reduce initial JS via lazy-loading below-the-fold/route-level components, self-host or subset the variable fonts to cut third-party font cost, defer/remove non-critical JS, ensure hero/og images are properly sized and in modern formats (AVIF/WebP) with explicit width/height, and inline critical CSS. Touch points: vite.config.ts (manualChunks already splits vendor/radix/motion/charts; chunkSizeWarningLimit=600 — JS payload is the likely TBT/LCP driver); index.html (Googl

Linear: https://linear.app/xala-technologies/issue/XAL-640/lighthouse-ytelse-score-66100-mal-90-lighthouseperformance
