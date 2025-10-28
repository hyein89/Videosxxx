import Link from "next/link";

export default function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Selamat datang di Video App</h1>
      <p>Contoh video: <Link href="/123abc">/123abc</Link></p>
    </div>
  );
}
