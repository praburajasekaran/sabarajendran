# Deployment Guide

Complete guide for deploying the Projects Showcase to production on Vercel.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Vercel Deployment](#vercel-deployment)
4. [Custom Domain Setup](#custom-domain-setup)
5. [WordPress Configuration](#wordpress-configuration)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Monitoring & Analytics](#monitoring--analytics)
8. [Performance Optimization](#performance-optimization)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- [ ] Node.js 18+ installed
- [ ] WordPress backend deployed and accessible via HTTPS
- [ ] Vercel account (free tier works)
- [ ] Git repository connected to Vercel
- [ ] Domain name (optional, Vercel provides free subdomain)
- [ ] Google Analytics ID (optional)

---

## Environment Setup

### 1. Create Production Environment Variables

Copy `.env.production.example` to `.env.production.local`:

```bash
cp .env.production.example .env.production.local
```

### 2. Configure Environment Variables

Edit `.env.production.local` with your production values:

```env
# WordPress Backend (REQUIRED)
NEXT_PUBLIC_WORDPRESS_URL=https://yourdomain.com

# Site Configuration (REQUIRED)
NEXT_PUBLIC_SITE_NAME="Saba Rajendran - Projects Showcase"
NEXT_PUBLIC_SITE_DESCRIPTION="Constituency development projects and initiatives"
NEXT_PUBLIC_SITE_URL=https://projects.yourdomain.com

# Analytics (OPTIONAL)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# SEO Verification (OPTIONAL)
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-verification-code

# Revalidation (OPTIONAL - defaults to 3600 seconds)
REVALIDATE_TIME=3600
```

### 3. Update Image Domains

Edit `next.config.ts` and update the `images.remotePatterns` with your WordPress domain:

```typescript
{
  protocol: "https",
  hostname: "yourdomain.com", // Your actual WordPress domain
  pathname: "/wp-content/uploads/**",
},
```

---

## Vercel Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended for First-Time)

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your Git repository
   - Select the repository containing this project

2. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `projects-frontend` (if in monorepo)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

3. **Add Environment Variables**
   - Click "Environment Variables"
   - Add all variables from `.env.production.local`:
     - `NEXT_PUBLIC_WORDPRESS_URL`
     - `NEXT_PUBLIC_SITE_NAME`
     - `NEXT_PUBLIC_SITE_DESCRIPTION`
     - `NEXT_PUBLIC_SITE_URL`
     - `NEXT_PUBLIC_GA_ID` (optional)
     - `NEXT_PUBLIC_GOOGLE_VERIFICATION` (optional)
     - `REVALIDATE_TIME` (optional)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (typically 2-3 minutes)
   - Visit the provided URL (e.g., `your-project.vercel.app`)

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow the prompts to configure your project
```

---

## Custom Domain Setup

### 1. Add Domain in Vercel

1. Go to Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `projects.yourdomain.com`)
4. Click "Add"

### 2. Configure DNS Records

Add the following DNS records in your domain provider:

**For Subdomain (e.g., projects.yourdomain.com):**
```
Type: CNAME
Name: projects
Value: cname.vercel-dns.com
```

**For Root Domain (e.g., yourdomain.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

### 3. SSL Certificate

Vercel automatically provisions SSL certificates via Let's Encrypt. This typically takes a few minutes after DNS propagation.

### 4. Update Environment Variables

Update `NEXT_PUBLIC_SITE_URL` to your custom domain:

```env
NEXT_PUBLIC_SITE_URL=https://projects.yourdomain.com
```

Then redeploy:
```bash
vercel --prod
```

---

## WordPress Configuration

### 1. Enable CORS (if needed)

Add to WordPress `.htaccess` or server configuration:

```apache
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "https://projects.yourdomain.com"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type"
</IfModule>
```

### 2. Install Required WordPress Plugins

Ensure these plugins are installed and activated:
- **ACF (Advanced Custom Fields)** - For custom fields
- **Custom Post Type UI** - For Projects post type
- **Yoast SEO** or **Rank Math** - For SEO optimization

### 3. Configure REST API

1. Go to Settings → Permalinks
2. Select "Post name" or any option except "Plain"
3. Save changes

### 4. Test REST API Access

```bash
curl https://yourdomain.com/wp-json/wp/v2/projects
```

Should return JSON data without errors.

---

## Post-Deployment Verification

### 1. Performance Checklist

Run Lighthouse audit (Chrome DevTools → Lighthouse):

- [ ] Performance: 90+
- [ ] Accessibility: 90+
- [ ] Best Practices: 90+
- [ ] SEO: 90+

### 2. SEO Verification

- [ ] Sitemap accessible: `https://your-site.com/sitemap.xml`
- [ ] Robots.txt accessible: `https://your-site.com/robots.txt`
- [ ] Meta tags present on all pages
- [ ] Open Graph tags working (test with [Facebook Debugger](https://developers.facebook.com/tools/debug/))
- [ ] Twitter Cards working (test with [Twitter Card Validator](https://cards-dev.twitter.com/validator))
- [ ] Structured data valid (test with [Google Rich Results Test](https://search.google.com/test/rich-results))

### 3. Functionality Checklist

- [ ] All projects loading correctly
- [ ] Filters working (category, status, village, year)
- [ ] Search functionality working
- [ ] Project detail pages displaying correctly
- [ ] Images loading with proper optimization
- [ ] Responsive design on mobile/tablet
- [ ] Error boundaries catching errors gracefully
- [ ] 404 page displaying correctly

### 4. Analytics Setup

1. **Google Analytics**
   - Verify tracking code is firing
   - Check Real-Time reports in GA dashboard
   - Verify page views are being tracked

2. **Web Vitals**
   - Check Google Analytics for Web Vitals events
   - Monitor Core Web Vitals in Search Console

---

## Monitoring & Analytics

### 1. Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://your-site.com`
3. Verify ownership using DNS or HTML tag method
4. Submit sitemap: `https://your-site.com/sitemap.xml`

### 2. Vercel Analytics (Optional)

Enable Vercel Analytics for real-time performance monitoring:

1. Go to Project Settings → Analytics
2. Enable "Web Analytics"
3. View metrics in Vercel Dashboard

### 3. Error Tracking (Optional - Sentry)

To add Sentry for error tracking:

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## Performance Optimization

### 1. Image Optimization

- ✅ Already configured: AVIF/WebP formats
- ✅ Already configured: Responsive image sizes
- ✅ Already configured: Lazy loading

### 2. Caching Strategy

The app uses ISR (Incremental Static Regeneration):

- **Static pages**: Rebuilt on-demand
- **Dynamic data**: Revalidated every hour (configurable via `REVALIDATE_TIME`)

To adjust revalidation time:
```env
REVALIDATE_TIME=1800  # 30 minutes
```

### 3. CDN Configuration

Vercel automatically distributes your site globally via Edge Network. No additional configuration needed.

### 4. Bundle Size Optimization

Check bundle size:
```bash
npm run build
```

Review the build output for large bundles. Already optimized:
- Tree-shaking enabled
- Code splitting for routes
- Optimized package imports (lucide-react, framer-motion)

---

## Troubleshooting

### Build Failures

**Issue**: Build fails with "Module not found"
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

**Issue**: TypeScript errors
```bash
# Check types
npm run type-check
```

### Runtime Issues

**Issue**: Images not loading
- Verify WordPress URL is correct in environment variables
- Check `next.config.ts` has correct `remotePatterns`
- Ensure WordPress site is accessible via HTTPS

**Issue**: Data not updating
- Check `REVALIDATE_TIME` setting
- Force revalidation by redeploying
- Verify WordPress REST API is accessible

**Issue**: 500 errors on project pages
- Check Vercel logs: Project → Deployments → View Logs
- Verify WordPress API is returning valid JSON
- Check error boundaries are catching errors

### Performance Issues

**Issue**: Slow page loads
- Check Lighthouse report for bottlenecks
- Verify images are optimized
- Check WordPress response times
- Consider increasing `REVALIDATE_TIME` for better caching

**Issue**: Poor Lighthouse scores
- Enable production mode: `npm run build && npm start`
- Test on production Vercel URL (dev mode has lower scores)
- Check for render-blocking resources

---

## Maintenance

### Regular Tasks

**Daily:**
- Monitor Vercel deployment status
- Check error logs

**Weekly:**
- Review analytics data
- Check Core Web Vitals in Search Console
- Monitor WordPress uptime

**Monthly:**
- Update dependencies: `npm outdated && npm update`
- Review and optimize images
- Check for broken links

### Deployment Workflow

**Development → Staging → Production:**

1. **Development**
   ```bash
   git checkout -b feature/new-feature
   # Make changes
   git commit -m "Add new feature"
   git push
   ```

2. **Preview Deployment**
   - Vercel automatically creates preview deployment for branches
   - Review at: `feature-new-feature-project.vercel.app`

3. **Production**
   ```bash
   git checkout main
   git merge feature/new-feature
   git push
   ```
   - Vercel automatically deploys to production

---

## Security Considerations

- ✅ HTTPS enforced (via Vercel)
- ✅ Security headers configured (CSP, HSTS, etc.)
- ✅ Environment variables secured
- ✅ No sensitive data in frontend code
- ✅ WordPress REST API read-only

**Additional Recommendations:**
- Enable WordPress security plugins (Wordfence, iThemes Security)
- Regular WordPress and plugin updates
- Use strong passwords
- Enable two-factor authentication

---

## Support & Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **Vercel Documentation**: https://vercel.com/docs
- **WordPress REST API**: https://developer.wordpress.org/rest-api/
- **Web Vitals**: https://web.dev/vitals/
- **Lighthouse**: https://developers.google.com/web/tools/lighthouse

---

## Rollback Procedure

If deployment fails or issues occur:

1. **Via Vercel Dashboard**
   - Go to Deployments
   - Find last working deployment
   - Click "..." → "Promote to Production"

2. **Via CLI**
   ```bash
   vercel rollback
   ```

3. **Via Git**
   ```bash
   git revert HEAD
   git push
   ```

---

## Success Checklist

Before marking deployment as complete:

- [ ] Site accessible at production URL
- [ ] All environment variables configured
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Google Analytics tracking
- [ ] Search Console configured
- [ ] Sitemap submitted
- [ ] Lighthouse scores 90+
- [ ] All functionality tested
- [ ] Error handling verified
- [ ] Mobile responsiveness confirmed
- [ ] SEO meta tags verified
- [ ] Monitoring set up

---

**Congratulations!** Your Projects Showcase is now live and production-ready.
