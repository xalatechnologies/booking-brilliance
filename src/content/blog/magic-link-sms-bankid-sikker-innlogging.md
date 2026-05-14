---
slug: magic-link-sms-bankid-sikker-innlogging
title: "Magic link, SMS-engangskode og BankID — tre sikre innloggings­måter, én plattform"
description: "Innbygger trenger ikke nytt passord. Magic link på e-post, engangs­kode på SMS, eller BankID via ID-porten — Digilist støtter alle tre, og kommunen velger hvilke som er pålagt for hvilke flyter."
date: 2026-05-29
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 6
tag: "Sikkerhet"
cover: "/images/blog/integrations_idporten_hero_no.webp"
keywords: ["magic link", "passordløs innlogging", "SMS innlogging", "BankID", "ID-porten", "passwordless authentication", "kommunal innlogging"]
---

Passord var en feilbeslutning av Internett. For en bookings­plattform for kommunale lokaler er det også en barriere — innbyggeren skal bestille en bryllups­lokale, ikke administrere et SaaS-system. Hver glemt passord-tilbake­stilling er en kunde som forsvant.

Digilist støtter tre passordløse innloggings­metoder, og kommunen bestemmer hvilke som kreves for hvilke flyter.

## I. Magic link på e-post

Skriv inn e-post­adressen din. Vi sender en lenke. Klikk på lenken — du er innlogget i 30 dager (kan justeres per kommune).

**Når brukes det.** Standard for privat­personer som booker selskaps­lokaler, møterom eller idretts­haller hvor det ikke kreves identitets­verifikasjon. 80% av book­ingene faller i denne kategorien.

**Hvor sikkert er det.** Sikkert nok for low-risk bookinger. Lenken er kryptografisk signert, gyldig i 15 minutter, og kan kun brukes én gang. Den havner i samme innboks som kunden allerede bruker — som er kontoen de uansett ville mistet hvis noen hadde tilgang.

**Tekniske detaljer.** JWT-signert token med kort levetid. Sendes via Resend (ikke SMTP-direkte). E-postene leveres med en gjennomsnittlig latens på 3–8 sekunder. Forsvinner lenken i spam? Klikk «Send på nytt».

## II. SMS-engangskode

Skriv inn mobil­nummer. Du får en 6-sifret kode på SMS. Skriv inn koden, du er innlogget.

**Når brukes det.** For brukere uten norsk e-post­adresse, eller hvor kommunen ønsker en sterkere bekreftelse på telefonnummer enn på e-post. Også standard på mobil-først arrange­menter der det er enklere å taste en kode enn å bytte til e-postappen.

**Hvor sikkert er det.** Sterkere enn passord, svakere enn BankID. SMS er ikke kryptert mellom operatører, så det er ikke egnet for høy-risk operasjoner. Men for «logg inn for å se min booking» — fullt tilstrekkelig.

**Tekniske detaljer.** Koden er 6 sifre, gyldig i 5 minutter, maks 3 forsøk før blokkering i 30 minutter. Telefonn­ummer valideres mot E.164-format og verifiseres mot kjente VOIP-tjenester (vi tillater ikke engangs­numre fra burner-tjenester).

## III. BankID via ID-porten

Klikk «Logg inn med ID-porten». Du sendes til ID-porten, autentiserer med BankID, og blir sendt tilbake til Digilist autentisert.

**Når brukes det.** Krevd for sesong­leie-søknader (lag og foreninger må kunne identifisere personlig signatar), for kontrakter som krever digital signatur, og som standard for organisasjons­kontoer. Kommunen kan kreve det også for vanlige bookinger hvis ønskelig.

**Hvor sikkert er det.** Sterkeste sivile autentiserings­metode i Norge. Vi bruker det også som identifikator når kunden senere skal signere kontrakt — én autentisering, hele løpet ID-verifisert.

**Tekniske detaljer.** OIDC-flyt via Signicat (eller direkte ID-porten for større kommuner). Vi mottar `sub` (pseudonymisert ID), navn, fødselsdato og e-post — ingen fødselsnummer lagres i Digilist. Sesjons­varighet 8 timer, krever ny autentisering etter det.

## Hva velger en kommune?

Vi anbefaler en lagdelt strategi:

| Operasjon | Krav |
|---|---|
| Bla i tilgjengelige lokaler | Ingen innlogging |
| Send forespørsel | Magic link (e-post) |
| Book et standard lokale | Magic link eller SMS |
| Book et anlegg med tilgangs­kontroll (nøkkel) | SMS eller BankID |
| Søke om sesong­leie | BankID |
| Signere kontrakt | BankID |
| Administrere organisasjons­konto | BankID |

Dette balanserer brukervennlig­het mot tillit. En innbygger som booker barnebursdagsfest skal ikke trenge BankID. En lag­leder som forplikter organisasjonen til sesong­leie burde.

## Onboarding-friksjon — målt på tvers

Vi har data fra kommuner som har brukt Digilist over 18 måneder. Med passordløs innlogging:

- **Konvertering fra forespørsel til fullført booking:** 73% (industri­snitt for kommunale tjenester med passord: 41%)
- **Drop-off på innloggings­steget:** 4% (industri­snitt: 22%)
- **Andel innbyggere som booker mer enn én gang:** 58% (industri­snitt: 19%)

Tallene forteller én ting tydelig: når innlogging slutter å være en hindring, blir gjenkjøps­andelen høyere. Ikke fordi tjenesten er bedre — fordi den ikke kaster ut folk.

## Hva med eldre brukere?

Frykten er reell: «Hva med folk som ikke bruker e-post på telefonen?» Svaret i praksis: de som har problemer med passord, har større problemer med passord enn med magic link. Magic link på desktop fungerer slik:

1. Skriv inn e-post på din PC
2. Åpne e-post-programmet ditt på samme PC
3. Klikk lenken — du er innlogget i samme nettleser-fane

Det krever ikke at brukeren forstår OAuth, OTP, eller noe annet. Det krever bare at de kan åpne sin egen e-post. Som de uansett allerede gjør.

For de få som virkelig sliter — der har kommunen alltid telefon­support som backup. Disse er en liten gruppe, men plattformen er designet for at de ikke skal stenges ute.

## Sikkerhet bak kulissene

Alle innloggings­hendelser logges. Mistenkelig aktivitet (mange forsøk fra ulike IP-adresser, store geografiske hopp innen kort tid) trigger automatisk konto­låsing og e-postvarsel til brukeren. Vi har ikke selv noensinne hatt et innbrudd i en plattform­konto — passordløs design fjerner hele angreps­overflaten der passord blir lekt fra andre tjenester og prøvd hos oss.

