# Deployment Guide for Render.com

## Prerequisites
- Docker installed locally
- Git repository with your code
- Render.com account

## Local Development with Docker

1. **Build and run the application locally:**
   ```bash
   cd backend
   docker-compose up --build
   ```

2. **Access the application:**
   - Backend API: http://localhost:8080
   - Database: localhost:5432
   - Health Check: http://localhost:8080/health

3. **Database will be automatically initialized with sample data**

4. **Update Frontend Configuration:**
   - Copy `frontend/env.example` to `frontend/.env.local`
   - Or set `VITE_API_BASE_URL=http://localhost:8080` in your environment

## Deploying to Render.com

### Method 1: Using render.yaml (Recommended)

1. **Push your code to GitHub/GitLab**
2. **Connect your repository to Render:**
   - Go to Render dashboard
   - Click "New +" → "Web Service"
   - Connect your repository
   - Select "Docker" as the environment
   - Render will automatically detect the `render.yaml` file

### Method 2: Manual Configuration

1. **Create a new Web Service on Render:**
   - Environment: Docker
   - Build Command: (leave empty, Dockerfile handles this)
   - Start Command: (leave empty, Dockerfile handles this)

2. **Set Environment Variables in Render Dashboard:**
   ```
   JWT_SECRET=your-secure-jwt-secret-here
   CORS_ORIGIN=https://your-frontend-url.onrender.com
   SETUP_DB=true
   ```

3. **Create a PostgreSQL Database:**
   - Go to Render dashboard
   - Click "New +" → "PostgreSQL"
   - Name: `online-store-db`
   - Plan: Free

4. **Link Database to Web Service:**
   - In your web service settings
   - Go to "Environment" tab
   - Add database connection variables

## Environment Variables

The following environment variables need to be set in Render:

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for JWT tokens | `your-secure-secret-key` |
| `CORS_ORIGIN` | Frontend URL for CORS | `https://your-frontend.onrender.com` |
| `SETUP_DB` | Auto-setup database on startup | `true` |
| `DATABASE_URL` | Database connection string | (Auto-set by Render) |
| `DATABASE_NAME` | Database name | (Auto-set by Render) |
| `DATABASE_USER` | Database user | (Auto-set by Render) |
| `DATABASE_PASSWORD` | Database password | (Auto-set by Render) |

## Database Setup

The database will be automatically set up with:
- ✅ PostgreSQL schema with UUID primary keys
- ✅ Sample categories and products
- ✅ Default admin users (superadmin/admin)
- ✅ Proper triggers for updated_at timestamps

**No manual database setup required!** The Docker container will automatically:
1. Wait for database to be ready
2. Run `setup.php` to initialize schema
3. Start the web server

## Health Check

The application includes a health check endpoint at `/health` that returns:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01 12:00:00"
}
```

## API Endpoints

- `GET /health` - Health check
- `POST /auth` - Authentication (login/register)
- `GET /products` - List products
- `GET /categories` - List categories
- `POST /cart` - Cart operations
- `POST /orders` - Order operations

## Default Admin Accounts

After deployment, you can login with:
- **Super Admin**: `superadmin@example.com` / `password`
- **Admin**: `admin@example.com` / `password`

## Troubleshooting

### Common Issues:

1. **Build fails:**
   - Check Dockerfile syntax
   - Ensure all dependencies are listed in composer.json

2. **Database connection fails:**
   - Verify database credentials in Render
   - Check if database is running
   - Ensure `SETUP_DB=true` is set

3. **CORS errors:**
   - Update CORS_ORIGIN environment variable
   - Ensure frontend URL is correct

4. **Database not initialized:**
   - Check if `SETUP_DB=true` is set
   - Check application logs for database setup errors

### Logs:
- Check Render service logs for detailed error messages
- Use `docker logs` for local debugging

## Local Testing

```bash
# Test the API locally
curl http://localhost:8080/health
curl http://localhost:8080/products
curl http://localhost:8080/categories
```
