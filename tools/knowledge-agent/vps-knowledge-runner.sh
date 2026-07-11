#!/usr/bin/env bash
# Knowledge (self-learning) agent on the VPS, powered by the Claude Max
# subscription (no API key). Usage: vps-knowledge-runner.sh [learning-run args…]
#   (default)      — distill: pull content signals, review pending raw signals,
#                    mine repo patterns + latest stack docs/trends, distil
#                    provenance-tracked learnings, render the wiki, and auto-file
#                    advisory upgrade issues (Backlog, behind the human Todo gate).
# Extra args are forwarded to the npm script, e.g.:
#   vps-knowledge-runner.sh --no-web        (skip trend research)
#   vps-knowledge-runner.sh --dry-run       (distil + print, persist nothing)
#   vps-knowledge-runner.sh --render-only    (re-render the wiki from the store)
# Run by systemd (digilist-knowledge.timer) — see the README for a suggested
# daily/weekly timer (not installed by this repo).
set -uo pipefail
export PATH="/root/.local/bin:/usr/local/bin:/usr/bin:/bin"
cd /root/booking-brilliance || exit 1
git fetch origin --quiet && git reset --hard origin/main --quiet

. tools/content-agent/load-env.sh
export VITE_CONVEX_URL="${VITE_CONVEX_URL:-${CONVEX_URL:-}}"
export LLM_PROVIDER=claude-cli
export DIGILIST_REPO_PATH="${DIGILIST_REPO_PATH:-/root/Digilist}"
unset ANTHROPIC_API_KEY ANTHROPIC_AUTH_TOKEN

# The knowledge is distilled from the PRIVATE Digilist app repo's internals, so
# the rendered wiki must NEVER land in the public booking-brilliance tree. We
# publish it into the private Digilist repo, on a DEDICATED branch, via an
# ISOLATED worktree — so it never touches the app's main/dev deploy branches
# (no deploy trigger, no collision with real development). The render writes
# straight into that worktree.
KWIKI_BRANCH="${KNOWLEDGE_WIKI_BRANCH:-fleet-knowledge}"
KWIKI_WT="${KNOWLEDGE_WIKI_WORKTREE:-/root/digilist-knowledge}"
export KNOWLEDGE_WIKI_ROOT="$KWIKI_WT"

# Keep the Digilist checkout current so repo-pattern mining sees the real code.
if [ -d "$DIGILIST_REPO_PATH/.git" ]; then
  git -C "$DIGILIST_REPO_PATH" fetch origin --quiet 2>/dev/null || true
fi

# Attach (or refresh) the dedicated knowledge worktree tracking $KWIKI_BRANCH.
if [ -d "$DIGILIST_REPO_PATH/.git" ]; then
  git -C "$DIGILIST_REPO_PATH" fetch origin "$KWIKI_BRANCH" --quiet 2>/dev/null || true
  if [ ! -e "$KWIKI_WT/.git" ]; then
    if git -C "$DIGILIST_REPO_PATH" show-ref --verify --quiet "refs/remotes/origin/$KWIKI_BRANCH"; then
      git -C "$DIGILIST_REPO_PATH" worktree add --quiet -B "$KWIKI_BRANCH" "$KWIKI_WT" "origin/$KWIKI_BRANCH" 2>/dev/null || true
    else
      git -C "$DIGILIST_REPO_PATH" worktree add --quiet -b "$KWIKI_BRANCH" "$KWIKI_WT" 2>/dev/null || true
    fi
  else
    git -C "$KWIKI_WT" pull --quiet --ff-only 2>/dev/null || true
  fi
fi
# Fall back to a local-only render dir if the worktree could not be created,
# so a distill run never fails just because publishing is unavailable.
[ -e "$KWIKI_WT/.git" ] || export KNOWLEDGE_WIKI_ROOT="$KWIKI_WT"
mkdir -p "$KNOWLEDGE_WIKI_ROOT" 2>/dev/null || true

echo "[vps-knowledge] distill on Claude Max…"
if [ "$#" -gt 0 ]; then
  pnpm learning:run -- "$@"
else
  pnpm learning:run
fi

# The distill run re-rendered the wiki INTO the private knowledge worktree
# ($KNOWLEDGE_WIKI_ROOT). Commit + push it to the dedicated $KWIKI_BRANCH in the
# private Digilist repo — never main/dev, never the public repo. Best-effort;
# skipped cleanly when unchanged or when publishing is unavailable.
if [ -e "$KWIKI_WT/.git" ] && ! git -C "$KWIKI_WT" diff --quiet -- KNOWLEDGE.md docs/knowledge 2>/dev/null; then
  git -C "$KWIKI_WT" add KNOWLEDGE.md docs/knowledge 2>/dev/null || true
  git -C "$KWIKI_WT" -c user.name=digilist-knowledge-agent -c user.email=bot@digilist.no \
    commit -m "chore(knowledge): update fleet knowledge base (auto-generated)" --quiet 2>/dev/null || true
  git -C "$KWIKI_WT" push origin "HEAD:$KWIKI_BRANCH" --quiet 2>/dev/null \
    || echo "[vps-knowledge] wiki push skipped (no access / nothing to push)"
else
  echo "[vps-knowledge] wiki unchanged or not published (kept in $KNOWLEDGE_WIKI_ROOT)"
fi
