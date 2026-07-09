---
slug: sanntidskalender-kommunal-booking
title: "Sanntidskalender: hvorfor «oppdateres hver natt» ikke holder mål"
description: "Innbyggere som ser feil opptatt-tider og dobbeltbookinger er symptomer på én rot. Hvorfor reaktiv sanntid er en forutsetning, ikke luksus."
date: 2026-05-18
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 6
tag: "Sanntid"
cover: "/images/blog/sanntidskalender_hero_no.webp"
keywords: ["sanntidskalender", "reaktiv runtime", "Convex", "dobbeltbooking", "kommunal booking"]
---

For en kommune som leier ut lokaler er kalenderen ikke et grensesnitt. Den er kontrakten. Når en innbygger ser at en idrettshall er ledig torsdag klokken 18, og deretter blir avvist av saksbehandleren fordi noen andre booket samme tid for ti minutter siden, er det tilliten til hele tjenesten som forsvinner. Det er nettopp denne tillitsbristen sanntidskalenderen er bygget for å forhindre.

## Polling er ikke sanntid

Det vanligste tegnet på et bookingsystem fra forrige tiår er en setning som lyder: «kalenderen oppdateres hver natt». Det betyr at brukerens kalender og databasens kalender går ut av sync så snart noen booker, og at synkroniseringen først hentes inn neste morgen. Mellom 18:00 og 06:00 viser systemet en versjon av virkeligheten som ikke lenger eksisterer.

Polling (at klienten spør serveren hver 30. sekund) er bedre, men ikke godt nok. Det skaper to nye problemer: ekstra serverbelastning (1 200 innbyggere som åpner kalenderen samtidig = 2 400 spørringer i minuttet), og en latens som i praksis er den korteste forskjellen mellom «ledig» og «opptatt»: den 29. sekunden brukeren venter.

## Hva «reaktiv» betyr i praksis

Digilist er bygget på [Convex](https://www.convex.dev/): en reaktiv runtime der hver spørring _abonnerer_ på dataen den hentet. Når en booking opprettes, varsles alle åpne kalendere automatisk og oppdateres umiddelbart hos hver bruker. Det er fundamentalt forskjellig fra polling: serveren _dytter_ endringen, klienten trenger ikke å spørre.

Konsekvensene:

- **Ingen dobbeltbookinger.** Når to brukere prøver å booke samme slot innenfor samme sekund, mister én av dem løpet, og den andre ser slot-en bli rød med en gang.
- **Saksbehandlere ser endringer umiddelbart.** Kulturkonsulenten som behandler søknader om sesongleie ser at en søker har trukket søknaden uten å måtte trykke refresh.
- **Driftsroller varsles automatisk.** Når en booking bekreftes, sendes pushvarsel til vaktmesteren, i samme reaktive flyt, ikke gjennom en cron som kjører hvert femte minutt.

## En liten teknisk detalj med stor konsekvens

Reaktiv runtime betyr at hver mutasjon er transaksjonell på databasenivå _og_ utløser eventer som distribueres til abonnenter atomisk. Det vil si: enten lagres bookingen _og_ varslene sendes, eller ingen av delene skjer. Du får aldri en situasjon der bookingen er lagret men vaktmesteren ikke ble varslet: den klassiske «event missed»-feilen som koster kommunen tre telefoner på en lørdag.

For revisjonsformål er dette også en gevinst: hver hendelse i Digilist har samme tidsstempel som mutasjonen som utløste den. Det gjør at en kommunal IT-revisjon kan rekonstruere _hva som ble booket, av hvem, og hva som ble varslet til hvem_ med millisekundpresisjon.

## Hvordan det føles for innbyggeren

En innbygger som åpner Digilist torsdag kveld for å booke en kantine til lørdag ser kalenderen som den faktisk er, inkludert at noen andre nettopp har booket en kolliderende tid og at hennes valg ble grå mens hun skrev inn navnet. Hun trenger ikke å skylde på «trege kommunale systemer» eller spørre om saksbehandleren kan sjekke manuelt. Hun ser virkeligheten, og virkeligheten avgjør hvilket valg som er mulig.

Det er ikke en feature å skryte av. Det er hvordan kalendere _bør_ fungere, og det er den standarden norske kommuner fortjener.

