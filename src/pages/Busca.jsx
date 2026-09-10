import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import { FooterFull } from "../components/Footer.jsx";
import ProductCard from "../components/ProductCard.jsx";
import CompareBar from "../components/CompareBar.jsx";
import { categoriasCol, institucionalCol } from "../data/footerColumns.js";
import { useCategories } from "../lib/categories.js";
import { useProducts, toCardProduct, searchProducts } from "../lib/products.js";

export default function Busca() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const { products, loading } = useProducts();
  const { categories } = useCategories();
  const results = searchProducts(products, q).map(toCardProduct);

  useEffect(() => {
    document.title = `Busca: ${q} — Promo Aspiradores`;
  }, [q]);

  return (
    <>
      <Header
        marquee={["FRETE GRÁTIS ACIMA DE R$ 299", "ATÉ 10X SEM JUROS", "COMPRA SEGURA E NOTA FISCAL"]}
        categoriesNav={{ menu: categories.map(c => c.name), showAllCategories: false, itemTo: "/categoria", ofertaTo: "/categoria" }}
      />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}>
        <h1 style={{ margin: "0 0 8px", font: "800 24px Montserrat", color: "#012746", letterSpacing: "-.01em" }}>Resultados para "{q}"</h1>
        <p style={{ margin: "0 0 28px", font: "400 14px Inter", color: "#475569" }}>{loading ? "Buscando..." : `${results.length} produto(s) encontrado(s)`}</p>

        {!loading && results.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(232px,1fr))", gap: 24 }}>
            {results.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}

        {!loading && results.length === 0 && (
          <div style={{ padding: "48px 24px", textAlign: "center", border: "1px dashed #E2E8F0", borderRadius: 12 }}>
            <p style={{ margin: "0 0 16px", font: "400 15px Inter", color: "#475569" }}>Nenhum produto encontrado para essa busca.</p>
            <Link to="/categoria" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 46, padding: "0 24px", borderRadius: 8, background: "#F05A00", color: "#fff", font: "700 13.5px Montserrat", letterSpacing: ".04em" }}>VER TODOS OS PRODUTOS</Link>
          </div>
        )}
      </main>

      <FooterFull columns={[categoriasCol, institucionalCol]} />
      <CompareBar />
    </>
  );
}
