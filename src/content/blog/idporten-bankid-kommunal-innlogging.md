---
slug: idporten-bankid-kommunal-innlogging
title: "ID-porten og BankID: pålitelig innlogging i kommunale tjenester"
description: "ID-porten er Norges felles innloggingsløsning for offentlig sektor. Slik integrerer Digilist ID-porten og BankID, uten å håndtere passord."
date: 2026-05-16
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 7
tag: "Integrasjoner"
cover: "/images/blog/integrations_idporten_hero_no.webp"
keywords: ["ID-porten", "BankID", "eIDAS", "Signicat", "BRREG", "kommunal innlogging", "autentisering"]
---

For en kommune er innloggingen til en digital tjeneste ofte det første reelle møtet mellom innbygger og forvaltning. Den må være trygg nok til at sensitive operasjoner kan utføres, enkel nok til at en bestemor kan booke en kantine til 80-årsdagen, og rettskraftig nok til at en signert leiekontrakt holder i en domstol. I Norge løses alle tre kravene i samme grep: [ID-porten](https://www.idporten.no/), forvaltet av Digitaliseringsdirektoratet (Digdir).

## Hva ID-porten gjør

ID-porten er en _felles innloggingsproxy_ for offentlig sektor. Når en innbygger trykker «Logg inn» på en kommunal tjeneste, sendes hun videre til ID-porten, som tilbyr fire eID-er:

- **BankID** (mobilapp eller kodebrikke): det vanligste valget, levert av bankene i fellesskap.
- **BankID på mobil** (SIM-basert): en eldre, men fortsatt brukt variant.
- **MinID**: Skatteetatens eID for personer uten BankID.
- **Buypass**: et alternativ, særlig brukt av helsesektoren.

Etter vellykket pålogging signerer ID-porten en SAML- eller OpenID Connect-respons og sender brukeren tilbake til den kommunale tjenesten med verifisert identitet. eID-nivået (Substansiell eller Høyt iht. [eIDAS-forordningen](https://en.wikipedia.org/wiki/EIDAS)) ligger i responsen, så tjenesten kan kreve nivå Høyt for handlinger med kontraktsmessige konsekvenser.

Det er Digdir som har avtale med eID-leverandørene. Kommunen avtaler ikke direkte med BankID. Det forenkler både drift og juss.

## Hvordan Digilist kobler det sammen

Det finnes tre vanlige integrasjonsmodeller mot ID-porten: direkte mot Digdirs OpenID Connect-endepunkt, via [Signicat](https://www.signicat.com/) som mellomledd, eller via en kommunal IDP som allerede har avtale (Active Directory + FEIDE for ansatte, ID-porten for innbyggere). Digilist støtter alle tre, men anbefaler Signicat-modellen for innbyggertilgang:

1. **Reduserer driftsoverhead.** Signicat har levert ID-porten-integrasjoner siden 2007 og holder oversikten over sertifikater, fornyelser og protokollendringer.
2. **Gjør BankID på mobil enklere.** Signicat tilbyr en kraftig redirect-flyt som fungerer på alle norske mobilbankidvarianter uten ekstra konfigurasjon.
3. **Forenkler revisjonsspor.** Signicat lagrer signaturer på en standardisert måte: kommunens datatilsyn får én leverandørkontakt for hele eID-stakken.

Innloggingsflyten er overraskende kort fra innbyggerens perspektiv:

> Trykk «Logg inn» → BankID-app → bekreft → tilbake i Digilist, ferdig.

## Hva med lag og foreninger?

ID-porten verifiserer _personer_, ikke _organisasjoner_. Når et idrettslag skal søke om sesongleie, trenger vi mer enn at signatøren har BankID. Vi trenger å vite at hun har lov til å signere på vegne av laget. Digilist løser det med [Brønnøysundregistrene (BRREG)](https://www.brreg.no/):

1. Søker logger inn med BankID via ID-porten.
2. Digilist henter signatørens rolle i BRREG via personnummer (med samtykke).
3. Hvis personen er registrert som leder, nestleder, daglig leder eller styremedlem med signaturrett i den oppgitte organisasjonen, kobles søknaden til foreningen.
4. Hvis ikke, vises en feilmelding som forklarer at signatøren må be om delegert tilgang eller logge inn med korrekt rolle.

Resultatet: kommunen vet at hver sesongleieavtale er signert av noen med faktisk fullmakt, ikke bare av noen som hadde tilfeldig tilgang til lagets postkasse.

## Hva med ansatte i kommunen?

Saksbehandlerne logger ikke inn med ID-porten. De er allerede pålogget kommunens egen [FEIDE](https://www.feide.no/)-baserte identitetsstyring. Digilist kobler seg på via SAML 2.0 mot kommunens IdP og henter rolle, organisasjon og avdeling. RBAC-modellen i Digilist mapper FEIDE-rollene til lokale tillatelser:

- `kulturkonsulent` → kan godkjenne søknader, justere fordeling
- `vaktmester` → kan se aktive bookinger, varsles automatisk
- `kommunal_administrator` → kan endre regler, anlegg, priser

Når en ansatt slutter, fjernes vedkommende fra kommunens IdP, og Digilist arver tilgangsbortfallet automatisk på neste innlogging. Ingen «glemte ansatt-kontoer» som flyter rundt i revisjonen.

## Hva med innbyggere som ikke har BankID?

Det er en mindre, men reell gruppe. Digilist tilbyr to fallback-flyter for kommuner som ønsker det:

- **MinID** for innbyggere uten BankID: fortsatt eID, men nivå Substansiell i stedet for Høyt.
- **Saksbehandlerassistert booking**: innbygger ringer kommunens servicetorg, og en ansatt utfører bookingen på vegne av personen med dokumentert samtykke. Bookingen lagres med både innbyggerens og saksbehandlerens identitet.

Resultatet: ingen innbygger er teknisk utelukket fra å bruke kommunens tjenester.

## Når ID-porten ikke fungerer

Sjeldnere enn man tror, men det skjer: typisk når en innbygger har BankID, men passordbeskyttelsen er mistet, eller når banken har planlagt vedlikehold. Digilist viser da en klar feilmelding med Digdirs kontaktinformasjon for ID-porten-support, og logger feilen som en innbyggerhendelse for kommunens servicetorg. Det er Digdirs ansvar å bringe ID-porten tilbake. Kommunens ansvar er å informere innbyggerne, og det er Digilists ansvar å gjøre den informasjonen forståelig.

## Hvorfor det betyr noe

ID-porten er den enkleste måten en kommune kan dele tillit med innbyggerne sine på. Bestemoren som booker kantinen bryr seg ikke om eIDAS-nivåer eller SAML-signaturer. Hun bryr seg om at det føles trygt og at lenken til kommunen vises i topplinjen mens hun logger inn. Det er nettopp den følelsen ID-porten leverer, og det er nettopp den følelsen Digilist er bygget for å bevare.

