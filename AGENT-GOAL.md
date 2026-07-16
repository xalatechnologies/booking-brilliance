# XAL-361: E2E failure: login route is reachable when exposed

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Fix the E2E failure "login route is reachable when exposed" (against https://digilist.no). Error: Error: expect(locator).toBeVisible() failed

Locator: getByText(/bankid|id-porten|logg inn|sign in|login/i).first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText(/bankid|id-porten|logg inn|sign in|login/i).first()
. Reproduce with `pnpm e2e:test`, find and fix the root cause, verify the journey is green, run full test/build and open a PR. Do not work on main.`

## Implementation contract — complete this before writing code
- **Problem:** Fix the E2E failure "login route is reachable when exposed" (against https://digilist.no). Error: Error: expect(locator).toBeVisible() failed

Locator: getByText(/bankid|id-porten|logg inn|sign in|login/i).first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText(/bankid|id-porten|logg inn|sign in|login/i).first()
. Reproduce with `pnpm e2e:test`, find and fix the root cause, verify the journey is green, run full test/build and open a PR. Do not work on main.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-361-e2e-failure-login-route-is-reachable-when-expose`
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
- One issue → one branch (`agent/xal-361-e2e-failure-login-route-is-reachable-when-expose`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

Linear: https://linear.app/xala-technologies/issue/XAL-361/e2e-failure-login-route-is-reachable-when-exposed
