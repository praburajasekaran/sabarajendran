<?php
/**
 * Import Projects from CSV
 * Run with: wp eval-file import_projects.php
 */

define('WP_USE_THEMES', false);

require_once('wp-load.php');

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Disable Netlify Hooks during bulk import
remove_action('save_post', 'saba_netlify_on_post_save', 10);
remove_action('transition_post_status', 'saba_netlify_on_post_status_change', 10);
remove_action('created_term', 'saba_netlify_on_term_change', 10);
remove_action('edited_term', 'saba_netlify_on_term_change', 10);
remove_action('updated_post_meta', 'saba_netlify_on_meta_update', 10);
remove_action('added_post_meta', 'saba_netlify_on_meta_update', 10);

ini_set('memory_limit', '2048M');
wp_defer_term_counting(true);
wp_set_current_user(1);


echo "=== Starting Project Import ===\n";

// 1. Ensure Block "Kurinjipadi" exists
$block_name_en = 'Kurinjipadi';
$block_name_ta = 'குறிஞ்சிப்பாடி';

$block_term = term_exists($block_name_en, 'project_block');
if (!$block_term) {
    $block_term = wp_insert_term($block_name_en, 'project_block');
    //$block_term = wp_insert_term($block_name_ta, 'project_block'); // Or use Tamil name? 
    // Usually slugs are English.
    echo "Created Block: $block_name_en\n";
} else {
    echo "Block exists: $block_name_en\n";
}

$block_id = is_array($block_term) ? $block_term['term_id'] : $block_term;

// Open CSV
$csv_file = 'projects_kurinjipadi_gemini.csv';  // Updated to use new cleaned CSV
if (!file_exists($csv_file)) {
    die("Error: $csv_file not found.\n");
}

$handle = fopen($csv_file, 'r');
$header = fgetcsv($handle); // Skip header

$count = 0;
$success = 0;
$failed = 0;

while (($data = fgetcsv($handle)) !== FALSE) {
    // Columns: sno,village,year,scheme,details,description,location,budget,status,raw_text
    // Index: 0=sno, 1=village, 2=year, 3=scheme, 4=details, 5=desc, 6=loc, 7=budget, 8=status, 9=raw

    // Check if we have enough columns
    if (count($data) < 10)
        continue;

    $sno = $data[0];
    $village_name = trim($data[1]);
    $year = trim($data[2]);
    $scheme = trim($data[3]);
    $description = trim($data[5]);
    $location = trim($data[6]);
    $budget = trim($data[7]);
    $status = trim($data[8]);
    $raw_text = trim($data[9]); // Tamil Content

    // Skip empty rows
    if (empty($raw_text) && empty($description))
        continue;

    // 2. Ensure Panchayat/Village exists
    // We assume Village Name from CSV is the Panchayat AND Village

    // Create Panchayat
    $panchayat_term = term_exists($village_name, 'project_panchayat');
    if (!$panchayat_term) {
        $panchayat_term = wp_insert_term($village_name, 'project_panchayat');
        if (!is_wp_error($panchayat_term)) {
            echo "Created Panchayat: $village_name\n";
            // Store Tamil name if different? Here we have Tamil name from filename
            update_term_meta($panchayat_term['term_id'], '_village_name_tamil', $village_name);
        }
    }
    $panchayat_id = !is_wp_error($panchayat_term) ? (is_array($panchayat_term) ? $panchayat_term['term_id'] : $panchayat_term) : 0;

    // Create Village (child of Panchayat? Or just term)
    // Here we treat them as separate taxonomies as per plugin def.
    $village_term = term_exists($village_name, 'project_village');
    if (!$village_term) {
        $village_term = wp_insert_term($village_name, 'project_village');
        if (!is_wp_error($village_term)) {
            // echo "Created Village: $village_name\n";
            update_term_meta($village_term['term_id'], '_village_name_tamil', $village_name);
        }
    }
    $village_id = !is_wp_error($village_term) ? (is_array($village_term) ? $village_term['term_id'] : $village_term) : 0;

    // 3. Check for duplicate projects
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
        echo "Skipping duplicate: $village_name - Row $count\n";
        $count++;
        continue;
    }

    // 4. Create Project Post
    // Title: Truncate raw_text or scheme + location
    $title = mb_substr($raw_text, 0, 100);
    if (empty($title))
        $title = "Project $sno - $village_name";

    $user_id = get_current_user_id();
    // Validate encoding
    if (!mb_check_encoding($title, 'UTF-8'))
        $title = utf8_encode($title);
    if (!mb_check_encoding($description, 'UTF-8'))
        $description = utf8_encode($description);

    $post_data = array(
        'post_title' => $title,
        'post_content' => $description . "\n\n" . $raw_text,
        'post_status' => 'publish',
        'post_type' => 'project',
        'post_author' => $user_id,
    );

    // DEBUG
    echo "Inserting Row $count:\n";
    // var_dump($post_data); 

    // Check CPT
    global $wp_post_types;
    if (!post_type_exists('project')) {
        echo "ERROR: Post Type 'project' does not exist! Registered types: " . implode(', ', array_keys($wp_post_types)) . "\n";
        die();
    }

    $post_id = wp_insert_post($post_data, true); // Pass true to get WP_Error object

    if (!is_wp_error($post_id) && $post_id > 0) {
        // ... success ...
        // Set Terms
        wp_set_object_terms($post_id, (int) $block_id, 'project_block');
        if ($panchayat_id)
            wp_set_object_terms($post_id, (int) $panchayat_id, 'project_panchayat');
        if ($village_id)
            wp_set_object_terms($post_id, (int) $village_id, 'project_village');

        // Set Meta
        update_post_meta($post_id, '_project_year', $year);
        update_post_meta($post_id, '_project_budget', $budget);

        // Store Full Tamil Title in meta if needed
        update_post_meta($post_id, '_project_title_tamil', $raw_text);
        update_post_meta($post_id, '_project_description_tamil', $description);

        // Year Taxonomy Assignment
        if (!empty($year)) {
            // Standardize format: 2021-22 → 2021-2022
            if (preg_match('/^(\d{4})-(\d{2})$/', $year, $matches)) {
                $year = $matches[1] . '-20' . $matches[2];
            }

            $year_term = term_exists($year, 'project_year');
            if (!$year_term) {
                $year_term = wp_insert_term($year, 'project_year');
            }
            if ($year_term && !is_wp_error($year_term)) {
                $yid = is_array($year_term) ? $year_term['term_id'] : $year_term;
                wp_set_object_terms($post_id, (int) $yid, 'project_year');
            }
        }

        // Scheme Taxonomy Assignment
        if (!empty($scheme)) {
            $scheme_term = term_exists($scheme, 'project_scheme');
            if (!$scheme_term && $scheme != 'Unknown') {
                $scheme_term = wp_insert_term($scheme, 'project_scheme');
            }
            if ($scheme_term && !is_wp_error($scheme_term)) {
                $sid = is_array($scheme_term) ? $scheme_term['term_id'] : $scheme_term;
                wp_set_object_terms($post_id, (int) $sid, 'project_scheme');
            }
        }

        // Status Taxonomy Assignment
        if ($status) {
            // Map status text to term?
            // "Completed" -> "Completed"
            // "In Progress" -> "In Progress"
            // Needs a term in 'project_status' taxonomy
            $status_term = term_exists($status, 'project_status');
            if (!$status_term && !empty($status) && $status != 'Unknown') {
                $status_term = wp_insert_term($status, 'project_status');
            }
            if ($status_term && !is_wp_error($status_term)) {
                $sid = is_array($status_term) ? $status_term['term_id'] : $status_term;
                wp_set_object_terms($post_id, (int) $sid, 'project_status');
            }
        }

        $success++;
    } else {
        $failed++;
        echo "Failed to create post for row $count\n";
        if (is_wp_error($post_id)) {
            echo "Error: " . $post_id->get_error_message() . "\n";
        }
    }

    $count++;
}

fclose($handle);

echo "\n=== Import Complete ===\n";
echo "Total Rows: $count\n";
echo "Created: $success\n";
echo "Failed: $failed\n";
