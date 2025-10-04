# 🚀 Online Store Backend - InfinityFree Ready

## 📁 **Clean Production Structure:**

```
backend/
├── index.php                    # Main entry point
├── composer.json               # PHP dependencies
├── setup-infinityfree.php      # Database setup script
├── INFINITYFREE-DEPLOYMENT.md  # Complete deployment guide
├── README.md                   # This file
├── config/
│   ├── cors.php               # CORS configuration
│   ├── database.php           # Database connection (MySQL)
│   ├── env.php                # Environment loader
│   └── session.php            # Session management
├── database/
│   └── schema.sql             # MySQL schema
└── public/
    ├── auth.php               # Authentication API
    ├── cart.php               # Cart management API
    ├── categories.php         # Categories API
    ├── orders.php             # Orders API
    └── products.php           # Products API
```

## 🚀 **InfinityFree.com Deployment:**

### 1. Create Account:
- Go to [InfinityFree.com](https://infinityfree.com)
- Sign up for free account
- Create subdomain: `online-store-api`

### 2. Create MySQL Database:
- Database: `if0_36512345_online_store`
- User: `if0_36512345`
- Host: `sql212.infinityfree.com`

### 3. Environment Variables (.env):
```
APP_ENV=production
APP_DEBUG=false
ALLOWED_ORIGINS=https://narr-online-store.vercel.app
DB_CONNECTION=mysql
DB_HOST=sql212.infinityfree.com
DB_PORT=3306
DB_DATABASE=if0_36512345_online_store
DB_USERNAME=if0_36512345
DB_PASSWORD=your-password-here
JWT_SECRET=your-jwt-secret-here
SESSION_SECRET=your-session-secret-here
```

### 4. Deploy:
1. Upload files via File Manager
2. Run `setup-infinityfree.php` to setup database
3. Update frontend API URL

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

## 🌟 **Why InfinityFree.com:**
- ✅ **Free hosting** - no cost
- ✅ **MySQL database** - included
- ✅ **PHP support** - native
- ✅ **No CORS issues** - reliable
- ✅ **Easy setup** - file manager upload
- ✅ **SSL certificate** - free

**Clean, minimal, InfinityFree-ready backend! 🚀**
