<?php
/**
 * Consolidate panchayat name variations into correct spellings
 */

require_once(__DIR__ . '/wp-load.php');

echo "🔧 Consolidating Panchayat Name Variations...\n\n";

// Define mapping of incorrect variations to correct names
$consolidations = [
    'Alagappasamuthiram' => ['Alagapasamuthiram', 'Alagappsamuthiram', 'Azhagappasamuthiram', 'Azhaagapasamuthiram'],
    'Kadampuliyur' => ['Kadamapuliyur', 'Kadampulityur', 'Kadambuliyur', 'Kadampuliyar'],
    'Veerasingankuppam' => ['Veerasingakuppam'],
    'Visoor' => ['Visoo', 'Viisoor', 'Vissor'],
    'Siruvathur' => ['Siruvadhur', 'Sirugramam'],
    'Thiruvamoor' => ['Thiruvamur'],
    'Perperiyankuppam' => ['Perpriyankuppam'],
    'Silambinathanpettai' => ['Silabinathanpettai', 'Sisambinathanpettai', 'Silambinathan Pettai', 'Silambinthan Pettai'],
    'Meliruppu' => ['Melirrupu'],
    'Melkankeyankuppam' => ['Melkangeyankuppam', 'Melkangayankuppam'],
    'Melmampattu' => ['Melmamapattu'],
    'Nadukuppam' => ['Nadumettukuppam'],
    'Panikkankuppam' => ['Pannikankuppam', 'Inpanikankuppam'],
    'Keelkankeyankuppam' => ['Keezhkangeyankuppam', 'Keelkangeyankuppam', 'Keelkangayankuppam', 'Keelkanyankuppam', 'Keezhkankeyankuppam'],
    'Keelmampattu' => ['Keelmamapattu', 'Keemampattu', 'Keezhmampattu', 'Kilmambattu'],
    'Karukkai' => ['Karukai'],
    'Kattukudalore' => ['Kattukudalaur', 'Katukudalur', 'Kattukudalur', 'Kattugudalore'],
    'Keelakuppam' => ['Keezhakuppam', 'Kezhakuppam', 'Keelakuppoam'],
    'Keeliruppu' => ['Keezhirupu'],
    'Elanthampattu' => ['Elanthapattu'],
    'Arasadikuppam' => ['Arasatikuppam'],
];

$stats = [
    'consolidated' => 0,
    'projects_updated' => 0,
    'terms_deleted' => 0,
];

foreach ($consolidations as $correctName => $variations) {
    echo "📋 Processing: $correctName\n";
    echo str_repeat("-", 60) . "\n";

    // Get or create the correct term
    $correctTerm = term_exists($correctName, 'project_panchayat');
    if (!$correctTerm) {
        $correctTerm = wp_insert_term($correctName, 'project_panchayat');
        if (is_wp_error($correctTerm)) {
            echo "  ❌ Error creating term '$correctName': " . $correctTerm->get_error_message() . "\n";
            continue;
        }
        echo "  ✅ Created correct term: $correctName\n";
    }
    $correctTermId = is_array($correctTerm) ? $correctTerm['term_id'] : $correctTerm;

    // Process each variation
    foreach ($variations as $variation) {
        $variationTerm = term_exists($variation, 'project_panchayat');

        if ($variationTerm) {
            $variationTermId = is_array($variationTerm) ? $variationTerm['term_id'] : $variationTerm;

            // Get all projects with this variation
            $projects = get_posts([
                'post_type' => 'project',
                'posts_per_page' => -1,
                'tax_query' => [
                    [
                        'taxonomy' => 'project_panchayat',
                        'field' => 'term_id',
                        'terms' => $variationTermId,
                    ],
                ],
            ]);

            if (!empty($projects)) {
                echo "  🔄 Moving {$variation} ({$variationTermId}) → $correctName: " . count($projects) . " projects\n";

                foreach ($projects as $project) {
                    wp_set_object_terms($project->ID, (int)$correctTermId, 'project_panchayat', false);
                    $stats['projects_updated']++;
                }
            }

            // Delete the variation term
            $deleted = wp_delete_term($variationTermId, 'project_panchayat');
            if (!is_wp_error($deleted)) {
                $stats['terms_deleted']++;
            }

            $stats['consolidated']++;
        }
    }

    echo "\n";
}

// Handle other common misspellings that are single instances
echo "📋 Cleaning up other variations...\n";
echo str_repeat("-", 60) . "\n";

// Delete problematic terms
$problematicTerms = ['Pettai', 'Kuppam', 'Village', 'Near', 'Pts', 'Bathirakottai'];
foreach ($problematicTerms as $termName) {
    $term = get_term_by('name', $termName, 'project_panchayat');
    if ($term) {
        wp_delete_term($term->term_id, 'project_panchayat');
        echo "  🗑️  Deleted: $termName\n";
        $stats['terms_deleted']++;
    }
}

echo "\n" . str_repeat("=", 60) . "\n";
echo "📊 CONSOLIDATION COMPLETE\n";
echo str_repeat("=", 60) . "\n\n";

echo "✅ Variations consolidated: {$stats['consolidated']}\n";
echo "✅ Projects updated: {$stats['projects_updated']}\n";
echo "✅ Terms deleted: {$stats['terms_deleted']}\n";

// Show updated panchayat list
$terms = get_terms([
    'taxonomy' => 'project_panchayat',
    'hide_empty' => false,
    'orderby' => 'count',
    'order' => 'DESC',
]);

echo "\n📋 Updated Panchayat List (Top 20):\n";
echo str_repeat("-", 60) . "\n";
$count = 0;
foreach ($terms as $term) {
    if ($count++ >= 20) break;
    echo sprintf("  %-30s : %4d projects\n", $term->name, $term->count);
}

echo "\n✨ Done! Total panchayats: " . count($terms) . "\n";
