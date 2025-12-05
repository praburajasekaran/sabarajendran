<?php
/**
 * AJAX Handlers for Inline Translation
 *
 * @package Saba_Projects
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
	exit;
}

/**
 * AJAX handler for translating project field
 */
function saba_ajax_translate_project_field() {
	// Verify nonce
	if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'saba_inline_translation')) {
		wp_send_json_error(array('message' => __('Security check failed.', 'saba-projects')));
	}

	// Check permissions
	if (!current_user_can('edit_posts')) {
		wp_send_json_error(array('message' => __('Insufficient permissions.', 'saba-projects')));
	}

	$project_id = isset($_POST['project_id']) ? intval($_POST['project_id']) : 0;
	$field_type = isset($_POST['field_type']) ? sanitize_text_field($_POST['field_type']) : '';
	$source_text = isset($_POST['source_text']) ? sanitize_text_field($_POST['source_text']) : '';

	if (empty($project_id) || empty($field_type) || empty($source_text)) {
		wp_send_json_error(array('message' => __('Missing required parameters.', 'saba-projects')));
	}

	// Validate field type
	$allowed_fields = array('title', 'description');
	if (!in_array($field_type, $allowed_fields)) {
		wp_send_json_error(array('message' => __('Invalid field type.', 'saba-projects')));
	}

	// Detect source language
	$source_lang = saba_projects_detect_language($source_text);
	$target_lang = ($source_lang === 'ta') ? 'en' : 'ta';

	// Use translation service
	$service = new Saba_Translation_Service();
	
	// Determine content type for prompt
	$content_type = ($field_type === 'title') ? 'project title' : 'project description';
	
	// Translate
	$result = $service->translate_text($source_text, $content_type);

	if (!$result['success']) {
		wp_send_json_error(array('message' => $result['error']));
	}

	// Determine which meta field to update
	$meta_key = ($target_lang === 'ta') 
		? '_project_' . $field_type . '_tamil' 
		: '_project_' . $field_type . '_english';

	// Save translation
	update_post_meta($project_id, $meta_key, $result['translation']);

	wp_send_json_success(array(
		'translation' => $result['translation'],
		'target_lang' => $target_lang
	));
}
add_action('wp_ajax_saba_translate_project_field', 'saba_ajax_translate_project_field');

/**
 * AJAX handler for translating village name
 */
function saba_ajax_translate_village_name() {
	// Verify nonce
	if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'saba_inline_translation')) {
		wp_send_json_error(array('message' => __('Security check failed.', 'saba-projects')));
	}

	// Check permissions
	if (!current_user_can('manage_categories')) {
		wp_send_json_error(array('message' => __('Insufficient permissions.', 'saba-projects')));
	}

	$term_id = isset($_POST['term_id']) ? intval($_POST['term_id']) : 0;
	$source_text = isset($_POST['source_text']) ? sanitize_text_field($_POST['source_text']) : '';

	if (empty($term_id) || empty($source_text)) {
		wp_send_json_error(array('message' => __('Missing required parameters.', 'saba-projects')));
	}

	// Detect source language
	$source_lang = saba_projects_detect_language($source_text);
	$target_lang = ($source_lang === 'ta') ? 'en' : 'ta';

	// Translate village name
	$translated = saba_projects_translate_village_name($source_text, $target_lang);

	if (is_wp_error($translated)) {
		wp_send_json_error(array('message' => $translated->get_error_message()));
	}

	// Save translation as term meta
	$meta_key = ($target_lang === 'ta') ? '_village_name_tamil' : '_village_name_english';
	update_term_meta($term_id, $meta_key, $translated);

	// Also save original if needed
	$original_meta_key = ($source_lang === 'ta') ? '_village_name_tamil' : '_village_name_english';
	update_term_meta($term_id, $original_meta_key, $source_text);

	wp_send_json_success(array(
		'translation' => $translated,
		'target_lang' => $target_lang
	));
}
add_action('wp_ajax_saba_translate_village_name', 'saba_ajax_translate_village_name');
