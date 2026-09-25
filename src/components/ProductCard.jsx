import { Link } from "react-router-dom";
import { useFavorites } from "../lib/favorites.jsx";
import { productUrl } from "../lib/products.js";
import { sizedImage } from "../../imageUrl.js";

function HeartIcon({ filled }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#C84A00" : "none"} stroke={filled ? "#C84A00" : "#475569"} strokeWidth="2" strokeLinecap="round">
      <path d="M12 20s-7.2-4.4-7.2-9.2A4 4 0 0112 8.8 4 4 0 0119.2 10.8C19.2 15.6 12 20 12 20z"></path>
    </svg>
  );
}

export default function ProductCard({ p, priceColor = "#C84A00", to }) {
  const target = to || productUrl(p.id, p.nome);
  const { isFavorite, toggle: toggleFavorite } = useFavorites();
  const favorited = p.id ? isFavorite(p.id) : false;

  return (
    <div className="product-card" style={{ position: "relative", display: "flex", flexDirection: "column", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
      {p.id && (
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); toggleFavorite(p.id); }}
          aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          title={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          style={{ position: "absolute", top: 12, right: 12, zIndex: 3, width: 34, height: 34, borderRadius: "50%", border: "1px solid #E2E8F0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <HeartIcon filled={favorited} />
        </button>
      )}
      <Link to={target} style={{ display: "contents" }}>
        <div style={{ position: "relative", padding: "16px 16px 0" }}>
          {(p.desconto || p.selo) && (
            <div style={{ position: "absolute", top: 16, left: 16, zIndex: 2, display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
              {p.desconto && <span style={{ background: "#C84A00", color: "#fff", font: "800 12px Montserrat", padding: "5px 9px", borderRadius: 4 }}>{p.desconto}</span>}
              {p.selo && <span style={{ background: "#012746", color: "#fff", font: "700 10px Montserrat", letterSpacing: ".08em", padding: "4px 8px", borderRadius: 4 }}>{p.selo}</span>}
            </div>
          )}
          {p.image_url ? (
            <div style={{ aspectRatio: "1/1", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
              <img src={sizedImage(p.image_url, 500)} alt={p.nome} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
            </div>
          ) : (
            <div style={{ aspectRatio: "1/1", borderRadius: 8, background: "repeating-linear-gradient(135deg,#F8FAFC 0 8px,#F1F5F9 8px 16px)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 16, font: "400 10.5px ui-monospace,monospace", letterSpacing: ".06em", color: "#64748B" }}>
              FOTO DO PRODUTO<br />fundo branco
            </div>
          )}
        </div>
        <div style={{ padding: "12px 14px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ font: "600 10.5px Inter", letterSpacing: ".1em", color: "#64748B", marginBottom: 4 }}>{p.marca}</div>
          <div style={{ font: "600 13.5px/1.4 Inter", color: "#1E293B", marginBottom: 8, minHeight: 38 }}>{p.nome}</div>
          <div style={{ marginTop: "auto" }}>
            {p.de && <div style={{ font: "400 12.5px Inter", color: "#64748B", textDecoration: "line-through" }}>{p.de}</div>}
            {p.por
              ? <div style={{ font: "800 20px Montserrat", color: priceColor, lineHeight: 1.15, marginBottom: p.loja === "ml" ? 4 : 12 }}>{p.por}</div>
              : <div style={{ font: "600 13.5px Inter", color: "#475569", lineHeight: 1.15, marginBottom: 12 }}>Ver preço atual na loja</div>}
            {p.loja === "ml" && <div style={{ font: "500 10.5px Inter", color: "#64748B", marginBottom: 8 }}>Publicidade · preço sujeito a alteração</div>}
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 40, borderRadius: 8, background: "#C84A00", color: "#fff", font: "700 12.5px Montserrat", letterSpacing: ".06em" }}>{p.por ? "COMPRAR" : "VER OFERTA"}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
