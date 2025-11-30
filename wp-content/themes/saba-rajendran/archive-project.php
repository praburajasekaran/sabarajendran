<?php
/**
 * Template for displaying project archive
 *
 * @package Saba_Rajendran
 */

get_header(); ?>

<main class="site-main archive-main">
	<div class="container">
		<!-- Hero Section with Statistics -->
		<header class="archive-header">
			<div class="archive-header-content">
				<h1 class="archive-title">
					<?php _e('Constituency Projects', 'saba-rajendran'); ?>
				</h1>
				<p class="archive-description">
					<?php _e('Development projects undertaken for the welfare of Neyveli constituency', 'saba-rajendran'); ?>
				</p>
			</div>

			<!-- Statistics Dashboard -->
			<div class="archive-stats">
				<?php
				$total_projects = wp_count_posts('project');
				$completed_projects = get_posts(array(
					'post_type' => 'project',
					'posts_per_page' => -1,
					'tax_query' => array(
						array(
							'taxonomy' => 'project_status',
							'field' => 'slug',
							'terms' => array('completed', 'physically-completed'),
						),
					),
					'fields' => 'ids',
				));
				$total_budget = 0;
				$all_projects = get_posts(array(
					'post_type' => 'project',
					'posts_per_page' => -1,
					'fields' => 'ids',
				));
				foreach ($all_projects as $project_id) {
					$budget = get_post_meta($project_id, '_project_budget', true);
					if ($budget) {
						$total_budget += floatval($budget);
					}
				}
				?>
				<div class="stat-card">
					<div class="stat-number"><?php echo number_format_i18n($total_projects->publish); ?></div>
					<div class="stat-label"><?php _e('Total Projects', 'saba-rajendran'); ?></div>
				</div>
				<div class="stat-card">
					<div class="stat-number"><?php echo count($completed_projects); ?></div>
					<div class="stat-label"><?php _e('Completed', 'saba-rajendran'); ?></div>
				</div>
				<div class="stat-card">
					<div class="stat-number">₹<?php echo number_format($total_budget / 10000000, 1); ?>Cr</div>
					<div class="stat-label"><?php _e('Total Investment', 'saba-rajendran'); ?></div>
				</div>
			</div>
		</header>

		<!-- Pill Filters Bar -->
		<div class="filters-bar">
			<div class="pill-filters">
				<!-- All/Reset Pill -->
				<button class="filter-pill active" data-filter="all">
					<?php _e('அனைத்தும்', 'saba-rajendran'); ?>
				</button>

				<!-- Category Pills -->
				<?php
				$categories = get_terms(array(
					'taxonomy' => 'project_category',
					'hide_empty' => true,
					'orderby' => 'name',
					'order' => 'ASC',
				));
				if (!empty($categories) && !is_wp_error($categories)) {
					foreach ($categories as $category) {
						printf(
							'<button class="filter-pill" data-taxonomy="category" data-value="%s">%s</button>',
							esc_attr($category->slug),
							esc_html($category->name)
						);
					}
				}
				?>

				<!-- Village Pills -->
				<?php
				$villages = get_terms(array(
					'taxonomy' => 'project_village',
					'hide_empty' => true,
					'orderby' => 'name',
					'order' => 'ASC',
				));
				if (!empty($villages) && !is_wp_error($villages)) {
					foreach ($villages as $village) {
						printf(
							'<button class="filter-pill" data-taxonomy="village" data-value="%s">%s</button>',
							esc_attr($village->slug),
							esc_html($village->name)
						);
					}
				}
				?>

				<!-- Year Pills -->
				<?php
				$years = get_terms(array(
					'taxonomy' => 'project_year',
					'hide_empty' => true,
					'orderby' => 'name',
					'order' => 'DESC',
				));
				if (!empty($years) && !is_wp_error($years)) {
					foreach ($years as $year) {
						printf(
							'<button class="filter-pill" data-taxonomy="year" data-value="%s">%s</button>',
							esc_attr($year->slug),
							esc_html($year->name)
						);
					}
				}
				?>

				<!-- Status Pills -->
				<?php
				$statuses = get_terms(array(
					'taxonomy' => 'project_status',
					'hide_empty' => true,
					'orderby' => 'name',
					'order' => 'ASC',
				));
				if (!empty($statuses) && !is_wp_error($statuses)) {
					foreach ($statuses as $status) {
						printf(
							'<button class="filter-pill" data-taxonomy="status" data-value="%s">%s</button>',
							esc_attr($status->slug),
							esc_html($status->name)
						);
					}
				}
				?>
			</div>

			<!-- Project Count -->
			<div class="project-count">
				<span id="projects-found">
					<?php
					$count = wp_count_posts('project');
					printf(
						/* translators: %s: number of projects */
						_n('%s project found', '%s projects found', $count->publish, 'saba-rajendran'),
						'<strong>' . number_format_i18n($count->publish) . '</strong>'
					);
					?>
				</span>
			</div>
		</div>

		<!-- Loading Indicator -->
		<div id="loading-indicator" style="display: none;">
			<p><?php _e('Loading projects...', 'saba-rajendran'); ?></p>
		</div>

		<!-- Projects Grid -->
		<div id="projects-grid" class="projects-grid">
			<?php
			if (have_posts()) {
				while (have_posts()) {
					the_post();
					get_template_part('template-parts/content', 'project-card');
				}
			} else {
				?>
				<div class="no-projects">
					<p><?php _e('No projects found.', 'saba-rajendran'); ?></p>
				</div>
				<?php
			}
			?>
		</div>

		<?php
		// Pagination
		global $wp_query;
		$big = 999999999; // need an unlikely integer
		
		$pagination_links = paginate_links(array(
			'current' => max(1, get_query_var('paged')),
			'total' => $wp_query->max_num_pages,
			'prev_text' => __('&laquo; Previous', 'saba-rajendran'),
			'next_text' => __('Next &raquo;', 'saba-rajendran'),
			'type' => 'array',
		));

		if (!empty($pagination_links)) {
			echo '<div class="pagination">';
			foreach ($pagination_links as $link) {
				echo $link;
			}
			echo '</div>';
		}
		?>
	</div>
</main>

<?php get_footer(); ?>