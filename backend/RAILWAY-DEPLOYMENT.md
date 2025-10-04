# 🚀 Railway Backend Deployment Guide

## 📁 **Struktur Backend yang Sudah Diperbaiki:**

```
backend/
├── index.php                 # Main entry point untuk Railway
├── Procfile                  # Railway deployment configuration
├── composer.json             # PHP dependencies
├── railway.json              # Railway specific configuration
├── setup-railway.php         # Database setup script
├── config/
│   ├── cors.php             # CORS configuration
│   ├── database.php         # Database connection
│   ├── env.php              # Environment variables loader
│   └── session.php          # Session management
├── database/
│   └── schema.sql           # Database schema
└── public/
    ├── auth.php             # Authentication endpoints
    ├── cart.php             # Cart management
    ├── categories.php       # Categories API
    ├── orders.php           # Orders API
    └── products.php         # Products API
```

## 🔧 **Environment Variables untuk Railway:**

### Backend Service Environment Variables:
```
APP_ENV=production
APP_DEBUG=false
ALLOWED_ORIGINS=https://narr-online-store.vercel.app
JWT_SECRET=33911246f950fff5a94a3019037ed569
SESSION_SECRET=0acfc38f3e38a01d5ddea8d16c7200a3
```

### Database Variables (pilih salah satu):

**Option A - DATABASE_URL (Recommended):**
- Connect PostgreSQL service di Railway
- Railway akan otomatis generate DATABASE_URL

**Option B - Individual Variables:**
```
DB_CONNECTION=pgsql
DB_HOST=shuttle.proxy.rlwy.net
DB_PORT=36525
DB_DATABASE=railway
DB_USERNAME=postgres
DB_PASSWORD=yLOPRWSqYrILGDfCjLmkTDvEXyRxCVTn
```

## 🚀 **Deployment Steps:**

### 1. **Setup Railway Environment Variables:**
- Masuk ke Railway Dashboard
- Pilih service "online-store"
- Go to "Variables" tab
- Add semua environment variables di atas

### 2. **Connect Database:**
- Di Railway Dashboard
- Klik "Connect Database" di service online-store
- Pilih PostgreSQL service
- Railway akan otomatis menambahkan DATABASE_URL

### 3. **Setup Database Schema:**
- Masuk ke Railway Console (PostgreSQL service)
- Copy isi file `database/schema.sql`
- Paste dan execute di console
- Atau jalankan: `php setup-railway.php` di Railway console

### 4. **Deploy:**
- Push code ke GitHub
- Railway akan otomatis deploy
- Check logs untuk memastikan tidak ada error

## 📡 **API Endpoints:**

Setelah deploy, API akan tersedia di:
- **Health Check:** `https://your-app.railway.app/`
- **Products:** `https://your-app.railway.app/products`
- **Categories:** `https://your-app.railway.app/categories`
- **Auth:** `https://your-app.railway.app/auth`
- **Cart:** `https://your-app.railway.app/cart`
- **Orders:** `https://your-app.railway.app/orders`

## 🔍 **Verifikasi Deployment:**

### 1. Test Health Check:
```bash
curl https://your-app.railway.app/
```

### 2. Test Products API:
```bash
curl https://your-app.railway.app/products
```

### 3. Test Database Connection:
```bash
curl https://your-app.railway.app/products
# Should return JSON with products array
```

## 🛠️ **Troubleshooting:**

### Jika API tidak bisa diakses:
1. Check Railway logs di "Deployments" tab
2. Pastikan semua environment variables sudah di-set
3. Verify PORT environment variable tersedia

### Jika Database connection failed:
1. Check DATABASE_URL atau individual DB variables
2. Pastikan PostgreSQL service running
3. Verify database schema sudah dibuat

### Jika CORS errors:
1. Check ALLOWED_ORIGINS environment variable
2. Pastikan frontend URL sudah benar
3. Verify CORS headers di response

## 📊 **Monitoring:**

### Railway Logs:
- Masuk ke Railway Dashboard
- Pilih service
- Go to "Deployments" tab
- Check logs untuk errors

### Database Monitoring:
- PostgreSQL service di Railway
- Check connection status
- Monitor resource usage

## 🔑 **Default Credentials:**

```
Superadmin: superadmin / password
Admin: admin / password
```

## 📱 **Frontend Configuration:**

Update frontend environment variable:
```
VITE_API_BASE_URL=https://your-app.railway.app
```

---

**Struktur backend sudah dioptimalkan untuk Railway deployment! 🚀**
