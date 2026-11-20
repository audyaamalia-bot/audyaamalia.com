import Menu from "@/components/Menu";
import Slideshow from "@/components/Slideshow";
import { getSettings, getSlides, getWorks } from "@/lib/data";

export default async function Home() {
  const [slides, s] = await Promise.all([getSlides(), getSettings()]);
  let images = slides.map((x) => x.image);
  if (!images.length) images = (await getWorks()).map((w) => w.cover).filter(Boolean).slice(0, 6);
  const [first, ...rest] = s.siteName.split(" ");
  return (
    <main className="hero">
      <Menu light />
      {images.length ? <Slideshow images={images} /> : <div className="empty">Tambahkan slide di /admin/slides</div>}
      <h1 className="name">
        {first}
        <br />
        {rest.join(" ")}
      </h1>
    </main>
  );
}
