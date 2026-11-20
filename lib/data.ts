import "server-only";
import { asc, desc, eq, and } from "drizzle-orm";
import { getDb, schema } from "./db";

const { works, texts, press, publications, slides, settings } = schema;

export const SETTING_KEYS = {
  siteName: "AUDYA AMALIA",
  bioHeading: "Hello",
  bioPhoto: "",
  bioBody: "",
  bioCv: "",
  contactHeading: "Contact",
  contactIntro: "",
  contactEmail: "",
  contactOutro: "",
  instagramUrl: "",
  textsEmpty: "Coming soon",
} as const;
export type SettingKey = keyof typeof SETTING_KEYS;
export type Settings = Record<SettingKey, string>;

export async function getSettings(): Promise<Settings> {
  const db = await getDb();
  const rows = await db.select().from(settings);
  const out = { ...SETTING_KEYS } as Settings;
  for (const r of rows) if (r.key in out) out[r.key as SettingKey] = r.value;
  return out;
}

export async function getWorks(onlyPublished = true) {
  const db = await getDb();
  const q = db.select().from(works);
  const rows = onlyPublished ? await q.where(eq(works.published, true)).orderBy(asc(works.sort), desc(works.id)) : await q.orderBy(asc(works.sort), desc(works.id));
  return rows;
}

export async function getWorkBySlug(slug: string) {
  const db = await getDb();
  const [row] = await db.select().from(works).where(and(eq(works.slug, slug), eq(works.published, true)));
  return row ?? null;
}

export async function getTexts(onlyPublished = true) {
  const db = await getDb();
  const q = db.select().from(texts);
  return onlyPublished ? q.where(eq(texts.published, true)).orderBy(desc(texts.date), desc(texts.id)) : q.orderBy(desc(texts.date), desc(texts.id));
}

export async function getTextBySlug(slug: string) {
  const db = await getDb();
  const [row] = await db.select().from(texts).where(and(eq(texts.slug, slug), eq(texts.published, true)));
  return row ?? null;
}

export async function getPress() {
  const db = await getDb();
  return db.select().from(press).orderBy(desc(press.year), asc(press.sort), asc(press.id));
}

export async function getPublications() {
  const db = await getDb();
  return db.select().from(publications).orderBy(asc(publications.sort), asc(publications.id));
}

export async function getSlides() {
  const db = await getDb();
  return db.select().from(slides).orderBy(asc(slides.sort), asc(slides.id));
}
