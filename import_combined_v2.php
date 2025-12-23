<?php
/**
 * Import Neyveli Block Projects (Bilingual)
 * 
 * Usage: Upload to WordPress root, visit URL while logged in as Admin.
 * URL: [your-site]/import_neyveli_projects.php
 */

// 1. Load WordPress environment
require_once('wp-load.php');

// 2. Security Check: Must be logged in as Administrator (unless running via WP-CLI or PHP CLI)
echo "<!-- Debug: Script started -->";
echo "<p>Checking login status...</p>";
flush();

if (!is_user_logged_in()) {
    echo "<p style='color:red;'>You are NOT logged in. Please log into WordPress admin first, then visit this page again.</p>";
    echo "<p><a href='" . wp_login_url($_SERVER['REQUEST_URI']) . "'>Click here to login</a></p>";
    die();
}

if (!current_user_can('manage_options')) {
    echo "<p style='color:red;'>You are logged in but not as an Administrator.</p>";
    die();
}

echo "<p style='color:green;'>Login check passed!</p>";
flush();

// 3. Setup header for progress streaming (if web)
if (php_sapi_name() !== 'cli') {
    header('Content-Type: text/html; charset=utf-8');
    if (function_exists('apache_setenv')) {
        @apache_setenv('no-gzip', 1);
    }
    @ini_set('zlib.output_compression', 0);
    @ini_set('implicit_flush', 1);
    for ($i = 0; $i < ob_get_level(); $i++) {
        ob_end_flush();
    }
    ob_implicit_flush(1);
}

// --- LOGGING FUNCTION ---
function log_msg($msg, $type = '')
{
    $is_cli = (php_sapi_name() === 'cli' || (defined('WP_CLI') && WP_CLI));

    if ($is_cli) {
        $prefix = $type == 'error' ? 'ERROR: ' : ($type == 'success' ? 'SUCCESS: ' : '');
        echo $prefix . $msg . "\n";
    } else {
        $class = $type ? " class='$type'" : "";
        echo "<div$class>" . date('H:i:s') . " - " . htmlspecialchars($msg) . "</div>";
        flush();
        echo "<script>var log = document.getElementById('log'); log.scrollTop = log.scrollHeight;</script>";
        flush();
    }
}
?>
<?php if (php_sapi_name() !== 'cli'): ?>
    <!DOCTYPE html>
    <html>

    <head>
        <title>Import Neyveli Projects (Bilingual)</title>
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
        <h1>Importing Neyveli Projects (Bilingual)</h1>
        <div class="log" id="log">
        <?php endif; ?>

        <?php
        // --- Configuration ---
        $csv_file = __DIR__ . '/docs/combined_projects_import.csv';
        $target_block_name = 'Neyveli';
        // ---------------------
        
        if (!file_exists($csv_file)) {
            log_msg("Error: $csv_file not found.", "error");
            die(php_sapi_name() !== 'cli' ? "</div></body></html>" : "");
        }

        log_msg("CSV found: " . basename($csv_file), "info");

        // 1. Ensure Block "Neyveli" exists
        $block_term = term_exists($target_block_name, 'project_block');
        if (!$block_term) {
            $block_term = wp_insert_term($target_block_name, 'project_block');
            if (!is_wp_error($block_term)) {
                log_msg("Created Block: $target_block_name", "success");
            } else {
                log_msg("Error creating block: " . $block_term->get_error_message(), "error");
                die();
            }
        }
        $block_id = is_array($block_term) ? $block_term['term_id'] : (is_object($block_term) ? $block_term->term_id : $block_term);

        // 2. Process CSV
        $handle = fopen($csv_file, 'r');
        $header = fgetcsv($handle);

        $count = 0;
        $success = 0;
        $failed = 0;
        $skipped = 0;

        while (($data = fgetcsv($handle)) !== FALSE) {
            // Columns Mapping (based on Sheet1-final.csv):
            // 0: S.No (வ. எண்)
            // 1: Project Name Tamil (திட்டத்தின் பெயர்)
            // 2: Project Name English
            // 3: Year (ஆண்டு)
            // 4: Village Tamil (இடம்)
            // 5: Village English
            // 6: Panchayat Tamil (பஞ்சாயத்து)
            // 7: Panchayat English
            // 8: Budget (மதிப்பீடு)
            // 9: Status
        
            if (count($data) < 10) {
                log_msg("Skipping row $count: Insufficient columns", "error");
                continue;
            }

            $sno = trim($data[0]);
            $title_ta = trim($data[1]);
            $title_en = trim($data[2]);
            $year = trim($data[3]);
            $village_ta = trim($data[4]);
            $village_en = trim($data[5]);
            $panchayat_ta = trim($data[6]);
            $panchayat_en = trim($data[7]);
            $budget = is_numeric(str_replace(',', '', $data[8])) ? str_replace(',', '', $data[8]) : $data[8]; // Clean budget
            $status = trim($data[9]);

            // Use English Title for Post Title
            $title = $title_en;
            if (empty($title))
                $title = "Project $sno - $village_en";

            // --- Taxonomy Handling ---
        
            // A. Ensure Panchayat exists (English Term, with Tamil Meta)
            $panchayat_id = 0;
            if (!empty($panchayat_en)) {
                $panchayat_term = term_exists($panchayat_en, 'project_panchayat');
                if (!$panchayat_term) {
                    $panchayat_term = wp_insert_term($panchayat_en, 'project_panchayat');
                    if (!is_wp_error($panchayat_term)) {
                        $pid = $panchayat_term['term_id'];
                        update_term_meta($pid, '_village_name_tamil', $panchayat_ta);
                        log_msg("Created Panchayat: $panchayat_en ($panchayat_ta)", "success");
                    }
                } else {
                    // Update meta just in case
                    $pid = is_array($panchayat_term) ? $panchayat_term['term_id'] : $panchayat_term->term_id;
                    update_term_meta($pid, '_village_name_tamil', $panchayat_ta);
                }
                $panchayat_id = !is_wp_error($panchayat_term) ? (is_array($panchayat_term) ? $panchayat_term['term_id'] : $panchayat_term->term_id) : 0;
            }

            // B. Ensure Village exists (English Term, with Tamil Meta, Linked to Panchayat)
            $village_id = 0;
            if (!empty($village_en)) {
                $village_term = term_exists($village_en, 'project_village');
                if (!$village_term) {
                    $village_term = wp_insert_term($village_en, 'project_village');
                    if (!is_wp_error($village_term)) {
                        $vid = $village_term['term_id'];
                        update_term_meta($vid, '_village_name_tamil', $village_ta);
                        if ($panchayat_id) {
                            update_term_meta($vid, '_village_panchayat', $panchayat_id);
                        }
                        log_msg("Created Village: $village_en ($village_ta)", "success");
                    }
                } else {
                    // Update meta
                    $vid = is_array($village_term) ? $village_term['term_id'] : $village_term->term_id;
                    update_term_meta($vid, '_village_name_tamil', $village_ta);
                    if ($panchayat_id) {
                        update_term_meta($vid, '_village_panchayat', $panchayat_id);
                    }
                }
                $village_id = !is_wp_error($village_term) ? (is_array($village_term) ? $village_term['term_id'] : $village_term->term_id) : 0;
            }

            // --- Duplicate Check ---
            $args = array(
                'post_type' => 'project',
                'title' => $title,
                'post_status' => 'any',
                'numberposts' => 1
            );
            $existing = get_posts($args);
            // Strict Title Match
            $is_duplicate = false;
            foreach ($existing as $p) {
                if ($p->post_title === $title) {
                    $is_duplicate = true;
                    break;
                }
            }

            if ($is_duplicate) {
                log_msg("Skipping duplicate: $title", "info");
                $skipped++;
                $count++;
                continue;
            }

            // --- Create Post ---
            $post_data = array(
                'post_title' => $title,
                'post_content' => $title_ta, // Putting Tamil Title in content as description is missing
                'post_status' => 'publish',
                'post_type' => 'project',
            );

            $post_id = wp_insert_post($post_data);

            if ($post_id && !is_wp_error($post_id)) {
                // 1. Assign Taxonomies
                wp_set_object_terms($post_id, (int) $block_id, 'project_block');
                if ($panchayat_id)
                    wp_set_object_terms($post_id, (int) $panchayat_id, 'project_panchayat');
                if ($village_id)
                    wp_set_object_terms($post_id, (int) $village_id, 'project_village');

                // Year
                if (!empty($year)) {
                    $year_term = term_exists($year, 'project_year');
                    if (!$year_term)
                        $year_term = wp_insert_term($year, 'project_year');
                    if (!is_wp_error($year_term)) {
                        $yid = is_array($year_term) ? $year_term['term_id'] : $year_term->term_id;
                        wp_set_object_terms($post_id, (int) $yid, 'project_year');
                    }
                }

                // Status
                if (!empty($status)) {
                    $status_term = term_exists($status, 'project_status');
                    if (!$status_term)
                        $status_term = wp_insert_term($status, 'project_status');
                    if (!is_wp_error($status_term)) {
                        $sid = is_array($status_term) ? $status_term['term_id'] : $status_term->term_id;
                        wp_set_object_terms($post_id, (int) $sid, 'project_status');
                    }
                }

                // 2. Assign Meta
                update_post_meta($post_id, '_project_budget', $budget);
                update_post_meta($post_id, '_project_title_tamil', $title_ta); // Core Tamil field
        
                $success++;
                log_msg("Created: $title (ID: $post_id)", "success");

            } else {
                $failed++;
                log_msg("Failed to create post: " . (is_wp_error($post_id) ? $post_id->get_error_message() : 'Unknown error'), "error");
            }

            $count++;
        }

        fclose($handle);
        ?>
        <?php if (php_sapi_name() !== 'cli'): ?>
        </div>
        <div class="summary">
            <h2>Import Complete</h2>
            <p><strong>Total Rows:</strong> <?php echo $count; ?></p>
            <p><strong>Created:</strong> <?php echo $success; ?></p>
            <p><strong>Skipped:</strong> <?php echo $skipped; ?></p>
            <p><strong>Failed:</strong> <?php echo $failed; ?></p>
        </div>
    </body>

    </html>
<?php endif; ?>