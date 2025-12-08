# PHASE 2 BUILD PLAN
## Saba Rajendran Constituency Projects Website

**Created:** December 3, 2025
**Production Codebase:** `projects-frontend-react/` (Vite + React 18)
**Deployment:** Netlify
**Budget:** Rs. 80,000
**Timeline:** 8-10 weeks

---

## 🎯 PRODUCTION ENVIRONMENT CONFIRMED

### Active Codebase:
```
📂 /Applications/MAMP/htdocs/sabarajendran/projects-frontend-react/
```

### Technology Stack:
- **Frontend:** Vite 6.2.0 + React 18.3.1 + TypeScript 5.8.2
- **Styling:** Tailwind CSS 4.1.17
- **Backend:** WordPress REST API (port 8118)
- **AI:** Google Gemini API
- **Deployment:** Netlify
- **Caching:** IndexedDB (idb-keyval)
- **Routing:** React Router DOM 7.9.6

### Current Status:
- ✅ 826 projects imported
- ✅ Advanced filtering (5 criteria)
- ✅ Bilingual Tamil/English
- ✅ AI chatbot integrated
- ✅ Mobile responsive
- ✅ Netlify configured

---

## 📋 PHASE 2 FEATURES - PRIORITIZED ROADMAP

### SPRINT 1: Foundation (Week 1-2)
**Goal:** Set up block taxonomy and data infrastructure

#### Feature #8: Block Taxonomy (WordPress) 🔴
**Priority:** HIGHEST - Blocks features #9, #10, #11
**Effort:** 6-8 hours
**Location:** WordPress plugin

**Tasks:**
1. Add `project_block` taxonomy to `includes/taxonomies.php`
2. Create three terms: NLC, Panruti, Kurinjipadi
3. Update REST API exposure
4. Add admin UI for block assignment
5. Test API endpoint: `/wp/v2/project_block`

**Acceptance Criteria:**
- [ ] Block taxonomy appears in WordPress admin
- [ ] Can assign blocks to projects
- [ ] REST API returns block data
- [ ] Existing filters still work

**Files to Modify:**
- `/wp-content/plugins/saba-projects/includes/taxonomies.php`
- `/wp-content/plugins/saba-projects/includes/meta-boxes.php`

---

#### Feature #8b: Assign Blocks to 826 Existing Projects 🔴
**Priority:** HIGHEST
**Effort:** 4-6 hours (manual + script)
**Location:** WordPress admin

**Tasks:**
1. Create CSV mapping: project_id → block
2. Write bulk assignment script
3. Assign based on village/panchayat logic
4. Manual verification for edge cases

**Acceptance Criteria:**
- [ ] All 826 projects have block assigned
- [ ] Distribution verified (approx equal across 3 blocks)
- [ ] No projects missing block data

---

### SPRINT 2: Homepage Enhancements (Week 2-3)
**Goal:** Make homepage engaging with carousel and block cards

#### Feature #12: Featured Projects Carousel 🔴
**Priority:** HIGH
**Effort:** 10-14 hours
**Location:** `projects-frontend-react/pages/Home.tsx`

**Tasks:**
1. **WordPress Backend:**
   - Add `_project_featured` meta field
   - Create admin checkbox UI
   - Update REST API to include `featured` field

2. **React Frontend:**
   - Install Swiper.js: `npm install swiper`
   - Create `FeaturedCarousel.tsx` component
   - Fetch featured projects from API
   - Implement auto-play (5s interval)
   - Add touch/swipe gestures
   - Responsive: 1 slide (mobile), 2 (tablet), 3 (desktop)

3. **Homepage Integration:**
   - Add carousel section below hero
   - Style with DMK branding colors
   - Add "View All Projects" CTA

**Acceptance Criteria:**
- [ ] Can mark projects as featured in WordPress
- [ ] Carousel shows 10-15 featured projects
- [ ] Auto-play works (with pause on hover)
- [ ] Swipe gestures work on mobile
- [ ] Responsive across all devices
- [ ] Images lazy load

**Files to Create/Modify:**
- `wp-content/plugins/saba-projects/includes/meta-boxes.php`
- `projects-frontend-react/components/FeaturedCarousel.tsx`
- `projects-frontend-react/pages/Home.tsx`

---

#### Feature #9: Three Block Cards Section 🔴
**Priority:** HIGH
**Effort:** 6-8 hours
**Location:** `projects-frontend-react/pages/Home.tsx`

**Tasks:**
1. Create `BlockCard.tsx` component
2. Fetch block counts from API (use existing filter logic)
3. Design three cards:
   - NLC Block
   - Panruti Block
   - Kurinjipadi Block
4. Show project count per block
5. Click-to-filter: `/projects?block=nlc`
6. Responsive grid (1 col mobile, 3 col desktop)

**Acceptance Criteria:**
- [ ] Three cards displayed on homepage
- [ ] Correct project counts per block
- [ ] Clicking card navigates to filtered projects page
- [ ] Icons/images represent each block
- [ ] Responsive layout

**Files to Create/Modify:**
- `projects-frontend-react/components/BlockCard.tsx`
- `projects-frontend-react/pages/Home.tsx`

---

### SPRINT 3: Filtering Enhancement (Week 3-4)
**Goal:** Add block filter to projects page

#### Feature #10: Block Filter (Projects Page) 🔴
**Priority:** HIGH
**Effort:** 4-6 hours
**Location:** `projects-frontend-react/pages/Projects.tsx`

**Tasks:**
1. Add block to `FilterState` interface
2. Create block dropdown in filter panel
3. Update `filterProjects()` logic to include block
4. Add block to URL state: `?block=kurinjipadi`
5. Show block in active filters chips
6. Update filter counts to include block

**Acceptance Criteria:**
- [ ] Block dropdown appears in filter panel
- [ ] Filtering by block works correctly
- [ ] Can combine block with other filters
- [ ] URL updates with block parameter
- [ ] Active filter chip shows selected block
- [ ] Count shows projects per block

**Files to Modify:**
- `projects-frontend-react/pages/Projects.tsx`
- `projects-frontend-react/types.ts`

---

### SPRINT 4: Data Import (Week 4-5)
**Goal:** Import Kurinjipadi PDF data

#### Feature #11: Kurinjipadi Block Projects Import 🔴
**Priority:** HIGH
**Effort:** 12-16 hours
**Location:** `/docs/kurinjipadi-block-projects/`

**Tasks:**
1. **Extract Data from 11 PDFs:**
   - Manual extraction or OCR
   - Parse Tamil text
   - Structure into CSV format

2. **Translation:**
   - Use Gemini API to translate Tamil → English
   - Batch process with rate limiting
   - Manual QA for accuracy

3. **Import:**
   - Use existing `import-projects.php` script
   - Assign all to "Kurinjipadi" block
   - Verify taxonomy assignments

4. **Validation:**
   - Check project count increase
   - Verify data quality
   - Test filtering by Kurinjipadi block

**Acceptance Criteria:**
- [ ] All projects from 11 PDFs imported
- [ ] Tamil and English content present
- [ ] Assigned to Kurinjipadi block
- [ ] No duplicate projects
- [ ] Data quality verified

**Deliverables:**
- CSV file with extracted data
- Translation log/audit trail
- Import success report

---

### SPRINT 5: Translation System (Week 5-6)
**Goal:** Automate translation for future content

#### Feature #17: Automated Translation Pipeline 🔴
**Priority:** HIGH
**Effort:** 12-16 hours
**Location:** New service + WordPress integration

**Tasks:**
1. **Translation Service:**
   - Create `translationService.ts` using Gemini API
   - Batch translation function
   - Tamil ↔ English support
   - Caching mechanism

2. **WordPress Integration:**
   - Add "Translate" button in project edit screen
   - AJAX endpoint for translation
   - Progress indicator
   - Error handling

3. **Batch Translation:**
   - Script to translate all 826+ projects
   - Rate limiting (avoid API quota)
   - Manual review queue

4. **Quality Control:**
   - Review translated content
   - Allow manual overrides
   - Flag low-confidence translations

**Acceptance Criteria:**
- [ ] Can translate individual projects from WordPress admin
- [ ] Batch translation script works
- [ ] Translations cached to avoid re-translation
- [ ] Manual override capability
- [ ] Error logging and reporting

**Files to Create/Modify:**
- `projects-frontend-react/services/translationService.ts`
- `wp-content/plugins/saba-projects/includes/translation.php`
- `wp-content/plugins/saba-projects/assets/js/translation-admin.js`

---

### SPRINT 6: Video Features (Week 6-7)
**Goal:** Add MLA video and video management

#### Feature #14: MLA Welcome Video 🔴
**Priority:** HIGH
**Effort:** 4-6 hours
**Location:** `projects-frontend-react/pages/Home.tsx`

**Tasks:**
1. **WordPress:**
   - Add custom field for video URL (YouTube/Vimeo/self-hosted)
   - Settings page for MLA video

2. **React:**
   - Create `VideoPlayer.tsx` component
   - Add to homepage (below hero or in section)
   - Lazy loading (intersection observer)
   - Responsive sizing
   - Muted autoplay option

**Acceptance Criteria:**
- [ ] Video plays on homepage
- [ ] Controls work (play/pause/volume)
- [ ] Lazy loads when scrolled into view
- [ ] Responsive on mobile/tablet/desktop
- [ ] Supports YouTube, Vimeo, self-hosted

**Files to Create/Modify:**
- `projects-frontend-react/components/VideoPlayer.tsx`
- `projects-frontend-react/pages/Home.tsx`
- WordPress settings page

---

#### Feature #15: Video Management System 🟡
**Priority:** MEDIUM
**Effort:** 10-14 hours
**Location:** WordPress + React components

**Tasks:**
1. WordPress video management
2. Reusable video player component
3. Modal/lightbox for videos
4. Strategic placement across pages

**Acceptance Criteria:**
- [ ] Can upload/manage videos in WordPress
- [ ] Videos display throughout site
- [ ] Modal player works
- [ ] Lazy loading implemented

---

### SPRINT 7: WhatsApp Integration (Week 7-8) ⭐
**Goal:** Build viral sharing capability

#### Feature #19: WhatsApp Shareable Image Generator 🔴
**Priority:** HIGHEST - Unique feature
**Effort:** 18-24 hours
**Location:** New backend service + React integration

**Tasks:**
1. **Backend Service (Node.js or PHP):**
   - Image generation endpoint
   - Use Sharp (Node) or GD (PHP)
   - Template: 1080x1080px
   - Dynamic content rendering
   - Tamil text support

2. **Templates:**
   - Panchayat level: Top 10 projects
   - Village level: Top 5-10 projects
   - Include MLA photo, DMK branding

3. **React Integration:**
   - "Share on WhatsApp" button
   - Download image button
   - Preview modal
   - Web Share API

4. **Caching:**
   - Cache generated images
   - Regenerate on data change
   - CDN integration

**Acceptance Criteria:**
- [ ] Can generate image for panchayat level
- [ ] Can generate image for village level
- [ ] Download button works
- [ ] WhatsApp share opens with image
- [ ] Tamil text renders correctly
- [ ] MLA photo and branding included
- [ ] Images cached for performance

**Files to Create:**
- `backend/image-generator/` (new service)
- `projects-frontend-react/components/WhatsAppShareButton.tsx`
- `projects-frontend-react/components/ShareImagePreview.tsx`

---

### SPRINT 8: Social Media & Key Projects (Week 8-9)
**Goal:** Complete remaining features

**Note:** QR Codes (Feature #7) already completed via ElkQR service - no development needed.

#### Feature #21: Social Media Feeds Widget 🔴
**Priority:** HIGH
**Effort:** 4-6 hours
**Location:** Homepage/Footer

**Tasks:**
1. Purchase Elfsight subscription ($9/month)
2. Configure 3 widgets (Facebook, Instagram, Twitter)
3. Get embed codes
4. Add to React components
5. Style to match site

**Acceptance Criteria:**
- [ ] Elfsight account active
- [ ] 3 widgets configured
- [ ] Feeds displaying on site
- [ ] Responsive styling
- [ ] Matches DMK branding

---

#### Feature #16: Key Projects Showcase Page 🔴
**Priority:** HIGH
**Effort:** 8-12 hours
**Location:** New page `/key-projects`

**Tasks:**
1. WordPress "key project" meta field
2. Create `KeyProjects.tsx` page component
3. Large card layout for 10 projects
4. Navigation link
5. SEO optimization

**Acceptance Criteria:**
- [ ] Can mark projects as "key projects"
- [ ] Page shows 10 key projects
- [ ] Large images and detailed descriptions
- [ ] SEO meta tags configured
- [ ] Navigation link in header

---

#### Feature #7: QR Code Generation ✅
**Priority:** N/A (Already Complete!)
**Effort:** 0 hours (External service)
**Location:** ElkQR Service

**Status: COMPLETED via ElkQR Service**

✅ QR codes created and shared with client
✅ Managed via ElkQR platform (external service)
✅ Destination links updateable via ElkQR dashboard
✅ No development work required

**Service Details:**
- Provider: ElkQR
- Cost: Rs. 4,800 (Phase 1)
- Management: Via ElkQR app/dashboard

**No Tasks Required - Feature Complete**

---

### SPRINT 9: Testing & Optimization (Week 9-10)
**Goal:** Production-ready deployment

#### Tasks:
1. **Cross-Browser Testing**
   - Chrome, Safari, Firefox, Edge
   - Mobile browsers (iOS, Android)

2. **Performance Optimization**
   - Lighthouse audit (target 90+)
   - Image optimization
   - Code splitting
   - Bundle size optimization

3. **SEO Optimization**
   - Meta tags for all pages
   - Open Graph images
   - Structured data (JSON-LD)
   - Sitemap generation

4. **Mobile Responsiveness**
   - Test all screen sizes
   - Touch gestures
   - Keyboard navigation

5. **Production Deployment**
   - Environment variables in Netlify
   - Domain configuration
   - SSL setup
   - Performance monitoring

6. **Documentation**
   - Admin training guide
   - User manual
   - Video tutorials (optional)

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-Deployment:
- [ ] All Phase 2 features implemented and tested
- [ ] WordPress API URL updated to production
- [ ] CORS configured for production domain
- [ ] Environment variables set in Netlify
- [ ] Lighthouse score 90+
- [ ] Cross-browser testing passed
- [ ] Mobile testing passed
- [ ] Client approval received

### Netlify Configuration:
```bash
# Environment Variables
VITE_WP_API_URL=https://yourdomain.com/wp-json/wp/v2
VITE_GEMINI_API_KEY=your_api_key_here
VITE_SITE_URL=https://yourdomain.com
```

### Deployment:
- [ ] Push to main branch (auto-deploy)
- [ ] Verify build succeeds
- [ ] Test deployed site
- [ ] Configure custom domain
- [ ] SSL certificate active
- [ ] Monitor error logs

### Post-Deployment:
- [ ] Client training session
- [ ] 30-day support period begins
- [ ] Monitor analytics
- [ ] Gather user feedback

---

## 📊 PROGRESS TRACKING

### Feature Completion Status:

| Sprint | Features | Status | Progress |
|--------|----------|--------|----------|
| Sprint 1 | Block Taxonomy (#8) | ❌ Not Started | 0% |
| Sprint 2 | Carousel (#12), Block Cards (#9) | ❌ Not Started | 0% |
| Sprint 3 | Block Filter (#10) | ❌ Not Started | 0% |
| Sprint 4 | Kurinjipadi Import (#11) | ❌ Not Started | 0% |
| Sprint 5 | Translation (#17) | ❌ Not Started | 0% |
| Sprint 6 | Videos (#14, #15) | ❌ Not Started | 0% |
| Sprint 7 | WhatsApp (#19) | ❌ Not Started | 0% |
| Sprint 8 | Social, Key Projects (#21, #16, #7) | ❌ Not Started | 0% |
| Sprint 9 | Testing & Deployment | ❌ Not Started | 0% |

**Overall Phase 2 Progress:** 0%

---

## 💰 BUDGET TRACKING

**Total Phase 2 Budget:** Rs. 80,000

**By Feature Category:**
- Foundation (Block Taxonomy): Rs. 7,000
- Homepage Features: Rs. 8,000
- Translation System: Rs. 6,000
- Video Features: Rs. 5,000
- WhatsApp Generator: Rs. 15,000
- Social Media: Rs. 16,000 (includes Elfsight)
- Key Projects Page: Rs. 5,500
- QR Codes: Rs. 4,800
- Testing & Deployment: Rs. 6,500
- Integration: Rs. 6,200

---

## 📝 DEVELOPMENT WORKFLOW

### Daily Workflow:
1. Pull latest from git
2. Check todo list
3. Work on current sprint features
4. Test locally (http://localhost:5173)
5. Test with WordPress API (localhost:8888)
6. Commit with descriptive messages
7. Push to git (triggers Netlify build)

### Testing Workflow:
1. Test in local dev environment
2. Test with real WordPress data (826 projects)
3. Test mobile responsive
4. Test bilingual switching
5. Check browser console for errors
6. Lighthouse audit
7. Deploy to Netlify preview
8. Client review
9. Merge to production

### Git Workflow:
```bash
# Feature branch
git checkout -b feature/block-taxonomy
# ... work on feature ...
git add .
git commit -m "feat: add block taxonomy to WordPress"
git push origin feature/block-taxonomy

# After testing, merge to main
git checkout main
git merge feature/block-taxonomy
git push origin main
# Netlify auto-deploys
```

---

## 🎯 SUCCESS CRITERIA

Phase 2 will be considered complete when:

1. ✅ All 15 Phase 2 features implemented
2. ✅ Block taxonomy working (3 blocks)
3. ✅ Featured carousel on homepage (10-15 projects)
4. ✅ WhatsApp image generator functional
5. ✅ Translation system working
6. ✅ All videos playing correctly
7. ✅ Social media feeds integrated
8. ✅ Kurinjipadi data imported
9. ✅ Site deployed to production (Netlify)
10. ✅ Lighthouse score 90+
11. ✅ Cross-browser tested
12. ✅ Client trained
13. ✅ Documentation complete

---

## 📞 NEXT STEPS

**Immediate Action Required:**
1. Start with Sprint 1: Block Taxonomy
2. Set up development environment
3. Test WordPress API access
4. Review this build plan with client
5. Get approval to proceed

**Ready to start building?**
Let's begin with Feature #8: Block Taxonomy! 🚀

---

**Build Plan Created:** December 3, 2025
**Status:** Ready for Implementation
**Next Sprint:** Sprint 1 - Block Taxonomy
