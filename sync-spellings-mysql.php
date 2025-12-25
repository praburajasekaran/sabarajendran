<?php
/**
 * Sync Tamil Spelling Corrections - Direct MySQL Version
 * 
 * This version uses direct MySQL queries instead of WordPress functions
 * to avoid wp-load.php issues in CLI mode.
 */

// Parse wp-config.php to get database credentials
$wpConfigPath = __DIR__ . '/wp-config.php';
if (!file_exists($wpConfigPath)) {
    die("Error: wp-config.php not found\n");
}

$wpConfig = file_get_contents($wpConfigPath);
preg_match("/define\(\s*'DB_NAME',\s*'([^']+)'/", $wpConfig, $dbName);
preg_match("/define\(\s*'DB_USER',\s*'([^']+)'/", $wpConfig, $dbUser);
preg_match("/define\(\s*'DB_PASSWORD',\s*'([^']+)'/", $wpConfig, $dbPass);
preg_match("/define\(\s*'DB_HOST',\s*'([^']+)'/", $wpConfig, $dbHost);
preg_match("/\\$table_prefix\\s*=\\s*'([^']+)'/", $wpConfig, $tablePrefix);

if (!isset($tablePrefix[1])) {
    $tablePrefix[1] = 'wp_'; // Default fallback
}

$db = new mysqli(
    $dbHost[1],
    $dbUser[1],
    $dbPass[1],
    $dbName[1]
);

if ($db->connect_error) {
    die("Database connection failed: " . $db->connect_error . "\n");
}

$db->set_charset('utf8mb4');
$prefix = $tablePrefix[1];

echo "Connected to database: {$dbName[1]}\n";
echo "Table prefix: {$prefix}\n";

// Load corrections
$correctionsFile = __DIR__ . '/tamil-spelling-corrections.ts';
if (!file_exists($correctionsFile)) {
    die("Error: tamil-spelling-corrections.ts not found\n");
}

function getTamilSpellingCorrections($filePath)
{
    $content = file_get_contents($filePath);
    preg_match('/export const tamilSpellingCorrections[^{]*({[^}]+});/s', $content, $matches);
    if (!isset($matches[1])) {
        die("Error: Could not parse corrections file\n");
    }

    $objStr = $matches[1];
    $objStr = preg_replace('/[\'"]([^\'"]+)[\'"]\s*:\s*[\'"]([^\'"]+)[\'"],?/u', '"$1" => "$2",', $objStr);
    $objStr = rtrim($objStr, ',');

    eval ('$corrections = ' . $objStr . ';');
    return $corrections;
}

$corrections = getTamilSpellingCorrections($correctionsFile);
echo "Loaded " . count($corrections) . " corrections\n";
echo "---------------------------------------------------\n";

$villageUpdates = 0;
$panchayatUpdates = 0;
$titleUpdates = 0;
$maxPasses = 5;

// 1. Update Village Names
echo "Checking Villages...\n";
$result = $db->query("
    SELECT tm.meta_id, tm.term_id, tm.meta_value, t.name
    FROM {$prefix}termmeta tm
    JOIN {$prefix}term_taxonomy tt ON tm.term_id = tt.term_id
    JOIN {$prefix}terms t ON tt.term_id = t.term_id
    WHERE tm.meta_key = '_village_name_tamil'
    AND tt.taxonomy = 'project_village'
    AND tm.meta_value != ''
");

while ($row = $result->fetch_assoc()) {
    $originalName = $row['meta_value'];
    $tamilName = $originalName;

    for ($pass = 0; $pass < $maxPasses; $pass++) {
        $replaced = false;
        foreach ($corrections as $wrong => $correct) {
            if (strpos($tamilName, $wrong) !== false) {
                $tamilName = str_replace($wrong, $correct, $tamilName);
                $replaced = true;
            }
        }
        if (!$replaced)
            break;
    }

    if ($tamilName !== $originalName) {
        $escapedName = $db->real_escape_string($tamilName);
        $db->query("UPDATE {$prefix}termmeta SET meta_value = '{$escapedName}' WHERE meta_id = {$row['meta_id']}");
        echo "  [V] {$row['name']}: {$originalName} -> {$tamilName}\n";
        $villageUpdates++;
    }
}

// 2. Update Panchayat Names
echo "Checking Panchayats...\n";
$result = $db->query("
    SELECT tm.meta_id, tm.term_id, tm.meta_value, t.name
    FROM {$prefix}termmeta tm
    JOIN {$prefix}term_taxonomy tt ON tm.term_id = tt.term_id
    JOIN {$prefix}terms t ON tt.term_id = t.term_id
    WHERE tm.meta_key = 'panchayat_name_tamil'
    AND tt.taxonomy = 'project_panchayat'
    AND tm.meta_value != ''
");

while ($row = $result->fetch_assoc()) {
    $originalName = $row['meta_value'];
    $tamilName = $originalName;

    for ($pass = 0; $pass < $maxPasses; $pass++) {
        $replaced = false;
        foreach ($corrections as $wrong => $correct) {
            if (strpos($tamilName, $wrong) !== false) {
                $tamilName = str_replace($wrong, $correct, $tamilName);
                $replaced = true;
            }
        }
        if (!$replaced)
            break;
    }

    if ($tamilName !== $originalName) {
        $escapedName = $db->real_escape_string($tamilName);
        $db->query("UPDATE {$prefix}termmeta SET meta_value = '{$escapedName}' WHERE meta_id = {$row['meta_id']}");
        echo "  [P] {$row['name']}: {$originalName} -> {$tamilName}\n";
        $panchayatUpdates++;
    }
}

// 3. Update Project Titles
echo "Checking Project Titles...\n";
$result = $db->query("
    SELECT pm.meta_id, pm.post_id, pm.meta_value
    FROM {$prefix}postmeta pm
    JOIN {$prefix}posts p ON pm.post_id = p.ID
    WHERE pm.meta_key = '_project_title_tamil'
    AND p.post_type = 'project'
    AND pm.meta_value != ''
");

while ($row = $result->fetch_assoc()) {
    $originalTitle = $row['meta_value'];
    $tamilTitle = $originalTitle;

    for ($pass = 0; $pass < $maxPasses; $pass++) {
        $replaced = false;
        foreach ($corrections as $wrong => $correct) {
            if (strpos($tamilTitle, $wrong) !== false) {
                $tamilTitle = str_replace($wrong, $correct, $tamilTitle);
                $replaced = true;
            }
        }
        if (!$replaced)
            break;
    }

    if ($tamilTitle !== $originalTitle) {
        $escapedTitle = $db->real_escape_string($tamilTitle);
        $db->query("UPDATE {$prefix}postmeta SET meta_value = '{$escapedTitle}' WHERE meta_id = {$row['meta_id']}");
        echo "  [T] #{$row['post_id']}: Corrected spelling in title\n";
        $titleUpdates++;
    }
}

$db->close();

echo "---------------------------------------------------\n";
echo "DONE! Updated: Villages: {$villageUpdates}, Panchayats: {$panchayatUpdates}, Titles: {$titleUpdates}\n";
