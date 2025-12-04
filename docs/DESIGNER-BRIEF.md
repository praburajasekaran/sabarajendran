# Website Redesign - Designer Brief
## MLA Saba Rajendran Constituency Website (DMK Campaign)

**Date:** December 4, 2025
**Scope:** Homepage, Projects Page, Sidebar, About Page
**Timeline:** Flexible - Homepage & Projects Page priority

---

## 🎯 Design Objectives

**PRIMARY GOALS:**
1. **Modern, Professional Aesthetic** - Current site looks outdated and unprofessional for a political campaign
2. **International Quality** - Contemporary design that matches global standards
3. **Indian Cultural Sensitivity** - Must not alienate Indian audience with overly Western design
4. **DMK Political Branding** - Respectful integration of party colors and symbols

---

## 🎨 Brand Identity

### Color Palette

**Primary Colors (DMK Party):**
- **DMK Red:** `#dc2626` / `rgb(220, 38, 38)` - Main brand color
- **DMK Black:** `#000000` - Party accent color
- **Rising Sun Yellow/Orange:** `#f59e0b` - Secondary accent

**Supporting Colors:**
- **Neutrals:** Warm stone grays (stone-50 through stone-900)
- **Status Colors:**
  - Completed: Emerald green (`#10b981`)
  - Ongoing: Blue (`#3b82f6`)
  - Planned: Gray (`#6b7280`)

**Project Type Colors (7 categories):**
- Infrastructure: Dark gray/black (`#1c1917`)
- Water Supply: Cyan (`#0891b2`)
- Education: DMK Red (`#dc2626`)
- Health: Rose (`#e11d48`)
- Electricity: Orange (`#ea580c`)
- Community Hall: Orange (`#ea580c`)
- Agriculture: Emerald (`#059669`)

### Typography

**Font Family:** Inter (Google Fonts / @fontsource)
- Already integrated in the application
- Excellent Tamil language support
- Modern, professional, highly readable

**Type Scale:**
- **Display/Headline:** 48px - 32px (Bold 700)
- **Page Titles:** 32px - 24px (Semibold 600)
- **Section Headers:** 24px - 20px (Semibold 600)
- **Card Titles:** 18px (Semibold 600)
- **Body Text:** 16px (Regular 400)
- **Small Text/Labels:** 14px (Medium 500)
- **Captions:** 12px (Regular 400)

**Line Heights:**
- Tight (1.25): Headlines
- Normal (1.5): Body text
- Relaxed (1.75): Long-form content

### Spacing System

**Base Unit:** 4px (Tailwind scale)
- 8px, 12px, 16px, 20px, 24px, 32px, 48px, 64px, 96px

**Border Radius:**
- Standard cards: 8px (`rounded-lg`)
- Large cards: 12px (`rounded-xl`)
- Buttons: 8px
- Pills/badges: 24px (`rounded-full`)
- Images: 8px - 16px

---

## 📐 Design System Components to Create

### 1. Buttons
- **Primary:** Red background, white text, subtle shadow
- **Secondary:** Outline with red border, red text on hover
- **Ghost:** Transparent, minimal, hover state
- **Sizes:** Small (32px), Medium (40px), Large (48px)

### 2. Input Fields
- **Search:** Prominent with icon, rounded corners
- **Select/Dropdown:** Clean, modern, accessible
- **Text Input:** Border, focus state, error state

### 3. Cards
- **Project Card:** Header with type color, status badge, image, content footer
- **Stat Card:** Icon, large number, label, subtle background
- **Info Card:** General content container

### 4. Badges
- **Status Badge:** Colored background (green/blue/gray), rounded-full
- **Type Badge:** Type-specific color
- **Count Badge:** Number indicator for filters

### 5. Navigation
- **Desktop Navbar:** Sticky top, logo left, links center, language toggle right
- **Mobile Hamburger:** Slide-out drawer
- **Footer:** 3-column layout (About, Locations, Contact), black/red party strip

---

## 🏠 Page-Specific Design Guidelines

### **Homepage**

**Hero Section:**
- **Layout:** Full-width, split layout (60/40 or 70/30)
- **Left:**
  - Bold headline (50-60px): "Building a Stronger Neyveli Together" (or similar)
  - Descriptive subheading (18px)
  - Two CTAs: Primary "View Projects" + Secondary "Contact Office"
- **Right:** Professional MLA photo (circular or rounded rectangle)
- **Background:** Modern gradient (black to red) OR subtle pattern
- **Height:** 600-700px on desktop

**Stats Section (4 metrics):**
- **Metrics:**
  1. Completed Projects (number)
  2. Ongoing Works (number)
  3. Villages Covered (number)
  4. Funds Utilized (₹ in Crores/Lakhs)
- **Layout:** 4-column grid on desktop, 2-column on mobile
- **Design:** Icon + Large number + Label
- **Style:** Modern cards with subtle shadows, type-specific accent colors

**Featured Projects:**
- **Layout:** 3-column grid (1 on mobile, 2 on tablet, 3 on desktop)
- **Cards:** Show 3 recent projects
- **CTA:** "View All Projects" button below

**Quote/Vision Section:**
- **Content:** Inspirational quote from MLA Saba Rajendran
- **Design:** Large serif or italic text, sophisticated typography
- **Background:** Subtle color block or pattern
- **Attribution:** Name + title

### **Projects Page**

**Layout Structure:**
```
┌─────────────┬──────────────────────────────┐
│             │  Filter Bar (search, tabs,   │
│  Sidebar    │  dropdowns, active filters)  │
│  (Villages) │                              │
│             ├──────────────────────────────┤
│             │                              │
│             │  Project Grid (3 columns)    │
│             │                              │
│             │                              │
│             ├──────────────────────────────┤
│             │  Pagination                  │
└─────────────┴──────────────────────────────┘
```

**Filter Bar:**
- **Search:** Prominent input with search icon
- **Status Tabs:** Visual tabs (All, Completed, Ongoing) - NOT dropdown
- **Additional Filters:** Clean dropdowns for Block, Panchayat, Type, Year
- **Active Filters:** Removable chips showing current filters
- **Results Count:** "Showing X projects"

**Project Card Design:**
- **Header (140px tall):**
  - Type-specific color gradient background
  - Type icon (large, centered, watermark style)
  - Status badge (top-left corner)
  - Image thumbnail if available (with zoom icon)
  - Party strip accent (black/red horizontal band at very top - 4px tall)
- **Body:**
  - Title (2 lines max, truncate)
  - Description snippet (3 lines max)
- **Footer:**
  - Location icon + village/panchayat
  - Calendar icon + year
  - Currency icon + budget
- **Hover State:** Subtle lift (shadow increase, slight scale)

**Sidebar:**
- **Width:** 280px on desktop
- **Mobile:** Slide-out overlay panel
- **Content:**
  - Search input at top
  - "All Villages" option (shows total count)
  - Village list with project counts (e.g., "Kurinjipadi (15)")
  - Selected village highlighted with indicator

### **About Page**

**Sections to Design:**
1. **Hero:** MLA name, photo, title, brief intro
2. **Biography:** Detailed background, education, political career
3. **Achievements:** Timeline or grid of key accomplishments
4. **Vision & Mission:** Boxed content areas
5. **Photo Gallery:** Optional - community photos

---

## 🌍 Cultural Design Considerations

### **What to Include (Indian Context):**
✅ Rising Sun symbol (DMK party symbol) - subtle integration
✅ Warm, approachable photography (not cold/corporate)
✅ Respect for political hierarchy (MLA prominently featured)
✅ Regional pride elements (Tamil language prominence)
✅ Community-focused messaging and imagery
✅ Traditional color symbolism (red = power/action in Indian context)

### **What to Avoid:**
❌ Overly cluttered layouts (avoid "Indian website" stereotype)
❌ Excessive decoration/ornamentation
❌ Low-quality stock photos
❌ Too much text crammed into small spaces
❌ Chaotic color usage
❌ Western political campaign clichés (flags, eagles, etc.)

### **The Balance:**
Create a design that feels:
- **Internationally professional** (clean, spacious, modern typography)
- **Locally relevant** (DMK colors, Tamil language, Indian community imagery)
- **Trustworthy & accessible** (not intimidating or overly corporate)

---

## 📱 Responsive Design Requirements

### Breakpoints:
- **Mobile:** 320px - 640px (base styles)
- **Tablet:** 640px - 1024px (md:)
- **Desktop:** 1024px+ (lg:, xl:)

### Mobile Considerations:
- Touch-friendly tap targets (minimum 44px)
- Readable font sizes (16px+ for body text)
- Single column layouts
- Hamburger navigation
- Sidebar becomes slide-out panel
- Simplified filter interface

---

## 🛠 Figma File Structure (Recommended)

```
Sabarajendran Website Redesign
├── 📄 Cover (project overview)
├── 🎨 Design System
│   ├── Color Palette (all colors documented)
│   ├── Typography (scale, weights, examples)
│   ├── Spacing & Grid (8px grid system)
│   ├── Icons (Lucide React icons)
│   └── Components (buttons, cards, inputs, badges)
├── 🏠 01 - Homepage (Desktop 1440px)
├── 🏠 02 - Homepage (Mobile 375px)
├── 📂 03 - Projects Page (Desktop 1440px)
├── 📂 04 - Projects Page (Mobile 375px)
├── 🧩 05 - Components (isolated component variants)
├── 📊 06 - About Page (Desktop 1440px)
└── 📊 07 - About Page (Mobile 375px)
```

---

## 🚀 Technical Integration Notes

**Framework:** React 18 with Tailwind CSS v4
**Icons:** Lucide React (already installed)
**Bilingual:** English + Tamil (all content has both versions)
**API:** WordPress REST API (data is already flowing)

**What gets preserved:**
- All filtering functionality (Block → Panchayat → Village hierarchy)
- Search functionality
- Pagination (12 items per page)
- URL-based state management
- SEO meta tags
- Language switching
- WordPress data integration

**What you're redesigning:**
- Visual appearance only (colors, spacing, typography, layout)
- Component structure (can reorganize, but functionality stays)
- User interface elements (buttons, cards, forms)
- Animation and interaction patterns

---

## 📋 Deliverables Checklist

### Phase 1: Design System
- [ ] Color palette page with all color values
- [ ] Typography scale with examples
- [ ] Component library (buttons, cards, inputs, badges)
- [ ] Spacing system documented
- [ ] Icon set (Lucide React mapping)

### Phase 2: Pages (Priority)
- [ ] Homepage (Desktop + Mobile)
- [ ] Projects Page (Desktop + Mobile)

### Phase 3: Additional Pages
- [ ] About Page (Desktop + Mobile)
- [ ] Sidebar redesign
- [ ] Navigation (Navbar + Footer)

### Assets Required:
- [ ] All images exported as WebP format
- [ ] Icon SVGs (if custom icons needed)
- [ ] Design specs/annotations for interactions
- [ ] Hover states documented
- [ ] Mobile responsive layouts

---

## 🔗 Figma Setup for MCP Integration

**To enable seamless design-to-code workflow:**

1. **Get Personal Access Token:**
   - Figma → Settings → Personal Access Tokens
   - Generate token with `file:read` scope
   - Name: "Claude Code MCP Integration"

2. **Share Figma File:**
   - Set sharing to "View" access minimum
   - Provide file URL (e.g., `https://www.figma.com/file/...`)

3. **File Organization:**
   - Use clear frame names (e.g., "Homepage - Desktop", "Project Card Component")
   - Add annotations for interactions
   - Document component variants and states
   - Export assets to organized folders

---

## 📞 Questions or Clarifications

If you need clarification on:
- DMK political branding guidelines
- Existing content structure
- Technical constraints
- Tamil language rendering
- Image assets available

Please reach out before starting design work.

---

## 🎯 Success Criteria

**Your design will be successful if:**
✓ Feels modern and professional (international standard)
✓ Respects Indian cultural context (not alienating)
✓ DMK branding is prominent but tasteful
✓ Clear visual hierarchy and intuitive navigation
✓ Accessible and responsive across all devices
✓ Reflects trustworthy political campaign quality

---

**Good luck! Looking forward to seeing your designs!**
