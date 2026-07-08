#!/usr/bin/env bash
#
# Applies infra/nginx/security-headers.conf to the Digilist subdomains the
# audit flags for missing security headers. Safe by construction:
#   1. uploads the snippet to /etc/nginx/snippets/
#   2. backs up every target conf (timestamped) before touching it
#   3. inserts one `include` line into each matching server block
#   4. `nginx -t` — and if it fails, restores ALL backups and aborts
#   5. only reloads nginx when the config validates
#
# Run from the repo root:  ./infra/apply-security-headers.sh
# Idempotent: re-running is a no-op once the include is present.
set -euo pipefail

VPS="root@72.61.23.56"
SNIPPET_LOCAL="infra/nginx/security-headers.conf"
SNIPPET_REMOTE="/etc/nginx/snippets/digilist-security-headers.conf"
INCLUDE_LINE="    include snippets/digilist-security-headers.conf;"

# host  ->  conf file that defines its (443) server block
TARGETS=(
  "status.digilist.no|/etc/nginx/sites-available/status.digilist.no"
  "dev.digilist.no|/etc/nginx/sites-available/digilist-dev"
  "dashboard.dev.digilist.no|/etc/nginx/sites-available/digilist-dev"
)

echo "→ Uploading snippet to ${SNIPPET_REMOTE}"
scp "${SNIPPET_LOCAL}" "${VPS}:${SNIPPET_REMOTE}"

remote_script=$(cat <<'REMOTE'
set -euo pipefail
INCLUDE_LINE="    include snippets/digilist-security-headers.conf;"
STAMP=$(date +%Y%m%d-%H%M%S)
declare -a BACKUPS=()
rollback() {
  echo "✗ nginx -t failed — rolling back"
  for b in "${BACKUPS[@]}"; do cp -f "$b" "${b%.bak-*}"; done
  exit 1
}
apply_one() {
  local host="$1" file="$2"
  [ -f "$file" ] || { echo "  skip (no file): $file"; return; }
  if grep -q "digilist-security-headers.conf" "$file"; then
    echo "  already applied: $host"; return
  fi
  local bak="${file}.bak-${STAMP}"
  cp -f "$file" "$bak"; BACKUPS+=("$bak")
  # Insert the include right after the server_name line that names this host,
  # inside its server block.
  awk -v host="$host" -v line="$INCLUDE_LINE" '
    { print }
    $0 ~ ("server_name[^;]*[[:space:]]" host "[;[:space:]]") { print line }
  ' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
  echo "  patched: $host  (backup: $bak)"
}
REMOTE
)

# Build the per-target apply calls and run everything remotely in one shell.
calls=""
for t in "${TARGETS[@]}"; do
  host="${t%%|*}"; file="${t##*|}"
  calls+=$'\n'"apply_one '${host}' '${file}'"
done

ssh "${VPS}" "bash -s" <<REMOTE_EXEC
${remote_script}
${calls}
if nginx -t; then
  systemctl reload nginx
  echo "✓ headers applied + nginx reloaded"
else
  rollback
fi
REMOTE_EXEC

echo "→ Verifying headers are now present"
for t in "${TARGETS[@]}"; do
  host="${t%%|*}"
  printf '  %-30s HSTS=%s XFO=%s\n' "$host" \
    "$(curl -sI "https://${host}/" | grep -ci strict-transport-security)" \
    "$(curl -sI "https://${host}/" | grep -ci x-frame-options)"
done
