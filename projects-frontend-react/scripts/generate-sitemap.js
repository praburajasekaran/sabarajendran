/**
 * Dynamic sitemap generator for React website
 * Generates sitemap.xml with all routes including static pages and dynamic project pages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SITE_URL = 'https://sabarajendran.com';
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');

// Get current date in YYYY-MM-DD format
const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
};

// Static routes configuration
const staticRoutes = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/about', priority: '0.9', changefreq: 'monthly' },
    { path: '/projects', priority: '0.9', changefreq: 'daily' },
    { path: '/grievance', priority: '0.8', changefreq: 'monthly' },
];

/**
 * Generate sitemap XML content
 */
function generateSitemap() {
    const currentDate = getCurrentDate();

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

    // Add static routes for both English and Tamil
    staticRoutes.forEach(route => {
        // English version
        sitemap += `
  <!-- ${route.path === '/' ? 'Homepage' : route.path.replace('/', '')} - English -->
  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    <xhtml:link rel="alternate" hreflang="ta" href="${SITE_URL}/ta${route.path === '/' ? '' : route.path}" />
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${route.path}" />
  </url>
`;

        // Tamil version
        sitemap += `
  <!-- ${route.path === '/' ? 'Homepage' : route.path.replace('/', '')} - Tamil -->
  <url>
    <loc>${SITE_URL}/ta${route.path === '/' ? '' : route.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    <xhtml:link rel="alternate" hreflang="ta" href="${SITE_URL}/ta${route.path === '/' ? '' : route.path}" />
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${route.path}" />
  </url>
`;
    });

    // Optional: Add dynamic project routes if you want to fetch from API
    // This section can be expanded to include specific block/panchayat/village URLs
    // from your WordPress API

    sitemap += `
</urlset>`;

    return sitemap;
}

/**
 * Write sitemap to file
 */
function writeSitemap() {
    try {
        const sitemapContent = generateSitemap();
        fs.writeFileSync(OUTPUT_PATH, sitemapContent, 'utf8');
        console.log('✅ Sitemap generated successfully at:', OUTPUT_PATH);
        console.log('📍 Total URLs:', (sitemapContent.match(/<url>/g) || []).length);
    } catch (error) {
        console.error('❌ Error generating sitemap:', error);
        process.exit(1);
    }
}

// Run the script
writeSitemap();
