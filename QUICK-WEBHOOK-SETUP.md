# Quick Netlify Webhook Setup via CLI

## ⚡ Get Your Webhook URL in 30 Seconds

Since Netlify may have moved the Build Hooks UI, here's the fastest way to get your webhook URL using the Netlify CLI:

---

## Run the Automated Script

### Step 1: Execute the script
```bash
cd /Applications/MAMP/htdocs/sabarajendran
./create-netlify-webhook.sh
```

### Step 2: Login (if needed)
- If you're not logged in, the script will prompt you
- It will open a browser window to authenticate
- Approve the connection
- Return to terminal

### Step 3: Copy the URL
- The script will display your webhook URL
- Example: `https://api.netlify.com/build_hooks/abc123...`
- The URL is also saved to `netlify-webhook-url.txt`

---

## Alternative: Manual CLI Commands

If you prefer to run commands manually:

### 1. Login to Netlify CLI
```bash
netlify login
```

### 2. Create Build Hook
```bash
netlify api createSiteBuildHook --data '{
  "site_id": "gilded-scone-a9737b",
  "title": "WordPress Auto Deploy",
  "branch": "main"
}'
```

### 3. Copy the URL from the response
Look for the `"url"` field in the JSON response.

---

## After Getting the Webhook URL

1. **Go to WordPress Admin**
   - Navigate: **Projects** → **Netlify Deploy**

2. **Configure Settings**
   - Paste the webhook URL
   - Enable **"Auto-Deploy"**
   - Click **"Save Settings"**

3. **Test It**
   - Click **"🚀 Deploy Now"** button
   - Check Netlify dashboard for the build

---

## Troubleshooting

### "Not authenticated" error
```bash
netlify logout
netlify login
```

### "Site not found" error
Check your site ID matches `gilded-scone-a9737b`:
```bash
cd /Applications/MAMP/htdocs/sabarajendran/projects-frontend-react
netlify status
```

### "Permission denied" error
Make script executable:
```bash
chmod +x /Applications/MAMP/htdocs/sabarajendran/create-netlify-webhook.sh
```

---

## What the Script Does

1. ✅ Checks if you're logged in to Netlify CLI
2. ✅ Creates a build hook named "WordPress Auto Deploy"  
3. ✅ Sets it to trigger on the `main` branch
4. ✅ Extracts and displays the webhook URL
5. ✅ Saves the URL to `netlify-webhook-url.txt` for reference

---

## Next Steps

Once you have the webhook URL configured in WordPress:

- Edit any project → Wait 5 min → Build triggers automatically
- Translate content → Wait 5 min → Build triggers
- Bulk operations → Single build after completion
- Manual override → Use "Deploy Now" button

**See `NETLIFY-SETUP-GUIDE.md` for complete setup instructions.**
