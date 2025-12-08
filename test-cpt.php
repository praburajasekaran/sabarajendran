<?php
require_once('wp-load.php');

// Check if the post type is registered
$post_types = get_post_types(['public' => true], 'objects');

echo "Registered Public Post Types:\n";
foreach ($post_types as $post_type) {
    echo "- {$post_type->name}: {$post_type->label}\n";
    if ($post_type->name === 'project') {
        echo "  REST Base: " . ($post_type->rest_base ?? 'Not set') . "\n";
        echo "  REST Enabled: " . ($post_type->show_in_rest ? 'Yes' : 'No') . "\n";
    }
}

// Check project count
global $wpdb;
$count = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type='project' AND post_status='publish'");
echo "\nPublished Projects: $count\n";

// Check active plugins
$active_plugins = get_option('active_plugins');
echo "\nActive Plugins containing 'saba':\n";
foreach ($active_plugins as $plugin) {
    if (strpos($plugin, 'saba') !== false) {
        echo "- $plugin\n";
    }
}
