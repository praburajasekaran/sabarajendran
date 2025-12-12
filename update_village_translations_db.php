<?php
/**
 * Update Village Translations in WordPress Database
 * 
 * This script reads AI-translated village names from JSON and updates
 * the WordPress database with English translations as term metadata.
 */

require_once('wp-load.php');

echo "=================================================================\n";
echo "UPDATE VILLAGE TRANSLATIONS IN DATABASE\n";
echo "=================================================================\n\n";

// Load translated villages from JSON
$jsonFile = __DIR__ . '/translated_villages_ai.json';
if (!file_exists($jsonFile)) {
    die("Error: translated_villages_ai.json not found\n");
}

$translatedVillages = json_decode(file_get_contents($jsonFile), true);
if (!$translatedVillages) {
    die("Error: Could not parse JSON file\n");
}

echo "Loaded " . count($translatedVillages) . " translated villages from JSON\n\n";

$updated = 0;
$skipped = 0;
$errors = 0;

foreach ($translatedVillages as $village) {
    $tamilName = $village['tamil'];
    $englishName = $village['english'];
    $count = $village['count'];

    // Find the term by Tamil name
    $term = get_term_by('name', $tamilName, 'project_village');

    if (!$term) {
        echo "⚠️  Term not found: $tamilName\n";
        $errors++;
        continue;
    }

    // Check if English translation already exists
    $existingEnglish = get_term_meta($term->term_id, '_village_name_english', true);

    if (!empty($existingEnglish)) {
        echo "⏭️  Skipped (already has English): $tamilName → $existingEnglish (keeping existing)\n";
        $skipped++;
        continue;
    }

    // Update the term meta with English translation
    $result = update_term_meta($term->term_id, '_village_name_english', $englishName);

    // Also ensure Tamil name is stored
    update_term_meta($term->term_id, '_village_name_tamil', $tamilName);

    if ($result !== false) {
        echo "✅ Updated: $tamilName → $englishName (used in $count projects)\n";
        $updated++;
    } else {
        echo "❌ Failed to update: $tamilName\n";
        $errors++;
    }
}

echo "\n=================================================================\n";
echo "SUMMARY\n";
echo "=================================================================\n\n";
echo "Total villages processed: " . count($translatedVillages) . "\n";
echo "✅ Successfully updated: $updated\n";
echo "⏭️  Skipped (already translated): $skipped\n";
echo "❌ Errors: $errors\n";
echo "\n=================================================================\n";
echo "✅ Database update complete!\n";
echo "=================================================================\n";
