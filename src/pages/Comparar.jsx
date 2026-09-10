import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import { FooterFull } from "../components/Footer.jsx";
import { categoriasCol, institucionalCol } from "../data/footerColumns.js";
import { useCategories } from "../lib/categories.js";
import { useProducts, formatBRL, parseSpecs } from "../lib/products.js";
import { useCompare } from "../lib/compare.js";

export default function Comparar() {
  const { ids, toggle, clear } = useCompare();
  const { products, loading } = useProducts();
  const { categories } = useCategories();
  const selected = ids.map(id => products.find(p => p.id === id)).filter(Boolean);

  useEffect(() => {
    document.title = "Comparar produtos — Promo Aspiradores";
  }, []);

  const allSpecKeys = [...new Set(selected.flatMap(p => Object.keys(parseSpecs(p.specs))))]
    .filter(key => !/^(marca|categoria)$/i.test(key));
  const specsByProduct = selected.map(p => parseSpecs(p.specs));

  return (
    <>
      <Header
        categoriesNav={{ menu: categories.map(c => c.name), showAllCategories: false, itemTo: "/categoria", ofertaTo: "/categoria" }}
      />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 20 }}>
          <h1 style={{ margin: 0, font: "800 24px Montserrat", color: "#012746", letterSpacing: "-.01em" }}>Comparar produtos</h1>
          {selected.length > 0 && (
            <button onClick={clear} style={{ border: 0, background: "transparent", font: "600 13.5px Inter", color: "#F05A00", cursor: "pointer", textDecoration: "underline" }}>Limpar comparação</button>
          )}
        </div>

        {loading ? (
          <p style={{ font: "400 15px Inter", color: "#94A3B8" }}>Carregando...</p>
        ) : selected.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", border: "1px dashed #E2E8F0", borderRadius: 12 }}>
            <p style={{ margin: "0 0 16px", font: "400 15px Inter", color: "#475569" }}>Marque "Comparar" em pelo menos dois produtos para ver as diferenças lado a lado.</p>
            <Link to="/categoria" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 46, padding: "0 24px", borderRadius: 8, background: "#F05A00", color: "#fff", font: "700 13.5px Montserrat", letterSpacing: ".04em" }}>VER PRODUTOS</Link>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: 560, borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "12px 16px", width: 160 }}></th>
                  {selected.map(p => (
                    <th key={p.id} style={{ padding: "12px 16px", minWidth: 220, verticalAlign: "top", borderBottom: "2px solid #E2E8F0" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center" }}>
                        {p.image_url && <img src={p.image_url} alt={p.name} style={{ width: 100, height: 100, objectFit: "contain" }} />}
                        <Link to={`/produto/${p.id}`} style={{ font: "700 14px Montserrat", color: "#012746" }}>{p.name}</Link>
                        <span style={{ font: "800 20px Montserrat", color: "#F05A00" }}>{formatBRL(p.price_to)}</span>
                        <button onClick={() => toggle(p.id)} style={{ border: "1px solid #E2E8F0", background: "#fff", borderRadius: 20, padding: "5px 12px", font: "600 12px Inter", color: "#475569", cursor: "pointer" }}>Remover</button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "12px 16px", font: "600 13px Inter", color: "#012746", borderBottom: "1px solid #F1F5F9" }}>Marca</td>
                  {selected.map(p => <td key={p.id} style={{ padding: "12px 16px", textAlign: "center", font: "400 13.5px Inter", color: "#475569", borderBottom: "1px solid #F1F5F9" }}>{p.brand || "-"}</td>)}
                </tr>
                <tr>
                  <td style={{ padding: "12px 16px", font: "600 13px Inter", color: "#012746", borderBottom: "1px solid #F1F5F9" }}>Categoria</td>
                  {selected.map(p => <td key={p.id} style={{ padding: "12px 16px", textAlign: "center", font: "400 13.5px Inter", color: "#475569", borderBottom: "1px solid #F1F5F9" }}>{p.category || "-"}</td>)}
                </tr>
                <tr>
                  <td style={{ padding: "12px 16px", font: "600 13px Inter", color: "#012746", borderBottom: "1px solid #F1F5F9" }}>Avaliação</td>
                  {selected.map(p => <td key={p.id} style={{ padding: "12px 16px", textAlign: "center", font: "400 13.5px Inter", color: "#475569", borderBottom: "1px solid #F1F5F9" }}>{p.rating_avg ? `${p.rating_avg}★ (${p.rating_count || 0})` : "-"}</td>)}
                </tr>
                {allSpecKeys.map((key, i) => (
                  <tr key={key} style={{ background: i % 2 ? "#F8FAFC" : "transparent" }}>
                    <td style={{ padding: "12px 16px", font: "600 13px Inter", color: "#012746", borderBottom: "1px solid #F1F5F9" }}>{key}</td>
                    {specsByProduct.map((s, j) => <td key={selected[j].id} style={{ padding: "12px 16px", textAlign: "center", font: "400 13.5px Inter", color: "#475569", borderBottom: "1px solid #F1F5F9" }}>{s[key] || "-"}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <FooterFull columns={[categoriasCol, institucionalCol]} />
    </>
  );
}
