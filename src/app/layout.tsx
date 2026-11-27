import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { AppShell } from "@/components/AppShell";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from "@/i18n/messages";
import "./globals.css";

export const metadata: Metadata = {
  title: "GVPV Mold Warehouse",
  description: "GVPV Vietnam mold storage records",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0284c7",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jar = await cookies();
  const raw = jar.get(LOCALE_COOKIE)?.value;
  const locale = raw && isLocale(raw) ? raw : DEFAULT_LOCALE;

  return (
    <html lang={locale === "zh" ? "zh-Hant" : locale}>
      <body className="min-h-dvh antialiased">
        <div className="mx-auto min-h-dvh max-w-lg px-4 pb-24 pt-6">
          <AppShell initialLocale={locale}>{children}</AppShell>
        </div>
      </body>
    </html>
  );
}