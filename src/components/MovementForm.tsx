"use client";

import type { ApiErrorCode } from "@/lib/errors";
import type { MessageKey } from "@/i18n/messages";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocale } from "./LocaleProvider";

type Props = {
  direction: "in" | "out";
};

function defaultLocalDateTime() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function isApiErrorCode(value: string): value is ApiErrorCode {
  return value.startsWith("ERR_");
}

export function MovementForm({ direction }: Props) {
  const { t } = useLocale();
  const router = useRouter();
  const [moldNumber, setMoldNumber] = useState("");
  const [occurredAt, setOccurredAt] = useState(defaultLocalDateTime);
  const [truckPlate, setTruckPlate] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const title = direction === "in" ? t("inboundTitle") : t("outboundTitle");
  const plateLabel = direction === "in" ? t("plateInbound") : t("plateOutbound");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/movements", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mold_number: moldNumber,
          direction,
          occurred_at: new Date(occurredAt).toISOString(),
          truck_plate: truckPlate,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        const code = data.error ?? "";
        if (isApiErrorCode(code)) {
          setError(t(code as MessageKey));
        } else {
          setError(t("saveFailed"));
        }
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError(t("networkError"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <h1 className="text-xl font-bold text-slate-900">{title}</h1>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-700">{t("moldNumber")}</span>
        <input
          required
          value={moldNumber}
          onChange={(e) => setMoldNumber(e.target.value)}
          className="min-h-14 rounded-xl border border-slate-300 px-4 text-lg uppercase"
          placeholder={t("moldPlaceholder")}
          autoComplete="off"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-700">{t("dateTime")}</span>
        <input
          required
          type="datetime-local"
          value={occurredAt}
          onChange={(e) => setOccurredAt(e.target.value)}
          className="min-h-14 rounded-xl border border-slate-300 px-4 text-lg"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-700">{plateLabel}</span>
        <input
          required
          value={truckPlate}
          onChange={(e) => setTruckPlate(e.target.value)}
          className="min-h-14 rounded-xl border border-slate-300 px-4 text-lg"
          placeholder={t("platePlaceholder")}
        />
      </label>
      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={saving}
        className="min-h-14 rounded-xl bg-sky-600 text-lg font-semibold text-white active:bg-sky-700 disabled:opacity-60"
      >
        {saving ? t("saving") : t("submitSave")}
      </button>
    </form>
  );
}