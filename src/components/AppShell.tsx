"use client";

import { usePathname } from "next/navigation";
import { AppHeader } from "./AppHeader";
import { MobileNav } from "./MobileNav";
import { LocaleProvider } from "./LocaleProvider";
import type { Locale } from "@/i18n/messages";

export function AppShell({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <LocaleProvider initialLocale={initialLocale}>
      <AppHeader />
      {children}
      <MobileNav />
    </LocaleProvider>
  );
}