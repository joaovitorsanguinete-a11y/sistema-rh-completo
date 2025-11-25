#!/bin/sh
echo "🚀 Rodando Migrations..."
php artisan migrate --force

echo "🚀 Iniciando Servidor..."
php artisan serve --host=0.0.0.0 --port=$PORT