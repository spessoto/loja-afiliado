import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import { FooterFull } from "../components/Footer.jsx";
import { categoriasCol, institucionalCol } from "../data/footerColumns.js";
import { useCategories } from "../lib/categories.js";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
}

function paragrafos(text) {
  return (text || "")
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean);
}

// Marcação leve dentro do texto simples: "## " / "### " viram heading, "[texto](url)" vira link.
function renderInline(text, keyPrefix) {
  const parts = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0, match, i = 0;
  while ((match = linkRegex.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const [, label, url] = match;
    const external = /^https?:\/\//.test(url) && !url.includes("promoaspiradores.com.br");
    const href = external ? url : url.replace(/^https?:\/\/[^/]+/, "");
    parts.push(
      external ? (
        <a key={`${keyPrefix}-${i}`} href={href} target="_blank" rel="noopener noreferrer" style={{ color: "#C84A00", fontWeight: 600 }}>{label}</a>
      ) : (
        <a key={`${keyPrefix}-${i}`} href={href} style={{ color: "#C84A00", fontWeight: 600 }}>{label}</a>
      )
    );
    last = match.index + match[0].length;
    i++;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export default function Post() {
  const { slug } = useParams();
  const { categories } = useCategories();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/posts/${slug}`)
      .then(res => (res.ok ? res.json() : null))
      .then(setPost)
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    document.title = post ? `${post.title} — Promo Aspiradores` : "Publicação — Promo Aspiradores";
  }, [post]);

  const header = (
    <Header
      categoriesNav={{ menu: categories.map(c => c.name), showAllCategories: false, itemTo: "/categoria", ofertaTo: "/categoria" }}
    />
  );

  if (!loading && !post) {
    return (
      <>
        {header}
        <div style={{ maxWidth: 640, margin: "80px auto", textAlign: "center", padding: "0 24px" }}>
          <h1 style={{ font: "800 26px Montserrat, sans-serif", color: "#012746" }}>Publicação não encontrada</h1>
          <Link to="/blog" className="btn-primary" style={{ display: "inline-flex", marginTop: 16, height: 46, padding: "0 24px", alignItems: "center", borderRadius: 8, background: "#C84A00", color: "#fff", font: "700 14px Montserrat" }}>Voltar para o blog</Link>
        </div>
        <FooterFull columns={[categoriasCol, institucionalCol]} />
      </>
    );
  }

  if (loading || !post) return null;

  return (
    <>
      {header}

      <div style={{ borderBottom: "1px solid #F1F5F9", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "11px 24px", display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", font: "400 13px Inter", color: "#475569" }}>
          <Link to="/">Home</Link><span style={{ color: "#64748B" }}>/</span>
          <Link to="/blog">Blog</Link><span style={{ color: "#64748B" }}>/</span>
          <span style={{ color: "#012746", fontWeight: 500 }}>{post.title}</span>
        </div>
      </div>

      <main>
      <article style={{ maxWidth: 780, margin: "0 auto", padding: "40px 24px 64px" }}>
        {post.category && <span style={{ display: "inline-block", font: "700 11.5px Montserrat", letterSpacing: ".12em", color: "#C84A00", marginBottom: 16 }}>{post.category.toUpperCase()}</span>}
        <h1 style={{ margin: "0 0 16px", font: "800 32px/1.18 Montserrat", color: "#012746", letterSpacing: "-.02em", textWrap: "balance" }}>{post.title}</h1>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 28, font: "400 13.5px Inter", color: "#64748B" }}>
          {post.author && <span style={{ fontWeight: 500, color: "#012746" }}>Por {post.author}</span>}
          {post.published_at && <><span style={{ color: "#CBD5E1" }}>•</span><span>{formatDate(post.published_at)}</span></>}
        </div>

        {post.cover_image_url && (
          <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid #E2E8F0", marginBottom: 32, aspectRatio: "16/9", background: "#F1F5F9" }}>
            <img src={post.cover_image_url} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        )}

        {paragrafos(post.content).map((block, i) => {
          const imageMatch = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
          if (imageMatch) {
            const [, alt, src] = imageMatch;
            return (
              <div key={i} style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #E2E8F0", margin: "8px 0 24px", aspectRatio: "16/9", background: "#F1F5F9" }}>
                <img src={src} alt={alt || post.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            );
          }
          if (block.startsWith("### ")) {
            return <h3 key={i} style={{ margin: "28px 0 12px", font: "700 19px/1.35 Montserrat", color: "#012746" }}>{renderInline(block.slice(4), `h3-${i}`)}</h3>;
          }
          if (block.startsWith("## ")) {
            return <h2 key={i} style={{ margin: "36px 0 14px", font: "800 23px/1.3 Montserrat", color: "#012746" }}>{renderInline(block.slice(3), `h2-${i}`)}</h2>;
          }
          return <p key={i} style={{ margin: "0 0 18px", font: "400 16px/1.75 Inter", color: "#334155", whiteSpace: "pre-line" }}>{renderInline(block, `p-${i}`)}</p>;
        })}
      </article>
      </main>

      <FooterFull columns={[categoriasCol, institucionalCol]} />
    </>
  );
}
