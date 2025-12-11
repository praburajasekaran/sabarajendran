<?php
/**
 * Apply Spellcheck Corrections
 * 
 * Reads spellchecked_projects.json and updates WordPress posts and meta.
 * Usage: php apply_spellcheck_corrections.php
 */

require_once('wp-load.php');

$input_file = 'spellchecked_projects.json';

if (!file_exists($input_file)) {
    die("Error: Input file $input_file not found.\n");
}

$data = json_decode(file_get_contents($input_file), true);
if (!$data) {
    die("Error: Could not decode JSON from $input_file\n");
}

echo "Starting update process for " . count($data) . " projects...\n";

$updated_count = 0;
$no_change_count = 0;
$error_count = 0;

foreach ($data as $item) {
    $id = $item['id'];

    // Validate ID exists
    $post = get_post($id);
    if (!$post) {
        echo "Error: Post ID $id not found.\n";
        $error_count++;
        continue;
    }

    $changes_made = false;

    // Update English Title/Content
    $current_title = $post->post_title;
    $current_content = $post->post_content;

    $new_title = $item['title_en'];
    $new_content = $item['content_en'];

    $post_update = array('ID' => $id);

    if ($new_title !== $current_title) {
        $post_update['post_title'] = $new_title;
        $changes_made = true;
    }

    if ($new_content !== $current_content) {
        $post_update['post_content'] = $new_content;
        $changes_made = true;
    }

    if ($changes_made) {
        wp_update_post($post_update);
        // echo "[#$id] Updated English fields.\n";
    }

    // Update Tamil Meta
    $current_title_ta = get_post_meta($id, '_project_title_tamil', true);
    $current_content_ta = get_post_meta($id, '_project_description_tamil', true);

    $new_title_ta = $item['title_ta'];
    $new_content_ta = $item['content_ta'];

    if ($new_title_ta !== $current_title_ta) {
        update_post_meta($id, '_project_title_tamil', $new_title_ta);
        $changes_made = true;
        // echo "[#$id] Updated Tamil title.\n";
    }

    if ($new_content_ta !== $current_content_ta) {
        update_post_meta($id, '_project_description_tamil', $new_content_ta);
        $changes_made = true;
        // echo "[#$id] Updated Tamil content.\n";
    }

    if ($changes_made) {
        echo "[#$id] Updated.\n";
        $updated_count++;
    } else {
        $no_change_count++;
    }

    // Progress indicator every 50 items
    if (($updated_count + $no_change_count) % 50 == 0) {
        echo "Processed " . ($updated_count + $no_change_count) . " items...\n";
    }
}

echo "\n----------------------------------------\n";
echo "Update Complete.\n";
echo "Total Processed: " . count($data) . "\n";
echo "Updated: $updated_count\n";
echo "No Change: $no_change_count\n";
echo "Errors: $error_count\n";
?>