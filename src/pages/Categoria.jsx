import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import { FooterFull } from "../components/Footer.jsx";
import ProductCard from "../components/ProductCard.jsx";
import CompareBar from "../components/CompareBar.jsx";
import { categoriasCol, ajudaCol, institucionalCol, pagamentos } from "../data/footerColumns.js";
import { useProducts, toCardProduct } from "../lib/products.js";
import { categoriesMenu } from "../data/categoriesMenu.js";

const subcategorias = ["Sem fio", "2 em 1", "Para pets", "Pó e água", "Até R$ 500", "Com filtro HEPA"];

const filtroDefs = [
  { titulo: "MARCA", opcoes: [["Vertax", "42"], ["Nordika", "28"], ["Domus", "24"], ["Laris", "19"], ["Cyclon Pro", "15"]] },
  { titulo: "PARA QUEM TEM", opcoes: [["Pets em casa", "61"], ["Tapetes e carpetes", "48"], ["Apartamento pequeno", "37"], ["Carro", "29"]] },
  { titulo: "AUTONOMIA", opcoes: [["Até 30 min", "34"], ["30 a 45 min", "52"], ["Acima de 45 min", "42"]] },
  { titulo: "RECURSOS", opcoes: [["Filtro HEPA", "88"], ["Escova antiemaranhado", "54"], ["Base de parede", "47"], ["Bateria removível", "31"], ["Função pó e água", "22"]] }
];

const guia = [
  { n: "01", t: "Potência real de sucção", s: "Não olhe só os watts do motor. Modelos ciclônicos mantêm a sucção constante mesmo com o reservatório cheio, o que faz mais diferença no dia a dia." },
  { n: "02", t: "Autonomia da bateria", s: "Até 30 minutos serve para apartamentos pequenos. Acima de 100 m², procure 45 minutos ou bateria removível para trocar no meio da limpeza." },
  { n: "03", t: "Escova certa para o seu piso", s: "Tapete e pelo de animal pedem escova motorizada antiemaranhado. Piso frio e laminado funcionam bem com escova macia comum." }
];

const paginas = ["1", "2", "3", "…", "15"];

function brl(n) {
  return "R$ " + n.toLocaleString("pt-BR") + ",00";
}

export default function Categoria() {
  const [sel, setSel] = useState({});
  const [preco, setPreco] = useState(2000);
  const [ordem, setOrdem] = useState("Mais relevantes");
  const { products } = useProducts();
  const produtosBase = products.map(toCardProduct);

  useEffect(() => {
    document.title = "Aspiradores verticais sem fio — Promo Aspiradores";
  }, []);

  const toggle = (key) => setSel((s) => ({ ...s, [key]: !s[key] }));

  const ativos = [];
  const grupos = filtroDefs.map((g) => ({
    titulo: g.titulo,
    opcoes: g.opcoes.map(([label, qtd]) => {
      const key = g.titulo + "|" + label;
      const on = !!sel[key];
      if (on) ativos.push({ label, key });
      return { label, qtd, on, key };
    })
  }));
  const temFiltro = ativos.length > 0;
  const limpar = () => { setSel({}); setPreco(2000); };

  return (
    <>
      <Header
        marquee={["FRETE GRÁTIS ACIMA DE R$ 299", "ATÉ 10X SEM JUROS", "COMPRA SEGURA E NOTA FISCAL"]}
        categoriesNav={{ menu: categoriesMenu, showAllCategories: false, itemTo: "/categoria", ofertaTo: "/categoria" }}
      />

      <div style={{ borderBottom: "1px solid #F1F5F9", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "11px 24px", display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", font: "400 13px Inter", color: "#475569" }}>
          <Link to="/">Home</Link><span style={{ color: "#94A3B8" }}>/</span>
          <Link to="/categoria">Aspiradores</Link><span style={{ color: "#94A3B8" }}>/</span>
          <span style={{ color: "#012746", fontWeight: 500 }}>Vertical sem fio</span>
        </div>
      </div>

      <section style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 24px 32px" }}>
          <h1 style={{ margin: "0 0 12px", font: "800 40px/1.1 Montserrat", color: "#012746", letterSpacing: "-.02em" }}>Aspiradores verticais sem fio</h1>
          <p style={{ margin: "0 0 24px", maxWidth: 680, font: "400 16px/1.65 Inter", color: "#475569" }}>Leves, práticos e sem cabo para atrapalhar. São a melhor escolha para a limpeza rápida do dia a dia em casas e apartamentos, principalmente para quem tem pets. <strong style={{ fontWeight: 600, color: "#012746" }}>{produtosBase.length} modelos</strong> disponíveis.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {subcategorias.map((s, i) => (
              <Link key={i} to="/categoria" className="pill" style={{ display: "inline-flex", alignItems: "center", height: 40, padding: "0 18px", borderRadius: 24, border: "1.5px solid #E2E8F0", background: "#fff", font: "500 13.5px Inter", color: "#012746", whiteSpace: "nowrap" }}>{s}</Link>
            ))}
          </div>
        </div>
      </section>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 0", display: "grid", gridTemplateColumns: "minmax(240px,268px) minmax(0,1fr)", gap: 40, alignItems: "start" }}>

        <aside style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <span style={{ font: "700 16px Montserrat", color: "#012746" }}>Filtrar</span>
            <button onClick={limpar} style={{ border: 0, background: "transparent", font: "500 13px Inter", color: "#F05A00", cursor: "pointer", textDecoration: "underline", padding: 0 }}>Limpar filtros</button>
          </div>

          {temFiltro && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingBottom: 4 }}>
              {ativos.map((a, i) => (
                <button key={i} onClick={() => toggle(a.key)} style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 32, padding: "0 12px", border: "1px solid #FFD9C2", borderRadius: 20, background: "#FFF7F2", font: "500 12.5px Inter", color: "#012746", cursor: "pointer" }}>
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
                    <input type="checkbox" checked={o.on} onChange={() => toggle(o.key)} style={{ width: 17, height: 17, accentColor: "#F05A00", cursor: "pointer", flex: "none" }} />
                    <span style={{ flex: 1 }}>{o.label}</span>
                    <span style={{ font: "400 12px Inter", color: "#94A3B8" }}>{o.qtd}</span>
                  </label>
                ))}
              </div>
            </details>
          ))}

          <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ font: "700 14px Montserrat", color: "#012746", letterSpacing: ".03em", marginBottom: 14 }}>FAIXA DE PREÇO</div>
            <input type="range" min="200" max="3000" step="50" value={preco} onChange={(e) => setPreco(Number(e.target.value))} style={{ width: "100%", accentColor: "#F05A00", cursor: "pointer" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, font: "500 13px Inter", color: "#475569" }}>
              <span>R$ 200</span>
              <strong style={{ font: "700 13.5px Montserrat", color: "#F05A00" }}>até {brl(preco)}</strong>
            </div>
          </div>
        </aside>

        <div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, paddingBottom: 20, borderBottom: "1px solid #E2E8F0" }}>
            <span style={{ font: "400 14px Inter", color: "#475569" }}><strong style={{ font: "600 14px Inter", color: "#012746" }}>{produtosBase.length} produtos</strong> encontrados</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ font: "500 13.5px Inter", color: "#475569" }}>Ordenar por</span>
              <select value={ordem} onChange={(e) => setOrdem(e.target.value)} style={{ height: 44, padding: "0 14px", border: "1.5px solid #E2E8F0", borderRadius: 8, background: "#fff", font: "500 13.5px Inter", color: "#012746", cursor: "pointer", outline: "none" }}>
                <option>Mais relevantes</option>
                <option>Menor preço</option>
                <option>Maior preço</option>
                <option>Mais vendidos</option>
                <option>Melhor avaliados</option>
                <option>Maior desconto</option>
              </select>
            </div>
          </div>

          {produtosBase.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(232px,1fr))", gap: 24, padding: "24px 0 0" }}>
              {produtosBase.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          ) : (
            <p style={{ padding: "24px 0", font: "400 15px Inter", color: "#94A3B8" }}>Nenhum produto cadastrado ainda.</p>
          )}

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "40px 0 8px" }}>
            <div style={{ width: "100%", maxWidth: 320 }}>
              <div style={{ height: 7, borderRadius: 4, background: "#E2E8F0", overflow: "hidden" }}><div style={{ height: "100%", width: "33%", background: "#F05A00", borderRadius: 4 }}></div></div>
              <div style={{ textAlign: "center", marginTop: 10, font: "400 13px Inter", color: "#475569" }}>Mostrando {produtosBase.length} de {produtosBase.length} produtos</div>
            </div>
            <button className="btn-outline-navy" style={{ height: 52, padding: "0 36px", border: "1.5px solid #012746", borderRadius: 8, background: "#fff", font: "700 14.5px Montserrat", letterSpacing: ".04em", color: "#012746", cursor: "pointer" }}>CARREGAR MAIS PRODUTOS</button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {paginas.map((pg, i) => (
                <Link key={i} to="/categoria" className="page-link" style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 40, height: 40, padding: "0 10px", border: "1.5px solid #E2E8F0", borderRadius: 8, font: "600 13.5px Inter", color: "#475569" }}>{pg}</Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <section style={{ margin: "64px 0 0", background: "#F8FAFC", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px", display: "grid", gridTemplateColumns: "minmax(0,.8fr) minmax(0,1.2fr)", gap: 48 }}>
          <div>
            <h2 style={{ margin: "0 0 10px", font: "700 30px Montserrat", color: "#012746", letterSpacing: "-.01em" }}>Como escolher um aspirador vertical</h2>
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

      <FooterFull columns={[categoriasCol, ajudaCol, institucionalCol]} payment={pagamentos} />
      <CompareBar />
    </>
  );
}
