<?php
/**
 * Replace "காலனி" in Tamil village names
 * 
 * This script will update taxonomy term meta for village_name_tamil
 */

require_once('wp-load.php');

// Configuration
$dry_run = false; // Set to false to actually make changes
$tamil_old = 'காலனி';
$tamil_new = 'ஆதி திராவிடர் பகுதி';

echo "===========================================\n";
echo "Village Name Tamil Replacement Script\n";
echo "===========================================\n\n";

if ($dry_run) {
    echo "⚠️  DRY RUN MODE - No changes will be made\n";
    echo "   Set \$dry_run = false to apply changes\n\n";
} else {
    echo "🔴 LIVE MODE - Changes will be made!\n\n";
}

global $wpdb;

// 1. Replace in English village names (custom field on terms)
echo "1. Searching for 'colony' in term meta (_village_name_english)...\n";
$english_village_meta = $wpdb->get_results($wpdb->prepare(
    "SELECT term_id, meta_value FROM {$wpdb->termmeta} WHERE meta_key = '_village_name_english' AND meta_value LIKE %s",
    '%' . $wpdb->esc_like('colony') . '%'
));

echo "Found " . count($english_village_meta) . " English village names with 'colony'\n\n";

$english_updated_count = 0;
foreach ($english_village_meta as $meta) {
    $new_value = str_ireplace('colony', 'Adi Dravidar Paguthi', $meta->meta_value); // Case-insensitive

    // Get the term name for reference
    $term = $wpdb->get_row($wpdb->prepare(
        "SELECT name FROM {$wpdb->terms} WHERE term_id = %d",
        $meta->term_id
    ));

    echo "- Term ID {$meta->term_id} ({$term->name}):\n";
    echo "  OLD: {$meta->meta_value}\n";
    echo "  NEW: {$new_value}\n\n";

    if (!$dry_run) {
        $result = $wpdb->update(
            $wpdb->termmeta,
            ['meta_value' => $new_value],
            [
                'term_id' => $meta->term_id,
                'meta_key' => '_village_name_english'
            ]
        );
        if ($result !== false) {
            $english_updated_count++;
        }
    }
}

// 2. Replace in Tamil village names (custom field on terms)
echo "Searching for 'காலனி' in term meta (_village_name_tamil)...\n";
$tamil_term_meta = $wpdb->get_results($wpdb->prepare(
    "SELECT term_id, meta_value FROM {$wpdb->termmeta} WHERE meta_key = '_village_name_tamil' AND meta_value LIKE %s",
    '%' . $wpdb->esc_like($tamil_old) . '%'
));

echo "Found " . count($tamil_term_meta) . " village names with 'காலனி'\n\n";

$updated_count = 0;
foreach ($tamil_term_meta as $meta) {
    $new_value = str_replace($tamil_old, $tamil_new, $meta->meta_value);

    // Get the term name for reference
    $term = $wpdb->get_row($wpdb->prepare(
        "SELECT name FROM {$wpdb->terms} WHERE term_id = %d",
        $meta->term_id
    ));

    echo "- Term ID {$meta->term_id} ({$term->name}):\n";
    echo "  OLD: {$meta->meta_value}\n";
    echo "  NEW: {$new_value}\n\n";

    if (!$dry_run) {
        $result = $wpdb->update(
            $wpdb->termmeta,
            ['meta_value' => $new_value],
            [
                'term_id' => $meta->term_id,
                'meta_key' => '_village_name_tamil'
            ]
        );
        if ($result !== false) {
            $updated_count++;
        }
    }
}

echo "\n===========================================\n";
echo "Summary:\n";
echo "- English village names found: " . (isset($english_village_meta) ? count($english_village_meta) : 0) . "\n";
echo "- Tamil village names found: " . count($tamil_term_meta) . "\n";
if (!$dry_run) {
    echo "- English successfully updated: " . (isset($english_updated_count) ? $english_updated_count : 0) . "\n";
    echo "- Tamil successfully updated: " . $updated_count . "\n";
}
echo "===========================================\n\n";

if ($dry_run) {
    echo "✅ Dry run complete. Review the changes above.\n";
    echo "   To apply changes, edit this file and set \$dry_run = false\n";
} else {
    echo "✅ Changes applied successfully!\n";
    echo "   Run: npm run generate-projects\n";
    echo "   Then commit and push the updated projects.json\n";
}
