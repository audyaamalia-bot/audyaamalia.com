import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, verifySession } from "@/lib/auth";
import { logout } from "./actions";

/** Lapisan kedua: setiap halaman admin juga cek sesi di server (tidak hanya mengandalkan middleware). */
export default async function Shell({ children }: { children: React.ReactNode }) {
  if (!(await verifySession((await cookies()).get(COOKIE)?.value))) redirect("/admin/login");
  return (
    <>
      <header className="adm-top">
        <strong>ADMIN</strong>
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/works">Works</Link>
        <Link href="/admin/texts">Texts</Link>
        <Link href="/admin/slides">Home Slides</Link>
        <Link href="/admin/settings">Biography &amp; Contact</Link>
        <Link href="/admin/publications">Publications</Link>
        <Link href="/admin/press">Press</Link>
        <Link href="/" target="_blank">Lihat situs ↗</Link>
        <form action={logout}><button>Logout</button></form>
      </header>
      <main className="adm-main">{children}</main>
    </>
  );
}
