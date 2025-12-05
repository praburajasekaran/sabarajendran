<?php
/**
 * Admin Page for Village Translation
 *
 * @package Saba_Projects
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
	exit;
}

/**
 * Add translation admin menu (deprecated - now using unified menu)
 * Kept for backward compatibility
 */
// function saba_projects_add_translation_menu() {
// 	add_submenu_page(
// 		'edit.php?post_type=project',
// 		__('Village Translation', 'saba-projects'),
// 		__('Translate Villages', 'saba-projects'),
// 		'manage_options',
// 		'saba-village-translation',
// 		'saba_projects_translation_page'
// 	);
// }
// add_action('admin_menu', 'saba_projects_add_translation_menu');

/**
 * Translation admin page
 */
function saba_projects_translation_page() {
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
	<div class="wrap">
		<h1><?php _e('Village Translation', 'saba-projects'); ?></h1>
		
		<?php if (!$has_api_key): ?>
			<div class="notice notice-error">
				<p><strong><?php _e('OpenRouter API Key Not Configured', 'saba-projects'); ?></strong></p>
				<p><?php _e('Please add the following to your wp-config.php file:', 'saba-projects'); ?></p>
				<code>define('OPENROUTER_API_KEY', 'your-api-key-here');</code>
				<p><?php _e('Or set it in the options table using:', 'saba-projects'); ?></p>
				<code>update_option('saba_projects_openrouter_key', 'your-api-key-here');</code>
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
				'number' => 50, // Show first 50
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
 * Get translation statistics
 */
function saba_projects_get_translation_stats() {
	$villages = get_terms(array(
		'taxonomy' => 'project_village',
		'hide_empty' => false,
		'fields' => 'ids'
	));
	
	if (is_wp_error($villages)) {
		return array(
			'total' => 0,
			'has_tamil' => 0,
			'has_english' => 0,
			'has_both' => 0,
			'needs_translation' => 0
		);
	}
	
	$stats = array(
		'total' => count($villages),
		'has_tamil' => 0,
		'has_english' => 0,
		'has_both' => 0,
		'needs_translation' => 0
	);
	
	foreach ($villages as $term_id) {
		$tamil = get_term_meta($term_id, '_village_name_tamil', true);
		$english = get_term_meta($term_id, '_village_name_english', true);
		
		if (!empty($tamil)) $stats['has_tamil']++;
		if (!empty($english)) $stats['has_english']++;
		if (!empty($tamil) && !empty($english)) $stats['has_both']++;
		if (empty($tamil) || empty($english)) $stats['needs_translation']++;
	}
	
	return $stats;
}

/**
 * Bulk translate all villages
 */
function saba_projects_bulk_translate_villages() {
	$api_key = saba_projects_get_openrouter_key();
	if (empty($api_key)) {
		return new WP_Error('no_api_key', 'OpenRouter API key is not configured');
	}
	
	$villages = get_terms(array(
		'taxonomy' => 'project_village',
		'hide_empty' => false,
		'fields' => 'all'
	));
	
	if (is_wp_error($villages)) {
		return new WP_Error('no_villages', 'No villages found');
	}
	
	$translated = 0;
	$skipped = 0;
	$errors = 0;
	
	foreach ($villages as $village) {
		// Check if already has both translations
		$tamil = get_term_meta($village->term_id, '_village_name_tamil', true);
		$english = get_term_meta($village->term_id, '_village_name_english', true);
		
		if (!empty($tamil) && !empty($english)) {
			$skipped++;
			continue;
		}
		
		// Translate
		$result = saba_projects_translate_village_term($village->term_id);
		
		if (is_wp_error($result) || !$result['success']) {
			$errors++;
			// Log error but continue
			error_log('Translation error for village ' . $village->name . ': ' . (is_wp_error($result) ? $result->get_error_message() : 'Unknown error'));
		} else {
			$translated++;
		}
		
		// Add small delay to avoid rate limiting
		usleep(500000); // 0.5 seconds
	}
	
	// Trigger action for Netlify deployment after bulk translation
	do_action('saba_bulk_translation_completed', array(
		'translated' => $translated,
		'skipped' => $skipped,
		'errors' => $errors
	));
	
	return array(
		'success' => true,
		'message' => sprintf(
			__('Translation complete! Translated: %d, Skipped (already translated): %d, Errors: %d', 'saba-projects'),
			$translated,
			$skipped,
			$errors
		),
		'translated' => $translated,
		'skipped' => $skipped,
		'errors' => $errors
	);
}
