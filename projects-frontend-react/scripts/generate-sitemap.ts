/**
 * Sitemap Generator for Neyveli Constituency Dashboard
 *
 * Generates sitemap.xml dynamically from WordPress project data.
 * Implements strategic indexing logic to include only SEO-valuable pages.
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

interface TaxonomyData {
  blocks: Set<string>;
  blockPanchayats: Map<string, Set<string>>;
  locationVillages: Map<string, Set<string>>;
  types: Set<string>;
  statuses: Set<string>;
  years: Set<string>;
}

// Helper function to slugify text
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Extract taxonomy name from WordPress project data
function getTaxonomyName(wpItem: any, taxonomy: string): string | undefined {
  const terms = wpItem._embedded?.['wp:term'];
  if (!terms) return undefined;

  for (const termList of terms) {
    if (Array.isArray(termList) && termList.length > 0) {
      if (termList[0].taxonomy === taxonomy) {
        return termList[0].name;
      }
    }
  }
  return undefined;
}

// Fetch all projects from WordPress API
async function fetchAllProjects(wpApiUrl: string): Promise<any[]> {
  console.log('📡 Fetching projects from WordPress...');

  try {
    // Fetch first page to get total pages
    const response = await axios.get(`${wpApiUrl}/?rest_route=/wp/v2/project&per_page=100&_embed`);
    let allProjects = response.data;

    const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1', 10);
    console.log(`   Found ${totalPages} page(s) of projects`);

    // Fetch remaining pages if needed
    if (totalPages > 1) {
      const pagePromises = [];
      for (let i = 2; i <= totalPages; i++) {
        pagePromises.push(
          axios.get(`${wpApiUrl}/?rest_route=/wp/v2/project&per_page=100&_embed&page=${i}`)
        );
      }

      const responses = await Promise.all(pagePromises);
      responses.forEach(res => {
        allProjects = [...allProjects, ...res.data];
      });
    }

    console.log(`✅ Fetched ${allProjects.length} total projects`);
    return allProjects;
  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    throw error;
  }
}

// Extract taxonomy data from projects
function extractTaxonomyData(projects: any[]): TaxonomyData {
  console.log('📊 Extracting taxonomy data...');

  const data: TaxonomyData = {
    blocks: new Set<string>(),
    blockPanchayats: new Map<string, Set<string>>(),
    locationVillages: new Map<string, Set<string>>(),
    types: new Set<string>(),
    statuses: new Set<string>(),
    years: new Set<string>()
  };

  projects.forEach(project => {
    const block = getTaxonomyName(project, 'project_block');
    const panchayat = getTaxonomyName(project, 'project_panchayat');
    const village = getTaxonomyName(project, 'project_village');
    const type = getTaxonomyName(project, 'project_category');
    const status = getTaxonomyName(project, 'project_status');
    const year = getTaxonomyName(project, 'project_year');

    if (block) {
      data.blocks.add(block);

      if (panchayat) {
        if (!data.blockPanchayats.has(block)) {
          data.blockPanchayats.set(block, new Set<string>());
        }
        data.blockPanchayats.get(block)!.add(panchayat);

        if (village) {
          const locationKey = `${block}/${panchayat}`;
          if (!data.locationVillages.has(locationKey)) {
            data.locationVillages.set(locationKey, new Set<string>());
          }
          data.locationVillages.get(locationKey)!.add(village);
        }
      }
    }

    if (type) data.types.add(type);
    if (status) data.statuses.add(status);
    if (year) data.years.add(year);
  });

  console.log(`   Blocks: ${data.blocks.size}`);
  console.log(`   Panchayats: ${Array.from(data.blockPanchayats.values()).reduce((sum, set) => sum + set.size, 0)}`);
  console.log(`   Villages: ${Array.from(data.locationVillages.values()).reduce((sum, set) => sum + set.size, 0)}`);
  console.log(`   Types: ${data.types.size}`);
  console.log(`   Statuses: ${data.statuses.size}`);
  console.log(`   Years: ${data.years.size}`);

  return data;
}

// Generate sitemap URLs
function generateSitemapUrls(siteUrl: string, data: TaxonomyData): SitemapUrl[] {
  console.log('🗺️  Generating sitemap URLs...');

  const urls: SitemapUrl[] = [];
  const now = new Date().toISOString();

  // 1. Static pages (highest priority)
  urls.push({
    loc: siteUrl,
    lastmod: now,
    changefreq: 'weekly',
    priority: '1.0'
  });

  urls.push({
    loc: `${siteUrl}/about`,
    lastmod: now,
    changefreq: 'monthly',
    priority: '0.8'
  });

  urls.push({
    loc: `${siteUrl}/projects`,
    lastmod: now,
    changefreq: 'daily',
    priority: '0.9'
  });

  // 2. Block pages (location-only, high priority)
  data.blocks.forEach(block => {
    const blockSlug = slugify(block);
    urls.push({
      loc: `${siteUrl}/projects/${blockSlug}`,
      lastmod: now,
      changefreq: 'daily',
      priority: '0.8'
    });

    // 3. Block + single filter combinations (strategic)
    data.types.forEach(type => {
      if (type !== 'All') {
        urls.push({
          loc: `${siteUrl}/projects/${blockSlug}?type=${slugify(type)}`,
          lastmod: now,
          changefreq: 'weekly',
          priority: '0.7'
        });
      }
    });

    data.statuses.forEach(status => {
      if (status !== 'All') {
        urls.push({
          loc: `${siteUrl}/projects/${blockSlug}?status=${slugify(status)}`,
          lastmod: now,
          changefreq: 'weekly',
          priority: '0.7'
        });
      }
    });

    data.years.forEach(year => {
      if (year !== 'All') {
        urls.push({
          loc: `${siteUrl}/projects/${blockSlug}?year=${year}`,
          lastmod: now,
          changefreq: 'monthly',
          priority: '0.6'
        });
      }
    });
  });

  // 4. Panchayat pages (location-only)
  data.blockPanchayats.forEach((panchayats, block) => {
    const blockSlug = slugify(block);
    panchayats.forEach(panchayat => {
      const panchayatSlug = slugify(panchayat);
      urls.push({
        loc: `${siteUrl}/projects/${blockSlug}/${panchayatSlug}`,
        lastmod: now,
        changefreq: 'weekly',
        priority: '0.7'
      });

      // 5. Panchayat + single filter combinations (strategic)
      data.types.forEach(type => {
        if (type !== 'All') {
          urls.push({
            loc: `${siteUrl}/projects/${blockSlug}/${panchayatSlug}?type=${slugify(type)}`,
            lastmod: now,
            changefreq: 'weekly',
            priority: '0.6'
          });
        }
      });
    });
  });

  // 6. Village pages (location-only)
  data.locationVillages.forEach((villages, locationKey) => {
    const [block, panchayat] = locationKey.split('/');
    const blockSlug = slugify(block);
    const panchayatSlug = slugify(panchayat);

    villages.forEach(village => {
      const villageSlug = slugify(village);
      urls.push({
        loc: `${siteUrl}/projects/${blockSlug}/${panchayatSlug}/${villageSlug}`,
        lastmod: now,
        changefreq: 'monthly',
        priority: '0.6'
      });
    });
  });

  console.log(`✅ Generated ${urls.length} URLs for sitemap`);
  return urls;
}

// Generate sitemap XML
function generateSitemapXml(urls: SitemapUrl[]): string {
  const urlElements = urls.map(url => {
    return `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

// Main function
async function generateSitemap() {
  console.log('\n🚀 Starting sitemap generation...\n');

  try {
    // Configuration
    const siteUrl = process.env.VITE_SITE_URL || 'https://sabarajendran.com';
    // Use production WordPress API by default for builds
    const wpApiUrl = process.env.VITE_WP_API_URL || 'https://projects.sabarajendran.com/wp-json/wp/v2';

    console.log(`   Site URL: ${siteUrl}`);
    console.log(`   WP API URL: ${wpApiUrl}\n`);

    // 1. Fetch projects
    const projects = await fetchAllProjects(wpApiUrl);

    // 2. Extract taxonomy data
    const taxonomyData = extractTaxonomyData(projects);

    // 3. Generate URLs
    const urls = generateSitemapUrls(siteUrl, taxonomyData);

    // 4. Generate XML
    console.log('📝 Generating XML...');
    const xml = generateSitemapXml(urls);

    // 5. Write to file
    const outputPath = path.resolve(__dirname, '../dist/sitemap.xml');
    console.log(`💾 Writing sitemap to: ${outputPath}`);

    // Ensure dist directory exists
    const distDir = path.dirname(outputPath);
    if (!fs.existsSync(distDir)) {
      console.log(`   Creating dist directory...`);
      fs.mkdirSync(distDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, xml);

    console.log(`\n✅ Sitemap generated successfully!`);
    console.log(`   Total URLs: ${urls.length}`);
    console.log(`   File: dist/sitemap.xml\n`);

  } catch (error) {
    console.error('\n❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the generator
generateSitemap();
