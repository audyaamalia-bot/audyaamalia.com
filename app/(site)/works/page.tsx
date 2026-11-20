import Link from "next/link";
import Menu from "@/components/Menu";
import { getWorks } from "@/lib/data";

export const metadata = { title: "Works" };

export default async function WorksPage() {
  const works = await getWorks();
  return (
    <main className="page">
      <Menu />
      <div className="works">
        {works.map((w) => (
          <Link key={w.id} href={`/works/${w.slug}`} className="work-card">
            {w.cover ? <img src={w.cover} alt={w.title} loading="lazy" /> : null}
            <span className="t">
              {w.title}
              {w.year ? ` (${w.year})` : ""}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
