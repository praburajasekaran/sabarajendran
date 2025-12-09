#!/bin/bash

# ==========================================
# 1. LIVE DATABASE CREDENTIALS (from User)
# ==========================================
REMOTE_DB_USER="u435443401_bhXEV"
REMOTE_DB_PASS="d2A95vDK45"
REMOTE_DB_NAME="u435443401_nTD8T"
REMOTE_DB_HOST="127.0.0.1" # Internal to Hostinger

# ==========================================
# 2. SSH CREDENTIALS (REQUIRED for Auto-Download)
# ==========================================
# We guessed these based on common Hostinger patterns. 
# If auto-download falls, please double check these or use Method B (Manual Download).
REMOTE_SSH_USER="u435443401" 
REMOTE_SSH_HOST="tan-emu-358425.hostingersite.com" 

# ==========================================
# 3. LOCAL CONFIGURATION
# ==========================================
LOCAL_DB_USER="root"
LOCAL_DB_PASS="root"
LOCAL_DB_NAME="sabarajendran"
LOCAL_DB_HOST="127.0.0.1"
LOCAL_DB_PORT="8889"
LOCAL_URL="http://localhost:8888/sabarajendran"
REMOTE_URL="https://tan-emu-358425.hostingersite.com"
DUMP_FILE="latest_live_dump.sql"

# ==========================================

echo "🚀 Starting Database Sync from LIVE to LOCAL..."

# 1. Check for Manual Dump File
if [ -f "$DUMP_FILE" ] && [ -s "$DUMP_FILE" ]; then
    echo "📄 Found valid manual dump file: $DUMP_FILE"
    echo "ℹ️  Skipping SSH download and using existing file."
else
    if [ -f "$DUMP_FILE" ]; then
        echo "⚠️ Found empty/corrupt dump file. Deleting and re-downloading..."
        rm "$DUMP_FILE"
    fi
    echo "⬇️  Attempting to download database via SSH..."
    echo "    Host: $REMOTE_SSH_HOST"
    echo "    User: $REMOTE_SSH_USER"
    echo "    (You may be asked for your SSH password)"
    
    ssh "$REMOTE_SSH_USER@$REMOTE_SSH_HOST" "mysqldump -u $REMOTE_DB_USER -p'$REMOTE_DB_PASS' -h $REMOTE_DB_HOST $REMOTE_DB_NAME --no-tablespaces" > "$DUMP_FILE"

    if [ ! -s "$DUMP_FILE" ]; then
        echo "❌ Download failed or file is empty."
        echo ""
        echo "👉 SOLUTION (METHOD B):"
        echo "1. Log into Hostinger > Databases > phpMyAdmin"
        echo "2. Export the database '$REMOTE_DB_NAME' as SQL"
        echo "3. Save the file as '$DUMP_FILE' in this folder: $(pwd)"
        echo "4. Run this script again."
        rm "$DUMP_FILE"
        exit 1
    fi
    echo "✅ Download complete."
fi

# 2. Backup Local DB
echo "📦 Backing up local database to 'archive/'..."
mkdir -p archive
/Applications/MAMP/Library/bin/mysql80/bin/mysqldump -u"$LOCAL_DB_USER" -p"$LOCAL_DB_PASS" -h"$LOCAL_DB_HOST" -P"$LOCAL_DB_PORT" "$LOCAL_DB_NAME" > "archive/local_backup_$(date +%Y%m%d_%H%M%S).sql"

# 3. Import to Local
echo "🗑️  Clearing local database to prevent conflicts..."
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u"$LOCAL_DB_USER" -p"$LOCAL_DB_PASS" -h"$LOCAL_DB_HOST" -P"$LOCAL_DB_PORT" -e "DROP DATABASE IF EXISTS $LOCAL_DB_NAME; CREATE DATABASE $LOCAL_DB_NAME;"

echo "📥 Importing '$DUMP_FILE' to local MAMP..."
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u"$LOCAL_DB_USER" -p"$LOCAL_DB_PASS" -h"$LOCAL_DB_HOST" -P"$LOCAL_DB_PORT" "$LOCAL_DB_NAME" < "$DUMP_FILE"

# 4. Search and Replace URLs
echo "Gx  Updating URLs from $REMOTE_URL to $LOCAL_URL..."

if command -v wp &> /dev/null; then
    # Standard replacement
    wp search-replace "$REMOTE_URL" "$LOCAL_URL" --path="$(pwd)" --skip-columns=guid --all-tables
    
    # Handle potentially mixed http/https variations just in case
    wp search-replace "http://tan-emu-358425.hostingersite.com" "$LOCAL_URL" --path="$(pwd)" --skip-columns=guid --all-tables
    
    # Flush permalinks
    echo "🔄 Flushing permalinks..."
    wp rewrite flush --hard --path="$(pwd)"
else
    echo "⚠️  WP-CLI not found. Falling back to basic SQL replacement."
    /Applications/MAMP/Library/bin/mysql -u"$LOCAL_DB_USER" -p"$LOCAL_DB_PASS" -h"$LOCAL_DB_HOST" -P"$LOCAL_DB_PORT" "$LOCAL_DB_NAME" -e "UPDATE wp_options SET option_value = REPLACE(option_value, '$REMOTE_URL', '$LOCAL_URL') WHERE option_name = 'home' OR option_name = 'siteurl';"
    /Applications/MAMP/Library/bin/mysql -u"$LOCAL_DB_USER" -p"$LOCAL_DB_PASS" -h"$LOCAL_DB_HOST" -P"$LOCAL_DB_PORT" "$LOCAL_DB_NAME" -e "UPDATE wp_posts SET post_content = REPLACE(post_content, '$REMOTE_URL', '$LOCAL_URL');"
    /Applications/MAMP/Library/bin/mysql -u"$LOCAL_DB_USER" -p"$LOCAL_DB_PASS" -h"$LOCAL_DB_HOST" -P"$LOCAL_DB_PORT" "$LOCAL_DB_NAME" -e "UPDATE wp_postmeta SET meta_value = REPLACE(meta_value, '$REMOTE_URL', '$LOCAL_URL');"
fi

echo "✅ DONE! Sync complete."
echo "👉 Local Site: $LOCAL_URL"
echo "👉 Local Admin: $LOCAL_URL/wp-admin"
