import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import { FooterFull } from "../components/Footer.jsx";
import ProductCard from "../components/ProductCard.jsx";
import CompareBar from "../components/CompareBar.jsx";
import { categoriasCol, institucionalCol } from "../data/footerColumns.js";
import { useProducts, toCardProduct, formatBRL } from "../lib/products.js";
import { useCategories } from "../lib/categories.js";

const guia = [
  { n: "01", t: "Potência real de sucção", s: "Não olhe só os watts do motor. Modelos ciclônicos mantêm a sucção constante mesmo com o reservatório cheio, o que faz mais diferença no dia a dia." },
  { n: "02", t: "Autonomia da bateria", s: "Até 30 minutos serve para apartamentos pequenos. Acima de 100 m², procure 45 minutos ou bateria removível para trocar no meio da limpeza." },
  { n: "03", t: "Escova certa para o seu piso", s: "Tapete e pelo de animal pedem escova motorizada antiemaranhado. Piso frio e laminado funcionam bem com escova macia comum." }
];

function linhas(text) {
  return (text || "").split("\n").map(s => s.trim()).filter(Boolean);
}

const ORDENS = ["Mais relevantes", "Menor preço", "Maior preço", "Melhor avaliados", "Maior desconto"];

function ordenar(lista, ordem) {
  const copia = [...lista];
  switch (ordem) {
    case "Menor preço": return copia.sort((a, b) => (Number(a.price_to) || Infinity) - (Number(b.price_to) || Infinity));
    case "Maior preço": return copia.sort((a, b) => (Number(b.price_to) || 0) - (Number(a.price_to) || 0));
    case "Melhor avaliados": return copia.sort((a, b) => (Number(b.rating_avg) || 0) - (Number(a.rating_avg) || 0));
    case "Maior desconto": return copia.sort((a, b) => {
      const dA = a.price_from && a.price_to ? 1 - a.price_to / a.price_from : 0;
      const dB = b.price_from && b.price_to ? 1 - b.price_to / b.price_from : 0;
      return dB - dA;
    });
    default: return copia;
  }
}

export default function Categoria() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaAtual = searchParams.get("cat") || "";
  const [sel, setSel] = useState({});
  const [preco, setPreco] = useState(null);
  const [ordem, setOrdem] = useState(ORDENS[0]);
  const { products, loading } = useProducts();
  const { categories } = useCategories();

  useEffect(() => {
    document.title = categoriaAtual
      ? `${categoriaAtual} — Promo Aspiradores`
      : "Todos os aspiradores — Promo Aspiradores";
  }, [categoriaAtual]);

  useEffect(() => {
    setSel({});
    setPreco(null);
  }, [categoriaAtual]);

  const naCategoria = categoriaAtual
    ? products.filter(p => (p.category || "").toLowerCase() === categoriaAtual.toLowerCase())
    : products;

  const marcas = [...new Set(naCategoria.map(p => p.brand).filter(Boolean))]
    .sort()
    .map(marca => ({ label: marca, qtd: naCategoria.filter(p => p.brand === marca).length }));

  const tagCounts = {};
  naCategoria.forEach(p => linhas(p.tags).forEach(tag => { tagCounts[tag] = (tagCounts[tag] || 0) + 1; }));
  const recursos = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label, qtd]) => ({ label, qtd }));

  const grupos = [
    marcas.length > 0 && { titulo: "MARCA", opcoes: marcas },
    recursos.length > 0 && { titulo: "RECURSOS", opcoes: recursos }
  ].filter(Boolean);

  const precosReais = naCategoria.map(p => Number(p.price_to)).filter(n => n > 0);
  const precoMin = precosReais.length ? Math.floor(Math.min(...precosReais) / 50) * 50 : 0;
  const precoMax = precosReais.length ? Math.ceil(Math.max(...precosReais) / 50) * 50 : 0;
  const precoAtual = preco ?? precoMax;

  const toggle = (grupoTitulo, label) => {
    const key = grupoTitulo + "|" + label;
    setSel(s => ({ ...s, [key]: !s[key] }));
  };

  const ativos = [];
  grupos.forEach(g => g.opcoes.forEach(o => {
    if (sel[g.titulo + "|" + o.label]) ativos.push({ grupo: g.titulo, label: o.label, key: g.titulo + "|" + o.label });
  }));
  const temFiltro = ativos.length > 0;
  const limpar = () => { setSel({}); setPreco(null); };

  const filtrados = naCategoria.filter(p => {
    if (precosReais.length && Number(p.price_to) > precoAtual) return false;
    const marcasSelecionadas = ativos.filter(a => a.grupo === "MARCA").map(a => a.label);
    if (marcasSelecionadas.length && !marcasSelecionadas.includes(p.brand)) return false;
    const recursosSelecionados = ativos.filter(a => a.grupo === "RECURSOS").map(a => a.label);
    if (recursosSelecionados.length) {
      const tagsProduto = linhas(p.tags);
      if (!recursosSelecionados.some(r => tagsProduto.includes(r))) return false;
    }
    return true;
  });

  const produtosExibidos = ordenar(filtrados, ordem).map(toCardProduct);

  const breadcrumbLabel = categoriaAtual || "Todos os produtos";
  const titulo = categoriaAtual || "Todos os aspiradores";

  return (
    <>
      <Header
        marquee={["FRETE GRÁTIS ACIMA DE R$ 299", "ATÉ 10X SEM JUROS", "COMPRA SEGURA E NOTA FISCAL"]}
        categoriesNav={{ menu: categories.map(c => c.name), showAllCategories: false, itemTo: "/categoria", ofertaTo: "/categoria" }}
      />

      <div style={{ borderBottom: "1px solid #F1F5F9", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "11px 24px", display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", font: "400 13px Inter", color: "#475569" }}>
          <Link to="/">Home</Link><span style={{ color: "#94A3B8" }}>/</span>
          <Link to="/categoria">Aspiradores</Link>
          {categoriaAtual && (
            <>
              <span style={{ color: "#94A3B8" }}>/</span>
              <span style={{ color: "#012746", fontWeight: 500 }}>{breadcrumbLabel}</span>
            </>
          )}
        </div>
      </div>

      <section style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px 24px" }}>
          <h1 style={{ margin: "0 0 10px", font: "800 30px/1.15 Montserrat", color: "#012746", letterSpacing: "-.02em" }}>{titulo}</h1>
          <p style={{ margin: "0 0 20px", maxWidth: 680, font: "400 14.5px/1.65 Inter", color: "#475569" }}>
            {loading ? "Carregando produtos..." : (
              <><strong style={{ fontWeight: 600, color: "#012746" }}>{naCategoria.length} modelo{naCategoria.length === 1 ? "" : "s"}</strong> disponíve{naCategoria.length === 1 ? "l" : "is"}{categoriaAtual ? ` na categoria ${categoriaAtual}` : ""}.</>
            )}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {categories.map((cat, i) => (
              <Link
                key={i}
                to={cat.name === categoriaAtual ? "/categoria" : `/categoria?cat=${encodeURIComponent(cat.name)}`}
                className="pill"
                style={{
                  display: "inline-flex", alignItems: "center", height: 40, padding: "0 18px", borderRadius: 24,
                  border: cat.name === categoriaAtual ? "1.5px solid #F05A00" : "1.5px solid #E2E8F0",
                  background: cat.name === categoriaAtual ? "#FFF7F2" : "#fff",
                  font: "500 13.5px Inter", color: cat.name === categoriaAtual ? "#F05A00" : "#012746", whiteSpace: "nowrap"
                }}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <main className="stack-mobile" style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 0", display: "grid", gridTemplateColumns: "minmax(240px,268px) minmax(0,1fr)", gap: 40, alignItems: "start" }}>

        <aside style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <span style={{ font: "700 16px Montserrat", color: "#012746" }}>Filtrar</span>
            {(temFiltro || preco !== null) && (
              <button onClick={limpar} style={{ border: 0, background: "transparent", font: "500 13px Inter", color: "#F05A00", cursor: "pointer", textDecoration: "underline", padding: 0 }}>Limpar filtros</button>
            )}
          </div>

          {temFiltro && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingBottom: 4 }}>
              {ativos.map((a, i) => (
                <button key={i} onClick={() => toggle(a.grupo, a.label)} style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 32, padding: "0 12px", border: "1px solid #FFD9C2", borderRadius: 20, background: "#FFF7F2", font: "500 12.5px Inter", color: "#012746", cursor: "pointer" }}>
                  {a.label}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#F05A00" strokeWidth="3" strokeLinecap="round"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"></path></svg>
                </button>
              ))}
            </div>
          )}

          {grupos.map((g, i) => (
            <details key={i} open style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: "16px 18px" }}>
              <summary style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, font: "700 14px Montserrat", color: "#012746", letterSpacing: ".03em" }}>
                {g.titulo}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.4" strokeLinecap="round" style={{ flex: "none" }}><path d="M6 10l6 5.5L18 10"></path></svg>
              </summary>
              <div style={{ display: "grid", gap: 11, marginTop: 14 }}>
                {g.opcoes.map((o, j) => (
                  <label key={j} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", font: "400 13.5px Inter", color: "#475569" }}>
                    <input type="checkbox" checked={!!sel[g.titulo + "|" + o.label]} onChange={() => toggle(g.titulo, o.label)} style={{ width: 17, height: 17, accentColor: "#F05A00", cursor: "pointer", flex: "none" }} />
                    <span style={{ flex: 1 }}>{o.label}</span>
                    <span style={{ font: "400 12px Inter", color: "#94A3B8" }}>{o.qtd}</span>
                  </label>
                ))}
              </div>
            </details>
          ))}

          {precosReais.length > 0 && precoMax > precoMin && (
            <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ font: "700 14px Montserrat", color: "#012746", letterSpacing: ".03em", marginBottom: 14 }}>FAIXA DE PREÇO</div>
              <input type="range" min={precoMin} max={precoMax} step="10" value={precoAtual} onChange={(e) => setPreco(Number(e.target.value))} style={{ width: "100%", accentColor: "#F05A00", cursor: "pointer" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, font: "500 13px Inter", color: "#475569" }}>
                <span>{formatBRL(precoMin)}</span>
                <strong style={{ font: "700 13.5px Montserrat", color: "#F05A00" }}>até {formatBRL(precoAtual)}</strong>
              </div>
            </div>
          )}
        </aside>

        <div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, paddingBottom: 20, borderBottom: "1px solid #E2E8F0" }}>
            <span style={{ font: "400 14px Inter", color: "#475569" }}><strong style={{ font: "600 14px Inter", color: "#012746" }}>{produtosExibidos.length} produto{produtosExibidos.length === 1 ? "" : "s"}</strong> encontrado{produtosExibidos.length === 1 ? "" : "s"}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ font: "500 13.5px Inter", color: "#475569" }}>Ordenar por</span>
              <select value={ordem} onChange={(e) => setOrdem(e.target.value)} style={{ height: 44, padding: "0 14px", border: "1.5px solid #E2E8F0", borderRadius: 8, background: "#fff", font: "500 13.5px Inter", color: "#012746", cursor: "pointer", outline: "none" }}>
                {ORDENS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <p style={{ padding: "24px 0", font: "400 15px Inter", color: "#94A3B8" }}>Carregando produtos...</p>
          ) : produtosExibidos.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(232px,1fr))", gap: 24, padding: "24px 0 0" }}>
              {produtosExibidos.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          ) : naCategoria.length > 0 ? (
            <div style={{ padding: "40px 0", textAlign: "center" }}>
              <p style={{ margin: "0 0 14px", font: "400 15px Inter", color: "#94A3B8" }}>Nenhum produto encontrado com esses filtros.</p>
              <button onClick={limpar} style={{ border: 0, background: "transparent", font: "600 14px Inter", color: "#F05A00", cursor: "pointer", textDecoration: "underline" }}>Limpar filtros</button>
            </div>
          ) : (
            <p style={{ padding: "24px 0", font: "400 15px Inter", color: "#94A3B8" }}>Nenhum produto cadastrado {categoriaAtual ? `em ${categoriaAtual}` : "ainda"}.</p>
          )}
        </div>
      </main>

      <section style={{ margin: "48px 0 0", background: "#F8FAFC", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
        <div className="stack-mobile" style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 24px", display: "grid", gridTemplateColumns: "minmax(0,.8fr) minmax(0,1.2fr)", gap: 40 }}>
          <div>
            <h2 style={{ margin: "0 0 10px", font: "700 23px Montserrat", color: "#012746", letterSpacing: "-.01em" }}>Como escolher o aspirador certo</h2>
            <p style={{ margin: 0, font: "400 15.5px/1.65 Inter", color: "#475569" }}>Três critérios resolvem 90% da decisão. O resto é preferência.</p>
          </div>
          <div style={{ display: "grid", gap: 14 }}>
            {guia.map((g, i) => (
              <div key={i} style={{ display: "flex", gap: 16, padding: 20, background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12 }}>
                <span style={{ flex: "none", width: 40, height: 40, borderRadius: 8, background: "#FFF1E8", display: "flex", alignItems: "center", justifyContent: "center", font: "800 15px Montserrat", color: "#F05A00" }}>{g.n}</span>
                <span>
                  <span style={{ display: "block", font: "700 15.5px Montserrat", color: "#012746", marginBottom: 5 }}>{g.t}</span>
                  <span style={{ display: "block", font: "400 14px/1.6 Inter", color: "#475569" }}>{g.s}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FooterFull columns={[categoriasCol, institucionalCol]} />
      <CompareBar />
    </>
  );
}
