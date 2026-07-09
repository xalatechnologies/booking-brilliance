---
slug: penetrasjonstesting-sikkerhetsrevisjon-saas-leverandor
title: "Penetrasjonstesting: hva en SaaS-leverandør skal levere"
description: "Hva betyr egentlig at en SaaS-leverandør er sikker? Pen-test, sårbarhetshåndtering og supply-chain: sjekkliste for kommunal anskaffelse."
date: 2026-05-15
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 7
tag: "Sikkerhet"
cover: "/images/blog/gdpr_iso27001_hero_no.webp"
keywords: ["penetrasjonstesting", "pen-test", "sikkerhetsrevisjon", "supply chain", "Dependabot", "Snyk", "anskaffelse"]
---

Når en norsk kommune skal velge ny SaaS-leverandør, dukker spørsmålet om sikkerhet alltid opp, men ofte med altfor brede formuleringer. "Leverandøren skal følge gjeldende sikkerhetsstandarder." Hva betyr det egentlig? Hva er forskjellen mellom en leverandør som faktisk gjør arbeidet og en som har sertifikatet på veggen?

Denne artikkelen er en praktisk guide for kommunens IT-leder eller anskaffelsesansvarlig: hva penetrasjonstesting og sikkerhetsrevisjon faktisk skal innebære, og hvilke spørsmål du bør stille.

## Penetrasjonstest, sårbarhetsskanning og kodevurdering

Tre forskjellige aktiviteter blir ofte slått sammen under "sikkerhetstesting":

- **Sårbarhetsskanning (Vulnerability scanning).** Automatisert verktøy som leter etter kjente sårbarheter. Rimelig, kjøres ofte (helst daglig). Verktøy: OWASP ZAP, Nessus, Qualys.
- **Penetrasjonstest (Penetration test).** Manuell, av en sikkerhetsekspert som forsøker å bryte inn. Mer grundig, men dyrere. Bør kjøres minst én gang per år, og ved større endringer.
- **Kodevurdering (Code review / SAST).** Statisk analyse av kildekoden. Skal være integrert i utviklerflyten, ikke en kvartalsvis aktivitet.

Et godt sikkerhetsprogram har alle tre. En leverandør som bare har ett, dekker bare deler av angrepsflaten.

## Hva en penetrasjonstest faktisk gir

En typisk leveranse fra en penetrasjonstest:
- Rapport med funn, klassifisert etter alvorlighetsgrad (kritisk / høy / middels / lav).
- Detaljert beskrivelse av hver sårbarhet med stegene for å reprodusere.
- Anbefalt utbedring.
- Etterprøving etter at utbedringen er gjennomført.

En kommune som signerer NDA bør ha rett til å se sammendraget av siste pen-test før kontraktssignering. Et leverandørsvar som er "vi gjør pen-test men kan ikke dele resultater" er et rødt flagg. Et leverandørsvar som er "her er sammendraget under NDA, vi har stengt alle kritiske funn og kan dokumentere det" er det riktige svaret.

## Sårbarhetshåndtering: den daglige delen

Pen-test er punktnedslag. Den daglige sikkerheten handler om kontinuerlig sårbarhetshåndtering. Dette er hva en moderne SaaS-leverandør faktisk gjør (eller skal gjøre):

### Avhengighetsoppdateringer

Et typisk moderne system har 500+ tredjeparts-avhengigheter (npm-pakker, system-pakker, container-images). Nye sårbarheter publiseres daglig.

- **GitHub Dependabot** eller **Snyk** overvåker hvilke avhengigheter som har CVE-er.
- Kritiske CVE-er blir patchet innen 48 timer.
- Høy-alvorlighetsgrad blir patchet innen 7 dager.
- Resten følger normal cadens (ukentlig).

En leverandør som ikke kan svare på "hvor mange sårbarheter har du åpne akkurat nå?" har sannsynligvis ikke et fungerende program.

### Supply chain: der angrepene kommer fra nå

Supply chain-angrep er der angriperen kompromitterer en tredjeparts-pakke som mange systemer bruker. Eksempler: SolarWinds (2020), node-ipc (2022), xz-utils (2024).

Forsvar:
- Pakke-pinning. Bruk eksakte versjoner, ikke "latest".
- Lockfile-validering. Bekreft at den installerte versjonen samsvarer med det som er testet.
- Builds i isolerte miljøer.
- Signaturverifikasjon der det er tilgjengelig.

For en kommune i en anskaffelse: spør hva leverandøren gjør med supply chain. Et tomt svar er en advarsel.

### Hemmelighetsskanning

GitHub Secret Scanning, truffleHog eller lignende verktøy som leter etter ved et uhell innsjekkede API-nøkler. Et team som bruker disse vil oppdage et lekket Stripe-nøkkel innen minutter, ikke uker.

## Bug bounty og ansvarlig sårbarhetsrapportering

Større SaaS-leverandører tilbyr bug bounty: en betalingsstruktur for at eksterne forskere skal rapportere sårbarheter ansvarlig. Mindre leverandører har minst en `security.txt`-fil med kontaktinformasjon for sikkerhetsforskere.

Hvis en leverandør ikke har en kanal for å motta sårbarhetsrapporter fra eksterne, betyr det at en forsker som finner noe må enten varsle leverandøren via vanlige kanaler (som ofte ignoreres) eller publisere funnet, i verste fall sammen med eksploiten.

Sjekk om leverandøren har `https://digilist.no/.well-known/security.txt`. Hvis ikke, spør hvorfor.

## ISO 27001 vs faktisk arbeid

ISO 27001-sertifisering betyr at en uavhengig revisor har bekreftet at organisasjonen har et fungerende informasjonssikkerhetsstyringssystem (ISMS) på revisjonstidspunktet. Det betyr ikke at systemet ikke har sårbarheter.

Sertifisering er en grunnlinje, ikke et endepunkt. En leverandør med ISO 27001 og en aktiv pen-test-rapport er det du vil ha. En leverandør med bare ISO 27001 og ingen pen-test, har klart en revisjon, men ikke nødvendigvis bygget et sikkert system.

## Sjekkliste: det du bør spørre om i anskaffelse

Konkret bør du spørre om dette:

1. **Penetrasjonstest:** Hvor ofte? Hvem utfører? Kan vi se sammendraget under NDA?
2. **Sårbarhetshåndtering:** Hvor mange åpne sårbarheter har dere akkurat nå? Hva er SLA for kritisk / høy?
3. **Avhengighetsoppdateringer:** Dependabot / Snyk / annet? Hvor ofte oppdateres avhengigheter?
4. **Supply chain:** Hvilke tiltak? Lockfile-validering? Pinning?
5. **Hemmelighetsskanning:** Aktiv? Hvilket verktøy?
6. **Sikkerhetshendelse-rapportering:** `security.txt`? Bug bounty? Responstid?
7. **ISO 27001:** Når sist revidert? Hvilket revisjonsfirma?
8. **Kodevurdering:** SAST i CI? Hvilken dekning?

Et leverandørtilbud bør kunne svare på alle åtte uten ekstra spørreruner. Hvis svarene er vage eller "vi kommer tilbake til deg", er det informasjon i seg selv.

## Hva Digilist gjør

For ordens skyld:

- Pen-test gjennomføres årlig av eksternt firma. Sammendrag er tilgjengelig under NDA for kommuner i anskaffelse.
- Dependabot er aktivt på alle repositorier. Kritiske CVE-er har 48-timers SLA. Status er offentlig på et internt sikkerhetsdashboard.
- Supply chain: pakkene er pinned, lockfile-validering ved hver deploy, npm audit i CI.
- `security.txt` ligger på `digilist.no/.well-known/security.txt`.
- ISO 27001 fra dag én. ISO 27701 på samme spor.
- SAST integrert i CI gjennom typecheck + linting + dependency-scanning.

Det er ikke en garanti mot angrep. Det er et fungerende program som gjør angrep dyrere for angriperen og raskere å oppdage for oss.

## Veien videre

Sikkerhetsrevisjon er ikke et engangsarbeid. Det er et kontinuerlig program. En leverandør som forstår dette, er en leverandør du kan stole på over tid.

Vil du lese videre? Se [Cyberangrep mot norske kommuner](/blogg/cyberangrep-norske-kommuner-bookingsystem) for trusselbildet eller [DDoS og ransomware: beredskap](/blogg/ddos-ransomware-beredskap-bookingplattform) for hva som skjer hvis angrepet kommer.
