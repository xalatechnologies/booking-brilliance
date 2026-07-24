# XAL-653: Content gap: Kunnskap om lokaletyper og rutiner

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Write and publish SEO content for "Kunnskap om lokaletyper og rutiner". Cover Educational content about facility types and municipal booking procedures can capture early-stage search intent and build authority.. Goal: satisfy search intent for "kunnskap" on digilist.no. The blog post itself must be in Norwegian Bokmål.`

## Implementation contract — complete this before writing code
- **Problem:** Write and publish SEO content for "Kunnskap om lokaletyper og rutiner". Cover Educational content about facility types and municipal booking procedures can capture early-stage search intent and build authority.. Goal: satisfy search intent for "kunnskap" on digilist.no. The blog post itself must be in Norwegian Bokmål.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-653-content-gap-kunnskap-om-lokaletyper-og-rutiner`
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
- One issue → one branch (`agent/xal-653-content-gap-kunnskap-om-lokaletyper-og-rutiner`) → one independently reviewable change. Never main.
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

SEO-agenten rapporterer et innholdsgap: Digilist mangler pedagogisk innhold om lokaletyper og kommunale bookingrutiner. Issuet hevder slikt innhold kan fange tidligfase-søkeintensjon (klynge «Hva er et forsamlingslokale?», nøkkelord «kunnskap») og bygge autoritet. Gap bekreftet med 94 % konfidens, ingen direkte kodetreff.

## Scope

**Innenfor:**

* Lage eller utvide innhold som dekker «Kunnskap om lokaletyper og rutiner»
* Dekke fasilitetstyper (lokaletyper) og kommunale bookingrutiner
* Norsk Bokmål, publisert på [digilist.no](<http://digilist.no>), rettet mot søkeintensjon for «kunnskap»

**Utenfor:**

* Endringer utenfor målrepoet (marketing)
* Urelaterte refaktoreringer, drive-by-fikser eller direkte merge til main
* Scope creep utover det angitte innholdsmålet

## Acceptance Criteria

- [ ] En publisert bloggpost på Norsk Bokmål på [digilist.no](<http://digilist.no>) dekker eksplisitt både lokaletyper og kommunale bookingrutiner
- [ ] Posten er strukturert mot søkeintensjonen «kunnskap» / «Hva er et forsamlingslokale?» (måltermer finnes i tittel og brødtekst)
- [ ] CI er grønn — alle relevante tester og build passerer
- [ ] Ingen regresjon i eksisterende brukervendt oppførsel

## Testing Scenario

* Gitt en publisert artikkel, Når en leser åpner den, Så beskriver den minst én lokaletype OG minst én kommunal bookingrutine på Norsk Bokmål
* Gitt et søk på «kunnskap … forsamlingslokale», Når artikkelen er indeksert, Så finnes måltermene i tittel og brødtekst
* Gitt CI-pipelinen, Når endringen kjøres, Så er build og tester grønne uten regresjon i eksisterende oppførsel

## Verdi: unknown — ingen prioritet satt; et menneske vurderer verdien

Enhancement — ingenting er ødelagt, så ingen severity. Verdien er satt til unknown fordi issuet kun gir en auto-generert hypotese («search demand», «build authority», 94 % gap-konfidens) uten søkevolum, navngitte brukere, inntekt eller forpliktelse. Ingen evidens i teksten rettferdiggjør medium eller høy.

## Målrepo: `marketing`

*Valgt av triage fra sakens innhold; ruter forberedelsen dit.*

## Åpne spørsmål

* Hvilke konkrete søkevolum/nøkkelord underbygger verdien? Ingen tall oppgitt — trengs for å vurdere value over unknown
* Hvilke lokaletyper skal dekkes (forsamlingslokale, gymsal, møterom, …)?
* Målgruppe: offentlig/kommune eller privat utleier/leietaker? Ikke avklart
* Ny frittstående post eller utvidelse av eksisterende innhold? Kriteriet sier «create or expand» uten å peke på eksisterende artikkel
* Format, lengde, intern lenking og URL-struktur er ikke angitt

---

*Strukturert av triage-agenten. Originalteksten er bevart under.*

<details><summary>Opprinnelig beskrivelse</summary>

**SEO route:** content → `content-agent` · repo `marketing`

**Classification:** feature · severity major · priority P1

## Problem statement

Product gap: Content gap: Kunnskap om lokaletyper og rutiner. Educational content about facility types and municipal booking procedures can capture early-stage search intent and build authority. Current assessment: gap (feature, major).

## Scope

Create or expand content covering "Kunnskap om lokaletyper og rutiner" aligned with Educational content about facility types and municipal booking procedures can capture early-stage search intent and build authority.

## Out of scope

Changes outside the target repository for this issue. Unrelated refactors, drive-by fixes, or direct merges to main. Scope creep beyond the stated feature or improvement goal.

## Acceptance criteria

- [ ] Create or expand content covering "Kunnskap om lokaletyper og rutiner" aligned with Educational content about facility types and municipal booking procedures can capture early-stage search intent and build authority.
- [ ] All relevant tests and build pass (green CI).
- [ ] No regression in existing user-facing behaviour.

## Code analysis (evidence, marketing @ seo-run)

Status: **gap** (confidence 94%)

* (no direct code hits; see details)

## Source

Product idea (cluster:Hva er et forsamlingslokale?), from search demand

## Run as Claude loop (in `/root/booking-brilliance`, on a new branch)

```
/loop Write and publish SEO content for "Kunnskap om lokaletyper og rutiner". Cover Educational content about facility types and municipal booking procedures can capture early-stage search intent and build authority.. Goal: satisfy search intent for "kunnskap" on digilist.no. The blog post itself must be in Norwegian Bokmål.
```

---

*Auto-generated by Digilist Improvements Agent (Linear specialist) from cluster:Hva er et forsamlingslokale? + code analysis (graph @ seo-run). Move to the approval state to prepare an implementation branch.*

</details>

Linear: https://linear.app/xala-technologies/issue/XAL-653/content-gap-kunnskap-om-lokaletyper-og-rutiner
