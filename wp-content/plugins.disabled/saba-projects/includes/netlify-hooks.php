<?php
/**
 * Netlify Webhook Integration
 *
 * Hooks into WordPress actions to trigger Netlify deployments
 *
 * @package Saba_Projects
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
	exit;
}

/**
 * Initialize Netlify webhook hooks
 */
function saba_netlify_init_hooks()
{
	$webhook = Saba_Netlify_Webhook::get_instance();

	// Post/Project save hooks
	add_action('save_post', 'saba_netlify_on_post_save', 10, 3);
	add_action('transition_post_status', 'saba_netlify_on_post_status_change', 10, 3);
	add_action('before_delete_post', 'saba_netlify_on_post_delete');

	// Post meta update hooks (for translations and custom fields)
	add_action('updated_post_meta', 'saba_netlify_on_meta_update', 10, 4);
	add_action('added_post_meta', 'saba_netlify_on_meta_update', 10, 4);
	add_action('deleted_post_meta', 'saba_netlify_on_meta_delete', 10, 4);

	// Taxonomy term hooks
	add_action('created_term', 'saba_netlify_on_term_change', 10, 3);
	add_action('edited_term', 'saba_netlify_on_term_change', 10, 3);
	add_action('delete_term', 'saba_netlify_on_term_change', 10, 4);

	// Term meta hooks
	add_action('updated_term_meta', 'saba_netlify_on_term_meta_update', 10, 4);
	add_action('added_term_meta', 'saba_netlify_on_term_meta_update', 10, 4);
	add_action('deleted_term_meta', 'saba_netlify_on_term_meta_delete', 10, 4);

	// Custom action for translation completion
	add_action('saba_translation_completed', 'saba_netlify_on_translation_complete', 10, 2);
	add_action('saba_bulk_translation_completed', 'saba_netlify_on_bulk_translation_complete');
}
add_action('init', 'saba_netlify_init_hooks');

/**
 * Handle post save
 *
 * @param int $post_id Post ID
 * @param WP_Post $post Post object
 * @param bool $update Whether this is an update
 */
function saba_netlify_on_post_save($post_id, $post, $update)
{
	// Skip autosaves and revisions
	if (wp_is_post_autosave($post_id) || wp_is_post_revision($post_id)) {
		return;
	}

	// Skip if post is not published
	if ($post->post_status !== 'publish') {
		return;
	}

	// Get post type label
	$post_type_object = get_post_type_object($post->post_type);
	$post_type_label = $post_type_object ? $post_type_object->labels->singular_name : $post->post_type;

	$action = $update ? 'updated' : 'created';
	$reason = sprintf('%s %s: %s', $post_type_label, $action, $post->post_title);

	$webhook = Saba_Netlify_Webhook::get_instance();
	$webhook->schedule_deployment($reason);
}

/**
 * Handle post status transition
 *
 * @param string $new_status New status
 * @param string $old_status Old status
 * @param WP_Post $post Post object
 */
function saba_netlify_on_post_status_change($new_status, $old_status, $post)
{
	// Skip autosaves and revisions
	if (wp_is_post_autosave($post->ID) || wp_is_post_revision($post->ID)) {
		return;
	}

	// Only trigger if status actually changed
	if ($new_status === $old_status) {
		return;
	}

	// Trigger if transitioning to or from published
	if ($new_status === 'publish' || $old_status === 'publish') {
		$post_type_object = get_post_type_object($post->post_type);
		$post_type_label = $post_type_object ? $post_type_object->labels->singular_name : $post->post_type;

		$reason = sprintf('%s status changed: %s (from %s to %s)', 
			$post_type_label, 
			$post->post_title, 
			$old_status, 
			$new_status
		);

		$webhook = Saba_Netlify_Webhook::get_instance();
		$webhook->schedule_deployment($reason);
	}
}

/**
 * Handle post deletion
 *
 * @param int $post_id Post ID
 */
function saba_netlify_on_post_delete($post_id)
{
	$post = get_post($post_id);
	
	if (!$post || $post->post_status !== 'publish') {
		return;
	}

	$post_type_object = get_post_type_object($post->post_type);
	$post_type_label = $post_type_object ? $post_type_object->labels->singular_name : $post->post_type;

	$reason = sprintf('%s deleted: %s', $post_type_label, $post->post_title);

	$webhook = Saba_Netlify_Webhook::get_instance();
	$webhook->schedule_deployment($reason);
}

/**
 * Handle post meta update
 *
 * @param int $meta_id Meta ID
 * @param int $object_id Post ID
 * @param string $meta_key Meta key
 * @param mixed $meta_value Meta value
 */
function saba_netlify_on_meta_update($meta_id, $object_id, $meta_key, $meta_value)
{
	// Only trigger for published posts
	$post = get_post($object_id);
	if (!$post || $post->post_status !== 'publish') {
		return;
	}

	// Only trigger for relevant meta keys
	$relevant_keys = array(
		'_project_title_tamil',
		'_project_title_english',
		'_project_description_tamil',
		'_project_description_english',
		'_project_budget'
	);

	if (!in_array($meta_key, $relevant_keys)) {
		return;
	}

	$post_type_object = get_post_type_object($post->post_type);
	$post_type_label = $post_type_object ? $post_type_object->labels->singular_name : $post->post_type;

	$reason = sprintf('%s field updated: %s (%s)', 
		$post_type_label, 
		$post->post_title,
		str_replace('_project_', '', $meta_key)
	);

	$webhook = Saba_Netlify_Webhook::get_instance();
	$webhook->schedule_deployment($reason);
}

/**
 * Handle post meta deletion
 *
 * @param array $meta_ids Meta IDs
 * @param int $object_id Post ID
 * @param string $meta_key Meta key
 * @param mixed $meta_value Meta value
 */
function saba_netlify_on_meta_delete($meta_ids, $object_id, $meta_key, $meta_value)
{
	// Only trigger for published posts
	$post = get_post($object_id);
	if (!$post || $post->post_status !== 'publish') {
		return;
	}

	// Only trigger for relevant meta keys
	$relevant_keys = array(
		'_project_title_tamil',
		'_project_title_english',
		'_project_description_tamil',
		'_project_description_english',
		'_project_budget'
	);

	if (!in_array($meta_key, $relevant_keys)) {
		return;
	}

	$reason = sprintf('Project field deleted: %s', $meta_key);

	$webhook = Saba_Netlify_Webhook::get_instance();
	$webhook->schedule_deployment($reason);
}

/**
 * Handle taxonomy term changes
 *
 * @param int $term_id Term ID
 * @param int $tt_id Term taxonomy ID
 * @param string $taxonomy Taxonomy slug
 */
function saba_netlify_on_term_change($term_id, $tt_id, $taxonomy)
{
	// Only trigger for project-related taxonomies
	$relevant_taxonomies = array(
		'project_type',
		'project_status',
		'project_block',
		'project_panchayat',
		'project_village'
	);

	if (!in_array($taxonomy, $relevant_taxonomies)) {
		return;
	}

	$term = get_term($term_id, $taxonomy);
	if (!$term || is_wp_error($term)) {
		return;
	}

	$taxonomy_object = get_taxonomy($taxonomy);
	$taxonomy_label = $taxonomy_object ? $taxonomy_object->labels->singular_name : $taxonomy;

	$reason = sprintf('%s changed: %s', $taxonomy_label, $term->name);

	$webhook = Saba_Netlify_Webhook::get_instance();
	$webhook->schedule_deployment($reason);
}

/**
 * Handle term meta update
 *
 * @param int $meta_id Meta ID
 * @param int $object_id Term ID
 * @param string $meta_key Meta key
 * @param mixed $meta_value Meta value
 */
function saba_netlify_on_term_meta_update($meta_id, $object_id, $meta_key, $meta_value)
{
	// Only trigger for village name translations
	$relevant_keys = array(
		'_village_name_tamil',
		'_village_name_english'
	);

	if (!in_array($meta_key, $relevant_keys)) {
		return;
	}

	$term = get_term($object_id);
	if (!$term || is_wp_error($term)) {
		return;
	}

	$reason = sprintf('Village translation updated: %s (%s)', 
		$term->name,
		str_replace('_village_name_', '', $meta_key)
	);

	$webhook = Saba_Netlify_Webhook::get_instance();
	$webhook->schedule_deployment($reason);
}

/**
 * Handle term meta deletion
 *
 * @param array $meta_ids Meta IDs
 * @param int $object_id Term ID
 * @param string $meta_key Meta key
 * @param mixed $meta_value Meta value
 */
function saba_netlify_on_term_meta_delete($meta_ids, $object_id, $meta_key, $meta_value)
{
	// Only trigger for village name translations
	$relevant_keys = array(
		'_village_name_tamil',
		'_village_name_english'
	);

	if (!in_array($meta_key, $relevant_keys)) {
		return;
	}

	$reason = sprintf('Village translation deleted: term #%d', $object_id);

	$webhook = Saba_Netlify_Webhook::get_instance();
	$webhook->schedule_deployment($reason);
}

/**
 * Handle single translation completion
 *
 * @param int $object_id Post or term ID
 * @param string $type Translation type (project, village, etc.)
 */
function saba_netlify_on_translation_complete($object_id, $type = 'content')
{
	$reason = sprintf('Translation completed: %s #%d', $type, $object_id);

	$webhook = Saba_Netlify_Webhook::get_instance();
	$webhook->schedule_deployment($reason);
}

/**
 * Handle bulk translation completion
 *
 * @param array $stats Translation statistics
 */
function saba_netlify_on_bulk_translation_complete($stats = array())
{
	$count = isset($stats['translated']) ? $stats['translated'] : 'multiple items';
	$reason = sprintf('Bulk translation completed: %s translated', $count);

	$webhook = Saba_Netlify_Webhook::get_instance();
	$webhook->schedule_deployment($reason);
}
