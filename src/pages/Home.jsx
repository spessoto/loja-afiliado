import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import { FooterFull } from "../components/Footer.jsx";
import ProductCard from "../components/ProductCard.jsx";
import FaqAccordion from "../components/FaqAccordion.jsx";
import { categoriasCol, institucionalCol } from "../data/footerColumns.js";
import { useProducts, toCardProduct, formatBRL, linhas, parseReviews } from "../lib/products.js";
import { useCategories } from "../lib/categories.js";

const heroTrust = ["Frete grátis acima de R$ 299", "Até 10x sem juros", "Garantia e nota fiscal"];

const necessidades = [
  { i: "01", t: "Para pelos de animais", s: "Escova antiemaranhado", q: "pet" },
  { i: "02", t: "Para carros", s: "Portáteis e sem fio", q: "carro" },
  { i: "03", t: "Para tapetes", s: "Alta sucção e batedor", q: "tapete" },
  { i: "04", t: "Para apartamentos", s: "Compactos e práticos", q: "compacto" },
  { i: "05", t: "Para limpeza pesada", s: "Pó e água", q: "água" },
  { i: "06", t: "Para uso profissional", s: "Obras e oficinas", q: "oficina" }
];

const beneficios = [
  { t: "Compra segura", s: "Pagamento protegido e dados criptografados em todo o processo.", d: "M12 3.5l7 2.6v5.4c0 4.3-2.9 7.3-7 9-4.1-1.7-7-4.7-7-9V6.1l7-2.6z" },
  { t: "Envio para todo o Brasil", s: "Rastreio do pedido e frete grátis nas compras acima de R$ 299.", d: "M3 7.5h11v9H3zM14 10.5h4l3 3v3h-7zM7 19a1.6 1.6 0 100-3.2A1.6 1.6 0 007 19zM17.5 19a1.6 1.6 0 100-3.2 1.6 1.6 0 000 3.2z" },
  { t: "Garantia e nota fiscal", s: "Produtos originais, garantia do fabricante e NF em todos os pedidos.", d: "M12 3.5l2.6 1.9 3.2-.2.9 3.1 2.3 2.2-1.6 2.8.4 3.2-3.1 1-2 2.5-3-1.2-3 1.2-2-2.5-3.1-1 .4-3.2L2 10.5l2.3-2.2.9-3.1 3.2.2z" },
  { t: "Atendimento especializado", s: "Time que conhece aspirador e ajuda você a escolher pelo WhatsApp.", d: "M20 12a8 8 0 10-3.2 6.4L20 20l-1-3.2A7.9 7.9 0 0020 12z" }
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function parseDistMap(text) {
  const map = {};
  linhas(text).forEach(line => {
    const [n, pct] = line.split(":");
    map[Number(n)] = Number(pct);
  });
  return map;
}

const faq = [
  { q: "Qual aspirador serve para pelos de animais?", a: "Modelos verticais sem fio com escova antiemaranhado e filtro HEPA são os mais indicados. Na página de cada produto indicamos se ele é recomendado para pets." },
  { q: "Em quantas vezes eu posso pagar?", a: "As opções de parcelamento são definidas pela loja parceira no momento da finalização da compra." },
  { q: "Como funciona o frete?", a: "O frete é calculado e cobrado diretamente no site da loja parceira, na finalização da compra." },
  { q: "E se o produto apresentar defeito?", a: "A garantia varia por produto e fabricante — consulte as informações de garantia na página de cada item. Todas as compras são processadas com nota fiscal pela loja parceira." }
];

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function Home() {
  const [left, setLeft] = useState(6 * 3600 + 42 * 60 + 15);
  const { products } = useProducts();
  const { categories } = useCategories();
  const cards = products.map(toCardProduct);
  const categorias = categories
    .map(cat => {
      const produtosDaCategoria = products.filter(p => p.category === cat.name);
      return { nome: cat.name, qtd: produtosDaCategoria.length, image_url: cat.image_url || produtosDaCategoria.find(p => p.image_url)?.image_url };
    })
    .filter(c => c.qtd > 0);
  const ofertas = cards.filter(c => c.desconto).slice(0, 4);
  const ofertaIds = new Set(ofertas.map(c => c.id));
  const vendidos = cards.filter(c => !ofertaIds.has(c.id)).slice(0, 4);
  const heroProduct = products.length > 0
    ? products[Math.floor(Date.now() / 3600000) % products.length]
    : null;
  const heroDesconto = heroProduct?.price_from && heroProduct?.price_to && Number(heroProduct.price_from) > Number(heroProduct.price_to)
    ? Math.round((1 - heroProduct.price_to / heroProduct.price_from) * 100)
    : 0;

  const totalAvaliacoes = products.reduce((s, p) => s + (Number(p.rating_count) || 0), 0);
  const somaEstrelas = products.reduce((s, p) => s + (Number(p.rating_count) || 0) * (Number(p.rating_avg) || 0), 0);
  const mediaGeral = totalAvaliacoes > 0 ? somaEstrelas / totalAvaliacoes : 0;
  const somaPct45 = products.reduce((s, p) => {
    const count = Number(p.rating_count) || 0;
    if (!count) return s;
    const dist = parseDistMap(p.rating_dist);
    return s + count * ((dist[5] || 0) + (dist[4] || 0));
  }, 0);
  const recomendamPct = totalAvaliacoes > 0 ? Math.round(somaPct45 / totalAvaliacoes) : 0;

  const [avaliacoesExibidas, setAvaliacoesExibidas] = useState([]);

  useEffect(() => {
    document.title = "Promo Aspiradores — Encontre o aspirador ideal para sua casa";
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (products.length === 0 || avaliacoesExibidas.length > 0) return;
    const pool = products.flatMap(p =>
      parseReviews(p.reviews).map(r => ({ ...r, produto: p.name, produtoId: p.id }))
    );
    setAvaliacoesExibidas(shuffle(pool).slice(0, 3));
  }, [products, avaliacoesExibidas]);

  const countdown = [
    { v: pad(Math.floor(left / 3600)), l: "HORAS" },
    { v: pad(Math.floor(left / 60) % 60), l: "MIN" },
    { v: pad(left % 60), l: "SEG" }
  ];

  return (
    <>
      <Header
        marquee={["FRETE GRÁTIS ACIMA DE R$ 299", "ATÉ 10X SEM JUROS", "COMPRA SEGURA E NOTA FISCAL", "ENVIO PARA TODO O BRASIL", "CURADORIA DE ESPECIALISTAS"]}
        animated
        categoriesNav={{ menu: categories.map(c => c.name), showAllCategories: true, allCategoriesTo: "#categorias", itemTo: "/categoria", ofertaTo: "#ofertas" }}
      />

      <section style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
        <div className="stack-mobile" style={{ maxWidth: 1280, margin: "0 auto", padding: "44px 24px 48px", display: "grid", gridTemplateColumns: "minmax(0,1.05fr) minmax(0,.95fr)", gap: 40, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 24, padding: "7px 16px 7px 8px", marginBottom: 24 }}>
              <span style={{ background: "linear-gradient(90deg,#F05A00,#FF7A00)", color: "#fff", font: "800 11.5px Montserrat", letterSpacing: ".08em", padding: "4px 10px", borderRadius: 16 }}>ATÉ 40% OFF</span>
              <span style={{ font: "600 13px Inter", color: "#012746" }}>Semana do Aspirador</span>
            </div>
            <h1 style={{ margin: "0 0 16px", font: "800 40px/1.1 Montserrat", letterSpacing: "-.02em", color: "#012746", textWrap: "balance" }}>ENCONTRE O ASPIRADOR IDEAL PARA SUA CASA</h1>
            <p style={{ margin: "0 0 28px", maxWidth: 500, font: "400 15.5px/1.6 Inter", color: "#475569" }}>Modelos para todos os tipos de limpeza e necessidades. Nossa curadoria compara potência, autonomia e preço para você escolher em minutos.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 32 }}>
              <Link to="/categoria" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 10, height: 46, padding: "0 26px", borderRadius: 8, background: "#F05A00", color: "#fff", font: "700 14px Montserrat", letterSpacing: ".04em", boxShadow: "0 8px 24px rgba(240,90,0,.28)" }}>
                VER ASPIRADORES
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h13M13 6.5l5.5 5.5L13 17.5"></path></svg>
              </Link>
              <a href="#necessidade" className="btn-outline-navy" style={{ display: "inline-flex", alignItems: "center", height: 46, padding: "0 22px", borderRadius: 8, border: "1.5px solid #012746", color: "#012746", font: "600 14px Montserrat" }}>DESCOBRIR MEU MODELO</a>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 28px" }}>
              {heroTrust.map((t, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 8, font: "500 13.5px Inter", color: "#012746" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#F05A00" strokeWidth="2.4" strokeLinecap="round"><path d="M4.5 12.5l4.5 4.5L19.5 6.5"></path></svg>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <Link to={heroProduct ? `/produto/${heroProduct.id}` : "/categoria"} style={{ aspectRatio: "4/3.4", maxWidth: 420, margin: "0 auto", borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden", background: heroProduct?.image_url ? "#fff" : "repeating-linear-gradient(135deg,#F1F5F9 0 9px,#E9EFF5 9px 18px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, textAlign: "center", padding: heroProduct?.image_url ? 0 : 24 }}>
              {heroProduct?.image_url ? (
                <img src={heroProduct.image_url} alt={heroProduct.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 24 }} />
              ) : heroProduct ? (
                <span style={{ font: "600 15px Montserrat", color: "#012746", maxWidth: 260 }}>{heroProduct.name}</span>
              ) : (
                <>
                  <span style={{ font: "500 12px ui-monospace,SFMono-Regular,monospace", letterSpacing: ".1em", color: "#94A3B8" }}>FOTO PRINCIPAL DO HERO</span>
                  <span style={{ font: "400 12px ui-monospace,monospace", color: "#94A3B8", maxWidth: 260, lineHeight: 1.6 }}>Cadastre um produto para exibir aqui</span>
                </>
              )}
            </Link>
            {heroProduct && (
              <div style={{ position: "absolute", left: -16, bottom: 28, background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "14px 18px", boxShadow: "0 8px 28px rgba(1,39,70,.12)", maxWidth: 220 }}>
                {heroDesconto > 0 && (
                  <div style={{ display: "inline-block", background: "#F05A00", color: "#fff", font: "800 10.5px Montserrat", letterSpacing: ".06em", padding: "3px 8px", borderRadius: 4, marginBottom: 6 }}>-{heroDesconto}%</div>
                )}
                <div style={{ font: "600 12.5px Inter", color: "#012746", marginBottom: 6, lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>{heroProduct.name}</div>
                <div style={{ font: "800 21px Montserrat", color: "#F05A00", lineHeight: 1.15 }}>{formatBRL(heroProduct.price_to)}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="categorias" style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 8px" }}>
        <h2 style={{ margin: "0 0 8px", font: "700 26px Montserrat", color: "#012746", letterSpacing: "-.01em" }}>Compre por tipo de aspirador</h2>
        <p style={{ margin: "0 0 24px", font: "400 14.5px Inter", color: "#475569" }}>Seis categorias, sem enrolação. Escolha pelo formato que combina com a sua casa.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 24 }}>
          {categorias.length > 0 ? categorias.map((c, i) => (
            <Link key={i} to={`/categoria?cat=${encodeURIComponent(c.nome)}`} className="card-hover" style={{ display: "flex", flexDirection: "column", gap: 14, padding: 20, border: "1px solid #E2E8F0", borderRadius: 12, background: "#fff" }}>
              <div style={{ aspectRatio: "1/1", borderRadius: 8, overflow: "hidden", background: c.image_url ? "#fff" : "repeating-linear-gradient(135deg,#F8FAFC 0 8px,#F1F5F9 8px 16px)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: c.image_url ? 0 : 12, font: "400 10.5px ui-monospace,monospace", letterSpacing: ".06em", color: "#94A3B8" }}>
                {c.image_url ? <img src={c.image_url} alt={`Aspiradores ${c.nome}`} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 14 }} /> : c.nome.toLowerCase()}
              </div>
              <div>
                <div style={{ font: "700 15px Montserrat", color: "#012746", marginBottom: 3 }}>{c.nome}</div>
                <div style={{ font: "400 13px Inter", color: "#475569" }}>{c.qtd} modelo{c.qtd === 1 ? "" : "s"}</div>
              </div>
            </Link>
          )) : (
            <p style={{ font: "400 15px Inter", color: "#94A3B8" }}>Nenhum produto cadastrado ainda.</p>
          )}
        </div>
      </section>

      <section id="ofertas" style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 0" }}>
        <div style={{ background: "linear-gradient(100deg,#012746,#001B31)", borderRadius: 16, padding: "22px 26px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20, marginBottom: 28 }}>
          <div>
            <div style={{ display: "inline-block", background: "#F05A00", color: "#fff", font: "800 10.5px Montserrat", letterSpacing: ".1em", padding: "4px 10px", borderRadius: 4, marginBottom: 10 }}>OFERTA DO DIA</div>
            <h2 style={{ margin: 0, font: "800 25px Montserrat", color: "#fff", letterSpacing: "-.01em" }}>Descontos que acabam hoje</h2>
            <p style={{ margin: "6px 0 0", font: "400 14px Inter", color: "#B8C5D0" }}>Preços válidos enquanto durar o estoque de cada modelo.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ font: "600 12.5px Inter", color: "#B8C5D0", maxWidth: 96, lineHeight: 1.35 }}>Termina em</span>
            <div style={{ display: "flex", gap: 8 }}>
              {countdown.map((u, i) => (
                <div key={i} style={{ minWidth: 54, background: "rgba(255,255,255,.08)", border: "1px solid #1E3A4D", borderRadius: 8, padding: "8px 6px", textAlign: "center" }}>
                  <div style={{ font: "800 19px Montserrat", color: "#fff", lineHeight: 1 }}>{u.v}</div>
                  <div style={{ font: "500 10px Inter", letterSpacing: ".1em", color: "#94A3B8", marginTop: 4 }}>{u.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {ofertas.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(238px,1fr))", gap: 24 }}>
            {ofertas.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        ) : (
          <p style={{ font: "400 15px Inter", color: "#94A3B8" }}>Nenhum produto com desconto ativo no momento.</p>
        )}
      </section>

      <section id="necessidade" style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 0" }}>
        <h2 style={{ margin: "0 0 8px", font: "700 26px Montserrat", color: "#012746", letterSpacing: "-.01em" }}>Qual é o seu problema de limpeza?</h2>
        <p style={{ margin: "0 0 24px", font: "400 14.5px Inter", color: "#475569" }}>Diga o que incomoda na sua casa e a gente mostra só os modelos que resolvem.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
          {necessidades.map((n, i) => (
            <Link key={i} to={`/busca?q=${encodeURIComponent(n.q)}`} className="need-card" style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 20px", border: "1px solid #E2E8F0", borderRadius: 12, background: "#F8FAFC" }}>
              <span style={{ flex: "none", width: 40, height: 40, borderRadius: 8, background: "#fff", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", font: "700 15px Montserrat", color: "#F05A00" }}>{n.i}</span>
              <span>
                <span style={{ display: "block", font: "700 14.5px Montserrat", color: "#012746" }}>{n.t}</span>
                <span style={{ display: "block", font: "400 12.5px Inter", color: "#475569", marginTop: 2 }}>{n.s}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 0" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 24 }}>
          <div>
            <h2 style={{ margin: "0 0 6px", font: "700 26px Montserrat", color: "#012746", letterSpacing: "-.01em" }}>Mais vendidos do mês</h2>
            <p style={{ margin: 0, font: "400 14.5px Inter", color: "#475569" }}>O que as famílias brasileiras estão levando para casa.</p>
          </div>
          <Link to="/categoria" className="btn-outline-navy" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 42, padding: "0 20px", borderRadius: 8, border: "1.5px solid #012746", color: "#012746", font: "600 13px Montserrat" }}>VER RANKING COMPLETO</Link>
        </div>
        {vendidos.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(238px,1fr))", gap: 24 }}>
            {vendidos.map((p) => <ProductCard key={p.id} p={p} priceColor="#012746" />)}
          </div>
        ) : (
          <p style={{ font: "400 15px Inter", color: "#94A3B8" }}>Nenhum produto cadastrado ainda.</p>
        )}
      </section>

      <section style={{ margin: "48px 0 0", background: "#F8FAFC", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 28 }}>
          {beneficios.map((b, i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span style={{ flex: "none", width: 44, height: 44, borderRadius: 8, background: "#fff", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#012746" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={b.d}></path></svg>
              </span>
              <span>
                <span style={{ display: "block", font: "700 15px Montserrat", color: "#012746", marginBottom: 4 }}>{b.t}</span>
                <span style={{ display: "block", font: "400 13.5px/1.55 Inter", color: "#475569" }}>{b.s}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 0" }}>
        <div className="stack-mobile" style={{ display: "grid", gridTemplateColumns: "minmax(0,.85fr) minmax(0,1.15fr)", gap: 40 }}>
          <div>
            <h2 style={{ margin: "0 0 8px", font: "700 26px Montserrat", color: "#012746", letterSpacing: "-.01em" }}>Quem comprou, aprovou</h2>
            <p style={{ margin: "0 0 20px", font: "400 14.5px Inter", color: "#475569" }}>
              {totalAvaliacoes > 0
                ? <>Média de {mediaGeral.toFixed(1).replace(".", ",")} em {totalAvaliacoes.toLocaleString("pt-BR")} avaliações verificadas de clientes que receberam o produto.</>
                : "Ainda não há avaliações suficientes."}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 20, border: "1px solid #E2E8F0", borderRadius: 12, background: "#F8FAFC" }}>
              <div style={{ font: "800 34px Montserrat", color: "#012746", lineHeight: 1 }}>{totalAvaliacoes > 0 ? mediaGeral.toFixed(1).replace(".", ",") : "-"}</div>
              <div>
                <div style={{ font: "600 16px Inter", color: "#F05A00", letterSpacing: ".1em" }}>{"★".repeat(Math.round(mediaGeral)) + "☆".repeat(Math.max(0, 5 - Math.round(mediaGeral)))}</div>
                <div style={{ font: "400 13px Inter", color: "#475569", marginTop: 4 }}>{totalAvaliacoes > 0 ? `${recomendamPct}% avaliam com 4 ou 5 estrelas` : "Sem dados ainda"}</div>
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gap: 16 }}>
            {avaliacoesExibidas.length > 0 ? avaliacoesExibidas.map((a, i) => (
              <Link key={i} to={`/produto/${a.produtoId}`} style={{ padding: 20, border: "1px solid #E2E8F0", borderRadius: 12, background: "#fff", display: "block" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                  <span style={{ font: "700 14px Montserrat", color: "#012746" }}>{a.nome}</span>
                  <span style={{ font: "600 13px Inter", color: "#F05A00", letterSpacing: ".08em" }}>{a.estrelas}</span>
                </div>
                <p style={{ margin: "0 0 8px", font: "400 14.5px/1.6 Inter", color: "#475569" }}>{a.texto}</p>
                <span style={{ font: "500 12px Inter", color: "#94A3B8" }}>{a.meta} • {a.produto}</span>
              </Link>
            )) : (
              <p style={{ font: "400 15px Inter", color: "#94A3B8" }}>Ainda não há avaliações cadastradas.</p>
            )}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 56px" }}>
        <div className="stack-mobile" style={{ display: "grid", gridTemplateColumns: "minmax(0,.7fr) minmax(0,1.3fr)", gap: 40 }}>
          <div>
            <h2 style={{ margin: "0 0 8px", font: "700 26px Montserrat", color: "#012746", letterSpacing: "-.01em" }}>Dúvidas frequentes</h2>
            <p style={{ margin: 0, font: "400 14.5px Inter", color: "#475569" }}>Se ficar qualquer dúvida, fale com nosso atendimento especializado pelo WhatsApp.</p>
          </div>
          <FaqAccordion faq={faq} />
        </div>
      </section>

      <FooterFull columns={[categoriasCol, institucionalCol]} />
    </>
  );
}
