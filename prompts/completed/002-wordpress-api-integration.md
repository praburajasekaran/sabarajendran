<objective>
Build a robust WordPress REST API integration layer for fetching projects data from the headless WordPress backend. This will include TypeScript types, API client functions, error handling, and caching strategies for optimal performance.

This integration enables the Next.js frontend to seamlessly fetch and display constituency project data with proper type safety and performance optimization.
</objective>

<context>
WordPress REST API endpoints available at http://localhost:8118/sabarajendran/wp-json/wp/v2/:
- `/project` - Projects custom post type
- `/project_category` - Project categories taxonomy
- `/project_village` - Villages taxonomy
- `/project_year` - Years taxonomy
- `/project_status` - Status taxonomy (Completed, Ongoing, Planned)
- `/project_scheme` - Schemes taxonomy

The Saba Projects plugin exposes these endpoints with full REST API support (show_in_rest: true).

Next.js 15 features to leverage:
- Server Components for data fetching
- Route Handlers for API proxying if needed
- React Server Components caching
- Incremental Static Regeneration (ISR)
</context>

<requirements>
1. Create comprehensive TypeScript interfaces for all WordPress data structures:
   - Project (id, title, content, excerpt, featured_media, taxonomies, meta)
   - Taxonomy terms (id, name, slug, count)
   - WordPress media/images
   - API response formats with pagination
2. Build WordPress API client with functions for:
   - Fetching all projects with filtering/pagination
   - Fetching single project by slug
   - Fetching taxonomy terms
   - Fetching featured images
3. Implement proper error handling and fallbacks
4. Add response caching strategy using Next.js cache
5. Create reusable hooks/utilities for common operations
6. Handle WordPress authentication if needed (for preview/draft content)
7. Implement proper CORS handling
8. Add data transformation utilities (WordPress HTML to clean React-friendly format)
9. Configure ISR revalidation timings
10. Add comprehensive JSDoc comments for all functions
</requirements>

<implementation>
Build a production-grade API integration following these principles:

**Type Safety:**
- Define strict TypeScript interfaces matching WordPress REST API responses
- Use discriminated unions for different response states (success/error)
- Generic types for reusable API patterns
- Validate API responses at runtime for robustness

**Performance Optimization:**
- Use Next.js unstable_cache for server-side data caching
- Implement ISR with appropriate revalidation periods (e.g., 60 seconds for projects list)
- Lazy load images and defer non-critical data
- Minimize API calls with smart batching

**Error Handling:**
WHY: Political sites need reliability - failed API calls shouldn't break the page
- Graceful degradation with fallback content
- Proper error boundaries
- Retry logic for transient failures
- User-friendly error messages (never expose technical details to constituents)

**Data Transformation:**
- Strip WordPress-specific markup from content
- Transform taxonomy arrays into easily filterable formats
- Normalize image URLs for Next.js Image component
- Format dates consistently using date-fns

**Security:**
WHY: Headless setup exposes API endpoint publicly
- Validate all inputs
- Sanitize WordPress HTML content
- Rate limiting considerations
- Environment variable for API endpoint (never hardcode)
</implementation>

<output>
Create/update in `./projects-frontend/`:

- `lib/wordpress/types.ts` - Complete TypeScript interfaces for WordPress data
  - WPProject, WPTerm, WPMedia, WPApiResponse, ProjectFilters, etc.
- `lib/wordpress/api.ts` - Core API client functions
  - getProjects(filters?, page?, perPage?)
  - getProject(slug)
  - getProjectCategories()
  - getProjectVillages()
  - getProjectYears()
  - getProjectStatuses()
  - getMedia(id)
- `lib/wordpress/transform.ts` - Data transformation utilities
  - transformProject(wpProject)
  - extractFeaturedImage(project)
  - sanitizeContent(html)
  - formatProjectMeta(project)
- `lib/wordpress/cache.ts` - Caching configuration
  - Cache tags and revalidation strategies
- `lib/wordpress/index.ts` - Barrel export for clean imports
- `app/projects/page.tsx` - Update to fetch and display real projects data
- Update `lib/types.ts` - Add transformed, frontend-friendly Project type

After receiving tool results, carefully reflect on their quality and determine optimal next steps before proceeding.
</output>

<verification>
Before declaring complete:
1. Test fetching projects from WordPress API successfully
2. Verify TypeScript types align with actual API responses
3. Confirm error handling works (test with invalid endpoints)
4. Check that caching reduces redundant API calls
5. Validate transformed data structure is clean and React-friendly
6. Test filtering by category, village, year, status
7. Verify images load correctly with Next.js Image optimization
8. Confirm ISR revalidation works (update project in WordPress, check update time)
</verification>

<success_criteria>
- Complete TypeScript coverage for all WordPress data structures
- API client successfully fetches projects with proper error handling
- Caching strategy implemented using Next.js cache APIs
- Data transformation utilities clean WordPress data for React consumption
- Real projects display on /projects page with accurate data
- Filtering and pagination work correctly
- Images optimized through Next.js Image component
- No console errors or TypeScript warnings
- API integration documented in code comments
</success_criteria>
