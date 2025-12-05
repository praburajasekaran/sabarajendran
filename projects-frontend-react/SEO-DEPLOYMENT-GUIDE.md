# SEO Implementation & Deployment Guide

## 📋 Overview

This project implements comprehensive SEO features for the Neyveli Constituency Dashboard, including:

- ✅ **Dynamic Meta Tags** (via react-helmet-async)
- ✅ **Structured Data** (Organization, Person, Breadcrumbs)
- ✅ **Dynamic Sitemap** (1,800+ URLs)
- ✅ **Static Site Generation** (Optional - for enhanced SEO)
- ✅ **Language Alternates** (English/Tamil)
- ✅ **Strategic Indexing** (noindex for filter combinations)

---

## 🚀 Build Commands

### Standard Build (Recommended for most cases)
```bash
npm run build
```
**Output:**
- Vite production build → `dist/`
- Dynamic sitemap → `dist/sitemap.xml`
- SEO meta tags rendered by react-helmet-async

**Build time:** ~5-10 seconds

### Full Build with Prerendering (Enhanced SEO)
```bash
npm run build:full
```
**Output:**
- Everything from standard build
- Static HTML files for all routes → `dist/**/*.html`

**Build time:** ~2-5 minutes (depends on number of routes)

**Note:** Prerendering requires Chrome/Chromium and may not work on ARM64 Macs (see Known Issues below).

---

## 📦 What's Included

### 1. Critical SEO Fixes ✅
- **Removed global noindex** - Site is now indexable
- **Fixed robots.txt** - Allows all crawlers + sitemap reference
- **Preconnect hints** - Optimized loading for WordPress API

### 2. Enhanced Structured Data ✅
**Files Modified:**
- `utils/seo.ts` - Added `generateOrganizationSchema()` and `generatePersonSchema()`
- `pages/Home.tsx` - Includes Organization + Person schemas
- `pages/About.tsx` - Includes enhanced Person schema
- `components/SEO.tsx` - Added language alternates

**Schema Types:**
- GovernmentOrganization (Neyveli Constituency Office)
- Person (MLA Saba Rajendran)
- BreadcrumbList (Location hierarchy)

### 3. Dynamic Sitemap Generation ✅
**Script:** `scripts/generate-sitemap.ts`

**Generated URLs:**
- Static pages (/, /about, /projects)
- Block pages (/projects/panruti)
- Panchayat pages (/projects/panruti/nadukuppam)
- Village pages (/projects/panruti/nadukuppam/village-name)
- Strategic filter combinations (location + single filter)

**Total:** ~1,800+ URLs

**Strategic Indexing:**
- ✅ Include: Location-only pages
- ✅ Include: Location + single filter (type OR status OR year)
- ❌ Exclude: Multiple filters combined
- ❌ Exclude: Pagination > 1
- ❌ Exclude: Search queries

### 4. Static Site Generation (Optional) ✅
**Script:** `scripts/prerender.ts`

**Features:**
- Parallel processing (8 concurrent pages)
- Automatic route generation from WordPress data
- Error handling with retries
- Progress tracking
- Graceful fallback if browser launch fails

**Limitations:**
- Limited to 79 routes by default (configurable)
- May not work on ARM64 Macs (see Known Issues)
- Requires Chrome/Chromium installation

---

## 🌐 Deployment to Netlify

### Environment Variables
Set these in Netlify dashboard (Site Settings → Environment Variables):

```
VITE_WP_API_URL=https://tan-emu-358425.hostingersite.com/wp-json/wp/v2
VITE_SITE_URL=https://sabarajendran.com
GEMINI_API_KEY=<your-key>
```

### Build Settings
**Build command:**
```
npm run build:full
```
*or*
```
npm run build
```
(Use `build:full` only if prerendering works in Netlify's CI environment)

**Publish directory:**
```
dist
```

### netlify.toml Configuration
Already configured with:
- SPA fallback routing
- API proxying to WordPress
- Node 18 environment

### Post-Deployment Checklist

1. **Verify Sitemap**
   - Visit: https://sabarajendran.com/sitemap.xml
   - Should see 1,800+ URLs in XML format

2. **Check Meta Tags**
   - View source on any page
   - Verify `<title>`, `<meta name="description">`, Open Graph tags
   - Check for language alternates (`<link rel="alternate" hrefLang="...">`)

3. **Validate Structured Data**
   - Use [Google Rich Results Test](https://search.google.com/test/rich-results)
   - Test homepage for Organization + Person schemas
   - Test /about for Person schema
   - Test project pages for Breadcrumb schema

4. **Submit to Search Console**
   - Go to [Google Search Console](https://search.google.com/search-console)
   - Add property: https://sabarajendran.com
   - Submit sitemap: https://sabarajendran.com/sitemap.xml
   - Monitor indexing status

5. **Test Social Sharing**
   - [Facebook Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - Verify og:image displays correctly

---

## 🐛 Known Issues & Solutions

### Issue 1: Prerendering Fails on ARM64 Macs

**Error:**
```
Degraded performance warning: Launching Chrome on Mac Silicon (arm64) from an x64 Node installation...
TimeoutError: Timed out after 30000 ms while waiting for the WS endpoint URL to appear in stdout!
```

**Cause:**
Puppeteer doesn't work well on ARM64 Macs when Node is running under Rosetta translation.

**Solutions:**

#### Option A: Skip Prerendering (Recommended for local development)
```bash
npm run build  # Without prerendering
```

**Why this is okay:**
- Modern search engines (Google, Bing) can render JavaScript
- react-helmet-async adds meta tags to the HTML
- Sitemap guides crawlers to all important pages
- Structured data is still present

#### Option B: Use ARM64 Node
```bash
# Install ARM64 version of Node.js
nvm install 18 --arch=arm64
nvm use 18

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try prerendering again
npm run build:full
```

#### Option C: Use Netlify/CI for Prerendering
Netlify's build environment uses x64 Linux, which works fine with Puppeteer.

Set build command to:
```
npm run build:full
```

#### Option D: Set Custom Chrome Path
```bash
export PUPPETEER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
npm run build:full
```

### Issue 2: Long Build Times

**Cause:**
Prerendering 79+ routes can take 2-5 minutes.

**Solution:**
Limit routes in `scripts/prerender.ts`:

```typescript
// Line 175-177
const maxVillages = 50;  // Reduce this number
```

Or use standard build:
```bash
npm run build  # Faster, no prerendering
```

### Issue 3: OG Image Not Found

**Error:**
`og:image` references `/og-image.jpg` which doesn't exist.

**Solution:**
Create the image:

1. Design a 1200x630px image with:
   - MLA photo
   - "Saba Rajendran | Neyveli MLA" text
   - DMK red (#dc2626) branding

2. Save as: `public/og-image.jpg`

3. Rebuild:
   ```bash
   npm run build
   ```

---

## 📊 SEO Performance Expectations

### Before Implementation
- ❌ Site blocked from ALL search engines (noindex + robots.txt disallow)
- ❌ No sitemap
- ❌ Basic meta tags only
- ❌ No structured data

### After Implementation (without prerendering)
- ✅ Site crawlable and indexable
- ✅ 1,800+ URLs in sitemap
- ✅ Dynamic meta tags (react-helmet-async)
- ✅ Rich structured data
- ✅ Language alternates
- ⚠️  JavaScript required for meta tags

**Expected indexing:** 1-2 weeks for main pages, 2-4 weeks for all pages

### After Implementation (with prerendering)
- ✅ All of the above
- ✅ Static HTML with meta tags (no JavaScript required)
- ✅ Faster initial indexing
- ✅ Better crawl budget optimization

**Expected indexing:** 3-7 days for main pages, 1-2 weeks for all pages

---

## 🔧 Maintenance

### Updating Sitemap
Sitemap is regenerated automatically on every build. To manually regenerate:

```bash
npm run generate-sitemap
```

### Adding New Routes
1. Add WordPress data (projects, taxonomies)
2. Run build - sitemap updates automatically
3. Submit updated sitemap to Search Console

### Monitoring SEO
- **Google Search Console:** Monitor indexing, crawl errors, performance
- **Analytics:** Track organic traffic growth
- **PageSpeed Insights:** Ensure fast loading times
- **Rich Results Test:** Validate structured data

---

## 📁 Key Files Reference

### Modified Files
- `index.html` - Removed noindex, added preconnect
- `public/robots.txt` - Allow crawling, reference sitemap
- `utils/seo.ts` - Added schema generators
- `components/SEO.tsx` - Added language alternates
- `pages/Home.tsx` - Added structured data
- `pages/About.tsx` - Added structured data
- `package.json` - Added build scripts

### New Files
- `scripts/generate-sitemap.ts` - Sitemap generator
- `scripts/prerender.ts` - Static site generator
- `.puppeteerrc.cjs` - Puppeteer configuration
- `SEO-DEPLOYMENT-GUIDE.md` - This file

---

## 🎯 Recommendations

### For Development
```bash
npm run build  # Fast builds without prerendering
```

### For Production (Netlify)
```bash
npm run build:full  # If prerendering works in CI
# OR
npm run build  # If prerendering fails or takes too long
```

### SEO Monitoring (First 3 Months)
1. **Week 1:** Submit sitemap, monitor Search Console for crawl errors
2. **Week 2-4:** Track indexing status, fix any issues
3. **Month 2-3:** Monitor organic traffic growth, optimize high-traffic pages

---

## 💡 FAQ

**Q: Do I need prerendering for good SEO?**

A: No. Google and other modern search engines can render JavaScript. The sitemap, dynamic meta tags, and structured data are sufficient for good SEO. Prerendering is an enhancement, not a requirement.

**Q: Why does prerendering fail on my Mac?**

A: ARM64 Macs (M1/M2) have issues with Puppeteer when Node runs under Rosetta. Use standard build locally and enable prerendering in Netlify CI if needed.

**Q: How long until my pages get indexed?**

A: Main pages: 1-2 weeks. All pages: 2-4 weeks (without prerendering), 1-2 weeks (with prerendering). Submit sitemap to Search Console to speed this up.

**Q: Can I reduce build time?**

A: Yes. Use `npm run build` instead of `npm run build:full`, or reduce the `maxVillages` constant in `prerender.ts`.

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review [docs/TECHNICAL-NOTES.md](./docs/TECHNICAL-NOTES.md)
3. Check [docs/DEPLOYMENT-TROUBLESHOOTING.md](./docs/DEPLOYMENT-TROUBLESHOOTING.md)
4. Submit an issue on GitHub

---

**Last Updated:** December 5, 2025
