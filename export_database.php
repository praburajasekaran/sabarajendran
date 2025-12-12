<?php
/**
 * Simple Database Export using PHP
 * Creates a SQL dump without requiring mysqldump
 */

// Load WordPress
require_once __DIR__ . '/wp-load.php';

global $wpdb;

// Output filename
$filename = 'database_export_' . date('Ymd_His') . '.sql';
$filepath = __DIR__ . '/' . $filename;

echo "Starting database export...\n";
echo "Database: " . DB_NAME . "\n";
echo "Output: $filename\n\n";

// Open file for writing
$handle = fopen($filepath, 'w');
if (!$handle) {
    die("Error: Could not create export file\n");
}

// Write header
fwrite($handle, "-- WordPress Database Export\n");
fwrite($handle, "-- Generated: " . date('Y-m-d H:i:s') . "\n");
fwrite($handle, "-- Database: " . DB_NAME . "\n\n");
fwrite($handle, "SET SQL_MODE = \"NO_AUTO_VALUE_ON_ZERO\";\n");
fwrite($handle, "SET time_zone = \"+00:00\";\n\n");

// Get all tables
$tables = $wpdb->get_results("SHOW TABLES", ARRAY_N);

foreach ($tables as $table) {
    $table_name = $table[0];
    echo "Exporting table: $table_name\n";

    // Drop table statement
    fwrite($handle, "\n-- Table structure for table `$table_name`\n");
    fwrite($handle, "DROP TABLE IF EXISTS `$table_name`;\n");

    // Create table statement
    $create_table = $wpdb->get_row("SHOW CREATE TABLE `$table_name`", ARRAY_N);
    fwrite($handle, $create_table[1] . ";\n\n");

    // Get table data
    fwrite($handle, "-- Dumping data for table `$table_name`\n");

    $rows = $wpdb->get_results("SELECT * FROM `$table_name`", ARRAY_A);

    if (!empty($rows)) {
        foreach ($rows as $row) {
            $values = array();
            foreach ($row as $value) {
                if (is_null($value)) {
                    $values[] = 'NULL';
                } else {
                    $values[] = "'" . $wpdb->_real_escape($value) . "'";
                }
            }

            $columns = array_keys($row);
            $columns_str = '`' . implode('`, `', $columns) . '`';
            $values_str = implode(', ', $values);

            fwrite($handle, "INSERT INTO `$table_name` ($columns_str) VALUES ($values_str);\n");
        }
    }

    fwrite($handle, "\n");
}

fclose($handle);

$size = filesize($filepath);
$size_mb = round($size / 1024 / 1024, 2);

echo "\n✓ Database exported successfully!\n";
echo "File: $filename\n";
echo "Size: $size_mb MB\n";
echo "\nYou can now upload this file to the live site.\n";
