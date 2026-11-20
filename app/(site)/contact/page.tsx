import Menu from "@/components/Menu";
import { getSettings } from "@/lib/data";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const s = await getSettings();
  return (
    <main className="page">
      <Menu />
      <section className="contact">
        <h1>{s.contactHeading}</h1>
        {s.contactIntro ? <p>{s.contactIntro}</p> : null}
        {s.contactEmail ? (
          <p className="email">
            <a href={`mailto:${s.contactEmail}`} style={{ textDecoration: "none" }}>{s.contactEmail}</a>
          </p>
        ) : null}
        {s.contactOutro ? <p className="outro">{s.contactOutro}</p> : null}
        {s.instagramUrl ? (
          <a className="ig" href={s.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
            </svg>
          </a>
        ) : null}
      </section>
    </main>
  );
}
