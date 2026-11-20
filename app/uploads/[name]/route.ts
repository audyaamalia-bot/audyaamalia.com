import { readFile } from "node:fs/promises";
import path from "node:path";

/** Dev saja: menyajikan gambar yang diupload tanpa Vercel Blob (disimpan di .data/uploads). */
const TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif", avif: "image/avif" };

export async function GET(_: Request, { params }: { params: Promise<{ name: string }> }) {
  const name = path.basename((await params).name);
  const type = TYPES[name.split(".").pop() || ""];
  if (!type || !/^[\w.-]+$/.test(name)) return new Response("Not found", { status: 404 });
  try {
    const buf = await readFile(path.join(process.cwd(), ".data", "uploads", name));
    return new Response(new Uint8Array(buf), {
      headers: { "Content-Type": type, "X-Content-Type-Options": "nosniff", "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
