import Menu from "@/components/Menu";
import { getPublications, getSettings } from "@/lib/data";
import { mdInline } from "@/lib/markdown";

export const metadata = { title: "Publications" };

export default async function PublicationsPage() {
  const [items, s] = await Promise.all([getPublications(), getSettings()]);
  return (
    <main className="page">
      <Menu />
      <div className="container">
        <h1 className="site-title">{s.siteName}</h1>
        <p className="label">Publications</p>
        <ul className="pub-list">
          {items.map((p) => (
            <li key={p.id}>
              {p.url ? (
                <a href={p.url} target="_blank" rel="noopener noreferrer" dangerouslySetInnerHTML={{ __html: mdInline(p.title) }} />
              ) : (
                <span dangerouslySetInnerHTML={{ __html: mdInline(p.title) }} />
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
