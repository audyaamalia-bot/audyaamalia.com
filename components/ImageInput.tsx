"use client";
import { useState } from "react";

/** File input that downsizes images in the browser (max 2400px, JPEG 0.86) so uploads stay under Vercel's 4.5MB limit. */
export default function ImageInput({ name, multiple = false, label }: { name: string; multiple?: boolean; label?: string }) {
  const [busy, setBusy] = useState(false);
  const [count, setCount] = useState(0);

  async function shrink(file: File): Promise<File> {
    if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") return file;
    const bmp = await createImageBitmap(file);
    const max = 2400;
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    if (scale === 1 && file.size < 1.5e6) return file;
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * scale);
    c.height = Math.round(bmp.height * scale);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    const blob: Blob = await new Promise((r) => c.toBlob((b) => r(b!), "image/jpeg", 0.86));
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  }

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const files = Array.from(input.files || []);
    if (!files.length) return setCount(0);
    setBusy(true);
    const dt = new DataTransfer();
    for (const f of files) dt.items.add(await shrink(f));
    input.files = dt.files;
    setCount(dt.files.length);
    setBusy(false);
  }

  return (
    <div className="field">
      {label ? <label>{label}</label> : null}
      <input type="file" name={name} accept="image/*" multiple={multiple} onChange={onChange} />
      <small>{busy ? "Mengompres gambar…" : count ? `${count} file siap diupload` : "JPG/PNG/WebP — otomatis dikecilkan."}</small>
    </div>
  );
}
