import { useEffect } from "react";
import { Link } from "react-router-dom";
import PolicyLayout from "../components/PolicyLayout.jsx";

const toc = [
  { href: "#p1", label: "1. Quem somos" },
  { href: "#p2", label: "2. Dados que coletamos" },
  { href: "#p3", label: "3. Para que usamos" },
  { href: "#p4", label: "4. Bases legais" },
  { href: "#p5", label: "5. Links de afiliado" },
  { href: "#p6", label: "6. Compartilhamento" },
  { href: "#p7", label: "7. Prazo de guarda" },
  { href: "#p8", label: "8. Seus direitos" },
  { href: "#p9", label: "9. Segurança" },
  { href: "#p10", label: "10. Crianças e adolescentes" },
  { href: "#p11", label: "11. Alterações" },
  { href: "#p12", label: "12. Como falar com o DPO" }
];

const h2 = { margin: "0 0 14px", font: "700 24px Montserrat", color: "#012746" };
const p = { margin: 0, font: "400 16px/1.75 Inter", color: "#475569" };

export default function PoliticaPrivacidade() {
  useEffect(() => {
    document.title = "Política de Privacidade — Promo Aspiradores";
  }, []);

  return (
    <PolicyLayout
      title="Política de Privacidade"
      description="Como a Promo Aspiradores coleta, usa, guarda e protege os seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018)."
      breadcrumbLabel="Política de Privacidade"
      toc={toc}
      sidebarExtra={
        <>
          <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 20, background: "#F8FAFC" }}>
            <div style={{ font: "700 14px Montserrat", color: "#012746", marginBottom: 8 }}>Dúvida sobre seus dados?</div>
            <p style={{ margin: "0 0 14px", font: "400 13.5px/1.6 Inter", color: "#475569" }}>Fale direto com nosso encarregado de proteção de dados.</p>
            <Link to="/contato" className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 44, borderRadius: 8, background: "#012746", color: "#fff", font: "700 13.5px Montserrat", letterSpacing: ".04em" }}>FALAR COM O DPO</Link>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            <Link to="/politica-de-uso" style={{ font: "600 13.5px Inter", color: "#F05A00" }}>Política de Uso →</Link>
            <Link to="/politica-de-cookies" style={{ font: "600 13.5px Inter", color: "#F05A00" }}>Cookies e Dados →</Link>
          </div>
        </>
      }
    >
      <div style={{ padding: "20px 24px", borderLeft: "3px solid #F05A00", background: "#FFF7F2", borderRadius: "0 12px 12px 0", marginBottom: 40 }}>
        <strong style={{ display: "block", font: "700 15px Montserrat", color: "#012746", marginBottom: 8 }}>Resumo em uma frase</strong>
        <span style={{ font: "400 15px/1.7 Inter", color: "#475569" }}>Coletamos o mínimo necessário para recomendar aspiradores, responder seus contatos e entender quais ofertas geram interesse. Não vendemos seus dados e você pode pedir a exclusão a qualquer momento.</span>
      </div>

      <section id="p1" style={{ marginBottom: 36 }}>
        <h2 style={h2}>1. Quem somos</h2>
        <p style={{ margin: "0 0 14px", font: "400 16px/1.75 Inter", color: "#475569" }}>A Promo Aspiradores é uma loja online especializada em aspiradores de pó para uso doméstico e profissional. Fazemos a curadoria de modelos, comparamos preços e direcionamos o visitante para as ofertas de lojas parceiras por meio de links de afiliado.</p>
        <p style={p}>O controlador dos dados tratados neste site é a Promo Aspiradores Comércio Digital Ltda., CNPJ 00.000.000/0001-00, com sede em São Paulo/SP.</p>
      </section>

      <section id="p2" style={{ marginBottom: 36 }}>
        <h2 style={h2}>2. Dados que coletamos</h2>
        <p style={{ margin: "0 0 16px", font: "400 16px/1.75 Inter", color: "#475569" }}>Tratamos três grupos de dados, sempre limitados ao necessário para a finalidade descrita.</p>
        <div style={{ display: "grid", gap: 14, marginBottom: 16 }}>
          <div style={{ padding: 20, border: "1px solid #E2E8F0", borderRadius: 12 }}>
            <strong style={{ display: "block", font: "700 15.5px Montserrat", color: "#012746", marginBottom: 6 }}>Dados que você informa</strong>
            <span style={{ font: "400 15px/1.7 Inter", color: "#475569" }}>Nome, e-mail, telefone e o conteúdo da mensagem quando você usa o formulário de contato, pede ajuda para escolher um modelo ou se inscreve para receber ofertas.</span>
          </div>
          <div style={{ padding: 20, border: "1px solid #E2E8F0", borderRadius: 12 }}>
            <strong style={{ display: "block", font: "700 15.5px Montserrat", color: "#012746", marginBottom: 6 }}>Dados de navegação</strong>
            <span style={{ font: "400 15px/1.7 Inter", color: "#475569" }}>Endereço IP, tipo de dispositivo, navegador, sistema operacional, páginas visitadas, tempo de permanência, origem do acesso e cliques em produtos e ofertas.</span>
          </div>
          <div style={{ padding: 20, border: "1px solid #E2E8F0", borderRadius: 12 }}>
            <strong style={{ display: "block", font: "700 15.5px Montserrat", color: "#012746", marginBottom: 6 }}>Dados de cookies e identificadores</strong>
            <span style={{ font: "400 15px/1.7 Inter", color: "#475569" }}>Identificadores anônimos gravados no seu navegador para medir audiência, lembrar preferências e atribuir corretamente as compras feitas por meio dos nossos links. Detalhes na <Link to="/politica-de-cookies" style={{ color: "#F05A00", textDecoration: "underline" }}>Política de Cookies e Dados</Link>.</span>
          </div>
        </div>
        <p style={p}>Não coletamos dados de pagamento. Cartão, Pix e boleto são processados inteiramente pela loja parceira onde a compra é finalizada.</p>
      </section>

      <section id="p3" style={{ marginBottom: 36 }}>
        <h2 style={h2}>3. Para que usamos os dados</h2>
        <ul style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 11 }}>
          <li style={{ font: "400 16px/1.75 Inter", color: "#475569" }}>Responder suas mensagens e recomendar o aspirador adequado ao seu caso.</li>
          <li style={{ font: "400 16px/1.75 Inter", color: "#475569" }}>Operar e melhorar o site, corrigindo erros e ajustando a navegação.</li>
          <li style={{ font: "400 16px/1.75 Inter", color: "#475569" }}>Medir quais produtos e ofertas despertam mais interesse, de forma agregada.</li>
          <li style={{ font: "400 16px/1.75 Inter", color: "#475569" }}>Atribuir comissões de afiliado sobre compras originadas nos nossos links.</li>
          <li style={{ font: "400 16px/1.75 Inter", color: "#475569" }}>Enviar ofertas e conteúdos por e-mail ou WhatsApp, quando você autorizar.</li>
          <li style={{ font: "400 16px/1.75 Inter", color: "#475569" }}>Cumprir obrigações legais e prevenir fraudes e usos abusivos.</li>
        </ul>
      </section>

      <section id="p4" style={{ marginBottom: 36 }}>
        <h2 style={h2}>4. Bases legais</h2>
        <p style={{ margin: "0 0 14px", font: "400 16px/1.75 Inter", color: "#475569" }}>Cada tratamento se apoia em uma base legal prevista no art. 7º da LGPD: o consentimento, para cookies não essenciais e comunicações de marketing; a execução de contrato ou procedimento preliminar, para atender solicitações que você nos envia; o legítimo interesse, para segurança, medição de audiência e melhoria do serviço; e o cumprimento de obrigação legal ou regulatória, quando aplicável.</p>
        <p style={p}>Quando o tratamento se apoiar em legítimo interesse, avaliamos previamente se ele é proporcional e se não prejudica seus direitos e liberdades fundamentais.</p>
      </section>

      <section id="p5" style={{ marginBottom: 36 }}>
        <h2 style={h2}>5. Links de afiliado</h2>
        <p style={{ margin: "0 0 14px", font: "400 16px/1.75 Inter", color: "#475569" }}>Os botões de compra deste site levam a lojas parceiras. Quando você clica, um identificador é adicionado ao link para que a loja reconheça que a visita veio da Promo Aspiradores. Se a compra acontecer, recebemos uma comissão sem custo adicional para você.</p>
        <p style={p}>A partir do momento em que você entra no site da loja parceira, passam a valer a política de privacidade e os termos daquela loja. Não temos acesso ao seu carrinho, aos seus dados de pagamento nem ao conteúdo do seu pedido.</p>
      </section>

      <section id="p6" style={{ marginBottom: 36 }}>
        <h2 style={h2}>6. Com quem compartilhamos</h2>
        <p style={{ margin: "0 0 14px", font: "400 16px/1.75 Inter", color: "#475569" }}>Não vendemos dados pessoais. Compartilhamos apenas o necessário com operadores que sustentam a operação do site: hospedagem e infraestrutura em nuvem, ferramentas de análise de audiência, plataformas de e-mail marketing, redes de afiliados e serviços de atendimento.</p>
        <p style={p}>Alguns desses fornecedores estão fora do Brasil. Nesses casos, a transferência internacional segue as garantias previstas nos arts. 33 a 36 da LGPD, com cláusulas contratuais de proteção de dados.</p>
      </section>

      <section id="p7" style={{ marginBottom: 36 }}>
        <h2 style={h2}>7. Por quanto tempo guardamos</h2>
        <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 16, padding: "13px 18px", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
            <span style={{ font: "700 12.5px Montserrat", letterSpacing: ".06em", color: "#012746" }}>DADO</span>
            <span style={{ font: "700 12.5px Montserrat", letterSpacing: ".06em", color: "#012746" }}>PRAZO</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 16, padding: "13px 18px", borderBottom: "1px solid #F1F5F9" }}>
            <span style={{ font: "500 14px Inter", color: "#475569" }}>Mensagens de contato</span><span style={{ font: "600 14px Inter", color: "#1E293B" }}>24 meses</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 16, padding: "13px 18px", borderBottom: "1px solid #F1F5F9" }}>
            <span style={{ font: "500 14px Inter", color: "#475569" }}>Cadastro em newsletter</span><span style={{ font: "600 14px Inter", color: "#1E293B" }}>Até o cancelamento</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 16, padding: "13px 18px", borderBottom: "1px solid #F1F5F9" }}>
            <span style={{ font: "500 14px Inter", color: "#475569" }}>Registros de acesso</span><span style={{ font: "600 14px Inter", color: "#1E293B" }}>6 meses (Marco Civil da Internet)</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 16, padding: "13px 18px" }}>
            <span style={{ font: "500 14px Inter", color: "#475569" }}>Dados de audiência agregados</span><span style={{ font: "600 14px Inter", color: "#1E293B" }}>26 meses</span>
          </div>
        </div>
      </section>

      <section id="p8" style={{ marginBottom: 36 }}>
        <h2 style={h2}>8. Seus direitos</h2>
        <p style={{ margin: "0 0 16px", font: "400 16px/1.75 Inter", color: "#475569" }}>A LGPD garante a você o direito de confirmar a existência de tratamento, acessar seus dados, corrigir informações incompletas ou desatualizadas, solicitar anonimização, bloqueio ou eliminação de dados desnecessários, pedir a portabilidade, revogar o consentimento e se opor a tratamentos que considere irregulares.</p>
        <p style={p}>Para exercer qualquer um deles, escreva para <strong style={{ fontWeight: 600, color: "#012746" }}>privacidade@promoaspiradores.com.br</strong>. Confirmamos sua identidade e respondemos em até 15 dias.</p>
      </section>

      <section id="p9" style={{ marginBottom: 36 }}>
        <h2 style={h2}>9. Segurança da informação</h2>
        <p style={p}>Usamos conexão criptografada (HTTPS), controle de acesso por perfil, registro de atividades e backups periódicos. Nenhum sistema é totalmente imune, mas mantemos um plano de resposta a incidentes e, em caso de evento de risco relevante, comunicamos os titulares afetados e a Autoridade Nacional de Proteção de Dados.</p>
      </section>

      <section id="p10" style={{ marginBottom: 36 }}>
        <h2 style={h2}>10. Crianças e adolescentes</h2>
        <p style={p}>O site é destinado a maiores de 18 anos. Não coletamos intencionalmente dados de menores. Se identificarmos um cadastro nessa condição, ele será eliminado. Pais e responsáveis podem solicitar a exclusão pelo e-mail de privacidade.</p>
      </section>

      <section id="p11" style={{ marginBottom: 36 }}>
        <h2 style={h2}>11. Alterações desta política</h2>
        <p style={p}>Podemos atualizar este documento para refletir mudanças na operação ou na legislação. A data da última atualização fica sempre no topo da página. Alterações relevantes são comunicadas por aviso no site e, quando houver base para isso, por e-mail.</p>
      </section>

      <section id="p12">
        <h2 style={h2}>12. Como falar com o encarregado</h2>
        <div style={{ padding: 24, border: "1px solid #E2E8F0", borderRadius: 12, background: "#F8FAFC" }}>
          <div style={{ display: "grid", gap: 14, marginBottom: 20 }}>
            <span>
              <span style={{ display: "block", font: "600 11.5px Inter", letterSpacing: ".1em", color: "#94A3B8", marginBottom: 3 }}>ENCARREGADO DE PROTEÇÃO DE DADOS</span>
              <span style={{ display: "block", font: "400 15px Inter", color: "#1E293B" }}>privacidade@promoaspiradores.com.br</span>
            </span>
            <span>
              <span style={{ display: "block", font: "600 11.5px Inter", letterSpacing: ".1em", color: "#94A3B8", marginBottom: 3 }}>ENDEREÇO</span>
              <span style={{ display: "block", font: "400 15px Inter", color: "#1E293B" }}>Av. Exemplo, 1.000 — Sala 12, São Paulo/SP, 00000-000</span>
            </span>
          </div>
          <Link to="/contato" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 48, padding: "0 28px", borderRadius: 8, background: "#F05A00", color: "#fff", font: "700 14.5px Montserrat", letterSpacing: ".04em" }}>ABRIR UMA SOLICITAÇÃO</Link>
        </div>
      </section>
    </PolicyLayout>
  );
}
