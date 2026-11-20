import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import Shell from "../../Shell";
import { getDb, schema } from "@/lib/db";
import { saveText } from "../../actions";

export default async function EditText({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let t = { id: 0, title: "", slug: "", date: "", body: "", published: true };
  if (id !== "new") {
    const db = await getDb();
    const [row] = await db.select().from(schema.texts).where(eq(schema.texts.id, Number(id)));
    if (!row) notFound();
    t = row;
  }
  return (
    <Shell>
      <h1>{t.id ? `Edit: ${t.title}` : "Tulisan baru"}</h1>
      <form action={saveText} className="card">
        <input type="hidden" name="id" value={t.id || ""} />
        <div className="row">
          <div className="field" style={{ gridColumn: "span 2" }}><label>Judul</label><input type="text" name="title" defaultValue={t.title} required /></div>
          <div className="field"><label>Tanggal</label><input type="text" name="date" defaultValue={t.date} placeholder="2026-10-22" /></div>
        </div>
        <div className="field"><label>Slug URL</label><input type="text" name="slug" defaultValue={t.slug} placeholder="otomatis dari judul" /></div>
        <div className="field"><label>Isi (Markdown)</label><textarea name="body" defaultValue={t.body} style={{ minHeight: 420 }} /></div>
        <label className="inline" style={{ marginBottom: 14 }}><input type="checkbox" name="published" defaultChecked={t.published} /> Tampilkan di situs</label>
        <div className="inline"><button className="btn">Simpan</button><Link className="btn ghost" href="/admin/texts">Batal</Link></div>
      </form>
    </Shell>
  );
}
