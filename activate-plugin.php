<?php
/**
 * Activate Saba Projects Plugin
 * Run this to activate the plugin via command line
 */

// Load WordPress
require_once(__DIR__ . '/wp-load.php');

echo "=== Activating Saba Projects Plugin ===\n\n";

// Plugin path relative to plugins directory
$plugin = 'saba-projects/saba-projects.php';

// Check if plugin exists
$plugin_path = WP_PLUGIN_DIR . '/' . $plugin;
if (!file_exists($plugin_path)) {
    echo "❌ Error: Plugin file not found at: $plugin_path\n";
    exit(1);
}

echo "✅ Plugin file found: $plugin_path\n";

// Check if already active
if (is_plugin_active($plugin)) {
    echo "ℹ️  Plugin is already active!\n\n";
} else {
    // Activate the plugin
    $result = activate_plugin($plugin);

    if (is_wp_error($result)) {
        echo "❌ Error activating plugin: " . $result->get_error_message() . "\n";
        exit(1);
    } else {
        echo "✅ Plugin activated successfully!\n\n";
    }
}

// Trigger init to register post types
do_action('init');

// Flush rewrite rules
flush_rewrite_rules();

echo "✅ Rewrite rules flushed\n";
echo "✅ Post types registered\n\n";

// Check if project post type is registered
$post_types = get_post_types(array('public' => true), 'names');
if (in_array('project', $post_types)) {
    echo "✅ 'project' post type is now registered!\n\n";
} else {
    echo "⚠️  Warning: 'project' post type not found\n\n";
}

// Count projects
$project_count = wp_count_posts('project');
echo "📊 Projects in database: " . $project_count->publish . " published\n\n";

echo "🌐 Now try accessing:\n";
echo "   http://localhost:8888/sabarajendran/project/\n\n";

echo "=== Complete ===\n";
