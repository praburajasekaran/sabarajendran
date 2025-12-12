<?php
/**
 * Database Import Script for Live Site
 * Upload this file along with the SQL export to the live site
 * 
 * INSTRUCTIONS:
 * 1. Upload this file and the database_export_*.sql file to the live site root
 * 2. Access this file via browser: https://tan-emu-358425.hostingersite.com/import_database.php
 * 3. The script will automatically find and import the SQL file
 * 4. DELETE this file and the SQL file after successful import for security
 */

// Security check - require a secret key to run
define('IMPORT_SECRET_KEY', 'saba_db_import_2025');

if (!isset($_GET['key']) || $_GET['key'] !== IMPORT_SECRET_KEY) {
    die('Access denied. Please provide the correct key parameter.');
}

// Set execution time and memory limits
set_time_limit(600); // 10 minutes
ini_set('memory_limit', '512M');

echo "<h1>Database Import for Saba Rajendran MLA Site</h1>\n";
echo "<pre>\n";

// Load WordPress
if (file_exists(__DIR__ . '/wp-load.php')) {
    require_once __DIR__ . '/wp-load.php';
    global $wpdb;
} else {
    die("Error: wp-load.php not found. Make sure this script is in the WordPress root directory.\n");
}

// Find the SQL file
$sql_files = glob(__DIR__ . '/database_export_*.sql');

if (empty($sql_files)) {
    die("Error: No database export file found. Please upload the database_export_*.sql file first.\n");
}

// Use the most recent file
$sql_file = end($sql_files);
$filename = basename($sql_file);

echo "Found SQL file: $filename\n";
echo "File size: " . round(filesize($sql_file) / 1024 / 1024, 2) . " MB\n\n";

echo "WARNING: This will replace ALL data in the current database!\n";
echo "Database: " . DB_NAME . "\n";
echo "Host: " . DB_HOST . "\n\n";

// Confirm import
if (!isset($_GET['confirm']) || $_GET['confirm'] !== 'yes') {
    echo "To proceed with the import, add &confirm=yes to the URL\n";
    echo "Example: ?key=" . IMPORT_SECRET_KEY . "&confirm=yes\n";
    exit;
}

echo "Starting import...\n\n";

// Read and execute SQL file
$sql_content = file_get_contents($sql_file);

if ($sql_content === false) {
    die("Error: Could not read SQL file.\n");
}

// Split into individual queries
$queries = explode(";\n", $sql_content);
$total_queries = count($queries);
$executed = 0;
$errors = 0;

echo "Total queries to execute: $total_queries\n\n";

foreach ($queries as $index => $query) {
    $query = trim($query);

    // Skip empty queries and comments
    if (empty($query) || substr($query, 0, 2) === '--') {
        continue;
    }

    // Execute query
    $result = $wpdb->query($query);

    if ($result === false) {
        $errors++;
        if ($errors <= 10) { // Only show first 10 errors
            echo "Error in query " . ($index + 1) . ": " . $wpdb->last_error . "\n";
        }
    } else {
        $executed++;
    }

    // Progress indicator every 100 queries
    if ($executed % 100 === 0) {
        echo "Processed $executed queries...\n";
        flush();
    }
}

echo "\n";
echo "========================================\n";
echo "Import completed!\n";
echo "========================================\n";
echo "Queries executed: $executed\n";
echo "Errors: $errors\n";

if ($errors > 0) {
    echo "\nWARNING: There were $errors errors during import.\n";
    echo "The database may not be fully imported. Check the errors above.\n";
} else {
    echo "\n✓ Database imported successfully!\n";
}

echo "\n";
echo "IMPORTANT: For security, please delete these files now:\n";
echo "1. $filename\n";
echo "2. " . basename(__FILE__) . "\n";
echo "\n";

echo "</pre>\n";
