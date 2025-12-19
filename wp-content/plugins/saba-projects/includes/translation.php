<?php
/**
 * Village Translation Service using Claude AI via OpenRouter
 *
 * @package Saba_Projects
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
	exit;
}

/**
 * Get OpenRouter API Key from options
 */
function saba_projects_get_openrouter_key()
{
	// Check wp-config first (for backward compatibility)
	if (defined('OPENROUTER_API_KEY')) {
		return OPENROUTER_API_KEY;
	}

	// Use options table (preferred method)
	return get_option('saba_projects_openrouter_key', '');
}

/**
 * Detect language of text (Tamil or English)
 */
function saba_projects_detect_language($text)
{
	// Simple detection: if text contains Tamil Unicode characters, it's Tamil
	// Tamil Unicode range: 0B80-0BFF
	if (preg_match('/[\x{0B80}-\x{0BFF}]/u', $text)) {
		return 'ta'; // Tamil
	}
	return 'en'; // English
}

/**
 * Translate village name using Claude AI via OpenRouter
 *
 * @param string $village_name The village name to translate
 * @param string $target_lang Target language ('ta' for Tamil, 'en' for English)
 * @return string|WP_Error Translated name or error
 */
function saba_projects_translate_village_name($village_name, $target_lang = 'ta')
{
	$api_key = saba_projects_get_openrouter_key();

	if (empty($api_key)) {
		return new WP_Error('no_api_key', 'OpenRouter API key is not configured. Please add OPENROUTER_API_KEY to wp-config.php');
	}

	// Detect source language
	$source_lang = saba_projects_detect_language($village_name);

	// If already in target language, return as-is
	if ($source_lang === $target_lang) {
		return $village_name;
	}

	// Determine language names
	$source_lang_name = ($source_lang === 'ta') ? 'Tamil' : 'English';
	$target_lang_name = ($target_lang === 'ta') ? 'Tamil' : 'English';

	// Prepare the prompt
	$prompt = sprintf(
		'Translate the following village name from %s to %s. Return ONLY the translated name, nothing else. No explanations, no quotes, just the translated village name.\n\nVillage name: %s',
		$source_lang_name,
		$target_lang_name,
		$village_name
	);

	// OpenRouter API endpoint
	$api_url = 'https://openrouter.ai/api/v1/chat/completions';

	// Request body
	$body = array(
		'model' => 'anthropic/claude-3.5-sonnet', // Using Claude 3.5 Sonnet
		'messages' => array(
			array(
				'role' => 'user',
				'content' => $prompt
			)
		),
		'temperature' => 0.3, // Lower temperature for more consistent translations
		'max_tokens' => 100
	);

	// Make API request
	$response = wp_remote_post($api_url, array(
		'headers' => array(
			'Authorization' => 'Bearer ' . $api_key,
			'Content-Type' => 'application/json',
			'HTTP-Referer' => home_url(), // Optional: for tracking
		),
		'body' => json_encode($body),
		'timeout' => 30,
	));

	// Check for errors
	if (is_wp_error($response)) {
		return $response;
	}

	$response_code = wp_remote_retrieve_response_code($response);
	if ($response_code !== 200) {
		$error_body = wp_remote_retrieve_body($response);
		return new WP_Error('api_error', 'OpenRouter API error: ' . $error_body, array('status' => $response_code));
	}

	// Parse response
	$response_body = json_decode(wp_remote_retrieve_body($response), true);

	if (!isset($response_body['choices'][0]['message']['content'])) {
		return new WP_Error('invalid_response', 'Invalid response from OpenRouter API');
	}

	$translated = trim($response_body['choices'][0]['message']['content']);

	// Clean up any quotes or extra text
	$translated = trim($translated, '"\'');

	return $translated;
}

/**
 * Translate a village term and save translations as term meta
 *
 * @param int $term_id Term ID
 * @param string $village_name Optional village name (if not provided, will fetch from term)
 * @return array|WP_Error Result with translations or error
 */
function saba_projects_translate_village_term($term_id, $village_name = null)
{
	// Get term if name not provided
	if ($village_name === null) {
		$term = get_term($term_id, 'project_village');
		if (is_wp_error($term) || !$term) {
			return new WP_Error('invalid_term', 'Invalid term ID');
		}
		$village_name = $term->name;
	}

	// Detect current language
	$current_lang = saba_projects_detect_language($village_name);

	$result = array(
		'original' => $village_name,
		'original_lang' => $current_lang,
		'translated' => '',
		'translated_lang' => ($current_lang === 'ta') ? 'en' : 'ta',
		'success' => false
	);

	// Get or translate to the other language
	$target_lang = ($current_lang === 'ta') ? 'en' : 'ta';
	$meta_key = ($target_lang === 'ta') ? '_village_name_tamil' : '_village_name_english';

	// Check if translation already exists
	$existing_translation = get_term_meta($term_id, $meta_key, true);
	if (!empty($existing_translation)) {
		$result['translated'] = $existing_translation;
		$result['success'] = true;
		$result['cached'] = true;
		return $result;
	}

	// Translate
	$translated = saba_projects_translate_village_name($village_name, $target_lang);

	if (is_wp_error($translated)) {
		$result['error'] = $translated->get_error_message();
		return $result;
	}

	// Save translation as term meta
	update_term_meta($term_id, $meta_key, $translated);

	// Also save original language meta for reference
	$original_meta_key = ($current_lang === 'ta') ? '_village_name_tamil' : '_village_name_english';
	update_term_meta($term_id, $original_meta_key, $village_name);

	$result['translated'] = $translated;
	$result['success'] = true;
	$result['cached'] = false;

	return $result;
}

/**
 * Auto-translate village when created or updated
 */
function saba_projects_auto_translate_village($term_id, $tt_id, $taxonomy)
{
	// Only process project_village taxonomy
	if ($taxonomy !== 'project_village') {
		return;
	}

	// Get the term
	$term = get_term($term_id, $taxonomy);
	if (is_wp_error($term) || !$term) {
		return;
	}

	// Check if auto-translation is enabled
	$auto_translate = get_option('saba_projects_auto_translate_villages', true);
	if (!$auto_translate) {
		return;
	}

	// Check if translation already exists
	$has_tamil = get_term_meta($term_id, '_village_name_tamil', true);
	$has_english = get_term_meta($term_id, '_village_name_english', true);

	// If both translations exist, skip
	if (!empty($has_tamil) && !empty($has_english)) {
		return;
	}

	// Translate in background (non-blocking)
	// Use WordPress cron for async processing
	// FIX: Prevent duplicate jobs for the same term
	if (!wp_next_scheduled('saba_projects_translate_village_async', array($term_id))) {
		wp_schedule_single_event(time() + 10, 'saba_projects_translate_village_async', array($term_id));
	}
}

/**
 * Async translation handler
 */
function saba_projects_handle_async_translation($term_id)
{
	// FIX: Prevent cascade - suppress Netlify hooks during translation
	define('SABA_IMPORT_RUNNING', true);
	saba_projects_translate_village_term($term_id);
}
add_action('saba_projects_translate_village_async', 'saba_projects_handle_async_translation');

// Hook into term creation and updates
add_action('created_project_village', 'saba_projects_auto_translate_village', 10, 3);
add_action('edited_project_village', 'saba_projects_auto_translate_village', 10, 3);

/**
 * Get village name in specified language
 *
 * @param int|WP_Term $term Term ID or term object
 * @param string $lang Language code ('ta' or 'en')
 * @return string Village name in requested language
 */
function saba_projects_get_village_name($term, $lang = 'en')
{
	if (is_numeric($term)) {
		$term = get_term($term, 'project_village');
	}

	if (is_wp_error($term) || !$term) {
		return '';
	}

	// Get translation from meta
	$meta_key = ($lang === 'ta') ? '_village_name_tamil' : '_village_name_english';
	$translated = get_term_meta($term->term_id, $meta_key, true);

	// If translation exists, return it
	if (!empty($translated)) {
		return $translated;
	}

	// Fallback to term name
	return $term->name;
}
