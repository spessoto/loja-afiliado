import { Link } from "react-router-dom";
import logoFundoEscuro from "../assets/logo-fundo-escuro.png";

export function FooterFull({ columns }) {
  return (
    <footer style={{ background: "linear-gradient(180deg,#012746,#001B31)", color: "#B8C5D0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 24px 32px", display: "grid", gridTemplateColumns: `minmax(240px,1.2fr) repeat(${columns.length},minmax(0,1fr))`, gap: 40 }}>
        <div>
          <img src={logoFundoEscuro} alt="Promo Aspiradores" style={{ width: "100%", maxWidth: 230, height: "auto", display: "block", marginBottom: 20 }} />
          <p style={{ margin: 0, font: "400 14px/1.65 Inter", maxWidth: 300 }}>Loja especializada em aspiradores de pó para casa e uso profissional. Curadoria de especialistas, preço competitivo e compra segura.</p>
        </div>
        {columns.map((col, i) => (
          <div key={i}>
            <div style={{ font: "700 13px Montserrat", letterSpacing: ".1em", color: "#fff", marginBottom: 16 }}>{col.t}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {col.links.map((l, j) => (
                l.to ? (
                  <Link key={j} to={l.to} className="hover-orange" style={{ font: "400 14px Inter", color: "#B8C5D0" }}>{l.t}</Link>
                ) : (
                  <a key={j} href="#rodape" className="hover-orange" style={{ font: "400 14px Inter", color: "#B8C5D0" }}>{l.t}</a>
                )
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid #1E3A4D" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 24px", display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", font: "400 12.5px Inter", color: "#94A3B8" }}>
          <span>Promo Aspiradores — Preços e estoque sujeitos a alteração.</span>
          <span>Esta página contém links de afiliados.</span>
        </div>
      </div>
    </footer>
  );
}

