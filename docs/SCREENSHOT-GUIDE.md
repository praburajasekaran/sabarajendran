# Screenshot Guide for Campaign Slide Deck
## Visual Assets Needed for Presentation

---

## Required Screenshots

### 1. Homepage Screenshots

| Screenshot | Description | Recommended Size |
|------------|-------------|------------------|
| **Hero Section** | Full-width hero with MLA photo and stats | 1920x1080 |
| **Statistics Bar** | Close-up of the 4 key metrics | 1200x400 |
| **Block Cards** | Three block cards section | 1200x600 |
| **Featured Projects** | Recent developments grid | 1200x800 |
| **Quote Section** | MLA quote with dark background | 1200x400 |

### 2. Projects Page Screenshots

| Screenshot | Description | Recommended Size |
|------------|-------------|------------------|
| **Full Page View** | Projects grid with sidebar | 1920x1080 |
| **Filter Bar** | Status tabs and filter dropdowns | 1200x200 |
| **Sidebar Village List** | Village names with project counts | 400x800 |
| **Project Card Close-up** | Single project card detail | 400x500 |
| **Mobile Filter Drawer** | Mobile view of filters | 375x812 |

### 3. Feature Screenshots

| Screenshot | Description | Recommended Size |
|------------|-------------|------------------|
| **Language Toggle** | Tamil/English switcher | 300x100 |
| **AI Chatbot** | Chatbot interface with sample query | 400x600 |
| **Search Results** | Filtered search results | 1200x800 |
| **Block Filter Active** | Projects filtered by block | 1200x800 |
| **Village Filter Active** | Projects filtered by village | 1200x800 |

### 4. Mobile Screenshots

| Screenshot | Description | Recommended Size |
|------------|-------------|------------------|
| **Mobile Homepage** | Homepage on mobile device | 375x812 |
| **Mobile Projects** | Projects grid on mobile | 375x812 |
| **Mobile Project Card** | Single card on mobile | 375x600 |
| **Mobile Sidebar** | Slide-out village panel | 375x812 |

---

## How to Capture Screenshots

### Browser DevTools Method (Recommended)

1. **Open the website:** Navigate to `sabarajendran.com`

2. **Open Developer Tools:**
   - Chrome: `Cmd+Option+I` (Mac) or `Ctrl+Shift+I` (Windows)
   - Firefox: `Cmd+Option+I` (Mac) or `Ctrl+Shift+I` (Windows)

3. **Device Toolbar:**
   - Click the device icon or press `Cmd+Shift+M` (Mac) / `Ctrl+Shift+M` (Windows)
   - Select device dimensions or enter custom sizes

4. **Capture Screenshot:**
   - Chrome: Three-dot menu → "Capture screenshot" or "Capture full size screenshot"
   - Firefox: Right-click → "Take Screenshot"

### Specific Captures

#### Full Page Screenshot
```
1. Navigate to the page
2. DevTools → Three-dot menu → "Capture full size screenshot"
3. Save as PNG
```

#### Mobile Screenshot
```
1. DevTools → Device toolbar
2. Select "iPhone 12 Pro" or custom 375x812
3. Refresh page
4. Capture screenshot
```

#### Element Screenshot
```
1. DevTools → Elements panel
2. Right-click on element
3. "Capture node screenshot"
```

---

## Screenshot URLs

### Homepage Variations
- **English:** `https://sabarajendran.com/`
- **Tamil:** `https://sabarajendran.com/ta/`

### Projects Page Variations
- **All Projects:** `https://sabarajendran.com/projects`
- **Tamil Projects:** `https://sabarajendran.com/ta/projects`
- **NLC Block:** `https://sabarajendran.com/projects?block=NLC`
- **Panruti Block:** `https://sabarajendran.com/projects?block=Panruti`
- **Kurinjipadi Block:** `https://sabarajendran.com/projects?block=Kurinjipadi`
- **Completed Only:** `https://sabarajendran.com/projects?status=Completed`
- **Ongoing Only:** `https://sabarajendran.com/projects?status=Ongoing`

### About Page
- **English:** `https://sabarajendran.com/about`
- **Tamil:** `https://sabarajendran.com/ta/about`

---

## File Naming Convention

Use this naming format for consistency:

```
screenshot-[page]-[element]-[device]-[language].png

Examples:
- screenshot-home-hero-desktop-en.png
- screenshot-projects-grid-desktop-ta.png
- screenshot-home-stats-mobile-en.png
- screenshot-projects-filter-tablet-en.png
```

---

## Output Directory

Save all screenshots to:
```
/Applications/MAMP/htdocs/sabarajendran/docs/screenshots/
```

Create subdirectories:
```
screenshots/
├── desktop/
│   ├── homepage/
│   ├── projects/
│   └── about/
├── mobile/
│   ├── homepage/
│   └── projects/
└── features/
    ├── filtering/
    ├── language/
    └── chatbot/
```

---

## Quick Capture Commands

### Using Chrome CLI (if installed)
```bash
# Full page screenshot
chrome --headless --screenshot="screenshot.png" --window-size=1920,1080 https://sabarajendran.com/

# Mobile screenshot
chrome --headless --screenshot="mobile.png" --window-size=375,812 https://sabarajendran.com/
```

### Using Puppeteer Script
```javascript
const puppeteer = require('puppeteer');

async function captureScreenshot() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Desktop
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('https://sabarajendran.com/');
    await page.screenshot({ path: 'homepage-desktop.png', fullPage: true });
    
    // Mobile
    await page.setViewport({ width: 375, height: 812 });
    await page.goto('https://sabarajendran.com/');
    await page.screenshot({ path: 'homepage-mobile.png', fullPage: true });
    
    await browser.close();
}

captureScreenshot();
```

---

## Screenshot Checklist

### Homepage
- [ ] Hero section (desktop)
- [ ] Hero section (mobile)
- [ ] Statistics bar
- [ ] Block cards section
- [ ] Featured projects grid
- [ ] Quote section
- [ ] Footer

### Projects Page
- [ ] Full page with sidebar (desktop)
- [ ] Full page (mobile)
- [ ] Filter bar close-up
- [ ] Status tabs (All/Completed/Ongoing)
- [ ] Block filter dropdown
- [ ] Village sidebar with counts
- [ ] Project card detail
- [ ] Empty state (no results)
- [ ] Pagination controls

### Features
- [ ] Language toggle (English active)
- [ ] Language toggle (Tamil active)
- [ ] Search bar with results
- [ ] AI chatbot initial state
- [ ] AI chatbot with query
- [ ] Mobile filter drawer open

### Branding
- [ ] DMK color usage example
- [ ] Party banner component
- [ ] Logo placement

---

## Image Optimization

After capturing, optimize for web:

```bash
# Using ImageOptim CLI
imageoptim docs/screenshots/**/*.png

# Or using pngquant
pngquant --quality=65-80 docs/screenshots/**/*.png
```

Recommended file sizes:
- Desktop screenshots: < 500KB
- Mobile screenshots: < 200KB
- Feature close-ups: < 100KB

---

*Last Updated: December 2025*


