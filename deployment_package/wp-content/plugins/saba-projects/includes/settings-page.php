<?php
/**
 * Settings Page for Saba Projects
 *
 * WordPress settings page for API key management
 *
 * @package Saba_Projects
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
	exit;
}

/**
 * Register settings page
 */
function saba_projects_add_settings_page() {
	add_options_page(
		__('Saba Projects Settings', 'saba-projects'),
		__('Saba Projects', 'saba-projects'),
		'manage_options',
		'saba-projects-settings',
		'saba_projects_render_settings_page'
	);
}
add_action('admin_menu', 'saba_projects_add_settings_page');

/**
 * Register settings
 */
function saba_projects_register_settings() {
	register_setting(
		'saba_projects_settings',
		'saba_projects_openrouter_key',
		array(
			'type' => 'string',
			'sanitize_callback' => 'sanitize_text_field',
			'default' => ''
		)
	);
}
add_action('admin_init', 'saba_projects_register_settings');

/**
 * Render settings page
 */
function saba_projects_render_settings_page() {
	if (!current_user_can('manage_options')) {
		wp_die(__('You do not have sufficient permissions to access this page.'));
	}

	$api_key = get_option('saba_projects_openrouter_key', '');
	$has_api_key = !empty($api_key);
	
	// Handle API key validation
	$validation_result = null;
	if (isset($_POST['saba_validate_api_key']) && check_admin_referer('saba_validate_api_key')) {
		$validation_result = saba_projects_validate_api_key($api_key);
	}

	?>
	<div class="wrap">
		<h1><?php _e('Saba Projects Settings', 'saba-projects'); ?></h1>
		
		<form method="post" action="options.php">
			<?php settings_fields('saba_projects_settings'); ?>
			<?php do_settings_sections('saba_projects_settings'); ?>
			
			<table class="form-table">
				<tr>
					<th scope="row">
						<label for="saba_projects_openrouter_key">
							<?php _e('OpenRouter API Key', 'saba-projects'); ?>
						</label>
					</th>
					<td>
						<input 
							type="password" 
							id="saba_projects_openrouter_key" 
							name="saba_projects_openrouter_key" 
							value="<?php echo esc_attr($api_key); ?>" 
							class="regular-text"
							placeholder="sk-or-v1-..."
						>
						<p class="description">
							<?php _e('Enter your OpenRouter API key for translation services. Get your key from', 'saba-projects'); ?>
							<a href="https://openrouter.ai/keys" target="_blank">openrouter.ai/keys</a>
						</p>
						<?php if ($has_api_key): ?>
							<p class="description" style="color: #00a32a;">
								<span class="dashicons dashicons-yes-alt"></span>
								<?php _e('API key is configured.', 'saba-projects'); ?>
							</p>
						<?php else: ?>
							<p class="description" style="color: #d63638;">
								<span class="dashicons dashicons-warning"></span>
								<?php _e('API key is required for translation features to work.', 'saba-projects'); ?>
							</p>
						<?php endif; ?>
					</td>
				</tr>
			</table>
			
			<?php submit_button(__('Save Settings', 'saba-projects')); ?>
		</form>
		
		<?php if ($has_api_key): ?>
		<form method="post" action="" style="margin-top: 20px;">
			<?php wp_nonce_field('saba_validate_api_key'); ?>
			<button type="submit" name="saba_validate_api_key" class="button">
				<?php _e('Test API Connection', 'saba-projects'); ?>
			</button>
		</form>
		
		<?php if ($validation_result !== null): ?>
			<div class="notice <?php echo $validation_result['success'] ? 'notice-success' : 'notice-error'; ?>" style="margin-top: 20px;">
				<p>
					<?php if ($validation_result['success']): ?>
						<strong><?php _e('Success!', 'saba-projects'); ?></strong>
						<?php echo esc_html($validation_result['message']); ?>
					<?php else: ?>
						<strong><?php _e('Error:', 'saba-projects'); ?></strong>
						<?php echo esc_html($validation_result['message']); ?>
					<?php endif; ?>
				</p>
			</div>
		<?php endif; ?>
		<?php endif; ?>
		
		<div class="card" style="max-width: 800px; margin-top: 30px;">
			<h2><?php _e('About Translation Features', 'saba-projects'); ?></h2>
			<p>
				<?php _e('The Saba Projects plugin uses OpenRouter API with Claude AI to provide automatic translation between English and Tamil for:', 'saba-projects'); ?>
			</p>
			<ul style="list-style: disc; margin-left: 20px;">
				<li><?php _e('Project titles and descriptions', 'saba-projects'); ?></li>
				<li><?php _e('Village and location names', 'saba-projects'); ?></li>
			</ul>
			<p>
				<?php _e('You can translate content inline while editing, or use batch translation for multiple items at once.', 'saba-projects'); ?>
			</p>
		</div>
	</div>
	<?php
}

/**
 * Validate API key by making a test request
 */
function saba_projects_validate_api_key($api_key) {
	if (empty($api_key)) {
		return array(
			'success' => false,
			'message' => __('API key is empty.', 'saba-projects')
		);
	}

	// Make a simple test request
	$response = wp_remote_post('https://openrouter.ai/api/v1/chat/completions', array(
		'headers' => array(
			'Authorization' => 'Bearer ' . $api_key,
			'Content-Type' => 'application/json',
		),
		'body' => json_encode(array(
			'model' => 'anthropic/claude-3.5-sonnet',
			'messages' => array(
				array(
					'role' => 'user',
					'content' => 'Test'
				)
			),
			'max_tokens' => 10
		)),
		'timeout' => 10,
	));

	if (is_wp_error($response)) {
		return array(
			'success' => false,
			'message' => __('Connection error: ', 'saba-projects') . $response->get_error_message()
		);
	}

	$status_code = wp_remote_retrieve_response_code($response);
	
	if ($status_code === 200) {
		return array(
			'success' => true,
			'message' => __('API key is valid and working correctly.', 'saba-projects')
		);
	} elseif ($status_code === 401) {
		return array(
			'success' => false,
			'message' => __('API key is invalid or unauthorized.', 'saba-projects')
		);
	} else {
		$body = wp_remote_retrieve_body($response);
		$error_data = json_decode($body, true);
		$error_message = isset($error_data['error']['message']) ? $error_data['error']['message'] : "HTTP {$status_code}";
		
		return array(
			'success' => false,
			'message' => __('API Error: ', 'saba-projects') . $error_message
		);
	}
}






