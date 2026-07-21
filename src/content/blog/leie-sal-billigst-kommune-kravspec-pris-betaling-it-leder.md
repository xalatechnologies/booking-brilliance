---
slug: leie-sal-billigst-kommune-kravspec-pris-betaling-it-leder
title: "Salleie i bookingsystemet: kravspec for pris og betaling"
description: "Slik kravspesifiserer IT-lederen differensiert prising, prisregulativ, sesongavtaler og betalingsflyt så billigste ledige sal viser riktig pris i sanntid."
date: 2026-07-21
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 5
tag: "IT-leder"
cover: "/images/blog/somlos_betaling_hero_no.webp"
keywords: ["leie sal billigst kommune", "prisregulativ kommunale lokaler", "differensiert pris lag og foreninger", "betaling depositum leie kommunalt lokale", "sesongleie faste leieavtaler", "kravspec bookingsystem"]
---

Når en innbygger søker etter billigste ledige sal, er tallet hun ser resultatet av dusinvis av regler: hvem hun er, hva salen skal brukes til, hvilken ukedag det er, og hvilket prisregulativ kommunestyret vedtok i desember. Får du ikke prislogikken inn i kravspesifikasjonen, ender kommunen med et system som viser feil pris eller krever manuell overstyring på hver eneste booking. Prising er ofte den delen av kravspecen som får minst plass, og likevel den som skaper flest tvister etter at systemet er satt i drift. Denne guiden går gjennom hva du må kreve av pris- og betalingsmodulen før du sender ut anbudet.

## Prisvisning er en kravspec-utfordring, ikke bare et skjermbilde

«Vis pris» ser ut som ett felt. I praksis er det en beregningsmotor. Samme sal koster ulikt for en forening og en kommersiell aktør, og prisen endrer seg med tidspunkt, varighet og formål. Krever du bare «systemet skal vise leiepris», får du en statisk tabell som saksbehandleren må overstyre manuelt. Da flytter du bare feilkilden fra skjermen til saksbehandleren, og to like bookinger kan ende med to ulike priser avhengig av hvem som taster. Krev i stedet at prisen beregnes i sanntid ut fra brukerkategori, lokaltype og prisregulativ, og at samme regel gjelder både i innbyggerens søk og i saksbehandlerens vedtak.

## Differensiert prising for fire brukertyper i samme system

Kommunale lokaler prises nesten alltid etter hvem som leier. En typisk struktur skiller mellom privatperson, lag og forening, kommersiell aktør og kommunal enhet, der en forening kan betale 300 kroner timen for en sal der en kommersiell arrangør betaler 1 200. Kravspecen må slå fast at systemet håndterer minst disse fire kategoriene, at brukeren knyttes til riktig kategori ved innlogging, og at kategorien ikke kan velges fritt av leietakeren selv. Uten dette lekker subsidierte satser til aktører som skal betale full pris.

Prisdifferensieringen henger også sammen med merverdiavgift. Kommersiell utleie kan være avgiftspliktig, mens leie til ideelle formål ofte ikke er det. Krev at systemet skiller mellom pris med og uten mva per brukerkategori, og at avgiftskoden følger med når posteringen sendes videre til økonomisystemet. Ellers må regnskapet korrigere hver eneste kommersielle booking i etterkant.

## Prisregulativ i systemet uten manuell overstyring

Prisregulativet er et politisk vedtatt dokument med satser, rabatter og unntak. Det må modelleres som data, ikke som tekst i en PDF driftslederen leser fra. Krev at satser, rabattregler og tidsavhengige unntak legges inn som konfigurerbare regler, at endringer kan tidsstyres mot en vedtaksdato, og at hele regulativet kan versjoneres. Når Lillestrøm kommune justerer timeprisen fra 1. januar, skal endringen gjelde automatisk fra den datoen, uten at noen redigerer hver enkelt sal.

## Sesongleie og faste avtaler utover enkeltbooking

Mye av utleien er ikke enkelttimer, men faste avtaler: et korps som har samme sal hver tirsdag hele sesongen, eller et lag med fast halltid fra august til mai. Prislogikken for dette er en annen enn for enkeltbooking. Krev støtte for sesongpris, rabatt på gjentakende bookinger og samlet fakturering av en hel avtaleperiode. Systemet må også håndtere avlyste enkeltganger i en fast avtale uten å regne om hele grunnlaget for hånd, og det må vise hva en avlysning faktisk gjør med totalbeløpet før den bekreftes.

## Betalingsflyt: forhåndsbetaling, faktura, depositum og refusjon

Betaling er sjelden én knapp. En privatperson forhåndsbetaler kanskje festsalen med kort eller Vipps, en forening faktureres etterskuddsvis, og et bryllupslokale krever depositum som holdes tilbake og refunderes etter befaring. Kravspecen må dekke alle disse løpene:

- **Forhåndsbetaling** med kort eller Vipps for engangsleie av sal
- **Faktura** for lag, foreninger og kommersielle avtaler
- **Depositum** som reserveres og frigis separat fra leiesummen
- **Refusjon** ved avbestilling, koblet til avbestillingsvilkårene i regulativet

## Integrasjon med ID-porten, BankID og økonomisystemet

Riktig pris forutsetter at systemet vet hvem brukeren er. Krev innlogging via ID-porten og BankID, slik at brukerkategori og fakturaadresse hentes trygt, ikke fylles inn manuelt. For oppgjøret må leiemodulen levere posteringer til kommunens økonomisystem, enten det er Visma eller Unit4, med riktig ansvar, art og prosjekt. Depositum og refusjon skal spores separat så regnskapet stemmer, og hver postering må kunne knyttes tilbake til den enkelte bookingen. Uten denne integrasjonen blir hver faktura et manuelt punch-arbeid.

## Slik beregnes «billigst ledig lokale» korrekt i sanntid

«Billigst ledig lokale» er en spørring på tvers av to datasett samtidig: hvilke saler som er ledige i ønsket tidsrom, og hva hver av dem koster for akkurat denne brukeren. Krev at systemet filtrerer på faktisk ledighet i sanntid og sorterer på beregnet pris for innlogget brukerkategori, ikke på en listepris. En forening og en privatperson som søker på samme sal og samme kveld, skal se ulike tall, begge korrekte.

## Krav til rapportering: belegg, inntekt og subsidiert leie

IT-lederen leverer ikke bare booking, men også styringsdata. Krev rapporter på belegg per lokaltype, faktisk inntekt mot budsjett, og verdien av subsidiert leie, altså differansen mellom full sats og det foreninger faktisk betaler. Bærum kommune trenger dette tallet for å vise politikerne hva idrettssubsidieringen koster. Rapportene skal kunne eksporteres og brytes ned per sal, per periode og per brukerkategori. Krev også at hver rapport kan spores tilbake til underliggende bookinger og posteringer, slik at revisjonen kan kontrollere tallene uten å be om et manuelt uttrekk.

## Sjekkliste for kravspesifikasjonen

Før anbudet går ut, sørg for at leverandøren må dokumentere:

- Differensiert prising for minst fire brukerkategorier, styrt av innlogging
- Håndtering av mva per kategori, med avgiftskode til økonomisystemet
- Prisregulativ som konfigurerbare, versjonerte og tidsstyrte regler
- Sesongpris og samlefakturering av faste avtaler
- Fire betalingsløp: forhåndsbetaling, faktura, depositum og refusjon
- Integrasjon mot ID-porten, BankID og kommunens økonomisystem
- Sanntids prisberegning i «billigst ledig lokale»-søket
- Rapportering på belegg, inntekt og subsidiert leie per lokaltype

Får du disse punktene inn i kravspecen, blir prisen leietakeren ser aldri et tilfeldig tall, men resultatet av regulativet kommunen faktisk har vedtatt.

## Vil du se hvordan det ser ut i praksis?

Digilist håndterer differensiert prising, prisregulativ, sesongavtaler og betalingsflyt i ett system, med ID-porten og økonomiintegrasjon fra start. [Book en demo](https://digilist.no/demo), så viser vi hvordan billigste ledige sal beregnes riktig for hver brukertype i sanntid.