---
title: SSA-L 2026 sikkerhetsbilag
description: Statens standardavtale-L bilag 7 — Digilists samsvarsmatrise.
sidebar:
  order: 5
  label: SSA-L bilag 7
---

SSA-L 2026 (Statens standardavtale L for langvarig tilvirkning av løsning) er Norges standard for SaaS-anskaffelser i offentlig sektor. Bilag 7 dekker sikkerhetskrav.

## Samsvarsmatrise

| Krav | Status | Bevis |
|---|---|---|
| 1.1 Generelt sikkerhetsnivå | ✅ Oppfylt | ISO 27001 (Q3 2026), NSM grunnprinsipper |
| 1.2 Risikobasert tilnærming | ✅ Oppfylt | Risk register, årlig revurdering |
| 2.1 Identitet og tilgang | ✅ Oppfylt | ID-porten OIDC, BankID, RBAC |
| 2.2 Sterk autentisering | ✅ Oppfylt | ID-porten nivå 4 påkrevd for admin |
| 2.3 Privilegert tilgang | ✅ Oppfylt | Step-up auth for skriving til sensitive felt |
| 3.1 Kryptering i hvile | ✅ Oppfylt | AES-256-GCM, SECRETS_MASTER_KEY i env |
| 3.2 Kryptering i transitt | ✅ Oppfylt | TLS 1.3, HSTS preload |
| 3.3 Nøkkelhåndtering | ✅ Oppfylt | platformSecrets-tabell, separat fra hoveddata |
| 4.1 Sikker utvikling | ✅ Oppfylt | Snyk, Semgrep, code review per PR |
| 4.2 Sårbarhetshåndtering | ✅ Oppfylt | Dependabot + Snyk daglig, patch-SLA |
| 5.1 Logging og overvåking | ✅ Oppfylt | audit-log, Sentry, journalctl |
| 5.2 Hendelseshåndtering | ✅ Oppfylt | Incident response plan, 72t GDPR-frist |
| 6.1 Backup | ✅ Oppfylt | Daglig kryptert, off-site, månedlig test |
| 6.2 Gjenoppretting | ✅ Oppfylt | RTO 4t, RPO 1t |
| 7.1 Driftsmiljø | ✅ Oppfylt | EU-only (DE), ingen US Cloud Act-eksponering |
| 7.2 Sub-leverandører | ✅ Oppfylt | Liste i compliance/index, EU-DPA per leverandør |
| 8.1 Personvern | ✅ Oppfylt | GDPR-side, DPA, DPO |
| 9.1 Avtaleutløp | ✅ Oppfylt | Data-eksport-API, sletteplikt 30d etter avtale-slutt |

## Avvik / forbehold

Ingen avvik fra bilag 7-krav per dagens dato.

## Verifikasjon

Kommune som anskaffer kan verifisere samsvar via:

1. **Selvdeklarasjon** — denne siden + signert SSA-L bilag 7 fra Digilist AS
2. **Tredjeparts audit** — ISO 27001-sertifikat (Q3 2026)
3. **Pen-test-rapport** — siste tredjeparts pen-test (årlig, sist Q1 2026)
4. **Site-intelligence-dashboard** — public-summary på `/transparens` med oppdaterte score-tall per surface

## Kontakt

For SSA-L-svar og fullstendig anbudsdokumentasjon: tilbud@digilist.no
