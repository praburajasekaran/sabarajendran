<?php
/**
 * Netlify Webhook Manager Class
 *
 * Handles automatic Netlify deployment triggers with intelligent debouncing
 *
 * @package Saba_Projects
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
	exit;
}

class Saba_Netlify_Webhook
{
	/**
	 * Debounce delay in seconds (5 minutes)
	 */
	private const DEBOUNCE_DELAY = 300;

	/**
	 * Transient key for pending deployment
	 */
	private const TRANSIENT_KEY = 'saba_netlify_deployment_pending';

	/**
	 * Option key for API token
	 */
	private const API_TOKEN_OPTION = 'saba_netlify_api_token';

	/**
	 * Option key for site ID
	 */
	private const SITE_ID_OPTION = 'saba_netlify_site_id';

	/**
	 * Option key for auto-deploy enabled
	 */
	private const AUTO_DEPLOY_OPTION = 'saba_netlify_auto_deploy_enabled';

	/**
	 * Option key for deployment log
	 */
	private const LOG_OPTION = 'saba_netlify_deployment_log';

	/**
	 * Cron hook name
	 */
	private const CRON_HOOK = 'saba_trigger_netlify_deploy';

	/**
	 * Singleton instance
	 */
	private static $instance = null;

	/**
	 * Get singleton instance
	 */
	public static function get_instance()
	{
		if (null === self::$instance) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor
	 */
	private function __construct()
	{
		// Register cron hook
		add_action(self::CRON_HOOK, array($this, 'trigger_deployment'));
	}

	/**
	 * Schedule a deployment (with debouncing)
	 * Called whenever any data changes
	 *
	 * @param string $trigger_reason Optional reason for the deployment
	 */
	public function schedule_deployment($trigger_reason = 'WordPress data change')
	{
		// Check if auto-deploy is enabled
		if (!$this->is_auto_deploy_enabled()) {
			return;
		}

		// Check if API credentials are configured
		if (empty($this->get_api_token()) || empty($this->get_site_id())) {
			return;
		}

		// If already queued, clear the existing scheduled event
		$this->clear_scheduled_deployment();

		// Set transient to track pending deployment
		set_transient(self::TRANSIENT_KEY, array(
			'reason' => $trigger_reason,
			'scheduled_at' => current_time('mysql'),
			'trigger_at' => date('Y-m-d H:i:s', time() + self::DEBOUNCE_DELAY)
		), self::DEBOUNCE_DELAY + 60); // Add buffer to transient expiry

		// Schedule single event
		wp_schedule_single_event(time() + self::DEBOUNCE_DELAY, self::CRON_HOOK);

		// Log the scheduling
		$this->log_event('scheduled', $trigger_reason);
	}

	/**
	 * Trigger deployment immediately (bypasses debouncing)
	 * Used by manual "Deploy Now" button
	 *
	 * @return array Result with success status and message
	 */
	public function trigger_deployment_now()
	{
		// Clear any pending scheduled deployment
		$this->clear_scheduled_deployment();

		// Trigger immediately
		return $this->trigger_deployment('Manual trigger');
	}

	/**
	 * Actually trigger the Netlify build via API
	 * Called by cron or manual trigger
	 *
	 * @param string $reason Reason for deployment
	 * @return array Result with success status and message
	 */
	public function trigger_deployment($reason = 'Scheduled deployment')
	{
		$api_token = $this->get_api_token();
		$site_id = $this->get_site_id();

		if (empty($api_token) || empty($site_id)) {
			$error_msg = 'Netlify API credentials not configured';
			$this->log_event('error', $error_msg);
			return array(
				'success' => false,
				'message' => $error_msg
			);
		}

		// Clear the transient
		delete_transient(self::TRANSIENT_KEY);

		// Make HTTP POST request to Netlify Build API
		$api_url = 'https://api.netlify.com/api/v1/sites/' . $site_id . '/builds';
		
		$response = wp_remote_post($api_url, array(
			'method' => 'POST',
			'timeout' => 15,
			'headers' => array(
				'Authorization' => 'Bearer ' . $api_token,
				'Content-Type' => 'application/json',
			),
			'body' => json_encode(array(
				'clear_cache' => false
			))
		));

		// Check for errors
		if (is_wp_error($response)) {
			$error_msg = 'API request failed: ' . $response->get_error_message();
			$this->log_event('error', $error_msg);
			return array(
				'success' => false,
				'message' => $error_msg
			);
		}

		$status_code = wp_remote_retrieve_response_code($response);
		$body = wp_remote_retrieve_body($response);

		if ($status_code !== 200 && $status_code !== 201) {
			$error_data = json_decode($body, true);
			$error_msg = isset($error_data['message']) ? $error_data['message'] : 'HTTP ' . $status_code;
			$this->log_event('error', 'Netlify API error: ' . $error_msg);
			return array(
				'success' => false,
				'message' => 'Netlify API error: ' . $error_msg
			);
		}

		// Success!
		$this->log_event('triggered', $reason);

		return array(
			'success' => true,
			'message' => 'Netlify build triggered successfully'
		);
	}

	/**
	 * Clear any scheduled deployment
	 */
	private function clear_scheduled_deployment()
	{
		// Remove scheduled cron event
		$timestamp = wp_next_scheduled(self::CRON_HOOK);
		if ($timestamp) {
			wp_unschedule_event($timestamp, self::CRON_HOOK);
		}

		// Clear transient
		delete_transient(self::TRANSIENT_KEY);
	}

	/**
	 * Check if deployment is currently queued
	 *
	 * @return array|false Deployment info or false if not queued
	 */
	public function is_deployment_queued()
	{
		return get_transient(self::TRANSIENT_KEY);
	}

	/**
	 * Get API token from settings
	 *
	 * @return string API token
	 */
	public function get_api_token()
	{
		return get_option(self::API_TOKEN_OPTION, '');
	}

	/**
	 * Set API token
	 *
	 * @param string $token API token
	 */
	public function set_api_token($token)
	{
		update_option(self::API_TOKEN_OPTION, sanitize_text_field($token));
	}

	/**
	 * Get site ID from settings
	 *
	 * @return string Site ID
	 */
	public function get_site_id()
	{
		return get_option(self::SITE_ID_OPTION, 'gilded-scone-a9737b');
	}

	/**
	 * Set site ID
	 *
	 * @param string $site_id Site ID
	 */
	public function set_site_id($site_id)
	{
		update_option(self::SITE_ID_OPTION, sanitize_text_field($site_id));
	}

	/**
	 * Check if auto-deploy is enabled
	 *
	 * @return bool
	 */
	public function is_auto_deploy_enabled()
	{
		return (bool) get_option(self::AUTO_DEPLOY_OPTION, false);
	}

	/**
	 * Enable or disable auto-deploy
	 *
	 * @param bool $enabled
	 */
	public function set_auto_deploy_enabled($enabled)
	{
		update_option(self::AUTO_DEPLOY_OPTION, (bool) $enabled);
	}

	/**
	 * Log a deployment event
	 *
	 * @param string $event_type Type of event (scheduled, triggered, error)
	 * @param string $message Event message
	 */
	private function log_event($event_type, $message)
	{
		$log = $this->get_deployment_log();

		// Add new entry at the beginning
		array_unshift($log, array(
			'type' => $event_type,
			'message' => $message,
			'timestamp' => current_time('mysql'),
			'unix_time' => time()
		));

		// Keep only last 50 entries
		$log = array_slice($log, 0, 50);

		update_option(self::LOG_OPTION, $log);
	}

	/**
	 * Get deployment log
	 *
	 * @param int $limit Number of entries to return
	 * @return array Log entries
	 */
	public function get_deployment_log($limit = 20)
	{
		$log = get_option(self::LOG_OPTION, array());
		return array_slice($log, 0, $limit);
	}

	/**
	 * Clear deployment log
	 */
	public function clear_log()
	{
		update_option(self::LOG_OPTION, array());
	}

	/**
	 * Get deployment statistics
	 *
	 * @return array Statistics
	 */
	public function get_statistics()
	{
		$log = get_option(self::LOG_OPTION, array());
		
		$stats = array(
			'total_deployments' => 0,
			'successful_deployments' => 0,
			'failed_deployments' => 0,
			'last_deployment' => null,
			'last_success' => null,
			'last_error' => null
		);

		foreach ($log as $entry) {
			if ($entry['type'] === 'triggered') {
				$stats['total_deployments']++;
				$stats['successful_deployments']++;
				if (!$stats['last_success']) {
					$stats['last_success'] = $entry;
				}
				if (!$stats['last_deployment']) {
					$stats['last_deployment'] = $entry;
				}
			} elseif ($entry['type'] === 'error') {
				$stats['failed_deployments']++;
				if (!$stats['last_error']) {
					$stats['last_error'] = $entry;
				}
				if (!$stats['last_deployment']) {
					$stats['last_deployment'] = $entry;
				}
			}
		}

		return $stats;
	}
}






