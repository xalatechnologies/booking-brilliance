#!/usr/bin/env bash
#
# Install (or uninstall) the Digilist SLA watchdog on the VPS.
#   ./install.sh            # from repo root — installs + starts the timer
#   ./install.sh --uninstall
#
# Idempotent. Validates the shipped script with `bash -n` before enabling.
set -euo pipefail

VPS="${VPS:-root@72.61.23.56}"
HERE="$(cd "$(dirname "$0")" && pwd)"

if [ "${1:-}" = "--uninstall" ]; then
  ssh "$VPS" '
    systemctl disable --now digilist-watchdog.timer 2>/dev/null || true
    rm -f /etc/systemd/system/digilist-watchdog.{service,timer} /usr/local/bin/digilist-watchdog.sh
    systemctl daemon-reload
    echo "watchdog removed"
  '
  exit 0
fi

echo "→ syntax-checking watchdog.sh locally"
bash -n "$HERE/watchdog.sh"

echo "→ shipping watchdog + units"
scp -q "$HERE/watchdog.sh" "$VPS:/usr/local/bin/digilist-watchdog.sh"
scp -q "$HERE/digilist-watchdog.service" "$VPS:/etc/systemd/system/digilist-watchdog.service"
scp -q "$HERE/digilist-watchdog.timer" "$VPS:/etc/systemd/system/digilist-watchdog.timer"

ssh "$VPS" '
  chmod +x /usr/local/bin/digilist-watchdog.sh
  bash -n /usr/local/bin/digilist-watchdog.sh
  systemctl daemon-reload
  systemctl enable --now digilist-watchdog.timer
  echo "→ first probe run:"
  systemctl start digilist-watchdog.service
  journalctl -u digilist-watchdog.service -n 12 --no-pager -o cat || true
  echo "→ timer:"
  systemctl list-timers digilist-watchdog.timer --no-pager | tail -2
'
echo "✓ installed. Kill switch: ssh $VPS 'touch /etc/digilist-watchdog.disabled'"
