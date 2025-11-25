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

# 5. Definir a pasta de trabalho
WORKDIR /var/www

# 6. Copiar os arquivos da API
COPY 1_api .

# 7. Copiar o nosso script de inicialização (NOVO!)
COPY entrypoint.sh .

# 8. Instalar dependências
RUN composer install --no-dev --optimize-autoloader

# 9. Dar permissão para o script rodar (NOVO!)
RUN chmod +x entrypoint.sh

# 10. Executar o script
CMD ["./entrypoint.sh"]