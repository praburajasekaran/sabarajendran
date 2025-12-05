# Export Translations from Live WordPress Server

Follow these steps to export translations from your live Hostinger server.

## Step 1: SSH into Your Live Server

Connect to your Hostinger server via SSH. You'll need:
- SSH credentials (usually provided in Hostinger control panel)
- Access to the WordPress installation directory

## Step 2: Navigate to WordPress Root

```bash
cd /path/to/your/wordpress/installation
```

(Common paths: `~/public_html`, `~/domains/yourdomain.com/public_html`, or check your Hostinger file manager)

## Step 3: Export Project Translations

Run this WP-CLI command to export project translation meta:

```bash
wp db query "SELECT post_id, meta_key, meta_value FROM wp_postmeta WHERE meta_key IN ('_project_title_tamil', '_project_title_english', '_project_description_tamil', '_project_description_english')" --format=csv > project_translations.csv
```

## Step 4: Export Village Translations

Run this WP-CLI command to export village translation meta:

```bash
wp db query "SELECT term_id, meta_key, meta_value FROM wp_termmeta WHERE meta_key IN ('_village_name_tamil', '_village_name_english')" --format=csv > village_translations.csv
```

## Step 5: Verify Files Were Created

```bash
ls -lh project_translations.csv village_translations.csv
```

You should see both files with their sizes.

## Step 6: Download Files to Local Machine

### Option A: Using SCP (from your local machine)

```bash
scp username@your-server:/path/to/wordpress/project_translations.csv /Applications/MAMP/htdocs/sabarajendran/
scp username@your-server:/path/to/wordpress/village_translations.csv /Applications/MAMP/htdocs/sabarajendran/
```

### Option B: Using SFTP Client

1. Connect to your server via SFTP (FileZilla, Cyberduck, etc.)
2. Navigate to your WordPress root directory
3. Download both CSV files to `/Applications/MAMP/htdocs/sabarajendran/`

### Option C: Using Hostinger File Manager

1. Log into Hostinger control panel
2. Open File Manager
3. Navigate to your WordPress root
4. Download both CSV files

## Step 7: Run Import Script

Once the CSV files are in your local WordPress root directory, run the import:

### Via Browser:
```
http://localhost:8888/sabarajendran/import-translations.php?key=import_translations_2025
```

### Via Command Line:
```bash
cd /Applications/MAMP/htdocs/sabarajendran
php import-translations.php
```

## Troubleshooting

### WP-CLI Not Found
If `wp` command is not found, try:
```bash
php wp-cli.phar db query "..."
```

Or install WP-CLI globally on the server.

### Database Table Prefix
If your WordPress uses a different table prefix (not `wp_`), update the commands:
```bash
# Replace wp_ with your prefix (e.g., wp123_)
wp db query "SELECT post_id, meta_key, meta_value FROM wp123_postmeta WHERE ..."
```

### CSV Files Are Empty
- Check if translations exist on live site
- Verify meta keys match exactly (case-sensitive)
- Check database table names match your setup

### Import Script Errors
- Ensure CSV files are in WordPress root directory
- Check file permissions (should be readable)
- Verify WordPress is loaded correctly (check wp-load.php path)
