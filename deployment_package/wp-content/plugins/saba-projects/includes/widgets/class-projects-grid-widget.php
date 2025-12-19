<?php
/**
 * Elementor Projects Grid Widget
 *
 * @package Saba_Projects
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Projects Grid Widget Class
 */
class Saba_Projects_Grid_Widget extends \Elementor\Widget_Base {

	/**
	 * Get widget name
	 */
	public function get_name() {
		return 'saba_projects_grid';
	}

	/**
	 * Get widget title
	 */
	public function get_title() {
		return __( 'Projects Grid', 'saba-projects' );
	}

	/**
	 * Get widget icon
	 */
	public function get_icon() {
		return 'eicon-posts-grid';
	}

	/**
	 * Get widget categories
	 */
	public function get_categories() {
		return [ 'saba-projects' ];
	}

	/**
	 * Get widget keywords
	 */
	public function get_keywords() {
		return [ 'projects', 'grid', 'portfolio', 'saba' ];
	}

	/**
	 * Register widget controls
	 */
	protected function register_controls() {
		// Content Section
		$this->start_controls_section(
			'content_section',
			[
				'label' => __( 'Query', 'saba-projects' ),
				'tab'   => \Elementor\Controls_Manager::TAB_CONTENT,
			]
		);

		$this->add_control(
			'posts_per_page',
			[
				'label'   => __( 'Posts Per Page', 'saba-projects' ),
				'type'    => \Elementor\Controls_Manager::NUMBER,
				'default' => 12,
				'min'     => -1,
			]
		);

		// Get all project categories
		$categories = get_terms( array(
			'taxonomy'   => 'project_category',
			'hide_empty' => false,
		) );

		$category_options = [ '' => __( 'All Categories', 'saba-projects' ) ];
		if ( ! is_wp_error( $categories ) ) {
			foreach ( $categories as $category ) {
				$category_options[ $category->term_id ] = $category->name;
			}
		}

		$this->add_control(
			'category',
			[
				'label'   => __( 'Category', 'saba-projects' ),
				'type'    => \Elementor\Controls_Manager::SELECT,
				'options' => $category_options,
				'default' => '',
			]
		);

		// Get all villages
		$villages = get_terms( array(
			'taxonomy'   => 'project_village',
			'hide_empty' => false,
		) );

		$village_options = [ '' => __( 'All Villages', 'saba-projects' ) ];
		if ( ! is_wp_error( $villages ) ) {
			foreach ( $villages as $village ) {
				$village_options[ $village->term_id ] = $village->name;
			}
		}

		$this->add_control(
			'village',
			[
				'label'   => __( 'Village', 'saba-projects' ),
				'type'    => \Elementor\Controls_Manager::SELECT,
				'options' => $village_options,
				'default' => '',
			]
		);

		// Get all years
		$years = get_terms( array(
			'taxonomy'   => 'project_year',
			'hide_empty' => false,
		) );

		$year_options = [ '' => __( 'All Years', 'saba-projects' ) ];
		if ( ! is_wp_error( $years ) ) {
			foreach ( $years as $year ) {
				$year_options[ $year->term_id ] = $year->name;
			}
		}

		$this->add_control(
			'year',
			[
				'label'   => __( 'Year', 'saba-projects' ),
				'type'    => \Elementor\Controls_Manager::SELECT,
				'options' => $year_options,
				'default' => '',
			]
		);

		// Get all statuses
		$statuses = get_terms( array(
			'taxonomy'   => 'project_status',
			'hide_empty' => false,
		) );

		$status_options = [ '' => __( 'All Statuses', 'saba-projects' ) ];
		if ( ! is_wp_error( $statuses ) ) {
			foreach ( $statuses as $status ) {
				$status_options[ $status->term_id ] = $status->name;
			}
		}

		$this->add_control(
			'status',
			[
				'label'   => __( 'Status', 'saba-projects' ),
				'type'    => \Elementor\Controls_Manager::SELECT,
				'options' => $status_options,
				'default' => '',
			]
		);

		$this->add_control(
			'orderby',
			[
				'label'   => __( 'Order By', 'saba-projects' ),
				'type'    => \Elementor\Controls_Manager::SELECT,
				'options' => [
					'date'       => __( 'Date', 'saba-projects' ),
					'title'      => __( 'Title', 'saba-projects' ),
					'modified'   => __( 'Modified Date', 'saba-projects' ),
					'rand'       => __( 'Random', 'saba-projects' ),
					'menu_order' => __( 'Menu Order', 'saba-projects' ),
				],
				'default' => 'date',
			]
		);

		$this->add_control(
			'order',
			[
				'label'   => __( 'Order', 'saba-projects' ),
				'type'    => \Elementor\Controls_Manager::SELECT,
				'options' => [
					'DESC' => __( 'Descending', 'saba-projects' ),
					'ASC'  => __( 'Ascending', 'saba-projects' ),
				],
				'default' => 'DESC',
			]
		);

		$this->end_controls_section();

		// Layout Section
		$this->start_controls_section(
			'layout_section',
			[
				'label' => __( 'Layout', 'saba-projects' ),
				'tab'   => \Elementor\Controls_Manager::TAB_CONTENT,
			]
		);

		$this->add_responsive_control(
			'columns',
			[
				'label'          => __( 'Columns', 'saba-projects' ),
				'type'           => \Elementor\Controls_Manager::SELECT,
				'default'        => '3',
				'tablet_default' => '2',
				'mobile_default' => '1',
				'options'        => [
					'1' => '1',
					'2' => '2',
					'3' => '3',
					'4' => '4',
					'6' => '6',
				],
				'selectors'      => [
					'{{WRAPPER}} .saba-projects-grid' => 'grid-template-columns: repeat({{VALUE}}, 1fr);',
				],
			]
		);

		$this->add_responsive_control(
			'column_gap',
			[
				'label'      => __( 'Column Gap', 'saba-projects' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em', 'rem' ],
				'range'      => [
					'px' => [
						'min' => 0,
						'max' => 100,
					],
				],
				'default'    => [
					'size' => 30,
					'unit' => 'px',
				],
				'selectors'  => [
					'{{WRAPPER}} .saba-projects-grid' => 'column-gap: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_responsive_control(
			'row_gap',
			[
				'label'      => __( 'Row Gap', 'saba-projects' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em', 'rem' ],
				'range'      => [
					'px' => [
						'min' => 0,
						'max' => 100,
					],
				],
				'default'    => [
					'size' => 30,
					'unit' => 'px',
				],
				'selectors'  => [
					'{{WRAPPER}} .saba-projects-grid' => 'row-gap: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'show_image',
			[
				'label'        => __( 'Show Image', 'saba-projects' ),
				'type'         => \Elementor\Controls_Manager::SWITCHER,
				'label_on'     => __( 'Yes', 'saba-projects' ),
				'label_off'    => __( 'No', 'saba-projects' ),
				'return_value' => 'yes',
				'default'      => 'yes',
			]
		);

		$this->add_control(
			'show_excerpt',
			[
				'label'        => __( 'Show Excerpt', 'saba-projects' ),
				'type'         => \Elementor\Controls_Manager::SWITCHER,
				'label_on'     => __( 'Yes', 'saba-projects' ),
				'label_off'    => __( 'No', 'saba-projects' ),
				'return_value' => 'yes',
				'default'      => 'yes',
			]
		);

		$this->add_control(
			'show_meta',
			[
				'label'        => __( 'Show Meta', 'saba-projects' ),
				'type'         => \Elementor\Controls_Manager::SWITCHER,
				'label_on'     => __( 'Yes', 'saba-projects' ),
				'label_off'    => __( 'No', 'saba-projects' ),
				'return_value' => 'yes',
				'default'      => 'yes',
			]
		);

		$this->end_controls_section();

		// Style Section
		$this->start_controls_section(
			'style_section',
			[
				'label' => __( 'Card Style', 'saba-projects' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'card_background',
			[
				'label'     => __( 'Background Color', 'saba-projects' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .project-card' => 'background-color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Border::get_type(),
			[
				'name'     => 'card_border',
				'selector' => '{{WRAPPER}} .project-card',
			]
		);

		$this->add_responsive_control(
			'card_border_radius',
			[
				'label'      => __( 'Border Radius', 'saba-projects' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors'  => [
					'{{WRAPPER}} .project-card' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
					'{{WRAPPER}} .project-card img' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} 0 0;',
				],
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Box_Shadow::get_type(),
			[
				'name'     => 'card_box_shadow',
				'selector' => '{{WRAPPER}} .project-card',
			]
		);

		$this->add_responsive_control(
			'card_padding',
			[
				'label'      => __( 'Padding', 'saba-projects' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					'{{WRAPPER}} .project-card-content' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();

		// Title Style
		$this->start_controls_section(
			'title_style_section',
			[
				'label' => __( 'Title Style', 'saba-projects' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'title_color',
			[
				'label'     => __( 'Color', 'saba-projects' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .project-card-title' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'     => 'title_typography',
				'selector' => '{{WRAPPER}} .project-card-title',
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Render widget output
	 */
	protected function render() {
		$settings = $this->get_settings_for_display();

		// Build query arguments
		$args = array(
			'post_type'      => 'project',
			'posts_per_page' => $settings['posts_per_page'],
			'orderby'        => $settings['orderby'],
			'order'          => $settings['order'],
			'tax_query'      => array(
				'relation' => 'AND',
			),
		);

		// Add taxonomy filters
		if ( ! empty( $settings['category'] ) ) {
			$args['tax_query'][] = array(
				'taxonomy' => 'project_category',
				'field'    => 'term_id',
				'terms'    => $settings['category'],
			);
		}

		if ( ! empty( $settings['village'] ) ) {
			$args['tax_query'][] = array(
				'taxonomy' => 'project_village',
				'field'    => 'term_id',
				'terms'    => $settings['village'],
			);
		}

		if ( ! empty( $settings['year'] ) ) {
			$args['tax_query'][] = array(
				'taxonomy' => 'project_year',
				'field'    => 'term_id',
				'terms'    => $settings['year'],
			);
		}

		if ( ! empty( $settings['status'] ) ) {
			$args['tax_query'][] = array(
				'taxonomy' => 'project_status',
				'field'    => 'term_id',
				'terms'    => $settings['status'],
			);
		}

		$query = new WP_Query( $args );

		if ( $query->have_posts() ) :
			?>
			<div class="saba-projects-grid">
				<?php
				while ( $query->have_posts() ) :
					$query->the_post();
					?>
					<div class="project-card">
						<?php if ( 'yes' === $settings['show_image'] && has_post_thumbnail() ) : ?>
							<div class="project-card-image">
								<a href="<?php the_permalink(); ?>">
									<?php the_post_thumbnail( 'medium_large' ); ?>
								</a>
							</div>
						<?php endif; ?>

						<div class="project-card-content">
							<h3 class="project-card-title">
								<a href="<?php the_permalink(); ?>">
									<?php the_title(); ?>
								</a>
							</h3>

							<?php if ( 'yes' === $settings['show_meta'] ) : ?>
								<div class="project-card-meta">
									<?php
									$village = get_the_terms( get_the_ID(), 'project_village' );
									$year    = get_the_terms( get_the_ID(), 'project_year' );
									$status  = get_the_terms( get_the_ID(), 'project_status' );

									if ( $village && ! is_wp_error( $village ) ) :
										?>
										<span class="project-village"><?php echo esc_html( $village[0]->name ); ?></span>
									<?php endif; ?>

									<?php if ( $year && ! is_wp_error( $year ) ) : ?>
										<span class="project-year"><?php echo esc_html( $year[0]->name ); ?></span>
									<?php endif; ?>

									<?php if ( $status && ! is_wp_error( $status ) ) : ?>
										<span class="project-status <?php echo esc_attr( sanitize_title( $status[0]->name ) ); ?>">
											<?php echo esc_html( $status[0]->name ); ?>
										</span>
									<?php endif; ?>
								</div>
							<?php endif; ?>

							<?php if ( 'yes' === $settings['show_excerpt'] ) : ?>
								<div class="project-card-excerpt">
									<?php the_excerpt(); ?>
								</div>
							<?php endif; ?>

							<a href="<?php the_permalink(); ?>" class="project-card-link">
								<?php esc_html_e( 'View Details', 'saba-projects' ); ?>
							</a>
						</div>
					</div>
				<?php endwhile; ?>
			</div>
			<?php
			wp_reset_postdata();
		else :
			?>
			<p><?php esc_html_e( 'No projects found.', 'saba-projects' ); ?></p>
			<?php
		endif;
	}
}
