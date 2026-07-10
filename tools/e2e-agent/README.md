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
form, chatbot, key pages render, transparens uptime. Login-gated app flows
(app.digilist.no, ID-porten/BankID) are deferred until test auth exists.

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
