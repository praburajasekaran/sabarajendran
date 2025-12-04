# Saba Rajendran Projects - New Requirements Breakdown

## Current Implementation Analysis

**Existing System:**
- WordPress backend with custom plugin `saba-projects` managing projects as custom post type
- React frontend consuming WordPress REST API
- Projects have: title, description, village, year, status, type, budget, images
- Multilingual support (English + Tamil)
- Existing filters: village, year, status, type, search
- Current pricing: ₹83,500 (includes ₹4,800 discount for QR code)

## New Requirements Breakdown

### 1. Featured Projects Carousel on Homepage
**Technical Components:**
- **WordPress Backend:**
  - Add "featured" flag to projects (new meta field `_project_featured`)
  - Update REST API to expose featured flag
  - Admin UI to toggle featured status

- **React Frontend:**
  - Create carousel component (e.g., using Swiper.js or custom implementation)
  - Add featured projects section to Home.tsx
  - Fetch and display 14-18 featured projects with images and descriptions
  - Responsive design for mobile/desktop

- **Database/Performance:**
  - Optimize query for featured projects
  - Cache featured projects separately

### 2. Three-Column Block Section on Homepage
**Technical Components:**
- **WordPress Backend:**
  - Add "block" taxonomy (NLC, Pandruity, Kurajapati)
  - Update existing projects with block assignments
  - REST API support for block filtering

- **React Frontend:**
  - Create three-column card component
  - Add block filtering to projects page
  - Implement click-to-filter functionality
  - Design card UI with block branding

### 3. Block Filter on Projects Page
**Technical Components:**
- **React Frontend:**
  - Extend existing filter system with block filter
  - Update filter UI with block options
  - Modify filter logic in Projects.tsx
  - Ensure URL state management for block filters

### 4. Kurinjipadi Block Projects Integration
**Technical Components:**
- **Data Processing:**
  - Extract data from 11 Tamil PDFs
  - Clean and structure project data
  - Translate Tamil content to English using Claude API

- **WordPress Backend:**
  - Import new projects via CSV/JSON
  - Assign to Kurinjipati block
  - Set appropriate categories, villages, etc.

- **API Integration:**
  - Claude API setup for translation
  - Batch processing for PDF content
  - Error handling for translation failures

### 5. Social Media Feeds Integration
**Technical Components:**
- **Research & Selection:**
  - Evaluate embed options (Facebook, Instagram, X)
  - Choose between widgets, API, or iframe solutions

- **Implementation:**
  - Social media widget component
  - Placement options (homepage, footer, sidebar)
  - Responsive design considerations
  - Privacy compliance

### 6. Remove Project Images (Replace with Icons)
**Technical Components:**
- **UI Changes:**
  - Modify ProjectCard.tsx to use icons instead of images
  - Update CSS/design for icon-based display
  - Ensure accessibility for icons

### 7. Dynamic WhatsApp Shareable Image
**Technical Components:**
- **Backend Service:**
  - Create image generation API endpoint
  - Design template for Panchayat/Village levels
  - Handle dynamic content (top 5-10 projects)

- **Frontend Integration:**
  - Add download/share buttons
  - Generate image on demand
  - Implement sharing functionality
  - Mobile/desktop compatibility

- **Technical Challenges:**
  - Server-side image generation (Node.js + Canvas)
  - Caching generated images
  - Performance optimization

### 8. MLA Welcome Video Embed
**Technical Components:**
- **Video Integration:**
  - Video upload and hosting solution
  - Responsive video player component
  - Homepage placement and design
  - Autoplay/mute considerations

### 9. Video Bytes Throughout Website
**Technical Components:**
- **Content Management:**
  - Video upload interface
  - Video categorization system
  - Storage solution (WordPress media or external)

- **Frontend Display:**
  - Video player component
  - Strategic placement across pages
  - Lazy loading for performance

### 10. Key Projects Showcase Page
**Technical Components:**
- **WordPress Backend:**
  - "Key project" flag/taxonomy
  - Admin interface for selection
  - REST API support

- **Frontend:**
  - New page component (KeyProjects.tsx)
  - Special layout for featured projects
  - Navigation integration
  - Design for 10 prominent projects

## Implementation Complexity Analysis

| Requirement | Complexity | Estimated Hours | Technical Risk |
|------------|------------|-----------------|----------------|
| 1. Featured Projects Carousel | Medium | 8-12 | Low |
| 2. Three-Column Block Section | Medium | 6-10 | Low |
| 3. Block Filter | Low | 4-6 | Low |
| 4. Kurinjipadi Projects + Translation | High | 12-18 | Medium (PDF parsing, API costs) |
| 5. Social Media Feeds | Medium | 6-8 | Medium (API limitations) |
| 6. Remove Images → Icons | Low | 2-4 | Low |
| 7. WhatsApp Image Generator | High | 12-20 | High (server-side rendering) |
| 8. MLA Video Embed | Low | 2-4 | Low |
| 9. Video Bytes | Medium | 8-12 | Low |
| 10. Key Projects Page | Medium | 6-10 | Low |

## Technical Dependencies

1. **Claude API Integration** - Required for Tamil→English translation
2. **PDF Processing** - Need library for Tamil PDF extraction
3. **Image Generation Service** - Server-side canvas/image library
4. **Social Media APIs** - May require OAuth setup
5. **Video Hosting** - Bandwidth considerations

## Risk Assessment

**High Risk Items:**
- WhatsApp image generation (server-side complexity)
- PDF data extraction (Tamil text processing)
- Claude API costs for bulk translation

**Medium Risk Items:**
- Social media feed reliability
- Performance with additional features

**Low Risk Items:**
- UI components (carousel, filters, cards)
- Video embedding
- Icon replacement