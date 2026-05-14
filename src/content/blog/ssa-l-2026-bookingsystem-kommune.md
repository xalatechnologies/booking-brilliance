---
slug: ssa-l-2026-bookingsystem-kommune
title: "Hva kreves av et kommunalt bookingsystem i 2026?"
description: "SSA-L 2026 setter nye krav til kommunale bookingsystemer. Vi går gjennom sanntid, sesongleie, ID-porten, EHF og hva som skal til for å oppfylle kravspesifikasjonen."
date: 2026-05-14
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 8
tag: "Anskaffelse"
cover: "/images/blog/ssal_2026_booking_hero.webp"
keywords: ["SSA-L 2026", "kommunalt bookingsystem", "anskaffelse", "kravspesifikasjon", "Digdir"]
---

Norske kommuner som anskaffer bookingsystem i 2026 møter et tydeligere kravbilde enn noen gang. SSA-L 2026 — Statens Standardavtale for løsninger — kombinert med digitaliseringsdirektoratets (Digdir) føringer for offentlige tjenester, definerer en høy bunnplanke: sanntidstilgjengelighet, ID-porten-autentisering, EHF-fakturering, universell utforming og ISO 27001-sertifisering er ikke lenger «nice to have», men forutsetninger for å delta i konkurransen.

## Sanntidstilgjengelighet — fundament, ikke funksjon

Sanntid er det første kravet enhver kommunal innbygger merker. Når en innbygger søker etter ledig treningstid i en idrettshall, må kalenderen vise det som er ledig _nå_, ikke en versjon fra siste nattlige synkronisering. Tre underkrav følger:

1. **Reaktive oppdateringer.** Når en booking bekreftes eller avlyses, oppdateres kalenderen umiddelbart for alle andre brukere. Ingen polling, ingen refresh-knapper.
2. **Konfliktdeteksjon.** Plattformen må forhindre dobbeltbookinger på samme tidsrom, også når to brukere booker samtidig.
3. **Reservasjon under booking.** Tid skal låses mens brukeren fyller ut betalingsskjema — typisk 5–10 minutter — for å unngå at vinduet forsvinner mens kortet legges inn.

For Digilist løses dette med Convex' reaktive runtime: spørringer abonnerer på underliggende data og publiserer endringer på millisekunder.

## Sesongleie med regelstyrt fordeling

Idrettslag, kulturskoler og foreninger leier kommunale lokaler i sesonger — typisk høst (sept–des) og vår (jan–juni). Manuell tildeling er tidkrevende og opplever ofte klager om favorisering.

SSA-L 2026 krever derfor:

- Egen søknadsportal for lag og foreninger (BRREG-verifisert)
- Regelstyrt fordelingsforslag basert på kommunens prioriteringsregler
- Saksbehandlerverktøy for justering før godkjenning
- Rapportering på kapasitetsutnyttelse, tilskudd og fordeling

Digilists sesongleie-modul implementerer alle disse kravene, og lar saksbehandleren overprøve forslaget der lokale forhold krever det.

## ID-porten + BankID — Norge-tilpasset autentisering

Innbyggere skal logge inn via ID-porten med BankID, MinID eller andre godkjente metoder. Organisasjoner skal verifiseres mot Brønnøysundregisteret (BRREG). Dette er ikke valgfritt — det er en del av SSA-Ls krav om sikker autentisering og datakvalitet.

For utenlandske SaaS-leverandører er dette en betydelig integrasjonskostnad. For Digilist, bygget på norsk grunn, er det første integrasjon vi etablerte.

## EHF-fakturering og regnskapsintegrasjon

Faktura til kommunale enheter må sendes via EHF (Elektronisk Handelsformat) over Peppol-nettverket. Digilist genererer EHF-faktura automatisk ved bookingfullføring og kan integreres direkte mot kommunens regnskapssystem — Visma eAccounting, Tripletex, Fiken, PowerOffice eller DNB Regnskap.

## Universell utforming, ISO og GDPR

- **WCAG 2.0 AA** er minimumskravet. Digilist tester mot WCAG 2.1 AA og kjører automatiserte axe-core-revisjoner på hvert deploy.
- **ISO 27001 og 27701** er forventet sertifisering. Digilist er sertifisert.
- **GDPR** krever databehandleravtale, dataregister og rett til sletting. Digilist har dette på plass og lagrer all data i Norge og EU.

## Migrasjon — det glemte kravet

Mange kommuner har eksisterende bookingsystemer (RCO, Aktimo, Idrettens Bookingsystem osv.) med historiske bookinger og sesongleieavtaler. SSA-L 2026 krever at den nye leverandøren støtter migrasjon — ikke bare frisk start.

Digilist tilbyr import fra RCO booking og andre systemer i etableringsfasen, med valideringsregler for foreningsregister og bookinghistorikk.

## Hva kommunen bør gjøre nå

1. **Kartlegg eksisterende anlegg og brukergrupper** — antall, type, kapasitet, sesongmønster
2. **Definer prioriteringsregler for sesongleie** — alder, lokal tilknytning, foreningstype
3. **Be om demo med fokus på SSA-L-kravene** — ikke generelle salgspresentasjoner
4. **Test sanntid live** — be leverandøren vise hvordan en booking forplanter seg gjennom systemet i sanntid

For en kompakt sjekkliste mot SSA-L 2026-kravene, se vår [landingsside for kommuner](/bookingsystem-kommune).
