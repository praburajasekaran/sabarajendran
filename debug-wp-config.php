<?php
/**
 * Debug WordPress Configuration
 * Check active theme, plugins, and rewrite rules
 */

require_once __DIR__ . '/wp-load.php';

echo "=== WordPress Configuration Debug ===\n\n";

// Check active theme
$theme = wp_get_theme();
echo "Active Theme: " . $theme->get('Name') . " (v" . $theme->get('Version') . ")\n";
echo "Theme Directory: " . $theme->get_stylesheet() . "\n\n";

// Check if saba-projects plugin is active
$active_plugins = get_option('active_plugins');
echo "Active Plugins:\n";
foreach ($active_plugins as $plugin) {
    echo "  - " . $plugin . "\n";
}
echo "\n";

// Check permalink structure
echo "Permalink Structure: " . get_option('permalink_structure') . "\n";
echo "Rewrite Base: " . get_option('rewrite_rules') ? "Rules exist\n" : "No rules\n";
echo "\n";

// Check if project post type exists
$post_type = get_post_type_object('project');
if ($post_type) {
    echo "✓ Project post type exists\n";
    echo "  - Has archive: " . ($post_type->has_archive ? 'Yes' : 'No') . "\n";
    echo "  - Rewrite slug: " . ($post_type->rewrite['slug'] ?? 'N/A') . "\n";
    echo "  - Public: " . ($post_type->public ? 'Yes' : 'No') . "\n";
    echo "  - Publicly queryable: " . ($post_type->publicly_queryable ? 'Yes' : 'No') . "\n";
} else {
    echo "❌ Project post type NOT found\n";
}
echo "\n";

// Get rewrite rules
$rewrite_rules = get_option('rewrite_rules');
echo "Rewrite Rules for 'project':\n";
if ($rewrite_rules) {
    foreach ($rewrite_rules as $pattern => $replacement) {
        if (strpos($pattern, 'project') !== false) {
            echo "  $pattern => $replacement\n";
        }
    }
} else {
    echo "  No rewrite rules found!\n";
}
echo "\n";

// Check .htaccess
$htaccess_file = ABSPATH . '.htaccess';
if (file_exists($htaccess_file)) {
    echo "✓ .htaccess file exists\n";
    echo "  Location: $htaccess_file\n";
    echo "  Writable: " . (is_writable($htaccess_file) ? 'Yes' : 'No') . "\n";
} else {
    echo "❌ .htaccess file NOT found\n";
}
echo "\n";

// Try to manually flush rewrite rules again
flush_rewrite_rules(true); // true = hard flush
echo "✓ Rewrite rules flushed (hard)\n\n";

// Test query
$test_query = new WP_Query([
    'post_type' => 'project',
    'posts_per_page' => 1,
]);

echo "Test Query Results:\n";
echo "  Found posts: " . $test_query->found_posts . "\n";
if ($test_query->have_posts()) {
    $test_query->the_post();
    echo "  Sample project: " . get_the_title() . "\n";
    echo "  Permalink: " . get_permalink() . "\n";
    wp_reset_postdata();
}
