<?php
/**
 * Import English Translations for Kurinjipadi Projects
 * 
 * Reads 'translated_kurinjipadi_final.json' and updates WordPress posts.
 * Preserves Tamil content in meta fields before overwriting standard fields.
 */

require_once __DIR__ . '/wp-load.php';

$json_file = __DIR__ . '/translated_kurinjipadi_ai.json';
if (!file_exists($json_file)) {
    die("Error: JSON file not found at $json_file\n");
}

$projects = json_decode(file_get_contents($json_file), true);
if (!$projects) {
    die("Error: Invalid JSON data\n");
}

echo "Starting import for " . count($projects) . " projects...\n";
$count = 0;

foreach ($projects as $item) {
    if (!isset($item['id']))
        continue;

    $post_id = $item['id'];
    $english_title = $item['translated_title'];
    $english_desc = $item['translated_content'];

    // 1. Get current post data to safety check Tamil content
    $post = get_post($post_id);
    if (!$post) {
        echo "Warning: Post ID $post_id not found. Skipping.\n";
        continue;
    }

    $current_tamil_title_meta = get_post_meta($post_id, '_project_title_tamil', true);
    $current_tamil_desc_meta = get_post_meta($post_id, '_project_description_tamil', true);

    // 2. Preserve Tamil content if missing in meta
    // If meta is empty, assume the current post_title/content (which is Tamil) should be saved there.
    if (empty($current_tamil_title_meta)) {
        update_post_meta($post_id, '_project_title_tamil', $post->post_title);
    }

    // Only save description to meta if it's not empty and meta is empty
    if (empty($current_tamil_desc_meta) && !empty($post->post_content)) {
        update_post_meta($post_id, '_project_description_tamil', $post->post_content);
    }

    // 3. Update Post with English Data
    $update_args = [
        'ID' => $post_id,
        'post_title' => $english_title,
        'post_content' => $english_desc,
    ];

    // Only update if changes are needed (though we assume they are)
    // if ($post->post_title !== $english_title || $post->post_content !== $english_desc) {
    // echo "Updating ID $post_id to '$english_title'...\n"; 
    $result = wp_update_post($update_args);
    if ($result == 0 || is_wp_error($result)) {
        echo "Failed to update ID $post_id. Error: " . (is_wp_error($result) ? $result->get_error_message() : 'Unknown') . "\n";
    } else {
        $count++;
    }
    //} else {
    //echo "No changes needed for ID $post_id (already updated?)\n";
    //}
}

echo "Successfully updated $count projects.\n";
