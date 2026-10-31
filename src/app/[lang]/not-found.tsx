import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100svh", display: "grid", placeItems: "center", textAlign: "center", padding: 24 }}>
      <div>
        <p className="display" style={{ fontSize: "clamp(80px,20vw,300px)" }}>404</p>
        <Link href="/en" className="mono ulink">Back home</Link>
      </div>
    </main>
  );
}
