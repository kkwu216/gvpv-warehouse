"use client";

import { useEffect } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLocale } from "./LocaleProvider";

export function AppHeader() {
  const { t, session, refreshSession } = useLocale();

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  async function logout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    window.location.href = "/login";
  }

  return (
    <header className="mb-4 flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-sky-700">{t("appName")}</p>
        <p className="text-xs text-slate-500">{t("appSubtitle")}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <LanguageSwitcher />
        {session ? (
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span>
              {session.username} (
              {session.role === "warehouse" ? t("roleWarehouse") : t("roleViewer")})
            </span>
            <button
              type="button"
              onClick={() => void logout()}
              className="rounded-lg border border-slate-300 px-2 py-1 font-medium text-slate-700"
            >
              {t("logout")}
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}