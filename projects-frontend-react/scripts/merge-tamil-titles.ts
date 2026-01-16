/**
 * Merge Tamil Titles Script
 * 
 * This script merges Tamil titles from the live WordPress server
 * into the existing projects.json without overwriting budget data.
 * 
 * Run: npx tsx scripts/merge-tamil-titles.ts
 */

import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { correctTamilSpelling } from './tamil-spelling-corrections.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const LIVE_WP_API_URL = 'https://projects.sabarajendran.com/wp-json/wp/v2';
const PUBLIC_FILE = path.join(__dirname, '../public/data/projects.json');
const DIST_FILE = path.join(__dirname, '../dist/data/projects.json');

interface TamilTitleMap {
    [projectId: string]: {
        title_ta: string;
        title_en: string;
    };
}

// Helper function with retry logic
async function fetchWithRetry(url: string, retries: number = 3, delay: number = 2000): Promise<any> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await axios.get(url, { timeout: 30000 });
        } catch (error: any) {
            if (attempt === retries) throw error;
            console.log(`   ⚠️ Attempt ${attempt} failed, retrying in ${delay / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

async function fetchAllTamilTitles(): Promise<TamilTitleMap> {
    console.log('📡 Fetching Tamil titles from live WordPress...');
    console.log(`   API URL: ${LIVE_WP_API_URL}`);

    const tamilTitles: TamilTitleMap = {};

    try {
        // First request to get total pages
        const initialUrl = `${LIVE_WP_API_URL}/project?per_page=100`;
        const response = await fetchWithRetry(initialUrl);

        const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1', 10);
        const total = parseInt(response.headers['x-wp-total'] || '0', 10);

        console.log(`   Found ${total} projects across ${totalPages} page(s)`);

        // Process first page
        for (const project of response.data) {
            if (project._project_title_tamil) {
                tamilTitles[project.id.toString()] = {
                    title_ta: correctTamilSpelling(project._project_title_tamil, 'title') || '',
                    title_en: project._project_title_english || project.title?.rendered || ''
                };
            }
        }

        // Fetch remaining pages
        for (let page = 2; page <= totalPages; page++) {
            console.log(`   Fetching page ${page}/${totalPages}...`);
            const pageUrl = `${LIVE_WP_API_URL}/project?per_page=100&page=${page}`;
            const pageResponse = await fetchWithRetry(pageUrl);

            for (const project of pageResponse.data) {
                if (project._project_title_tamil) {
                    tamilTitles[project.id.toString()] = {
                        title_ta: correctTamilSpelling(project._project_title_tamil, 'title') || '',
                        title_en: project._project_title_english || project.title?.rendered || ''
                    };
                }
            }

            // Small delay to avoid overwhelming the server
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        console.log(`✅ Fetched Tamil titles for ${Object.keys(tamilTitles).length} projects`);
        return tamilTitles;

    } catch (error) {
        console.error('❌ Error fetching Tamil titles:', error);
        throw error;
    }
}

async function mergeData(): Promise<void> {
    console.log('\n🚀 Starting Tamil title merge...\n');

    const startTime = Date.now();

    // Load existing projects.json
    if (!fs.existsSync(PUBLIC_FILE)) {
        throw new Error(`projects.json not found at ${PUBLIC_FILE}`);
    }

    const existingData = JSON.parse(fs.readFileSync(PUBLIC_FILE, 'utf-8'));
    console.log(`📂 Loaded ${existingData.projects.length} projects from existing file`);

    // Calculate existing budget
    const existingBudget = existingData.projects.reduce((sum: number, p: any) => sum + (p.rawBudget || 0), 0);
    console.log(`   Existing total budget: ₹${(existingBudget / 10000000).toFixed(2)} Cr`);

    // Count empty Tamil titles
    const emptyTamilBefore = existingData.projects.filter((p: any) => !p.title_ta || p.title_ta === '').length;
    console.log(`   Projects with empty Tamil titles: ${emptyTamilBefore}`);

    // Fetch Tamil titles from live server
    const tamilTitles = await fetchAllTamilTitles();

    // Merge Tamil titles into existing data
    let updatedCount = 0;
    for (const project of existingData.projects) {
        const tamilData = tamilTitles[project.id];
        if (tamilData && tamilData.title_ta) {
            if (!project.title_ta || project.title_ta === '') {
                project.title_ta = tamilData.title_ta;
                updatedCount++;
            }
        }
    }

    console.log(`\n📝 Updated Tamil titles for ${updatedCount} projects`);

    // Count empty Tamil titles after merge
    const emptyTamilAfter = existingData.projects.filter((p: any) => !p.title_ta || p.title_ta === '').length;
    console.log(`   Projects still with empty Tamil titles: ${emptyTamilAfter}`);

    // Verify budget is unchanged
    const newBudget = existingData.projects.reduce((sum: number, p: any) => sum + (p.rawBudget || 0), 0);
    console.log(`   Final total budget: ₹${(newBudget / 10000000).toFixed(2)} Cr`);

    if (existingBudget !== newBudget) {
        console.warn('⚠️ WARNING: Budget changed during merge!');
    } else {
        console.log('✅ Budget preserved correctly');
    }

    // Update metadata
    existingData.meta.generatedAt = new Date().toISOString();

    // Write back to files
    fs.writeFileSync(PUBLIC_FILE, JSON.stringify(existingData, null, 2));
    console.log(`📁 Written to: ${PUBLIC_FILE}`);

    // Also update dist if it exists
    const distDir = path.dirname(DIST_FILE);
    if (fs.existsSync(distDir)) {
        fs.writeFileSync(DIST_FILE, JSON.stringify(existingData, null, 2));
        console.log(`📁 Written to: ${DIST_FILE}`);
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n' + '='.repeat(50));
    console.log('✅ Tamil title merge complete!');
    console.log(`   Total projects: ${existingData.projects.length}`);
    console.log(`   Tamil titles updated: ${updatedCount}`);
    console.log(`   Budget: ₹${(newBudget / 10000000).toFixed(2)} Cr (preserved)`);
    console.log(`   Duration: ${duration}s`);
    console.log('='.repeat(50) + '\n');
}

// Run
mergeData().catch(err => {
    console.error('Failed to merge Tamil titles:', err);
    process.exit(1);
});
