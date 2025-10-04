# 🚀 Online Store Backend - Railway Ready

## 📁 **Clean Production Structure:**

```
backend/
├── index.php                    # Main entry point
├── Procfile                     # Railway deployment config
├── nixpacks.toml               # Build configuration
├── composer.json               # PHP dependencies
├── setup-railway.php           # Database setup script
├── RAILWAY-ENV-FINAL.txt       # Environment variables guide
├── README.md                   # This file
├── config/
│   ├── cors.php               # CORS configuration
│   ├── database.php           # Database connection
│   ├── env.php                # Environment loader
│   └── session.php            # Session management
├── database/
│   └── schema.sql             # Database schema
└── public/
    ├── auth.php               # Authentication API
    ├── cart.php               # Cart management API
    ├── categories.php         # Categories API
    ├── orders.php             # Orders API
    └── products.php           # Products API
```

## 🚀 **Railway Deployment:**

### 1. Environment Variables:
Copy from `RAILWAY-ENV-FINAL.txt`:
```
APP_ENV=production
APP_DEBUG=false
ALLOWED_ORIGINS=https://narr-online-store.vercel.app
JWT_SECRET=33911246f950fff5a94a3019037ed569
SESSION_SECRET=0acfc38f3e38a01d5ddea8d16c7200a3
```

### 2. Database:
- Connect PostgreSQL service in Railway
- Run `php setup-railway.php` to setup schema

### 3. Deploy:
```bash
git add .
git commit -m "Clean Railway deployment"
git push
```

## 📡 **API Endpoints:**
- Health: `GET /`
- Products: `GET /products`
- Categories: `GET /categories`
- Auth: `POST /auth`
- Cart: `GET/POST /cart`
- Orders: `POST /orders`

## 🔑 **Default Credentials:**
- Superadmin: `superadmin` / `password`
- Admin: `admin` / `password`

**Clean, minimal, Railway-ready backend! 🚀**
