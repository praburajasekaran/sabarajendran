# Quick Start Guide - Saba Rajendran Projects Website

**Get Started in 5 Minutes!**

---

## 🚀 Step 1: Import Your Project Data (2 minutes)

```bash
# Open Terminal and navigate to plugin directory
cd /Applications/MAMP/htdocs/sabarajendran/wp-content/plugins/saba-projects/

# Run the import script
php import-projects.php
```

**Watch for**:
- Progress dots appearing
- Final count of imported projects
- Any error messages

---

## 🔍 Step 2: View Your Projects (1 minute)

**Open in browser**:
```
http://localhost:8888/sabarajendran/project/
```

**You should see**:
- Project cards in a grid
- Filter dropdowns (Village, Category, Year, Status)
- Search box
- Project count

---

## ✅ Step 3: Test the Filters (1 minute)

1. **Select a Village** → Projects filter instantly
2. **Type in Search** → Results update as you type
3. **Click Reset** → All projects show again
4. **Click any project** → Opens detail page

---

## 👨‍💼 Step 4: Check WordPress Admin (1 minute)

```
http://localhost:8888/sabarajendran/wp-admin/
```

**Navigate to**:
- `Projects > All Projects` - See all imported projects
- `Projects > Villages` - See all villages
- `Projects > Categories` - See work categories
- `Projects > Add New` - Try adding a test project

---

## 🎨 What You Get

### Frontend Features ✅
- ✅ Responsive project grid
- ✅ Real-time AJAX filtering (no page reload)
- ✅ Search functionality
- ✅ Individual project pages
- ✅ Social sharing buttons
- ✅ Mobile-responsive design
- ✅ DMK branding colors

### Admin Features ✅
- ✅ Easy project management
- ✅ Custom fields for budget, descriptions
- ✅ Taxonomy management
- ✅ Bulk import from CSV
- ✅ Featured image support

---

## 📁 Key Files & Locations

| What | Where |
|------|-------|
| **Project Archive Page** | `/wp-content/themes/saba-rajendran/archive-project.php` |
| **Single Project Page** | `/wp-content/themes/saba-rajendran/single-project.php` |
| **AJAX Filter Script** | `/wp-content/themes/saba-rajendran/js/scripts.js` |
| **Import Script** | `/wp-content/plugins/saba-projects/import-projects.php` |
| **Styles** | `/wp-content/themes/saba-rajendran/style.css` |
| **CSV Data** | `/projects_data.csv` |

---

## 🆘 Troubleshooting

### Import Not Working?
```bash
# Check file exists
ls -la /Applications/MAMP/htdocs/sabarajendran/projects_data.csv

# Check you're logged into WordPress as admin
# Then run import again
```

### Filters Not Working?
1. Open browser console (F12)
2. Look for JavaScript errors
3. Refresh page and try again
4. Clear browser cache

### Can't See Projects?
1. Check WordPress admin > Projects > All Projects
2. Make sure projects are "Published" not "Draft"
3. Clear cache (if caching plugin active)

---

## 📚 Full Documentation

- **Detailed Implementation**: `IMPLEMENTATION-SUMMARY.md`
- **Next Steps**: `NEXT-STEPS.md`
- **Project TODO**: `TODO.md`

---

## 💡 Quick Tips

1. **Adding Projects**: Use the CSV import for bulk, or add manually via admin
2. **Customizing Colors**: Edit `style.css` variables at the top
3. **Adding Logo**: Go to Appearance > Customize > Site Identity
4. **Performance**: Keep images under 500KB, use cache plugin
5. **Backup**: Always backup before major changes

---

## 🎯 What's Next?

**Priority Tasks**:
1. ✅ Import data (you just did this!)
2. ⏳ Install Polylang for Tamil/English
3. ⏳ Add project images
4. ⏳ Configure caching
5. ⏳ Test on mobile

See `NEXT-STEPS.md` for complete Week 2 roadmap.

---

## ✨ Features Delivered

**Total Value**: ₹65,000 (63% of project)

- ✅ Custom theme with DMK branding (₹25,000)
- ✅ Real-time AJAX filtering (₹20,000)
- ✅ CSV import script (₹15,000)
- ✅ Social sharing (₹5,000)

**Coming Next**:
- ⏳ Bilingual support (₹12,000)
- ⏳ Image galleries (₹8,000)
- ⏳ Training session (₹8,000)

---

**Need Help?** Check the detailed documentation or contact support.

**Enjoy your new project portal! 🎉**
