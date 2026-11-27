import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "gvpv_session";
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 14;

export type SessionPayload = {
  uid: number;
  username: string;
  role: "warehouse" | "viewer";
};

function sessionSecret(): Uint8Array | null {
  const raw =
    process.env.GVPV_AUTH_SECRET?.trim() ||
    (process.env.NODE_ENV === "production" ? "" : "gvpv-local-dev-secret");
  if (!raw) return null;
  return new TextEncoder().encode(raw);
}

export async function signSession(payload: SessionPayload): Promise<string | null> {
  const secret = sessionSecret();
  if (!secret) return null;
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.username)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SEC}s`)
    .setJti(String(payload.uid))
    .sign(secret);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  const secret = sessionSecret();
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    const username = payload.sub;
    const uid = Number(payload.jti);
    const role = payload.role;
    if (
      typeof username !== "string" ||
      !Number.isFinite(uid) ||
      (role !== "warehouse" && role !== "viewer")
    ) {
      return null;
    }
    return { username, uid, role };
  } catch {
    return null;
  }
}

export function sessionCookieOptions(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  };
}

export function clearSessionCookie() {
  return {
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}

export async function getSessionFromRequest(request: Request): Promise<SessionPayload | null> {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  if (!match?.[1]) return null;
  return verifySession(decodeURIComponent(match[1]));
}