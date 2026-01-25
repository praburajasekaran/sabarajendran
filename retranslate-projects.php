<?php
/**
 * Re-translate projects that have empty Tamil translations
 *
 * This script uses the WordPress translation service to re-translate projects
 */

// Load WordPress
require_once(__DIR__ . '/wp-load.php');

// Check if we're running from CLI
if (php_sapi_name() !== 'cli') {
    die("This script must be run from the command line.\n");
}

echo "=== Re-translating Projects ===\n\n";

// Load the translation service
require_once(SABA_PROJECTS_DIR . 'includes/class-translation-service.php');
$translation_service = new Saba_Translation_Service();

// Get projects needing translation (empty Tamil fields)
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
        'relation' => 'OR',
        array(
            'key' => '_project_title_tamil',
            'compare' => 'NOT EXISTS',
        ),
        array(
            'key' => '_project_title_tamil',
            'value' => '',
            'compare' => '=',
        ),
    ),
);

$query = new WP_Query($args);
$projects_to_translate = $query->posts;
wp_reset_postdata();

echo "Found " . count($projects_to_translate) . " projects needing re-translation.\n\n";

if (count($projects_to_translate) === 0) {
    echo "No projects found needing translation.\n";
    exit(0);
}

// Check if API key is configured
$api_key = get_option('saba_projects_openrouter_key', '');
if (empty($api_key)) {
    echo "ERROR: OpenRouter API key is not configured.\n";
    echo "Please configure it in WordPress Admin > Projects > Settings\n";
    exit(1);
}

echo "Starting translation...\n\n";

$success_count = 0;
$error_count = 0;

foreach ($projects_to_translate as $index => $project) {
    $num = $index + 1;
    $total = count($projects_to_translate);

    echo "[$num/$total] Translating project #{$project->ID}: " . substr($project->post_title, 0, 60) . "...\n";

    // Translate the project
    $result = $translation_service->translate_project($project->ID);

    if ($result['success']) {
        $success_count++;
        echo "  ✓ Success\n";
    } else {
        $error_count++;
        echo "  ✗ Error: " . $result['message'] . "\n";
    }

    // Sleep to avoid rate limits (2 seconds between requests)
    if ($num < $total) {
        echo "  Waiting 2 seconds...\n";
        sleep(2);
    }

    echo "\n";
}

echo "\n=== Translation Complete ===\n";
echo "Successfully translated: $success_count\n";
echo "Failed: $error_count\n\n";

if ($success_count > 0) {
    echo "Next step: Regenerate the static projects.json file\n";
    echo "Run: /Applications/MAMP/bin/php/php8.1.31/bin/php generate-static-projects.php\n";
}
