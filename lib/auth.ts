import { SignJWT, jwtVerify } from "jose";

export const COOKIE = "admin_session";

function key() {
  const s = process.env.AUTH_SECRET || (process.env.NODE_ENV !== "production" ? "dev-secret-change-me" : "");
  if (!s) throw new Error("AUTH_SECRET belum di-set");
  return new TextEncoder().encode(s);
}

export async function createSession() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key());
}

export async function verifySession(token?: string) {
  if (!token) return false;
  try {
    await jwtVerify(token, key());
    return true;
  } catch {
    return false;
  }
}
