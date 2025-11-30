<?php
/**
 * Export Taxonomy Backup Script
 * Run this ONCE before cleanup to create a backup
 *
 * Usage: php export-taxonomy-backup.php
 */

// Load WordPress
$wp_load_path = '/Applications/MAMP/htdocs/sabarajendran/wp-load.php';
if (file_exists($wp_load_path)) {
    require_once($wp_load_path);
} else {
    die("Could not find wp-load.php at: " . $wp_load_path . "\n");
}

if (!defined('ABSPATH')) {
    die('WordPress not loaded');
}

$backup_data = array(
    'export_date' => current_time('mysql'),
    'taxonomies' => array()
);

$taxonomies = array('project_category', 'project_village', 'project_year', 'project_status');

foreach ($taxonomies as $taxonomy) {
    $terms = get_terms(array(
        'taxonomy' => $taxonomy,
        'hide_empty' => false,
        'orderby' => 'name',
        'order' => 'ASC'
    ));

    if (!is_wp_error($terms)) {
        $backup_data['taxonomies'][$taxonomy] = array();

        foreach ($terms as $term) {
            // Get all projects for this term
            $projects = get_posts(array(
                'post_type' => 'project',
                'posts_per_page' => -1,
                'tax_query' => array(
                    array(
                        'taxonomy' => $taxonomy,
                        'field' => 'term_id',
                        'terms' => $term->term_id
                    )
                ),
                'fields' => 'ids'
            ));

            $backup_data['taxonomies'][$taxonomy][] = array(
                'term_id' => $term->term_id,
                'name' => $term->name,
                'slug' => $term->slug,
                'count' => $term->count,
                'project_ids' => $projects
            );
        }
    }
}

// Create backup filename with timestamp
$filename = 'taxonomy-backup-' . date('Y-m-d-His') . '.json';
$filepath = __DIR__ . '/' . $filename;

// Save backup
file_put_contents($filepath, json_encode($backup_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo "✅ Backup created successfully!\n";
echo "📁 File: " . $filepath . "\n";
echo "📊 Summary:\n";
foreach ($backup_data['taxonomies'] as $tax_name => $terms) {
    echo "   - {$tax_name}: " . count($terms) . " terms\n";
}
echo "\n";
