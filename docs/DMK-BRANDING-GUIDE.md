# DMK Branding Guide for Campaign Materials
## Neyveli Constituency | MLA Saba Rajendran

---

## Official Color Palette

### Primary Colors (DMK Party)

| Color | Name | Hex Code | RGB | Usage |
|-------|------|----------|-----|-------|
| 🔴 | **DMK Red** | `#dc2626` | `rgb(220, 38, 38)` | Primary buttons, highlights, accents |
| ⬛ | **DMK Black** | `#0a0a0a` | `rgb(10, 10, 10)` | Text, headers, backgrounds |
| 🟡 | **Rising Sun Yellow** | `#f59e0b` | `rgb(245, 158, 11)` | Secondary accent, icons |

### Supporting Colors

| Color | Name | Hex Code | RGB | Usage |
|-------|------|----------|-----|-------|
| 🟢 | **Emerald Green** | `#10b981` | `rgb(16, 185, 129)` | Completed status, success |
| 🔵 | **Blue** | `#3b82f6` | `rgb(59, 130, 246)` | Ongoing status, links |
| ⚪ | **Stone Gray** | `#78716c` | `rgb(120, 113, 108)` | Neutral text, borders |

### Neutral Scale

| Shade | Hex Code | Usage |
|-------|----------|-------|
| `neutral-50` | `#fafafa` | Page backgrounds |
| `neutral-100` | `#f5f5f5` | Card backgrounds |
| `neutral-200` | `#e5e5e5` | Borders, dividers |
| `neutral-600` | `#525252` | Secondary text |
| `neutral-700` | `#404040` | Body text |
| `neutral-900` | `#171717` | Headlines, emphasis |

---

## Typography

### Font Family
**Primary:** Inter (Google Fonts)
- Excellent Tamil language support
- Modern, professional, highly readable

**Display/Serif:** Playfair Display (Headlines)
- Used for large headlines and quotes
- Creates editorial, sophisticated feel

### Type Scale

| Style | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| Display XL | 56px | 800 | 1.1 | Title slides |
| Display | 48px | 800 | 1.2 | Section headlines |
| H1 | 36px | 700 | 1.3 | Page titles |
| H2 | 28px | 700 | 1.3 | Section headers |
| H3 | 24px | 700 | 1.4 | Card titles |
| H4 | 18px | 600 | 1.5 | Subsection titles |
| Body | 18px | 400 | 1.6 | Paragraphs |
| Body Small | 16px | 400 | 1.5 | Secondary text |
| Caption | 14px | 500 | 1.5 | Labels, captions |
| Mono | 14px | 600 | 1.4 | Statistics, numbers |

---

## Logo Usage

### DMK Rising Sun Logo

**Location:** `/dmk.svg`

**Specifications:**
- **Format:** SVG (vector)
- **Size:** 407.979px × 263.986px (original)
- **Colors:** Black (default), can be styled

**Usage Guidelines:**
1. Maintain aspect ratio at all times
2. Minimum size: 40px height
3. Clear space: 10% of logo height on all sides
4. Do not distort, rotate, or add effects

**Simplified Rising Sun Symbol:**
For compact spaces, use the simplified rising sun:
```css
.sun {
    width: 40px;
    height: 40px;
    background: #f59e0b; /* Yellow */
    border-radius: 50%;
    position: relative;
}
.sun::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background: #dc2626; /* Red */
    border-radius: 50%;
}
```

---

## Slide Design Elements

### Header Banner
Every slide includes a DMK-branded header:
```css
.slide::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, 
        var(--dmk-red) 0%, 
        var(--dmk-red) 50%, 
        var(--dmk-black) 50%, 
        var(--dmk-black) 100%
    );
}
```

### Stat Cards
```css
.stat-card {
    background: linear-gradient(135deg, #fafafa 0%, white 100%);
    border: 2px solid #e5e5e5;
    border-radius: 16px;
    padding: 30px;
}

.stat-card .number {
    font-family: 'Inter', monospace;
    font-size: 48px;
    font-weight: 800;
    color: #dc2626; /* DMK Red */
}
```

### Quote Box (Dark Theme)
```css
.quote-box {
    background: #0a0a0a; /* DMK Black */
    color: white;
    padding: 50px;
    border-radius: 20px;
}

.quote-box p {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-style: italic;
}

.quote-box .author {
    color: #f59e0b; /* Rising Sun Yellow */
}
```

### CTA Box (Red Theme)
```css
.cta-box {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    color: white;
    padding: 50px;
    border-radius: 20px;
}
```

---

## Badge Styles

### Status Badges
```css
.badge.red {
    background: #dc2626;
    color: white;
}

.badge.green {
    background: #10b981;
    color: white;
}

.badge.yellow {
    background: #f59e0b;
    color: #171717;
}
```

### Eyebrow Labels
```css
.eyebrow {
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #dc2626; /* DMK Red */
}
```

---

## Progress Bar

```css
.progress-bar {
    height: 20px;
    background: #e5e5e5;
    border-radius: 10px;
    overflow: hidden;
}

.progress-bar .fill {
    height: 100%;
    background: linear-gradient(90deg, #10b981 0%, #059669 100%);
    border-radius: 10px;
}
```

---

## Table Styling

```css
table th {
    background: #0a0a0a; /* DMK Black */
    color: white;
    padding: 16px 20px;
    font-weight: 600;
    text-transform: uppercase;
}

table tr:nth-child(even) {
    background: #fafafa;
}
```

---

## Feature Item Cards

```css
.feature-item {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    padding: 20px;
    background: #fafafa;
    border-radius: 12px;
}

.feature-item .icon {
    width: 40px;
    height: 40px;
    background: #dc2626; /* DMK Red */
    border-radius: 10px;
    color: white;
}
```

---

## Step Numbers

```css
.step .number {
    width: 50px;
    height: 50px;
    background: #dc2626; /* DMK Red */
    color: white;
    border-radius: 50%;
    font-size: 24px;
    font-weight: 800;
}
```

---

## Block Cards (Homepage)

```css
.block-card {
    background: white;
    border: 2px solid #e5e5e5;
    border-radius: 16px;
    padding: 30px;
}

.block-card:hover {
    border-color: #dc2626; /* DMK Red */
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
}

.block-card .count {
    font-size: 48px;
    font-weight: 800;
    color: #dc2626; /* DMK Red */
}
```

---

## Title Slide (Dark Theme)

```css
.slide.title-slide {
    background: #0a0a0a; /* DMK Black */
    color: white;
}

.slide.title-slide .tamil {
    font-size: 32px;
    color: #f59e0b; /* Rising Sun Yellow */
}

.slide.title-slide .website {
    font-size: 32px;
    font-weight: 800;
    color: #dc2626; /* DMK Red */
    background: white;
    padding: 15px 50px;
    border-radius: 50px;
}
```

---

## Responsive Breakpoints

| Breakpoint | Size | Target |
|------------|------|--------|
| Mobile | 320px - 639px | Smartphones |
| Tablet | 640px - 1023px | Tablets, small laptops |
| Desktop | 1024px+ | Laptops, desktops |

---

## Accessibility Guidelines

1. **Color Contrast:** Maintain 4.5:1 ratio for text
2. **Font Size:** Minimum 16px for body text
3. **Touch Targets:** Minimum 44px × 44px for buttons
4. **Alt Text:** Include for all images
5. **Focus States:** Visible keyboard focus indicators

---

## Files Reference

| Asset | Location | Format |
|-------|----------|--------|
| DMK Logo | `/dmk.svg` | SVG |
| MLA Photo | `/projects-frontend-react/public/assets/images/saba_rajendran.webp` | WebP |
| Slide Deck HTML | `/docs/campaign-slides.html` | HTML |
| Slide Deck MD | `/docs/CAMPAIGN-SLIDE-DECK.md` | Markdown |

---

## Print Guidelines

### PDF Export
1. Open `campaign-slides.html` in Chrome
2. Press `Cmd+P` (Mac) or `Ctrl+P` (Windows)
3. Set destination to "Save as PDF"
4. Paper size: A4 or Letter (Landscape)
5. Margins: None
6. Enable "Background graphics"

### Color Mode
- Use CMYK for professional printing
- RGB for screen display

---

*Branding guide for Neyveli Constituency Campaign Materials*
*MLA Saba Rajendran | DMK | December 2025*


