import { getSessionFromRequest } from "@/lib/auth";
import { listMovements, registerMovement } from "@/lib/inventory";

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return Response.json({ error: "ERR_UNAUTHORIZED" }, { status: 401 });
  }
  const url = new URL(request.url);
  const direction = url.searchParams.get("direction") ?? "";
  const mold = url.searchParams.get("mold") ?? "";
  const from = url.searchParams.get("from") ?? "";
  const to = url.searchParams.get("to") ?? "";
  const limit = Number(url.searchParams.get("limit") ?? "100");

  const rows = await listMovements({
    direction: direction === "in" || direction === "out" ? direction : "",
    mold,
    from: from || undefined,
    to: to || undefined,
    limit: Number.isFinite(limit) ? limit : 100,
  });
  return Response.json(rows, { headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return Response.json({ error: "ERR_UNAUTHORIZED" }, { status: 401 });
  }
  if (session.role !== "warehouse") {
    return Response.json({ error: "ERR_FORBIDDEN" }, { status: 403 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "ERR_INVALID_REQUEST" }, { status: 400 });
  }
  const data = body as Record<string, unknown>;
  const direction = data.direction;
  if (direction !== "in" && direction !== "out") {
    return Response.json({ error: "ERR_INVALID_DIRECTION" }, { status: 400 });
  }
  const result = await registerMovement({
    mold_number: String(data.mold_number ?? ""),
    direction,
    occurred_at: String(data.occurred_at ?? ""),
    truck_plate: String(data.truck_plate ?? ""),
  });
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 422 });
  }
  return Response.json({ id: result.id }, { status: 201 });
}