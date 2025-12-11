<?php
/**
 * Debug Import - Test Full Import Flow for One Project
 */

ini_set('display_errors', 1);
error_reporting(E_ALL);
ini_set('memory_limit', '512M');
set_time_limit(120);

require_once __DIR__ . '/wp-load.php';

$LIVE_SITE = 'https://tan-emu-358425.hostingersite.com';
$KURINJIPADI_BLOCK_ID = 266;

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n";
echo "Testing Full Import of Single Project\\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n\\n";

// Fetch one project
echo "1. Fetching project from API...\\n";
$url = "{$LIVE_SITE}/wp-json/wp/v2/project?per_page=1&project_block={$KURINJIPADI_BLOCK_ID}";
$response = wp_remote_get($url, ['timeout' => 60]);

if (is_wp_error($response)) {
    die("Error: " . $response->get_error_message() . "\\n");
}

$projects = json_decode(wp_remote_retrieve_body($response), true);
$project = $projects[0];
$title = $project['title']['rendered'] ?? '';
$content = $project['content']['rendered'] ?? '';

echo "   Project: {$title}\\n";
echo "   Content length: " . strlen($content) . " chars\\n\\n";

// Check for duplicates
echo "2. Checking for duplicates...\\n";
$existing = get_posts([
    'post_type' => 'project',
    'title' => $title,
    'posts_per_page' => 1,
    'post_status' => 'any'
]);

if (!empty($existing)) {
    echo "   ✓ Project already exists (ID: {$existing[0]->ID})\\n";
    echo "   Skipping import\\n\\n";
    exit(0);
}
echo "   No duplicates found\\n\\n";

// Create post
echo "3. Creating WordPress post...\\n";
$post_id = wp_insert_post([
    'post_type' => 'project',
    'post_title' => $title,
    'post_content' => $content,
    'post_status' => 'publish',
    'post_author' => 1
]);

if (is_wp_error($post_id)) {
    die("   ERROR: " . $post_id->get_error_message() . "\\n");
}
echo "   ✓ Created post ID: {$post_id}\\n\\n";

// Set custom fields
echo "4. Setting custom fields...\\n";
$fields_set = 0;
if (!empty($project['_project_budget'])) {
    update_post_meta($post_id, '_project_budget', $project['_project_budget']);
    echo "   ✓ Budget: {$project['_project_budget']}\\n";
    $fields_set++;
}
if (!empty($project['_project_title_tamil'])) {
    update_post_meta($post_id, '_project_title_tamil', $project['_project_title_tamil']);
    echo "   ✓ Tamil title set\\n";
    $fields_set++;
}
echo "   Total fields set: {$fields_set}\\n\\n";

// Assign taxonomies
echo "5. Assigning taxonomies...\\n";
$taxonomies = ['project_block', 'project_panchayat', 'project_village', 'project_year', 'project_status', 'project_scheme'];
$term_cache = [];

foreach ($taxonomies as $taxonomy) {
    if (empty($project[$taxonomy])) {
        echo "   - {$taxonomy}: (none)\\n";
        continue;
    }

    $term_ids_to_assign = [];
    foreach ($project[$taxonomy] as $remote_term_id) {
        // Fetch term from live site
        $term_url = "{$LIVE_SITE}/wp-json/wp/v2/{$taxonomy}/{$remote_term_id}";
        $term_response = wp_remote_get($term_url, ['timeout' => 60]);

        if (is_wp_error($term_response)) {
            echo "   ! Error fetching {$taxonomy} term {$remote_term_id}\\n";
            continue;
        }

        $term_data = json_decode(wp_remote_retrieve_body($term_response), true);
        $term_name = $term_data['name'] ?? '';
        $term_slug = $term_data['slug'] ?? '';

        // Check if exists locally
        $local_term = get_term_by('slug', $term_slug, $taxonomy);
        if ($local_term) {
            $term_ids_to_assign[] = $local_term->term_id;
            echo "   ✓ {$taxonomy}: {$term_name} (exists, ID: {$local_term->term_id})\\n";
        } else {
            // Create it
            $result = wp_insert_term($term_name, $taxonomy, ['slug' => $term_slug]);
            if (is_wp_error($result)) {
                echo "   ! Error creating {$taxonomy} '{$term_name}': " . $result->get_error_message() . "\\n";
            } else {
                $term_ids_to_assign[] = $result['term_id'];
                echo "   ✓ {$taxonomy}: {$term_name} (created, ID: {$result['term_id']})\\n";
            }
        }
    }

    if (!empty($term_ids_to_assign)) {
        wp_set_object_terms($post_id, $term_ids_to_assign, $taxonomy);
    }
}

echo "\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n";
echo "✅ Import Complete!\\n";
echo "   Post ID: {$post_id}\\n";
echo "   Title: {$title}\\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n";
