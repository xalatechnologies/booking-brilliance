---
slug: digilist-mobil-app
title: "Digilist mobil — booking i lomma, drift på vaktrommet"
description: "Innbyggerne booker fra mobil. Driftsrollene varsles på mobil. Saksbehandlerne signerer fra mobil. Digilists native iOS- og Android-apper er ikke en web-wrap — de er bygget for jobben."
date: 2026-05-24
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 6
tag: "Mobil"
cover: "/images/blog/digilist_app_hero_no.webp"
keywords: ["mobil app", "React Native", "iOS", "Android", "push-varsler", "Digilist app"]
---

Vi vurderte tre veier til mobil før vi tok beslutningen: en responsiv webapp, en Capacitor- eller PWA-wrap, eller native React Native. Vi valgte native — og det er ikke et tilfeldig teknisk valg. Det handler om hva mobilen brukes til i en kommunal bookinghverdag.

## Tre veldig forskjellige mobilbrukere

En kommunal bookingplattform har tre mobilroller som har lite til felles, men deler samme telefon:

### 1. Innbyggeren

Hun booker idrettshallen til datterens bursdagsfest fra kassakøen på COOP. Hun har 90 sekunder. Den native appen leverer:

- **Vipps via mobilnavigasjon** — ikke en redirect, men direkte handover med fingeravtrykk-bekreftelse.
- **Apple Wallet / Google Wallet-integrasjon** — bekreftelsen lagres som et pass med booking-detaljer og digital nøkkel-QR-kode.
- **Push-varsler** ved bekreftelse, påminnelse 24 timer før, og dersom noe endres på anlegget.

### 2. Driftsrollen

Vaktmesteren i Lier kommune får varsel klokken 17:15 om at en booking starter 18:00 og krever oppvarming. På web ville hun måtte logge inn, navigere, lese. På mobilen:

- **Push-varsel** med all info: hvilket anlegg, hvilket rom, hvem som er booker, hvilket utstyr som er bestilt.
- **«Bekreft klar»**-knapp direkte fra varselet uten å åpne appen.
- **Geofenced check-in** — appen vet når hun er på anlegget og logger oppmøtetid automatisk.

Native gjør dette mulig på en måte web aldri har klart konsistent: bakgrunnsvarsler som faktisk kommer fram, posisjonsbasert utløsing, og widgets som viser dagens bookinger uten å åpne appen.

### 3. Saksbehandleren

Kulturkonsulenten godkjenner sesongleieavtaler på bussen mellom møter. Native gir henne:

- **Biometrisk signering** av godkjenninger — Face ID / fingeravtrykk binder beslutningen til personen, ikke bare til kontoen.
- **Offline-buffer** — godkjenninger som tas i tunellen lagres lokalt og synkroniseres når signalet kommer tilbake.
- **Kommando-snarveier** — saksbehandleren kan i samme rad sveipe høyre for «godkjenn med standardvilkår» eller venstre for «avvis med begrunnelse».

## Hvorfor native, ikke web-wrap

Capacitor og Cordova er praktiske for å gjenbruke webkoden. De har én avgjørende svakhet: ytelsen og innebygde mobilinteraksjoner er en hage av kompromisser. For en bookingplattform er det tre ting som ikke kan kompromiteres:

1. **Push-varselpålitelighet.** APNs og FCM håndteres direkte av native runtime. Web push fungerer, men er mindre forutsigbart, særlig på iOS.
2. **Vipps-handover.** Native deep-linking gir glatt veksling mellom Digilist og Vipps-appen. Web-wraps må gå gjennom Safari/Chrome med ekstra friksjon.
3. **Biometri og Secure Enclave.** Saksbehandlerens signatur må kunne lagres i telefonens sikkerhetsmodul — ikke i en `localStorage`-kopi som er sårbar for nettlesertilgang.

Digilist-appene er bygget med [React Native 0.74](https://reactnative.dev/), publisert i App Store og Google Play under [no.digilist.app](https://apps.apple.com/no/app/digilist/) (bundle-ID). UI-komponentene er en parallell — _ikke_ en kopi — til web-systemet, designet for tommelnavigasjon og mindre skjermflate.

## Når app, når web

Vi tror ikke alle skal bruke appen. For mange innbyggere er web like enkelt — eller enklere, fordi det ikke krever installasjon for én booking i året. Dette er våre anbefalinger:

- **App for driftsroller.** Vaktmestere, renhold og vektere trenger push-varsler og rask check-in. Web er for tregt.
- **App for saksbehandlere som er mye i felten.** Kulturkonsulenter, anleggsledere, vaktansvarlige som ikke sitter ved skrivebordet.
- **Web for innbyggere.** De som booker en eller to ganger i året klarer seg utmerket med en mobilvennlig web. Hvis de blir hyppige brukere, vil de installere appen selv.
- **App for organisasjoner med sesongleie.** Idrettslag og kulturkorps som booker uke etter uke har glede av appens widget og hurtigfunksjoner.

## Sikkerhet på toppen

Native gir mer enn ytelse. Hver app-installasjon binder seg til enhetens secure enclave, og en utlogging på web logger ikke automatisk ut app-økten — det er en separat sikkerhetspolicy som kommunen kan styre via Mobile Device Management hvis ansatte bruker arbeidstelefoner. Audit-loggen registrerer enhets-ID, biometrisk autentiseringsstatus og posisjonsdata når geofencing er aktivt — slik at en revisor kan rekonstruere ikke bare _hva_ saksbehandleren godkjente, men _hvor_ og _hvordan_.

