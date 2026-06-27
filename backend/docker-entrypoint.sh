#!/bin/sh
set -e

echo "Starting PulseDesk Backend initialization..."

# Wait for MySQL database connection
echo "Waiting for database connection..."
until php -r "
    try {
        \$pdo = new PDO('mysql:host='.getenv('DB_HOST').';port='.getenv('DB_PORT').';dbname='.getenv('DB_DATABASE'), getenv('DB_USERNAME'), getenv('DB_PASSWORD'));
        exit(0);
    } catch (\Throwable \$e) {
        exit(1);
    }
" > /dev/null 2>&1; do
    echo "Database is not ready yet. Retrying in 2 seconds..."
    sleep 2
done

echo "Database connected successfully!"

# Create storage directories if they don't exist
mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache bootstrap/cache storage/app/public
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Generate APP_KEY if not set or empty
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "base64:" ]; then
    echo "Generating Application Key..."
    php artisan key:generate --force
fi

# Create storage symlink if it doesn't exist
php artisan storage:link --force || true

# Run migrations and seeders automatically
echo "Running database migrations and seeding demo data..."
php artisan migrate --force --seed

# Production optimization caches
if [ "${APP_ENV:-production}" = "production" ]; then
    echo "Caching Laravel configuration, routes, and views..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

# Mark backend service as ready for health check
touch /tmp/ready

echo "Backend initialization complete. Executing CMD..."
exec "$@"
