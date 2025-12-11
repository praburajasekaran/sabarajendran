<?php
/**
 * Grievance Form Handler
 * Registers CPT and API Endpoint
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register Grievance Custom Post Type
 */
function saba_rajendran_register_grievance_cpt()
{
    $labels = array(
        'name' => _x('Grievances', 'Post Type General Name', 'saba-rajendran'),
        'singular_name' => _x('Grievance', 'Post Type Singular Name', 'saba-rajendran'),
        'menu_name' => __('Grievances', 'saba-rajendran'),
        'all_items' => __('All Grievances', 'saba-rajendran'),
        'add_new_item' => __('Add New Grievance', 'saba-rajendran'),
        'edit_item' => __('Edit Grievance', 'saba-rajendran'),
        'view_item' => __('View Grievance', 'saba-rajendran'),
        'search_items' => __('Search Grievances', 'saba-rajendran'),
    );

    $args = array(
        'label' => __('Grievance', 'saba-rajendran'),
        'labels' => $labels,
        'supports' => array('title', 'editor', 'custom-fields', 'thumbnail'), // title=Name, editor=Description
        'hierarchical' => false,
        'public' => false, // Not visible on frontend
        'show_ui' => true,  // Visible in Admin
        'show_in_menu' => true,
        'menu_position' => 25,
        'menu_icon' => 'dashicons-megaphone',
        'show_in_admin_bar' => true,
        'show_in_nav_menus' => false,
        'can_export' => true,
        'has_archive' => false,
        'exclude_from_search' => true,
        'publicly_queryable' => false,
        'capability_type' => 'post',
    );

    register_post_type('grievance', $args);
}
add_action('init', 'saba_rajendran_register_grievance_cpt');

/**
 * Register API Endpoint
 */
function saba_rajendran_register_grievance_api()
{
    register_rest_route('sabarajendran/v1', '/grievance', array(
        'methods' => 'POST',
        'callback' => 'saba_rajendran_handle_grievance_submission',
        'permission_callback' => '__return_true', // Public form
    ));
}
add_action('rest_api_init', 'saba_rajendran_register_grievance_api');

/**
 * Handle API Submission
 */
function saba_rajendran_handle_grievance_submission($request)
{
    // 1. Sanitize Fields
    $type = sanitize_text_field($request->get_param('type'));
    $name = sanitize_text_field($request->get_param('name'));
    $phone = sanitize_text_field($request->get_param('phone'));
    $address = sanitize_textarea_field($request->get_param('address')); // Multiline often
    $block = sanitize_text_field($request->get_param('block'));
    $panchayat = sanitize_text_field($request->get_param('panchayat'));
    $village = sanitize_text_field($request->get_param('village'));
    $description = sanitize_textarea_field($request->get_param('description'));
    $ip_address = sanitize_text_field($request->get_param('ipAddress'));

    if (empty($name) || empty($phone) || empty($description)) {
        return new WP_Error('missing_fields', 'Required fields are missing', array('status' => 400));
    }

    // 2. Insert Post
    $post_title = $name . ' - ' . ucfirst($type);

    $post_data = array(
        'post_title' => $post_title,
        'post_content' => $description,
        'post_status' => 'publish', // Or 'pending' if review needed
        'post_type' => 'grievance',
    );

    $post_id = wp_insert_post($post_data);

    if (is_wp_error($post_id)) {
        return $post_id;
    }

    // 3. Save Meta Data
    update_post_meta($post_id, 'grievance_type', $type);
    update_post_meta($post_id, 'contact_phone', $phone);
    update_post_meta($post_id, 'contact_address', $address);
    update_post_meta($post_id, 'location_block', $block);
    update_post_meta($post_id, 'location_panchayat', $panchayat);
    update_post_meta($post_id, 'location_village', $village);
    update_post_meta($post_id, 'submitter_ip', $ip_address);

    // 4. Handle File Upload (if exists)
    $files = $request->get_file_params();

    if (!empty($files['image'])) {
        require_once(ABSPATH . 'wp-admin/includes/image.php');
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/media.php');

        $file = $files['image'];

        // Upload logic
        // We need to simulate $_FILES array for access by wp_handle_upload if strictly needed, 
        // but media_handle_upload usually looks at $_FILES.
        // REST API puts raw file data in get_file_params().

        // Because REST API handles files differently, we often need to manually move it or use a helper.
        // However, `media_handle_upload` expects the key in `$_FILES`.
        // Let's populate `$_FILES` manually from our request data if it's not already there by PHP's standard parsing.
        // NOTE: If the request is multipart/form-data, PHP populates $_FILES automatically.
        // So we can try `media_handle_upload('image', $post_id)`.

        $attachment_id = media_handle_upload('image', $post_id);

        if (is_wp_error($attachment_id)) {
            // Log error but don't fail the whole submission?
            // Or return warning.
            update_post_meta($post_id, 'upload_error', $attachment_id->get_error_message());
        } else {
            // Success
            // Set as Featured Image if it's an image
            // Or just attach it.
            // If it's an image, set thumbnail.
            if (wp_attachment_is_image($attachment_id)) {
                set_post_thumbnail($post_id, $attachment_id);
            }
        }
    }

    return new WP_REST_Response(array(
        'success' => true,
        'id' => $post_id,
        'message' => 'Grievance submitted successfully'
    ), 200);
}
