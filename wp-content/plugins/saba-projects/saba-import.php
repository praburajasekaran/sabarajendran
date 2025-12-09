<?php
/**
 * Import Translations Script
 *
 * Usage: php saba-import.php
 */

// Load WordPress environment
require_once '../../../wp-load.php';

// Configuration
$LIVE_API_URL = 'https://tan-emu-358425.hostingersite.com/wp-json/wp/v2/project';
$PER_PAGE = 100;

echo "Starting translation import...\n";

// Function to fetch projects from live API
function fetch_live_projects($url, $page = 1)
{
    global $PER_PAGE;
    $api_url = add_query_arg([
        'per_page' => $PER_PAGE,
        'page' => $page,
    ], $url);

    echo "Fetching page $page...\n";

    $response = wp_remote_get($api_url, [
        'timeout' => 60,
        'sslverify' => false
    ]);

    if (is_wp_error($response)) {
        echo "Error fetching data: " . $response->get_error_message() . "\n";
        return false;
    }

    $response_code = wp_remote_retrieve_response_code($response);
    if ($response_code !== 200) {
        // If 400 and code is rest_post_invalid_page_number, we are done
        $body = json_decode(wp_remote_retrieve_body($response), true);
        if ($response_code === 400 && isset($body['code']) && $body['code'] === 'rest_post_invalid_page_number') {
            return []; // End of pages
        }

        echo "API Error ($response_code): " . wp_remote_retrieve_body($response) . "\n";
        return false;
    }

    return json_decode(wp_remote_retrieve_body($response), true);
}

// Main loop
$page = 1;
$total_updated = 0;
$total_processed = 0;

while (true) {
    $projects = fetch_live_projects($LIVE_API_URL, $page);

    if ($projects === false) {
        break; // Error
    }

    if (empty($projects)) {
        break; // No more projects
    }

    foreach ($projects as $live_project) {
        $total_processed++;
        $slug = $live_project['slug'];

        // Find local project by slug
        $args = [
            'name' => $slug,
            'post_type' => 'project',
            'post_status' => 'any',
            'numberposts' => 1
        ];
        $local_projects = get_posts($args);

        if ($local_projects) {
            $local_id = $local_projects[0]->ID;
            $updated = false;

            // Update Meta Fields
            $meta_fields = [
                '_project_title_tamil',
                '_project_description_tamil',
            ];

            foreach ($meta_fields as $key) {
                if (!empty($live_project[$key])) {
                    $live_value = $live_project[$key];
                    $local_value = get_post_meta($local_id, $key, true);

                    if ($local_value !== $live_value) {
                        update_post_meta($local_id, $key, $live_value);
                        $updated = true;
                    }
                }
            }

            // Also update English meta if it exists on live but not local or different (optional, but good for sync)
            $english_meta_fields = [
                '_project_title_english',
                '_project_description_english',
            ];
            foreach ($english_meta_fields as $key) {
                if (!empty($live_project[$key])) {
                    update_post_meta($local_id, $key, $live_project[$key]);
                }
            }


            if ($updated) {
                echo "Updated project: $slug\n";
                $total_updated++;
            }
        } else {
            echo "Skipped (not found locally): $slug\n";
        }
    }

    $page++;
}

echo "----------------------------------------\n";
echo "Import completed.\n";
echo "Total processed: $total_processed\n";
echo "Total updated: $total_updated\n";
