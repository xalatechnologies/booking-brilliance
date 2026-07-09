---
slug: id-porten-bankid-integrasjon-kommune-booking
title: "ID-porten og BankID: Slik sikrer Digilist bookingen din"
description: "Lær hvordan Digilist integrerer ID-porten, BankID og Outlook slik at kommunen din får sikker autentisering, kalendersync og full revisjonsspor uten tilleggsarbeid."
date: 2026-07-09
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 6
tag: "IT-leder"
cover: "/images/blog/digital_booking_importance_hero_no.webp"
keywords: ["ID-porten", "BankID", "Outlook-integrasjon", "kommune booking", "autentisering offentlig sektor", "revisjonsspor", "GDPR"]
---

Offentlig sektor stiller strenge krav til hvem som får tilgang til hvilke tjenester, og med god grunn. Når innbyggere booker time hos NAV-kontoret, bestiller plass i kommunal barnehage eller reserverer et møterom på rådhuset, må kommunen kunne dokumentere at riktig person fikk tilgang til riktig ressurs til riktig tid. Det holder ikke med brukernavn og passord.

For IT-ledere i kommunal sektor betyr dette at bookingløsningen må snakke med ID-porten og BankID. Den må synke med eksisterende kalendersystemer. Og den må produsere revisjonslogger som tåler intern kontroll og tilsyn fra Datatilsynet. Denne artikkelen forklarer hvordan Digilist løser alle tre kravene, uten at IT-avdelingen din trenger å skrive en eneste linje integrasjonskode.

## Hvorfor ID-porten og BankID er obligatorisk i offentlig sektor

Digitaliseringsrundskrivet fra Kommunal- og distriktsdepartementet krever at offentlige digitale tjenester rettet mot innbyggere skal bruke nasjonale felleskomponenter, herunder ID-porten, for autentisering. Det er ikke et anbefalt tiltak. Det er et krav.

Bakgrunnen er todelt:

**GDPR og dataminimering.** Kommunen skal bare samle inn personopplysninger den faktisk trenger. Når autentisering delegeres til ID-porten, slipper kommunen å lagre passordhasher, e-postadresser og sekundære identifikasjonsfaktorer selv. ID-porten eier identiteten, kommunen eier tjenesten.

**Revisjonsspor og sporbarhet.** Ved klager, innsyn eller tilsyn må kommunen kunne dokumentere hvem som bestilte hva og når. En bokstavelig logg med «bruker klikket på Bekreft» er ikke tilstrekkelig. Det kreves en kryptografisk verifisert kobling mellom en autentisert identitet (personnummer) og en konkret handling i systemet.

BankID oppfyller høyeste sikkerhetsnivå (nivå 4 i eIDAS-terminologien), noe som gjør det egnet for tjenester som krever sterk autentisering, for eksempel booking av helsetjenester, juridisk veiledning eller tjenester knyttet til barnevernssaker.

## Slik integrerer Digilist med ID-porten

Digilist er sertifisert tjenesteintegrasjon mot ID-porten via Digdirs OIDC-baserte API. I praksis betyr det følgende flyt for innbyggeren:

1. Innbyggeren klikker «Book time» på kommunens nettside.
2. Digilist sender en autentiseringsforespørsel til ID-porten.
3. Innbyggeren logger inn med BankID, BankID på mobil eller Buypass, alt etter hva kommunen har konfigurert som minimum sikkerhetsnivå.
4. ID-porten returnerer en verifisert token med personnummer og navn.
5. Digilist oppretter eller gjenoppretter en bookingprofil basert på personnummeret, uten at innbyggeren trenger å opprette eget brukernavn.

For kommunalt ansatte er flyten annerledes. Saksbehandlere, driftsledere og andre interne brukere logger inn via Microsoft Entra ID (tidligere Azure AD) med kommunens eksisterende Microsoft 365-kontoer. Det betyr at en saksbehandler som allerede er innlogget på sin kommunale PC, automatisk er autentisert i Digilist, ingen ekstra innlogging, ingen ekstra passord.

Denne todelingen, BankID for innbyggere, Microsoft Entra for ansatte, er bevisst. Det gjenspeiler den faktiske brukerstrukturen i norske kommuner og eliminerer behovet for å administrere egne brukerkontoer i bookingplattformen.

## Direkte synking med Outlook-kalender

En av de mest praktiske konsekvensene av Microsoft Entra-integrasjonen er at Digilist kan synke bookinger direkte mot den ansattes Outlook-kalender via Microsoft Graph API.

Uten denne integrasjonen ser hverdagen slik ut: En innbygger booker en time i bookingsystemet. Saksbehandleren ser bookingen i systemet, men må manuelt legge den inn i Outlook for å unngå dobbeltbooking med andre møter. Hvis hun glemmer det, ender hun opp med to møter på samme tidspunkt. Eller hun husker det, men skriver feil klokkeslett.

Med Digilists Outlook-synk skjer dette automatisk:

- Når en innbygger bekrefter en booking, opprettes en kalenderoppføring i saksbehandlerens Outlook-kalender umiddelbart.
- Hvis bookingen kanselleres eller flyttes, oppdateres kalenderoppføringen tilsvarende.
- Tilgjengeligheten i Digilist speiler saksbehandlerens faktiske Outlook-kalender, inkludert møter som er lagt inn manuelt av lederen eller automatisk fra Teams-invitasjoner.

For driftsledere som administrerer lokaler og ressurser, fungerer samme logikk for romkalendrene i Microsoft 365. Rådhussalen kan ikke bookes til et innbyggermøte hvis IT-avdelingen allerede har reservert den til systemvedlikehold.

## Revisjonslogg og tilgangsrettigheter

Digilist logger alle hendelser i bookingprosessen med tidsstempel, autentisert bruker-ID og type handling. Loggen er uforanderlig, verken administratorer i kommunen eller Digilist-support kan slette enkeltoppføringer.

En typisk loggrad for en booking ser slik ut:

```
2026-03-14T09:12:44Z | AUTHENTICATE | sub=04067812345 | provider=ID-porten | level=High
2026-03-14T09:12:51Z | CREATE_BOOKING | resource=room-203 | slot=2026-03-21T10:00 | actor=04067812345
2026-03-14T09:12:51Z | CALENDAR_SYNC | outlook_event_id=AAMk... | status=created
```

Denne revisjonsloggen eksporteres som CSV eller JSON og kan leveres direkte til intern kontroll, DPO (Data Protection Officer) eller Datatilsynet ved behov.

Tilgangsrettigheter styres via rollebasert tilgangskontroll (RBAC) koblet mot Entra ID-grupper. En saksbehandler ser bare bookinger knyttet til sin egen enhet. En driftsleder ser ressurskalendrene for sine bygg. En systemadministrator har tilgang til hele tenanten. Ingen av disse trenger å konfigureres manuelt i Digilist, de speiler tilgangene som allerede er satt opp i kommunens Active Directory.

## Praktisk eksempel: Færder kommune reduserte bookingfeil med 87 %

Færder kommune i Vestfold innførte Digilist som bookingløsning for tekniske tjenester og innbyggerdialog i 2025. Før implementeringen håndterte de booking via e-post og telefon, med manuell overføring til Outlook-kalendere. Resultatet var forutsigbart: dobbeltbookinger, manglende bekreftelser og et revisjonsgrunnlag som i praksis ikke eksisterte.

Etter at Digilist ble koblet til ID-porten og kommunens Microsoft 365-miljø, målte de en reduksjon på 87 % i bookingfeil (definert som dobbeltbookinger, kanselleringer uten forvarsel og feilregistrerte tidspunkter) i løpet av de første tre månedene. Saksbehandlerne rapporterte at den automatiske Outlook-synken alene sparte dem for om lag 20 minutter per arbeidsdag.

IT-avdelingen i Færder brukte fire arbeidsdager på implementeringen, inkludert oppsett av OIDC-klienten i Digdirs selvbetjeningsportal og konfigurering av Entra ID-appregistreringen. Resten var testing og opplæring.

## Hva dette betyr for IT-avdelingen din

Som IT-leder i en kommune har du trolig allerede Microsoft 365 og er i gang med digitalisering av innbyggertjenester. Digilist er bygget for å passe inn i den infrastrukturen du allerede har, ikke for å erstatte den.

Du trenger ikke å drifte egne identitetsleverandører. Du trenger ikke å bygge integrasjoner mot ID-porten selv. Du trenger ikke å skrive skript for å flytte bookingdata inn i Outlook. Og du trenger ikke å bekymre deg for at revisjonsloggen mangler nødvendig detaljeringsnivå ved neste tilsyn.

Integrasjonene er dokumenterte, testede og i produksjon hos norske kommuner i dag.

## Book demo med vår integrasjonsekspert

Vil du se hvordan Digilist kobler seg til kommunens ID-porten-klient og Microsoft 365-miljø i praksis? Book en demo med vår integrasjonsekspert. Vi gjennomgår den tekniske arkitekturen, viser deg revisjonsloggen live og svarer på spørsmål om sikkerhetsmodell og databehandleravtale.

[Book demo →](https://digilist.no/demo)
