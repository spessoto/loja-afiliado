import { Link } from "react-router-dom";
import { useFavorites } from "../lib/favorites.jsx";
import { useCompare } from "../lib/compare.js";

function HeartIcon({ filled }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#F05A00" : "none"} stroke={filled ? "#F05A00" : "#475569"} strokeWidth="2" strokeLinecap="round">
      <path d="M12 20s-7.2-4.4-7.2-9.2A4 4 0 0112 8.8 4 4 0 0119.2 10.8C19.2 15.6 12 20 12 20z"></path>
    </svg>
  );
}

export default function ProductCard({ p, priceColor = "#F05A00", to, showCompare = true }) {
  const target = to || (p.id ? `/produto/${p.id}` : "/produto");
  const { isFavorite, toggle: toggleFavorite } = useFavorites();
  const { isComparing, toggle: toggleCompare, ids, max } = useCompare();
  const favorited = p.id ? isFavorite(p.id) : false;
  const comparing = p.id ? isComparing(p.id) : false;

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
      {p.id && showCompare && (
        <label
          onClick={(e) => e.stopPropagation()}
          title={!comparing && ids.length >= max ? `Máximo de ${max} produtos na comparação` : "Comparar"}
          style={{ position: "absolute", top: 54, right: 12, zIndex: 3, display: "flex", alignItems: "center", gap: 6, padding: "5px 9px", borderRadius: 20, background: "rgba(255,255,255,.95)", border: "1px solid #E2E8F0", font: "600 11px Inter", color: "#012746", cursor: !comparing && ids.length >= max ? "not-allowed" : "pointer" }}
        >
          <input
            type="checkbox"
            checked={comparing}
            disabled={!comparing && ids.length >= max}
            onChange={() => toggleCompare(p.id)}
            style={{ width: 14, height: 14, accentColor: "#F05A00", cursor: "inherit" }}
          />
          Comparar
        </label>
      )}
      <Link to={target} style={{ display: "contents" }}>
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
            <div style={{ font: "800 25px Montserrat", color: priceColor, lineHeight: 1.15, marginBottom: 14 }}>{p.por}</div>
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 44, borderRadius: 8, background: "#F05A00", color: "#fff", font: "700 13.5px Montserrat", letterSpacing: ".06em" }}>COMPRAR</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
