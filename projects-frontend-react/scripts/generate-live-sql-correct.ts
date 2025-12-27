/**
 * Generate CORRECT SQL file to apply Tamil spelling corrections to live database
 *
 * This targets the CUSTOM META FIELDS where Tamil content is actually stored:
 * - Villages: wp_termmeta -> _village_name_tamil
 * - Panchayats: wp_termmeta -> panchayat_name_tamil
 * - Projects: wp_postmeta -> _project_title_tamil
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
    lines.push('-- TARGETS CUSTOM META FIELDS (where Tamil content is stored)');
    lines.push('-- Generated: ' + new Date().toISOString());
    lines.push('-- Total Corrections: ' + Object.keys(tamilSpellingCorrections).length);
    lines.push('-- =====================================================');
    lines.push('');
    lines.push('-- IMPORTANT: Backup your database before running this!');
    lines.push('');
    lines.push('SET SQL_SAFE_UPDATES = 0;');
    lines.push('');
    lines.push('-- =====================================================');
    lines.push('-- START TRANSACTION (recommended for safety)');
    lines.push('-- =====================================================');
    lines.push('START TRANSACTION;');
    lines.push('');

    // Group 1: Update Village Meta (_village_name_tamil)
    lines.push('-- =====================================================');
    lines.push('-- UPDATE VILLAGE TAMIL NAMES (wp_termmeta)');
    lines.push('-- meta_key: _village_name_tamil');
    lines.push('-- =====================================================');
    lines.push('');

    for (const [wrong, correct] of Object.entries(tamilSpellingCorrections)) {
        if (!correct) continue;

        lines.push(`-- Fix: '${wrong}' -> '${correct}'`);
        lines.push(`UPDATE wp_termmeta`);
        lines.push(`SET meta_value = '${escapeSql(correct)}'`);
        lines.push(`WHERE meta_key = '_village_name_tamil'`);
        lines.push(`  AND meta_value = '${escapeSql(wrong)}';`);
        lines.push('');

        // Also update the synced field 'name_tamil' if it exists
        lines.push(`UPDATE wp_termmeta`);
        lines.push(`SET meta_value = '${escapeSql(correct)}'`);
        lines.push(`WHERE meta_key = 'name_tamil'`);
        lines.push(`  AND meta_value = '${escapeSql(wrong)}';`);
        lines.push('');
    }

    // Group 2: Update Panchayat Meta (panchayat_name_tamil)
    lines.push('-- =====================================================');
    lines.push('-- UPDATE PANCHAYAT TAMIL NAMES (wp_termmeta)');
    lines.push('-- meta_key: panchayat_name_tamil');
    lines.push('-- =====================================================');
    lines.push('');

    for (const [wrong, correct] of Object.entries(tamilSpellingCorrections)) {
        if (!correct) continue;

        lines.push(`-- Fix: '${wrong}' -> '${correct}'`);
        lines.push(`UPDATE wp_termmeta`);
        lines.push(`SET meta_value = '${escapeSql(correct)}'`);
        lines.push(`WHERE meta_key = 'panchayat_name_tamil'`);
        lines.push(`  AND meta_value = '${escapeSql(wrong)}';`);
        lines.push('');
    }

    // Group 3: Update Project Title Meta (_project_title_tamil)
    lines.push('-- =====================================================');
    lines.push('-- UPDATE PROJECT TAMIL TITLES (wp_postmeta)');
    lines.push('-- meta_key: _project_title_tamil');
    lines.push('-- Uses REPLACE() to handle partial matches in titles');
    lines.push('-- =====================================================');
    lines.push('');

    for (const [wrong, correct] of Object.entries(tamilSpellingCorrections)) {
        if (!correct) continue;

        lines.push(`-- Fix in titles: '${wrong}' -> '${correct}'`);
        lines.push(`UPDATE wp_postmeta`);
        lines.push(`SET meta_value = REPLACE(meta_value, '${escapeSql(wrong)}', '${escapeSql(correct)}')`);
        lines.push(`WHERE meta_key = '_project_title_tamil'`);
        lines.push(`  AND meta_value LIKE '%${escapeSql(wrong)}%';`);
        lines.push('');
    }

    // Summary and commit
    lines.push('-- =====================================================');
    lines.push('-- VERIFICATION QUERIES');
    lines.push('-- Run these BEFORE committing to verify changes');
    lines.push('-- =====================================================');
    lines.push('');
    lines.push('-- Count village Tamil names:');
    lines.push('-- SELECT COUNT(*) FROM wp_termmeta WHERE meta_key = "_village_name_tamil";');
    lines.push('');
    lines.push('-- Count panchayat Tamil names:');
    lines.push('-- SELECT COUNT(*) FROM wp_termmeta WHERE meta_key = "panchayat_name_tamil";');
    lines.push('');
    lines.push('-- Count project Tamil titles:');
    lines.push('-- SELECT COUNT(*) FROM wp_postmeta WHERE meta_key = "_project_title_tamil";');
    lines.push('');
    lines.push('-- Sample villages with Tamil names:');
    lines.push('-- SELECT meta_value FROM wp_termmeta WHERE meta_key = "_village_name_tamil" LIMIT 10;');
    lines.push('');
    lines.push('-- =====================================================');
    lines.push('-- COMMIT OR ROLLBACK');
    lines.push('-- =====================================================');
    lines.push('');
    lines.push('-- If everything looks good, COMMIT:');
    lines.push('COMMIT;');
    lines.push('');
    lines.push('-- If something went wrong, ROLLBACK instead:');
    lines.push('-- ROLLBACK;');
    lines.push('');
    lines.push('SET SQL_SAFE_UPDATES = 1;');
    lines.push('');
    lines.push('-- =====================================================');
    lines.push('-- DONE!');
    lines.push('-- After committing, regenerate projects.json on live');
    lines.push('-- =====================================================');

    return lines.join('\n');
}

// Generate and save the SQL file
const sqlContent = generateSql();
const outputPath = path.join(process.cwd(), 'apply-corrections-to-live-CORRECT.sql');

fs.writeFileSync(outputPath, sqlContent, 'utf8');

console.log('✅ CORRECT SQL file generated!');
console.log('📁 Location: ' + outputPath);
console.log('');
console.log('🎯 This SQL targets the CUSTOM META FIELDS where Tamil content is stored:');
console.log('   - wp_termmeta: _village_name_tamil');
console.log('   - wp_termmeta: panchayat_name_tamil');
console.log('   - wp_postmeta: _project_title_tamil');
console.log('');
console.log('📋 Next steps:');
console.log('1. BACKUP your live database first!');
console.log('2. Review: apply-corrections-to-live-CORRECT.sql');
console.log('3. Run on live database via phpMyAdmin');
console.log('4. Check verification queries before COMMIT');
console.log('5. Regenerate projects.json on live');
console.log('');
console.log(`Total corrections: ${Object.keys(tamilSpellingCorrections).length}`);
