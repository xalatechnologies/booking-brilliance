#!/usr/bin/env bash
# CTO / orchestrator agent on the VPS, powered by the Claude Max subscription (no
# API key). Usage: vps-cto-runner.sh <run|loop> [extra args…]
#   run   - one heartbeat: drive the approved Todo queue toward PRs, read the
#           fleet, reason with Opus, apply safe actions, write a briefing.
#   loop  - the same on a fixed interval (CTO_INTERVAL_MIN, default 20).
# Extra args after the mode are forwarded to the npm script (e.g. --dry-run,
# --no-reason, --limit 1). Run by systemd (digilist-cto.timer) - see the README.
set -uo pipefail
export PATH="/root/.local/bin:/usr/local/bin:/usr/bin:/bin"
cd /root/booking-brilliance || exit 1
git fetch origin --quiet && git reset --hard origin/main --quiet

. tools/content-agent/load-env.sh
export VITE_CONVEX_URL="${VITE_CONVEX_URL:-${CONVEX_URL:-}}"
export LLM_PROVIDER=claude-cli
export DIGILIST_REPO_PATH="${DIGILIST_REPO_PATH:-/root/Digilist}"
unset ANTHROPIC_API_KEY ANTHROPIC_AUTH_TOKEN

# Keep the Digilist checkout current so prepare/implement branch off fresh code.
if [ -d "$DIGILIST_REPO_PATH/.git" ]; then
  git -C "$DIGILIST_REPO_PATH" fetch origin --quiet 2>/dev/null || true
fi

MODE="${1:-run}"
echo "[vps-cto] ${MODE} on Claude Max…"
if [ "$#" -gt 1 ]; then
  pnpm "cto:${MODE}" -- "${@:2}"
else
  pnpm "cto:${MODE}"
fi
