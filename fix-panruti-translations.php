<?php
/**
 * Fix incorrect Tamil translations for Panruti projects
 *
 * This script re-translates the 39 affected Panruti projects that have
 * the wrong Tamil title: "நெய்வேலி அரசு தொழில்துறை பயிற்சி நிறுவனம்..."
 */

// Load WordPress
require_once(__DIR__ . '/wp-load.php');

// Check if we're running from CLI
if (php_sapi_name() !== 'cli') {
    die("This script must be run from the command line.\n");
}

echo "=== Fixing Panruti Project Tamil Translations ===\n\n";

// The incorrect Tamil text that was applied to all projects
$incorrect_tamil_text = 'நெய்வேலி அரசு தொழில்துறை பயிற்சி நிறுவனம் முன்பினைவுக் கட்டமைப்புகள் பணிமனைக் கட்டிடம் கட்டும் பணி';

// Get all projects with this incorrect translation in Panruti block
$args = array(
    'post_type' => 'project',
    'posts_per_page' => -1,
    'post_status' => 'publish',
    'tax_query' => array(
        array(
            'taxonomy' => 'project_block',
            'field' => 'name',
            'terms' => 'Panruti',
        ),
    ),
    'meta_query' => array(
        array(
            'key' => '_project_title_tamil',
            'value' => $incorrect_tamil_text,
            'compare' => '=',
        ),
    ),
);

$query = new WP_Query($args);
$affected_projects = $query->posts;
wp_reset_postdata();

echo "Found " . count($affected_projects) . " projects with incorrect Tamil translations.\n\n";

if (count($affected_projects) === 0) {
    echo "No projects found with the incorrect translation. They may have already been fixed.\n";
    exit(0);
}

// Ask for confirmation
echo "This will re-translate the following projects:\n";
foreach (array_slice($affected_projects, 0, 10) as $project) {
    echo "  - ID: {$project->ID} | {$project->post_title}\n";
}
if (count($affected_projects) > 10) {
    echo "  ... and " . (count($affected_projects) - 10) . " more\n";
}
echo "\n";

echo "Do you want to proceed? This will:\n";
echo "1. Clear the incorrect Tamil translations\n";
echo "2. Set them to empty so they can be re-translated\n";
echo "\nType 'yes' to continue or anything else to cancel: ";

$handle = fopen("php://stdin", "r");
$line = trim(fgets($handle));
fclose($handle);

if (strtolower($line) !== 'yes') {
    echo "\nOperation cancelled.\n";
    exit(0);
}

echo "\n=== Starting Fix ===\n\n";

// Clear the incorrect translations
$fixed_count = 0;
foreach ($affected_projects as $project) {
    // Clear the Tamil title and description to force re-translation
    update_post_meta($project->ID, '_project_title_tamil', '');
    update_post_meta($project->ID, '_project_description_tamil', '');

    $fixed_count++;
    echo "Cleared translations for project #{$project->ID}: {$project->post_title}\n";
}

echo "\n=== Fix Complete ===\n";
echo "Cleared {$fixed_count} project translations.\n\n";
echo "Next steps:\n";
echo "1. Go to WordPress Admin > Projects > Translate Projects\n";
echo "2. Click 'Translate All' to re-translate these projects with correct Tamil text\n";
echo "3. Or you can translate them one by one from the project edit page\n\n";
echo "After translation is complete, regenerate the static projects.json file:\n";
echo "  php generate-static-projects.php\n\n";
