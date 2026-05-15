---
title: NSM grunnprinsipper v2.2
description: Mapping av Digilists tiltak mot NSMs 12 grunnprinsipper for IKT-sikkerhet.
sidebar:
  order: 4
---

NSMs grunnprinsipper for IKT-sikkerhet (versjon 2.2, sist revidert 2024) er Norges anbefalte rammeverk for offentlig sektor. Digilist har eksplisitt mappet alle 12 prinsipper.

## 1.x Identifiser og kartlegg

| ID | Tiltak |
|---|---|
| 1.1 | Asset-register over alle surfaces, miljøer, sub-processors |
| 1.2 | Roller dokumentert per ansatt; tilgang grunnet need-to-know |
| 1.3 | Risikovurdering årlig + ad-hoc ved store endringer |

## 2.x Beskytt og oppretthold

| ID | Tiltak |
|---|---|
| 2.1.1 | Patch SLA: kritiske 24t, høye 7d, middels 30d |
| 2.1.3 | Privilegerte kontoer har step-up auth (ID-porten høyt nivå) |
| 2.2.1 | TLS 1.3, HSTS preload-registry, OCSP stapling |
| 2.3.1 | Backup daglig, krypert, off-site (Hetzner DE) |
| 2.4.1 | Soneinndelt nettverk: marketing / app / dashboard / api adskilt |
| 2.5.1 | Single Sign-On via ID-porten for admin, MFA påkrevd |

## 3.x Oppdage hendelser

| ID | Tiltak |
|---|---|
| 3.1 | Sentry for app-feil, custom audit-log for admin-handlinger |
| 3.2 | site-intelligence kjører daglig — uptime, security headers, vulns |
| 3.3 | Brute-force-detection på login, automatic IP-bann via fail2ban |
| 3.4 | content-agent monitorer trusler i sanntid (planlagt V2) |

## 4.x Håndtere hendelser

| ID | Tiltak |
|---|---|
| 4.1 | Incident response plan, oppdatert årlig |
| 4.2 | On-call rotasjon, 24/7 dekning |
| 4.3 | Tabletop-øvelser kvartalsvis |

## 5.x Gjenopprette etter hendelser

| ID | Tiltak |
|---|---|
| 5.1 | RTO 4 timer, RPO 1 time |
| 5.2 | Backup-restore-test månedlig |
| 5.3 | Disaster recovery plan dokumentert, sist testet 2026-Q1 |

## Sertifisering

Digilist har ikke en formell NSM-sertifisering (det finnes ikke som ordning), men vi følger prinsippene som kontroll-rammeverk og kan dokumentere samsvar per prinsipp på forespørsel. Brukes som vedlegg til SSA-L-tilbud.

## Audit-vedlegg

På forespørsel leverer vi:

- Risk register (oppdatert kvartalsvis)
- Patch-log siste 12 mnd
- Backup-test-rapporter
- Incident response-rapporter (anonymisert)
- Penetrasjonstest-sammendrag (siste)
