# Certbot auto-renew hardening

Certbot already renews the Digilist certs (`certbot.timer`, twice daily, +
`/etc/cron.d/certbot` fallback) at ~30 days before expiry — so the periodic
`uptime.ssl.expiry` findings are normal, not failures. The one gap: a
webroot/standalone renewal **doesn't reload nginx**, so a renewed cert can sit
unused until a restart.

This ships a **deploy-hook** that reloads nginx (after `nginx -t`) on every
successful renewal, closing the loop so SSL never lapses on the live sites.

```bash
./infra/certbot/install.sh   # ship the hook + dry-run verify
```

- Hook lands at `/etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh` — certbot
  runs it after any successful renewal, for any cert.
- The installer runs `certbot renew --dry-run` to prove the renewal + hook path
  works without touching live certs.

Part of the self-healing ops layer alongside `../sla-watchdog/` — see
`tools/site-intelligence/REMEDIATION.md` (ops-cert channel).
