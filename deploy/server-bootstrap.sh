#!/usr/bin/env bash
# Bootstrap on Linux (Node 20+, PM2, Postgres DATABASE_URL in .env).
set -euo pipefail
APP_ROOT="${APP_ROOT:-/var/www/gvpv-warehouse-v2}"
REPO_URL="${REPO_URL:-https://github.com/kkwu216/gvpv-warehouse.git}"
PORT="${PORT:-3001}"
SUBDOMAIN="${SUBDOMAIN:-gvpv.goodview.beer}"

if ! command -v node >/dev/null; then
  echo "Install Node 20+ first." >&2
  exit 1
fi
if ! command -v pm2 >/dev/null; then
  npm install -g pm2
fi

sudo mkdir -p "$APP_ROOT"
sudo chown -R "$(whoami):$(whoami)" "$APP_ROOT"
if [ ! -d "$APP_ROOT/.git" ]; then
  git clone "$REPO_URL" "$APP_ROOT"
fi
cd "$APP_ROOT"

if [ ! -f .env ]; then
  echo "Create .env with DATABASE_URL and GVPV_AUTH_SECRET, then re-run." >&2
  cp -n .env.example .env 2>/dev/null || true
  exit 1
fi

set -a
# shellcheck disable=SC1091
source .env
set +a
export PORT

npm ci
npm run build

pm2 delete gvpv-warehouse-v2 2>/dev/null || true
PORT="$PORT" pm2 start deploy/ecosystem.config.cjs
pm2 save

if command -v nginx >/dev/null; then
  sudo cp deploy/nginx-gvpv.goodview.beer.conf "/etc/nginx/sites-available/${SUBDOMAIN}"
  sudo sed -i "s/127.0.0.1:3001/127.0.0.1:${PORT}/" "/etc/nginx/sites-available/${SUBDOMAIN}"
  sudo sed -i "s/gvpv.goodview.beer/${SUBDOMAIN}/" "/etc/nginx/sites-available/${SUBDOMAIN}"
  sudo ln -sf "/etc/nginx/sites-available/${SUBDOMAIN}" "/etc/nginx/sites-enabled/"
  sudo nginx -t
  sudo systemctl reload nginx
  if command -v certbot >/dev/null; then
  echo "Run: sudo certbot --nginx -d ${SUBDOMAIN}"
  fi
fi

echo "App should listen on 127.0.0.1:${PORT}; nginx serves https://${SUBDOMAIN} after certbot."