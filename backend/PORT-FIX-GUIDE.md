# 🔧 Railway Port Fix Guide

## 🚨 **Problem Identified:**

Railway masih menggunakan port 8080 yang hardcoded, bukan menggunakan environment variable `$PORT`.

## ✅ **Solution Applied:**

### 1. **Removed Conflicting Files:**
- ❌ `nixpacks.toml` (was overriding Procfile)
- ❌ `railway.toml` (was causing conflicts)

### 2. **Created New Startup Script:**
- ✅ `start.sh` - Robust startup script
- ✅ `Procfile` - Uses startup script
- ✅ `debug-env.php` - Environment debugging

### 3. **Current Configuration:**
```
Procfile: web: bash start.sh
start.sh: php -S 0.0.0.0:$PORT
```

## 🚀 **Next Steps:**

### 1. **Commit and Push:**
```bash
git add .
git commit -m "Fix Railway port configuration - remove nixpacks conflict"
git push
```

### 2. **Railway will auto-redeploy** with new configuration

### 3. **Expected Log Output:**
```
🚀 Starting Online Store Backend...
📡 Starting PHP server on port [PORT_NUMBER]
[Sat Oct 4 12:00:00 2025] PHP 8.4.13 Development Server (http://0.0.0.0:[PORT_NUMBER]) started
```

## 🔍 **Debugging:**

### If still showing port 8080:
1. Check Railway logs for startup script output
2. Verify `start.sh` is executable
3. Check if PORT environment variable is set

### Test Environment Variables:
```bash
# In Railway console
php debug-env.php
```

## 📋 **Final File Structure:**
```
backend/
├── index.php          # Main entry point
├── Procfile          # web: bash start.sh
├── start.sh          # Startup script
├── debug-env.php     # Debug script
├── composer.json     # Dependencies
└── config/           # Configuration files
```

## 🎯 **Expected Result:**

Railway should now:
- ✅ Use dynamic PORT from environment
- ✅ Start server on correct port
- ✅ Show proper startup messages
- ✅ API endpoints accessible

**The port issue should be resolved now! 🚀**
