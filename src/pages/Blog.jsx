import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import { FooterFull } from "../components/Footer.jsx";
import { categoriasCol, institucionalCol } from "../data/footerColumns.js";
import { categoriesMenu } from "../data/categoriesMenu.js";

function chip(nome, ativo) {
  return { nome, bg: ativo ? "#012746" : "#fff", cor: ativo ? "#fff" : "#012746", borda: ativo ? "#012746" : "#E2E8F0" };
}
function pg(n, ativo) {
  return { n, bg: ativo ? "#F05A00" : "#fff", cor: ativo ? "#fff" : "#475569", borda: ativo ? "#F05A00" : "#E2E8F0" };
}

const topicos = [chip("Todos", true), chip("Comparativos"), chip("Guias de compra"), chip("Aspirador robô"), chip("Pets em casa"), chip("Dicas de limpeza"), chip("Manutenção")];

const posts = [
  { categoria: "GUIAS DE COMPRA", titulo: "Aspirador robô vale a pena? O que ele resolve e o que ainda não", resumo: "Autonomia, mapeamento e limitação em tapete alto. Onde o robô substitui a limpeza manual e onde ele só ajuda a manter a casa em ordem entre as faxinas.", autor: "Marina Duarte", data: "28 de agosto de 2026", leitura: "9 min de leitura", imagem: "robô aspirador em sala com tapete" },
  { categoria: "PETS EM CASA", titulo: "Como escolher aspirador para pelo de cachorro e gato", resumo: "A escova antiemaranhado é mais importante que a potência do motor. Explicamos por que e quais recursos realmente fazem diferença em casa com animais.", autor: "Rafael Nunes", data: "24 de agosto de 2026", leitura: "7 min de leitura", imagem: "escova com pelos de animal" },
  { categoria: "COMPARATIVOS", titulo: "Aspirador com saco ou sem saco: qual custa menos no fim do ano", resumo: "Fizemos a conta do custo de manutenção em 12 meses considerando sacos, filtros e consumo de energia. A diferença surpreende em uso intenso.", autor: "Marina Duarte", data: "19 de agosto de 2026", leitura: "8 min de leitura", imagem: "reservatório ciclônico aberto" },
  { categoria: "DICAS DE LIMPEZA", titulo: "A ordem certa de limpar a casa para gastar menos tempo", resumo: "Aspirar antes ou depois de passar pano? A sequência que os profissionais usam economiza cerca de 20 minutos em uma casa de dois quartos.", autor: "Camila Reis", data: "15 de agosto de 2026", leitura: "6 min de leitura", imagem: "pessoa aspirando sala" },
  { categoria: "MANUTENÇÃO", titulo: "Como lavar o filtro HEPA sem perder a eficiência", resumo: "Água corrente fria, secagem completa e a frequência ideal de troca. Erros nessa etapa reduzem a sucção do aparelho em poucos meses.", autor: "Rafael Nunes", data: "11 de agosto de 2026", leitura: "5 min de leitura", imagem: "filtro HEPA sendo lavado" },
  { categoria: "GUIAS DE COMPRA", titulo: "Aspirador de pó e água: quando o modelo profissional se paga", resumo: "Para obra, oficina e limpeza pós-reforma, o modelo de 20 litros resolve o que o vertical não alcança. Veja se o seu caso justifica o investimento.", autor: "Marina Duarte", data: "6 de agosto de 2026", leitura: "10 min de leitura", imagem: "aspirador industrial 20 litros" }
];

const paginas = [pg("1", true), pg("2"), pg("3"), pg("…"), pg("8")];

const maisLidos = [
  { n: "1", t: "Melhor aspirador vertical de 2026: 5 modelos testados" },
  { n: "2", t: "Aspirador robô vale a pena? O que ele resolve" },
  { n: "3", t: "Quantos watts de potência um aspirador precisa ter" },
  { n: "4", t: "Como escolher aspirador para pelo de cachorro e gato" },
  { n: "5", t: "Aspirador para apartamento pequeno: 6 modelos compactos" }
];

const tags = ["aspirador vertical", "aspirador robô", "sem fio", "para pets", "filtro HEPA", "pó e água", "até R$ 500", "apartamento"];

const essenciais = [
  { n: "01", t: "Como escolher um aspirador em 5 minutos", s: "O caminho mais curto entre o tipo de piso da sua casa e o modelo certo." },
  { n: "02", t: "Potência, sucção e watts: o que olhar de verdade", s: "Por que watts no motor não é o mesmo que força de sucção no bico." },
  { n: "03", t: "Quanto custa manter um aspirador por ano", s: "Filtros, sacos, baterias e energia. A conta completa antes de comprar." }
];

export default function Blog() {
  useEffect(() => {
    document.title = "Guias de compra e dicas de limpeza — Blog Promo Aspiradores";
  }, []);

  const noSubmit = (e) => e.preventDefault();

  return (
    <>
      <Header
        marquee={["GUIAS DE COMPRA ESCRITOS POR ESPECIALISTAS", "ATUALIZADOS TODA SEMANA"]}
        searchPlaceholder="Buscar guias, comparativos e dicas"
        categoriesNav={{ menu: categoriesMenu, showAllCategories: false, itemTo: "/categoria", ofertaTo: "/categoria" }}
      />

      <div style={{ borderBottom: "1px solid #F1F5F9", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "11px 24px", display: "flex", gap: 8, alignItems: "center", font: "400 13px Inter", color: "#475569" }}>
          <Link to="/">Home</Link><span style={{ color: "#94A3B8" }}>/</span><span style={{ color: "#012746", fontWeight: 500 }}>Blog</span>
        </div>
      </div>

      <section style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "44px 24px 40px" }}>
          <h1 style={{ margin: "0 0 14px", font: "800 42px/1.1 Montserrat", color: "#012746", letterSpacing: "-.02em", maxWidth: 760 }}>Guias de compra e dicas de limpeza</h1>
          <p style={{ margin: "0 0 28px", maxWidth: 680, font: "400 16.5px/1.65 Inter", color: "#475569" }}>Comparativos, testes e conteúdo prático para você escolher o aspirador certo e tirar o máximo dele. Escrito por quem usa e testa esses aparelhos todos os dias.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {topicos.map((t, i) => (
              <Link key={i} to="/blog" style={{ display: "inline-flex", alignItems: "center", height: 40, padding: "0 18px", borderRadius: 24, border: `1.5px solid ${t.borda}`, background: t.bg, font: "600 13.5px Inter", color: t.cor, whiteSpace: "nowrap" }}>{t.nome}</Link>
            ))}
          </div>
        </div>
      </section>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 0" }}>

        <article style={{ display: "grid", gridTemplateColumns: "minmax(0,1.15fr) minmax(0,.85fr)", gap: 40, alignItems: "center", marginBottom: 64 }}>
          <Link to="/post" style={{ display: "block", borderRadius: 16, overflow: "hidden", border: "1px solid #E2E8F0" }}>
            <div style={{ aspectRatio: "16/10", background: "repeating-linear-gradient(135deg,#F1F5F9 0 10px,#E9EFF5 10px 20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, textAlign: "center", padding: 24 }}>
              <span style={{ font: "500 12px ui-monospace,SFMono-Regular,monospace", letterSpacing: ".1em", color: "#94A3B8" }}>IMAGEM DE DESTAQUE</span>
              <span style={{ font: "400 12px ui-monospace,monospace", color: "#94A3B8", maxWidth: 280, lineHeight: 1.6 }}>1200×750, alt descritivo — cinco aspiradores verticais lado a lado sobre piso claro</span>
            </div>
          </Link>
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ background: "#F05A00", color: "#fff", font: "800 11px Montserrat", letterSpacing: ".1em", padding: "5px 11px", borderRadius: 4 }}>EM DESTAQUE</span>
              <Link to="/blog" style={{ font: "600 12.5px Inter", letterSpacing: ".06em", color: "#012746" }}>COMPARATIVOS</Link>
            </div>
            <h2 style={{ margin: "0 0 14px", font: "800 34px/1.2 Montserrat", color: "#012746", letterSpacing: "-.01em", textWrap: "balance" }}>
              <Link to="/post" style={{ color: "#012746" }}>Melhor aspirador vertical de 2026: 5 modelos testados por preço e potência</Link>
            </h2>
            <p style={{ margin: "0 0 20px", font: "400 16px/1.7 Inter", color: "#475569" }}>Testamos cinco verticais sem fio nas mesmas condições: tapete, piso frio, pelo de animal e farinha. O resultado mostra que o modelo mais caro não foi o melhor em três dos quatro testes.</p>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 14px", marginBottom: 24, font: "400 13.5px Inter", color: "#64748B" }}>
              <span style={{ fontWeight: 500, color: "#012746" }}>Por Marina Duarte</span>
              <span style={{ color: "#CBD5E1" }}>•</span>
              <span>Atualizado em 2 de setembro de 2026</span>
              <span style={{ color: "#CBD5E1" }}>•</span>
              <span>12 min de leitura</span>
            </div>
            <Link to="/post" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 10, height: 52, padding: "0 30px", borderRadius: 8, background: "#F05A00", color: "#fff", font: "700 15px Montserrat", letterSpacing: ".04em", boxShadow: "0 8px 24px rgba(240,90,0,.26)" }}>
              LER O COMPARATIVO
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h13M13 6.5l5.5 5.5L13 17.5"></path></svg>
            </Link>
          </div>
        </article>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(280px,308px)", gap: 56, alignItems: "start" }}>
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: 12, paddingBottom: 20, borderBottom: "2px solid #012746", marginBottom: 32 }}>
              <h2 style={{ margin: 0, font: "700 26px Montserrat", color: "#012746", letterSpacing: "-.01em" }}>Publicações recentes</h2>
              <span style={{ font: "400 13.5px Inter", color: "#64748B" }}>48 artigos publicados</span>
            </div>

            <div style={{ display: "grid", gap: 28 }}>
              {posts.map((p, i) => (
                <article key={i} style={{ display: "grid", gridTemplateColumns: "minmax(160px,240px) minmax(0,1fr)", gap: 24, alignItems: "start" }}>
                  <Link to="/post" style={{ display: "block", borderRadius: 12, overflow: "hidden", border: "1px solid #E2E8F0" }}>
                    <div style={{ aspectRatio: "4/3", background: "repeating-linear-gradient(135deg,#F8FAFC 0 8px,#F1F5F9 8px 16px)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 14, font: "400 10.5px ui-monospace,monospace", letterSpacing: ".06em", color: "#94A3B8", lineHeight: 1.5 }}>{p.imagem}</div>
                  </Link>
                  <div>
                    <Link to="/blog" style={{ display: "inline-block", font: "600 11.5px Inter", letterSpacing: ".1em", color: "#F05A00", marginBottom: 8 }}>{p.categoria}</Link>
                    <h3 style={{ margin: "0 0 10px", font: "700 21px/1.32 Montserrat", color: "#012746", textWrap: "pretty" }}>
                      <Link to="/post" style={{ color: "#012746" }}>{p.titulo}</Link>
                    </h3>
                    <p style={{ margin: "0 0 12px", font: "400 15px/1.7 Inter", color: "#475569" }}>{p.resumo}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 12px", font: "400 13px Inter", color: "#64748B" }}>
                      <span style={{ fontWeight: 500, color: "#012746" }}>{p.autor}</span>
                      <span style={{ color: "#CBD5E1" }}>•</span>
                      <span>{p.data}</span>
                      <span style={{ color: "#CBD5E1" }}>•</span>
                      <span>{p.leitura}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "48px 0 8px" }}>
              <button className="btn-outline-navy" style={{ height: 52, padding: "0 36px", border: "1.5px solid #012746", borderRadius: 8, background: "#fff", font: "700 14.5px Montserrat", letterSpacing: ".04em", color: "#012746", cursor: "pointer" }}>CARREGAR MAIS ARTIGOS</button>
              <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {paginas.map((p, i) => (
                  <Link key={i} to="/blog" style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 40, height: 40, padding: "0 10px", border: `1.5px solid ${p.borda}`, borderRadius: 8, font: "600 13.5px Inter", color: p.cor, background: p.bg }}>{p.n}</Link>
                ))}
              </nav>
            </div>
          </div>

          <aside style={{ display: "grid", gap: 20 }}>
            <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 22 }}>
              <div style={{ font: "700 13px Montserrat", letterSpacing: ".1em", color: "#012746", marginBottom: 16 }}>MAIS LIDOS DA SEMANA</div>
              <div style={{ display: "grid", gap: 16 }}>
                {maisLidos.map((m, i) => (
                  <Link key={i} to="/post" style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <span style={{ flex: "none", font: "800 20px Montserrat", color: "#E2E8F0", lineHeight: 1.1, width: 26 }}>{m.n}</span>
                    <span className="hover-orange" style={{ font: "600 14px/1.5 Inter", color: "#1E293B" }}>{m.t}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div style={{ background: "linear-gradient(160deg,#012746,#001B31)", borderRadius: 16, padding: 24, color: "#fff" }}>
              <div style={{ font: "700 11px Montserrat", letterSpacing: ".12em", color: "#F05A00", marginBottom: 10 }}>OFERTA DA SEMANA</div>
              <div style={{ borderRadius: 10, background: "rgba(255,255,255,.06)", border: "1px solid #1E3A4D", aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 16, font: "400 10.5px ui-monospace,monospace", color: "#7A8B99", letterSpacing: ".06em", marginBottom: 16 }}>FOTO DO PRODUTO<br />fundo escuro</div>
              <div style={{ font: "600 14.5px/1.5 Inter", marginBottom: 10 }}>Aspirador Vertical Vertax V12 Ciclônico 450W</div>
              <div style={{ font: "800 26px Montserrat", color: "#F05A00", lineHeight: 1.15 }}>R$ 699,90</div>
              <div style={{ font: "400 13px Inter", color: "#B8C5D0", marginBottom: 18 }}>ou 10x de R$ 69,99 sem juros</div>
              <Link to="/produto" className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 48, borderRadius: 8, background: "#F05A00", color: "#fff", font: "700 14px Montserrat", letterSpacing: ".05em" }}>VER A OFERTA</Link>
            </div>

            <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 22, background: "#F8FAFC" }}>
              <div style={{ font: "700 15.5px Montserrat", color: "#012746", marginBottom: 8 }}>Receba os comparativos por e-mail</div>
              <p style={{ margin: "0 0 16px", font: "400 13.5px/1.6 Inter", color: "#475569" }}>Um e-mail por semana com os testes novos e as quedas de preço que valem a pena.</p>
              <form onSubmit={noSubmit} style={{ display: "grid", gap: 10 }}>
                <input type="email" placeholder="seu@email.com.br" className="input-field" style={{ height: 48, padding: "0 16px", border: "1.5px solid #E2E8F0", borderRadius: 8, background: "#fff", font: "400 14.5px Inter", color: "#1E293B", outline: "none" }} />
                <button className="btn-search" style={{ height: 48, border: 0, borderRadius: 8, background: "#012746", color: "#fff", font: "700 13.5px Montserrat", letterSpacing: ".05em", cursor: "pointer" }}>QUERO RECEBER</button>
              </form>
              <p style={{ margin: "12px 0 0", font: "400 12px/1.55 Inter", color: "#94A3B8" }}>Ao assinar você concorda com a <Link to="/politica-de-privacidade" style={{ color: "#F05A00", textDecoration: "underline" }}>Política de Privacidade</Link>. Cancele quando quiser.</p>
            </div>

            <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 22 }}>
              <div style={{ font: "700 13px Montserrat", letterSpacing: ".1em", color: "#012746", marginBottom: 14 }}>BUSCAS FREQUENTES</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {tags.map((t, i) => (
                  <Link key={i} to="/blog" className="pill" style={{ display: "inline-flex", alignItems: "center", height: 34, padding: "0 13px", border: "1px solid #E2E8F0", borderRadius: 20, background: "#F8FAFC", font: "500 12.5px Inter", color: "#475569" }}>{t}</Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <section style={{ marginTop: 72, paddingBottom: 80 }}>
          <h2 style={{ margin: "0 0 10px", font: "700 30px Montserrat", color: "#012746", letterSpacing: "-.01em" }}>Comece pelos guias essenciais</h2>
          <p style={{ margin: "0 0 32px", maxWidth: 640, font: "400 15.5px/1.65 Inter", color: "#475569" }}>Se você está começando a pesquisar, estes três conteúdos respondem quase tudo antes da compra.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24 }}>
            {essenciais.map((e, i) => (
              <Link key={i} to="/post" className="card-hover" style={{ display: "flex", flexDirection: "column", gap: 14, padding: 24, border: "1px solid #E2E8F0", borderRadius: 12, background: "#fff" }}>
                <span style={{ width: 44, height: 44, borderRadius: 8, background: "#FFF1E8", display: "flex", alignItems: "center", justifyContent: "center", font: "800 15px Montserrat", color: "#F05A00" }}>{e.n}</span>
                <span style={{ font: "700 18px/1.35 Montserrat", color: "#012746" }}>{e.t}</span>
                <span style={{ font: "400 14.5px/1.65 Inter", color: "#475569" }}>{e.s}</span>
                <span style={{ font: "600 13.5px Inter", color: "#F05A00", marginTop: "auto" }}>Ler o guia →</span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <FooterFull columns={[categoriasCol, institucionalCol]} />
    </>
  );
}
