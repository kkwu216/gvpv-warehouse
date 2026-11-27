"use client";

import type { Movement } from "@/lib/inventory";
import { MovementRow } from "./MovementRow";
import { useLocale } from "./LocaleProvider";

export function HomeDashboard({
  inStock,
  recent,
}: {
  inStock: number;
  recent: Movement[];
}) {
  const { t } = useLocale();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t("liveInventory")}</h1>

      <section className="rounded-2xl bg-sky-600 px-6 py-8 text-center text-white shadow-lg">
        <p className="text-sm font-medium text-sky-100">{t("inStockCount")}</p>
        <p className="mt-2 text-6xl font-bold tabular-nums">{inStock}</p>
        <p className="mt-2 text-sm text-sky-100">{t("stockRuleHint")}</p>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-800">{t("recentActivity")}</h2>
        {recent.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">
            {t("noRecords")}
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {recent.map((m) => (
              <MovementRow key={m.id} m={m} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}