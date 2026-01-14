# Database Sync Guide: Live → Local

**Last Updated:** 2026-01-09

## Overview

This guide helps you sync the live WordPress database from `https://projects.sabarajendran.com/` to your local MAMP environment.

| Environment | URL | Database |
|-------------|-----|----------|
| **Live** | `https://projects.sabarajendran.com/` | Hostinger MySQL |
| **Local** | `http://localhost:8118/sabarajendran` | `sabarajendran` (MAMP) |

---

## Step 1: Export Live Database from Hostinger

### Using Hostinger hPanel (Recommended)

1. Log in to your **Hostinger hPanel**
2. Navigate to **Databases** → **phpMyAdmin**
3. Select your WordPress database
4. Click the **Export** tab
5. Choose:
   - **Export method:** Quick
   - **Format:** SQL
6. Click **Export** and save the file as `live_dump.sql`
7. Move the downloaded file to:
   ```
   /Applications/MAMP/htdocs/sabarajendran/live_dump.sql
   ```

---

## Step 2: Import to Local MAMP

### Your local database has been backed up to:
```
/Applications/MAMP/htdocs/sabarajendran/local_backup_20260109.sql
```

### Import the live database:

```bash
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot -h 127.0.0.1 -P 8889 sabarajendran < /Applications/MAMP/htdocs/sabarajendran/live_dump.sql
```

---

## Step 3: Update URLs for Local Environment

After importing, run this to update all URLs from the live domain to your local URL:

```bash
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot -h 127.0.0.1 -P 8889 sabarajendran -e "
-- Update site URL in options table
UPDATE wp_options SET option_value = 'http://localhost:8118/sabarajendran' WHERE option_name = 'siteurl';
UPDATE wp_options SET option_value = 'http://localhost:8118/sabarajendran' WHERE option_name = 'home';

-- Update URLs in post content
UPDATE wp_posts SET post_content = REPLACE(post_content, 'https://projects.sabarajendran.com', 'http://localhost:8118/sabarajendran');
UPDATE wp_posts SET guid = REPLACE(guid, 'https://projects.sabarajendran.com', 'http://localhost:8118/sabarajendran');

-- Update URLs in postmeta
UPDATE wp_postmeta SET meta_value = REPLACE(meta_value, 'https://projects.sabarajendran.com', 'http://localhost:8118/sabarajendran') WHERE meta_value LIKE '%projects.sabarajendran.com%';

-- Also handle any old Hostinger URLs that might still exist
UPDATE wp_options SET option_value = REPLACE(option_value, 'https://tan-emu-358425.hostingersite.com', 'http://localhost:8118/sabarajendran') WHERE option_value LIKE '%tan-emu-358425.hostingersite.com%';
UPDATE wp_posts SET post_content = REPLACE(post_content, 'https://tan-emu-358425.hostingersite.com', 'http://localhost:8118/sabarajendran');
UPDATE wp_postmeta SET meta_value = REPLACE(meta_value, 'https://tan-emu-358425.hostingersite.com', 'http://localhost:8118/sabarajendran') WHERE meta_value LIKE '%tan-emu-358425.hostingersite.com%';
"
```

---

## Step 4: Verify the Sync

1. **Visit your local site:** `http://localhost:8118/sabarajendran/wp-admin`
2. **Check that all projects are visible**
3. **Verify the React frontend is fetching data correctly**

### Quick verification command:

```bash
curl "http://localhost:8118/sabarajendran/wp-json/wp/v2/project?per_page=3" | python3 -m json.tool | head -50
```

---

## Quick Reference Commands

```bash
# Backup local database
/Applications/MAMP/Library/bin/mysql80/bin/mysqldump -u root -proot -h 127.0.0.1 -P 8889 sabarajendran > local_backup.sql

# Import live database
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot -h 127.0.0.1 -P 8889 sabarajendran < live_dump.sql

# Check project count
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot -h 127.0.0.1 -P 8889 sabarajendran -e "SELECT COUNT(*) as total_projects FROM wp_posts WHERE post_type='project' AND post_status='publish';"
```
