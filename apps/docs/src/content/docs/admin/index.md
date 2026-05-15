---
title: Admin-runbooks
description: Operatør-dokumentasjon for /admin/intelligence og Vekst-harness.
sidebar:
  order: 1
---

Digilist har to admin-overflater:

- `/admin/intelligence` — site-intelligence (uptime, SEO, WCAG, sikkerhet, lenker)
- `/admin/intelligence/vekst` — Vekst-harness (keyword agent + content draft agent + approval queue)

Begge bak HTTP Basic Auth. Credentials i `/etc/digilist-api.env`.

## Daglig rutine

1. **08:00** — Sjekk `/admin/intelligence` for errors fra nattens audits (kjørt 06:00 UTC)
2. **08:15** — Sjekk `/admin/intelligence/vekst/drafts` for nye drafts (kjørt 06:00 UTC)
3. **Approve / edit / reject** drafts som passer
4. **Publish** approved drafts manuelt — én klikk per draft

## Når noe går galt

| Symptom | Sannsynlig årsak | Sjekk |
|---|---|---|
| Login-popup fra browser | `WWW-Authenticate: Basic` lekker | Server ikke restartet etter deploy |
| `/api/content/state` returnerer 401 | Feil credentials i localStorage | Logg ut og inn igjen |
| Drafts genereres ikke | Anthropic-nøkkel mangler eller utløpt | `curl -s digilist.no/api/health` — sjekk `anthropicConfigured: true` |
| "indexed 0 existing docs" i logs | `src/content/blog/` ikke deployed til AUDIT_DIR | Re-kjør deploy.sh |
| Cron firer ikke | systemd-timer disabled | `systemctl status digilist-content.timer` |

Underseksjoner:

- [Site intelligence-runbook](/admin/intelligence/)
- [Vekst-harness-runbook](/admin/vekst/)
