import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoPrincipal from "../assets/logo-principal.png";
import { useFavorites } from "../lib/favorites.jsx";
import { useCustomer } from "../lib/customer.js";

function IconSearch() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7"></circle>
      <path d="M20 20l-4.2-4.2"></path>
    </svg>
  );
}

function IconAccount() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#012746" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="8" r="3.6"></circle>
      <path d="M4.8 20c.6-3.6 3.6-5.6 7.2-5.6s6.6 2 7.2 5.6"></path>
    </svg>
  );
}

function IconHeart() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#012746" strokeWidth="2" strokeLinecap="round">
      <path d="M12 20s-7.2-4.4-7.2-9.2A4 4 0 0112 8.8 4 4 0 0119.2 10.8C19.2 15.6 12 20 12 20z"></path>
    </svg>
  );
}

function IconMenu() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16"></path>
    </svg>
  );
}

function NavA({ to, className, style, children }) {
  if (to && to.startsWith("#")) {
    return <a href={to} className={className} style={style}>{children}</a>;
  }
  return <Link to={to} className={className} style={style}>{children}</Link>;
}

export default function Header({
  marquee = null,
  animated = false,
  sticky = true,
  search = true,
  searchPlaceholder = "O que você está procurando?",
  account = true,
  categoriesNav = null,
  inlineNav = null,
  progress = null
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { favorites } = useFavorites();
  const { customer, logout } = useCustomer();

  const submitSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/busca?q=${encodeURIComponent(query.trim())}`);
  };

  const searchInput = (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder={searchPlaceholder}
      style={{ flex: 1, minWidth: 0, border: 0, background: "transparent", outline: "none", font: "400 15px Inter", color: "#1E293B", padding: "0 12px" }}
    />
  );

  return (
    <>
      {marquee && marquee.length > 0 && (
        animated ? (
          <div className="header-marquee" style={{ width: "100%", overflow: "hidden", background: "linear-gradient(90deg,#F05A00,#FF7A00)" }}>
            <div style={{ display: "flex", width: "200%", animation: "marqueeSlide 28s linear infinite" }}>
              {[0, 1].map((rep) => (
                <div
                  key={rep}
                  aria-hidden={rep === 1 ? "true" : undefined}
                  style={{ display: "flex", alignItems: "center", gap: 56, width: "50%", flex: "none", padding: "9px 0", font: "600 12.5px Inter", color: "#fff", letterSpacing: ".06em", whiteSpace: "nowrap", justifyContent: "space-around" }}
                >
                  {marquee.map((m, i) => <span key={i}>{m}</span>)}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="header-marquee" style={{ background: "linear-gradient(90deg,#F05A00,#FF7A00)" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "9px 24px", display: "flex", flexWrap: "wrap", gap: "8px 40px", justifyContent: "center", font: "600 12.5px Inter", color: "#fff", letterSpacing: ".06em" }}>
              {marquee.map((m, i) => <span key={i}>{m}</span>)}
            </div>
          </div>
        )
      )}

      <header style={{ position: sticky ? "sticky" : "static", top: 0, zIndex: 50, background: "#fff", borderBottom: "1px solid #E2E8F0", boxShadow: sticky ? "0 4px 20px rgba(1,39,70,.06)" : "none" }}>
        {inlineNav ? (
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
            <Link to="/" style={{ display: "block" }}>
              <img src={logoPrincipal} alt="Promo Aspiradores — qualidade para sua casa" style={{ width: 232, maxWidth: "100%", height: "auto", display: "block" }} />
            </Link>
            {search && (
              <form onSubmit={submitSearch} style={{ display: "flex", alignItems: "center", background: "#F1F5F9", border: "1.5px solid #E2E8F0", borderRadius: 8, height: 50, padding: "0 4px 0 16px" }}>
                <IconSearch />
                {searchInput}
                <button className="btn-search" style={{ height: 42, padding: "0 22px", border: 0, borderRadius: 6, background: "#012746", color: "#fff", font: "700 13px Montserrat", letterSpacing: ".06em", cursor: "pointer" }}>BUSCAR</button>
              </form>
            )}
            <nav style={{ display: "flex", flexWrap: "wrap", gap: 22 }}>
              {inlineNav.map((item, i) => (
                <Link
                  key={i}
                  to={item.to}
                  className={item.active ? "" : "hover-orange"}
                  style={{ font: item.active ? "600 14px Inter" : "500 14px Inter", color: item.active ? "#F05A00" : "#475569" }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        ) : (
          <div className="header-inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px", display: "grid", gridTemplateColumns: "minmax(180px,232px) minmax(0,1fr) auto", alignItems: "center", gap: 32 }}>
            <Link to="/" className="header-logo-link" style={{ display: "block" }}>
              <img className="header-logo" src={logoPrincipal} alt="Promo Aspiradores — qualidade para sua casa" style={{ width: "100%", maxWidth: 232, height: "auto", display: "block" }} />
            </Link>
            <form onSubmit={submitSearch} className="header-search" style={{ display: "flex", alignItems: "center", gap: 0, background: "#F1F5F9", border: "1.5px solid #E2E8F0", borderRadius: 8, height: 50, padding: "0 4px 0 16px" }}>
              <IconSearch />
              {searchInput}
              <button className="btn-search" style={{ height: 42, padding: "0 22px", border: 0, borderRadius: 6, background: "#012746", color: "#fff", font: "700 13px Montserrat", letterSpacing: ".06em", cursor: "pointer" }}>BUSCAR</button>
            </form>
            {account && (
              <div className="header-account" style={{ display: "flex", alignItems: "center", gap: 24 }}>
                {customer ? (
                  <button type="button" onClick={() => logout().then(() => navigate("/"))} style={{ display: "flex", alignItems: "center", gap: 9, border: 0, background: "transparent", cursor: "pointer", padding: 0 }}>
                    <IconAccount />
                    <span style={{ font: "500 12.5px Inter", lineHeight: 1.25, color: "#475569", textAlign: "left" }}>Olá, {customer.name.split(" ")[0]}<br /><strong style={{ font: "700 13px Montserrat", color: "#012746" }}>Sair</strong></span>
                  </button>
                ) : (
                  <Link to="/cadastro" style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <IconAccount />
                    <span style={{ font: "500 12.5px Inter", lineHeight: 1.25, color: "#475569" }}>Entrar<br /><strong style={{ font: "700 13px Montserrat", color: "#012746" }}>Minha conta</strong></span>
                  </Link>
                )}
                <Link to="/favoritos" style={{ display: "flex", alignItems: "center", gap: 9, position: "relative" }}>
                  <IconHeart />
                  {favorites.length > 0 && (
                    <span style={{ position: "absolute", top: -6, left: 12, minWidth: 16, height: 16, padding: "0 4px", borderRadius: 8, background: "#F05A00", color: "#fff", font: "700 10px Inter", display: "flex", alignItems: "center", justifyContent: "center" }}>{favorites.length}</span>
                  )}
                  <span style={{ font: "500 12.5px Inter", lineHeight: 1.25, color: "#475569" }}>Lista de<br /><strong style={{ font: "700 13px Montserrat", color: "#012746" }}>Favoritos</strong></span>
                </Link>
              </div>
            )}
          </div>
        )}

        {categoriesNav && (
          <nav style={{ borderTop: "1px solid #F1F5F9" }}>
            <div className="header-catnav" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 28, overflowX: "auto" }}>
              {categoriesNav.showAllCategories && (
                <>
                  <NavA to={categoriesNav.allCategoriesTo || "#categorias"} style={{ display: "flex", alignItems: "center", gap: 9, padding: "13px 0", font: "700 13px Montserrat", letterSpacing: ".04em", color: "#012746", whiteSpace: "nowrap" }}>
                    <IconMenu />
                    TODAS AS CATEGORIAS
                  </NavA>
                  <span style={{ width: 1, height: 20, background: "#E2E8F0", flex: "none" }}></span>
                </>
              )}
              {categoriesNav.menu.map((item, i) => (
                <NavA key={i} to={`${categoriesNav.itemTo || "/categoria"}?cat=${encodeURIComponent(item)}`} className="hover-orange" style={{ padding: "13px 0", font: "500 14px Inter", color: "#475569", whiteSpace: "nowrap" }}>{item}</NavA>
              ))}
              <NavA to={categoriesNav.ofertaTo || categoriesNav.itemTo} style={{ marginLeft: "auto", padding: "13px 0", font: "800 13px Montserrat", letterSpacing: ".05em", color: "#F05A00", whiteSpace: "nowrap" }}>OFERTAS DA SEMANA</NavA>
            </div>
          </nav>
        )}

        {progress !== null && (
          <div style={{ height: 3, background: "#F1F5F9" }}>
            <div style={{ height: "100%", width: progress, background: "#F05A00", transition: "width .1s linear" }}></div>
          </div>
        )}
      </header>
    </>
  );
}
