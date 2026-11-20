import Link from "next/link";
import Shell from "../Shell";
import { getWorks } from "@/lib/data";
import { deleteWork } from "../actions";

export default async function WorksAdmin() {
  const works = await getWorks(false);
  return (
    <Shell>
      <h1>Works <Link className="btn sm" href="/admin/works/new">+ Karya baru</Link></h1>
      <p className="muted">Urutan di halaman Works mengikuti angka “Urutan” (kecil di atas), lalu yang terbaru.</p>
      <table className="tbl">
        <thead><tr><th></th><th>Judul</th><th>Tahun</th><th>Urutan</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {works.map((w) => (
            <tr key={w.id}>
              <td>{w.cover ? <img className="thumb" src={w.cover} alt="" /> : <div className="thumb" />}</td>
              <td><Link href={`/admin/works/${w.id}`}><strong>{w.title}</strong></Link><div className="muted">/works/{w.slug}</div></td>
              <td>{w.year}</td>
              <td>{w.sort}</td>
              <td>{w.published ? <span className="badge">tampil</span> : <span className="badge off">draft</span>}</td>
              <td className="inline">
                <Link className="btn sm ghost" href={`/admin/works/${w.id}`}>Edit</Link>
                <Link className="btn sm ghost" href={`/works/${w.slug}`} target="_blank">Lihat</Link>
                <form action={deleteWork}><input type="hidden" name="id" value={w.id} /><button className="btn sm danger">Hapus</button></form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Shell>
  );
}
