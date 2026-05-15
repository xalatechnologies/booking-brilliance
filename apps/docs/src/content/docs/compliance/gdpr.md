---
title: GDPR
description: Personvernforordningen — hvordan Digilist behandler personopplysninger.
sidebar:
  order: 2
---

Digilist er databehandler for kommuner (behandlingsansvarlige) som bruker plattformen. Vi behandler personopplysninger om kommunens innbyggere på vegne av kommunen.

## Databehandleravtale

Standard EU-DPA. Signeres digitalt ved onboarding. Tilgjengelig på forespørsel før kontraktsignering.

## Rettslig grunnlag

| Behandlingsformål | Rettslig grunnlag (GDPR art. 6) |
|---|---|
| Leie av lokale (booking-flyten) | 6(1)(b) — avtaleoppfyllelse |
| Faktura og regnskap | 6(1)(c) — rettslig plikt (bokføringslov) |
| Saksbehandling i kommune | 6(1)(e) — offentlig myndighet |
| Markedskommunikasjon | 6(1)(a) — samtykke |
| Sikkerhetslogging | 6(1)(f) — berettiget interesse |

## Hva vi lagrer

| Data | Formål | Retention |
|---|---|---|
| Navn, e-post, telefon | Bookingbekreftelse, faktura | 7 år (bokføringslov) |
| Booking-historikk | Min side, fakturering | 7 år |
| Saksbehandler-kommentarer | Saksbehandling | 7 år (arkivloven) |
| ID-porten / BankID-claims | Identifisering ved innlogging | Ikke persistert utover sesjon |
| Webhook-loggføring | Debugging Stripe/Vipps | 90 dager |
| Audit-log (admin) | Sikkerhet, samsvar | 24 mnd |
| Chatbot-samtaler | Statistikk, prompt-forbedring | 30 dager (kan slettes per forespørsel) |

## Rettigheter

Innbyggere kan utøve sine GDPR-rettigheter via Min side eller ved å kontakte kommunen (behandlingsansvarlig). Vi som databehandler bistår innen 72 timer.

- **Innsyn** — eksport av all data tilknyttet innbygger som JSON + PDF
- **Retting** — innbyggeren retter selv navn/kontaktinfo i Min side
- **Sletting** — kommune godkjenner, vi sletter innen 30 dager (med unntak for data som må beholdes 7 år av bokføringsloven)
- **Dataportabilitet** — JSON-eksport av alle bookinger, kommentarer, fakturaer
- **Innsigelse** — direkte til kommunen, vi følger deres beslutning

## Brudd-håndtering (art. 33-34)

- **Internt:** brudd identifiseres via audit-log + Sentry + 24/7-oncall
- **72 timer:** vi melder til behandlingsansvarlig (kommune)
- **Kommunen:** melder til Datatilsynet innen 72 timer
- **Berørte:** kommunen varsler direkte når sannsynligheten for skade er høy

## Internasjonale overføringer

Alle primær-data behandles innenfor EØS. Anthropic (LLM-leverandør for chatbot + content agent) har EU-residency aktivert + zero-data-retention. Ingen Standard Contractual Clauses-overføringer til tredjeland.

## DPO-kontakt

dpo@digilist.no — svarer innen 5 virkedager. PGP-fingerprint tilgjengelig ved forespørsel.
