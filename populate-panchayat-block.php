<?php
/**
 * Extract and populate Panchayat and Block taxonomy data
 *
 * This script:
 * 1. Creates "Panruti" block term
 * 2. Assigns all projects to Panruti block
 * 3. Extracts panchayat names from project descriptions
 * 4. Creates panchayat terms and assigns them to projects
 */

// Load WordPress
require_once(__DIR__ . '/wp-load.php');

echo "🚀 Starting Panchayat & Block Population Script...\n\n";

// Step 1: Create Panruti Block term
echo "📦 Step 1: Creating Block terms...\n";
$blocks = ['Panruti', 'NLC', 'Kurinjipadi'];
$block_ids = [];

foreach ($blocks as $block_name) {
    $term = term_exists($block_name, 'project_block');
    if (!$term) {
        $term = wp_insert_term($block_name, 'project_block');
        if (is_wp_error($term)) {
            echo "  ❌ Error creating block '$block_name': " . $term->get_error_message() . "\n";
        } else {
            $block_ids[$block_name] = $term['term_id'];
            echo "  ✅ Created block: $block_name (ID: {$term['term_id']})\n";
        }
    } else {
        $block_ids[$block_name] = $term['term_id'];
        echo "  ℹ️  Block '$block_name' already exists (ID: {$term['term_id']})\n";
    }
}

echo "\n📊 Step 2: Fetching all projects...\n";

// Get all projects
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
    'blocks_assigned' => 0,
    'panchayats_created' => [],
    'panchayat_mapping' => []
];

echo "🏛️  Step 3: Extracting and assigning Panchayats and Blocks...\n\n";

foreach ($projects as $index => $project) {
    $stats['total_processed']++;
    $progress = $index + 1;

    // Get project description (English version)
    $description = get_post_meta($project->ID, '_project_description_english', true);

    // Extract panchayat name from description
    // Pattern: "in [Panchayat Name] Panchayat" or "@ [Panchayat Name] Panchayat"
    $panchayat_name = null;

    // Try multiple patterns
    $patterns = [
        '/(?:in|@)\s+([A-Za-z\s\.]+?)\s+[Pp]anchayat/i',
        '/([A-Za-z\s\.]+?)\s+[Pp]anchayat/i',
    ];

    foreach ($patterns as $pattern) {
        if (preg_match($pattern, $description, $matches)) {
            $panchayat_name = trim($matches[1]);
            // Clean up common variations
            $panchayat_name = str_replace(['Pt.', 'pt.'], '', $panchayat_name);
            $panchayat_name = trim($panchayat_name);

            // Normalize capitalization
            $panchayat_name = ucwords(strtolower($panchayat_name));

            break;
        }
    }

    if ($panchayat_name) {
        $stats['panchayat_found']++;

        // Create or get panchayat term
        $panchayat_term = term_exists($panchayat_name, 'project_panchayat');
        if (!$panchayat_term) {
            $panchayat_term = wp_insert_term($panchayat_name, 'project_panchayat');
            if (!is_wp_error($panchayat_term)) {
                $stats['panchayats_created'][] = $panchayat_name;
                echo "  ✅ Created panchayat: $panchayat_name\n";
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

        if ($progress <= 5) {
            echo "  ⚠️  Could not extract panchayat from: " . substr($description, 0, 80) . "...\n";
        }
    }

    // Assign to Panruti block (all current projects are in Panruti block)
    wp_set_object_terms($project->ID, $block_ids['Panruti'], 'project_block');
    $stats['blocks_assigned']++;

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
echo "✅ Projects assigned to Panruti block: {$stats['blocks_assigned']}\n";
echo "✅ Panchayats successfully extracted: {$stats['panchayat_found']}\n";
echo "⚠️  Panchayats not found: {$stats['panchayat_not_found']}\n";
echo "✅ Unique panchayats created: " . count($stats['panchayats_created']) . "\n\n";

if (!empty($stats['panchayat_mapping'])) {
    echo "📋 Panchayat Distribution:\n";
    echo str_repeat("-", 60) . "\n";
    arsort($stats['panchayat_mapping']);
    foreach ($stats['panchayat_mapping'] as $panchayat => $count) {
        $bar = str_repeat("█", min(50, $count / 10));
        echo sprintf("  %-30s : %4d %s\n", $panchayat, $count, $bar);
    }
}

echo "\n✨ Script completed successfully!\n";
