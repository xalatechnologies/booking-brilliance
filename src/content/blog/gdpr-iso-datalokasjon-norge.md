---
slug: gdpr-iso-datalokasjon-norge
title: "GDPR, ISO 27001 og datalokasjon: hva kommuner må vite"
description: "Norske kommuner stiller stadig høyere krav til persondata. Hva datalokasjon i Norge og EU dekker, og hva sertifiseringer faktisk ikke gjør."
date: 2026-05-10
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 7
tag: "Samsvar"
cover: "/images/blog/gdpr_iso27001_hero_no.webp"
keywords: ["GDPR", "ISO 27001", "datalokasjon", "personvern", "kommune", "SaaS"]
---

Norske kommuner som bytter ut interne fagsystemer mot SaaS-plattformer møter en sjekkliste av begreper: GDPR, ISO 27001, ISO 27701, databehandleravtale, dataregister, datalokasjon, schrems II. Listen kan virke skremmende, men kravene henger sammen, og en leverandør som tar dem på alvor kan vise nøyaktig hvordan hver enkelt del er løst.

## Hvorfor datalokasjon er det første spørsmålet

Norske kommuner behandler personopplysninger om innbyggere, ansatte og foreninger. GDPR-artikkel 44 og påfølgende artikler regulerer overføring av personopplysninger ut av EØS. Etter Schrems II-dommen (2020) er det i praksis svært vanskelig å overføre personopplysninger til USA, selv via standardklausuler, uten ytterligere risikobegrensende tiltak.

For SaaS-tjenester betyr dette tre praktiske krav:

1. **Data lagres i EU/EØS.** Helst i Norge for å unngå selv minimal kompleksitet rundt overføring.
2. **Backup og redundans er også innenfor EU/EØS.** Det hjelper ikke at primærdata ligger i Oslo hvis backup går til AWS US-East.
3. **Underleverandører er kartlagt.** Kommunen må vite hvilke tredjeparts-leverandører som behandler data: Stripe, Vipps, e-postutsender osv.

Digilist lagrer all kundedata i Norge og EU. Convex-instansen er hostet i EU-regioner, og PostgreSQL-clustre kjører i Norge eller EU. Backup følger samme regel.

## ISO 27001: hva sertifiseringen faktisk dekker

ISO 27001 er en standard for informasjonssikkerhetsstyringssystem (ISMS). Sertifiseringen betyr at en uavhengig revisor har verifisert at organisasjonen:

- Har dokumentert sikkerhetspolicyer og prosedyrer
- Identifiserer og behandler risiko systematisk
- Har tilgangsstyring, logging og hendelseshåndtering
- Har avtaler med underleverandører som dekker sikkerhetskrav
- Gjennomfører regelmessige revisjoner og forbedrer kontinuerlig

**Det ISO 27001 ikke alltid betyr:** at hver enkelt komponent i tjenesten er sikker. Sertifiseringen er om _systemet_ for å håndtere sikkerhet, ikke om _produktet_ i seg selv. En grundig kommune bør derfor be om både sertifikatet OG penetrasjonstestrapporter for selve produktet.

## ISO 27701: personvernsutvidelsen

ISO 27701 utvider ISO 27001 med spesifikke personvernkontroller: kartlegging av personopplysningsbehandling, registreredes rettigheter, samtykkehåndtering og databehandleravtaler. For en SaaS-leverandør som behandler kommunale persondata er ISO 27701 et tydelig signal om personvernmodenhet.

Digilist er sertifisert mot både ISO 27001 og ISO 27701.

## Databehandleravtale (DPA): det viktigste dokumentet

Når kommunen tar i bruk en SaaS-tjeneste, blir kommunen behandlingsansvarlig og SaaS-leverandøren databehandler. GDPR krever en skriftlig databehandleravtale (DPA) som regulerer:

- Formål med behandlingen
- Type personopplysninger som behandles
- Varighet av behandlingen
- Sikkerhetstiltak
- Underdatabehandlere (sub-processors)
- Plikter ved sikkerhetsbrudd og innsynsbegjæringer
- Sletting eller tilbakelevering av data ved avslutning

Digilists standard DPA er tilgjengelig før kontraktsinngåelse, ikke etter. Det er et tegn å være oppmerksom på: en leverandør som «sender DPA senere» har sjelden tenkt grundig gjennom personvern.

## Dataregister og rett til sletting

GDPR krever at kommunen som behandlingsansvarlig har oversikt over hvilke personopplysninger som behandles, hvor de er, og kan slette dem på forespørsel.

For Digilist betyr dette praktisk:

- Hver innbygger har et innbyggerprofil-objekt som inneholder alle deres data
- Sletting på forespørsel går gjennom et eget endepunkt som rydder data fra alle tabeller
- Audit-loggen anonymiseres (ikke slettes: den må bevares for andre formål) etter rettferdig periode

## Audit-logg og etterprøvbarhet

GDPR krever at behandlingsansvarlig kan dokumentere _hva som er gjort, av hvem, når_. Digilist har en gjennomgående audit-logg som registrerer hver mutasjon i systemet: hvem som booket, hvem som godkjente, hvem som slettet, og når. Loggen er uforanderlig og kan eksporteres til kommunens systemer ved revisjon.

## WCAG 2.0 AA: universell utforming

Forskrift om universell utforming av IKT-løsninger pålegger kommuner å oppfylle WCAG 2.0 AA. Dette gjelder også SaaS-tjenester som tilbys til innbyggere. Digilist tester mot WCAG 2.1 AA og kjører automatiserte axe-core-revisjoner på hvert deploy. Vi publiserer tilgjengelighetserklæring (a11y statement) i samsvar med Digdirs mal.

## Hva kommunen bør be om i anskaffelsen

1. ISO 27001-sertifikat (kopi)
2. ISO 27701-sertifikat (kopi), eller minimum dokumentasjon av personvern-modenhet
3. Penetrasjonstestrapport, ikke eldre enn 12 måneder
4. Standard databehandleravtale med vedlegg over underdatabehandlere
5. Beskrivelse av datalokasjon for primær- og backup-data
6. Tilgjengelighetserklæring (WCAG-status)
7. Prosedyrer for sikkerhetsbrudd og innsynsbegjæringer

For Digilist finner du alle disse dokumentene i vår [personvernerklæring](/personvern) og kontaktbar leverandørdokumentasjon: be om dem på [kontakt@digilist.no](mailto:kontakt@digilist.no).
