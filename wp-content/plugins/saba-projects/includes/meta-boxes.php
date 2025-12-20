<?php
/**
 * Register Project Meta Boxes
 *
 * @package Saba_Projects
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
	exit;
}

/**
 * Add custom meta boxes for projects
 */
function saba_projects_add_meta_boxes()
{
	// Remove default taxonomy meta boxes
	remove_meta_box('tagsdiv-project_village', 'project', 'side');
	remove_meta_box('tagsdiv-project_panchayat', 'project', 'side');
	remove_meta_box('tagsdiv-project_block', 'project', 'side');
	// Also remove them if they are hierarchical (checkbox style) which uses 'div' suffix usually but sometimes 'side'
	remove_meta_box('project_villagediv', 'project', 'side');
	remove_meta_box('project_panchayatdiv', 'project', 'side');
	remove_meta_box('project_blockdiv', 'project', 'side');

	add_meta_box(
		'project_details',
		__('Project Details', 'saba-projects'),
		'saba_projects_render_meta_box',
		'project',
		'normal',
		'high'
	);
}
add_action('add_meta_boxes', 'saba_projects_add_meta_boxes');

/**
 * Render the project details meta box
 */
function saba_projects_render_meta_box($post)
{
	// Add nonce for security
	wp_nonce_field('saba_projects_meta_box', 'saba_projects_meta_box_nonce');

	// Get existing values
	// Get existing values
	$budget = get_post_meta($post->ID, '_project_budget', true);

	// Get taxonomy terms
	$village_terms = wp_get_object_terms($post->ID, 'project_village');
	$village = !empty($village_terms) && !is_wp_error($village_terms) ? $village_terms[0]->term_id : '';

	$panchayat_terms = wp_get_object_terms($post->ID, 'project_panchayat');
	$panchayat = !empty($panchayat_terms) && !is_wp_error($panchayat_terms) ? $panchayat_terms[0]->term_id : '';

	$block_terms = wp_get_object_terms($post->ID, 'project_block');
	$block = !empty($block_terms) && !is_wp_error($block_terms) ? $block_terms[0]->term_id : '';

	$title_tamil = get_post_meta($post->ID, '_project_title_tamil', true);
	$title_english = get_post_meta($post->ID, '_project_title_english', true);

	$villages = saba_projects_get_terms('project_village');
	$panchayats = saba_projects_get_terms('project_panchayat');
	$blocks = saba_projects_get_terms('project_block');

	?>
	<div class="saba-projects-meta-box">
		<p>
			<label for="project_block">
				<strong><?php _e('Block', 'saba-projects'); ?></strong>
			</label><br>
			<select id="project_block" name="project_block" class="large-text">
				<option value=""><?php _e('Select Block', 'saba-projects'); ?></option>
				<?php foreach ($blocks as $term): ?>
					<option value="<?php echo esc_attr($term->term_id); ?>" <?php selected($block, $term->term_id); ?>>
						<?php echo esc_html($term->name); ?>
					</option>
				<?php endforeach; ?>
			</select>
		</p>

		<p>
			<label for="project_panchayat">
				<strong><?php _e('Panchayat', 'saba-projects'); ?></strong>
			</label><br>
			<select id="project_panchayat" name="project_panchayat" class="large-text">
				<option value=""><?php _e('Select Panchayat', 'saba-projects'); ?></option>
				<?php foreach ($panchayats as $term): ?>
					<option value="<?php echo esc_attr($term->term_id); ?>" <?php selected($panchayat, $term->term_id); ?>>
						<?php echo esc_html($term->name); ?>
					</option>
				<?php endforeach; ?>
			</select>
		</p>

		<p>
			<label for="project_village">
				<strong><?php _e('Village', 'saba-projects'); ?></strong>
			</label><br>
			<select id="project_village" name="project_village" class="large-text">
				<option value=""><?php _e('Select Village', 'saba-projects'); ?></option>
				<?php foreach ($villages as $term): ?>
					<option value="<?php echo esc_attr($term->term_id); ?>" <?php selected($village, $term->term_id); ?>>
						<?php echo esc_html($term->name); ?>
					</option>
				<?php endforeach; ?>
			</select>
		</p>

		<p>
			<label for="project_budget">
				<strong><?php _e('Budget Amount (₹)', 'saba-projects'); ?></strong>
			</label><br>
			<input type="number" id="project_budget" name="project_budget" value="<?php echo esc_attr($budget); ?>"
				class="large-text" step="1" min="0">
			<br><em><?php _e('Enter the estimated amount in Rupees', 'saba-projects'); ?></em>
		</p>

		<div class="saba-translation-field-group">
			<p>
				<label for="project_title_english">
					<strong><?php _e('Project Title (English)', 'saba-projects'); ?></strong>
				</label><br>
			<div style="display: flex; gap: 10px; align-items: flex-start;">
				<input type="text" id="project_title_english" name="project_title_english"
					value="<?php echo esc_attr($title_english); ?>" class="large-text" style="flex: 1;">
				<button type="button" class="button saba-translate-btn" data-field-type="title"
					data-source-field="project_title_english" data-target-field="project_title_tamil"
					data-project-id="<?php echo esc_attr($post->ID); ?>" style="white-space: nowrap;">
					<span class="dashicons dashicons-translation" style="vertical-align: middle;"></span>
					<span class="saba-translate-label"><?php _e('Translate', 'saba-projects'); ?></span>
				</button>
			</div>
			</p>

			<p>
				<label for="project_title_tamil">
					<strong><?php _e('Project Title (Tamil)', 'saba-projects'); ?></strong>
				</label><br>
			<div style="display: flex; gap: 10px; align-items: flex-start;">
				<input type="text" id="project_title_tamil" name="project_title_tamil"
					value="<?php echo esc_attr($title_tamil); ?>" class="large-text" style="flex: 1;">
				<button type="button" class="button saba-translate-btn" data-field-type="title"
					data-source-field="project_title_tamil" data-target-field="project_title_english"
					data-project-id="<?php echo esc_attr($post->ID); ?>" style="white-space: nowrap;">
					<span class="dashicons dashicons-translation" style="vertical-align: middle;"></span>
					<span class="saba-translate-label"><?php _e('Translate', 'saba-projects'); ?></span>
				</button>
			</div>
			</p>
		</div>

		<!-- Description fields disabled and removed from codebase -->
	</div>

	<style>
		.saba-projects-meta-box p {
			margin-bottom: 20px;
		}

		.saba-projects-meta-box label {
			display: block;
			margin-bottom: 5px;
		}

		.saba-translation-field-group {
			margin-bottom: 30px;
		}

		.saba-translate-btn {
			position: relative;
		}

		.saba-translate-btn.loading {
			opacity: 0.6;
			pointer-events: none;
		}

		.saba-translate-btn.loading .dashicons {
			animation: spin 1s linear infinite;
		}

		@keyframes spin {
			from {
				transform: rotate(0deg);
			}

			to {
				transform: rotate(360deg);
			}
		}
	</style>
	<?php
}

/**
 * Save project meta box data
 */
function saba_projects_save_meta_box($post_id)
{
	// Check if nonce is set
	if (!isset($_POST['saba_projects_meta_box_nonce'])) {
		return;
	}

	// Verify nonce
	if (!wp_verify_nonce($_POST['saba_projects_meta_box_nonce'], 'saba_projects_meta_box')) {
		return;
	}

	// Check if autosave
	if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
		return;
	}

	// Check user permissions
	if (!current_user_can('edit_post', $post_id)) {
		return;
	}

	// Save budget
	if (isset($_POST['project_budget'])) {
		update_post_meta(
			$post_id,
			'_project_budget',
			sanitize_text_field($_POST['project_budget'])
		);
	}

	// Save Village (Taxonomy)
	if (isset($_POST['project_village'])) {
		$term_id = intval($_POST['project_village']);
		if ($term_id > 0) {
			wp_set_object_terms($post_id, array($term_id), 'project_village');
		} else {
			wp_set_object_terms($post_id, array(), 'project_village');
		}
	} else {
		// If field is missing (and not just empty), usually means unchecked checkbox in default UI, 
		// but here it's a select. If it's sent as empty string, the above condition handles it.
		// If using logic where absence implies deletion, be careful. 
		// For a required dropdown, if the user selects "Select Village" (value=""), we clear terms.
		wp_set_object_terms($post_id, array(), 'project_village');
	}

	// Save Panchayat (Taxonomy)
	if (isset($_POST['project_panchayat'])) {
		$term_id = intval($_POST['project_panchayat']);
		if ($term_id > 0) {
			wp_set_object_terms($post_id, array($term_id), 'project_panchayat');
		} else {
			wp_set_object_terms($post_id, array(), 'project_panchayat');
		}
	} else {
		wp_set_object_terms($post_id, array(), 'project_panchayat');
	}

	// Save Block (Taxonomy)
	if (isset($_POST['project_block'])) {
		$term_id = intval($_POST['project_block']);
		if ($term_id > 0) {
			wp_set_object_terms($post_id, array($term_id), 'project_block');
		} else {
			wp_set_object_terms($post_id, array(), 'project_block');
		}
	} else {
		wp_set_object_terms($post_id, array(), 'project_block');
	}

	// Save Tamil title
	if (isset($_POST['project_title_tamil'])) {
		update_post_meta(
			$post_id,
			'_project_title_tamil',
			sanitize_text_field($_POST['project_title_tamil'])
		);
	}

	// Save English title
	if (isset($_POST['project_title_english'])) {
		update_post_meta(
			$post_id,
			'_project_title_english',
			sanitize_text_field($_POST['project_title_english'])
		);
	}


}
add_action('save_post_project', 'saba_projects_save_meta_box');

/**
 * Add custom columns to projects list table
 */
function saba_projects_custom_columns($columns)
{
	$new_columns = array();

	foreach ($columns as $key => $value) {
		$new_columns[$key] = $value;

		if ($key === 'title') {
			$new_columns['title_english'] = __('Title (English)', 'saba-projects');
			$new_columns['title_tamil'] = __('Title (Tamil)', 'saba-projects');
			$new_columns['budget'] = __('Budget', 'saba-projects');
		}
	}

	return $new_columns;
}
add_filter('manage_project_posts_columns', 'saba_projects_custom_columns');

/**
 * Display custom column content
 */
function saba_projects_custom_column_content($column, $post_id)
{
	if ($column === 'title_english') {
		echo esc_html(get_post_meta($post_id, '_project_title_english', true));
	} elseif ($column === 'title_tamil') {
		echo esc_html(get_post_meta($post_id, '_project_title_tamil', true));
	} elseif ($column === 'budget') {
		$budget = get_post_meta($post_id, '_project_budget', true);
		if ($budget) {
			// Format currency
			if ($budget >= 10000000) {
				echo '₹' . number_format($budget / 10000000, 2) . ' Cr';
			} elseif ($budget >= 100000) {
				echo '₹' . number_format($budget / 100000, 2) . ' L';
			} else {
				echo '₹' . number_format($budget);
			}
		} else {
			echo '-';
		}
	}
}
add_action('manage_project_posts_custom_column', 'saba_projects_custom_column_content', 10, 2);

/**
 * Make budget column sortable
 */
function saba_projects_sortable_columns($columns)
{
	$columns['budget'] = 'budget';
	$columns['title_english'] = 'title_english';
	$columns['title_tamil'] = 'title_tamil';
	return $columns;
}
add_filter('manage_edit-project_sortable_columns', 'saba_projects_sortable_columns');


/**
 * Get list of blocks
 */
/**
 * Get terms for a taxonomy helper
 *
 * @param string $taxonomy Taxonomy name.
 * @param int    $limit    Max number of terms to fetch (default 200).
 * @return array Array of term objects.
 */
function saba_projects_get_terms($taxonomy, $limit = 200)
{
	$terms = get_terms(array(
		'taxonomy' => $taxonomy,
		'hide_empty' => false,
		'number' => $limit,
		'orderby' => 'name',
		'order' => 'ASC',
	));

	if (is_wp_error($terms)) {
		return array();
	}

	return $terms;
}
