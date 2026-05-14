---
slug: tilgjengelighetskalender-innbygger
title: "Tilgjengelighet på første blikk — slik leser innbyggeren kommunens kalender"
description: "En kalender som krever forklaring er en kalender som har feilet. Vi går gjennom hvordan Digilist viser ledig, opptatt og blokkert tid på en måte enhver innbygger forstår uten å lese hjelp."
date: 2026-05-23
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 6
tag: "UX"
cover: "/images/blog/availability_calendar_hero_no.webp"
keywords: ["tilgjengelighetskalender", "kommunal booking", "innbygger UX", "kalender design", "ledige tider"]
---

Når en innbygger åpner kommunens bookingside er det første hun ser et signal om hele tjenestens kvalitet. Hvis hun må klikke fem ganger for å finne ut at gymsalen er ledig torsdag klokken 18 — eller verre, må gjette hva en gråskala-rute betyr — har tjenesten allerede tapt en mulig booking. Tilgjengelighetskalenderen er kommunens første tillitstest.

## Tre tilstander, tre farger, ingen mer

Hver tidsblokk i Digilists kalender har én av tre tilstander:

- **Ledig (grønn).** Kan bookes umiddelbart. Innbygger klikker, fyller ut skjemaet, betaler. Ferdig.
- **Opptatt (grå).** Allerede booket. Vises ikke som «privat» eller med booker-navn — bare som ikke-tilgjengelig.
- **Blokkert (oransje).** Anlegget er stengt for vedlikehold, høytid eller administrativ blokkering. Hover-tekst forklarer hvorfor.

Det er bevisst at vi ikke har «søkt om», «under behandling» eller «foreløpig reservert» som synlige statuser for innbyggeren. Hun trenger å vite om hun kan _booke nå_ — ikke om hvem som har søkt før henne. Den informasjonen tilhører saksbehandleren.

## Hvorfor «opptatt» er nok informasjon

I tjuetalls kommunale bookingsystemer har vi sett samme feil: at kalenderen viser «Opptatt av Korps Vest 16:00–18:00». Det er et personvernsbrudd som er enkelt å overse — booker-navnet er personopplysning hvis booker er privat, og selv organisasjonsnavn røper hvilke anlegg laget bruker når. For en innbygger som leter etter ledig tid har informasjonen heller ingen verdi. Hun trenger å vite om tiden er bookbar, ikke hvem som har den.

Digilist viser kun «Opptatt» — uten å avsløre _hvem_. Saksbehandleren ser navnet i sitt eget grensesnitt; innbyggeren ser bare den fargen som svarer på spørsmålet hennes.

## Tidsperspektiv: dag, uke, måned — innbyggerens valg

En innbygger som booker en konferanseside trenger ofte _samme dag_. En som planlegger en bursdag trenger _lørdager_ tre måneder fremover. Bookingsystemer som tvinger én visning på alle er for stive. Digilist tilbyr fire perspektiver:

1. **Dagsvisning** — én dag, time for time. Standard for spontane bookinger.
2. **Ukesvisning** — syv dager i timer. Standard for arrangementer på dagen eller helg.
3. **Månedsvisning** — full måned med fargekodede dager (mye/middels/lite ledig). Standard for planlegging fremover.
4. **Periodefilter** — «vis kun lørdager i mars og april med minst 8 timer ledig». For brukere som vet hva de leter etter.

Visningen huskes per bruker (lagres i `localStorage` på enheten, ikke i kontoen), så hun slipper å gjenta valget hver gang hun returnerer.

## Søk som forstår intensjon

«Søk» er ikke «autocomplete på lokalnavn». Innbyggerne søker med ord som matcher intensjonen, ikke kategorien:

- «bursdagslokale for 30 personer» → matcher selskapslokaler, kantiner og storsaler med kapasitet ≥ 30
- «musikkøving» → matcher gymsaler med scene, samfunnshus med musikkanlegg, og dedikerte øvingslokaler
- «møterom torsdag morgen» → matcher møterom med ledig tid torsdag kl 08–12

Søket bygger på listings-katalogens metadata (kapasitet, fasiliteter, taggene saksbehandleren har lagt på lokalet), kombinert med kalenderen i sanntid. Resultatene rangeres etter relevans og tilgjengelighet — ikke etter alfabet.

## Sanntid, ikke daglig

Tilgjengelighetskalenderen abonnerer på databasen via [Convex' reaktive runtime](/blogg/sanntidskalender-kommunal-booking). Når en kollega-innbygger bekrefter en booking, blir slot-en grå hos alle andre _samme sekund_. Det er forskjellen mellom å booke trygt og å booke fortvilet.

## Hva tilgjengelighetskalenderen _ikke_ er

Det er ikke et administrativt verktøy. Den er ikke en saksbehandlerkø. Den er ikke en finansiell rapport. Den er det første grensesnittet en kommunal innbygger møter, og dens jobb er å fortelle sannheten på under fem sekunder. Hvis den greier det, ringer hun ikke kommunens servicetorg — hun booker. Hvis ikke, ringer hun, og kommunens digitale tjeneste har akkurat skapt det manuelle arbeidet den var ment å eliminere.

