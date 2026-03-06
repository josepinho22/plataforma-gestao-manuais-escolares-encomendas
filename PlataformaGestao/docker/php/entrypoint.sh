#!/usr/bin/env sh
set -eu

if [ -d /var/www/html/storage ]; then
  chmod -R ug+rwX /var/www/html/storage /var/www/html/bootstrap/cache || true
fi

exec "$@"
