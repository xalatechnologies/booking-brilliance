# Knowledge agent (self-learning layer)

The fleet-wide, cross-agent learning loop: **capture -> distill -> inject**.
It generalizes two things that used to live in separate agents — the content
agent's OB1-style content-memory and the improvements agent's `learnings[]` —
into one loop every agent feeds and reads from.

## Six sources

1. **Repository patterns** — mined via `codebase-memory` during distill.
2. **Industry best practice** — for the tracked stack (see `STACK_WATCH` in
   `src/distill.ts`: TypeScript, Convex, React, Vite, Node.js, WCAG/a11y, OWASP).
3. **Its own mistakes** — blocking PR reviews, blocked/no-PR implement runs,
   false-positive verdicts.
4. **User feedback** — direct human corrections (`captureUserFeedback`).
5. **Content signals** — durable house-style notes from the content agent's memory.
6. **Latest technology trends + stack docs** — WebSearch/docs during distill,
   to keep the fleet current as the ecosystem moves (new majors, deprecations,
   best-practice shifts).

## Store: hybrid (Open Brain + wiki)

- **Open Brain** (`tools/improvements-agent/brain/brain.json`, gitignored) is
  the backbone machine store. This module does not stand up a competing
  store: it extends Open Brain with a `signals` inbox (raw, undistilled
  capture) and a `knowledge` array (distilled, provenance-tracked
  `Learning[]`). Agents read it programmatically via `recall()`/`inject.ts`.
- **The wiki** (`KNOWLEDGE.md` + `docs/knowledge/<topic>.md`) is a
  human-readable render of the same data, one topic file per learning type.
  Open Brain is the single source of truth; the wiki is regenerated from it on
  every distill run (`renderWikiFromStore`) — edits to the wiki files
  themselves are overwritten on the next run.

**Where the wiki lives (privacy).** The learnings are distilled from the
**private** Digilist app repo's internals (security/convex/auth patterns) and
from verbatim agent output, so the wiki must **never** be committed to *this*
public `booking-brilliance` repo. It is therefore:
- **`.gitignore`d here** (`/KNOWLEDGE.md`, `/docs/knowledge/`) — a hard guard so
  a stray render can't leak it, even locally.
- **published to the private Digilist repo** on a dedicated **`fleet-knowledge`**
  branch, via an isolated worktree, by the VPS runner. Never `main`/`dev`, so it
  can't trigger an app deploy or collide with real development.
- The render target is `KNOWLEDGE_WIKI_ROOT` (defaults to `DIGILIST_REPO_PATH`);
  the runner points it at the knowledge worktree.

Agents never need the wiki files — they recall the same learnings
programmatically via Open Brain (`recall()`/`inject.ts`). The wiki is purely
for humans to browse in the private repo.

## Capture

`src/capture.ts` exposes best-effort helpers (never throw, dedup in the
store) wired at the obvious points:

- `capturePrReview` — a `request-changes` review verdict (`pr-review-agent/src/run.ts`)
- `captureBlockedRun` / `captureNoPr` — an implement run that ended
  BLOCKED/CLARIFICATION or produced no PR (`improvements-agent/src/implement-run.ts`)
- `captureFalsePositive` — a scanner verdict that turned out to be
  exists/not-actionable/not-found (`improvements-agent/src/run.ts`)
- `captureUserFeedback` — direct human corrections, call manually
- `captureContentSignals` — pulled automatically at the start of `learning:run`

## Distill

```bash
pnpm learning:run                # distill + persist + render wiki + file advisory upgrades
pnpm learning:run -- --dry-run   # distill + print, persist nothing, file nothing
pnpm learning:run -- --no-web    # skip trend research (repo + signals only)
pnpm learning:run -- --no-file   # persist + render, skip filing Linear issues
pnpm learning:run -- --render-only  # re-render KNOWLEDGE.md from the store, no agent call
```

A capable Opus agent (`runClaudeAgent`, Claude Max via `LLM_PROVIDER=claude-cli`)
reviews the pending signals + existing knowledge, mines repo patterns and
current best practice/trends, and returns deduped, provenance-tracked
learnings as JSON (`src/distill.ts`). Learnings with no `source_ref` are
rejected — nothing is fabricated. Statements the agent flags as stale are
demoted (kept for history, no longer injected or shown in the wiki).

When a tech trend implies an upgrade (e.g. a new TypeScript major), the
distiller can attach an `upgrade` suggestion. `learning:run` files it as an
**advisory** Linear issue in the "Digilist - Improvements Agent" project,
parked in **Backlog** — behind the human Todo gate, same as every other
improvement the fleet proposes. It never runs itself.

## Inject

`src/inject.ts` -> `relevantLearnings(agent, { context })` ranks the store by
`recall()` (applies_to match + keyword overlap + confidence + recency) and
returns a compact, token-budgeted block (default: 6 learnings, ~1200 chars).
`runCapableAgent` (`content-agent/src/claude-agent.ts`) takes an optional
`agent`/`injectContext` and prepends that block to the system prompt when
set — this is wired into `pr-review` and `improvements` (analyze) already.
Wire a new agent by passing `agent: "<name>"` to `runCapableAgent`.

## Tests

```bash
pnpm learning:test
```

Pure unit tests over the store, recall ranking, dedup/compounding, the
distill parser, and wiki rendering. No live network, no file I/O against the
real brain.

## On the VPS

`vps-knowledge-runner.sh` mirrors the other `vps-*-runner.sh` scripts: pulls
`main`, runs `learning:run` on the Claude Max login, then commits+pushes the
regenerated wiki (`KNOWLEDGE.md` + `docs/knowledge/`) to the **`fleet-knowledge`**
branch of the **private** Digilist repo (via an isolated worktree), never to
this public repo and never to the app's `main`/`dev`. Best-effort — skipped
cleanly when unchanged or when the private repo isn't reachable.

Optional env: `KNOWLEDGE_WIKI_BRANCH` (default `fleet-knowledge`),
`KNOWLEDGE_WIKI_WORKTREE` (default `/root/digilist-knowledge`),
`DIGILIST_REPO_PATH` (default `/root/Digilist`).

Not installed by this repo — a suggested systemd timer, daily or weekly
(distillation is cheap to run more often than the content/improvements
agents since it mostly reads what they already produced):

```ini
# /etc/systemd/system/digilist-knowledge.service
[Unit]
Description=Digilist Knowledge Agent — capture -> distill -> inject
After=network-online.target

[Service]
Type=oneshot
WorkingDirectory=/root/booking-brilliance
ExecStart=/root/booking-brilliance/tools/knowledge-agent/vps-knowledge-runner.sh
```

```ini
# /etc/systemd/system/digilist-knowledge.timer
[Unit]
Description=Run Digilist Knowledge Agent daily at 05:00

[Timer]
OnCalendar=*-*-* 05:00:00
RandomizedDelaySec=600
Persistent=true

[Install]
WantedBy=timers.target
```
