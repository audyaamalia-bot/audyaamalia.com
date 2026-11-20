import "server-only";
import { sql } from "drizzle-orm";
import * as schema from "./schema";

/**
 * Production (Vercel): DATABASE_URL -> Neon Postgres (serverless HTTP driver).
 * Local dev without DATABASE_URL: embedded PGlite stored in ./.data/pglite.
 */
type DB = ReturnType<typeof import("drizzle-orm/neon-http").drizzle<typeof schema>>;

const g = globalThis as unknown as { __db?: Promise<DB> };

async function create(): Promise<DB> {
  let db: DB;
  if (process.env.DATABASE_URL) {
    const { neon } = await import("@neondatabase/serverless");
    const { drizzle } = await import("drizzle-orm/neon-http");
    db = drizzle(neon(process.env.DATABASE_URL), { schema });
  } else {
    const { PGlite } = await import("@electric-sql/pglite");
    const { drizzle } = await import("drizzle-orm/pglite");
    const fs = await import("node:fs");
    fs.mkdirSync(".data", { recursive: true });
    db = drizzle(new PGlite(".data/pglite"), { schema }) as unknown as DB;
  }
  for (const stmt of schema.DDL) await db.execute(sql.raw(stmt));
  return db;
}

export function getDb(): Promise<DB> {
  if (!g.__db) g.__db = create();
  return g.__db;
}

export { schema };
