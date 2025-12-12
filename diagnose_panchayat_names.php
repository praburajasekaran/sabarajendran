<?php
/**
 * Detailed diagnostic of panchayat names in WordPress
 * Check for Tamil-named panchayats and sample projects
 */

require_once('wp-load.php');

echo "=================================================================\n";
echo "DETAILED PANCHAYAT DIAGNOSTIC\n";
echo "=================================================================\n\n";

// Function to check if a string contains Tamil characters
function containsTamil($str)
{
    return preg_match('/[\x{0B80}-\x{0BFF}]/u', $str);
}

// Get ALL panchayat terms
$all_panchayats = get_terms(array(
    'taxonomy' => 'project_panchayat',
    'hide_empty' => false
));

echo "1. ALL PANCHAYAT TERMS:\n";
echo str_repeat("-", 65) . "\n";

$tamil_panchayats = array();
$english_panchayats = array();

foreach ($all_panchayats as $panch) {
    $isTamil = containsTamil($panch->name);
    if ($isTamil) {
        $tamil_panchayats[] = $panch;
        echo sprintf("  [TAMIL] %s (slug: %s, count: %d)\n", $panch->name, $panch->slug, $panch->count);
    } else {
        $english_panchayats[] = $panch;
    }
}

echo "\nTamil-named panchayats: " . count($tamil_panchayats) . "\n";
echo "English-named panchayats: " . count($english_panchayats) . "\n\n";

// Get sample projects from Kurinjipadi block
echo "2. SAMPLE KURINJIPADI PROJECTS:\n";
echo str_repeat("-", 65) . "\n";

$args = array(
    'post_type' => 'project',
    'posts_per_page' => 10,
    'tax_query' => array(
        array(
            'taxonomy' => 'project_block',
            'field' => 'name',
            'terms' => array('Kurinjipadi', 'குறிஞ்சிப்பாடி'),
            'operator' => 'IN'
        )
    )
);

$projects = get_posts($args);

if (empty($projects)) {
    echo "  No Kurinjipadi projects found. Trying all blocks...\n\n";

    // Get all blocks
    $blocks = get_terms(array(
        'taxonomy' => 'project_block',
        'hide_empty' => false
    ));

    echo "  Available blocks:\n";
    foreach ($blocks as $block) {
        echo sprintf("    - %s (slug: %s, count: %d)\n", $block->name, $block->slug, $block->count);
    }

    // Try getting any projects
    $args = array(
        'post_type' => 'project',
        'posts_per_page' => 10
    );
    $projects = get_posts($args);
    echo "\n  Showing sample of ANY projects:\n\n";
}

foreach ($projects as $project) {
    $panchayats = wp_get_post_terms($project->ID, 'project_panchayat');
    $blocks = wp_get_post_terms($project->ID, 'project_block');

    $panchayat_name = !empty($panchayats) ? $panchayats[0]->name : '(none)';
    $block_name = !empty($blocks) ? $blocks[0]->name : '(none)';

    $panchayat_is_tamil = containsTamil($panchayat_name);
    $block_is_tamil = containsTamil($block_name);

    echo sprintf(
        "  Project ID: %d\n  Title: %s\n  Block: %s %s\n  Panchayat: %s %s\n%s\n\n",
        $project->ID,
        $project->post_title,
        $block_name,
        $block_is_tamil ? '[TAMIL]' : '[ENGLISH]',
        $panchayat_name,
        $panchayat_is_tamil ? '[TAMIL]' : '[ENGLISH]',
        str_repeat("-", 65)
    );
}

echo "\n=================================================================\n";
