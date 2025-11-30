<?php
/**
 * Register Project Meta Boxes
 *
 * @package Saba_Projects
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Add custom meta boxes for projects
 */
function saba_projects_add_meta_boxes() {
	add_meta_box(
		'project_details',
		__( 'Project Details', 'saba-projects' ),
		'saba_projects_render_meta_box',
		'project',
		'normal',
		'high'
	);
}
add_action( 'add_meta_boxes', 'saba_projects_add_meta_boxes' );

/**
 * Render the project details meta box
 */
function saba_projects_render_meta_box( $post ) {
	// Add nonce for security
	wp_nonce_field( 'saba_projects_meta_box', 'saba_projects_meta_box_nonce' );

	// Get existing values
	$budget           = get_post_meta( $post->ID, '_project_budget', true );
	$title_tamil      = get_post_meta( $post->ID, '_project_title_tamil', true );
	$title_english    = get_post_meta( $post->ID, '_project_title_english', true );
	$description_tamil   = get_post_meta( $post->ID, '_project_description_tamil', true );
	$description_english = get_post_meta( $post->ID, '_project_description_english', true );

	?>
	<div class="saba-projects-meta-box">
		<p>
			<label for="project_budget">
				<strong><?php _e( 'Budget Amount (₹)', 'saba-projects' ); ?></strong>
			</label><br>
			<input type="number" id="project_budget" name="project_budget" value="<?php echo esc_attr( $budget ); ?>" class="large-text" step="1" min="0">
			<br><em><?php _e( 'Enter the estimated amount in Rupees', 'saba-projects' ); ?></em>
		</p>

		<p>
			<label for="project_title_tamil">
				<strong><?php _e( 'Project Title (Tamil)', 'saba-projects' ); ?></strong>
			</label><br>
			<input type="text" id="project_title_tamil" name="project_title_tamil" value="<?php echo esc_attr( $title_tamil ); ?>" class="large-text">
		</p>

		<p>
			<label for="project_title_english">
				<strong><?php _e( 'Project Title (English)', 'saba-projects' ); ?></strong>
			</label><br>
			<input type="text" id="project_title_english" name="project_title_english" value="<?php echo esc_attr( $title_english ); ?>" class="large-text">
		</p>

		<p>
			<label for="project_description_tamil">
				<strong><?php _e( 'Description (Tamil)', 'saba-projects' ); ?></strong>
			</label><br>
			<textarea id="project_description_tamil" name="project_description_tamil" rows="5" class="large-text"><?php echo esc_textarea( $description_tamil ); ?></textarea>
		</p>

		<p>
			<label for="project_description_english">
				<strong><?php _e( 'Description (English)', 'saba-projects' ); ?></strong>
			</label><br>
			<textarea id="project_description_english" name="project_description_english" rows="5" class="large-text"><?php echo esc_textarea( $description_english ); ?></textarea>
		</p>
	</div>

	<style>
		.saba-projects-meta-box p {
			margin-bottom: 20px;
		}
		.saba-projects-meta-box label {
			display: block;
			margin-bottom: 5px;
		}
	</style>
	<?php
}

/**
 * Save project meta box data
 */
function saba_projects_save_meta_box( $post_id ) {
	// Check if nonce is set
	if ( ! isset( $_POST['saba_projects_meta_box_nonce'] ) ) {
		return;
	}

	// Verify nonce
	if ( ! wp_verify_nonce( $_POST['saba_projects_meta_box_nonce'], 'saba_projects_meta_box' ) ) {
		return;
	}

	// Check if autosave
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	// Check user permissions
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	// Save budget
	if ( isset( $_POST['project_budget'] ) ) {
		update_post_meta(
			$post_id,
			'_project_budget',
			sanitize_text_field( $_POST['project_budget'] )
		);
	}

	// Save Tamil title
	if ( isset( $_POST['project_title_tamil'] ) ) {
		update_post_meta(
			$post_id,
			'_project_title_tamil',
			sanitize_text_field( $_POST['project_title_tamil'] )
		);
	}

	// Save English title
	if ( isset( $_POST['project_title_english'] ) ) {
		update_post_meta(
			$post_id,
			'_project_title_english',
			sanitize_text_field( $_POST['project_title_english'] )
		);
	}

	// Save Tamil description
	if ( isset( $_POST['project_description_tamil'] ) ) {
		update_post_meta(
			$post_id,
			'_project_description_tamil',
			wp_kses_post( $_POST['project_description_tamil'] )
		);
	}

	// Save English description
	if ( isset( $_POST['project_description_english'] ) ) {
		update_post_meta(
			$post_id,
			'_project_description_english',
			wp_kses_post( $_POST['project_description_english'] )
		);
	}
}
add_action( 'save_post_project', 'saba_projects_save_meta_box' );

/**
 * Add custom columns to projects list table
 */
function saba_projects_custom_columns( $columns ) {
	$new_columns = array();

	foreach ( $columns as $key => $value ) {
		$new_columns[ $key ] = $value;

		if ( $key === 'title' ) {
			$new_columns['budget'] = __( 'Budget', 'saba-projects' );
		}
	}

	return $new_columns;
}
add_filter( 'manage_project_posts_columns', 'saba_projects_custom_columns' );

/**
 * Display custom column content
 */
function saba_projects_custom_column_content( $column, $post_id ) {
	if ( $column === 'budget' ) {
		$budget = get_post_meta( $post_id, '_project_budget', true );
		if ( $budget ) {
			// Format currency
			if ( $budget >= 10000000 ) {
				echo '₹' . number_format( $budget / 10000000, 2 ) . ' Cr';
			} elseif ( $budget >= 100000 ) {
				echo '₹' . number_format( $budget / 100000, 2 ) . ' L';
			} else {
				echo '₹' . number_format( $budget );
			}
		} else {
			echo '-';
		}
	}
}
add_action( 'manage_project_posts_custom_column', 'saba_projects_custom_column_content', 10, 2 );

/**
 * Make budget column sortable
 */
function saba_projects_sortable_columns( $columns ) {
	$columns['budget'] = 'budget';
	return $columns;
}
add_filter( 'manage_edit-project_sortable_columns', 'saba_projects_sortable_columns' );
