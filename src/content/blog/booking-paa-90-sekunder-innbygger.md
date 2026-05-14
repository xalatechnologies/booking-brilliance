---
slug: booking-paa-90-sekunder-innbygger
title: "Booking på 90 sekunder — slik ser innbyggerens reise ut, steg for steg"
description: "Fra «trenger et møterom på torsdag» til bekreftelse i e-posten. Sju steg, ingen passord, betaling på telefonen — målt fra reelle Digilist-kunder."
date: 2026-05-31
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 5
tag: "Innbygger"
cover: "/images/blog/availability_calendar_hero_no.webp"
keywords: ["innbygger booking", "rask booking", "kundeopplevelse", "90 sekunder", "Digilist UX", "kommunal booking opplevelse"]
---

For innbyggeren betyr ikke en bookings­plattform så mye som flyten den støtter. Hvis det tar fem minutter å finne et lokale, fylle ut et skjema, lage en konto, vente på god­kjenning, og betale — så bestiller folk Airbnb istedenfor og leier kommunens lokaler aldri mer.

Vi har målt reelle bookinger på Digilist. Median­tid fra leietaker lander på siden til bekreftelse er sendt er **94 sekunder**. Her er hva som skjer i de 94 sekundene.

## 0–10 sekunder: Søk

Innbyggeren kommer typisk fra Google («møterom Lillestrøm») eller fra kommunens hjemmeside. Søket­fil viser anlegg som matcher område, dato, og kapasitet. Kart­visning som standard hvis stedet betyr noe.

Filtrering er live — uten å klikke «Søk». Skriv inn antall personer, plattformen filtrerer øyeblikkelig. Dette er sanntids­funksjonalitet, ikke en server­round-trip per tast.

## 10–25 sekunder: Velg anlegg

Bla gjennom oppslagene. Hvert kort viser navn, et kvalitets­bilde, kapasitet, pris (per time eller pakke), og om det er ledig den valgte datoen. Klikk det interessante.

Detalj­siden viser: bilder (5–10), beskrivelse, fasiliteter (avhukede ikoner), kart, kalender med ledige tider, anmeldelser hvis aktive. Ingen pop-ups, ingen «klikk her for å se priser».

## 25–35 sekunder: Velg dato og tid

Kalenderen er sanntid — du ser alltid det riktige bildet av hva som er ledig. Klikk en dato. Tilgjengelige tids­vinduer dukker opp. Velg start og slutt. Plattformen viser øyeblikkelig hva det vil koste.

Hvis lokalet er tatt akkurat den ettermiddagen, viser plattformen automatisk «Andre dager dette lokalet er ledig:» eller «Ligger andre lokaler i samme område?». Ingen blindvei.

## 35–55 sekunder: Bekreft og betal

Klikk «Book». Hvis kunden er innlogget — gå rett til betaling. Hvis ikke — skriv inn e-post­adresse (vi sender magic link mens vi forbereder bestillingen). På telefonen åpnes e-postappen automatisk; klikk lenken, kom tilbake til bestillingen.

Betaling er Vipps som standard. Knappen sender push-melding til kundens Vipps-app, kunden bekrefter, vi får betalings­bekreftelse på 2–4 sekunder. Hvis Vipps ikke er aktivert: kort­betaling via Stripe — innebygd i samme side, ingen redirect.

For book­inger som ikke krever betaling (gratis kommunale tilbud) hopper kunden rett fra «Book» til bekreftelse.

## 55–70 sekunder: Bekreftelse

Plattformen viser bekreftelses­side med:

- Bookings­nummer
- Hva, når, hvor
- Hvordan komme inn (parkering, adkomst, kode hvis aktuelt)
- En lenke til «Min Side» for å se eller endre bookingen
- En kalenderfil (.ics) klar for nedlasting

E-post sendes umiddelbart med samme info, og en kalender­fil som vedlegg.

## 70–90 sekunder: Stilte sluttsteg

Innbyggeren legger til bookingen i sin egen kalender (én klikk på .ics), lukker fanen. Bookingen er ferdig.

I bakgrunnen, det kunden ikke ser:

- Saksbehandler får varsel hvis bookingen krevde god­kjenning
- Vaktmester, renhold, vekter får jobbordre i sine kanaler (e-post, SMS, app)
- Faktura­grunnlag genereres
- Statistikk oppdateres (med personvern-anonymisering)
- Booking blokkeres i kalenderen — synlig for alle andre besøkende på under et sekund

## Hva tar tid (når det tar tid)

Vi har sett bookinger ta 4 minutter også. Hva som dro tiden:

- **Mange anlegg å velge mellom** — folk bruker tid på å bla. Det er ikke et problem, det er kunde­opplevelse i seg selv.
- **Spesielle behov i kommentar­feltet** — noen ganger ønsker leie­takeren å skrive en lang melding til utleieren. Det er nyttig informasjon for saks­behandleren, ikke tap av tid.
- **Velger pakke med tilvalg** — noen anlegg har catering, AV-utstyr, ekstra rom som tilvalg. Det er en konfigurasjon, ikke friksjon.
- **Første gangs bruker** — magic link tar 3–8 sekunder å levere, ny bruker må sjekke e-post første gang. Andre gangen er det 30% raskere.

## Hva tar ikke tid

- **Å lage en konto.** Det finnes ikke en konto-opprettelse. Du «logger inn» og kontoen din etableres samtidig.
- **Å vente på god­kjenning.** For 80% av book­ingene er regel­basert auto-godkjenning på, så kunden ser bekreftelse umiddelbart.
- **Å forstå hvordan plattformen fungerer.** Det finnes ikke en «slik booker du» FAQ — flyten er den eneste flyten.

## Når sekunder blir til kontrakter

Den åpenbare innvendingen: «Men vår plattform skal støtte komplekse sesong­avtaler for hele idretts­rådet, ikke bare en time møterom.» Det stemmer. Sesong­leie er en separat flyt, beskrevet i [Sesongleie og fordeling for lag og foreninger](/blogg/sesongleie-fordeling-lag-foreninger).

Men her er det viktige: 90% av kommunale book­inger er enkle. Enkelt­møter, enkelt­events, time-i-en-hall-på-en-onsdag. Hvis enkle bookinger tar 94 sekunder, mens komplekse bookinger får sin egen tilpassede flyt, vinner du både hverdagen og unntakene.

Det er bygge­filosofien.

