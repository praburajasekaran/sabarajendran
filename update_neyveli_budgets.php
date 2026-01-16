<?php
/**
 * Update Budget for Neyveli Block Highway Projects
 * 
 * This script updates the _project_budget meta for projects in the Neyveli block
 * that currently have 0 budget but have budget data in the source CSV.
 * 
 * Usage: Visit this URL while logged in as Administrator
 * URL: [your-site]/update_neyveli_budgets.php
 */

// 1. Load WordPress environment
require_once('wp-load.php');

// 2. Security Check
if (php_sapi_name() !== 'cli' && (!is_user_logged_in() || !current_user_can('manage_options'))) {
    wp_die('Access Denied. You must be logged in as an Administrator.');
}

// 3. Setup header
if (php_sapi_name() !== 'cli') {
    header('Content-Type: text/html; charset=utf-8');
}
?>
<!DOCTYPE html>
<html>

<head>
    <title>Update Neyveli Project Budgets</title>
    <style>
        body {
            font-family: sans-serif;
            max-width: 900px;
            margin: 40px auto;
            padding: 20px;
        }

        .success {
            color: green;
            font-weight: bold;
        }

        .error {
            color: red;
        }

        .info {
            color: blue;
        }

        table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 20px;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }

        th {
            background: #f5f5f5;
        }

        .amount {
            font-family: monospace;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <h1>Update Neyveli Project Budgets</h1>

    <?php
    // Budget data from highways CSV for Neyveli block projects
// Format: 'search term in title' => budget in rupees
    $neyveli_budgets = [
        // Project ID 2978 - ITI Building (from Neyveli 44 projects CSV - row with ITI)
        'Construction of Workshop Building and Preliminary Infrastructure for Neyveli Government Industrial Training Institute' => 40900000, // 4.09 Cr
    
        // Highway projects - from highways-projects-list.csv
        // Row 18: "Improvements to Riding Quality at km 0/0 - 2/2, 3/2 - 4/0 of The road from km.34/4 of Cuddalore-Chittoor road to Sendanadu (via) Somasipalayam" = 3 Cr, 70 Lakhs = 3,70,00,000
        'Improvements to Riding Quality at Km 0/0' => 37000000, // 3.70 Cr
    
        // Row 19: "Reconstruction of Box Culvert at 0/2 at km.34/4 of Cuddalore-Chittoor Road to Sendanadu (via) Somasipalayam" = 0.61 Cr, 15 L
        'Reconstruction of Box Culvert at Km 3/8 of the Road From Km 34/4 of Cuddalore' => 6100000, // 0.61 Cr (61 Lakhs)
    
        // Additional from CSV - Reconstruction of Box Culvert at Km 0/2
        'Reconstruction of Box Culvert at Km 0/2 at Km 34/4 of Cuddalore' => 1500000, // 15 Lakhs
    ];

    echo "<table>";
    echo "<tr><th>Project ID</th><th>Title</th><th>Old Budget</th><th>New Budget</th><th>Status</th></tr>";

    $updated = 0;
    $skipped = 0;

    // Get all projects in Neyveli block with 0 budget
    $args = [
        'post_type' => 'project',
        'posts_per_page' => -1,
        'tax_query' => [
            [
                'taxonomy' => 'project_block',
                'field' => 'name',
                'terms' => 'Neyveli'
            ]
        ],
        'meta_query' => [
            'relation' => 'OR',
            [
                'key' => '_project_budget',
                'value' => ['0', '', '0.00'],
                'compare' => 'IN'
            ],
            [
                'key' => '_project_budget',
                'compare' => 'NOT EXISTS'
            ]
        ]
    ];

    $projects = get_posts($args);

    echo "<p>Found " . count($projects) . " projects in Neyveli block with 0 or missing budget.</p>";

    foreach ($projects as $project) {
        $old_budget = get_post_meta($project->ID, '_project_budget', true);
        $new_budget = null;
        $matched_key = null;

        // Try to match with our budget data
        foreach ($neyveli_budgets as $search_term => $budget) {
            if (stripos($project->post_title, $search_term) !== false) {
                $new_budget = $budget;
                $matched_key = $search_term;
                break;
            }
        }

        if ($new_budget !== null) {
            // Update the budget
            update_post_meta($project->ID, '_project_budget', $new_budget);

            // Format for display
            $formatted_new = '₹' . number_format($new_budget / 10000000, 2) . ' Cr';
            if ($new_budget < 10000000) {
                $formatted_new = '₹' . number_format($new_budget / 100000, 2) . ' L';
            }

            echo "<tr>";
            echo "<td>{$project->ID}</td>";
            echo "<td>" . esc_html(substr($project->post_title, 0, 80)) . "...</td>";
            echo "<td class='amount'>₹" . esc_html($old_budget ?: '0') . "</td>";
            echo "<td class='amount'>{$formatted_new}</td>";
            echo "<td class='success'>✓ Updated</td>";
            echo "</tr>";

            $updated++;
        } else {
            echo "<tr>";
            echo "<td>{$project->ID}</td>";
            echo "<td>" . esc_html(substr($project->post_title, 0, 80)) . "...</td>";
            echo "<td class='amount'>₹" . esc_html($old_budget ?: '0') . "</td>";
            echo "<td class='info'>-</td>";
            echo "<td class='info'>No match found</td>";
            echo "</tr>";

            $skipped++;
        }
    }

    echo "</table>";

    echo "<h2>Summary</h2>";
    echo "<p><strong>Updated:</strong> {$updated} projects</p>";
    echo "<p><strong>Skipped:</strong> {$skipped} projects (no matching budget data)</p>";

    if ($updated > 0) {
        echo "<div style='margin-top:20px; padding:15px; background:#e8f5e9; border:1px solid #4caf50;'>";
        echo "<h3 style='margin-top:0;color:#2e7d32;'>✓ Budget Updated Successfully!</h3>";
        echo "<p>Next steps:</p>";
        echo "<ol>";
        echo "<li>Run <code>npm run generate-projects</code> in <code>projects-frontend-react</code> to regenerate the static JSON</li>";
        echo "<li>Deploy the updated <code>projects.json</code> to production</li>";
        echo "</ol>";
        echo "</div>";
    }
    ?>

</body>

</html>