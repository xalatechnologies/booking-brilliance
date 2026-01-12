#!/bin/bash

# ============================================
# Digilist - Deploy to Subdomains
# Deploys book-demo.html to:
# - demo.digilist.no
# - backoffice.digilist.no
# - learning.digilist.no
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

# Subdomain configurations (subdomain:remote_dir)
SUBDOMAINS=(
    "demo:/var/www/digilist/demo"
    "backoffice:/var/www/digilist/backoffice"
    "learning:/var/www/digilist/learning"
)

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deploying to Digilist Subdomains${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if book-demo.html exists
if [ ! -f "public/book-demo.html" ]; then
    echo -e "${RED}Error: public/book-demo.html not found${NC}"
    exit 1
fi

# Copy book-demo.html to dist if not already there
if [ ! -f "dist/book-demo.html" ]; then
    echo -e "${YELLOW}Copying book-demo.html to dist...${NC}"
    cp public/book-demo.html dist/book-demo.html
fi

# Deploy to each subdomain
for SUBDOMAIN_CONFIG in "${SUBDOMAINS[@]}"; do
    SUBDOMAIN=$(echo $SUBDOMAIN_CONFIG | cut -d: -f1)
    REMOTE_DIR=$(echo $SUBDOMAIN_CONFIG | cut -d: -f2)
    DOMAIN="${SUBDOMAIN}.digilist.no"
    
    echo -e "${BLUE}Deploying to ${DOMAIN}...${NC}"
    
    # Create remote directory if it doesn't exist
    ssh ${VPS_USER}@${VPS_HOST} "mkdir -p ${REMOTE_DIR}"
    
    # Copy book-demo.html as index.html for each subdomain
    scp dist/book-demo.html ${VPS_USER}@${VPS_HOST}:${REMOTE_DIR}/index.html
    
    # Copy logo.svg if it exists
    if [ -f "public/logo.svg" ]; then
        scp public/logo.svg ${VPS_USER}@${VPS_HOST}:${REMOTE_DIR}/logo.svg
    fi
    
    # Copy icon.png if it exists
    if [ -f "public/icon.png" ]; then
        scp public/icon.png ${VPS_USER}@${VPS_HOST}:${REMOTE_DIR}/icon.png
    fi
    
    # Verify deployment (follow redirects)
    HTTP_CODE=$(curl -sL -o /dev/null -w "%{http_code}" https://${DOMAIN} 2>/dev/null || echo "000")
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✓ ${DOMAIN} deployed successfully (HTTP $HTTP_CODE)${NC}"
    else
        echo -e "${YELLOW}⚠ ${DOMAIN} returned HTTP $HTTP_CODE (may need nginx config)${NC}"
    fi
    
    echo ""
done

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "🌐 Deployed to:"
for SUBDOMAIN_CONFIG in "${SUBDOMAINS[@]}"; do
    SUBDOMAIN=$(echo $SUBDOMAIN_CONFIG | cut -d: -f1)
    echo -e "   ${GREEN}https://${SUBDOMAIN}.digilist.no${NC}"
done
echo ""
echo -e "${YELLOW}Note:${NC} If sites return errors, you may need to configure nginx for these subdomains."
echo ""
