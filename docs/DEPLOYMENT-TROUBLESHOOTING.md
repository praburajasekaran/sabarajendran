# Deployment Troubleshooting

## Empty Projects Page on Netlify

### Problem
After deploying to Netlify, the projects page appears empty or shows loading state indefinitely.

### Root Cause
The React app fetches project data from WordPress REST API. When deployed to Netlify:
1. IndexedDB cache is empty (it's client-side storage)
2. The app makes an API request to fetch data
3. If the API call fails or takes too long, the page appears empty

### Verified Working
✅ API endpoint is accessible: `https://tan-emu-358425.hostingersite.com/wp-json/wp/v2/project`
✅ CORS headers are properly configured
✅ API returns project data correctly
✅ Environment variables are baked into the build

### Solution

**Wait 2-3 seconds** after page load - the data should appear once the API call completes.

If projects still don't appear:

1. **Open browser DevTools** (F12)
2. **Check Console** for errors
3. **Check Network tab** - look for failed requests to the WordPress API

### Common Issues

#### 1. API Request Blocked by Browser
**Symptom:** Mixed content error (https page calling http API)
**Fix:** Ensure API URL in `.env.production` uses HTTPS

#### 2. CORS Error
**Symptom:** Console shows "CORS policy" error
**Fix:** WordPress site needs proper CORS headers (already configured ✅)

#### 3. Slow API Response
**Symptom:** Page loads but shows loading spinner for 10+ seconds
**Fix:** WordPress site might be slow - check hosting performance

### Testing Locally

To test if the API works:
```bash
curl "https://tan-emu-358425.hostingersite.com/wp-json/wp/v2/project?per_page=3&_embed"
```

Should return JSON with project data.

### Build Configuration

Environment variables are set in `.env.production`:
```
VITE_WP_API_URL=https://tan-emu-358425.hostingersite.com
VITE_SITE_URL=https://sabarajendran.com
```

These are automatically included in the build when you run `npm run build`.

### Deployment Checklist

- [ ] Build completed successfully (`npm run build`)
- [ ] `dist` folder contains `index.html` and assets
- [ ] API URL is embedded in build (check `dist/assets/index-*.js`)
- [ ] Netlify deploy shows no errors
- [ ] Wait 2-3 seconds after page loads for data to appear
- [ ] Check browser console for errors

### Last Known Working State
**Date:** 2025-12-04
**Build:** dist folder with Tailwind CDN
**API:** https://tan-emu-358425.hostingersite.com
**Status:** ✅ API verified working, returns 826 projects
