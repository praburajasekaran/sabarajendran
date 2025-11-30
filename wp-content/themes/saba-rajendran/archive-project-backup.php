<?php
/**
 * Template for displaying project archive
 *
 * @package Saba_Rajendran
 */

get_header(); ?>

<main class="site-main">
	<div class="container">
		<header class="archive-header">
			<h1 class="archive-title">
				<?php _e('Constituency Projects', 'saba-rajendran'); ?>
			</h1>
			<p class="archive-description">
				<?php _e('Development projects undertaken for the welfare of Neyveli constituency', 'saba-rajendran'); ?>
			</p>
		</header>

		<!-- Filter Bar -->
		<div class="filters-bar">
			<form id="project-filters" method="get">
				<div class="filter-controls">
					<!-- Search -->
					<div class="filter-group">
						<label for="search">
							<?php _e('Search', 'saba-rajendran'); ?>
						</label>
						<input type="text" id="search" name="search"
							placeholder="<?php esc_attr_e('Search projects...', 'saba-rajendran'); ?>">
					</div>

					<!-- Village Filter -->
					<div class="filter-group">
						<label for="filter-village">
							<?php _e('Village', 'saba-rajendran'); ?>
						</label>
						<select id="filter-village" name="village">
							<option value=""><?php _e('All Villages', 'saba-rajendran'); ?></option>
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
										'<option value="%s">%s (%d)</option>',
										esc_attr($village->slug),
										esc_html($village->name),
										$village->count
									);
								}
							}
							?>
						</select>
					</div>

					<!-- Category Filter -->
					<div class="filter-group">
						<label for="filter-category">
							<?php _e('Category', 'saba-rajendran'); ?>
						</label>
						<select id="filter-category" name="category">
							<option value=""><?php _e('All Categories', 'saba-rajendran'); ?></option>
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
										'<option value="%s">%s (%d)</option>',
										esc_attr($category->slug),
										esc_html($category->name),
										$category->count
									);
								}
							}
							?>
						</select>
					</div>

					<!-- Year Filter -->
					<div class="filter-group">
						<label for="filter-year">
							<?php _e('Year', 'saba-rajendran'); ?>
						</label>
						<select id="filter-year" name="year">
							<option value=""><?php _e('All Years', 'saba-rajendran'); ?></option>
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
										'<option value="%s">%s (%d)</option>',
										esc_attr($year->slug),
										esc_html($year->name),
										$year->count
									);
								}
							}
							?>
						</select>
					</div>

					<!-- Status Filter -->
					<div class="filter-group">
						<label for="filter-status">
							<?php _e('Status', 'saba-rajendran'); ?>
						</label>
						<select id="filter-status" name="status">
							<option value=""><?php _e('All Status', 'saba-rajendran'); ?></option>
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
										'<option value="%s">%s (%d)</option>',
										esc_attr($status->slug),
										esc_html($status->name),
										$status->count
									);
								}
							}
							?>
						</select>
					</div>

					<!-- Reset Button -->
					<div class="filter-group">
						<label>&nbsp;</label>
						<button type="button" id="reset-filters" class="button button-secondary">
							<?php _e('Reset Filters', 'saba-rajendran'); ?>
						</button>
					</div>
				</div>
			</form>

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