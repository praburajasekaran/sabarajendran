# WordPress REST API Integration

Production-grade WordPress headless CMS integration for the Saba Rajendran projects frontend.

## Overview

This module provides a complete TypeScript integration layer for fetching data from the WordPress REST API, with comprehensive error handling, caching strategies, and data transformation utilities optimized for Next.js 15 Server Components.

## Architecture

```
lib/wordpress/
├── types.ts        # Complete TypeScript definitions
├── api.ts          # Core API client functions
├── transform.ts    # Data transformation & sanitization
├── cache.ts        # Caching configuration & utilities
└── index.ts        # Barrel export (public API)
```

## Quick Start

### Basic Usage

```typescript
import { getProjects, getAllTaxonomies } from '@/lib/wordpress';

// Fetch all projects
const { data: projects, total, totalPages } = await getProjects();

// Fetch with filters
const filtered = await getProjects({
  village: 'nannikuppam-east',
  status: 'completed',
  page: 1,
  perPage: 12
});

// Get taxonomies for filters
const taxonomies = await getAllTaxonomies();
```

### In Server Components

```typescript
// app/projects/page.tsx
export default async function ProjectsPage() {
  const [projectsResponse, taxonomies] = await Promise.all([
    getProjects({ page: 1, perPage: 12 }),
    getAllTaxonomies(),
  ]);

  const { data: projects, total } = projectsResponse;

  return (
    <div>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

## API Functions

### Projects

#### `getProjects(filters?): Promise<WPAPIResponse<Project>>`

Fetches paginated projects with optional filtering.

**Parameters:**
- `filters.category` - Filter by category slug or ID
- `filters.village` - Filter by village slug or ID
- `filters.year` - Filter by year slug or ID
- `filters.status` - Filter by status slug or ID
- `filters.scheme` - Filter by scheme slug or ID
- `filters.search` - Search query (searches title and content)
- `filters.page` - Page number (default: 1)
- `filters.perPage` - Items per page (default: 12)
- `filters.orderBy` - Order by field ('date', 'title', 'modified')
- `filters.order` - Order direction ('asc', 'desc')

**Returns:**
```typescript
{
  data: Project[],
  total: number,
  totalPages: number,
  page: number,
  perPage: number
}
```

**Caching:** 60 seconds ISR revalidation

#### `getProject(slug): Promise<Project | null>`

Fetches a single project by slug.

**Caching:** 5 minutes ISR revalidation

#### `getProjectById(id): Promise<Project | null>`

Fetches a single project by numeric ID.

**Caching:** 5 minutes ISR revalidation

### Taxonomies

#### `getTaxonomyTerms(taxonomy): Promise<WPTerm[]>`

Fetches all terms for a specific taxonomy.

**Parameters:**
- `taxonomy` - One of: 'project_category', 'project_village', 'project_year', 'project_status', 'project_scheme'

**Caching:** 10 minutes

#### `getAllTaxonomies(): Promise<TaxonomyCollection>`

Fetches all taxonomy types in parallel.

**Returns:**
```typescript
{
  categories: WPTerm[],
  villages: WPTerm[],
  years: WPTerm[],
  statuses: WPTerm[],
  schemes: WPTerm[]
}
```

**Caching:** 10 minutes per taxonomy

### Statistics

#### `getProjectsCount(): Promise<number>`

Efficiently fetches total number of projects.

**Caching:** 5 minutes

#### `getProjectsCountByTerm(taxonomy, termId): Promise<number>`

Gets count of projects for a specific taxonomy term.

## Data Types

### Transformed Types (Frontend-Friendly)

```typescript
interface Project {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  link: string;
  featuredImage?: FeaturedImage;
  categories: SimpleTerm[];
  villages: SimpleTerm[];
  years: SimpleTerm[];
  statuses: SimpleTerm[];
  schemes: SimpleTerm[];
}

interface FeaturedImage {
  id: number;
  url: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  sizes?: {
    thumbnail?: string;
    medium?: string;
    large?: string;
  };
}

interface SimpleTerm {
  id: number;
  name: string;
  slug: string;
}
```

### Raw WordPress Types

Full WordPress REST API types are available for advanced use:
- `WPProject` - Raw WordPress project response
- `WPTerm` - WordPress taxonomy term
- `WPMedia` - WordPress media object

See `types.ts` for complete definitions.

## Transformation Utilities

### HTML Processing

```typescript
import {
  sanitizeContent,
  htmlToPlainText,
  truncateHtml,
  stripWrapperTags
} from '@/lib/wordpress';

// Sanitize HTML for safe rendering
const safe = sanitizeContent(wpContent);

// Extract plain text (for meta descriptions)
const plain = htmlToPlainText(wpContent);

// Truncate with word boundary preservation
const excerpt = truncateHtml(wpContent, 160);
```

### Project Transformation

```typescript
import { transformProject } from '@/lib/wordpress';

const wpProject = await fetchFromWordPress();
const project = transformProject(wpProject);
```

### Metadata Generation

```typescript
import { generateProjectMetadata } from '@/lib/wordpress';

export async function generateMetadata({ params }) {
  const project = await getProject(params.slug);
  return generateProjectMetadata(project);
}
```

## Caching Strategy

### ISR (Incremental Static Regeneration)

All API functions use Next.js ISR with appropriate revalidation periods:

| Data Type | Revalidation | Reason |
|-----------|--------------|--------|
| Projects List | 60s | Frequently viewed, moderate updates |
| Single Project | 5min | Less traffic, infrequent updates |
| Taxonomies | 10min | Rarely change |
| Statistics | 5min | Can tolerate slight staleness |
| Media | 1hr | Almost never change |

### Cache Tags

All requests are tagged for on-demand revalidation:
- `projects` - All projects listings
- `project-{slug}` - Specific project
- `taxonomies` - All taxonomy data

### On-Demand Revalidation

```typescript
import { revalidateProjects, revalidateTaxonomies } from '@/lib/wordpress';

// In an API route receiving WordPress webhook
export async function POST(request: Request) {
  const { project_slug } = await request.json();
  await revalidateProjects(project_slug);
  return Response.json({ revalidated: true });
}
```

## Error Handling

All API functions implement graceful degradation:

```typescript
// Projects returns empty array on error
const { data } = await getProjects();
// data = [] if API fails, never throws

// Individual items return null on error
const project = await getProject('invalid-slug');
// project = null, never throws
```

Error details are logged to console for debugging but never exposed to users.

## WordPress Configuration

### Required WordPress Setup

1. **Custom Post Type:** 'project'
2. **Taxonomies:**
   - `project_category` - Project categories
   - `project_village` - Village locations
   - `project_year` - Project years
   - `project_status` - Status (Completed, Ongoing, etc.)
   - `project_scheme` - Funding schemes

3. **REST API Enabled:** All post types and taxonomies must have `show_in_rest: true`

### API URL Configuration

Set in `.env.local`:

```env
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8118/sabarajendran/wp-json/wp/v2
```

The integration automatically handles WordPress permalink formats:
- Standard: `/wp-json/wp/v2/project`
- Alternative: `/?rest_route=/wp/v2/project`

## Performance Optimizations

### Parallel Requests

```typescript
// ✅ Good - Parallel
const [projects, taxonomies] = await Promise.all([
  getProjects(),
  getAllTaxonomies()
]);

// ❌ Bad - Sequential
const projects = await getProjects();
const taxonomies = await getAllTaxonomies();
```

### Smart Filtering

```typescript
// Filter on server (fast)
const filtered = await getProjects({ village: 'nannikuppam' });

// Not client-side filtering (slow)
const all = await getProjects();
const filtered = all.data.filter(p => p.villages[0]?.slug === 'nannikuppam');
```

## Security

### HTML Sanitization

All WordPress HTML content is sanitized:
- Scripts removed
- Event handlers stripped
- `javascript:` protocol blocked
- XSS attack vectors neutralized

### Input Validation

All filter parameters are properly encoded in URL queries.

### Rate Limiting

Consider implementing rate limiting for public-facing pages:

```typescript
// Example: API route with rate limiting
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});
```

## Testing

### Manual Testing

```bash
# Start WordPress (MAMP)
# Start Next.js dev server
npm run dev

# Test endpoints
curl http://localhost:3000/projects
curl http://localhost:3000/projects/your-project-slug
```

### Verify API Responses

```bash
# Direct WordPress API test
curl "http://localhost:8118/sabarajendran/?rest_route=/wp/v2/project&per_page=1"
```

## Troubleshooting

### Common Issues

**404 on API calls:**
- Verify WordPress permalinks are flushed (Settings > Permalinks > Save)
- Check MAMP is running on correct port (8118)
- Confirm `NEXT_PUBLIC_WORDPRESS_API_URL` is set correctly

**Empty data returned:**
- Check WordPress has published projects
- Verify taxonomies are created and assigned
- Enable dev tools console to see API errors

**Images not loading:**
- Verify Next.js `images.remotePatterns` in `next.config.ts`
- Check WordPress uploads directory permissions
- Confirm images are attached to projects

**TypeScript errors:**
- Run `npm run build` to verify types
- Check import paths use `@/lib/wordpress` not `@/lib/wordpress/`

## Best Practices

1. **Always use Server Components** for data fetching
2. **Parallelize independent requests** with `Promise.all()`
3. **Transform data at the API boundary** - components should receive clean `Project` type
4. **Handle loading states** with React Suspense
5. **Implement error boundaries** for graceful failures
6. **Use ISR** - don't bypass Next.js caching
7. **Sanitize all HTML** before rendering with `dangerouslySetInnerHTML`

## Future Enhancements

- [ ] Add search API integration
- [ ] Implement draft/preview functionality
- [ ] Add multi-language support
- [ ] Integrate WordPress authentication for admin features
- [ ] Add webhook endpoint for instant cache invalidation
- [ ] Implement full-text search with Algolia/Typesense
- [ ] Add image optimization pipeline
- [ ] Create Storybook documentation for components

## License

Proprietary - Saba Rajendran Projects Frontend

## Support

For issues or questions, contact the development team.
