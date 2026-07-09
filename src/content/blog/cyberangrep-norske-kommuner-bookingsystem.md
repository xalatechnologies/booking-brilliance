---
slug: cyberangrep-norske-kommuner-bookingsystem
title: "Cyberangrep mot norske kommuner: bookingsystem i fare?"
description: "Norske kommuner rammes av cyberangrep oftere enn før. Hva betyr trusselbildet for bookingsystemet ditt, og hvilke spørsmål bør CIO stille?"
date: 2026-05-15
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 7
tag: "Sikkerhet"
cover: "/images/blog/gdpr_iso27001_hero_no.webp"
keywords: ["cyberangrep", "ransomware", "kommune", "bookingsystem", "NSM", "kommunal sikkerhet"]
---

Østre Toten i januar 2021. Akershus fylkeskommune sommeren 2022. Sør-Varanger sent i 2023. Stortinget i 2020 og igjen i 2022. Mønsteret er etablert: norsk offentlig sektor er et legitimt mål for organiserte cyberkriminelle, og kommunene står ofte først i køen fordi de behandler både innbyggerdata og betalinger.

For en kommunal IT-leder som planlegger en ny bookingplattform er det rimelig å spørre: hva betyr egentlig dette trusselbildet for systemet vi velger?

## Hva trusselaktørene faktisk er ute etter

Cyberkriminelle som retter seg mot norske kommuner følger som regel én av tre logikker:

1. **Ransomware mot drift.** Mål: kryptere alt og selge tilbake nøkkelen. Bookingsystem er attraktivt fordi det blokkerer publikumstjenester umiddelbart. Kommunen mister inntekt og innbyggertillit i samme øyeblikk.
2. **Datatyveri for ekstortion.** Mål: stjele persondata og kreve løsepenger mot at de ikke publiseres. Bookingsystemer inneholder navn, e-post, telefonnummer, betalingsspor, og av og til informasjon om bevegelsesmønstre (når er innbyggeren på idrettshall? på kulturhus?).
3. **Phishing mot ansatte.** Mål: lure én kommuneansatt til å oppgi passord. Da har angriperen et utgangspunkt for å bevege seg sidelengs i nettverket.

NSMs trusselvurderinger for de siste tre årene har konsistent flagget pkt. 1 og 2 som økende. Ransomware-as-a-service betyr at terskelen for å gjennomføre angrep har sunket, mens betalingsviljen, særlig fra offentlige aktører med kritiske tjenester, har vært stabil.

## Bookingsystem som angrepsflate

Et bookingsystem er en sårbar overflate av flere grunner:

- **Eksponert mot internett.** Innbyggere må kunne booke fra hjemmenettet. Systemet kan ikke gjemmes bak en VPN. Hvert API-endepunkt er en potensiell inngang.
- **Behandler betaling.** PCI-DSS-krav er strenge, men kompromisset er at en lekket session-token kan oversettes til reell skade.
- **Knyttet til kommunens identitetssystem.** Hvis bookingsystemet bruker ID-porten korrekt, er dette en styrke. Hvis det bruker eget passord-regime som ikke er FIDO2-kompatibelt, er det en svakhet.
- **Synlig SLA.** Innbyggere som ikke kommer inn på bookingportalen ringer kommunen samme dag. Det øker betalingspresset i en ransomware-situasjon.

## Hva en moderne plattform faktisk gjør med dette

Digilist er bygget på Convex (managed serverless runtime), med data lagret i Norge og EU. Det betyr at angrepsflaten ser annerledes ut enn for et tradisjonelt selvhostet system:

- **Ingen vedlikeholdsvinduer der vi patcher servere.** Convex og våre databaser oppdateres kontinuerlig av leverandøren, med automatisk failover. En kommune kan ikke selv glemme en sikkerhetsoppdatering.
- **Hver mutasjon går gjennom revisorspor.** Alt som endrer data (bookinger, betalinger, brukerrettigheter) skrives til en separat audit-tabell som ikke kan slettes av en kompromittert administrator.
- **Tenant-isolasjon på funksjonsnivå.** En kompromittert konto i én kommune har ingen direkte vei til en annen kommune sin data. Det er ikke et delt skjema med tenant-ID som filter. Det er funksjoner som validerer rettigheter på serversiden ved hvert kall.
- **ID-porten + BankID for høyverdige handlinger.** Innbyggere logger inn med BankID. Saksbehandlere logger inn med ID-porten. Passordfri innlogging fjerner den vanligste angrepsvektoren.

## Det vi ikke kan love

Ingen plattform kan love at den aldri blir angrepet. Det vi kan love er at:

- Vi har ISO 27001 og ISO 27701 fra dag én, og er forberedt på SSA-L 2026.
- Beredskapsplanen er skrevet, øvd og oppdatert hvert halvår, ikke et word-dokument i en mappe ingen åpner.
- Data ligger i EU/EØS med backup i samme region.
- Vi har dedikert en del av roadmapen til penetrasjonstesting og sårbarhetshåndtering. Det er ikke en eksern revisjon én gang i året. Det er et kontinuerlig løp.

## Spørsmål en kommune-CIO bør stille

Når neste anskaffelse kommer:

1. Hvor lagres dataene fysisk, og hvor ligger backupen?
2. Hva er RPO og RTO ved et katastrofescenario?
3. Hvilken type pålogging brukes for innbyggere? For saksbehandlere?
4. Hvordan rapporteres en sikkerhetshendelse til kommunen? Innen hvilken tidsramme?
5. Hvor ofte gjennomføres penetrasjonstest, og er rapporten tilgjengelig under NDA?
6. Hvor mange åpne sårbarheter har systemet akkurat nå?

Svaret på det siste spørsmålet er det mest avslørende. Et åpent svar er et godt tegn. Et unnvikende svar er et rødt flagg.

## Veien videre

Trusselbildet kommer til å forverres, ikke forbedres. Norske kommuner som velger plattformer i 2026 og 2027 må anta at angrepet kommer. Spørsmålet er bare når. Det å bygge inn motstandskraft er ikke lenger et pluss, det er en grunnlinje.

Vil du vite mer om hvordan Digilist er bygget for å motstå angrep? [Book en demo](#kontakt) eller les videre om [GDPR, ISO 27001 og datalokasjon](/blogg/gdpr-iso-datalokasjon-norge).
