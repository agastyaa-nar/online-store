# Railway Deployment Setup

## Environment Variables yang Perlu Dikonfigurasi di Railway:

### 1. Database Configuration
```
DATABASE_URL=postgresql://username:password@host:port/database
```

### 2. Application Configuration
```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-railway-app.railway.app
```

### 3. Security
```
SESSION_SECRET=your_secret_key_here_minimum_32_characters
JWT_SECRET=your_jwt_secret_here_minimum_32_characters
```

## Cara Setup di Railway:

1. **Connect Repository**
   - Login ke Railway.app
   - Connect GitHub repository
   - Select repository ini

2. **Add PostgreSQL Database**
   - Add service → PostgreSQL
   - Railway akan otomatis generate DATABASE_URL

3. **Configure Environment Variables**
   - Go to your app service
   - Click on Variables tab
   - Add semua environment variables di atas

4. **Deploy**
   - Railway akan otomatis deploy dari main branch
   - Check logs untuk memastikan tidak ada error

## Troubleshooting:

### Database Connection Issues:
- Pastikan DATABASE_URL sudah di-set dengan benar
- Check PostgreSQL service status di Railway dashboard
- Verify database credentials

### API Endpoints:
- Health check: `GET /api`
- Products: `GET /api/products`
- Categories: `GET /api/categories`

### Common Issues:
1. **Port binding**: Railway menggunakan PORT environment variable
2. **Database migration**: Jalankan schema.sql di PostgreSQL
3. **CORS issues**: Sudah dikonfigurasi di cors.php
