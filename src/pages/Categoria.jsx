import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import { FooterFull } from "../components/Footer.jsx";
import { categoriasCol, ajudaCol, institucionalCol, pagamentos } from "../data/footerColumns.js";

const menu = ["Aspiradores", "Robôs", "Vertical", "Portáteis", "Extratoras", "Profissionais", "Acessórios"];
const subcategorias = ["Sem fio", "2 em 1", "Para pets", "Pó e água", "Até R$ 500", "Com filtro HEPA"];

const filtroDefs = [
  { titulo: "MARCA", opcoes: [["Vertax", "42"], ["Nordika", "28"], ["Domus", "24"], ["Laris", "19"], ["Cyclon Pro", "15"]] },
  { titulo: "PARA QUEM TEM", opcoes: [["Pets em casa", "61"], ["Tapetes e carpetes", "48"], ["Apartamento pequeno", "37"], ["Carro", "29"]] },
  { titulo: "AUTONOMIA", opcoes: [["Até 30 min", "34"], ["30 a 45 min", "52"], ["Acima de 45 min", "42"]] },
  { titulo: "RECURSOS", opcoes: [["Filtro HEPA", "88"], ["Escova antiemaranhado", "54"], ["Base de parede", "47"], ["Bateria removível", "31"], ["Função pó e água", "22"]] }
];

const produtosBase = [
  { marca: "VERTAX", nome: "Aspirador Vertical Sem Fio Vertax V12 Ciclônico 450W", desconto: "-32%", selo: "MAIS VENDIDO", estrelas: "★★★★★", avaliacoes: "(1.284)", de: "R$ 1.029,90", por: "R$ 699,90", parcela: "ou 10x de R$ 69,99 sem juros" },
  { marca: "VERTAX", nome: "Aspirador Vertical Vertax V8 Sem Fio 2 Velocidades", desconto: "-18%", selo: "", estrelas: "★★★★★", avaliacoes: "(3.402)", de: "R$ 669,90", por: "R$ 549,90", parcela: "ou 10x de R$ 54,99 sem juros" },
  { marca: "NORDIKA", nome: "Aspirador Vertical Nordika Air 2 em 1 com Filtro HEPA", desconto: "", selo: "", estrelas: "★★★★☆", avaliacoes: "(618)", de: "", por: "R$ 459,00", parcela: "ou 10x de R$ 45,90 sem juros" },
  { marca: "DOMUS", nome: "Aspirador Vertical Domus Turbo 600W com Base de Parede", desconto: "-24%", selo: "FRETE GRÁTIS", estrelas: "★★★★★", avaliacoes: "(940)", de: "R$ 1.199,00", por: "R$ 909,00", parcela: "ou 10x de R$ 90,90 sem juros" },
  { marca: "LARIS", nome: "Aspirador Vertical Laris Pet Care Escova Antiemaranhado", desconto: "-15%", selo: "INDICADO PARA PETS", estrelas: "★★★★★", avaliacoes: "(1.117)", de: "R$ 899,00", por: "R$ 764,00", parcela: "ou 10x de R$ 76,40 sem juros" },
  { marca: "CYCLON PRO", nome: "Aspirador Vertical Cyclon Pro Max Bateria Removível", desconto: "-29%", selo: "", estrelas: "★★★★★", avaliacoes: "(452)", de: "R$ 1.749,00", por: "R$ 1.239,00", parcela: "ou 10x de R$ 123,90 sem juros" },
  { marca: "VERTAX", nome: "Aspirador Vertical Vertax Slim 350W Ultraleve 1,4 kg", desconto: "", selo: "MAIS LEVE", estrelas: "★★★★☆", avaliacoes: "(275)", de: "", por: "R$ 379,90", parcela: "ou 10x de R$ 37,99 sem juros" },
  { marca: "NORDIKA", nome: "Aspirador Vertical Nordika Duo Pó e Água Sem Fio", desconto: "-21%", selo: "", estrelas: "★★★★★", avaliacoes: "(806)", de: "R$ 1.599,00", por: "R$ 1.259,00", parcela: "ou 10x de R$ 125,90 sem juros" },
  { marca: "DOMUS", nome: "Aspirador Vertical Domus Home 3 em 1 com Kit Estofados", desconto: "-35%", selo: "ÚLTIMAS UNIDADES", estrelas: "★★★★☆", avaliacoes: "(1.503)", de: "R$ 749,00", por: "R$ 486,00", parcela: "ou 10x de R$ 48,60 sem juros" }
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
        categoriesNav={{ menu, showAllCategories: false, itemTo: "/categoria", ofertaTo: "/categoria" }}
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
          <p style={{ margin: "0 0 24px", maxWidth: 680, font: "400 16px/1.65 Inter", color: "#475569" }}>Leves, práticos e sem cabo para atrapalhar. São a melhor escolha para a limpeza rápida do dia a dia em casas e apartamentos, principalmente para quem tem pets. <strong style={{ fontWeight: 600, color: "#012746" }}>128 modelos</strong> disponíveis.</p>
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

          <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 20, background: "#F8FAFC" }}>
            <div style={{ font: "700 15px Montserrat", color: "#012746", marginBottom: 8 }}>Não sabe qual escolher?</div>
            <p style={{ margin: "0 0 14px", font: "400 13.5px/1.6 Inter", color: "#475569" }}>Responda três perguntas e a gente indica o modelo certo para a sua casa.</p>
            <Link to="/contato" className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 44, borderRadius: 8, background: "#012746", color: "#fff", font: "700 13.5px Montserrat", letterSpacing: ".04em" }}>FALAR COM ESPECIALISTA</Link>
          </div>
        </aside>

        <div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, paddingBottom: 20, borderBottom: "1px solid #E2E8F0" }}>
            <span style={{ font: "400 14px Inter", color: "#475569" }}><strong style={{ font: "600 14px Inter", color: "#012746" }}>128 produtos</strong> encontrados</span>
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(232px,1fr))", gap: 24, padding: "24px 0 0" }}>
            {produtosBase.map((p, i) => (
              <Link key={i} to="/produto" className="product-card" style={{ display: "flex", flexDirection: "column", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ position: "relative", padding: "16px 16px 0" }}>
                  <div style={{ position: "absolute", top: 16, left: 16, zIndex: 2, display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
                    {p.desconto && <span style={{ background: "#F05A00", color: "#fff", font: "800 12px Montserrat", padding: "5px 9px", borderRadius: 4 }}>{p.desconto}</span>}
                    {p.selo && <span style={{ background: "#012746", color: "#fff", font: "700 10px Montserrat", letterSpacing: ".08em", padding: "4px 8px", borderRadius: 4 }}>{p.selo}</span>}
                  </div>
                  <div style={{ aspectRatio: "1/1", borderRadius: 8, background: "repeating-linear-gradient(135deg,#F8FAFC 0 8px,#F1F5F9 8px 16px)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 16, font: "400 10.5px ui-monospace,monospace", letterSpacing: ".06em", color: "#94A3B8" }}>FOTO DO PRODUTO<br />fundo branco</div>
                </div>
                <div style={{ padding: "14px 16px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ font: "600 11px Inter", letterSpacing: ".1em", color: "#94A3B8", marginBottom: 5 }}>{p.marca}</div>
                  <div style={{ font: "600 14.5px/1.45 Inter", color: "#1E293B", marginBottom: 10, minHeight: 42 }}>{p.nome}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                    <span style={{ font: "600 12px Inter", color: "#F05A00", letterSpacing: ".08em" }}>{p.estrelas}</span>
                    <span style={{ font: "400 12px Inter", color: "#94A3B8" }}>{p.avaliacoes}</span>
                  </div>
                  <div style={{ marginTop: "auto" }}>
                    {p.de && <div style={{ font: "400 13px Inter", color: "#64748B", textDecoration: "line-through" }}>{p.de}</div>}
                    <div style={{ font: "800 25px Montserrat", color: "#F05A00", lineHeight: 1.15 }}>{p.por}</div>
                    <div style={{ font: "400 12.5px Inter", color: "#475569", marginBottom: 14 }}>{p.parcela}</div>
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 44, borderRadius: 8, background: "#F05A00", color: "#fff", font: "700 13.5px Montserrat", letterSpacing: ".06em" }}>COMPRAR</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "40px 0 8px" }}>
            <div style={{ width: "100%", maxWidth: 320 }}>
              <div style={{ height: 7, borderRadius: 4, background: "#E2E8F0", overflow: "hidden" }}><div style={{ height: "100%", width: "33%", background: "#F05A00", borderRadius: 4 }}></div></div>
              <div style={{ textAlign: "center", marginTop: 10, font: "400 13px Inter", color: "#475569" }}>Mostrando 9 de 128 produtos</div>
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
    </>
  );
}
