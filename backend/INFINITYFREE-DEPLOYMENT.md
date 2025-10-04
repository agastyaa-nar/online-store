# 🚀 InfinityFree.com Deployment Guide

## 📋 **Prerequisites:**
- InfinityFree.com account (free)
- GitHub repository
- MySQL database access

## 🔧 **Setup Backend di InfinityFree:**

### Step 1: Create Account
1. Go to [InfinityFree.com](https://infinityfree.com)
2. Sign up for free account
3. Verify email address

### Step 2: Create Subdomain
1. Go to **Control Panel**
2. Click **"Subdomains"**
3. Create subdomain: `online-store-api`
4. Your API URL will be: `https://online-store-api.yourdomain.infinityfreeapp.com`

### Step 3: Create MySQL Database
1. Go to **Control Panel**
2. Click **"MySQL Databases"**
3. Create database: `if0_36512345_online_store`
4. Create user: `if0_36512345`
5. Set password and grant all privileges
6. Note down database details

### Step 4: Upload Files
1. Go to **Control Panel**
2. Click **"File Manager"**
3. Navigate to `htdocs/online-store-api/`
4. Upload all backend files

### Step 5: Set Environment Variables
Create `.env` file in root directory:
```env
APP_ENV=production
APP_DEBUG=false
ALLOWED_ORIGINS=https://narr-online-store.vercel.app
DB_CONNECTION=mysql
DB_HOST=sql212.infinityfree.com
DB_PORT=3306
DB_DATABASE=if0_36512345_online_store
DB_USERNAME=if0_36512345
DB_PASSWORD=your-password-here
JWT_SECRET=your-jwt-secret-here-32-characters
SESSION_SECRET=your-session-secret-here-32-characters
```

## 🗄️ **Setup Database:**

### Step 1: Run Setup Script
1. Go to your API URL: `https://online-store-api.yourdomain.infinityfreeapp.com/setup-infinityfree.php`
2. The script will create all tables and insert sample data

### Step 2: Verify Database
Check if tables are created:
- users
- categories  
- products
- cart_items
- orders
- order_items

## 🌐 **Frontend Configuration (Vercel):**

Set in Vercel Environment Variables:
```
VITE_API_BASE_URL=https://online-store-api.yourdomain.infinityfreeapp.com
```

## 📡 **API Endpoints:**
- Health: `https://online-store-api.yourdomain.infinityfreeapp.com/`
- Products: `https://online-store-api.yourdomain.infinityfreeapp.com/products`
- Categories: `https://online-store-api.yourdomain.infinityfreeapp.com/categories`
- Auth: `https://online-store-api.yourdomain.infinityfreeapp.com/auth`
- Cart: `https://online-store-api.yourdomain.infinityfreeapp.com/cart`
- Orders: `https://online-store-api.yourdomain.infinityfreeapp.com/orders`

## 🔑 **Default Credentials:**
- Superadmin: `superadmin` / `password`
- Admin: `admin` / `password`

## 🎯 **Benefits of InfinityFree:**
- ✅ **Free hosting** - no cost
- ✅ **MySQL database** - included
- ✅ **PHP support** - native
- ✅ **Subdomain** - free
- ✅ **SSL certificate** - free
- ✅ **No CORS issues** - same domain possible
- ✅ **Reliable uptime** - good for small projects

## 📋 **File Structure on InfinityFree:**
```
htdocs/online-store-api/
├── index.php
├── .env
├── config/
│   ├── cors.php
│   ├── database.php
│   ├── env.php
│   └── session.php
├── database/
│   └── schema.sql
├── public/
│   ├── auth.php
│   ├── cart.php
│   ├── categories.php
│   ├── orders.php
│   └── products.php
└── setup-infinityfree.php
```

## 🚀 **Deployment Steps:**

1. **Create InfinityFree account**
2. **Create subdomain**
3. **Create MySQL database**
4. **Upload files via File Manager**
5. **Create .env file**
6. **Run setup script**
7. **Update frontend API URL**
8. **Test endpoints**

## 🔍 **Testing:**

### Test API Endpoints:
```bash
# Health check
curl https://online-store-api.yourdomain.infinityfreeapp.com/

# Get products
curl https://online-store-api.yourdomain.infinityfreeapp.com/products

# Get categories
curl https://online-store-api.yourdomain.infinityfreeapp.com/categories
```

## 🎉 **Done!**

Your backend is now deployed on InfinityFree with MySQL database!

**No more CORS issues, no more deployment problems! 🚀**
