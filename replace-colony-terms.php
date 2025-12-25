<?php
/**
 * Replace "Colony" and "காலனி" with new terms
 * 
 * This script will:
 * 1. Replace "Colony" → "Adi dravidar Paguthi" in English titles
 * 2. Replace "காலனி" → "ஆதி திரவிடர் பகுதி" in Tamil titles
 * 3. Update taxonomy terms (village names)
 */

require_once('wp-load.php');

// Configuration
$dry_run = false; // Set to false to actually make changes
$skip_english = false; // Need to replace lowercase "colony"
$english_old = '';
$english_new = '';
$tamil_old = 'அழகப்பசாமுத்திரம்';
$tamil_new = 'அழகப்பசமுத்திரம்'; // Corrected spelling

echo "===========================================\n";
echo "Colony Term Replacement Script\n";
echo "===========================================\n\n";

if ($dry_run) {
    echo "⚠️  DRY RUN MODE - No changes will be made\n";
    echo "   Set \$dry_run = false to apply changes\n\n";
} else {
    echo "🔴 LIVE MODE - Changes will be made!\n\n";
}

global $wpdb;

// 1. Replace in English project titles (post_title)
if (!$skip_english) {
    echo "1. Searching for English 'Colony' in post titles...\n";
    $english_posts = $wpdb->get_results($wpdb->prepare(
        "SELECT ID, post_title FROM {$wpdb->posts} WHERE post_title LIKE %s AND post_type = 'project'",
        '%' . $wpdb->esc_like($english_old) . '%'
    ));

    echo "   Found " . count($english_posts) . " posts with 'colony' (case-insensitive)\n";
    foreach ($english_posts as $post) {
        $new_title = str_ireplace($english_old, $english_new, $post->post_title); // Case-insensitive
        echo "   - ID {$post->ID}: {$post->post_title}\n";
        echo "     → {$new_title}\n";

        if (!$dry_run) {
            $wpdb->update(
                $wpdb->posts,
                ['post_title' => $new_title],
                ['ID' => $post->ID]
            );
        }
    }
    echo "\n";
} else {
    echo "1. Skipping English post titles (already done via plugin)\n\n";
    $english_posts = [];
}

// 2. Replace in Tamil project titles (custom field _project_title_tamil)
echo "2. Searching for Tamil 'காலனி' in custom fields...\n";
$tamil_meta = $wpdb->get_results($wpdb->prepare(
    "SELECT post_id, meta_value FROM {$wpdb->postmeta} WHERE meta_key = '_project_title_tamil' AND meta_value LIKE %s",
    '%' . $wpdb->esc_like($tamil_old) . '%'
));

echo "   Found " . count($tamil_meta) . " posts with 'காலனி'\n";
foreach ($tamil_meta as $meta) {
    $new_value = str_replace($tamil_old, $tamil_new, $meta->meta_value);
    echo "   - Post ID {$meta->post_id}: {$meta->meta_value}\n";
    echo "     → {$new_value}\n";

    if (!$dry_run) {
        $wpdb->update(
            $wpdb->postmeta,
            ['meta_value' => $new_value],
            [
                'post_id' => $meta->post_id,
                'meta_key' => '_project_title_tamil'
            ]
        );
    }
}
echo "\n";

// 2b. Replace in English project titles (custom field _project_title_english)
if (!$skip_english) {
    echo "2b. Searching for English 'colony' in custom fields (_project_title_english)...\n";
    $english_title_meta = $wpdb->get_results($wpdb->prepare(
        "SELECT post_id, meta_value FROM {$wpdb->postmeta} WHERE meta_key = '_project_title_english' AND meta_value LIKE %s",
        '%' . $wpdb->esc_like($english_old) . '%'
    ));

    echo "   Found " . count($english_title_meta) . " posts with 'colony' (case-insensitive)\n";
    foreach ($english_title_meta as $meta) {
        $new_value = str_ireplace($english_old, $english_new, $meta->meta_value); // Case-insensitive
        echo "   - Post ID {$meta->post_id}: {$meta->meta_value}\n";
        echo "     → {$new_value}\n";

        if (!$dry_run) {
            $wpdb->update(
                $wpdb->postmeta,
                ['meta_value' => $new_value],
                [
                    'post_id' => $meta->post_id,
                    'meta_key' => '_project_title_english'
                ]
            );
        }
    }
    echo "\n";
} else {
    $english_title_meta = [];
}


// 3. Replace in English taxonomy terms (village names)
if (!$skip_english) {
    echo "3. Searching for 'Colony' in taxonomy terms...\n";
    $english_terms = $wpdb->get_results($wpdb->prepare(
        "SELECT term_id, name FROM {$wpdb->terms} WHERE name LIKE %s",
        '%' . $wpdb->esc_like($english_old) . '%'
    ));

    echo "   Found " . count($english_terms) . " terms with 'colony' (case-insensitive)\n";
    foreach ($english_terms as $term) {
        $new_name = str_ireplace($english_old, $english_new, $term->name); // Case-insensitive
        echo "   - Term ID {$term->term_id}: {$term->name}\n";
        echo "     → {$new_name}\n";

        if (!$dry_run) {
            $wpdb->update(
                $wpdb->terms,
                ['name' => $new_name],
                ['term_id' => $term->term_id]
            );
        }
    }
    echo "\n";
} else {
    echo "3. Skipping English taxonomy terms (already done via plugin)\n\n";
    $english_terms = [];
}

// 4. Replace in Tamil village names (custom field on terms)
echo "4. Searching for 'காலனி' in term meta (village_name_tamil)...\n";
$tamil_term_meta = $wpdb->get_results($wpdb->prepare(
    "SELECT term_id, meta_value FROM {$wpdb->termmeta} WHERE meta_key = 'village_name_tamil' AND meta_value LIKE %s",
    '%' . $wpdb->esc_like($tamil_old) . '%'
));

echo "   Found " . count($tamil_term_meta) . " term meta with 'காலனி'\n";
foreach ($tamil_term_meta as $meta) {
    $new_value = str_replace($tamil_old, $tamil_new, $meta->meta_value);
    echo "   - Term ID {$meta->term_id}: {$meta->meta_value}\n";
    echo "     → {$new_value}\n";

    if (!$dry_run) {
        $wpdb->update(
            $wpdb->termmeta,
            ['meta_value' => $new_value],
            [
                'term_id' => $meta->term_id,
                'meta_key' => 'village_name_tamil'
            ]
        );
    }
}
echo "\n";

// Summary
echo "===========================================\n";
echo "Summary:\n";
echo "- English post titles: " . count($english_posts) . " found\n";
echo "- English custom fields: " . (isset($english_title_meta) ? count($english_title_meta) : 0) . " found\n";
echo "- Tamil custom fields: " . count($tamil_meta) . " found\n";
echo "- English taxonomy terms: " . count($english_terms) . " found\n";
echo "- Tamil term meta: " . count($tamil_term_meta) . " found\n";
echo "===========================================\n\n";

if ($dry_run) {
    echo "✅ Dry run complete. Review the changes above.\n";
    echo "   To apply changes, edit this file and set \$dry_run = false\n";
} else {
    echo "✅ Changes applied successfully!\n";
    echo "   Run: npm run generate-projects\n";
    echo "   Then commit and push the updated projects.json\n";
}
