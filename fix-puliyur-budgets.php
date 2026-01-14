<?php
/**
 * Fix Puliyur Project Budgets
 * Run: http://localhost:8118/sabarajendran/fix-puliyur-budgets.php
 */
require_once(__DIR__ . '/wp-load.php');

if (!is_user_logged_in() || !current_user_can('manage_options')) {
    die('Admin access required');
}

header('Content-Type: text/html; charset=utf-8');
echo "<pre>\n=== FIX PULIYUR BUDGETS ===\n\n";

// Budget mapping by title keywords
$budgets = [
    '153 houses' => 36720000,
    '47 houses' => 11280000,
    'thandayarmedu' => 500000,
    'pwf' => 225000,
    'drainage.*south.*vasana' => 500000,
    'bt.*kattusagai.*north' => 500000,
    'pipeline' => 200000,
    '28 fhtc' => 716350,
    '73 fhtc' => 1306650,
    'culvert' => 497000,
    'ad.*paguthi.*road' => 487000,
    'tree plantation' => 200000,
    'threshing.*therku' => 500000,
    'paver.*kattusagai' => 500000,
    'paver.*puliyur(?!.*kattusagai)' => 200000,
    'idumban' => 200000,
    'borewell.*vasanag' => 51526,
    'oht.*vasanag' => 1031474,
    'check dam' => 532000,
    'bt.*south.*street' => 700000,
    'table.*5.*set.*pues' => 97720,
    'table.*10.*set' => 195440,
    'table.*5.*set.*vasanankuppam' => 97720,
    'paver.*west.*vasana' => 375000,
    'paver.*periya' => 400000,
    'drainage.*vasanankuppam' => 757000,
    'borewell.*vasanankuppam' => 741000,
    'moringa' => 334000,
    'cc road.*ad.*east' => 625000,
    'cc road.*pudhu' => 410000,
    'boys toilet' => 530000,
    'girls toilet.*puliyur pues' => 591000,
    'girls toilet.*kattusagai' => 591000,
    'threshing.*pethanankuppam' => 810000,
    'thandrampettai' => 1200000,
    'school.*vasanankuppam' => 3180000,
    'school.*building.*puliyur' => 3180000,
    'repairs.*kattasagai' => 336000,
    'repairs.*puliyur pues' => 333000,
    'cremation shed' => 600000,
    'pethangkuppam.*kattusagai' => 4855000,
    'waiting shed' => 700000,
    'drainage.*village' => 150000,
    'kitchen.*repairs.*vasana' => 20000,
    'kitchen.*s.*vasana' => 50000,
    'anganwadi.*s.*vasana' => 1400000,
    'anganwadi.*kattusagai' => 1400000,
    'awes' => 743000,
    'kitchen.*ghs' => 743000,
    'kitchen.*pues.*puliyur' => 743000,
    'sports centre' => 145000,
    'library' => 2200000,
    'mini csc' => 200000,
    'e-?cart' => 230000,
    'tar.*thirattikuppam.*agartamparam' => 1365000,
    'tar.*siththeri' => 960000,
    'drainage.*middle' => 881866,
    'oht.*60' => 2575600,
    'fencing.*30' => 37200,
    'fencing.*60' => 37200,
    'anganwadi.*toilet' => 36000,
    'pond.*kattusagai' => 535000,
    'recharge' => 50000,
    'valiyanatham' => 558000,
    'vengalathu' => 504000,
    'three wheeler' => 101800,
    'cc road.*puliyur.*ad' => 1000000,
    'crematorium.*repair' => 133000,
    'bathing ghat' => 200000,
    'borewell.*new' => 331000,
    'plantation.*munishwaran' => 70000,
    'plantation.*iyyanar' => 70000,
    'anganwadi.*main' => 1645000,
    'sudukattu' => 350000,
    'food.*godown.*kattusagai' => 1336000,
    'food.*godown.*ad' => 1336000,
    'cc road.*south' => 700000,
    'cc road.*kizhaku' => 700000,
    'oht.*repairs' => 60000,
    'major.*jaya' => 32000,
    'major.*arumaikannu' => 150000,
    'minor.*pappathi' => 27000,
    'minor.*bala' => 27000,
    'minor.*jaya' => 32000,
    'minor.*anjammal' => 32000,
    'kanavu.*illam' => 310000,
];

// Get all Puliyur projects
$posts = get_posts([
    'post_type' => 'project',
    'posts_per_page' => -1,
    'tax_query' => [
        [
            'taxonomy' => 'project_panchayat',
            'field' => 'slug',
            'terms' => 'puliyur'
        ]
    ]
]);

$updated = 0;
$skipped = 0;

foreach ($posts as $post) {
    $title = strtolower($post->post_title);
    $current_budget = get_post_meta($post->ID, '_project_budget', true);

    // Skip if already has budget
    if (!empty($current_budget) && $current_budget > 0) {
        $skipped++;
        continue;
    }

    $matched_budget = 0;
    foreach ($budgets as $pattern => $budget) {
        if (preg_match('/' . $pattern . '/i', $title)) {
            $matched_budget = $budget;
            break;
        }
    }

    if ($matched_budget > 0) {
        update_post_meta($post->ID, '_project_budget', $matched_budget);
        echo "Updated: {$post->post_title} => ₹" . number_format($matched_budget) . "\n";
        $updated++;
    } else {
        echo "No match: {$post->post_title}\n";
    }
}

echo "\n=== COMPLETE ===\n";
echo "Updated: $updated\n";
echo "Skipped (already has budget): $skipped\n";
echo "</pre>";
