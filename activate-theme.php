<?php
/**
 * Activate Saba Rajendran Theme
 */

// Load WordPress
define('WP_USE_THEMES', false);
require_once(__DIR__ . '/wp-load.php');

echo "=== Activating Saba Rajendran Theme ===\n\n";

// Theme slug
$theme_slug = 'saba-rajendran';

// Check if theme exists
$theme = wp_get_theme($theme_slug);

if (!$theme->exists()) {
    echo "❌ Error: Theme '$theme_slug' not found!\n";
    exit(1);
}

echo "✅ Theme found: " . $theme->get('Name') . "\n";
echo "   Version: " . $theme->get('Version') . "\n";
echo "   Location: " . $theme->get_stylesheet_directory() . "\n\n";

// Switch theme
switch_theme($theme_slug);

// Flush permalinks after theme switch
flush_rewrite_rules(false);

echo "✅ Theme activated successfully!\n";
echo "✅ Permalinks flushed\n\n";

// Verify current theme
$current_theme = wp_get_theme();
echo "📌 Current active theme: " . $current_theme->get('Name') . "\n\n";

echo "🌐 Now visit:\n";
echo "   http://localhost:8888/sabarajendran/project/\n\n";

echo "=== Complete ===\n";
