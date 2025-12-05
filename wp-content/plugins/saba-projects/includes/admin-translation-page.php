<?php
/**
 * Admin Translation Page
 *
 * WordPress admin interface for Tamil translation management
 *
 * @package Saba_Projects
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
	exit;
}

/**
 * Register admin menu (deprecated - now using unified menu)
 * Kept for backward compatibility
 */
// function saba_translation_admin_menu()
// {
// 	add_submenu_page(
// 		'edit.php?post_type=project',
// 		__('Tamil Translation', 'saba-projects'),
// 		__('Tamil Translation', 'saba-projects'),
// 		'manage_options',
// 		'saba-tamil-translation',
// 		'saba_translation_admin_page'
// 	);
// }
// add_action('admin_menu', 'saba_translation_admin_menu');

/**
 * Render admin page
 */
function saba_translation_admin_page()
{
	if (!current_user_can('manage_options')) {
		wp_die(__('You do not have sufficient permissions to access this page.'));
	}

	$service = new Saba_Translation_Service();
	$stats = $service->get_statistics();
	$recent_activity = $service->get_recent_activity(10);

	?>
	<div class="wrap">
		<h1><?php _e('Tamil Translation Dashboard', 'saba-projects'); ?></h1>
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
				<button type="button" id="saba-translate-all" class="button button-primary button-large">
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
		<div class="saba-activity-panel" style="background: #fff; padding: 20px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
			<h2><?php _e('Recent Activity', 'saba-projects'); ?></h2>

			<?php if (!empty($recent_activity)): ?>
				<div style="background: #f9f9f9; padding: 15px; border-radius: 4px; font-family: monospace; font-size: 12px; max-height: 300px; overflow-y: auto;">
					<?php foreach ($recent_activity as $line): ?>
						<div style="padding: 2px 0; <?php echo strpos($line, 'ERROR') !== false ? 'color: #d63638;' : ''; ?>">
							<?php echo esc_html($line); ?>
						</div>
					<?php endforeach; ?>
				</div>
			<?php else: ?>
				<p style="color: #666;"><?php _e('No recent activity.', 'saba-projects'); ?></p>
			<?php endif; ?>
		</div>
	</div>

	<script>
		jQuery(document).ready(function($) {
			$('#saba-translate-all').on('click', function() {
				if (!confirm('<?php _e('Are you sure you want to translate all projects? This may take several minutes.', 'saba-projects'); ?>')) {
					return;
				}

				// Show progress area
				$('#saba-progress-area').show();
				$('#saba-result-area').hide();
				$('#saba-translate-all').prop('disabled', true);

				// Get projects to translate
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
						// All done
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
							if (response.success) {
								completed++;
								logMessage('✓ Project #' + projectId + ': ' + response.data.message, 'success');
							} else {
								failed++;
								logMessage('✗ Project #' + projectId + ': ' + response.data.message, 'error');
							}
						},
						error: function() {
							failed++;
							logMessage('✗ Project #' + projectId + ': AJAX error', 'error');
						},
						complete: function() {
							// Update progress
							const current = index + 1;
							const percentage = Math.round((current / total) * 100);
							$('#saba-progress-bar').css('width', percentage + '%');
							$('#saba-progress-count').text(current + ' / ' + total);
							$('#saba-current-project').text('Processing project #' + projectId + '...');

							// Continue to next
							setTimeout(() => translateNext(index + 1), 100);
						}
					});
				}

				translateNext(0);
			}

			function logMessage(message, type) {
				const color = type === 'error' ? '#d63638' : type === 'success' ? '#00a32a' : '#000';
				const timestamp = new Date().toLocaleTimeString();
				$('#saba-translation-log').append(
					'<div style="color: ' + color + ';">[' + timestamp + '] ' + message + '</div>'
				);
				$('#saba-translation-log').scrollTop($('#saba-translation-log')[0].scrollHeight);
			}

			function showComplete(completed, failed, total) {
				$('#saba-progress-text').text('Complete!');
				$('#saba-progress-bar').css('background', '#00a32a');

				let html = '<div class="notice notice-success" style="padding: 15px; margin: 0;"><h3>Translation Complete!</h3>';
				html += '<p><strong>Summary:</strong></p>';
				html += '<ul>';
				html += '<li>✓ Completed: ' + completed + ' projects</li>';
				html += '<li>✗ Failed: ' + failed + ' projects</li>';
				html += '<li>📊 Total processed: ' + total + ' projects</li>';
				html += '</ul>';
				html += '<p><a href="' + window.location.href + '" class="button button-primary">Reload Page</a></p>';
				html += '</div>';

				$('#saba-result-area').html(html).show();
				$('#saba-translate-all').prop('disabled', false);

				logMessage('=== Translation process complete ===', 'success');
			}

			function showError(message) {
				let html = '<div class="notice notice-error"><p><strong>Error:</strong> ' + message + '</p></div>';
				$('#saba-result-area').html(html).show();
				$('#saba-translate-all').prop('disabled', false);
			}
		});
	</script>
	<?php
}

/**
 * AJAX handler: Get projects needing translation
 */
function saba_ajax_get_projects_to_translate()
{
	check_ajax_referer('saba_translation', 'nonce');

	if (!current_user_can('manage_options')) {
		wp_send_json_error(array('message' => 'Insufficient permissions'));
	}

	$service = new Saba_Translation_Service();
	$project_ids = $service->get_projects_needing_translation();

	wp_send_json_success(array(
		'project_ids' => $project_ids,
		'count' => count($project_ids)
	));
}
add_action('wp_ajax_saba_get_projects_to_translate', 'saba_ajax_get_projects_to_translate');

/**
 * AJAX handler: Translate single project
 */
function saba_ajax_translate_project()
{
	check_ajax_referer('saba_translation', 'nonce');

	if (!current_user_can('manage_options')) {
		wp_send_json_error(array('message' => 'Insufficient permissions'));
	}

	$project_id = isset($_POST['project_id']) ? intval($_POST['project_id']) : 0;

	if (!$project_id) {
		wp_send_json_error(array('message' => 'Invalid project ID'));
	}

	$service = new Saba_Translation_Service();
	$result = $service->translate_project($project_id);

	if ($result['success']) {
		wp_send_json_success($result);
	} else {
		wp_send_json_error($result);
	}
}
add_action('wp_ajax_saba_translate_project', 'saba_ajax_translate_project');
