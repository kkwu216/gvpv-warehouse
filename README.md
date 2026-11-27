# GVPV Mold Warehouse (gvpv-app)

Mobile-first web app for Vietnam outsourced mold warehouse inbound/outbound records, live inventory, and history.

- **Stack:** Next.js 15 (App Router), Tailwind 4, PostgreSQL (`cursor-app.json`)
- **Locales:** Traditional Chinese (`zh`), Vietnamese (`vi`), English (`en`)
- **Auth:** App username/password (not Cursor); roles `warehouse` | `viewer`

## Local development

```bash
cd gvpv-app
npm ci
env -u DATABASE_URL npm run dev
```

Open [http://127.0.0.1:3000/login](http://127.0.0.1:3000/login).

Without `DATABASE_URL`, the app uses in-memory PGlite and applies `migrations/*.sql` automatically.

### Default logins (change after production)

| User | Password | Role |
|------|----------|------|
| `warehouse` | `gvpv-warehouse-2026` | In/out + view |
| `supervisor` | `gvpv-super-2026` | View only |

## Production / Cursor Apps

1. Repo on **Origin** or **GitHub** with this folder at root (or set `project_dir`).
2. Secret **`GVPV_AUTH_SECRET`**: long random string (session signing). Required in production (`NODE_ENV=production`).
3. **`publish-app`**: visibility **public** (login page reachable; APIs require session).
4. Postgres migrations run on build: `npm run build` → `next build` + `scripts/migrate.mjs`.
5. User guide (operations): Project store `docs/gvpv-warehouse-app.md`.

## Project layout

```
migrations/          SQL schema (001 movements, 002 users)
scripts/migrate.mjs  Production migration runner
src/app/             Pages + route handlers
src/components/      UI
src/i18n/messages.ts Translation strings
src/lib/             db, auth, inventory, users
cursor-app.json      { "database": "postgres" }
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server on 127.0.0.1:3000 |
| `npm run build` | Production build + migrate |
| `npm start` | Run production server |