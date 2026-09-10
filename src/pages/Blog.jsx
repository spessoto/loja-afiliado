import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import { FooterFull } from "../components/Footer.jsx";
import { categoriasCol, institucionalCol } from "../data/footerColumns.js";
import { useCategories } from "../lib/categories.js";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
}

export default function Blog() {
  const { categories } = useCategories();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Guias de compra e dicas de limpeza — Blog Promo Aspiradores";
    fetch("/api/posts")
      .then(res => (res.ok ? res.json() : []))
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header
        marquee={["FRETE GRÁTIS ACIMA DE R$ 299", "ATÉ 10X SEM JUROS", "COMPRA SEGURA E NOTA FISCAL"]}
        categoriesNav={{ menu: categories.map(c => c.name), showAllCategories: false, itemTo: "/categoria", ofertaTo: "/categoria" }}
      />

      <section style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 24px 32px" }}>
          <h1 style={{ margin: "0 0 12px", font: "800 32px/1.15 Montserrat", color: "#012746", letterSpacing: "-.02em", maxWidth: 760 }}>Guias de compra e dicas de limpeza</h1>
          <p style={{ margin: 0, maxWidth: 680, font: "400 15px/1.65 Inter", color: "#475569" }}>Comparativos, testes e conteúdo prático para você escolher o aspirador certo e tirar o máximo dele.</p>
        </div>
      </section>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 64px" }}>
        {loading ? (
          <p style={{ font: "400 15px Inter", color: "#94A3B8" }}>Carregando...</p>
        ) : posts.length === 0 ? (
          <div style={{ padding: "64px 24px", textAlign: "center", border: "1px dashed #E2E8F0", borderRadius: 12 }}>
            <p style={{ margin: "0 0 8px", font: "700 17px Montserrat", color: "#012746" }}>Nenhuma publicação ainda</p>
            <p style={{ margin: 0, font: "400 14.5px Inter", color: "#94A3B8" }}>Em breve vamos publicar guias e comparativos por aqui.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 24 }}>
            {posts.map(p => (
              <Link key={p.id} to={`/blog/${p.slug}`} className="card-hover" style={{ display: "flex", flexDirection: "column", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
                {p.cover_image_url ? (
                  <div style={{ aspectRatio: "16/10", background: "#fff" }}>
                    <img src={p.cover_image_url} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </div>
                ) : (
                  <div style={{ aspectRatio: "16/10", background: "repeating-linear-gradient(135deg,#F8FAFC 0 8px,#F1F5F9 8px 16px)" }} />
                )}
                <div style={{ padding: "16px 18px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
                  {p.category && <span style={{ display: "inline-block", font: "600 11px Inter", letterSpacing: ".1em", color: "#F05A00", marginBottom: 8 }}>{p.category.toUpperCase()}</span>}
                  <h2 style={{ margin: "0 0 8px", font: "700 17px/1.35 Montserrat", color: "#012746" }}>{p.title}</h2>
                  {p.excerpt && <p style={{ margin: "0 0 12px", font: "400 13.5px/1.6 Inter", color: "#475569", flex: 1 }}>{p.excerpt}</p>}
                  <span style={{ font: "400 12.5px Inter", color: "#94A3B8" }}>{[p.author, formatDate(p.published_at)].filter(Boolean).join(" • ")}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <FooterFull columns={[categoriasCol, institucionalCol]} />
    </>
  );
}
