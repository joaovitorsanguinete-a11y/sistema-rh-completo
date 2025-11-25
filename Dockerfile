# 1. Usar a imagem oficial do PHP 8.2
FROM php:8.2-cli

# 2. Instalar ferramentas necessárias (git, zip, driver do banco Postgres)
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev

# 3. Instalar a extensão do PHP para conectar no Banco
RUN docker-php-ext-install pdo pdo_pgsql

# 4. Instalar o Composer (Gerenciador do Laravel)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 5. Definir a pasta de trabalho dentro do servidor
WORKDIR /var/www

# 6. Copiar os arquivos da pasta '1_api' para dentro do servidor
COPY 1_api .

# 7. Instalar as dependências do Laravel
RUN composer install --no-dev --optimize-autoloader

# 8. Comando para ligar o servidor quando o site for para o ar
CMD bash -c "php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT"