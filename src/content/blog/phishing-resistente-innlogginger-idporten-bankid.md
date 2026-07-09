---
slug: phishing-resistente-innlogginger-idporten-bankid
title: "Phishing-resistente innlogginger med ID-porten og BankID"
description: "Passordbaserte innlogginger phishes hver dag. Derfor er ID-porten og BankID det enkleste forsvarsgrepet en norsk kommune kan gjøre."
date: 2026-05-15
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 6
tag: "Sikkerhet"
cover: "/images/blog/integrations_idporten_hero_no.webp"
keywords: ["phishing", "ID-porten", "BankID", "FIDO2", "innlogging", "kommune", "MFA"]
---

Statistisk sett er passord-phishing den enkleste måten å bryte seg inn i en organisasjon på. Det krever ikke avanserte verktøy, ingen sero-days. Det krever bare at én ansatt klikker på riktig lenke og taster inn passordet på en falsk side. NSM og Mnemonic har konsistent flagget dette som den dominerende inngangsvektoren for cyberhendelser i norsk offentlig sektor.

Den gode nyheten: phishing-resistente innloggingsteknologier finnes, er gratis å bruke for kommuner, og er allerede integrert i de fleste norske offentlige tjenester. Den enda bedre nyheten: et bookingsystem som velger riktig pålogging fra dag én lukker den vanligste angrepsvektoren før den åpnes.

## Hvorfor passord ikke kan vinne

Et passord er et delt hemmelig: brukeren kjenner det, og serveren kjenner det. Det betyr at hvis brukeren oppgir hemmeligheten på feil sted (en phishing-side), så vinner angriperen.

To-faktor med SMS hjelper noe. To-faktor med authenticator-app hjelper mer. Men begge har et grunnleggende problem: en angriper som lurer brukeren til å taste inn både passord og engangskode på samme falske side, vinner fortsatt.

Phishing-resistent autentisering løser dette problemet ved å koble innloggingen til selve nettstedet brukeren besøker. Det er ikke noe brukeren *kan oppgi*. Det er kryptografisk knyttet til opprinnelsen.

## ID-porten og BankID: phishing-resistent i praksis

Når en norsk innbygger logger inn med BankID på en bookingside, skjer følgende:
1. Bookingsiden ber ID-porten om en innlogging.
2. ID-porten viser et BankID-vindu hos banken som leverer BankID.
3. Brukeren autentiserer seg i BankID-appen eller med kodebrikke.
4. ID-porten gir bookingsiden en signert token om at brukeren er den de utgir seg for å være.

Det kritiske er steg 1 og 4: bookingsiden snakker direkte med ID-porten, og ID-porten signerer en token til *akkurat det opprinnelses-domenet*. En phishing-side på `digiIist.no` (med stor I) kan ikke be om en token til seg selv fordi ID-porten ikke kjenner det domenet.

Dette er kvalitativt forskjellig fra passord-phishing. Selv om brukeren *forsøker* å bli phisket, klarer ikke angriperen å oversette en BankID-pålogging til tilgang på sin egen falske side.

## Hva med saksbehandlere?

Innbyggere bruker BankID. Saksbehandlere (kulturkonsulenter, idrettskoordinatorer, vaktmestere) har behov for noe litt annet:
- De logger inn ofte (flere ganger per dag).
- De jobber fra kommunens nett, ikke hjemmefra.
- De har behov for rollebaserte tilganger som varierer.

Digilist tilbyr to spor for ansatte:

1. **ID-porten med ansattlegitimasjon.** Den enkleste varianten: saksbehandleren har allerede en bekreftet identitet hos ID-porten, og bruker den.
2. **Magic-link på e-post + SMS-bekreftelse.** For roller som ikke har ID-porten, eller for nye ansatte før ID-porten er provisjonert.

Begge er phishing-resistente. Begge fungerer uten passord.

## "FIDO2": det teknologien heter

For dem som vil ha bakgrunnen: phishing-resistent autentisering bygger på FIDO2-standarden, som er bygget rundt offentlig-nøkkel-kryptografi i stedet for delte hemmeligheter. ID-porten og BankID er begge FIDO-kompatible.

Praktisk betyr det at en kommune som velger en plattform som bygger på ID-porten + BankID, automatisk får dette forsvaret, uten å måtte forstå standarden i detalj. Det er en av få beslutninger der det enkleste valget også er det sikreste.

## Hva som faktisk skjer i et phishing-forsøk

Et tenkt scenario med passordbasert innlogging:
1. Saksbehandler får en e-post: "Klikk her for å bekrefte din konto på bookingsystemet."
2. Lenken går til `bookingsystem-bekreft.no` som ser identisk ut.
3. Saksbehandler logger inn med passord.
4. Angriperen har nå legitime credentials.

Samme scenario med ID-porten:
1. Saksbehandler får e-posten.
2. Klikker på lenken, blir bedt om å logge inn med ID-porten.
3. Det åpner et ID-porten-vindu, men det er feil URL-mønster, og BankID-vinduet vil ikke åpne fordi forespørselen ikke kan signeres for et ukjent domene.
4. Angriperen får ingenting.

Det er ikke umulig å phishe ID-porten-brukere, men listen er mye høyere. Det krever sosial manipulasjon der angriperen får brukeren til å selv navigere til riktig sted og deretter overlevere session-cookien, en mye mer komplisert operasjon.

## Anbefaling

For en kommune som er i ferd med å velge bookingsystem: gjør pålogging med ID-porten + BankID til et absolutt krav. Det er gratis å bruke for offentlige aktører, det er kjent for innbyggerne, og det fjerner den enkleste angrepsvektoren før den oppstår.

Ingen annen enkeltbeslutning i en anskaffelse gir så mye sikkerhetsverdi per krone som denne.

Vil du vite mer om hvordan Digilist håndterer pålogging? Se [ID-porten og BankID for kommunal innlogging](/blogg/idporten-bankid-kommunal-innlogging) eller les videre om [cyberangrep mot norske kommuner](/blogg/cyberangrep-norske-kommuner-bookingsystem).
