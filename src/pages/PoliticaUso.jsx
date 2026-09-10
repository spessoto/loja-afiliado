import { useEffect } from "react";
import { Link } from "react-router-dom";
import PolicyLayout from "../components/PolicyLayout.jsx";

const toc = [
  { href: "#u1", label: "1. Aceitação dos termos" },
  { href: "#u2", label: "2. O que o site faz" },
  { href: "#u3", label: "3. Preços e disponibilidade" },
  { href: "#u4", label: "4. Links de afiliado" },
  { href: "#u5", label: "5. Entrega, troca e garantia" },
  { href: "#u6", label: "6. Uso permitido e proibido" },
  { href: "#u7", label: "7. Conteúdo e propriedade" },
  { href: "#u8", label: "8. Avaliações de clientes" },
  { href: "#u9", label: "9. Limitação de responsabilidade" },
  { href: "#u10", label: "10. Alterações e contato" }
];

const h2 = { margin: "0 0 14px", font: "700 24px Montserrat", color: "#012746" };
const p = { margin: 0, font: "400 16px/1.75 Inter", color: "#475569" };

export default function PoliticaUso() {
  useEffect(() => {
    document.title = "Política de Uso — Promo Aspiradores";
  }, []);

  return (
    <PolicyLayout
      title="Política de Uso"
      description="As regras para navegar e usar o site da Promo Aspiradores: como funcionam nossas recomendações, os links de afiliado e as responsabilidades de cada parte."
      breadcrumbLabel="Política de Uso"
      toc={toc}
      sidebarExtra={
        <>
          <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 20, background: "#F8FAFC" }}>
            <div style={{ font: "700 14px Montserrat", color: "#012746", marginBottom: 8 }}>Precisa de ajuda?</div>
            <p style={{ margin: "0 0 14px", font: "400 13.5px/1.6 Inter", color: "#475569" }}>Nosso atendimento responde sobre pedidos, prazos e garantia.</p>
            <Link to="/contato" className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 44, borderRadius: 8, background: "#012746", color: "#fff", font: "700 13.5px Montserrat", letterSpacing: ".04em" }}>FALAR COM A GENTE</Link>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            <Link to="/politica-de-privacidade" style={{ font: "600 13.5px Inter", color: "#F05A00" }}>Política de Privacidade →</Link>
            <Link to="/politica-de-cookies" style={{ font: "600 13.5px Inter", color: "#F05A00" }}>Cookies e Dados →</Link>
          </div>
        </>
      }
    >
      <div style={{ padding: "20px 24px", borderLeft: "3px solid #F05A00", background: "#FFF7F2", borderRadius: "0 12px 12px 0", marginBottom: 40 }}>
        <strong style={{ display: "block", font: "700 15px Montserrat", color: "#012746", marginBottom: 8 }}>O ponto mais importante</strong>
        <span style={{ font: "400 15px/1.7 Inter", color: "#475569" }}>A Promo Aspiradores recomenda e compara aspiradores. A compra é finalizada no site da loja parceira, que é responsável pelo pagamento, pela entrega e pela garantia do produto.</span>
      </div>

      <section id="u1" style={{ marginBottom: 36 }}>
        <h2 style={h2}>1. Aceitação dos termos</h2>
        <p style={p}>Ao acessar e usar este site, você declara ter lido e concordado com esta Política de Uso, com a Política de Privacidade e com a Política de Cookies e Dados. Se não concordar com algum ponto, recomendamos que não utilize o site. O uso é destinado a pessoas maiores de 18 anos.</p>
      </section>

      <section id="u2" style={{ marginBottom: 36 }}>
        <h2 style={h2}>2. O que o site faz</h2>
        <p style={{ margin: "0 0 16px", font: "400 16px/1.75 Inter", color: "#475569" }}>Somos uma vitrine especializada em aspiradores de pó. Selecionamos modelos, organizamos as informações técnicas em linguagem simples e indicamos onde comprar cada um pelo melhor preço que encontramos.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
          <div style={{ padding: 20, border: "1px solid #E2E8F0", borderRadius: 12 }}>
            <strong style={{ display: "block", font: "700 14px Montserrat", color: "#012746", letterSpacing: ".04em", marginBottom: 12 }}>O QUE FAZEMOS</strong>
            <span style={{ display: "block", font: "400 14.5px/1.7 Inter", color: "#475569" }}>Curadoria de modelos, comparação de preços, conteúdo de apoio à decisão e atendimento para ajudar você a escolher.</span>
          </div>
          <div style={{ padding: 20, border: "1px solid #E2E8F0", borderRadius: 12, background: "#F8FAFC" }}>
            <strong style={{ display: "block", font: "700 14px Montserrat", color: "#012746", letterSpacing: ".04em", marginBottom: 12 }}>O QUE NÃO FAZEMOS</strong>
            <span style={{ display: "block", font: "400 14.5px/1.7 Inter", color: "#475569" }}>Não processamos pagamentos, não emitimos nota fiscal, não despachamos produtos e não controlamos o estoque das lojas parceiras.</span>
          </div>
        </div>
      </section>

      <section id="u3" style={{ marginBottom: 36 }}>
        <h2 style={h2}>3. Preços e disponibilidade</h2>
        <p style={{ margin: "0 0 14px", font: "400 16px/1.75 Inter", color: "#475569" }}>Os preços exibidos são coletados junto às lojas parceiras e podem mudar sem aviso prévio. Trabalhamos para manter tudo atualizado, mas o valor válido é sempre o que aparece no checkout da loja no momento da compra.</p>
        <p style={p}>Descontos, condições de parcelamento, frete grátis e prazos anunciados dependem de estoque e das regras de cada parceiro. Erros evidentes de digitação ou de integração não obrigam a Promo Aspiradores nem a loja a praticar o preço incorreto.</p>
      </section>

      <section id="u4" style={{ marginBottom: 36 }}>
        <h2 style={h2}>4. Links de afiliado</h2>
        <p style={{ margin: "0 0 14px", font: "400 16px/1.75 Inter", color: "#475569" }}>Os botões de compra levam a lojas parceiras por meio de links de afiliado. Se você comprar, recebemos uma comissão, sem qualquer custo adicional para você e sem alteração no preço do produto.</p>
        <p style={p}>A comissão não define nossas recomendações. A curadoria considera reputação da marca, avaliações reais de compradores, ficha técnica e relação entre preço e desempenho.</p>
      </section>

      <section id="u5" style={{ marginBottom: 36 }}>
        <h2 style={h2}>5. Entrega, troca e garantia</h2>
        <p style={{ margin: "0 0 14px", font: "400 16px/1.75 Inter", color: "#475569" }}>A relação de consumo se estabelece entre você e a loja onde a compra foi concluída. Prazo de entrega, direito de arrependimento em até 7 dias (art. 49 do Código de Defesa do Consumidor), trocas, devoluções e acionamento da garantia do fabricante seguem as políticas dessa loja.</p>
        <p style={p}>Mesmo sem ser parte da transação, nosso atendimento orienta você no processo e ajuda a acompanhar o caso com o parceiro até a resolução. Basta chamar pelo <Link to="/contato" style={{ color: "#F05A00", textDecoration: "underline" }}>canal de contato</Link> com o número do pedido.</p>
      </section>

      <section id="u6" style={{ marginBottom: 36 }}>
        <h2 style={h2}>6. Uso permitido e proibido</h2>
        <p style={{ margin: "0 0 16px", font: "400 16px/1.75 Inter", color: "#475569" }}>Você pode navegar, pesquisar, comparar e compartilhar nossos conteúdos indicando a fonte. É proibido:</p>
        <ul style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 11 }}>
          <li style={{ font: "400 16px/1.75 Inter", color: "#475569" }}>Coletar dados de forma automatizada (scraping, robôs ou mineração) sem autorização por escrito.</li>
          <li style={{ font: "400 16px/1.75 Inter", color: "#475569" }}>Tentar burlar mecanismos de segurança, sobrecarregar servidores ou explorar vulnerabilidades.</li>
          <li style={{ font: "400 16px/1.75 Inter", color: "#475569" }}>Reproduzir textos, fotos e comparativos com fins comerciais sem autorização.</li>
          <li style={{ font: "400 16px/1.75 Inter", color: "#475569" }}>Enviar conteúdo ilegal, ofensivo, discriminatório ou que viole direitos de terceiros.</li>
          <li style={{ font: "400 16px/1.75 Inter", color: "#475569" }}>Se passar pela Promo Aspiradores ou usar nossa marca de forma não autorizada.</li>
        </ul>
      </section>

      <section id="u7" style={{ marginBottom: 36 }}>
        <h2 style={h2}>7. Conteúdo e propriedade intelectual</h2>
        <p style={p}>Marca, logotipo, identidade visual, textos, comparativos e demais materiais deste site pertencem à Promo Aspiradores e são protegidos pela Lei nº 9.610/1998. Marcas, imagens e nomes de produtos de terceiros pertencem aos respectivos titulares e são exibidos apenas para identificar os itens indicados.</p>
      </section>

      <section id="u8" style={{ marginBottom: 36 }}>
        <h2 style={h2}>8. Avaliações de clientes</h2>
        <p style={p}>As avaliações exibidas vêm de compradores verificados e refletem a opinião individual de cada pessoa. Não editamos o conteúdo das opiniões, mas removemos textos com linguagem ofensiva, dados pessoais de terceiros, propaganda ou informação comprovadamente falsa.</p>
      </section>

      <section id="u9" style={{ marginBottom: 36 }}>
        <h2 style={h2}>9. Limitação de responsabilidade</h2>
        <p style={p}>Trabalhamos para manter as informações corretas e o site disponível, porém não garantimos ausência de erros, indisponibilidades pontuais ou divergências de preço e estoque em relação às lojas parceiras. A Promo Aspiradores não responde por danos decorrentes do uso do site, de conteúdos de terceiros ou de transações realizadas fora dele, salvo nas hipóteses previstas em lei.</p>
      </section>

      <section id="u10">
        <h2 style={h2}>10. Alterações e contato</h2>
        <p style={{ margin: "0 0 20px", font: "400 16px/1.75 Inter", color: "#475569" }}>Esta política pode ser atualizada a qualquer momento, com a data de revisão indicada no topo da página. Aplicam-se as leis brasileiras, elegendo-se o foro do domicílio do consumidor para eventuais controvérsias.</p>
        <div style={{ padding: 24, border: "1px solid #E2E8F0", borderRadius: 12, background: "#F8FAFC" }}>
          <div style={{ display: "grid", gap: 14, marginBottom: 20 }}>
            <span>
              <span style={{ display: "block", font: "600 11.5px Inter", letterSpacing: ".1em", color: "#94A3B8", marginBottom: 3 }}>RESPONSÁVEL PELO SITE</span>
              <span style={{ display: "block", font: "400 15px Inter", color: "#1E293B" }}>Caio Cézares de Souza Spessoto — CPF 364.609.548-28</span>
            </span>
            <span>
              <span style={{ display: "block", font: "600 11.5px Inter", letterSpacing: ".1em", color: "#94A3B8", marginBottom: 3 }}>DÚVIDAS SOBRE ESTES TERMOS</span>
              <span style={{ display: "block", font: "400 15px Inter", color: "#1E293B" }}>contato@promoaspiradores.com.br</span>
            </span>
            <span>
              <span style={{ display: "block", font: "600 11.5px Inter", letterSpacing: ".1em", color: "#94A3B8", marginBottom: 3 }}>LOCALIZAÇÃO</span>
              <span style={{ display: "block", font: "400 15px Inter", color: "#1E293B" }}>Bragança Paulista/SP - Brasil</span>
            </span>
          </div>
          <Link to="/contato" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 48, padding: "0 28px", borderRadius: 8, background: "#F05A00", color: "#fff", font: "700 14.5px Montserrat", letterSpacing: ".04em" }}>FALAR COM O ATENDIMENTO</Link>
        </div>
      </section>
    </PolicyLayout>
  );
}
