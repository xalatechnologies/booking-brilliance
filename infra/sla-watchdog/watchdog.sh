#!/usr/bin/env bash
#
# Digilist SLA watchdog — active health checks + bounded auto-recovery.
#
# systemd's `Restart=on-failure` only catches a *crashed* digilist-api; it does
# nothing for a hung-but-alive process, a wedged nginx, or a static surface that
# stopped serving. This closes that gap: every run it probes each surface and,
# on sustained failure, restarts the backing service — with a consecutive-fail
# threshold, a restart cooldown, and a hard cap so it can never thrash. If a
# surface is still down after we've exhausted restarts, it escalates and backs
# off to alert-only.
#
# Runs from digilist-watchdog.timer (every 60s). All output → journald.
# Config via /etc/digilist-api.env (SLACK_WEBHOOK_URL for paging).
set -uo pipefail

# Kill switch — `touch /etc/digilist-watchdog.disabled` to instantly halt all
# probing + auto-recovery without uninstalling the timer. First thing checked.
if [ -f /etc/digilist-watchdog.disabled ]; then
  echo "[watchdog] disabled via /etc/digilist-watchdog.disabled — skipping run"
  exit 0
fi

STATE_DIR=/run/digilist-watchdog
mkdir -p "$STATE_DIR"

FAIL_THRESHOLD=3        # consecutive failed probes before we act (~3 min)
RESTART_COOLDOWN=300    # min seconds between restarts of the same service
MAX_RESTARTS=3          # per rolling window; beyond this → escalate-only
RESTART_WINDOW=3600     # rolling window for the restart cap (1h)

[ -f /etc/digilist-api.env ] && . /etc/digilist-api.env 2>/dev/null || true
SLACK_WEBHOOK_URL="${SLACK_WEBHOOK_URL:-}"

now() { date +%s; }
log() { echo "[watchdog] $*"; }

escalate() {
  local surface="$1" detail="$2"
  log "ESCALATE: $surface — $detail"
  if [ -n "$SLACK_WEBHOOK_URL" ]; then
    curl -s -m 8 -X POST "$SLACK_WEBHOOK_URL" \
      -H 'Content-Type: application/json' \
      -d "{\"text\":\":rotating_light: SLA watchdog: *${surface}* still down after auto-recovery — ${detail}\"}" \
      >/dev/null 2>&1 || log "slack notify failed"
  fi
}

# probe <name> <url> <expected-max-status>  → 0 healthy, 1 unhealthy
probe() {
  local url="$2"
  local code
  code=$(curl -s -o /dev/null -m 10 -w '%{http_code}' "$url" 2>/dev/null)
  # 2xx/3xx = healthy; everything else (000 timeout, 5xx) = unhealthy
  [[ "$code" =~ ^[23] ]]
}

# recover <name> <service>  — restart with cooldown + rolling cap
recover() {
  local name="$1" svc="$2"
  local last_file="$STATE_DIR/${name}.lastrestart"
  local count_file="$STATE_DIR/${name}.restarts"
  local last count ts
  last=$(cat "$last_file" 2>/dev/null || echo 0)
  ts=$(now)

  if (( ts - last < RESTART_COOLDOWN )); then
    log "$name: within cooldown, not restarting yet"
    return
  fi
  # prune restart timestamps outside the window, count what remains
  count=$(awk -v cut=$(( ts - RESTART_WINDOW )) '$1 >= cut' "$count_file" 2>/dev/null | wc -l)
  if (( count >= MAX_RESTARTS )); then
    escalate "$name" "hit $MAX_RESTARTS restarts/${RESTART_WINDOW}s — manual intervention needed"
    return
  fi
  log "$name: restarting $svc (restart #$((count+1)) this window)"
  systemctl restart "$svc" && echo "$ts" > "$last_file"
  echo "$ts" >> "$count_file"
}

# check <name> <url> [service-to-restart]
check() {
  local name="$1" url="$2" svc="${3:-}"
  local fail_file="$STATE_DIR/${name}.fails"
  local fails
  if probe "$name" "$url"; then
    [ -f "$fail_file" ] && log "$name: recovered"
    rm -f "$fail_file"
    return
  fi
  fails=$(( $(cat "$fail_file" 2>/dev/null || echo 0) + 1 ))
  echo "$fails" > "$fail_file"
  log "$name: DOWN ($url) — consecutive fails: $fails"
  if (( fails >= FAIL_THRESHOLD )); then
    if [ -n "$svc" ]; then
      recover "$name" "$svc"
    else
      escalate "$name" "$url unreachable ($fails consecutive) — no auto-restart target"
    fi
  fi
}

# ── surfaces ────────────────────────────────────────────────────────────────
# API: hang-proof health probe → restart the node service on sustained failure.
check api        http://127.0.0.1:3001/api/health   digilist-api.service
# Public static/proxy surfaces served by nginx → restart nginx if THEY fail
# (a static-file or config problem escalates instead — nginx restart won't fix).
check web        https://digilist.no/               nginx.service
check app        https://app.digilist.no/           nginx.service
check status     https://status.digilist.no/        nginx.service
check docs       https://docs.digilist.no/          nginx.service
