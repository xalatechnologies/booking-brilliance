#!/bin/bash

# ============================================
# Booking Brilliance - Deploy to Hostinger
# Deploys to: https://digilist.no
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
VPS_USER="root"
VPS_HOST="72.61.23.56"
# 2026-05-14: nginx for digilist.no points to the Hostinger per-domain
# layout, not /var/www/digilist/main as the old DEPLOYMENT.md suggested.
# That older path was a phantom — deploys landed there but nginx never
# served them. Keep this in sync with
# /etc/nginx/sites-enabled/digilist-apps.conf (server_name digilist.no → root).
REMOTE_DIR="/home/root/domains/digilist.no/public_html"
API_DIR="/var/www/digilist-api"
AUDIT_DIR="/var/www/digilist-audit"
DOCS_DIR="/var/www/digilist/docs"
PROJECT_NAME="booking-brilliance"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deploying Booking Brilliance${NC}"
echo -e "${GREEN}  Target: ${BLUE}https://digilist.no${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Are you in the project root?${NC}"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
fi

# Build the project
echo -e "${BLUE}[1/3] Building project...${NC}"
# VITE_CONVEX_URL must be set at build time — it's baked into the JS bundle
# via import.meta.env.VITE_CONVEX_URL. The deploy aborts if missing so we
# don't ship a broken admin dashboard.
# Load .env.local if present — needed for both VITE_CONVEX_URL (baked into
# the JS bundle) AND the prerender script's keyword fetch from Convex
# (uses ADMIN_BASIC_AUTH to authenticate the content/state:snapshot query).
if [ -f .env.local ]; then
    # shellcheck disable=SC2046
    export $(grep -vE '^#|^\s*$' .env.local | sed 's/ #.*//' | xargs) || true
fi
if [ -z "${VITE_CONVEX_URL:-}" ]; then
    echo -e "${RED}VITE_CONVEX_URL not set — admin dashboard would have no Convex backend. Aborting.${NC}"
    exit 1
fi
echo -e "${BLUE}  Convex: ${VITE_CONVEX_URL}${NC}"
echo -e "${BLUE}  Admin auth: ${ADMIN_BASIC_AUTH:+on}${NC}"
npm run build

# Verify build output
if [ ! -d "dist" ]; then
    echo -e "${RED}Build failed - dist directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build completed successfully${NC}"

# Deploy to Hostinger — ATOMIC symlink releases (zero-downtime + instant rollback)
echo -e "${BLUE}[2/3] Deploying to Hostinger (atomic release)...${NC}"

# nginx serves ${REMOTE_BASE}/current (a symlink → releases/rel-*). We rsync
# into a fresh release dir, then flip the symlink in one atomic op, then prune
# old releases (keep newest 5). No --delete needed: each release is a clean dir.
# Rollback: ssh ... "ln -sfn <old release> current" && no rebuild required.
REMOTE_BASE="$(dirname "${REMOTE_DIR}")"
REL="releases/rel-$(date +%Y%m%d-%H%M%S)"
ssh ${VPS_USER}@${VPS_HOST} "mkdir -p ${REMOTE_BASE}/${REL}"

rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.env' \
    --exclude 'src' \
    --exclude '*.md' \
    dist/ ${VPS_USER}@${VPS_HOST}:${REMOTE_BASE}/${REL}/

# Remember the currently-served release so we can roll back to it if the new
# one fails its health gate below.
PREV_REL=$(ssh ${VPS_USER}@${VPS_HOST} "readlink ${REMOTE_BASE}/current 2>/dev/null || true")

# Atomic switch to the new release (nginx follows the symlink per request).
ssh ${VPS_USER}@${VPS_HOST} "ln -sfn ${REMOTE_BASE}/${REL} ${REMOTE_BASE}/current"
echo -e "${GREEN}✓ Atomically switched current → ${REL}${NC}"

# ── Post-deploy health gate + auto-rollback ───────────────────────────────
# Probe the live entrypoints through nginx. If the new release doesn't serve,
# flip `current` back to the previous release (instant, no rebuild) so a broken
# build never stays live, and abort. Only prune old releases once healthy — the
# previous release must survive to be a rollback target.
echo -e "${BLUE}[2.55/3] Health-gating the new release...${NC}"
DEPLOY_HEALTHY=1
for url in "https://digilist.no/" "https://digilist.no/blogg"; do
    code=$(curl -s -o /dev/null -m 15 -w "%{http_code}" "$url")
    if [[ "$code" =~ ^2 ]]; then
        echo -e "${GREEN}  ✓ ${url} → HTTP ${code}${NC}"
    else
        echo -e "${RED}  ✗ ${url} → HTTP ${code}${NC}"; DEPLOY_HEALTHY=0
    fi
done
if [ "$DEPLOY_HEALTHY" != "1" ]; then
    if [ -n "$PREV_REL" ] && [ "$PREV_REL" != "${REMOTE_BASE}/${REL}" ]; then
        echo -e "${YELLOW}⤺ Health gate failed — rolling back to ${PREV_REL}${NC}"
        ssh ${VPS_USER}@${VPS_HOST} "ln -sfn '${PREV_REL}' ${REMOTE_BASE}/current"
        echo -e "${GREEN}✓ Rolled back — live site restored to the previous release.${NC}"
    else
        echo -e "${RED}✗ Health gate failed and no previous release to roll back to.${NC}"
    fi
    echo -e "${RED}Deploy aborted; the broken release ${REL} was NOT left live.${NC}"
    exit 1
fi

# Healthy → prune old releases, keeping the newest 5 for future rollbacks.
ssh ${VPS_USER}@${VPS_HOST} "cd ${REMOTE_BASE}/releases && ls -1dt rel-* | tail -n +6 | xargs -r rm -rf"

# ── Layer 4: purge the CDN edge cache (HTML only) after the flip ──────────────
# No-op until a CDN is wired. To activate Cloudflare: set CF_ZONE_ID + CF_API_TOKEN
# in .env.local (token needs the "Cache Purge" permission on the zone). We purge
# ONLY the mutable HTML entrypoints — the hashed assets are immutable so they
# never need purging. With the origin's no-cache HTML headers, this makes a new
# release visible at the edge instantly.
if [ -n "${CF_ZONE_ID:-}" ] && [ -n "${CF_API_TOKEN:-}" ]; then
    echo -e "${BLUE}[2.6/3] Purging Cloudflare edge cache (HTML)...${NC}"
    curl -sS -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache" \
        -H "Authorization: Bearer ${CF_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data '{"files":["https://digilist.no/","https://digilist.no/index.html","https://digilist.no/sitemap.xml"]}' \
        | grep -q '"success":true' && echo -e "${GREEN}✓ CDN purged${NC}" || echo -e "${YELLOW}⚠ CDN purge failed (non-fatal)${NC}"
else
    echo -e "${YELLOW}  (CDN purge skipped — set CF_ZONE_ID + CF_API_TOKEN in .env.local to enable)${NC}"
fi

# Build the RAG docs index (chunks + optional embeddings) before
# shipping the API so /api/docs-ask has fresh content to retrieve over.
if [ -d "apps/docs/src/content/docs" ]; then
    echo -e "${BLUE}[2.4/3] Building docs RAG index...${NC}"
    pnpm docs:index || npm run docs:index || true
fi

# Deploy the chatbot API service (server/) if present
if [ -d "server" ]; then
    echo -e "${BLUE}[2.5/3] Deploying chatbot API to ${API_DIR}...${NC}"
    ssh ${VPS_USER}@${VPS_HOST} "mkdir -p ${API_DIR}"
    rsync -avz --delete \
        --exclude 'node_modules' \
        --exclude '.env' \
        --exclude 'README.md' \
        server/ ${VPS_USER}@${VPS_HOST}:${API_DIR}/

    # Ship the RAG index alongside the API so the server picks it up
    # via DOCS_RAG_INDEX. The file is gitignored locally but lives in
    # apps/docs/dist-rag/ after `pnpm docs:index`.
    if [ -f "apps/docs/dist-rag/docs-rag-index.json" ]; then
        rsync -avz apps/docs/dist-rag/docs-rag-index.json \
            ${VPS_USER}@${VPS_HOST}:${API_DIR}/docs-rag-index.json
        ssh ${VPS_USER}@${VPS_HOST} "
            chown www-data:www-data ${API_DIR}/docs-rag-index.json
            grep -q DOCS_RAG_INDEX /etc/digilist-api.env || \
                echo 'DOCS_RAG_INDEX=${API_DIR}/docs-rag-index.json' >> /etc/digilist-api.env
        "
        echo -e "${GREEN}✓ RAG index shipped${NC}"
    fi

    # Restart if the systemd unit exists; otherwise tell the user to set it up.
    ssh ${VPS_USER}@${VPS_HOST} "
        if systemctl list-unit-files | grep -q '^digilist-api.service'; then
            systemctl restart digilist-api && systemctl is-active digilist-api
        else
            echo 'WARN: digilist-api.service not installed. See ${API_DIR}/README.md'
        fi
    " || echo -e "${YELLOW}⚠ API service restart skipped${NC}"
    echo -e "${GREEN}✓ Chatbot API deployed${NC}"
fi

# Deploy the site-intelligence audit bundle (tools/site-intelligence/)
if [ -d "tools/site-intelligence" ]; then
    echo -e "${BLUE}[2.7/3] Deploying audit infrastructure to ${AUDIT_DIR}...${NC}"
    ssh ${VPS_USER}@${VPS_HOST} "mkdir -p ${AUDIT_DIR}/tools"

    # Self-contained package.json for the bundle (audit + content-agent).
    # Both packages share node_modules so better-sqlite3's native binary is
    # only rebuilt once per VPS deploy.
    # Post-Convex: orchestrators write through ConvexHttpClient, so this
    # bundle only needs convex + tsx + cheerio (for the SEO/a11y auditors).
    # better-sqlite3 is gone — there's no local DB on the VPS anymore.
    cat > /tmp/digilist-audit-package.json <<'EOF'
{
  "name": "digilist-audit",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "audit:all": "tsx tools/site-intelligence/src/orchestrator.ts",
    "audit:psi": "tsx tools/site-intelligence/src/run-performance.ts",
    "audit:compliance": "tsx tools/site-intelligence/src/run-compliance.ts",
    "audit:daily": "tsx tools/site-intelligence/src/orchestrator.ts --trigger cron && tsx tools/site-intelligence/src/run-performance.ts && tsx tools/site-intelligence/src/run-compliance.ts",
    "content:all": "tsx tools/content-agent/src/orchestrator.ts",
    "content:discover": "tsx tools/content-agent/src/orchestrator.ts --phase discover",
    "content:analyze": "tsx tools/content-agent/src/orchestrator.ts --phase analyze",
    "content:generate": "tsx tools/content-agent/src/orchestrator.ts --phase generate"
  },
  "dependencies": {
    "cheerio": "^1.2.0",
    "convex": "^1.39.1",
    "tsx": "^4.22.0"
  }
}
EOF

    scp /tmp/digilist-audit-package.json ${VPS_USER}@${VPS_HOST}:${AUDIT_DIR}/package.json
    rsync -avz --delete \
        --exclude 'node_modules' \
        --exclude 'reports/' \
        tools/site-intelligence/ ${VPS_USER}@${VPS_HOST}:${AUDIT_DIR}/tools/site-intelligence/

    # site-intelligence/seo.ts cross-imports parse + rules from tools/seo-crawler/.
    if [ -d "tools/seo-crawler" ]; then
        rsync -avz --delete \
            --exclude 'node_modules' \
            --exclude 'reports/' \
            tools/seo-crawler/ ${VPS_USER}@${VPS_HOST}:${AUDIT_DIR}/tools/seo-crawler/
    fi

    # Ship content-agent alongside site-intelligence (shares node_modules).
    if [ -d "tools/content-agent" ]; then
        rsync -avz --delete \
            --exclude 'node_modules' \
            --exclude 'reports/' \
            tools/content-agent/ ${VPS_USER}@${VPS_HOST}:${AUDIT_DIR}/tools/content-agent/
    fi

    # Convex codegen output — orchestrators import from convex/_generated/api.
    # Ship the generated files so the VPS doesn't need its own `npx convex dev`.
    if [ -d "convex" ]; then
        rsync -avz --delete \
            --exclude 'node_modules' \
            convex/ ${VPS_USER}@${VPS_HOST}:${AUDIT_DIR}/convex/
    fi

    # Install deps (just convex + cheerio + tsx now; no native bindings)
    ssh ${VPS_USER}@${VPS_HOST} "
        cd ${AUDIT_DIR}
        if ! command -v pnpm >/dev/null 2>&1; then
            echo 'Installing pnpm globally...'
            npm install -g pnpm
        fi
        pnpm install --silent
    " || echo -e "${YELLOW}⚠ Audit deps install failed${NC}"

    # rsync preserves local UID/GID. Re-chown to www-data so the systemd
    # timer (running as www-data) can read everything.
    ssh ${VPS_USER}@${VPS_HOST} "chown -R www-data:www-data ${AUDIT_DIR}"

    # Restart digilist-api so it picks up env changes (if /etc/digilist-api.env updated)
    ssh ${VPS_USER}@${VPS_HOST} "
        if systemctl list-unit-files | grep -q '^digilist-api.service'; then
            systemctl restart digilist-api && systemctl is-active digilist-api
        fi
    " || true

    echo -e "${GREEN}✓ Audit infrastructure deployed${NC}"
fi

# Stage 2.8 — Daily content-agent timer (idempotent: writes units only if
# missing or changed). The timer fires at 06:00 every day, runs the full
# discover→analyze→generate pipeline, then regenerates the snapshot so
# the dashboard reflects the new state. No auto-publish.
if [ -d "tools/content-agent" ]; then
    echo -e "${BLUE}[2.8/3] Installing daily content-agent timer...${NC}"

    cat > /tmp/digilist-content.service <<'EOF'
[Unit]
Description=Digilist Content Agent — discover, analyze, generate
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
User=www-data
Group=www-data
WorkingDirectory=/var/www/digilist-audit
# Must contain ANTHROPIC_API_KEY, CONVEX_URL (or VITE_CONVEX_URL),
# ADMIN_BASIC_AUTH. The orchestrator writes directly to Convex.
EnvironmentFile=/etc/digilist-api.env
Environment=PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
ExecStart=/usr/bin/env pnpm content:all -- --trigger cron
Nice=10
IOSchedulingClass=idle
TimeoutStartSec=20min
EOF

    cat > /tmp/digilist-content.timer <<'EOF'
[Unit]
Description=Run Digilist Content Agent daily at 06:00

[Timer]
OnCalendar=*-*-* 06:00:00
RandomizedDelaySec=600
Persistent=true
Unit=digilist-content.service

[Install]
WantedBy=timers.target
EOF

    scp /tmp/digilist-content.service ${VPS_USER}@${VPS_HOST}:/tmp/digilist-content.service
    scp /tmp/digilist-content.timer ${VPS_USER}@${VPS_HOST}:/tmp/digilist-content.timer

    ssh ${VPS_USER}@${VPS_HOST} "
        install -m 644 /tmp/digilist-content.service /etc/systemd/system/digilist-content.service
        install -m 644 /tmp/digilist-content.timer   /etc/systemd/system/digilist-content.timer
        rm /tmp/digilist-content.service /tmp/digilist-content.timer
        systemctl daemon-reload
        systemctl enable --now digilist-content.timer
        systemctl list-timers digilist-content.timer --no-pager || true
    " || echo -e "${YELLOW}⚠ content-agent timer install failed${NC}"

    rm -f /tmp/digilist-content.service /tmp/digilist-content.timer
    echo -e "${GREEN}✓ Content agent timer enabled (06:00 daily)${NC}"
fi

# Stage 2.85 — Daily audit timer: in-process auditors + PSI performance
# Fires at 06:30 (30 min after the content agent so the two don't fight
# for CPU). Writes everything to Convex; results land on
# /admin/intelligence reactively.
if [ -d "tools/site-intelligence" ]; then
    echo -e "${BLUE}[2.85/3] Installing daily audit timer...${NC}"

    cat > /tmp/digilist-audit.service <<'EOF'
[Unit]
Description=Digilist Site Intelligence — uptime, SEO, a11y, security, links, PSI
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
User=www-data
Group=www-data
WorkingDirectory=/var/www/digilist-audit
EnvironmentFile=/etc/digilist-api.env
Environment=PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
ExecStart=/usr/bin/env pnpm audit:daily
Nice=10
IOSchedulingClass=idle
TimeoutStartSec=30min
EOF

    cat > /tmp/digilist-audit.timer <<'EOF'
[Unit]
Description=Run Digilist site intelligence audits daily at 06:30

[Timer]
OnCalendar=*-*-* 06:30:00
RandomizedDelaySec=600
Persistent=true
Unit=digilist-audit.service

[Install]
WantedBy=timers.target
EOF

    scp /tmp/digilist-audit.service ${VPS_USER}@${VPS_HOST}:/tmp/digilist-audit.service
    scp /tmp/digilist-audit.timer   ${VPS_USER}@${VPS_HOST}:/tmp/digilist-audit.timer

    ssh ${VPS_USER}@${VPS_HOST} "
        install -m 644 /tmp/digilist-audit.service /etc/systemd/system/digilist-audit.service
        install -m 644 /tmp/digilist-audit.timer   /etc/systemd/system/digilist-audit.timer
        rm /tmp/digilist-audit.service /tmp/digilist-audit.timer
        systemctl daemon-reload
        systemctl enable --now digilist-audit.timer
        systemctl list-timers digilist-audit.timer --no-pager || true
    " || echo -e "${YELLOW}⚠ audit timer install failed${NC}"

    rm -f /tmp/digilist-audit.service /tmp/digilist-audit.timer
    echo -e "${GREEN}✓ Audit timer enabled (06:30 daily — auditors + PSI)${NC}"
fi

# Stage 2.9 — Build + deploy the docs site (apps/docs) to docs.digilist.no
if [ -d "apps/docs" ]; then
    echo -e "${BLUE}[2.9/3] Building + deploying docs to ${DOCS_DIR}...${NC}"

    # Astro build runs in the workspace package. The output ends up in
    # apps/docs/dist/ — pure static HTML + assets, no Node runtime needed.
    pnpm --filter @digilist/docs build || {
        echo -e "${RED}docs build failed${NC}"
        exit 1
    }

    if [ ! -d "apps/docs/dist" ]; then
        echo -e "${RED}docs dist/ missing after build${NC}"
        exit 1
    fi

    ssh ${VPS_USER}@${VPS_HOST} "mkdir -p ${DOCS_DIR}"
    rsync -avz --delete --progress \
        --exclude '.git' \
        apps/docs/dist/ ${VPS_USER}@${VPS_HOST}:${DOCS_DIR}/

    # Re-chown so nginx (www-data) can serve.
    ssh ${VPS_USER}@${VPS_HOST} "chown -R www-data:www-data ${DOCS_DIR}"

    echo -e "${GREEN}✓ Docs deployed to docs.digilist.no${NC}"
    echo -e "${YELLOW}Note: docs.digilist.no nginx vhost must already exist (server_name docs.digilist.no → root ${DOCS_DIR}).${NC}"
fi

# Verify deployment
echo -e "${BLUE}[3/3] Verifying deployment...${NC}"

# Test if site is accessible
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://digilist.no)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Site is live and responding${NC}"
else
    echo -e "${YELLOW}⚠ Site returned HTTP $HTTP_CODE${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "🌐 Site URL: ${GREEN}https://digilist.no${NC}"
echo -e "📊 Status: ${GREEN}HTTP $HTTP_CODE${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Visit https://digilist.no to verify"
echo "  2. Test SSL: https://www.ssllabs.com/ssltest/analyze.html?d=digilist.no"
echo "  3. Test Security: https://securityheaders.com/?q=https://digilist.no"
echo ""
