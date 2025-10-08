# 🚀 TechStore Deployment Guide

## Prerequisites

- Docker & Docker Compose
- Git
- Node.js 18+ (for local development)
- PHP 8.2+ (for local development)
- PostgreSQL 15+ (for local development)

## 🐳 Docker Deployment (Recommended)

### 1. Clone Repository
```bash
git clone https://github.com/agastyaa-nar/online-store.git
cd online-store
```

### 2. Environment Configuration
```bash
cd backend
cp env.example .env
```

Edit `.env` file:
```env
DB_HOST=db
DB_NAME=online_store
DB_USER=postgres
DB_PASS=your_secure_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key_here
CORS_ORIGIN=http://localhost:3000
```

### 3. Start Services
```bash
# Start all services
docker-compose up --build

# Or start in background
docker-compose up -d --build
```

### 4. Initialize Database
```bash
# Access backend container
docker-compose exec app bash

# Run database setup
php setup.php
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432

## ☁️ Cloud Deployment

### Render Deployment

#### 1. Connect Repository
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository

#### 2. Backend Configuration
```yaml
# render.yaml
services:
  - type: web
    name: techstore-backend
    env: php
    plan: free
    buildCommand: composer install
    startCommand: php -S 0.0.0.0:$PORT public/index.php
    envVars:
      - key: DB_HOST
        value: your-db-host
      - key: DB_NAME
        value: your-db-name
      - key: DB_USER
        value: your-db-user
      - key: DB_PASS
        value: your-db-password
      - key: JWT_SECRET
        value: your-jwt-secret
      - key: CORS_ORIGIN
        value: https://your-frontend-url.com
```

#### 3. Database Setup
```yaml
# Add to render.yaml
services:
  - type: pserv
    name: techstore-db
    plan: free
    databaseName: online_store
```

#### 4. Frontend Deployment
1. Create new Static Site
2. Connect repository
3. Set build command: `npm run build`
4. Set publish directory: `frontend/dist`

### Vercel Deployment

#### 1. Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

#### 2. Backend (Railway/Render)
```bash
# Deploy backend to Railway or Render
# Follow cloud provider instructions
```

## 🔧 Production Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
DB_HOST=your-production-db-host
DB_NAME=online_store
DB_USER=your-db-user
DB_PASS=your-secure-password
DB_PORT=5432

# Security
JWT_SECRET=your-super-secure-jwt-secret
CORS_ORIGIN=https://your-frontend-domain.com

# Production
APP_ENV=production
DEBUG=false
```

#### Frontend (.env.production)
```env
VITE_API_BASE_URL=https://your-backend-api.com
VITE_APP_NAME=TechStore
VITE_APP_VERSION=1.0.0
```

### Database Optimization

#### PostgreSQL Configuration
```sql
-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_cart_user ON cart(user_id);

-- Enable connection pooling
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
```

### Security Configuration

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # API routes
    location /api/ {
        proxy_pass http://backend:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Frontend
    location / {
        root /var/www/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

#### SSL Configuration
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

## 📊 Monitoring & Logging

### Application Monitoring
```bash
# Install monitoring tools
npm install -g pm2
npm install -g @sentry/cli

# Start with PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

### Log Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'techstore-backend',
    script: 'php',
    args: '-S 0.0.0.0:8080 public/index.php',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        cd frontend
        npm ci
        
    - name: Build frontend
      run: |
        cd frontend
        npm run build
        
    - name: Deploy to production
      run: |
        # Your deployment commands here
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check database status
docker-compose ps

# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

#### 2. CORS Errors
```bash
# Check CORS configuration
curl -H "Origin: http://localhost:3000" http://localhost:8080/auth

# Update CORS_ORIGIN in .env
CORS_ORIGIN=http://localhost:3000
```

#### 3. JWT Token Issues
```bash
# Check JWT_SECRET in .env
echo $JWT_SECRET

# Regenerate JWT secret
openssl rand -base64 32
```

#### 4. Frontend Build Errors
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Performance Optimization

#### Database Optimization
```sql
-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM products WHERE category_id = 'cat-1';

-- Add missing indexes
CREATE INDEX CONCURRENTLY idx_products_name ON products(name);
CREATE INDEX CONCURRENTLY idx_orders_created ON orders(created_at);
```

#### Frontend Optimization
```bash
# Analyze bundle size
cd frontend
npm run build
npx vite-bundle-analyzer dist

# Optimize images
npm install -g imagemin-cli
imagemin src/assets/* --out-dir=dist/assets
```

## 📈 Scaling

### Horizontal Scaling
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  app:
    image: techstore-backend
    deploy:
      replicas: 3
    environment:
      - DB_HOST=db
      
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

### Load Balancing
```nginx
upstream backend {
    server app1:8080;
    server app2:8080;
    server app3:8080;
}

server {
    location /api/ {
        proxy_pass http://backend;
    }
}
```

## 🔒 Security Checklist

- [ ] Change default passwords
- [ ] Enable SSL/TLS
- [ ] Configure firewall
- [ ] Set up monitoring
- [ ] Regular backups
- [ ] Update dependencies
- [ ] Security headers
- [ ] Rate limiting
- [ ] Input validation
- [ ] Error handling

## 📞 Support

For deployment issues:
- Check logs: `docker-compose logs`
- Review configuration
- Test locally first
- Contact support team

---

**Happy Deploying! 🚀**
