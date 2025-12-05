# Quick Setup Guide: Netlify Auto-Deploy

## 🚀 5-Minute Setup

### Prerequisites
- [ ] WordPress site with Saba Projects plugin installed
- [ ] Site deployed on Netlify
- [ ] Admin access to both WordPress and Netlify

---

## Step 1: Get Netlify Build Hook (2 minutes)

1. **Login to Netlify**
   - Go to: https://app.netlify.com
   - Login with your credentials

2. **Open Your Site**
   - Find site: `gilded-scone-a9737b`
   - Click to open site dashboard

3. **Create Build Hook**
   - Navigate: **Site Settings** → **Build & Deploy** → **Build Hooks**
   - Click: **"Add build hook"** button
   - Fill in:
     - **Build hook name:** `WordPress Auto Deploy`
     - **Branch to build:** `main` (or your deploy branch)
   - Click: **"Save"**

4. **Copy Webhook URL**
   - You'll see a URL like: `https://api.netlify.com/build_hooks/[long-hash-here]`
   - Click to copy it (you'll need this in Step 2)

**Example URL:**
```
https://api.netlify.com/build_hooks/65a7b9c8d3e2f1a4b5c6d7e8
```

---

## Step 2: Configure WordPress (2 minutes)

1. **Open WordPress Admin**
   - Go to your WordPress dashboard
   - Navigate: **Projects** → **Netlify Deploy**

2. **Enter Webhook URL**
   - Paste the URL you copied from Netlify
   - Into the field: **"Netlify Build Hook URL"**

3. **Enable Auto-Deploy**
   - Check the box: ☑️ **"Enable automatic Netlify deployments on content changes"**

4. **Save Settings**
   - Click: **"Save Settings"** button
   - You should see: ✅ "Settings saved successfully!"

---

## Step 3: Test It Works (1 minute)

### Option A: Quick Test (Immediate)

1. Click the **"🚀 Deploy Now"** button
2. Wait 10 seconds
3. Check Netlify dashboard - you should see a new build starting
4. Success! ✅

### Option B: Full Test (5 minutes)

1. Edit any project:
   - Go to: **Projects** → **All Projects**
   - Edit any project title
   - Click: **"Update"**

2. Check deployment status:
   - Go to: **Projects** → **Netlify Deploy**
   - You should see: **"⏳ Deployment Scheduled"** notice
   - Log shows: "scheduled" entry

3. Wait 5 minutes (debounce timer)

4. Check log again:
   - Should show: "✓ triggered" entry
   - Message: "Project updated: [your project name]"

5. Check Netlify dashboard:
   - Should see new build in progress
   - Build triggered by webhook

---

## ✅ You're Done!

Your WordPress site will now automatically trigger Netlify deployments whenever:
- ✅ Projects are created/updated/deleted
- ✅ Translations are completed
- ✅ Villages or other taxonomy terms change
- ✅ Any project-related data is modified

**Smart Debouncing ensures:**
- Multiple rapid changes = Only 1 build
- Bulk translations = Only 1 build after completion
- 5-minute cooldown prevents excessive builds

---

## Common Issues & Solutions

### ❌ "Netlify webhook not configured" Warning

**Problem:** URL not saved or empty

**Solution:**
1. Make sure you pasted the full URL from Netlify
2. URL should start with `https://api.netlify.com/build_hooks/`
3. Click "Save Settings" after pasting

---

### ❌ "Deploy Now" Button is Disabled

**Problem:** Webhook URL not configured

**Solution:**
1. Complete Step 1 and Step 2 above
2. Make sure webhook URL is saved
3. Refresh the page

---

### ⏳ Deployment Stuck in "Scheduled" Status

**Problem:** WordPress cron not running

**Solution:**
1. Wait the full 5 minutes - this is normal behavior!
2. Or click "Deploy Now" to trigger immediately
3. If still stuck, check WP Cron is enabled in `wp-config.php`

---

### ✅ Deployment Triggered But Build Fails on Netlify

**Problem:** Netlify build issue, not WordPress

**Solution:**
1. Check Netlify build logs for errors
2. Verify your frontend repo is up to date
3. Test manual deployment from Netlify dashboard
4. This is not related to the webhook system

---

## Next Steps

### View Deployment History
- Go to: **Projects** → **Netlify Deploy**
- Check the **"📝 Deployment Log"** section
- See all recent deployment activity

### Disable Auto-Deploy (Temporarily)
- Uncheck: ☑️ **"Enable automatic Netlify deployments"**
- Save settings
- Manual "Deploy Now" still works

### Monitor Statistics
- View: **"📊 Deployment Statistics"** panel
- Track total deployments
- See success/failure rates
- Monitor last deployment time

---

## Testing Checklist

After setup, verify these scenarios work:

- [ ] Manual deploy via "Deploy Now" button
- [ ] Edit project → wait 5 min → build triggers
- [ ] Translate project → wait 5 min → build triggers
- [ ] Bulk translate villages → single build after completion
- [ ] Edit multiple projects rapidly → only one build
- [ ] Check deployment log shows all events
- [ ] Disable auto-deploy → no builds trigger
- [ ] Re-enable auto-deploy → builds resume

---

## Tips for Best Results

**💡 Use Manual Deploy for urgent changes**
- Don't want to wait 5 minutes? Click "Deploy Now"

**💡 Bulk operations are optimized**
- Translating 100 villages? Only 1 build at the end

**💡 Monitor the log**
- First week: check log daily to understand patterns
- After that: it just works in the background

**💡 Netlify build time**
- WordPress triggers build immediately
- Netlify takes 2-5 minutes to complete build
- Total time: 5 min (debounce) + 3 min (build) ≈ 8 min from edit to live

---

## Support Resources

- **Full Documentation:** See `NETLIFY-AUTO-DEPLOY-README.md`
- **Admin Interface:** Projects → Netlify Deploy
- **Netlify Dashboard:** https://app.netlify.com
- **Build Logs:** In Netlify dashboard

---

## Summary

✅ **What You Did:**
1. Created Netlify build hook
2. Configured WordPress with webhook URL
3. Enabled auto-deploy
4. Tested deployment

✅ **What Happens Now:**
- Any content change triggers deployment (after 5-min cooldown)
- Bulk operations trigger single build
- Full deployment history tracked
- Manual deploy available anytime

✅ **Benefits:**
- Frontend always up-to-date with latest content
- No manual rebuilds needed
- Efficient build management
- Full audit trail

**You're all set! 🎉**
