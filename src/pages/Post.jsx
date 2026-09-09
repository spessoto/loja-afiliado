import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import { FooterFull } from "../components/Footer.jsx";
import FaqAccordion from "../components/FaqAccordion.jsx";
import { categoriasCol, institucionalCol } from "../data/footerColumns.js";
import { categoriesMenu } from "../data/categoriesMenu.js";

const compartilhar = ["WhatsApp", "Facebook", "Copiar link"];

const vencedores = [
  { premio: "MELHOR NO GERAL", nome: "Vertax V12 Ciclônico 450W", porque: "Melhor sucção em tapete e piso frio, com autonomia real de 38 minutos.", preco: "R$ 699,90" },
  { premio: "MELHOR PARA PETS", nome: "Laris Pet Care", porque: "Escova antiemaranhado que não travou em nenhuma das repetições do teste.", preco: "R$ 764,00" },
  { premio: "MELHOR CUSTO-BENEFÍCIO", nome: "Vertax V8 Sem Fio", porque: "85% do desempenho do primeiro colocado por R$ 150 menos.", preco: "R$ 549,90" }
];

const selosProduto = ["Indicado para pets", "Filtro HEPA lavável", "38 min de bateria real"];

const tabela = [
  { modelo: "Vertax V12 Ciclônico", tapete: "92%", piso: "97%", autonomia: "38 min", preco: "R$ 699,90" },
  { modelo: "Laris Pet Care", tapete: "88%", piso: "89%", autonomia: "34 min", preco: "R$ 764,00" },
  { modelo: "Vertax V8 Sem Fio", tapete: "79%", piso: "94%", autonomia: "28 min", preco: "R$ 549,90" },
  { modelo: "Cyclon Pro Max", tapete: "74%", piso: "86%", autonomia: "52 min", preco: "R$ 1.239,00" },
  { modelo: "Nordika Air 2 em 1", tapete: "64%", piso: "91%", autonomia: "26 min", preco: "R$ 459,00" }
];

const faq = [
  { q: "Qual é o melhor aspirador vertical de 2026?", a: "No nosso teste, o Vertax V12 Ciclônico 450W teve o melhor desempenho geral, com 92% de remoção em tapete e 97% em piso frio, além de 38 minutos de autonomia real." },
  { q: "Quantos watts um aspirador vertical precisa ter?", a: "Para casas com tapete, procure a partir de 400W com escova motorizada. Em piso frio, modelos de 300W a 350W já entregam bom resultado." },
  { q: "Aspirador vertical substitui o tradicional?", a: "Para a limpeza do dia a dia em casas de até 100 m², sim. Para limpeza pesada, líquidos ou obra, um modelo de pó e água continua sendo necessário." },
  { q: "Qual aspirador vertical é melhor para pelo de animal?", a: "Modelos com escova antiemaranhado, como o Laris Pet Care, evitam que o pelo enrole no rolo. É o recurso que mais faz diferença em casa com cachorro ou gato." },
  { q: "Vale a pena pagar mais por bateria removível?", a: "Só se a sua casa passa de 120 m² ou se você limpa mais de um andar por vez. Abaixo disso, a autonomia de uma carga costuma bastar." }
];

const relacionados = [
  { categoria: "GUIAS DE COMPRA", titulo: "Aspirador robô vale a pena? O que ele resolve", leitura: "9 min de leitura", imagem: "robô em sala com tapete" },
  { categoria: "PETS EM CASA", titulo: "Como escolher aspirador para pelo de cachorro e gato", leitura: "7 min de leitura", imagem: "escova com pelos" },
  { categoria: "MANUTENÇÃO", titulo: "Como lavar o filtro HEPA sem perder eficiência", leitura: "5 min de leitura", imagem: "filtro HEPA sendo lavado" }
];

const maisLidos = [
  "Quantos watts de potência um aspirador precisa ter",
  "Aspirador para apartamento pequeno: 6 modelos compactos",
  "Aspirador com saco ou sem saco: qual custa menos",
  "A ordem certa de limpar a casa para gastar menos tempo"
];

export default function Post() {
  const [progresso, setProgresso] = useState("0%");

  useEffect(() => {
    document.title = "Melhor aspirador vertical de 2026: 5 modelos testados — Promo Aspiradores";
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? Math.min(100, Math.round((h.scrollTop / max) * 100)) : 0;
      setProgresso(pct + "%");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const noSubmit = (e) => e.preventDefault();

  return (
    <>
      <Header
        marquee={["GUIAS DE COMPRA ESCRITOS POR ESPECIALISTAS", "ATUALIZADOS TODA SEMANA"]}
        categoriesNav={{ menu: categoriesMenu, showAllCategories: false, itemTo: "/categoria", ofertaTo: "/categoria" }}
        progress={progresso}
      />

      <nav aria-label="Breadcrumb" style={{ borderBottom: "1px solid #F1F5F9", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "11px 24px", display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", font: "400 13px Inter", color: "#475569" }}>
          <Link to="/">Home</Link><span style={{ color: "#94A3B8" }}>/</span>
          <Link to="/blog">Blog</Link><span style={{ color: "#94A3B8" }}>/</span>
          <Link to="/blog">Comparativos</Link><span style={{ color: "#94A3B8" }}>/</span>
          <span style={{ color: "#012746", fontWeight: 500 }}>Melhor aspirador vertical de 2026</span>
        </div>
      </nav>

      <article>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "44px 24px 0" }}>
          <div style={{ maxWidth: 780 }}>
            <Link to="/blog" style={{ display: "inline-block", font: "700 11.5px Montserrat", letterSpacing: ".12em", color: "#F05A00", marginBottom: 16 }}>COMPARATIVOS</Link>
            <h1 style={{ margin: "0 0 18px", font: "800 44px/1.14 Montserrat", color: "#012746", letterSpacing: "-.02em", textWrap: "balance" }}>Melhor aspirador vertical de 2026: 5 modelos testados por preço e potência</h1>
            <p style={{ margin: "0 0 28px", font: "400 19px/1.65 Inter", color: "#475569" }}>Colocamos cinco verticais sem fio nas mesmas quatro provas: tapete de pelo médio, piso frio, pelo de animal e farinha de trigo. O modelo mais caro do teste perdeu em três delas.</p>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16, padding: "18px 0", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "repeating-linear-gradient(135deg,#F1F5F9 0 6px,#E9EFF5 6px 12px)", border: "1px solid #E2E8F0", flex: "none" }}></div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ font: "600 14.5px Inter", color: "#012746" }}>Por <a href="#autora" style={{ color: "#012746", textDecoration: "underline" }}>Marina Duarte</a>, especialista em eletroportáteis</div>
                <div style={{ font: "400 13px Inter", color: "#64748B", marginTop: 3 }}>Publicado em 14 de agosto de 2026 • Atualizado em 2 de setembro de 2026 • 12 min de leitura</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {compartilhar.map((s, i) => (
                  <a key={i} href="#compartilhar" className="pill" style={{ display: "flex", alignItems: "center", height: 38, padding: "0 14px", border: "1px solid #E2E8F0", borderRadius: 20, font: "600 12.5px Inter", color: "#475569" }}>{s}</a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 0" }}>
          <figure style={{ margin: "0 0 48px", maxWidth: 1000 }}>
            <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid #E2E8F0" }}>
              <div style={{ aspectRatio: "16/9", background: "repeating-linear-gradient(135deg,#F1F5F9 0 10px,#E9EFF5 10px 20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, textAlign: "center", padding: 24 }}>
                <span style={{ font: "500 12px ui-monospace,SFMono-Regular,monospace", letterSpacing: ".1em", color: "#94A3B8" }}>IMAGEM DE DESTAQUE</span>
                <span style={{ font: "400 12px ui-monospace,monospace", color: "#94A3B8", maxWidth: 320, lineHeight: 1.6 }}>1600×900, WebP — os cinco aspiradores verticais enfileirados sobre piso claro, com etiquetas de identificação</span>
              </div>
            </div>
            <figcaption style={{ marginTop: 10, font: "400 13px/1.6 Inter", color: "#64748B" }}>Os cinco modelos avaliados entre julho e agosto de 2026. Foto: Promo Aspiradores.</figcaption>
          </figure>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(280px,308px)", gap: 56, alignItems: "start" }}>
            <div style={{ maxWidth: 780 }}>

              <nav aria-label="Índice do artigo" style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: "22px 24px", marginBottom: 44, background: "#F8FAFC" }}>
                <div style={{ font: "700 13px Montserrat", letterSpacing: ".1em", color: "#012746", marginBottom: 14 }}>O QUE VOCÊ VAI ENCONTRAR</div>
                <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 9 }}>
                  <li style={{ font: "400 14.5px/1.5 Inter", color: "#475569" }}><a href="#resumo" className="hover-orange" style={{ color: "#475569" }}>Resposta rápida: os vencedores por perfil</a></li>
                  <li style={{ font: "400 14.5px/1.5 Inter", color: "#475569" }}><a href="#metodo" className="hover-orange" style={{ color: "#475569" }}>Como fizemos o teste</a></li>
                  <li style={{ font: "400 14.5px/1.5 Inter", color: "#475569" }}><a href="#resultados" className="hover-orange" style={{ color: "#475569" }}>Resultados modelo por modelo</a></li>
                  <li style={{ font: "400 14.5px/1.5 Inter", color: "#475569" }}><a href="#tabela" className="hover-orange" style={{ color: "#475569" }}>Tabela comparativa completa</a></li>
                  <li style={{ font: "400 14.5px/1.5 Inter", color: "#475569" }}><a href="#escolher" className="hover-orange" style={{ color: "#475569" }}>Como escolher o seu</a></li>
                  <li style={{ font: "400 14.5px/1.5 Inter", color: "#475569" }}><a href="#faq" className="hover-orange" style={{ color: "#475569" }}>Perguntas frequentes</a></li>
                </ol>
              </nav>

              <section id="resumo" style={{ marginBottom: 48 }}>
                <h2 style={{ margin: "0 0 18px", font: "700 30px Montserrat", color: "#012746", letterSpacing: "-.01em" }}>Resposta rápida: os vencedores por perfil</h2>
                <p style={{ margin: "0 0 20px", font: "400 17px/1.8 Inter", color: "#334155" }}>Se você quer só a conclusão, ela está aqui. Cada modelo abaixo ganhou em uma situação específica de uso, e é isso que deve guiar a escolha — não o preço mais alto da lista.</p>
                <div style={{ display: "grid", gap: 14 }}>
                  {vencedores.map((v, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(90px,110px) minmax(0,1fr) auto", gap: 20, alignItems: "center", padding: "18px 20px", border: "1px solid #E2E8F0", borderRadius: 12 }}>
                      <div style={{ aspectRatio: "1/1", borderRadius: 8, background: "repeating-linear-gradient(135deg,#F8FAFC 0 7px,#F1F5F9 7px 14px)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 8, font: "400 9px ui-monospace,monospace", color: "#94A3B8", letterSpacing: ".04em" }}>FOTO</div>
                      <div>
                        <div style={{ font: "700 11px Montserrat", letterSpacing: ".1em", color: "#F05A00", marginBottom: 6 }}>{v.premio}</div>
                        <div style={{ font: "700 17px/1.35 Montserrat", color: "#012746", marginBottom: 6 }}>{v.nome}</div>
                        <div style={{ font: "400 14px/1.6 Inter", color: "#475569" }}>{v.porque}</div>
                      </div>
                      <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
                        <span style={{ font: "800 22px Montserrat", color: "#F05A00", whiteSpace: "nowrap" }}>{v.preco}</span>
                        <Link to="/produto" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 44, padding: "0 22px", borderRadius: 8, background: "#F05A00", color: "#fff", font: "700 13.5px Montserrat", letterSpacing: ".05em", whiteSpace: "nowrap" }}>VER OFERTA</Link>
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ margin: "18px 0 0", font: "400 13px/1.6 Inter", color: "#94A3B8" }}>Preços verificados em 2 de setembro de 2026. Os links levam a lojas parceiras e podem gerar comissão para a Promo Aspiradores, sem custo adicional para você.</p>
              </section>

              <section id="metodo" style={{ marginBottom: 48 }}>
                <h2 style={{ margin: "0 0 18px", font: "700 30px Montserrat", color: "#012746", letterSpacing: "-.01em" }}>Como fizemos o teste</h2>
                <p style={{ margin: "0 0 18px", font: "400 17px/1.8 Inter", color: "#334155" }}>Todos os aparelhos passaram pelas mesmas quatro provas, na mesma sala, com o mesmo operador e sempre com bateria cheia e reservatório vazio. Cada prova foi repetida três vezes e consideramos a média.</p>
                <ul style={{ margin: "0 0 20px", paddingLeft: 22, display: "grid", gap: 12 }}>
                  <li style={{ font: "400 17px/1.8 Inter", color: "#334155" }}><strong style={{ fontWeight: 600, color: "#012746" }}>Tapete de pelo médio:</strong> 20 gramas de areia fina espalhados em um metro quadrado, quatro passadas por área.</li>
                  <li style={{ font: "400 17px/1.8 Inter", color: "#334155" }}><strong style={{ fontWeight: 600, color: "#012746" }}>Piso frio:</strong> farinha de trigo em superfície lisa, medindo o resíduo deixado nos rejuntes.</li>
                  <li style={{ font: "400 17px/1.8 Inter", color: "#334155" }}><strong style={{ fontWeight: 600, color: "#012746" }}>Pelo de animal:</strong> pelo de cachorro de porte médio sobre sofá de tecido, avaliando emaranhamento na escova.</li>
                  <li style={{ font: "400 17px/1.8 Inter", color: "#334155" }}><strong style={{ fontWeight: 600, color: "#012746" }}>Autonomia real:</strong> tempo até o desligamento no modo padrão, com escova motorizada acionada.</li>
                </ul>
                <div style={{ padding: "20px 24px", borderLeft: "3px solid #012746", background: "#F8FAFC", borderRadius: "0 12px 12px 0" }}>
                  <strong style={{ display: "block", font: "700 15px Montserrat", color: "#012746", marginBottom: 8 }}>Transparência</strong>
                  <span style={{ font: "400 15px/1.7 Inter", color: "#475569" }}>Compramos três dos cinco aparelhos com recursos próprios e recebemos dois em empréstimo dos fabricantes, devolvidos após os testes. Nenhuma marca teve influência sobre os resultados ou sobre este texto.</span>
                </div>
              </section>

              <section id="resultados" style={{ marginBottom: 48 }}>
                <h2 style={{ margin: "0 0 18px", font: "700 30px Montserrat", color: "#012746", letterSpacing: "-.01em" }}>Resultados modelo por modelo</h2>

                <h3 style={{ margin: "0 0 14px", font: "700 22px Montserrat", color: "#012746" }}>1. Vertax V12 Ciclônico 450W — melhor no geral</h3>
                <p style={{ margin: "0 0 16px", font: "400 17px/1.8 Inter", color: "#334155" }}>Foi o único que passou de 90% de remoção em tapete sem perder desempenho com o reservatório pela metade. A tecnologia ciclônica cumpre o que promete: a sucção medida no bico caiu apenas 4% entre o início e o fim da prova.</p>
                <p style={{ margin: "0 0 16px", font: "400 17px/1.8 Inter", color: "#334155" }}>Os 45 minutos de autonomia anunciados viraram 38 no nosso teste com escova motorizada — resultado honesto para a categoria. O peso de 1,8 kg deixa o uso confortável mesmo em teto e escada.</p>
                <p style={{ margin: "0 0 24px", font: "400 17px/1.8 Inter", color: "#334155" }}>Ponto negativo: o reservatório de 0,8 litro exige duas paradas para esvaziar em uma casa de dois quartos. Se você tem animais, conte com isso. Veja a ficha completa na <Link to="/produto" style={{ color: "#F05A00", textDecoration: "underline" }}>página do Vertax V12</Link>.</p>

                <div style={{ border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden", marginBottom: 36, boxShadow: "0 4px 20px rgba(1,39,70,.08)" }}>
                  <div style={{ padding: "12px 20px", background: "#012746", font: "700 11.5px Montserrat", letterSpacing: ".12em", color: "#fff" }}>NOSSA PRIMEIRA ESCOLHA</div>
                  <div style={{ display: "grid", gridTemplateColumns: "minmax(120px,160px) minmax(0,1fr)", gap: 24, padding: 24 }}>
                    <div style={{ aspectRatio: "1/1", borderRadius: 10, background: "repeating-linear-gradient(135deg,#F8FAFC 0 8px,#F1F5F9 8px 16px)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 12, font: "400 10px ui-monospace,monospace", color: "#94A3B8", letterSpacing: ".06em" }}>FOTO DO PRODUTO<br />fundo branco</div>
                    <div>
                      <div style={{ font: "600 11px Inter", letterSpacing: ".1em", color: "#94A3B8", marginBottom: 5 }}>VERTAX</div>
                      <div style={{ font: "700 19px/1.35 Montserrat", color: "#012746", marginBottom: 10 }}>Aspirador Vertical Sem Fio Vertax V12 Ciclônico 450W</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                        {selosProduto.map((s, i) => (
                          <span key={i} style={{ display: "inline-flex", alignItems: "center", height: 30, padding: "0 12px", border: "1px solid #E2E8F0", borderRadius: 18, background: "#F8FAFC", font: "500 12px Inter", color: "#012746" }}>{s}</span>
                        ))}
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: 14 }}>
                        <div>
                          <div style={{ font: "400 13px Inter", color: "#64748B", textDecoration: "line-through" }}>R$ 1.029,90</div>
                          <div style={{ font: "800 30px Montserrat", color: "#F05A00", lineHeight: 1.1 }}>R$ 699,90</div>
                          <div style={{ font: "400 13px Inter", color: "#475569" }}>ou 10x de R$ 69,99 sem juros</div>
                        </div>
                        <Link to="/produto" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, height: 52, padding: "0 30px", borderRadius: 8, background: "#F05A00", color: "#fff", font: "700 15px Montserrat", letterSpacing: ".04em", boxShadow: "0 8px 24px rgba(240,90,0,.26)" }}>
                          COMPRAR AGORA
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h13M13 6.5l5.5 5.5L13 17.5"></path></svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <h3 style={{ margin: "0 0 14px", font: "700 22px Montserrat", color: "#012746" }}>2. Laris Pet Care — melhor para quem tem animais</h3>
                <p style={{ margin: "0 0 16px", font: "400 17px/1.8 Inter", color: "#334155" }}>A escova antiemaranhado é a mais eficiente do grupo. Depois de dez minutos aspirando sofá com pelo de cachorro, foi o único modelo em que não precisamos usar tesoura para liberar o rolo.</p>
                <p style={{ margin: "0 0 24px", font: "400 17px/1.8 Inter", color: "#334155" }}>Em contrapartida, ficou em quarto lugar na prova de piso frio. Se a sua casa é toda de porcelanato e você não tem animais, existem opções melhores por menos dinheiro.</p>

                <h3 style={{ margin: "0 0 14px", font: "700 22px Montserrat", color: "#012746" }}>3. Vertax V8 — melhor custo-benefício</h3>
                <p style={{ margin: "0 0 16px", font: "400 17px/1.8 Inter", color: "#334155" }}>Entrega cerca de 85% do desempenho do V12 por 21% menos. Para apartamento de até 70 metros quadrados sem animais, é a compra mais racional da lista.</p>
                <p style={{ margin: "0 0 24px", font: "400 17px/1.8 Inter", color: "#334155" }}>A autonomia de 28 minutos é o limite. Acima disso, você vai recarregar no meio da limpeza.</p>

                <h3 style={{ margin: "0 0 14px", font: "700 22px Montserrat", color: "#012746" }}>4. Cyclon Pro Max — o mais caro não venceu</h3>
                <p style={{ margin: "0 0 24px", font: "400 17px/1.8 Inter", color: "#334155" }}>Ganhou em autonomia, com 52 minutos reais e bateria removível, mas perdeu em tapete, em piso frio e em ruído. A R$ 1.239, só se justifica para casas grandes onde a troca de bateria realmente importa.</p>

                <h3 style={{ margin: "0 0 14px", font: "700 22px Montserrat", color: "#012746" }}>5. Nordika Air 2 em 1 — o mais leve</h3>
                <p style={{ margin: 0, font: "400 17px/1.8 Inter", color: "#334155" }}>Com 1,4 kg, é o mais confortável para limpeza rápida e alcance de teto. A sucção, porém, ficou 30% abaixo do primeiro colocado em tapete. Bom como segundo aspirador, não como o único da casa.</p>
              </section>

              <section id="tabela" style={{ marginBottom: 48 }}>
                <h2 style={{ margin: "0 0 18px", font: "700 30px Montserrat", color: "#012746", letterSpacing: "-.01em" }}>Tabela comparativa completa</h2>
                <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.5fr) repeat(4,minmax(0,1fr))", gap: 12, padding: "14px 18px", background: "#012746" }}>
                    <span style={{ font: "700 11.5px Montserrat", letterSpacing: ".06em", color: "#fff" }}>MODELO</span>
                    <span style={{ font: "700 11.5px Montserrat", letterSpacing: ".06em", color: "#fff" }}>TAPETE</span>
                    <span style={{ font: "700 11.5px Montserrat", letterSpacing: ".06em", color: "#fff" }}>PISO</span>
                    <span style={{ font: "700 11.5px Montserrat", letterSpacing: ".06em", color: "#fff" }}>AUTONOMIA</span>
                    <span style={{ font: "700 11.5px Montserrat", letterSpacing: ".06em", color: "#fff" }}>PREÇO</span>
                  </div>
                  {tabela.map((r, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(0,1.5fr) repeat(4,minmax(0,1fr))", gap: 12, padding: "14px 18px", borderBottom: "1px solid #F1F5F9", alignItems: "center" }}>
                      <span style={{ font: "600 13.5px/1.4 Inter", color: "#012746" }}>{r.modelo}</span>
                      <span style={{ font: "500 13.5px Inter", color: "#475569" }}>{r.tapete}</span>
                      <span style={{ font: "500 13.5px Inter", color: "#475569" }}>{r.piso}</span>
                      <span style={{ font: "500 13.5px Inter", color: "#475569" }}>{r.autonomia}</span>
                      <span style={{ font: "700 13.5px Montserrat", color: "#F05A00" }}>{r.preco}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section id="escolher" style={{ marginBottom: 48 }}>
                <h2 style={{ margin: "0 0 18px", font: "700 30px Montserrat", color: "#012746", letterSpacing: "-.01em" }}>Como escolher o seu</h2>
                <p style={{ margin: "0 0 18px", font: "400 17px/1.8 Inter", color: "#334155" }}>Depois de testar dezenas de modelos, a nossa recomendação é começar pela superfície predominante da casa e pela presença de animais. Esses dois fatores eliminam a maior parte das opções antes de você olhar preço.</p>
                <p style={{ margin: "0 0 18px", font: "400 17px/1.8 Inter", color: "#334155" }}>Casas com muito tapete pedem escova motorizada e sucção acima de 400W. Casas de piso frio funcionam bem com modelos mais leves e baratos. Com animais, a escova antiemaranhado deixa de ser luxo e passa a ser requisito.</p>
                <p style={{ margin: 0, font: "400 17px/1.8 Inter", color: "#334155" }}>Se quiser filtrar por essas características, a <Link to="/categoria" style={{ color: "#F05A00", textDecoration: "underline" }}>página de aspiradores verticais</Link> tem filtro por tipo de piso, autonomia e recursos.</p>
              </section>

              <section id="faq" style={{ marginBottom: 48 }}>
                <h2 style={{ margin: "0 0 18px", font: "700 30px Montserrat", color: "#012746", letterSpacing: "-.01em" }}>Perguntas frequentes</h2>
                <FaqAccordion faq={faq} qFont="700 16px/1.4 Montserrat" />
              </section>

              <section id="autora" style={{ marginBottom: 48 }}>
                <div style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: 20, padding: 24, border: "1px solid #E2E8F0", borderRadius: 12, background: "#F8FAFC" }}>
                  <div style={{ width: 76, height: 76, borderRadius: "50%", background: "repeating-linear-gradient(135deg,#F1F5F9 0 6px,#E9EFF5 6px 12px)", border: "1px solid #E2E8F0" }}></div>
                  <div>
                    <div style={{ font: "700 11px Montserrat", letterSpacing: ".12em", color: "#F05A00", marginBottom: 6 }}>SOBRE A AUTORA</div>
                    <div style={{ font: "700 18px Montserrat", color: "#012746", marginBottom: 8 }}>Marina Duarte</div>
                    <p style={{ margin: "0 0 12px", font: "400 15px/1.7 Inter", color: "#475569" }}>Jornalista especializada em eletroportáteis desde 2016. Testou mais de 120 aspiradores e assina os comparativos da Promo Aspiradores.</p>
                    <Link to="/contato" style={{ font: "600 13.5px Inter", color: "#F05A00" }}>Falar com a redação →</Link>
                  </div>
                </div>
              </section>

              <section>
                <h2 style={{ margin: "0 0 24px", font: "700 30px Montserrat", color: "#012746", letterSpacing: "-.01em" }}>Continue lendo</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20 }}>
                  {relacionados.map((r, i) => (
                    <Link key={i} to="/post" className="card-hover" style={{ display: "flex", flexDirection: "column", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
                      <div style={{ aspectRatio: "16/10", background: "repeating-linear-gradient(135deg,#F8FAFC 0 8px,#F1F5F9 8px 16px)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 14, font: "400 10px ui-monospace,monospace", color: "#94A3B8", letterSpacing: ".06em" }}>{r.imagem}</div>
                      <div style={{ padding: "16px 18px 20px" }}>
                        <div style={{ font: "600 11px Inter", letterSpacing: ".1em", color: "#F05A00", marginBottom: 8 }}>{r.categoria}</div>
                        <div style={{ font: "700 16px/1.4 Montserrat", color: "#012746", marginBottom: 8 }}>{r.titulo}</div>
                        <div style={{ font: "400 12.5px Inter", color: "#64748B" }}>{r.leitura}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            <aside style={{ position: "sticky", top: 96, display: "grid", gap: 20 }}>
              <div style={{ background: "linear-gradient(160deg,#012746,#001B31)", borderRadius: 16, padding: 24, color: "#fff" }}>
                <div style={{ font: "700 11px Montserrat", letterSpacing: ".12em", color: "#F05A00", marginBottom: 14 }}>MELHOR ESCOLHA DO TESTE</div>
                <div style={{ borderRadius: 10, background: "rgba(255,255,255,.06)", border: "1px solid #1E3A4D", aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 16, font: "400 10.5px ui-monospace,monospace", color: "#7A8B99", letterSpacing: ".06em", marginBottom: 16 }}>FOTO DO PRODUTO<br />fundo escuro</div>
                <div style={{ font: "600 15px/1.5 Inter", marginBottom: 12 }}>Vertax V12 Ciclônico 450W</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                  <span style={{ font: "800 26px Montserrat", color: "#F05A00" }}>R$ 699,90</span>
                  <span style={{ font: "400 13px Inter", color: "#94A3B8", textDecoration: "line-through" }}>R$ 1.029,90</span>
                </div>
                <div style={{ font: "400 13px Inter", color: "#B8C5D0", marginBottom: 18 }}>ou 10x de R$ 69,99 sem juros</div>
                <Link to="/produto" className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 50, borderRadius: 8, background: "#F05A00", color: "#fff", font: "700 15px Montserrat", letterSpacing: ".04em" }}>VER A OFERTA</Link>
                <p style={{ margin: "12px 0 0", font: "400 11.5px/1.55 Inter", color: "#7A8B99" }}>Preço verificado em 2/9/2026. Link de afiliado.</p>
              </div>

              <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 22, background: "#F8FAFC" }}>
                <div style={{ font: "700 15.5px Montserrat", color: "#012746", marginBottom: 8 }}>Receba os próximos testes</div>
                <p style={{ margin: "0 0 16px", font: "400 13.5px/1.6 Inter", color: "#475569" }}>Um e-mail por semana com comparativos novos e quedas de preço.</p>
                <form onSubmit={noSubmit} style={{ display: "grid", gap: 10 }}>
                  <input type="email" placeholder="seu@email.com.br" className="input-field" style={{ height: 48, padding: "0 16px", border: "1.5px solid #E2E8F0", borderRadius: 8, background: "#fff", font: "400 14.5px Inter", color: "#1E293B", outline: "none" }} />
                  <button className="btn-search" style={{ height: 48, border: 0, borderRadius: 8, background: "#012746", color: "#fff", font: "700 13.5px Montserrat", letterSpacing: ".05em", cursor: "pointer" }}>QUERO RECEBER</button>
                </form>
              </div>

              <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 22 }}>
                <div style={{ font: "700 13px Montserrat", letterSpacing: ".1em", color: "#012746", marginBottom: 14 }}>TAMBÉM NO BLOG</div>
                <div style={{ display: "grid", gap: 14 }}>
                  {maisLidos.map((m, i) => (
                    <Link key={i} to="/post" className="hover-orange" style={{ font: "600 14px/1.5 Inter", color: "#1E293B" }}>{m}</Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>

      <div style={{ marginTop: 72 }}>
        <FooterFull columns={[categoriasCol, institucionalCol]} />
      </div>
    </>
  );
}
