/**
 * Export Tamil Titles from Live WordPress
 * 
 * This script fetches Tamil titles from the live WordPress server
 * and generates SQL statements to update the local WordPress database.
 * 
 * Run: npx tsx scripts/export-tamil-titles-to-sql.ts
 * 
 * Output: scripts/update-tamil-titles.sql
 */

import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const LIVE_WP_API_URL = 'https://projects.sabarajendran.com/wp-json/wp/v2';
const OUTPUT_FILE = path.join(__dirname, 'update-tamil-titles.sql');

interface TamilTitleData {
    postId: number;
    titleTamil: string;
    titleEnglish: string;
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

// Escape single quotes for SQL
function escapeSql(str: string): string {
    if (!str) return '';
    return str.replace(/'/g, "''").replace(/\\/g, '\\\\');
}

async function fetchAllTamilTitles(): Promise<TamilTitleData[]> {
    console.log('📡 Fetching Tamil titles from live WordPress...');
    console.log(`   API URL: ${LIVE_WP_API_URL}`);

    const tamilTitles: TamilTitleData[] = [];

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
                tamilTitles.push({
                    postId: project.id,
                    titleTamil: project._project_title_tamil,
                    titleEnglish: project._project_title_english || project.title?.rendered || ''
                });
            }
        }

        // Fetch remaining pages
        for (let page = 2; page <= totalPages; page++) {
            console.log(`   Fetching page ${page}/${totalPages}...`);
            const pageUrl = `${LIVE_WP_API_URL}/project?per_page=100&page=${page}`;
            const pageResponse = await fetchWithRetry(pageUrl);

            for (const project of pageResponse.data) {
                if (project._project_title_tamil) {
                    tamilTitles.push({
                        postId: project.id,
                        titleTamil: project._project_title_tamil,
                        titleEnglish: project._project_title_english || project.title?.rendered || ''
                    });
                }
            }

            // Small delay to avoid overwhelming the server
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        console.log(`✅ Fetched Tamil titles for ${tamilTitles.length} projects`);
        return tamilTitles;

    } catch (error) {
        console.error('❌ Error fetching Tamil titles:', error);
        throw error;
    }
}

function generateSql(tamilTitles: TamilTitleData[]): string {
    const lines: string[] = [];

    // Header
    lines.push('-- =====================================================');
    lines.push('-- Update Tamil Titles in Local WordPress');
    lines.push(`-- Generated: ${new Date().toISOString()}`);
    lines.push(`-- Total updates: ${tamilTitles.length}`);
    lines.push('-- =====================================================');
    lines.push('');
    lines.push('-- IMPORTANT: Backup your database before running this!');
    lines.push('');
    lines.push('-- Start transaction for safety');
    lines.push('START TRANSACTION;');
    lines.push('');

    // Generate UPDATE statements only
    // If the meta key doesn't exist, we'll use INSERT IGNORE with explicit NULL for meta_id
    for (const item of tamilTitles) {
        const escapedTitle = escapeSql(item.titleTamil);

        lines.push(`-- Project ID: ${item.postId}`);

        // First try UPDATE (for existing meta)
        lines.push(`UPDATE wp_postmeta SET meta_value = '${escapedTitle}' WHERE post_id = ${item.postId} AND meta_key = '_project_title_tamil';`);

        // Then INSERT if not exists (with explicit columns to let meta_id auto-increment)
        lines.push(`INSERT IGNORE INTO wp_postmeta (post_id, meta_key, meta_value) `);
        lines.push(`SELECT ${item.postId}, '_project_title_tamil', '${escapedTitle}' `);
        lines.push(`WHERE NOT EXISTS (SELECT 1 FROM wp_postmeta WHERE post_id = ${item.postId} AND meta_key = '_project_title_tamil');`);
        lines.push('');
    }

    // Summary
    lines.push('-- =====================================================');
    lines.push(`-- Total statements: ${tamilTitles.length * 2}`);
    lines.push('-- =====================================================');
    lines.push('');
    lines.push('COMMIT;');
    lines.push('');
    lines.push('-- Verify count:');
    lines.push("SELECT COUNT(*) as tamil_titles_count FROM wp_postmeta WHERE meta_key = '_project_title_tamil' AND meta_value != '';");

    return lines.join('\n');
}

async function main(): Promise<void> {
    console.log('\n🚀 Starting Tamil title export...\n');

    const startTime = Date.now();

    // Fetch Tamil titles from live server
    const tamilTitles = await fetchAllTamilTitles();

    // Generate SQL
    console.log('\n📝 Generating SQL statements...');
    const sql = generateSql(tamilTitles);

    // Write to file
    fs.writeFileSync(OUTPUT_FILE, sql);
    console.log(`📁 Written to: ${OUTPUT_FILE}`);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n' + '='.repeat(50));
    console.log('✅ Tamil title export complete!');
    console.log(`   Total Tamil titles: ${tamilTitles.length}`);
    console.log(`   Output file: ${OUTPUT_FILE}`);
    console.log(`   Duration: ${duration}s`);
    console.log('='.repeat(50));
    console.log('\n📋 Next steps:');
    console.log('   1. Open phpMyAdmin: http://localhost:8118/phpMyAdmin5/');
    console.log('   2. Select "sabarajendran" database');
    console.log('   3. Go to "Import" tab');
    console.log('   4. Upload the SQL file and run');
    console.log('');
}

// Run
main().catch(err => {
    console.error('Failed to export Tamil titles:', err);
    process.exit(1);
});
