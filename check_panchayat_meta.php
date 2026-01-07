<?php
/**
 * Check panchayat term meta keys
 */

// Load WordPress
require_once(__DIR__ . '/wp-load.php');

$term_id = 391; // Vadakuthu panchayat
echo "Checking term meta for term ID: $term_id\n\n";

// Get all meta for this term
$all_meta = get_term_meta($term_id);
echo "All meta keys for this term:\n";
print_r($all_meta);

// Check specific keys
echo "\n\nChecking specific keys:\n";
$keys_to_check = ['panchayat_name_tamil', 'panchayat_name_english', '_panchayat_name_tamil', '_panchayat_name_english'];
foreach ($keys_to_check as $key) {
    $value = get_term_meta($term_id, $key, true);
    echo "$key: " . ($value ? $value : '[EMPTY]') . "\n";
}

// Also check with wp_get_object_terms to see what the term looks like
echo "\n\nTerm details:\n";
$term = get_term($term_id);
print_r($term);
