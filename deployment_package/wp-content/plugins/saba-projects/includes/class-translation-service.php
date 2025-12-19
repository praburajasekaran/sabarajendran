<?php
/**
 * Translation Service Class
 *
 * Handles Tamil translation of project data using Claude Sonnet 4.5 via OpenRouter API
 *
 * @package Saba_Projects
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
	exit;
}

class Saba_Translation_Service
{
	/**
	 * OpenRouter API Configuration
	 */
	private const API_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
	private const MODEL = 'anthropic/claude-sonnet-4.5';
	private const RATE_LIMIT_DELAY = 2; // seconds between requests

	/**
	 * Get API key from options
	 */
	private function get_api_key()
	{
		return get_option('saba_projects_openrouter_key', '');
	}

	/**
	 * Log file path
	 */
	private $log_file;

	/**
	 * Constructor
	 */
	public function __construct()
	{
		$log_dir = SABA_PROJECTS_DIR . 'logs';
		if (!file_exists($log_dir)) {
			mkdir($log_dir, 0755, true);
		}
		$this->log_file = $log_dir . '/translation-' . date('Y-m-d') . '.log';
	}

	/**
	 * Get all projects that need Tamil translation
	 *
	 * @return array Array of post IDs
	 */
	public function get_projects_needing_translation()
	{
		$args = array(
			'post_type' => 'project',
			'posts_per_page' => -1,
			'post_status' => 'publish',
			'meta_query' => array(
				'relation' => 'OR',
				array(
					'key' => '_project_title_tamil',
					'compare' => 'NOT EXISTS',
				),
				array(
					'key' => '_project_title_tamil',
					'value' => '',
					'compare' => '=',
				),
				array(
					'key' => '_project_description_tamil',
					'compare' => 'NOT EXISTS',
				),
				array(
					'key' => '_project_description_tamil',
					'value' => '',
					'compare' => '=',
				),
			),
		);

		$query = new WP_Query($args);
		$project_ids = wp_list_pluck($query->posts, 'ID');
		wp_reset_postdata();

		return $project_ids;
	}

	/**
	 * Translate a single project
	 *
	 * @param int $project_id Project post ID
	 * @return array Result with success status and message
	 */
	public function translate_project($project_id)
	{
		$this->log("Starting translation for project #{$project_id}");

		// Get project data
		$title_english = get_post_meta($project_id, '_project_title_english', true);
		$description_english = get_post_meta($project_id, '_project_description_english', true);
		$title_tamil = get_post_meta($project_id, '_project_title_tamil', true);
		$description_tamil = get_post_meta($project_id, '_project_description_tamil', true);

		// Fallback to post title and content if English fields are empty
		if (empty($title_english)) {
			$post = get_post($project_id);
			$title_english = $post->post_title;
		}
		if (empty($description_english)) {
			$post = get_post($project_id);
			$description_english = strip_tags($post->post_content);
		}

		$translated = array();
		$errors = array();

		// Translate title if needed
		if (empty($title_tamil) && !empty($title_english)) {
			$this->log("Translating title: {$title_english}");
			$result = $this->translate_text($title_english, 'project title');

			if ($result['success']) {
				update_post_meta($project_id, '_project_title_tamil', $result['translation']);
				$translated[] = 'title';
				$this->log("SUCCESS: Translated title (" . mb_strlen($result['translation']) . " chars)");

				// Trigger action for Netlify deployment
				do_action('saba_translation_completed', $project_id, 'project_title');
			} else {
				$errors[] = "Title: " . $result['error'];
				$this->log("ERROR: Failed to translate title - " . $result['error']);
			}

			// Rate limiting
			sleep(self::RATE_LIMIT_DELAY);
		}

		// Translate description if needed
		if (empty($description_tamil) && !empty($description_english)) {
			$this->log("Translating description");
			$result = $this->translate_text($description_english, 'project description');

			if ($result['success']) {
				update_post_meta($project_id, '_project_description_tamil', $result['translation']);
				$translated[] = 'description';
				$this->log("SUCCESS: Translated description (" . mb_strlen($result['translation']) . " chars)");

				// Trigger action for Netlify deployment
				do_action('saba_translation_completed', $project_id, 'project_description');
			} else {
				$errors[] = "Description: " . $result['error'];
				$this->log("ERROR: Failed to translate description - " . $result['error']);
			}

			// Rate limiting
			sleep(self::RATE_LIMIT_DELAY);
		}

		// Return result
		if (empty($translated) && empty($errors)) {
			return array(
				'success' => true,
				'message' => 'No translation needed (already has Tamil content)',
				'translated' => array()
			);
		}

		if (!empty($errors)) {
			return array(
				'success' => false,
				'message' => 'Translation failed: ' . implode(', ', $errors),
				'translated' => $translated
			);
		}

		return array(
			'success' => true,
			'message' => 'Translated: ' . implode(', ', $translated),
			'translated' => $translated
		);
	}

	/**
	 * Translate text using OpenRouter API
	 *
	 * @param string $text Text to translate
	 * @param string $type Type of content (e.g., 'project title', 'project description')
	 * @return array Result with success status, translation, or error
	 */
	public function translate_text($text, $type = 'text')
	{
		if (empty($text)) {
			return array(
				'success' => false,
				'error' => 'Empty text provided'
			);
		}

		// Build the translation prompt
		$prompt = $this->get_translation_prompt($text, $type);

		// Call OpenRouter API
		$api_result = $this->call_openrouter_api($prompt);

		if (!$api_result['success']) {
			return $api_result;
		}

		// Extract translation from response
		$translation = trim($api_result['translation']);

		if (empty($translation)) {
			return array(
				'success' => false,
				'error' => 'Empty translation received from API'
			);
		}

		return array(
			'success' => true,
			'translation' => $translation
		);
	}

	/**
	 * Get translation prompt template
	 *
	 * @param string $text Text to translate
	 * @param string $type Content type
	 * @return string Formatted prompt
	 */
	private function get_translation_prompt($text, $type)
	{
		return "You are translating Tamil Nadu government infrastructure project information to Tamil.

Guidelines:
- Use formal, government-appropriate Tamil
- Preserve location names in their Tamil forms (e.g., Panruti → பண்ருட்டி, Neyveli → நெய்வேலி)
- Keep technical terms accurate
- Maintain the original meaning precisely
- Use Tamil numerals where appropriate
- Do not add any explanations, notes, or extra text

Translate the following {$type} to Tamil:

{$text}

Return ONLY the Tamil translation, no explanations.";
	}

	/**
	 * Call OpenRouter API
	 *
	 * @param string $prompt Translation prompt
	 * @return array Result with success status and response
	 */
	private function call_openrouter_api($prompt)
	{
		$body = array(
			'model' => self::MODEL,
			'messages' => array(
				array(
					'role' => 'user',
					'content' => $prompt
				)
			)
		);

		$api_key = $this->get_api_key();
		if (empty($api_key)) {
			return array(
				'success' => false,
				'error' => 'OpenRouter API key is not configured. Please configure it in Settings → Saba Projects.'
			);
		}

		$args = array(
			'body' => json_encode($body),
			'headers' => array(
				'Authorization' => 'Bearer ' . $api_key,
				'Content-Type' => 'application/json',
				'HTTP-Referer' => home_url(),
			),
			'timeout' => 60,
			'method' => 'POST',
		);

		$response = wp_remote_post(self::API_ENDPOINT, $args);

		// Check for WP HTTP errors
		if (is_wp_error($response)) {
			return array(
				'success' => false,
				'error' => 'HTTP Error: ' . $response->get_error_message()
			);
		}

		$status_code = wp_remote_retrieve_response_code($response);
		$body = wp_remote_retrieve_body($response);

		// Check for HTTP error codes
		if ($status_code !== 200) {
			$error_data = json_decode($body, true);
			$error_message = isset($error_data['error']['message']) ? $error_data['error']['message'] : "HTTP {$status_code}";

			return array(
				'success' => false,
				'error' => "API Error: {$error_message}"
			);
		}

		// Parse response
		$data = json_decode($body, true);

		if (!isset($data['choices'][0]['message']['content'])) {
			return array(
				'success' => false,
				'error' => 'Invalid API response format'
			);
		}

		return array(
			'success' => true,
			'translation' => $data['choices'][0]['message']['content']
		);
	}

	/**
	 * Log message to file
	 *
	 * @param string $message Log message
	 */
	public function log($message)
	{
		$timestamp = date('Y-m-d H:i:s');
		$log_entry = "[{$timestamp}] {$message}\n";
		file_put_contents($this->log_file, $log_entry, FILE_APPEND);
	}

	/**
	 * Get translation statistics
	 *
	 * @return array Statistics about translation status
	 */
	public function get_statistics()
	{
		// Total projects
		$total_query = new WP_Query(array(
			'post_type' => 'project',
			'posts_per_page' => -1,
			'post_status' => 'publish',
			'fields' => 'ids',
		));
		$total = $total_query->found_posts;
		wp_reset_postdata();

		// Projects with Tamil translations (both title and description)
		$translated_query = new WP_Query(array(
			'post_type' => 'project',
			'posts_per_page' => -1,
			'post_status' => 'publish',
			'fields' => 'ids',
			'meta_query' => array(
				'relation' => 'AND',
				array(
					'key' => '_project_title_tamil',
					'value' => '',
					'compare' => '!=',
				),
				array(
					'key' => '_project_description_tamil',
					'value' => '',
					'compare' => '!=',
				),
			),
		));
		$translated = $translated_query->found_posts;
		wp_reset_postdata();

		// Projects needing translation
		$needs_translation = count($this->get_projects_needing_translation());

		return array(
			'total' => $total,
			'translated' => $translated,
			'needs_translation' => $needs_translation,
			'percentage' => $total > 0 ? round(($translated / $total) * 100, 1) : 0,
		);
	}

	/**
	 * Get recent translation activity from log
	 *
	 * @param int $limit Number of entries to return
	 * @return array Recent log entries
	 */
	public function get_recent_activity($limit = 50)
	{
		if (!file_exists($this->log_file)) {
			return array();
		}

		$lines = file($this->log_file);
		$lines = array_reverse($lines);
		$lines = array_slice($lines, 0, $limit);

		return $lines;
	}
}
