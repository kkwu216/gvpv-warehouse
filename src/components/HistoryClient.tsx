"use client";

import { useCallback, useEffect, useState } from "react";
import type { Movement } from "@/lib/inventory";
import { MovementRow } from "./MovementRow";
import { useLocale } from "./LocaleProvider";

export function HistoryClient() {
  const { t } = useLocale();
  const [direction, setDirection] = useState<"" | "in" | "out">("");
  const [mold, setMold] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rows, setRows] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (direction) params.set("direction", direction);
    if (mold.trim()) params.set("mold", mold.trim());
    if (from) params.set("from", new Date(from).toISOString());
    if (to) params.set("to", new Date(to).toISOString());
    params.set("limit", "200");
    const res = await fetch(`/api/movements?${params}`);
    setRows((await res.json()) as Movement[]);
    setLoading(false);
  }, [direction, mold, from, to]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-slate-900">{t("historyTitle")}</h1>
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-slate-600">{t("filterType")}</span>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value as "" | "in" | "out")}
            className="min-h-12 rounded-xl border border-slate-300 px-3"
          >
            <option value="">{t("filterAll")}</option>
            <option value="in">{t("movementIn")}</option>
            <option value="out">{t("movementOut")}</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-slate-600">{t("filterMold")}</span>
          <input
            value={mold}
            onChange={(e) => setMold(e.target.value)}
            className="min-h-12 rounded-xl border border-slate-300 px-3 uppercase"
            placeholder={t("filterMoldPlaceholder")}
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-slate-600">{t("filterFrom")}</span>
            <input
              type="datetime-local"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="min-h-12 rounded-xl border border-slate-300 px-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-slate-600">{t("filterTo")}</span>
            <input
              type="datetime-local"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="min-h-12 rounded-xl border border-slate-300 px-2 text-sm"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="min-h-12 w-full rounded-xl bg-slate-800 font-medium text-white"
        >
          {t("searchAgain")}
        </button>
      </div>
      {loading ? (
        <p className="text-center text-slate-500">{t("loading")}</p>
      ) : rows.length === 0 ? (
        <p className="text-center text-slate-500">{t("noMatches")}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((m) => (
            <MovementRow key={m.id} m={m} />
          ))}
        </ul>
      )}
    </div>
  );
}