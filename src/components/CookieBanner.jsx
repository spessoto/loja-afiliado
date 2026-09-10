import { useLocation, Link } from "react-router-dom";
import { useCookieConsent } from "../lib/cookieConsent.js";

export default function CookieBanner() {
  const location = useLocation();
  const { consent, aceitarTodos, recusar } = useCookieConsent();

  if (consent || location.pathname.startsWith("/admin")) return null;

  return (
    <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 100, background: "#fff", borderTop: "1px solid #E2E8F0", boxShadow: "0 -6px 24px rgba(1,39,70,.12)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "18px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
        <p style={{ margin: 0, flex: 1, minWidth: 260, font: "400 14px/1.6 Inter", color: "#475569" }}>
          Usamos cookies essenciais para o site funcionar e, com sua autorização, cookies de audiência e marketing. Saiba mais na{" "}
          <Link to="/politica-de-cookies" style={{ color: "#F05A00", textDecoration: "underline" }}>Política de Cookies</Link>.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Link to="/politica-de-cookies" className="btn-outline-navy" style={{ display: "inline-flex", alignItems: "center", height: 46, padding: "0 22px", border: "1.5px solid #012746", borderRadius: 8, background: "#fff", color: "#012746", font: "600 13.5px Montserrat" }}>PERSONALIZAR</Link>
          <button onClick={recusar} className="btn-outline-navy" style={{ height: 46, padding: "0 22px", border: "1.5px solid #012746", borderRadius: 8, background: "#fff", color: "#012746", font: "600 13.5px Montserrat", cursor: "pointer" }}>SÓ OS ESSENCIAIS</button>
          <button onClick={aceitarTodos} className="btn-primary" style={{ height: 46, padding: "0 26px", border: 0, borderRadius: 8, background: "#F05A00", color: "#fff", font: "700 13.5px Montserrat", letterSpacing: ".04em", cursor: "pointer" }}>ACEITAR TODOS</button>
        </div>
      </div>
    </div>
  );
}
