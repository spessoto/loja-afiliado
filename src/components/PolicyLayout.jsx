import { Link } from "react-router-dom";
import Header from "./Header.jsx";
import { FooterPolicy } from "./Footer.jsx";
import { categoriesMenu } from "../data/categoriesMenu.js";

export default function PolicyLayout({ title, description, updated = "Última atualização: 5 de setembro de 2026", breadcrumbLabel, toc, sidebarExtra, children, activeFooter }) {
  return (
    <>
      <Header
        marquee={["FRETE GRÁTIS ACIMA DE R$ 299", "ATÉ 10X SEM JUROS", "COMPRA SEGURA E NOTA FISCAL"]}
        categoriesNav={{ menu: categoriesMenu, showAllCategories: false, itemTo: "/categoria", ofertaTo: "/categoria" }}
      />

      <div style={{ borderBottom: "1px solid #F1F5F9", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "11px 24px", display: "flex", gap: 8, alignItems: "center", font: "400 13px Inter", color: "#475569" }}>
          <Link to="/">Home</Link><span style={{ color: "#94A3B8" }}>/</span><span style={{ color: "#012746", fontWeight: 500 }}>{breadcrumbLabel}</span>
        </div>
      </div>

      <section style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "44px 24px 40px" }}>
          <div style={{ display: "inline-block", background: "#012746", color: "#fff", font: "700 11px Montserrat", letterSpacing: ".12em", padding: "5px 11px", borderRadius: 4, marginBottom: 16 }}>INSTITUCIONAL</div>
          <h1 style={{ margin: "0 0 14px", font: "800 42px/1.1 Montserrat", color: "#012746", letterSpacing: "-.02em" }}>{title}</h1>
          <p style={{ margin: "0 0 20px", maxWidth: 660, font: "400 16.5px/1.65 Inter", color: "#475569" }}>{description}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 24px", font: "500 13px Inter", color: "#475569" }}>
            <span>{updated}</span><span style={{ color: "#CBD5E1" }}>•</span><span>Versão 1.0</span>
          </div>
        </div>
      </section>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px 80px", display: "grid", gridTemplateColumns: "minmax(220px,258px) minmax(0,1fr)", gap: 56, alignItems: "start" }}>
        <aside style={{ position: "sticky", top: 24, display: "grid", gap: 16 }}>
          <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
            <div style={{ font: "700 13px Montserrat", letterSpacing: ".1em", color: "#012746", marginBottom: 14 }}>NESTA PÁGINA</div>
            <div style={{ display: "grid", gap: 10 }}>
              {toc.map((t, i) => (
                <a key={i} href={t.href} className="hover-orange" style={{ font: "400 13.5px/1.45 Inter", color: "#475569" }}>{t.label}</a>
              ))}
            </div>
          </div>
          {sidebarExtra}
        </aside>

        <article style={{ maxWidth: 760 }}>
          {children}
        </article>
      </main>

      <FooterPolicy active={activeFooter} />
    </>
  );
}
