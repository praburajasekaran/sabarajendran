<?php
/**
 * Export Village Names from project_village taxonomy for Translation
 * 
 * This script extracts village names from the project_village taxonomy
 * and identifies which ones are in Tamil (need translation to English)
 */

require_once('wp-load.php');

echo "=================================================================\n";
echo "VILLAGE NAMES EXPORT FROM TAXONOMY\n";
echo "=================================================================\n\n";

// Get all village terms from project_village taxonomy
$villages = get_terms(array(
    'taxonomy' => 'project_village',
    'hide_empty' => false
));

if (is_wp_error($villages)) {
    die("Error: " . $villages->get_error_message() . "\n");
}

echo "Found " . count($villages) . " village terms\n\n";

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

// Categorize villages
$needsTranslation = array();
$alreadyTranslated = array();

foreach ($villages as $village) {
    $name = $village->name;
    $isTamil = containsTamil($name);
    $hasTranslation = isset($existingTranslations[$name]);

    // Check if there's a reverse translation (English key with this Tamil value)
    $hasReverseTranslation = in_array($name, $existingTranslations);

    if ($isTamil && !$hasReverseTranslation) {
        // Tamil village without English equivalent - needs translation
        $needsTranslation[] = array(
            'tamil' => $name,
            'count' => $village->count,
            'slug' => $village->slug
        );
    } elseif ($hasTranslation) {
        $alreadyTranslated[] = array(
            'english' => $name,
            'tamil' => $existingTranslations[$name],
            'count' => $village->count
        );
    } elseif ($hasReverseTranslation) {
        // Find the English key
        $englishKey = array_search($name, $existingTranslations);
        $alreadyTranslated[] = array(
            'english' => $englishKey,
            'tamil' => $name,
            'count' => $village->count
        );
    } else {
        // English village without Tamil translation
        $alreadyTranslated[] = array(
            'english' => $name,
            'tamil' => '',
            'count' => $village->count
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

echo "Total villages: " . count($villages) . "\n";
echo "Already have translations: " . count($alreadyTranslated) . "\n";
echo "Need translation (Tamil → English): " . count($needsTranslation) . "\n\n";

if (!empty($needsTranslation)) {
    echo "=================================================================\n";
    echo "VILLAGES NEEDING TRANSLATION\n";
    echo "=================================================================\n\n";

    foreach ($needsTranslation as $village) {
        echo sprintf(
            "Tamil: %s (slug: %s, used in %d projects)\n",
            $village['tamil'],
            $village['slug'],
            $village['count']
        );
    }
    echo "\n";
}

// Export to JSON for AI processing
$outputFile = __DIR__ . '/villages_to_translate.json';
$jsonData = array(
    'metadata' => array(
        'total_villages' => count($villages),
        'already_translated' => count($alreadyTranslated),
        'needs_translation' => count($needsTranslation),
        'export_date' => date('Y-m-d H:i:s'),
        'source' => 'WordPress project_village taxonomy'
    ),
    'needs_translation' => $needsTranslation,
    'already_translated' => $alreadyTranslated
);

file_put_contents($outputFile, json_encode($jsonData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

echo "=================================================================\n";
echo "Exported to: $outputFile\n";
echo "=================================================================\n";
