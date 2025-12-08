# Local Development Setup Guide

This guide helps you set up the project on any computer (home, office, etc.) without port conflicts.

## 🎯 The Problem

Different computers may have different port configurations:
- **Office Computer**: MAMP on port 8888, React on 3003
- **Home Computer**: MAMP on port 8080, React on 3000
- **Laptop**: MAMP on port 8118, React on 3004

Manually changing ports each time is tedious and error-prone.

## ✅ The Solution

Each computer has its own `.env.development` file that is **NOT** synced to Git. This way:
- Code changes sync between computers via Git
- Port configurations stay local to each machine

---

## 🚀 Quick Setup (Recommended)

### Option 1: Automated Setup Script

Run the setup script that auto-detects your ports:

```bash
cd projects-frontend-react
./setup-local-env.sh
```

The script will:
1. ✅ Auto-detect your MAMP Apache port
2. ✅ Auto-detect your MySQL port
3. ✅ Read your React port from vite.config.ts
4. ✅ Create .env.development with correct configuration

Then just run:
```bash
npm install
npm run dev
```

### Option 2: Manual Setup

1. Copy the example file:
   ```bash
   cp .env.example .env.development
   ```

2. Edit `.env.development` and update the ports:
   ```env
   VITE_WP_API_URL=http://localhost:XXXX/sabarajendran/index.php?rest_route=/wp/v2
   VITE_SITE_URL=http://localhost:YYYY
   ```

   Replace:
   - `XXXX` = Your MAMP Apache port (check MAMP preferences)
   - `YYYY` = Your React dev server port (check `vite.config.ts`)

3. Run the app:
   ```bash
   npm install
   npm run dev
   ```

---

## 🔍 Finding Your Ports

### MAMP Apache Port
1. Open MAMP application
2. Click "Preferences" > "Ports"
3. Look for "Apache Port" (usually 8888, 8080, or 8118)

### MAMP MySQL Port
- Usually **8889** (standard MAMP default)

### React Dev Server Port
- Check `vite.config.ts` in the project
- Look for `server: { port: 3003 }`

---

## 📁 File Structure

```
projects-frontend-react/
├── .env.example              # Template (committed to Git)
├── .env.development          # Your local config (NOT in Git)
├── .env.production           # Production config (committed to Git)
├── setup-local-env.sh        # Auto-setup script
└── LOCAL-SETUP-GUIDE.md      # This file
```

---

## 🔄 Syncing Code Between Computers

### When you push code from Office:
```bash
git add .
git commit -m "Updated feature X"
git push
```

Your `.env.development` stays on the office computer (not pushed).

### When you pull code at Home:
```bash
git pull
```

Your home `.env.development` is preserved (not overwritten).

### First time on a new computer:
```bash
git clone <repository>
cd projects-frontend-react
./setup-local-env.sh  # Creates .env.development for this computer
npm install
npm run dev
```

---

## 🛠️ Changing Ports Later

If you need to change MAMP ports later:

1. **Option A**: Re-run the setup script
   ```bash
   ./setup-local-env.sh
   ```

2. **Option B**: Manually edit `.env.development`
   ```bash
   nano .env.development
   ```

Then restart the dev server:
```bash
npm run dev
```

---

## ⚠️ Important Notes

1. **Never commit** `.env.development` to Git
   - It's already in `.gitignore`
   - Each computer should have its own

2. **Always use** the setup script on a new computer
   - Saves time
   - Prevents configuration errors

3. **WordPress also needs configuration**
   - Update `wp-config.php` database settings if MySQL port changes
   - Update WordPress site URLs in database if Apache port changes

---

## 🐛 Troubleshooting

### Problem: "Loading MLA Portal..." stuck

**Solution**: Port mismatch. Check your configuration:

```bash
# Check what port React is running on
lsof -iTCP -sTCP:LISTEN -P | grep node

# Check what port MAMP is running on
lsof -iTCP -sTCP:LISTEN -P | grep httpd

# Verify your .env.development matches
cat .env.development
```

### Problem: Can't connect to API

**Solution**: Check WordPress is accessible:

```bash
# Test the API endpoint
curl http://localhost:XXXX/sabarajendran/index.php?rest_route=/wp/v2/project\&per_page=1
```

Replace `XXXX` with your MAMP Apache port.

### Problem: Setup script doesn't detect ports

**Solution**: Make sure MAMP is running first, then:

1. Start MAMP
2. Run the setup script again
3. Or manually configure `.env.development`

---

## 📞 Need Help?

If you're still having issues:

1. Check that MAMP is running
2. Verify WordPress is accessible at `http://localhost:XXXX/sabarajendran/`
3. Check browser console for errors
4. Verify `.env.development` exists and has correct ports

---

## 🎓 Understanding the Setup

### Why `.env.development`?

Vite (our build tool) loads environment variables from:
1. `.env` - Base config (committed)
2. `.env.development` - Development overrides (NOT committed)
3. `.env.production` - Production config (committed)

Variables must start with `VITE_` to be exposed to the app.

### How does it work?

```javascript
// In your React code
const apiUrl = import.meta.env.VITE_WP_API_URL;
// Vite replaces this with the value from .env.development
```

This means each computer can have different API URLs without changing code!

---

**Last Updated**: December 2025
