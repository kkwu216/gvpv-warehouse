"use client";

import { localeLabels, type Locale } from "@/i18n/messages";
import { useLocale } from "./LocaleProvider";

const options: Locale[] = ["zh", "vi", "en"];

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();
  return (
    <label className="flex items-center gap-2 text-sm text-slate-600">
      <span className="sr-only">{t("language")}</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="min-h-10 rounded-lg border border-slate-300 bg-white px-2 text-sm font-medium"
        aria-label={t("language")}
      >
        {options.map((loc) => (
          <option key={loc} value={loc}>
            {localeLabels[loc]}
          </option>
        ))}
      </select>
    </label>
  );
}