#!/usr/bin/env bash
#
# Certbot deploy-hook — installed at
#   /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
#
# Certbot's timer already renews the certs, but a webroot/standalone renewal
# does NOT reload nginx, so a freshly-renewed cert can sit unused until the
# next manual restart. Certbot runs every executable script in
# renewal-hooks/deploy/ after ANY successful renewal — this reloads nginx so
# the new cert is served immediately. Validates config first so a bad state
# never takes nginx down.
set -euo pipefail

if nginx -t 2>/dev/null; then
  systemctl reload nginx
  echo "[certbot deploy-hook] nginx reloaded for renewed cert(s): ${RENEWED_DOMAINS:-?}"
else
  echo "[certbot deploy-hook] nginx -t FAILED — not reloading" >&2
  exit 1
fi
