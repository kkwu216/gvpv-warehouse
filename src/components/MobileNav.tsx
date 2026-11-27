"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "./LocaleProvider";

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useLocale();
  const [role, setRole] = useState<"warehouse" | "viewer" | null>(null);

  useEffect(() => {
    void fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setRole(d?.role ?? null));
  }, []);

  const links = [
    { href: "/", label: t("navHome") },
    ...(role === "warehouse"
      ? [
          { href: "/inbound", label: t("navInbound") },
          { href: "/outbound", label: t("navOutbound") },
        ]
      : []),
    { href: "/history", label: t("navHistory") },
  ];

  const cols = links.length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <ul
        className="mx-auto grid max-w-lg gap-1 px-2 py-2"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex min-h-14 flex-col items-center justify-center rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-sky-600 text-white"
                    : "text-slate-600 active:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}