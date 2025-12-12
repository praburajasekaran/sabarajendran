<?php
/**
 * Footer template
 *
 * @package Saba_Rajendran
 */
?>

<footer id="colophon" class="site-footer">
	<div class="container">
		<div class="footer-content">
			<div class="footer-info">
				<h3>MLA Saba. Rajendran</h3>
				<p>Neyveli Constituency, Cuddalore District</p>
				<p>Dravida Munnetra Kazhagam (DMK)</p>
			</div>

			<?php if (is_active_sidebar('footer-1')): ?>
				<div class="footer-widgets">
					<?php dynamic_sidebar('footer-1'); ?>
				</div>
			<?php endif; ?>
		</div>

		<div class="site-info">
			<p>&copy; <?php echo date('Y'); ?> MLA Saba. Rajendran. All rights reserved.</p>
		</div>
	</div>
</footer>

</div><!-- #page -->

<?php wp_footer(); ?>

</body>

</html>