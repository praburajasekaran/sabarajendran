# Saba Rajendran - Projects Showcase

A modern, production-ready Next.js 15 application for showcasing constituency development projects powered by headless WordPress. Built with TypeScript, Tailwind CSS v4, and a governmental design system focused on trust, accessibility, and clarity.

## Features

### Core Functionality
- Next.js 15 with App Router for optimal performance and SEO
- TypeScript strict mode for type safety and maintainability
- Tailwind CSS v4 with custom governmental design tokens
- Headless WordPress integration via REST API
- Advanced filtering (category, status, village, year) with URL state management
- Full-text search with fuzzy matching
- Incremental Static Regeneration (ISR) for fresh data
- Dynamic project detail pages with SEO optimization

### Performance & Animations
- Framer Motion for smooth animations and micro-interactions
- Staggered grid animations for project cards
- Smooth page transitions and loading states
- Loading skeletons matching actual content
- Image optimization with Next.js Image (AVIF/WebP)
- React Compiler enabled for runtime performance

### SEO & Accessibility
- Dynamic meta tags and Open Graph for all pages
- JSON-LD structured data (GovernmentService, BreadcrumbList)
- XML sitemap generation
- Robots.txt configuration
- WCAG 2.1 AA compliant
- Skip-to-content links
- Keyboard navigation support
- Print-friendly styles

### Production Features
- Error boundaries with recovery options
- Custom 404 page
- Toast notifications
- Web Vitals reporting
- Google Analytics integration ready
- Security headers (CSP, HSTS, etc.)
- Vercel deployment configuration

## Tech Stack

- **Framework:** Next.js 16.0.5 (with React 19)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Data Source:** WordPress REST API
- **Utilities:** clsx, tailwind-merge, date-fns
- **State Management:** URL state for filters (no heavy dependencies)
- **Deployment:** Vercel (recommended)

## Design System

The application uses a governmental color palette designed for trust and authority:

### Colors

- **Primary (Deep Blue):** Authority and trust
  - Used for headers, primary CTAs, and key UI elements
  - Main: `#1e40af` (blue-700)

- **Secondary (Saffron/Orange):** Energy and progress
  - Used for accents and action items
  - Main: `#f97316` (orange-500)

- **Accent (Green):** Success and completion
  - Used for completed projects and success states
  - Main: `#16a34a` (green-600)

- **Neutral (Grays):** WCAG AA+ compliant
  - Used for text, borders, and backgrounds

### Typography

- **Font:** Inter (Google Fonts)
- **Scale:** Based on 4px grid system
- **Spacing:** Consistent 4px base grid

## Project Structure

```
projects-frontend/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with meta tags & analytics
│   ├── page.tsx             # Homepage
│   ├── loading.tsx          # Root loading state
│   ├── error.tsx            # Root error boundary
│   ├── not-found.tsx        # Custom 404 page
│   ├── web-vitals.tsx       # Web Vitals reporting
│   ├── sitemap.ts           # XML sitemap generation
│   ├── robots.ts            # Robots.txt configuration
│   ├── projects/
│   │   ├── page.tsx         # Projects listing with filters
│   │   ├── loading.tsx      # Projects loading skeleton
│   │   ├── error.tsx        # Projects error boundary
│   │   └── [slug]/
│   │       └── page.tsx     # Dynamic project detail pages
│   └── globals.css          # Global styles & design tokens
├── components/
│   ├── projects/            # Project-specific components
│   │   ├── project-card.tsx           # Animated project card
│   │   ├── project-grid.tsx           # Grid with stagger animation
│   │   ├── project-card-skeleton.tsx  # Loading skeleton
│   │   └── filters/                   # Filter components
│   └── ui/                  # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── toast.tsx                  # Toast notifications
│       ├── loading-skeleton.tsx       # Generic skeleton
│       └── ...
├── lib/
│   ├── animations.ts        # Framer Motion variants
│   ├── seo.ts              # SEO utilities & structured data
│   ├── wordpress/          # WordPress API integration
│   │   ├── api.ts         # API functions
│   │   ├── transform.ts   # Data transformation
│   │   ├── cache.ts       # Caching layer
│   │   └── types.ts       # API types
│   ├── types.ts            # TypeScript type definitions
│   └── utils/              # Utility functions
├── public/                  # Static assets
│   ├── site.webmanifest    # Web app manifest
│   ├── favicon.ico
│   ├── og-image.png        # Open Graph image
│   └── icons/              # App icons (various sizes)
├── .env.example            # Environment template (local)
├── .env.production.example # Environment template (production)
├── vercel.json             # Vercel deployment config
├── next.config.ts          # Next.js configuration
├── DEPLOYMENT.md           # Comprehensive deployment guide
└── package.json            # Dependencies
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- WordPress installation with Saba Projects custom post type
- WordPress REST API enabled

### Installation

1. **Clone and navigate to the directory:**
   ```bash
   cd projects-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```

   Update `.env.local` with your WordPress API URL:
   ```env
   NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8118/sabarajendran/wp-json/wp/v2
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server (with Turbopack)
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## WordPress Integration

### API Endpoints Used

The application connects to WordPress REST API endpoints:

- `/saba-projects` - Fetch all projects with filtering
- `/categories` - Project categories taxonomy
- `/project_village` - Villages taxonomy
- `/project_year` - Years taxonomy
- `/project_status` - Project status taxonomy
- `/project_scheme` - Government schemes taxonomy

### Data Fetching Strategy

- **Homepage:** Uses ISR with 60-second revalidation
- **Projects listing:** Server-side rendering with filtering
- **Individual projects:** Static generation with ISR fallback

### Type Safety

All WordPress API responses are fully typed using TypeScript interfaces defined in `lib/types.ts`:

- `SabaProject` - Raw WordPress project response
- `Project` - Clean frontend-ready project type
- `WPTerm` - Taxonomy term
- `WPMedia` - Media/image data

## Development Workflow

### Adding New Components

1. Create component in `components/ui/`
2. Use `cn()` utility for className merging
3. Follow governmental design system colors
4. Ensure accessibility (ARIA labels, keyboard navigation)

Example:
```tsx
import { cn } from "@/lib/utils";

export function Button({ className, ...props }) {
  return (
    <button
      className={cn(
        "bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg",
        className
      )}
      {...props}
    />
  );
}
```

### Working with WordPress Data

Use the helper functions from `lib/wordpress.ts`:

```tsx
import { getProjects, getProjectBySlug } from "@/lib/wordpress";

// Fetch all projects with filters
const { data, total } = await getProjects({
  category: "infrastructure",
  perPage: 12,
  page: 1,
});

// Fetch single project
const project = await getProjectBySlug("road-construction-project");
```

## Production Deployment

### Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

3. **Environment Variables:**
   Set these in Vercel dashboard:
   ```
   NEXT_PUBLIC_WORDPRESS_API_URL=https://yourdomain.com/wp-json/wp/v2
   NEXT_PUBLIC_SITE_NAME=Saba Rajendran - Projects Showcase
   NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
   ```

### Custom Server

```bash
npm run build
npm start
```

## Performance Optimizations

- **Image Optimization:** Next.js Image component with AVIF/WebP formats
- **ISR:** Incremental Static Regeneration for dynamic content
- **Code Splitting:** Automatic route-based splitting
- **Font Optimization:** Google Fonts with `display: swap`
- **React Compiler:** Enabled for better runtime performance
- **Turbopack:** Fast development bundler

## Accessibility

- Semantic HTML throughout
- WCAG AA compliant color contrasts
- Keyboard navigation support
- Focus visible states
- ARIA labels where needed
- Alt text for all images

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions including:
- Vercel deployment setup
- Environment variable configuration
- Custom domain setup
- WordPress configuration
- Post-deployment verification
- Monitoring and analytics setup
- Performance optimization tips
- Troubleshooting guide

Quick deploy to Vercel:
```bash
vercel --prod
```

## Future Enhancements

Potential Phase 3 features:
- Image galleries for projects
- Project maps/GIS integration
- Multi-language support (Tamil/English)
- PDF export of project details
- Advanced statistics dashboard
- Email notifications for new projects
- Admin dashboard for content editors

## Architecture Decisions

### Why Next.js 15?
- Server Components for better performance
- App Router for improved routing and layouts
- Built-in image optimization
- ISR for static + dynamic content balance

### Why TypeScript Strict Mode?
- Catches errors at compile time
- Better IDE support and autocomplete
- Self-documenting code
- Easier refactoring for long-term maintenance

### Why Tailwind CSS v4?
- Modern CSS features (CSS variables, @theme)
- Better performance with new architecture
- Smaller bundle size
- Type-safe design tokens

### Why Headless WordPress?
- Leverages existing WordPress content management
- WordPress admin remains familiar for content editors
- Frontend is decoupled for better performance
- Flexibility to rebuild frontend without touching content

## Contributing

This is a private political portfolio project. For issues or suggestions, please contact the development team.

## License

Copyright 2025 Saba Rajendran. All rights reserved.

## Support

For technical support or questions:
- Review this documentation
- Check Next.js docs: [nextjs.org/docs](https://nextjs.org/docs)
- Check Tailwind CSS v4 docs: [tailwindcss.com](https://tailwindcss.com)
