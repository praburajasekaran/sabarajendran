# Translation Sync Instructions

## Quick Guide: Export from Staging → Import to Live

### Step 1: Export Translations from Staging Site

1. **Upload `export-translations.php` to your staging site:**
   - Upload to: `https://tan-emu-358425.hostingersite.com/` (root directory)
   - You can use FTP, cPanel File Manager, or Hostinger's File Manager

2. **Run the export:**
   - Visit: `https://tan-emu-358425.hostingersite.com/export-translations.php`
   - A JSON file will automatically download (e.g., `village-translations-2025-12-05-163000.json`)
   - This file contains all your translated village names

### Step 2: Import Translations to Live Site

1. **Upload files to your Netlify-hosted live site:**
   
   Since your live site is on Netlify, you need to:
   
   **Option A: Via WordPress Backend (Recommended)**
   - Your Netlify site likely connects to a WordPress backend
   - Find the WordPress admin URL (check your Netlify deployment settings)
   - Upload `import-translations.php` to that WordPress installation's root directory
   
   **Option B: If you have direct access to the live WordPress database**
   - Use the database credentials to connect
   - Continue to Step 3 below

2. **Upload the import script:**
   - Upload `import-translations.php` to your live WordPress root directory

3. **Run the import:**
   - Visit: `https://your-live-wordpress-url/import-translations.php`
   - Click "Choose File" and select the JSON file you downloaded
   - Click "Import Translations"
   - Wait for the success message

4. **Verify the import:**
   - Go to your WordPress admin: Projects → Translate Villages
   - Check that translations are now showing in the village list

### Step 3: Clean Up (Important for Security!)

After successful import, **delete these files** from both sites:
- `export-translations.php`
- `import-translations.php`
- The downloaded JSON file (from your computer)

---

## Alternative Method: Direct Database Export/Import

If you have phpMyAdmin access to both databases:

### Export from Staging Database

1. Log into phpMyAdmin for staging site
2. Select your database
3. Click "Export" tab
4. Select these tables only:
   - `wp_terms`
   - `wp_term_taxonomy`
   - `wp_termmeta`
5. Choose "Custom" export method
6. Under "Data dump options", select:
   - Structure and data
   - Add CREATE DATABASE / USE statement: NO
   - Add DROP TABLE / VIEW / PROCEDURE / FUNCTION / EVENT / TRIGGER statement: NO
7. Click "Go" to download SQL file

### Import to Live Database

1. Log into phpMyAdmin for live site
2. **IMPORTANT: Backup first!**
   - Export your current tables (same tables as above)
   - Save as backup before proceeding
3. Select your database
4. Click "Import" tab
5. Choose the SQL file you downloaded
6. Click "Go"

**⚠️ Warning:** This method will replace ALL villages and their translations. Use the JSON import method above for safer, incremental updates.

---

## Troubleshooting

### "Security check failed"
- Make sure you're logged in as WordPress admin when accessing import-translations.php

### "Invalid JSON file"
- Ensure the file downloaded completely from the export step
- Check that the file extension is .json

### "Permission denied" when uploading files
- Contact your hosting provider to ensure proper file permissions
- For Netlify, you may need to access the WordPress backend directly

### Translations not showing on live site
- Clear WordPress cache (if using caching plugin)
- Clear Netlify cache and trigger a new deployment
- Verify the project_village taxonomy exists on live site

---

## What Gets Synced

The export/import process transfers:
- ✅ Village names
- ✅ Tamil translations (`_village_name_tamil`)
- ✅ English translations (`_village_name_english`)
- ✅ Village slugs

It does NOT transfer:
- ❌ Projects (posts)
- ❌ Other settings
- ❌ Media files
- ❌ Users

---

## Need Help?

If you encounter issues, check the WordPress debug log:
- Location: `/wp-content/debug.log`
- Enable debug logging in `wp-config.php`:
  ```php
  define('WP_DEBUG', true);
  define('WP_DEBUG_LOG', true);
  define('WP_DEBUG_DISPLAY', false);
  ```






