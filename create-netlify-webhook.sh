#!/bin/bash
#
# Create Netlify Build Hook via CLI
# This script creates a build hook and retrieves the webhook URL
#

set -e

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  Netlify Build Hook Creator"
echo "════════════════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Site ID (from deploy-netlify.sh)
SITE_ID="gilded-scone-a9737b"

echo -e "${BLUE}Step 1: Checking Netlify CLI authentication...${NC}"
if ! netlify status > /dev/null 2>&1; then
    echo -e "${YELLOW}Not logged in. Please login to Netlify:${NC}"
    echo ""
    netlify login
    echo ""
fi

echo -e "${GREEN}✓ Authenticated${NC}"
echo ""

echo -e "${BLUE}Step 2: Creating build hook...${NC}"
echo "Site: ${SITE_ID}"
echo "Hook name: WordPress Auto Deploy"
echo "Branch: main"
echo ""

# Create build hook using Netlify API
RESPONSE=$(netlify api createSiteBuildHook --data "{
  \"site_id\": \"${SITE_ID}\",
  \"title\": \"WordPress Auto Deploy\",
  \"branch\": \"main\"
}" 2>&1)

# Check if creation was successful
if echo "$RESPONSE" | grep -q "url"; then
    echo -e "${GREEN}✓ Build hook created successfully!${NC}"
    echo ""
    
    # Extract the webhook URL from the response
    WEBHOOK_URL=$(echo "$RESPONSE" | grep -o '"url":"[^"]*"' | sed 's/"url":"//;s/"//')
    
    if [ -n "$WEBHOOK_URL" ]; then
        echo "════════════════════════════════════════════════════════════"
        echo -e "${GREEN}  SUCCESS! Your Netlify Build Hook URL:${NC}"
        echo "════════════════════════════════════════════════════════════"
        echo ""
        echo -e "${YELLOW}${WEBHOOK_URL}${NC}"
        echo ""
        echo "════════════════════════════════════════════════════════════"
        echo ""
        echo -e "${BLUE}Next Steps:${NC}"
        echo "1. Copy the URL above"
        echo "2. Go to WordPress: Projects → Netlify Deploy"
        echo "3. Paste the URL in 'Netlify Build Hook URL' field"
        echo "4. Enable 'Auto-Deploy'"
        echo "5. Click 'Save Settings'"
        echo ""
        echo -e "${GREEN}✓ Done!${NC}"
        echo ""
        
        # Save to file for reference
        echo "$WEBHOOK_URL" > netlify-webhook-url.txt
        echo -e "${BLUE}Note: URL also saved to 'netlify-webhook-url.txt'${NC}"
        echo ""
    else
        echo -e "${RED}Error: Could not extract webhook URL from response${NC}"
        echo "Response: $RESPONSE"
        exit 1
    fi
else
    echo -e "${RED}Error creating build hook${NC}"
    echo "Response: $RESPONSE"
    echo ""
    echo -e "${YELLOW}Troubleshooting:${NC}"
    echo "1. Check if you have permission to manage the site"
    echo "2. Verify site ID: ${SITE_ID}"
    echo "3. Try running: netlify status"
    exit 1
fi
