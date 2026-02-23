<?php
/**
 * Template for displaying single project
 *
 * @package Saba_Rajendran
 */

get_header(); ?>

<main class="site-main">
	<?php
	while ( have_posts() ) :
		the_post();
		?>

		<article id="post-<?php the_ID(); ?>" <?php post_class( 'single-project' ); ?>>
			<div class="container">
				<!-- Back to Projects Link -->
				<div class="back-link">
					<a href="<?php echo esc_url( get_post_type_archive_link( 'project' ) ); ?>">
						&larr; <?php _e( 'Back to Projects', 'saba-rajendran' ); ?>
					</a>
				</div>

				<!-- Project Header -->
				<header class="project-header">
					<h1 class="project-title">
						<?php the_title(); ?>
					</h1>

					<!-- Project Meta -->
					<div class="project-meta-info">
						<div class="meta-badges">
							<?php
							// Category
							$categories = get_the_terms( get_the_ID(), 'project_category' );
							if ( $categories && ! is_wp_error( $categories ) ) {
								echo '<div class="meta-item">';
								echo '<strong>' . __( 'Category:', 'saba-rajendran' ) . '</strong> ';
								foreach ( $categories as $category ) {
									printf(
										'<span class="project-badge category">%s</span>',
										esc_html( $category->name )
									);
								}
								echo '</div>';
							}

							// Village
							$villages = get_the_terms( get_the_ID(), 'project_village' );
							if ( $villages && ! is_wp_error( $villages ) ) {
								echo '<div class="meta-item">';
								echo '<strong>' . __( 'Village:', 'saba-rajendran' ) . '</strong> ';
								foreach ( $villages as $village ) {
									printf(
										'<span class="project-badge village">%s</span>',
										esc_html( $village->name )
									);
								}
								echo '</div>';
							}

							// Year
							$years = get_the_terms( get_the_ID(), 'project_year' );
							if ( $years && ! is_wp_error( $years ) ) {
								echo '<div class="meta-item">';
								echo '<strong>' . __( 'Year:', 'saba-rajendran' ) . '</strong> ';
								foreach ( $years as $year ) {
									printf(
										'<span class="project-badge year">%s</span>',
										esc_html( $year->name )
									);
								}
								echo '</div>';
							}

							// Status
							$statuses = get_the_terms( get_the_ID(), 'project_status' );
							if ( $statuses && ! is_wp_error( $statuses ) ) {
								echo '<div class="meta-item">';
								echo '<strong>' . __( 'Status:', 'saba-rajendran' ) . '</strong> ';
								foreach ( $statuses as $status ) {
									$status_class = '';
									if ( in_array( strtolower( $status->name ), array( 'completed', 'physically completed' ) ) ) {
										$status_class = 'status-completed';
									} elseif ( in_array( strtolower( $status->name ), array( 'in progress', 'underprogress' ) ) ) {
										$status_class = 'status-progress';
									}
									printf(
										'<span class="project-badge status %s">%s</span>',
										esc_attr( $status_class ),
										esc_html( $status->name )
									);
								}
								echo '</div>';
							}

							// Scheme
							$schemes = get_the_terms( get_the_ID(), 'project_scheme' );
							if ( $schemes && ! is_wp_error( $schemes ) ) {
								echo '<div class="meta-item">';
								echo '<strong>' . __( 'Scheme:', 'saba-rajendran' ) . '</strong> ';
								foreach ( $schemes as $scheme ) {
									printf(
										'<span class="project-badge scheme">%s</span>',
										esc_html( $scheme->name )
									);
								}
								echo '</div>';
							}

							// Budget hidden
							// $budget = get_post_meta( get_the_ID(), '_project_budget', true );
							// if ( $budget ) {
							// 	echo '<div class="meta-item budget-large">';
							// 	echo '<strong>' . __( 'Budget:', 'saba-rajendran' ) . '</strong> ';
							// 	echo '<span class="project-budget-amount">' . saba_rajendran_format_currency( $budget ) . '</span>';
							// 	echo '</div>';
							// }
							?>
						</div>
					</div>
				</header>

				<!-- Project Featured Image/Gallery -->
				<?php if ( has_post_thumbnail() ) : ?>
					<div class="project-featured-image">
						<?php the_post_thumbnail( 'large' ); ?>
					</div>
				<?php endif; ?>

				<!-- Project Content -->
				<div class="project-content-area">
					<?php
					// Check for bilingual descriptions
					$description_tamil   = get_post_meta( get_the_ID(), '_project_description_tamil', true );
					$description_english = get_post_meta( get_the_ID(), '_project_description_english', true );

					if ( $description_tamil || $description_english ) {
						?>
						<div class="bilingual-content">
							<?php if ( $description_tamil ) : ?>
								<div class="content-tamil">
									<h3><?php _e( 'Description (Tamil)', 'saba-rajendran' ); ?></h3>
									<?php echo wpautop( wp_kses_post( $description_tamil ) ); ?>
								</div>
							<?php endif; ?>

							<?php if ( $description_english ) : ?>
								<div class="content-english">
									<h3><?php _e( 'Description (English)', 'saba-rajendran' ); ?></h3>
									<?php echo wpautop( wp_kses_post( $description_english ) ); ?>
								</div>
							<?php endif; ?>
						</div>
						<?php
					}

					// Display main content if available
					if ( get_the_content() ) {
						?>
						<div class="project-description">
							<?php the_content(); ?>
						</div>
						<?php
					}
					?>
				</div>

				<!-- Social Sharing -->
				<div class="project-sharing">
					<h3><?php _e( 'Share this project', 'saba-rajendran' ); ?></h3>
					<div class="share-buttons">
						<!-- WhatsApp -->
						<a href="https://wa.me/?text=<?php echo urlencode( get_the_title() . ' - ' . get_permalink() ); ?>"
						   target="_blank"
						   class="share-button whatsapp"
						   aria-label="<?php esc_attr_e( 'Share on WhatsApp', 'saba-rajendran' ); ?>">
							WhatsApp
						</a>

						<!-- Facebook -->
						<a href="https://www.facebook.com/sharer/sharer.php?u=<?php echo urlencode( get_permalink() ); ?>"
						   target="_blank"
						   class="share-button facebook"
						   aria-label="<?php esc_attr_e( 'Share on Facebook', 'saba-rajendran' ); ?>">
							Facebook
						</a>

						<!-- Twitter -->
						<a href="https://twitter.com/intent/tweet?url=<?php echo urlencode( get_permalink() ); ?>&text=<?php echo urlencode( get_the_title() ); ?>"
						   target="_blank"
						   class="share-button twitter"
						   aria-label="<?php esc_attr_e( 'Share on Twitter', 'saba-rajendran' ); ?>">
							Twitter
						</a>
					</div>
				</div>

				<!-- Project Navigation -->
				<div class="project-navigation">
					<?php
					$prev_post = get_previous_post();
					$next_post = get_next_post();
					?>

					<?php if ( $prev_post ) : ?>
						<div class="nav-previous">
							<a href="<?php echo get_permalink( $prev_post->ID ); ?>">
								<span class="nav-subtitle"><?php _e( 'Previous Project', 'saba-rajendran' ); ?></span>
								<span class="nav-title"><?php echo get_the_title( $prev_post->ID ); ?></span>
							</a>
						</div>
					<?php endif; ?>

					<?php if ( $next_post ) : ?>
						<div class="nav-next">
							<a href="<?php echo get_permalink( $next_post->ID ); ?>">
								<span class="nav-subtitle"><?php _e( 'Next Project', 'saba-rajendran' ); ?></span>
								<span class="nav-title"><?php echo get_the_title( $next_post->ID ); ?></span>
							</a>
						</div>
					<?php endif; ?>
				</div>
			</div>
		</article>

	<?php endwhile; ?>
</main>

<?php get_footer(); ?>
