---
title: API-referanse
description: REST-endepunkter på api.digilist.no og digilist-api Node-tjenesten.
sidebar:
  order: 1
---

Digilist eksponerer tre kategorier endepunkter:

- **Public** — chatbot, kontaktskjema. Same-origin via nginx på digilist.no.
- **Admin** — site-intelligence, content-agent harness. Beskyttet med HTTP Basic Auth.
- **Platform** — booking-API, betaling, identitet. Convex actions bak api.digilist.no.

V1-dokumentasjonen dekker public + admin. Platform-API-et får egen seksjon når Convex-skjemaet er stabilt.

## Authentisering

| Endepunkt-prefiks | Auth-modell | Header |
|---|---|---|
| `/api/chat`, `/api/inquiry` | Same-origin + rate-limiting | (ingen) |
| `/api/audits/*` (unntatt `public-summary`) | HTTP Basic | `Authorization: Basic base64(user:pass)` |
| `/api/agents`, `/api/agents/chat` | HTTP Basic | `Authorization: Basic …` |
| `/api/content/*` | HTTP Basic | `Authorization: Basic …` |
| `/api/audits/public-summary` | Offentlig, skrubbet | (ingen) |

Basic-auth-credential er én streng `user:pass` lagret i `ADMIN_BASIC_AUTH` i `/etc/digilist-api.env`. Roteres manuelt — RBAC + flerbruker er planlagt for V2.

## Rate-limiting

In-memory sliding window per klient-IP. Overstyringer som returnerer `429 Slow down`:

- `/api/chat` — 30 requests/minutt
- `/api/inquiry` — 10 requests/minutt
- `/api/audits/recommend` — 30 requests/minutt

Ingen rate-limiting på admin GET-endepunkter (already auth-gated).

## Endepunkter

Se underseksjonene:

- [Chat + Inquiry](/api/public/) — innbyggerverktøy
- [Audits API](/api/audits/) — site-intelligence
- [Content Agent API](/api/content/) — Vekst-harness
