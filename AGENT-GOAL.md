# XAL-449: Title "Bryllupslokale i kommunen: pris, kapasitet og booking på nett" is reused on 2 pages (title.duplicate)

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop In the marketing repo, fix the duplicate SEO page title flagged by scan rule title.duplicate. Two published blog pages currently render the identical <title> 'Bryllupslokale i kommunen: pris, kapasitet og booking på nett'; one of them is https://digilist.no/blogg/bryllupslokale-kommune-pris-leie-booking. Steps: (1) Locate both pages that emit this title — grep the blog content/frontmatter and any title template (see scripts/verify-live.mjs extractTitle/expectedTitle for how titles are read). (2) Rewrite the title of at least one page so both are unique and each matches the page's actual intent, keeping the core keyword 'bryllupslokale' but varying angle and length (aim 50-60 chars). Update any og:title / meta title that mirrors it. (3) Add a build- or verify-time check that fails when two pages share a <title> (extend the existing verify-live tooling). Acceptance criteria: no two pages share a <title>; the duplicate-title check passes; the affected pages still render valid, keyword-relevant titles. Run the repo's lint/build/tests and the title verification, all green, before opening a PR. Write in Norwegian Bokmål only where it is user-facing page content; keep code and commit messages in English.`

## Implementation contract — complete this before writing code
- **Problem:** In the marketing repo, fix the duplicate SEO page title flagged by scan rule title.duplicate. Two published blog pages currently render the identical <title> 'Bryllupslokale i kommunen: pris, kapasitet og booking på nett'; one of them is https://digilist.no/blogg/bryllupslokale-kommune-pris-leie-booking. Steps: (1) Locate both pages that emit this title — grep the blog content/frontmatter and any title template (see scripts/verify-live.mjs extractTitle/expectedTitle for how titles are read). (2) Rewrite the title of at least one page so both are unique and each matches the page's actual intent, keeping the core keyword 'bryllupslokale' but varying angle and length (aim 50-60 chars). Update any og:title / meta title that mirrors it. (3) Add a build- or verify-time check that fails when two pages share a <title> (extend the existing verify-live tooling). Acceptance criteria: no two pages share a <title>; the duplicate-title check passes; the affected pages still render valid, keyword-relevant titles. Run the repo's lint/build/tests and the title verification, all green, before opening a PR. Write in Norwegian Bokmål only where it is user-facing page content; keep code and commit messages in English.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-449-title-bryllupslokale-i-kommunen-pris-kapasitet-o`
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
- One issue → one branch (`agent/xal-449-title-bryllupslokale-i-kommunen-pris-kapasitet-o`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

Linear: https://linear.app/xala-technologies/issue/XAL-449/title-bryllupslokale-i-kommunen-pris-kapasitet-og-booking-pa-nett-is
