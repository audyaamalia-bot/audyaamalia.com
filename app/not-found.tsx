import Link from "next/link";
export default function NotFound() {
  return (
    <main className="page"><div className="container" style={{ textAlign: "center" }}>
      <h1 className="site-title">Not found</h1><Link href="/">← Home</Link>
    </div></main>
  );
}
