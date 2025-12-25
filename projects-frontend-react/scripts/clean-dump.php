<?php
/**
 * PHP-based SQL Dump Cleaner v3 (Debug Mode)
 */

$input = '../db-latest.sql';
$output = 'clean_dump.sql';

if (!file_exists($input)) {
    die("Input file not found.\n");
}

$in = fopen($input, 'r');
$out = fopen($output, 'w');

$skip_mode = false;
$count = 0;
$skipped = 0;
$line_num = 0;
$skip_start_line = 0;

while (($line = fgets($in)) !== false) {
    $line_num++;

    // Debug specific range where wp_posts starts
    if ($line_num >= 16277680 && $line_num <= 16277700) {
        echo "Line $line_num: skip_mode=" . ($skip_mode ? 'TRUE' : 'FALSE') . " Content: " . substr(trim($line), 0, 50) . "...\n";
    }

    $ltrim = ltrim($line);

    // Check for START of a block we want to skip
    if (!$skip_mode) {
        if (
            strpos($ltrim, 'CREATE TABLE `wp_wf') === 0 ||
            strpos($ltrim, 'CREATE TABLE `wp_actionscheduler') === 0 ||
            strpos($ltrim, 'CREATE TABLE `wp_itsec') === 0 ||
            strpos($ltrim, 'INSERT INTO `wp_wf') === 0 ||
            strpos($ltrim, 'INSERT INTO `wp_actionscheduler') === 0 ||
            strpos($ltrim, 'INSERT INTO `wp_itsec') === 0 ||
            strpos($ltrim, 'LOCK TABLES `wp_wf') === 0 ||
            strpos($ltrim, 'LOCK TABLES `wp_actionscheduler') === 0 ||
            strpos($ltrim, 'LOCK TABLES `wp_itsec') === 0 ||
            strpos($ltrim, 'ALTER TABLE `wp_wf') === 0 ||
            strpos($ltrim, 'ALTER TABLE `wp_actionscheduler') === 0 ||
            strpos($ltrim, 'ALTER TABLE `wp_itsec') === 0
        ) {

            $skip_mode = true;
            $skip_start_line = $line_num;
            $skip_start_content = substr(trim($line), 0, 50);
            echo "Line $line_num: ENTER Skip Mode (" . $skip_start_content . "...)\n";
        }
    }

    if ($line_num == 16277684 && $skip_mode) {
        die("CRITICAL: Skipping wp_posts! Skip started at line $skip_start_line for block: $skip_start_content\n");
    }

    if ($skip_mode) {
        $skipped++;
        // Check for END of the statement (semicolon at end of line)
        $rtrim = rtrim($line);
        if (substr($rtrim, -1) === ';') {
            $skip_mode = false;
            echo "Line $line_num: EXIT Skip Mode\n";
        }

        // Safety check
        if ($line_num - $skip_start_line > 5000) {
            echo "WARNING: Stuck in skip mode for > 5000 lines! Started at $skip_start_line\n";
            // Force break to verify hypothesis
            break;
        }

        continue;
    }

    fwrite($out, $line);
    $count++;
}

fclose($in);
fclose($out);

echo "Done. Kept {$count} lines. Skipped {$skipped} lines.\n";
