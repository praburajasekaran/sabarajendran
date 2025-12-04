<?php
/**
 * Test if API returns block and panchayat data
 */

// Fetch one project from the API
$response = file_get_contents('http://localhost:8118/sabarajendran/wp-json/wp/v2/project?per_page=1&_embed');
$data = json_decode($response, true);

if (empty($data)) {
    echo "❌ No projects returned from API\n";
    exit(1);
}

$project = $data[0];

echo "📦 Testing Project API Response\n";
echo str_repeat("=", 60) . "\n\n";

echo "Project ID: " . $project['id'] . "\n";
echo "Title: " . $project['title']['rendered'] . "\n\n";

echo "Checking embedded terms:\n";
echo str_repeat("-", 60) . "\n";

if (isset($project['_embedded']['wp:term'])) {
    $termGroups = $project['_embedded']['wp:term'];

    echo "Found " . count($termGroups) . " term groups\n\n";

    foreach ($termGroups as $idx => $terms) {
        if (!empty($terms)) {
            echo "Group $idx:\n";
            foreach ($terms as $term) {
                echo "  - {$term['name']} (taxonomy: {$term['taxonomy']})\n";
            }
            echo "\n";
        }
    }

    // Check specifically for block and panchayat
    echo "\nSearching for block and panchayat:\n";
    echo str_repeat("-", 60) . "\n";

    $foundBlock = false;
    $foundPanchayat = false;

    foreach ($termGroups as $terms) {
        foreach ($terms as $term) {
            if ($term['taxonomy'] === 'project_block') {
                echo "✅ Found Block: {$term['name']}\n";
                $foundBlock = true;
            }
            if ($term['taxonomy'] === 'project_panchayat') {
                echo "✅ Found Panchayat: {$term['name']}\n";
                $foundPanchayat = true;
            }
        }
    }

    if (!$foundBlock) {
        echo "❌ Block taxonomy not found\n";
    }
    if (!$foundPanchayat) {
        echo "⚠️  Panchayat taxonomy not found (may not be assigned to this project)\n";
    }
} else {
    echo "❌ No embedded terms found\n";
}
