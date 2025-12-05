# Technical Notes

## Tailwind CSS Setup

**IMPORTANT:** This project uses **Tailwind CDN**, not npm-installed Tailwind.

### Current Setup
- Tailwind is loaded via `<script src="https://cdn.tailwindcss.com"></script>` in `projects-frontend-react/index.html`
- Tailwind configuration is defined inline in the HTML file using `tailwind.config = { ... }`
- Custom CSS animations and utilities are in `projects-frontend-react/index.css`
- The CSS file should start with `/* Tailwind loaded via CDN */` comment (NOT `@import "tailwindcss"` or `@tailwind` directives)

### Why CDN?
- Original implementation used CDN
- Works reliably with Vite dev server
- No build-time compilation needed
- Configuration is straightforward and visible in HTML

### What NOT to Do
❌ Do NOT add `tailwind.config.js` file
❌ Do NOT add `postcss.config.js` file
❌ Do NOT use `@tailwind base`, `@tailwind components`, `@tailwind utilities` in CSS
❌ Do NOT use `@import "tailwindcss"` in CSS (this is for Tailwind v4 npm)
❌ Do NOT install `@tailwindcss/postcss` or change to npm-based Tailwind

### If You Need to Modify Tailwind Config
Edit the inline config in `projects-frontend-react/index.html`:
```html
<script>
  tailwind.config = {
    theme: {
      extend: {
        // Your custom config here
      }
    }
  }
</script>
```

### Port Configuration
- Development server runs on **port 3003** (configured in `vite.config.ts`)
- Access at: http://localhost:3003

## Issue History

### 2025-12-04: Stylesheet Not Loading
**Problem:** After attempting to migrate to npm-based Tailwind v4, colors and fonts stopped loading.

**Root Cause:** Project uses Tailwind CDN, but was mistakenly configured for npm-based Tailwind with:
- Added `tailwind.config.js` and `postcss.config.js`
- Changed CSS to use `@import "tailwindcss"` syntax
- This broke all color utilities (primary, accent, secondary) and font loading

**Solution:** Reverted to original CDN setup:
```bash
git checkout 51202a3d -- index.html index.css vite.config.ts
rm tailwind.config.js postcss.config.js
```

**Lesson:** Always use Tailwind CDN as originally implemented. Do not attempt to migrate to npm-based Tailwind without explicit requirement.
