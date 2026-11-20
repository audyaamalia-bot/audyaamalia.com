import Link from "next/link";
import { notFound } from "next/navigation";
import Menu from "@/components/Menu";
import { getTextBySlug } from "@/lib/data";
import { md } from "@/lib/markdown";

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P) {
  const t = await getTextBySlug((await params).slug);
  return { title: t?.title ?? "Not found" };
}

export default async function TextDetail({ params }: P) {
  const t = await getTextBySlug((await params).slug);
  if (!t) notFound();
  return (
    <main className="page">
      <Menu />
      <article className="container">
        <h1 className="site-title" style={{ marginBottom: 12 }}>{t.title}</h1>
        {t.date ? <p className="coming" style={{ marginTop: 0, marginBottom: 40, color: "#555" }}>{t.date}</p> : null}
        <div className="prose" dangerouslySetInnerHTML={{ __html: md(t.body) }} />
        <Link href="/texts" className="back">← Texts</Link>
      </article>
    </main>
  );
}
