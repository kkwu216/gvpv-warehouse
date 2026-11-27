"use client";

import {
  DEFAULT_LOCALE,
  type Locale,
  type MessageKey,
  isLocale,
  t as translate,
} from "@/i18n/messages";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";

type Session = { username: string; role: "warehouse" | "viewer" } | null;

type Ctx = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey) => string;
  session: Session;
  refreshSession: () => Promise<void>;
};

const LocaleContext = createContext<Ctx | null>(null);

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [session, setSession] = useState<Session>(null);
  const [, startTransition] = useTransition();

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        setSession(null);
        return;
      }
      setSession((await res.json()) as Session);
    } catch {
      setSession(null);
    }
  }, []);

  const setLocale = useCallback(
    (next: Locale) => {
      startTransition(async () => {
        setLocaleState(next);
        await fetch("/api/locale", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ locale: next }),
        });
        router.refresh();
      });
    },
    [router],
  );

  const t = useCallback((key: MessageKey) => translate(key, locale), [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, t, session, refreshSession }),
    [locale, setLocale, t, session, refreshSession],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale outside provider");
  return ctx;
}

export function readLocaleCookie(cookieHeader: string | undefined): Locale {
  const match = cookieHeader?.match(/gvpv_lang=([^;]+)/);
  const raw = match?.[1];
  return raw && isLocale(raw) ? raw : DEFAULT_LOCALE;
}