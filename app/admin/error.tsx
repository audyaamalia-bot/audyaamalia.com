"use client";
import Link from "next/link";

export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="adm-main" style={{ maxWidth: 520 }}>
      <div className="card">
        <h1>Gagal menyimpan</h1>
        <p>Periksa lagi isian form. Untuk upload, pastikan file berupa gambar JPG, PNG, WebP, GIF, atau AVIF dengan ukuran di bawah 4.5 MB.</p>
        <div className="inline">
          <button className="btn" onClick={reset}>Coba lagi</button>
          <Link className="btn ghost" href="/admin">Ke dashboard</Link>
        </div>
      </div>
    </main>
  );
}
