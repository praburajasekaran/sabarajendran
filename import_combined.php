<?php
/**
 * Import Combined Projects (Simplified)
 * 
 * Usage: 
 * 1. Upload this file to your WordPress root directory.
 * 2. Upload 'combined_projects_import.csv' to the SAME directory.
 * 3. Visit [your-site]/import_combined.php while logged in as Admin.
 */

// 1. Load WordPress environment
require_once('wp-load.php');

// 2. Security Check
if (php_sapi_name() !== 'cli' && (!defined('WP_CLI') || !WP_CLI) && (!is_user_logged_in() || !current_user_can('manage_options'))) {
    wp_die('Access Denied. You must be logged in as an Administrator to run this script.');
}

// 3. Setup header
if (php_sapi_name() !== 'cli') {
    header('Content-Type: text/html; charset=utf-8');
    // Disable buffering for real-time output
    if (function_exists('apache_setenv')) {
        @apache_setenv('no-gzip', 1);
    }
    @ini_set('zlib.output_compression', 0);
    @ini_set('implicit_flush', 1);
    while (ob_get_level() > 0) {
        ob_end_flush();
    }
    ob_implicit_flush(1);
}

function log_msg($msg, $type = '') {
    $is_cli = (php_sapi_name() === 'cli' || (defined('WP_CLI') && WP_CLI));
    if ($is_cli) {
        $prefix = $type == 'error' ? 'ERROR: ' : ($type == 'success' ? 'SUCCESS: ' : '');
        echo $prefix . $msg . "\n";
    } else {
        $class = $type ? " class='$type'" : "";
        $color = $type === 'error' ? 'red' : ($type === 'success' ? 'green' : 'black');
        echo "<div style='color:$color; margin-bottom:5px;'>" . date('H:i:s') . " - " . htmlspecialchars($msg) . "</div>";
        flush();
    }
}
?>
<?php if (php_sapi_name() !== 'cli'): ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>Import Combined Projects</title>
        <style>
            body { font-family: sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
            .log { background: #f5f5f5; padding: 15px; border: 1px solid #ddd; height: 500px; overflow-y: scroll; font-family: monospace; }
        </style>
    </head>
    <body>
        <h1>Importing Combined Projects</h1>
        <div class="log" id="log">
<?php endif; ?>

<?php
// --- Configuration ---
// Try multiple paths for convenience
$possible_paths = [
    __DIR__ . '/combined_projects_import.csv',
    __DIR__ . '/docs/combined_projects_import.csv'
];

$csv_file = '';
foreach ($possible_paths as $p) {
    if (file_exists($p)) {
        $csv_file = $p;
        break;
    }
}

if (empty($csv_file)) {
    log_msg("Error: combined_projects_import.csv not found in root or docs/ folder.", "error");
    die(php_sapi_name() !== 'cli' ? "</div></body></html>" : "");
}

log_msg("CSV found: " . basename($csv_file), "info");

// 2. Process CSV
$handle = fopen($csv_file, 'r');
if (!$handle) {
    log_msg("Error: Could not open CSV file.", "error");
    die();
}

$header = fgetcsv($handle); // Skip Header

$count = 0;
$success = 0;
$failed = 0;
$skipped = 0;

$block_cache = [];

while (($data = fgetcsv($handle)) !== FALSE) {
    // Columns:
    // 0: S.No
    // 1: Title Tamil
    // 2: Title English
    // 3: Year
    // 4: Village Tamil
    // 5: Village English
    // 6: Panchayat Tamil
    // 7: Panchayat English
    // 8: Budget
    // 9: Status
    // 10: Block (Optional)

    if (count($data) < 10) {
        // Silently skip completely empty lines
        if (implode('', $data) == '') continue;
        log_msg("Skipping row $count: Insufficient columns (" . count($data) . ")", "error");
        $count++;
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
    $budget = is_numeric(str_replace([',', ' '], '', $data[8])) ? str_replace([',', ' '], '', $data[8]) : $data[8];
    $status = trim($data[9]);
    
    // Check if Block column exists (index 10)
    $block_name = (isset($data[10]) && !empty($data[10])) ? trim($data[10]) : 'Neyveli';

    // --- Block Handling ---
    if (!isset($block_cache[$block_name])) {
        $block_term = term_exists($block_name, 'project_block');
        if (!$block_term) {
            $block_term = wp_insert_term($block_name, 'project_block');
        }
        if (!is_wp_error($block_term) && $block_term) {
             $block_cache[$block_name] = is_array($block_term) ? $block_term['term_id'] : $block_term->term_id;
        } else {
             $block_cache[$block_name] = 0; // Failed
        }
    }
    $block_id = $block_cache[$block_name];

    // Use English Title
    $title = $title_en;
    if (empty($title)) $title = "Project $sno - $village_en";

    // --- Taxonomy Handling ---

    // A. Panchayat
    $panchayat_id = 0;
    if (!empty($panchayat_en)) {
        $panchayat_term = term_exists($panchayat_en, 'project_panchayat');
        if (!$panchayat_term) {
            $panchayat_term = wp_insert_term($panchayat_en, 'project_panchayat');
            if (!is_wp_error($panchayat_term)) {
                $pid = $panchayat_term['term_id'];
                update_term_meta($pid, '_village_name_tamil', $panchayat_ta);
                log_msg("Created Panchayat: $panchayat_en", "success");
            }
        } else {
            $pid = is_array($panchayat_term) ? $panchayat_term['term_id'] : $panchayat_term->term_id;
            update_term_meta($pid, '_village_name_tamil', $panchayat_ta);
        }
        $panchayat_id = !is_wp_error($panchayat_term) ? (is_array($panchayat_term) ? $panchayat_term['term_id'] : $panchayat_term->term_id) : 0;
    }

    // B. Village
    $village_id = 0;
    if (!empty($village_en)) {
        $village_term = term_exists($village_en, 'project_village');
        if (!$village_term) {
            $village_term = wp_insert_term($village_en, 'project_village');
            if (!is_wp_error($village_term)) {
                $vid = $village_term['term_id'];
                update_term_meta($vid, '_village_name_tamil', $village_ta);
                if ($panchayat_id) update_term_meta($vid, '_village_panchayat', $panchayat_id);
            }
        } else {
            $vid = is_array($village_term) ? $village_term['term_id'] : $village_term->term_id;
            update_term_meta($vid, '_village_name_tamil', $village_ta);
            if ($panchayat_id) update_term_meta($vid, '_village_panchayat', $panchayat_id);
        }
        $village_id = !is_wp_error($village_term) ? (is_array($village_term) ? $village_term['term_id'] : $village_term->term_id) : 0;
    }

    // --- Duplicate Check ---
    $args = ['post_type' => 'project', 'title' => $title, 'post_status' => 'any', 'numberposts' => 1];
    $existing = get_posts($args);
    if (!empty($existing)) {
         log_msg("Skipping duplicate: $title", "info");
         $skipped++;
         $count++;
         continue;
    }

    // --- Create Post ---
    $post_data = [
        'post_title' => $title,
        'post_content' => $title_ta, 
        'post_status' => 'publish',
        'post_type' => 'project',
    ];

    $post_id = wp_insert_post($post_data);

    if ($post_id && !is_wp_error($post_id)) {
        // Assign Taxonomies
        if ($block_id) wp_set_object_terms($post_id, (int)$block_id, 'project_block');
        if ($panchayat_id) wp_set_object_terms($post_id, (int)$panchayat_id, 'project_panchayat');
        if ($village_id) wp_set_object_terms($post_id, (int)$village_id, 'project_village');

        // Year
        if (!empty($year)) {
            $year_term = term_exists($year, 'project_year');
            if (!$year_term) $year_term = wp_insert_term($year, 'project_year');
            if (!is_wp_error($year_term) && $year_term) {
                $yid = is_array($year_term) ? $year_term['term_id'] : $year_term->term_id;
                wp_set_object_terms($post_id, (int)$yid, 'project_year');
            }
        }

        // Status
        if (!empty($status)) {
            $status_term = term_exists($status, 'project_status');
            if (!$status_term) $status_term = wp_insert_term($status, 'project_status');
            if (!is_wp_error($status_term) && $status_term) {
                $sid = is_array($status_term) ? $status_term['term_id'] : $status_term->term_id;
                wp_set_object_terms($post_id, (int)$sid, 'project_status');
            }
        }

        // Meta
        update_post_meta($post_id, '_project_budget', $budget);
        update_post_meta($post_id, '_project_title_tamil', $title_ta);

        $success++;
        log_msg("Created: $title", "success");
    } else {
        $failed++;
        log_msg("Failed: " . (is_wp_error($post_id) ? $post_id->get_error_message() : 'Unknown'), "error");
    }
    $count++;
}
fclose($handle);
?>
<?php if (php_sapi_name() !== 'cli'): ?>
    </div>
    <div class="summary" style="margin-top:20px; padding:10px; background:#e6fffa; border:1px solid #b2f5ea;">
        <h2>Import Complete</h2>
        <p><strong>Processed:</strong> <?php echo $count; ?></p>
        <p><strong>Created:</strong> <?php echo $success; ?></p>
        <p><strong>Skipped:</strong> <?php echo $skipped; ?></p>
        <p><strong>Failed:</strong> <?php echo $failed; ?></p>
    </div>
    </body>
    </html>
<?php endif; ?>