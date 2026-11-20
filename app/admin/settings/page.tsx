import Shell from "../Shell";
import ImageInput from "@/components/ImageInput";
import { getSettings } from "@/lib/data";
import { saveSettings } from "../actions";

export default async function SettingsAdmin() {
  const s = await getSettings();
  return (
    <Shell>
      <h1>Biography &amp; Contact</h1>
      <form action={saveSettings}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Umum</h2>
          <div className="field"><label>Nama situs (judul di Home, Publications, Press)</label><input type="text" name="siteName" defaultValue={s.siteName} /></div>
          <div className="field"><label>Teks halaman Texts saat kosong</label><input type="text" name="textsEmpty" defaultValue={s.textsEmpty} /></div>
        </div>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Biography</h2>
          <div className="row">
            <div>
              {s.bioPhoto ? <img src={s.bioPhoto} alt="" style={{ width: 160, borderRadius: 6, marginBottom: 8 }} /> : null}
              <ImageInput name="bioPhotoFile" label="Foto profil" />
            </div>
            <div className="field" style={{ gridColumn: "span 2" }}><label>Heading</label><input type="text" name="bioHeading" defaultValue={s.bioHeading} /></div>
          </div>
          <div className="field"><label>Bio singkat (kolom kanan, Markdown)</label><textarea name="bioBody" defaultValue={s.bioBody} /></div>
          <div className="field">
            <label>CV (di bawah bio, Markdown)</label>
            <small>Pakai “## EDUCATION”, “## SOLO EXHIBITIONS”, dst. sebagai judul bagian, lalu satu baris per item dengan “- ”.</small>
            <textarea name="bioCv" defaultValue={s.bioCv} style={{ minHeight: 400 }} />
          </div>
        </div>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Contact</h2>
          <div className="row">
            <div className="field"><label>Heading</label><input type="text" name="contactHeading" defaultValue={s.contactHeading} /></div>
            <div className="field"><label>Email</label><input type="email" name="contactEmail" defaultValue={s.contactEmail} /></div>
            <div className="field"><label>URL Instagram</label><input type="url" name="instagramUrl" defaultValue={s.instagramUrl} /></div>
          </div>
          <div className="field"><label>Kalimat pembuka</label><input type="text" name="contactIntro" defaultValue={s.contactIntro} /></div>
          <div className="field"><label>Kalimat penutup</label><input type="text" name="contactOutro" defaultValue={s.contactOutro} /></div>
        </div>
        <button className="btn">Simpan</button>
      </form>
    </Shell>
  );
}
