<?php
/**
 * Update WordPress Panchayat Names from Tamil to English
 * 
 * This script renames Tamil-named panchayat terms to their English equivalents
 * based on the AI translations
 */

require_once('wp-load.php');

// Load the translations
$translationsFile = __DIR__ . '/translated_panchayats.json';
if (!file_exists($translationsFile)) {
    die("Error: translated_panchayats.json not found\n");
}

$data = json_decode(file_get_contents($translationsFile), true);
$translations = $data['translations'];

echo "=================================================================\n";
echo "UPDATING WORDPRESS PANCHAYAT NAMES\n";
echo "=================================================================\n\n";

echo "Found " . count($translations) . " panchayat names to update\n\n";

$updated = 0;
$errors = 0;

foreach ($translations as $trans) {
    $tamil_name = $trans['tamil'];
    $english_name = $trans['english'];
    $count = $trans['count'];

    echo "Updating: $tamil_name → $english_name ($count projects)\n";

    // Find the term by name
    $term = get_term_by('name', $tamil_name, 'project_panchayat');

    if ($term) {
        // Update the term name
        $result = wp_update_term($term->term_id, 'project_panchayat', array(
            'name' => $english_name,
            'slug' => sanitize_title($english_name)
        ));

        if (is_wp_error($result)) {
            echo "  ERROR: " . $result->get_error_message() . "\n";
            $errors++;
        } else {
            echo "  ✓ Updated successfully (ID: {$term->term_id})\n";
            $updated++;
        }
    } else {
        echo "  WARNING: Term not found\n";
        $errors++;
    }

    echo "\n";
}

echo "=================================================================\n";
echo "SUMMARY\n";
echo "=================================================================\n";
echo "Successfully updated: $updated\n";
echo "Errors: $errors\n";
echo "=================================================================\n";
