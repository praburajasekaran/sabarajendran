# WP Super Cache Configuration Guide

**Quick 2-Minute Setup for Performance & DDoS Protection**

---

## STEP 1: Enable Caching

1. Go to **Settings → WP Super Cache** (should be open now)
2. Select **"Caching On (Recommended)"**
3. Click **"Update Status"**
4. You should see: "Plugin enabled"

---

## STEP 2: Test Cache

1. Scroll down to **"Test Cache"** section
2. Click **"Test Cache"** button
3. Wait for results
4. You should see: **"The pages are different! Caching is working!"** or similar success message

---

## STEP 3: Advanced Settings (Recommended)

1. Click the **"Advanced"** tab at the top
2. Enable these checkboxes:

   **Recommended Settings:**
   - ✅ **Use mod_rewrite to serve cache files** (fastest method)
   - ✅ **Compress pages so they're served more quickly to visitors**
   - ✅ **304 Not Modified browser caching**
   - ✅ **Don't cache pages for known users** (protects admin functionality)
   - ✅ **Cache rebuild** (serves old cached page while generating new one)
   - ✅ **Extra homepage checks** (improves homepage caching)

   **Optional (but useful):**
   - ✅ **Mobile device support** (if you have mobile visitors)
   - ✅ **Remove UTF8/blog charset support from .htaccess file**

3. Click **"Update Status"** at the bottom

---

## STEP 4: Preload Cache (Optional but Recommended)

1. Click the **"Preload"** tab
2. Enable **"Preload mode"**
3. Set **"Refresh preloaded cache files every"** to **1440** minutes (24 hours)
4. Click **"Update Settings"**
5. Click **"Preload Cache Now"** to start building cache

---

## STEP 5: CDN Setup (Skip for Now)

CDN tab can be configured later when you have a CDN service like Cloudflare.

---

## STEP 6: Verify Cache is Working

1. Click the **"Contents"** tab
2. You should see cached files listed
3. Check **"Cache Statistics"** to see cache hits

---

## Performance Benefits

**Before Caching:**
- Page load time: ~1-3 seconds
- Server queries per page: 50-100

**After Caching:**
- Page load time: ~0.2-0.5 seconds
- Server queries per page: 0 (served from cache)

**DDoS Protection:**
- Cached pages can handle 10-100x more traffic
- Reduces database load significantly
- Protects against traffic spikes

---

## Troubleshooting

### Cache Not Working?
1. Make sure .htaccess is writable
2. Check mod_rewrite is enabled (it should be in MAMP)
3. Try "Delete Cache" and rebuild

### Site Looking Broken?
1. Go to **Settings → WP Super Cache**
2. Click **"Delete Cache"**
3. Test again

### Admin Area Slow?
This is normal - admin pages are not cached for security reasons.

---

## When to Clear Cache

Clear cache after:
- Installing/updating plugins or themes
- Making design changes
- Publishing important content updates
- Troubleshooting display issues

**How to Clear:**
Go to **Settings → WP Super Cache → Contents → Delete Cache**

---

## Quick Settings Summary

```
Caching: ON
Method: mod_rewrite
Compression: Enabled
Cache Rebuild: Enabled
Mobile Support: Enabled (if needed)
Preload: Enabled (24-hour refresh)
```

---

**Configuration Time:** 2-3 minutes
**Performance Improvement:** 5-10x faster page loads

---

*Generated: November 29, 2025*
*For: Saba Rajendran MLA Website*
