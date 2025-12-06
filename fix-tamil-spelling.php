<?php
/**
 * Fix Tamil Spelling Mistake
 * 
 * Replaces 'பானருட்டி' with 'பண்ருட்டி' in project titles and descriptions.
 * 
 * USAGE:
 * 1. Upload this file to the root directory of your WordPress installation (same folder as wp-config.php).
 * 2. Access it via browser: https://your-site.com/fix-tamil-spelling.php
 *    OR run via command line: php fix-tamil-spelling.php
 * 3. Delete this file after use.
 */

// Load WordPress
require_once('wp-load.php');

// Check if user has permission if accessed via browser
if (php_sapi_name() !== 'cli') {
    if (!current_user_can('manage_options')) {
        wp_die('You do not have sufficient permissions to access this page.');
    }
    echo "<pre>"; // Format output for browser
}

echo "Starting Tamil spelling correction...\n";
echo "Searching for 'பானருட்டி' and replacing with 'பண்ருட்டி'...\n\n";

$args = array(
    'post_type' => 'project',
    'posts_per_page' => -1,
    'post_status' => 'any',
);

$query = new WP_Query($args);
$projects = $query->posts;

$updated_count = 0;
$checked_count = 0;

foreach ($projects as $project) {
    $checked_count++;
    $project_id = $project->ID;
    $needs_update = false;

    // Check Title
    $title_tamil = get_post_meta($project_id, '_project_title_tamil', true);
    if ($title_tamil && strpos($title_tamil, 'பானருட்டி') !== false) {
        $new_title = str_replace('பானருட்டி', 'பண்ருட்டி', $title_tamil);
        update_post_meta($project_id, '_project_title_tamil', $new_title);
        echo "[Project #{$project_id}] Updated Title: {$title_tamil} -> {$new_title}\n";
        $needs_update = true;
    }

    // Check Description
    $description_tamil = get_post_meta($project_id, '_project_description_tamil', true);
    if ($description_tamil && strpos($description_tamil, 'பானருட்டி') !== false) {
        $new_description = str_replace('பானருட்டி', 'பண்ருட்டி', $description_tamil);
        update_post_meta($project_id, '_project_description_tamil', $new_description);
        echo "[Project #{$project_id}] Updated Description.\n";
        $needs_update = true;
    }

    if ($needs_update) {
        $updated_count++;
    }
}

echo "\n----------------------------------------\n";
echo "Process Complete.\n";
echo "Checked: {$checked_count} projects\n";
echo "Updated: {$updated_count} projects\n";

if (php_sapi_name() !== 'cli') {
    echo "</pre>";
}
