import Link from "next/link";

export default function Custom404() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      textAlign: "center",
      fontFamily: "'Inter', sans-serif",
      backgroundColor: "#f2f2f2",
      padding: "20px"
    }}>
      <h1 style={{ fontSize: "4rem", marginBottom: "20px" }}>404</h1>
      <h2 style={{ marginBottom: "20px" }}>Video tidak ditemukan!</h2>
      <p style={{ marginBottom: "20px" }}>Maaf, video yang kamu cari tidak tersedia.</p>
      <Link href="/">
        <button style={{
          padding: "10px 20px",
          fontSize: "1rem",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}>
          Kembali ke Beranda
        </button>
      </Link>
    </div>
  );
}
