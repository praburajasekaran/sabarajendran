<?php
/**
 * Flush WordPress Permalinks
 * Run this after importing projects to fix 404 errors
 */

// Load WordPress
require_once( __DIR__ . '/wp-load.php' );

echo "=== Flushing WordPress Permalinks ===\n\n";

// Re-register post types and taxonomies
do_action( 'init' );

// Flush rewrite rules
flush_rewrite_rules();

echo "✅ Permalinks flushed successfully!\n";
echo "✅ Post types re-registered\n";
echo "✅ Rewrite rules updated\n\n";

echo "Now try accessing:\n";
echo "http://localhost:8118/sabarajendran/project/\n\n";

echo "=== Complete ===\n";
