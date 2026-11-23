"use client";
import { useState } from "react";

/** Manage existing gallery images: reorder, remove, choose cover. Serialises into hidden inputs. */
export default function ImagesEditor({ initial, cover: initialCover }: { initial: string[]; cover: string }) {
  const [images, setImages] = useState(initial);
  const [removed, setRemoved] = useState<string[]>([]);
  const [cover, setCover] = useState(initialCover);
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    setImages(next);
  };
  const remove = (u: string) => {
    if (!window.confirm("Hapus gambar ini dari karya?")) return;
    setImages(images.filter((x) => x !== u));
    setRemoved([...removed, u]);
    if (cover === u) setCover("");
  };
  return (
    <>
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <input type="hidden" name="removed" value={JSON.stringify(removed)} />
      <input type="hidden" name="cover" value={cover} />
      <p className="muted" style={{ fontSize: 13 }}>
        Gambar pertama (urutan 1) tampil di samping teks pada halaman karya. Pilih satu sebagai <strong>cover</strong> (tampil di grid Works). Pakai ← → untuk mengurutkan.
      </p>
      {cover && !images.includes(cover) ? (
        <p className="muted">Cover saat ini (terpisah dari galeri):</p>
      ) : null}
      <div className="thumbs">
        {cover && !images.includes(cover) ? (
          <figure className="cover"><img src={cover} alt="" /><figcaption><span className="badge on">★ cover</span></figcaption></figure>
        ) : null}
        {images.map((u, i) => (
          <figure key={u} className={u === cover ? "cover" : ""}>
            <span className="pos">{i + 1}</span>
            <img src={u} alt="" />
            <figcaption>
              <button type="button" className="mini" onClick={() => move(i, -1)} title="Geser ke kiri" disabled={i === 0}>←</button>
              <button type="button" className="mini" onClick={() => move(i, 1)} title="Geser ke kanan" disabled={i === images.length - 1}>→</button>
              <button type="button" className={u === cover ? "mini on" : "mini"} onClick={() => setCover(u)}>{u === cover ? "★ cover" : "jadikan cover"}</button>
              <span className="spacer" />
              <button type="button" className="mini" onClick={() => remove(u)} title="Hapus gambar">🗑</button>
            </figcaption>
          </figure>
        ))}
      </div>
      {!images.length && !cover ? <p className="muted">Belum ada gambar. Upload lewat kolom di bawah.</p> : null}
    </>
  );
}
