# Netlify Auto-Deploy Setup (API Method)

## ⚡ Quick 5-Minute Setup

Since Netlify has moved away from simple build hooks in the UI, we now use the Netlify Build API directly.

---

## Step 1: Get Your Netlify Personal Access Token (2 minutes)

### Via Netlify Dashboard:

1. **Login to Netlify**
   - Go to: https://app.netlify.com
   - Login with your credentials

2. **Access User Settings**
   - Click your avatar (top right corner)
   - Click **"User settings"**

3. **Generate Personal Access Token**
   - Navigate: **Applications** → **Personal access tokens**
   - Click **"New access token"**
   - Description: `WordPress Auto Deploy`
   - Click **"Generate token"**

4. **Copy the Token**
   - You'll see a token starting with `nfp_...`
   - **Copy it immediately** (you won't see it again!)
   - Example: `nfp_abc123xyz789...`

⚠️ **Important:** Keep this token secret! It grants full access to your Netlify account.

---

## Step 2: Get Your Netlify Site ID (1 minute)

1. **Open Your Site**
   - Go to your Netlify dashboard
   - Select site: **gilded-scone-a9737b**

2. **Find Site ID**
   - Navigate: **Site Settings** → **General** → **Site details**
   - Look for **Site ID**
   - It should be: `gilded-scone-a9737b`
   - Copy it

---

## Step 3: Configure WordPress (2 minutes)

1. **Open WordPress Admin**
   - Go to your WordPress dashboard
   - Navigate: **Projects** → **Netlify Deploy**

2. **Enter Credentials**
   - **Netlify API Token:** Paste your token (`nfp_...`)
   - **Netlify Site ID:** Paste your site ID (`gilded-scone-a9737b`)

3. **Enable Auto-Deploy**
   - Check the box: ☑️ **"Enable automatic Netlify deployments"**

4. **Save Settings**
   - Click **"Save Settings"** button
   - You should see: ✅ "Settings saved successfully!"

---

## Step 4: Test It Works (1 minute)

### Quick Test:

1. Click the **"🚀 Deploy Now"** button
2. Wait 10-15 seconds
3. Check Netlify dashboard - you should see a new build starting
4. Success! ✅

### Full Test (5 minutes):

1. Edit any project title
2. Click **"Update"**
3. Go to **Projects** → **Netlify Deploy**
4. You should see "⏳ Deployment Scheduled"
5. Wait 5 minutes (debounce timer)
6. Check log - should show "✓ triggered"
7. Check Netlify dashboard - build should be running

---

## How It Works

The system now uses the **Netlify Build API** instead of simple webhooks:

```
WordPress Change
    ↓
Schedule Deploy (5-min debounce)
    ↓
Call Netlify API
POST https://api.netlify.com/api/v1/sites/{site_id}/builds
Authorization: Bearer {your_token}
    ↓
Netlify Triggers Build
    ↓
Site Deploys
```

### What Changed from Build Hooks?

| Old Method (Build Hooks) | New Method (API) |
|--------------------------|------------------|
| Simple webhook URL | API token + Site ID |
| Public URL (anyone can trigger) | Secure token (only you can trigger) |
| No authentication needed | Bearer token authentication |
| Limited control | Full API access |

**Benefits of API Method:**
- ✅ More secure (token-based)
- ✅ More control (can add parameters)
- ✅ Works with current Netlify UI
- ✅ Future-proof (official API)

---

## Security Best Practices

### 🔒 Protect Your API Token

1. **Never commit token to Git**
   - It's stored in WordPress database only
   - Not in code files

2. **Regenerate if compromised**
   - Go to Netlify → User settings → Personal access tokens
   - Delete old token
   - Generate new one
   - Update in WordPress

3. **Use WordPress on HTTPS**
   - Token is sent over HTTPS to Netlify
   - Ensure your WordPress admin uses SSL

4. **Limit access**
   - Only WordPress admins can see the settings page
   - Requires `manage_options` capability

---

## Troubleshooting

### ❌ "Netlify API not configured" Error

**Solution:**
1. Make sure both API token AND site ID are entered
2. Token should start with `nfp_`
3. Site ID should match your Netlify site

---

### ❌ "API request failed: Unauthorized"

**Possible causes:**
- Wrong API token
- Token was deleted/revoked
- Token expired (rare)

**Solution:**
1. Generate a new token in Netlify
2. Copy it exactly (no extra spaces)
3. Paste in WordPress settings
4. Save settings

---

### ❌ "Netlify API error: Site not found"

**Possible causes:**
- Wrong site ID
- Site was deleted
- Typo in site ID

**Solution:**
1. Go to Netlify site settings
2. Copy the exact Site ID
3. Paste in WordPress
4. Save settings

---

### ✅ Build Triggers But Fails on Netlify

**This is not a WordPress issue!**

Check:
1. Netlify build logs for errors
2. Your frontend repo is up to date
3. Build command is correct in Netlify settings
4. Test manual build in Netlify dashboard

---

## What Triggers Deployments?

All these actions trigger automatic builds (after 5-min cooldown):

✅ **Projects:**
- Create new project
- Update project
- Delete project
- Change project status

✅ **Translations:**
- Translate title/description
- Bulk translate villages
- Update translations

✅ **Taxonomies:**
- Add/edit/delete villages
- Add/edit/delete blocks/panchayats
- Update village translations

✅ **Meta Fields:**
- Update budget
- Change project dates
- Modify custom fields

---

## Advanced: Using the API Token

Your API token can be used for other Netlify automation:

```bash
# Trigger build via CLI
curl -X POST \
  "https://api.netlify.com/api/v1/sites/gilded-scone-a9737b/builds" \
  -H "Authorization: Bearer nfp_YOUR_TOKEN" \
  -H "Content-Type: application/json"

# List recent deployments
curl -X GET \
  "https://api.netlify.com/api/v1/sites/gilded-scone-a9737b/deploys" \
  -H "Authorization: Bearer nfp_YOUR_TOKEN"
```

---

## Need Help?

### Check These First:
1. ✅ API token is correct and not expired
2. ✅ Site ID matches your Netlify site
3. ✅ Auto-deploy is enabled in WordPress
4. ✅ Deployment log shows activity

### Still Not Working?
1. Click "Deploy Now" to test immediately
2. Check WordPress error logs
3. Check Netlify build logs
4. Verify token has correct permissions

---

## Summary

✅ **What You Need:**
- Netlify Personal Access Token (`nfp_...`)
- Netlify Site ID (`gilded-scone-a9737b`)

✅ **Where to Enter:**
- WordPress: Projects → Netlify Deploy

✅ **What Happens:**
- Content changes trigger builds automatically
- 5-minute debounce prevents spam
- Secure API authentication
- Full deployment logging

**You're all set! 🎉**






