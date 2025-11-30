<?php
/**
 * Create Projects Page with Elementor Template
 *
 * This script creates a WordPress page called "Projects" and assigns
 * the Projects - Elementor Full Width template to it.
 *
 * Run this once to create the page, then you can design it with Elementor.
 */

// Load WordPress
require_once 'wp-load.php';

// Check if page already exists
$existing_page = get_page_by_path('projects');

if ($existing_page) {
    echo "Projects page already exists with ID: " . $existing_page->ID . "\n";
    echo "URL: " . get_permalink($existing_page->ID) . "\n";
    echo "Edit in WordPress Admin: " . admin_url('post.php?post=' . $existing_page->ID . '&action=edit') . "\n";
    exit;
}

// Create the page
$page_data = array(
    'post_title'    => 'Projects',
    'post_content'  => '', // Empty content - will be designed with Elementor
    'post_status'   => 'publish',
    'post_type'     => 'page',
    'post_author'   => 1,
    'post_name'     => 'projects',
    'comment_status' => 'closed',
    'ping_status'   => 'closed',
);

$page_id = wp_insert_post($page_data);

if (is_wp_error($page_id)) {
    echo "Error creating page: " . $page_id->get_error_message() . "\n";
    exit;
}

// Assign the custom page template
update_post_meta($page_id, '_wp_page_template', 'page-templates/projects-template.php');

// Enable Elementor for this page (if Elementor is active)
if (class_exists('Elementor\Plugin')) {
    update_post_meta($page_id, '_elementor_edit_mode', 'builder');
    update_post_meta($page_id, '_elementor_template_type', 'wp-page');
    update_post_meta($page_id, '_elementor_version', ELEMENTOR_VERSION);
}

// Set Astra theme settings for full-width layout
update_post_meta($page_id, 'site-content-layout', 'page-builder');
update_post_meta($page_id, 'site-sidebar-layout', 'no-sidebar');
update_post_meta($page_id, 'ast-main-header-display', 'disabled');
update_post_meta($page_id, 'footer-sml-layout', 'disabled');

echo "Success! Projects page created.\n";
echo "Page ID: " . $page_id . "\n";
echo "URL: " . get_permalink($page_id) . "\n";
echo "Edit in WordPress Admin: " . admin_url('post.php?post=' . $page_id . '&action=edit') . "\n";

if (class_exists('Elementor\Plugin')) {
    echo "Edit with Elementor: " . admin_url('post.php?post=' . $page_id . '&action=elementor') . "\n";
} else {
    echo "\nNote: Elementor plugin not detected. Install and activate Elementor to design this page.\n";
}

echo "\nPage Settings:\n";
echo "- Template: Projects - Elementor Full Width\n";
echo "- Layout: Page Builder (Full Width)\n";
echo "- Sidebar: Disabled\n";
echo "- Header: Disabled\n";
echo "- Footer: Disabled\n";
echo "\nYou can now design this page with Elementor!\n";
