"use client";

import type { Movement } from "@/lib/inventory";
import { useLocale } from "./LocaleProvider";

function formatDt(iso: string, locale: string) {
  const tag = locale === "zh" ? "zh-TW" : locale === "vi" ? "vi-VN" : "en-US";
  return new Date(iso).toLocaleString(tag, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function MovementRow({ m }: { m: Movement }) {
  const { t, locale } = useLocale();
  const inbound = m.direction === "in";
  return (
    <li className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <span
        className={`mt-0.5 shrink-0 rounded-lg px-2.5 py-1 text-sm font-semibold ${
          inbound ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"
        }`}
      >
        {inbound ? t("movementIn") : t("movementOut")}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-lg font-bold tracking-wide text-slate-900">{m.mold_number}</p>
        <p className="text-sm text-slate-600">{formatDt(m.occurred_at, locale)}</p>
        <p className="text-sm text-slate-500">
          {t("plateLabel")}：{m.truck_plate}
        </p>
      </div>
    </li>
  );
}