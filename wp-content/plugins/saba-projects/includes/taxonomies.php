<?php
/**
 * Register Project Taxonomies
 *
 * @package Saba_Projects
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
	exit;
}

/**
 * Register all project taxonomies
 */
function saba_projects_register_taxonomies()
{
	// Register Project Category
	register_taxonomy(
		'project_category',
		'project',
		array(
			'labels' => array(
				'name' => _x('Project Categories', 'taxonomy general name', 'saba-projects'),
				'singular_name' => _x('Project Category', 'taxonomy singular name', 'saba-projects'),
				'search_items' => __('Search Categories', 'saba-projects'),
				'all_items' => __('All Categories', 'saba-projects'),
				'parent_item' => __('Parent Category', 'saba-projects'),
				'parent_item_colon' => __('Parent Category:', 'saba-projects'),
				'edit_item' => __('Edit Category', 'saba-projects'),
				'update_item' => __('Update Category', 'saba-projects'),
				'add_new_item' => __('Add New Category', 'saba-projects'),
				'new_item_name' => __('New Category Name', 'saba-projects'),
				'menu_name' => __('Categories', 'saba-projects'),
			),
			'hierarchical' => true,
			'show_ui' => true,
			'show_admin_column' => true,
			'query_var' => true,
			'rewrite' => array('slug' => 'project-category'),
			'show_in_rest' => true,
		)
	);

	// Register Project Village
	register_taxonomy(
		'project_village',
		'project',
		array(
			'labels' => array(
				'name' => _x('Villages', 'taxonomy general name', 'saba-projects'),
				'singular_name' => _x('Village', 'taxonomy singular name', 'saba-projects'),
				'search_items' => __('Search Villages', 'saba-projects'),
				'all_items' => __('All Villages', 'saba-projects'),
				'edit_item' => __('Edit Village', 'saba-projects'),
				'update_item' => __('Update Village', 'saba-projects'),
				'add_new_item' => __('Add New Village', 'saba-projects'),
				'new_item_name' => __('New Village Name', 'saba-projects'),
				'menu_name' => __('Villages', 'saba-projects'),
			),
			'hierarchical' => false,
			'show_ui' => true,
			'show_admin_column' => true,
			'query_var' => true,
			'rewrite' => array('slug' => 'village'),
			'show_in_rest' => true,
		)
	);

	// Register Project Year
	register_taxonomy(
		'project_year',
		'project',
		array(
			'labels' => array(
				'name' => _x('Years', 'taxonomy general name', 'saba-projects'),
				'singular_name' => _x('Year', 'taxonomy singular name', 'saba-projects'),
				'search_items' => __('Search Years', 'saba-projects'),
				'all_items' => __('All Years', 'saba-projects'),
				'edit_item' => __('Edit Year', 'saba-projects'),
				'update_item' => __('Update Year', 'saba-projects'),
				'add_new_item' => __('Add New Year', 'saba-projects'),
				'new_item_name' => __('New Year', 'saba-projects'),
				'menu_name' => __('Years', 'saba-projects'),
			),
			'hierarchical' => false,
			'show_ui' => true,
			'show_admin_column' => true,
			'query_var' => true,
			'rewrite' => array('slug' => 'year'),
			'show_in_rest' => true,
		)
	);

	// Register Project Status
	register_taxonomy(
		'project_status',
		'project',
		array(
			'labels' => array(
				'name' => _x('Status', 'taxonomy general name', 'saba-projects'),
				'singular_name' => _x('Status', 'taxonomy singular name', 'saba-projects'),
				'search_items' => __('Search Status', 'saba-projects'),
				'all_items' => __('All Status', 'saba-projects'),
				'edit_item' => __('Edit Status', 'saba-projects'),
				'update_item' => __('Update Status', 'saba-projects'),
				'add_new_item' => __('Add New Status', 'saba-projects'),
				'new_item_name' => __('New Status', 'saba-projects'),
				'menu_name' => __('Status', 'saba-projects'),
			),
			'hierarchical' => false,
			'show_ui' => true,
			'show_admin_column' => true,
			'query_var' => true,
			'rewrite' => array('slug' => 'status'),
			'show_in_rest' => true,
		)
	);

	// Register Project Scheme
	register_taxonomy(
		'project_scheme',
		'project',
		array(
			'labels' => array(
				'name' => _x('Schemes', 'taxonomy general name', 'saba-projects'),
				'singular_name' => _x('Scheme', 'taxonomy singular name', 'saba-projects'),
				'search_items' => __('Search Schemes', 'saba-projects'),
				'all_items' => __('All Schemes', 'saba-projects'),
				'edit_item' => __('Edit Scheme', 'saba-projects'),
				'update_item' => __('Update Scheme', 'saba-projects'),
				'add_new_item' => __('Add New Scheme', 'saba-projects'),
				'new_item_name' => __('New Scheme Name', 'saba-projects'),
				'menu_name' => __('Schemes', 'saba-projects'),
			),
			'hierarchical' => false,
			'show_ui' => true,
			'show_admin_column' => false,
			'query_var' => true,
			'rewrite' => array('slug' => 'scheme'),
			'show_in_rest' => true,
		)
	);

	// Register Project Panchayat
	register_taxonomy(
		'project_panchayat',
		'project',
		array(
			'labels' => array(
				'name' => _x('Panchayats', 'taxonomy general name', 'saba-projects'),
				'singular_name' => _x('Panchayat', 'taxonomy singular name', 'saba-projects'),
				'search_items' => __('Search Panchayats', 'saba-projects'),
				'all_items' => __('All Panchayats', 'saba-projects'),
				'edit_item' => __('Edit Panchayat', 'saba-projects'),
				'update_item' => __('Update Panchayat', 'saba-projects'),
				'add_new_item' => __('Add New Panchayat', 'saba-projects'),
				'new_item_name' => __('New Panchayat Name', 'saba-projects'),
				'menu_name' => __('Panchayats', 'saba-projects'),
			),
			'hierarchical' => true,
			'show_ui' => true,
			'show_admin_column' => true,
			'query_var' => true,
			'rewrite' => array('slug' => 'panchayat'),
			'show_in_rest' => true,
		)
	);

	// Register Project Block
	register_taxonomy(
		'project_block',
		'project',
		array(
			'labels' => array(
				'name' => _x('Blocks', 'taxonomy general name', 'saba-projects'),
				'singular_name' => _x('Block', 'taxonomy singular name', 'saba-projects'),
				'search_items' => __('Search Blocks', 'saba-projects'),
				'all_items' => __('All Blocks', 'saba-projects'),
				'edit_item' => __('Edit Block', 'saba-projects'),
				'update_item' => __('Update Block', 'saba-projects'),
				'add_new_item' => __('Add New Block', 'saba-projects'),
				'new_item_name' => __('New Block Name', 'saba-projects'),
				'menu_name' => __('Blocks', 'saba-projects'),
			),
			'hierarchical' => true,
			'show_ui' => true,
			'show_admin_column' => true,
			'query_var' => true,
			'rewrite' => array('slug' => 'block'),
			'show_in_rest' => true,
		)
	);
}
add_action('init', 'saba_projects_register_taxonomies');

/**
 * Add custom fields to village taxonomy edit form
 */
function saba_projects_village_edit_form_fields($term)
{
	$tamil_name = get_term_meta($term->term_id, '_village_name_tamil', true);
	$english_name = get_term_meta($term->term_id, '_village_name_english', true);
	?>
	<tr class="form-field">
		<th scope="row">
			<label for="village_name_english"><?php _e('Village Name (English)', 'saba-projects'); ?></label>
		</th>
		<td>
			<div style="display: flex; gap: 10px; align-items: center;">
				<input type="text" id="village_name_english" name="village_name_english"
					value="<?php echo esc_attr($english_name); ?>" class="regular-text" style="flex: 1;">
				<button type="button" class="button saba-translate-village-btn" data-source-field="village_name_english"
					data-target-field="village_name_tamil" data-term-id="<?php echo esc_attr($term->term_id); ?>"
					style="white-space: nowrap;">
					<span class="dashicons dashicons-translation" style="vertical-align: middle;"></span>
					<span class="saba-translate-label"><?php _e('Translate', 'saba-projects'); ?></span>
				</button>
			</div>
		</td>
	</tr>
	<tr class="form-field">
		<th scope="row">
			<label for="village_name_tamil"><?php _e('Village Name (Tamil)', 'saba-projects'); ?></label>
		</th>
		<td>
			<div style="display: flex; gap: 10px; align-items: center;">
				<input type="text" id="village_name_tamil" name="village_name_tamil"
					value="<?php echo esc_attr($tamil_name); ?>" class="regular-text" style="flex: 1;">
				<button type="button" class="button saba-translate-village-btn" data-source-field="village_name_tamil"
					data-target-field="village_name_english" data-term-id="<?php echo esc_attr($term->term_id); ?>"
					style="white-space: nowrap;">
					<span class="dashicons dashicons-translation" style="vertical-align: middle;"></span>
					<span class="saba-translate-label"><?php _e('Translate', 'saba-projects'); ?></span>
				</button>
			</div>
			</div>
		</td>
	</tr>
	<tr class="form-field">
		<th scope="row">
			<label for="village_panchayat"><?php _e('Panchayat', 'saba-projects'); ?></label>
		</th>
		<td>
			<?php
			$selected_panchayat = get_term_meta($term->term_id, '_village_panchayat', true);
			$panchayats = get_terms(array(
				'taxonomy' => 'project_panchayat',
				'hide_empty' => false,
			));
			?>
			<select name="village_panchayat" id="village_panchayat">
				<option value=""><?php _e('Select Panchayat', 'saba-projects'); ?></option>
				<?php foreach ($panchayats as $panchayat): ?>
					<option value="<?php echo esc_attr($panchayat->term_id); ?>" <?php selected($selected_panchayat, $panchayat->term_id); ?>>
						<?php echo esc_html($panchayat->name); ?>
					</option>
				<?php endforeach; ?>
			</select>
			<p class="description"><?php _e('Select the Panchayat this village belongs to.', 'saba-projects'); ?></p>
		</td>
	</tr>
	<?php
}
add_action('project_village_edit_form_fields', 'saba_projects_village_edit_form_fields');

/**
 * Add custom fields to village taxonomy add form
 */
function saba_projects_village_add_form_fields()
{
	?>
	<div class="form-field">
		<label for="village_name_english"><?php _e('Village Name (English)', 'saba-projects'); ?></label>
		<div style="display: flex; gap: 10px; align-items: center; margin-top: 5px;">
			<input type="text" id="village_name_english" name="village_name_english" value="" class="regular-text"
				style="flex: 1;">
			<button type="button" class="button saba-translate-village-btn" data-source-field="village_name_english"
				data-target-field="village_name_tamil" data-term-id="0" style="white-space: nowrap;">
				<span class="dashicons dashicons-translation" style="vertical-align: middle;"></span>
				<span class="saba-translate-label"><?php _e('Translate', 'saba-projects'); ?></span>
			</button>
		</div>
	</div>
	<div class="form-field">
		<label for="village_name_tamil"><?php _e('Village Name (Tamil)', 'saba-projects'); ?></label>
		<div style="display: flex; gap: 10px; align-items: center; margin-top: 5px;">
			<input type="text" id="village_name_tamil" name="village_name_tamil" value="" class="regular-text"
				style="flex: 1;">
			<button type="button" class="button saba-translate-village-btn" data-source-field="village_name_tamil"
				data-target-field="village_name_english" data-term-id="0" style="white-space: nowrap;">
				<span class="dashicons dashicons-translation" style="vertical-align: middle;"></span>
				<span class="saba-translate-label"><?php _e('Translate', 'saba-projects'); ?></span>
			</button>
		</div>
	</div>
	<div class="form-field">
		<label for="village_panchayat"><?php _e('Panchayat', 'saba-projects'); ?></label>
		<?php
		$panchayats = get_terms(array(
			'taxonomy' => 'project_panchayat',
			'hide_empty' => false,
		));
		?>
		<select name="village_panchayat" id="village_panchayat" style="margin-top: 5px; width: 95%;">
			<option value=""><?php _e('Select Panchayat', 'saba-projects'); ?></option>
			<?php foreach ($panchayats as $panchayat): ?>
				<option value="<?php echo esc_attr($panchayat->term_id); ?>">
					<?php echo esc_html($panchayat->name); ?>
				</option>
			<?php endforeach; ?>
		</select>
		<p><?php _e('Select the Panchayat this village belongs to.', 'saba-projects'); ?></p>
	</div>
	<?php
}
add_action('project_village_add_form_fields', 'saba_projects_village_add_form_fields');

/**
 * Save village translation fields
 */
function saba_projects_save_village_translation_fields($term_id)
{
	if (isset($_POST['village_name_english'])) {
		update_term_meta($term_id, '_village_name_english', sanitize_text_field($_POST['village_name_english']));
	}
	if (isset($_POST['village_name_tamil'])) {
		update_term_meta($term_id, '_village_name_tamil', sanitize_text_field($_POST['village_name_tamil']));
	}
	if (isset($_POST['village_panchayat'])) {
		update_term_meta($term_id, '_village_panchayat', sanitize_text_field($_POST['village_panchayat']));
	}
}
add_action('created_project_village', 'saba_projects_save_village_translation_fields', 10, 1);
add_action('edited_project_village', 'saba_projects_save_village_translation_fields', 10, 1);

/**
 * Expose village translation fields in REST API
 */
function saba_projects_register_village_rest_fields()
{
	register_rest_field(
		'project_village',
		'village_name_english',
		array(
			'get_callback' => function ($term_array) {
				return get_term_meta($term_array['id'], '_village_name_english', true);
			},
			'schema' => array(
				'description' => __('Village name in English', 'saba-projects'),
				'type' => 'string',
			),
		)
	);

	register_rest_field(
		'project_village',
		'village_name_tamil',
		array(
			'get_callback' => function ($term_array) {
				return get_term_meta($term_array['id'], '_village_name_tamil', true);
			},
			'schema' => array(
				'description' => __('Village name in Tamil', 'saba-projects'),
				'type' => 'string',
			),
		)
	);
}
add_action('rest_api_init', 'saba_projects_register_village_rest_fields');

/**
 * Add custom fields to panchayat taxonomy edit form
 */
function saba_projects_panchayat_edit_form_fields($term)
{
	$tamil_name = get_term_meta($term->term_id, '_panchayat_name_tamil', true);
	$english_name = get_term_meta($term->term_id, '_panchayat_name_english', true);
	?>
	<tr class="form-field">
		<th scope="row">
			<label for="panchayat_name_english"><?php _e('Panchayat Name (English)', 'saba-projects'); ?></label>
		</th>
		<td>
			<div style="display: flex; gap: 10px; align-items: center;">
				<input type="text" id="panchayat_name_english" name="panchayat_name_english"
					value="<?php echo esc_attr($english_name); ?>" class="regular-text" style="flex: 1;">
				<button type="button" class="button saba-translate-village-btn" data-source-field="panchayat_name_english"
					data-target-field="panchayat_name_tamil" data-term-id="<?php echo esc_attr($term->term_id); ?>"
					style="white-space: nowrap;">
					<span class="dashicons dashicons-translation" style="vertical-align: middle;"></span>
					<span class="saba-translate-label"><?php _e('Translate', 'saba-projects'); ?></span>
				</button>
			</div>
		</td>
	</tr>
	<tr class="form-field">
		<th scope="row">
			<label for="panchayat_name_tamil"><?php _e('Panchayat Name (Tamil)', 'saba-projects'); ?></label>
		</th>
		<td>
			<div style="display: flex; gap: 10px; align-items: center;">
				<input type="text" id="panchayat_name_tamil" name="panchayat_name_tamil"
					value="<?php echo esc_attr($tamil_name); ?>" class="regular-text" style="flex: 1;">
				<button type="button" class="button saba-translate-village-btn" data-source-field="panchayat_name_tamil"
					data-target-field="panchayat_name_english" data-term-id="<?php echo esc_attr($term->term_id); ?>"
					style="white-space: nowrap;">
					<span class="dashicons dashicons-translation" style="vertical-align: middle;"></span>
					<span class="saba-translate-label"><?php _e('Translate', 'saba-projects'); ?></span>
				</button>
			</div>
		</td>
	</tr>
	<?php
}
add_action('project_panchayat_edit_form_fields', 'saba_projects_panchayat_edit_form_fields');

/**
 * Add custom fields to panchayat taxonomy add form
 */
function saba_projects_panchayat_add_form_fields()
{
	?>
	<div class="form-field">
		<label for="panchayat_name_english"><?php _e('Panchayat Name (English)', 'saba-projects'); ?></label>
		<div style="display: flex; gap: 10px; align-items: center; margin-top: 5px;">
			<input type="text" id="panchayat_name_english" name="panchayat_name_english" value="" class="regular-text"
				style="flex: 1;">
			<button type="button" class="button saba-translate-village-btn" data-source-field="panchayat_name_english"
				data-target-field="panchayat_name_tamil" data-term-id="0" style="white-space: nowrap;">
				<span class="dashicons dashicons-translation" style="vertical-align: middle;"></span>
				<span class="saba-translate-label"><?php _e('Translate', 'saba-projects'); ?></span>
			</button>
		</div>
	</div>
	<div class="form-field">
		<label for="panchayat_name_tamil"><?php _e('Panchayat Name (Tamil)', 'saba-projects'); ?></label>
		<div style="display: flex; gap: 10px; align-items: center; margin-top: 5px;">
			<input type="text" id="panchayat_name_tamil" name="panchayat_name_tamil" value="" class="regular-text"
				style="flex: 1;">
			<button type="button" class="button saba-translate-village-btn" data-source-field="panchayat_name_tamil"
				data-target-field="panchayat_name_english" data-term-id="0" style="white-space: nowrap;">
				<span class="dashicons dashicons-translation" style="vertical-align: middle;"></span>
				<span class="saba-translate-label"><?php _e('Translate', 'saba-projects'); ?></span>
			</button>
		</div>
	</div>
	<?php
}
add_action('project_panchayat_add_form_fields', 'saba_projects_panchayat_add_form_fields');

/**
 * Save panchayat translation fields
 */
function saba_projects_save_panchayat_translation_fields($term_id)
{
	if (isset($_POST['panchayat_name_english'])) {
		update_term_meta($term_id, '_panchayat_name_english', sanitize_text_field($_POST['panchayat_name_english']));
	}
	if (isset($_POST['panchayat_name_tamil'])) {
		update_term_meta($term_id, '_panchayat_name_tamil', sanitize_text_field($_POST['panchayat_name_tamil']));
	}
}
add_action('created_project_panchayat', 'saba_projects_save_panchayat_translation_fields', 10, 1);
add_action('edited_project_panchayat', 'saba_projects_save_panchayat_translation_fields', 10, 1);

/**
 * Expose panchayat translation fields in REST API
 */
function saba_projects_register_panchayat_rest_fields()
{
	register_rest_field(
		'project_panchayat',
		'panchayat_name_english',
		array(
			'get_callback' => function ($term_array) {
				return get_term_meta($term_array['id'], '_panchayat_name_english', true);
			},
			'schema' => array(
				'description' => __('Panchayat name in English', 'saba-projects'),
				'type' => 'string',
			),
		)
	);

	register_rest_field(
		'project_panchayat',
		'panchayat_name_tamil',
		array(
			'get_callback' => function ($term_array) {
				return get_term_meta($term_array['id'], '_panchayat_name_tamil', true);
			},
			'schema' => array(
				'description' => __('Panchayat name in Tamil', 'saba-projects'),
				'type' => 'string',
			),
		)
	);
}
add_action('rest_api_init', 'saba_projects_register_panchayat_rest_fields');
