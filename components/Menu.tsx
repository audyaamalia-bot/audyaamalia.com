"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const ITEMS = [
  ["Home", "/"],
  ["Works", "/works"],
  ["Texts", "/texts"],
  ["Biography", "/biography"],
  ["Publications", "/publications"],
  ["Press", "/press"],
  ["Contact", "/contact"],
] as const;

export default function Menu({ light = false }: { light?: boolean }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button className={`burger${light ? " light" : ""}`} aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
        <span /><span /><span />
      </button>
      <div className={`menu-overlay${open ? " open" : ""}${light ? "" : " on-white"}`} onClick={() => setOpen(false)} aria-hidden={!open}>
        <button className="menu-close" aria-label="Close menu">×</button>
        <nav onClick={(e) => e.stopPropagation()}>
          {ITEMS.map(([label, href]) => (
            <Link key={href} href={href} className={(href === "/" ? path === "/" : path.startsWith(href)) ? "active" : ""} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
