<?php
/**
 * Register Projects Custom Post Type
 *
 * @package Saba_Projects
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the Projects custom post type
 */
function saba_projects_register_post_type() {
	$labels = array(
		'name'                  => _x( 'Projects', 'Post type general name', 'saba-projects' ),
		'singular_name'         => _x( 'Project', 'Post type singular name', 'saba-projects' ),
		'menu_name'             => _x( 'Projects', 'Admin Menu text', 'saba-projects' ),
		'name_admin_bar'        => _x( 'Project', 'Add New on Toolbar', 'saba-projects' ),
		'add_new'               => __( 'Add New', 'saba-projects' ),
		'add_new_item'          => __( 'Add New Project', 'saba-projects' ),
		'new_item'              => __( 'New Project', 'saba-projects' ),
		'edit_item'             => __( 'Edit Project', 'saba-projects' ),
		'view_item'             => __( 'View Project', 'saba-projects' ),
		'all_items'             => __( 'All Projects', 'saba-projects' ),
		'search_items'          => __( 'Search Projects', 'saba-projects' ),
		'parent_item_colon'     => __( 'Parent Projects:', 'saba-projects' ),
		'not_found'             => __( 'No projects found.', 'saba-projects' ),
		'not_found_in_trash'    => __( 'No projects found in Trash.', 'saba-projects' ),
		'featured_image'        => _x( 'Project Image', 'Overrides the "Featured Image" phrase', 'saba-projects' ),
		'set_featured_image'    => _x( 'Set project image', 'Overrides the "Set featured image" phrase', 'saba-projects' ),
		'remove_featured_image' => _x( 'Remove project image', 'Overrides the "Remove featured image" phrase', 'saba-projects' ),
		'use_featured_image'    => _x( 'Use as project image', 'Overrides the "Use as featured image" phrase', 'saba-projects' ),
		'archives'              => _x( 'Project archives', 'The post type archive label', 'saba-projects' ),
		'insert_into_item'      => _x( 'Insert into project', 'Overrides the "Insert into post"/"Insert into page" phrase', 'saba-projects' ),
		'uploaded_to_this_item' => _x( 'Uploaded to this project', 'Overrides the "Uploaded to this post"/"Uploaded to this page" phrase', 'saba-projects' ),
		'filter_items_list'     => _x( 'Filter projects list', 'Screen reader text for the filter links', 'saba-projects' ),
		'items_list_navigation' => _x( 'Projects list navigation', 'Screen reader text for the pagination', 'saba-projects' ),
		'items_list'            => _x( 'Projects list', 'Screen reader text for the items list', 'saba-projects' ),
	);

	$args = array(
		'labels'             => $labels,
		'public'             => true,
		'publicly_queryable' => true,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'query_var'          => true,
		'rewrite'            => array( 'slug' => 'project' ),
		'capability_type'    => 'post',
		'has_archive'        => true,
		'hierarchical'       => false,
		'menu_position'      => 5,
		'menu_icon'          => 'dashicons-building',
		'supports'           => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
		'show_in_rest'       => true,
	);

	register_post_type( 'project', $args );
}
add_action( 'init', 'saba_projects_register_post_type' );
