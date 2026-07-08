# Digilist SLA watchdog

Active health-check + bounded auto-recovery for the Digilist surfaces — the
"act" half that the existing `digilist-audit-uptime` timer (which only records)
was missing. **Phase 1 of the autonomous remediation system** (see
`tools/site-intelligence/REMEDIATION.md`); this is the uptime/self-healing leg.

## What it does
Every 60s (`digilist-watchdog.timer`) it probes each surface and, on **sustained**
failure, recovers the backing service:

| Surface | Probe | On sustained fail |
|---|---|---|
| API | `http://127.0.0.1:3001/api/health` | restart `digilist-api` |
| digilist.no / app / status / docs | public HTTPS root | restart `nginx` (else escalate) |

Why it exists: `digilist-api` already has systemd `Restart=on-failure`, but that
only catches a **crash** — not a hung-but-alive process, a wedged nginx, or a
static surface that stopped serving. Active HTTP probes catch all of those.

## Guardrails (so the watchdog can't become the outage)
- **Consecutive-fail threshold** (3 ≈ 3 min) before it acts — no flapping.
- **Restart cooldown** (5 min) between restarts of the same service.
- **Rolling cap** (3 restarts/hour) → beyond that it stops restarting and
  **escalates only** (manual intervention needed).
- **Kill switch:** `touch /etc/digilist-watchdog.disabled` halts everything
  instantly; `rm` it to resume.
- Escalation via `SLACK_WEBHOOK_URL` (read from `/etc/digilist-api.env`).

## Install / operate
```bash
./infra/sla-watchdog/install.sh              # ship + enable the 60s timer
./infra/sla-watchdog/install.sh --uninstall  # remove cleanly
journalctl -u digilist-watchdog.service -f   # watch it
touch /etc/digilist-watchdog.disabled        # emergency stop (on the VPS)
```

## Not in scope here (later phases)
- Auto-**rollback** of a bad web deploy belongs in the deploy step (post-deploy
  health gate → `ln -sfn` previous release), not the periodic watchdog.
- Cert-expiry auto-renew (certbot timer) — separate ops-cert automation.
- The autonomous **code-fix** agent (detect → fix → PR → deploy → rescan) —
  Phase 1 of REMEDIATION.md, gated behind a shadow burn-in.
