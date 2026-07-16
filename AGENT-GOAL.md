# XAL-314: Title is 66 chars (recommend ≤65) (title.long)

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop I marketing-repoet: To sider har en title-tag på 66 tegn, over anbefalt grense på 65. Eksempel er /blogg/datalokasjon-norge-gdpr-kommunal-booking. Finn de to affiserte sidene ved å søke gjennom bloggens frontmatter/metadata eller de komponentene som setter title-taggen (sannsynligvis en SEO- eller Head-komponent, frontmatter i markdown/MDX, eller en meta-config). Kort ned title til maks 65 tegn på begge sidene, behold hovednøkkelordene (datalokasjon, GDPR, kommunal booking) og fjern fyllord slik at meningen bevares. Verifiser at ingen title i repoet nå overstiger 65 tegn ved å legge til eller kjøre en enkel sjekk. Akseptansekriterier: begge affiserte titler er 65 tegn eller kortere, nøkkelord bevart, ingen andre sider fått regresjon, alle eksisterende tester og lint er grønne før PR opprettes.`

## Implementation contract — complete this before writing code
- **Problem:** I marketing-repoet: To sider har en title-tag på 66 tegn, over anbefalt grense på 65. Eksempel er /blogg/datalokasjon-norge-gdpr-kommunal-booking. Finn de to affiserte sidene ved å søke gjennom bloggens frontmatter/metadata eller de komponentene som setter title-taggen (sannsynligvis en SEO- eller Head-komponent, frontmatter i markdown/MDX, eller en meta-config). Kort ned title til maks 65 tegn på begge sidene, behold hovednøkkelordene (datalokasjon, GDPR, kommunal booking) og fjern fyllord slik at meningen bevares. Verifiser at ingen title i repoet nå overstiger 65 tegn ved å legge til eller kjøre en enkel sjekk. Akseptansekriterier: begge affiserte titler er 65 tegn eller kortere, nøkkelord bevart, ingen andre sider fått regresjon, alle eksisterende tester og lint er grønne før PR opprettes.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-314-title-is-66-chars-recommend-65-title-long`
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
- One issue → one branch (`agent/xal-314-title-is-66-chars-recommend-65-title-long`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

Linear: https://linear.app/xala-technologies/issue/XAL-314/title-is-66-chars-recommend-65-titlelong
