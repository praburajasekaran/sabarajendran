<?php
/**
 * Check what blocks exist and their projects
 */

require_once('wp-load.php');

// Get all blocks
$blocks = get_terms(array(
    'taxonomy' => 'block',
    'hide_empty' => false
));

echo "Available blocks:\n";
echo str_repeat("=", 80) . "\n";
foreach ($blocks as $block) {
    echo sprintf("Name: %s | Slug: %s | Count: %d\n", $block->name, $block->slug, $block->count);
}

echo "\n" . str_repeat("=", 80) . "\n\n";

// Get all projects with their blocks
$args = array(
    'post_type' => 'project',
    'posts_per_page' => 10
);

$projects = get_posts($args);
echo "Sample projects:\n";
echo str_repeat("=", 80) . "\n";

foreach ($projects as $project) {
    $blocks = wp_get_post_terms($project->ID, 'block');
    $block_names = array_map(function ($b) {
        return $b->name; }, $blocks);
    $location = get_post_meta($project->ID, 'location', true);
    $location_en = get_post_meta($project->ID, 'location_en', true);

    echo sprintf(
        "ID: %d\nTitle: %s\nBlocks: %s\nLocation (Tamil): %s\nLocation (English): %s\n%s\n\n",
        $project->ID,
        $project->post_title,
        implode(', ', $block_names),
        $location ?: '(empty)',
        $location_en ?: '(empty)',
        str_repeat("-", 80)
    );
}
