---
title: Content Agent API
description: Vekst-harness — keyword discovery, draft generation, approval queue.
sidebar:
  order: 4
---

Endepunkter for Growth Intelligence Agent Harness. Alle krever Basic Auth.

## GET /api/content/state

Snapshot av hele harness-state: agenter, keywords, klynger, drafts, runs, actions, connections, tasks.

```json
{
  "generatedAt": "2026-05-15T13:00:00Z",
  "agents": [
    {
      "slug": "keyword",
      "name": "Keyword Intelligence Agent",
      "role": "Trend discovery + opportunity scoring",
      "status": "active",
      "tier": "v1",
      "allowed_tools": ["gtrends:rising", "reddit:list", "..."],
      "budget_usd_month": 15,
      "monthly_spend_usd": 0.04,
      "risk_default": "low"
    }
  ],
  "clusters": [{ "id": 1, "label": "...", "composite_score": 92, "coverage": { "gap_score": 80 } }],
  "drafts": { "pending": [...], "approved": [...], "published": [...], "rejected": [...] },
  "keywords": { "recent": [...] },
  "runs": [...],
  "actions": [...],
  "connections": [...],
  "tasks": [...]
}
```

## POST /api/content/run

Trigger pipeline. Async — returnerer 202.

**Body:**

```json
{ "phase": "all|discover|analyze|generate" }
```

`all` kjører discover → analyze → generate sekvensielt (~5-10 min på prod).

## POST /api/content/drafts/:id/approve

Marker en draft som godkjent. Påkrevd før publish.

**Body (optional):** `{ "note": "string", "reviewer": "string" }`

## POST /api/content/drafts/:id/reject

Avvis en draft. Beholdes i basen for prompt-retraining.

**Body (optional):** `{ "note": "string", "reviewer": "string" }`

## POST /api/content/drafts/:id/edit

Rediger draft før publish.

**Body:**

```json
{ "title": "string (optional)", "body": "string (optional)" }
```

Minst én av `title` og `body` må være satt.

## POST /api/content/drafts/:id/publish

**Eksplisitt menneskelig handling.** Eneste vei ut av harness for ekstern publisering.

Krever at draft har `status='approved'`.

Avhengig av channel:

- **blog** — skriver `<slug>.md` til `src/content/blog/` og bygges på neste deploy
- **linkedin** — POST til `linkedin.com/v2/ugcPosts` (krever `LINKEDIN_ACCESS_TOKEN` + `LINKEDIN_ORG_URN`)
- **x** — splitter `body` på `\n---\n`, posts som tråd via X v2 API (krever `X_BEARER_TOKEN`)

**Returns ved success:**

```json
{ "ok": true, "externalUrl": "https://...", "externalId": "..." }
```

**Returns ved manglende credentials:**

```json
{ "ok": false, "errorCode": "missing-credentials", "error": "LinkedIn credentials missing. Set LINKEDIN_ACCESS_TOKEN + LINKEDIN_ORG_URN in /etc/digilist-api.env." }
```

Draft beholdes som `approved` slik at en admin kan retry etter å ha satt credentials.
