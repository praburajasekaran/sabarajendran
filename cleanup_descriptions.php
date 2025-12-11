<?php
/**
 * Cleanup Redundant Project Descriptions
 * 
 * Usage: php cleanup_descriptions.php [--dry-run]
 */

// Load WordPress
require_once __DIR__ . '/wp-load.php';

$dry_run = in_array('--dry-run', $argv);

if ($dry_run) {
    echo "🔍 DRY RUN MODE: No changes will be saved.\n";
} else {
    echo "⚠️  EXECUTION MODE: Changes WILL be saved.\n";
}

// Fetch all projects
$args = [
    'post_type' => 'project',
    'posts_per_page' => -1,
    'post_status' => 'any',
];

$projects = get_posts($args);

echo "Found " . count($projects) . " projects.\n\n";

$stats = [
    'english_cleared' => 0,
    'tamil_cleared' => 0,
    'processed' => 0,
];


/**
 * Normalize string for comparison (removes punctuation, spaces, and case)
 */
function normalize_string($str)
{
    if (empty($str))
        return '';
    // Remove HTML tags
    $str = strip_tags($str);
    // Convert to lowercase (multibyte safe)
    $str = mb_strtolower($str, 'UTF-8');
    // Remove punctuation and special characters
    $str = preg_replace('/[[:punct:]]/u', '', $str);
    // Remove whitespace
    $str = preg_replace('/\s+/u', '', $str);
    return $str;
}

foreach ($projects as $project) {
    $stats['processed']++;
    $project_id = $project->ID;
    $changes = false;

    // --- English Cleanup ---
    $en_title = trim($project->post_title);
    $en_desc = trim(strip_tags($project->post_content)); // Strip tags to compare text content

    // Check if description matches title (case-insensitive? User didn't specify, but exact match is safer. Let's do loose string comparison)
    // The user said "matches the project name". "Cleaning" whitespace is important.
    // Also $project->post_content might have HTML p tags.

    // Logic: compare cleaned title and cleaned description.
    // If they are effectively identical, clear the description.

    $norm_en_title = normalize_string($en_title);
    $norm_en_desc = normalize_string($en_desc);

    if ($norm_en_title === $norm_en_desc && !empty($en_desc)) {
        echo "[ID: $project_id] English Match Found:\n";
        echo "  Title: '$en_title'\n";
        echo "  Desc:  '$en_desc'\n";

        $update_args = [
            'ID' => $project_id,
            'post_content' => '',
        ];

        // If exact string differs, promote Description to Title
        if ($en_title !== $en_desc) {
            echo "  ⚠️  Title differs from Description (formatting).\n";
            echo "  Promoting Description to Title...\n";
            $update_args['post_title'] = $en_desc;
        }

        if (!$dry_run) {
            wp_update_post($update_args);
            if (isset($update_args['post_title'])) {
                echo "  ✓ Updated Title and cleared English description.\n";
            } else {
                echo "  ✓ Cleared English description.\n";
            }
        } else {
            if (isset($update_args['post_title'])) {
                echo "  [Dry Run] Would update Title and clear English description.\n";
            } else {
                echo "  [Dry Run] Would clear English description.\n";
            }
        }
        $stats['english_cleared']++;
    }


    // --- Tamil Cleanup ---
    $ta_title = trim(get_post_meta($project_id, '_project_title_tamil', true));
    $ta_desc = trim(get_post_meta($project_id, '_project_description_tamil', true));

    $norm_ta_title = normalize_string($ta_title);
    $norm_ta_desc = normalize_string($ta_desc);

    if (!empty($ta_title) && $norm_ta_title === $norm_ta_desc) {
        echo "[ID: $project_id] Tamil Match Found:\n";
        echo "  Title: '$ta_title'\n";
        echo "  Desc:  '$ta_desc'\n";

        $promote_title = false;
        if ($ta_title !== $ta_desc) {
            echo "  ⚠️  Title differs from Description (formatting).\n";
            echo "  Promoting Description to Title...\n";
            $promote_title = true;
        }

        if (!$dry_run) {
            if ($promote_title) {
                update_post_meta($project_id, '_project_title_tamil', $ta_desc);
                echo "  ✓ Updated Tamil Title.\n";
            }
            update_post_meta($project_id, '_project_description_tamil', '');
            echo "  ✓ Cleared Tamil description.\n";
        } else {
            if ($promote_title) {
                echo "  [Dry Run] Would update Tamil Title.\n";
            }
            echo "  [Dry Run] Would clear Tamil description.\n";
        }
        $stats['tamil_cleared']++;
    }
}

echo "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "Summary:\n";
echo "Processed: " . $stats['processed'] . "\n";
echo "English Descriptions Cleared: " . $stats['english_cleared'] . "\n";
echo "Tamil Descriptions Cleared: " . $stats['tamil_cleared'] . "\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
