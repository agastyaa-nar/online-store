# 🔧 Railway Troubleshooting Guide

## 🚨 **Masalah yang Sering Terjadi:**

### 1. **Port Configuration Issues**
**Problem:** PHP server berjalan di port 8080 tapi Railway menggunakan port dinamis
**Solution:** ✅ Sudah diperbaiki dengan:
- `Procfile`: `web: php -S 0.0.0.0:${PORT:-3000}`
- `nixpacks.toml`: Fallback port configuration

### 2. **Environment Variables Not Loading**
**Problem:** Environment variables tidak terbaca
**Solution:**
- Pastikan format tanpa tanda kutip: `APP_ENV=production`
- Check di Railway Dashboard → Variables tab
- Restart deployment setelah mengubah variables

### 3. **Database Connection Failed**
**Problem:** Database tidak bisa connect
**Solution:**
- Connect PostgreSQL service di Railway
- Pastikan DATABASE_URL otomatis ter-generate
- Atau set manual database variables

### 4. **CORS Errors**
**Problem:** Frontend tidak bisa akses API
**Solution:**
- Set `ALLOWED_ORIGINS=https://narr-online-store.vercel.app`
- Pastikan URL frontend benar

## 🛠️ **Debugging Steps:**

### 1. **Check Railway Logs:**
```
Railway Dashboard → Service → Deployments → View Logs
```

### 2. **Test API Endpoints:**
```bash
# Health check
curl https://your-app.railway.app/

# Products API
curl https://your-app.railway.app/products
```

### 3. **Verify Environment Variables:**
```bash
# Check if PORT is set
echo $PORT

# Check other variables
echo $APP_ENV
echo $DATABASE_URL
```

## 📋 **Environment Variables Checklist:**

```
✅ APP_ENV=production
✅ APP_DEBUG=false
✅ ALLOWED_ORIGINS=https://narr-online-store.vercel.app
✅ JWT_SECRET=33911246f950fff5a94a3019037ed569
✅ SESSION_SECRET=0acfc38f3e38a01d5ddea8d16c7200a3
✅ DATABASE_URL=postgresql://... (auto-generated)
```

## 🔄 **Common Fixes:**

### Fix 1: Restart Deployment
1. Go to Railway Dashboard
2. Select your service
3. Click "Redeploy"

### Fix 2: Check File Structure
```
backend/
├── index.php          ✅ Main entry point
├── Procfile           ✅ Railway config
├── nixpacks.toml      ✅ Build config
├── composer.json      ✅ Dependencies
└── config/            ✅ Config files
```

### Fix 3: Database Setup
1. Connect PostgreSQL service
2. Run database schema setup
3. Verify tables created

## 🚀 **Quick Deploy Commands:**

```bash
# 1. Commit changes
git add .
git commit -m "Fix Railway deployment"
git push

# 2. Check Railway logs
# Go to Railway Dashboard → View Logs

# 3. Test endpoints
curl https://your-app.railway.app/
```

## 📞 **Support:**

Jika masih ada masalah:
1. Check Railway logs untuk error details
2. Verify semua environment variables
3. Test API endpoints satu per satu
4. Check database connection

**Railway deployment should work now! 🚀**
