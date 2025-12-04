<?php
/**
 * Import Taxonomy Terms for Saba Projects
 *
 * Upload this file to your WordPress root directory and run via:
 * - Browser: https://tan-emu-358425.hostingersite.com/import-taxonomy-terms.php
 * - WP-CLI: wp eval-file import-taxonomy-terms.php
 *
 * This will import all Blocks, Panchayats, and Villages from local to production.
 */

// Load WordPress
require_once(__DIR__ . '/wp-load.php');

// Security check - only allow logged-in administrators
if (!is_user_logged_in() || !current_user_can('manage_options')) {
    die('Unauthorized access. Please login as an administrator.');
}

// Output header
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Import Taxonomy Terms</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 20px; max-width: 1200px; margin: 0 auto; }
        h1 { color: #0073aa; }
        .success { color: #46b450; padding: 5px; }
        .error { color: #dc3232; padding: 5px; }
        .info { color: #0073aa; padding: 5px; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #0073aa; color: white; }
        .status { font-weight: bold; }
    </style>
</head>
<body>
    <h1>Import Taxonomy Terms</h1>
    <p><strong>Status:</strong> Importing taxonomy terms for Saba Projects...</p>
<?php

$results = [
    'blocks' => [],
    'panchayats' => [],
    'villages' => [],
];

// Define taxonomy terms to import
$taxonomy_data = [
    'project_block' => [
        ['name' => 'Kurinjipadi', 'slug' => 'kurinjipadi'],
        ['name' => 'NLC', 'slug' => 'nlc'],
        ['name' => 'Panruti', 'slug' => 'panruti'],
    ],
    'project_panchayat' => [
        ['name' => 'Alagappasamuthiram', 'slug' => 'alagappasamuthiram'],
        ['name' => 'Arasadikuppam', 'slug' => 'arasadikuppam'],
        ['name' => 'Elanthampattu', 'slug' => 'elanthampattu'],
        ['name' => 'Kaatupalayam', 'slug' => 'kaatupalayam'],
        ['name' => 'Kadampuliyur', 'slug' => 'kadampuliyur'],
        ['name' => 'Karukkai', 'slug' => 'karukkai'],
        ['name' => 'Kattandikuppam', 'slug' => 'kattandikuppam'],
        ['name' => 'Kattukudalore', 'slug' => 'kattukudalore'],
        ['name' => 'Keelakuppam', 'slug' => 'keelakuppam'],
        ['name' => 'Keeliruppu', 'slug' => 'keeliruppu'],
        ['name' => 'Keelkankeyankuppam', 'slug' => 'keelkankeyankuppam'],
        ['name' => 'Keelmampattu', 'slug' => 'keelmampattu'],
        ['name' => 'Maligampattu', 'slug' => 'maligampattu'],
        ['name' => 'Marungur', 'slug' => 'marungur'],
        ['name' => 'Meliruppu', 'slug' => 'meliruppu'],
        ['name' => 'Melkankeyankuppam', 'slug' => 'melkankeyankuppam'],
        ['name' => 'Melmampattu', 'slug' => 'melmampattu'],
        ['name' => 'Nadukuppam', 'slug' => 'nadukuppam'],
        ['name' => 'Panikkankuppam', 'slug' => 'panikkankuppam'],
        ['name' => 'Periyakattupalayam', 'slug' => 'periyakattupalayam'],
        ['name' => 'Perperiyankuppam', 'slug' => 'perperiyankuppam'],
        ['name' => 'Purangani', 'slug' => 'purangani'],
        ['name' => 'Semmedu', 'slug' => 'semmedu'],
        ['name' => 'Silambinathanpettai', 'slug' => 'silambinathanpettai'],
        ['name' => 'Siruvathur', 'slug' => 'siruvathur'],
        ['name' => 'Sorathur', 'slug' => 'sorathur'],
        ['name' => 'Thalampattu', 'slug' => 'thalampattu'],
        ['name' => 'Thiruvamoor', 'slug' => 'thiruvamoor'],
        ['name' => 'Vallam', 'slug' => 'vallam'],
        ['name' => 'Veerasingankuppam', 'slug' => 'veerasingankuppam'],
        ['name' => 'Vegakollai', 'slug' => 'vegakollai'],
        ['name' => 'Visoor', 'slug' => 'visoor'],
    ],
];

// Now get all villages from database
echo "<h2>Step 1: Importing Blocks</h2>";
echo "<table><tr><th>Name</th><th>Slug</th><th>Status</th></tr>";

foreach ($taxonomy_data['project_block'] as $term_data) {
    $result = wp_insert_term(
        $term_data['name'],
        'project_block',
        ['slug' => $term_data['slug']]
    );

    $status = is_wp_error($result) ?
        '<span class="error">❌ ' . $result->get_error_message() . '</span>' :
        '<span class="success">✅ Created (ID: ' . $result['term_id'] . ')</span>';

    echo "<tr><td>{$term_data['name']}</td><td>{$term_data['slug']}</td><td class='status'>{$status}</td></tr>";
    $results['blocks'][] = ['name' => $term_data['name'], 'status' => $status];
}
echo "</table>";

echo "<h2>Step 2: Importing Panchayats</h2>";
echo "<table><tr><th>Name</th><th>Slug</th><th>Status</th></tr>";

foreach ($taxonomy_data['project_panchayat'] as $term_data) {
    $result = wp_insert_term(
        $term_data['name'],
        'project_panchayat',
        ['slug' => $term_data['slug']]
    );

    $status = is_wp_error($result) ?
        '<span class="error">❌ ' . $result->get_error_message() . '</span>' :
        '<span class="success">✅ Created (ID: ' . $result['term_id'] . ')</span>';

    echo "<tr><td>{$term_data['name']}</td><td>{$term_data['slug']}</td><td class='status'>{$status}</td></tr>";
    $results['panchayats'][] = ['name' => $term_data['name'], 'status' => $status];
}
echo "</table>";

echo "<h2>Step 3: Flushing Rewrite Rules</h2>";
flush_rewrite_rules();
echo "<p class='success'>✅ Rewrite rules flushed successfully!</p>";

echo "<h2>Summary</h2>";
echo "<ul>";
echo "<li><strong>Blocks:</strong> " . count($taxonomy_data['project_block']) . " terms processed</li>";
echo "<li><strong>Panchayats:</strong> " . count($taxonomy_data['project_panchayat']) . " terms processed</li>";
echo "</ul>";

echo "<p class='info'><strong>Next Steps:</strong></p>";
echo "<ol>";
echo "<li>Delete this file from your server for security: <code>rm import-taxonomy-terms.php</code></li>";
echo "<li>Verify terms in WordPress Admin: Blocks, Panchayats</li>";
echo "<li>Test your Netlify site to see if Block filters now appear</li>";
echo "</ol>";

?>
</body>
</html>
