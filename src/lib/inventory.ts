import type { InventoryErrorCode } from "./errors";
import { sql } from "./db";

export type Movement = {
  id: number;
  mold_number: string;
  direction: "in" | "out";
  occurred_at: string;
  truck_plate: string;
  created_at: string;
};

export type MoldStatus = {
  mold_number: string;
  direction: "in" | "out";
  occurred_at: string;
};

/** Latest movement per mold (determines in-warehouse state). */
export async function getLatestByMold(): Promise<Map<string, MoldStatus>> {
  const rows = await sql<MoldStatus>(`
    select distinct on (mold_number)
      mold_number,
      direction,
      occurred_at
    from movements
    order by mold_number, occurred_at desc, id desc
  `);
  const map = new Map<string, MoldStatus>();
  for (const row of rows) {
    map.set(row.mold_number.trim().toUpperCase(), row);
  }
  return map;
}

export async function getInStockCount(): Promise<number> {
  const latest = await getLatestByMold();
  let count = 0;
  for (const row of latest.values()) {
    if (row.direction === "in") count += 1;
  }
  return count;
}

export async function isInStock(moldNumber: string): Promise<boolean> {
  const key = moldNumber.trim().toUpperCase();
  const latest = await getLatestByMold();
  const row = latest.get(key);
  return row?.direction === "in";
}

export async function getRecentMovements(limit = 20): Promise<Movement[]> {
  return sql<Movement>(
    `select id, mold_number, direction, occurred_at, truck_plate, created_at
     from movements
     order by occurred_at desc, id desc
     limit $1`,
    [limit],
  );
}

export type MovementFilters = {
  direction?: "in" | "out" | "";
  mold?: string;
  from?: string;
  to?: string;
  limit?: number;
};

export async function listMovements(filters: MovementFilters): Promise<Movement[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];
  let i = 1;

  if (filters.direction === "in" || filters.direction === "out") {
    conditions.push(`direction = $${i++}`);
    params.push(filters.direction);
  }
  if (filters.mold?.trim()) {
    conditions.push(`upper(mold_number) like $${i++}`);
    params.push(`%${filters.mold.trim().toUpperCase()}%`);
  }
  if (filters.from) {
    conditions.push(`occurred_at >= $${i++}::timestamptz`);
    params.push(filters.from);
  }
  if (filters.to) {
    conditions.push(`occurred_at <= $${i++}::timestamptz`);
    params.push(filters.to);
  }

  const where = conditions.length ? `where ${conditions.join(" and ")}` : "";
  const limit = Math.min(filters.limit ?? 100, 500);
  params.push(limit);

  return sql<Movement>(
    `select id, mold_number, direction, occurred_at, truck_plate, created_at
     from movements
     ${where}
     order by occurred_at desc, id desc
     limit $${i}`,
    params,
  );
}

export async function registerMovement(input: {
  mold_number: string;
  direction: "in" | "out";
  occurred_at: string;
  truck_plate: string;
}): Promise<{ ok: true; id: number } | { ok: false; error: InventoryErrorCode }> {
  const mold = input.mold_number.trim();
  const plate = input.truck_plate.trim();
  if (!mold) return { ok: false, error: "ERR_MOLD_REQUIRED" };
  if (!plate) return { ok: false, error: "ERR_PLATE_REQUIRED" };
  if (!input.occurred_at) return { ok: false, error: "ERR_DATETIME_REQUIRED" };

  const inStock = await isInStock(mold);
  if (input.direction === "in" && inStock) {
    return { ok: false, error: "ERR_ALREADY_IN_STOCK" };
  }
  if (input.direction === "out" && !inStock) {
    return { ok: false, error: "ERR_NOT_IN_STOCK" };
  }

  const rows = await sql<{ id: number }>(
    `insert into movements (mold_number, direction, occurred_at, truck_plate)
     values ($1, $2, $3::timestamptz, $4)
     returning id`,
    [mold.toUpperCase(), input.direction, input.occurred_at, plate],
  );
  return { ok: true, id: rows[0]!.id };
}