<?php
/**
 * Template Name: Projects - Elementor Full Width
 * Description: Full-width page template for Projects designed with Elementor
 *
 * @package Astra
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header(); ?>

<div id="primary" class="content-area">
	<main id="main" class="site-main">
		<?php
		while ( have_posts() ) :
			the_post();
			?>
			<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
				<div class="entry-content">
					<?php
					the_content();
					?>
				</div>
			</article>
			<?php
		endwhile;
		?>
	</main>
</div>

<?php get_footer(); ?>
