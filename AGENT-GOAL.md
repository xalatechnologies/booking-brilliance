# XAL-641: Content gap: Arrangementer – mat, drikke, forsikring og logistikk

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Write and publish SEO content for "Arrangementer – mat, drikke, forsikring og logistikk". Cover Større arrangementer krever regulering av mat, drikke, ansvar og logistikk – avansert bruksfall som bookingsystemer må håndtere.. Goal: satisfy search intent for "arrangementer" on digilist.no. The blog post itself must be in Norwegian Bokmål.`

## Implementation contract — complete this before writing code
- **Problem:** Write and publish SEO content for "Arrangementer – mat, drikke, forsikring og logistikk". Cover Større arrangementer krever regulering av mat, drikke, ansvar og logistikk – avansert bruksfall som bookingsystemer må håndtere.. Goal: satisfy search intent for "arrangementer" on digilist.no. The blog post itself must be in Norwegian Bokmål.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-641-content-gap-arrangementer-mat-drikke-forsikring-`
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
- One issue → one branch (`agent/xal-641-content-gap-arrangementer-mat-drikke-forsikring-`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

## Full issue — from Linear (the source of truth for scope & acceptance)
> The Linear MCP in this environment may be bound to the WRONG workspace, so
> do NOT rely on it to read this ticket — everything you need is below. If
> something essential is genuinely missing here (e.g. a screenshot), STOP and
> end with "CLARIFICATION:" rather than guessing.

<!-- xaheen-triage -->

## Problem Statement

SEO-/innholdsgap: Digilist mangler innhold som dekker søkeintensjonen for «arrangementer» med vekt på mat, drikke, forsikring/ansvar og logistikk ved større arrangementer. Kodeanalyse fant ingen eksisterende dekning (gap, 95 % konfidens); kilden er en produktidé fra søkeklyngen «cluster:alkohol og mat arrangement sal».

## Scope

**Innenfor:**

* Opprette ny eller utvide eksisterende bloggartikkel/innhold på [digilist.no](<http://digilist.no>) om «Arrangementer – mat, drikke, forsikring og logistikk» i marketing-repoet (booking-brilliance)
* Dekke de fire deltemaene: mat, drikke, forsikring/ansvar og logistikk for større arrangementer
* Skrive innholdet på norsk bokmål
* Målrette søkeintensjonen for «arrangementer»

**Utenfor:**

* Endringer utenfor marketing-repoet (booking-brilliance)
* Endringer i selve bookingproduktet (app/platform) — faktiske funksjoner for mat/drikke/forsikring/logistikk
* Urelaterte refaktoreringer eller drive-by-fikser
* Direkte merge til main
* Scope-creep utover det angitte innholdsmålet

## Acceptance Criteria

- [ ] En artikkel på norsk bokmål om «Arrangementer – mat, drikke, forsikring og logistikk» er opprettet, eller en eksisterende artikkel er utvidet, i booking-brilliance
- [ ] Artikkelen har egne seksjoner/avsnitt for hvert av de fire deltemaene: mat, drikke, forsikring/ansvar og logistikk
- [ ] Tittel, metadata og overskrifter reflekterer temaet «arrangementer» slik at siden er indekserbar og relevant for søkeordet
- [ ] Eventuelle referanser til produktfunksjoner beskriver kun funksjoner Digilist faktisk har (ingen påstander om ikke-eksisterende funksjonalitet)
- [ ] CI (bygg og relevante tester) er grønn
- [ ] Ingen regresjon i eksisterende brukervendt oppførsel

## Testing Scenario

* Gitt at innholdet er publisert, når en leser åpner artikkelen, så finnes egne avsnitt/seksjoner om mat, drikke, forsikring/ansvar og logistikk.
* Gitt at artikkelen er publisert, når man ser på tittel/metadata/overskrifter, så reflekterer de temaet «arrangementer» og siden er indekserbar.
* Gitt at teksten refererer til produktfunksjoner, når en fagperson leser den, så beskriver den kun funksjoner Digilist faktisk har.

## Verdi: unknown — ingen prioritet satt; et menneske vurderer verdien

unknown fordi saken selv sier at ingen prioritet er satt og ikke oppgir søkevolum, konkrete tall eller navngitte brukere som er blokkert — kun en klyngebasert produktidé; verdivurderingen overlates til et menneske.

## Målrepo: `marketing`

*Valgt av triage fra sakens innhold; ruter forberedelsen dit.*

## Åpne spørsmål

* Hva er faktisk søkevolum, og hvilke konkrete søkeord skal målrettes utover «arrangementer»? Saken oppgir bare «search demand» uten tall.
* Er dette en helt ny artikkel eller en utvidelse av eksisterende innhold? I så fall hvilken side/URL?
* Hvilken målgruppe er innholdet for – offentlig/kommune eller privat utleie/utleiere? Teksten sier ikke hvem som er berørt.
* Skal innholdet beskrive Digilists faktiske produktfunksjoner for mat/drikke/forsikring/logistikk, eller er det generelle råd om arrangementer? Finnes disse funksjonene i produktet?
* Finnes det interne lenker/klyngeartikler denne bør knyttes til (topic cluster)?

---

*Strukturert av triage-agenten. Originalteksten er bevart under.*

<details><summary>Opprinnelig beskrivelse</summary>

<!-- xaheen-triage -->

## Problem Statement

SEO-/innholdsgap: Digilist mangler innhold som dekker søkeintensjonen for «arrangementer» med vekt på regulering av mat, drikke, forsikring/ansvar og logistikk ved større arrangementer. Kilden er en produktidé fra en søkeklynge (cluster:alkohol og mat arrangement sal); kodeanalyse fant ingen eksisterende dekning (gap, 95% konfidens).

## Scope

**Innenfor:**

* Opprette eller utvide bloggartikkel/innhold på [digilist.no](<http://digilist.no>) om «Arrangementer – mat, drikke, forsikring og logistikk»
* Dekke de fire deltemaene nevnt i teksten: mat, drikke, forsikring/ansvar og logistikk for større arrangementer
* Skrive innholdet på norsk bokmål
* Målrette søkeintensjonen for «arrangementer»

**Utenfor:**

* Endringer utenfor marketing-repoet (booking-brilliance)
* Urelaterte refaktoreringer eller drive-by-fikser
* Direkte merge til main
* Endringer i selve bookingproduktet (app/platform) — funksjoner for mat/drikke/forsikring/logistikk
* Scope-creep utover det angitte innholdsmålet

## Acceptance Criteria

- [ ] En artikkel på norsk bokmål om «Arrangementer – mat, drikke, forsikring og logistikk» er opprettet eller en eksisterende artikkel er utvidet i booking-brilliance
- [ ] Artikkelen dekker alle fire deltemaene: mat, drikke, forsikring/ansvar og logistikk
- [ ] Artikkelen er optimalisert for søkeordet/temaet «arrangementer»
- [ ] CI (bygg og relevante tester) er grønn
- [ ] Ingen regresjon i eksisterende brukervendt oppførsel

## Testing Scenario

* Gitt at innholdet er publisert, når en leser åpner artikkelen, så finnes egne avsnitt/seksjoner om mat, drikke, forsikring/ansvar og logistikk.
* Gitt at artikkelen er publisert, når man søker etter «arrangementer» på [digilist.no](<http://digilist.no>), så er artikkelen indekserbar og relevant for temaet (metadata/tittel/overskrifter reflekterer temaet).
* Gitt at teksten refererer til produktfunksjoner, når en fagperson leser den, så beskriver den kun funksjoner Digilist faktisk har (ingen påstander om ikke-eksisterende funksjonalitet).

## Verdi: unknown — ingen prioritet satt; et menneske vurderer verdien

*Ingen begrunnelse oppgitt.*

## Målrepo: `marketing`

*Valgt av triage fra sakens innhold; ruter forberedelsen dit.*

## Åpne spørsmål

* Hva er faktisk søkevolum / hvilke konkrete søkeord skal målrettes utover «arrangementer»? Issuet oppgir bare «search demand» uten tall.
* Er dette en helt ny artikkel eller utvidelse av eksisterende innhold? Isåfall hvilken side/URL?
* Hvilken målgruppe er innholdet for – offentlig/kommune eller privat utleie/utleiere? Teksten sier ikke hve

Linear: https://linear.app/xala-technologies/issue/XAL-641/content-gap-arrangementer-mat-drikke-forsikring-og-logistikk
