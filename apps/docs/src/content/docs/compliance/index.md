---
title: Compliance
description: Digilists samsvar med GDPR, ISO 27001, NSM grunnprinsipper og SSA-L 2026 sikkerhetsbilag.
sidebar:
  order: 1
---

Digilist leverer SaaS til norsk offentlig sektor. Vi tar samsvar på alvor — under er hva vi støtter, hvilke krav vi oppfyller, og hvor du finner bevis.

## Rammeverk

| Rammeverk | Status | Dokumentasjon |
|---|---|---|
| GDPR + Personopplysningsloven | Aktiv etterlevelse | [GDPR-side](/compliance/gdpr/) |
| ISO 27001:2022 | Implementert, sertifisering Q3 2026 | [ISO-side](/compliance/iso27001/) |
| ISO 27701:2019 (PIMS) | Implementert som tillegg til 27001 | [ISO-side](/compliance/iso27001/#27701) |
| NSM grunnprinsipper for IKT-sikkerhet v2.2 | Mapped 12/12 prinsipper | [NSM-side](/compliance/nsm/) |
| SSA-L 2026 sikkerhetsbilag (bilag 7) | Full samsvarsmatrise | [SSA-L-side](/compliance/ssa-l/) |
| Universell utforming (WCAG 2.1 AA) | Tilgjengelighetserklæring | [UU-side](/compliance/uu/) |

## Datalokasjon

Alle data lagres innenfor EØS:

- **Primær drift** — Hostinger VPS, Tyskland (Frankfurt)
- **Backup** — Hetzner, Tyskland (Falkenstein) — daglig krypert snapshot
- **Convex** — selv-driftet på samme VPS, ingen utenlandske subprosessorer for kjernedata
- **Stripe Connect** — EU-regulert, kortdata aldri på Digilists infrastruktur

Ingen data ut av EØS. Ingen "US Cloud Act-eksponering" — vi bruker ikke AWS/Azure/GCP for produksjonsdata.

## Sub-processors

| Tjeneste | Formål | Lokasjon | DPA |
|---|---|---|---|
| Hostinger | Hosting | DE | Standard EU-DPA |
| Resend | E-post transaksjonell | DE (Frankfurt) | Standard EU-DPA |
| Stripe | Kortbetaling | IE (Dublin) | Standard EU-DPA |
| Vipps Mobilepay | Mobil betaling | NO | Norsk leverandør, GDPR-pliktig |
| Signicat | ID-porten / BankID | NO | Norsk leverandør |
| Anthropic | LLM (chatbot, content agent) | EU residency available | Standard EU-DPA + zero-data-retention |

Full liste i kommunens databehandleravtale. Endringer i sub-processors varsles 30 dager før effekt per art. 28 GDPR.

## Sikkerhetsrutiner

- **Pen-test** — årlig av tredjepart, sist Q1 2026
- **Vulnerability scanning** — daglig Snyk + Dependabot
- **Backup-test** — månedlig full-restore-øvelse
- **Incident response** — 72-timers GDPR-frist, 24-timers NIS2-frist for relevante hendelser
- **Audit log** — all admin-aktivitet i `agent_actions`-tabellen, retention 24 mnd

## Kontakt

- **DPO** — dpo@digilist.no
- **Sikkerhetshendelser** — security@digilist.no (PGP-key på samme adresse)
- **Anskaffelse / samsvarsdokumenter** — tilbud@digilist.no
