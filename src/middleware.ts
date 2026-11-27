import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from "@/i18n/messages";

const PUBLIC_PATHS = new Set(["/login"]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic =
    PUBLIC_PATHS.has(pathname) ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico";

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;

  if (
    !session &&
    !isPublic &&
    !pathname.startsWith("/api/auth/") &&
    pathname !== "/api/locale"
  ) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "ERR_UNAUTHORIZED" }, { status: 401 });
    }
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  if (session && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    session?.role === "viewer" &&
    (pathname === "/inbound" || pathname === "/outbound")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const response = NextResponse.next();
  const lang = request.cookies.get(LOCALE_COOKIE)?.value;
  if (!lang || !isLocale(lang)) {
    response.cookies.set(LOCALE_COOKIE, DEFAULT_LOCALE, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};