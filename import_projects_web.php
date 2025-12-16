<?php
/**
 * Web-based Project Importer
 * Usage: Upload to WordPress root, visit URL while logged in as Admin.
 */

// 1. Load WordPress environment
require_once('wp-load.php');

// 2. Security Check: Must be logged in as Administrator
if (!is_user_logged_in() || !current_user_can('manage_options')) {
    wp_die('Access Denied. You must be logged in as an Administrator to run this script.');
}

// 3. Setup header for progress streaming
header('Content-Type: text/html; charset=utf-8');
// Disable buffering to see progress in real-time
if (function_exists('apache_setenv')) {
    @apache_setenv('no-gzip', 1);
}
@ini_set('zlib.output_compression', 0);
@ini_set('implicit_flush', 1);
for ($i = 0; $i < ob_get_level(); $i++) {
    ob_end_flush();
}
ob_implicit_flush(1);

?>
<!DOCTYPE html>
<html>

<head>
    <title>Import Kurinjipadi Projects</title>
    <style>
        body {
            font-family: sans-serif;
            line-height: 1.5;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
        }

        .log {
            background: #f5f5f5;
            padding: 15px;
            border: 1px solid #ddd;
            height: 500px;
            overflow-y: scroll;
            white-space: pre-wrap;
            font-family: monospace;
        }

        .success {
            color: green;
        }

        .error {
            color: red;
        }

        .info {
            color: blue;
        }

        .summary {
            margin-top: 20px;
            padding: 20px;
            background: #e6fffa;
            border: 1px solid #b2f5ea;
        }
    </style>
</head>

<body>
    <h1>Importing Kurinjipadi Projects</h1>
    <p>Reading CSV: <code>projects_kurinjipadi_gemini.csv</code></p>
    <div class="log" id="log">
        <?php

        function log_msg($msg, $type = '')
        {
            $class = $type ? " class='$type'" : "";
            echo "<div$class>" . date('H:i:s') . " - " . htmlspecialchars($msg) . "</div>";
            flush();
        }

        // 4. Main Import Logic (Copied and adapted from import_projects.php)
        
        $csv_file = __DIR__ . '/projects_kurinjipadi_gemini.csv';

        if (!file_exists($csv_file)) {
            log_msg("Error: $csv_file not found. Please upload the CSV file to the same directory.", "error");
            die("</body></html>");
        }

        log_msg("CSV found. Starting import...", "info");

        // Ensure Block "Kurinjipadi" exists
        $block_name_en = 'Kurinjipadi';
        $block_term = term_exists($block_name_en, 'project_block');
        if (!$block_term) {
            $block_term = wp_insert_term($block_name_en, 'project_block');
            if (!is_wp_error($block_term)) {
                log_msg("Created Block: $block_name_en", "success");
            } else {
                log_msg("Error creating block: " . $block_term->get_error_message(), "error");
            }
        } else {
            log_msg("Block exists: $block_name_en");
        }
        $block_id = is_array($block_term) ? $block_term['term_id'] : (is_object($block_term) ? $block_term->term_id : $block_term);

        if (is_wp_error($block_term))
            $block_id = 0;


        $handle = fopen($csv_file, 'r');
        $header = fgetcsv($handle); // Skip header
        
        $count = 0;
        $success = 0;
        $failed = 0;
        $skipped = 0;

        while (($data = fgetcsv($handle)) !== FALSE) {
            // Columns: sno,panchayat,year,scheme,details,description,village,budget,status,raw_text
        
            if (count($data) < 10) {
                continue;
            }

            $sno = $data[0];
            $panchayat_name = trim($data[1]);  // Panchayat (Tamil)
            $year = trim($data[2]);
            $scheme = trim($data[3]);           // Scheme (Tamil)
            $description = trim($data[5]);      // Description (Tamil - cleaned)
            $village_name = trim($data[6]);     // Village/Habitation (Tamil)
            $budget = trim($data[7]);
            $status = trim($data[8]);           // Status (English)
            $raw_text = trim($data[9]);         // Full Tamil description
        
            if (empty($raw_text) && empty($description))
                continue;

            // Ensure Panchayat exists
            $panchayat_term = term_exists($panchayat_name, 'project_panchayat');
            if (!$panchayat_term) {
                $panchayat_term = wp_insert_term($panchayat_name, 'project_panchayat');
                if (!is_wp_error($panchayat_term)) {
                    update_term_meta($panchayat_term['term_id'], '_village_name_tamil', $panchayat_name);
                    log_msg("Created Panchayat: $panchayat_name");
                }
            }
            $panchayat_id = !is_wp_error($panchayat_term) ? (is_array($panchayat_term) ? $panchayat_term['term_id'] : $panchayat_term) : 0;

            // Ensure Village/Habitation exists
            $village_term = term_exists($village_name, 'project_village');
            if (!$village_term) {
                $village_term = wp_insert_term($village_name, 'project_village');
                if (!is_wp_error($village_term)) {
                    update_term_meta($village_term['term_id'], '_village_name_tamil', $village_name);
                }
            }
            $village_id = !is_wp_error($village_term) ? (is_array($village_term) ? $village_term['term_id'] : $village_term) : 0;

            // Check for duplicate
            $existing = get_posts(array(
                'post_type' => 'project',
                'meta_query' => array(
                    array('key' => '_project_title_tamil', 'value' => $raw_text, 'compare' => '=')
                ),
                'tax_query' => array(
                    array('taxonomy' => 'project_panchayat', 'terms' => $panchayat_id)
                ),
                'posts_per_page' => 1
            ));

            if (!empty($existing)) {
                // log_msg("Skipping duplicate: $panchayat_name - Row $count");
                $count++;
                $skipped++;
                continue;
            }

            // Prepare Title
            $title = mb_substr($description, 0, 100);
            if (empty($title))
                $title = mb_substr($raw_text, 0, 100);
            if (empty($title))
                $title = "Project $sno - $panchayat_name";

            $post_data = array(
                'post_title' => $title,
                'post_content' => $description,
                'post_status' => 'publish',
                'post_type' => 'project',
            );

            $post_id = wp_insert_post($post_data);

            if ($post_id && !is_wp_error($post_id)) {
                // Set Terms
                wp_set_object_terms($post_id, (int) $block_id, 'project_block');
                if ($panchayat_id)
                    wp_set_object_terms($post_id, (int) $panchayat_id, 'project_panchayat');
                if ($village_id)
                    wp_set_object_terms($post_id, (int) $village_id, 'project_village');

                // Set Meta
                update_post_meta($post_id, '_project_year', $year);
                update_post_meta($post_id, '_project_budget', $budget);
                update_post_meta($post_id, '_project_title_tamil', $raw_text);
                update_post_meta($post_id, '_project_description_tamil', $description);

                // Year Taxonomy
                if (!empty($year)) {
                    if (preg_match('/^(\d{4})-(\d{2})$/', $year, $matches)) {
                        $year = $matches[1] . '-20' . $matches[2];
                    }
                    $year_term = term_exists($year, 'project_year');
                    if (!$year_term)
                        $year_term = wp_insert_term($year, 'project_year');
                    if ($year_term && !is_wp_error($year_term)) {
                        $yid = is_array($year_term) ? $year_term['term_id'] : $year_term;
                        wp_set_object_terms($post_id, (int) $yid, 'project_year');
                    }
                }

                // Scheme Taxonomy
                if (!empty($scheme)) {
                    $scheme_term = term_exists($scheme, 'project_scheme');
                    if (!$scheme_term && $scheme != 'Unknown')
                        $scheme_term = wp_insert_term($scheme, 'project_scheme');
                    if ($scheme_term && !is_wp_error($scheme_term)) {
                        $sid = is_array($scheme_term) ? $scheme_term['term_id'] : $scheme_term;
                        wp_set_object_terms($post_id, (int) $sid, 'project_scheme');
                    }
                }

                // Status Taxonomy
                if ($status) {
                    $status_term = term_exists($status, 'project_status');
                    if (!$status_term && !empty($status) && $status != 'Unknown')
                        $status_term = wp_insert_term($status, 'project_status');
                    if ($status_term && !is_wp_error($status_term)) {
                        $sid = is_array($status_term) ? $status_term['term_id'] : $status_term;
                        wp_set_object_terms($post_id, (int) $sid, 'project_status');
                    }
                }

                $success++;
                if ($success % 10 == 0)
                    log_msg("Imported $success projects so far...", "info");
            } else {
                $failed++;
                log_msg("Failed to create post for row $count: " . (is_wp_error($post_id) ? $post_id->get_error_message() : 'Unknown error'), "error");
            }

            $count++;
        }

        fclose($handle);
        ?>
    </div>
    <div class="summary">
        <h2>Import Complete</h2>
        <p><strong>Total Rows Processed:</strong> <?php echo $count; ?></p>
        <p><strong>Successfully Created:</strong> <?php echo $success; ?></p>
        <p><strong>Skipped (Duplicates):</strong> <?php echo $skipped; ?></p>
        <p><strong>Failed:</strong> <?php echo $failed; ?></p>
    </div>
    <p style="margin-top: 30px; color: #666;">
        <strong>Important:</strong> Please delete this file (`import_projects_web.php`) and the CSV file from your
        server after completion for security.
    </p>
    <script>
        // Auto-scroll to bottom of log
        var log = document.getElementById('log');
        log.scrollTop = log.scrollHeight;
    </script>
</body>

</html>