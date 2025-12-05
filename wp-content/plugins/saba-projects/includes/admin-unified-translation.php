<?php
/**
 * Unified Translation Admin Page
 *
 * Single page with tabs for Projects, Villages, and Settings
 *
 * @package Saba_Projects
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
	exit;
}

/**
 * Register unified translation menu
 */
function saba_projects_add_unified_translation_menu() {
	add_submenu_page(
		'edit.php?post_type=project',
		__('Translations', 'saba-projects'),
		__('Translations', 'saba-projects'),
		'manage_options',
		'saba-translations',
		'saba_projects_unified_translation_page'
	);
}
add_action('admin_menu', 'saba_projects_add_unified_translation_menu');

/**
 * Render unified translation page with tabs
 */
function saba_projects_unified_translation_page() {
	if (!current_user_can('manage_options')) {
		wp_die(__('You do not have sufficient permissions to access this page.'));
	}

	$active_tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : 'projects';
	$tabs = array(
		'projects' => __('Batch Translate Projects', 'saba-projects'),
		'villages' => __('Batch Translate Villages', 'saba-projects'),
		'settings' => __('Translation Settings', 'saba-projects'),
	);
	?>
	<div class="wrap">
		<h1><?php _e('Translations', 'saba-projects'); ?></h1>
		
		<nav class="nav-tab-wrapper" style="margin-bottom: 20px;">
			<?php foreach ($tabs as $tab_key => $tab_label): ?>
				<a href="?post_type=project&page=saba-translations&tab=<?php echo esc_attr($tab_key); ?>" 
				   class="nav-tab <?php echo $active_tab === $tab_key ? 'nav-tab-active' : ''; ?>">
					<?php echo esc_html($tab_label); ?>
				</a>
			<?php endforeach; ?>
		</nav>

		<div class="saba-translation-tab-content">
			<?php
			switch ($active_tab) {
				case 'projects':
					saba_projects_render_projects_translation_tab();
					break;
				case 'villages':
					saba_projects_render_villages_translation_tab();
					break;
				case 'settings':
					saba_projects_render_translation_settings_tab();
					break;
			}
			?>
		</div>
	</div>
	<?php
}

/**
 * Render projects translation tab content
 */
function saba_projects_render_projects_translation_tab() {
	$service = new Saba_Translation_Service();
	$stats = $service->get_statistics();
	$recent_activity = $service->get_recent_activity(10);
	?>
	<div class="saba-translation-tab">
		<h2><?php _e('Batch Translate Projects', 'saba-projects'); ?></h2>
		<p class="description">
			<?php _e('Translate project titles and descriptions to Tamil using AI-powered translation (Claude Sonnet 4.5)', 'saba-projects'); ?>
		</p>

		<!-- Statistics Cards -->
		<div class="saba-stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0;">
			<div class="saba-stat-card" style="background: #fff; padding: 20px; border-left: 4px solid #2271b1; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
				<h3 style="margin: 0 0 10px 0; color: #666; font-size: 14px; font-weight: normal;">
					<?php _e('Total Projects', 'saba-projects'); ?>
				</h3>
				<p style="margin: 0; font-size: 32px; font-weight: bold; color: #2271b1;">
					<?php echo esc_html($stats['total']); ?>
				</p>
			</div>

			<div class="saba-stat-card" style="background: #fff; padding: 20px; border-left: 4px solid #00a32a; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
				<h3 style="margin: 0 0 10px 0; color: #666; font-size: 14px; font-weight: normal;">
					<?php _e('Fully Translated', 'saba-projects'); ?>
				</h3>
				<p style="margin: 0; font-size: 32px; font-weight: bold; color: #00a32a;">
					<?php echo esc_html($stats['translated']); ?>
				</p>
				<p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">
					<?php echo esc_html($stats['percentage']); ?>%
				</p>
			</div>

			<div class="saba-stat-card" style="background: #fff; padding: 20px; border-left: 4px solid #d63638; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
				<h3 style="margin: 0 0 10px 0; color: #666; font-size: 14px; font-weight: normal;">
					<?php _e('Need Translation', 'saba-projects'); ?>
				</h3>
				<p style="margin: 0; font-size: 32px; font-weight: bold; color: #d63638;">
					<?php echo esc_html($stats['needs_translation']); ?>
				</p>
			</div>
		</div>

		<!-- Action Panel -->
		<div class="saba-action-panel" style="background: #fff; padding: 20px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
			<h2><?php _e('Batch Translation', 'saba-projects'); ?></h2>
			<p><?php _e('Translate all projects that are missing Tamil content. This process may take several minutes depending on the number of projects.', 'saba-projects'); ?></p>

			<?php if ($stats['needs_translation'] > 0): ?>
				<button type="button" id="saba-translate-all-projects" class="button button-primary button-large">
					<span class="dashicons dashicons-translation" style="vertical-align: middle;"></span>
					<?php printf(__('Translate %d Projects', 'saba-projects'), $stats['needs_translation']); ?>
				</button>
				<p class="description" style="margin-top: 10px;">
					<?php _e('This will make approximately', 'saba-projects'); ?>
					<strong><?php echo esc_html($stats['needs_translation'] * 2); ?></strong>
					<?php _e('API calls. Rate limited to 1 request per 2 seconds.', 'saba-projects'); ?>
				</p>
			<?php else: ?>
				<p style="color: #00a32a; font-weight: bold;">
					<span class="dashicons dashicons-yes" style="vertical-align: middle;"></span>
					<?php _e('All projects have Tamil translations!', 'saba-projects'); ?>
				</p>
			<?php endif; ?>

			<!-- Progress Area -->
			<div id="saba-progress-area" style="display: none; margin-top: 20px;">
				<div style="background: #f0f0f1; padding: 15px; border-radius: 4px;">
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
						<span id="saba-progress-text" style="font-weight: 500;">Starting...</span>
						<span id="saba-progress-count" style="color: #666;">0 / 0</span>
					</div>
					<div style="background: #fff; height: 20px; border-radius: 10px; overflow: hidden;">
						<div id="saba-progress-bar" style="background: #2271b1; height: 100%; width: 0%; transition: width 0.3s;"></div>
					</div>
					<div id="saba-current-project" style="margin-top: 10px; font-size: 12px; color: #666;"></div>
				</div>
				<div id="saba-translation-log" style="margin-top: 15px; max-height: 300px; overflow-y: auto; background: #fff; border: 1px solid #ddd; padding: 10px; font-family: monospace; font-size: 12px;"></div>
			</div>

			<!-- Result Area -->
			<div id="saba-result-area" style="display: none; margin-top: 20px;"></div>
		</div>

		<!-- Recent Activity -->
		<?php if (!empty($recent_activity)): ?>
		<div class="saba-activity-panel" style="background: #fff; padding: 20px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
			<h2><?php _e('Recent Activity', 'saba-projects'); ?></h2>
			<div style="background: #f9f9f9; padding: 15px; border-radius: 4px; font-family: monospace; font-size: 12px; max-height: 300px; overflow-y: auto;">
				<?php foreach ($recent_activity as $line): ?>
					<div style="padding: 2px 0; <?php echo strpos($line, 'ERROR') !== false ? 'color: #d63638;' : ''; ?>">
						<?php echo esc_html($line); ?>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
		<?php endif; ?>
	</div>

	<script>
	jQuery(document).ready(function($) {
		$('#saba-translate-all-projects').on('click', function() {
			if (!confirm('<?php _e('Are you sure you want to translate all projects? This may take several minutes.', 'saba-projects'); ?>')) {
				return;
			}

			$('#saba-progress-area').show();
			$('#saba-result-area').hide();
			$(this).prop('disabled', true);

			$.ajax({
				url: ajaxurl,
				type: 'POST',
				data: {
					action: 'saba_get_projects_to_translate',
					nonce: '<?php echo wp_create_nonce('saba_translation'); ?>'
				},
				success: function(response) {
					if (response.success) {
						translateProjects(response.data.project_ids);
					} else {
						showError(response.data.message || 'Failed to get projects');
					}
				},
				error: function() {
					showError('AJAX request failed');
				}
			});
		});

		function translateProjects(projectIds) {
			const total = projectIds.length;
			let completed = 0;
			let failed = 0;

			$('#saba-progress-count').text('0 / ' + total);
			$('#saba-progress-text').text('Translating projects...');

			function translateNext(index) {
				if (index >= total) {
					showComplete(completed, failed, total);
					return;
				}

				const projectId = projectIds[index];

				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: {
						action: 'saba_translate_project',
						project_id: projectId,
						nonce: '<?php echo wp_create_nonce('saba_translation'); ?>'
					},
					success: function(response) {
						completed++;
						const progress = Math.round((completed / total) * 100);
						$('#saba-progress-bar').css('width', progress + '%');
						$('#saba-progress-count').text(completed + ' / ' + total);
						
						if (response.success) {
							$('#saba-translation-log').prepend('<div style="color: #00a32a;">✓ Project #' + projectId + ' translated</div>');
						} else {
							failed++;
							$('#saba-translation-log').prepend('<div style="color: #d63638;">✗ Project #' + projectId + ': ' + (response.data.message || 'Error') + '</div>');
						}
						
						setTimeout(() => translateNext(index + 1), 2000);
					},
					error: function() {
						failed++;
						completed++;
						$('#saba-translation-log').prepend('<div style="color: #d63638;">✗ Project #' + projectId + ': Request failed</div>');
						setTimeout(() => translateNext(index + 1), 2000);
					}
				});
			}

			translateNext(0);
		}

		function showComplete(completed, failed, total) {
			$('#saba-progress-text').text('Translation complete!');
			$('#saba-result-area').html(
				'<div class="notice notice-success"><p><strong>Complete!</strong> Translated: ' + completed + ', Failed: ' + failed + ', Total: ' + total + '</p></div>'
			).show();
			$('#saba-translate-all-projects').prop('disabled', false);
		}

		function showError(message) {
			$('#saba-result-area').html(
				'<div class="notice notice-error"><p><strong>Error:</strong> ' + message + '</p></div>'
			).show();
			$('#saba-translate-all-projects').prop('disabled', false);
		}
	});
	</script>
	<?php
}

/**
 * Render villages translation tab content
 */
function saba_projects_render_villages_translation_tab() {
	// Handle bulk translation request
	if (isset($_POST['saba_bulk_translate']) && check_admin_referer('saba_bulk_translate_nonce')) {
		$result = saba_projects_bulk_translate_villages();
	}
	
	// Handle single translation
	if (isset($_POST['saba_translate_single']) && check_admin_referer('saba_translate_single_nonce')) {
		$term_id = intval($_POST['term_id']);
		$result = saba_projects_translate_village_term($term_id);
	}
	
	// Get translation stats
	$stats = saba_projects_get_translation_stats();
	
	// Get API key status
	$api_key = saba_projects_get_openrouter_key();
	$has_api_key = !empty($api_key);
	
	?>
	<div class="saba-translation-tab">
		<h2><?php _e('Batch Translate Villages', 'saba-projects'); ?></h2>
		
		<?php if (!$has_api_key): ?>
			<div class="notice notice-error">
				<p><strong><?php _e('OpenRouter API Key Not Configured', 'saba-projects'); ?></strong></p>
				<p><?php _e('Please configure your API key in the', 'saba-projects'); ?> <a href="?post_type=project&page=saba-translations&tab=settings"><?php _e('Translation Settings', 'saba-projects'); ?></a> <?php _e('tab or in', 'saba-projects'); ?> <a href="<?php echo admin_url('options-general.php?page=saba-projects-settings'); ?>"><?php _e('Settings → Saba Projects', 'saba-projects'); ?></a>.</p>
			</div>
		<?php endif; ?>
		
		<?php if (isset($result)): ?>
			<?php if (is_wp_error($result)): ?>
				<div class="notice notice-error">
					<p><strong><?php _e('Error:', 'saba-projects'); ?></strong> <?php echo esc_html($result->get_error_message()); ?></p>
				</div>
			<?php else: ?>
				<div class="notice notice-success">
					<p><strong><?php _e('Success!', 'saba-projects'); ?></strong> <?php echo esc_html($result['message']); ?></p>
				</div>
			<?php endif; ?>
		<?php endif; ?>
		
		<div class="card" style="max-width: 800px; margin-top: 20px;">
			<h2><?php _e('Translation Statistics', 'saba-projects'); ?></h2>
			<table class="widefat">
				<thead>
					<tr>
						<th><?php _e('Metric', 'saba-projects'); ?></th>
						<th><?php _e('Count', 'saba-projects'); ?></th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><strong><?php _e('Total Villages', 'saba-projects'); ?></strong></td>
						<td><?php echo number_format($stats['total']); ?></td>
					</tr>
					<tr>
						<td><?php _e('Villages with Tamil Translation', 'saba-projects'); ?></td>
						<td><?php echo number_format($stats['has_tamil']); ?> (<?php echo round(($stats['has_tamil'] / max($stats['total'], 1)) * 100); ?>%)</td>
					</tr>
					<tr>
						<td><?php _e('Villages with English Translation', 'saba-projects'); ?></td>
						<td><?php echo number_format($stats['has_english']); ?> (<?php echo round(($stats['has_english'] / max($stats['total'], 1)) * 100); ?>%)</td>
					</tr>
					<tr>
						<td><?php _e('Villages with Both Translations', 'saba-projects'); ?></td>
						<td><?php echo number_format($stats['has_both']); ?> (<?php echo round(($stats['has_both'] / max($stats['total'], 1)) * 100); ?>%)</td>
					</tr>
					<tr>
						<td><?php _e('Villages Needing Translation', 'saba-projects'); ?></td>
						<td><strong><?php echo number_format($stats['needs_translation']); ?></strong></td>
					</tr>
				</tbody>
			</table>
		</div>
		
		<div class="card" style="max-width: 800px; margin-top: 20px;">
			<h2><?php _e('Bulk Translation', 'saba-projects'); ?></h2>
			<p><?php _e('Translate all villages that are missing translations. This may take several minutes depending on the number of villages.', 'saba-projects'); ?></p>
			
			<?php if ($stats['needs_translation'] > 0): ?>
				<form method="post" action="">
					<?php wp_nonce_field('saba_bulk_translate_nonce'); ?>
					<p>
						<button type="submit" name="saba_bulk_translate" class="button button-primary button-large" <?php echo !$has_api_key ? 'disabled' : ''; ?>>
							<?php _e('Translate All Villages', 'saba-projects'); ?> (<?php echo number_format($stats['needs_translation']); ?>)
						</button>
					</p>
					<p class="description">
						<?php _e('This will translate all villages that are missing translations. The process runs in the background and may take time.', 'saba-projects'); ?>
					</p>
				</form>
			<?php else: ?>
				<p class="description">
					<?php _e('All villages have been translated!', 'saba-projects'); ?>
				</p>
			<?php endif; ?>
		</div>
		
		<div class="card" style="max-width: 800px; margin-top: 20px;">
			<h2><?php _e('Auto-Translation Settings', 'saba-projects'); ?></h2>
			<?php
			$auto_translate = get_option('saba_projects_auto_translate_villages', true);
			if (isset($_POST['saba_update_auto_translate']) && check_admin_referer('saba_auto_translate_nonce')) {
				$auto_translate = isset($_POST['auto_translate']) ? true : false;
				update_option('saba_projects_auto_translate_villages', $auto_translate);
				echo '<div class="notice notice-success"><p>' . __('Settings saved!', 'saba-projects') . '</p></div>';
			}
			?>
			<form method="post" action="">
				<?php wp_nonce_field('saba_auto_translate_nonce'); ?>
				<table class="form-table">
					<tr>
						<th scope="row"><?php _e('Auto-Translate New Villages', 'saba-projects'); ?></th>
						<td>
							<label>
								<input type="checkbox" name="auto_translate" value="1" <?php checked($auto_translate, true); ?> <?php echo !$has_api_key ? 'disabled' : ''; ?>>
								<?php _e('Automatically translate villages when they are created or updated', 'saba-projects'); ?>
							</label>
						</td>
					</tr>
				</table>
				<?php submit_button(__('Save Settings', 'saba-projects')); ?>
			</form>
		</div>
		
		<div class="card" style="max-width: 800px; margin-top: 20px;">
			<h2><?php _e('Village List', 'saba-projects'); ?></h2>
			<?php
			$villages = get_terms(array(
				'taxonomy' => 'project_village',
				'hide_empty' => false,
				'number' => 50,
				'orderby' => 'name',
				'order' => 'ASC'
			));
			
			if (!is_wp_error($villages) && !empty($villages)):
			?>
				<table class="widefat striped">
					<thead>
						<tr>
							<th><?php _e('Village Name', 'saba-projects'); ?></th>
							<th><?php _e('Tamil', 'saba-projects'); ?></th>
							<th><?php _e('English', 'saba-projects'); ?></th>
							<th><?php _e('Actions', 'saba-projects'); ?></th>
						</tr>
					</thead>
					<tbody>
						<?php foreach ($villages as $village): 
							$tamil = get_term_meta($village->term_id, '_village_name_tamil', true);
							$english = get_term_meta($village->term_id, '_village_name_english', true);
							$current_lang = saba_projects_detect_language($village->name);
						?>
							<tr>
								<td><strong><?php echo esc_html($village->name); ?></strong></td>
								<td><?php echo !empty($tamil) ? esc_html($tamil) : '<span style="color: #999;">—</span>'; ?></td>
								<td><?php echo !empty($english) ? esc_html($english) : '<span style="color: #999;">—</span>'; ?></td>
								<td>
									<?php if (empty($tamil) || empty($english)): ?>
										<form method="post" action="" style="display: inline;">
											<?php wp_nonce_field('saba_translate_single_nonce'); ?>
											<input type="hidden" name="term_id" value="<?php echo $village->term_id; ?>">
											<button type="submit" name="saba_translate_single" class="button button-small" <?php echo !$has_api_key ? 'disabled' : ''; ?>>
												<?php _e('Translate', 'saba-projects'); ?>
											</button>
										</form>
									<?php else: ?>
										<span style="color: #46b450;">✓ <?php _e('Translated', 'saba-projects'); ?></span>
									<?php endif; ?>
								</td>
							</tr>
						<?php endforeach; ?>
					</tbody>
				</table>
				<p class="description">
					<?php _e('Showing first 50 villages. Use bulk translation to translate all villages.', 'saba-projects'); ?>
				</p>
			<?php else: ?>
				<p><?php _e('No villages found.', 'saba-projects'); ?></p>
			<?php endif; ?>
		</div>
	</div>
	<?php
}

/**
 * Render translation settings tab content
 */
function saba_projects_render_translation_settings_tab() {
	$api_key = get_option('saba_projects_openrouter_key', '');
	$has_api_key = !empty($api_key);
	?>
	<div class="saba-translation-tab">
		<h2><?php _e('Translation Settings', 'saba-projects'); ?></h2>
		
		<div class="card" style="max-width: 800px;">
			<p>
				<?php _e('Configure your OpenRouter API key for translation services. You can also manage this in', 'saba-projects'); ?>
				<a href="<?php echo admin_url('options-general.php?page=saba-projects-settings'); ?>"><?php _e('Settings → Saba Projects', 'saba-projects'); ?></a>.
			</p>
			
			<form method="post" action="options.php">
				<?php settings_fields('saba_projects_settings'); ?>
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
		</div>
	</div>
	<?php
}
