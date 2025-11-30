# Security Plugins Activation & Configuration Guide

**Follow these steps in order**

---

## STEP 1: Activate All Security Plugins

### In WordPress Admin (http://localhost:8118/sabarajendran/wp-admin/plugins.php):

1. Find and click **"Activate"** under each of these plugins:
   - ✅ Wordfence Security
   - ✅ iThemes Security (Better WP Security)
   - ✅ Limit Login Attempts Reloaded

---

## STEP 2: Configure Wordfence Security

### After activation, Wordfence will show a setup wizard:

#### Initial Setup:
1. Click **"Get Started"** or go to **Wordfence → Dashboard**
2. **Email Address:** Enter your admin email for security alerts
3. **License:** Select **"No Thanks, use Free Version"** (or enter Premium key if you have one)

#### Essential Settings:

**A. Firewall Configuration:**
1. Go to **Wordfence → Firewall**
2. Click **"Manage Firewall"**
3. Set **Protection Level: Extended Protection** (or Learning Mode if Extended not available yet)
4. Enable **"Web Application Firewall"**
5. Click **"Optimize the Wordfence Firewall"** button

**B. Scan Configuration:**
1. Go to **Wordfence → Scan**
2. Click **"Start New Scan"** (let it complete - this is your baseline)
3. Enable **"Schedule Scans"** → Set to **Daily at 2:00 AM**

**C. Login Security:**
1. Go to **Wordfence → Login Security**
2. Enable **"Login Page CAPTCHA"**
3. Enable **"Enforce Strong Passwords"** for Administrators
4. Set **"Max Login Failures"** to **3**
5. Set **"Lockout Duration"** to **60 minutes**

**D. Alerts Configuration:**
1. Go to **Wordfence → Tools → Global Options**
2. Scroll to **"Email Alert Preferences"**
3. Enable these alerts:
   - ✅ Login attempts exceeded
   - ✅ New plugin activated
   - ✅ New user created
   - ✅ Scan found critical issues
   - ✅ Security update available
4. Click **"Save Changes"**

---

## STEP 3: Configure iThemes Security

### After activation, iThemes will show a setup wizard:

#### Security Check (Recommended):
1. Go to **Security → Dashboard**
2. Click **"Secure Site"** or **"Security Check"**
3. Review each recommendation
4. Click **"Secure Site"** to apply recommended settings

#### Manual Configuration (if wizard doesn't appear):

**A. Global Settings:**
1. Go to **Security → Settings → Global Settings**
2. **Notification Email:** Enter your admin email
3. Enable **"Digest Email"** → Daily summary
4. Save

**B. Banned Users:**
1. Go to **Security → Settings → Banned Users**
2. Enable **"Default Blacklist"** (blocks known bad IPs)
3. Enable **"HoneyPot"** (catches bots)
4. Save

**C. Local Brute Force Protection:**
1. Go to **Security → Settings → Local Brute Force Protection**
2. **Max Login Attempts:** 3
3. **Minutes to Remember:** 60
4. Enable **"Ban Repeat Offender"**
5. Save

**D. Network Brute Force Protection:**
1. Go to **Security → Settings → Network Brute Force Protection**
2. Click **"Register for Network Protection"** (free)
3. Enter your email
4. Enable **"Network Brute Force Protection"**
5. Save

**E. Hide Login Area:**
1. Go to **Security → Settings → Hide Login Area**
2. **Custom Login Slug:** Enter something unique (e.g., `saba-admin-2025`)
3. **Remember:** Your new login URL will be:
   `http://localhost:8118/sabarajendran/saba-admin-2025`
4. ⚠️ **WRITE THIS DOWN!** You'll need this to login from now on
5. Save

**F. File Change Detection:**
1. Go to **Security → Settings → File Change Detection**
2. Enable **"File Change Detection"**
3. Click **"Start File Scan Now"** (creates baseline)
4. Save

**G. Strong Password Enforcement:**
1. Go to **Security → Settings → Strong Password Enforcement**
2. Enable for **Administrators** and **Editors**
3. Save

---

## STEP 4: Configure Limit Login Attempts Reloaded

### Basic Configuration:

1. Go to **Settings → Limit Login Attempts**

2. **Lockout Settings:**
   - **Allowed retries:** 3
   - **Minutes lockout:** 60
   - **Hours until retries reset:** 12
   - **Maximum lockouts:** 4
   - **Lockout for:** 24 hours

3. **Notifications:**
   - Enable **"Notify on lockout"**
   - **Notify after:** 1 lockout
   - Enter your admin email

4. **GDPR Compliance:**
   - Enable **"GDPR compliance"** (if handling EU visitors)

5. Click **"Save Settings"**

---

## STEP 5: Verify All Plugins Are Active

### Check Plugin Status:
1. Go to **Plugins → Installed Plugins**
2. Verify these are **Active**:
   - ✅ Wordfence Security
   - ✅ iThemes Security
   - ✅ Limit Login Attempts Reloaded
   - ✅ Elementor
   - ✅ Rank Math SEO
   - ✅ WP Super Cache
   - ✅ ManageWP Worker
   - ✅ Contact Form 7

---

## STEP 6: Test Security Configuration

### A. Test Login Protection:

1. **Open an incognito/private browser window**
2. Go to your site: `http://localhost:8118/sabarajendran/`
3. Try to access: `http://localhost:8118/sabarajendran/wp-admin`
4. **If you set up Hide Login Area:**
   - The wp-admin URL should redirect you away
   - Access via your custom URL instead
5. **Try intentionally wrong password 3 times**
6. Verify you get locked out
7. Check you received lockout email

### B. Test Firewall:

1. Go to **Wordfence → Tools → Diagnostic**
2. Look for **"Firewall Status"** → Should show **"Extended Protection"** or **"Learning Mode"**
3. Check **"Protection Level"** → Should be green

### C. Test File Change Detection:

1. Go to **Security → Dashboard** (iThemes)
2. Check **"File Change"** status → Should show scan completed
3. Go to **Wordfence → Scan**
4. Verify scan completed with no threats

---

## STEP 7: Configure WP Super Cache

1. Go to **Settings → WP Super Cache**
2. Select **"Caching On (Recommended)"**
3. Click **"Update Status"**
4. Click **"Test Cache"** button
5. Verify you see success message
6. Go to **Advanced** tab
7. Enable these:
   - ✅ Compress pages
   - ✅ Cache rebuild
   - ✅ 304 browser caching
8. Click **"Update Status"**

---

## STEP 8: Important Notes & Warnings

### ⚠️ CRITICAL - Write These Down:

1. **New Login URL (if you set custom slug):**
   - Example: `http://localhost:8118/sabarajendran/saba-admin-2025`
   - **Old wp-admin URL will NOT work**

2. **Admin Email for Alerts:**
   - Make sure this email is actively monitored
   - Check spam folder for security alerts

3. **Lockout Recovery:**
   - If you get locked out, wait 60 minutes OR
   - Access via FTP/MAMP and rename the plugins folder temporarily

### 📧 Expected Emails After Setup:

You should receive:
- Wordfence activation confirmation
- iThemes Security activation
- Network Brute Force Protection registration
- Limit Login Attempts settings confirmation

### 🔍 Daily Security Routine:

- Check **Wordfence → Dashboard** for alerts
- Review **Security → Dashboard** (iThemes)
- Check lockout log in **Limit Login Attempts**

---

## STEP 9: Run Initial Security Scan

### Wordfence Full Scan:
1. Go to **Wordfence → Scan**
2. Click **"Start New Scan"**
3. Wait for completion (5-15 minutes)
4. Review results
5. Fix any issues found

### iThemes Security Check:
1. Go to **Security → Dashboard**
2. Review all security metrics
3. Address any yellow or red warnings

---

## STEP 10: Document Your Settings

### Record These Details:

```
Date Configured: _______________
Custom Login URL: _______________
Admin Email: _______________
Lockout Settings: 3 attempts, 60 min lockout
Wordfence Protection: Extended/Learning
File Change Detection: Enabled
Two-Factor Auth: Not yet enabled (TODO)
SSL Certificate: Not yet installed (TODO)
```

---

## TROUBLESHOOTING

### Problem: Can't access wp-admin after hiding login area
**Solution:** Access your custom login URL that you set in iThemes Security

### Problem: Locked out after 3 failed attempts
**Solution:** Wait 60 minutes, or access MAMP and temporarily rename the plugins folder

### Problem: Wordfence scan shows issues
**Solution:** Review each issue carefully. Most can be safely resolved by clicking "Delete" or "Repair"

### Problem: Site running slow after activation
**Solution:**
1. Clear WP Super Cache
2. Disable Wordfence real-time scanning temporarily
3. Increase PHP memory limit if needed

### Problem: Not receiving email alerts
**Solution:**
1. Check spam folder
2. Test WordPress email: **Tools → Site Health → Info → Server**
3. Consider installing WP Mail SMTP plugin

---

## COMPLETION CHECKLIST

After completing all steps above, verify:

- [ ] All security plugins activated
- [ ] Wordfence firewall enabled
- [ ] Wordfence baseline scan completed
- [ ] iThemes Security configured
- [ ] Limit Login Attempts set to 3/60
- [ ] WP Super Cache enabled and tested
- [ ] Custom login URL documented (if set)
- [ ] Email alerts configured and tested
- [ ] Test login lockout successful
- [ ] All plugin updates applied

---

## NEXT SECURITY STEPS (After Site Development)

1. **Install SSL Certificate** (before going live)
2. **Enable Two-Factor Authentication**
3. **Set up Cloudflare** (DDoS protection)
4. **Configure UpdraftPlus Backups** (daily)
5. **Change database table prefix** from wp_
6. **Create database-specific user** (not root)
7. **Enable FORCE_SSL_ADMIN** in wp-config.php
8. **Uncomment HTTPS redirect** in .htaccess

---

**Security Configuration Time: 10-15 minutes**
**Status: Ready to build website features securely**

---

*Generated: November 29, 2025*
*For: Saba Rajendran MLA Website*
*Version: 1.0*
