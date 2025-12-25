<?php
/**
 * Sync Tamil Spelling Corrections to Database
 * 
 * Usage: php scripts/sync-spellings.php
 * 
 * This script:
 * 1. Reads corrections directly from tamil-spelling-corrections.ts
 * 2. Applies them to:
 *    - Village names (project_village)
 *    - Panchayat names (project_panchayat)
 *    - Project titles (project post type)
 * 3. Reports changes
 */

require_once(__DIR__ . '/../../wp-load.php');

// 1. Parse Corrections from TS file
$ts_file = __DIR__ . '/tamil-spelling-corrections.ts';
if (!file_exists($ts_file)) {
    die("Error: Could not find {$ts_file}\n");
}

$content = file_get_contents($ts_file);

// Extract the object content between '{' and '};'
if (preg_match('/export const tamilSpellingCorrections: Record<string, string> = \{(.*?)\};/s', $content, $matches)) {
    $raw_lines = explode("\n", $matches[1]);
    $corrections = [];

    foreach ($raw_lines as $line) {
        // Match 'wrong': 'correct' or "wrong": "correct"
        if (preg_match("/['\"](.+?)['\"]\s*:\s*['\"](.+?)['\"]/", $line, $pair)) {
            $corrections[$pair[1]] = $pair[2];
        }
    }
} else {
    die("Error: Could not parse tamilSpellingCorrections object from TS file.\n");
}

$count = count($corrections);
echo "Loaded {$count} corrections from tamil-spelling-corrections.ts\n";
echo "Debug: Has நடுகுப்பம்? " . (isset($corrections['நடுகுப்பம்']) ? "YES" : "NO") . "\n";
echo "---------------------------------------------------\n";

$stats = ['v' => 0, 'p' => 0, 't' => 0];

// 2. Apply to Villages
echo "Checking Villages...\n";
$terms = get_terms(['taxonomy' => 'project_village', 'hide_empty' => false]);
foreach ($terms as $term) {
    $current = get_term_meta($term->term_id, '_village_name_tamil', true);
    if (!empty($current) && isset($corrections[$current])) {
        update_term_meta($term->term_id, '_village_name_tamil', $corrections[$current]);
        update_term_meta($term->term_id, 'name_tamil', $corrections[$current]); // Sync new field too
        echo "  [V] {$term->name}: {$current} -> {$corrections[$current]}\n";
        $stats['v']++;
    }
}

// 3. Apply to Panchayats
echo "Checking Panchayats...\n";
$terms = get_terms(['taxonomy' => 'project_panchayat', 'hide_empty' => false]);
foreach ($terms as $term) {
    $current = get_term_meta($term->term_id, 'panchayat_name_tamil', true);
    if (!empty($current) && isset($corrections[$current])) {
        update_term_meta($term->term_id, 'panchayat_name_tamil', $corrections[$current]);
        echo "  [P] {$term->name}: {$current} -> {$corrections[$current]}\n";
        $stats['p']++;
    }
}

// 4. Apply to Project Titles
echo "Checking Project Titles...\n";
$args = ['post_type' => 'project', 'posts_per_page' => -1, 'post_status' => 'any'];
$posts = get_posts($args);

foreach ($posts as $post) {
    $title_ta = get_post_meta($post->ID, '_project_title_tamil', true);
    if (empty($title_ta))
        continue;

    $original = $title_ta;
    $modified = $title_ta;

    // Multi-pass replacement to handle chained corrections (e.g. A -> B, then B -> C)
    // Example: நாடுகுப்பம் -> நடுகுப்பம் -> நடுக்குப்பம்
    $passes = 0;
    do {
        $loop_modified = false;
        $passes++;

        foreach ($corrections as $wrong => $correct) {
            if (strpos($modified, $wrong) !== false) {
                $modified = str_replace($wrong, $correct, $modified);
                $loop_modified = true;
            }
        }
    } while ($loop_modified && $passes < 5);

    if ($original !== $modified) {
        update_post_meta($post->ID, '_project_title_tamil', $modified);
        echo "  [T] #{$post->ID}: Corrected spelling in title\n";
        $stats['t']++;
    }
}

echo "---------------------------------------------------\n";
echo "DONE! Updated: Villages: {$stats['v']}, Panchayats: {$stats['p']}, Titles: {$stats['t']}\n";
