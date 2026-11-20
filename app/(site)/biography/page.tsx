import Menu from "@/components/Menu";
import { getSettings } from "@/lib/data";
import { md } from "@/lib/markdown";

export const metadata = { title: "Biography" };

export default async function BiographyPage() {
  const s = await getSettings();
  return (
    <main className="page">
      <Menu />
      <section className="bio">
        <div>{s.bioPhoto ? <img src={s.bioPhoto} alt={s.siteName} /> : null}</div>
        <div>
          <h1>{s.bioHeading}</h1>
          <div className="prose" dangerouslySetInnerHTML={{ __html: md(s.bioBody) }} />
        </div>
      </section>
      {s.bioCv ? <section className="cv prose" dangerouslySetInnerHTML={{ __html: md(s.bioCv) }} /> : null}
    </main>
  );
}
