<?php
/**
 * Flush WordPress rewrite rules to register new taxonomies
 * Run this once after adding new taxonomies
 */

// Load WordPress
require_once(__DIR__ . '/wp-load.php');

// Flush rewrite rules
flush_rewrite_rules();

echo "✅ Rewrite rules flushed successfully!\n";
echo "New taxonomies (project_panchayat and project_block) are now registered.\n\n";

// Verify the new taxonomies exist
$taxonomies = get_taxonomies(['public' => true], 'names');
echo "Registered taxonomies:\n";
foreach ($taxonomies as $taxonomy) {
    if (strpos($taxonomy, 'project_') === 0) {
        echo "  - $taxonomy\n";
    }
}
