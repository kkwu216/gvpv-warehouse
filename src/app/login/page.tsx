import { cookies } from "next/headers";
import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from "@/i18n/messages";

export default async function LoginPage() {
  const jar = await cookies();
  const raw = jar.get(LOCALE_COOKIE)?.value;
  const locale = raw && isLocale(raw) ? raw : DEFAULT_LOCALE;

  return (
    <Suspense fallback={<p className="text-center text-slate-500">…</p>}>
      <LoginForm initialLocale={locale} />
    </Suspense>
  );
}