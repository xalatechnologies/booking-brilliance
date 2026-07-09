---
slug: ddos-ransomware-beredskap-bookingplattform
title: "DDoS og ransomware: beredskap for bookingplattformer"
description: "Hvordan en bookingplattform skal håndtere et angrep eller utfall: RPO/RTO, backup, hendelseskommunikasjon og praktisk beredskapsplan."
date: 2026-05-15
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 7
tag: "Sikkerhet"
cover: "/images/blog/gdpr_iso27001_hero_no.webp"
keywords: ["DDoS", "ransomware", "beredskap", "RPO", "RTO", "backup", "kommune", "incident response"]
---

I anskaffelser av bookingsystem til norske kommuner blir det stadig oftere stilt detaljerte spørsmål om beredskap. Det er en sunn utvikling. Tidligere holdt det å skrive "vi har backup". Nå må svaret være konkret: hvor lenge varer utfallet, hva mister vi av data, og hvor finner innbyggerne informasjon mens systemet er nede?

Denne artikkelen er for kommunens IT-leder eller anskaffelsesansvarlig som vil vite hva de faktisk skal spørre om, og hva et godt svar høres ut som.

## RPO og RTO: de to tallene som teller

To begreper kommer igjen og igjen i beredskapsdiskusjoner:

- **RPO (Recovery Point Objective):** hvor mye data tåler vi å miste? Hvis siste backup er fra 04:00 i natt og systemet kollapser klokken 14:00, mister vi 10 timer med bookinger. For et kommunalt bookingsystem er det ofte uakseptabelt.
- **RTO (Recovery Time Objective):** hvor lenge tåler vi å være nede? Et idrettshall-booking som er nede en lørdag morgen koster i tapte arrangementer og frustrerte innbyggere.

Digilist mål:
- RPO: 0–5 minutter. Vi bruker punkt-i-tid-replikering, ikke nattlig backup.
- RTO: under 1 time for et regionalt utfall. Under 4 timer for et fullstendig leverandørutfall (failover til alternativ region).

Tall som er bedre enn dette koster fort uforholdsmessig mer. Tall som er dårligere kan være forsvarlige for små kommuner med få anlegg, men bør være avklart i kontrakten.

## DDoS: det enkleste angrepet å organisere

Distributed Denial of Service-angrep krever ingen avansert kompetanse. Det finnes booter-tjenester på det åpne nettet som leier ut angrepskapasitet for noen titalls dollar per time. Mål: gjøre tjenesten utilgjengelig for vanlige brukere.

For et bookingsystem ser et DDoS-angrep ut som plutselig massevis av trafikk mot bookingsidene, ofte i koordinerte bølger. Sluttbrukere får timeout. Saksbehandlere kan ikke logge inn.

Forsvar handler om to lag:

1. **Edge-nettverk med automatisk DDoS-mitigation.** Cloudflare, Fastly, Akamai og lignende CDNer absorberer trafikk på kanten av nettet, før det treffer applikasjonen. Digilist bruker en kommersiell CDN med automatisk mitigation aktivert som standard.
2. **Rate limiting på applikasjonsnivå.** Selv om CDN slipper igjennom mistenkelig trafikk, har applikasjonen sin egen begrensning per IP og per session.

For en kommune som vurderer leverandør: spør om DDoS-mitigation er inkludert eller en tilleggstjeneste. Et nei på "inkludert" betyr at den første angrepsdagen blir dyr.

## Ransomware: det dyreste angrepet

Ransomware er kvalitativt forskjellig fra DDoS. Mens DDoS skader tilgjengelighet, krypterer ransomware data slik at de ikke kan leses uten en nøkkel. Ofte stjeler angriperen dataene først, slik at også selve trusselen om publisering kan brukes for å presse betaling.

Forsvaret mot ransomware har tre faser:

### Før: gjør angrepet mindre sannsynlig

- Passordfri pålogging der det er mulig (ID-porten, BankID, FIDO2).
- Minste rettighet for ansatte. Saksbehandlere skal ikke ha admin-rettigheter.
- Patch-disiplin. Avhengigheter (npm-pakker, system-pakker) oppdateres kontinuerlig, ikke kvartalsvis.
- E-post-filtrering. Selv om bookingsystemet selv ikke håndterer e-post, er ansattes e-post den vanligste inngangsvektoren.

### Under: begrens skaden

- Tenant-isolasjon på funksjonsnivå. En kompromittert konto i én kommune skal ikke gi tilgang til en annen.
- Audit-logg som er separert fra produksjonsdata og ikke kan slettes.
- Read-replica i annen region, med separat tilgangskontroll. Hvis primær blir kryptert, har vi en uberørt versjon.

### Etter: gjenopprett raskt

- Punkt-i-tid-gjenoppretting til før kompromittering. Ikke bare "siste nattbackup", bokstavelig talt valgfritt øyeblikk innenfor retention.
- Tydelig hendelsesplan. Hvem ringer hvem? Hvilken informasjon går til Datatilsynet (72-timers fristen ved personvernhendelser)? Hvem snakker med media?
- Øvelse. Beredskapsplan som aldri er øvd, fungerer ikke når det smeller.

## Hva innbyggeren skal se hvis systemet er nede

Det er én ting som ofte glemmes: hva ser brukeren mens systemet er nede?

Standard status quo i norsk offentlig sektor er en hvit feilside med en kryptisk feilmelding eller en timeout. Det er den dårligste mulige opplevelsen.

Digilist har et separat status-domene (status.digilist.no) som er hostet uavhengig av hovedplattformen. Hvis selve plattformen er nede, viser statussiden:
- Hva som er nede og hva som fortsatt fungerer.
- Estimert gjenopprettingstid.
- Hvor brukeren skal henvende seg i mellomtiden.

Det er den enkleste tilliten-bygger en plattform kan ha.

## Beredskapsplan: sjekkliste for anskaffelse

Det en kommune bør kreve dokumentert:

1. RPO og RTO som tall, ikke som ord.
2. Hvor backup ligger (region, leverandør).
3. Hvor ofte gjenopprettings-test gjennomføres.
4. Hvilken DDoS-mitigation som er aktiv.
5. Hvordan en sikkerhetshendelse rapporteres til kommunen (kanal + tidsfrist).
6. Hvilken status-side innbyggere kan sjekke.
7. Når beredskapsplanen sist ble øvd.

Et leverandørsvar som inneholder konkrete tall og hendelsesreferanser er et godt svar. Et leverandørsvar som inneholder mest "vi tar sikkerhet på alvor" er ikke et svar.

## Veien videre

Beredskap er ikke en bryter man slår på når katastrofen kommer. Det er et kontinuerlig arbeid med øvelse, dokumentasjon og forbedring. Et bookingsystem som er bygget med beredskap som premiss er enklere å integrere, enklere å revidere, og mye enklere å forsvare når noe går galt.

Vil du lese videre? Se [Cyberangrep mot norske kommuner](/blogg/cyberangrep-norske-kommuner-bookingsystem) for trusselbildet, eller [Phishing-resistente innlogginger](/blogg/phishing-resistente-innlogginger-idporten-bankid) for det enkleste forsvarsgrepet.
