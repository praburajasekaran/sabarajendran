# Sitemap Implementation for React Website

## Overview
This document explains the sitemap implementation for the Sabarajendran React website, which supports both English and Tamil language routes.

## Files Created

### 1. `/public/sitemap.xml`
The main sitemap file that search engines will crawl. It includes:
- All static routes (home, about, projects, grievance)
- Both English and Tamil versions of each page
- Proper `hreflang` attributes for multilingual SEO
- Priority and change frequency metadata

### 2. `/public/robots.txt`
Tells search engines how to crawl the site and where to find the sitemap.

### 3. `/scripts/generate-sitemap.js`
A Node.js script to dynamically generate the sitemap with the current date. This ensures the `lastmod` field is always up-to-date.

## Usage

### Generating the Sitemap
Run the following command to regenerate the sitemap:

```bash
npm run generate-sitemap
```

This will update `/public/sitemap.xml` with the current date.

### When to Regenerate
Regenerate the sitemap when:
- You add new static pages to the application
- You want to update the `lastmod` date for SEO purposes
- Before deploying to production

### Automatic Generation (Recommended)
You can add the sitemap generation to your build process by updating the build script in `package.json`:

```json
"build": "npm run generate-sitemap && vite build"
```

## Sitemap Structure

### URL Priority Levels
- **1.0**: Homepage (highest priority)
- **0.9**: Main pages (about, projects)
- **0.8**: Secondary pages (grievance)

### Change Frequency
- **Daily**: Projects page (frequently updated with new data)
- **Weekly**: Homepage
- **Monthly**: About and Grievance pages

### Multilingual Support
Each URL includes `hreflang` attributes to tell search engines about the Tamil alternative:

```xml
<xhtml:link rel="alternate" hreflang="ta" href="https://sabarajendran.com/ta" />
<xhtml:link rel="alternate" hreflang="en" href="https://sabarajendran.com/" />
```

## SEO Best Practices Implemented

1. **XML Sitemap Protocol**: Follows the official sitemaps.org schema
2. **Bilingual Support**: Proper hreflang implementation for Tamil/English
3. **Robots.txt**: References the sitemap location
4. **Priority Hierarchy**: Guides search engines on page importance
5. **Change Frequency**: Indicates update patterns for crawler optimization

## Submitting to Search Engines

### Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property: `https://sabarajendran.com`
3. Navigate to Sitemaps → Add new sitemap
4. Enter: `sitemap.xml`
5. Submit

### Bing Webmaster Tools
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add your site
3. Navigate to Sitemaps
4. Submit: `https://sabarajendran.com/sitemap.xml`

## Future Enhancements

### Dynamic Project URLs (Optional)
If you want to include specific project pages (e.g., `/projects/neyveli-block`, `/projects/neyveli-block/kurinjipadi`), you can:

1. Fetch block/panchayat/village data from the WordPress API
2. Generate URLs for each project filter combination
3. Add them to the sitemap with appropriate priorities

Example code to add to `generate-sitemap.js`:

```javascript
// Fetch from WordPress API
const response = await fetch(`${WP_API_URL}/projects`);
const projects = await response.json();

// Generate project URLs
projects.forEach(project => {
  sitemap += `
  <url>
    <loc>${SITE_URL}/projects/${project.blockSlug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
});
```

## Verification

After deploying, verify your sitemap is accessible at:
- https://sabarajendran.com/sitemap.xml
- https://sabarajendran.com/robots.txt

Test sitemap validity:
- [Google's Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)
- [XML Sitemap Validator](https://xmlsitemapgenerator.org/sitemap-validator)

## Notes

- The sitemap currently includes **8 URLs** (4 pages × 2 languages)
- All URLs use HTTPS (secure protocol)
- The sitemap is located in the `/public` folder so it's accessible at the root URL after deployment
- Tamil routes use the `/ta` prefix for clean URL structure
