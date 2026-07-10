---
name: digilist-code-review
description: Use when reviewing a Digilist pull request, diff, or code change. Provides the Digilist review rubric — security/RBAC, WCAG/universell utforming, Norwegian UX, Convex/data patterns, performance, and test coverage — so reviews are consistent and catch what matters for a Norwegian municipal booking SaaS.
---

# Digilist code-review rubric

Digilist is a Norwegian municipal booking SaaS: a Vite+React marketing site
(`booking-brilliance`) and a Convex-backed app (`Digilist`). Review against these
dimensions, most-critical first. Ground every claim in the actual code (use the
repository map: `search_graph`, `get_code_snippet`, `trace_path`, and `Read`).

## 1. Correctness & regressions
- Does the change do what the PR title/description claims? Verify against the code.
- Trace callers of changed functions (`trace_path` / `search_graph`) — any caller
  whose assumptions now break? Route changes: check for redirect loops and that
  the target route actually matches a handler.
- Boundary conditions: empty/missing ids, slug-vs-id resolution, off-by-one on
  thresholds, null/undefined guards.

## 2. Security & RBAC
- Digilist RBAC: platform `admin` (superadmin) + tenant roles ranked
  `tenant_admin(4) > saksbehandler(3) > finance(2) > support(1)`, plus front-end
  `user`/`arranger`. Does the change respect the right role/tenant scope?
- Cross-tenant leakage: does a query/mutation filter by tenant? Does a link/route
  send a platform/admin user into a tenant context (or vice-versa)?
- Secrets/PII: no keys, tokens, or personal data in code, logs, URLs, or query
  strings. Auth: ID-porten/BankID + Entra ID — don't weaken it.

## 3. Universell utforming (WCAG 2.1 AA) — when UI changes
- Semantic structure (headings, landmarks, `role`/`aria-*` where grouping is only
  visual), keyboard operability, focus handling, contrast (Digdir Designsystemet).
- Norwegian bokmål UX copy: concrete, sober; avoid AI clichés and em-dashes.

## 4. Convex / data patterns (app repo)
- Queries/mutations validated (args), indexed where filtered, no N+1 fetches.
- Schema changes are backward compatible or migrated.

## 5. Performance
- Bundle/render cost, unnecessary re-renders, image sizing, caching.

## 6. Tests
- Are the risk-carrying paths covered (not just the happy util)? Boundary tests
  for thresholds; component/route tests for routing changes.
- **Verify the tests actually run in CI** — check the root `package.json` test
  scripts include the package's suite (a common gap: `pnpm -r test` not wired
  into `test:all`).

## Output
Be specific and cite `file:symbol`. Classify findings `blocker | major | minor |
nit`. Say plainly when the change is good — don't invent problems. Never approve
or merge; the review is advisory.
