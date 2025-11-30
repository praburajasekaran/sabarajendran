# Project Filtering System - Quick Start Guide

## For Users

### Desktop Experience
1. Visit `/projects` page
2. Use the **sidebar on the left** to filter projects:
   - Search box at top (press `/` to focus)
   - Click status badges (Completed, Ongoing, Planned)
   - Check categories, villages, and years
3. See results update **instantly** (no page reload)
4. Active filters shown as **removable chips**
5. Click **Clear All** to reset filters
6. **Share the URL** - it includes all your filter selections!

### Mobile Experience
1. Visit `/projects` page
2. Tap **"Filters"** button at top
3. Drawer slides in from left with all filter options
4. Select your filters
5. Tap **"View Results"** to see filtered projects
6. Tap active filter badges to remove individual filters

### Keyboard Shortcuts
- **/** - Focus search box
- **Escape** - Clear search or close drawer
- **Tab** - Navigate through filters
- **Enter/Space** - Toggle checkboxes

## For Developers

### Quick Integration

```tsx
// The filtering system is already integrated in app/projects/page.tsx
// No additional setup needed!

// To customize, modify:
import { ProjectsClient } from "@/components/projects/projects-client";

// In your page component:
<ProjectsClient projects={allProjects} taxonomies={taxonomies} />
```

### Adding Custom Filters

```tsx
// 1. Add to FilterCriteria in lib/utils/filter-projects.ts
export interface FilterCriteria {
  // ... existing filters
  myNewFilter?: string[];
}

// 2. Update filtering logic
export function filterProjects(projects, criteria) {
  return projects.filter((project) => {
    // ... existing logic

    if (criteria.myNewFilter && criteria.myNewFilter.length > 0) {
      const matches = project.myField.some((item) =>
        criteria.myNewFilter!.includes(item.slug)
      );
      if (!matches) return false;
    }

    return true;
  });
}

// 3. Create UI component (follow pattern of category-filter.tsx)
// 4. Add to FilterPanel and FilterDrawer components
```

### Custom Filter Shortcuts

```tsx
// In components/projects/filters/filter-shortcuts.tsx
const CUSTOM_SHORTCUTS: FilterShortcut[] = [
  {
    id: "high-priority",
    label: "High Priority",
    icon: Star,
    filters: {
      categories: ["infrastructure"],
      statuses: ["ongoing"]
    },
  },
  // Add more shortcuts...
];
```

### Programmatic Filtering

```tsx
"use client";

import { useProjectFilters } from "@/lib/hooks/use-project-filters";

export function MyComponent({ projects, taxonomies }) {
  const {
    filteredProjects,
    setFilter,
    toggleFilter,
    clearFilters,
    activeFilterCount,
  } = useProjectFilters(projects, taxonomies);

  return (
    <div>
      {/* Apply a filter */}
      <button onClick={() => setFilter("categories", ["infrastructure"])}>
        Show Infrastructure
      </button>

      {/* Toggle a filter */}
      <button onClick={() => toggleFilter("villages", "nannikuppam")}>
        Toggle Nannikuppam
      </button>

      {/* Clear all */}
      <button onClick={clearFilters}>
        Clear ({activeFilterCount} active)
      </button>

      {/* Display results */}
      <div>Found {filteredProjects.length} projects</div>
    </div>
  );
}
```

### URL State Management

```tsx
import { useUrlState } from "@/lib/hooks/use-url-state";

export function MyComponent() {
  const { params, setParam, clearParams } = useUrlState();

  // Read URL param
  const category = params.category;

  // Set URL param
  setParam("category", "infrastructure");

  // Update multiple params
  updateParams({
    category: "infrastructure",
    village: "nannikuppam",
  });

  // Clear all params
  clearParams();
}
```

## Common Tasks

### 1. Change Filter Debounce Delay

```tsx
// In components/projects/filters/search-filter.tsx
<SearchFilter
  debounce={500} // Change from 300ms to 500ms
  // ... other props
/>
```

### 2. Add More Filter Shortcuts

```tsx
// In components/projects/filters/filter-shortcuts.tsx
const CUSTOM_SHORTCUTS = [
  {
    id: "infrastructure-2024",
    label: "2024 Infrastructure",
    icon: Building,
    filters: {
      categories: ["infrastructure"],
      years: ["2024"],
    },
  },
];
```

### 3. Customize Empty State

```tsx
// In components/projects/projects-list.tsx
// Modify the "No projects found" section
if (projects.length === 0) {
  return (
    <div>
      <h2>Custom Empty Message</h2>
      <p>Custom description...</p>
    </div>
  );
}
```

### 4. Change Project Card Layout

```tsx
// In components/projects/projects-list.tsx
// Modify the grid columns
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {/* Projects */}
</div>
```

### 5. Add Analytics Tracking

```tsx
// In lib/hooks/use-project-filters.ts
const setFilter = useCallback(
  (key, value) => {
    // Track filter usage
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'filter_applied', {
        filter_type: key,
        filter_value: value,
      });
    }

    // ... existing logic
  },
  [/* deps */]
);
```

## File Locations

### Core Files
- **Main Page**: `app/projects/page.tsx`
- **Client Wrapper**: `components/projects/projects-client.tsx`
- **Filter Hook**: `lib/hooks/use-project-filters.ts`
- **URL Hook**: `lib/hooks/use-url-state.ts`

### Filter Components
- **Panel**: `components/projects/filters/filter-panel.tsx`
- **Drawer**: `components/projects/filters/filter-drawer.tsx`
- **Search**: `components/projects/filters/search-filter.tsx`
- **Categories**: `components/projects/filters/category-filter.tsx`
- **Villages**: `components/projects/filters/village-filter.tsx`
- **Years**: `components/projects/filters/year-filter.tsx`
- **Status**: `components/projects/filters/status-filter.tsx`

### Utilities
- **Filtering**: `lib/utils/filter-projects.ts`
- **Search**: `lib/utils/search-projects.ts`

## Testing Locally

1. **Start Development Server**:
   ```bash
   cd projects-frontend
   npm run dev
   ```

2. **Visit Projects Page**:
   ```
   http://localhost:3000/projects
   ```

3. **Test Filters**:
   - Try different filter combinations
   - Check URL updates
   - Test search functionality
   - Verify mobile drawer
   - Test keyboard shortcuts

4. **Check Build**:
   ```bash
   npm run build
   ```

## Deployment

The filtering system is fully server-side rendered with client-side hydration:

1. **Build**: `npm run build`
2. **Deploy**: Standard Next.js deployment
3. **Environment**: Ensure `NEXT_PUBLIC_WORDPRESS_API_URL` is set

## Performance Tips

1. **Limit Initial Fetch**: Adjust `perPage` in `app/projects/page.tsx`
2. **Enable Caching**: WordPress API responses are cached with ISR
3. **Optimize Images**: Featured images use Next.js Image optimization
4. **Monitor Performance**: Use React DevTools Profiler

## Troubleshooting

### Filters Not Working
1. Check browser console for errors
2. Verify URL parameters are updating
3. Check WordPress API is responding
4. Clear browser cache

### Slow Performance
1. Reduce number of projects fetched initially
2. Check network tab for slow API calls
3. Use React DevTools to find slow components
4. Consider implementing pagination

### Mobile Issues
1. Test on actual devices (not just browser DevTools)
2. Check touch target sizes (minimum 44px)
3. Verify drawer animations are smooth
4. Test on various screen sizes

## Support

See full documentation: `FILTERING_SYSTEM_DOCUMENTATION.md`

## Next Steps

1. ✅ System is ready to use
2. 📝 Customize filter shortcuts if needed
3. 📊 Add analytics tracking (optional)
4. 🎨 Adjust styling to match brand
5. 🚀 Deploy to production
