<?php
/**
 * Fix JSON Response - Prevent any output corruption and force working REST URL format
 *
 * This must-use plugin prevents PHP errors/warnings from corrupting
 * JSON responses in the REST API and forces use of index.php?rest_route= format.
 */

// Force REST API to use index.php?rest_route= format (works with all Apache configs)
add_filter('rest_url', function($url) {
    // Parse the URL
    $parsed = parse_url($url);
    $path = isset($parsed['path']) ? $parsed['path'] : '';
    $query = isset($parsed['query']) ? $parsed['query'] : '';

    // Extract the REST route from the path
    // e.g., /sabarajendran/wp-json/wp/v2/project/745 -> /wp/v2/project/745
    if (preg_match('#/wp-json(/.*?)(?:\?|$)#', $path, $matches)) {
        $rest_route = $matches[1];

        // Build new URL with index.php?rest_route= format
        $base_url = home_url('/');
        $new_url = $base_url . 'index.php?rest_route=' . $rest_route;

        // Append any query parameters
        if (!empty($query)) {
            $new_url .= '&' . $query;
        }

        return $new_url;
    }

    return $url;
}, 10, 1);

// Suppress all output for REST API requests
add_action('rest_api_init', function() {
    // Start output buffering to catch any stray output
    ob_start();

    // Completely suppress errors for REST API
    @ini_set('display_errors', '0');
    @ini_set('display_startup_errors', '0');
    error_reporting(0);
}, 1);

// Clean output buffer before sending REST response
add_filter('rest_pre_serve_request', function($served, $result, $request, $server) {
    // Clean any buffered output
    if (ob_get_level() > 0) {
        ob_clean();
    }
    return $served;
}, 10, 4);

// Additional safeguard: clean buffer on REST prepare response
add_filter('rest_pre_echo_response', function($result, $server, $request) {
    // Clean any accumulated output
    while (ob_get_level() > 0) {
        ob_end_clean();
    }
    ob_start();
    return $result;
}, 10, 3);
