# 🚀 CORS Quick Fix - InfinityFree

## ❌ **Error yang Terjadi:**
```
Access to fetch at 'https://personal-web1.lovestoblog.com/auth.php?action=me' 
from origin 'https://narr-online-store.vercel.app' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present
```

## 🔍 **Root Cause:**
1. Frontend mengakses `.php` files langsung (auth.php, products.php)
2. CORS headers tidak muncul karena tidak melalui index.php
3. .htaccess belum diupload atau tidak bekerja

## ✅ **Quick Fix Steps:**

### Step 1: Upload .htaccess File
**Upload file `.htaccess` ke root `htdocs/` di InfinityFree:**

```apache
RewriteEngine On

# Force all requests through index.php for proper CORS handling
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^(.*)$ index.php [QSA,L]

# Handle specific API endpoints
RewriteRule ^auth\.php$ index.php [QSA,L]
RewriteRule ^products\.php$ index.php [QSA,L]
RewriteRule ^categories\.php$ index.php [QSA,L]
RewriteRule ^cart\.php$ index.php [QSA,L]
RewriteRule ^orders\.php$ index.php [QSA,L]

# Block direct access to sensitive folders
RewriteCond %{REQUEST_URI} ^/(config|database|\.env)
RewriteRule ^(.*)$ - [F,L]
```

### Step 2: Create .env File
**Create file `.env` di root `htdocs/` dengan content:**

```env
APP_ENV=production
APP_DEBUG=false
ALLOWED_ORIGINS=https://narr-online-store.vercel.app
DB_CONNECTION=mysql
DB_HOST=sql212.infinityfree.com
DB_PORT=3306
DB_DATABASE=if0_40027650_online_store
DB_USERNAME=if0_40027650
DB_PASSWORD=your-actual-password-here
JWT_SECRET=your-jwt-secret-here-32-characters-minimum
SESSION_SECRET=your-session-secret-here-32-characters-minimum
```

### Step 3: Update Frontend API URL
**Update di Vercel Environment Variables:**
```
VITE_API_BASE_URL=https://personal-web1.lovestoblog.com
```

### Step 4: Test API
**Test these URLs:**
1. `https://personal-web1.lovestoblog.com/` ✅ Should return JSON
2. `https://personal-web1.lovestoblog.com/products` ✅ Should return products JSON
3. `https://personal-web1.lovestoblog.com/auth?action=me` ✅ Should return auth response

## 🎯 **Expected Results:**

After fixes:
- ✅ No more CORS errors
- ✅ API returns JSON responses
- ✅ Frontend can connect to API
- ✅ All endpoints work through index.php

## 📋 **Verification Checklist:**

- [ ] `.htaccess` file uploaded to root `htdocs/`
- [ ] `.env` file created with correct values
- [ ] Frontend API URL updated in Vercel
- [ ] Test API endpoints return JSON
- [ ] No more CORS errors in browser console

## 🔧 **If Still Not Working:**

1. **Check .htaccess is uploaded** - File should be in root `htdocs/`
2. **Check .env file exists** - Should be in root `htdocs/`
3. **Check InfinityFree supports .htaccess** - Some free hosts don't
4. **Try direct access** - `https://personal-web1.lovestoblog.com/` should return JSON

**CORS errors should be fixed after uploading .htaccess! 🚀**
