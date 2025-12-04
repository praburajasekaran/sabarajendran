# Archive Folder
## Archived Code and Documentation

**Purpose:** Storage for deprecated code, alternative implementations, and historical versions.

---

## Archived Items

### 1. projects-frontend-nextjs-archived-2025-12-03

**Original Location:** `/projects-frontend/`
**Archived Date:** December 3, 2025
**Reason:** Codebase consolidation decision

**Description:**
Alternative frontend implementation using Next.js 16 + React 19. This version was configured for Vercel deployment but was not chosen as the production codebase.

**Why Archived:**
- Only 30% feature complete (vs 90% in Vite version)
- Missing critical features:
  - Advanced filtering system
  - Bilingual Tamil/English support
  - AI chatbot integration
  - Most Phase 1 requirements
- Active development focused on Vite version
- To avoid confusion between two frontends

**Tech Stack:**
- Next.js 16.0.5
- React 19.2.0
- Tailwind CSS 4
- Framer Motion
- Configured for Vercel deployment

**Production Decision:**
`projects-frontend-react` (Vite) was chosen as production because:
- ✅ 90% feature complete
- ✅ All Phase 1 features working
- ✅ Netlify deployment configured
- ✅ Active development
- ✅ 826 projects working perfectly

**Future Use:**
- Reference for SSR/ISR implementation
- Potential migration target for SEO optimization
- Educational/learning purposes
- Component reference

**Can It Be Restored?**
Yes. If needed for future SEO optimization or Next.js migration:
1. Copy back to main directory
2. Port features from Vite version
3. Test thoroughly before switching

**Do NOT Delete:**
This version contains valuable Next.js patterns and may be useful for future optimization projects.

---

## Archive Policy

**What Gets Archived:**
- Deprecated code versions
- Alternative implementations not chosen for production
- Legacy WordPress themes/plugins
- Old documentation versions
- Backup files from major refactors

**Retention:**
- Keep for at least 1 year
- Review annually
- Delete only after confirming no future value

**Restoration:**
Contact development team if you need to restore any archived code.

---

**Last Updated:** December 3, 2025
