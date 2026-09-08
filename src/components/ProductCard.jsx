import { Link } from "react-router-dom";

export default function ProductCard({ p, priceColor = "#F05A00", to }) {
  const target = to || (p.id ? `/produto/${p.id}` : "/produto");
  return (
    <Link to={target} className="product-card" style={{ display: "flex", flexDirection: "column", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ position: "relative", padding: "16px 16px 0" }}>
        {(p.desconto || p.selo) && (
          <div style={{ position: "absolute", top: 16, left: 16, zIndex: 2, display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
            {p.desconto && <span style={{ background: "#F05A00", color: "#fff", font: "800 12px Montserrat", padding: "5px 9px", borderRadius: 4 }}>{p.desconto}</span>}
            {p.selo && <span style={{ background: "#012746", color: "#fff", font: "700 10px Montserrat", letterSpacing: ".08em", padding: "4px 8px", borderRadius: 4 }}>{p.selo}</span>}
          </div>
        )}
        {p.image_url ? (
          <div style={{ aspectRatio: "1/1", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
            <img src={p.image_url} alt={p.nome} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
          </div>
        ) : (
          <div style={{ aspectRatio: "1/1", borderRadius: 8, background: "repeating-linear-gradient(135deg,#F8FAFC 0 8px,#F1F5F9 8px 16px)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 16, font: "400 10.5px ui-monospace,monospace", letterSpacing: ".06em", color: "#94A3B8" }}>
            FOTO DO PRODUTO<br />fundo branco
          </div>
        )}
      </div>
      <div style={{ padding: "14px 16px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ font: "600 11px Inter", letterSpacing: ".1em", color: "#94A3B8", marginBottom: 5 }}>{p.marca}</div>
        <div style={{ font: "600 14.5px/1.45 Inter", color: "#1E293B", marginBottom: 10, minHeight: 42 }}>{p.nome}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <span style={{ font: "600 12px Inter", color: "#F05A00", letterSpacing: ".08em" }}>{p.estrelas}</span>
          <span style={{ font: "400 12px Inter", color: "#94A3B8" }}>{p.avaliacoes}</span>
        </div>
        <div style={{ marginTop: "auto" }}>
          {p.de && <div style={{ font: "400 13px Inter", color: "#64748B", textDecoration: "line-through" }}>{p.de}</div>}
          <div style={{ font: "800 25px Montserrat", color: priceColor, lineHeight: 1.15 }}>{p.por}</div>
          <div style={{ font: "400 12.5px Inter", color: "#475569", marginBottom: 14 }}>{p.parcela}</div>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 44, borderRadius: 8, background: "#F05A00", color: "#fff", font: "700 13.5px Montserrat", letterSpacing: ".06em" }}>COMPRAR</span>
        </div>
      </div>
    </Link>
  );
}
