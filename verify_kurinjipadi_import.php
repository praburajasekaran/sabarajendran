<?php
/**
 * Verify Kurinjipadi Import
 *
 * Compares the number of projects on the live site with the local database
 * to verify that the import was successful.
 */

// Load WordPress
require_once __DIR__ . '/wp-load.php';

// Configuration
$LIVE_SITE = 'https://tan-emu-358425.hostingersite.com';
$KURINJIPADI_BLOCK_ID = 266;

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "  Kurinjipadi Import Verification\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

// Fetch expected count from live site
echo "Fetching project count from live site...\n";
$response = wp_remote_get("{$LIVE_SITE}/wp-json/wp/v2/project_block", [
    'timeout' => 30,
    'headers' => ['User-Agent' => 'WordPress Verification Script']
]);

if (is_wp_error($response)) {
    echo "❌ Error fetching from live site: " . $response->get_error_message() . "\n";
    exit(1);
}

$blocks = json_decode(wp_remote_retrieve_body($response), true);
if (!$blocks) {
    echo "❌ Error: Could not parse response from live site\n";
    exit(1);
}

// Find Kurinjipadi block
$kurinjipadi = array_filter($blocks, fn($b) => $b['id'] == $KURINJIPADI_BLOCK_ID);
if (empty($kurinjipadi)) {
    echo "❌ Error: Kurinjipadi block not found on live site\n";
    exit(1);
}

$kurinjipadi = reset($kurinjipadi);
$expected_count = $kurinjipadi['count'];

// Count local projects
echo "Counting local projects...\n";
$args = [
    'post_type' => 'project',
    'tax_query' => [
        [
            'taxonomy' => 'project_block',
            'field' => 'slug',
            'terms' => 'kurinjipadi'
        ]
    ],
    'posts_per_page' => -1,
    'fields' => 'ids'
];

$query = new WP_Query($args);
$local_count = $query->found_posts;

// Display results
echo "\n";
echo "Expected (live site):  {$expected_count} projects\n";
echo "Imported (local):      {$local_count} projects\n";
echo "\n";

if ($local_count >= $expected_count) {
    echo "✅ SUCCESS: All {$expected_count} projects imported successfully!\n\n";

    // Show breakdown by status
    echo "Breakdown:\n";
    $status_args = [
        'post_type' => 'project',
        'tax_query' => [
            [
                'taxonomy' => 'project_block',
                'field' => 'slug',
                'terms' => 'kurinjipadi'
            ]
        ],
        'posts_per_page' => -1,
        'fields' => 'ids'
    ];

    // Count by status
    $statuses = ['completed', 'in-progress'];
    foreach ($statuses as $status) {
        $status_args['tax_query'][] = [
            'taxonomy' => 'project_status',
            'field' => 'slug',
            'terms' => $status
        ];
        $status_query = new WP_Query($status_args);
        echo "  - " . ucwords(str_replace('-', ' ', $status)) . ": {$status_query->found_posts}\n";
        array_pop($status_args['tax_query']);
    }

    echo "\n";
    exit(0);
} else {
    $missing = $expected_count - $local_count;
    echo "❌ INCOMPLETE: {$missing} projects missing\n";
    echo "\nTo resume the import, run:\n";
    echo "php import_kurinjipadi_live.php\n\n";
    exit(1);
}
