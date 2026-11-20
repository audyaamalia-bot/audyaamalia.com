"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { COOKIE, createSession, verifySession } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { SETTING_KEYS, type SettingKey } from "@/lib/data";
import { slugify } from "@/lib/markdown";
import { deleteFile, isFile, uploadFile } from "@/lib/storage";
import { clearFailures, clientIp, isLockedOut, parseAssetList, passwordMatches, recordFailure, safeUrl } from "@/lib/security";

const { works, texts, press, publications, slides, settings } = schema;

async function guard() {
  const ok = await verifySession((await cookies()).get(COOKIE)?.value);
  if (!ok) redirect("/admin/login");
}
const str = (f: FormData, k: string, max = 500) => String(f.get(k) ?? "").trim().slice(0, max);
const long = (f: FormData, k: string) => str(f, k, 100_000);
const num = (f: FormData, k: string) => Math.max(-1e6, Math.min(1e6, Math.trunc(Number(f.get(k) ?? 0)) || 0));
const done = (to: string) => {
  revalidatePath("/", "layout");
  redirect(to);
};

/* ---------------- auth ---------------- */
export async function login(_: unknown, f: FormData) {
  const ip = await clientIp();
  if (await isLockedOut(ip)) return { error: "Terlalu banyak percobaan gagal. Coba lagi 15 menit lagi." };
  const expected = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV !== "production" ? "admin" : "");
  if (!expected) return { error: "ADMIN_PASSWORD belum di-set di server." };
  if (!passwordMatches(String(f.get("password") ?? ""), expected)) {
    await recordFailure(ip);
    await new Promise((r) => setTimeout(r, 600));
    return { error: "Password salah." };
  }
  await clearFailures(ip);
  (await cookies()).set(COOKIE, await createSession(), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(COOKIE);
  redirect("/admin/login");
}

/* ---------------- works ---------------- */
async function uniqueSlug(table: typeof works | typeof texts, base: string, selfId?: number) {
  const db = await getDb();
  let slug = base, n = 2;
  for (;;) {
    const [hit] = await db.select({ id: table.id }).from(table).where(eq(table.slug, slug));
    if (!hit || hit.id === selfId) return slug;
    slug = `${base}-${n++}`;
  }
}

export async function saveWork(f: FormData) {
  await guard();
  const db = await getDb();
  const id = num(f, "id") || undefined;
  const title = str(f, "title") || "Untitled";
  const slug = await uniqueSlug(works, slugify(str(f, "slug") || `${title} ${str(f, "year")}`), id);
  const db0 = id ? (await db.select().from(works).where(eq(works.id, id)))[0] : undefined;
  const owned = new Set(db0 ? [db0.cover, ...db0.images] : []);
  // hanya terima URL gambar yang memang milik karya ini
  let images = parseAssetList(str(f, "images", 50_000)).filter((u) => owned.has(u));
  const removed = parseAssetList(str(f, "removed", 50_000)).filter((u) => owned.has(u));
  for (const file of f.getAll("newImages")) if (isFile(file)) images.push(await uploadFile(file));
  let cover = str(f, "cover");
  if (!owned.has(cover)) cover = "";
  const coverFile = f.get("coverFile");
  if (isFile(coverFile)) {
    if (cover && !images.includes(cover)) removed.push(cover);
    cover = await uploadFile(coverFile);
  }
  images = images.filter((u) => !removed.includes(u));
  if (!cover && images[0]) cover = images[0];
  const data = { title, slug, year: str(f, "year", 20), body: long(f, "body"), cover, images, sort: num(f, "sort"), published: f.get("published") === "on" };
  if (id) await db.update(works).set(data).where(eq(works.id, id));
  else await db.insert(works).values(data);
  for (const u of removed) if (u !== cover) await deleteFile(u);
  done("/admin/works");
}

export async function deleteWork(f: FormData) {
  await guard();
  const db = await getDb();
  const id = num(f, "id");
  const [w] = await db.select().from(works).where(eq(works.id, id));
  if (w) {
    await db.delete(works).where(eq(works.id, id));
    for (const u of new Set([w.cover, ...w.images])) await deleteFile(u);
  }
  done("/admin/works");
}

export async function reorderWorks(f: FormData) {
  await guard();
  const db = await getDb();
  const ids: number[] = JSON.parse(str(f, "order") || "[]");
  for (let i = 0; i < ids.length; i++) await db.update(works).set({ sort: i }).where(eq(works.id, ids[i]));
  done("/admin/works");
}

/* ---------------- texts ---------------- */
export async function saveText(f: FormData) {
  await guard();
  const db = await getDb();
  const id = num(f, "id") || undefined;
  const title = str(f, "title") || "Untitled";
  const slug = await uniqueSlug(texts, slugify(str(f, "slug") || title), id);
  const data = { title, slug, date: str(f, "date", 40), body: long(f, "body"), published: f.get("published") === "on" };
  if (id) await db.update(texts).set(data).where(eq(texts.id, id));
  else await db.insert(texts).values(data);
  done("/admin/texts");
}

export async function deleteText(f: FormData) {
  await guard();
  const db = await getDb();
  await db.delete(texts).where(eq(texts.id, num(f, "id")));
  done("/admin/texts");
}

/* ---------------- press ---------------- */
export async function savePress(f: FormData) {
  await guard();
  const db = await getDb();
  const id = num(f, "id");
  const data = { year: str(f, "year", 20), label: str(f, "label"), url: safeUrl(str(f, "url", 2000)), sort: num(f, "sort") };
  if (!data.year || !data.label) return done("/admin/press");
  if (id) await db.update(press).set(data).where(eq(press.id, id));
  else await db.insert(press).values(data);
  done("/admin/press");
}
export async function deletePress(f: FormData) {
  await guard();
  const db = await getDb();
  await db.delete(press).where(eq(press.id, num(f, "id")));
  done("/admin/press");
}

/* ---------------- publications ---------------- */
export async function savePublication(f: FormData) {
  await guard();
  const db = await getDb();
  const id = num(f, "id");
  const data = { title: str(f, "title", 1000), url: safeUrl(str(f, "url", 2000)), sort: num(f, "sort") };
  if (!data.title) return done("/admin/publications");
  if (id) await db.update(publications).set(data).where(eq(publications.id, id));
  else await db.insert(publications).values(data);
  done("/admin/publications");
}
export async function deletePublication(f: FormData) {
  await guard();
  const db = await getDb();
  await db.delete(publications).where(eq(publications.id, num(f, "id")));
  done("/admin/publications");
}

/* ---------------- slides ---------------- */
export async function addSlides(f: FormData) {
  await guard();
  const db = await getDb();
  const existing = await db.select().from(slides);
  let sort = existing.length;
  for (const file of f.getAll("files")) if (isFile(file)) await db.insert(slides).values({ image: await uploadFile(file), sort: sort++ });
  done("/admin/slides");
}
export async function updateSlide(f: FormData) {
  await guard();
  const db = await getDb();
  await db.update(slides).set({ sort: num(f, "sort") }).where(eq(slides.id, num(f, "id")));
  done("/admin/slides");
}
export async function deleteSlide(f: FormData) {
  await guard();
  const db = await getDb();
  const [s] = await db.select().from(slides).where(eq(slides.id, num(f, "id")));
  if (s) {
    await db.delete(slides).where(eq(slides.id, s.id));
    await deleteFile(s.image);
  }
  done("/admin/slides");
}

/* ---------------- settings ---------------- */
export async function saveSettings(f: FormData) {
  await guard();
  const db = await getDb();
  const values: Partial<Record<SettingKey, string>> = {};
  for (const k of Object.keys(SETTING_KEYS) as SettingKey[]) {
    if (k === "bioPhoto" || !f.has(k)) continue; // foto hanya lewat upload
    values[k] = k === "bioBody" || k === "bioCv" ? long(f, k) : str(f, k, 1000);
  }
  if (values.instagramUrl !== undefined) values.instagramUrl = safeUrl(values.instagramUrl);
  if (values.contactEmail !== undefined && values.contactEmail && !/^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(values.contactEmail)) values.contactEmail = "";
  const photo = f.get("bioPhotoFile");
  if (isFile(photo)) {
    const [old] = await db.select().from(settings).where(eq(settings.key, "bioPhoto"));
    values.bioPhoto = await uploadFile(photo);
    if (old?.value) await deleteFile(old.value);
  }
  for (const [key, value] of Object.entries(values)) {
    await db.insert(settings).values({ key, value: value ?? "" }).onConflictDoUpdate({ target: settings.key, set: { value: value ?? "" } });
  }
  done("/admin/settings");
}
