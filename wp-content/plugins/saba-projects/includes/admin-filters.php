<?php
/**
 * Admin Filters for Projects
 *
 * @package Saba_Projects
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Add filter dropdowns to Project admin list
 */
function saba_projects_add_admin_filters($post_type, $which)
{
    // Only run on 'project' post type
    if ('project' !== $post_type) {
        return;
    }

    // Define taxonomies to filter by
    $taxonomies = array(
        'project_block' => __('All Blocks', 'saba-projects'),
        'project_panchayat' => __('All Panchayats', 'saba-projects'),
        'project_village' => __('All Villages', 'saba-projects'),
    );

    foreach ($taxonomies as $taxonomy_slug => $label) {
        // Retrieve taxonomy object
        $taxonomy_obj = get_taxonomy($taxonomy_slug);
        if (!$taxonomy_obj) {
            continue;
        }

        // Retrieve taxonomy terms
        $terms = get_terms(array(
            'taxonomy' => $taxonomy_slug,
            'hide_empty' => false, // Set to true if you only want to show terms with posts
        ));

        // Check if terms exist
        if (!empty($terms) && !is_wp_error($terms)) {
            // Get currently selected term
            $current_selected = isset($_GET[$taxonomy_slug]) ? sanitize_text_field($_GET[$taxonomy_slug]) : '';

            echo '<select name="' . esc_attr($taxonomy_slug) . '" id="' . esc_attr($taxonomy_slug) . '" class="postform">';
            echo '<option value="">' . esc_html($label) . '</option>';

            foreach ($terms as $term) {
                echo '<option value="' . esc_attr($term->slug) . '" ' . selected($current_selected, $term->slug, false) . '>' . esc_html($term->name) . '</option>';
            }

            echo '</select>';
        }
    }
}
add_action('restrict_manage_posts', 'saba_projects_add_admin_filters', 10, 2);
