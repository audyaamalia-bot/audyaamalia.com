import Link from "next/link";
import { notFound } from "next/navigation";
import Menu from "@/components/Menu";
import { getWorkBySlug } from "@/lib/data";
import { md } from "@/lib/markdown";

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P) {
  const w = await getWorkBySlug((await params).slug);
  return { title: w ? `${w.title}${w.year ? ` (${w.year})` : ""}` : "Not found" };
}

export default async function WorkDetail({ params }: P) {
  const w = await getWorkBySlug((await params).slug);
  if (!w) notFound();
  const [lead, ...more] = w.images.length ? w.images : w.cover ? [w.cover] : [];
  return (
    <main className="page">
      <Menu />
      <article className="detail">
        <div>
          <h1>{w.title}</h1>
          {w.year ? <p className="year">{w.year}</p> : null}
          <div className="prose" dangerouslySetInnerHTML={{ __html: md(w.body) }} />
        </div>
        <div className="media">{lead ? <img src={lead} alt={w.title} /> : null}</div>
      </article>
      {more.length ? (
        <div className="gallery">
          {more.map((src, i) => (
            <img key={src + i} src={src} alt={`${w.title} ${i + 2}`} loading="lazy" />
          ))}
        </div>
      ) : null}
      <Link href="/works" className="back">← Works</Link>
    </main>
  );
}
