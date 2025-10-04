# 🚨 CORS Emergency Fix - Railway

## 🚨 **CRITICAL ISSUE:**
CORS header shows `http://localhost:8080` instead of `https://narr-online-store.vercel.app`

## ✅ **IMMEDIATE FIX:**

### 1. **Set Railway Environment Variables RIGHT NOW:**
Go to Railway Dashboard → Your Service → Variables tab

Copy and paste these EXACTLY (NO QUOTES):
```
APP_ENV=production
APP_DEBUG=false
ALLOWED_ORIGINS=https://narr-online-store.vercel.app
JWT_SECRET=33911246f950fff5a94a3019037ed569
SESSION_SECRET=0acfc38f3e38a01d5ddea8d16c7200a3
```

### 2. **Connect PostgreSQL Database:**
- Click "Connect Database" in Railway
- Select PostgreSQL service
- Railway will auto-generate DATABASE_URL

### 3. **Set Vercel Environment Variables:**
Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add:
```
VITE_API_BASE_URL=https://online-store-production-c330.up.railway.app
```

### 4. **Deploy Changes:**
```bash
git add .
git commit -m "Emergency CORS fix"
git push
```

## 🔍 **Debug CORS:**

### Test this URL:
```
https://online-store-production-c330.up.railway.app/cors-debug.php
```

### Check Railway Logs for:
```
CORS Debug - Origin: https://narr-online-store.vercel.app
CORS Debug - APP_ENV: production
CORS Debug - ALLOWED_ORIGINS: https://narr-online-store.vercel.app
CORS: Allowed origin: https://narr-online-store.vercel.app
```

## 🎯 **Expected Result:**

After setting environment variables and redeploying:
- ✅ CORS header should show: `Access-Control-Allow-Origin: https://narr-online-store.vercel.app`
- ✅ Frontend can access API
- ✅ No more CORS errors

## 🚨 **If Still Failing:**

### Option 1: Temporary Fix
Add to Railway Variables:
```
ALLOWED_ORIGINS=*
```

### Option 2: Check Environment Variables
1. Go to Railway Dashboard
2. Check if variables are set correctly
3. Restart deployment

### Option 3: Debug
Visit: `https://online-store-production-c330.up.railway.app/cors-debug.php`

**This should fix the CORS issue immediately! 🚀**
