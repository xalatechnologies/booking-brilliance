---
slug: faktura-refusjon-avstemming
title: "Fakturering, refusjoner og avstemming — økonomimotoren i Digilist"
description: "Hvordan en booking blir til en faktura, hvordan en kansellering blir til en refusjon, og hvordan kommunens regnskap får tallene som stemmer — uten Excel."
date: 2026-06-01
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 7
tag: "Økonomi"
cover: "/images/blog/somlos_betaling_hero_no.webp"
keywords: ["fakturering", "EHF", "Peppol", "refusjon", "avstemming", "regnskap", "Visma Tripletex Fiken PowerOffice", "økonomi kommunal booking"]
---

For en bookings­plattform er økonomi­motoren den som skiller seriøse løsninger fra hobby­prosjekter. Det er enkelt å lage en booking. Det er hardere å sørge for at hver booking blir til riktig faktura, hver kansellering til riktig refusjon, og hver krone som beveger seg lander i kommunens regnskap med riktig konto­kode.

Digilist har tre lag i økonomi­motoren: **innkreving** (hvor pengene kommer fra), **fakturering** (dokumentet som signaliserer hva som skylde­s), og **avstemming** (hvor pengene havner og hvordan regnskapet ser det).

## I. Innkreving — fire kanaler

**Vipps.** Standardvalg for privat­personer. Push-melding til Vipps-appen, kunden bekrefter, vi får oppgjør på 2–4 sekunder. Refusjon med ett klikk fra admin. Vippsene avregnes til kommunens Vipps-konto direkte.

**Stripe Connect.** Kort­betaling for kunder som ikke har Vipps eller fra utland. Beløpet trekkes fra kortet, sitter på Digilists Stripe Connect-platform­konto i et øyeblikk, og betales ut til kommunens bank­konto neste virke­dag. Avgiftene er Stripes standard (1.4% + 2 kr for europeiske kort).

**EHF/Peppol-faktura.** For organisasjons­kunder (lag, bedrifter). Kunden booker, faktura sendes via Peppol-nettverket til deres EHF-mottak. Forfall typisk 14 eller 30 dager. Vi varsler om forfall, men inkasso håndteres av kommunens egen rutine.

**Manuell faktura.** For tilfeller der kunden ikke har EHF-mottak (smårere lag, privat­personer som velger faktura). PDF-faktura sendes på e-post med KID-nummer. Innbetalinger spores via OCR-fil fra banken.

Kommunen velger hvilke kanaler som tilbys per anlegg eller per kundetype. Et selskaps­lokale på lørdag — Vipps og kort. En idretts­hall til Skien IF — EHF. En sesong­leie til en pensjonist­forening — manuell faktura.

## II. Faktura­generering

Hver booking har et faktura­grunnlag. Grunnlaget inneholder:

- Linjer (lokale, time­pris × antall timer, eventuelle tillegg)
- MVA-håndtering (kommunale tjenester ofte unntatt, men ikke alltid)
- Konto­kode (matchet til kommunens kontoplan)
- Kostnads­sted (anleggets ansvarskode)
- Periode (hvilken regnskaps­periode hører dette til)

Faktura­grunnlaget genereres automatisk når en booking bekreftes. Det går videre til faktura — enten direkte til EHF, eller til en PDF-faktura — eller til den valgte regnskaps­integrasjonen (se under).

Vi støtter også **forskudds­fakturering** (kunde betaler ved booking, ikke ved bruk), **etter­fakturering** (kunde betaler etter bruk, typisk for sesong­leie), og **delt fakturering** (deposit forskudd, sluttoppgjør etter).

## III. Refusjoner

Refusjoner er det enkleste å gjøre feil i et bookings­system. Vi har fokusert på å gjøre det enkelt riktig.

**Auto-refusjon.** Hvis kansellering skjer innenfor regelens grense (typisk 14 eller 7 dager før), refunderes automatisk når saks­behandler god­kjenner kanselleringen.

**Delvis refusjon.** Hvis kansellerings­regelen sier «80% refunderes hvis innen 7 dager», beregner plattformen automatisk beløpet og refunderer det. Restbeløpet blir igjen som inntekt.

**Refusjons­sporing.** Hver refusjon har sitt eget revisjons­spor: hvem god­kjente, hvilken regel som gjaldt, hvilket beløp, hvilken kanal det gikk via, hva kunden ble fortalt.

**Cross-kanal refusjon.** Betalte med Vipps, men ønsker refusjon til bankk­onto? Vi støtter manuell over­føring og logger den tilsvarende. Brukes sjelden — Vipps-til-Vipps er standard.

## IV. Regnskaps­integrasjoner

Manuell over­føring av tall fra bookings­system til regnskap er ikke bare arbeid — det er en feilkilde. Digilist sender data direkte til:

- **Visma eAccounting** — den vanligste i norske kommuner. Faktura­grunnlag, inn­betalinger, refusjoner pushes via API.
- **Tripletex** — populært for selskaps­lokaler og kommunale foretak.
- **Fiken** — for mindre utleiere.
- **PowerOffice Go** — for kommuner som har den.
- **DNB Regnskap** — for kunder i DNB-økosystemet.
- **EHF/Peppol direkte** — uten å gå via et regnskaps­system, hvis kommunen ikke har en av de overnevnte.

For hver integrasjon mapper vi:

- Konto­plan-koder (debet og kredit)
- Kostnads­steder (per anlegg eller etat)
- MVA-koder (per produkt­type)
- Kunde­numre (oppslag mot kommunens kunde­register)

Konfigurasjonen gjøres én gang under onboarding. Etter det er bookings-til-regnskap-flyten autonom.

## V. Avstemming

Avstemming er der det blir litt komplisert: penger som kommer inn må matches mot fakturaer som er sendt, og restanser må følges opp. Digilist gjør tre ting for å holde regnskaps­avdelingen i god humør:

**Real-time dashboard.** Forecast på inntekter denne måneden, restanser, refusjoner, gjenstående faktura­grunnlag som ikke er prosessert. Det dashboardet er det første en kommunal øko­nomi­ansvarlig spør om i demoen.

**OCR-import.** Kommunens bank sender en daglig OCR-fil med innbetalinger. Digilist matcher den mot åpne fakturaer og merker dem som betalt. Manuell håndtering trengs kun for mismatch — typisk når en kunde har betalt feil beløp.

**Måneds­rapporter.** Den 1. i hver måned genereres en rapport over forrige måneds inntekter per anlegg, refusjoner, restanser, og MVA-spesifikasjon. Klar til revisor.

## Hva sliter et bookings­system mest med?

Komplekse betalings­flyter med kombinasjoner. Eksempel: et lag bestiller sesong­leie for hele vinteren, betaler 30% forskudd nå, resten faktureres månedlig, og hvis de avlyser en enkelt­time refunderes time­pris automatisk fra forskuddet.

Vi har bygd modulen som håndterer dette med [Pricing v2-arkitekturen](/blogg/somlos-betaling-vipps-ehf) som beskrives mer detaljert der. Kort fortalt: hver bookings-line-item har sin egen livssyklus, kan flyttes mellom forskudd og etter­fakturering, og inntekts­føres på riktig periode automatisk.

Det er ikke magisk. Det er disiplinert datamodellering, og det er forskjellen mellom et bookings­system som passer til en mat­butikk og et som tåler en kommune.

