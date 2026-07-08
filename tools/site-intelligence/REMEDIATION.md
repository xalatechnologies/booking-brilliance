# Finding Remediation Pipeline

> How issues surfaced by the intelligence scanner (and by out-of-scan
> reports) get **classified, clustered, routed, fixed, and verified** —
> turning a flat findings list into a closed remediation loop.

## Why the current model is insufficient

Today every finding is one row with a single action: **Foreslå fiks** →
an agent writes a diff → an admin marks it `accepted`. Two gaps:

1. **The last mile is a dead end.** `convex/agents/fixProposals.ts`
   `updateStatus("accepted")` only writes a status field. The code says so:
   *"Future: Accept opens a PR via GitHub API."* The AI hands you a diff and
   nothing happens.
2. **All findings are treated identically, but they fail differently.** A
   real scan of the 8 surfaces produced findings across six unrelated
   remediation channels — a single "AI writes a diff" button can't serve
   them.

## Finding taxonomy → remediation channel

Findings observed 2026-07-08, grouped by *how they actually get fixed*:

| Example finding | Channel | Fixable in this repo? |
|---|---|---|
| blog `h1.missing` + `landmark.main` + `content.thin` | **repo-code** (one template bug cleared *all* posts) | ✅ done |
| `/.env returns 200` on SPA surfaces | **false-positive** (catch-all index.html) | ✅ auditor rule |
| HSTS / CSP / X-Frame missing | **infra-config** (nginx on the VPS) | ❌ not code |
| `app.digilist.no` LCP 15.89s | **external-surface** (separate app/repo) | ❌ |
| SSL expires in 36d | **ops-cert** (certbot renewal) | ❌ recurring |
| homepage LCP 7.45s | **repo-code, hard** (real perf work) | ✅ |

## Design principles

1. **Cluster by root cause before acting.** The blog bug was ~3 findings ×
   N posts but *one* fix. Rank clusters by `severity × instances ×
   surface-weight`; act on "1 template bug", not 27 rows.
2. **Route each cluster to its channel, with the max _safe_ automation.**
3. **Verification is part of the loop.** Every remediation triggers a
   **targeted rescan** of the affected surface/URL and only auto-resolves
   when the finding actually clears — else it reopens with the failing
   output.
4. **Unify intake.** "Out of scan reports" (human-filed, Google Search
   Console, Lighthouse, uptime provider) normalize into the same `findings`
   shape via an intake adapter, so the pipeline is source-agnostic.
5. **Guardrails / trust tiers.** Auto-**PR** always; auto-**merge** never for
   security/infra — only a small whitelist of trivially-safe, rescan-verified
   fixes, behind a flag. Owned-domains only. No prod change without a green
   targeted rescan.

## The loop

```
scan / external report → normalize → classify → cluster → route
    ├─ repo-code    → AI diff → PR → auto-deploy → rescan → resolve|reopen
    ├─ infra        → nginx snippet → PR to infra/ → apply-infra → rescan
    ├─ false-pos    → suppress + fix-the-rule PR
    ├─ external     → open issue in owning repo (surface→repo map)
    └─ ops-cert     → certbot self-heal; alert only on renewal failure
```

## Reuse, don't rebuild

The pieces mostly exist — they just aren't wired into a loop:

- `convex/agents/fixProposals.ts` — extend `accept` to **open a PR**.
- `convex/audits/alerts.ts` `notifyAlerts` — already has Slack / email /
  **GitHub-issue** sinks → reuse for external-surface routing.
- `tools/content-agent/` — route content findings here.
- `.github/workflows/deploy.yml` — the auto-deploy that makes
  fix→deploy→verify hands-free.
- VPS daily audit timer (06:30) — the continuous scan feeding intake.

## Phased build

- **Phase 0 — de-noise** *(started)*
  - ✅ Fix `security.exposed-file` to ignore the SPA catch-all (`isSpaFallback`).
  - `suppressions` table (fingerprint → reason + optional expiry) the
    auditors consult, so known false positives don't recur.
  - Root-cause clustering in the issues view.
- **Phase 1 — close the code loop** *(headline)*
  - `fixProposals.accept` → Convex action opens a branch + commits the diff
    + opens a PR (via `GITHUB_TOKEN`); store the PR URL on the proposal.
  - On PR merge → auto-deploy → **targeted rescan** of the finding's surface
    → auto-resolve + PR comment on success; reopen on failure.
- **Phase 2 — infra + external routing**
  - `infra-config` → generate nginx header snippet → PR to `infra/` +
    idempotent `apply-infra.sh`.
  - `external-surface` → surface→repo map → open issues in owning repos.
  - `ops-cert` → certbot auto-renew timer; findings become renewal-health.
- **Phase 3 — intelligence**
  - Triage agent that classifies + clusters + drafts remediations on each
    scan, producing a pre-triaged queue instead of a flat list.
  - Trust-tiered auto-merge for the safe whitelist.

See also `PLAN.md` (auditor architecture) and the dashboard scope note.
