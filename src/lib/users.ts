import { compare } from "bcryptjs";
import { sql } from "./db";
import type { SessionPayload } from "./auth";

export type DbUser = {
  id: number;
  username: string;
  password_hash: string;
  role: "warehouse" | "viewer";
};

export async function findUserByUsername(username: string): Promise<DbUser | null> {
  const rows = await sql<DbUser>(
    `select id, username, password_hash, role from users where lower(username) = lower($1) limit 1`,
    [username.trim()],
  );
  return rows[0] ?? null;
}

export async function verifyLogin(
  username: string,
  password: string,
): Promise<SessionPayload | null> {
  const user = await findUserByUsername(username);
  if (!user) return null;
  const ok = await compare(password, user.password_hash);
  if (!ok) return null;
  return { uid: user.id, username: user.username, role: user.role };
}