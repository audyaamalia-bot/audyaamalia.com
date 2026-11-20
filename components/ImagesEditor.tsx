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
    setImages(images.filter((x) => x !== u));
    setRemoved([...removed, u]);
    if (cover === u) setCover("");
  };
  return (
    <>
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <input type="hidden" name="removed" value={JSON.stringify(removed)} />
      <input type="hidden" name="cover" value={cover} />
      {cover && !images.includes(cover) ? (
        <p className="muted">Cover saat ini (terpisah dari galeri):</p>
      ) : null}
      <div className="thumbs">
        {cover && !images.includes(cover) ? (
          <figure className="cover"><img src={cover} alt="" /><figcaption><span className="badge">cover</span></figcaption></figure>
        ) : null}
        {images.map((u, i) => (
          <figure key={u} className={u === cover ? "cover" : ""}>
            <img src={u} alt="" />
            <figcaption>
              <button type="button" onClick={() => move(i, -1)} title="Geser kiri">←</button>
              <button type="button" onClick={() => move(i, 1)} title="Geser kanan">→</button>
              <button type="button" onClick={() => setCover(u)}>{u === cover ? "★ cover" : "jadikan cover"}</button>
              <button type="button" onClick={() => remove(u)}>hapus</button>
            </figcaption>
          </figure>
        ))}
      </div>
      {!images.length && !cover ? <p className="muted">Belum ada gambar.</p> : null}
    </>
  );
}
