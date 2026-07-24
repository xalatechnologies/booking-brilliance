# XAL-601: Rank-mulighet: «ssa-l» på plass 9.2 (131 visninger)

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Improve digilist.no to win search demand Google already shows us. «ssa-l» rangerer på snittplass 9.2 med 131 visninger, 1 klikk (CTR 0.8%) siste 28 dager — én sterkere side unna topp 3. Styrk siden som allerede rangerer for søket: mer dybde og aktualitet, interne lenker fra relaterte artikler, og schema. Make the ranking page and its SERP snippet more attractive — sharper title/meta, clearer value proposition, internal links, and depth — to lift CTR and position. Any new copy must be in Norwegian Bokmål.`

## Implementation contract — complete this before writing code
- **Problem:** Improve digilist.no to win search demand Google already shows us. «ssa-l» rangerer på snittplass 9.2 med 131 visninger, 1 klikk (CTR 0.8%) siste 28 dager — én sterkere side unna topp 3. Styrk siden som allerede rangerer for søket: mer dybde og aktualitet, interne lenker fra relaterte artikler, og schema. Make the ranking page and its SERP snippet more attractive — sharper title/meta, clearer value proposition, internal links, and depth — to lift CTR and position. Any new copy must be in Norwegian Bokmål.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-601-rank-mulighet-ssa-l-pa-plass-9-2-131-visninger`
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
- One issue → one branch (`agent/xal-601-rank-mulighet-ssa-l-pa-plass-9-2-131-visninger`) → one independently reviewable change. Never main.
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

Siden på [digilist.no](<http://digilist.no>) som allerede rangerer for søket «ssa-l» skal styrkes for å løfte posisjon og CTR. Per GSC siste 28 dager: snittposisjon 9.2, 131 visninger, 1 klikk, CTR 0.8% — ifølge issuet «én sterkere side unna topp 3». Tiltakene issuet nevner: mer dybde og aktualitet i innholdet, interne lenker fra relaterte artikler, schema-markup, og skarpere title/meta for et mer attraktivt SERP-snippet. Ny tekst skal være på norsk bokmål.

## Scope

**Innenfor:**

* Styrke den eksisterende siden som rangerer for «ssa-l» med mer dybde og oppdatert/aktuelt innhold
* Legge til interne lenker fra relaterte artikler inn til denne siden
* Legge til / forbedre schema-markup på siden
* Skarpere title og meta description for et mer attraktivt SERP-snippet
* All ny tekst på norsk bokmål

**Utenfor:**

* Endringer utenfor mål-repoet (marketing)
* Opprette en helt ny side — issuet gjelder å styrke en eksisterende side som allerede rangerer
* Urelaterte refactors, drive-by fixes eller direkte merge til main

## Acceptance Criteria

- [ ] Mål-siden for «ssa-l» har utvidet/oppdatert innhold (mer dybde og aktualitet) sammenlignet med før
- [ ] Title og meta description på siden er oppdatert
- [ ] Schema-markup er lagt til på siden og valideres uten feil (f.eks. Googles Rich Results Test)
- [ ] Minst én relatert artikkel inneholder en intern lenke til «ssa-l»-siden
- [ ] All ny/endret tekst er på norsk bokmål
- [ ] Alle relevante tester og bygg er grønne (CI), ingen regresjon i eksisterende brukervendt oppførsel

## Testing Scenario

* Given «ssa-l»-siden, When jeg åpner den etter endringen, Then title og meta description er nye og beskriver ssa-l tydeligere enn før.
* Given en relatert artikkel om samme tema, When jeg leser den, Then den inneholder minst én intern lenke som peker til «ssa-l»-siden.
* Given «ssa-l»-siden, When jeg kjører den gjennom Googles Rich Results Test, Then schema-markup gjenkjennes og valideres uten feil.
* Given det oppdaterte innholdet, When en norsktalende leser det, Then all ny tekst er på korrekt norsk bokmål.

## Verdi: low

Enhancement, ikke defect: siden rangerer og fungerer — dette er SEO-optimalisering, ikke en feil. Verdi satt til «low» fordi issuet gir konkret men svak søkedokumentasjon: 131 visninger og 1 klikk på 28 dager er lavt volum. Det er reell etterspørsel (ikke «unknown»), men liten. Ranking-utfallet (topp 3 / høyere CTR) er et etterslepende mål som avhenger av Google og ikke kan verifiseres ved merge — derfor er akseptkriteriene formulert som utførte tiltak, ikke oppnådd posisjon.

## Målrepo: `marketing`

*Valgt av triage fra sakens innhold; ruter forberedelsen dit.*

## Åpne spørsmål

* Hvilken konkret side/URL/slug rangerer for «ssa-l»? Issuet identifiserer den ikke.
* Hvilke og hvor mange relaterte artikler skal lenke inn til siden?
* Hvilken schema-type forventes (Article, FAQPage, BreadcrumbList, e.l.)?
* Hva er det tallfestede suksesskriteriet og over hvilken periode? «topp 3» er implisitt men ikke definert med målposisjon/CTR.

---

*Strukturert av triage-agenten. Originalteksten er bevart under.*

<details><summary>Opprinnelig beskrivelse</summary>

**SEO route:** content → `content-agent` · repo `marketing`

**Classification:** feature · severity major · priority P1

## Problem statement

Product gap: Rank-mulighet: «ssa-l» på plass 9.2 (131 visninger). «ssa-l» rangerer på snittplass 9.2 med 131 visninger, 1 klikk (CTR 0.8%) siste 28 dager — én sterkere side unna topp 3. Styrk siden som allerede rangerer for søket: mer dybde og aktualitet, interne lenker fra relaterte artikler, og schema. Current assessment: gap (feature, major).

## Scope

Optimize the existing page for search demand Google already shows: «ssa-l» rangerer på snittplass 9.2 med 131 visninger, 1 klikk (CTR 0.8%) siste 28 dager — én sterkere side unna topp 3. Styrk siden som allerede rangerer for søket: mer dybde og aktualitet, interne lenker fra relaterte artikler, og schema.

## Out of scope

Changes outside the target repository for this issue. Unrelated refactors, drive-by fixes, or direct merges to main. Scope creep beyond the stated feature or improvement goal.

## Acceptance criteria

- [ ] Optimize the existing page for search demand Google already shows: «ssa-l» rangerer på snittplass 9.2 med 131 visninger, 1 klikk (CTR 0.8%) siste 28 dager — én sterkere side unna topp 3. Styrk siden som allerede rangerer for søket: mer dybde og aktualitet, interne lenker fra relaterte artikler, og schema.
- [ ] All relevant tests and build pass (green CI).
- [ ] No regression in existing user-facing behaviour.

## Code analysis (evidence, marketing @ seo-run)

Status: **gap** (confidence 95%)

* (no direct code hits; see details)

## Source

Product idea (gsc:striking:ssa-l), from search demand

## Run as Claude loop (in `/root/booking-brilliance`, on a new branch)

```
/loop Improve digilist.no to win search demand Google already shows us. «ssa-l» rangerer på snittplass 9.2 med 131 visninger, 1 klikk (CTR 0.8%) siste 28 dager — én sterkere side unna topp 3. Styrk siden som allerede rangerer for søket: mer dybde og aktualitet, interne lenker fra relaterte artikler, og schema. Make the ranking page and its SERP snippet more attractive — sharper title/meta, clearer value proposition, internal links, and depth — to lift CTR and position. Any new copy must be in Norwegian Bokmål.
```

---

*Auto-generated by Digilist Improvements Agent (Linear specialist) from gsc:striking:ssa-l + code analysis (graph @ seo-run). Move to the approval state to prepare an implementation branch.*

</details>

Linear: https://linear.app/xala-technologies/issue/XAL-601/rank-mulighet-ssa-l-pa-plass-92-131-visninger
