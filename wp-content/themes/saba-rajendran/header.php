<?php
/**
 * Header template
 *
 * @package Saba_Rajendran
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
	<?php wp_body_open(); ?>

	<div id="page" class="site">
		<a class="skip-link screen-reader-text"
			href="#primary"><?php esc_html_e('Skip to content', 'saba-rajendran'); ?></a>

		<header id="masthead" class="site-header">
			<div class="container">
				<div class="site-branding">
					<div class="header-branding-wrapper" style="display: flex; align-items: center; gap: 12px;">
						<a href="<?php echo esc_url(home_url('/')); ?>" class="custom-logo-link" rel="home">
							<img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/nav_logo.png'); ?>"
								class="custom-logo" alt="<?php bloginfo('name'); ?>"
								style="width: 56px; height: 56px; border-radius: 8px; object-fit: cover; border: 2px solid #fbbf24;">
						</a>
						<div class="site-title-wrapper"
							style="display: flex; flex-direction: column; justify-content: center;">
							<a href="<?php echo esc_url(home_url('/')); ?>" class="site-title" rel="home"
								style="text-decoration: none; color: inherit; line-height: 1;">
								<?php bloginfo('name'); ?>
							</a>
							<span class="site-description"
								style="font-size: 0.8rem; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.025em; font-weight: bold; margin-top: 4px; line-height: 1;">
								<?php bloginfo('description'); ?>
							</span>
						</div>
					</div>
				</div>

				<nav id="site-navigation" class="main-navigation">
					<?php
					wp_nav_menu(
						array(
							'theme_location' => 'primary',
							'menu_id' => 'primary-menu',
							'fallback_cb' => false,
						)
					);
					?>
				</nav>

				<div class="language-switcher">
					<!-- Language switcher will be added here later with Polylang -->
				</div>
			</div>
		</header>