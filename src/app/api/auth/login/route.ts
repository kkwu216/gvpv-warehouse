import { cookies } from "next/headers";
import { clearSessionCookie, sessionCookieOptions, signSession } from "@/lib/auth";
import { verifyLogin } from "@/lib/users";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "ERR_INVALID_REQUEST" }, { status: 400 });
  }
  const data = body as Record<string, unknown>;
  const username = String(data.username ?? "");
  const password = String(data.password ?? "");
  const session = await verifyLogin(username, password);
  if (!session) {
    return Response.json({ error: "ERR_UNAUTHORIZED" }, { status: 401 });
  }
  const token = await signSession(session);
  if (!token) {
    return Response.json({ error: "ERR_INVALID_REQUEST" }, { status: 503 });
  }
  const jar = await cookies();
  jar.set(sessionCookieOptions(token));
  return Response.json({
    username: session.username,
    role: session.role,
  });
}

export async function DELETE() {
  const jar = await cookies();
  jar.set(clearSessionCookie());
  return new Response(null, { status: 204 });
}