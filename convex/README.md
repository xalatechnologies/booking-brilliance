# Convex backend for the admin dashboard

Replaces the SQLite + JSON-snapshot pipeline behind `/admin/intelligence/*`.
After this migration the dashboard is fully reactive — approving a draft
updates every other open tab instantly, no polling, no race.

## What's done (this session)

- `convex/schema.ts` — 15 tables covering content-agent + site-intelligence
- `convex/auth.ts` — shared-token auth that reuses the existing dashboard Basic-auth
- `convex/content/drafts.ts` — approve / reject / edit / create / markPublished
- `convex/content/publish.ts` — LinkedIn UGC + X tweet action
- `convex/content/state.ts` — reactive snapshot (replaces `/api/content/state`)
- `convex/content/keywords.ts` — upsertKeyword / createCluster / upsertCoverage
- `convex/content/runs.ts` — start / finish / logAction
- `convex/content/agents.ts` — agents / connections / tasks / briefs
- `src/App.tsx` — `ConvexProvider` wired with localStorage-token auth
- `src/pages/admin/IntelligenceVekst.tsx` — `VekstDrafts` migrated to Convex hooks
- `scripts/migrate-sqlite-to-convex.ts` — one-shot content data importer

## Migration status — all phases complete

- ✅ Vekst pages (Overview / Keywords / Drafts / Connections / Aktivitet) — all reactive via Convex
- ✅ IntelligenceShell + every audit page — reactive via `api.audits.state.snapshot`
- ✅ `tools/content-agent/src/orchestrator.ts` — writes via `ConvexHttpClient` (`tools/content-agent/src/convex-write.ts`)
- ✅ `tools/site-intelligence/src/orchestrator.ts` — same pattern (`tools/site-intelligence/src/convex-write.ts`)
- ✅ Dead routes removed from `server/index.mjs`: `/api/audits/state`, `/api/content/state`, `/api/content/drafts/:id/*`
- ✅ Deleted: `tools/content-agent/src/{cli,db,snapshot}.ts`, `tools/site-intelligence/src/{db,snapshot,dashboard}.ts`
- ✅ Deleted package.json scripts: `audit:snapshot`, `audit:dashboard`, `content:snapshot`. Added `convex:migrate`.

`server/index.mjs` still hosts `/api/audits/run`, `/api/content/run`,
`/api/audits/recommend`, `/api/audits/public-summary`, `/api/agents/chat`,
`/api/chat`, `/api/inquiry` — these aren't snapshot reads, they trigger
the orchestrators or proxy Claude / Resend. They stay.

## First-time setup (you run these locally)

```bash
# 1. Authenticate to Convex Cloud (interactive — opens a browser)
npx convex dev
#    Pick "Create a new project"
#    Name it e.g. "digilist-content"
#    Region: closest to your VPS (probably eu-west)

# 2. After convex/_generated/ appears, set the admin token on the deployment:
npx convex env set ADMIN_BASIC_AUTH_B64 "$(printf '%s' "$(grep ^ADMIN_BASIC_AUTH= .env.local | cut -d= -f2)" | base64)"

# 3. Optional — set publish credentials (otherwise publish returns missing-credentials)
npx convex env set LINKEDIN_ACCESS_TOKEN ...
npx convex env set LINKEDIN_ORG_URN urn:li:organization:NNN
npx convex env set X_BEARER_TOKEN ...

# 4. Copy your existing SQLite data into Convex
pnpm tsx scripts/migrate-sqlite-to-convex.ts

# 5. Verify locally
pnpm dev
#    Open http://localhost:8080/admin/intelligence/vekst/drafts
#    Log in with the same admin user:pass from .env.local
#    Approve a draft — it should disappear from the pending list
#    INSTANTLY (no refresh needed) and reappear under "approved · N+1".
```

`npx convex dev` keeps running and watches `convex/` for changes,
auto-deploying mutations as you edit them. Keep it open in a second
terminal while developing.

## Production deploy

```bash
# On your dev machine, push the production deployment URL into prod env:
npx convex deploy
#    → prints the production URL (e.g. https://gentle-fox-42.convex.cloud)

# Put that URL into the production env (e.g. /etc/digilist-api.env on VPS,
# and as VITE_CONVEX_URL in the build env):
VITE_CONVEX_URL=https://gentle-fox-42.convex.cloud

# Set the same admin token on the prod deployment:
npx convex env set --prod ADMIN_BASIC_AUTH_B64 "$(printf '%s' "<prod user:pass>" | base64)"

# Rebuild + ship the frontend with the URL baked in
pnpm build
./deploy.sh
```

The old `/api/content/*` HTTP routes can stay alive in parallel during
the migration — the dashboard now bypasses them for drafts, but the
tsx pipeline scripts (`pnpm content:all`) still write to SQLite until
task #7 is done.

## Auth model — why it's simple

Convex normally wants a real identity provider (Clerk, Auth0, Convex
Auth). For an admin-only dashboard with one shared password, that's
overkill. So:

1. The browser already stores `btoa("user:pass")` in localStorage
   (existing pattern from `intelligence-shared.ts`).
2. `App.tsx` calls `convex.setAuth(async () => localStorage.getItem(...))`
   so that string travels as `tokenIdentifier` on every Convex call.
3. `convex/auth.ts:requireAdmin()` compares it to
   `process.env.ADMIN_BASIC_AUTH_B64` and rejects on mismatch.

If you later want per-user identities (audit log "approved by X"), swap
this for Convex Auth with a custom JWT issuer. The mutation signatures
don't change — `args.reviewer` already exists.
