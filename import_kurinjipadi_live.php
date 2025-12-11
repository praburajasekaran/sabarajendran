<?php
/**
 * Import Kurinjipadi Projects from Live Site
 * 
 * Fetches all Kurinjipadi block projects from the live WordPress site
 * and imports them into the local database with proper taxonomy assignments.
 */

// Increase memory limit and execution time
ini_set('memory_limit', '1024M');
set_time_limit(1800); // 30 minutes

// Define flag to disable Netlify hooks during import
define('SABA_IMPORT_RUNNING', true);

// Load WordPress
require_once __DIR__ . '/wp-load.php';

// Disable Netlify Hooks during bulk import to prevent unnecessary API calls
remove_action('save_post', 'saba_netlify_on_post_save', 10);
remove_action('transition_post_status', 'saba_netlify_on_post_status_change', 10);
remove_action('created_term', 'saba_netlify_on_term_change', 10);
remove_action('edited_term', 'saba_netlify_on_term_change', 10);
remove_action('updated_post_meta', 'saba_netlify_on_meta_update', 10);
remove_action('added_post_meta', 'saba_netlify_on_meta_update', 10);

// Configuration
$LIVE_SITE = 'https://tan-emu-358425.hostingersite.com';
$KURINJIPADI_BLOCK_ID = 266; // ID from live site
$DRY_RUN = in_array('--dry-run', $argv ?? []);
$TEST_CONNECTION = in_array('--test-connection', $argv ?? []);


// Statistics
$stats = [
    'total_fetched' => 0,
    'created' => 0,
    'skipped' => 0,
    'errors' => 0
];

/**
 * Fetch JSON from API endpoint with retry logic and exponential backoff
 */
function fetch_api($url, $max_retries = 3, $timeout = 90)
{
    $attempt = 0;
    $backoff_seconds = 2;

    while ($attempt < $max_retries) {
        $attempt++;

        $response = wp_remote_get($url, [
            'timeout' => $timeout,
            'headers' => ['User-Agent' => 'WordPress Import Script']
        ]);

        if (!is_wp_error($response) && wp_remote_retrieve_response_code($response) === 200) {
            $body = wp_remote_retrieve_body($response);
            $data = json_decode($body, true);

            if (json_last_error() === JSON_ERROR_NONE) {
                return $data;
            }

            $error_msg = "JSON Error: " . json_last_error_msg();
        } else {
            $error_msg = is_wp_error($response) ? $response->get_error_message() : 'HTTP ' . wp_remote_retrieve_response_code($response);
        }

        // Log error
        echo "  Attempt {$attempt}/{$max_retries} failed: {$error_msg}\n";

        // Don't sleep on last attempt
        if ($attempt < $max_retries) {
            echo "  Retrying in {$backoff_seconds} seconds...\n";
            sleep($backoff_seconds);
            $backoff_seconds *= 2; // Exponential backoff: 2s, 4s, 8s
        }
    }

    echo "❌ Failed after {$max_retries} attempts\n";
    return false;
}

/**
 * Test API connectivity
 */
function test_connection($live_site)
{
    echo "🔍 Testing connection to {$live_site}...\n";

    // Test blocks endpoint
    $blocks = fetch_api("{$live_site}/wp-json/wp/v2/project_block");
    if (!$blocks) {
        echo "❌ Failed to fetch blocks\n";
        return false;
    }

    $kurinjipadi = array_filter($blocks, fn($b) => $b['slug'] === 'kurinjipadi');
    if (empty($kurinjipadi)) {
        echo "❌ Kurinjipadi block not found\n";
        return false;
    }

    $kurinjipadi = array_values($kurinjipadi)[0];
    echo "✓ Found Kurinjipadi block (ID: {$kurinjipadi['id']}, Count: {$kurinjipadi['count']} projects)\n";

    // Test projects endpoint
    $projects = fetch_api("{$live_site}/wp-json/wp/v2/project?per_page=1&project_block={$kurinjipadi['id']}");
    if (!$projects || empty($projects)) {
        echo "❌ No projects found for Kurinjipadi\n";
        return false;
    }

    echo "✓ Successfully fetched sample project\n";
    echo "✓ Connection test passed!\n\n";
    return true;
}

/**
 * Get or create taxonomy term (memory-efficient version using direct DB queries)
 */
function get_or_create_term($term_id, $taxonomy, $live_site, &$term_cache)
{
    global $wpdb;

    $cache_key = "{$taxonomy}_{$term_id}";

    // Check cache first
    if (isset($term_cache[$cache_key])) {
        return $term_cache[$cache_key];
    }

    // Fetch term details from live site
    $term_data = fetch_api("{$live_site}/wp-json/wp/v2/{$taxonomy}/{$term_id}");
    if (!$term_data) {
        echo "  ⚠️  Warning: Could not fetch {$taxonomy} term ID {$term_id}\n";
        return null;
    }

    // Check if term exists locally using direct database query (avoids memory leak)
    $slug = sanitize_title($term_data['slug']);
    $existing_term_id = $wpdb->get_var($wpdb->prepare(
        "SELECT t.term_id
         FROM {$wpdb->terms} t
         INNER JOIN {$wpdb->term_taxonomy} tt ON t.term_id = tt.term_id
         WHERE t.slug = %s AND tt.taxonomy = %s
         LIMIT 1",
        $slug,
        $taxonomy
    ));

    if ($existing_term_id) {
        $term_cache[$cache_key] = (int)$existing_term_id;
        return (int)$existing_term_id;
    }

    // Create term using direct SQL (completely avoids WordPress term loading)
    // Step 1: Insert into terms table
    $wpdb->query($wpdb->prepare(
        "INSERT INTO {$wpdb->terms} (name, slug, term_group) VALUES (%s, %s, 0)",
        $term_data['name'],
        $slug
    ));

    // Get the inserted term_id using LAST_INSERT_ID()
    $term_id = (int) $wpdb->get_var("SELECT LAST_INSERT_ID()");

    if (!$term_id) {
        // Insert failed - check if term already exists (race condition)
        $existing_term_id = $wpdb->get_var($wpdb->prepare(
            "SELECT t.term_id
             FROM {$wpdb->terms} t
             INNER JOIN {$wpdb->term_taxonomy} tt ON t.term_id = tt.term_id
             WHERE t.slug = %s AND tt.taxonomy = %s
             LIMIT 1",
            $slug,
            $taxonomy
        ));

        if ($existing_term_id) {
            $term_cache[$cache_key] = (int)$existing_term_id;
            return (int)$existing_term_id;
        }

        return null;
    }

    // Step 2: Insert into term_taxonomy table
    $wpdb->query($wpdb->prepare(
        "INSERT INTO {$wpdb->term_taxonomy} (term_id, taxonomy, description, parent, count)
         VALUES (%d, %s, '', 0, 0)",
        $term_id,
        $taxonomy
    ));

    $term_cache[$cache_key] = $term_id;
    return $term_id;
}

/**
 * Load progress from JSON file
 */
function load_progress($progress_file)
{
    if (file_exists($progress_file)) {
        $data = json_decode(file_get_contents($progress_file), true);
        return $data ?? ['last_completed_page' => 0, 'imported_source_ids' => []];
    }
    return ['last_completed_page' => 0, 'imported_source_ids' => []];
}

/**
 * Save progress to JSON file
 */
function save_progress($progress_file, $page, $imported_source_ids)
{
    // Ensure logs directory exists
    $dir = dirname($progress_file);
    if (!file_exists($dir)) {
        mkdir($dir, 0755, true);
    }

    $data = [
        'last_completed_page' => $page,
        'imported_source_ids' => $imported_source_ids,
        'last_update' => date('Y-m-d H:i:s'),
        'timestamp' => time()
    ];
    file_put_contents($progress_file, json_encode($data, JSON_PRETTY_PRINT));
}

/**
 * Check if project already imported (fast in-memory check)
 */
function is_already_imported($source_id, $imported_source_ids)
{
    return in_array($source_id, $imported_source_ids, true);
}

/**
 * ImportLogger class for structured logging
 */
class ImportLogger
{
    private $log_file;
    private $start_time;

    public function __construct($log_file)
    {
        $this->log_file = $log_file;
        $this->start_time = microtime(true);
        $this->ensure_log_dir();
    }

    private function ensure_log_dir()
    {
        $dir = dirname($this->log_file);
        if (!file_exists($dir)) {
            mkdir($dir, 0755, true);
        }
    }

    public function log($message, $level = 'INFO')
    {
        $timestamp = date('Y-m-d H:i:s');
        $elapsed = round(microtime(true) - $this->start_time, 2);
        $line = "[{$timestamp}] [{$level}] [+{$elapsed}s] {$message}\n";

        // Write to file
        file_put_contents($this->log_file, $line, FILE_APPEND);

        // Echo to console (without timestamp for cleaner output)
        echo $message . "\n";
        flush();
    }

    public function page_start($page, $expected_count)
    {
        $this->log("━━━ PAGE {$page} ━━━ Fetching {$expected_count} projects...");
    }

    public function project_created($num, $total, $title, $post_id)
    {
        $this->log("  [{$num}/{$total}] ✓ Created #{$post_id}: " . substr($title, 0, 50));
    }

    public function project_skipped($num, $total, $reason)
    {
        $this->log("  [{$num}/{$total}] ⏭  Skipped: {$reason}");
    }

    public function page_complete($page, $created, $skipped, $total_so_far)
    {
        $this->log("✓ Page {$page} complete: {$created} created, {$skipped} skipped. Running total: {$total_so_far}");
    }

    public function error($message)
    {
        $this->log("❌ ERROR: {$message}", 'ERROR');
    }
}

/**
 * Import a single project (optimized with in-memory check and combined query)
 */
function import_project($project_data, $live_site, &$term_cache, &$imported_source_ids, $dry_run)
{
    global $stats, $wpdb;

    $title = $project_data['title']['rendered'] ?? '';
    $content = $project_data['content']['rendered'] ?? '';
    $source_id = $project_data['id'] ?? 0;

    if (empty($title) || empty($source_id)) {
        $stats['skipped']++;
        return false;
    }

    // Fast in-memory check first
    if (is_already_imported($source_id, $imported_source_ids)) {
        $stats['skipped']++;
        return false;
    }

    // Check for duplicate by source_id only (more specific than Tamil title)
    // Tamil titles can be the same across different blocks
    $existing = $wpdb->get_var($wpdb->prepare(
        "SELECT p.ID
         FROM {$wpdb->posts} p
         INNER JOIN {$wpdb->postmeta} pm ON p.ID = pm.post_id
         WHERE p.post_type = 'project'
         AND pm.meta_key = '_source_project_id'
         AND pm.meta_value = %s
         LIMIT 1",
        $source_id
    ));

    if ($existing) {
        $stats['skipped']++;
        return false;
    }

    if ($dry_run) {
        $stats['created']++;
        return true;
    }

    // Create post
    $post_id = wp_insert_post([
        'post_type' => 'project',
        'post_title' => $title,
        'post_content' => $content,
        'post_status' => 'publish',
        'post_author' => 1
    ]);

    if (is_wp_error($post_id)) {
        $stats['errors']++;
        return false;
    }

    // Set custom fields
    update_post_meta($post_id, '_source_project_id', $source_id);
    if (!empty($project_data['_project_budget'])) {
        update_post_meta($post_id, '_project_budget', $project_data['_project_budget']);
    }
    if (!empty($project_data['_project_title_tamil'])) {
        update_post_meta($post_id, '_project_title_tamil', $project_data['_project_title_tamil']);
    }
    if (!empty($project_data['_project_description_tamil'])) {
        update_post_meta($post_id, '_project_description_tamil', $project_data['_project_description_tamil']);
    }

    // Assign taxonomies
    $taxonomies = ['project_block', 'project_panchayat', 'project_village', 'project_year', 'project_status', 'project_scheme'];
    foreach ($taxonomies as $taxonomy) {
        if (!empty($project_data[$taxonomy])) {
            $term_ids = [];
            foreach ($project_data[$taxonomy] as $term_id) {
                $local_term_id = get_or_create_term($term_id, $taxonomy, $live_site, $term_cache);
                if ($local_term_id) {
                    $term_ids[] = $local_term_id;
                }
            }
            if (!empty($term_ids)) {
                wp_set_object_terms($post_id, $term_ids, $taxonomy);
            }
        }
    }

    $stats['created']++;
    $imported_source_ids[] = $source_id;
    return $post_id;
}

// Main execution
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "  Import Kurinjipadi Projects from Live Site\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

if ($DRY_RUN) {
    echo "🔍 DRY RUN MODE - No changes will be made\n\n";
}

if ($TEST_CONNECTION) {
    test_connection($LIVE_SITE);
    exit(0);
}

// Test connection first
if (!test_connection($LIVE_SITE)) {
    echo "\n❌ Connection test failed. Aborting import.\n";
    exit(1);
}

// Initialize progress tracking and logging
$PROGRESS_FILE = __DIR__ . '/logs/kurinjipadi_import_progress.json';
$LOG_FILE = __DIR__ . '/logs/kurinjipadi_import_' . date('Ymd_His') . '.log';
$logger = new ImportLogger($LOG_FILE);

// Load progress (resume from last page if interrupted)
$progress = load_progress($PROGRESS_FILE);
$imported_source_ids = $progress['imported_source_ids'];
$start_page = $progress['last_completed_page'] + 1;

if ($start_page > 1) {
    $logger->log("Resuming from page {$start_page} (already imported: " . count($imported_source_ids) . " projects)");
} else {
    $logger->log("Starting fresh import");
}

// Initialize term cache
$term_cache = [];

// Fetch all Kurinjipadi projects (paginated)
$page = $start_page;
$per_page = 20; // Batch size
$logger->log("Using batch size: {$per_page} projects per page\n");

do {
    $url = "{$LIVE_SITE}/wp-json/wp/v2/project?per_page={$per_page}&page={$page}&project_block={$KURINJIPADI_BLOCK_ID}";

    $projects = fetch_api($url);
    if (!$projects) {
        $logger->error("Failed to fetch page {$page}");
        break;
    }

    if (!is_array($projects)) {
        $logger->error("Invalid response format for page {$page}");
        break;
    }

    $count = count($projects);
    $logger->page_start($page, $count);
    $stats['total_fetched'] += $count;

    // Track page-level stats
    $page_created = 0;
    $page_skipped = 0;

    // Import each project
    $project_num = 0;
    foreach ($projects as $project) {
        $project_num++;

        try {
            $result = import_project($project, $LIVE_SITE, $term_cache, $imported_source_ids, $DRY_RUN);

            if ($result) {
                $title = $project['title']['rendered'] ?? 'Unknown';
                $logger->project_created($project_num, $count, $title, $result);
                $page_created++;
            } else {
                $logger->project_skipped($project_num, $count, "already exists or empty");
                $page_skipped++;
            }
        } catch (Exception $e) {
            $logger->error("Exception importing project: " . $e->getMessage());
            $stats['errors']++;
        }

        // Small delay to prevent overwhelming the API
        usleep(100000); // 0.1 second
    }

    // Save progress after each page
    save_progress($PROGRESS_FILE, $page, $imported_source_ids);
    $logger->page_complete($page, $page_created, $page_skipped, $stats['created']);

    // Check if there are more pages
    if ($count < $per_page) {
        $logger->log("\n✓ Last page reached (received {$count} < {$per_page})");
        break;
    }

    $page++;

    // Safety limit
    if ($page > 25) {
        $logger->log("\n⚠️  Safety limit reached (25 pages). Stopping.");
        break;
    }

} while (true);

// Show summary
echo "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "  Import Summary\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "Total fetched:  {$stats['total_fetched']}\n";
echo "Created:        {$stats['created']}\n";
echo "Skipped:        {$stats['skipped']}\n";
echo "Errors:         {$stats['errors']}\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

if (!$DRY_RUN && $stats['created'] > 0) {
    echo "✨ Import complete! Flushing permalinks...\n";
    flush_rewrite_rules();
    echo "✓ Done!\n\n";
    echo "🌐 View projects: http://localhost:8888/sabarajendran/wp-admin/edit.php?post_type=project\n";
}
