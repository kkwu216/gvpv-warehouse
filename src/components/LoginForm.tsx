"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LocaleProvider, useLocale } from "./LocaleProvider";
import type { Locale } from "@/i18n/messages";

function LoginInner() {
  const { t } = useLocale();
  const router = useRouter();
  const search = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        await res.json().catch(() => null);
        setError(t("loginFailed"));
        return;
      }
      const next = search.get("next") || "/";
      router.replace(next);
      router.refresh();
    } catch {
      setError(t("networkError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col justify-center gap-6">
      <div className="flex justify-end">
        <LanguageSwitcher />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t("loginTitle")}</h1>
        <p className="mt-2 text-sm text-slate-600">{t("loginHint")}</p>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">{t("loginId")}</span>
          <input
            required
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="min-h-14 rounded-xl border border-slate-300 px-4 text-lg"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">{t("loginPassword")}</span>
          <input
            required
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="min-h-14 rounded-xl border border-slate-300 px-4 text-lg"
          />
        </label>
        {error ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="min-h-14 rounded-xl bg-sky-600 text-lg font-semibold text-white disabled:opacity-60"
        >
          {loading ? t("loading") : t("loginSubmit")}
        </button>
      </form>
    </div>
  );
}

export function LoginForm({ initialLocale }: { initialLocale: Locale }) {
  return (
    <LocaleProvider initialLocale={initialLocale}>
      <LoginInner />
    </LocaleProvider>
  );
}