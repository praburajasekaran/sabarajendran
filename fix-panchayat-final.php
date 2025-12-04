<?php
/**
 * Final fix for Panchayat names - ensure clean extraction
 */

// Load WordPress
require_once(__DIR__ . '/wp-load.php');

echo "🔧 Final Panchayat Fix Script...\n\n";

// Step 1: Delete ALL panchayat terms
echo "📦 Step 1: Cleaning all panchayat terms...\n";
$existing_terms = get_terms(array(
    'taxonomy' => 'project_panchayat',
    'hide_empty' => false,
));

foreach ($existing_terms as $term) {
    wp_delete_term($term->term_id, 'project_panchayat');
}
echo "  ✅ Deleted " . count($existing_terms) . " terms\n\n";

// Step 2: Fetch all projects
echo "📊 Step 2: Processing all 826 projects...\n\n";
$args = array(
    'post_type'      => 'project',
    'posts_per_page' => -1,
    'post_status'    => 'publish',
);

$projects = get_posts($args);
$panchayat_cache = []; // Cache to avoid duplicate term creation
$stats = [
    'found' => 0,
    'not_found' => 0,
    'mapping' => []
];

foreach ($projects as $index => $project) {
    $progress = $index + 1;

    // Get description
    $description = get_post_meta($project->ID, '_project_description_english', true);

    // Extract the word RIGHT BEFORE "panchayat" or "Panchayat"
    $panchayat_name = null;

    if (preg_match('/\b([A-Za-z]{3,})\s+(?:Panchayat|panchayat|Pt\b)/i', $description, $matches)) {
        $panchayat_name = ucfirst(strtolower(trim($matches[1])));

        // Skip if it's just noise words
        $skip_words = ['The', 'And', 'Near', 'Road', 'Street', 'Block', 'Main', 'New'];
        if (in_array($panchayat_name, $skip_words)) {
            $panchayat_name = null;
        }
    }

    if ($panchayat_name && strlen($panchayat_name) >= 3) {
        $stats['found']++;

        // Use cache to get or create term
        if (!isset($panchayat_cache[$panchayat_name])) {
            $term = term_exists($panchayat_name, 'project_panchayat');

            if (!$term) {
                $term = wp_insert_term($panchayat_name, 'project_panchayat');
                if (!is_wp_error($term)) {
                    $panchayat_cache[$panchayat_name] = $term['term_id'];
                    echo "  ✅ Created: $panchayat_name\n";
                } else {
                    echo "  ❌ Error creating $panchayat_name: " . $term->get_error_message() . "\n";
                    continue;
                }
            } else {
                $panchayat_cache[$panchayat_name] = $term['term_id'];
            }
        }

        // Assign term to project
        $term_id = $panchayat_cache[$panchayat_name];
        wp_set_object_terms($project->ID, (int)$term_id, 'project_panchayat', false);

        // Track
        if (!isset($stats['mapping'][$panchayat_name])) {
            $stats['mapping'][$panchayat_name] = 0;
        }
        $stats['mapping'][$panchayat_name]++;

    } else {
        $stats['not_found']++;
    }

    if ($progress % 100 == 0) {
        echo "  📈 Progress: $progress/826 (" . round(($progress/826)*100, 1) . "%)\n";
    }
}

echo "\n\n" . str_repeat("=", 60) . "\n";
echo "📊 FINAL RESULTS\n";
echo str_repeat("=", 60) . "\n\n";

echo "✅ Panchayats extracted: {$stats['found']}\n";
echo "⚠️  Not found: {$stats['not_found']}\n";
echo "✅ Unique panchayats: " . count($stats['mapping']) . "\n\n";

if (!empty($stats['mapping'])) {
    echo "📋 Top 25 Panchayats:\n";
    echo str_repeat("-", 60) . "\n";
    arsort($stats['mapping']);
    $count = 0;
    foreach ($stats['mapping'] as $name => $project_count) {
        if ($count++ >= 25) break;
        $bar = str_repeat("█", min(40, $project_count / 2));
        echo sprintf("  %-30s : %4d %s\n", $name, $project_count, $bar);
    }
}

echo "\n✨ Complete!\n";
