<?php
/**
 * Import Puliyur Projects
 * 
 * Run via browser: http://localhost:8118/sabarajendran/puliyur-import-runner.php
 */

// Load WordPress
require_once(__DIR__ . '/wp-load.php');

// Security check
if (!is_user_logged_in() || !current_user_can('manage_options')) {
    die('Unauthorized access. Please login as an administrator.');
}

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>

<head>
    <title>Import Puliyur Projects</title>
    <style>
        body {
            font-family: -apple-system, sans-serif;
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }

        .success {
            color: #46b450;
        }

        .error {
            color: #dc3232;
        }

        .progress {
            background: #f0f0f0;
            height: 30px;
            border-radius: 5px;
            overflow: hidden;
            margin: 20px 0;
        }

        .progress-bar {
            background: #0073aa;
            height: 100%;
            transition: width 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
    </style>
</head>

<body>
    <h1>Import Puliyur Projects</h1>
    <?php

    // Ensure taxonomies exist
    $block_term = get_term_by('slug', 'kurinjipadi', 'project_block');
    if (!$block_term) {
        $result = wp_insert_term('Kurinjipadi', 'project_block', ['slug' => 'kurinjipadi']);
        $block_id = is_wp_error($result) ? 0 : $result['term_id'];
        update_term_meta($block_id, '_block_name_tamil', 'குறிஞ்சிப்பாடி');
        echo "<p class='success'>Created Kurinjipadi block</p>";
    } else {
        $block_id = $block_term->term_id;
    }

    $panchayat_term = get_term_by('slug', 'puliyur', 'project_panchayat');
    if (!$panchayat_term) {
        $result = wp_insert_term('Puliyur', 'project_panchayat', ['slug' => 'puliyur']);
        $panchayat_id = is_wp_error($result) ? 0 : $result['term_id'];
        update_term_meta($panchayat_id, '_panchayat_name_tamil', 'புலியூர்');
        echo "<p class='success'>Created Puliyur panchayat</p>";
    } else {
        $panchayat_id = $panchayat_term->term_id;
    }

    // Status terms
    $completed_term = get_term_by('slug', 'completed', 'project_status');
    $completed_id = $completed_term ? $completed_term->term_id : 0;
    $partly_term = get_term_by('slug', 'partly-completed', 'project_status');
    $partly_id = $partly_term ? $partly_term->term_id : 0;

    // Category terms
    $infra_term = get_term_by('slug', 'infrastructure', 'project_category');
    $infra_id = $infra_term ? $infra_term->term_id : 0;
    $housing_term = get_term_by('slug', 'housing', 'project_category');
    $housing_id = $housing_term ? $housing_term->term_id : 0;

    // Projects array: [title, budget, title_en, title_ta, status_id, category_id]
    $projects = [
        // Aggregated Housing
        ['153 Houses PMAY-G Puliyur', 36720000, '153 Houses under PMAY-G Scheme', 'பிரதமர் குடியிருப்புத் திட்டத்தின் கீழ் 153 வீடுகள்', $partly_id, $housing_id],
        ['47 Houses PMAY-G Thirattikuppam', 11280000, '47 Houses under PMAY-G Scheme', 'பிரதமர் குடியிருப்புத் திட்டத்தின் கீழ் 47 வீடுகள்', $partly_id, $housing_id],

        // Infrastructure
        ['Thandayarmedu Road Puliyur', 500000, 'Thandayarmedu northstreet', 'தண்டையார்மேடு வடக்கு தெரு', $completed_id, $infra_id],
        ['PWF FHTC Puliyur Kattusagai', 225000, 'PWF and FHTC', 'குடிநீர் வசதி', $completed_id, $infra_id],
        ['Drainage Puliyur South Vasanakuppam', 500000, 'Drainage', 'வடிகால் வசதி', $completed_id, $infra_id],
        ['BT Road Kattusagai North Puliyur', 500000, 'BT Road', 'தார் சாலை', $completed_id, $infra_id],
        ['Pipeline Extension Kattusagai Puliyur', 200000, 'Pipeline extension', 'குழாய் விரிவாக்கம்', $completed_id, $infra_id],
        ['28 FHTC Vasanakuppam Puliyur', 716350, '28 FHTC', '28 குடிநீர் இணைப்புகள்', $completed_id, $infra_id],
        ['73 FHTC Puliyur Village', 1306650, '73 FHTC', '73 குடிநீர் இணைப்புகள்', $completed_id, $infra_id],
        ['Culvert 1.5m Puliyur Village', 497000, 'Culvert 1.5m', 'சிறுபாலம்', $completed_id, $infra_id],
        ['AD Paguthi Road Vasanangkuppam Puliyur', 487000, 'AD Paguthi road', 'ஆதி திராவிடர் பகுதி சாலை', $completed_id, $infra_id],
        ['Tree Plantation Puliyur PT', 200000, 'Tree Plantation', 'மரக்கன்றுகள் நடுதல்', $completed_id, $infra_id],
        ['Threshing Floor Therku Vanankuppam Puliyur', 500000, 'Threshing floor', 'நெற்களம்', $completed_id, $infra_id],
        ['Paver Block Kattusagai Puliyur', 500000, 'Paver Block', 'பேவர் பிளாக் சாலை', $completed_id, $infra_id],
        ['Paver Block Puliyur Village', 200000, 'Paver block', 'பேவர் பிளாக்', $completed_id, $infra_id],
        ['Idumban Koil Street Puliyur', 200000, 'Idumban Koil St', 'இடும்பன் கோயில் தெரு', $completed_id, $infra_id],
        ['Borewell Vasanagkuppam Puliyur', 51526, 'Borewell', 'ஆழ்துளை கிணறு', $completed_id, $infra_id],
        ['OHT Vasanagkuppam Puliyur', 1031474, 'OHT', 'மேல்நிலை நீர் தொட்டி', $completed_id, $infra_id],
        ['Check Dam Puliyur Vaikkal', 532000, 'Check Dam', 'தடுப்பணை', $completed_id, $infra_id],
        ['BT Road South Street Puliyur', 700000, 'BT South Street', 'தெற்கு தார் சாலை', $completed_id, $infra_id],
        ['Table Bench 5Set PUES Puliyur', 97720, '5 Set Table Bench', 'மேசை பெஞ்சுகள்', $completed_id, $infra_id],
        ['Table Bench 10Set Kattusagai Puliyur', 195440, '10 Set Table Bench', 'மேசை பெஞ்சுகள்', $completed_id, $infra_id],
        ['Table Bench 5Set Vasanankuppam Puliyur', 97720, '5 Set Table Bench', 'மேசை பெஞ்சுகள்', $completed_id, $infra_id],
        ['Paver Block West Vasanankuppam Puliyur', 375000, 'Paver Block West', 'பேவர் பிளாக்', $completed_id, $infra_id],
        ['Paver Block Periya Kattu Sagai Puliyur', 400000, 'Paver Block', 'பேவர் பிளாக்', $completed_id, $infra_id],
        ['Drainage Vasanankuppam Puliyur', 757000, 'Drainage', 'வடிகால்', $completed_id, $infra_id],
        ['Borewell Vasanankuppam Puliyur', 741000, 'Borewell', 'ஆழ்துளை கிணறு', $completed_id, $infra_id],
        ['Moringa Nursery Puliyur', 334000, 'Moringa nursery', 'முருங்கை நாற்றுப்பண்ணை', $completed_id, $infra_id],
        ['CC Road AD Paguthi East Puliyur', 625000, 'CC Road AD', 'சிமெண்ட் சாலை', $completed_id, $infra_id],
        ['CC Road Pudhu Street Kattusagai Puliyur', 410000, 'CC Road Pudhu', 'சிமெண்ட் சாலை', $completed_id, $infra_id],
        ['Boys Toilet Kattusagai PUES Puliyur', 530000, 'Boys Toilet', 'மாணவர் கழிப்பறை', $completed_id, $infra_id],
        ['Girls Toilet PUES Puliyur', 591000, 'Girls Toilet', 'மாணவியர் கழிப்பறை', $completed_id, $infra_id],
        ['Girls Toilet Kattusagai PUES Puliyur', 591000, 'Girls Toilet', 'மாணவியர் கழிப்பறை', $completed_id, $infra_id],
        ['Threshing Floor Pethanankuppam Puliyur', 810000, 'Threshing Floor', 'நெற்களம்', $completed_id, $infra_id],
        ['Thandrampettai Pond Puliyur', 1200000, 'Pond Rejuvenation', 'குளம் சீரமைத்தல்', $completed_id, $infra_id],
        ['School Building PUPS Vasanankuppam Puliyur', 3180000, 'School Building', 'புதிய வகுப்பறைகள்', $completed_id, $infra_id],
        ['School Building PUPS Puliyur', 3180000, 'School Building', 'புதிய வகுப்பறைகள்', $completed_id, $infra_id],
        ['School Repairs Kattusagai PUES Puliyur', 336000, 'School Repairs', 'பள்ளி சீரமைப்பு', $completed_id, $infra_id],
        ['School Repairs PUES Puliyur', 333000, 'School Repairs', 'பள்ளி சீரமைப்பு', $completed_id, $infra_id],
        ['Cremation Shed Thirattikuppam Puliyur', 600000, 'Cremation shed', 'மயான கொட்டகை', $completed_id, $infra_id],
        ['Pethangkuppam Kattusagai Road Puliyur', 4855000, 'Connecting Road', 'இணைப்பு சாலை', $completed_id, $infra_id],
        ['Waiting Shed Sitheri Kulakarai Puliyur', 700000, 'Waiting Shed', 'நிழற்குடை', $completed_id, $infra_id],
        ['Drainage Vasanankuppam Village Puliyur', 150000, 'Drainage', 'வடிகால்', $completed_id, $infra_id],
        ['Kitchen Repairs Vasanankuppam Puliyur', 20000, 'Kitchen Repairs', 'சமையல் கூட பழுது', $completed_id, $infra_id],
        ['Kitchen Repairs S Vasanankuppam Puliyur', 50000, 'Kitchen Repairs', 'சமையல் கூட பழுது', $completed_id, $infra_id],
        ['Anganwadi S Vasanankuppam Puliyur', 1400000, 'Anganwadi Building', 'அங்கன்வாடி கட்டிடம்', $completed_id, $infra_id],
        ['Anganwadi Kattusagai Puliyur', 1400000, 'Anganwadi Building', 'அங்கன்வாடி கட்டிடம்', $completed_id, $infra_id],
        ['AWES Kitchen Puliyur', 743000, 'AWES Kitchen', 'அங்கன்வாடி சமையல் கூடம்', $completed_id, $infra_id],
        ['Kitchen GHS Kattusagai Puliyur', 743000, 'Kitchen GHS', 'பள்ளி சமையல் கூடம்', $completed_id, $infra_id],
        ['Kitchen PUES Puliyur', 743000, 'Kitchen PUES', 'சமையல் கூடம்', $completed_id, $infra_id],
        ['Sports Centre Puliyur Village', 145000, 'Sports Centre', 'விளையாட்டு மையம்', $completed_id, $infra_id],
        ['Sports Centre Puliyur PT', 145000, 'Sports Centre', 'விளையாட்டு மையம்', $completed_id, $infra_id],
        ['Library Building Puliyur', 2200000, 'Library', 'நூலக கட்டிடம்', $completed_id, $infra_id],
        ['Mini CSC Puliyur West', 200000, 'Mini CSC', 'MCSC', $completed_id, $infra_id],
        ['E-Cart Puliyur PT', 230000, 'E Cart', 'மின்சார வண்டி', $completed_id, $infra_id],
        ['Tar Road Thirattikuppam Agartamparam Puliyur', 1365000, 'Tar Road', 'தார் சாலை', $completed_id, $infra_id],
        ['Tar Road Siththeri Kulakkarai Puliyur', 960000, 'Tar Road', 'தார் சாலை', $completed_id, $infra_id],
        ['Drainage Kattusagai Middle Puliyur', 881866, 'Drainage', 'வடிகால்', $completed_id, $infra_id],
        ['OHT 60k Ltr Puliyur AD', 2575600, 'OHT 60000L', '60000 லி OHT', $completed_id, $infra_id],
        ['Fencing 30kL OHT Puliyur', 37200, 'Fencing OHT', 'OHT வேலி', $completed_id, $infra_id],
        ['Fencing 60kL OHT Puliyur', 37200, 'Fencing OHT', 'OHT வேலி', $completed_id, $infra_id],
        ['Anganwadi Toilet Pethanankuppam Puliyur', 36000, 'Anganwadi Toilet', 'கழிப்பறை', $completed_id, $infra_id],
        ['Pond Kattusagai Puliyur', 535000, 'Pond', 'புதிய குட்டை', $partly_id, $infra_id],
        ['Pond Kattusagai AD Puliyur', 250000, 'Pond AD', 'குட்டை', $partly_id, $infra_id],
        ['Pond Kattusagai 3 Puliyur', 535000, 'Pond 3', 'குட்டை', $partly_id, $infra_id],
        ['Recharge Shaft Vasanankuppam Puliyur', 50000, 'Recharge Shaft', 'செறிவூட்டு துளை', $partly_id, $infra_id],
        ['Valiyanatham Eri Puliyur', 558000, 'Valiyanatham Eri', 'ஏரி சீரமைத்தல்', $partly_id, $infra_id],
        ['Vengalathu Eri Puliyur', 504000, 'Vengalathu Eri', 'ஏரி சீரமைத்தல்', $partly_id, $infra_id],
        ['Three Wheeler Disabled Puliyur', 101800, 'Three Wheeler', 'மூன்று சக்கர வண்டி', $completed_id, $infra_id],
        ['CC Road Puliyur AD Paguthi', 1000000, 'CC Road AD', 'சிமெண்ட் சாலை', $completed_id, $infra_id],
        ['Crematorium Shed Repair Puliyur', 133000, 'Crematorium Repair', 'மயான கொட்டகை பழுது', $completed_id, $infra_id],
        ['Bathing Ghat Siththeri Puliyur', 200000, 'Bathing Ghat', 'படித்துறை', $completed_id, $infra_id],
        ['Borewell Vasanankuppam AD Puliyur', 331000, 'Borewell new', 'ஆழ்துளை கிணறு', $completed_id, $infra_id],
        ['Plantation Munishwaran Kovil Puliyur', 70000, 'Plantation', 'மரக்கன்றுகள்', $completed_id, $infra_id],
        ['Plantation Iyyanar Kovil Puliyur', 70000, 'Plantation', 'மரக்கன்றுகள்', $completed_id, $infra_id],
        ['Anganwadi Puliyur Main', 1645000, 'Anganwadi Main', 'அங்கன்வாடி கட்டிடம்', $partly_id, $infra_id],
        ['CC Pavement Sudukattu Puliyur', 350000, 'CC Sudukattu', 'சிமெண்ட் சாலை', $completed_id, $infra_id],
        ['Food Godown Kattusagai Puliyur', 1336000, 'Food Godown', 'உணவு தானிய கிடங்கு', $partly_id, $infra_id],
        ['Food Godown AD Puliyur', 1336000, 'Food Godown AD', 'உணவு தானிய கிடங்கு', $partly_id, $infra_id],
        ['CC Road South Vasanangkuppam Puliyur', 700000, 'CC Road South', 'சிமெண்ட் சாலை', $completed_id, $infra_id],
        ['CC Road Kizhaku Theru Puliyur', 700000, 'CC Road Kizhaku', 'சிமெண்ட் சாலை', $completed_id, $infra_id],
        ['OHT Repairs Kattusagai Puliyur', 60000, 'OHT Repairs', 'OHT பழுது', $partly_id, $infra_id],
        ['Anganwadi Kattusagai 2 Puliyur', 1400000, 'Anganwadi 2', 'அங்கன்வாடி கட்டிடம்', $partly_id, $infra_id],

        // House Repairs
        ['Major Repairs Jaya Puliyur', 32000, 'Major Repairs Jaya', 'ஜெயா வீடு பழுது', $completed_id, $housing_id],
        ['Major Repairs Arumaikannu Puliyur', 150000, 'Major Repairs Arumaikannu', 'அருமைக்கண்ணு வீடு பழுது', $completed_id, $housing_id],
        ['Minor Repairs Pappathi Puliyur', 27000, 'Minor Repairs Pappathi', 'பாப்பாத்தி வீடு பழுது', $completed_id, $housing_id],
        ['Minor Repairs Balasubramaniyan Puliyur', 27000, 'Minor Repairs Bala', 'பாலசுப்ரமணியன் வீடு பழுது', $completed_id, $housing_id],
        ['Minor Repairs Jaya RRH2 Puliyur', 32000, 'Minor Repairs Jaya II', 'ஜெயா வீடு பழுது', $completed_id, $housing_id],
        ['Minor Repairs Anjammal Puliyur', 32000, 'Minor Repairs Anjammal', 'அஞ்சம்மாள் வீடு பழுது', $completed_id, $housing_id],

        // Special Housing
        ['Kalaignarin Kanavu Illam Punitha Puliyur', 310000, 'New House Punitha', 'புனிதா வீடு (கலைஞரின் கனவு இல்லம்)', $partly_id, $housing_id],
    ];

    $total = count($projects);
    $created = 0;
    $skipped = 0;

    echo "<p>Found $total projects to import</p>";
    echo "<div class='progress'><div class='progress-bar' id='bar' style='width:0%'>0%</div></div>";
    echo "<p id='status'>Starting...</p>";
    ob_flush();
    flush();

    foreach ($projects as $i => $p) {
        $slug = sanitize_title($p[0]);

        // Check if exists
        $existing = get_page_by_path($slug, OBJECT, 'project');
        if ($existing) {
            $skipped++;
        } else {
            $post_id = wp_insert_post([
                'post_title' => $p[0],
                'post_name' => $slug,
                'post_type' => 'project',
                'post_status' => 'publish',
                'post_author' => 1,
            ]);

            if ($post_id && !is_wp_error($post_id)) {
                update_post_meta($post_id, '_project_budget', $p[1]);
                update_post_meta($post_id, '_project_title_english', $p[2]);
                update_post_meta($post_id, '_project_title_tamil', $p[3]);

                wp_set_object_terms($post_id, [$block_id], 'project_block');
                wp_set_object_terms($post_id, [$panchayat_id], 'project_panchayat');
                if ($p[4])
                    wp_set_object_terms($post_id, [$p[4]], 'project_status');
                if ($p[5])
                    wp_set_object_terms($post_id, [$p[5]], 'project_category');

                $created++;
            }
        }

        $pct = round((($i + 1) / $total) * 100);
        echo "<script>document.getElementById('bar').style.width='{$pct}%';document.getElementById('bar').innerText='{$pct}%';document.getElementById('status').innerText='Processed " . ($i + 1) . "/$total';</script>";
        ob_flush();
        flush();
        usleep(5000);
    }

    echo "<h2 class='success'>✅ Import Complete!</h2>";
    echo "<p><strong>Created:</strong> $created projects</p>";
    echo "<p><strong>Skipped (existing):</strong> $skipped projects</p>";
    echo "<p><a href='/wp-admin/edit.php?post_type=project'>View Projects in Admin</a></p>";
    ?>
</body>

</html>