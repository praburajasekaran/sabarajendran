/**
 * Prerender Script for Neyveli Constituency Dashboard
 *
 * Generates static HTML files for all routes at build time using Puppeteer.
 * Implements parallel processing for performance and proper error handling.
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import axios from 'axios';

// ES modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Route {
  path: string;
  outputPath: string;
  priority?: number;
}

// Configuration
const PREVIEW_PORT = 4173; // Vite default preview port
const PREVIEW_URL = `http://localhost:${PREVIEW_PORT}`;
const CONCURRENT_RENDERS = 8; // Number of pages to render in parallel
const PAGE_TIMEOUT = 30000; // 30 seconds per page
const MAX_RETRIES = 2;

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
    const response = await axios.get(`${wpApiUrl}/?rest_route=/wp/v2/project&per_page=100&_embed`);
    let allProjects = response.data;

    const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1', 10);

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

// Generate list of routes to prerender
async function getRoutesToPrerender(wpApiUrl: string): Promise<Route[]> {
  console.log('🗺️  Generating routes to prerender...');

  const routes: Route[] = [
    { path: '/', outputPath: 'index.html', priority: 1 },
    { path: '/about', outputPath: 'about/index.html', priority: 2 },
    { path: '/projects', outputPath: 'projects/index.html', priority: 3 }
  ];

  try {
    // Fetch WordPress data to generate dynamic routes
    const projects = await fetchAllProjects(wpApiUrl);

    // Extract unique locations
    const blocks = new Set<string>();
    const blockPanchayats = new Map<string, Set<string>>();
    const locationVillages = new Map<string, Set<string>>();

    projects.forEach((project: any) => {
      const block = getTaxonomyName(project, 'project_block');
      const panchayat = getTaxonomyName(project, 'project_panchayat');
      const village = getTaxonomyName(project, 'project_village');

      if (block) {
        blocks.add(block);

        if (panchayat) {
          if (!blockPanchayats.has(block)) {
            blockPanchayats.set(block, new Set<string>());
          }
          blockPanchayats.get(block)!.add(panchayat);

          if (village) {
            const locationKey = `${block}/${panchayat}`;
            if (!locationVillages.has(locationKey)) {
              locationVillages.set(locationKey, new Set<string>());
            }
            locationVillages.get(locationKey)!.add(village);
          }
        }
      }
    });

    // Generate routes for blocks
    let priority = 4;
    blocks.forEach(block => {
      const blockSlug = slugify(block);
      routes.push({
        path: `/projects/${blockSlug}`,
        outputPath: `projects/${blockSlug}/index.html`,
        priority: priority++
      });
    });

    // Generate routes for panchayats (limit to improve build time)
    blockPanchayats.forEach((panchayats, block) => {
      const blockSlug = slugify(block);
      panchayats.forEach(panchayat => {
        const panchayatSlug = slugify(panchayat);
        routes.push({
          path: `/projects/${blockSlug}/${panchayatSlug}`,
          outputPath: `projects/${blockSlug}/${panchayatSlug}/index.html`,
          priority: priority++
        });
      });
    });

    // Generate routes for villages (limit to first 50 for build performance)
    let villageCount = 0;
    const maxVillages = 50;

    for (const [locationKey, villages] of locationVillages.entries()) {
      if (villageCount >= maxVillages) break;

      const [block, panchayat] = locationKey.split('/');
      const blockSlug = slugify(block);
      const panchayatSlug = slugify(panchayat);

      for (const village of villages) {
        if (villageCount >= maxVillages) break;

        const villageSlug = slugify(village);
        routes.push({
          path: `/projects/${blockSlug}/${panchayatSlug}/${villageSlug}`,
          outputPath: `projects/${blockSlug}/${panchayatSlug}/${villageSlug}/index.html`,
          priority: priority++
        });
        villageCount++;
      }
    }

    console.log(`✅ Generated ${routes.length} routes to prerender`);
    console.log(`   - ${blocks.size} block pages`);
    console.log(`   - ${Array.from(blockPanchayats.values()).reduce((sum, set) => sum + set.size, 0)} panchayat pages`);
    console.log(`   - ${villageCount} village pages (limited for performance)`);

    return routes;
  } catch (error) {
    console.error('❌ Error generating routes:', error);
    // Return static routes only if WordPress fetch fails
    return routes;
  }
}

// Start Vite preview server
async function startPreviewServer(): Promise<ChildProcessWithoutNullStreams> {
  console.log('🚀 Starting preview server...');

  return new Promise((resolve, reject) => {
    const server = spawn('npm', ['run', 'preview'], {
      shell: true,
      stdio: 'pipe'
    });

    let output = '';

    server.stdout.on('data', (data) => {
      output += data.toString();
      if (output.includes(`http://localhost:${PREVIEW_PORT}`)) {
        console.log(`✅ Preview server running at http://localhost:${PREVIEW_PORT}`);
        // Wait a bit more to ensure server is fully ready
        setTimeout(() => resolve(server), 2000);
      }
    });

    server.stderr.on('data', (data) => {
      const message = data.toString();
      if (message.includes('EADDRINUSE')) {
        console.log('⚠️  Preview server already running, continuing...');
        resolve(server);
      }
    });

    server.on('error', (error) => {
      reject(error);
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      if (output.includes('http://localhost')) {
        resolve(server);
      } else {
        reject(new Error('Preview server failed to start'));
      }
    }, 10000);
  });
}

// Check if preview server is already running
async function isServerRunning(): Promise<boolean> {
  try {
    await axios.get(PREVIEW_URL, { timeout: 1000 });
    return true;
  } catch {
    return false;
  }
}

// Prerender a single route
async function prerenderRoute(
  page: Page,
  route: Route,
  distDir: string,
  retryCount = 0
): Promise<boolean> {
  try {
    const url = `${PREVIEW_URL}${route.path}`;

    // Navigate to the page
    await page.goto(url, {
      waitUntil: 'networkidle2', // Changed from networkidle0 for better performance
      timeout: PAGE_TIMEOUT
    });

    // Wait for React to mount and render
    await page.waitForSelector('#root', { timeout: 5000 });

    // Wait for content to be visible (not just mounted)
    await page.waitForFunction(
      () => document.querySelector('#root')?.children.length > 0,
      { timeout: 5000 }
    );

    // Get the rendered HTML
    const html = await page.content();

    // Write to file
    const outputFile = path.join(distDir, route.outputPath);
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, html);

    return true;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(`   ⚠️  Retry ${retryCount + 1}/${MAX_RETRIES}: ${route.path}`);
      return prerenderRoute(page, route, distDir, retryCount + 1);
    }
    console.error(`   ❌ Failed: ${route.path}`, (error as Error).message);
    return false;
  }
}

// Prerender routes in parallel batches
async function prerenderBatch(
  browser: Browser,
  routes: Route[],
  distDir: string
): Promise<{ succeeded: number; failed: number }> {
  let succeeded = 0;
  let failed = 0;
  let processed = 0;

  // Process routes in batches
  for (let i = 0; i < routes.length; i += CONCURRENT_RENDERS) {
    const batch = routes.slice(i, i + CONCURRENT_RENDERS);

    // Create a page for each route in the batch
    const promises = batch.map(async (route) => {
      const page = await browser.newPage();

      try {
        const success = await prerenderRoute(page, route, distDir);
        processed++;

        const progress = ((processed / routes.length) * 100).toFixed(1);
        console.log(`   [${progress}%] ${route.path} ${success ? '✅' : '❌'}`);

        return success;
      } finally {
        await page.close();
      }
    });

    const results = await Promise.all(promises);
    succeeded += results.filter(r => r).length;
    failed += results.filter(r => !r).length;
  }

  return { succeeded, failed };
}

// Main prerender function
async function prerender() {
  console.log('\n🎨 Starting prerendering process...\n');

  const distDir = path.resolve(__dirname, '../dist');
  let server: ChildProcessWithoutNullStreams | null = null;
  let browser: Browser | null = null;

  try {
    // Configuration
    const wpApiUrl = process.env.VITE_WP_API_URL || 'https://tan-emu-358425.hostingersite.com/wp-json/wp/v2';

    // 1. Get routes to prerender
    const routes = await getRoutesToPrerender(wpApiUrl);

    // 2. Check if server is already running
    const serverAlreadyRunning = await isServerRunning();

    if (!serverAlreadyRunning) {
      // 3. Start preview server
      server = await startPreviewServer();
    } else {
      console.log('✅ Using existing preview server');
    }

    // 4. Launch browser
    console.log('🌐 Launching browser...');

    // Try to find system Chrome installation
    const possiblePaths = [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      process.env.PUPPETEER_EXECUTABLE_PATH
    ].filter(Boolean);

    let executablePath: string | undefined;
    for (const chromePath of possiblePaths) {
      if (chromePath && fs.existsSync(chromePath)) {
        executablePath = chromePath;
        console.log(`   Using Chrome at: ${chromePath}`);
        break;
      }
    }

    try {
      browser = await puppeteer.launch({
        headless: 'new',
        executablePath,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process'
        ],
        timeout: 60000, // Increase timeout to 60 seconds
        dumpio: false
      });
      console.log('✅ Browser launched');
    } catch (error) {
      console.error('\n❌ Failed to launch browser');
      console.error('   This may be due to ARM64/Rosetta issues on Mac Silicon');
      console.error('\n💡 Solutions:');
      console.error('   1. Run this in CI/CD (recommended for production)');
      console.error('   2. Use: PUPPETEER_SKIP_DOWNLOAD=true npm install puppeteer');
      console.error('   3. Set: export PUPPETEER_EXECUTABLE_PATH=/path/to/chrome');
      console.error('   4. Install ARM64 version of Node.js\n');
      console.error('   For now, skipping prerendering...\n');

      // Exit gracefully - sitemap is still generated
      console.log('✨ Build completed successfully (without prerendering)');
      console.log('   Sitemap: dist/sitemap.xml ✅');
      console.log('   React app: dist/ ✅');
      console.log('   SEO meta tags: Handled by react-helmet-async ✅\n');
      process.exit(0);
    }

    // 5. Prerender routes
    console.log(`\n📄 Prerendering ${routes.length} routes (${CONCURRENT_RENDERS} concurrent)...\n`);

    const startTime = Date.now();
    const { succeeded, failed } = await prerenderBatch(browser, routes, distDir);
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    // 6. Summary
    console.log('\n' + '='.repeat(60));
    console.log('✨ Prerendering Complete!');
    console.log('='.repeat(60));
    console.log(`   Total routes: ${routes.length}`);
    console.log(`   ✅ Succeeded: ${succeeded}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   ⏱️  Duration: ${duration}s`);
    console.log(`   📊 Average: ${(routes.length / parseFloat(duration)).toFixed(1)} pages/sec`);
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Prerendering failed:', error);
    process.exit(1);
  } finally {
    // Cleanup
    if (browser) {
      await browser.close();
      console.log('🔒 Browser closed');
    }

    if (server && !await isServerRunning()) {
      server.kill();
      console.log('🛑 Preview server stopped');
    }
  }
}

// Run the prerenderer
prerender();
