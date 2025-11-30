<?php
/**
 * Simple Permalink Flush Script
 */

// Load WordPress
define('WP_USE_THEMES', false);
require_once( __DIR__ . '/wp-load.php' );

// Flush permalinks
flush_rewrite_rules(false);

echo "Permalinks flushed!\n";
echo "Now visit: http://localhost:8118/sabarajendran/project/\n";
