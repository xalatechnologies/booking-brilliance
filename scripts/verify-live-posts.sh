#!/usr/bin/env bash
# Verify freshly-deployed blog posts render LIVE, end to end: the URL returns
# 200, the prerendered <article> carries real prose (not an empty SPA shell),
# and the cover image itself loads. This is the "verify everything live with
# images, text" gate the daily-blogs workflow runs after deploy.
#
# Usage: scripts/verify-live-posts.sh <base-url> <slug> [slug...]
#   scripts/verify-live-posts.sh https://digilist.no bookingsystem-kommune-sammenligning-pris
#
# Exits non-zero (and prints a GitHub ::error::) if any post fails a check.
set -uo pipefail

BASE="${1:?usage: verify-live-posts.sh <base-url> <slug...>}"; shift
if [ "$#" -eq 0 ]; then echo "verify-live-posts: no slugs given, nothing to check."; exit 0; fi

MIN_BODY_CHARS=1200
fail=0

for slug in "$@"; do
  url="$BASE/blogg/$slug"
  html="$(mktemp)"
  code=$(curl -sS -m 25 -o "$html" -w '%{http_code}' "$url" || echo 000)
  if [ "$code" != "200" ]; then
    echo "✗ $url → HTTP $code"; fail=1; rm -f "$html"; continue
  fi

  # Body text: the prerendered <article> must carry real prose, not an empty
  # shell (which is what a broken prerender / hydration-only page would emit).
  body=$(python3 - "$html" <<'PY'
import re, sys
h = open(sys.argv[1], encoding="utf-8", errors="replace").read()
m = re.search(r"<article.*?</article>", h, re.S)
t = re.sub(r"<[^>]+>", " ", m.group(0)) if m else ""
print(len(re.sub(r"\s+", " ", t).strip()))
PY
)
  if [ "${body:-0}" -lt "$MIN_BODY_CHARS" ]; then
    echo "✗ $url → article body only ${body} chars (<${MIN_BODY_CHARS}); prerender likely failed"; fail=1; rm -f "$html"; continue
  fi

  # Cover image: the first /images/blog/ asset on the page must itself load.
  cover=$(grep -oE 'src="[^"]*/images/blog/[^"]+"' "$html" | head -1 | sed -E 's/^src="([^"]+)"$/\1/')
  if [ -z "$cover" ]; then
    echo "✗ $url → no /images/blog cover found on page"; fail=1; rm -f "$html"; continue
  fi
  case "$cover" in
    /*) coverurl="$BASE$cover" ;;
    *)  coverurl="$cover" ;;
  esac
  ccode=$(curl -sS -m 25 -o /dev/null -w '%{http_code}' "$coverurl" || echo 000)
  if [ "$ccode" != "200" ]; then
    echo "✗ $url → cover $coverurl → HTTP $ccode"; fail=1; rm -f "$html"; continue
  fi

  echo "✓ $url  (body ${body} chars, cover ${cover##*/} OK)"
  rm -f "$html"
done

if [ "$fail" != "0" ]; then
  echo "::error::live post verification failed — see ✗ lines above"
  exit 1
fi
echo "All posts verified live ✓"
