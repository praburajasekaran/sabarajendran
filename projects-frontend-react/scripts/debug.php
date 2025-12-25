<?php
require_once(__DIR__ . '/../../wp-load.php');

echo "Clean Dump Size: " . filesize(__DIR__ . '/clean_dump.sql') . " bytes\n";

global $wpdb;
$id = 759;

// Raw SQL Check
$row = $wpdb->get_row("SELECT * FROM {$wpdb->posts} WHERE ID = $id");
if ($row) {
    echo "RAW SQL: Found ID $id. Status: {$row->post_status}, Type: {$row->post_type}, Title: {$row->post_title}\n";
} else {
    echo "RAW SQL: ID $id NOT FOUND in {$wpdb->posts} table.\n";
}

// WP Function Check
$p = get_post($id);
if ($p) {
    echo "WP func: Found ID $id.\n";
} else {
    echo "WP func: NOT FOUND.\n";
}

// Counts
$counts = wp_count_posts('project');
print_r($counts);
