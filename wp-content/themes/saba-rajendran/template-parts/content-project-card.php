<?php
/**
 * Template part for displaying project cards
 *
 * @package Saba_Rajendran
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class( 'project-card' ); ?>>
	<a href="<?php the_permalink(); ?>" class="project-card-link">
		<!-- Project Icon -->
		<div class="project-icon-wrapper">
			<?php
			// Get first category for icon
			$categories = get_the_terms( get_the_ID(), 'project_category' );
			$category_slug = 'default';
			$category_color = '#94A3B8';

			if ( $categories && ! is_wp_error( $categories ) ) {
				$first_category = reset( $categories );
				$category_slug = $first_category->slug;
				$category_color = saba_rajendran_get_category_color( $category_slug );
			}

			$icon_svg = saba_rajendran_get_category_icon( $category_slug );
			?>
			<div class="project-icon" style="background: linear-gradient(135deg, <?php echo esc_attr( $category_color ); ?>15, <?php echo esc_attr( $category_color ); ?>30); color: <?php echo esc_attr( $category_color ); ?>;">
				<?php echo $icon_svg; ?>
			</div>
		</div>

		<!-- Project Content -->
		<div class="project-content">
			<!-- Project Title -->
			<h2 class="project-title">
				<?php the_title(); ?>
			</h2>

			<!-- Project Meta Information -->
			<div class="project-meta">
				<?php
				// Get Category
				if ( $categories && ! is_wp_error( $categories ) ) {
					foreach ( $categories as $category ) {
						printf(
							'<span class="project-badge category" style="background: %s15; color: %s; border-color: %s30;">%s</span>',
							esc_attr( saba_rajendran_get_category_color( $category->slug ) ),
							esc_attr( saba_rajendran_get_category_color( $category->slug ) ),
							esc_attr( saba_rajendran_get_category_color( $category->slug ) ),
							esc_html( $category->name )
						);
					}
				}

				// Get Village
				$villages = get_the_terms( get_the_ID(), 'project_village' );
				if ( $villages && ! is_wp_error( $villages ) ) {
					foreach ( $villages as $village ) {
						printf(
							'<span class="project-badge village">📍 %s</span>',
							esc_html( $village->name )
						);
						break; // Only show first village
					}
				}

				// Get Year
				$years = get_the_terms( get_the_ID(), 'project_year' );
				if ( $years && ! is_wp_error( $years ) ) {
					foreach ( $years as $year ) {
						printf(
							'<span class="project-badge year">📅 %s</span>',
							esc_html( $year->name )
						);
						break; // Only show first year
					}
				}

				// Get Status
				$statuses = get_the_terms( get_the_ID(), 'project_status' );
				if ( $statuses && ! is_wp_error( $statuses ) ) {
					foreach ( $statuses as $status ) {
						$status_class = '';
						$status_icon = '';
						if ( in_array( strtolower( $status->name ), array( 'completed', 'physically completed' ) ) ) {
							$status_class = 'status-completed';
							$status_icon = '✓';
						} elseif ( in_array( strtolower( $status->name ), array( 'in progress', 'underprogress' ) ) ) {
							$status_class = 'status-progress';
							$status_icon = '⟳';
						}
						printf(
							'<span class="project-badge status %s">%s %s</span>',
							esc_attr( $status_class ),
							$status_icon,
							esc_html( $status->name )
						);
						break; // Only show first status
					}
				}
				?>
			</div>

			<!-- Project Budget hidden -->

			<!-- Project Excerpt -->
			<?php if ( has_excerpt() ) : ?>
				<div class="project-excerpt">
					<?php the_excerpt(); ?>
				</div>
			<?php endif; ?>
		</div>
	</a>
</article>
