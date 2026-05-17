---
title: Audits API
description: Site-intelligence — uptime, SEO, WCAG, security, links audits.
sidebar:
  order: 3
---

Alle endepunkter under `/api/audits/` (unntatt `public-summary`) krever Basic Auth.

## GET /api/audits/public-summary

**Offentlig, ingen auth.** Returnerer skrubbede score-tall per overflate for transparens-siden. Inneholder ingen URL-er, ingen finding-meldinger, ingen sensitive paths.

```json
{
  "generatedAt": "2026-05-15T13:00:00Z",
  "surfaces": [
    { "id": "marketing", "label": "Marketing — digilist.no", "type": "marketing", "environment": "production", "indexable": true, "origin": "https://digilist.no", "overall": 92, "scores": { "uptime": 100, "seo": 88, "a11y": 95, "security": 84, "links": 100 } }
  ],
  "ecosystem": { "avgScore": 92, "surfacesHealthy": 4, "surfacesWithErrors": 0 }
}
```

## GET /api/audits/state

**Basic auth.** Full snapshot for `/admin/intelligence`. Inneholder targets, latest runs per audit-type, recent runs, top findings, full per-issue details.

Returnerer innholdet av JSON-snapshot-filen (`AUDIT_SNAPSHOT_PATH`).

## POST /api/audits/run

**Basic auth.** Spawn-er `pnpm audit:all` på serveren. Async — returnerer 202 umiddelbart med et `runRequestId`.

**Body (optional):**

```json
{ "target": "marketing|app|dashboard|api|status|docs|marketing-dev" }
```

Uten `target` kjøres alle aktive overflater.

**Returns:** `{ "runRequestId": "1778...-abc", "status": "accepted" }`

Progress må sjekkes via `/api/audits/state` (regenerert etter run + snapshot).

## POST /api/audits/recommend

**Basic auth.** Tar et enkelt finding (rule + severity + message + url + auditType) og spør Claude om en strukturert fiks-anbefaling.

**Body:**

```json
{
  "rule": "string",
  "severity": "error|warn|info",
  "message": "string",
  "auditType": "seo|a11y|security|uptime|links|performance|vulns",
  "url": "string (optional)",
  "surface": "string (optional, default 'marketing')",
  "affected": "number (optional, default 1)"
}
```

**Returns:**

```json
{
  "recommendation": "## Problem\n…\n## Anbefalt fiks\n…\n## Akseptansekriterier\n…\n## Prioritet\n…",
  "model": "claude-haiku-4-5",
  "generatedAt": "2026-05-15T13:00:00Z"
}
```
