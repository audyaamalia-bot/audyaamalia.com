import Link from "next/link";
import Shell from "./Shell";
import { getPress, getPublications, getSlides, getTexts, getWorks } from "@/lib/data";

export default async function Dashboard() {
  const [w, t, s, p, pr] = await Promise.all([getWorks(false), getTexts(false), getSlides(), getPublications(), getPress()]);
  const cards = [
    ["Works", "/admin/works", `${w.length} karya`],
    ["Texts", "/admin/texts", `${t.length} tulisan`],
    ["Home Slides", "/admin/slides", `${s.length} gambar`],
    ["Biography & Contact", "/admin/settings", "Profil, CV, email, Instagram"],
    ["Publications", "/admin/publications", `${p.length} item`],
    ["Press", "/admin/press", `${pr.length} tautan`],
  ];
  return (
    <Shell>
      <h1>Dashboard</h1>
      <div className="grid-dash">
        {cards.map(([t, h, d]) => (
          <Link key={h} href={h} className="card"><strong>{t}</strong><div className="muted">{d}</div></Link>
        ))}
      </div>
    </Shell>
  );
}
