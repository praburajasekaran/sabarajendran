<?php
/**
 * Assign Block and Panchayat Taxonomies to Projects
 *
 * This script assigns the correct block and panchayat taxonomy terms to all 826 projects.
 *
 * Upload this file to your WordPress root directory and run via:
 * - Browser: https://tan-emu-358425.hostingersite.com/assign-project-taxonomies.php
 * - WP-CLI: wp eval-file assign-project-taxonomies.php
 */

// Load WordPress
require_once(__DIR__ . '/wp-load.php');

// Security check - only allow logged-in administrators
if (!is_user_logged_in() || !current_user_can('manage_options')) {
    die('Unauthorized access. Please login as an administrator.');
}

// Output header
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Assign Project Taxonomies</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 20px; max-width: 1200px; margin: 0 auto; }
        h1 { color: #0073aa; }
        .success { color: #46b450; }
        .error { color: #dc3232; }
        .info { color: #0073aa; }
        .progress { background: #f0f0f0; height: 30px; border-radius: 5px; overflow: hidden; margin: 20px 0; }
        .progress-bar { background: #0073aa; height: 100%; transition: width 0.3s; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #0073aa; color: white; }
    </style>
</head>
<body>
    <h1>Assign Project Taxonomies</h1>
    <p><strong>Status:</strong> Assigning block and panchayat taxonomies to all projects...</p>
<?php

$stats = [
    'total' => 0,
    'blocks_assigned' => 0,
    'panchayats_assigned' => 0,
    'skipped' => 0,
    'errors' => 0,
];

// Panchayat mapping based on project title keywords
// This maps panchayat name patterns to their slug
$panchayat_mapping = [
    'alagap' => 'alagappasamuthiram',
    'arasad' => 'arasadikuppam',
    'elantha' => 'elanthampattu',
    'kaatupalayam' => 'kaatupalayam',
    'kadampu' => 'kadampuliyur',
    'karukkai' => 'karukkai',
    'kattandikuppam' => 'kattandikuppam',
    'kattukud' => 'kattukudalore',
    'keelakuppam' => 'keelakuppam',
    'keeliruppu' => 'keeliruppu',
    'keelkank' => 'keelkankeyankuppam',
    'keelmamp' => 'keelmampattu',
    'maligam' => 'maligampattu',
    'marungur' => 'marungur',
    'meliruppu' => 'meliruppu',
    'melkank' => 'melkankeyankuppam',
    'melmamp' => 'melmampattu',
    'nadukuppam' => 'nadukuppam',
    'pannikank' => 'panikkankuppam',
    'periyakattu' => 'periyakattupalayam',
    'perperi' => 'perperiyankuppam',
    'purangani' => 'purangani',
    'semmedu' => 'semmedu',
    'silambina' => 'silambinathanpettai',
    'siruvathur' => 'siruvathur',
    'sorathur' => 'sorathur',
    'thalampa' => 'thalampattu',
    'thiruvam' => 'thiruvamoor',
    'vallam' => 'vallam',
    'veerasinga' => 'veerasingankuppam',
    'vegakollai' => 'vegakollai',
    'visoor' => 'visoor',
];

echo "<h2>Step 1: Get All Projects</h2>";

// Get all projects
$args = [
    'post_type' => 'project',
    'post_status' => 'publish',
    'posts_per_page' => -1,
    'fields' => 'ids',
];

$project_ids = get_posts($args);
$total_projects = count($project_ids);
$stats['total'] = $total_projects;

echo "<p class='success'>✅ Found {$total_projects} projects</p>";

echo "<h2>Step 2: Assign 'Panruti' Block to All Projects</h2>";
echo "<div class='progress'><div class='progress-bar' id='progress-bar' style='width: 0%'>0%</div></div>";
echo "<p id='current-status'>Starting...</p>";

// Flush output
ob_flush();
flush();

// Get or create Panruti block term
$panruti_term = get_term_by('slug', 'panruti', 'project_block');
if (!$panruti_term) {
    echo "<p class='error'>❌ Error: 'Panruti' block term not found. Please run import-taxonomy-terms.php first.</p>";
    exit;
}

$panruti_id = $panruti_term->term_id;
echo "<p class='info'>Using block: Panruti (ID: {$panruti_id})</p>";

// Process projects in batches
$batch_size = 50;
$total_batches = ceil($total_projects / $batch_size);

for ($i = 0; $i < $total_batches; $i++) {
    $offset = $i * $batch_size;
    $batch_ids = array_slice($project_ids, $offset, $batch_size);

    foreach ($batch_ids as $project_id) {
        // Assign Panruti block
        $result = wp_set_object_terms($project_id, $panruti_id, 'project_block', false);

        if (!is_wp_error($result)) {
            $stats['blocks_assigned']++;
        } else {
            $stats['errors']++;
        }

        // Try to detect panchayat from title
        $title = get_the_title($project_id);
        $title_lower = strtolower($title);

        $panchayat_found = false;
        foreach ($panchayat_mapping as $keyword => $panchayat_slug) {
            if (strpos($title_lower, $keyword) !== false) {
                // Found a matching panchayat
                $panchayat_term = get_term_by('slug', $panchayat_slug, 'project_panchayat');
                if ($panchayat_term) {
                    $result = wp_set_object_terms($project_id, $panchayat_term->term_id, 'project_panchayat', false);
                    if (!is_wp_error($result)) {
                        $stats['panchayats_assigned']++;
                        $panchayat_found = true;
                    }
                }
                break;
            }
        }

        if (!$panchayat_found) {
            $stats['skipped']++;
        }
    }

    // Update progress
    $progress = round((($i + 1) / $total_batches) * 100);
    $current = min(($i + 1) * $batch_size, $total_projects);

    echo "<script>
        document.getElementById('progress-bar').style.width = '{$progress}%';
        document.getElementById('progress-bar').innerText = '{$progress}%';
        document.getElementById('current-status').innerText = 'Processed {$current} / {$total_projects} projects...';
    </script>";

    // Flush output
    ob_flush();
    flush();

    // Small delay to prevent server overload
    usleep(10000); // 0.01 seconds
}

echo "<h2>Step 3: Results</h2>";
echo "<table>";
echo "<tr><th>Metric</th><th>Count</th></tr>";
echo "<tr><td>Total Projects</td><td>{$stats['total']}</td></tr>";
echo "<tr><td class='success'>Blocks Assigned (Panruti)</td><td><strong>{$stats['blocks_assigned']}</strong></td></tr>";
echo "<tr><td class='success'>Panchayats Assigned (Auto-detected)</td><td><strong>{$stats['panchayats_assigned']}</strong></td></tr>";
echo "<tr><td class='info'>Skipped (No panchayat detected)</td><td>{$stats['skipped']}</td></tr>";
echo "<tr><td class='error'>Errors</td><td>{$stats['errors']}</td></tr>";
echo "</table>";

echo "<h2>Step 4: Verify Assignments</h2>";

// Count projects by block
$block_counts = [];
$blocks = get_terms(['taxonomy' => 'project_block', 'hide_empty' => false]);
foreach ($blocks as $block) {
    $count = wp_count_terms(['taxonomy' => 'project_block', 'term_ids' => $block->term_id]);
    $block_counts[$block->name] = $count;
}

echo "<p><strong>Projects per Block:</strong></p>";
echo "<ul>";
foreach ($block_counts as $name => $count) {
    echo "<li>{$name}: <strong>{$count}</strong> projects</li>";
}
echo "</ul>";

// Count projects by panchayat
$panchayat_counts = [];
$panchayats = get_terms(['taxonomy' => 'project_panchayat', 'hide_empty' => true, 'number' => 10]);
if (!empty($panchayats)) {
    echo "<p><strong>Top 10 Panchayats (by project count):</strong></p>";
    echo "<ul>";
    foreach ($panchayats as $panchayat) {
        echo "<li>{$panchayat->name}: <strong>{$panchayat->count}</strong> projects</li>";
    }
    echo "</ul>";
}

echo "<h2>✅ Assignment Complete!</h2>";
echo "<p class='success'><strong>Next Steps:</strong></p>";
echo "<ol>";
echo "<li>Delete this file from your server for security: <code>rm assign-project-taxonomies.php</code></li>";
echo "<li>Test the REST API:</li>";
echo "<pre>curl \"https://tan-emu-358425.hostingersite.com/wp-json/wp/v2/project?per_page=1&_embed\"</pre>";
echo "<li>Check that <code>project_block</code> and <code>project_panchayat</code> arrays are no longer empty</li>";
echo "<li>Clear your React app cache and test the Netlify site</li>";
echo "<li>The 'All Blocks' dropdown should now show 'Panruti'</li>";
echo "</ol>";

?>
</body>
</html>
