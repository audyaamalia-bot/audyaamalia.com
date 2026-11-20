import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import Shell from "../../Shell";
import ImageInput from "@/components/ImageInput";
import ImagesEditor from "@/components/ImagesEditor";
import { getDb, schema } from "@/lib/db";
import { saveWork } from "../../actions";

export default async function EditWork({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  let w = { id: 0, title: "", slug: "", year: "", body: "", cover: "", images: [] as string[], sort: 0, published: true };
  if (!isNew) {
    const db = await getDb();
    const [row] = await db.select().from(schema.works).where(eq(schema.works.id, Number(id)));
    if (!row) notFound();
    w = row;
  }
  return (
    <Shell>
      <h1>{isNew ? "Karya baru" : `Edit: ${w.title}`}</h1>
      <form action={saveWork}>
        <input type="hidden" name="id" value={w.id || ""} />
        <div className="card">
          <div className="row">
            <div className="field" style={{ gridColumn: "span 2" }}><label>Judul</label><input type="text" name="title" defaultValue={w.title} required /></div>
            <div className="field"><label>Tahun</label><input type="text" name="year" defaultValue={w.year} placeholder="2024" /></div>
          </div>
          <div className="row">
            <div className="field" style={{ gridColumn: "span 2" }}><label>Slug URL</label><input type="text" name="slug" defaultValue={w.slug} placeholder="otomatis dari judul" /></div>
            <div className="field"><label>Urutan</label><input type="number" name="sort" defaultValue={w.sort} /></div>
          </div>
          <label className="inline"><input type="checkbox" name="published" defaultChecked={w.published} /> Tampilkan di situs</label>
        </div>

        <div className="card">
          <div className="field">
            <label>Deskripsi karya</label>
            <small>Format Markdown: baris kosong = paragraf baru, *miring*, **tebal**, [teks](https://link).</small>
            <textarea name="body" defaultValue={w.body} />
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Gambar</h2>
          <p className="muted">Gambar pertama tampil di samping teks, sisanya jadi galeri di bawah. Cover = gambar di halaman Works.</p>
          <ImagesEditor initial={w.images} cover={w.cover} />
          <div className="row" style={{ marginTop: 14 }}>
            <ImageInput name="newImages" multiple label="Tambah gambar galeri" />
            <ImageInput name="coverFile" label="Atau upload cover khusus" />
          </div>
        </div>

        <div className="inline">
          <button className="btn">Simpan</button>
          <Link className="btn ghost" href="/admin/works">Batal</Link>
        </div>
      </form>
    </Shell>
  );
}
