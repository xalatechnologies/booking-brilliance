# Digilist Growth Intelligence Agent Harness

> Multi-agent system that continuously monitors the Digilist ecosystem,
> discovers content opportunities, drafts content, and routes everything
> through a human approval queue before anything goes live.
>
> Sibling to `tools/site-intelligence/` (observability + audits).
> This package owns the *growth* side: keyword discovery, content
> generation, approval workflow.

## Agents in the harness

| # | Slug | Role | Tier | Source pkg |
|---|---|---|---|---|
| 1 | `monitoring`     | SRE — uptime, errors, regressions          | v1     | site-intelligence |
| 2 | `seo`            | Search visibility, metadata, schema         | v1     | site-intelligence |
| 3 | `keyword`        | Trend discovery + opportunity scoring       | v1     | content-agent |
| 4 | `content-draft`  | Drafts blog, LinkedIn, X                    | v1     | content-agent |
| 5 | `approval-queue` | Human review gateway (gates all publishing) | v1     | content-agent |
| 6 | `wcag`           | WCAG / UU / GDPR wording                    | v1+1   | site-intelligence |
| 7 | `security`       | Headers, exposed files, vulns               | v1+1   | site-intelligence |
| 8 | `competitor`     | Visibility benchmarking                     | v1+1   | content-agent (deferred runner) |
| 9 | `feedback`       | Post-publish analytics                      | deferred | external (GSC, Plausible) |
|10 | `task-generator` | Issue → developer task converter            | deferred | content-agent (deferred runner) |

V1 ships items 1–5 fully wired. The rest are registered in the
agent registry so the dashboard shows the org chart and budget gates,
but the runner code is deferred.

## Pipeline (V1)

```
discover  →  analyze        →  generate          →  approval        →  publish
─────        ───────           ────────              ────────           ───────
6 sources    cluster + gap     brief + drafts        human review       (gated)
gtrends      Claude haiku      Claude sonnet         in admin UI        LinkedIn / X / blog
reddit       TF-IDF coverage   blog + LI + X         approve / edit /   markdown file
hackernews                                           reject / schedule
rss
serpapi
seed-expand
```

Trigger types: `cli`, `dashboard`, `cron`.

## Strict V1 policy: nothing auto-publishes

- Every draft starts `status='pending'`.
- The Approval Queue is the only path to `status='approved'`.
- Even after approval, publish only fires when an admin clicks Publish.
- `CONTENT_AGENT_AUTO_PUBLISH=1` flag exists but is intentionally
  ignored in V1 — the publish endpoint requires explicit per-draft
  action regardless. Re-evaluate after 10+ approved-and-shipped drafts.

## Risk-tagged outputs

Every Claude action logs to `agent_actions` with:
- `risk` (low/med/high)
- `requires_review` (1 for any draft)
- `cost_usd` (Sonnet 4.6: ~$0.05/draft, Haiku 4.5: ~$0.003/cluster step)
- `tokens_in`, `tokens_out`

`agents.budget_usd_month` is the soft cap per agent. The dashboard
shows spend vs cap; exceeding it doesn't block (yet) but raises a
warning. Hard-gating goes in V2 once we have a month of real spend data.

## Trace IDs

Every draft has a back-pointer chain:
```
draft (id=N)
  ↑ brief (id=B)
      ↑ keyword_cluster (id=C)
          ↑ keywords (ids=[…])   each with source/sampled_at
```
The dashboard shows the full provenance for each generated draft so
the human reviewer knows what signal triggered it.

## Data store

SQLite at `tools/content-agent/reports/content.sqlite`.

Tables:
- `keywords` (raw signal per source)
- `keyword_clusters` (Claude-clustered topics)
- `coverage` (gap vs existing Digilist content via TF-IDF)
- `briefs` (audience + angle + outline + CTA)
- `drafts` (blog markdown / LinkedIn / X threads)
- `publish_connections` (LinkedIn + X OAuth status)
- `content_runs` (one row per orchestrator invocation)
- `agents` (registry — auto-seeded from `agent-registry.ts` on startup)
- `agent_actions` (every tool call, recommendation, draft, publish — full audit log)
- `tasks` (developer/content/security/wcag/seo tasks proposed by agents)

The snapshot writer flattens this to a single JSON file consumed by
`GET /api/content/state`.

## Setup runbook

### 1. Install optional deps

```bash
pnpm add -D better-sqlite3 tsx
# optional, only if you want Google Trends:
pnpm add -D google-trends-api
```

`better-sqlite3` is already pulled in by `tools/site-intelligence`.
`google-trends-api` is *optional* — the source returns `[]` if not
installed, so CI doesn't break.

### 2. Configure env (in `/etc/digilist-api.env` on VPS)

```bash
# Required
ANTHROPIC_API_KEY=sk-ant-...
ADMIN_BASIC_AUTH=user:pass    # already set for site-intelligence

# Optional — content sources
SERPAPI_KEY=...                # if you want real volume data
CONTENT_AGENT_RSS_FEEDS=https://www.digi.no/?service=rss,https://kommunal-rapport.no/rss
CONTENT_AGENT_REDDIT_SUBS=Norge,Oslo,Bergen,Trondheim
CONTENT_AGENT_DRAFTS_PER_RUN=5

# Optional — publishing (when ready to flip from drafts-only)
LINKEDIN_ACCESS_TOKEN=...      # 3-legged OAuth, w_member_social
LINKEDIN_ORG_URN=urn:li:organization:NNNNNNN
X_BEARER_TOKEN=...             # user-context token, Basic tier ($200/mo)
```

### 3. First run (local)

```bash
pnpm content:all
pnpm content:snapshot
```

Inspect `tools/content-agent/reports/content-snapshot.json`. The first
run will be slow (~3 min) — most time is Claude calls.

### 4. Daily cron on VPS (deploy.sh integration TODO)

```ini
# /etc/systemd/system/digilist-content.service
[Unit]
Description=Digilist Content Agent — daily run
After=network-online.target

[Service]
Type=oneshot
WorkingDirectory=/var/www/digilist-audit
EnvironmentFile=/etc/digilist-api.env
ExecStart=/usr/bin/pnpm content:all
ExecStartPost=/usr/bin/pnpm content:snapshot
```

```ini
# /etc/systemd/system/digilist-content.timer
[Unit]
Description=Run Digilist Content Agent daily at 06:00

[Timer]
OnCalendar=*-*-* 06:00:00
RandomizedDelaySec=600
Persistent=true

[Install]
WantedBy=timers.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now digilist-content.timer
```

## LinkedIn OAuth setup (when ready)

LinkedIn restricts posting to apps with **Marketing Developer Platform**
access. Without MDP, you can only post to a personal profile via
`w_member_social` — Company Page posts need `w_organization_social`
and MDP approval (2-6 weeks).

1. Create app at https://developer.linkedin.com/
2. Apply for "Share on LinkedIn" + "Sign In with LinkedIn" products
3. Apply for Marketing Developer Platform if posting to Company Page
4. 3-legged OAuth: redirect to LinkedIn → user authorizes → exchange
   code for access_token (60-day TTL) + refresh_token
5. Store `LINKEDIN_ACCESS_TOKEN` + `LINKEDIN_ORG_URN`
6. Refresh token rotation: build a small cron job that refreshes
   every 45 days (TODO — not in V1)

## X (Twitter) OAuth setup (when ready)

1. Apply for X API at https://developer.x.com/ — minimum Basic tier
   ($200/mo as of 2025) allows `POST /2/tweets`
2. Create app with OAuth 2.0 enabled
3. PKCE flow: redirect to X → user authorizes → exchange code
4. User-context access token (2hr TTL!) + refresh token (6mo)
5. Build refresh cron (TODO — not in V1)
6. Store `X_BEARER_TOKEN` in env

## What's deliberately *not* in V1

- **No autopublish.** Even with creds set, every publish requires
  an explicit per-draft admin click.
- **No real-time monitoring.** Daily cron is enough.
- **No embeddings.** TF-IDF cosine is good enough for the gap engine
  at this corpus size (~30 blog posts + ~15 pages).
- **No GitHub Issues sync.** The `tasks` table exists but the
  `task-generator` agent is deferred.
- **No competitor scraping yet.** The agent is in the registry as
  `deferred` so it shows in the org chart, but no runner.
- **No A/B testing of generated content.** Approval is binary.

## Surfaces in the admin dashboard

Routes under `/admin/intelligence/`:

- `/vekst` — Growth overview (agents org chart, run history, spend)
- `/vekst/keywords` — Recent keywords + clusters + gap scores
- `/vekst/drafts` — Approval Queue (pending → approved → published)
- `/vekst/kalender` — Scheduled + published timeline
- `/vekst/connections` — LinkedIn + X OAuth status
- `/vekst/aktivitet` — Full agent_actions log with cost + tokens
