<?php
/**
 * Clean up and consolidate Panchayat names
 *
 * This script extracts just the panchayat name (the word right before "panchayat")
 * and consolidates all variations into the main panchayat term
 */

// Load WordPress
require_once(__DIR__ . '/wp-load.php');

echo "🧹 Starting Panchayat Cleanup Script...\n\n";

// Step 1: Delete all existing panchayat terms
echo "📦 Step 1: Cleaning up existing panchayat terms...\n";
$existing_terms = get_terms(array(
    'taxonomy' => 'project_panchayat',
    'hide_empty' => false,
));

foreach ($existing_terms as $term) {
    wp_delete_term($term->term_id, 'project_panchayat');
}
echo "  ✅ Deleted " . count($existing_terms) . " existing panchayat terms\n\n";

// Step 2: Fetch all projects
echo "📊 Step 2: Fetching all projects...\n";
$args = array(
    'post_type'      => 'project',
    'posts_per_page' => -1,
    'post_status'    => 'publish',
);

$projects = get_posts($args);
$total = count($projects);
echo "  Found $total projects\n\n";

// Statistics
$stats = [
    'total_processed' => 0,
    'panchayat_found' => 0,
    'panchayat_not_found' => 0,
    'panchayat_mapping' => []
];

echo "🏛️  Step 3: Extracting panchayat names (improved logic)...\n\n";

foreach ($projects as $index => $project) {
    $stats['total_processed']++;
    $progress = $index + 1;

    // Get project description (English version)
    $description = get_post_meta($project->ID, '_project_description_english', true);

    // Extract panchayat name - get the word RIGHT BEFORE "panchayat"
    // Pattern: capture the last word before "panchayat" (case insensitive)
    $panchayat_name = null;

    // Match pattern like: "word Panchayat" or "word panchayat" or "word Pt."
    if (preg_match('/\b([A-Za-z]+)\s+(?:Panchayat|panchayat|Pt\.)/i', $description, $matches)) {
        $panchayat_name = trim($matches[1]);

        // Normalize capitalization - capitalize first letter of each word
        $panchayat_name = ucwords(strtolower($panchayat_name));

        // Handle common variations
        $panchayat_name = str_replace([
            'Kuppam',
            'Kuppom',
            'Kuppoam',
            'Pt',
            'Panruti',
        ], [
            'kuppam',
            'kuppam',
            'kuppam',
            '',
            '',
        ], $panchayat_name);

        $panchayat_name = trim($panchayat_name);

        // Only proceed if we have a valid name
        if (!empty($panchayat_name) && strlen($panchayat_name) > 2) {
            $stats['panchayat_found']++;

            // Create or get panchayat term
            $panchayat_term = term_exists($panchayat_name, 'project_panchayat');
            if (!$panchayat_term) {
                $panchayat_term = wp_insert_term($panchayat_name, 'project_panchayat');
                if (!is_wp_error($panchayat_term)) {
                    if ($progress <= 30) {
                        echo "  ✅ Created panchayat: $panchayat_name\n";
                    }
                }
            }

            if (!is_wp_error($panchayat_term)) {
                $panchayat_term_id = is_array($panchayat_term) ? $panchayat_term['term_id'] : $panchayat_term;

                // Assign panchayat to project
                wp_set_object_terms($project->ID, $panchayat_term_id, 'project_panchayat');

                // Track mapping
                if (!isset($stats['panchayat_mapping'][$panchayat_name])) {
                    $stats['panchayat_mapping'][$panchayat_name] = 0;
                }
                $stats['panchayat_mapping'][$panchayat_name]++;
            }
        } else {
            $stats['panchayat_not_found']++;
        }
    } else {
        $stats['panchayat_not_found']++;

        if ($progress <= 5) {
            echo "  ⚠️  Could not extract panchayat from: " . substr($description, 0, 80) . "...\n";
        }
    }

    // Show progress every 100 projects
    if ($progress % 100 == 0) {
        $percent = round(($progress / $total) * 100, 1);
        echo "  📈 Progress: $progress/$total ($percent%)\n";
    }
}

echo "\n\n" . str_repeat("=", 60) . "\n";
echo "📊 FINAL STATISTICS\n";
echo str_repeat("=", 60) . "\n\n";

echo "✅ Total projects processed: {$stats['total_processed']}\n";
echo "✅ Panchayats successfully extracted: {$stats['panchayat_found']}\n";
echo "⚠️  Panchayats not found: {$stats['panchayat_not_found']}\n";
echo "✅ Unique panchayats created: " . count($stats['panchayat_mapping']) . "\n\n";

if (!empty($stats['panchayat_mapping'])) {
    echo "📋 Panchayat Distribution (Top 30):\n";
    echo str_repeat("-", 60) . "\n";
    arsort($stats['panchayat_mapping']);
    $count = 0;
    foreach ($stats['panchayat_mapping'] as $panchayat => $project_count) {
        if ($count++ >= 30) break;
        $bar = str_repeat("█", min(50, $project_count / 2));
        echo sprintf("  %-35s : %4d %s\n", $panchayat, $project_count, $bar);
    }

    echo "\n  ... and " . (count($stats['panchayat_mapping']) - 30) . " more panchayats\n";
}

echo "\n✨ Script completed successfully!\n";
