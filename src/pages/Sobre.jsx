import { useEffect } from "react";
import { Link } from "react-router-dom";
import PolicyLayout from "../components/PolicyLayout.jsx";

const toc = [
  { href: "#s1", label: "1. Quem somos" },
  { href: "#s2", label: "2. Como escolhemos os produtos" },
  { href: "#s3", label: "3. Como escrevemos as análises" },
  { href: "#s4", label: "4. Como ganhamos dinheiro" },
  { href: "#s5", label: "5. O que não fazemos" },
  { href: "#s6", label: "6. Fale com a gente" }
];

const h2 = { margin: "0 0 14px", font: "700 24px Montserrat", color: "#012746" };
const p = { margin: 0, font: "400 16px/1.75 Inter", color: "#475569" };

export default function Sobre() {
  useEffect(() => {
    document.title = "Sobre a Promo Aspiradores — Quem Somos";
  }, []);

  return (
    <PolicyLayout
      title="Sobre a Promo Aspiradores"
      description="Quem organiza o catálogo, como escolhemos os produtos e escrevemos as análises, e como o site se sustenta."
      breadcrumbLabel="Sobre"
      toc={toc}
      sidebarExtra={
        <div style={{ display: "grid", gap: 8 }}>
          <Link to="/politica-de-uso" style={{ font: "600 13.5px Inter", color: "#C84A00" }}>Política de Uso →</Link>
          <Link to="/politica-de-privacidade" style={{ font: "600 13.5px Inter", color: "#C84A00" }}>Política de Privacidade →</Link>
        </div>
      }
    >
      <section id="s1" style={{ marginBottom: 36 }}>
        <h2 style={h2}>1. Quem somos</h2>
        <p style={p}>A Promo Aspiradores é um site de curadoria: reunimos aspiradores de pó, robôs, verticais, portáteis, extratoras e profissionais de várias lojas parceiras num catálogo único, com ficha técnica organizada e uma análise própria por produto. Não somos fabricante nem loja — quem vende, entrega e emite a nota fiscal é sempre a loja parceira para onde o link leva.</p>
      </section>

      <section id="s2" style={{ marginBottom: 36 }}>
        <h2 style={h2}>2. Como escolhemos os produtos</h2>
        <p style={{ margin: "0 0 14px", font: "400 16px/1.75 Inter", color: "#475569" }}>Cada produto entra no catálogo depois de conferirmos a ficha técnica do fabricante ou do anúncio de origem (potência, capacidade, autonomia, tipo de filtro e demais especificações). Evitamos duplicar o mesmo modelo cadastrado em lojas diferentes: quando isso acontece, mantemos só uma página principal indexada.</p>
        <p style={p}>Não testamos fisicamente todos os produtos em laboratório — o catálogo é organizado a partir da documentação técnica disponível, por isso somos claros ao indicar quando uma informação vem do fabricante ou de uma publicação terceira, sempre com link para a fonte.</p>
      </section>

      <section id="s3" style={{ marginBottom: 36 }}>
        <h2 style={h2}>3. Como escrevemos as análises</h2>
        <p style={{ margin: "0 0 14px", font: "400 16px/1.75 Inter", color: "#475569" }}>O texto "Nossa análise", em cada página de produto, é redigido por nós a partir da ficha técnica — nunca copiado do anúncio da loja. Ele diz para quem o produto faz sentido, os pontos fortes e pelo menos uma ressalva real.</p>
        <p style={p}>Não copiamos nem exibimos notas e depoimentos de compradores de outras lojas (Amazon, Mercado Livre) — é conteúdo de propriedade dessas plataformas. Quando o blog cita uma opinião ou um teste de terceiros, a fonte aparece linkada no texto.</p>
      </section>

      <section id="s4" style={{ marginBottom: 36 }}>
        <h2 style={h2}>4. Como ganhamos dinheiro</h2>
        <p style={p}>Os botões de compra levam a lojas parceiras por meio de links de afiliado (Amazon, Mercado Livre e outras redes). Se você compra por esse link, recebemos uma comissão da loja — sem custo adicional para você e sem alteração no preço do produto. A comissão não define quais produtos entram no catálogo nem o que escrevemos sobre eles.</p>
      </section>

      <section id="s5" style={{ marginBottom: 36 }}>
        <h2 style={h2}>5. O que não fazemos</h2>
        <ul style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8 }}>
          <li style={{ font: "400 16px/1.75 Inter", color: "#475569" }}>Não processamos pagamento, não emitimos nota fiscal e não despachamos produtos.</li>
          <li style={{ font: "400 16px/1.75 Inter", color: "#475569" }}>Não copiamos preço, nota média ou avaliações de compradores de outras plataformas.</li>
          <li style={{ font: "400 16px/1.75 Inter", color: "#475569" }}>Não garantimos estoque ou preço da loja parceira além do que ela mesma publica no momento da compra.</li>
        </ul>
      </section>

      <section id="s6" style={{ marginBottom: 8 }}>
        <h2 style={h2}>6. Fale com a gente</h2>
        <p style={{ margin: "0 0 16px", font: "400 16px/1.75 Inter", color: "#475569" }}>Encontrou uma informação errada ou quer sugerir um produto? Fale com a gente pela <Link to="/contato" style={{ color: "#C84A00", textDecoration: "underline" }}>página de contato</Link>.</p>
      </section>
    </PolicyLayout>
  );
}
