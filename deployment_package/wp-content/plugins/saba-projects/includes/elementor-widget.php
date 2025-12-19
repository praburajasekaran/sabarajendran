<?php
/**
 * Elementor Projects Widget
 *
 * @package Saba_Projects
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register Elementor Widget
 */
function saba_projects_register_elementor_widget( $widgets_manager ) {
	require_once SABA_PROJECTS_DIR . 'includes/widgets/class-projects-grid-widget.php';
	$widgets_manager->register( new \Saba_Projects_Grid_Widget() );
}
add_action( 'elementor/widgets/register', 'saba_projects_register_elementor_widget' );

/**
 * Register Widget Category
 */
function saba_projects_add_elementor_widget_categories( $elements_manager ) {
	$elements_manager->add_category(
		'saba-projects',
		[
			'title' => __( 'Saba Projects', 'saba-projects' ),
			'icon'  => 'fa fa-building',
		]
	);
}
add_action( 'elementor/elements/categories_registered', 'saba_projects_add_elementor_widget_categories' );
