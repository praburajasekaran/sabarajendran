<?php
/**
 * Template for displaying project archive - Redesigned
 *
 * @package Saba_Rajendran
 */

get_header(); ?>

<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400&family=Public+Sans:wght@300;400;500;600;700&display=swap');

        :root {
            /* Color Palette - Democratic Blueprint */
            --primary-saffron: #FF9933;
            --primary-green: #138808;
            --primary-blue: #000080;
            --accent-warm: #F4A460;
            --accent-cool: #4682B4;

            /* Neutrals */
            --off-white: #FAFAF8;
            --warm-gray: #E8E6E1;
            --mid-gray: #8B8B8B;
            --charcoal: #2D2D2D;
            --ink: #1A1A1A;

            /* Semantic */
            --status-complete: #059669;
            --status-progress: #F59E0B;
            --status-pending: #6B7280;

            /* Typography */
            --font-display: 'Fraunces', serif;
            --font-body: 'Public Sans', sans-serif;

            /* Spacing */
            --space-xs: 0.5rem;
            --space-sm: 1rem;
            --space-md: 1.5rem;
            --space-lg: 2.5rem;
            --space-xl: 4rem;

            /* Effects */
            --shadow-sm: 0 1px 3px rgba(0,0,0,0.05);
            --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
            --shadow-lg: 0 8px 24px rgba(0,0,0,0.12);
            --blur-subtle: blur(40px);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: var(--font-body);
            background: var(--off-white);
            color: var(--ink);
            line-height: 1.6;
            overflow-x: hidden;
        }

        /* Decorative Background */
        .archive-background {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: -1;
            overflow: hidden;
            opacity: 0.4;
        }

        .archive-background::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -20%;
            width: 800px;
            height: 800px;
            background: radial-gradient(circle, var(--primary-saffron) 0%, transparent 70%);
            filter: var(--blur-subtle);
            animation: float-1 20s ease-in-out infinite;
        }

        .archive-background::after {
            content: '';
            position: absolute;
            bottom: -30%;
            left: -15%;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, var(--primary-green) 0%, transparent 70%);
            filter: var(--blur-subtle);
            animation: float-2 25s ease-in-out infinite;
        }

        @keyframes float-1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-100px, 50px) scale(1.1); }
        }

        @keyframes float-2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(80px, -60px) scale(0.9); }
        }

        /* Hero Section */
        .archive-hero {
            padding: var(--space-xl) var(--space-lg);
            max-width: 1400px;
            margin: 0 auto;
            position: relative;
        }

        .archive-hero-content {
            display: grid;
            grid-template-columns: 1fr auto;
            align-items: center;
            gap: var(--space-lg);
            margin-bottom: var(--space-lg);
        }

        .archive-title-group h1 {
            font-family: var(--font-display);
            font-size: clamp(2.5rem, 5vw, 4.5rem);
            font-weight: 700;
            line-height: 1.1;
            color: var(--ink);
            margin-bottom: var(--space-sm);
            font-style: italic;
            letter-spacing: -0.02em;
        }

        .archive-title-group p {
            font-size: 1.25rem;
            color: var(--mid-gray);
            max-width: 600px;
            font-weight: 300;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: var(--space-md);
            background: white;
            padding: var(--space-lg);
            border-radius: 16px;
            box-shadow: var(--shadow-md);
            border: 1px solid var(--warm-gray);
        }

        .stat-card {
            text-align: center;
            position: relative;
        }

        .stat-card::after {
            content: '';
            position: absolute;
            right: 0;
            top: 10%;
            height: 80%;
            width: 1px;
            background: var(--warm-gray);
        }

        .stat-card:last-child::after {
            display: none;
        }

        .stat-number {
            font-family: var(--font-display);
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--primary-green);
            line-height: 1;
            margin-bottom: var(--space-xs);
        }

        .stat-label {
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--mid-gray);
            font-weight: 500;
        }

        /* Filters Section */
        .filters-container {
            max-width: 1400px;
            margin: 0 auto var(--space-xl);
            padding: 0 var(--space-lg);
        }

        .filters-card {
            background: white;
            border-radius: 20px;
            padding: var(--space-lg);
            box-shadow: var(--shadow-lg);
            border: 1px solid var(--warm-gray);
            position: relative;
            overflow: hidden;
        }

        .filters-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--primary-saffron), var(--primary-green), var(--primary-blue));
        }

        .search-bar {
            margin-bottom: var(--space-lg);
        }

        .search-input-wrapper {
            position: relative;
            max-width: 600px;
        }

        .search-input {
            width: 100%;
            padding: 1rem 1rem 1rem 3rem;
            font-size: 1.125rem;
            border: 2px solid var(--warm-gray);
            border-radius: 50px;
            font-family: var(--font-body);
            transition: all 0.3s ease;
            background: var(--off-white);
        }

        .search-input:focus {
            outline: none;
            border-color: var(--primary-blue);
            background: white;
            box-shadow: 0 0 0 4px rgba(0, 0, 128, 0.1);
        }

        .search-icon {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--mid-gray);
            pointer-events: none;
        }

        .filter-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: var(--space-md);
            margin-bottom: var(--space-md);
        }

        .filter-group label {
            display: block;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--mid-gray);
            margin-bottom: var(--space-xs);
            font-weight: 600;
        }

        .filter-select {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 2px solid var(--warm-gray);
            border-radius: 12px;
            font-family: var(--font-body);
            font-size: 0.95rem;
            background: white;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .filter-select:hover {
            border-color: var(--mid-gray);
        }

        .filter-select:focus {
            outline: none;
            border-color: var(--primary-blue);
            box-shadow: 0 0 0 3px rgba(0, 0, 128, 0.1);
        }

        .filter-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: var(--space-md);
            border-top: 1px solid var(--warm-gray);
        }

        .results-count {
            font-family: var(--font-display);
            font-size: 1.125rem;
            color: var(--charcoal);
        }

        .results-count strong {
            color: var(--primary-green);
            font-weight: 700;
        }

        .reset-button {
            padding: 0.75rem 2rem;
            background: var(--charcoal);
            color: white;
            border: none;
            border-radius: 50px;
            font-family: var(--font-body);
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.95rem;
        }

        .reset-button:hover {
            background: var(--ink);
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
        }

        /* Projects Grid */
        .projects-section {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 var(--space-lg) var(--space-xl);
        }

        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
            gap: var(--space-lg);
            animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Project Card */
        .project-card {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: var(--shadow-md);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid var(--warm-gray);
            display: flex;
            flex-direction: column;
            position: relative;
        }

        .project-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-saffron), var(--primary-green));
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.4s ease;
        }

        .project-card:hover {
            transform: translateY(-8px);
            box-shadow: var(--shadow-lg);
        }

        .project-card:hover::before {
            transform: scaleX(1);
        }

        .project-card-link {
            text-decoration: none;
            color: inherit;
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .project-thumbnail-wrapper {
            position: relative;
            height: 240px;
            overflow: hidden;
            background: linear-gradient(135deg, var(--warm-gray), var(--off-white));
        }

        .project-thumbnail {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .project-card:hover .project-thumbnail {
            transform: scale(1.08);
        }

        .project-thumbnail-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #E8E6E1 0%, #D1CFC9 100%);
            position: relative;
            overflow: hidden;
        }

        .project-thumbnail-placeholder::before {
            content: '📋';
            font-size: 4rem;
            opacity: 0.3;
        }

        .project-content {
            padding: var(--space-md);
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .project-title {
            font-family: var(--font-display);
            font-size: 1.5rem;
            font-weight: 700;
            line-height: 1.3;
            margin-bottom: var(--space-sm);
            color: var(--ink);
            font-style: italic;
        }

        .project-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: var(--space-md);
        }

        .project-badge {
            display: inline-block;
            padding: 0.35rem 0.85rem;
            font-size: 0.75rem;
            font-weight: 600;
            border-radius: 50px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            transition: all 0.2s ease;
        }

        .project-badge.category {
            background: rgba(255, 153, 51, 0.15);
            color: #CC7A29;
            border: 1px solid rgba(255, 153, 51, 0.3);
        }

        .project-badge.village {
            background: rgba(19, 136, 8, 0.15);
            color: #0F6B06;
            border: 1px solid rgba(19, 136, 8, 0.3);
        }

        .project-badge.year {
            background: rgba(0, 0, 128, 0.15);
            color: #000066;
            border: 1px solid rgba(0, 0, 128, 0.3);
        }

        .project-badge.status {
            font-weight: 700;
        }

        .project-badge.status-completed {
            background: rgba(5, 150, 105, 0.15);
            color: var(--status-complete);
            border: 1px solid rgba(5, 150, 105, 0.3);
        }

        .project-badge.status-progress {
            background: rgba(245, 158, 11, 0.15);
            color: var(--status-progress);
            border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .project-budget {
            font-family: var(--font-display);
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--primary-green);
            margin-bottom: var(--space-sm);
        }

        .project-excerpt {
            font-size: 0.95rem;
            line-height: 1.6;
            color: var(--charcoal);
            margin-top: auto;
        }

        /* Loading State */
        .loading-indicator {
            text-align: center;
            padding: var(--space-xl);
            font-family: var(--font-display);
            font-size: 1.5rem;
            color: var(--mid-gray);
            font-style: italic;
        }

        .loading-spinner {
            display: inline-block;
            width: 40px;
            height: 40px;
            border: 4px solid var(--warm-gray);
            border-top-color: var(--primary-green);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: var(--space-sm);
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Empty State */
        .no-projects {
            text-align: center;
            padding: var(--space-xl);
            background: white;
            border-radius: 16px;
            border: 2px dashed var(--warm-gray);
        }

        .no-projects p {
            font-family: var(--font-display);
            font-size: 1.5rem;
            color: var(--mid-gray);
            font-style: italic;
        }

        /* Pagination */
        .pagination {
            display: flex;
            justify-content: center;
            gap: var(--space-sm);
            margin-top: var(--space-xl);
            flex-wrap: wrap;
        }

        .pagination a,
        .pagination span {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 45px;
            height: 45px;
            padding: 0 1rem;
            background: white;
            border: 2px solid var(--warm-gray);
            border-radius: 12px;
            font-family: var(--font-body);
            font-weight: 600;
            color: var(--charcoal);
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .pagination a:hover {
            background: var(--primary-green);
            color: white;
            border-color: var(--primary-green);
            transform: translateY(-2px);
        }

        .pagination .current {
            background: var(--primary-blue);
            color: white;
            border-color: var(--primary-blue);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
            .archive-hero-content {
                grid-template-columns: 1fr;
            }

            .stats-grid {
                grid-template-columns: repeat(3, 1fr);
            }

            .projects-grid {
                grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            }
        }

        @media (max-width: 768px) {
            .archive-hero {
                padding: var(--space-lg) var(--space-md);
            }

            .archive-title-group h1 {
                font-size: 2.5rem;
            }

            .stats-grid {
                grid-template-columns: 1fr;
                gap: var(--space-md);
            }

            .stat-card::after {
                display: none;
            }

            .filter-grid {
                grid-template-columns: 1fr;
            }

            .projects-grid {
                grid-template-columns: 1fr;
                gap: var(--space-md);
            }

            .filter-actions {
                flex-direction: column;
                gap: var(--space-md);
                align-items: stretch;
            }

            .reset-button {
                width: 100%;
            }
        }
    </style>
</head>
<body>

<!-- Decorative Background -->
<div class="archive-background"></div>

<!-- Hero Section -->
<section class="archive-hero">
    <div class="archive-hero-content">
        <div class="archive-title-group">
            <h1>Constituency Projects</h1>
            <p>Development initiatives transforming Neyveli constituency for the welfare of our communities</p>
        </div>

        <div class="stats-grid">
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
                <div class="stat-label">Total Projects</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo count($completed_projects); ?></div>
                <div class="stat-label">Completed</div>
            </div>
<?php /* Total Investment stat card hidden */ ?>
        </div>
    </div>
</section>

<!-- Filters Section -->
<section class="filters-container">
    <div class="filters-card">
        <!-- Search Bar -->
        <div class="search-bar">
            <div class="search-input-wrapper">
                <svg class="search-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                    type="text"
                    id="search"
                    name="search"
                    class="search-input"
                    placeholder="Search projects by name, village, or description..."
                >
            </div>
        </div>

        <!-- Filter Grid -->
        <form id="project-filters" method="get">
            <div class="filter-grid">
                <!-- Village Filter -->
                <div class="filter-group">
                    <label for="filter-village">Village</label>
                    <select id="filter-village" name="village" class="filter-select">
                        <option value="">All Villages</option>
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
                    <label for="filter-category">Category</label>
                    <select id="filter-category" name="category" class="filter-select">
                        <option value="">All Categories</option>
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
                    <label for="filter-year">Year</label>
                    <select id="filter-year" name="year" class="filter-select">
                        <option value="">All Years</option>
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
                    <label for="filter-status">Status</label>
                    <select id="filter-status" name="status" class="filter-select">
                        <option value="">All Status</option>
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
            </div>

            <!-- Filter Actions -->
            <div class="filter-actions">
                <div class="results-count" id="projects-found">
                    <?php
                    $count = $total_projects->publish;
                    printf(
                        _n('<strong>%s</strong> project found', '<strong>%s</strong> projects found', $count, 'saba-rajendran'),
                        number_format_i18n($count)
                    );
                    ?>
                </div>
                <button type="button" id="reset-filters" class="reset-button">
                    Reset All Filters
                </button>
            </div>
        </form>
    </div>
</section>

<!-- Loading Indicator -->
<div id="loading-indicator" class="loading-indicator" style="display: none;">
    <div class="loading-spinner"></div>
    <p>Loading projects...</p>
</div>

<!-- Projects Section -->
<section class="projects-section">
    <div id="projects-grid" class="projects-grid">
        <?php
        if (have_posts()) {
            while (have_posts()) {
                the_post();
                ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class('project-card'); ?>>
                    <a href="<?php the_permalink(); ?>" class="project-card-link">
                        <div class="project-thumbnail-wrapper">
                            <?php
                            if (has_post_thumbnail()) {
                                the_post_thumbnail('medium', array('class' => 'project-thumbnail'));
                            } else {
                                echo '<div class="project-thumbnail-placeholder"></div>';
                            }
                            ?>
                        </div>

                        <div class="project-content">
                            <h2 class="project-title"><?php the_title(); ?></h2>

                            <div class="project-meta">
                                <?php
                                // Category
                                $categories = get_the_terms(get_the_ID(), 'project_category');
                                if ($categories && !is_wp_error($categories)) {
                                    foreach ($categories as $category) {
                                        printf(
                                            '<span class="project-badge category">%s</span>',
                                            esc_html($category->name)
                                        );
                                    }
                                }

                                // Village
                                $villages = get_the_terms(get_the_ID(), 'project_village');
                                if ($villages && !is_wp_error($villages)) {
                                    foreach ($villages as $village) {
                                        printf(
                                            '<span class="project-badge village">%s</span>',
                                            esc_html($village->name)
                                        );
                                        break;
                                    }
                                }

                                // Year
                                $years = get_the_terms(get_the_ID(), 'project_year');
                                if ($years && !is_wp_error($years)) {
                                    foreach ($years as $year) {
                                        printf(
                                            '<span class="project-badge year">%s</span>',
                                            esc_html($year->name)
                                        );
                                        break;
                                    }
                                }

                                // Status
                                $statuses = get_the_terms(get_the_ID(), 'project_status');
                                if ($statuses && !is_wp_error($statuses)) {
                                    foreach ($statuses as $status) {
                                        $status_class = '';
                                        if (in_array(strtolower($status->name), array('completed', 'physically completed'))) {
                                            $status_class = 'status-completed';
                                        } elseif (in_array(strtolower($status->name), array('in progress', 'underprogress'))) {
                                            $status_class = 'status-progress';
                                        }
                                        printf(
                                            '<span class="project-badge status %s">%s</span>',
                                            esc_attr($status_class),
                                            esc_html($status->name)
                                        );
                                        break;
                                    }
                                }
                                ?>
                            </div>

                            <?php
                            // Budget hidden
                            ?>

                            <?php if (has_excerpt()) : ?>
                                <div class="project-excerpt">
                                    <?php the_excerpt(); ?>
                                </div>
                            <?php endif; ?>
                        </div>
                    </a>
                </article>
                <?php
            }
        } else {
            ?>
            <div class="no-projects">
                <p>No projects found matching your criteria.</p>
            </div>
            <?php
        }
        ?>
    </div>

    <?php
    // Pagination
    global $wp_query;
    $pagination_links = paginate_links(array(
        'current' => max(1, get_query_var('paged')),
        'total' => $wp_query->max_num_pages,
        'prev_text' => '← Previous',
        'next_text' => 'Next →',
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
</section>

<script>
// Filter functionality
document.addEventListener('DOMContentLoaded', function() {
    const filters = document.querySelectorAll('.filter-select, #search');
    const resetButton = document.getElementById('reset-filters');

    // Add stagger animation to project cards
    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.05}s`;
    });

    // Reset filters
    resetButton.addEventListener('click', function() {
        document.getElementById('project-filters').reset();
        document.getElementById('search').value = '';
        // Trigger filter update
        window.location.href = window.location.pathname;
    });

    // Smooth scroll for better UX
    filters.forEach(filter => {
        filter.addEventListener('change', function() {
            // You can add AJAX filtering here
            console.log('Filter changed:', this.name, this.value);
        });
    });
});
</script>

</body>
</html>

<?php get_footer(); ?>
