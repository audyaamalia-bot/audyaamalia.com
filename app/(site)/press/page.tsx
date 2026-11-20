import { Fragment } from "react";
import Menu from "@/components/Menu";
import { getPress, getSettings } from "@/lib/data";

export const metadata = { title: "Press" };

export default async function PressPage() {
  const [items, s] = await Promise.all([getPress(), getSettings()]);
  const years = [...new Set(items.map((i) => i.year))];
  return (
    <main className="page">
      <Menu />
      <div className="container">
        <h1 className="site-title" style={{ marginTop: 50 }}>{s.siteName}</h1>
        <p className="label" style={{ fontSize: 13 }}>PRESS:</p>
        {years.map((y) => (
          <div key={y}>
            <p className="press-year">{y}</p>
            <p className="press-links">
              {items.filter((i) => i.year === y).map((i, n) => (
                <Fragment key={i.id}>
                  {n > 0 ? <span className="sep">|</span> : null}
                  {i.url ? <a href={i.url} target="_blank" rel="noopener noreferrer">{i.label}</a> : i.label}
                </Fragment>
              ))}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
