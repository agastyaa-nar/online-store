# 🚀 Deployment Guide - NeonStore

Panduan lengkap untuk deploy aplikasi NeonStore ke production.

## 📋 Prerequisites

### Server Requirements
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **RAM**: Minimum 2GB (Recommended 4GB+)
- **Storage**: Minimum 20GB SSD
- **CPU**: 2 cores minimum

### Software Requirements
- **Node.js**: 18.0+ 
- **PHP**: 8.0+
- **PostgreSQL**: 12+
- **Nginx**: 1.18+ (atau Apache 2.4+)
- **Composer**: Latest version
- **Git**: Latest version

## 🎯 Deployment Options

### Option 1: VPS Deployment (Recommended)
- Full control over server
- Better performance
- Custom domain support
- SSL certificate support

### Option 2: Shared Hosting
- Easy setup
- Managed hosting
- Limited control
- Cost-effective

### Option 3: Cloud Platforms
- **Vercel** (Frontend) + **Railway/Render** (Backend)
- **Netlify** (Frontend) + **Heroku** (Backend)
- **AWS/GCP/Azure** (Full stack)

## 🖥️ VPS Deployment (Step by Step)

### Step 1: Server Setup

1. **Connect to your VPS**
   ```bash
   ssh root@your-server-ip
   ```

2. **Update system packages**
   ```bash
   apt update && apt upgrade -y
   ```

3. **Install required software**
   ```bash
   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   apt-get install -y nodejs

   # Install PHP 8.0
   apt install -y php8.0 php8.0-fpm php8.0-pgsql php8.0-mbstring php8.0-xml php8.0-curl

   # Install PostgreSQL
   apt install -y postgresql postgresql-contrib

   # Install Nginx
   apt install -y nginx

   # Install Composer
   curl -sS https://getcomposer.org/installer | php
   mv composer.phar /usr/local/bin/composer
   ```

### Step 2: Database Setup

1. **Create database and user**
   ```bash
   sudo -u postgres psql
   ```
   ```sql
   CREATE DATABASE neonstore;
   CREATE USER neonstore_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE neonstore TO neonstore_user;
   \q
   ```

2. **Configure PostgreSQL**
   ```bash
   nano /etc/postgresql/12/main/postgresql.conf
   ```
   Uncomment and modify:
   ```
   listen_addresses = 'localhost'
   port = 5432
   ```

3. **Configure authentication**
   ```bash
   nano /etc/postgresql/12/main/pg_hba.conf
   ```
   Add:
   ```
   local   neonstore        neonstore_user                    md5
   ```

4. **Restart PostgreSQL**
   ```bash
   systemctl restart postgresql
   systemctl enable postgresql
   ```

### Step 3: Backend Deployment

1. **Create application directory**
   ```bash
   mkdir -p /var/www/neonstore
   cd /var/www/neonstore
   ```

2. **Clone repository**
   ```bash
   git clone <your-repository-url> .
   ```

3. **Install PHP dependencies**
   ```bash
   cd backend
   composer install --no-dev --optimize-autoloader
   ```

4. **Configure database connection**
   ```bash
   nano backend/config/database.php
   ```
   Update with your database credentials:
   ```php
   $host = 'localhost';
   $db_name = 'neonstore';
   $username = 'neonstore_user';
   $password = 'your_secure_password';
   $port = '5432';
   ```

5. **Run database migration**
   ```bash
   php migrate.php
   ```

6. **Set proper permissions**
   ```bash
   chown -R www-data:www-data /var/www/neonstore
   chmod -R 755 /var/www/neonstore
   ```

### Step 4: Frontend Deployment

1. **Install Node.js dependencies**
   ```bash
   cd /var/www/neonstore
   npm install
   ```

2. **Build for production**
   ```bash
   npm run build
   ```

3. **Update API base URL**
   ```bash
   nano src/services/api.ts
   ```
   Change to your production API URL:
   ```typescript
   const API_BASE_URL = 'https://yourdomain.com/api';
   ```

4. **Rebuild after API URL change**
   ```bash
   npm run build
   ```

### Step 5: Nginx Configuration

1. **Create Nginx configuration**
   ```bash
   nano /etc/nginx/sites-available/neonstore
   ```
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       root /var/www/neonstore/dist;
       index index.html;

       # Frontend routes
       location / {
           try_files $uri $uri/ /index.html;
       }

       # API routes
       location /api/ {
           alias /var/www/neonstore/backend/;
           try_files $uri $uri/ @api;
       }

       location @api {
           rewrite ^/api/(.*)$ /api/$1 break;
           fastcgi_pass unix:/var/run/php/php8.0-fpm.sock;
           fastcgi_index index.php;
           fastcgi_param SCRIPT_FILENAME /var/www/neonstore/backend/$1;
           include fastcgi_params;
       }

       # Security headers
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-XSS-Protection "1; mode=block" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header Referrer-Policy "no-referrer-when-downgrade" always;
       add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
   }
   ```

2. **Enable the site**
   ```bash
   ln -s /etc/nginx/sites-available/neonstore /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

### Step 6: SSL Certificate (Let's Encrypt)

1. **Install Certbot**
   ```bash
   apt install -y certbot python3-certbot-nginx
   ```

2. **Obtain SSL certificate**
   ```bash
   certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

3. **Test auto-renewal**
   ```bash
   certbot renew --dry-run
   ```

### Step 7: PHP-FPM Configuration

1. **Configure PHP-FPM**
   ```bash
   nano /etc/php/8.0/fpm/pool.d/www.conf
   ```
   Update:
   ```
   user = www-data
   group = www-data
   listen = /var/run/php/php8.0-fpm.sock
   ```

2. **Restart PHP-FPM**
   ```bash
   systemctl restart php8.0-fpm
   systemctl enable php8.0-fpm
   ```

## ☁️ Cloud Platform Deployment

### Frontend - Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Configure environment variables**
   - `VITE_API_URL`: Your backend API URL

### Backend - Railway

1. **Connect GitHub repository**
   - Go to Railway.app
   - Connect your GitHub account
   - Select your repository

2. **Configure environment variables**
   - `DATABASE_URL`: PostgreSQL connection string
   - `NODE_ENV`: production

3. **Deploy**
   - Railway will automatically deploy on push to main branch

### Alternative: Netlify + Heroku

1. **Frontend to Netlify**
   ```bash
   npm run build
   # Upload dist/ folder to Netlify
   ```

2. **Backend to Heroku**
   ```bash
   # Create Procfile
   echo "web: php -S 0.0.0.0:\$PORT -t backend/" > Procfile
   
   # Deploy
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

## 🔧 Production Optimizations

### Frontend Optimizations

1. **Enable Gzip compression**
   ```nginx
   gzip on;
   gzip_vary on;
   gzip_min_length 1024;
   gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
   ```

2. **Add caching headers**
   ```nginx
   location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

3. **Minify assets**
   ```bash
   npm run build
   # Vite automatically minifies in production
   ```

### Backend Optimizations

1. **Enable OPcache**
   ```bash
   nano /etc/php/8.0/fpm/conf.d/10-opcache.ini
   ```
   ```ini
   opcache.enable=1
   opcache.memory_consumption=128
   opcache.interned_strings_buffer=8
   opcache.max_accelerated_files=4000
   opcache.revalidate_freq=2
   opcache.fast_shutdown=1
   ```

2. **Database optimizations**
   ```sql
   -- Add indexes for better performance
   CREATE INDEX idx_products_category ON products(category_id);
   CREATE INDEX idx_products_active ON products(is_active);
   CREATE INDEX idx_orders_user ON orders(user_id);
   ```

## 🔍 Monitoring & Maintenance

### Log Monitoring

1. **Nginx logs**
   ```bash
   tail -f /var/log/nginx/access.log
   tail -f /var/log/nginx/error.log
   ```

2. **PHP logs**
   ```bash
   tail -f /var/log/php8.0-fpm.log
   ```

3. **PostgreSQL logs**
   ```bash
   tail -f /var/log/postgresql/postgresql-12-main.log
   ```

### Backup Strategy

1. **Database backup**
   ```bash
   # Daily backup script
   pg_dump -U neonstore_user -h localhost neonstore > /backup/neonstore_$(date +%Y%m%d).sql
   ```

2. **Application backup**
   ```bash
   # Backup application files
   tar -czf /backup/neonstore_app_$(date +%Y%m%d).tar.gz /var/www/neonstore
   ```

### Performance Monitoring

1. **Install monitoring tools**
   ```bash
   # Install htop for system monitoring
   apt install -y htop
   
   # Install iotop for I/O monitoring
   apt install -y iotop
   ```

2. **Database monitoring**
   ```sql
   -- Check database size
   SELECT pg_size_pretty(pg_database_size('neonstore'));
   
   -- Check slow queries
   SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;
   ```

## 🚨 Troubleshooting

### Common Issues

1. **502 Bad Gateway**
   ```bash
   # Check PHP-FPM status
   systemctl status php8.0-fpm
   
   # Check Nginx configuration
   nginx -t
   ```

2. **Database connection failed**
   ```bash
   # Check PostgreSQL status
   systemctl status postgresql
   
   # Test connection
   psql -U neonstore_user -h localhost -d neonstore
   ```

3. **Permission denied**
   ```bash
   # Fix permissions
   chown -R www-data:www-data /var/www/neonstore
   chmod -R 755 /var/www/neonstore
   ```

### Performance Issues

1. **Slow page loads**
   - Check database indexes
   - Enable OPcache
   - Optimize images
   - Enable Gzip compression

2. **High memory usage**
   - Check PHP memory limit
   - Optimize database queries
   - Enable caching

## 📊 Health Checks

### Application Health

1. **Frontend health**
   ```bash
   curl -I https://yourdomain.com
   ```

2. **Backend health**
   ```bash
   curl -I https://yourdomain.com/api/products.php
   ```

3. **Database health**
   ```bash
   psql -U neonstore_user -h localhost -d neonstore -c "SELECT 1;"
   ```

## 🔐 Security Checklist

- [ ] SSL certificate installed and working
- [ ] Firewall configured (UFW/iptables)
- [ ] Database user has minimal privileges
- [ ] PHP-FPM runs as non-root user
- [ ] Regular security updates applied
- [ ] Backup strategy implemented
- [ ] Monitoring tools installed
- [ ] Error logging enabled
- [ ] CORS properly configured
- [ ] Input validation on all endpoints

## 📞 Support

If you encounter any issues during deployment:

1. Check the logs for error messages
2. Verify all services are running
3. Test each component individually
4. Check firewall and port configurations
5. Verify database connectivity

---

**Happy Deploying! 🚀**
