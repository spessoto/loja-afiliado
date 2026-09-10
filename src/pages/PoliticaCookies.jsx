import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PolicyLayout from "../components/PolicyLayout.jsx";

const toc = [
  { href: "#c1", label: "1. O que são cookies" },
  { href: "#c2", label: "2. Suas preferências" },
  { href: "#c3", label: "3. Categorias que usamos" },
  { href: "#c4", label: "4. Cookies em detalhe" },
  { href: "#c5", label: "5. Cookies de afiliado" },
  { href: "#c6", label: "6. Gerenciar no navegador" },
  { href: "#c7", label: "7. Dados e LGPD" },
  { href: "#c8", label: "8. Contato" }
];

const tabela = [
  { n: "pa_session", f: "Mantém a sessão e a segurança da navegação", p: "Sessão" },
  { n: "pa_consent", f: "Guarda suas preferências de cookies", p: "6 meses" },
  { n: "pa_filtros", f: "Lembra os filtros aplicados na categoria", p: "30 dias" },
  { n: "_ga / _ga_*", f: "Medição de audiência (Google Analytics)", p: "13 meses" },
  { n: "pa_click_id", f: "Identifica o clique que originou a visita à loja parceira", p: "30 dias" },
  { n: "_fbp", f: "Medição de campanhas em redes sociais", p: "3 meses" }
];

const navegadores = ["Google Chrome", "Safari", "Microsoft Edge", "Mozilla Firefox", "Samsung Internet"];

const h2 = { margin: "0 0 14px", font: "700 24px Montserrat", color: "#012746" };
const p = { margin: 0, font: "400 16px/1.75 Inter", color: "#475569" };

export default function PoliticaCookies() {
  const [desempenho, setDesempenho] = useState(true);
  const [funcionais, setFuncionais] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [banner, setBanner] = useState(true);

  useEffect(() => {
    document.title = "Política de Cookies e Dados — Promo Aspiradores";
  }, []);

  const linha = (state, setState, t, s, fixo) => {
    const on = fixo ? true : state;
    return {
      t, s, fixo: !!fixo, on,
      bg: on ? "#F05A00" : "#CBD5E1",
      dot: on ? 25 : 3,
      cursor: fixo ? "not-allowed" : "pointer",
      toggle: fixo ? (e) => e.preventDefault() : () => { setState((v) => !v); setSalvo(true); }
    };
  };

  const prefs = [
    linha(true, () => {}, "Essenciais", "Segurança, funcionamento do site e memória das suas preferências de cookies.", true),
    linha(desempenho, setDesempenho, "Desempenho e audiência", "Medição agregada de páginas visitadas, tempo de leitura e erros de navegação."),
    linha(funcionais, setFuncionais, "Funcionais", "Lembram filtros aplicados, favoritos e a última categoria que você visitou."),
    linha(marketing, setMarketing, "Marketing e afiliados", "Atribuição de compras aos nossos links e exibição de ofertas mais relevantes.")
  ];

  const aceitarTodos = () => { setDesempenho(true); setFuncionais(true); setMarketing(true); setSalvo(true); setBanner(false); };
  const recusar = () => { setDesempenho(false); setFuncionais(false); setMarketing(false); setSalvo(true); setBanner(false); };

  return (
    <PolicyLayout
      title="Política de Cookies e Dados"
      description="Quais cookies usamos, para que servem e como você pode aceitar, recusar ou mudar de opinião quando quiser."
      breadcrumbLabel="Política de Cookies e Dados"
      toc={toc}
      sidebarExtra={
        <div style={{ display: "grid", gap: 8 }}>
          <Link to="/politica-de-privacidade" style={{ font: "600 13.5px Inter", color: "#F05A00" }}>Política de Privacidade →</Link>
          <Link to="/politica-de-uso" style={{ font: "600 13.5px Inter", color: "#F05A00" }}>Política de Uso →</Link>
        </div>
      }
    >
      <div style={{ padding: "20px 24px", borderLeft: "3px solid #F05A00", background: "#FFF7F2", borderRadius: "0 12px 12px 0", marginBottom: 40 }}>
        <strong style={{ display: "block", font: "700 15px Montserrat", color: "#012746", marginBottom: 8 }}>Resumo</strong>
        <span style={{ font: "400 15px/1.7 Inter", color: "#475569" }}>Só os cookies essenciais funcionam sem a sua autorização. Os de audiência e de marketing dependem do seu aceite e podem ser desligados a qualquer momento no painel abaixo.</span>
      </div>

      <section id="c1" style={{ marginBottom: 36 }}>
        <h2 style={h2}>1. O que são cookies</h2>
        <p style={p}>Cookies são pequenos arquivos gravados no seu navegador quando você visita um site. Eles guardam informações como as páginas que você viu, suas preferências e a origem do seu acesso. Usamos também tecnologias equivalentes, como armazenamento local e pixels de medição.</p>
      </section>

      <section id="c2" style={{ marginBottom: 36 }}>
        <h2 style={{ margin: "0 0 8px", font: "700 24px Montserrat", color: "#012746" }}>2. Suas preferências</h2>
        <p style={{ margin: "0 0 20px", font: "400 16px/1.75 Inter", color: "#475569" }}>Ajuste abaixo o que você autoriza. A escolha é registrada por 6 meses.</p>
        <div style={{ border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(1,39,70,.06)" }}>
          {prefs.map((pr, i) => (
            <div key={i} style={{ display: "flex", gap: 20, alignItems: "flex-start", justifyContent: "space-between", padding: "20px 22px", borderBottom: "1px solid #F1F5F9" }}>
              <span style={{ flex: 1 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <strong style={{ font: "700 15.5px Montserrat", color: "#012746" }}>{pr.t}</strong>
                  {pr.fixo && <span style={{ background: "#F1F5F9", color: "#475569", font: "600 10px Inter", letterSpacing: ".08em", padding: "3px 8px", borderRadius: 4 }}>SEMPRE ATIVO</span>}
                </span>
                <span style={{ display: "block", font: "400 14px/1.65 Inter", color: "#475569" }}>{pr.s}</span>
              </span>
              <button onClick={pr.toggle} disabled={pr.fixo} style={{ flex: "none", width: 52, height: 30, borderRadius: 16, border: 0, background: pr.bg, position: "relative", cursor: pr.cursor, transition: "background .18s" }}>
                <span style={{ position: "absolute", top: 3, left: pr.dot, width: 24, height: 24, borderRadius: "50%", background: "#fff", boxShadow: "0 2px 6px rgba(1,39,70,.25)", transition: "left .18s" }}></span>
              </button>
            </div>
          ))}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", padding: "20px 22px", background: "#F8FAFC" }}>
            <button onClick={aceitarTodos} className="btn-primary" style={{ height: 48, padding: "0 26px", border: 0, borderRadius: 8, background: "#F05A00", color: "#fff", font: "700 14px Montserrat", letterSpacing: ".04em", cursor: "pointer" }}>ACEITAR TODOS</button>
            <button onClick={recusar} className="btn-outline-navy" style={{ height: 48, padding: "0 26px", border: "1.5px solid #012746", borderRadius: 8, background: "#fff", color: "#012746", font: "600 14px Montserrat", cursor: "pointer" }}>SÓ OS ESSENCIAIS</button>
            {salvo && (
              <span style={{ display: "flex", alignItems: "center", gap: 8, font: "600 13px Inter", color: "#012746" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F05A00" strokeWidth="2.6" strokeLinecap="round"><path d="M4.5 12.5l4.5 4.5L19.5 6.5"></path></svg>
                Preferências salvas
              </span>
            )}
          </div>
        </div>
      </section>

      <section id="c3" style={{ marginBottom: 36 }}>
        <h2 style={{ ...h2, marginBottom: 16 }}>3. Categorias que usamos</h2>
        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ padding: 20, border: "1px solid #E2E8F0", borderRadius: 12 }}>
            <strong style={{ display: "block", font: "700 15.5px Montserrat", color: "#012746", marginBottom: 6 }}>Essenciais</strong>
            <span style={{ font: "400 15px/1.7 Inter", color: "#475569" }}>Fazem o site funcionar: segurança, balanceamento de carga e memória das suas escolhas de cookies. Não podem ser desativados.</span>
          </div>
          <div style={{ padding: 20, border: "1px solid #E2E8F0", borderRadius: 12 }}>
            <strong style={{ display: "block", font: "700 15.5px Montserrat", color: "#012746", marginBottom: 6 }}>Desempenho e audiência</strong>
            <span style={{ font: "400 15px/1.7 Inter", color: "#475569" }}>Medem páginas mais visitadas, tempo de leitura e erros de navegação, sempre de forma agregada. É como descobrimos quais conteúdos ajudam de verdade.</span>
          </div>
          <div style={{ padding: 20, border: "1px solid #E2E8F0", borderRadius: 12 }}>
            <strong style={{ display: "block", font: "700 15.5px Montserrat", color: "#012746", marginBottom: 6 }}>Funcionais</strong>
            <span style={{ font: "400 15px/1.7 Inter", color: "#475569" }}>Lembram preferências como filtros aplicados, produtos favoritados e última categoria visitada.</span>
          </div>
          <div style={{ padding: 20, border: "1px solid #E2E8F0", borderRadius: 12 }}>
            <strong style={{ display: "block", font: "700 15.5px Montserrat", color: "#012746", marginBottom: 6 }}>Marketing e afiliados</strong>
            <span style={{ font: "400 15px/1.7 Inter", color: "#475569" }}>Atribuem a compra ao nosso link e permitem exibir ofertas mais alinhadas ao que você pesquisou.</span>
          </div>
        </div>
      </section>

      <section id="c4" style={{ marginBottom: 36 }}>
        <h2 style={{ ...h2, marginBottom: 16 }}>4. Cookies em detalhe</h2>
        <div style={{ overflowX: "auto" }}>
          <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden", minWidth: 520 }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.5fr) minmax(0,.7fr)", gap: 14, padding: "13px 18px", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
              <span style={{ font: "700 12px Montserrat", letterSpacing: ".06em", color: "#012746" }}>NOME</span>
              <span style={{ font: "700 12px Montserrat", letterSpacing: ".06em", color: "#012746" }}>FINALIDADE</span>
              <span style={{ font: "700 12px Montserrat", letterSpacing: ".06em", color: "#012746" }}>PRAZO</span>
            </div>
            {tabela.map((c, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.5fr) minmax(0,.7fr)", gap: 14, padding: "13px 18px", borderBottom: "1px solid #F1F5F9" }}>
                <span style={{ font: "600 13px ui-monospace,SFMono-Regular,monospace", color: "#012746", wordBreak: "break-all" }}>{c.n}</span>
                <span style={{ font: "400 13.5px/1.5 Inter", color: "#475569" }}>{c.f}</span>
                <span style={{ font: "500 13px Inter", color: "#1E293B" }}>{c.p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="c5" style={{ marginBottom: 36 }}>
        <h2 style={h2}>5. Cookies de afiliado</h2>
        <p style={{ margin: "0 0 14px", font: "400 16px/1.75 Inter", color: "#475569" }}>Quando você clica em um botão de compra, a loja parceira grava um cookie que registra que a visita veio da Promo Aspiradores. Esse registro dura entre 24 horas e 30 dias, conforme a regra de cada parceiro, e é o que garante o repasse da comissão.</p>
        <p style={p}>Esse cookie é de responsabilidade da loja e não nos dá acesso ao seu carrinho, aos seus dados de pagamento ou ao conteúdo do pedido. Se você recusar os cookies de marketing, os links continuam funcionando normalmente.</p>
      </section>

      <section id="c6" style={{ marginBottom: 36 }}>
        <h2 style={h2}>6. Gerenciar no navegador</h2>
        <p style={{ margin: "0 0 16px", font: "400 16px/1.75 Inter", color: "#475569" }}>Além do painel desta página, você pode bloquear ou apagar cookies nas configurações do seu navegador. Bloquear os essenciais pode afetar o funcionamento de partes do site.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {navegadores.map((n, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", height: 38, padding: "0 16px", border: "1px solid #E2E8F0", borderRadius: 24, background: "#F8FAFC", font: "500 13px Inter", color: "#012746" }}>{n}</span>
          ))}
        </div>
      </section>

      <section id="c7" style={{ marginBottom: 36 }}>
        <h2 style={h2}>7. Dados coletados e a LGPD</h2>
        <p style={p}>Os dados obtidos por cookies não essenciais são tratados com base no seu consentimento, que pode ser revogado a qualquer momento sem prejuízo à navegação. Os detalhes sobre finalidades, compartilhamento com operadores, prazos de guarda e seus direitos como titular estão na <Link to="/politica-de-privacidade" style={{ color: "#F05A00", textDecoration: "underline" }}>Política de Privacidade</Link>.</p>
      </section>

      <section id="c8">
        <h2 style={h2}>8. Contato</h2>
        <div style={{ padding: 24, border: "1px solid #E2E8F0", borderRadius: 12, background: "#F8FAFC" }}>
          <div style={{ display: "grid", gap: 14, marginBottom: 20 }}>
            <span>
              <span style={{ display: "block", font: "600 11.5px Inter", letterSpacing: ".1em", color: "#94A3B8", marginBottom: 3 }}>RESPONSÁVEL PELO TRATAMENTO DE DADOS</span>
              <span style={{ display: "block", font: "400 15px Inter", color: "#1E293B" }}>Caio Cézares de Souza Spessoto — CPF 364.609.548-28</span>
            </span>
            <span>
              <span style={{ display: "block", font: "600 11.5px Inter", letterSpacing: ".1em", color: "#94A3B8", marginBottom: 3 }}>E-MAIL DE CONTATO</span>
              <span style={{ display: "block", font: "400 15px Inter", color: "#1E293B" }}>contato@promoaspiradores.com.br</span>
            </span>
            <span>
              <span style={{ display: "block", font: "600 11.5px Inter", letterSpacing: ".1em", color: "#94A3B8", marginBottom: 3 }}>LOCALIZAÇÃO</span>
              <span style={{ display: "block", font: "400 15px Inter", color: "#1E293B" }}>Bragança Paulista/SP - Brasil</span>
            </span>
          </div>
          <Link to="/contato" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 48, padding: "0 28px", borderRadius: 8, background: "#F05A00", color: "#fff", font: "700 14.5px Montserrat", letterSpacing: ".04em" }}>ABRIR UMA SOLICITAÇÃO</Link>
        </div>
      </section>

      {banner && (
        <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 40, background: "#fff", borderTop: "1px solid #E2E8F0", boxShadow: "0 -6px 24px rgba(1,39,70,.12)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "18px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
            <p style={{ margin: 0, flex: 1, minWidth: 260, font: "400 14px/1.6 Inter", color: "#475569" }}>Usamos cookies para medir audiência e indicar as melhores ofertas de aspiradores. Você escolhe o que autorizar.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <button onClick={recusar} className="btn-outline-navy" style={{ height: 46, padding: "0 22px", border: "1.5px solid #012746", borderRadius: 8, background: "#fff", color: "#012746", font: "600 13.5px Montserrat", cursor: "pointer" }}>SÓ OS ESSENCIAIS</button>
              <button onClick={aceitarTodos} className="btn-primary" style={{ height: 46, padding: "0 26px", border: 0, borderRadius: 8, background: "#F05A00", color: "#fff", font: "700 13.5px Montserrat", letterSpacing: ".04em", cursor: "pointer" }}>ACEITAR TODOS</button>
            </div>
          </div>
        </div>
      )}
    </PolicyLayout>
  );
}
