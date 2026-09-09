import { Link } from "react-router-dom";
import { useCompare } from "../lib/compare.js";

export default function CompareBar() {
  const { ids, clear } = useCompare();
  if (ids.length === 0) return null;

  return (
    <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 40, background: "#012746", boxShadow: "0 -8px 24px rgba(1,39,70,.25)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "14px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <span style={{ font: "600 14px Inter", color: "#fff" }}>{ids.length} produto{ids.length > 1 ? "s" : ""} selecionado{ids.length > 1 ? "s" : ""} para comparar</span>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={clear} style={{ border: 0, background: "transparent", font: "600 13px Inter", color: "#B8C5D0", cursor: "pointer", textDecoration: "underline" }}>Limpar</button>
          <Link to="/comparar" className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 44, padding: "0 22px", borderRadius: 8, background: "#F05A00", color: "#fff", font: "700 13.5px Montserrat", letterSpacing: ".04em" }}>
            COMPARAR AGORA
          </Link>
        </div>
      </div>
    </div>
  );
}
