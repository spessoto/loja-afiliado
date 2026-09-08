import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import { FooterCompact } from "../components/Footer.jsx";
import { pagamentos } from "../data/footerColumns.js";
import { useProduct, formatBRL, productImages } from "../lib/products.js";

const fotos = [
  "produto inteiro, 3/4, fundo branco",
  "detalhe da escova antiemaranhado",
  "reservatório ciclônico aberto",
  "em uso na sala, sobre tapete",
  "acessórios inclusos lado a lado"
];
const labels = ["produto 3/4", "escova", "reservatório", "em uso", "acessórios"];

const tags = ["Indicado para pets", "Sem saco", "Filtro HEPA lavável", "45 min de bateria"];

const destaques = [
  { v: "450W", l: "Potência de sucção ciclônica" },
  { v: "45 min", l: "Autonomia no modo padrão" },
  { v: "1,8 kg", l: "Peso, sobe escada tranquilo" },
  { v: "72 dB", l: "Ruído, aprovado em apartamento" }
];

const specsBase = [
  { k: "Tipo", v: "Vertical sem fio 2 em 1" },
  { k: "Potência", v: "450W (motor digital)" },
  { k: "Tecnologia", v: "Ciclônica multiestágio" },
  { k: "Bateria", v: "Lítio 2.500 mAh removível" },
  { k: "Tempo de recarga", v: "4 horas" },
  { k: "Capacidade do reservatório", v: "0,8 L" },
  { k: "Filtragem", v: "HEPA lavável, retém 99,9% das partículas" },
  { k: "Acessórios inclusos", v: "Escova para tapete, bico de canto, escova para estofados, base de parede" },
  { k: "Voltagem", v: "Bivolt automático" },
  { k: "Garantia", v: "12 meses do fabricante" }
];
const specs = specsBase.map((s, i) => ({ ...s, bg: i % 2 ? "#F8FAFC" : "#FFFFFF" }));

const indicado = [
  "Casas e apartamentos de até 100 m²",
  "Quem tem cachorro ou gato em casa",
  "Limpeza rápida do dia a dia, sem fio",
  "Tapetes, sofás, cortinas e carro"
];
const naoIndicado = [
  "Limpeza de líquidos ou obra (use pó e água)",
  "Áreas acima de 150 m² em uma única carga",
  "Uso profissional contínuo"
];

const resumo = [
  { k: "Preço no Pix", v: "R$ 699,90" },
  { k: "Parcelado", v: "10x R$ 69,99" },
  { k: "Frete", v: "Grátis" },
  { k: "Garantia", v: "12 meses" }
];

const distribuicao = [
  { n: 5, w: "82%", p: "82%" },
  { n: 4, w: "12%", p: "12%" },
  { n: 3, w: "4%", p: "4%" },
  { n: 2, w: "1%", p: "1%" },
  { n: 1, w: "1%", p: "1%" }
];

const reviews = [
  { nome: "Camila R. — Belo Horizonte, MG", estrelas: "★★★★★", texto: "Tenho dois gatos e o pelo era um problema no sofá. Esse resolveu. Leve, fácil de esvaziar e a bateria dá conta do apartamento todo de uma vez.", meta: "Compra verificada • há 2 semanas" },
  { nome: "Rodrigo M. — Curitiba, PR", estrelas: "★★★★★", texto: "Custo-benefício muito bom. Comparei com dois modelos mais caros e a sucção é praticamente a mesma. Chegou antes do prazo.", meta: "Compra verificada • há 1 mês" },
  { nome: "Fernanda L. — Recife, PE", estrelas: "★★★★☆", texto: "Ótimo para o dia a dia. Só senti falta de uma bateria extra, porque em dia de limpeza pesada acaba antes de eu terminar.", meta: "Compra verificada • há 1 mês" }
];

const relacionados = [
  { marca: "VERTAX", nome: "Aspirador Vertical Vertax V8 Sem Fio 2 Velocidades", desconto: "-18%", estrelas: "★★★★★", avaliacoes: "(3.402)", por: "R$ 549,90", parcela: "ou 10x de R$ 54,99 sem juros" },
  { marca: "NORDIKA", nome: "Robô Aspirador Nordika R4 com Estação de Recarga", desconto: "", estrelas: "★★★★★", avaliacoes: "(1.988)", por: "R$ 1.249,00", parcela: "ou 10x de R$ 124,90 sem juros" },
  { marca: "DOMUS", nome: "Aspirador Portátil Domus Mini 3 em 1 para Carro", desconto: "-40%", estrelas: "★★★★☆", avaliacoes: "(2.110)", por: "R$ 289,90", parcela: "ou 10x de R$ 28,99 sem juros" },
  { marca: "LARIS", nome: "Extratora Laris Sofá & Estofados 1.400W 2L", desconto: "-15%", estrelas: "★★★★☆", avaliacoes: "(741)", por: "R$ 799,00", parcela: "ou 10x de R$ 79,90 sem juros" }
];

const restante = 12;

function linhas(text) {
  return (text || "").split("\n").map(s => s.trim()).filter(Boolean);
}

function parseSpecs(text) {
  return linhas(text).map(line => {
    const [k, ...rest] = line.split(":");
    return { k: (k || "").trim(), v: rest.join(":").trim() };
  }).filter(s => s.k && s.v);
}

export default function Produto() {
  const { id } = useParams();
  const { product, loading } = useProduct(id);
  const [foto, setFoto] = useState(0);

  useEffect(() => {
    document.title = product ? `${product.name} — Promo Aspiradores` : "Produto — Promo Aspiradores";
  }, [product]);

  const imagens = productImages(product);
  const temGaleriaReal = imagens.length > 0;
  const galeria = temGaleriaReal
    ? imagens.map((url, i) => ({ url, borda: foto === i ? "#F05A00" : "#E2E8F0", pick: () => setFoto(i) }))
    : labels.map((label, i) => ({ label, borda: foto === i ? "#F05A00" : "#E2E8F0", pick: () => setFoto(i) }));
  const barra = Math.round((restante / 40) * 100) + "%";

  const nome = product?.name || "Aspirador Vertical Sem Fio Vertax V12 Ciclônico 450W";
  const marca = product?.brand || "VERTAX";
  const categoria = product?.category || "Vertical sem fio";
  const precoDe = product ? formatBRL(product.price_from) : "R$ 1.029,90";
  const precoPor = product ? formatBRL(product.price_to) || "R$ 699,90" : "R$ 699,90";
  const parcela = product?.installment || "10x de R$ 69,99";
  const descricao = product?.description;
  const afiliado = product?.affiliate_url || "#afiliado";
  const buyProps = product ? { href: afiliado, target: "_blank", rel: "noopener noreferrer" } : { href: "#afiliado" };

  const productTags = linhas(product?.tags);
  const tagsExibidas = productTags.length > 0 ? productTags : (product ? [] : tags);
  const productSpecs = parseSpecs(product?.specs);
  const specsExibidas = productSpecs.length > 0 ? productSpecs.map((s, i) => ({ ...s, bg: i % 2 ? "#F8FAFC" : "#FFFFFF" })) : (product ? [] : specs);
  const productIndicado = linhas(product?.indicado);
  const indicadoExibido = productIndicado.length > 0 ? productIndicado : (product ? [] : indicado);
  const productNaoIndicado = linhas(product?.nao_indicado);
  const naoIndicadoExibido = productNaoIndicado.length > 0 ? productNaoIndicado : (product ? [] : naoIndicado);

  if (!loading && id && !product) {
    return (
      <>
        <Header marquee={["FRETE GRÁTIS ACIMA DE R$ 299", "ATÉ 10X SEM JUROS", "COMPRA SEGURA E NOTA FISCAL"]} sticky={false} />
        <div style={{ maxWidth: 640, margin: "80px auto", textAlign: "center", padding: "0 24px" }}>
          <h1 style={{ font: "800 28px Montserrat, sans-serif", color: "#012746" }}>Produto não encontrado</h1>
          <Link to="/categoria" className="btn-primary" style={{ display: "inline-flex", marginTop: 16, height: 48, padding: "0 24px", alignItems: "center", borderRadius: 8, background: "#F05A00", color: "#fff", font: "700 14px Montserrat" }}>Ver aspiradores</Link>
        </div>
        <FooterCompact payment={pagamentos} />
      </>
    );
  }

  return (
    <>
      <Header
        marquee={["FRETE GRÁTIS ACIMA DE R$ 299", "ATÉ 10X SEM JUROS", "COMPRA SEGURA E NOTA FISCAL"]}
        sticky={false}
      />

      <div style={{ borderBottom: "1px solid #F1F5F9", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "11px 24px", display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", font: "400 13px Inter", color: "#475569" }}>
          <Link to="/">Home</Link><span style={{ color: "#94A3B8" }}>/</span>
          <Link to="/categoria">Aspiradores</Link><span style={{ color: "#94A3B8" }}>/</span>
          <Link to="/categoria">{categoria}</Link><span style={{ color: "#94A3B8" }}>/</span>
          <span style={{ color: "#012746", fontWeight: 500 }}>{nome}</span>
        </div>
      </div>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.15fr) minmax(340px,.85fr)", gap: 48, alignItems: "start" }}>

          <div style={{ display: "grid", gridTemplateColumns: "72px minmax(0,1fr)", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: galeria.length > 7 ? 576 : "none", overflowY: galeria.length > 7 ? "auto" : "visible", paddingRight: galeria.length > 7 ? 4 : 0 }}>
              {galeria.map((g, i) => (
                <button key={i} onClick={g.pick} style={{ flex: "none", border: `1.5px solid ${g.borda}`, borderRadius: 8, background: g.url ? "#fff" : "repeating-linear-gradient(135deg,#F8FAFC 0 7px,#F1F5F9 7px 14px)", aspectRatio: "1/1", padding: g.url ? 0 : 6, cursor: "pointer", font: "400 8.5px ui-monospace,monospace", color: "#94A3B8", lineHeight: 1.3, textAlign: "center", overflow: "hidden" }}>
                  {g.url ? <img src={g.url} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} /> : g.label}
                </button>
              ))}
            </div>
            <div>
              <div style={{ position: "relative", border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden", background: "#fff" }}>
                {temGaleriaReal ? (
                  <div style={{ aspectRatio: "1/1" }}>
                    <img src={imagens[foto] || imagens[0]} alt={nome} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
                  </div>
                ) : (
                  <div style={{ aspectRatio: "1/1", background: "repeating-linear-gradient(135deg,#F8FAFC 0 10px,#F1F5F9 10px 20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, textAlign: "center", padding: 32 }}>
                    <span style={{ font: "500 12px ui-monospace,monospace", letterSpacing: ".1em", color: "#94A3B8" }}>FOTO DO PRODUTO</span>
                    <span style={{ font: "400 12px ui-monospace,monospace", color: "#94A3B8", maxWidth: 260, lineHeight: 1.6 }}>{fotos[foto]}</span>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                {tagsExibidas.map((t, i) => (
                  <span key={i} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 13px", border: "1px solid #E2E8F0", borderRadius: 24, background: "#F8FAFC", font: "500 12.5px Inter", color: "#012746" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F05A00" strokeWidth="2.6" strokeLinecap="round"><path d="M4.5 12.5l4.5 4.5L19.5 6.5"></path></svg>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div style={{ font: "600 11.5px Inter", letterSpacing: ".14em", color: "#94A3B8", marginBottom: 8 }}>{marca}</div>
            <h1 style={{ margin: "0 0 14px", font: "800 34px/1.18 Montserrat", color: "#012746", letterSpacing: "-.01em", textWrap: "balance" }}>{nome}</h1>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14, marginBottom: 24 }}>
              <span style={{ font: "600 15px Inter", color: "#F05A00", letterSpacing: ".1em" }}>★★★★★</span>
              <a href="#avaliacoes" style={{ font: "500 13.5px Inter", color: "#475569", textDecoration: "underline" }}>4,8 · 1.284 avaliações</a>
              <span style={{ width: 1, height: 16, background: "#E2E8F0" }}></span>
              <span style={{ font: "400 13.5px Inter", color: "#475569" }}>Cód. 8412-V12</span>
            </div>

            <div style={{ border: "1px solid #E2E8F0", borderRadius: 16, padding: 24, boxShadow: "0 4px 20px rgba(1,39,70,.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                {precoDe && <span style={{ font: "400 15px Inter", color: "#64748B", textDecoration: "line-through" }}>{precoDe}</span>}
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
                <span style={{ font: "800 46px Montserrat", color: "#F05A00", lineHeight: 1 }}>{precoPor}</span>
              </div>
              {parcela && <div style={{ font: "500 15px Inter", color: "#1E293B", margin: "8px 0 20px" }}>ou <strong style={{ font: "700 15px Montserrat", color: "#012746" }}>{parcela}</strong> sem juros no cartão</div>}

              <a {...buyProps} className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, height: 56, borderRadius: 8, background: "#F05A00", color: "#fff", font: "700 17px Montserrat", letterSpacing: ".04em", boxShadow: "0 8px 24px rgba(240,90,0,.3)" }}>
                COMPRAR AGORA
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h13M13 6.5l5.5 5.5L13 17.5"></path></svg>
              </a>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, margin: "12px 0 18px", font: "400 12.5px Inter", color: "#475569", textAlign: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#012746" strokeWidth="2" strokeLinecap="round"><path d="M12 3.5l7 2.6v5.4c0 4.3-2.9 7.3-7 9-4.1-1.7-7-4.7-7-9V6.1l7-2.6z"></path></svg>
                Você finaliza a compra no site oficial da loja parceira
              </div>
              <a href="#comparar" className="btn-outline-navy" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 48, borderRadius: 8, border: "1.5px solid #012746", color: "#012746", font: "600 14.5px Montserrat" }}>COMPARAR COM OUTROS MODELOS</a>

              <div style={{ height: 1, background: "#E2E8F0", margin: "22px 0" }}></div>
              <div style={{ display: "grid", gap: 14 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#012746" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 1 }}><path d="M3 7.5h11v9H3zM14 10.5h4l3 3v3h-7z"></path><circle cx="7" cy="17.4" r="1.6"></circle><circle cx="17.5" cy="17.4" r="1.6"></circle></svg>
                  <span style={{ font: "400 13.5px/1.5 Inter", color: "#475569" }}><strong style={{ font: "600 13.5px Inter", color: "#012746" }}>Frete grátis</strong> para todo o Brasil. Receba entre <strong>8 e 10 de setembro</strong>.</span>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#012746" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 1 }}><path d="M12 3.5l2.6 1.9 3.2-.2.9 3.1 2.3 2.2-1.6 2.8.4 3.2-3.1 1-2 2.5-3-1.2-3 1.2-2-2.5-3.1-1 .4-3.2L2 10.5l2.3-2.2.9-3.1 3.2.2z"></path></svg>
                  <span style={{ font: "400 13.5px/1.5 Inter", color: "#475569" }}><strong style={{ font: "600 13.5px Inter", color: "#012746" }}>12 meses de garantia</strong> do fabricante, com nota fiscal.</span>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#012746" strokeWidth="2" strokeLinecap="round" style={{ flex: "none", marginTop: 1 }}><path d="M12 4v8l5 3"></path><circle cx="12" cy="12" r="8.5"></circle></svg>
                  <span style={{ font: "400 13.5px/1.5 Inter", color: "#475569" }}><strong style={{ font: "600 13.5px Inter", color: "#012746" }}>30 dias</strong> para trocar ou devolver sem custo.</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16, border: "1px solid #FFD9C2", background: "#FFF7F2", borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                <span style={{ font: "700 13.5px Montserrat", color: "#012746" }}>Últimas unidades neste preço</span>
                <span style={{ font: "600 13px Inter", color: "#F05A00" }}>{restante} de 40</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: "#FFE2D0", overflow: "hidden" }}>
                <div style={{ height: "100%", width: barra, background: "linear-gradient(90deg,#F05A00,#FF7A00)", borderRadius: 4 }}></div>
              </div>
            </div>
          </div>
        </div>

        <section style={{ marginTop: 72, display: "grid", gridTemplateColumns: "minmax(0,1.15fr) minmax(320px,.85fr)", gap: 48, alignItems: "start" }}>
          <div>
            <h2 style={{ margin: "0 0 16px", font: "700 28px Montserrat", color: "#012746" }}>Mais potência, menos trabalho</h2>
            {descricao ? (
              <p style={{ margin: "0 0 24px", font: "400 16px/1.65 Inter", color: "#475569" }}>{descricao}</p>
            ) : (
              <>
                <p style={{ margin: "0 0 14px", font: "400 16px/1.65 Inter", color: "#475569" }}>O Vertax V12 foi feito para a limpeza do dia a dia em casas e apartamentos brasileiros. O motor de 450W com tecnologia ciclônica mantém a sucção constante mesmo com o reservatório cheio, e a escova antiemaranhado dá conta de pelos de animais em tapetes e sofás.</p>
                <p style={{ margin: "0 0 24px", font: "400 16px/1.65 Inter", color: "#475569" }}>A bateria de 2.500 mAh entrega até 45 minutos no modo padrão, o suficiente para limpar dois quartos e uma sala sem recarregar. Sem fio, sem saco e com filtro HEPA lavável, ele reduz a poeira que volta para o ar.</p>
              </>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 16 }}>
              {destaques.map((d, i) => (
                <div key={i} style={{ padding: 18, border: "1px solid #E2E8F0", borderRadius: 12, background: "#F8FAFC" }}>
                  <div style={{ font: "800 26px Montserrat", color: "#012746", lineHeight: 1, marginBottom: 6 }}>{d.v}</div>
                  <div style={{ font: "400 13px/1.45 Inter", color: "#475569" }}>{d.l}</div>
                </div>
              ))}
            </div>

            {specsExibidas.length > 0 && (
              <>
                <h3 style={{ margin: "40px 0 16px", font: "700 24px Montserrat", color: "#012746" }}>Especificações técnicas</h3>
                <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
                  {specsExibidas.map((s, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(0,.9fr) minmax(0,1.1fr)", gap: 16, padding: "13px 18px", borderBottom: "1px solid #F1F5F9" }}>
                      <span style={{ font: "500 13.5px Inter", color: "#475569" }}>{s.k}</span>
                      <span style={{ font: "600 13.5px Inter", color: "#1E293B" }}>{s.v}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {(indicadoExibido.length > 0 || naoIndicadoExibido.length > 0) && (
              <>
                <h3 style={{ margin: "40px 0 16px", font: "700 24px Montserrat", color: "#012746" }}>Este modelo é para você?</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
                  {indicadoExibido.length > 0 && (
                    <div style={{ padding: 20, border: "1px solid #E2E8F0", borderRadius: 12 }}>
                      <div style={{ font: "700 14px Montserrat", color: "#012746", letterSpacing: ".04em", marginBottom: 12 }}>INDICADO PARA</div>
                      <div style={{ display: "grid", gap: 10 }}>
                        {indicadoExibido.map((i2, i) => (
                          <span key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", font: "400 14px/1.5 Inter", color: "#475569" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F05A00" strokeWidth="2.6" strokeLinecap="round" style={{ flex: "none", marginTop: 3 }}><path d="M4.5 12.5l4.5 4.5L19.5 6.5"></path></svg>
                            {i2}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {naoIndicadoExibido.length > 0 && (
                    <div style={{ padding: 20, border: "1px solid #E2E8F0", borderRadius: 12, background: "#F8FAFC" }}>
                      <div style={{ font: "700 14px Montserrat", color: "#012746", letterSpacing: ".04em", marginBottom: 12 }}>TALVEZ NÃO SEJA</div>
                      <div style={{ display: "grid", gap: 10 }}>
                        {naoIndicadoExibido.map((i2, i) => (
                          <span key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", font: "400 14px/1.5 Inter", color: "#475569" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.6" strokeLinecap="round" style={{ flex: "none", marginTop: 3 }}><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"></path></svg>
                            {i2}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <aside style={{ position: "sticky", top: 24, display: "grid", gap: 16 }}>
            <div style={{ background: "linear-gradient(160deg,#012746,#001B31)", borderRadius: 16, padding: 24, color: "#fff" }}>
              <div style={{ font: "700 11px Montserrat", letterSpacing: ".12em", color: "#F05A00", marginBottom: 10 }}>RESUMO DA OFERTA</div>
              <div style={{ font: "800 24px/1.25 Montserrat", marginBottom: 16 }}>{precoPor}</div>
              <div style={{ display: "grid", gap: 9, marginBottom: 20 }}>
                {resumo.map((r, i) => (
                  <span key={i} style={{ display: "flex", justifyContent: "space-between", gap: 12, font: "400 13.5px Inter", color: "#B8C5D0" }}>
                    <span>{r.k}</span><strong style={{ font: "600 13.5px Inter", color: "#fff" }}>{r.v}</strong>
                  </span>
                ))}
              </div>
              <a {...buyProps} className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 50, borderRadius: 8, background: "#F05A00", color: "#fff", font: "700 15px Montserrat", letterSpacing: ".04em" }}>IR PARA A OFERTA</a>
            </div>
            <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
              <div style={{ font: "700 14px Montserrat", color: "#012746", marginBottom: 12 }}>Dúvida na escolha?</div>
              <p style={{ margin: "0 0 14px", font: "400 13.5px/1.6 Inter", color: "#475569" }}>Nosso time é especialista em aspiradores e responde em minutos, de segunda a sábado.</p>
              <a href="#whatsapp" className="btn-outline-navy" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 46, borderRadius: 8, border: "1.5px solid #012746", color: "#012746", font: "600 14px Montserrat" }}>FALAR COM ESPECIALISTA</a>
            </div>
          </aside>
        </section>

        <section id="avaliacoes" style={{ marginTop: 72 }}>
          <h2 style={{ margin: "0 0 24px", font: "700 28px Montserrat", color: "#012746" }}>Avaliações de quem comprou</h2>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(260px,.55fr) minmax(0,1.45fr)", gap: 40, alignItems: "start" }}>
            <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 24, background: "#F8FAFC" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <span style={{ font: "800 48px Montserrat", color: "#012746", lineHeight: 1 }}>4,8</span>
                <span>
                  <span style={{ display: "block", font: "600 15px Inter", color: "#F05A00", letterSpacing: ".1em" }}>★★★★★</span>
                  <span style={{ display: "block", font: "400 13px Inter", color: "#475569", marginTop: 4 }}>1.284 avaliações</span>
                </span>
              </div>
              <div style={{ display: "grid", gap: 9 }}>
                {distribuicao.map((d, i) => (
                  <span key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ font: "500 12.5px Inter", color: "#475569", width: 26 }}>{d.n}★</span>
                    <span style={{ flex: 1, height: 7, borderRadius: 4, background: "#E2E8F0", overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: d.w, background: "#F05A00", borderRadius: 4 }}></span></span>
                    <span style={{ font: "400 12px Inter", color: "#94A3B8", width: 34, textAlign: "right" }}>{d.p}</span>
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gap: 16 }}>
              {reviews.map((r, i) => (
                <div key={i} style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
                    <span style={{ font: "700 14.5px Montserrat", color: "#012746" }}>{r.nome}</span>
                    <span style={{ font: "600 13px Inter", color: "#F05A00", letterSpacing: ".08em" }}>{r.estrelas}</span>
                  </div>
                  <p style={{ margin: "0 0 10px", font: "400 14.5px/1.65 Inter", color: "#475569" }}>{r.texto}</p>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 7, font: "500 12px Inter", color: "#94A3B8" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.6" strokeLinecap="round"><path d="M4.5 12.5l4.5 4.5L19.5 6.5"></path></svg>
                    {r.meta}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ marginTop: 72, paddingBottom: 80 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 28 }}>
            <div>
              <h2 style={{ margin: "0 0 6px", font: "700 28px Montserrat", color: "#012746" }}>Quem viu este, também comprou</h2>
              <p style={{ margin: 0, font: "400 15.5px Inter", color: "#475569" }}>Modelos da mesma faixa de preço com boa avaliação.</p>
            </div>
            <Link to="/" className="btn-outline-navy" style={{ display: "inline-flex", alignItems: "center", height: 46, padding: "0 22px", borderRadius: 8, border: "1.5px solid #012746", color: "#012746", font: "600 14px Montserrat" }}>VER TODAS AS OFERTAS</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(238px,1fr))", gap: 24 }}>
            {relacionados.map((p, i) => (
              <Link key={i} to="/categoria" className="product-card" style={{ display: "flex", flexDirection: "column", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ position: "relative", padding: "16px 16px 0" }}>
                  {p.desconto && <span style={{ position: "absolute", top: 16, left: 16, zIndex: 2, background: "#F05A00", color: "#fff", font: "800 12px Montserrat", padding: "5px 9px", borderRadius: 4 }}>{p.desconto}</span>}
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
                    <div style={{ font: "800 25px Montserrat", color: "#F05A00", lineHeight: 1.15 }}>{p.por}</div>
                    <div style={{ font: "400 12.5px Inter", color: "#475569", marginBottom: 14 }}>{p.parcela}</div>
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 44, borderRadius: 8, background: "#F05A00", color: "#fff", font: "700 13.5px Montserrat", letterSpacing: ".06em" }}>COMPRAR</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <div style={{ position: "sticky", bottom: 0, zIndex: 40, background: "#fff", borderTop: "1px solid #E2E8F0", boxShadow: "0 -6px 24px rgba(1,39,70,.1)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "12px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
            {product?.image_url ? (
              <img src={product.image_url} alt={nome} style={{ flex: "none", width: 52, height: 52, borderRadius: 8, border: "1px solid #E2E8F0", objectFit: "contain", background: "#fff" }} />
            ) : (
              <div style={{ flex: "none", width: 52, height: 52, borderRadius: 8, border: "1px solid #E2E8F0", background: "repeating-linear-gradient(135deg,#F8FAFC 0 7px,#F1F5F9 7px 14px)" }}></div>
            )}
            <div style={{ minWidth: 0 }}>
              <div style={{ font: "600 13.5px Inter", color: "#1E293B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 340 }}>{nome}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ font: "800 20px Montserrat", color: "#F05A00" }}>{precoPor}</span>
                {parcela && <span style={{ font: "400 12.5px Inter", color: "#475569" }}>{parcela}</span>}
              </div>
            </div>
          </div>
          <a {...buyProps} className="btn-primary" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, height: 50, padding: "0 34px", borderRadius: 8, background: "#F05A00", color: "#fff", font: "700 15px Montserrat", letterSpacing: ".04em" }}>
            COMPRAR AGORA
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h13M13 6.5l5.5 5.5L13 17.5"></path></svg>
          </a>
        </div>
      </div>

      <FooterCompact payment={pagamentos} />
    </>
  );
}
