# Deployment Guide - Saba Projects

## Issue Identified
Your WordPress plugin on production (`tan-emu-358425.hostingersite.com`) is **missing the Block and Panchayat taxonomies**. This is why the block filters aren't showing up in your Netlify deployment.

## Current Status
- ✅ Production WordPress URL configured: `https://tan-emu-358425.hostingersite.com`
- ✅ WordPress REST API is accessible (826 projects found)
- ✅ CORS headers are properly configured
- ✅ `.env.production` file created with correct URL
- ❌ **Missing taxonomies:** `project_block` and `project_panchayat`

---

## Step 1: Upload WordPress Plugin to Production

### 1.1 Create Plugin ZIP File

The plugin is located at:
```
/Applications/MAMP/htdocs/sabarajendran/wp-content/plugins/saba-projects/
```

**Option A: Create ZIP via Finder**
1. Navigate to the folder above
2. Right-click on `saba-projects` folder
3. Select "Compress saba-projects"
4. You'll get `saba-projects.zip`

**Option B: Create ZIP via Terminal**
```bash
cd /Applications/MAMP/htdocs/sabarajendran/wp-content/plugins
zip -r saba-projects.zip saba-projects/
```

### 1.2 Upload to Hostinger WordPress

1. **Login to WordPress Admin:**
   - Go to: `https://tan-emu-358425.hostingersite.com/wp-admin`

2. **Upload Plugin:**
   - Navigate to: Plugins → Add New → Upload Plugin
   - Click "Choose File" and select `saba-projects.zip`
   - Click "Install Now"

3. **Activate Plugin:**
   - Click "Activate Plugin"

4. **Verify Installation:**
   After activation, check that you can see these menu items:
   - Projects
   - Blocks
   - Panchayats
   - Villages
   - Categories
   - Status
   - Schemes
   - Years

### 1.3 Flush Permalinks

After plugin activation, **IMPORTANT:**
1. Go to: Settings → Permalinks
2. Scroll down and click "Save Changes" (don't change anything)
3. This registers the new taxonomies with WordPress

---

## Step 2: Verify Taxonomies are Working

Run these commands to verify the taxonomies are now available:

```bash
# Check if block taxonomy exists
curl -I "https://tan-emu-358425.hostingersite.com/wp-json/wp/v2/project_block"

# Check if panchayat taxonomy exists
curl -I "https://tan-emu-358425.hostingersite.com/wp-json/wp/v2/project_panchayat"
```

Both should return `HTTP/2 200` instead of 404.

---

## Step 3: Configure Netlify Environment Variables

### 3.1 Set Environment Variables in Netlify

1. **Login to Netlify:**
   - Go to: https://app.netlify.com

2. **Select Your Site:**
   - Find your site in the dashboard

3. **Add Environment Variables:**
   - Go to: Site Settings → Environment Variables
   - Click "Add a variable"

   Add these two variables:

   | Key | Value |
   |-----|-------|
   | `VITE_WP_API_URL` | `https://tan-emu-358425.hostingersite.com` |
   | `VITE_SITE_URL` | `https://sabarajendran.com` |

4. **Save Changes**

### 3.2 Trigger New Deployment

After setting environment variables:
1. Go to: Deploys → Trigger Deploy → Clear cache and deploy site
2. Wait for deployment to complete (usually 1-2 minutes)

---

## Step 4: Test Your Deployment

Once deployed, test your site:

1. **Visit your Netlify site:** https://sabarajendran.com (or your Netlify URL)

2. **Navigate to Projects page**

3. **Check that filters appear:**
   - All Blocks dropdown should show: NLC, Panruti, Kurinjipadi
   - Select a block to see Panchayats
   - Check that project cards load with data

4. **Test filtering:**
   - Filter by Block
   - Filter by Status
   - Filter by Year
   - Search functionality

---

## Troubleshooting

### If blocks still don't show up:

**Check Browser Console:**
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for API errors

**Verify API Response:**
```bash
curl "https://tan-emu-358425.hostingersite.com/wp-json/wp/v2/project?per_page=1&_embed" | jq
```

Check that the response includes `project_block` and `project_panchayat` in the embedded terms.

### If you see CORS errors:

The CORS headers are already configured on your Hostinger server, but if you see errors, you may need to add this to your WordPress `.htaccess` or `wp-config.php`:

```php
// Add to wp-config.php (before "That's all, stop editing!")
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
```

---

## Files Modified in This Fix

1. **Created:** `/Applications/MAMP/htdocs/sabarajendran/projects-frontend-react/.env.production`
   - Contains production WordPress URL

2. **Documentation:** This deployment guide

---

## Quick Reference

**Local WordPress:** `http://localhost:8118/sabarajendran`
**Production WordPress:** `https://tan-emu-358425.hostingersite.com`
**Netlify Site:** Your deployment URL
**Plugin Location:** `/wp-content/plugins/saba-projects/`

---

## Next Steps After Deployment

Once everything is working:

1. Consider setting up automatic deployments from git
2. Configure build hooks in Netlify to auto-deploy when WordPress content changes
3. Set up caching strategy for better performance
4. Monitor API usage and consider implementing rate limiting

---

**Need Help?**
If you encounter any issues, check:
1. WordPress plugin is activated
2. Permalinks are flushed
3. Netlify environment variables are set
4. Browser cache is cleared
