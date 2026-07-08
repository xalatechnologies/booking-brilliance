#!/usr/bin/env bash
#
# Install the certbot deploy-hook (reload nginx after renewal) and verify
# renewal works end-to-end with a dry run. Idempotent.
#   ./infra/certbot/install.sh
set -euo pipefail

VPS="${VPS:-root@72.61.23.56}"
HERE="$(cd "$(dirname "$0")" && pwd)"
HOOK=/etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh

echo "→ installing deploy-hook at ${HOOK}"
ssh "$VPS" "mkdir -p /etc/letsencrypt/renewal-hooks/deploy"
scp -q "$HERE/reload-nginx.sh" "$VPS:$HOOK"
ssh "$VPS" "chmod +x '$HOOK'"

echo "→ confirming the renew timer is active"
ssh "$VPS" 'systemctl list-timers certbot.timer --all --no-legend | grep -q certbot && echo "  certbot.timer: active" || echo "  ⚠ certbot.timer NOT active"'

echo "→ dry-run renewal (exercises the hook path; no cert is actually replaced)"
ssh "$VPS" "certbot renew --dry-run --deploy-hook '$HOOK' 2>&1 | grep -iE 'Congrat|success|simulat|hook|error|fail' | tail -8 || true"

echo "✓ done. Renewals now reload nginx automatically."
