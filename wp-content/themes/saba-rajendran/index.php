<?php
/**
 * The main template file
 *
 * @package Saba_Rajendran
 */

get_header();
?>

<main id="primary" class="site-main">
	<div class="container">
		<section class="intro-section text-center mt-3 mb-3">
			<h1>Neyveli Constituency Development Projects</h1>
			<p class="lead">Showcasing the development works by MLA Saba. Rajendran</p>
		</section>

		<?php
		if (have_posts()):
			?>
			<div class="posts-grid">
				<?php
				while (have_posts()):
					the_post();
					get_template_part('template-parts/content', get_post_type());
				endwhile;
				?>
			</div>

			<?php
			the_posts_navigation();
		else:
			get_template_part('template-parts/content', 'none');
		endif;
		?>
	</div>
</main>

<?php
get_footer();
