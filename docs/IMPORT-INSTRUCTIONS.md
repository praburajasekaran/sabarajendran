# Import Taxonomy Terms to Production WordPress

## Overview
Your production WordPress (`tan-emu-358425.hostingersite.com`) has the Saba Projects plugin installed, but the **Block and Panchayat terms are empty**. This is why your Netlify site shows "No categories found" in the Block filter.

---

## What Needs to be Imported

From your local WordPress, we need to import:

| Taxonomy | Count | Priority | Examples |
|----------|-------|----------|----------|
| **Blocks** | 3 | 🔴 CRITICAL | NLC, Panruti, Kurinjipadi |
| **Panchayats** | 32 | 🔴 CRITICAL | Vallam, Visoor, Marungur, etc. |
| **Villages** | 104 | 🟡 Optional | Can be added later |

---

## Method 1: Browser Import (Easiest)

### Step 1: Upload Import Script

1. **Open your File Manager or FTP:**
   - Login to Hostinger hPanel
   - Go to: Files → File Manager
   - Navigate to your WordPress root directory

2. **Upload the file:**
   - Find: `/Applications/MAMP/htdocs/sabarajendran/import-taxonomy-terms.php`
   - Upload it to your WordPress root (same level as `wp-config.php`)

### Step 2: Run the Import Script

1. **Login to WordPress Admin:**
   - Go to: `https://tan-emu-358425.hostingersite.com/wp-admin`
   - Login with your admin credentials

2. **Run the script in browser:**
   - Open: `https://tan-emu-358425.hostingersite.com/import-taxonomy-terms.php`
   - You should see a page showing the import progress
   - Wait for all terms to be imported (green checkmarks)

3. **Verify Import:**
   - Go to: Projects → Blocks
   - You should see: NLC, Panruti, Kurinjipadi
   - Go to: Projects → Panchayats
   - You should see: 32 panchayats listed

4. **Delete the import file (IMPORTANT for security):**
   - Go back to File Manager
   - Delete: `import-taxonomy-terms.php`

---

## Method 2: WP-CLI (Advanced)

If you have SSH access and WP-CLI installed on your Hostinger server:

```bash
# SSH into your server
ssh your-user@tan-emu-358425.hostingersite.com

# Navigate to WordPress root
cd public_html  # or wherever your WordPress is installed

# Upload the import script, then run:
wp eval-file import-taxonomy-terms.php

# Delete the script after import
rm import-taxonomy-terms.php
```

---

## Method 3: Manual Entry (Fallback)

If you prefer to add them manually (only recommended for Blocks):

### Add Blocks Manually

1. Go to: `https://tan-emu-358425.hostingersite.com/wp-admin`
2. Navigate to: Projects → Blocks → Add New Block
3. Add these three blocks:

   **Block 1:**
   - Name: `NLC`
   - Slug: `nlc`
   - Click "Add New Block"

   **Block 2:**
   - Name: `Panruti`
   - Slug: `panruti`
   - Click "Add New Block"

   **Block 3:**
   - Name: `Kurinjipadi`
   - Slug: `kurinjipadi`
   - Click "Add New Block"

4. Flush permalinks:
   - Go to: Settings → Permalinks
   - Click "Save Changes"

### Add Panchayats Manually

Follow the same process for all 32 panchayats (see list in import script).

⚠️ **Warning:** Manual entry is tedious for 32+ panchayats. Method 1 (Browser Import) is much faster!

---

## After Import: Verify Data

### Test the REST API

Run these commands in your terminal to verify:

```bash
# Check blocks
curl "https://tan-emu-358425.hostingersite.com/wp-json/wp/v2/project_block"

# Expected output: Array with 3 blocks (NLC, Panruti, Kurinjipadi)

# Check panchayats
curl "https://tan-emu-358425.hostingersite.com/wp-json/wp/v2/project_panchayat"

# Expected output: Array with 32 panchayats
```

### Test Your Netlify Site

1. **Redeploy Netlify:**
   - The `.env.production` file is already configured
   - Just trigger a new deployment in Netlify

2. **Visit your site:**
   - Go to: Projects page
   - The "All Blocks" dropdown should now show:
     - All
     - NLC
     - Panruti
     - Kurinjipadi

3. **Test filtering:**
   - Select "Panruti" - should show projects from Panruti block
   - Panchayat dropdown should appear with panchayats
   - Everything should work!

---

## Troubleshooting

### If terms don't appear after import:

1. **Flush rewrite rules:**
   ```bash
   # Via WP-CLI
   wp rewrite flush

   # Via WordPress Admin
   Go to: Settings → Permalinks → Save Changes
   ```

2. **Check plugin is activated:**
   - Go to: Plugins
   - Ensure "Saba Projects" is active

3. **Verify taxonomy registration:**
   - The taxonomies should be visible in the WordPress admin menu
   - You should see: Blocks, Panchayats, Villages, etc.

### If REST API returns 404:

- The plugin may not be properly activated
- Permalinks may need flushing
- Server may have mod_rewrite disabled

---

## Next Steps After Import

1. ✅ Import Blocks and Panchayats (critical)
2. ✅ Test REST API endpoints
3. ✅ Redeploy Netlify with new environment variables
4. ✅ Test your live site
5. 🟡 Import Villages (optional - can be done later)
6. 🟡 Assign proper block/panchayat to each project

---

## Files Provided

1. **`import-taxonomy-terms.php`** - Main import script
   - Imports: 3 Blocks, 32 Panchayats
   - Safe to run multiple times (will skip existing terms)
   - Browser-based UI with progress tracking

2. **`.env.production`** - Production environment config
   - Already configured with your production WordPress URL
   - Will be used automatically when building for production

3. **`DEPLOYMENT-GUIDE.md`** - Complete deployment guide
   - Step-by-step instructions for entire deployment
   - Includes Netlify configuration

4. **`create-plugin-zip.sh`** - Plugin packaging script
   - Creates ZIP file of Saba Projects plugin
   - Useful if you need to update the plugin

---

## Quick Command Reference

```bash
# Create plugin ZIP (if needed)
./create-plugin-zip.sh

# Test local WordPress
curl "http://localhost:8118/sabarajendran/wp-json/wp/v2/project_block"

# Test production WordPress
curl "https://tan-emu-358425.hostingersite.com/wp-json/wp/v2/project_block"

# Build React app for production
cd projects-frontend-react
npm run build

# Test production build locally (optional)
npm run preview
```

---

**Ready to import?** Start with **Method 1 (Browser Import)** - it's the easiest!
