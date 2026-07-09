---
slug: realtime-varsler-driftsroller
title: "Realtime-varsler: plattformen forteller før noen ringer"
description: "En vaktmester som får telefon søndag morgen fordi noen står ute, er en kommune som mangler informasjonsflyt. Digilist fjerner samtalen før den starter."
date: 2026-05-25
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 6
tag: "Drift"
cover: "/images/blog/realtime_updates_hero_no.webp"
keywords: ["push-varsler", "driftsroller", "vaktmester", "renhold", "automatisk varsling", "outbox event bus"]
---

Det er et øyeblikk som gjentar seg i hver kommune: en innbygger har booket en lokale, kommer dit i tide, men finner døren låst. Hun ringer servicetorget, som ringer kulturkonsulenten, som ringer vaktmesteren. Tre samtaler, fem minutters frustrasjon, og en booking som starter dårlig. Den underliggende feilen er ikke menneskelig. Det er informasjon som ikke har flyttet seg automatisk. Det er nettopp den informasjonsflyten realtime-varslene er bygget for.

## Tre lag av varsler, hvert med sitt formål

Digilist sender varsler på tre forskjellige nivåer, og det er forskjellen mellom et bookingsystem som forsto driftshverdagen og et som fortalte saksbehandleren at hun fikk en e-post.

### Innbyggervarsler

Når en booking bekreftes, sendes:

- **E-post-bekreftelse** med all info, kalenderfil, adresse, og bookingens unike kode for digital nøkkel.
- **SMS-påminnelse** 24 timer før (kommunen velger om dette er aktivt).
- **Push-varsel** dersom innbyggeren har Digilist-appen installert.

Ved endringer i bookingen (flytting, kansellering, anlegget blir blokkert av kommunen) får innbyggeren samme informasjon på samme tre kanaler. Hun trenger aldri å sjekke om noe har endret seg.

### Driftsrollevarsler

Når en booking bekreftes for et anlegg, sender Digilist automatisk pushvarsler til driftsrollene som er koblet til dette anlegget:

- **Vaktmester:** «Booking 14:00–17:00 på Gymsalen Storsalen. Krever oppvarming, AV-utstyr, stoler oppstilt 50 personer.»
- **Renhold:** «Etter-rengjøring 17:00, før neste booking 18:30.»
- **Vekter:** «Booking forlater kl 17:30. Lås opp 13:45, lås ned 18:00.»

Hvert varsel inneholder konkrete oppgaver, ikke bare «det er en booking». Driftsrollen kan kvittere fra varselet («Bekreftet, jeg kommer») uten å åpne appen. Kvitteringen logges i bookingens audit-spor og er synlig for kulturkonsulenten.

### Saksbehandlervarsler

Saksbehandleren får varsel om hendelser som krever menneskelig vurdering, ikke om hver booking. Eksempler:

- **Søknad om sesongleie utenfor regler:** krever skjønn.
- **Refusjonsforespørsel:** krever vurdering av betingelser.
- **Konfliktdeteksjon:** to søkere har søkt overlappende tid og automatreglene kan ikke avgjøre prioritet.

Saksbehandlervarslene har konfigurerbar batching: en saksbehandler kan velge å få dem som live-pushvarsler, daglig sammendrag, eller bare når de logger inn. Standard er sammendrag, fordi 1 200 bookinger i måneden krever fokus.

## Det vanskelige: transaksjonell garanti

Et varselsystem som «som regel sender varsler» er verdiløst. Et som garanterer levering er forskjellen mellom et profesjonelt og et amatøraktig system. Digilist bruker et **outbox-mønster**: varselet skrives i samme transaksjon som mutasjonen som utløste det.

Konkret:

1. Booking bekreftes → DB-mutasjon.
2. Varselposten skrives til `outboxEvents`-tabellen i samme transaksjon.
3. Enten lagres _begge_ deler, eller _ingen_ av dem. Aldri en booking uten varsel.

En cron-jobb scanner outbox-tabellen og distribuerer varslene til abonnentene med backoff (30s → 60s → 120s → cap 5min). Hvis en mottaker er nede, holdes varselet i køen til det leveres. Etter tre forsøk uten lykke flyttes det til en `dead-letter`-kø som varsler kommunens driftsansvarlige.

Resultatet: ingen «event missed»-feil. Hvis en booking lagres, blir varslene levert, kanskje senere enn ønsket, men de blir levert, og det er etterprøvbart at de ble det.

## Hvor varsler ikke kommer fra Digilist

Det er fristende å tro at et bookingsystem skal håndtere _all_ kommunikasjon. Det er feil. Digilist sender varsler om:

- Bookingstatus (bekreftet, kansellert, flyttet)
- Driftsoppgaver knyttet til konkrete bookinger
- Saksbehandling som krever menneskelig vurdering
- Betalingsstatus og refusjoner

Digilist sender _ikke_:

- Markedsføring eller nyhetsbrev (det tilhører kommunens egen kanal)
- Innbyggerundersøkelser (Kommunens egen plattform)
- Generelle servicemeldinger (kommunens innbyggerportal)

Å holde varselkanalen smal og funksjonell øker leveringspresisjonen. Innbyggere som vet at en Digilist-melding alltid handler om en faktisk booking åpner dem alltid. Det er den motsatte effekten av en kanal som blir overbelastet med ukjent informasjon, der menneskene begynner å filtrere bort _alt_.

## Hva kommunen kan rapportere

Hver varsel er en datapunkt. Kommunen kan rapportere:

- Hvor lang tid det går fra booking-bekreftelse til at vaktmesteren kvitterer
- Hvilke anlegg har høyest «ikke møtt»-rate hos driftsroller
- Hvilke bookinger blir oftest endret etter første bekreftelse
- Hvilken kanal (push / e-post / SMS) har høyest åpningsrate per persona

Dette er ikke surveillance. Det er driftsforbedring. Hvis et bestemt anlegg konsekvent har sen kvittering fra vaktmesteren, er det et signal om at driftsoppgaven er feilformulert, ikke at vaktmesteren er treg.

