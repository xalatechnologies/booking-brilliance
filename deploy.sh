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
