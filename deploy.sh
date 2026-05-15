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
if [ -z "${VITE_CONVEX_URL:-}" ] && [ -f .env.local ]; then
    export $(grep '^VITE_CONVEX_URL=' .env.local | xargs)
fi
if [ -z "${VITE_CONVEX_URL:-}" ]; then
    echo -e "${RED}VITE_CONVEX_URL not set — admin dashboard would have no Convex backend. Aborting.${NC}"
    exit 1
fi
echo -e "${BLUE}  Convex: ${VITE_CONVEX_URL}${NC}"
npm run build

# Verify build output
if [ ! -d "dist" ]; then
    echo -e "${RED}Build failed - dist directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build completed successfully${NC}"

# Deploy to Hostinger
echo -e "${BLUE}[2/3] Deploying to Hostinger...${NC}"

# Create remote directory if it doesn't exist
ssh ${VPS_USER}@${VPS_HOST} "mkdir -p ${REMOTE_DIR}"

# Sync files to server
rsync -avz --delete --progress \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.env' \
    --exclude 'src' \
    --exclude '*.md' \
    dist/ ${VPS_USER}@${VPS_HOST}:${REMOTE_DIR}/

echo -e "${GREEN}✓ Files deployed successfully${NC}"

# Deploy the chatbot API service (server/) if present
if [ -d "server" ]; then
    echo -e "${BLUE}[2.5/3] Deploying chatbot API to ${API_DIR}...${NC}"
    ssh ${VPS_USER}@${VPS_HOST} "mkdir -p ${API_DIR}"
    rsync -avz --delete \
        --exclude 'node_modules' \
        --exclude '.env' \
        --exclude 'README.md' \
        server/ ${VPS_USER}@${VPS_HOST}:${API_DIR}/

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
