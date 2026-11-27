# Linux PM2 + Nginx (new subdomain)

- **Host:** Singapore ECS `47.84.122.148` (`iZt4n6g1wo83wz41tyan4eZ`)
- **App root:** `/var/www/gvpv-warehouse-v2`
- **PM2:** `gvpv-warehouse-v2` on port **3001**
- **GitHub:** https://github.com/kkwu216/gvpv-warehouse
- **Public URL (after DNS):** https://gvpv.goodview.beer

## DNS (required for public access)

Add **A** record at Aliyun DNS for `goodview.beer`: host **`gvpv`** → **`47.84.122.148`**.

Then on the server:

```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d gvpv.goodview.beer
```

HTTPS is required for browser login (`secure` session cookies in production).

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