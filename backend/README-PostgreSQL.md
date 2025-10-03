# PostgreSQL Setup Guide

## Prerequisites

1. **Install PostgreSQL**
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Linux: `sudo apt-get install postgresql postgresql-contrib`
   - macOS: `brew install postgresql`

2. **Install PHP PostgreSQL Extension**
   - Windows: Enable `php_pdo_pgsql` in php.ini
   - Linux: `sudo apt-get install php-pgsql`
   - macOS: `brew install php-pgsql`

## Database Setup

### 1. Create Database
```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database
CREATE DATABASE online_store;

-- Create user (optional)
CREATE USER store_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE online_store TO store_user;
```

### 2. Configure Database Connection
Edit `backend/config/database.php`:
```php
private $host = 'localhost';
private $db_name = 'online_store';
private $username = 'postgres';  // or your username
private $password = 'your_password';
private $port = '5432';
```

### 3. Run Setup Script
```bash
cd backend
php setup.php
```

## Troubleshooting

### Connection Issues
- Ensure PostgreSQL is running: `sudo service postgresql start`
- Check if port 5432 is open
- Verify credentials in `database.php`

### Permission Issues
- Grant proper permissions to your user
- Check if the database exists
- Ensure user has CREATE privileges

### PHP Extension Issues
- Verify `php_pdo_pgsql` is enabled
- Check PHP version compatibility
- Restart web server after enabling extension

## Default Credentials
- **Database**: online_store
- **Host**: localhost:5432
- **Admin**: superadmin / password
