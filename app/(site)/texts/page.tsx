import Link from "next/link";
import Menu from "@/components/Menu";
import { getSettings, getTexts } from "@/lib/data";

export const metadata = { title: "Texts" };

export default async function TextsPage() {
  const [items, s] = await Promise.all([getTexts(), getSettings()]);
  return (
    <main className="page">
      <Menu />
      <div className="container">
        {items.length === 0 ? (
          <p className="coming">{s.textsEmpty}</p>
        ) : (
          <ul className="texts-list">
            {items.map((t) => (
              <li key={t.id}>
                <Link href={`/texts/${t.slug}`}>{t.title}</Link>
                {t.date ? <div className="d">{t.date}</div> : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
