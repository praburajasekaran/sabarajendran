<?php
/**
 * Remote Database Size Checker
 * Upload this file to your live site root and access via browser
 * URL: https://yoursite.com/check_remote_db_size.php
 */

// Security: Delete this file after use or add password protection
define('ACCESS_PASSWORD', 'check2024'); // Change this password!

if (!isset($_GET['pass']) || $_GET['pass'] !== ACCESS_PASSWORD) {
    die('Access denied. Add ?pass=check2024 to URL');
}

require_once('wp-load.php');

global $wpdb;

echo "<!DOCTYPE html><html><head>";
echo "<style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    .container { background: white; padding: 20px; border-radius: 8px; max-width: 1200px; margin: 0 auto; }
    h1 { color: #0073aa; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #0073aa; color: white; }
    tr:hover { background: #f5f5f5; }
    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
    .danger { background: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0; }
    .success { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; }
    .total { font-size: 24px; font-weight: bold; color: #0073aa; margin: 20px 0; }
</style></head><body><div class='container'>";

echo "<h1>🗄️ Remote Database Size Analysis</h1>";

// Get total database size
$db_name = DB_NAME;
$size_query = "SELECT 
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'total_size_mb'
    FROM information_schema.TABLES 
    WHERE table_schema = '$db_name'";

$total_result = $wpdb->get_row($size_query);
$total_size = $total_result->total_size_mb;

echo "<div class='total'>Total Database Size: {$total_size} MB</div>";

// Show warning based on size
if ($total_size > 1000) {
    echo "<div class='danger'><strong>⚠️ CRITICAL:</strong> Database is very large ({$total_size} MB). Most shared hosting plans limit databases to 1-2 GB.</div>";
} elseif ($total_size > 500) {
    echo "<div class='warning'><strong>⚠️ WARNING:</strong> Database is getting large ({$total_size} MB). Consider cleanup.</div>";
} else {
    echo "<div class='success'><strong>✓ OK:</strong> Database size is reasonable ({$total_size} MB).</div>";
}

// Get table sizes
$query = "SELECT 
    table_name AS 'table_name',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'size_mb',
    ROUND((data_length / 1024 / 1024), 2) AS 'data_mb',
    ROUND((index_length / 1024 / 1024), 2) AS 'index_mb',
    table_rows AS 'rows'
    FROM information_schema.TABLES 
    WHERE table_schema = '$db_name'
    ORDER BY (data_length + index_length) DESC";

$results = $wpdb->get_results($query);

echo "<h2>📊 Tables by Size (Largest First)</h2>";
echo "<table>";
echo "<tr>
    <th>Table Name</th>
    <th>Total Size (MB)</th>
    <th>Data (MB)</th>
    <th>Index (MB)</th>
    <th>Rows</th>
    <th>Type</th>
    <th>Safe to Clean?</th>
</tr>";

$log_tables = ['itsec_logs', 'actionscheduler_logs', 'actionscheduler_claims', 'wfHits', 'wfLogs', 'wfBlocks'];
$total_log_size = 0;

foreach ($results as $row) {
    $is_log = false;
    $table_type = 'Content';
    $safe_to_clean = '❌ No';

    foreach ($log_tables as $log_table) {
        if (strpos($row->table_name, $log_table) !== false) {
            $is_log = true;
            $table_type = 'Logs';
            $safe_to_clean = '✅ Yes';
            $total_log_size += $row->size_mb;
            break;
        }
    }

    if (strpos($row->table_name, 'transient') !== false) {
        $table_type = 'Cache';
        $safe_to_clean = '✅ Yes';
        $total_log_size += $row->size_mb;
    }

    $row_class = $is_log && $row->size_mb > 10 ? "style='background: #fff3cd;'" : "";

    echo "<tr $row_class>";
    echo "<td><strong>{$row->table_name}</strong></td>";
    echo "<td>{$row->size_mb}</td>";
    echo "<td>{$row->data_mb}</td>";
    echo "<td>{$row->index_mb}</td>";
    echo "<td>" . number_format($row->rows) . "</td>";
    echo "<td>{$table_type}</td>";
    echo "<td>{$safe_to_clean}</td>";
    echo "</tr>";
}

echo "</table>";

echo "<div class='warning'>";
echo "<h3>💡 Cleanup Potential</h3>";
echo "<p><strong>Total size in log/cache tables: " . round($total_log_size, 2) . " MB</strong></p>";
echo "<p>These tables can be safely cleaned to free up space without affecting your content.</p>";
echo "</div>";

echo "<h3>🔧 Next Steps</h3>";
echo "<ol>";
echo "<li>If you see large log tables (highlighted in yellow), upload <code>cleanup_remote_db_logs.php</code> to clean them</li>";
echo "<li>After cleanup, try activating your database optimization plugin again</li>";
echo "<li><strong>IMPORTANT:</strong> Delete this file after checking for security</li>";
echo "</ol>";

echo "<p style='margin-top: 40px; color: #666; font-size: 12px;'>Generated: " . date('Y-m-d H:i:s') . " | WordPress " . get_bloginfo('version') . "</p>";

echo "</div></body></html>";
?>