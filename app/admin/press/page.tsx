import Shell from "../Shell";
import { getPress } from "@/lib/data";
import { deletePress, savePress } from "../actions";

export default async function PressAdmin() {
  const items = await getPress();
  return (
    <Shell>
      <h1>Press</h1>
      <form action={savePress} className="card inline">
        <input type="text" name="year" placeholder="Tahun" style={{ maxWidth: 90 }} required />
        <input type="text" name="label" placeholder="Nama media, mis. Kompas (ID)" required />
        <input type="url" name="url" placeholder="https://…" />
        <input type="number" name="sort" placeholder="Urutan" style={{ maxWidth: 90 }} />
        <button className="btn">+ Tambah</button>
      </form>
      <table className="tbl">
        <thead><tr><th>Tahun</th><th>Label</th><th>URL</th><th>Urutan</th><th></th></tr></thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id}>
              <td colSpan={4}>
                <form action={savePress} className="inline" id={`p${p.id}`}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="text" name="year" defaultValue={p.year} style={{ maxWidth: 80 }} />
                  <input type="text" name="label" defaultValue={p.label} />
                  <input type="url" name="url" defaultValue={p.url} />
                  <input type="number" name="sort" defaultValue={p.sort} style={{ maxWidth: 70 }} />
                  <button className="btn sm ghost">Simpan</button>
                </form>
              </td>
              <td><form action={deletePress}><input type="hidden" name="id" value={p.id} /><button className="btn sm danger">Hapus</button></form></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Shell>
  );
}
