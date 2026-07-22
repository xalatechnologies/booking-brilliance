# XAL-320: Lighthouse Ytelse-score 81/100 (mål ≥90). (lighthouse.performance)

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop I marketing-repoet skal du forbedre Lighthouse ytelse-score for status.digilist.no fra 81 til minst 90.

Kontekst: Statussiden bygges med React og har komponenter som ScoreChip i src/pages/Transparens.tsx. Det finnes i dag ingen ytelsesmåling eller ytelsesbudsjett i repoet (søk på lighthouse og performance gir null treff).

Gjør følgende:
1. Kjør en Lighthouse-analyse (mobil og desktop) mot statussidens produksjonsbuild lokalt, og identifiser de største bidragsyterne til lav score: LCP, Total Blocking Time, Cumulative Layout Shift, render-blocking ressurser, uoptimaliserte bilder og for stor initial JS-bundle.
2. Implementer konkrete forbedringer basert på funnene, for eksempel:
   - Legg til route-basert code splitting og lazy-loading (React.lazy/Suspense) for tunge sider og komponenter.
   - Optimaliser bilder (moderne formater som WebP/AVIF, riktig dimensjonering, width/height for å unngå layout shift, loading="lazy").
   - Fjern eller utsett render-blocking JS/CSS, preload kritiske ressurser og fonter med font-display: swap.
   - Reduser ubrukt JavaScript og tredjeparts-skript på statussiden.
3. Innfør et ytelsesbudsjett i CI som kjører Lighthouse (for eksempel via @lhci/cli) mot statussiden, med terskel performance >= 0.90, slik at regresjoner fanges opp automatisk. Legg konfigurasjonen i repoet og dokumenter kort hvordan den kjøres.

Akseptansekriterier:
- Lighthouse ytelse-score for https://status.digilist.no er minst 90 i lokal måling mot produksjonsbuild.
- CI-jobb med Lighthouse-budsjett feiler hvis score faller under 0.90.
- Ingen visuell regresjon på statussiden.
- Alle eksisterende tester og lint kjører grønt før PR opprettes.

Skriv norsk bokmål i commit-meldinger og PR-beskrivelse. Sørg for at build og tester er grønne før du åpner PR.`

## Implementation contract — complete this before writing code
- **Problem:** I marketing-repoet skal du forbedre Lighthouse ytelse-score for status.digilist.no fra 81 til minst 90.

Kontekst: Statussiden bygges med React og har komponenter som ScoreChip i src/pages/Transparens.tsx. Det finnes i dag ingen ytelsesmåling eller ytelsesbudsjett i repoet (søk på lighthouse og performance gir null treff).

Gjør følgende:
1. Kjør en Lighthouse-analyse (mobil og desktop) mot statussidens produksjonsbuild lokalt, og identifiser de største bidragsyterne til lav score: LCP, Total Blocking Time, Cumulative Layout Shift, render-blocking ressurser, uoptimaliserte bilder og for stor initial JS-bundle.
2. Implementer konkrete forbedringer basert på funnene, for eksempel:
   - Legg til route-basert code splitting og lazy-loading (React.lazy/Suspense) for tunge sider og komponenter.
   - Optimaliser bilder (moderne formater som WebP/AVIF, riktig dimensjonering, width/height for å unngå layout shift, loading="lazy").
   - Fjern eller utsett render-blocking JS/CSS, preload kritiske ressurser og fonter med font-display: swap.
   - Reduser ubrukt JavaScript og tredjeparts-skript på statussiden.
3. Innfør et ytelsesbudsjett i CI som kjører Lighthouse (for eksempel via @lhci/cli) mot statussiden, med terskel performance >= 0.90, slik at regresjoner fanges opp automatisk. Legg konfigurasjonen i repoet og dokumenter kort hvordan den kjøres.

Akseptansekriterier:
- Lighthouse ytelse-score for https://status.digilist.no er minst 90 i lokal måling mot produksjonsbuild.
- CI-jobb med Lighthouse-budsjett feiler hvis score faller under 0.90.
- Ingen visuell regresjon på statussiden.
- Alle eksisterende tester og lint kjører grønt før PR opprettes.

Skriv norsk bokmål i commit-meldinger og PR-beskrivelse. Sørg for at build og tester er grønne før du åpner PR.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-320-lighthouse-ytelse-score-81-100-mal-90-lighthouse`
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
- One issue → one branch (`agent/xal-320-lighthouse-ytelse-score-81-100-mal-90-lighthouse`) → one independently reviewable change. Never main.
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

[status.digilist.no](<http://status.digilist.no>) oppnår Lighthouse ytelse-score 81/100, under det scanner-satte målet ≥90. Statussiden bygges med React (komponenter som ScoreChip i src/pages/Transparens.tsx i marketing-repoet). Repoet har i dag ingen ytelsesmåling eller ytelsesbudsjett (søk på «lighthouse» gir 0 treff). Saken ber om å analysere flaskehalsene, gjennomføre optimaliseringer og innføre et Lighthouse-budsjett i CI. Kodeanalysen vurderer saken som «fixable» med 70 % konfidens.

## Scope

**Innenfor:**

* [status.digilist.no](<http://status.digilist.no>) i marketing-repoet
* Analysere hva som faktisk trekker ytelses-scoren ned
* Gjennomføre ytelsesoptimaliseringer for å nå score ≥90
* Innføre et Lighthouse-ytelsesbudsjett i CI med terskel performance ≥ 0.90

**Utenfor:**

* Andre Digilist-sider enn [status.digilist.no](<http://status.digilist.no>) (saken nevner ingen)
* Endringer i dette fleet-pakke-repoet (arbeidet ligger i marketing-repoet)

## Acceptance Criteria

- [ ] Lighthouse ytelse-score for [status.digilist.no](<http://status.digilist.no>) er minst 90 målt lokalt mot produksjonsbuild
- [ ] En CI-jobb kjører Lighthouse mot statussiden og feiler når score faller under 0.90
- [ ] Ingen visuell regresjon på statussiden
- [ ] Alle eksisterende tester og lint kjører grønt før PR opprettes

## Testing Scenario

*Ikke oppgitt i saken.*

## Verdi: unknown — ingen prioritet satt; et menneske vurderer verdien

Enhancement, ikke defekt: statussiden fungerer, scoren (81) ligger bare under et mål (≥90) som scanneren selv har satt — ingen lovnad om ≥90 finnes i saken, og det etterspurte CI-budsjettet finnes ikke fra før (nytt arbeid). Verdi er unknown fordi saken ikke navngir noen bruker som er blokkert, ingen inntekt og ingen forpliktelse — kun en automatisk scanner-terskel. Ikke gjettet «low»; det er en dom ingen har felt ennå.

## Åpne spørsmål

* Hvem etterspør ≥90, og hvorfor betyr det noe? Er det en forpliktelse, en kundeklage eller kun scanner-terskelen? (ingen belegg for verdi i saken)
* Hvilke flaskehalser trekker faktisk scoren ned? Saken lister LCP, TBT, CLS, uoptimaliserte bilder, render-blocking JS/CSS og manglende code splitting som ting å ANALYSERE — ingen er bekreftet som årsak.
* Gjelder ≥90-kravet mobil, desktop eller begge? Loop-teksten ber om analyse for både mobil og desktop, men akseptansekriteriet oppgir bare én terskel.
* Hvilket CI-system brukes i marketing-repoet, og finnes det allerede en pipeline å legge Lighthouse-budsjettet inn i?
* Er «lokal måling mot produksjonsbuild» tilstrekkelig, eller kreves måling mot live [https://status.digilist.no](<https://status.digilist.no>) for å regne kriteriet som oppfylt?

---

*Strukturert av triage-agenten. Originalteksten er bevart under.*

<details><summary>Opprinnelig beskrivelse</summary>

## Mål

Optimaliser [status.digilist.no](<http://status.digilist.no>) for å nå Lighthouse ytelse-score ≥90: analyser hovedflaskehalser (LCP, TBT, CLS, uoptimaliserte bilder, render-blocking JS/CSS, manglende code splitting), reduser initial bundle, legg til lazy-loading og korrekte bildeformater, og innfør et ytelsesbudsjett i CI.

## Kilde

Skann-funn: performance/warn — [https://status.digilist.no](<https://status.digilist.no>)

## Kodeanalyse (bevis, marketing @ 7142d7e8)

Status: **fixable** (konfidens 70 %)

* `src/pages/Transparens.tsx/ScoreChip` — statusside har komponenter, men ingen ytelsesbudsjett eller Lighthouse-oppsett funnet
* `lighthouse (0 treff)` — ingen ytelsesmåling eller optimalisering i repo

## Akseptansekriterier

- [ ] Optimaliser [status.digilist.no](<http://status.digilist.no>) for å nå Lighthouse ytelse-score ≥90: analyser hovedflaskehalser (LCP, TBT, CLS, uoptimaliserte bilder, render-blocking JS/CSS, manglende code splitting), reduser initial bundle, legg til lazy-loading og korrekte bildeformater, og innfør et ytelsesbudsjett i CI.
- [ ] Tester og bygg grønne
- [ ] Ingen regresjon i eksisterende funksjonalitet

## Kjør som Claude-loop (i `/Volumes/Laravel/Loveable/booking-brilliance`, på en ny branch)

```
/loop I marketing-repoet skal du forbedre Lighthouse ytelse-score for status.digilist.no fra 81 til minst 90.

Kontekst: Statussiden bygges med React og har komponenter som ScoreChip i src/pages/Transparens.tsx. Det finnes i dag ingen ytelsesmåling eller ytelsesbudsjett i repoet (søk på lighthouse og performance gir null treff).

Gjør følgende:
1. Kjør en Lighthouse-analyse (mobil og desktop) mot statussidens produksjonsbuild lokalt, og identifiser de største bidragsyterne til lav score: LCP, Total Blocking Time, Cumulative Layout Shift, render-blocking ressurser, uoptimaliserte bilder og for stor initial JS-bundle.
2. Implementer konkrete forbedringer basert på funnene, for eksempel:
   - Legg til route-basert code splitting og lazy-loading (React.lazy/Suspense) for tunge sider og komponenter.
   - Optimaliser bilder (moderne formater som WebP/AVIF, riktig dimensjonering, width/height for å unngå layout shift, loading="lazy").
   - Fjern eller utsett render-blocking JS/CSS, preload kritiske ressurser og fonter med font-display: swap.
   - Reduser ubrukt JavaScript og tredjeparts-skript på statussiden.
3. Innfør et ytelsesbudsjett i CI som kjører Lighthouse (for eksempel via @lhci/cli) mot statussiden, med terskel performance >= 0.90, slik at regresjoner fanges opp automatisk. Legg konfigurasjonen i repoet og dokumenter kort hvordan den kjøres.

Akseptansekriterier:
- Lighthouse ytelse-score for https://status.digilist.no er minst 90 i lokal måling mot produksjonsbuild.
- CI-jobb med Lighthouse-budsjett feiler hvis score faller under 0.90.
- Ingen visuell regresjon på statussiden.
- Alle eksisterende tester og lint kjører grønt før PR opprettes.

Skriv norsk bokmål i commit-meldinger og PR-beskrivelse. Sørg for at build og tester er grønne før du åpner PR.
```

---

*Auto-generert av Digilist Improvements Agent fra performance/lighthouse.performance@

Linear: https://linear.app/xala-technologies/issue/XAL-320/lighthouse-ytelse-score-81100-mal-90-lighthouseperformance
