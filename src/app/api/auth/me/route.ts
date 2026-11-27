import { getSessionFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return Response.json({ error: "ERR_UNAUTHORIZED" }, { status: 401 });
  }
  return Response.json(
    { username: session.username, role: session.role },
    { headers: { "cache-control": "private, no-store" } },
  );
}