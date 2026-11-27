#!/usr/bin/env bash
set -euo pipefail
BASE="${1:-http://127.0.0.1:3001}"
curl -fsS -o /dev/null -w "GET /login -> %{http_code}\n" "$BASE/login"
curl -fsS -X POST "$BASE/api/auth/login" -H "Content-Type: application/json" \
  -d '{"username":"warehouse","password":"gvpv-warehouse-2026"}'
echo
code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/dashboard")
echo "GET /api/dashboard (no cookie) -> ${code}"
test "$code" = "401" || test "$code" = "200"