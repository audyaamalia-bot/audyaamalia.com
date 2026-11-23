import Shell from "../Shell";
import ImageInput from "@/components/ImageInput";
import ConfirmButton from "@/components/ConfirmButton";
import { getSlides } from "@/lib/data";
import { addSlides, deleteSlide, updateSlide } from "../actions";

export default async function SlidesAdmin() {
  const items = await getSlides();
  return (
    <Shell>
      <h1>Home Slides <span className="badge">{items.length} gambar</span></h1>
      <p className="muted">Foto full-screen yang berganti otomatis di halaman Home (ganti tiap 5 detik). Kamu bisa upload banyak foto sekaligus. Kalau kosong, Home memakai cover dari Works.</p>

      <form action={addSlides} className="card">
        <ImageInput name="files" multiple label="Tambah foto slideshow (bisa pilih banyak sekaligus)" />
        <p className="muted" style={{ fontSize: 13, margin: "4px 0 14px" }}>Tahan Ctrl/Cmd atau Shift saat memilih untuk pilih beberapa foto. Foto otomatis dikecilkan sebelum diupload.</p>
        <button className="btn">⬆ Upload foto</button>
      </form>

      <h2>Foto saat ini</h2>
      {items.length === 0 ? (
        <div className="empty-box">Belum ada foto slideshow. Upload foto di atas untuk mulai mengisi halaman Home.</div>
      ) : (
        <>
          <p className="muted" style={{ fontSize: 13 }}>Angka “urutan” menentukan posisi tampil (makin kecil makin dulu). Ubah angkanya lalu klik “Simpan urutan”.</p>
          <div className="thumbs">
            {items.map((s, idx) => (
              <figure key={s.id}>
                <span className="pos">{idx + 1}</span>
                <img src={s.image} alt="" />
                <figcaption>
                  <form action={updateSlide} className="inline" style={{ gap: 4 }}>
                    <input type="hidden" name="id" value={s.id} />
                    <input type="number" name="sort" defaultValue={s.sort} title="Urutan tampil" style={{ width: 56, padding: "4px 6px" }} />
                    <button className="mini" title="Simpan urutan">Simpan urutan</button>
                  </form>
                  <span className="spacer" />
                  <form action={deleteSlide}>
                    <input type="hidden" name="id" value={s.id} />
                    <ConfirmButton message="Hapus foto ini dari slideshow?">🗑 Hapus</ConfirmButton>
                  </form>
                </figcaption>
              </figure>
            ))}
          </div>
        </>
      )}
    </Shell>
  );
}
