# XAL-316 — Homepage LCP investigation & handoff

Ticket: LCP on the marketing homepage (digilist.no `/`) measured 3.63s,
target <2.5s. Scan-reported number, no reproduction steps or device/network
conditions attached.

## Which element is LCP

Confirmed with a headless Chrome `PerformanceObserver` on the
`largest-contentful-paint` entry (not a guess): the LCP element is the **H1
headline** ("Lokaler du trenger, og plattformen som drifter det."), not the
hero image. This matches an earlier finding already recorded in `index.html`
(commit `c26b6ba`, merged to `main` before this ticket): the H1 covers ~203k
px² of the mobile viewport vs. the hero image's ~109k px². A comment was
added at the H1 in `src/components/HeroSection.tsx` so this doesn't get
re-investigated with an image-oriented fix (preload/fetchpriority) later —
that was already tried and reverted for stealing bandwidth from the actual
LCP element's critical path.

## Current measurements (this branch, after all `main` work already merged in)

Both measured with Lighthouse 12.8.2, mobile emulation (412×823, DPR 2.625),
`--throttling-method=devtools`, on a shared VPS (runs are noisy — see range).

**Local build** (`pnpm build && pnpm preview`, prerendered `dist/`), 6 runs:

| Metric | Range | Median |
|---|---|---|
| LCP | 851ms – 2418ms (one outlier under host contention) | **935ms** |
| CLS | 0.001 – 0.010 | 0.001 |

**Live production** (`https://digilist.no/`), 3 runs:

| Metric | Range |
|---|---|
| LCP | 1011ms – 1262ms |
| CLS | 0.001 (all runs) |
| `uses-long-cache-ttl` | score 1, 0 resources flagged |
| `render-blocking-resources` | score 1, none |
| `font-display` | score 1 |
| third-party main-thread blocking | 0ms (Plausible is `defer`red) |

Both are well inside the ticket's targets (LCP <2.5s, CLS <0.1), with no
regression risk since no layout-affecting code changed.

## Why the ticket's 3.63s doesn't reproduce here

This ticket landed after a series of homepage-specific perf work already on
`main`: self-hosted fonts with `font-display: optional` (`b124c83`), critical
CSS inlined per prerendered route (`de16cad`), a 2.4KB rasterized logo
replacing a 144KB SVG (`300d07e`), the hero preload removed once the H1 was
identified as the real LCP element (`c26b6ba`), and route-splitting +
image/JS payload cuts across the homepage (`f6df697`, PR #107). The 3.63s
figure most plausibly reflects a build from before that work landed, or
field/CrUX data reflecting a slower historical window — not a gap in the
current code. No further LCP-affecting change was needed; this PR only adds
the confirming comment and this doc so the finding isn't lost.

## Test plan run for this ticket

- `pnpm build` — succeeds, 127 pages pre-rendered + sitemap, critical CSS
  inlined on 128/128 pages, blog word-count check passes.
- `pnpm test` — 8 files / 17 tests pass.
- `pnpm lint` — 0 errors (38 pre-existing warnings, unchanged from `main`).
