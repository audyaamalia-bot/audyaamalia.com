/**
 * Isi database dengan struktur awal: daftar judul + tahun karya dan teks placeholder.
 * Deskripsi, foto, bio, dan CV asli diisi Audya lewat /admin.
 *   npm run seed            (lokal → PGlite)
 *   DATABASE_URL=... npm run seed   (Neon / Vercel Postgres)
 */
import { sql } from "drizzle-orm";
import * as schema from "../lib/schema";
import fs from "node:fs";
import path from "node:path";

const WORKS: [string, string][] = [
  ["We Sit With Our Grief, We Mother It", "2024"],
  ["Things Left Unsaid of the Edge of Her Fingers", "2023"],
  ["The Portrait of Oma Pet", "2023"],
  ["Untitled", "2022"],
  ["Untitled", "2020"],
  ["De Njai_Omat Pet", "2020"],
  ["De Njai", "2019"],
  ["His Mom Told Him To", "2019"],
  ["Pasal 346", "2019"],
  ["Lana Project", "2018"],
  ["Lana", "2018"],
  ["Domestic Goddess", "2017"],
  ["Daur", "2017"],
  ["Disosiatif", "2016"],
];

const TONES = ["#c9c3b8", "#a9a69c", "#8f8a80", "#b8b2a6", "#d6d1c7", "#9c968b", "#c2bcb0"];

function placeholder(i: number, label: string) {
  const dir = path.join(process.cwd(), "public", "placeholder");
  fs.mkdirSync(dir, { recursive: true });
  const file = `work-${i + 1}.svg`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200"><rect width="1200" height="1200" fill="${TONES[i % TONES.length]}"/><text x="600" y="1120" font-family="Arial" font-size="34" fill="#ffffff" fill-opacity=".55" text-anchor="middle">${label.replace(/&/g, "&amp;")} — placeholder</text></svg>`;
  fs.writeFileSync(path.join(dir, file), svg);
  return `/placeholder/${file}`;
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function main() {
  let db: any;
  if (process.env.DATABASE_URL) {
    const { neon } = await import("@neondatabase/serverless");
    const { drizzle } = await import("drizzle-orm/neon-http");
    db = drizzle(neon(process.env.DATABASE_URL), { schema });
  } else {
    const { PGlite } = await import("@electric-sql/pglite");
    const { drizzle } = await import("drizzle-orm/pglite");
    fs.mkdirSync(".data", { recursive: true });
    db = drizzle(new PGlite(".data/pglite"), { schema });
  }
  for (const s of schema.DDL) await db.execute(sql.raw(s));

  const existing = await db.select().from(schema.works);
  if (existing.length && !process.argv.includes("--force")) {
    console.log("Database sudah berisi data. Pakai --force untuk menimpa.");
    return;
  }
  for (const t of ["works", "texts", "press", "publications", "slides", "settings"]) await db.execute(sql.raw(`DELETE FROM ${t}`));

  for (let i = 0; i < WORKS.length; i++) {
    const [title, year] = WORKS[i];
    const img = placeholder(i, `${title} (${year})`);
    await db.insert(schema.works).values({
      title, year, slug: `${slug(title)}-${year}${title === "Untitled" ? `-${i}` : ""}`,
      cover: img, images: [img], sort: i, published: true,
      body: "Deskripsi karya belum diisi.\n\nTulis konsep, material, ukuran, dan konteks pameran karya ini lewat halaman admin → Works → Edit.",
    });
  }
  for (let i = 0; i < 3; i++) await db.insert(schema.slides).values({ image: `/placeholder/work-${i + 1}.svg`, sort: i });

  await db.insert(schema.publications).values([
    { title: "*Judul publikasi* — nama penerbit", url: "", sort: 0 },
    { title: "Artikel / profil seniman — nama media", url: "", sort: 1 },
  ]);
  await db.insert(schema.press).values([
    { year: "2024", label: "Nama Media (EN)", url: "", sort: 0 },
    { year: "2024", label: "Nama Media (ID)", url: "", sort: 1 },
    { year: "2023", label: "Nama Media (ID)", url: "", sort: 0 },
  ]);

  const settings: Record<string, string> = {
    siteName: "AUDYA AMALIA",
    bioHeading: "Hello",
    bioBody: "I'm **Audya Amalia**,\n\na visual artist based in Bandung, Indonesia.\n\n_Tulis bio lengkap lewat admin → Biography & Contact._",
    bioCv: "## Education\n- Tahun — Institusi\n\n## Solo Exhibitions\n- Tahun — Judul pameran, tempat\n\n## Group Exhibitions\n- Tahun — Judul pameran, tempat\n\n## Awards\n- Tahun — Nama penghargaan",
    contactHeading: "Contact",
    contactIntro: "For inquiries and collaborations, please get in touch at",
    contactEmail: "email@example.com",
    contactOutro: "Thank you!",
    instagramUrl: "https://instagram.com/",
    textsEmpty: "Coming soon",
  };
  for (const [key, value] of Object.entries(settings)) await db.insert(schema.settings).values({ key, value });
  console.log(`Seed selesai: ${WORKS.length} karya.`);
}

main().then(() => process.exit(0), (e) => { console.error(e); process.exit(1); });
