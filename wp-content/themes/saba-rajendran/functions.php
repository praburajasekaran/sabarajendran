<?php
/**
 * Saba Rajendran Theme Functions
 *
 * @package Saba_Rajendran
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
	exit;
}

/**
 * Theme Setup
 */
function saba_rajendran_theme_setup()
{
	// Add default posts and comments RSS feed links to head
	add_theme_support('automatic-feed-links');

	// Let WordPress manage the document title
	add_theme_support('title-tag');

	// Enable support for Post Thumbnails
	add_theme_support('post-thumbnails');

	// Add support for responsive embedded content
	add_theme_support('responsive-embeds');

	// Add support for custom logo
	add_theme_support('custom-logo', array(
		'height' => 100,
		'width' => 300,
		'flex-height' => true,
		'flex-width' => true,
	));

	// Register navigation menus
	register_nav_menus(array(
		'primary' => __('Primary Menu', 'saba-rajendran'),
		'footer' => __('Footer Menu', 'saba-rajendran'),
	));

	// Add support for HTML5 markup
	add_theme_support('html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
		'style',
		'script',
	));
}
add_action('after_setup_theme', 'saba_rajendran_theme_setup');

/**
 * Enqueue scripts and styles
 */
function saba_rajendran_enqueue_scripts()
{
	// Main stylesheet
	wp_enqueue_style('saba-rajendran-style', get_stylesheet_uri(), array(), '1.0.0');

	// Tamil font from Google Fonts
	wp_enqueue_style(
		'noto-sans-tamil',
		'https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;600;700&display=swap',
		array(),
		null
	);

	// Main JavaScript (we'll add this for AJAX filtering later)
	wp_enqueue_script(
		'saba-rajendran-scripts',
		get_template_directory_uri() . '/js/scripts.js',
		array('jquery'),
		'1.0.0',
		true
	);

	// Pass AJAX URL to JavaScript
	wp_localize_script('saba-rajendran-scripts', 'sabaRajendran', array(
		'ajaxUrl' => admin_url('admin-ajax.php'),
		'nonce' => wp_create_nonce('saba_rajendran_nonce'),
	));
}
add_action('wp_enqueue_scripts', 'saba_rajendran_enqueue_scripts');

/**
 * Register widget areas
 */
function saba_rajendran_widgets_init()
{
	register_sidebar(array(
		'name' => __('Footer Area', 'saba-rajendran'),
		'id' => 'footer-1',
		'description' => __('Add widgets here to appear in footer.', 'saba-rajendran'),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget' => '</section>',
		'before_title' => '<h2 class="widget-title">',
		'after_title' => '</h2>',
	));
}
add_action('widgets_init', 'saba_rajendran_widgets_init');

/**
 * Custom template tags for this theme
 */

/**
 * Format currency in Indian Rupees
 */
function saba_rajendran_format_currency($amount)
{
	if (empty($amount)) {
		return '';
	}

	// Convert to lakhs/crores format
	if ($amount >= 10000000) {
		return '₹' . number_format($amount / 10000000, 2) . ' Cr';
	} elseif ($amount >= 100000) {
		return '₹' . number_format($amount / 100000, 2) . ' L';
	} else {
		return '₹' . number_format($amount);
	}
}

/**
 * Get project status badge HTML
 */
function saba_rajendran_get_status_badge($status)
{
	$status_classes = array(
		'Completed' => 'status-completed',
		'Physically Completed' => 'status-completed',
		'Underprogress' => 'status-progress',
		'In progress' => 'status-progress',
	);

	$class = isset($status_classes[$status]) ? $status_classes[$status] : 'status-default';

	return sprintf('<span class="project-badge status %s">%s</span>', esc_attr($class), esc_html($status));
}

/**
 * AJAX handler for project filtering with multi-select pill support
 */
function saba_rajendran_filter_projects()
{
	// Verify nonce
	check_ajax_referer('saba_rajendran_nonce', 'nonce');

	// Get filter parameters - now supporting arrays for multi-select
	$categories = isset($_POST['categories']) && is_array($_POST['categories']) ?
		array_map('sanitize_text_field', $_POST['categories']) : array();
	$villages = isset($_POST['villages']) && is_array($_POST['villages']) ?
		array_map('sanitize_text_field', $_POST['villages']) : array();
	$years = isset($_POST['years']) && is_array($_POST['years']) ?
		array_map('sanitize_text_field', $_POST['years']) : array();
	$statuses = isset($_POST['statuses']) && is_array($_POST['statuses']) ?
		array_map('sanitize_text_field', $_POST['statuses']) : array();

	// Build query args
	$args = array(
		'post_type' => 'project',
		'posts_per_page' => -1,
		'tax_query' => array('relation' => 'AND'),
		'orderby' => 'date',
		'order' => 'DESC',
	);

	// Add taxonomy filters
	if (!empty($categories)) {
		$args['tax_query'][] = array(
			'taxonomy' => 'project_category',
			'field' => 'slug',
			'terms' => $categories,
			'operator' => 'IN',
		);
	}

	if (!empty($villages)) {
		$args['tax_query'][] = array(
			'taxonomy' => 'project_village',
			'field' => 'slug',
			'terms' => $villages,
			'operator' => 'IN',
		);
	}

	if (!empty($years)) {
		$args['tax_query'][] = array(
			'taxonomy' => 'project_year',
			'field' => 'slug',
			'terms' => $years,
			'operator' => 'IN',
		);
	}

	if (!empty($statuses)) {
		$args['tax_query'][] = array(
			'taxonomy' => 'project_status',
			'field' => 'slug',
			'terms' => $statuses,
			'operator' => 'IN',
		);
	}

	// Execute query
	$query = new WP_Query($args);

	// Generate HTML
	ob_start();

	if ($query->have_posts()) {
		while ($query->have_posts()) {
			$query->the_post();
			get_template_part('template-parts/content', 'project-card');
		}
	} else {
		echo '<div class="no-projects"><p>' . __('No projects found matching your filters.', 'saba-rajendran') . '</p></div>';
	}

	$html = ob_get_clean();
	wp_reset_postdata();

	// Send JSON response
	wp_send_json_success(array(
		'html' => $html,
		'count' => $query->found_posts,
	));
}
add_action('wp_ajax_filter_projects', 'saba_rajendran_filter_projects');
add_action('wp_ajax_nopriv_filter_projects', 'saba_rajendran_filter_projects');

/**
 * Fix pagination for Project custom post type
 */
function saba_rajendran_project_pagination($query)
{
	if (!is_admin() && $query->is_main_query() && is_post_type_archive('project')) {
		// Set posts per page
		$query->set('posts_per_page', 20);
	}
}
add_action('pre_get_posts', 'saba_rajendran_project_pagination');

/**
 * Get project category icon SVG
 * Returns an SVG icon based on the project category
 */
function saba_rajendran_get_category_icon($category_slug = '')
{
	$icons = array(
		'infrastructure' => '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
		'education' => '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
		'healthcare' => '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
		'agriculture' => '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 15h10v6H7z"/><path d="M12 15V9"/><path d="M5 9h2m10 0h2"/><circle cx="12" cy="5" r="2"/></svg>',
		'water-supply' => '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
		'roads' => '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
		'electricity' => '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
		'social-welfare' => '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
		'default' => '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M9 9h6v6H9z"/></svg>',
	);

	return isset($icons[$category_slug]) ? $icons[$category_slug] : $icons['default'];
}

/**
 * Get project category color
 * Returns a color code based on the project category
 */
function saba_rajendran_get_category_color($category_slug = '')
{
	$colors = array(
		'infrastructure' => '#3B82F6',
		'education' => '#8B5CF6',
		'healthcare' => '#10B981',
		'agriculture' => '#F59E0B',
		'water-supply' => '#06B6D4',
		'roads' => '#6B7280',
		'electricity' => '#FBBF24',
		'social-welfare' => '#EC4899',
		'default' => '#94A3B8',
	);

	return isset($colors[$category_slug]) ? $colors[$category_slug] : $colors['default'];
}
