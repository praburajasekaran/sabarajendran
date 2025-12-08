<?php
/**
 * Netlify Webhook Settings Page
 *
 * Admin interface for configuring Netlify auto-deployment
 *
 * @package Saba_Projects
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
	exit;
}

/**
 * Add Netlify settings submenu page
 */
function saba_netlify_add_settings_page()
{
	add_submenu_page(
		'edit.php?post_type=project',
		__('Netlify Auto-Deploy', 'saba-projects'),
		__('Netlify Deploy', 'saba-projects'),
		'manage_options',
		'saba-netlify-settings',
		'saba_netlify_render_settings_page'
	);
}
add_action('admin_menu', 'saba_netlify_add_settings_page');

/**
 * Handle form submissions
 */
function saba_netlify_handle_form_submission()
{
	if (!isset($_POST['saba_netlify_nonce'])) {
		return;
	}

	if (!wp_verify_nonce($_POST['saba_netlify_nonce'], 'saba_netlify_settings')) {
		wp_die(__('Security check failed', 'saba-projects'));
	}

	if (!current_user_can('manage_options')) {
		wp_die(__('Insufficient permissions', 'saba-projects'));
	}

	$webhook = Saba_Netlify_Webhook::get_instance();

	// Handle manual deployment
	if (isset($_POST['action']) && $_POST['action'] === 'deploy_now') {
		$result = $webhook->trigger_deployment_now();
		
		if ($result['success']) {
			add_settings_error(
				'saba_netlify_messages',
				'deployment_triggered',
				__('Netlify deployment triggered successfully! Check your Netlify dashboard.', 'saba-projects'),
				'success'
			);
		} else {
			add_settings_error(
				'saba_netlify_messages',
				'deployment_failed',
				sprintf(__('Deployment failed: %s', 'saba-projects'), $result['message']),
				'error'
			);
		}
		return;
	}

	// Handle clear log
	if (isset($_POST['action']) && $_POST['action'] === 'clear_log') {
		$webhook->clear_log();
		add_settings_error(
			'saba_netlify_messages',
			'log_cleared',
			__('Deployment log cleared successfully.', 'saba-projects'),
			'success'
		);
		return;
	}

	// Handle settings save
	if (isset($_POST['action']) && $_POST['action'] === 'save_settings') {
		// Save API token
		$api_token = isset($_POST['api_token']) ? sanitize_text_field($_POST['api_token']) : '';
		$webhook->set_api_token($api_token);

		// Save site ID
		$site_id = isset($_POST['site_id']) ? sanitize_text_field($_POST['site_id']) : '';
		$webhook->set_site_id($site_id);

		// Save auto-deploy enabled
		$auto_deploy = isset($_POST['auto_deploy_enabled']) ? true : false;
		$webhook->set_auto_deploy_enabled($auto_deploy);

		add_settings_error(
			'saba_netlify_messages',
			'settings_saved',
			__('Settings saved successfully!', 'saba-projects'),
			'success'
		);
	}
}
add_action('admin_init', 'saba_netlify_handle_form_submission');

/**
 * Render settings page
 */
function saba_netlify_render_settings_page()
{
	$webhook = Saba_Netlify_Webhook::get_instance();
	$api_token = $webhook->get_api_token();
	$site_id = $webhook->get_site_id();
	$auto_deploy_enabled = $webhook->is_auto_deploy_enabled();
	$deployment_queued = $webhook->is_deployment_queued();
	$log = $webhook->get_deployment_log(20);
	$stats = $webhook->get_statistics();

	?>
	<div class="wrap">
		<h1><?php echo esc_html(get_admin_page_title()); ?></h1>

		<?php settings_errors('saba_netlify_messages'); ?>

		<!-- Configuration Warning -->
		<?php if (empty($api_token) || empty($site_id)) : ?>
			<div class="notice notice-warning">
				<p><strong><?php _e('⚠️ Netlify API not configured!', 'saba-projects'); ?></strong></p>
				<p><?php _e('Please configure your Netlify API credentials below to enable automatic deployments.', 'saba-projects'); ?></p>
			</div>
		<?php endif; ?>

		<!-- Pending Deployment Notice -->
		<?php if ($deployment_queued) : ?>
			<div class="notice notice-info">
				<p><strong><?php _e('⏳ Deployment Scheduled', 'saba-projects'); ?></strong></p>
				<p>
					<?php 
					printf(
						__('A deployment is scheduled for %s (in ~%d minutes). It will trigger after 5 minutes of inactivity.', 'saba-projects'),
						esc_html($deployment_queued['trigger_at']),
						ceil((strtotime($deployment_queued['trigger_at']) - time()) / 60)
					);
					?>
				</p>
			</div>
		<?php endif; ?>

		<div class="saba-netlify-settings-container" style="display: flex; gap: 20px; margin-top: 20px;">
			
			<!-- Left Column: Settings -->
			<div style="flex: 1;">
				
				<!-- Settings Form -->
				<div class="card" style="max-width: none;">
					<h2><?php _e('Configuration', 'saba-projects'); ?></h2>
					
					<form method="post" action="">
						<?php wp_nonce_field('saba_netlify_settings', 'saba_netlify_nonce'); ?>
						<input type="hidden" name="action" value="save_settings">

						<table class="form-table" role="presentation">
							<tr>
								<th scope="row">
									<label for="api_token"><?php _e('Netlify API Token', 'saba-projects'); ?></label>
								</th>
								<td>
									<input 
										type="password" 
										name="api_token" 
										id="api_token" 
										value="<?php echo esc_attr($api_token); ?>" 
										class="regular-text code"
										placeholder="nfp_..."
										autocomplete="off"
									>
									<p class="description">
										<?php _e('Your Netlify Personal Access Token. See instructions below.', 'saba-projects'); ?>
									</p>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label for="site_id"><?php _e('Netlify Site ID', 'saba-projects'); ?></label>
								</th>
								<td>
									<input 
										type="text" 
										name="site_id" 
										id="site_id" 
										value="<?php echo esc_attr($site_id); ?>" 
										class="regular-text code"
										placeholder="gilded-scone-a9737b"
									>
									<p class="description">
										<?php _e('Your Netlify site ID (found in Site Settings → General → Site details).', 'saba-projects'); ?>
									</p>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label for="auto_deploy_enabled"><?php _e('Auto-Deploy', 'saba-projects'); ?></label>
								</th>
								<td>
									<label>
										<input 
											type="checkbox" 
											name="auto_deploy_enabled" 
											id="auto_deploy_enabled" 
											value="1"
											<?php checked($auto_deploy_enabled); ?>
										>
										<?php _e('Enable automatic Netlify deployments on content changes', 'saba-projects'); ?>
									</label>
									<p class="description">
										<?php _e('When enabled, Netlify will rebuild your site automatically whenever projects, translations, or taxonomy terms are updated.', 'saba-projects'); ?>
									</p>
								</td>
							</tr>
						</table>

						<?php submit_button(__('Save Settings', 'saba-projects')); ?>
					</form>
				</div>

				<!-- Manual Deploy -->
				<div class="card" style="max-width: none; margin-top: 20px;">
					<h2><?php _e('Manual Deployment', 'saba-projects'); ?></h2>
					<p><?php _e('Trigger a Netlify deployment immediately, bypassing the 5-minute debounce timer.', 'saba-projects'); ?></p>
					
					<form method="post" action="">
						<?php wp_nonce_field('saba_netlify_settings', 'saba_netlify_nonce'); ?>
						<input type="hidden" name="action" value="deploy_now">
						
						<button 
							type="submit" 
							class="button button-primary button-large"
							<?php echo (empty($api_token) || empty($site_id)) ? 'disabled' : ''; ?>
							onclick="return confirm('<?php esc_attr_e('Are you sure you want to trigger a Netlify deployment now?', 'saba-projects'); ?>');"
						>
							🚀 <?php _e('Deploy Now', 'saba-projects'); ?>
						</button>
						
						<?php if (empty($api_token) || empty($site_id)) : ?>
							<p class="description" style="color: #d63638;">
								<?php _e('Configure API credentials above to enable manual deployment.', 'saba-projects'); ?>
							</p>
						<?php endif; ?>
					</form>
				</div>

				<!-- How to Get API Credentials -->
				<div class="card" style="max-width: none; margin-top: 20px; background: #f0f6fc; border-left: 4px solid #0073aa;">
					<h2><?php _e('📖 How to Get Your Netlify API Credentials', 'saba-projects'); ?></h2>
					
					<h3 style="margin-top: 20px;"><?php _e('1. Get Personal Access Token', 'saba-projects'); ?></h3>
					<ol style="line-height: 1.8; margin-left: 20px;">
						<li><?php _e('Open your Netlify dashboard:', 'saba-projects'); ?> 
							<a href="https://app.netlify.com" target="_blank">https://app.netlify.com</a>
						</li>
						<li><?php _e('Click your avatar (top right) → <strong>User settings</strong>', 'saba-projects'); ?></li>
						<li><?php _e('Navigate to: <strong>Applications → Personal access tokens</strong>', 'saba-projects'); ?></li>
						<li><?php _e('Click <strong>"New access token"</strong>', 'saba-projects'); ?></li>
						<li><?php _e('Enter description:', 'saba-projects'); ?> <strong>WordPress Auto Deploy</strong></li>
						<li><?php _e('Click <strong>"Generate token"</strong>', 'saba-projects'); ?></li>
						<li><?php _e('Copy the token (starts with <code>nfp_...</code>)', 'saba-projects'); ?></li>
						<li><?php _e('Paste it in the <strong>API Token</strong> field above', 'saba-projects'); ?></li>
					</ol>

					<h3 style="margin-top: 20px;"><?php _e('2. Get Site ID', 'saba-projects'); ?></h3>
					<ol style="line-height: 1.8; margin-left: 20px;">
						<li><?php _e('Go to your site:', 'saba-projects'); ?> <strong>gilded-scone-a9737b</strong></li>
						<li><?php _e('Navigate: <strong>Site Settings → General → Site details</strong>', 'saba-projects'); ?></li>
						<li><?php _e('Find <strong>Site ID</strong> (e.g., <code>gilded-scone-a9737b</code>)', 'saba-projects'); ?></li>
						<li><?php _e('Copy and paste it in the <strong>Site ID</strong> field above', 'saba-projects'); ?></li>
					</ol>

					<p style="margin-top: 20px; padding: 10px; background: #fff3cd; border-left: 3px solid #ffc107;">
						<strong><?php _e('⚠️ Security Note:', 'saba-projects'); ?></strong> 
						<?php _e('Keep your API token secret! It grants access to your Netlify account.', 'saba-projects'); ?>
					</p>
				</div>

			</div>

			<!-- Right Column: Stats & Log -->
			<div style="flex: 1;">

				<!-- Statistics -->
				<div class="card" style="max-width: none;">
					<h2><?php _e('📊 Deployment Statistics', 'saba-projects'); ?></h2>
					
					<table class="widefat" style="margin-top: 10px;">
						<tbody>
							<tr>
								<td><strong><?php _e('Total Deployments', 'saba-projects'); ?></strong></td>
								<td><?php echo esc_html($stats['total_deployments']); ?></td>
							</tr>
							<tr class="alternate">
								<td><strong><?php _e('Successful', 'saba-projects'); ?></strong></td>
								<td style="color: #46b450;"><?php echo esc_html($stats['successful_deployments']); ?></td>
							</tr>
							<tr>
								<td><strong><?php _e('Failed', 'saba-projects'); ?></strong></td>
								<td style="color: #dc3232;"><?php echo esc_html($stats['failed_deployments']); ?></td>
							</tr>
							<tr class="alternate">
								<td><strong><?php _e('Last Deployment', 'saba-projects'); ?></strong></td>
								<td>
									<?php 
									if ($stats['last_deployment']) {
										echo esc_html(human_time_diff(strtotime($stats['last_deployment']['timestamp']), current_time('timestamp'))) . ' ' . __('ago', 'saba-projects');
									} else {
										_e('Never', 'saba-projects');
									}
									?>
								</td>
							</tr>
							<tr>
								<td><strong><?php _e('Status', 'saba-projects'); ?></strong></td>
								<td>
									<?php if ($deployment_queued) : ?>
										<span style="color: #f0b849;">⏳ <?php _e('Pending', 'saba-projects'); ?></span>
									<?php elseif ($auto_deploy_enabled && !empty($api_token) && !empty($site_id)) : ?>
										<span style="color: #46b450;">✓ <?php _e('Active', 'saba-projects'); ?></span>
									<?php elseif (empty($api_token) || empty($site_id)) : ?>
										<span style="color: #d63638;">⚠️ <?php _e('Not Configured', 'saba-projects'); ?></span>
									<?php else : ?>
										<span style="color: #999;">⏸️ <?php _e('Disabled', 'saba-projects'); ?></span>
									<?php endif; ?>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<!-- Deployment Log -->
				<div class="card" style="max-width: none; margin-top: 20px;">
					<div style="display: flex; justify-content: space-between; align-items: center;">
						<h2><?php _e('📝 Deployment Log', 'saba-projects'); ?></h2>
						<?php if (!empty($log)) : ?>
							<form method="post" action="" style="margin: 0;">
								<?php wp_nonce_field('saba_netlify_settings', 'saba_netlify_nonce'); ?>
								<input type="hidden" name="action" value="clear_log">
								<button 
									type="submit" 
									class="button button-small"
									onclick="return confirm('<?php esc_attr_e('Are you sure you want to clear the deployment log?', 'saba-projects'); ?>');"
								>
									<?php _e('Clear Log', 'saba-projects'); ?>
								</button>
							</form>
						<?php endif; ?>
					</div>

					<?php if (empty($log)) : ?>
						<p><?php _e('No deployment activity yet.', 'saba-projects'); ?></p>
					<?php else : ?>
						<div style="max-height: 500px; overflow-y: auto; margin-top: 10px;">
							<table class="widefat striped">
								<thead>
									<tr>
										<th style="width: 80px;"><?php _e('Type', 'saba-projects'); ?></th>
										<th><?php _e('Message', 'saba-projects'); ?></th>
										<th style="width: 150px;"><?php _e('Time', 'saba-projects'); ?></th>
									</tr>
								</thead>
								<tbody>
									<?php foreach ($log as $entry) : ?>
										<tr>
											<td>
												<?php if ($entry['type'] === 'triggered') : ?>
													<span style="color: #46b450;">✓ <?php _e('Success', 'saba-projects'); ?></span>
												<?php elseif ($entry['type'] === 'scheduled') : ?>
													<span style="color: #f0b849;">⏳ <?php _e('Scheduled', 'saba-projects'); ?></span>
												<?php else : ?>
													<span style="color: #d63638;">✗ <?php _e('Error', 'saba-projects'); ?></span>
												<?php endif; ?>
											</td>
											<td><?php echo esc_html($entry['message']); ?></td>
											<td><?php echo esc_html(human_time_diff($entry['unix_time'], current_time('timestamp'))) . ' ' . __('ago', 'saba-projects'); ?></td>
										</tr>
									<?php endforeach; ?>
								</tbody>
							</table>
						</div>
					<?php endif; ?>
				</div>

				<!-- How It Works -->
				<div class="card" style="max-width: none; margin-top: 20px; background: #f9f9f9;">
					<h2><?php _e('ℹ️ How Auto-Deploy Works', 'saba-projects'); ?></h2>
					<ul style="line-height: 1.8; margin-left: 20px;">
						<li><strong><?php _e('Debouncing (5 min):', 'saba-projects'); ?></strong> 
							<?php _e('After any content change, the system waits 5 minutes before triggering deployment.', 'saba-projects'); ?>
						</li>
						<li><strong><?php _e('Smart Reset:', 'saba-projects'); ?></strong> 
							<?php _e('If more changes happen within 5 minutes, the timer resets.', 'saba-projects'); ?>
						</li>
						<li><strong><?php _e('Single Build:', 'saba-projects'); ?></strong> 
							<?php _e('Bulk operations (e.g., 50 translations) trigger only one build after completion.', 'saba-projects'); ?>
						</li>
						<li><strong><?php _e('What Triggers:', 'saba-projects'); ?></strong> 
							<?php _e('Projects added/updated, translations completed, taxonomy terms changed.', 'saba-projects'); ?>
						</li>
					</ul>
				</div>

			</div>

		</div>
	</div>
	<?php
}
