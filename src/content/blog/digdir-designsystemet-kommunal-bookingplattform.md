---
slug: digdir-designsystemet-kommunal-bookingplattform
title: "Digdir Designsystemet — hvorfor norsk offentlig sektor bør kreve det"
description: "Designsystemet til Digdir er Norges offisielle byggekloss-bibliotek for offentlige digitale tjenester. Her er hvordan det former tilliten til kommunale bookingsystemer — og hvorfor Digilist er bygget på det."
date: 2026-05-17
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 9
tag: "Designsystem"
cover: "/images/blog/digdir_designsystemet_hero_no.webp"
keywords: ["Digdir Designsystemet", "designsystemet.no", "universell utforming", "kommunal digitalisering", "offentlig sektor"]
---

Det er én ting alle norske kommuner møter når de skal anskaffe en digital tjeneste: behovet for at innbyggerne kjenner seg igjen. Knapper, skjemaer, varsler, søkefelt og statusmeldinger må oppleves som _norske offentlige_ — ikke som en internasjonal SaaS-mal med Google Translate. Det er nettopp denne gjenkjennelsen [Digdir Designsystemet](https://designsystemet.no/no) leverer, og det er grunnen til at Digilist er bygget på det fra første linje.

## Hva Digdir Designsystemet faktisk er

Designsystemet, eid og forvaltet av Digitaliseringsdirektoratet (Digdir) i samarbeid med Skatteetaten, NAV, Brønnøysundregistrene og en rekke kommuner, er et åpent og delt komponentbibliotek for offentlig sektor. Det består av tre lag:

1. **Designtokens** — farger, typografi, avstand og elevasjon, definert som CSS-variabler og JSON-skjemaer. Hver token er WCAG-testet for kontrast og lesbarhet.
2. **Komponenter** — React- og web-komponenter (`@digdir/designsystemet-react`) for knapper, skjemafelt, dialoger, navigasjon, tabeller og varsler. Hver komponent er pre-testet for skjermlesere, tastaturnavigasjon og hjelpetekst.
3. **Mønstre og retningslinjer** — dokumentasjon av hvordan komponentene settes sammen til hele tjenester, med eksempler fra Min side, Altinn og Helsenorge.

Hele systemet er publisert under [Apache 2.0-lisens](https://github.com/digdir/designsystemet) og oppdateres kontinuerlig av et team på tvers av etatene. Det er, med andre ord, en infrastruktur — ikke et tema.

## Hvorfor Digilist baserer seg på det

Da vi begynte å designe Digilist for kommuner, vurderte vi tre alternativer: et eget designspråk, et hodeløst bibliotek som shadcn/ui, eller Digdir Designsystemet. Vi landet entydig på Digdir, av fire grunner.

### 1. Innbyggerne kjenner det igjen — uten å vite det

Det er ingen kommunalt ansatt som tenker «åh, dette er Digdirs `Button`-komponent». Men innbyggerne kjenner igjen avstanden, fokusringen, knappetekstens linjehøyde, måten en feilmelding sklir inn på, og at varselet om obligatorisk felt har riktig fargevalør. Det skaper en _stillere_ tillit enn noe markedsføringsmateriell kan: kommunens digitale tjenester ser ut som kommunens digitale tjenester. Ikke som en startup-pitch, og ikke som en oversatt Calendly.

### 2. Universell utforming er innebygd, ikke påklistret

Likestillings- og diskrimineringsloven § 17a, kombinert med forskrift om universell utforming av IKT, gjør WCAG 2.1 AA pliktig for alle norske offentlige tjenester. Digdir-komponentene er testet mot kravene fra starten: kontrast, focus-visible, ARIA-merking, tastaturnavigasjon og skjermleserkompatibilitet er ikke noe utviklere må huske å legge til — det er en del av komponentens kontrakt. Den dagen WCAG 2.2 blir pålagt, oppdaterer Digdir-teamet komponentene, og Digilist arver det automatisk i neste utgivelse.

### 3. Det reduserer leverandøravhengighet

En kommune som har valgt et bookingsystem på Digdir Designsystemet kan, i prinsippet, kreve at neste leverandør gjenbruker samme designspråk. Det reduserer kostnaden ved bytte, gjør integrasjoner mer forutsigbare, og skaper et marked der leverandørene konkurrerer på funksjonalitet og pris — ikke på låsteknologi. Det er en av få teknologiske avgjørelser som styrker, snarere enn svekker, kommunens forhandlingsposisjon over tid.

### 4. Det dokumenterer seg selv overfor revisor

Når kommunens IT-revisjon spør «hvordan er tilgjengelighetskravene oppfylt?», kan svaret være kort: «Plattformen bruker Digdir Designsystemet — her er sertifiseringsrapporten og lenken til Digdirs egne tester.» Det er en helt annen samtale enn å forklare hvorfor utvikleren mente at `border-radius: 0.375rem` var greit nok.

## Hva det betyr i praksis for en booking

La oss ta et helt vanlig scenario: en idrettslagskasserer som søker om sesongleie. Skjemaet hun møter består av Digdir-komponenter — `Combobox` for valg av anlegg, `DatePicker` for tidsrom, `Textfield` for organisasjonsnummer (med innebygd BRREG-lookup), `Checkbox` for bekreftelse av leiebetingelser, `Button` for innsending. Hvert felt har riktig label-plassering, riktig fokusrekkefølge, og riktig feilmelding når noe mangler.

Når hun sender, vises en `Alert` i suksessfargen — samme grønntone som Min side bruker. Når Digdir oppdaterer sine kontrastregler, oppdateres Digilists alert automatisk ved neste deploy. Hun vil aldri merke det — men hun vil heller aldri møte et grensesnitt som plutselig føles fremmed.

## Hva som ligger utenfor designsystemet

Digdir Designsystemet løser _grensesnittet_, ikke _løsningen_. Det forteller deg ikke hvordan du strukturerer en sesongleiefordeling, hvordan du modellerer en kommunal prisstruktur eller hvordan du implementerer dobbeltbookingsbeskyttelse. Det er Digilists jobb, og en betydelig del av plattformens verdi. Men det forteller deg hvordan du _viser_ resultatet av disse beslutningene på en måte som er trygg, lesbar og lovlig.

## En anbefaling til kommunale anskaffere

I tilbudsforespørsler bør vi se Digdir Designsystemet — eller dokumentert ekvivalens — som et eksplisitt minstekrav. Det er den enkleste måten å sikre seg mot leverandører som bygger «raskt», men leverer en tjeneste som etter to års drift må reorganiseres for tilgjengelighetskrav, branding eller integrasjoner. Det er også den enkleste måten å gjøre rom for at neste anskaffelse blir billigere — ikke dyrere — enn forrige.

Digilist er bygget på Digdir Designsystemet fordi vi mener offentlig sektor fortjener verktøy som er gjenkjennelige, etterprøvbare og bytteklare. Det er ikke et komparativt fortrinn — det er et faglig minimum.

