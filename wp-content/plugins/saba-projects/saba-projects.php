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
require_once SABA_PROJECTS_DIR . 'includes/translation.php';
require_once SABA_PROJECTS_DIR . 'includes/admin-translation.php';
require_once SABA_PROJECTS_DIR . 'includes/class-translation-service.php';
require_once SABA_PROJECTS_DIR . 'includes/admin-translation-page.php';
require_once SABA_PROJECTS_DIR . 'includes/settings-page.php';
require_once SABA_PROJECTS_DIR . 'includes/ajax-translation-handlers.php';
require_once SABA_PROJECTS_DIR . 'includes/admin-unified-translation.php';

// Include Netlify auto-deployment
require_once SABA_PROJECTS_DIR . 'includes/class-netlify-webhook.php';
require_once SABA_PROJECTS_DIR . 'includes/netlify-hooks.php';
require_once SABA_PROJECTS_DIR . 'includes/admin-netlify-settings.php';

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
 * Enqueue admin assets for inline translation
 */
function saba_projects_enqueue_admin_assets($hook) {
	// Only load on project edit and taxonomy screens
	if (in_array($hook, array('post.php', 'post-new.php', 'term.php', 'edit-tags.php'))) {
		// Check if we're on project post type or project_village taxonomy
		$screen = get_current_screen();
		if ($screen && (
			$screen->post_type === 'project' || 
			($screen->taxonomy === 'project_village')
		)) {
			wp_enqueue_script(
				'saba-inline-translation',
				SABA_PROJECTS_URL . 'assets/js/inline-translation.js',
				array('jquery'),
				SABA_PROJECTS_VERSION,
				true
			);
			
			wp_localize_script('saba-inline-translation', 'sabaTranslation', array(
				'ajaxurl' => admin_url('admin-ajax.php'),
				'nonce' => wp_create_nonce('saba_inline_translation'),
				'strings' => array(
					'translate' => __('Translate', 'saba-projects'),
					'translateToTamil' => __('Translate to Tamil', 'saba-projects'),
					'translateToEnglish' => __('Translate to English', 'saba-projects'),
					'translationSuccess' => __('Translation completed successfully!', 'saba-projects'),
					'translationError' => __('Translation failed.', 'saba-projects'),
					'ajaxError' => __('AJAX request failed. Please try again.', 'saba-projects'),
					'emptyField' => __('Please enter text to translate.', 'saba-projects'),
				)
			));
			
			wp_enqueue_style(
				'saba-admin-translation',
				SABA_PROJECTS_URL . 'assets/css/admin-translation.css',
				array(),
				SABA_PROJECTS_VERSION
			);
		}
	}
}
add_action('admin_enqueue_scripts', 'saba_projects_enqueue_admin_assets');

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
	
	// Register Village Translations for taxonomy terms
	// For taxonomy terms, the object passed is an array with 'id' key
	register_rest_field('project_village', 'name_tamil', array(
		'get_callback' => function ($object) {
			$term_id = isset($object['id']) ? $object['id'] : 0;
			return get_term_meta($term_id, '_village_name_tamil', true);
		},
		'schema' => null,
	));
	
	register_rest_field('project_village', 'name_english', array(
		'get_callback' => function ($object) {
			$term_id = isset($object['id']) ? $object['id'] : 0;
			return get_term_meta($term_id, '_village_name_english', true);
		},
		'schema' => null,
	));
	
	register_rest_field('project_village', 'name_translated', array(
		'get_callback' => function ($object, $field_name, $request) {
			$term_id = isset($object['id']) ? $object['id'] : 0;
			// Get language from query param or default to 'en'
			$lang = $request->get_param('lang') ?: 'en';
			return saba_projects_get_village_name($term_id, $lang);
		},
		'schema' => null,
	));
}
add_action('rest_api_init', 'saba_projects_register_rest_fields');
