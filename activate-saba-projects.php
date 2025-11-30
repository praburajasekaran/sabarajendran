<?php
/**
 * Activate Saba Projects Plugin and Flush Permalinks
 * 
 * This script activates the Saba Projects plugin and flushes permalinks
 * to ensure the /project/ URL structure works correctly.
 */

// Load WordPress
require_once __DIR__ . '/wp-load.php';

// Check if we're running from command line or browser
$is_cli = php_sapi_name() === 'cli';

if (!$is_cli) {
    echo "<h1>Activating Saba Projects Plugin</h1>";
    echo "<pre>";
}

// Plugin path relative to plugins directory
$plugin_path = 'saba-projects/saba-projects.php';

// Check if plugin exists
if (!file_exists(WP_PLUGIN_DIR . '/' . $plugin_path)) {
    echo "❌ ERROR: Plugin file not found at: " . WP_PLUGIN_DIR . '/' . $plugin_path . "\n";
    exit(1);
}

// Check if plugin is already active
if (is_plugin_active($plugin_path)) {
    echo "✓ Plugin is already active!\n";
} else {
    // Activate the plugin
    $result = activate_plugin($plugin_path);

    if (is_wp_error($result)) {
        echo "❌ ERROR activating plugin: " . $result->get_error_message() . "\n";
        exit(1);
    } else {
        echo "✓ Plugin activated successfully!\n";
    }
}

// Flush rewrite rules to enable the /project/ URL
flush_rewrite_rules();
echo "✓ Permalinks flushed successfully!\n";

// Test if the custom post type is registered
$post_types = get_post_types(['public' => true], 'objects');
if (isset($post_types['project'])) {
    echo "✓ 'project' custom post type is registered!\n";
    echo "  - Archive URL: " . get_post_type_archive_link('project') . "\n";
} else {
    echo "❌ WARNING: 'project' custom post type not found!\n";
}

// Check registered taxonomies
$taxonomies = ['project_category', 'project_village', 'project_year', 'project_status', 'project_scheme'];
echo "\n✓ Checking taxonomies:\n";
foreach ($taxonomies as $taxonomy) {
    if (taxonomy_exists($taxonomy)) {
        echo "  ✓ {$taxonomy} is registered\n";
    } else {
        echo "  ❌ {$taxonomy} NOT registered\n";
    }
}

// Count existing projects
$project_count = wp_count_posts('project');
echo "\n📊 Current project count: " . ($project_count->publish ?? 0) . " published\n";

echo "\n🎉 Setup complete! You can now access:\n";
echo "   - Projects archive: http://localhost:8118/sabarajendran/project/\n";
echo "   - WordPress admin: http://localhost:8118/sabarajendran/wp-admin/\n";
echo "   - Add new project: http://localhost:8118/sabarajendran/wp-admin/post-new.php?post_type=project\n";

if (!$is_cli) {
    echo "</pre>";
}
