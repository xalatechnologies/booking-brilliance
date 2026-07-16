# XAL-310: No <h1> on page (h1.missing)

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop I marketing-repoet mangler 7 sider et <h1>, blant annet blogginnlegg som https://digilist.no/blogg/automatisert-avbooking-og-refusjon-kommunal-saksbehandling. Finn de aktuelle sidemalene og layoutene (typisk blogg-innleggsmal, landingssider og eventuelle statiske sider) og sørg for at hver side rendrer nøyaktig ett synlig <h1> med sidens hovedtittel.

Oppgaver:
1. Lokaliser malene for blogginnlegg og de øvrige berørte sidene. Identifiser hvor hovedtittelen rendres i dag (kan være h2, en styled div eller helt fraværende).
2. Endre hovedtittelen til <h1>. For blogginnlegg skal h1 hente artikkelens tittel fra frontmatter/data. For landingssider skal hero-overskriften være h1.
3. Behold visuell styling ved å flytte eventuelle klasser til det nye h1-elementet, slik at designet ikke endres.
4. Verifiser at ingen side ender opp med flere enn ett h1, og at overskriftsnivåene under er logisk hierarkiske (h2, h3).

Akseptansekriterier:
- Alle 7 tidligere berørte sider har nøyaktig ett <h1> med meningsfull tittel.
- Eksempel-URLen for blogg har h1 lik innleggets tittel.
- Ingen dobbel-h1 introdusert på noen mal.
- Visuelt uendret utseende.
- Kjør lint, typecheck og eksisterende tester, alt skal være grønt før PR opprettes.

Legg gjerne til en enkel test eller lint-regel som sjekker at maler inneholder et h1 dersom rammeverket støtter det.`

## Implementation contract — complete this before writing code
- **Problem:** I marketing-repoet mangler 7 sider et <h1>, blant annet blogginnlegg som https://digilist.no/blogg/automatisert-avbooking-og-refusjon-kommunal-saksbehandling. Finn de aktuelle sidemalene og layoutene (typisk blogg-innleggsmal, landingssider og eventuelle statiske sider) og sørg for at hver side rendrer nøyaktig ett synlig <h1> med sidens hovedtittel.

Oppgaver:
1. Lokaliser malene for blogginnlegg og de øvrige berørte sidene. Identifiser hvor hovedtittelen rendres i dag (kan være h2, en styled div eller helt fraværende).
2. Endre hovedtittelen til <h1>. For blogginnlegg skal h1 hente artikkelens tittel fra frontmatter/data. For landingssider skal hero-overskriften være h1.
3. Behold visuell styling ved å flytte eventuelle klasser til det nye h1-elementet, slik at designet ikke endres.
4. Verifiser at ingen side ender opp med flere enn ett h1, og at overskriftsnivåene under er logisk hierarkiske (h2, h3).

Akseptansekriterier:
- Alle 7 tidligere berørte sider har nøyaktig ett <h1> med meningsfull tittel.
- Eksempel-URLen for blogg har h1 lik innleggets tittel.
- Ingen dobbel-h1 introdusert på noen mal.
- Visuelt uendret utseende.
- Kjør lint, typecheck og eksisterende tester, alt skal være grønt før PR opprettes.

Legg gjerne til en enkel test eller lint-regel som sjekker at maler inneholder et h1 dersom rammeverket støtter det.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-310-no-h1-on-page-h1-missing`
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
- One issue → one branch (`agent/xal-310-no-h1-on-page-h1-missing`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

Linear: https://linear.app/xala-technologies/issue/XAL-310/no-h1-on-page-h1missing
