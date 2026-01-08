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
REMOTE_DIR="/var/www/digilist/main"
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
