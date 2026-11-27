# Deploy checklist (Cursor publish-app)

## Preconditions

- [ ] Git repository on Cursor **Origin** (`finance-gv/...`) or **GitHub**
- [ ] Cloud agent run **linked** to that repository
- [ ] All commits **pushed** to default branch (`main`)

## Configure secrets (before or at publish)

- [ ] **`GVPV_AUTH_SECRET`** — bind via Cursor Apps; use a 32+ character random value (openssl rand -hex 32)

Postgres `DATABASE_URL` is provisioned automatically when `cursor-app.json` declares `"database": "postgres"`.

## Publish

1. Start dev server: `env -u DATABASE_URL npm run dev`
2. Call publish with `project_dir` = folder containing `cursor-app.json`
3. `suggested_slug`: `gvpv-warehouse`
4. Visibility: **public**
5. `preview_url`: `http://127.0.0.1:3000/login`

## Post-deploy

- [ ] Open live URL → login as `warehouse` / `supervisor`
- [ ] Test inbound → inventory count → outbound → history filters
- [ ] Switch zh / vi / en on header
- [ ] Change default passwords (DB `users.password_hash` or future admin UI)
- [ ] Update `docs/gvpv-warehouse-app.md` with live URL at top

## Inventory rules (UAT)

- Latest movement per mold number defines in-stock state
- Duplicate inbound blocked while in stock
- Outbound blocked when not in stock
- Re-entry allowed after outbound