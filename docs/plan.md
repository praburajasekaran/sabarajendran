# Implementation Plan: Neyveli MLA Projects Showcase Website

## Project Overview

Build a WordPress-based website to showcase MLA Saba Rajendran's constituency projects with filtering, bilingual support, and easy content management.

**Goal**: Launch within 1-2 weeks with full functionality.

**Deployment**: sabarajendran.com with projects accessible via custom page/post type

## Technical Stack (WordPress Approach)

- **CMS**: WordPress 6.x
- **Hosting**: Shared hosting (Bluehost, SiteGround) or Managed WP (WP Engine, Kinsta)
- **Theme**: Block-based theme (Twenty Twenty-Four) or custom child theme
- **Custom Post Type**: "Projects" with custom fields
- **Filtering**: Custom AJAX filtering with jQuery/vanilla JS
- **Bilingual**: Polylang (free) or custom language switcher
- **Images**: WordPress media library with lazy loading
- **Page Builder**: Gutenberg blocks (native)
- **Import**: Custom PHP script for Excel/CSV → WordPress

## WordPress Structure

```
sabarajendran.com/
├── wp-content/
│   ├── themes/
│   │   └── saba-rajendran-child/      # Custom child theme
│   │       ├── style.css
│   │       ├── functions.php
│   │       ├── templates/
│   │       │   ├── archive-project.php   # Projects listing page
│   │       │   ├── single-project.php    # Individual project view
│   │       │   └── taxonomy-*.php        # Category/village archives
│   │       ├── assets/
│   │       │   ├── css/custom.css
│   │       │   ├── js/filters.js
│   │       │   └── images/dmk-logo.svg
│   ├── plugins/
│   │   ├── projects-cpt/              # Custom plugin for Projects CPT
│   │   │   ├── projects-cpt.php
│   │   │   └── includes/
│   │   │       ├── post-type.php
│   │   │       ├── taxonomies.php
│   │   │       └── meta-boxes.php
│   │   ├── polylang/                  # Bilingual support
│   │   ├── wp-all-import/             # Excel import
│   │   └── facet-wp/                  # Filtering (optional premium)
│   └── uploads/
│       └── projects/                  # Project images
└── Custom Post Type: "Projects"
    - Taxonomies: Category, Village, Year, Status
    - Meta Fields: Budget, Description (TA/EN), Images
```

## Implementation Phases

### Phase 1: WordPress Setup & Core Functionality (Week 1)

#### 1. WordPress Installation & Hosting Setup (Day 1)
- Purchase domain: sabarajendran.com
- Choose hosting provider (Bluehost/SiteGround for budget, WP Engine for performance)
- Install WordPress via cPanel or hosting dashboard
- SSL certificate setup (Let's Encrypt)
- Basic security hardening (Wordfence plugin)

#### 2. Theme Setup (Day 1)
- Install parent theme (Twenty Twenty-Four or GeneratePress)
- Create child theme: `saba-rajendran-child`
- Add DMK branding colors and logo to customizer
- Configure typography (add Tamil fonts via Google Fonts)

#### 3. Custom Post Type: "Projects" (Day 2)
**Option A: Custom Plugin (Recommended)**
- Create custom plugin: `projects-cpt`
- Register post type: "Projects" (slug: `project`)
- Register taxonomies:
  - `project_category` (Education, Infrastructure, Health, Water, etc.)
  - `project_village` (Block 1, Block 2, Neyveli, etc.)
  - `project_year` (2021, 2022, 2023, 2024)
  - `project_status` (Completed, Ongoing, Planned)
- Add custom meta fields using Advanced Custom Fields (ACF) plugin:
  - Budget (number)
  - Title (Tamil) - text
  - Title (English) - text
  - Description (Tamil) - wysiwyg
  - Description (English) - wysiwyg
  - Project Images (gallery)

**Option B: Use Plugin (Faster)**
- Install "Custom Post Type UI" plugin
- Install "Advanced Custom Fields" (ACF) plugin
- Configure via WordPress admin

#### 4. Data Import (Day 2-3)
**Custom Import Script** (`wp-content/themes/saba-rajendran-child/import-projects.php`):
- Convert Excel to CSV first (Excel → Save As CSV)
- Create custom PHP script to:
  - Read CSV file
  - Create posts with `wp_insert_post()`
  - Assign taxonomies (category, village, year, status)
  - Add custom fields via ACF functions
  - Download and attach images from URLs or local folder
- Run script via WP CLI or browser (with authentication)
- Verify imported data
- Script is reusable for future bulk updates

**Alternative**: Use free CSV Importer plugin for basic import, then custom script for complex fields

#### 5. Projects Listing Page (Day 3-4)
**Create Archive Template** (`archive-project.php`):
- Grid layout (CSS Grid or Flexbox)
- Display: Thumbnail, Title, Category badge, Village, Year
- Pagination
- Responsive design (1/2/3/4 columns)

**Filter Bar:**
- Category filter (taxonomy links or AJAX)
- Village dropdown
- Year dropdown
- Search bar (native WordPress search)

**Filtering Implementation (Custom AJAX):**
- Create `assets/js/project-filters.js`:
  - Listen to filter change events (category, village, year clicks)
  - Build query parameters
  - Make AJAX request to custom endpoint
  - Update project grid without page reload
  - Update URL with history.pushState()
- Create AJAX handler in `functions.php`:
  - Custom WP_Query based on filter parameters
  - Return JSON with matching projects
  - Include pagination data
- Show loading state while filtering
- "X projects found" count updates live

#### 6. Single Project View (Day 4)
**Create Single Template** (`single-project.php`):
- Hero image/gallery (lightbox with GLightbox or similar)
- Project title (bilingual based on language selection)
- Budget display
- Category, Village, Year, Status badges
- Full description
- Share buttons (WhatsApp, Facebook, Twitter)
- "Back to Projects" link

### Phase 2: Bilingual Support & Polish (Week 2)

#### 1. Bilingual Setup (Day 5-6)
**Option A: Polylang (Free)**
- Install Polylang plugin
- Configure languages: Tamil (primary), English (secondary)
- Translate:
  - UI strings (filter labels, buttons, etc.)
  - Project categories, villages (taxonomy terms)
  - Static pages (Home, About, Contact)
- Language switcher in header
- Each project post has Tamil/English versions or uses ACF bilingual fields

**Option B: WPML (Premium, $39+)**
- More features, better for complex sites
- Automatic translation integration

#### 2. Advanced Custom Filtering (Day 6)
**JavaScript (`project-filters.js`):**
```javascript
// Listen to filter clicks
jQuery('.filter-category, .filter-village, .filter-year').on('click', function(e) {
    e.preventDefault();
    let category = jQuery('.filter-category.active').data('slug');
    let village = jQuery('.filter-village.active').data('slug');
    let year = jQuery('.filter-year.active').data('slug');

    // Show loading
    jQuery('.projects-grid').addClass('loading');

    // AJAX request
    jQuery.ajax({
        url: wpAjax.ajaxurl,
        type: 'POST',
        data: {
            action: 'filter_projects',
            category: category,
            village: village,
            year: year
        },
        success: function(response) {
            jQuery('.projects-grid').html(response.html);
            jQuery('.project-count').text(response.count + ' projects found');
            // Update URL
            history.pushState(null, '', '?category=' + category + '&village=' + village);
        }
    });
});
```

**PHP (`functions.php`):**
```php
add_action('wp_ajax_filter_projects', 'filter_projects_ajax');
add_action('wp_ajax_nopriv_filter_projects', 'filter_projects_ajax');

function filter_projects_ajax() {
    $args = array(
        'post_type' => 'project',
        'posts_per_page' => -1,
        'tax_query' => array('relation' => 'AND')
    );

    if (!empty($_POST['category'])) {
        $args['tax_query'][] = array(
            'taxonomy' => 'project_category',
            'field' => 'slug',
            'terms' => $_POST['category']
        );
    }

    // Add village, year filters similarly

    $query = new WP_Query($args);

    ob_start();
    // Loop through posts and generate HTML
    while ($query->have_posts()) {
        $query->the_post();
        get_template_part('template-parts/project-card');
    }
    $html = ob_get_clean();

    wp_send_json(array(
        'html' => $html,
        'count' => $query->found_posts
    ));
}
```

#### 3. Enhanced UX (Day 7)
- **Share Functionality:**
  - Add share buttons to single project page
  - WhatsApp share (mobile-friendly)
  - Copy link button
  - Social meta tags (Open Graph, Twitter Cards)

- **Village Selector Prompt:**
  - Modal/popup on first visit: "Select your village to see relevant projects"
  - Remember selection in cookie/localStorage

- **Project Images:**
  - Lightbox for image galleries (GLightbox or Elementor Lightbox)
  - Lazy loading (use WordPress native or plugin)

#### 4. Performance & SEO (Day 7)
- Install caching plugin (WP Rocket, W3 Total Cache, or LiteSpeed Cache)
- Image optimization (Smush or ShortPixel)
- SEO plugin (Yoast SEO or Rank Math)
- Configure meta descriptions for projects
- XML sitemap generation
- Mobile responsiveness testing

#### 5. Final Testing & Launch
- Test all filters
- Test bilingual switching
- Test on mobile devices
- Check page speed (GTmetrix, PageSpeed Insights)
- Set up Google Analytics
- Launch!

## Required Plugins (All FREE)

### Essential (Phase 1)
1. **Custom Post Type UI** - Create Projects post type (FREE)
2. **Advanced Custom Fields (ACF) Free** - Custom fields for budget, descriptions, etc.
3. **Wordfence** - Security (FREE)
4. **UpdraftPlus** - Backups (FREE)

### Recommended (Phase 2)
5. **Polylang** - Bilingual support (FREE)
6. **LiteSpeed Cache** - Caching & performance (FREE) or WP Super Cache
7. **Smush** - Image optimization (FREE version sufficient)
8. **Yoast SEO** - SEO optimization (FREE)

### Optional
9. **Contact Form 7** - Simple contact forms (FREE)
10. **Really Simple SSL** - SSL management (FREE)

## Custom Scripts to Build (Replace Paid Plugins)

### 1. Excel Import Script (`import-projects.php`)
**Replaces**: WP All Import ($99)
**Function**: Bulk import projects from CSV/Excel
**Effort**: 2-3 hours
**Code**: PHP script using `wp_insert_post()` and `wp_set_object_terms()`

### 2. AJAX Filtering System (`project-filters.js` + PHP handlers)
**Replaces**: FacetWP ($99/year)
**Function**: Real-time filtering without page reload
**Effort**: 3-4 hours
**Code**: jQuery AJAX + custom REST API endpoint

### 3. Custom Lightbox (`lightbox.js`)
**Replaces**: Paid lightbox plugins
**Function**: Image gallery popup
**Effort**: 1-2 hours
**Code**: Vanilla JS or use free library like GLightbox

### 4. Share Functionality (`share-buttons.js`)
**Replaces**: Share plugins
**Function**: Social sharing buttons
**Effort**: 1 hour
**Code**: Native Web Share API + fallback buttons

### 5. Lazy Loading (built into WordPress 5.5+)
**Replaces**: Lazy load plugins
**Function**: Defer image loading
**Effort**: 0 hours (WordPress native)
**Code**: Add `loading="lazy"` attribute (automatic)

## Step-by-Step Implementation

### Day 1: Foundation
1. Register domain sabarajendran.com
2. Set up hosting account
3. Install WordPress
4. Install SSL certificate
5. Choose and install parent theme
6. Create child theme
7. Add DMK logo and branding

### Day 2: Content Structure
1. Install ACF and Custom Post Type UI plugins
2. Create "Projects" custom post type
3. Create taxonomies: Category, Village, Year, Status
4. Configure ACF fields (Budget, Titles, Descriptions)
5. Add some test projects manually

### Day 3: Data Import (Custom Script)
1. Convert Excel to CSV format
2. Write custom import script `import-projects.php`:
   - Parse CSV with `fgetcsv()`
   - Loop through rows
   - Create posts with `wp_insert_post()`
   - Assign taxonomies with `wp_set_object_terms()`
   - Add ACF fields with `update_field()`
   - Handle images (download/upload to media library)
3. Run script via browser or WP-CLI
4. Verify imported data
5. Fix any import issues
6. Save script for future bulk updates

### Day 4: Templates & Display
1. Create `archive-project.php` template
2. Build grid layout with CSS
3. Display project cards
4. Create `single-project.php` template
5. Add project details display
6. Add basic filter bar (category/village links)

### Day 5-6: Bilingual
1. Install Polylang plugin
2. Configure Tamil & English
3. Translate taxonomy terms
4. Add language switcher
5. Test language switching

### Day 7: Polish & Launch
1. Implement custom AJAX filtering
2. Add image lightbox (GLightbox or custom)
3. Implement share buttons (Web Share API)
4. Performance optimization (caching, minification)
5. Mobile testing
6. Final launch!

## Testing Checklist

### Core Functionality
- [ ] WordPress installed and accessible
- [ ] Projects post type visible in admin
- [ ] All Excel data imported successfully
- [ ] Project images display correctly
- [ ] Archive page shows all projects in grid
- [ ] Single project page displays all details
- [ ] Filtering by category works
- [ ] Filtering by village works
- [ ] Filtering by year works
- [ ] Search functionality works

### Bilingual (Phase 2)
- [ ] Language switcher appears in header
- [ ] Tamil and English versions exist
- [ ] Taxonomy terms translated
- [ ] Content displays in correct language
- [ ] URLs work for both languages

### User Experience
- [ ] Mobile responsive (phone, tablet)
- [ ] Images lazy load
- [ ] Page loads quickly (< 3 seconds)
- [ ] Share buttons work
- [ ] Lightbox opens for images
- [ ] Filters update immediately
- [ ] No broken links
- [ ] Contact information visible

### Technical
- [ ] SSL certificate active (https://)
- [ ] Site backed up
- [ ] Security plugin configured
- [ ] Caching enabled
- [ ] SEO meta tags set
- [ ] Google Analytics installed
- [ ] Cross-browser testing (Chrome, Safari, Firefox)

## Key Advantages of WordPress Approach

| Advantage | Benefit |
|-----------|---------|
| **Fast Setup** | Can be live in 1-2 weeks vs 4-6 weeks for React |
| **Easy Updates** | Non-technical staff can add projects via admin panel |
| **No Coding Required** | Content updates don't require developer |
| **Built-in Admin** | User management, roles, permissions out of the box |
| **Excel Import** | Direct import from Excel via plugin |
| **Plugins Ecosystem** | 60,000+ plugins for any feature needed |
| **SEO-Friendly** | WordPress is inherently SEO-optimized |
| **Hosting Options** | Many affordable hosting providers |
| **Community Support** | Huge community, easy to find help |
| **Future-Proof** | Easy to migrate or enhance later |

## Cost Estimate

| Item | Cost | Notes |
|------|------|-------|
| Domain (sabarajendran.com) | $10-15/year | GoDaddy, Namecheap |
| Hosting (Bluehost/SiteGround) | $36-120/year | Shared hosting sufficient |
| SSL Certificate | Free | Let's Encrypt (included in hosting) |
| WordPress | Free | Open source |
| Theme | Free | Twenty Twenty-Four or GeneratePress |
| All Plugins | Free | Using free versions only |
| Custom Development | 10-15 hours | Internal dev time |
| **Total Year 1** | **$46-135** | One-time setup |
| **Recurring Annual** | **$46-135** | Just domain + hosting |

**Savings vs Paid Plugins Approach:**
- WP All Import: $99 saved (using custom script)
- FacetWP: $99/year saved (custom AJAX filtering)
- WPML: $39/year saved (using free Polylang)
- **Total Savings: ~$237 first year, ~$138/year ongoing**

## Post-Launch Enhancements (Optional)

- **Map View**: Add interactive constituency map (using plugins like WP Google Maps or custom SVG)
- **Analytics Dashboard**: Show project statistics and impact metrics
- **User Submissions**: Allow citizens to suggest/request projects
- **Progress Tracking**: Update project status with percentage completion
- **Photo Gallery**: Showcase before/after photos of completed projects
- **Newsletter**: Email updates about new projects (MailChimp integration)
- **Mobile App**: Convert to PWA or native app wrapper
- **Admin Reports**: Generate PDF reports of projects by category/village

---

**Estimated Timeline**: 1-2 weeks for full launch (WordPress) vs 4-6 weeks (React approach)

**Recommendation**: WordPress is ideal for this project given the priority on speed to launch and mixed technical team. React approach is better if you need highly custom interactions or plan to build a larger platform with complex features.
