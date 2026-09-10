import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import { FooterFull } from "../components/Footer.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { categoriasCol, institucionalCol } from "../data/footerColumns.js";
import { useCategories } from "../lib/categories.js";
import { useFavorites } from "../lib/favorites.jsx";
import { toCardProduct } from "../lib/products.js";

export default function Favoritos() {
  const { favorites, loading } = useFavorites();
  const { categories } = useCategories();

  useEffect(() => {
    document.title = "Meus favoritos — Promo Aspiradores";
  }, []);

  return (
    <>
      <Header
        marquee={["FRETE GRÁTIS ACIMA DE R$ 299", "ATÉ 10X SEM JUROS", "COMPRA SEGURA E NOTA FISCAL"]}
        categoriesNav={{ menu: categories.map(c => c.name), showAllCategories: false, itemTo: "/categoria", ofertaTo: "/categoria" }}
      />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}>
        <h1 style={{ margin: "0 0 22px", font: "800 26px Montserrat", color: "#012746", letterSpacing: "-.01em" }}>Meus favoritos</h1>

        {loading ? (
          <p style={{ font: "400 15px Inter", color: "#94A3B8" }}>Carregando...</p>
        ) : favorites.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(232px,1fr))", gap: 24 }}>
            {favorites.map(toCardProduct).map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        ) : (
          <div style={{ padding: "48px 24px", textAlign: "center", border: "1px dashed #E2E8F0", borderRadius: 12 }}>
            <p style={{ margin: "0 0 16px", font: "400 15px Inter", color: "#475569" }}>Você ainda não favoritou nenhum produto, ou precisa <Link to="/cadastro" style={{ color: "#F05A00", textDecoration: "underline" }}>entrar na sua conta</Link>.</p>
            <Link to="/categoria" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 46, padding: "0 24px", borderRadius: 8, background: "#F05A00", color: "#fff", font: "700 13.5px Montserrat", letterSpacing: ".04em" }}>VER PRODUTOS</Link>
          </div>
        )}
      </main>

      <FooterFull columns={[categoriasCol, institucionalCol]} />
    </>
  );
}
