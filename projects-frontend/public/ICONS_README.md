# App Icons and Favicons

This directory should contain the following icon files for optimal display across all devices and platforms.

## Required Icon Files

### Favicons
- `favicon.ico` - 32x32 ICO format (legacy browsers)
- `icon-16x16.png` - 16x16 PNG
- `icon-32x32.png` - 32x32 PNG

### Apple Touch Icons
- `apple-touch-icon.png` - 180x180 PNG (iOS home screen)

### Android/PWA Icons
- `icon-192x192.png` - 192x192 PNG (Android home screen)
- `icon-512x512.png` - 512x512 PNG (Android splash screen)

### Open Graph
- `og-image.png` - 1200x630 PNG (social media sharing)

## Generating Icons

You can generate all required icons from a single source image using:

### Option 1: Online Tool (Easiest)
1. Visit https://realfavicongenerator.net/
2. Upload your logo/source image (preferably 512x512 or larger)
3. Download the generated package
4. Extract files to this directory

### Option 2: Using Sharp (CLI)
```bash
npm install -g sharp-cli

# Generate from source
sharp -i logo-source.png -o favicon.ico resize 32 32
sharp -i logo-source.png -o icon-16x16.png resize 16 16
sharp -i logo-source.png -o icon-32x32.png resize 32 32
sharp -i logo-source.png -o apple-touch-icon.png resize 180 180
sharp -i logo-source.png -o icon-192x192.png resize 192 192
sharp -i logo-source.png -o icon-512x512.png resize 512 512
sharp -i logo-source.png -o og-image.png resize 1200 630
```

### Option 3: Design Tool (Figma, Sketch, etc.)
Export at each required size from your design tool.

## Design Recommendations

### Favicon (favicon.ico, icon-16x16.png, icon-32x32.png)
- Simple, recognizable design
- High contrast for visibility at small sizes
- Avoid fine details that won't be visible
- Consider using brand initials or simplified logo

### Apple Touch Icon (apple-touch-icon.png)
- No transparency (iOS adds its own rounded corners and shadow)
- Full bleed design (fills entire canvas)
- Consider slight padding from edges

### Android/PWA Icons (icon-192x192.png, icon-512x512.png)
- Transparent background recommended (adaptive icons)
- Safe area: keep important content in center 80%
- Can use full-color, detailed design

### Open Graph Image (og-image.png)
- Dimensions: 1200x630px (exact)
- Safe area: important content should be centered
- Include: Logo, site name, tagline
- Text should be large and readable
- Consider how it appears cropped on different platforms

## Brand Colors

Use these colors from the governmental design system:

- **Primary Blue**: `#1e40af`
- **Background White**: `#ffffff`
- **Text Dark**: `#111827`
- **Accent Orange**: `#f97316` (optional)
- **Accent Green**: `#16a34a` (optional)

## Example Content for OG Image

**Recommended Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│         [Government Seal]           │
│                                     │
│    Saba Rajendran                   │
│    Projects Showcase                │
│                                     │
│    Constituency Development         │
│    Projects and Initiatives         │
│                                     │
└─────────────────────────────────────┘
```

## Testing Icons

After adding icons, test them:

1. **Favicon**: Visit site in browser, check tab icon
2. **Apple**: Add to iOS home screen, check icon
3. **Android**: Add to Android home screen, check icon
4. **Open Graph**: Use [Facebook Debugger](https://developers.facebook.com/tools/debug/)
5. **Twitter Card**: Use [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## Quick Placeholder Icons

For development/testing, you can use placeholder icons:

```bash
# Create simple colored squares as placeholders
convert -size 512x512 xc:"#1e40af" -gravity center -pointsize 200 -fill white -annotate +0+0 "SR" icon-512x512.png
```

Or use online placeholder services:
- https://placeholder.com/ (e.g., `https://via.placeholder.com/512x512/1e40af/ffffff?text=SR`)

## Notes

- All PNG files should be optimized (use tools like TinyPNG or ImageOptim)
- ICO file should contain multiple sizes (16x16, 32x32) for best compatibility
- Consider providing SVG favicon for modern browsers (add to `layout.tsx`)
- Update `site.webmanifest` if you change icon filenames
