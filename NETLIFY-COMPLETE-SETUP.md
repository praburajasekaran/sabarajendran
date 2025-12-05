# Complete Netlify Setup Guide

## 🎯 What You Need to Do

Since you've been doing manual drag & drop deploys, we need to:
1. ✅ Connect Netlify to your GitHub repository
2. ✅ Set up environment variables
3. ✅ Configure build settings
4. ✅ Enable continuous deployment

---

## Part 1: Connect Netlify to GitHub (5 minutes)

### Step 1: Link Your Repository

1. **Go to Netlify Dashboard**
   - Open: https://app.netlify.com
   - Select your site: `gilded-scone-a9737b`

2. **Connect to GitHub**
   - Go to: **Site Settings** → **Build & deploy** → **Continuous deployment**
   - Look for **Repository** section
   - Click **"Link repository"** (or "Link to Git")
   - Choose **GitHub**
   - Authorize Netlify if prompted
   - Select: `praburajasekaran/sabarajendran`
   - Choose branch: `main` (or `feature/editorial-redesign` if that's your deploy branch)

### Step 2: Configure Build Settings

Since your React app is in a **subdirectory**, you need to configure:

**Base directory:** `projects-frontend-react`  
**Build command:** `npm run build`  
**Publish directory:** `projects-frontend-react/dist`

Where to enter this:
- **Site Settings** → **Build & deploy** → **Build settings**
- Click **"Edit settings"**

---

## Part 2: Set Up Environment Variables (3 minutes)

### Required Environment Variables:

Your React app needs these 3 environment variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_WP_API_URL` | `https://tan-emu-358425.hostingersite.com/wp-json/wp/v2` | WordPress REST API endpoint |
| `VITE_SITE_URL` | `https://sabarajendran.com` | Your production site URL |
| `GEMINI_API_KEY` | `[Your Gemini API Key]` | Google Gemini AI API key for chatbot |

### How to Add Environment Variables in Netlify:

1. **Go to Environment Variables**
   - Site Settings → Environment variables
   - Or: Site Settings → Build & deploy → Environment

2. **Add Each Variable**
   - Click **"Add a variable"** or **"New variable"**
   - **Key:** `VITE_WP_API_URL`
   - **Value:** `https://tan-emu-358425.hostingersite.com/wp-json/wp/v2`
   - **Scopes:** Select "Same value for all deploy contexts" (or just "Production")
   - Click **"Create variable"**

3. **Repeat for Other Variables**
   - Add `VITE_SITE_URL` = `https://sabarajendran.com`
   - Add `GEMINI_API_KEY` = `[your key]`

### Where to Get Your Gemini API Key:

If you don't have it:
1. Go to: https://aistudio.google.com/apikey
2. Create a new API key
3. Copy it
4. Paste in Netlify environment variables

---

## Part 3: Verify Configuration

### Check Your Settings:

**Build Settings:**
```
Base directory: projects-frontend-react
Build command: npm run build
Publish directory: projects-frontend-react/dist
```

**Environment Variables:**
```
✅ VITE_WP_API_URL = https://tan-emu-358425.hostingersite.com/wp-json/wp/v2
✅ VITE_SITE_URL = https://sabarajendran.com
✅ GEMINI_API_KEY = AIza... (your key)
```

**Repository:**
```
✅ Connected to: praburajasekaran/sabarajendran
✅ Production branch: main (or your branch)
✅ Deploy previews: Optional
```

---

## Part 4: Trigger First Build

### Option A: Manual Trigger (Recommended First Time)

1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Watch the build logs
4. Wait for deployment to complete (~2-3 minutes)

### Option B: Push to GitHub

1. Make any small change in your React app
2. Commit and push to GitHub
3. Netlify will auto-deploy

---

## Part 5: Test WordPress Auto-Deploy

Once GitHub connection is set up:

1. **Get Your Netlify API Token** (from earlier setup)
2. **Configure in WordPress:**
   - Go to: Projects → Netlify Deploy
   - Enter API Token
   - Site ID: `gilded-scone-a9737b`
   - Enable auto-deploy
   - Save settings

3. **Test It:**
   - Edit any project in WordPress
   - Wait 5 minutes (debounce period)
   - Check Netlify → Deploys → Should see new build

---

## How It Will Work After Setup

### Continuous Deployment Flow:

```
You Edit Content in WordPress
    ↓
WordPress triggers Netlify API (after 5-min debounce)
    ↓
Netlify pulls latest from GitHub
    ↓
Netlify runs: npm install && npm run build
    ↓
Netlify deploys to production
    ↓
Your site is live with latest content!
```

### What Triggers Automatic Builds:

✅ WordPress API call (from auto-deploy plugin)  
✅ Push to GitHub (main branch)  
✅ Manual "Deploy" button in Netlify  

---

## Troubleshooting

### ❌ Build Fails with "VITE_WP_API_URL is not defined"

**Solution:** Environment variables not set correctly
1. Check they're named exactly: `VITE_WP_API_URL` (case-sensitive)
2. Make sure no extra spaces
3. Trigger a new deploy after adding variables

---

### ❌ Build Fails with "command not found: npm"

**Solution:** Node version issue
1. Go to: Site Settings → Build & deploy → Build settings
2. Add environment variable: `NODE_VERSION` = `18`
3. Trigger new deploy

---

### ❌ Build Succeeds But Chatbot Doesn't Work

**Solution:** Missing or wrong Gemini API key
1. Check `GEMINI_API_KEY` is set in Netlify
2. Test the key works: https://aistudio.google.com/apikey
3. Make sure key has proper permissions
4. Redeploy after fixing

---

### ❌ WordPress Auto-Deploy Not Triggering Builds

**Possible causes:**
1. GitHub not connected → Connect in Step 1 above
2. API token wrong → Regenerate in Netlify settings
3. Site ID wrong → Should be `gilded-scone-a9737b`

**Solution:**
1. Test manual build first (Trigger deploy button)
2. Check WordPress → Netlify Deploy → Deployment Log
3. Verify auto-deploy is enabled in WordPress

---

## Quick Setup Checklist

### One-Time Setup:
- [ ] Connect Netlify to GitHub repository
- [ ] Set base directory: `projects-frontend-react`
- [ ] Set build command: `npm run build`
- [ ] Set publish directory: `projects-frontend-react/dist`
- [ ] Add environment variable: `VITE_WP_API_URL`
- [ ] Add environment variable: `VITE_SITE_URL`
- [ ] Add environment variable: `GEMINI_API_KEY`
- [ ] Trigger first manual deploy
- [ ] Verify site loads correctly

### WordPress Plugin Setup:
- [ ] Get Netlify Personal Access Token
- [ ] Configure in WordPress: Projects → Netlify Deploy
- [ ] Enter API token
- [ ] Enter site ID: `gilded-scone-a9737b`
- [ ] Enable auto-deploy
- [ ] Test with manual "Deploy Now" button

---

## Expected Results

### After Connecting GitHub:
✅ Manual deploys via Netlify dashboard work  
✅ Git push triggers automatic builds  
✅ Build logs show proper compilation  
✅ Site loads with all features working  

### After WordPress Plugin Setup:
✅ WordPress changes trigger builds (5-min delay)  
✅ Deployment log shows activity  
✅ Netlify shows "triggered by API" in deploy log  
✅ Content updates appear automatically  

---

## Summary

**What changed:**
- Before: Manual drag & drop of `dist` folder
- After: Automatic builds from GitHub on every WordPress change

**Benefits:**
- 🚀 No more manual uploads
- ✅ Version control (Git history)
- ⚡ Instant rollbacks if needed
- 🔄 Continuous deployment
- 📊 Build logs and history
- 🛠️ Proper environment configuration

**You're all set once completed!** 🎉

---

## Need Help?

If you run into issues:
1. Check Netlify build logs (Deploys → Latest deploy → Deploy log)
2. Check environment variables are correct
3. Verify GitHub connection is active
4. Test manual deploy first
5. Then test WordPress auto-deploy

**Most common issue:** Forgot to set environment variables → Add them and redeploy!
