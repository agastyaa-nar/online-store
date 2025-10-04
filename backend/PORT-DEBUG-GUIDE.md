# 🔧 Railway Port Debug Guide

## 🚨 **Current Issue:**
Railway masih menggunakan port 8080 meskipun sudah ada konfigurasi untuk menggunakan `$PORT`.

## 🔍 **Debug Information dari Log:**
```
🚀 Starting Online Store Backend...
📡 Starting PHP server on port 8080
[Sat Oct 4 11:50:46 2025] PHP 8.4.13 Development Server (http://0.0.0.0:8080) started
```

## ✅ **New Solution Applied:**

### 1. **PHP Startup Script:**
- ✅ `start.php` - PHP script untuk handle environment variables
- ✅ `Procfile` - Menggunakan PHP script
- ✅ `railway.json` - Konfigurasi eksplisit

### 2. **Multiple PORT Sources:**
```php
$port = $_ENV['PORT'] ?? getenv('PORT') ?? $_SERVER['PORT'] ?? 3000;
```

### 3. **Enhanced Debugging:**
Script akan menampilkan:
- PORT dari $_ENV
- PORT dari getenv()
- PORT dari $_SERVER
- Final PORT yang digunakan

## 🚀 **Expected Output (Setelah Fix):**

```
🚀 Starting Online Store Backend...
🔍 Environment Debug:
PORT from $_ENV: [PORT_NUMBER]
PORT from getenv: [PORT_NUMBER]
PORT from $_SERVER: [PORT_NUMBER]
Final PORT: [PORT_NUMBER]

📡 Starting PHP server on port [PORT_NUMBER]
Command: php -S 0.0.0.0:[PORT_NUMBER]
[Sat Oct 4 12:00:00 2025] PHP 8.4.13 Development Server (http://0.0.0.0:[PORT_NUMBER]) started
```

## 📋 **Current File Configuration:**

```
backend/
├── index.php          # Main entry point
├── Procfile          # web: php start.php
├── start.php         # PHP startup script
├── start.sh          # Bash startup script (backup)
├── railway.json      # Railway configuration
└── config/           # Configuration files
```

## 🔧 **If Still Showing Port 8080:**

### Option 1: Check Railway Environment Variables
1. Go to Railway Dashboard
2. Select your service
3. Go to Variables tab
4. Check if PORT is automatically set by Railway

### Option 2: Manual PORT Setting
Add to Railway Variables:
```
PORT=3000
```

### Option 3: Use Different Approach
If PORT is still not working, we can:
1. Use a fixed port like 3000
2. Use Railway's automatic port detection
3. Use a different deployment strategy

## 🎯 **Next Steps:**

1. **Commit and Push:**
   ```bash
   git add .
   git commit -m "Add PHP startup script with enhanced PORT debugging"
   git push
   ```

2. **Check Railway Logs** for debug output

3. **If still port 8080**, we'll implement fallback strategy

**The enhanced debugging will help us identify exactly where the PORT issue is coming from! 🔍**
