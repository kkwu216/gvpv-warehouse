import { cookies } from "next/headers";
import { LOCALE_COOKIE, isLocale } from "@/i18n/messages";

export async function POST(request: Request) {
  const body = (await request.json()) as { locale?: string };
  if (!body.locale || !isLocale(body.locale)) {
    return Response.json({ error: "ERR_INVALID_REQUEST" }, { status: 400 });
  }
  const jar = await cookies();
  jar.set(LOCALE_COOKIE, body.locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return Response.json({ locale: body.locale });
}