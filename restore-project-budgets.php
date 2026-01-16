<?php
/**
 * Restore Project Budget Values
 * 
 * This script reads budget values from budget_restore_data.json
 * and updates the _project_budget meta field for each project in WordPress.
 * 
 * Run from command line: php restore-project-budgets.php
 */

// Load WordPress
require_once(__DIR__ . '/wp-load.php');

// Check if we're running in CLI
if (php_sapi_name() !== 'cli') {
    die('This script must be run from the command line.');
}

echo "=== Restore Project Budget Values ===\n\n";

// Load budget data from JSON
$json_file = __DIR__ . '/budget_restore_data.json';
if (!file_exists($json_file)) {
    die("Error: budget_restore_data.json not found!\n");
}

$budget_data = json_decode(file_get_contents($json_file), true);
if (!$budget_data) {
    die("Error: Failed to parse budget_restore_data.json\n");
}

echo "Loaded " . count($budget_data) . " budget values to restore\n\n";

$updated = 0;
$skipped = 0;
$errors = 0;
$total_budget_restored = 0;

foreach ($budget_data as $post_id => $budget) {
    // Check if post exists
    $post = get_post($post_id);
    if (!$post) {
        echo "Warning: Post ID $post_id not found, skipping\n";
        $skipped++;
        continue;
    }

    // Get current budget
    $current_budget = get_post_meta($post_id, '_project_budget', true);

    // Only update if current budget is 0 or empty
    if (empty($current_budget) || floatval($current_budget) == 0) {
        $result = update_post_meta($post_id, '_project_budget', $budget);
        if ($result !== false) {
            $updated++;
            $total_budget_restored += $budget;
            if ($budget >= 10000000) { // 1 Cr or more
                echo "✓ Restored ID=$post_id: ₹" . number_format($budget / 10000000, 2) . " Cr\n";
            }
        } else {
            echo "✗ Failed to update ID=$post_id\n";
            $errors++;
        }
    } else {
        $skipped++;
    }
}

echo "\n=== Summary ===\n";
echo "Updated: $updated projects\n";
echo "Skipped: $skipped projects (already had budget or not found)\n";
echo "Errors: $errors\n";
echo "Total budget restored: ₹" . number_format($total_budget_restored / 10000000, 2) . " Cr\n";
echo "\nDone!\n";
