<?php
/**
 * Remote Database Log Cleanup Script
 * Upload this file to your live site root and access via browser
 * URL: https://yoursite.com/cleanup_remote_db_logs.php
 * 
 * IMPORTANT: This will delete log data. Make sure you've checked the database first!
 */

// Security: Password protection
define('CLEANUP_PASSWORD', 'cleanup2024'); // Change this password!

if (!isset($_GET['pass']) || $_GET['pass'] !== CLEANUP_PASSWORD) {
    die('Access denied. Add ?pass=cleanup2024 to URL');
}

require_once('wp-load.php');

global $wpdb;

// Prevent accidental execution - require confirmation
$confirm = isset($_GET['confirm']) && $_GET['confirm'] === 'yes';

echo "<!DOCTYPE html><html><head>";
echo "<style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    .container { background: white; padding: 20px; border-radius: 8px; max-width: 900px; margin: 0 auto; }
    h1 { color: #dc3545; }
    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
    .danger { background: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0; }
    .success { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; }
    .info { background: #d1ecf1; border-left: 4px solid #0c5460; padding: 15px; margin: 20px 0; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #0073aa; color: white; }
    .btn { display: inline-block; padding: 12px 24px; background: #dc3545; color: white; text-decoration: none; border-radius: 4px; margin: 10px 5px; }
    .btn:hover { background: #c82333; }
    .btn-secondary { background: #6c757d; }
    .btn-secondary:hover { background: #5a6268; }
</style></head><body><div class='container'>";

echo "<h1>🧹 Database Log Cleanup</h1>";

if (!$confirm) {
    // Show what will be cleaned
    echo "<div class='danger'>";
    echo "<h3>⚠️ WARNING: This will delete log data!</h3>";
    echo "<p>This script will clean the following tables:</p>";
    echo "</div>";

    $tables_to_clean = [
        $wpdb->prefix . 'itsec_logs' => 'iThemes Security / Wordfence logs',
        $wpdb->prefix . 'actionscheduler_logs' => 'Background task logs',
        $wpdb->prefix . 'actionscheduler_claims' => 'Background task claims',
        $wpdb->prefix . 'wfHits' => 'Wordfence traffic logs',
        $wpdb->prefix . 'wfLogs' => 'Wordfence security logs',
        $wpdb->prefix . 'wfBlocks' => 'Wordfence blocked IPs (old)',
    ];

    echo "<table>";
    echo "<tr><th>Table</th><th>Description</th><th>Current Size</th><th>Rows</th></tr>";

    $total_size = 0;
    $total_rows = 0;

    foreach ($tables_to_clean as $table => $description) {
        $size_query = "SELECT 
            ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb,
            table_rows
            FROM information_schema.TABLES 
            WHERE table_schema = '" . DB_NAME . "' 
            AND table_name = '$table'";

        $result = $wpdb->get_row($size_query);

        if ($result) {
            $size_mb = $result->size_mb ?? 0;
            $rows = $result->table_rows ?? 0;
            $total_size += $size_mb;
            $total_rows += $rows;

            echo "<tr>";
            echo "<td><code>$table</code></td>";
            echo "<td>$description</td>";
            echo "<td>{$size_mb} MB</td>";
            echo "<td>" . number_format($rows) . "</td>";
            echo "</tr>";
        }
    }

    echo "</table>";

    echo "<div class='info'>";
    echo "<h3>📊 Cleanup Summary</h3>";
    echo "<p><strong>Total space to be freed: ~" . round($total_size, 2) . " MB</strong></p>";
    echo "<p><strong>Total rows to be deleted: " . number_format($total_rows) . "</strong></p>";
    echo "</div>";

    echo "<div class='warning'>";
    echo "<h3>ℹ️ What will happen:</h3>";
    echo "<ul>";
    echo "<li>✅ Your content (posts, pages, projects) will NOT be affected</li>";
    echo "<li>✅ Your settings and options will remain intact</li>";
    echo "<li>❌ Historical security logs will be deleted</li>";
    echo "<li>❌ Background task logs will be deleted</li>";
    echo "</ul>";
    echo "</div>";

    $current_url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

    echo "<div style='text-align: center; margin: 30px 0;'>";
    echo "<a href='{$current_url}&confirm=yes' class='btn' onclick='return confirm(\"Are you absolutely sure? This cannot be undone!\")'>🗑️ Yes, Clean Database Now</a>";
    echo "<a href='check_remote_db_size.php?pass=" . CLEANUP_PASSWORD . "' class='btn btn-secondary'>← Back to Check Size</a>";
    echo "</div>";

} else {
    // Perform cleanup
    echo "<div class='info'><h3>🔄 Cleaning database...</h3></div>";

    $tables_to_clean = [
        $wpdb->prefix . 'itsec_logs',
        $wpdb->prefix . 'actionscheduler_logs',
        $wpdb->prefix . 'actionscheduler_claims',
        $wpdb->prefix . 'wfHits',
        $wpdb->prefix . 'wfLogs',
        $wpdb->prefix . 'wfBlocks',
    ];

    echo "<table>";
    echo "<tr><th>Table</th><th>Status</th><th>Rows Deleted</th></tr>";

    foreach ($tables_to_clean as $table) {
        // Check if table exists
        $table_exists = $wpdb->get_var("SHOW TABLES LIKE '$table'");

        if ($table_exists) {
            // Get row count before
            $rows_before = $wpdb->get_var("SELECT COUNT(*) FROM $table");

            // Truncate table (faster than DELETE)
            $result = $wpdb->query("TRUNCATE TABLE $table");

            if ($result !== false) {
                echo "<tr>";
                echo "<td><code>$table</code></td>";
                echo "<td><span style='color: green;'>✅ Cleaned</span></td>";
                echo "<td>" . number_format($rows_before) . "</td>";
                echo "</tr>";
            } else {
                echo "<tr>";
                echo "<td><code>$table</code></td>";
                echo "<td><span style='color: red;'>❌ Error</span></td>";
                echo "<td>-</td>";
                echo "</tr>";
            }
        } else {
            echo "<tr>";
            echo "<td><code>$table</code></td>";
            echo "<td><span style='color: gray;'>⊘ Not found</span></td>";
            echo "<td>-</td>";
            echo "</tr>";
        }
    }

    echo "</table>";

    // Optimize tables
    echo "<div class='info'><h3>🔧 Optimizing tables...</h3></div>";

    foreach ($tables_to_clean as $table) {
        $table_exists = $wpdb->get_var("SHOW TABLES LIKE '$table'");
        if ($table_exists) {
            $wpdb->query("OPTIMIZE TABLE $table");
        }
    }

    echo "<div class='success'>";
    echo "<h3>✅ Cleanup Complete!</h3>";
    echo "<p>Database logs have been cleaned and tables optimized.</p>";
    echo "</div>";

    echo "<div style='text-align: center; margin: 30px 0;'>";
    echo "<a href='check_remote_db_size.php?pass=" . CLEANUP_PASSWORD . "' class='btn btn-secondary'>📊 Check New Database Size</a>";
    echo "</div>";

    echo "<div class='warning'>";
    echo "<h3>🔒 Security Reminder</h3>";
    echo "<p><strong>DELETE THIS FILE NOW!</strong> This script should not remain on your server.</p>";
    echo "<p>Delete both:</p>";
    echo "<ul>";
    echo "<li><code>cleanup_remote_db_logs.php</code></li>";
    echo "<li><code>check_remote_db_size.php</code></li>";
    echo "</ul>";
    echo "</div>";
}

echo "<p style='margin-top: 40px; color: #666; font-size: 12px;'>Generated: " . date('Y-m-d H:i:s') . "</p>";
echo "</div></body></html>";
?>