# Use PHP 8.2 with Apache
FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    && docker-php-ext-install pdo pdo_pgsql zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy composer files first for better caching
COPY composer.json ./

# Install PHP dependencies (if any)
# RUN composer install --no-dev --optimize-autoloader

# Copy application files
COPY . /var/www/html/

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Configure Apache
RUN echo '<VirtualHost *:80>\n\
    DocumentRoot /var/www/html/public\n\
    <Directory /var/www/html/public>\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
    ErrorLog ${APACHE_LOG_DIR}/error.log\n\
    CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Create .htaccess for URL rewriting if it doesn't exist
RUN if [ ! -f /var/www/html/public/.htaccess ]; then \
    echo 'RewriteEngine On\n\
RewriteCond %{REQUEST_FILENAME} !-f\n\
RewriteCond %{REQUEST_FILENAME} !-d\n\
RewriteRule ^(.*)$ index.php [QSA,L]' > /var/www/html/public/.htaccess; \
fi

# Install PostgreSQL client for health checks
RUN apt-get update && apt-get install -y postgresql-client && apt-get clean

# Create startup script for database initialization
RUN echo '#!/bin/bash\n\
# Wait for database to be ready\n\
echo "Waiting for database..."\n\
\n\
# Parse DATABASE_URL if it exists (for Render)\n\
if [ -n "$DATABASE_URL" ]; then\n\
    # Extract connection details from DATABASE_URL\n\
    DB_HOST=$(echo $DATABASE_URL | sed -n "s/.*@\\([^:]*\\):.*/\\1/p")\n\
    DB_PORT=$(echo $DATABASE_URL | sed -n "s/.*:\\([0-9]*\\)\\/.*/\\1/p")\n\
    DB_USER=$(echo $DATABASE_URL | sed -n "s/.*:\\/\\/\\([^:]*\\):.*/\\1/p")\n\
    DB_NAME=$(echo $DATABASE_URL | sed -n "s/.*\\/\\([^?]*\\).*/\\1/p")\n\
    \n\
    # Set environment variables for PHP\n\
    export DB_HOST="$DB_HOST"\n\
    export DB_PORT="$DB_PORT"\n\
    export DB_USER="$DB_USER"\n\
    export DB_NAME="$DB_NAME"\n\
    export DB_PASS=$(echo $DATABASE_URL | sed -n "s/.*:\\/\\/[^:]*:\\([^@]*\\)@.*/\\1/p")\n\
fi\n\
\n\
# Wait for database with proper parameters\n\
if [ -n "$DB_HOST" ] && [ -n "$DB_USER" ]; then\n\
    while ! pg_isready -h "$DB_HOST" -p "${DB_PORT:-5432}" -U "$DB_USER"; do\n\
        echo "Waiting for database..."\n\
        sleep 2\n\
    done\n\
    echo "Database is ready!"\n\
else\n\
    echo "Database connection parameters not found, skipping wait..."\n\
fi\n\
\n\
# Run database setup if needed\n\
if [ "$SETUP_DB" = "true" ]; then\n\
    echo "Setting up database..."\n\
    php setup.php\n\
fi\n\
\n\
# Start Apache\n\
apache2-foreground' > /usr/local/bin/start.sh \
    && chmod +x /usr/local/bin/start.sh

# Expose port 80
EXPOSE 80

# Use custom startup script
CMD ["/usr/local/bin/start.sh"]