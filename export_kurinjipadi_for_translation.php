<?php
/**
 * Export Kurinjipadi Projects for Translation
 * 
 * Exports ID, Title, and Description of all projects in 'Kurinjipadi' block
 * to a JSON file.
 */

require_once __DIR__ . '/wp-load.php';

// Fetch projects
$args = [
    'post_type' => 'project',
    'posts_per_page' => -1,
    'tax_query' => [
        [
            'taxonomy' => 'project_block',
            'field' => 'slug',
            'terms' => 'kurinjipadi',
        ],
    ],
];

$projects = get_posts($args);
$export_data = [];

foreach ($projects as $project) {
    // We want to translate the current Title and Description (which are in Tamil)
    // to English.
    // Note: We should check if they are already English? 
    // The user said "Right now, both English and Tamil show only the Tamil cards".
    // So we assume post_title is Tamil.

    $export_data[] = [
        'id' => $project->ID,
        'title' => $project->post_title,
        'description' => $project->post_content, // Might be empty if we cleared it
    ];
}

$output_file = __DIR__ . '/kurinjipadi_to_translate.json';
file_put_contents($output_file, json_encode($export_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo "Exported " . count($export_data) . " projects to $output_file\n";
