<?php
/**
 * Export Projects for Spellcheck
 * 
 * Exports project data to JSON for processing by AI spellcheck script.
 * Usage: php export_projects_for_spellcheck.php
 */

require_once('wp-load.php');

$output_file = 'projects_to_spellcheck.json';

// Fetch all published projects
$args = array(
    'post_type' => 'project',
    'posts_per_page' => -1,
    'post_status' => 'publish',
);

echo "Fetching projects...\n";
$query = new WP_Query($args);
$projects = $query->posts;

$export_data = array();

foreach ($projects as $project) {
    $id = $project->ID;

    // Get English fields
    $title_en = $project->post_title;
    $content_en = $project->post_content;

    // Get Tamil fields (meta)
    $title_ta = get_post_meta($id, '_project_title_tamil', true);
    $content_ta = get_post_meta($id, '_project_description_tamil', true);

    // Add to export list
    $export_data[] = array(
        'id' => $id,
        'title_en' => $title_en,
        'content_en' => $content_en,
        'title_ta' => $title_ta,
        'content_ta' => $content_ta
    );
}

// Save to JSON
$json_data = json_encode($export_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
if (file_put_contents($output_file, $json_data)) {
    echo "Successfully exported " . count($export_data) . " projects to $output_file\n";
} else {
    echo "Error saving to $output_file\n";
    exit(1);
}
?>