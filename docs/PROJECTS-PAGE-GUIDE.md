# Projects Page - Elementor Setup Guide

This guide explains how to use the newly created Projects page with Elementor.

## What Was Created

### 1. Page Template
- **Location**: `wp-content/themes/astra/page-templates/projects-template.php`
- **Name**: "Projects - Elementor Full Width"
- **Purpose**: A clean, full-width template optimized for Elementor editing

### 2. Projects Page
- **Page ID**: 851
- **URL**: http://localhost:8118/sabarajendran/projects/
- **Status**: Published and ready to edit

### 3. Elementor Widget
- **Name**: "Projects Grid"
- **Category**: Saba Projects
- **Location**: Available in Elementor editor under "Saba Projects" category

## How to Design with Elementor

### Step 1: Open the Page in Elementor
1. Go to WordPress Admin: http://localhost:8118/sabarajendran/wp-admin/
2. Navigate to Pages → All Pages
3. Find "Projects" page
4. Click "Edit with Elementor"

**Or use this direct link:**
http://localhost:8118/sabarajendran/wp-admin/post.php?post=851&action=elementor

### Step 2: Add the Projects Grid Widget
1. In Elementor editor, click the "+" icon to add a new section
2. In the left panel, search for "Projects Grid"
3. Drag and drop the "Projects Grid" widget onto your page

### Step 3: Customize the Widget

#### Query Settings
- **Posts Per Page**: Number of projects to display (default: 12)
- **Category**: Filter by project category
- **Village**: Filter by village
- **Year**: Filter by year
- **Status**: Filter by project status
- **Order By**: Sort projects (Date, Title, Modified, Random, Menu Order)
- **Order**: Ascending or Descending

#### Layout Settings
- **Columns**: Responsive grid columns (Desktop/Tablet/Mobile)
- **Column Gap**: Space between columns
- **Row Gap**: Space between rows
- **Show Image**: Toggle project images
- **Show Excerpt**: Toggle project descriptions
- **Show Meta**: Toggle village/year/status badges

#### Style Settings
- **Background Color**: Card background
- **Border**: Card border style
- **Border Radius**: Rounded corners
- **Box Shadow**: Card shadow effect
- **Padding**: Content padding inside cards
- **Title Color**: Project title color
- **Title Typography**: Font settings for titles

## Features

### Responsive Design
The grid automatically adjusts:
- **Desktop**: 3 columns (customizable)
- **Tablet**: 2 columns (customizable)
- **Mobile**: 1 column (customizable)

### Project Card Components
Each project card displays:
- Featured image (if available)
- Project title
- Village name (blue badge)
- Year (purple badge)
- Status badge (color-coded)
  - Green: Completed
  - Orange: Ongoing/In Progress
  - Pink: Planned
- Project excerpt/description
- "View Details" link

### Hover Effects
- Cards lift on hover
- Images zoom slightly
- Smooth transitions

## Page Settings

The Projects page is pre-configured with:
- **Template**: Projects - Elementor Full Width
- **Layout**: Page Builder (Full Width)
- **Sidebar**: Disabled
- **Header**: Disabled (optional - can be re-enabled in Astra settings)
- **Footer**: Disabled (optional - can be re-enabled in Astra settings)

## Customization Tips

### 1. Create Multiple Project Grids
You can add multiple "Projects Grid" widgets on the same page:
- One for "Completed Projects"
- One for "Ongoing Projects"
- One for specific villages

### 2. Combine with Other Elementor Widgets
- Add headings, text, and images between project grids
- Use Elementor tabs to organize projects by category
- Add filters or search functionality

### 3. Modify the Template
If you need to customize the page template:
- Edit: `wp-content/themes/astra/page-templates/projects-template.php`

### 4. Customize Styles
To modify the default styling:
- Edit: `wp-content/plugins/saba-projects/assets/css/projects.css`

### 5. Modify the Widget
To change how the widget works:
- Edit: `wp-content/plugins/saba-projects/includes/widgets/class-projects-grid-widget.php`

## Troubleshooting

### Widget Not Showing
1. Make sure Elementor is installed and activated
2. Refresh the Elementor editor (Ctrl/Cmd + Shift + R)
3. Check that "Saba Rajendran Projects" plugin is active

### Projects Not Displaying
1. Verify that you have published projects in WordPress
2. Check the query filters in the widget settings
3. Try removing filters to show all projects

### Styling Issues
1. Clear WordPress cache
2. Clear browser cache
3. Regenerate CSS in Elementor: Elementor → Tools → Regenerate CSS

## Next Steps

### Design Ideas
1. **Hero Section**: Add a banner with title and description
2. **Statistics**: Show project counts using Elementor counter widgets
3. **Filters**: Add tabs or buttons to filter projects by category
4. **Map Integration**: Embed a map showing project locations
5. **Search**: Add a search box to find specific projects

### Content Strategy
1. Add featured images to all projects for better visual appeal
2. Write compelling excerpts for each project
3. Organize projects into logical categories
4. Keep status badges updated

## Files Created/Modified

1. `/wp-content/themes/astra/page-templates/projects-template.php` - Page template
2. `/wp-content/plugins/saba-projects/saba-projects.php` - Updated plugin file
3. `/wp-content/plugins/saba-projects/includes/elementor-widget.php` - Widget registration
4. `/wp-content/plugins/saba-projects/includes/widgets/class-projects-grid-widget.php` - Widget class
5. `/wp-content/plugins/saba-projects/assets/css/projects.css` - Styling
6. `/create-projects-page.php` - Setup script (can be deleted after use)

## Support

For questions or customization requests, refer to:
- Elementor documentation: https://elementor.com/help/
- Astra theme documentation: https://wpastra.com/docs/
- WordPress Codex: https://codex.wordpress.org/

---

**Created**: November 29, 2025
**WordPress Installation**: http://localhost:8118/sabarajendran/
