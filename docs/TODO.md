# Neyveli MLA Projects Website - Development TODO List

## Project Overview
Building a WordPress-based website to showcase MLA Saba Rajendran's constituency projects with filtering, bilingual support, and easy content management.

**Project Investment**: ₹85,000 (One-Time)
**Market Value**: ₹1,03,000
**You Save**: ₹18,000
**Target**: Launch within 2 weeks
**Domain**: sabarajendran.com (1 year included)
**Hosting**: 1 year professional web hosting (included)
**Training**: Dedicated training session for staff (included)
**Post-Launch Support**: 30 days technical support (included)
**Last Updated**: 2025-11-29

## Key Features (from Presentation)
1. **Interactive Project Showcase** - Responsive grid with instant filtering by Village, Category, Year, and Status (no page reload)
2. **Complete Bilingual Access** - Full Tamil/English support with simple toggle
3. **Effortless Content Management** - User-friendly admin panel for office staff

## What's Included

| Component | Market Value | Status |
|-----------|--------------|--------|
| Custom Excel import script | ₹15,000 | ✓ Included |
| Custom AJAX filtering system | ₹20,000 | ✓ Included |
| Bilingual implementation | ₹12,000 | ✓ Included |
| Custom theme development | ₹25,000 | ✓ Included |
| Image galleries & optimization | ₹8,000 | ✓ Included |
| Social sharing features | ₹5,000 | ✓ Included |
| Training & documentation | ₹8,000 | ✓ Included |
| 30 days post-launch support | ₹10,000 | ✓ Included |

---

## WEEK 1: Foundation & Core Functionality

### Milestone 1: WordPress Setup, Domain & Security (Day 1)
- [ ] Set up professional web hosting for sabarajendran.com
- [ ] Register domain sabarajendran.com (1 year included)
- [ ] Install WordPress with SSL certificate (Let's Encrypt)
- [ ] Install and configure security plugin (Wordfence)
- [ ] Configure basic security hardening

### Milestone 2: Theme & Branding Setup (Day 1-2)
- [ ] Install parent theme (Twenty Twenty-Four or GeneratePress)
- [ ] Create custom child theme 'saba-rajendran-child' with DMK branding (₹25,000 value)
- [ ] Configure typography with Tamil fonts via Google Fonts
- [ ] Add DMK logo and color scheme
- [ ] Set up responsive layouts for mobile/tablet/desktop

### Milestone 3: "Projects" Content Structure (Day 2)
- [ ] Install Custom Post Type UI plugin
- [ ] Install Advanced Custom Fields (ACF) plugin
- [ ] Create 'Projects' custom post type with slug 'project'
- [ ] Register taxonomies: project_category, project_village, project_year, project_status
- [ ] Configure ACF fields: Budget, Title (Tamil), Title (English), Description (Tamil), Description (English), Images
- [ ] Add 2-3 test projects manually to verify setup

### Milestone 4: Automated Excel Data Import (Day 2-3) - Custom Script ₹15,000 value
- [ ] Receive master Excel file with project data and images
- [ ] Convert Excel to CSV format
- [ ] Build custom PHP import script (import-projects.php) - reusable for future updates
- [ ] Test import with sample data
- [ ] Run full import script and verify all data imported correctly
- [ ] Verify images are properly uploaded to media library
- [ ] Test that taxonomies are correctly assigned

### Milestone 5: Live Project Grid & Filtering UI (Day 3-4)
- [ ] Create archive-project.php template for projects listing page
- [ ] Build responsive grid layout (works on desktop, tablet, mobile)
- [ ] Design project cards with: thumbnail, title, category badge, village, year, status
- [ ] Add filter bar UI with Village, Category, Year, Status dropdowns
- [ ] Add search functionality
- [ ] Implement pagination
- [ ] Ensure mobile-responsive design

### Milestone 6: Single Project View Template (Day 4)
- [ ] Create single-project.php template for individual project details
- [ ] Display hero image/gallery with lightbox
- [ ] Show project details: title, budget, category, village, year, status
- [ ] Add full description (bilingual)
- [ ] Add "Back to Projects" navigation
- [ ] Implement share buttons placeholder

---

**Week 1 Deliverable**: At the end of Week 1, you will have a working portal with all current projects live and filterable.

---

## WEEK 2: Polish & Public Launch

### Milestone 7: Real-Time AJAX Filtering (Day 5) - Custom Script ₹20,000 value
- [ ] Build custom AJAX filtering system (project-filters.js)
- [ ] Create AJAX handler in functions.php for filter requests
- [ ] Implement instant filtering without page reload by Village, Category, Year, Status
- [ ] Add loading states during filtering
- [ ] Update URL with filter parameters (for sharing filtered views)
- [ ] Show "X projects found" counter that updates live
- [ ] Test filtering with various combinations

### Milestone 8: Bilingual (Tamil/English) Integration (Day 5-6) - ₹12,000 value
- [ ] Install and configure Polylang plugin (free alternative to WPML)
- [ ] Configure Tamil (primary) and English (secondary) languages
- [ ] Translate UI strings (filter labels, buttons, navigation)
- [ ] Translate taxonomy terms (categories, villages, statuses)
- [ ] Translate static pages (Home, About, Contact if applicable)
- [ ] Add language switcher (TA | EN toggle) to header
- [ ] Test language switching - ensure all content switches instantly
- [ ] Verify bilingual project titles and descriptions display correctly

### Milestone 9: Image Galleries & Social Sharing (Day 6) - ₹13,000 value
- [ ] Implement image lightbox (GLightbox or custom solution) (₹8,000 value)
- [ ] Configure image lazy loading for performance
- [ ] Add social share functionality (WhatsApp, Facebook, Twitter buttons) (₹5,000 value)
- [ ] Test image galleries on mobile devices
- [ ] Implement Open Graph meta tags for social sharing
- [ ] Test social sharing preview on WhatsApp/Facebook

### Milestone 10: Performance Optimization & Testing (Day 6-7)
- [ ] Install and configure caching plugin (LiteSpeed Cache or WP Super Cache)
- [ ] Install and configure image optimization plugin (Smush)
- [ ] Optimize CSS and JavaScript files
- [ ] Run page speed tests (GTmetrix, PageSpeed Insights)
- [ ] Test all filtering functionality (category, village, year, status, search)
- [ ] Test bilingual language switching and content display
- [ ] Perform mobile responsiveness testing (phone, tablet)
- [ ] Perform cross-browser testing (Chrome, Safari, Firefox)
- [ ] Verify SSL certificate is working properly

### Milestone 11: SEO & Analytics Setup (Day 7)
- [ ] Install and configure SEO plugin (Yoast SEO or Rank Math)
- [ ] Configure meta descriptions for projects
- [ ] Generate and submit XML sitemap
- [ ] Set up Google Analytics tracking
- [ ] Configure Google Search Console
- [ ] Add social media meta tags

### Milestone 12: Final Testing & Launch (Day 7)
- [ ] Configure backup system (UpdraftPlus or ManageWP)
- [ ] Perform final comprehensive testing
- [ ] Check all links work correctly
- [ ] Verify all images load properly
- [ ] Test contact forms (if applicable)
- [ ] Create staff training documentation
- [ ] Conduct dedicated training session for office staff (₹8,000 value)
- [ ] Final launch checklist review and go live
- [ ] Submit site to search engines

---

**Week 2 Deliverable**: sabarajendran.com is live, optimized, and ready for public announcement.

---

## Payment Milestones

| Milestone | Amount | When |
|-----------|--------|------|
| 30% on Signing | ₹25,500 | To kick off development within 24 hours |
| 40% at Week 1 Completion | ₹34,000 | Upon delivery of core functionality |
| 30% at Launch | ₹25,500 | Once website is live and fully tested |

---

## Progress Tracker

**Total Tasks**: 45
**Completed**: 0
**In Progress**: 0
**Remaining**: 45

**Progress**: 0%

**Current Week**: Pre-Start
**Current Phase**: Awaiting Approval

---

## Custom Solutions (vs Paid Plugins)

| Functionality | Paid Plugin Approach | Our Custom Solution | Annual Savings |
|---------------|---------------------|---------------------|----------------|
| Bulk Project Import | WP All Import ($99 one-time) | Reusable PHP script (Included) | $99 |
| Real-Time Filtering | FacetWP ($99/year) | Custom AJAX system (Included) | $99/year |
| Bilingual Support | WPML ($39/year) | Free Polylang integration (Included) | $39/year |

**Total Savings**: ~$237 in the first year, ~$138 every year after

---

## Notes & Issues

### Development Notes
- Add notes here as you work through tasks
- Track any deviations from the original plan
- Document solutions to problems encountered

### Technical Decisions
- Document key technical choices made during development
- Note any plugin changes or alternatives used

### Staff Training Topics
- How to add new projects
- How to update project status
- How to upload and manage images
- How to use the bilingual features
- How to use filters and search

---

## Future Enhancements (Post-Launch)
- Map View: Interactive constituency map
- Analytics Dashboard: Project statistics and impact metrics
- User Submissions: Allow citizens to suggest/request projects
- Progress Tracking: Update project status with percentage completion
- Photo Gallery: Before/after photos of completed projects
- Newsletter: Email updates about new projects (MailChimp integration)
- Mobile App: Convert to PWA
- Admin Reports: Generate PDF reports by category/village

---

## Support & Ownership

**Full Ownership, No Lock-In**
- You own all custom code and entire digital asset
- We build platforms, not dependencies
- No vendor lock-in or recurring fees for core features

**Empowered Team, Easy Updates**
- Office staff trained to manage day-to-day content
- Portal stays current without developer costs
- Simple, intuitive admin interface

**30 Days Post-Launch Support** (₹10,000 value)
- Technical assistance for any issues
- Help with content updates
- Performance monitoring
- Bug fixes and adjustments

**Recurring Costs**
- Domain renewal: ₹500-1,000/year
- Hosting renewal: ₹2,000-5,000/year
- **No expensive plugin license fees**

---

## The Path to Launch

1. **Approval** - Confirm project scope and timeline
2. **Assets** - Provide master Excel file with project data and images
3. **Kickoff Payment** (₹25,500) - 30% upfront to secure resources and begin development
4. **Development & Review** - Daily progress updates
5. **Launch** - Portal goes live!

---

**Estimated Value Breakdown**

| What You Get | What It's Worth |
|--------------|-----------------|
| Custom development work | ₹85,000 |
| 1 year domain (sabarajendran.com) | ₹500-1,000 |
| 1 year professional hosting | ₹2,000-5,000 |
| Complete Excel import & setup | ✓ Included |
| Dedicated staff training | ✓ Included |
| 30 days post-launch support | ✓ Included |

**Total Investment**: ₹85,000 (One-time)
**Recurring Annual Cost**: ₹2,000-5,000 (domain + hosting only)
