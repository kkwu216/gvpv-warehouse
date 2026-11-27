#!/usr/bin/env bash
set -euo pipefail
APP_ROOT=/var/www/gvpv-warehouse-v2
DB_PASS=$(openssl rand -hex 16)
AUTH_SECRET=$(openssl rand -hex 32)

if ! command -v psql >/dev/null 2>&1; then
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -qq
  apt-get install -y -qq postgresql postgresql-contrib
  systemctl enable --now postgresql
fi

if ! sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='gvpv'" | grep -q 1; then
  sudo -u postgres psql -c "CREATE ROLE gvpv LOGIN PASSWORD '${DB_PASS}';"
else
  sudo -u postgres psql -c "ALTER ROLE gvpv WITH PASSWORD '${DB_PASS}';"
fi
if ! sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='gvpv_warehouse'" | grep -q 1; then
  sudo -u postgres psql -c "CREATE DATABASE gvpv_warehouse OWNER gvpv;"
fi

mkdir -p "$APP_ROOT"
if [ ! -d "$APP_ROOT/.git" ]; then
  git clone https://github.com/kkwu216/gvpv-warehouse.git "$APP_ROOT"
fi
cd "$APP_ROOT"
git pull --ff-only

cat > .env <<ENV
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://gvpv:${DB_PASS}@127.0.0.1:5432/gvpv_warehouse
GVPV_AUTH_SECRET=${AUTH_SECRET}
ENV
chmod 600 .env

set -a
# shellcheck disable=SC1091
source .env
set +a

npm ci
npm run build

pm2 delete gvpv-warehouse-v2 2>/dev/null || true
pm2 start deploy/ecosystem.config.cjs
pm2 save

sleep 3

cp deploy/nginx-gvpv.goodview.beer.conf /etc/nginx/sites-available/gvpv-goodview
ln -sf /etc/nginx/sites-available/gvpv-goodview /etc/nginx/sites-enabled/gvpv-goodview
nginx -t
systemctl reload nginx

curl -fsS -o /dev/null -w "local_login_http=%{http_code}\n" "http://127.0.0.1:${PORT}/login"
echo "DEPLOY_OK"