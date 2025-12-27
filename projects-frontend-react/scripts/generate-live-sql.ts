/**
 * Generate SQL file to apply Tamil spelling corrections to live database
 *
 * This script creates an SQL file with UPDATE statements that can be run
 * on your live WordPress database via phpMyAdmin or MySQL client.
 */

import { tamilSpellingCorrections } from './tamil-spelling-corrections.js';
import * as fs from 'fs';
import * as path from 'path';

// Escape single quotes for SQL
function escapeSql(str: string): string {
    return str.replace(/'/g, "''");
}

function generateSql(): string {
    const lines: string[] = [];

    lines.push('-- =====================================================');
    lines.push('-- Tamil Spelling Corrections for Live Database');
    lines.push('-- Generated: ' + new Date().toISOString());
    lines.push('-- Total Corrections: ' + Object.keys(tamilSpellingCorrections).length);
    lines.push('-- =====================================================');
    lines.push('');
    lines.push('-- IMPORTANT: Backup your database before running this!');
    lines.push('-- Run this SQL on your live WordPress database');
    lines.push('');
    lines.push('SET SQL_SAFE_UPDATES = 0;');
    lines.push('');
    lines.push('-- =====================================================');
    lines.push('-- START TRANSACTION (optional - for safety)');
    lines.push('-- Uncomment the next line to use transactions:');
    lines.push('-- START TRANSACTION;');
    lines.push('-- =====================================================');
    lines.push('');

    // Counter for tracking changes
    lines.push('-- Initialize change counters');
    lines.push('SET @villages_updated = 0;');
    lines.push('SET @panchayats_updated = 0;');
    lines.push('SET @titles_updated = 0;');
    lines.push('');

    // Group 1: Update Villages (taxonomy: village)
    lines.push('-- =====================================================');
    lines.push('-- UPDATE VILLAGES');
    lines.push('-- =====================================================');

    for (const [wrong, correct] of Object.entries(tamilSpellingCorrections)) {
        if (!correct) continue; // Skip empty corrections

        lines.push(`-- Fix: '${wrong}' -> '${correct}'`);
        lines.push(`UPDATE wp_terms t`);
        lines.push(`JOIN wp_term_taxonomy tt ON t.term_id = tt.term_id`);
        lines.push(`SET t.name = '${escapeSql(correct)}', t.slug = LOWER(REPLACE('${escapeSql(correct)}', ' ', '-'))`);
        lines.push(`WHERE tt.taxonomy = 'village' AND t.name = '${escapeSql(wrong)}';`);
        lines.push('');
    }

    // Group 2: Update Panchayats (taxonomy: panchayat)
    lines.push('-- =====================================================');
    lines.push('-- UPDATE PANCHAYATS');
    lines.push('-- =====================================================');

    for (const [wrong, correct] of Object.entries(tamilSpellingCorrections)) {
        if (!correct) continue;

        lines.push(`-- Fix: '${wrong}' -> '${correct}'`);
        lines.push(`UPDATE wp_terms t`);
        lines.push(`JOIN wp_term_taxonomy tt ON t.term_id = tt.term_id`);
        lines.push(`SET t.name = '${escapeSql(correct)}', t.slug = LOWER(REPLACE('${escapeSql(correct)}', ' ', '-'))`);
        lines.push(`WHERE tt.taxonomy = 'panchayat' AND t.name = '${escapeSql(wrong)}';`);
        lines.push('');
    }

    // Group 3: Update Project Titles
    lines.push('-- =====================================================');
    lines.push('-- UPDATE PROJECT TITLES');
    lines.push('-- =====================================================');

    for (const [wrong, correct] of Object.entries(tamilSpellingCorrections)) {
        if (!correct) continue;

        lines.push(`-- Fix in titles: '${wrong}' -> '${correct}'`);
        lines.push(`UPDATE wp_posts`);
        lines.push(`SET post_title = REPLACE(post_title, '${escapeSql(wrong)}', '${escapeSql(correct)}')`);
        lines.push(`WHERE post_type = 'project' AND post_title LIKE '%${escapeSql(wrong)}%';`);
        lines.push('');
    }

    // Summary and commit
    lines.push('-- =====================================================');
    lines.push('-- SUMMARY & COMMIT');
    lines.push('-- =====================================================');
    lines.push('');
    lines.push('-- To see changes before committing, run these queries:');
    lines.push('-- SELECT COUNT(*) FROM wp_terms t JOIN wp_term_taxonomy tt ON t.term_id = tt.term_id WHERE tt.taxonomy = "village";');
    lines.push('-- SELECT COUNT(*) FROM wp_terms t JOIN wp_term_taxonomy tt ON t.term_id = tt.term_id WHERE tt.taxonomy = "panchayat";');
    lines.push('-- SELECT COUNT(*) FROM wp_posts WHERE post_type = "project";');
    lines.push('');
    lines.push('-- If using transactions, uncomment to commit:');
    lines.push('-- COMMIT;');
    lines.push('');
    lines.push('-- If something went wrong, uncomment to rollback:');
    lines.push('-- ROLLBACK;');
    lines.push('');
    lines.push('SET SQL_SAFE_UPDATES = 1;');
    lines.push('');
    lines.push('-- Done! Remember to regenerate your projects.json on the live site after this.');

    return lines.join('\n');
}

// Generate and save the SQL file
const sqlContent = generateSql();
const outputPath = path.join(process.cwd(), 'apply-corrections-to-live.sql');

fs.writeFileSync(outputPath, sqlContent, 'utf8');

console.log('✅ SQL file generated successfully!');
console.log('📁 Location: ' + outputPath);
console.log('');
console.log('📋 Next steps:');
console.log('1. BACKUP your live database first!');
console.log('2. Review the SQL file: apply-corrections-to-live.sql');
console.log('3. Run it on your live database via phpMyAdmin or MySQL client');
console.log('4. Regenerate projects.json on your live site');
console.log('');
console.log(`Total corrections: ${Object.keys(tamilSpellingCorrections).length}`);
