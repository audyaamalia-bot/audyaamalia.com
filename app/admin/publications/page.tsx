import Shell from "../Shell";
import ConfirmButton from "@/components/ConfirmButton";
import { getPublications } from "@/lib/data";
import { deletePublication, savePublication } from "../actions";

export default async function PublicationsAdmin() {
  const items = await getPublications();
  return (
    <Shell>
      <h1>Publications</h1>
      <p className="muted">Judul boleh pakai *miring* (Markdown).</p>
      <form action={savePublication} className="card inline">
        <input type="text" name="title" placeholder="Judul publikasi" required />
        <input type="url" name="url" placeholder="https://…" />
        <input type="number" name="sort" placeholder="Urutan" style={{ maxWidth: 90 }} />
        <button className="btn">+ Tambah</button>
      </form>
      <table className="tbl">
        <tbody>
          {items.map((p) => (
            <tr key={p.id}>
              <td>
                <form action={savePublication} className="inline">
                  <input type="hidden" name="id" value={p.id} />
                  <input type="text" name="title" defaultValue={p.title} />
                  <input type="url" name="url" defaultValue={p.url} />
                  <input type="number" name="sort" defaultValue={p.sort} style={{ maxWidth: 70 }} />
                  <button className="btn sm ghost">Simpan</button>
                </form>
              </td>
              <td><form action={deletePublication}><input type="hidden" name="id" value={p.id} /><ConfirmButton className="btn sm danger" message="Hapus publikasi ini?">Hapus</ConfirmButton></form></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Shell>
  );
}
