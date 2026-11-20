import Shell from "../Shell";
import ImageInput from "@/components/ImageInput";
import { getSlides } from "@/lib/data";
import { addSlides, deleteSlide, updateSlide } from "../actions";

export default async function SlidesAdmin() {
  const items = await getSlides();
  return (
    <Shell>
      <h1>Home slides</h1>
      <p className="muted">Foto full-screen yang berganti otomatis di halaman Home. Kalau kosong, Home memakai cover dari Works.</p>
      <form action={addSlides} className="card">
        <ImageInput name="files" multiple label="Upload foto" />
        <button className="btn">Upload</button>
      </form>
      <div className="thumbs">
        {items.map((s) => (
          <figure key={s.id}>
            <img src={s.image} alt="" />
            <figcaption>
              <form action={updateSlide} className="inline">
                <input type="hidden" name="id" value={s.id} />
                <input type="number" name="sort" defaultValue={s.sort} style={{ width: 56, padding: 2 }} />
                <button>urut</button>
              </form>
              <form action={deleteSlide}><input type="hidden" name="id" value={s.id} /><button>hapus</button></form>
            </figcaption>
          </figure>
        ))}
      </div>
    </Shell>
  );
}
