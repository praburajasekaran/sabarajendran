<?php
/**
 * Sync Tamil Spelling Corrections to Database (Production Version)
 * 
 * Usage: php sync-spellings-prod.php
 * 
 * This script applies all Tamil spelling corrections from tamil-spelling-corrections.ts
 * to the WordPress database (villages, panchayats, and project titles).
 */

// Load WordPress
require_once(__DIR__ . '/wp-load.php');

// Function to get corrections from the TypeScript file
function getTamilSpellingCorrections($filePath)
{
    $content = file_get_contents($filePath);
    // Extract the object content
    preg_match('/export const tamilSpellingCorrections[^{]*({[^}]+});/s', $content, $matches);
    if (!isset($matches[1])) {
        die("Error: Could not parse corrections file\n");
    }

    $objStr = $matches[1];
    // Convert TypeScript object to PHP array
    $objStr = preg_replace('/[\'"]([^\'"]+)[\'"]\s*:\s*[\'"]([^\'"]+)[\'"],?/u', '"$1" => "$2",', $objStr);
    $objStr = rtrim($objStr, ',');

    eval ('$corrections = ' . $objStr . ';');
    return $corrections;
}

// Load corrections
$correctionsFile = __DIR__ . '/tamil-spelling-corrections.ts';
if (!file_exists($correctionsFile)) {
    die("Error: tamil-spelling-corrections.ts not found\n");
}

$corrections = getTamilSpellingCorrections($correctionsFile);
echo "Loaded " . count($corrections) . " corrections from tamil-spelling-corrections.ts\n";

// Debug: Check if specific correction exists
if (isset($corrections['நடுகுப்பம்'])) {
    echo "Debug: Has நடுகுப்பம்? YES\n";
}

echo "---------------------------------------------------\n";

global $wpdb;
$villageUpdates = 0;
$panchayatUpdates = 0;
$titleUpdates = 0;

// Multi-pass replacement (up to 5 passes for chained corrections)
$maxPasses = 5;

// 1. Update Village Names (taxonomy term meta)
echo "Checking Villages...\n";
$villages = get_terms(array(
    'taxonomy' => 'project_village',
    'hide_empty' => false,
));

foreach ($villages as $village) {
    $tamilName = get_term_meta($village->term_id, '_village_name_tamil', true);
    if (empty($tamilName))
        continue;

    $originalName = $tamilName;
    for ($pass = 0; $pass < $maxPasses; $pass++) {
        $replaced = false;
        foreach ($corrections as $wrong => $correct) {
            if (strpos($tamilName, $wrong) !== false) {
                $tamilName = str_replace($wrong, $correct, $tamilName);
                $replaced = true;
            }
        }
        if (!$replaced)
            break;
    }

    if ($tamilName !== $originalName) {
        update_term_meta($village->term_id, '_village_name_tamil', $tamilName);
        echo "  [V] {$village->name}: {$originalName} -> {$tamilName}\n";
        $villageUpdates++;
    }
}

// 2. Update Panchayat Names (taxonomy term meta)
echo "Checking Panchayats...\n";
$panchayats = get_terms(array(
    'taxonomy' => 'project_panchayat',
    'hide_empty' => false,
));

foreach ($panchayats as $panchayat) {
    $tamilName = get_term_meta($panchayat->term_id, 'panchayat_name_tamil', true);
    if (empty($tamilName))
        continue;

    $originalName = $tamilName;
    for ($pass = 0; $pass < $maxPasses; $pass++) {
        $replaced = false;
        foreach ($corrections as $wrong => $correct) {
            if (strpos($tamilName, $wrong) !== false) {
                $tamilName = str_replace($wrong, $correct, $tamilName);
                $replaced = true;
            }
        }
        if (!$replaced)
            break;
    }

    if ($tamilName !== $originalName) {
        update_term_meta($panchayat->term_id, 'panchayat_name_tamil', $tamilName);
        echo "  [P] {$panchayat->name}: {$originalName} -> {$tamilName}\n";
        $panchayatUpdates++;
    }
}

// 3. Update Project Titles (post meta)
echo "Checking Project Titles...\n";
$projects = get_posts(array(
    'post_type' => 'project',
    'posts_per_page' => -1,
    'post_status' => 'any',
));

foreach ($projects as $project) {
    $tamilTitle = get_post_meta($project->ID, '_project_title_tamil', true);
    if (empty($tamilTitle))
        continue;

    $originalTitle = $tamilTitle;
    for ($pass = 0; $pass < $maxPasses; $pass++) {
        $replaced = false;
        foreach ($corrections as $wrong => $correct) {
            if (strpos($tamilTitle, $wrong) !== false) {
                $tamilTitle = str_replace($wrong, $correct, $tamilTitle);
                $replaced = true;
            }
        }
        if (!$replaced)
            break;
    }

    if ($tamilTitle !== $originalTitle) {
        update_post_meta($project->ID, '_project_title_tamil', $tamilTitle);
        echo "  [T] #{$project->ID}: Corrected spelling in title\n";
        $titleUpdates++;
    }
}

echo "---------------------------------------------------\n";
echo "DONE! Updated: Villages: {$villageUpdates}, Panchayats: {$panchayatUpdates}, Titles: {$titleUpdates}\n";
