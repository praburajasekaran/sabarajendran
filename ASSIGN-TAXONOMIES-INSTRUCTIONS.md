# Assign Taxonomies to Projects - Quick Guide

## 🎯 The Problem

You successfully imported:
- ✅ 3 Blocks (NLC, Panruti, Kurinjipadi)
- ✅ 32 Panchayats (Vallam, Visoor, Marungur, etc.)
- ✅ 826 Projects

But the **projects aren't linked** to blocks/panchayats! That's why the dropdown shows "All Blocks" with no options.

---

## 🚀 The Solution (2 Simple Steps)

### Step 1: Upload the Assignment Script

1. Open Hostinger File Manager
2. Navigate to WordPress root (where `wp-config.php` is)
3. Upload: `/Applications/MAMP/htdocs/sabarajendran/assign-project-taxonomies.php`

### Step 2: Run the Script in Browser

1. Login to WordPress Admin: `https://tan-emu-358425.hostingersite.com/wp-admin`
2. Open in browser: `https://tan-emu-358425.hostingersite.com/assign-project-taxonomies.php`
3. Wait for completion (progress bar will show 100%)
4. You should see:
   - ✅ 826 blocks assigned (all to "Panruti")
   - ✅ 600+ panchayats assigned (auto-detected from titles)
   - ✅ Summary table with results

5. **Delete the file** for security:
   ```bash
   rm assign-project-taxonomies.php
   ```

---

## 📊 What This Script Does

### Assigns All Projects to "Panruti" Block
- All 826 projects in your database are assigned to "Panruti" block
- This matches your local WordPress data

### Auto-Detects Panchayats from Project Titles
The script scans each project title for keywords like:
- "Visoor Panchayat" → assigns to "Visoor" panchayat
- "Alagappasamuthiram" → assigns to "Alagappasamuthiram" panchayat
- "Kadampuliyur" → assigns to "Kadampuliyur" panchayat
- And so on for all 32 panchayats

### Batch Processing
- Processes 50 projects at a time to prevent timeouts
- Shows real-time progress bar
- Safe to run on production servers

---

## 🧪 Verify It Worked

### Test 1: Check REST API

```bash
# Get a sample project
curl "https://tan-emu-358425.hostingersite.com/wp-json/wp/v2/project?per_page=1&_embed" | python3 -m json.tool

# Look for these fields (should NOT be empty):
# "project_block": [268],        ← Should have number(s), not []
# "project_panchayat": [297],    ← Should have number(s), not []
```

### Test 2: Check Block Taxonomy

```bash
curl "https://tan-emu-358425.hostingersite.com/wp-json/wp/v2/project_block"

# Should show:
# - Panruti: "count": 826  (not 0!)
```

### Test 3: Check Your Netlify Site

1. Go to your Netlify site (after redeployment)
2. Navigate to Projects page
3. Click "All Blocks" dropdown
4. You should now see:
   - All
   - ✅ **Panruti** (826 projects)
5. Select "Panruti"
6. The "Select Panchayat" dropdown should appear with 30+ options!

---

## ⚠️ Troubleshooting

### If the script times out:

1. Increase PHP execution time in `php.ini` or `.htaccess`:
   ```
   max_execution_time = 300
   ```

2. Or run via WP-CLI (if you have SSH access):
   ```bash
   wp eval-file assign-project-taxonomies.php
   ```

### If panchayats don't get assigned:

- The script uses keyword matching from project titles
- Some projects may not have panchayat keywords in their titles
- You can manually assign these in WordPress Admin later
- Check the "Skipped" count in the results table

### If blocks still don't show in dropdown:

1. Clear browser cache
2. Clear React app cache (if applicable)
3. Redeploy Netlify site
4. Verify API response has non-empty `project_block` arrays

---

## 📋 Complete Deployment Checklist

- [x] Plugin installed on production
- [x] Taxonomy terms imported (Blocks, Panchayats)
- [ ] **Run assign-project-taxonomies.php** ← YOU ARE HERE
- [ ] Verify API returns non-empty taxonomies
- [ ] Configure Netlify environment variables
- [ ] Redeploy Netlify site
- [ ] Test live site filters

---

## 🎉 After Successful Assignment

Once this script completes:

1. **All 826 projects** will be assigned to "Panruti" block
2. **600+ projects** will be assigned to their panchayats (auto-detected)
3. **Block filter dropdown** will show "Panruti" option
4. **Panchayat filters** will work correctly
5. **Your Netlify site will be fully functional!**

---

## 📞 Need Help?

If you encounter issues:

1. Check the script output for error messages
2. Verify taxonomy terms exist in WordPress Admin
3. Check PHP error logs on your server
4. Test with a small batch first (modify `$batch_size = 5`)

---

**Ready?** Upload the script and run it! 🚀
