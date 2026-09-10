import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import { FooterFull } from "../components/Footer.jsx";
import FaqAccordion from "../components/FaqAccordion.jsx";
import { categoriasCol, institucionalCol } from "../data/footerColumns.js";
import { useCategories } from "../lib/categories.js";

const canais = [
  { t: "E-mail", v: "contato@promoaspiradores.com.br", s: "Nosso canal principal. Para dúvidas sobre pedidos, garantia e notas fiscais.", href: "#email", d: "M3.5 6.5h17v11h-17zM3.5 7l8.5 6 8.5-6" },
  { t: "Central de ajuda", v: "Perguntas frequentes", s: "Prazos, formas de pagamento, trocas e devoluções.", href: "#faq", d: "M12 20.5a8.5 8.5 0 100-17 8.5 8.5 0 000 17zM9.6 9.4A2.5 2.5 0 0114.4 10c0 1.7-2.4 1.9-2.4 3.6M12 16.6v.1" },
  { t: "Parcerias", v: "parceiros@promoaspiradores.com.br", s: "Marcas, lojistas e criadores de conteúdo interessados em parceria.", href: "#parcerias", d: "M8 12.5l3 3 5.5-5.5M4.5 6.5h15v11h-15z" }
];

const horarios = [
  { d: "Segunda a sexta", h: "8h às 20h" },
  { d: "Sábado", h: "9h às 16h" },
  { d: "Domingo e feriados", h: "Fechado" }
];

const empresa = [
  { k: "RESPONSÁVEL", v: "Caio Cézares de Souza Spessoto" },
  { k: "CPF", v: "364.609.548-28" },
  { k: "LOCALIZAÇÃO", v: "Bragança Paulista/SP - Brasil" },
  { k: "ENCARREGADO DE DADOS (DPO)", v: "contato@promoaspiradores.com.br" }
];

const faq = [
  { q: "Vocês vendem direto pelo site?", a: "A finalização da compra acontece no site da loja parceira. Fazemos a curadoria dos modelos, comparamos preços e direcionamos você para a oferta, com link de afiliado." },
  { q: "Quanto tempo leva para responder?", a: "Por e-mail e formulário, até um dia útil dentro do horário comercial." },
  { q: "Quem cuida da entrega e da garantia?", a: "A entrega e a garantia são da loja onde a compra foi finalizada. Mesmo assim, nosso atendimento acompanha o caso com você até a resolução." },
  { q: "Como pedir a nota fiscal?", a: "A nota é emitida pela loja parceira e enviada por e-mail após a confirmação do pagamento. Se não chegou, fale com a gente com o número do pedido." },
  { q: "Como solicitar a exclusão dos meus dados?", a: "Escreva para contato@promoaspiradores.com.br. Confirmamos a identidade e atendemos o pedido em até 15 dias, conforme a LGPD." }
];

export default function Contato() {
  const [enviado, setEnviado] = useState(false);
  const { categories } = useCategories();

  useEffect(() => {
    document.title = "Fale com a gente — Promo Aspiradores";
  }, []);

  const enviar = (e) => { e.preventDefault(); setEnviado(true); };

  return (
    <>
      <Header
        categoriesNav={{ menu: categories.map(c => c.name), showAllCategories: false, itemTo: "/categoria", ofertaTo: "/categoria" }}
      />

      <div style={{ borderBottom: "1px solid #F1F5F9", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "11px 24px", display: "flex", gap: 8, alignItems: "center", font: "400 13px Inter", color: "#475569" }}>
          <Link to="/">Home</Link><span style={{ color: "#94A3B8" }}>/</span><span style={{ color: "#012746", fontWeight: 500 }}>Contato</span>
        </div>
      </div>

      <section style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 24px 32px" }}>
          <h1 style={{ margin: "0 0 10px", font: "800 30px/1.15 Montserrat", color: "#012746", letterSpacing: "-.02em" }}>Fale com a gente</h1>
          <p style={{ margin: 0, maxWidth: 600, font: "400 15px/1.65 Inter", color: "#475569" }}>Nosso time conhece aspirador de verdade e ajuda você a escolher antes de comprar. Escolha o canal que preferir.</p>
        </div>
      </section>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20, marginBottom: 44 }}>
          {canais.map((c, i) => (
            <a key={i} href={c.href} className="card-hover" style={{ display: "flex", flexDirection: "column", gap: 12, padding: 24, border: "1px solid #E2E8F0", borderRadius: 12, background: "#fff" }}>
              <span style={{ width: 44, height: 44, borderRadius: 8, background: "#FFF1E8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#F05A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={c.d}></path></svg>
              </span>
              <span style={{ font: "700 16px Montserrat", color: "#012746" }}>{c.t}</span>
              <span style={{ font: "600 15px Inter", color: "#F05A00" }}>{c.v}</span>
              <span style={{ font: "400 13px/1.55 Inter", color: "#475569" }}>{c.s}</span>
            </a>
          ))}
        </div>

        <div className="stack-mobile" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(300px,.9fr)", gap: 48, alignItems: "start" }}>
          <div>
            <h2 style={{ margin: "0 0 8px", font: "700 22px Montserrat", color: "#012746", letterSpacing: "-.01em" }}>Envie sua mensagem</h2>
            <p style={{ margin: "0 0 22px", font: "400 14px Inter", color: "#475569" }}>Responda em até um dia útil. Campos marcados com * são obrigatórios.</p>

            {enviado && (
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: 20, border: "1px solid #FFD9C2", background: "#FFF7F2", borderRadius: 12, marginBottom: 24 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F05A00" strokeWidth="2.4" strokeLinecap="round" style={{ flex: "none", marginTop: 1 }}><path d="M4.5 12.5l4.5 4.5L19.5 6.5"></path></svg>
                <span>
                  <strong style={{ display: "block", font: "700 15px Montserrat", color: "#012746", marginBottom: 4 }}>Mensagem enviada</strong>
                  <span style={{ font: "400 14px/1.6 Inter", color: "#475569" }}>Recebemos seu contato e vamos responder no e-mail informado em até um dia útil.</span>
                </span>
              </div>
            )}

            <form onSubmit={enviar} style={{ display: "grid", gap: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18 }}>
                <label style={{ display: "grid", gap: 7 }}>
                  <span style={{ font: "600 13px Inter", color: "#012746", letterSpacing: ".02em" }}>Nome completo *</span>
                  <input placeholder="Como podemos te chamar?" className="input-field" style={{ height: 44, padding: "0 14px", border: "1.5px solid #E2E8F0", borderRadius: 8, background: "#fff", font: "400 14px Inter", color: "#1E293B", outline: "none" }} />
                </label>
                <label style={{ display: "grid", gap: 7 }}>
                  <span style={{ font: "600 13px Inter", color: "#012746", letterSpacing: ".02em" }}>E-mail *</span>
                  <input type="email" placeholder="seu@email.com.br" className="input-field" style={{ height: 44, padding: "0 14px", border: "1.5px solid #E2E8F0", borderRadius: 8, background: "#fff", font: "400 14px Inter", color: "#1E293B", outline: "none" }} />
                </label>
                <label style={{ display: "grid", gap: 7 }}>
                  <span style={{ font: "600 13px Inter", color: "#012746", letterSpacing: ".02em" }}>Assunto *</span>
                  <select className="input-field" style={{ height: 44, padding: "0 14px", border: "1.5px solid #E2E8F0", borderRadius: 8, background: "#fff", font: "400 14px Inter", color: "#1E293B", outline: "none", cursor: "pointer" }}>
                    <option>Ajuda para escolher um aspirador</option>
                    <option>Dúvida sobre um pedido</option>
                    <option>Prazo de entrega e frete</option>
                    <option>Troca, devolução ou garantia</option>
                    <option>Parceria e afiliados</option>
                    <option>Privacidade e meus dados</option>
                    <option>Outro assunto</option>
                  </select>
                </label>
              </div>
              <label style={{ display: "grid", gap: 7 }}>
                <span style={{ font: "600 13px Inter", color: "#012746", letterSpacing: ".02em" }}>Mensagem *</span>
                <textarea rows="6" placeholder="Conte o tamanho da sua casa, tipo de piso e se tem animais. Assim conseguimos indicar o modelo certo." className="input-field" style={{ padding: "14px 16px", border: "1.5px solid #E2E8F0", borderRadius: 8, background: "#fff", font: "400 15px/1.6 Inter", color: "#1E293B", outline: "none", resize: "vertical" }}></textarea>
              </label>
              <label style={{ display: "flex", gap: 11, alignItems: "flex-start", cursor: "pointer" }}>
                <input type="checkbox" style={{ width: 17, height: 17, accentColor: "#F05A00", cursor: "pointer", flex: "none", marginTop: 2 }} />
                <span style={{ font: "400 13.5px/1.6 Inter", color: "#475569" }}>Concordo com o tratamento dos meus dados para responder este contato, conforme a <Link to="/politica-de-privacidade" style={{ color: "#F05A00", textDecoration: "underline" }}>Política de Privacidade</Link>.</span>
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
                <button className="btn-primary" style={{ height: 46, padding: "0 28px", border: 0, borderRadius: 8, background: "#F05A00", color: "#fff", font: "700 14px Montserrat", letterSpacing: ".04em", cursor: "pointer", boxShadow: "0 8px 24px rgba(240,90,0,.28)" }}>ENVIAR MENSAGEM</button>
                <span style={{ font: "400 13px Inter", color: "#94A3B8" }}>Não enviamos spam e não compartilhamos seus dados.</span>
              </div>
            </form>
          </div>

          <aside style={{ display: "grid", gap: 16 }}>
            <div style={{ background: "linear-gradient(160deg,#012746,#001B31)", borderRadius: 16, padding: 24, color: "#fff" }}>
              <div style={{ font: "700 11px Montserrat", letterSpacing: ".12em", color: "#F05A00", marginBottom: 14 }}>HORÁRIO DE ATENDIMENTO</div>
              <div style={{ display: "grid", gap: 11 }}>
                {horarios.map((h, i) => (
                  <span key={i} style={{ display: "flex", justifyContent: "space-between", gap: 16, font: "400 14px Inter", color: "#B8C5D0" }}>
                    <span>{h.d}</span><strong style={{ font: "600 14px Inter", color: "#fff" }}>{h.h}</strong>
                  </span>
                ))}
              </div>
              <div style={{ height: 1, background: "#1E3A4D", margin: "18px 0" }}></div>
              <p style={{ margin: 0, font: "400 13.5px/1.6 Inter", color: "#B8C5D0" }}>Somos uma loja online. Não temos loja física para visitação, mas o atendimento humano funciona em todos os canais acima.</p>
            </div>
            <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 22 }}>
              <div style={{ font: "700 15px Montserrat", color: "#012746", marginBottom: 14 }}>Dados da empresa</div>
              <div style={{ display: "grid", gap: 12 }}>
                {empresa.map((e, i) => (
                  <span key={i}>
                    <span style={{ display: "block", font: "600 11.5px Inter", letterSpacing: ".1em", color: "#94A3B8", marginBottom: 3 }}>{e.k}</span>
                    <span style={{ display: "block", font: "400 14px/1.5 Inter", color: "#1E293B" }}>{e.v}</span>
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <section style={{ marginTop: 56, paddingBottom: 64 }}>
          <div className="stack-mobile" style={{ display: "grid", gridTemplateColumns: "minmax(0,.7fr) minmax(0,1.3fr)", gap: 40 }}>
            <div>
              <h2 style={{ margin: "0 0 8px", font: "700 22px Montserrat", color: "#012746", letterSpacing: "-.01em" }}>Antes de enviar, veja se já respondemos</h2>
              <p style={{ margin: 0, font: "400 14px/1.65 Inter", color: "#475569" }}>As dúvidas mais comuns do atendimento estão aqui.</p>
            </div>
            <FaqAccordion faq={faq} />
          </div>
        </section>
      </main>

      <FooterFull columns={[categoriasCol, institucionalCol]} />
    </>
  );
}
