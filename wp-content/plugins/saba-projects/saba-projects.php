<?php
/**
 * Plugin Name: Saba Rajendran Projects
 * Plugin URI: https://sabarajendran.com
 * Description: Custom post type and taxonomies for constituency projects showcase
 * Version: 1.0.0
 * Author: Praburajasekaran
 * Author URI: https://sabarajendran.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: saba-projects
 * Domain Path: /languages
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
	exit;
}

// Define plugin constants
define('SABA_PROJECTS_VERSION', '1.0.0');
define('SABA_PROJECTS_DIR', plugin_dir_path(__FILE__));
define('SABA_PROJECTS_URL', plugin_dir_url(__FILE__));

// Include files
require_once SABA_PROJECTS_DIR . 'includes/post-type.php';
require_once SABA_PROJECTS_DIR . 'includes/taxonomies.php';
require_once SABA_PROJECTS_DIR . 'includes/meta-boxes.php';

// Include Elementor widget if Elementor is active
if (did_action('elementor/loaded')) {
	require_once SABA_PROJECTS_DIR . 'includes/elementor-widget.php';
}

/**
 * Flush rewrite rules on activation
 */
function saba_projects_activate()
{
	// Register post type and taxonomies
	saba_projects_register_post_type();
	saba_projects_register_taxonomies();

	// Flush rewrite rules
	flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'saba_projects_activate');

/**
 * Flush rewrite rules on deactivation
 */
function saba_projects_deactivate()
{
	flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'saba_projects_deactivate');

/**
 * Enqueue frontend styles
 */
function saba_projects_enqueue_styles()
{
	wp_enqueue_style(
		'saba-projects',
		SABA_PROJECTS_URL . 'assets/css/projects.css',
		array(),
		SABA_PROJECTS_VERSION
	);
}
add_action('wp_enqueue_scripts', 'saba_projects_enqueue_styles');

/**
 * Allow CORS for local development
 */
function saba_projects_allow_cors()
{
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
}
add_action('init', 'saba_projects_allow_cors');

/**
 * Register Meta Fields for REST API
 */
function saba_projects_register_rest_fields()
{
	// Register Budget
	register_rest_field('project', '_project_budget', array(
		'get_callback' => function ($object) {
			return get_post_meta($object['id'], '_project_budget', true);
		},
		'schema' => null,
	));

	// Register Tamil Title
	register_rest_field('project', '_project_title_tamil', array(
		'get_callback' => function ($object) {
			return get_post_meta($object['id'], '_project_title_tamil', true);
		},
		'schema' => null,
	));

	// Register English Title
	register_rest_field('project', '_project_title_english', array(
		'get_callback' => function ($object) {
			return get_post_meta($object['id'], '_project_title_english', true);
		},
		'schema' => null,
	));

	// Register Tamil Description
	register_rest_field('project', '_project_description_tamil', array(
		'get_callback' => function ($object) {
			return get_post_meta($object['id'], '_project_description_tamil', true);
		},
		'schema' => null,
	));

	// Register English Description
	register_rest_field('project', '_project_description_english', array(
		'get_callback' => function ($object) {
			return get_post_meta($object['id'], '_project_description_english', true);
		},
		'schema' => null,
	));
}
add_action('rest_api_init', 'saba_projects_register_rest_fields');
