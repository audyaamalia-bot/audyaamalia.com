import Link from "next/link";
import Shell from "../Shell";
import { getTexts } from "@/lib/data";
import { deleteText } from "../actions";

export default async function TextsAdmin() {
  const items = await getTexts(false);
  return (
    <Shell>
      <h1>Texts <Link className="btn sm" href="/admin/texts/new">+ Tulisan baru</Link></h1>
      <p className="muted">Kalau belum ada tulisan yang tampil, halaman Texts menampilkan “Coming soon”.</p>
      <table className="tbl">
        <thead><tr><th>Judul</th><th>Tanggal</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {items.map((t) => (
            <tr key={t.id}>
              <td><Link href={`/admin/texts/${t.id}`}><strong>{t.title}</strong></Link></td>
              <td>{t.date}</td>
              <td>{t.published ? <span className="badge">tampil</span> : <span className="badge off">draft</span>}</td>
              <td className="inline">
                <Link className="btn sm ghost" href={`/admin/texts/${t.id}`}>Edit</Link>
                <form action={deleteText}><input type="hidden" name="id" value={t.id} /><button className="btn sm danger">Hapus</button></form>
              </td>
            </tr>
          ))}
          {!items.length ? <tr><td colSpan={4} className="muted">Belum ada tulisan.</td></tr> : null}
        </tbody>
      </table>
    </Shell>
  );
}
