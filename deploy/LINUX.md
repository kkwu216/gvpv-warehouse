# Linux PM2 + Nginx (new subdomain)

Target host per infrastructure map: Singapore ECS **47.84.122.148**, subdomain **`gvpv.goodview.beer`** (new; does not replace `warehouse.goodview.beer`).

## DNS

Add **A** record: `gvpv` → `47.84.122.148`.

## One-time server setup

1. Create Postgres database (e.g. `gvpv_warehouse`) and set `DATABASE_URL` in `.env`.
2. `openssl rand -hex 32` → `GVPV_AUTH_SECRET`.
3. Clone repo to `/var/www/gvpv-warehouse-v2` and copy `.env.example` → `.env`.
4. Run `bash deploy/server-bootstrap.sh`.

## Updates

```bash
cd /var/www/gvpv-warehouse-v2
git pull
npm ci
npm run build
pm2 restart gvpv-warehouse-v2
```