<?php
/**
 * Export location names from Kurinjipadi block projects
 * This script extracts location names that need translation from Tamil to English
 */

require_once('wp-load.php');

// Get all Kurinjipadi projects
$args = array(
    'post_type' => 'project',
    'posts_per_page' => -1,
    'tax_query' => array(
        array(
            'taxonomy' => 'block',
            'field' => 'slug',
            'terms' => 'kurinjipadi'
        )
    )
);

$projects = get_posts($args);
$locations = array();
$location_counts = array();

echo "Found " . count($projects) . " Kurinjipadi projects\n\n";

foreach ($projects as $project) {
    // Get location from post meta
    $location = get_post_meta($project->ID, 'location', true);
    $location_en = get_post_meta($project->ID, 'location_en', true);

    if (!empty($location)) {
        // Track unique locations
        if (!isset($location_counts[$location])) {
            $location_counts[$location] = array(
                'tamil' => $location,
                'english' => $location_en,
                'count' => 0,
                'sample_project_id' => $project->ID,
                'sample_project_title' => $project->post_title
            );
        }
        $location_counts[$location]['count']++;
    }
}

// Sort by count (most common first)
uasort($location_counts, function ($a, $b) {
    return $b['count'] - $a['count'];
});

echo "Unique locations found: " . count($location_counts) . "\n\n";
echo "Location Analysis:\n";
echo str_repeat("=", 80) . "\n";

foreach ($location_counts as $loc_data) {
    $needs_translation = empty($loc_data['english']) || $loc_data['english'] === $loc_data['tamil'];
    $status = $needs_translation ? "[NEEDS TRANSLATION]" : "[HAS TRANSLATION]";

    echo sprintf(
        "%s Count: %d\nTamil: %s\nEnglish: %s\nSample Project: %s (ID: %d)\n%s\n\n",
        $status,
        $loc_data['count'],
        $loc_data['tamil'],
        $loc_data['english'] ?: '(empty)',
        $loc_data['sample_project_title'],
        $loc_data['sample_project_id'],
        str_repeat("-", 80)
    );
}

// Export locations that need translation to JSON
$to_translate = array();
foreach ($location_counts as $loc_data) {
    if (empty($loc_data['english']) || $loc_data['english'] === $loc_data['tamil']) {
        $to_translate[] = array(
            'tamil' => $loc_data['tamil'],
            'count' => $loc_data['count']
        );
    }
}

$json_output = json_encode($to_translate, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
file_put_contents('locations_to_translate.json', $json_output);

echo "\n" . str_repeat("=", 80) . "\n";
echo "Summary:\n";
echo "Total unique locations: " . count($location_counts) . "\n";
echo "Locations needing translation: " . count($to_translate) . "\n";
echo "Exported to: locations_to_translate.json\n";
