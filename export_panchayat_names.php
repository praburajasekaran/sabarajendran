<?php
/**
 * Export Panchayat Names from WordPress for Translation
 * 
 * This script extracts panchayat names from the project_panchayat taxonomy
 * and identifies which ones are in Tamil (need translation to English)
 */

require_once('wp-load.php');

echo "=================================================================\n";
echo "PANCHAYAT NAMES EXPORT FOR TRANSLATION\n";
echo "=================================================================\n\n";

// Get all panchayat terms
$panchayats = get_terms(array(
    'taxonomy' => 'project_panchayat',
    'hide_empty' => false
));

if (is_wp_error($panchayats)) {
    die("Error: " . $panchayats->get_error_message() . "\n");
}

echo "Found " . count($panchayats) . " panchayat terms\n\n";

// Function to check if a string contains Tamil characters
function containsTamil($str)
{
    // Tamil Unicode range: 0B80-0BFF
    return preg_match('/[\x{0B80}-\x{0BFF}]/u', $str);
}

// Load existing village translations to check what's already translated
$translationsPath = __DIR__ . '/projects-frontend-react/utils/villageTranslations.ts';
$existingTranslations = array();

if (file_exists($translationsPath)) {
    $translationsContent = file_get_contents($translationsPath);
    // Extract the VILLAGE_TRANSLATIONS object
    preg_match('/export const VILLAGE_TRANSLATIONS: Record<string, string> = \{(.*?)\};/s', $translationsContent, $transMatches);
    if (isset($transMatches[1])) {
        // Parse the translations
        preg_match_all("/'([^']+)':\s*'([^']+)'/", $transMatches[1], $transEntries, PREG_SET_ORDER);
        foreach ($transEntries as $entry) {
            $existingTranslations[$entry[1]] = $entry[2];
        }
    }
}

echo "Loaded " . count($existingTranslations) . " existing translations\n\n";

// Categorize panchayats
$needsTranslation = array();
$alreadyTranslated = array();

foreach ($panchayats as $panchayat) {
    $name = $panchayat->name;
    $isTamil = containsTamil($name);
    $hasTranslation = isset($existingTranslations[$name]);

    // Check if there's a reverse translation (English key with this Tamil value)
    $hasReverseTranslation = in_array($name, $existingTranslations);

    if ($isTamil && !$hasReverseTranslation) {
        // Tamil panchayat without English equivalent - needs translation
        $needsTranslation[] = array(
            'tamil' => $name,
            'count' => $panchayat->count,
            'slug' => $panchayat->slug
        );
    } elseif ($hasTranslation) {
        $alreadyTranslated[] = array(
            'english' => $name,
            'tamil' => $existingTranslations[$name],
            'count' => $panchayat->count
        );
    } elseif ($hasReverseTranslation) {
        // Find the English key
        $englishKey = array_search($name, $existingTranslations);
        $alreadyTranslated[] = array(
            'english' => $englishKey,
            'tamil' => $name,
            'count' => $panchayat->count
        );
    } else {
        // English panchayat without Tamil translation
        // We'll add these to the "already translated" list with empty Tamil
        $alreadyTranslated[] = array(
            'english' => $name,
            'tamil' => '',
            'count' => $panchayat->count
        );
    }
}

// Sort by count (most common first)
usort($needsTranslation, function ($a, $b) {
    return $b['count'] - $a['count'];
});

// Output results
echo "=================================================================\n";
echo "ANALYSIS RESULTS\n";
echo "=================================================================\n\n";

echo "Total panchayats: " . count($panchayats) . "\n";
echo "Already have translations: " . count($alreadyTranslated) . "\n";
echo "Need translation (Tamil → English): " . count($needsTranslation) . "\n\n";

if (!empty($needsTranslation)) {
    echo "=================================================================\n";
    echo "PANCHAYATS NEEDING TRANSLATION\n";
    echo "=================================================================\n\n";

    foreach ($needsTranslation as $panch) {
        echo sprintf(
            "Tamil: %s (slug: %s, used in %d projects)\n",
            $panch['tamil'],
            $panch['slug'],
            $panch['count']
        );
    }
    echo "\n";
}

// Export to JSON for AI processing
$outputFile = __DIR__ . '/panchayat_locations.json';
$jsonData = array(
    'metadata' => array(
        'total_panchayats' => count($panchayats),
        'already_translated' => count($alreadyTranslated),
        'needs_translation' => count($needsTranslation),
        'export_date' => date('Y-m-d H:i:s'),
        'source' => 'WordPress project_panchayat taxonomy'
    ),
    'needs_translation' => $needsTranslation,
    'already_translated' => $alreadyTranslated
);

file_put_contents($outputFile, json_encode($jsonData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

echo "=================================================================\n";
echo "Exported to: $outputFile\n";
echo "=================================================================\n";
