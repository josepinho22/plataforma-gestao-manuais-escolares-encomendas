# ---- PHP base (8.4) ----
FROM php:8.4-fpm-alpine AS base

RUN apk add --no-cache \
    bash curl git unzip icu-dev oniguruma-dev libzip-dev \
    nodejs npm

RUN docker-php-ext-install pdo pdo_mysql mbstring intl zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# ---- Composer deps ----
FROM base AS deps
COPY . .
RUN composer install --no-interaction --prefer-dist --no-progress

# ---- Node deps + Vite build ----
FROM deps AS build
RUN if [ -f package-lock.json ]; then npm ci; else npm i; fi
RUN npm run build

# ---- Runtime ----
FROM base AS runtime
COPY --from=deps /var/www/html/vendor /var/www/html/vendor
COPY --from=build /var/www/html/public/build /var/www/html/public/build
COPY . .

RUN mkdir -p storage bootstrap/cache \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
 && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]
