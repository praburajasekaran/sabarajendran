<?php
// Load WordPress environment
require_once('wp-load.php');

// Set the ID of the project to check
$post_id = 1262;

// Get the post
$post = get_post($post_id);

if (!$post) {
    die("Post not found");
}

// Emulate REST API request
$request = new WP_REST_Request('GET', '/wp/v2/project/' . $post_id);
$request->set_param('_embed', 'true');

// Get the response
$response = rest_do_request($request);

if ($response->is_error()) {
    print_r($response->as_error());
} else {
    // Get the data
    $data = $response->get_data();

    // Embed links manually if server doesn't do it automatically in internal request context?
    // rest_do_request usually handles everything if the controller supports it.
    // However, _embed is handled by the server implementation.
    // WP_REST_Server::embed_response is what processes _embed.

    $server = rest_get_server();
    $data = $server->response_to_data($response, true); // true for _embed

    echo json_encode($data, JSON_PRETTY_PRINT);
}
