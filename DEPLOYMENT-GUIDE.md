# Deployment Guide: Local Changes to Live Sites

## Overview

Your local changes need to be deployed to **two separate locations**:

1. **WordPress Backend** → `https://tan-emu-358425.hostingersite.com`
2. **Netlify Frontend** → `https://gilded-scone-a9737b.netlify.app`

---

## Part 1: Deploy to WordPress (Backend)

### Files to Upload:

#### A. WordPress Plugin Updates
Upload these files to your WordPress installation:

**Location:** `wp-content/plugins/saba-projects/`

Files to upload:
- ✅ `saba-projects.php` (main plugin file - modified)
- ✅ `includes/admin-translation.php` (NEW - translation admin page)
- ✅ `includes/translation.php` (NEW - translation functions)
- ✅ `TRANSLATION-README.md` (NEW - documentation)

#### B. Configuration File (OPTIONAL - Be Careful!)
- ⚠️ `wp-config.php` - Only if you need to sync API keys or settings
  - **WARNING:** Do NOT upload if it contains local database credentials
  - Review the file first to ensure it only has settings you want on live

### How to Upload to WordPress:

#### Method 1: Using Hostinger File Manager (Easiest)
1. Log into Hostinger dashboard
2. Go to File Manager
3. Navigate to: `public_html/wp-content/plugins/saba-projects/`
4. Upload the modified plugin files
5. Upload the new files in `includes/` folder

#### Method 2: Using FTP
1. Connect to your Hostinger site via FTP
2. Navigate to: `/wp-content/plugins/saba-projects/`
3. Upload the files (overwrite existing ones when prompted)

#### Method 3: Using WordPress Plugin Upload
1. Zip the entire `saba-projects` folder
2. Go to WordPress admin: Plugins → Add New → Upload Plugin
3. Upload the zip file
4. Activate the plugin

### After Upload - Verify:
1. Go to: `https://tan-emu-358425.hostingersite.com/wp-admin`
2. Navigate to: Projects → Translate Villages
3. Check that the translation interface works

---

## Part 2: Deploy to Netlify (Frontend)

### Step 1: Build the React App

Open Terminal and run:

```bash
cd /Applications/MAMP/htdocs/sabarajendran/projects-frontend-react
npm run build
```

This will:
- Compile all your React changes
- Apply the editorial redesign
- Fetch latest data from WordPress
- Create a `dist` folder with production files

### Step 2: Deploy to Netlify

#### Method 1: Drag & Drop (Current Method)
1. After build completes, locate the `dist` folder:
   `projects-frontend-react/dist/`
2. Go to Netlify dashboard
3. Open your site: `gilded-scone-a9737b`
4. Drag the **entire `dist` folder** onto the deploy area
5. Wait for deployment to complete (1-2 minutes)

#### Method 2: Netlify CLI (Faster for Future)
Install Netlify CLI once:
```bash
npm install -g netlify-cli
netlify login
```

Then for each deployment:
```bash
cd /Applications/MAMP/htdocs/sabarajendran/projects-frontend-react
npm run build
netlify deploy --prod --dir=dist
```

### Step 3: Verify Deployment
1. Visit: `https://gilded-scone-a9737b.netlify.app`
2. Check that:
   - ✅ New design is visible
   - ✅ Translations are showing
   - ✅ All pages work correctly
3. Clear browser cache if old design appears (Cmd+Shift+R)

---

## Quick Checklist

### Before Deploying:
- [ ] Backup live WordPress database (just in case)
- [ ] Test locally that everything works
- [ ] Review `wp-config.php` - remove local DB credentials if uploading

### WordPress Deployment:
- [ ] Upload plugin files to Hostinger
- [ ] Verify plugin is active in WP admin
- [ ] Test translation interface

### Netlify Deployment:
- [ ] Run `npm run build` in projects-frontend-react
- [ ] Upload `dist` folder to Netlify
- [ ] Verify site loads correctly
- [ ] Test on mobile and desktop

---

## Troubleshooting

### "White screen" on WordPress after upload
- Check error logs in Hostinger
- Deactivate and reactivate the plugin
- Restore from backup if needed

### "Old design" showing on Netlify
- Clear browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Check that you uploaded the `dist` folder, not the source code
- Verify deployment completed in Netlify dashboard

### "Translations not showing"
- Ensure WordPress API is accessible
- Check that translation meta fields exist in WordPress
- Verify API URL in `.env.production`

---

## Need Help?

If you encounter issues:
1. Check WordPress debug log: `wp-content/debug.log`
2. Check browser console for JavaScript errors
3. Verify API endpoint: `https://tan-emu-358425.hostingersite.com/wp-json/wp/v2/project`






