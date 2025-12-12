<?php
/**
 * Export Tamil-named Panchayats for Translation
 * Fixed version that properly identifies Tamil names
 */

require_once('wp-load.php');

echo "=================================================================\n";
echo "TAMIL PANCHAYAT NAMES EXPORT\n";
echo "=================================================================\n\n";

// Function to check if a string contains Tamil characters
function containsTamil($str)
{
    return preg_match('/[\x{0B80}-\x{0BFF}]/u', $str);
}

// Get all panchayat terms
$panchayats = get_terms(array(
    'taxonomy' => 'project_panchayat',
    'hide_empty' => false
));

if (is_wp_error($panchayats)) {
    die("Error: " . $panchayats->get_error_message() . "\n");
}

// Separate Tamil and English named panchayats
$tamil_panchayats = array();
$english_panchayats = array();

foreach ($panchayats as $panch) {
    $isTamil = containsTamil($panch->name);

    if ($isTamil) {
        $tamil_panchayats[] = array(
            'tamil' => $panch->name,
            'slug' => $panch->slug,
            'count' => $panch->count
        );
    } else {
        $english_panchayats[] = array(
            'english' => $panch->name,
            'slug' => $panch->slug,
            'count' => $panch->count
        );
    }
}

// Sort by count (most used first)
usort($tamil_panchayats, function ($a, $b) {
    return $b['count'] - $a['count'];
});

// Output results
echo "Total panchayats: " . count($panchayats) . "\n";
echo "Tamil-named: " . count($tamil_panchayats) . "\n";
echo "English-named: " . count($english_panchayats) . "\n\n";

if (!empty($tamil_panchayats)) {
    echo "=================================================================\n";
    echo "TAMIL-NAMED PANCHAYATS (NEED TRANSLATION)\n";
    echo "=================================================================\n\n";

    foreach ($tamil_panchayats as $panch) {
        echo sprintf("  %s (used in %d projects)\n", $panch['tamil'], $panch['count']);
    }
    echo "\n";
}

// Export to JSON
$outputFile = __DIR__ . '/tamil_panchayats_to_translate.json';
$jsonData = array(
    'metadata' => array(
        'total_panchayats' => count($panchayats),
        'tamil_named' => count($tamil_panchayats),
        'english_named' => count($english_panchayats),
        'export_date' => date('Y-m-d H:i:s')
    ),
    'tamil_panchayats' => $tamil_panchayats,
    'english_panchayats' => $english_panchayats
);

file_put_contents($outputFile, json_encode($jsonData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

echo "=================================================================\n";
echo "Exported to: $outputFile\n";
echo "=================================================================\n";
