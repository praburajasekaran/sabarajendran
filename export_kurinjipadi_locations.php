<?php
/**
 * Export Kurinjipadi Block Location Names for AI Translation
 * 
 * This script extracts unique location names from the rawData.ts file
 * and identifies which ones are in Tamil script (need translation)
 */

// Read the rawData.ts file
$rawDataPath = __DIR__ . '/projects-frontend-react/data/rawData.ts';
if (!file_exists($rawDataPath)) {
    die("Error: rawData.ts not found at: $rawDataPath\n");
}

$content = file_get_contents($rawDataPath);

// Extract the CSV data between the backticks
preg_match('/export const CSV_DATA = `\n(.*?)`/s', $content, $matches);
if (!isset($matches[1])) {
    die("Error: Could not extract CSV data from rawData.ts\n");
}

$csvData = $matches[1];
$lines = explode("\n", $csvData);

// Parse CSV header
$header = str_getcsv($lines[0]);
$habitationIndex = array_search('Habitation Name', $header);

if ($habitationIndex === false) {
    die("Error: Could not find 'Habitation Name' column in CSV\n");
}

// Extract unique location names
$locations = [];
$locationCounts = [];

foreach ($lines as $index => $line) {
    if ($index === 0 || empty(trim($line)))
        continue; // Skip header and empty lines

    $row = str_getcsv($line);
    if (!isset($row[$habitationIndex]))
        continue;

    $location = trim($row[$habitationIndex]);
    if (empty($location))
        continue;

    // Track unique locations and their counts
    if (!isset($locationCounts[$location])) {
        $locationCounts[$location] = 0;
    }
    $locationCounts[$location]++;
}

// Load existing village translations to check what's already translated
$translationsPath = __DIR__ . '/projects-frontend-react/utils/villageTranslations.ts';
$existingTranslations = [];

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

// Function to check if a string contains Tamil characters
function containsTamil($str)
{
    // Tamil Unicode range: 0B80-0BFF
    return preg_match('/[\x{0B80}-\x{0BFF}]/u', $str);
}

// Categorize locations
$needsTranslation = [];
$alreadyTranslated = [];

foreach ($locationCounts as $location => $count) {
    $isTamil = containsTamil($location);
    $hasTranslation = isset($existingTranslations[$location]);

    if ($isTamil && !$hasTranslation) {
        // Tamil location without English equivalent - needs translation
        $needsTranslation[] = [
            'tamil' => $location,
            'count' => $count
        ];
    } elseif ($hasTranslation) {
        $alreadyTranslated[] = [
            'english' => $location,
            'tamil' => $existingTranslations[$location],
            'count' => $count
        ];
    }
}

// Sort by count (most common first)
usort($needsTranslation, function ($a, $b) {
    return $b['count'] - $a['count'];
});

// Output results
echo "=================================================================\n";
echo "KURINJIPADI LOCATION NAMES ANALYSIS\n";
echo "=================================================================\n\n";

echo "Total unique locations: " . count($locationCounts) . "\n";
echo "Already translated: " . count($alreadyTranslated) . "\n";
echo "Need translation: " . count($needsTranslation) . "\n\n";

if (!empty($needsTranslation)) {
    echo "=================================================================\n";
    echo "LOCATIONS NEEDING TRANSLATION (Tamil → English)\n";
    echo "=================================================================\n\n";

    foreach ($needsTranslation as $loc) {
        echo sprintf("Tamil: %s (used in %d projects)\n", $loc['tamil'], $loc['count']);
    }
    echo "\n";
}

// Export to JSON for AI processing
$outputFile = __DIR__ . '/kurinjipadi_locations.json';
$jsonData = [
    'metadata' => [
        'total_locations' => count($locationCounts),
        'already_translated' => count($alreadyTranslated),
        'needs_translation' => count($needsTranslation),
        'export_date' => date('Y-m-d H:i:s')
    ],
    'needs_translation' => $needsTranslation,
    'already_translated' => $alreadyTranslated
];

file_put_contents($outputFile, json_encode($jsonData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

echo "=================================================================\n";
echo "Exported to: $outputFile\n";
echo "=================================================================\n";
