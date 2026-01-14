<?php
/**
 * Puliyur Projects Import Script
 * Run: php docs/other-projects/puliyur-import.php (from WordPress root)
 * Or visit: yoursite.com/docs/other-projects/puliyur-import.php
 */

// Increase execution time and memory
set_time_limit(300);
ini_set('memory_limit', '512M');

// Load WordPress
require_once(__DIR__ . '/../../wp-load.php');

// Check if user is admin (for web access)
if (php_sapi_name() !== 'cli' && !current_user_can('manage_options')) {
    die('Admin access required');
}

// Flush output helper
function flush_output()
{
    if (ob_get_level())
        ob_flush();
    flush();
}

echo "<pre>\n";
echo "=== PULIYUR PROJECTS IMPORT ===\n\n";
flush_output();

// Configuration
$block_name = 'Kurinjipadi';
$block_slug = 'kurinjipadi';
$panchayat_name = 'Puliyur';
$panchayat_slug = 'puliyur';

// Ensure taxonomies exist
$block_term = term_exists($block_slug, 'project_block');
if (!$block_term) {
    $block_term = wp_insert_term($block_name, 'project_block', ['slug' => $block_slug]);
    echo "Created block term: $block_name\n";
}
$block_id = is_array($block_term) ? $block_term['term_id'] : $block_term;

$panchayat_term = term_exists($panchayat_slug, 'project_panchayat');
if (!$panchayat_term) {
    $panchayat_term = wp_insert_term($panchayat_name, 'project_panchayat', ['slug' => $panchayat_slug]);
    echo "Created panchayat term: $panchayat_name\n";
}
$panchayat_id = is_array($panchayat_term) ? $panchayat_term['term_id'] : $panchayat_term;

// Add Tamil translations to terms
update_term_meta($block_id, '_block_name_tamil', 'குறிஞ்சிப்பாடி');
update_term_meta($panchayat_id, '_panchayat_name_tamil', 'புலியூர்');

// Helper function to create project
function create_project($title, $budget, $title_en, $title_ta, $status = 'Completed', $category = 'Infrastructure')
{
    global $block_id, $panchayat_id;

    $slug = sanitize_title($title);

    // Check if already exists
    $existing = get_page_by_path($slug, OBJECT, 'project');
    if ($existing) {
        echo "  Skipped (exists): $title\n";
        return $existing->ID;
    }

    $post_id = wp_insert_post([
        'post_title' => $title,
        'post_name' => $slug,
        'post_type' => 'project',
        'post_status' => 'publish',
        'post_author' => 1,
    ]);

    if (is_wp_error($post_id)) {
        echo "  Error: " . $post_id->get_error_message() . "\n";
        return false;
    }

    // Add meta
    update_post_meta($post_id, '_project_budget', $budget);
    update_post_meta($post_id, '_project_title_english', $title_en);
    update_post_meta($post_id, '_project_title_tamil', $title_ta);

    // Set taxonomies
    wp_set_object_terms($post_id, [$block_id], 'project_block');
    wp_set_object_terms($post_id, [$panchayat_id], 'project_panchayat');

    // Status term
    $status_term = term_exists(sanitize_title($status), 'project_status');
    if (!$status_term) {
        $status_term = wp_insert_term($status, 'project_status');
    }
    $status_id = is_array($status_term) ? $status_term['term_id'] : $status_term;
    wp_set_object_terms($post_id, [$status_id], 'project_status');

    // Category term
    $cat_term = term_exists(sanitize_title($category), 'project_category');
    if (!$cat_term) {
        $cat_term = wp_insert_term($category, 'project_category');
    }
    $cat_id = is_array($cat_term) ? $cat_term['term_id'] : $cat_term;
    wp_set_object_terms($post_id, [$cat_id], 'project_category');

    echo "  Created: $title (ID: $post_id)\n";
    return $post_id;
}

// Aggregated Housing
echo "\n--- AGGREGATED HOUSING ---\n";
create_project('153 Houses under PMAY-G Scheme in Puliyur', 36720000, '153 Houses under PMAY-G Scheme', 'பிரதமர் குடியிருப்புத் திட்டத்தின் கீழ் 153 வீடுகள்', 'Partly Completed', 'Housing');
create_project('47 Houses under PMAY-G Scheme in Thirattikuppam', 11280000, '47 Houses under PMAY-G Scheme', 'பிரதமர் குடியிருப்புத் திட்டத்தின் கீழ் 47 வீடுகள்', 'Partly Completed', 'Housing');

// Infrastructure Projects
echo "\n--- INFRASTRUCTURE ---\n";
$projects = [
    ['Thandayarmedu northstreet Road', 500000, 'Thandayarmedu northstreet', 'தண்டையார்மேடு வடக்கு தெரு'],
    ['PWF and FHTC Puliyur Kattusagai', 225000, 'PWF and FHTC', 'புலியூர் காட்டுசாகையில் குடிநீர் வசதி'],
    ['Drainage at Puliyur South Vasanakuppam', 500000, 'Drainage Puliyur South', 'புலியூர் தெற்கு வசனகுப்பத்தில் வடிகால்'],
    ['BT Road Puliyur Kattusagai North Street', 500000, 'BT Kattusagai North', 'காட்டுசாகை வடக்கு தெரு தார் சாலை'],
    ['Pipeline Extension Puliyur Kattusagai', 200000, 'Pipeline extension', 'குடிநீர் குழாய் விரிவாக்கம்'],
    ['Providing 28 FHTC Vasanakuppam', 716350, '28 FHTC Vasanakuppam', '28 வீட்டு குடிநீர் இணைப்புகள்'],
    ['Providing 73 FHTC Puliyur', 1306650, '73 FHTC Puliyur', '73 வீட்டு குடிநீர் இணைப்புகள்'],
    ['Culvert 1.5m Puliyur', 497000, 'Culvert 1.5m', '1.5 மீ சிறுபாலம்'],
    ['Vasanangkuppam AD Road', 487000, 'AD Paguthi road', 'ஆதி திராவிடர் பகுதி சாலை'],
    ['Tree Plantation Puliyur', 200000, 'Tree Plantation', 'மரக்கன்றுகள் நடுதல்'],
    ['Threshing Floor Therku Vanankuppam', 500000, 'Threshing floor', 'நெற்களம் அமைத்தல்'],
    ['Paver Block Kattusagai', 500000, 'Paver Block Kattusagai', 'பேவர் பிளாக் சாலை'],
    ['Paver Block Puliyur', 200000, 'Paver block Puliyur', 'புலியூர் பேவர் பிளாக்'],
    ['Idumban Koil Street Road', 200000, 'Idumban Koil St', 'இடும்பன் கோயில் தெரு'],
    ['Borewell Vasanagkuppam', 51526, 'Borewell Vasanagkuppam', 'ஆழ்துளை கிணறு'],
    ['OHT Vasanagkuppam', 1031474, 'OHT Vasanagkuppam', 'மேல்நிலை நீர் தொட்டி'],
    ['Check Dam Puliyur Vaikkal', 532000, 'Check Dam', 'கான்கிரீட் தடுப்பணை'],
    ['BT Road Puliyur South Street', 700000, 'BT South Street', 'தெற்கு தெரு தார் சாலை'],
    ['Table Bench 5 Set Puliyur PUES', 97720, '5 Set Table Bench PUES', '5 செட் மேசை பெஞ்சுகள்'],
    ['Table Bench 10 Set Kattusagai', 195440, '10 Set Kattusagai', '10 செட் மேசை பெஞ்சுகள்'],
    ['Table Bench 5 Set Vasanankuppam', 97720, '5 Set Vasanankuppam', 'வசனகுப்பம் மேசை பெஞ்சுகள்'],
    ['Paver Block West Street Vasanankuppam', 375000, 'West Street Vasanankuppam', 'மேற்கு தெரு பேவர் பிளாக்'],
    ['Paver Block Periya Kattu Sagai', 400000, 'Periya Kattu Sagai', 'பெரிய காட்டுசாகை'],
    ['Drainage Vasanankuppam', 757000, 'Drainage Vasanankuppam', 'வசனகுப்பத்தில் வடிகால்'],
    ['Borewell Puliyur Vasanankuppam', 741000, 'Borewell Puliyur', 'புலியூர் ஆழ்துளை கிணறு'],
    ['Moringa Nursery', 334000, 'Moringa nursery', 'முருங்கை நாற்றுப்பண்ணை'],
    ['CC Road AD Paguthi East', 625000, 'CC Road AD East', 'ஆதி திராவிடர் சிமெண்ட் சாலை'],
    ['CC Road Pudhu Street Kattusagai', 410000, 'CC Road Pudhu', 'புது தெரு சிமெண்ட் சாலை'],
    ['Boys Toilet Kattusagai PUES', 530000, 'Boys Toilet', 'மாணவர் கழிப்பறை'],
    ['Girls Toilet Puliyur PUES', 591000, 'Girls Toilet Puliyur', 'மாணவியர் கழிப்பறை'],
    ['Girls Toilet Kattusagai PUES', 591000, 'Girls Toilet Kattusagai', 'காட்டுசாகை மாணவியர் கழிப்பறை'],
    ['Threshing Floor Pethanankuppam', 810000, 'Threshing Pethanankuppam', 'பெத்தநாயக்கன்குப்பம் நெற்களம்'],
    ['Thandrampettai Pond', 1200000, 'Pond Rejuvenation', 'குளம் சீரமைத்தல்'],
    ['School Building PUPS Vasanankuppam', 3180000, 'School Vasanankuppam', '2 புதிய வகுப்பறைகள்'],
    ['School Building PUPS Puliyur', 3180000, 'School Puliyur', 'புலியூர் வகுப்பறைகள்'],
    ['School Repairs Kattusagai PUES', 336000, 'Repairs Kattasagai', 'பள்ளி கட்டிட சீரமைப்பு'],
    ['School Repairs Puliyur PUES', 333000, 'Repairs Puliyur', 'புலியூர் சீரமைப்பு'],
    ['Cremation Shed Thirattikuppam', 600000, 'Cremation shed', 'மயான கொட்டகை'],
    ['Pethangkuppam to Kattusagai Road', 4855000, 'Pethangkuppam Road', 'பெத்தநாயக்கன்குப்பம் சாலை'],
    ['Waiting Shed Sitheri Kulakarai', 700000, 'Waiting Shed', 'நிழற்குடை'],
    ['Drainage Vasanankuppam Village', 150000, 'Drainage Village', 'வடிகால் அமைத்தல்'],
    ['Kitchen Repairs Vasanankuppam', 20000, 'Kitchen Repairs', 'சமையல் கூட பழுது'],
    ['Kitchen Repairs S Vasanankuppam', 50000, 'Kitchen S Vasanankuppam', 'தெற்கு சமையல் கூட பழுது'],
    ['Anganwadi S Vasanankuppam', 1400000, 'Anganwadi South', 'தெற்கு அங்கன்வாடி'],
    ['Anganwadi Puliyur Kattusagai', 1400000, 'Anganwadi Kattusagai', 'காட்டுசாகை அங்கன்வாடி'],
    ['AWES Kitchen Puliyur', 743000, 'AWES Puliyur', 'அங்கன்வாடி சமையல் கூடம்'],
    ['Kitchen PUES GHS Kattusagai', 743000, 'Kitchen GHS', 'பள்ளி சமையல் கூடம்'],
    ['Kitchen PUES Puliyur', 743000, 'Kitchen PUES', 'புலியூர் சமையல் கூடம்'],
    ['Rural Sports Centre Puliyur', 145000, 'Sports Centre', 'விளையாட்டு மையம்'],
    ['Rural Sports Centre Pt', 145000, 'Sports Pt', 'விளையாட்டு மையம்'],
    ['Library Building Puliyur', 2200000, 'Library', 'நூலக கட்டிடம்'],
    ['Mini CSC Puliyur West', 200000, 'Mini CSC', 'MCSC'],
    ['E-Cart Puliyur', 230000, 'E Cart', 'மின்சார வண்டி'],
    ['Tar Road Thirattikuppam Agartamparam', 1365000, 'Tar Road', 'தார் சாலை'],
    ['Tar Road Siththeri Kulakkarai', 960000, 'Tar Siththeri', 'சித்தேரி தார் சாலை'],
    ['Drainage Kattusagai Middle', 881866, 'Drainage Middle', 'மத்தி தெரு வடிகால்'],
    ['OHT 60000 Ltr Puliyur AD', 2575600, 'OHT 60000 Ltr', '60000 லி OHT'],
    ['Fencing 30000L OHT', 37200, 'Fencing 30000L', 'OHT வேலி'],
    ['Fencing 60000L OHT', 37200, 'Fencing 60000L', 'OHT வேலி'],
    ['Anganwadi Toilet Pethanankuppam', 36000, 'Anganwadi Toilet', 'அங்கன்வாடி கழிப்பறை'],
    ['Pond Puliyur Kattusagai', 535000, 'Pond Kattusagai', 'புதிய குட்டை', 'Partly Completed'],
    ['Pond Kattusagai AD', 250000, 'Pond AD', 'குட்டை AD', 'Partly Completed'],
    ['Pond Kattusagai 3', 535000, 'Pond 3', 'குட்டை', 'Partly Completed'],
    ['Recharge Shaft Vasanankuppam', 50000, 'Recharge Shaft', 'செறிவூட்டு துளை', 'Partly Completed'],
    ['Valiyanatham Eri', 558000, 'Valiyanatham Eri', 'ஏரி சீரமைத்தல்', 'Partly Completed'],
    ['Vengalathu Eri', 504000, 'Vengalathu Eri', 'ஏரி சீரமைத்தல்', 'Partly Completed'],
    ['Three Wheeler Disabled', 101800, 'Three Wheeler', 'மூன்று சக்கர வண்டி'],
    ['CC Road Puliyur AD', 1000000, 'CC Road AD', 'ஆதி திராவிடர் சிமெண்ட் சாலை'],
    ['Crematorium Shed Repair', 133000, 'Crematorium Repair', 'மயான கொட்டகை பழுது'],
    ['Bathing Ghat Siththeri', 200000, 'Bathing Ghat', 'படித்துறை'],
    ['Borewell Vasanankuppam AD', 331000, 'Borewell new', 'புதிய ஆழ்துளை கிணறு'],
    ['Plantation Munishwaran Kovil', 70000, 'Plantation Munishwaran', 'மரக்கன்றுகள் நடுதல்'],
    ['Plantation Iyyanar Kovil', 70000, 'Plantation Iyyanar', 'மரக்கன்றுகள் நடுதல்'],
    ['Anganwadi Puliyur Main', 1645000, 'Anganwadi Main', 'அங்கன்வாடி கட்டிடம்', 'Partly Completed'],
    ['CC Pavement Sudukattu', 350000, 'CC Sudukattu', 'மயான சாலை'],
    ['Food Grain Godown Kattusagai', 1336000, 'Godown Kattusagai', 'உணவு தானிய கிடங்கு', 'Partly Completed'],
    ['Food Grain Godown Puliyur AD', 1336000, 'Godown AD', 'உணவு தானிய கிடங்கு', 'Partly Completed'],
    ['CC Road South Vasanangkuppam', 700000, 'CC South', 'தெற்கு சிமெண்ட் சாலை'],
    ['CC Road Puliyur Kizhaku', 700000, 'CC Kizhaku', 'கிழக்கு சிமெண்ட் சாலை'],
    ['OHT Repairs Kattusagai', 60000, 'OHT Repairs', 'OHT பழுது', 'Partly Completed'],
    ['Anganwadi Building Kattusagai 2', 1400000, 'Anganwadi 2', 'அங்கன்வாடி கட்டிடம்', 'Partly Completed'],
];

foreach ($projects as $p) {
    $status = isset($p[4]) ? $p[4] : 'Completed';
    create_project($p[0], $p[1], $p[2], $p[3], $status);
}

// House Repairs
echo "\n--- HOUSE REPAIRS ---\n";
create_project('Major Repairs for Jaya', 32000, 'Major Repairs Jaya', 'ஜெயா வீடு பழுது', 'Completed', 'Housing');
create_project('Major Repairs for Arumaikannu', 150000, 'Major Repairs Arumaikannu', 'அருமைக்கண்ணு வீடு பழுது', 'Completed', 'Housing');
create_project('Minor Repairs for Pappathi', 27000, 'Minor Repairs Pappathi', 'பாப்பாத்தி வீடு பழுது', 'Completed', 'Housing');
create_project('Minor Repairs Balasubramaniyan', 27000, 'Minor Repairs Bala', 'பாலசுப்ரமணியன் வீடு பழுது', 'Completed', 'Housing');
create_project('Minor Repairs Jaya RRH-II', 32000, 'Minor Repairs Jaya II', 'ஜெயா வீடு பழுது', 'Completed', 'Housing');
create_project('Minor Repairs Anjammal', 32000, 'Minor Repairs Anjammal', 'அஞ்சம்மாள் வீடு பழுது', 'Completed', 'Housing');

// Special Housing
echo "\n--- SPECIAL HOUSING ---\n";
create_project('Kalaignarin Kanavu Illam Punitha', 310000, 'New House Punitha', 'புனிதா வீடு (கலைஞரின் கனவு இல்லம்)', 'Partly Completed', 'Housing');

echo "\n=== IMPORT COMPLETE ===\n";
echo "</pre>";
