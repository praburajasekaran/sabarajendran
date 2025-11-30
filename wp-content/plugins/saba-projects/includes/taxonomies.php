<?php
/**
 * Register Project Taxonomies
 *
 * @package Saba_Projects
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register all project taxonomies
 */
function saba_projects_register_taxonomies() {
	// Register Project Category
	register_taxonomy(
		'project_category',
		'project',
		array(
			'labels'            => array(
				'name'              => _x( 'Project Categories', 'taxonomy general name', 'saba-projects' ),
				'singular_name'     => _x( 'Project Category', 'taxonomy singular name', 'saba-projects' ),
				'search_items'      => __( 'Search Categories', 'saba-projects' ),
				'all_items'         => __( 'All Categories', 'saba-projects' ),
				'parent_item'       => __( 'Parent Category', 'saba-projects' ),
				'parent_item_colon' => __( 'Parent Category:', 'saba-projects' ),
				'edit_item'         => __( 'Edit Category', 'saba-projects' ),
				'update_item'       => __( 'Update Category', 'saba-projects' ),
				'add_new_item'      => __( 'Add New Category', 'saba-projects' ),
				'new_item_name'     => __( 'New Category Name', 'saba-projects' ),
				'menu_name'         => __( 'Categories', 'saba-projects' ),
			),
			'hierarchical'      => true,
			'show_ui'           => true,
			'show_admin_column' => true,
			'query_var'         => true,
			'rewrite'           => array( 'slug' => 'project-category' ),
			'show_in_rest'      => true,
		)
	);

	// Register Project Village
	register_taxonomy(
		'project_village',
		'project',
		array(
			'labels'            => array(
				'name'              => _x( 'Villages', 'taxonomy general name', 'saba-projects' ),
				'singular_name'     => _x( 'Village', 'taxonomy singular name', 'saba-projects' ),
				'search_items'      => __( 'Search Villages', 'saba-projects' ),
				'all_items'         => __( 'All Villages', 'saba-projects' ),
				'edit_item'         => __( 'Edit Village', 'saba-projects' ),
				'update_item'       => __( 'Update Village', 'saba-projects' ),
				'add_new_item'      => __( 'Add New Village', 'saba-projects' ),
				'new_item_name'     => __( 'New Village Name', 'saba-projects' ),
				'menu_name'         => __( 'Villages', 'saba-projects' ),
			),
			'hierarchical'      => true,
			'show_ui'           => true,
			'show_admin_column' => true,
			'query_var'         => true,
			'rewrite'           => array( 'slug' => 'village' ),
			'show_in_rest'      => true,
		)
	);

	// Register Project Year
	register_taxonomy(
		'project_year',
		'project',
		array(
			'labels'            => array(
				'name'              => _x( 'Years', 'taxonomy general name', 'saba-projects' ),
				'singular_name'     => _x( 'Year', 'taxonomy singular name', 'saba-projects' ),
				'search_items'      => __( 'Search Years', 'saba-projects' ),
				'all_items'         => __( 'All Years', 'saba-projects' ),
				'edit_item'         => __( 'Edit Year', 'saba-projects' ),
				'update_item'       => __( 'Update Year', 'saba-projects' ),
				'add_new_item'      => __( 'Add New Year', 'saba-projects' ),
				'new_item_name'     => __( 'New Year', 'saba-projects' ),
				'menu_name'         => __( 'Years', 'saba-projects' ),
			),
			'hierarchical'      => false,
			'show_ui'           => true,
			'show_admin_column' => true,
			'query_var'         => true,
			'rewrite'           => array( 'slug' => 'year' ),
			'show_in_rest'      => true,
		)
	);

	// Register Project Status
	register_taxonomy(
		'project_status',
		'project',
		array(
			'labels'            => array(
				'name'              => _x( 'Status', 'taxonomy general name', 'saba-projects' ),
				'singular_name'     => _x( 'Status', 'taxonomy singular name', 'saba-projects' ),
				'search_items'      => __( 'Search Status', 'saba-projects' ),
				'all_items'         => __( 'All Status', 'saba-projects' ),
				'edit_item'         => __( 'Edit Status', 'saba-projects' ),
				'update_item'       => __( 'Update Status', 'saba-projects' ),
				'add_new_item'      => __( 'Add New Status', 'saba-projects' ),
				'new_item_name'     => __( 'New Status', 'saba-projects' ),
				'menu_name'         => __( 'Status', 'saba-projects' ),
			),
			'hierarchical'      => false,
			'show_ui'           => true,
			'show_admin_column' => true,
			'query_var'         => true,
			'rewrite'           => array( 'slug' => 'status' ),
			'show_in_rest'      => true,
		)
	);

	// Register Project Scheme
	register_taxonomy(
		'project_scheme',
		'project',
		array(
			'labels'            => array(
				'name'              => _x( 'Schemes', 'taxonomy general name', 'saba-projects' ),
				'singular_name'     => _x( 'Scheme', 'taxonomy singular name', 'saba-projects' ),
				'search_items'      => __( 'Search Schemes', 'saba-projects' ),
				'all_items'         => __( 'All Schemes', 'saba-projects' ),
				'edit_item'         => __( 'Edit Scheme', 'saba-projects' ),
				'update_item'       => __( 'Update Scheme', 'saba-projects' ),
				'add_new_item'      => __( 'Add New Scheme', 'saba-projects' ),
				'new_item_name'     => __( 'New Scheme Name', 'saba-projects' ),
				'menu_name'         => __( 'Schemes', 'saba-projects' ),
			),
			'hierarchical'      => false,
			'show_ui'           => true,
			'show_admin_column' => false,
			'query_var'         => true,
			'rewrite'           => array( 'slug' => 'scheme' ),
			'show_in_rest'      => true,
		)
	);
}
add_action( 'init', 'saba_projects_register_taxonomies' );
