import "server-only";
import path from "node:path";

const MAX_BYTES = 4.5 * 1024 * 1024;
const ALLOWED: Record<string, { ext: string; magic: (b: Uint8Array) => boolean }> = {
  "image/jpeg": { ext: "jpg", magic: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  "image/png": { ext: "png", magic: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  "image/gif": { ext: "gif", magic: (b) => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 },
  "image/webp": { ext: "webp", magic: (b) => String.fromCharCode(...b.slice(0, 4)) === "RIFF" && String.fromCharCode(...b.slice(8, 12)) === "WEBP" },
  "image/avif": { ext: "avif", magic: (b) => String.fromCharCode(...b.slice(4, 12)).startsWith("ftypavi") },
};

/** Validasi berdasarkan isi file (magic bytes), bukan nama/ekstensi. SVG & HTML ditolak. */
async function validate(file: File) {
  if (file.size > MAX_BYTES) throw new Error(`File "${file.name}" lebih dari 4.5 MB.`);
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  for (const [type, spec] of Object.entries(ALLOWED)) if (spec.magic(head)) return { type, ext: spec.ext };
  throw new Error(`File "${file.name}" bukan gambar yang didukung (JPG, PNG, WebP, GIF, AVIF).`);
}

/** Upload: Vercel Blob di production, .data/uploads saat dev lokal. Return URL publik. */
export async function uploadFile(file: File): Promise<string> {
  const { type, ext } = await validate(file);
  const name = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`uploads/${name}`, file, { access: "public", contentType: type });
    return blob.url;
  }
  if (process.env.VERCEL || process.env.NODE_ENV === "production" && !process.env.ALLOW_LOCAL_UPLOADS)
    throw new Error("BLOB_READ_WRITE_TOKEN belum di-set (hubungkan Vercel Blob ke project).");
  const fs = await import("node:fs/promises");
  const dir = path.join(process.cwd(), ".data", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}

export async function deleteFile(url: string) {
  if (!url) return;
  try {
    if (/^https:\/\/[\w-]+\.public\.blob\.vercel-storage\.com\//.test(url) && process.env.BLOB_READ_WRITE_TOKEN) {
      const { del } = await import("@vercel/blob");
      await del(url);
    } else if (/^\/uploads\/[\w.-]+$/.test(url)) {
      const fs = await import("node:fs/promises");
      await fs.unlink(path.join(process.cwd(), ".data", "uploads", path.basename(url)));
    }
  } catch {
    /* ignore */
  }
}

export function isFile(v: FormDataEntryValue | null): v is File {
  return !!v && typeof v === "object" && "arrayBuffer" in v && (v as File).size > 0;
}
