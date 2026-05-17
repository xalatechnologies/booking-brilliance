---
title: Chat + Inquiry
description: Public endpoints used by the marketing site's chatbot and contact forms.
sidebar:
  order: 2
---

## POST /api/chat

Anthropic Claude proxy med RAG-bygget system-prompt. Bruker `claude-haiku-4-5` for kostnadseffektivitet.

**Body:**

```json
{
  "system": "string (max 8000 chars)",
  "messages": [{ "role": "user|assistant", "content": "string" }]
}
```

**Begrensninger:** maks 16 meldinger per request, system-prompt ≤ 8 KB.

**Returns:**

```json
{ "text": "Generert svar fra Claude" }
```

**Feil:** 503 hvis Anthropic-nøkkel ikke konfigurert, 429 ved rate-limit, 502 hvis Anthropic returnerer feil.

## POST /api/inquiry

Sender booking-/demo-forespørsler via Resend til admin@digilist.no + cc info@xala.no.

**Body:**

```json
{
  "name": "string",
  "email": "string (valid e-mail)",
  "organization": "string",
  "topic": "string",
  "phone": "string (optional)",
  "persona": "innbygger|saksbehandler|driftsleder|...",
  "summary": "string (optional)",
  "message": "string (optional)",
  "source": "chatbot|book-demo|kontakt-...",
  "contextSummary": "string (optional — chatbot context)"
}
```

**Returns:** `{ "ok": true }` ved sendt e-post.

**Feil:** 503 hvis Resend ikke konfigurert, 400 ved valideringsfeil, 502 hvis Resend feiler.

## GET /api/health

Public liveness-probe. Returnerer hvilke avhengigheter som er konfigurert.

```json
{
  "ok": true,
  "uptime": 12345.6,
  "anthropicConfigured": true,
  "resendConfigured": true,
  "auditConfigured": true
}
```
