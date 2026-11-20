import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { headers } from "next/headers";
import { sql } from "drizzle-orm";
import { getDb } from "./db";

/* ---------- password compare (constant time, no length leak) ---------- */
export function passwordMatches(input: string, expected: string) {
  if (!expected) return false;
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

/* ---------- login rate limit (stored in Postgres, works on serverless) ---------- */
const MAX_FAILS = 5;
const WINDOW_MIN = 15;

export async function clientIp() {
  const h = await headers();
  return (h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0] || "unknown").trim().slice(0, 64);
}

export async function isLockedOut(ip: string) {
  const db = await getDb();
  const res = await db.execute(
    sql`SELECT count(*)::int AS n FROM login_attempts WHERE ip = ${ip} AND at > now() - make_interval(mins => ${WINDOW_MIN})`,
  );
  const rows = ((res as unknown as { rows?: { n: number }[] }).rows ?? (res as unknown as { n: number }[]));
  return (rows[0]?.n ?? 0) >= MAX_FAILS;
}

export async function recordFailure(ip: string) {
  const db = await getDb();
  await db.execute(sql`INSERT INTO login_attempts (ip) VALUES (${ip})`);
  await db.execute(sql`DELETE FROM login_attempts WHERE at < now() - interval '1 day'`);
}

export async function clearFailures(ip: string) {
  const db = await getDb();
  await db.execute(sql`DELETE FROM login_attempts WHERE ip = ${ip}`);
}

/* ---------- URL validation ---------- */
/** Only http(s) links (blocks javascript:, data:, etc). Returns "" when invalid. */
export function safeUrl(v: string) {
  if (!v) return "";
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : "";
  } catch {
    return "";
  }
}

/** Image URLs that this site itself stored (prevents tampering with hidden form fields). */
export function isOwnAsset(u: unknown): u is string {
  if (typeof u !== "string" || u.length > 500) return false;
  if (/^\/(uploads|placeholder)\/[\w.-]+$/.test(u)) return true;
  try {
    const url = new URL(u);
    return url.protocol === "https:" && url.hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export function parseAssetList(raw: string): string[] {
  try {
    const v = JSON.parse(raw || "[]");
    return Array.isArray(v) ? [...new Set(v.filter(isOwnAsset))].slice(0, 100) : [];
  } catch {
    return [];
  }
}
