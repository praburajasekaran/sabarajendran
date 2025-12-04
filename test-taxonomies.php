<?php
/**
 * Test if taxonomies are properly registered and exposed in REST API
 */

// Load WordPress
require_once(__DIR__ . '/wp-load.php');

echo "🔍 Testing Taxonomy Registration...\n\n";

// Check if taxonomies exist
$taxonomies = ['project_block', 'project_panchayat', 'project_village'];

foreach ($taxonomies as $taxonomy) {
    echo "Testing: $taxonomy\n";
    echo str_repeat("-", 50) . "\n";

    if (taxonomy_exists($taxonomy)) {
        echo "  ✅ Taxonomy exists\n";

        $tax_object = get_taxonomy($taxonomy);
        echo "  📝 Show in REST: " . ($tax_object->show_in_rest ? 'Yes' : 'No') . "\n";
        echo "  📝 REST base: " . ($tax_object->rest_base ?: $taxonomy) . "\n";

        // Get term count
        $terms = get_terms(array(
            'taxonomy' => $taxonomy,
            'hide_empty' => false,
        ));

        if (!is_wp_error($terms)) {
            echo "  📊 Total terms: " . count($terms) . "\n";
            if (count($terms) > 0 && count($terms) <= 10) {
                echo "  📋 Terms:\n";
                foreach ($terms as $term) {
                    echo "      - {$term->name} ({$term->count} projects)\n";
                }
            } elseif (count($terms) > 10) {
                echo "  📋 First 5 terms:\n";
                for ($i = 0; $i < 5; $i++) {
                    echo "      - {$terms[$i]->name} ({$terms[$i]->count} projects)\n";
                }
            }
        }
    } else {
        echo "  ❌ Taxonomy does NOT exist\n";
    }

    echo "\n";
}

// Test fetching a project with the new taxonomies
echo "📦 Testing Project with Taxonomies:\n";
echo str_repeat("-", 50) . "\n";

$project = get_posts(array(
    'post_type' => 'project',
    'posts_per_page' => 1,
    'tax_query' => array(
        array(
            'taxonomy' => 'project_block',
            'field' => 'slug',
            'terms' => 'panruti',
        ),
    ),
))[0] ?? null;

if ($project) {
    echo "  ✅ Found project: {$project->post_title}\n";

    $block = wp_get_post_terms($project->ID, 'project_block');
    $panchayat = wp_get_post_terms($project->ID, 'project_panchayat');
    $village = wp_get_post_terms($project->ID, 'project_village');

    echo "  🏛️  Block: " . ($block && !is_wp_error($block) && !empty($block) ? $block[0]->name : 'None') . "\n";
    echo "  🏛️  Panchayat: " . ($panchayat && !is_wp_error($panchayat) && !empty($panchayat) ? $panchayat[0]->name : 'None') . "\n";
    echo "  🏘️  Village: " . ($village && !is_wp_error($village) && !empty($village) ? $village[0]->name : 'None') . "\n";
}

echo "\n✨ Test completed!\n";
