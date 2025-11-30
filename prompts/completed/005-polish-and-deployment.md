<objective>
Add final polish, performance optimizations, SEO enhancements, and deployment configuration to create a production-ready, spectacular projects showcase. This includes animations, loading states, error handling, meta tags, analytics preparation, and Vercel deployment setup.

The end result will be a professional, performant, and fully-deployed political portfolio site that constituents can access publicly.
</objective>

<context>
Current state:
- Next.js project with WordPress API integration
- Design system with governmental aesthetic
- Advanced filtering and search functionality
- Project display working locally

Final requirements for production:
- Smooth page transitions and micro-interactions
- Proper loading states and error boundaries
- SEO optimization for discoverability
- Performance optimization (Core Web Vitals)
- Vercel deployment configuration
- Environment variable management
- Social media meta tags
- Analytics preparation (Google Analytics ready)
- Security headers
- Sitemap and robots.txt
</context>

<requirements>
1. **Animations & Micro-interactions:**
   - Page transition animations
   - Project card hover effects with subtle lift
   - Filter drawer slide animations
   - Loading skeletons for content
   - Stagger animations for project grid
   - Smooth scroll behavior
   - Success/error toast notifications

2. **Loading & Error States:**
   - Suspense boundaries for async components
   - Loading skeletons matching actual content
   - Error boundaries with recovery options
   - Retry logic for failed requests
   - Offline state detection

3. **SEO Optimization:**
   - Dynamic meta tags for project pages
   - Open Graph tags for social sharing
   - Twitter Card tags
   - Structured data (JSON-LD) for projects
   - Canonical URLs
   - XML sitemap generation
   - Robots.txt configuration
   - Proper heading hierarchy

4. **Performance Optimization:**
   - Image optimization and lazy loading
   - Font optimization with next/font
   - Code splitting and lazy component loading
   - Minimize JavaScript bundle size
   - Implement ISR for project pages
   - Add proper caching headers
   - Optimize Cumulative Layout Shift (CLS)
   - Preload critical resources

5. **Deployment Setup:**
   - Vercel configuration (vercel.json)
   - Environment variables for production
   - Build optimization
   - Preview deployments setup
   - Production domain configuration
   - Security headers (CSP, HSTS, etc.)
   - Redirect rules if needed

6. **Monitoring & Analytics:**
   - Prepare Google Analytics integration
   - Add error tracking preparation (Sentry-ready)
   - Web Vitals reporting
   - Custom event tracking for filters

7. **Final Polish:**
   - Favicon and app icons (multiple sizes)
   - Loading screen/splash
   - 404 page design
   - Smooth scrolling and scroll restoration
   - Print styles (PDF-friendly project pages)
   - Keyboard shortcut guide (optional)
</requirements>

<implementation>
Apply these production-ready principles:

**Animation Strategy:**
WHY: Subtle animations enhance perceived performance and professionalism
- Use Framer Motion or CSS transitions (prefer CSS for performance)
- Stagger project card animations (50ms delay between each)
- Smooth 300ms transitions for most interactions
- Respect prefers-reduced-motion media query
- GPU-accelerated properties only (transform, opacity)
- Avoid layout thrashing

**Loading States:**
WHY: Skeleton screens reduce perceived loading time vs spinners
- Match skeleton shapes to actual content
- Pulse animation for loading indicators
- Progressive loading (show content as it arrives)
- Optimistic UI updates where appropriate

**SEO Best Practices:**
WHY: Political sites need discoverability for constituent access
- Unique title and description per page
- Descriptive alt text for all images (generated from WordPress)
- Semantic HTML structure
- Mobile-friendly design (already implemented)
- Fast load times (target <2s FCP)
- HTTPS only (Vercel provides free SSL)

**Performance Targets:**
- Lighthouse score: 90+ on all metrics
- First Contentful Paint: <1.8s
- Time to Interactive: <3.8s
- Cumulative Layout Shift: <0.1
- Largest Contentful Paint: <2.5s

**Security Headers:**
WHY: Protect site and users from common web vulnerabilities
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Strict-Transport-Security

Go beyond basics: Include micro-interactions like button ripple effects, smooth filter count transitions, particle effects on success states (subtle), and delightful 404 page with illustrations.
</implementation>

<output>
Create/update in `./projects-frontend/`:

**Animations:**
- `lib/animations.ts` - Framer Motion variants or CSS animation configs
- `components/ui/page-transition.tsx` - Page transition wrapper
- `components/ui/toast.tsx` - Toast notification component
- Update project cards with hover animations
- Add stagger to project grid

**Loading & Errors:**
- `components/ui/loading-skeleton.tsx` - Reusable skeleton
- `components/projects/project-card-skeleton.tsx` - Project-specific skeleton
- `app/error.tsx` - Root error boundary
- `app/projects/error.tsx` - Projects-specific error boundary
- `app/loading.tsx` - Root loading state
- `app/projects/loading.tsx` - Projects loading state

**SEO & Meta:**
- `app/layout.tsx` - Update with comprehensive meta tags
- `app/projects/[slug]/page.tsx` - Dynamic project pages with meta
- `app/sitemap.ts` - XML sitemap generation
- `app/robots.ts` - Robots.txt configuration
- `lib/seo.ts` - SEO utilities and structured data generators
- `public/manifest.json` - Web app manifest

**Performance:**
- Update `next.config.ts` - Add performance optimizations
- `lib/fonts.ts` - Font optimization with next/font
- Add `loading="lazy"` to images
- Implement React.lazy for heavy components

**Deployment:**
- `vercel.json` - Vercel configuration
- `.env.production` - Production environment variables (template)
- Update `README.md` - Add deployment instructions
- `.github/workflows/ci.yml` - Optional CI checks

**Final Polish:**
- `public/favicon.ico` - Professional favicon
- `public/apple-touch-icon.png` - iOS icon
- `public/og-image.png` - Open Graph default image
- `app/not-found.tsx` - Custom 404 page with governmental design
- Update `app/globals.css` - Print styles, smooth scrolling

**Documentation:**
- `DEPLOYMENT.md` - Deployment guide
- Update `README.md` - Complete setup and architecture docs

For maximum efficiency, create independent optimization tasks in parallel.
</output>

<verification>
Before declaring complete:
1. Run Lighthouse audit (target 90+ on all metrics)
2. Test all animations respect prefers-reduced-motion
3. Verify loading skeletons match actual content layout
4. Test error boundaries catch and display errors gracefully
5. Confirm meta tags generate correctly on all pages
6. Validate structured data with Google Rich Results Test
7. Check sitemap.xml generates all pages correctly
8. Test deployment to Vercel preview environment
9. Verify environment variables work in production
10. Test social sharing (Open Graph preview)
11. Confirm security headers are set correctly
12. Test on real mobile devices
13. Validate WCAG AA compliance with axe DevTools
14. Test offline behavior
15. Verify print styles work correctly
</verification>

<success_criteria>
- Lighthouse score 90+ (Performance, Accessibility, Best Practices, SEO)
- Smooth animations throughout with proper reduced-motion support
- Comprehensive loading states and error boundaries
- Complete SEO optimization with meta tags and structured data
- Successfully deployed to Vercel with production domain
- Security headers properly configured
- Fast load times (FCP <1.8s, TTI <3.8s)
- XML sitemap and robots.txt working
- Social media preview cards display correctly
- Professional 404 and error pages
- Print-friendly project pages
- Mobile-responsive across all devices
- WCAG 2.1 AA compliant
- Analytics-ready (tracking code integration point exists)
- Complete documentation for deployment and maintenance
- Production-ready, spectacular projects showcase live and accessible
</success_criteria>
