# E2E agent

Two complementary modes, per the agreed design.

## 1. Playwright (autonomous)

Headless public-surface journeys against the live site, run on a schedule. No
LLM/API key — it's the deterministic guardrail. Failing journeys are filed into
the Linear "Digilist - Improvements Agent" project as **categorized bugs**
(type=bug + severity + priority + a runnable `/loop` fix goal), deduped.

```
pnpm e2e:test            # run the suite (local dev; artifacts in tools/e2e-agent/)
pnpm e2e:run             # run + file failing journeys to Linear
pnpm e2e:run -- --dry-run  # run + print, file nothing
E2E_BASE_URL=https://digilist.no  # target (default)
```

Coverage (`tests/public-surfaces.spec.ts`): home + nav, blog index→post, book-demo
form, chatbot, key pages render, transparens uptime.

### Authenticated, per-role app journeys

`tests/app/**` run per role (innbygger, saksbehandler, driftsleder, IT-leder,
plattform-admin — see `auth/roles.ts`), each pre-authenticated via a saved
session. BankID/ID-porten can't be automated headlessly, so this needs **one**
of:

1. **A test-login endpoint** in the Digilist app (the clean, autonomous path) —
   gated to test/staging or behind a secret — that mints a session for
   `{role, tenant}`. Configure: `E2E_APP_BASE_URL`, `E2E_TEST_LOGIN_URL`,
   `E2E_TEST_LOGIN_SECRET`, `E2E_TEST_TENANT`, and `E2E_<ROLE>_ENABLED=true` per
   role. `auth/global-setup.ts` logs each in and saves `auth/.auth/<role>.json`.
2. **Pre-captured sessions** — drop a manually-captured `auth/.auth/<role>.json`
   per role (refresh when it expires) and set `E2E_<ROLE>_ENABLED=true`.

Without either, the app suite is skipped and only the public suite runs. The
test-login endpoint is itself a small Digilist-repo feature (a good `/loop`
goal). The user stories the app suite should cover live in `SCENARIOS.md`.

On the VPS: `digilist-e2e.timer` (every 6h) → `vps-e2e-runner.sh`.

## 2. claude-in-chrome (interactive / exploratory)

On demand, ask Claude to drive a real Chrome via the `claude-in-chrome` MCP for
exploratory, human-in-the-loop testing of a specific flow — e.g. "walk the
book-demo form and try edge cases", or record a GIF of a journey. This is the
expert, agentic complement to the deterministic Playwright suite: Claude reasons
about what to try, spots issues a fixed script wouldn't, and can draft new
Playwright tests from what it finds (which then join the autonomous suite).

## Extending

Add journeys as `test(...)` blocks with stable titles (the Linear dedup keys on
the title). When Claude finds a new failure mode interactively, codify it as a
Playwright test so the autonomous suite catches regressions.
