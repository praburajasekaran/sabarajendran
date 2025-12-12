<?php
/**
 * Comprehensive diagnostic to find Kurinjipadi projects and their location data
 */

require_once('wp-load.php');

echo "=================================================================\n";
echo "KURINJIPADI PROJECTS DIAGNOSTIC\n";
echo "=================================================================\n\n";

// 1. Check all available blocks
echo "1. AVAILABLE BLOCKS:\n";
echo str_repeat("-", 65) . "\n";
$blocks = get_terms(array(
    'taxonomy' => 'block',
    'hide_empty' => false
));

foreach ($blocks as $block) {
    echo sprintf("  - %s (slug: %s, count: %d)\n", $block->name, $block->slug, $block->count);
}
echo "\n";

// 2. Try to find Kurinjipadi projects with different variations
echo "2. SEARCHING FOR KURINJIPADI PROJECTS:\n";
echo str_repeat("-", 65) . "\n";

$search_terms = array('Kurinjipadi', 'குறிஞ்சிப்பாடி', 'kurinjipadi');
$found_projects = array();

foreach ($search_terms as $term) {
    $args = array(
        'post_type' => 'project',
        'posts_per_page' => -1,
        'tax_query' => array(
            array(
                'taxonomy' => 'block',
                'field' => 'name',
                'terms' => $term
            )
        )
    );

    $projects = get_posts($args);
    if (!empty($projects)) {
        echo "  Found " . count($projects) . " projects for block term: '$term'\n";
        $found_projects = array_merge($found_projects, $projects);
    }
}

if (empty($found_projects)) {
    echo "  No Kurinjipadi projects found via taxonomy query.\n";
    echo "  Trying alternative search methods...\n\n";

    // Try searching all projects
    $all_projects = get_posts(array(
        'post_type' => 'project',
        'posts_per_page' => 10
    ));

    echo "3. SAMPLE OF ALL PROJECTS (first 10):\n";
    echo str_repeat("-", 65) . "\n";

    foreach ($all_projects as $project) {
        $blocks = wp_get_post_terms($project->ID, 'block');
        $block_names = array_map(function ($b) {
            return $b->name; }, $blocks);
        $panchayats = wp_get_post_terms($project->ID, 'panchayat');
        $panchayat_names = array_map(function ($p) {
            return $p->name; }, $panchayats);
        $villages = wp_get_post_terms($project->ID, 'village');
        $village_names = array_map(function ($v) {
            return $v->name; }, $villages);

        $location = get_post_meta($project->ID, 'location', true);
        $location_en = get_post_meta($project->ID, 'location_en', true);

        echo sprintf(
            "  ID: %d\n  Title: %s\n  Block: %s\n  Panchayat: %s\n  Village: %s\n  Location Meta: %s\n  Location EN Meta: %s\n%s\n\n",
            $project->ID,
            $project->post_title,
            implode(', ', $block_names) ?: '(none)',
            implode(', ', $panchayat_names) ?: '(none)',
            implode(', ', $village_names) ?: '(none)',
            $location ?: '(empty)',
            $location_en ?: '(empty)',
            str_repeat("-", 65)
        );
    }
} else {
    // We found Kurinjipadi projects, analyze their locations
    echo "\n3. KURINJIPADI PROJECT LOCATIONS:\n";
    echo str_repeat("-", 65) . "\n";

    $locations = array();

    foreach ($found_projects as $project) {
        $panchayats = wp_get_post_terms($project->ID, 'panchayat');
        $panchayat_names = array_map(function ($p) {
            return $p->name; }, $panchayats);
        $villages = wp_get_post_terms($project->ID, 'village');
        $village_names = array_map(function ($v) {
            return $v->name; }, $villages);

        $location = get_post_meta($project->ID, 'location', true);
        $location_en = get_post_meta($project->ID, 'location_en', true);

        // Collect unique locations
        if (!empty($panchayat_names)) {
            foreach ($panchayat_names as $pname) {
                if (!isset($locations[$pname])) {
                    $locations[$pname] = array('type' => 'panchayat', 'count' => 0);
                }
                $locations[$pname]['count']++;
            }
        }

        if (!empty($village_names)) {
            foreach ($village_names as $vname) {
                if (!isset($locations[$vname])) {
                    $locations[$vname] = array('type' => 'village', 'count' => 0);
                }
                $locations[$vname]['count']++;
            }
        }

        if (!empty($location)) {
            if (!isset($locations[$location])) {
                $locations[$location] = array('type' => 'meta', 'count' => 0, 'en' => $location_en);
            }
            $locations[$location]['count']++;
        }
    }

    // Sort by count
    uasort($locations, function ($a, $b) {
        return $b['count'] - $a['count'];
    });

    foreach ($locations as $loc_name => $loc_data) {
        $en_info = isset($loc_data['en']) ? " | EN: {$loc_data['en']}" : "";
        echo sprintf("  %s (%s, used %d times)%s\n", $loc_name, $loc_data['type'], $loc_data['count'], $en_info);
    }

    // Export to JSON
    $export_data = array();
    foreach ($locations as $loc_name => $loc_data) {
        $is_tamil = preg_match('/[\x{0B80}-\x{0BFF}]/u', $loc_name);
        $export_data[] = array(
            'name' => $loc_name,
            'type' => $loc_data['type'],
            'count' => $loc_data['count'],
            'is_tamil' => $is_tamil,
            'english_version' => isset($loc_data['en']) ? $loc_data['en'] : ''
        );
    }

    file_put_contents('kurinjipadi_locations_full.json', json_encode($export_data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    echo "\n  Exported to: kurinjipadi_locations_full.json\n";
}

echo "\n=================================================================\n";
