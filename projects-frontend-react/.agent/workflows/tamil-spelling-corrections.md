---
description: Apply Tamil spelling corrections to local and live sites
---

# Tamil Spelling Corrections Workflow

This workflow ensures Tamil spelling corrections are reliably applied to project titles, village names, and panchayat names across both local and live sites.

---

## Step 1: Add New Spelling Corrections

Edit the corrections file:
```
projects-frontend-react/scripts/tamil-spelling-corrections.ts
```

Add your corrections to the `tamilSpellingCorrections` object:
```typescript
'incorrect_spelling': 'correct_spelling',
```

**Important:** These corrections apply to:
- Village names (taxonomy terms)
- Panchayat names (taxonomy terms)
- Project titles (post titles and meta fields)

---

## Step 2: Apply Corrections to Local WordPress Database

Run the PHP sync script to update your local WordPress database:

```bash
cd /Applications/MAMP/htdocs/sabarajendran
php scripts/sync-spellings.php
```

This script:
- Reads corrections from `tamil-spelling-corrections.ts`
- Updates WordPress database (wp_terms, wp_termmeta, wp_postmeta)
- Applies corrections to both Tamil and English fields

---

## Step 3: Regenerate Projects JSON

Generate the updated `projects.json` file from the corrected database:

```bash
cd /Applications/MAMP/htdocs/sabarajendran/projects-frontend-react
npm run generate-projects
```

This creates/updates: `public/data/projects.json`

---

## Step 4: Verify Changes Locally

Check your local site to verify corrections:
```
http://localhost:3003
```

Browse through projects to ensure village names and titles are corrected.

---

## Step 5: Commit and Push to GitHub (v3 branch)

Stage and commit your changes:

```bash
cd /Applications/MAMP/htdocs/sabarajendran/projects-frontend-react
git add scripts/tamil-spelling-corrections.ts
git add public/data/projects.json
git commit -m "Add Tamil spelling corrections for [describe changes]"
git push origin v3
```

---

## Step 6: Apply Corrections to Live WordPress Database

SSH into your live server:

```bash
ssh -p 65002 u435443401@93.127.208.236
```

Navigate to the WordPress directory and run the sync script:

```bash
cd domains/sabarajendran.com/public_html
php scripts/sync-spellings.php
```

**Note:** Make sure the `sync-spellings.php` script is uploaded to the live server first.

---

## Step 7: Deploy Frontend to Live Site

Deploy the updated React frontend (with corrected `projects.json`):

```bash
# This depends on your deployment method
# Usually via Netlify, Vercel, or manual deployment
```

If using Netlify/Vercel, the push to v3 branch should trigger auto-deployment.

---

## Quick Reference

### Local Development Flow:
1. Edit `tamil-spelling-corrections.ts`
2. Run `php scripts/sync-spellings.php` (in WordPress root)
3. Run `npm run generate-projects` (in React project)
4. Verify at `http://localhost:3003`

### Deployment Flow:
1. Commit and push to GitHub v3 branch
2. SSH to live server
3. Run `php scripts/sync-spellings.php` on live database
4. Frontend auto-deploys (or manually deploy)

---

## Troubleshooting

**Corrections not appearing?**
- Check exact spelling in database using `verify-all-spellings.php`
- Unicode variations may require multiple correction entries

**Database not updating?**
- Verify `sync-spellings.php` has correct database credentials
- Check PHP error logs

**Frontend not showing changes?**
- Clear browser cache
- Verify `projects.json` was regenerated
- Check dev server is running with latest code
