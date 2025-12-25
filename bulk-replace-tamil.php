<?php
/**
 * Bulk Replace Tamil Text in WordPress Database
 * 
 * This script allows you to replace any Tamil text across:
 * 1. Custom fields (postmeta)
 * 2. Taxonomy term meta (termmeta)
 * 3. Post content (if needed)
 */

require_once('wp-load.php');

// ============================================
// CONFIGURATION - EDIT THESE VALUES
// ============================================

$dry_run = false; // Set to false to actually make changes
$old_text = 'முதற்குறிச்சிகுப்பம்'; // Tamil text to find (wrong spelling with சா)
$new_text = 'முத்துகிருஷ்ணாபுரம்'; // Tamil text to replace with (correct spelling with ச)

// Define which fields to search in
$search_config = [
    // Post meta fields (custom fields)
    'postmeta' => [
        '_project_title_tamil',
        // Add more meta keys here as needed
        // '_project_description_tamil',
        // '_custom_field_name',
    ],

    // Term meta fields (taxonomy custom fields)
    'termmeta' => [
        '_village_name_tamil',
        'village_name_tamil',
        // Add more term meta keys here as needed
    ],

    // Search in post content (optional)
    'post_content' => false, // Set to true to search in post_content

    // Search in post titles (optional)
    'post_title' => false, // Set to true to search in post_title
];

// ============================================
// SCRIPT EXECUTION
// ============================================

echo "===========================================\n";
echo "Bulk Tamil Text Replacement Script\n";
echo "===========================================\n\n";

echo "Searching for: {$old_text}\n";
echo "Replacing with: {$new_text}\n\n";

if ($dry_run) {
    echo "⚠️  DRY RUN MODE - No changes will be made\n";
    echo "   Set \$dry_run = false to apply changes\n\n";
} else {
    echo "🔴 LIVE MODE - Changes will be made!\n\n";
}

global $wpdb;
$total_found = 0;
$total_updated = 0;

// 1. Search in Post Meta
if (!empty($search_config['postmeta'])) {
    echo "1. Searching in Post Meta (Custom Fields)...\n";
    echo "-------------------------------------------\n";

    foreach ($search_config['postmeta'] as $meta_key) {
        echo "\nSearching in meta_key: {$meta_key}\n";

        $results = $wpdb->get_results($wpdb->prepare(
            "SELECT post_id, meta_value FROM {$wpdb->postmeta} 
             WHERE meta_key = %s AND meta_value LIKE %s",
            $meta_key,
            '%' . $wpdb->esc_like($old_text) . '%'
        ));

        echo "Found " . count($results) . " records\n";
        $total_found += count($results);

        foreach ($results as $row) {
            $new_value = str_replace($old_text, $new_text, $row->meta_value);

            // Get post title for reference
            $post = get_post($row->post_id);
            $post_title = $post ? $post->post_title : 'Unknown';

            echo "  - Post ID {$row->post_id} ({$post_title}):\n";
            echo "    OLD: {$row->meta_value}\n";
            echo "    NEW: {$new_value}\n\n";

            if (!$dry_run) {
                $result = $wpdb->update(
                    $wpdb->postmeta,
                    ['meta_value' => $new_value],
                    [
                        'post_id' => $row->post_id,
                        'meta_key' => $meta_key
                    ]
                );
                if ($result !== false) {
                    $total_updated++;
                }
            }
        }
    }
}

// 2. Search in Term Meta
if (!empty($search_config['termmeta'])) {
    echo "\n2. Searching in Term Meta (Taxonomy Custom Fields)...\n";
    echo "-------------------------------------------\n";

    foreach ($search_config['termmeta'] as $meta_key) {
        echo "\nSearching in meta_key: {$meta_key}\n";

        $results = $wpdb->get_results($wpdb->prepare(
            "SELECT term_id, meta_value FROM {$wpdb->termmeta} 
             WHERE meta_key = %s AND meta_value LIKE %s",
            $meta_key,
            '%' . $wpdb->esc_like($old_text) . '%'
        ));

        echo "Found " . count($results) . " records\n";
        $total_found += count($results);

        foreach ($results as $row) {
            $new_value = str_replace($old_text, $new_text, $row->meta_value);

            // Get term name for reference
            $term = $wpdb->get_row($wpdb->prepare(
                "SELECT name FROM {$wpdb->terms} WHERE term_id = %d",
                $row->term_id
            ));
            $term_name = $term ? $term->name : 'Unknown';

            echo "  - Term ID {$row->term_id} ({$term_name}):\n";
            echo "    OLD: {$row->meta_value}\n";
            echo "    NEW: {$new_value}\n\n";

            if (!$dry_run) {
                $result = $wpdb->update(
                    $wpdb->termmeta,
                    ['meta_value' => $new_value],
                    [
                        'term_id' => $row->term_id,
                        'meta_key' => $meta_key
                    ]
                );
                if ($result !== false) {
                    $total_updated++;
                }
            }
        }
    }
}

// 3. Search in Post Content (optional)
if ($search_config['post_content']) {
    echo "\n3. Searching in Post Content...\n";
    echo "-------------------------------------------\n";

    $results = $wpdb->get_results($wpdb->prepare(
        "SELECT ID, post_title, post_content FROM {$wpdb->posts} 
         WHERE post_content LIKE %s",
        '%' . $wpdb->esc_like($old_text) . '%'
    ));

    echo "Found " . count($results) . " posts\n";
    $total_found += count($results);

    foreach ($results as $post) {
        $new_content = str_replace($old_text, $new_text, $post->post_content);

        echo "  - Post ID {$post->ID} ({$post->post_title})\n";
        echo "    Content updated\n\n";

        if (!$dry_run) {
            $result = $wpdb->update(
                $wpdb->posts,
                ['post_content' => $new_content],
                ['ID' => $post->ID]
            );
            if ($result !== false) {
                $total_updated++;
            }
        }
    }
}

// 4. Search in Post Titles (optional)
if ($search_config['post_title']) {
    echo "\n4. Searching in Post Titles...\n";
    echo "-------------------------------------------\n";

    $results = $wpdb->get_results($wpdb->prepare(
        "SELECT ID, post_title FROM {$wpdb->posts} 
         WHERE post_title LIKE %s",
        '%' . $wpdb->esc_like($old_text) . '%'
    ));

    echo "Found " . count($results) . " posts\n";
    $total_found += count($results);

    foreach ($results as $post) {
        $new_title = str_replace($old_text, $new_text, $post->post_title);

        echo "  - Post ID {$post->ID}:\n";
        echo "    OLD: {$post->post_title}\n";
        echo "    NEW: {$new_title}\n\n";

        if (!$dry_run) {
            $result = $wpdb->update(
                $wpdb->posts,
                ['post_title' => $new_title],
                ['ID' => $post->ID]
            );
            if ($result !== false) {
                $total_updated++;
            }
        }
    }
}

// Summary
echo "\n===========================================\n";
echo "Summary:\n";
echo "-------------------------------------------\n";
echo "Total records found: {$total_found}\n";
if (!$dry_run) {
    echo "Total records updated: {$total_updated}\n";
}
echo "===========================================\n\n";

if ($dry_run) {
    echo "✅ Dry run complete. Review the changes above.\n";
    echo "   To apply changes, edit this file and set \$dry_run = false\n";
} else {
    echo "✅ Changes applied successfully!\n";
    echo "   Remember to:\n";
    echo "   1. Clear WordPress cache if using caching\n";
    echo "   2. Run: npm run generate-projects (if applicable)\n";
    echo "   3. Test the changes on your site\n";
}
