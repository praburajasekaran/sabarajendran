# Netlify Auto-Deploy Webhook System

## Overview

This system automatically triggers Netlify deployments whenever content changes in WordPress, with intelligent **5-minute debouncing** to prevent excessive builds during bulk operations.

---

## Features

✅ **Automatic Deployment Triggers** - Monitors all content changes:
- Projects created/updated/deleted
- Project meta fields updated (titles, descriptions, budget)
- Translation completions (Tamil/English)
- Taxonomy term changes (villages, blocks, panchayats, types, statuses)
- Bulk translation operations

✅ **Smart Debouncing** - Prevents build spam:
- 5-minute cooldown after any change
- Timer resets if more changes occur
- Bulk operations trigger only one build after completion

✅ **Admin Dashboard** - Full control panel:
- Configure webhook URL
- Enable/disable auto-deploy
- Manual "Deploy Now" button
- Deployment log viewer
- Real-time statistics

✅ **Comprehensive Logging** - Track all deployment activity:
- Success/failure tracking
- Deployment reasons
- Timestamp history
- Error details

---

## Setup Instructions

### Step 1: Get Your Netlify Build Hook URL

1. Open your Netlify dashboard: [https://app.netlify.com](https://app.netlify.com)
2. Select your site: **gilded-scone-a9737b**
3. Navigate to: **Site Settings → Build & Deploy → Build Hooks**
4. Click **"Add build hook"**
5. Configure the hook:
   - **Name:** `WordPress Auto Deploy`
   - **Branch:** `main` (or your deploy branch)
6. Click **"Save"**
7. **Copy** the generated URL (format: `https://api.netlify.com/build_hooks/...`)

### Step 2: Configure WordPress Plugin

1. In WordPress admin, go to: **Projects → Netlify Deploy**
2. Paste your build hook URL in the **"Netlify Build Hook URL"** field
3. Check **"Enable automatic Netlify deployments"**
4. Click **"Save Settings"**

### Step 3: Verify Setup

1. Make a small change to any project (e.g., edit title)
2. Check the **Deployment Log** - you should see "scheduled" entry
3. Wait 5 minutes (or click **"Deploy Now"** to bypass timer)
4. Log should show "triggered" entry
5. Check your Netlify dashboard for the build

---

## How It Works

### Debouncing Logic

```
Change Detected → Start 5-min Timer → Another Change? → Reset Timer
                                   ↓
                              No more changes
                                   ↓
                         Trigger Netlify Build
```

**Example Scenarios:**

| Action | Behavior |
|--------|----------|
| Edit 1 project | Wait 5 min → 1 build |
| Edit 3 projects rapidly | Wait 5 min after last edit → 1 build |
| Translate 50 villages | Wait 5 min after completion → 1 build |
| Manual "Deploy Now" | Immediate build (bypasses timer) |

### What Triggers Deployments

**Post Changes:**
- `save_post` - Project created/updated
- `transition_post_status` - Published/unpublished
- `before_delete_post` - Project deleted

**Meta Changes:**
- `updated_post_meta` - Translations, budget updated
- `added_post_meta` - New meta fields added
- `deleted_post_meta` - Meta fields removed

**Taxonomy Changes:**
- `created_term` / `edited_term` / `deleted_term` - Village, block, panchayat changes
- `updated_term_meta` / `added_term_meta` - Village translations

**Custom Actions:**
- `saba_translation_completed` - Single translation finished
- `saba_bulk_translation_completed` - Bulk translation finished

---

## Admin Interface

### Configuration Tab

- **Webhook URL:** Your Netlify build hook endpoint
- **Auto-Deploy Toggle:** Enable/disable automatic deployments
- **Save Button:** Persist settings

### Manual Deployment

- **Deploy Now Button:** Trigger immediate build (bypasses 5-min timer)
- Useful for urgent updates or testing

### Statistics Panel

- **Total Deployments:** Count of successful builds
- **Success/Failure Count:** Track reliability
- **Last Deployment:** Most recent build timestamp
- **Current Status:** Active/Pending/Disabled/Not Configured

### Deployment Log

- **Last 20 Events:** Chronological history
- **Event Types:** 
  - ✓ Success (triggered)
  - ⏳ Scheduled (pending)
  - ✗ Error (failed)
- **Messages:** Reason for each deployment
- **Timestamps:** Human-readable relative times
- **Clear Log Button:** Reset history

---

## Testing Checklist

### ✅ Single Edit Test
1. Edit a project title
2. Verify "scheduled" log entry appears
3. Wait 5 minutes
4. Verify "triggered" log entry appears
5. Check Netlify dashboard for build

### ✅ Debouncing Test
1. Edit project #1
2. Within 5 minutes, edit project #2
3. Within 5 minutes, edit project #3
4. Wait 5 minutes after last edit
5. Verify only **one** build triggered

### ✅ Bulk Translation Test
1. Go to **Projects → Translation**
2. Click **"Translate All Villages"**
3. Wait for bulk operation to complete
4. Verify deployment scheduled
5. Wait 5 minutes
6. Verify only **one** build triggered

### ✅ Manual Deploy Test
1. Click **"Deploy Now"** button
2. Verify immediate deployment (no 5-min wait)
3. Check Netlify dashboard

### ✅ Taxonomy Change Test
1. Add a new village term
2. Verify deployment scheduled
3. Edit village name (translation)
4. Verify timer resets

### ✅ Disabled Mode Test
1. Uncheck **"Enable auto-deploy"**
2. Save settings
3. Edit a project
4. Verify no deployment scheduled

---

## Troubleshooting

### ❌ "Netlify webhook not configured" Error

**Solution:** 
1. Check that webhook URL is saved
2. Ensure URL format is correct: `https://api.netlify.com/build_hooks/[hash]`
3. Verify URL in Netlify dashboard still exists

### ❌ "Webhook request failed" Error

**Possible Causes:**
- Incorrect webhook URL
- Netlify build hook deleted
- Network connectivity issues

**Solution:**
1. Copy webhook URL from Netlify dashboard
2. Re-paste in WordPress settings
3. Click "Deploy Now" to test

### ❌ Builds Not Triggering

**Check:**
1. Is auto-deploy **enabled**?
2. Is webhook URL **configured**?
3. Check deployment log for errors
4. Verify Netlify site is not paused

### ⏳ Deployment Stuck in "Scheduled"

**This is normal!** Wait 5 minutes of inactivity. If it persists:
1. Check WP Cron is working: Install "WP Crontrol" plugin
2. Look for scheduled event: `saba_trigger_netlify_deploy`
3. Manually trigger from WP Crontrol if needed

---

## File Structure

```
wp-content/plugins/saba-projects/includes/
├── class-netlify-webhook.php      # Core webhook manager
├── netlify-hooks.php               # WordPress action hooks
└── admin-netlify-settings.php     # Admin UI
```

**Modified Files:**
- `saba-projects.php` - Includes new files
- `class-translation-service.php` - Added deployment triggers
- `admin-translation.php` - Added bulk translation trigger

---

## API Reference

### Webhook Manager Class

```php
$webhook = Saba_Netlify_Webhook::get_instance();

// Schedule deployment (with debouncing)
$webhook->schedule_deployment('Reason for deployment');

// Trigger immediately
$result = $webhook->trigger_deployment_now();

// Check if queued
$pending = $webhook->is_deployment_queued();

// Get/set configuration
$url = $webhook->get_webhook_url();
$webhook->set_webhook_url($url);

$enabled = $webhook->is_auto_deploy_enabled();
$webhook->set_auto_deploy_enabled(true);

// Get logs and stats
$log = $webhook->get_deployment_log(20);
$stats = $webhook->get_statistics();
```

### Custom Actions

```php
// Single translation completed
do_action('saba_translation_completed', $object_id, $type);

// Bulk translation completed
do_action('saba_bulk_translation_completed', array(
    'translated' => 50,
    'skipped' => 10,
    'errors' => 2
));
```

---

## WordPress Options Stored

| Option Key | Value | Description |
|------------|-------|-------------|
| `saba_netlify_webhook_url` | String | Netlify build hook URL |
| `saba_netlify_auto_deploy_enabled` | Boolean | Auto-deploy on/off |
| `saba_netlify_deployment_log` | Array | Last 50 deployment events |

**Transient:**
- `saba_netlify_deployment_pending` - Tracks pending deployment (5-min expiry)

**Cron:**
- `saba_trigger_netlify_deploy` - Single event scheduled for deployment

---

## Performance Notes

- **Debouncing prevents excessive builds** during bulk operations
- **Minimal performance impact** - hooks only fire on actual changes
- **No frontend impact** - all code runs in admin/cron context
- **Efficient logging** - limited to 50 entries, auto-pruned

---

## Security

✅ **Nonce verification** on all form submissions  
✅ **Capability checks** - `manage_options` required  
✅ **URL sanitization** - `esc_url_raw()` on webhook URL  
✅ **HTTPS only** - Netlify webhooks use secure endpoints  

---

## Future Enhancements (Optional)

- Email notifications on deployment success/failure
- Slack/Discord webhook integration
- Custom debounce timing (configurable delay)
- Deployment queue prioritization
- Build status tracking via Netlify API
- Conditional deployments (deploy only on specific changes)

---

## Support

For issues or questions:
1. Check the **Deployment Log** in WordPress admin
2. Verify webhook URL in Netlify dashboard
3. Test with **"Deploy Now"** button
4. Check WordPress error logs
5. Review Netlify build logs

---

## Changelog

**Version 1.0.0** (Initial Release)
- ✅ Automatic deployment triggers
- ✅ 5-minute debouncing
- ✅ Admin settings interface
- ✅ Manual deploy button
- ✅ Comprehensive logging
- ✅ Statistics tracking
- ✅ Translation integration






