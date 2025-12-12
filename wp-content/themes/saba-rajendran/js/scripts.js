/**
 * Saba. Rajendran Theme Scripts
 * Enhanced with search, reset, and better UX
 */

(function ($) {
	'use strict';

	/**
	 * Project Pill Filtering with AJAX
	 */
	function initProjectFilters() {
		const $pillButtons = $('.filter-pill');
		const $projectsGrid = $('#projects-grid');
		const $projectsCount = $('#projects-found');
		const $loadingIndicator = $('#loading-indicator');

		if ($projectsGrid.length === 0) {
			return;
		}

		// Collect active filters from pills
		function collectActiveFilters() {
			const filters = {
				categories: [],
				villages: [],
				years: [],
				statuses: []
			};

			$pillButtons.filter('.active').not('[data-filter="all"]').each(function () {
				const taxonomy = $(this).data('taxonomy');
				const value = $(this).data('value');

				if (taxonomy === 'category') filters.categories.push(value);
				if (taxonomy === 'village') filters.villages.push(value);
				if (taxonomy === 'year') filters.years.push(value);
				if (taxonomy === 'status') filters.statuses.push(value);
			});

			return filters;
		}

		// Function to perform AJAX filter
		function filterProjects() {
			const activeFilters = collectActiveFilters();

			const ajaxData = {
				action: 'filter_projects',
				nonce: sabaRajendran.nonce,
				categories: activeFilters.categories,
				villages: activeFilters.villages,
				years: activeFilters.years,
				statuses: activeFilters.statuses
			};

			// Show loading state
			$loadingIndicator.fadeIn(200);
			$projectsGrid.css('opacity', '0.5');

			// AJAX request
			$.ajax({
				url: sabaRajendran.ajaxUrl,
				type: 'POST',
				data: ajaxData,
				success: function (response) {
					if (response.success) {
						$projectsGrid.html(response.data.html);

						// Update count
						const countText = response.data.count === 1
							? '<strong>1</strong> project found'
							: '<strong>' + response.data.count + '</strong> projects found';
						$projectsCount.html(countText);

						// Update URL without reload
						const params = new URLSearchParams();
						if (activeFilters.categories.length) params.set('category', activeFilters.categories.join(','));
						if (activeFilters.villages.length) params.set('village', activeFilters.villages.join(','));
						if (activeFilters.years.length) params.set('year', activeFilters.years.join(','));
						if (activeFilters.statuses.length) params.set('status', activeFilters.statuses.join(','));

						const newUrl = params.toString() ?
							window.location.pathname + '?' + params.toString() :
							window.location.pathname;

						if (window.history && window.history.pushState) {
							window.history.pushState({}, '', newUrl);
						}

						// Scroll to top of results
						$('html, body').animate({
							scrollTop: $projectsGrid.offset().top - 100
						}, 400);
					}

					// Remove loading state
					$loadingIndicator.fadeOut(200);
					$projectsGrid.css('opacity', '1');
				},
				error: function () {
					alert('Error loading projects. Please try again.');
					$loadingIndicator.fadeOut(200);
					$projectsGrid.css('opacity', '1');
				}
			});
		}

		// Pill click handling
		$pillButtons.on('click', function (e) {
			e.preventDefault();
			const $pill = $(this);

			// Handle "All" button
			if ($pill.data('filter') === 'all') {
				// Deactivate all other pills
				$pillButtons.removeClass('active');
				$pill.addClass('active');
				// Reset and show all projects
				filterProjects();
				return;
			}

			// Remove "All" active state
			$('[data-filter="all"]').removeClass('active');

			// Toggle this pill
			$pill.toggleClass('active');

			// If no pills are active, activate "All"
			if ($pillButtons.filter('.active').length === 0) {
				$('[data-filter="all"]').addClass('active');
			}

			// Trigger filter
			filterProjects();
		});
	}

	/**
	 * Smooth scroll for anchor links
	 */
	function initSmoothScroll() {
		$('a[href*="#"]').not('[href="#"]').not('[href="#0"]').on('click', function (e) {
			if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '')
				&& location.hostname === this.hostname) {

				const target = $(this.hash);
				const $target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

				if ($target.length) {
					e.preventDefault();
					$('html, body').stop().animate({
						scrollTop: $target.offset().top - 80
					}, 600);
				}
			}
		});
	}

	/**
	 * Social Share Tracking
	 */
	function initSocialShare() {
		$('.share-button').on('click', function () {
			const platform = $(this).hasClass('whatsapp') ? 'WhatsApp'
				: $(this).hasClass('facebook') ? 'Facebook'
					: $(this).hasClass('twitter') ? 'Twitter'
						: 'Unknown';

			// Track share event if analytics is available
			if (typeof gtag !== 'undefined') {
				gtag('event', 'share', {
					'method': platform,
					'content_type': 'project',
					'item_id': window.location.href
				});
			}

			console.log('Shared on ' + platform);
		});
	}

	/**
	 * Initialize on document ready
	 */
	$(document).ready(function () {
		initProjectFilters();
		initSmoothScroll();

		if ($('.share-button').length > 0) {
			initSocialShare();
		}

		console.log('Saba. Rajendran Theme: Scripts loaded');
	});

})(jQuery);
