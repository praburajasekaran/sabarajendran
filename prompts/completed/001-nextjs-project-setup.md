<objective>
Set up a production-ready Next.js 15 project with TypeScript and Tailwind CSS for a headless WordPress projects showcase. This will be a modern, governmental-style application focused on displaying constituency projects with advanced filtering capabilities.

This is the foundation for a professional political portfolio site that will showcase development projects to constituents with a trustworthy, accessible design.
</objective>

<context>
The existing WordPress installation at http://localhost:8118/sabarajendran/ has:
- Saba Projects custom post type with taxonomies (categories, villages, years, status, schemes)
- WordPress REST API available at /wp-json/wp/v2/
- Project data that needs to be fetched and displayed in a spectacular Next.js frontend

This Next.js app will focus solely on the projects section initially, deployed to Vercel for optimal performance.

Tech stack requirements:
- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS v4 (follow @erik-kennedy-ui-heuristics.md principles)
- Lucide React icons
- Production-ready configuration
</context>

<requirements>
1. Initialize Next.js project in `./projects-frontend/` directory
2. Configure TypeScript with strict mode
3. Set up Tailwind CSS v4 with custom governmental design tokens
4. Create project structure following Next.js 15 best practices:
   - `/app` - App router pages and layouts
   - `/components` - Reusable UI components
   - `/lib` - Utilities, API clients, types
   - `/public` - Static assets
5. Install essential dependencies:
   - Lucide React for icons
   - clsx and tailwind-merge for className utilities
   - Date formatting library (date-fns recommended)
6. Configure environment variables for WordPress API endpoint
7. Set up proper TypeScript types for WordPress REST API responses
8. Create base layout with modern governmental aesthetic
9. Configure next.config.js for image optimization from WordPress
10. Set up proper meta tags and SEO configuration
</requirements>

<implementation>
Follow these principles for a spectacular, production-ready setup:

**Design System Foundation:**
- Use Tailwind CSS v4 with custom color palette inspired by Indian governmental design
- Primary: Deep blue (#1e40af) for trust and authority
- Secondary: Saffron/orange (#f97316) for energy and progress
- Accent: Green (#16a34a) for completion/success
- Neutral grays with excellent contrast ratios (WCAG AA minimum)
- Typography: Inter or similar professional sans-serif
- Spacing scale: Consistent 4px base grid

**Performance Optimization:**
- Enable Next.js image optimization for WordPress media
- Configure proper caching headers
- Use dynamic imports for heavy components
- Implement ISR (Incremental Static Regeneration) for project pages

**Code Quality:**
- Strict TypeScript configuration (no implicit any)
- Consistent file naming: kebab-case for files, PascalCase for components
- Proper error boundaries and loading states
- Accessibility: semantic HTML, ARIA labels, keyboard navigation

**Why these constraints:**
- TypeScript strict mode catches errors early and improves maintainability for long-term political portfolio
- Tailwind v4 provides modern CSS features and better performance
- ISR ensures fresh project data without rebuilding entire site
- Governmental color palette builds trust and professionalism with constituents
</implementation>

<output>
Create the following structure in `./projects-frontend/`:

- `package.json` - Dependencies and scripts
- `tsconfig.json` - Strict TypeScript configuration
- `tailwind.config.ts` - Custom design tokens and governmental color palette
- `next.config.ts` - Image optimization, security headers, WordPress domain config
- `.env.local.example` - Environment variable template
- `.env.local` - Local WordPress API endpoint configuration
- `app/layout.tsx` - Root layout with meta tags, fonts, governmental design
- `app/page.tsx` - Homepage with link to projects
- `app/projects/page.tsx` - Main projects showcase page (placeholder)
- `app/globals.css` - Tailwind imports and custom CSS
- `lib/wordpress.ts` - WordPress API client utilities
- `lib/types.ts` - TypeScript types for projects, taxonomies, API responses
- `lib/utils.ts` - className utilities (cn function)
- `components/ui/` - Base UI components directory (create empty for now)
- `public/favicon.ico` - Placeholder favicon
- `README.md` - Setup instructions and architecture documentation

For maximum efficiency, invoke all independent file creation operations simultaneously.
</output>

<verification>
Before declaring complete, verify:
1. Run `npm install` successfully with no errors
2. Run `npm run dev` and confirm Next.js starts on http://localhost:3000
3. Confirm TypeScript compilation has no errors (`npm run build`)
4. Verify Tailwind CSS is working (check if styles apply in browser)
5. Test that environment variables load correctly
6. Confirm governmental color palette is defined in tailwind.config.ts
7. Check that image optimization is configured for WordPress domain
</verification>

<success_criteria>
- Next.js 15 project running successfully on localhost:3000
- TypeScript strict mode enabled with no compilation errors
- Tailwind CSS v4 configured with custom governmental design tokens
- WordPress API client structure in place with proper TypeScript types
- Professional project structure following Next.js best practices
- All dependencies installed and working
- Environment variables properly configured
- README documents setup process and architecture decisions
- Ready for building components and features in subsequent prompts
</success_criteria>
