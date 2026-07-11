# XAL-325: Upgrade booking-brilliance to TypeScript 7 — Phase 1: baseline + TS6 readiness

> Auto-forberedt av Digilist Improvements Agent. Kjør Claude i denne worktreen:
> `/loop Prepare the booking-brilliance repo for a controlled TypeScript 7 migration — PHASE 1 of 2 (prep + baseline only; do NOT install TS7 in this PR). This repo is the Digilist marketing site (Vite+React SPA prerendered via scripts/prerender.mjs + entry-server.tsx) PLUS the autonomous agent tooling in tools/ (content-agent, improvements-agent, e2e-agent, pr-review-agent, docs-rag) run via tsx, and Playwright e2e. TypeScript 7.0 (native Go compiler, 2026-07-08) does not yet expose the programmatic compiler API, so tools importing 'typescript' may still need TS6 side-by-side. This PR is reversible and adds no features.

Steps:
1. Baseline: record current versions (node, tsc, vite, react, @vitejs/plugin-react, eslint, typescript-eslint, tsx, playwright) via pnpm list/why, and time cold+warm 'pnpm typecheck', 'pnpm build' (incl. prerender), 'pnpm test'/playwright. Record TS error count. Write to docs/typescript-7-migration.md.
2. Compatibility audit: grep the whole repo for programmatic TS compiler-API usage (from 'typescript', require('typescript'), ts.createProgram, ts.createSourceFile, CompilerHost, LanguageService, ts-morph, ts-loader, fork-ts-checker) — PAY SPECIAL ATTENTION to tools/ (the tsx-run agents) and the Vite/prerender/entry-server + Playwright setup. List every tool importing the TS compiler API (typescript-eslint, tsx, vite plugins). Document whether a side-by-side TS6/TS7 setup is needed.
3. Pin toolchain: pin packageManager in package.json, pin node via .node-version if missing, ensure project-local tsc (no global).
4. TS6 bridge: if below TypeScript 6, upgrade to typescript@^6 and resolve TS6 deprecations WITHOUT hiding them via ignoreDeprecations; if already 6+, note it.
5. Validate: 'pnpm lint && pnpm typecheck && pnpm test && pnpm build' all green, and the prerender step still works.
6. Document docs/typescript-7-migration.md: baseline, compat-audit findings (esp. for the tsx agents), rollback plan (revert dependency + lockfile), and the planned phase-2 (TS7 adoption).

Scope: prep + docs + TS6 readiness only. No TS7 install, no feature/UI changes, no opportunistic refactors. Tests + build (+ prerender) green before PR.`

## Mål
Prepare the booking-brilliance repo for a controlled TypeScript 7 migration — PHASE 1 of 2 (prep + baseline only; do NOT install TS7 in this PR). This repo is the Digilist marketing site (Vite+React SPA prerendered via scripts/prerender.mjs + entry-server.tsx) PLUS the autonomous agent tooling in tools/ (content-agent, improvements-agent, e2e-agent, pr-review-agent, docs-rag) run via tsx, and Playwright e2e. TypeScript 7.0 (native Go compiler, 2026-07-08) does not yet expose the programmatic compiler API, so tools importing 'typescript' may still need TS6 side-by-side. This PR is reversible and adds no features.

Steps:
1. Baseline: record current versions (node, tsc, vite, react, @vitejs/plugin-react, eslint, typescript-eslint, tsx, playwright) via pnpm list/why, and time cold+warm 'pnpm typecheck', 'pnpm build' (incl. prerender), 'pnpm test'/playwright. Record TS error count. Write to docs/typescript-7-migration.md.
2. Compatibility audit: grep the whole repo for programmatic TS compiler-API usage (from 'typescript', require('typescript'), ts.createProgram, ts.createSourceFile, CompilerHost, LanguageService, ts-morph, ts-loader, fork-ts-checker) — PAY SPECIAL ATTENTION to tools/ (the tsx-run agents) and the Vite/prerender/entry-server + Playwright setup. List every tool importing the TS compiler API (typescript-eslint, tsx, vite plugins). Document whether a side-by-side TS6/TS7 setup is needed.
3. Pin toolchain: pin packageManager in package.json, pin node via .node-version if missing, ensure project-local tsc (no global).
4. TS6 bridge: if below TypeScript 6, upgrade to typescript@^6 and resolve TS6 deprecations WITHOUT hiding them via ignoreDeprecations; if already 6+, note it.
5. Validate: 'pnpm lint && pnpm typecheck && pnpm test && pnpm build' all green, and the prerender step still works.
6. Document docs/typescript-7-migration.md: baseline, compat-audit findings (esp. for the tsx agents), rollback plan (revert dependency + lockfile), and the planned phase-2 (TS7 adoption).

Scope: prep + docs + TS6 readiness only. No TS7 install, no feature/UI changes, no opportunistic refactors. Tests + build (+ prerender) green before PR.

## Regler
- Jobb kun på denne branchen (`agent/xal-325-upgrade-booking-brilliance-to-typescript-7-phase`), aldri main.
- Kjør bygg + tester. Åpne PR bare når de er grønne (ellers draft-PR med notat).
- Slett denne filen før du åpner PR.

Linear: https://linear.app/xala-technologies/issue/XAL-325/upgrade-booking-brilliance-to-typescript-7-phase-1-baseline-ts6
