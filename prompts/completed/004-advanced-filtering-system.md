<objective>
Build a sophisticated, real-time filtering and search system for the projects showcase with instant results, URL state synchronization, and exceptional UX. This will enable constituents to easily find specific projects by category, village, year, status, or search query.

The filtering system must be fast, intuitive, and work seamlessly on both mobile and desktop with proper URL state management for shareable links.
</objective>

<context>
Available project taxonomies from WordPress:
- Categories: Project types (e.g., Infrastructure, Healthcare, Education)
- Villages: Geographic location of projects
- Years: Year of project completion/start
- Status: Completed, Ongoing, Planned
- Schemes: Government schemes funding the projects

User requirements:
- Filter by multiple criteria simultaneously (e.g., "Completed projects in Village X from 2023")
- Search by project name or description
- Clear active filters easily
- See filter counts (e.g., "Healthcare (23)")
- Shareable URLs reflecting active filters
- Reset all filters with one click
- Mobile-friendly filter interface (drawer/modal on mobile, sidebar on desktop)

Performance requirements:
- Instant filtering (client-side, no page reload)
- Smooth animations when results update
- Pagination or infinite scroll for many results
- Loading states during data fetch
</context>

<requirements>
1. Implement URL-based filter state management using Next.js searchParams
2. Create filter UI with:
   - Multi-select filters for categories, villages, statuses
   - Year range or multi-year selection
   - Real-time search input with debouncing
   - Active filters display with remove buttons
   - Clear all filters button
   - Result count display
3. Build client-side filtering logic:
   - Filter projects array by multiple criteria
   - Search across title, content, excerpt
   - Combine filters with AND logic
   - Sort results by relevance or date
4. Add responsive filter panel:
   - Sidebar on desktop (lg and above)
   - Modal/drawer on mobile (below lg)
   - Toggle filter visibility
5. Implement filter state persistence:
   - URL query parameters
   - LocalStorage for user preferences (optional)
6. Add analytics/tracking for filter usage (preparation)
7. Create filter shortcuts (e.g., "View completed projects")
8. Handle edge cases:
   - No results found state
   - Invalid filter combinations
   - Clearing single vs all filters
9. Optimize performance:
   - Debounce search input (300ms)
   - Memoize filtered results
   - Virtual scrolling for large result sets (optional)
10. Add keyboard shortcuts (e.g., "/" to focus search)
</requirements>

<implementation>
Build a production-grade filtering system with these principles:

**State Management:**
WHY: URLs allow sharing filtered views (e.g., "All completed projects in Village X")
- Use Next.js useSearchParams and useRouter for URL state
- Sync URL params with filter state on every change
- Parse URL params on page load to restore filter state
- Proper URL encoding for filter values with special characters

**Client-Side Performance:**
WHY: 1000+ projects need instant filtering without server roundtrips
- Fetch all projects once, filter on client
- Use useMemo for expensive filtering operations
- Debounce search input to avoid excessive re-renders
- Consider useDeferredValue for large datasets
- Optimize re-renders with React.memo where appropriate

**User Experience:**
WHY: Constituents need easy access to specific project information
- Show filter counts before selecting (e.g., "Education (45)")
- Highlight active filters prominently
- Smooth transitions when results update (fade in/out)
- Loading skeleton while fetching data
- Empty state with helpful suggestions when no results
- Auto-scroll to results on filter change (mobile)
- Preserve scroll position when possible

**Mobile Optimization:**
WHY: Many constituents will access on mobile devices
- Drawer/modal for filters on small screens (slide in from left)
- Sticky filter toggle button
- Touch-friendly tap targets (minimum 44px)
- Smooth drawer animations
- Close drawer on filter selection

**Accessibility:**
- Announce filter changes to screen readers
- Keyboard navigation through all filters
- Focus management in drawer/modal
- ARIA labels for all filter controls
- Clear visual feedback for active filters

Go beyond basics: Include filter combinations like "OR" logic option, saved filter presets, filter suggestions based on popular queries, and smooth result animations.
</implementation>

<output>
Create/update in `./projects-frontend/`:

- `app/projects/page.tsx` - Update with filter integration
- `components/projects/filters/filter-panel.tsx` - Main filter panel container
- `components/projects/filters/category-filter.tsx` - Category multi-select
- `components/projects/filters/village-filter.tsx` - Village multi-select
- `components/projects/filters/year-filter.tsx` - Year selection
- `components/projects/filters/status-filter.tsx` - Status filter
- `components/projects/filters/search-filter.tsx` - Search input with debounce
- `components/projects/filters/active-filters.tsx` - Active filter tags display
- `components/projects/filters/filter-drawer.tsx` - Mobile drawer component
- `components/projects/filters/filter-shortcuts.tsx` - Quick filter buttons
- `lib/hooks/use-project-filters.ts` - Custom hook for filter logic
- `lib/hooks/use-url-state.ts` - URL state synchronization hook
- `lib/utils/filter-projects.ts` - Core filtering functions
- `lib/utils/search-projects.ts` - Search/ranking algorithm
- `components/projects/projects-list.tsx` - Results display with animations
- Update `app/projects/layout.tsx` - Add filter sidebar layout

For maximum efficiency, create independent filter components in parallel.
</output>

<verification>
Before declaring complete:
1. Test all filter combinations work correctly
2. Verify URL updates when filters change
3. Confirm page loads with correct filters from URL
4. Test search functionality with various queries
5. Verify filter counts are accurate
6. Check mobile drawer opens/closes smoothly
7. Test clearing individual and all filters
8. Confirm no results state displays appropriately
9. Test keyboard navigation through all filters
10. Verify screen reader announces filter changes
11. Test with large dataset (500+ projects) for performance
12. Confirm debouncing works on search input
</verification>

<success_criteria>
- Real-time filtering with instant results (no page reload)
- URL state synchronization for shareable links
- Multi-criteria filtering works correctly (AND logic)
- Search functionality across title and content
- Mobile-responsive filter drawer/modal
- Filter counts display accurately
- Active filters clearly indicated with remove buttons
- Smooth animations when results update
- No performance issues with large datasets
- Full keyboard and screen reader accessibility
- Empty state with helpful messaging
- Professional, governmental aesthetic maintained
- Filter state persists across page reloads via URL
</success_criteria>
