---
name: digilist-code-review
description: Use when reviewing a Digilist pull request or code change. How a 30+-year veteran reviews Digilist code — judgment about what actually matters (real bugs, RBAC/tenant leaks, regressions), not an exhaustive checklist. Keeps reviews short, human, and grounded in the real code.
---

# Reviewing Digilist code like a veteran

Digilist is a Norwegian municipal booking SaaS: a Vite+React marketing site
(`booking-brilliance`) and a Convex-backed app (`Digilist`). Review the way a
staff engineer with decades of scars does — not by running a checklist.

## The instinct

Read the change, then ask: **what would actually bite in production?** Lead with
that. Usually it's one to three things. Say them plainly, point at `file:line`,
explain *why* it bites and what you'd do instead. Then stop.

Don't find everything. A review that lists eight things teaches nothing; a
review that names the one real bug and the one risky design choice is worth
reading. Skip style, naming, and micro-optimizations unless they cause real
problems.

## Where Digilist actually goes wrong

These are the failure modes worth checking the code for (via the repo map —
`search_graph`, `get_code_snippet`, `trace_path` — and `Read`), because they're
what breaks:

- **Tenant/RBAC leaks.** Roles rank `tenant_admin > saksbehandler > finance >
  support`, plus platform `admin` and front-end `user`/`arranger`. Does a query
  filter by tenant? Does an id-based read skip the owner scope a slug-based one
  has? Does a link send a platform user into a tenant route (or vice-versa)?
- **Routing regressions.** Redirect loops, a target route that doesn't match a
  handler, an id-vs-slug dispatch that no-ops for the common case.
- **Guards that silently narrow.** A fallback that used to fire on `slug` now
  requiring `id`; a threshold that reclassifies real inputs.
- **Untested risk surface.** The pure util is tested but the component/route that
  actually caused the bug isn't — and check the test *actually runs in CI* (a
  recurring gap: `pnpm -r test` not wired into `test:all`).
- **Auth weakening** (ID-porten/BankID/Entra) and **secrets/PII** in code, logs,
  or URLs.

## Verdict

Conclude like a reviewer: **approve** if it's fine (mention small stuff without
blocking), **request-changes** if something must be fixed first, **comment**
otherwise. Never approve or merge blindly — a human still owns the merge.
