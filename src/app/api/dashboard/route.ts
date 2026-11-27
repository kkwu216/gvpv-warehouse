import { getSessionFromRequest } from "@/lib/auth";
import { getInStockCount, getRecentMovements } from "@/lib/inventory";

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return Response.json({ error: "ERR_UNAUTHORIZED" }, { status: 401 });
  }
  const [inStock, recent] = await Promise.all([getInStockCount(), getRecentMovements(15)]);
  return Response.json(
    { inStock, recent },
    { headers: { "cache-control": "no-store" } },
  );
}