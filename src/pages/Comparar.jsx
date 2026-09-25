import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import { FooterFull } from "../components/Footer.jsx";
import { categoriasCol, institucionalCol } from "../data/footerColumns.js";
import { useCategories } from "../lib/categories.js";
import { useProducts, formatBRL, parseSpecs, productUrl, lojaDe } from "../lib/products.js";
import { useCompare } from "../lib/compare.js";
import { sizedImage } from "../../imageUrl.js";

const cell = { padding: "12px 12px", textAlign: "center", font: "400 13.5px/1.5 Inter", color: "#475569", borderBottom: "1px solid #F1F5F9", verticalAlign: "top" };
const labelCell = { padding: "12px 10px", font: "600 13px Inter", color: "#012746", borderBottom: "1px solid #F1F5F9", verticalAlign: "top", background: "#fff", position: "sticky", left: 0, minWidth: 96, width: 96, zIndex: 1 };

// Linhas comparáveis: o mesmo dado aparece com rótulos diferentes em cada produto (Amazon x Mercado Livre),
// então cada linha procura pelo primeiro rótulo que casa com o padrão.
const junk = /^[01]\s*(dba?|db|pa|cm)\b/i;
const LINHAS = [
  { label: "Potência", field: "potencia", re: /^pot[eê]ncia$/i },
  { label: "Sucção", re: /^(suc[cç][aã]o( m[aá]xima)?|press[aã]o de suc[cç][aã]o|pot[eê]ncia de suc[cç][aã]o|v[aá]cuo( m[aá]ximo)?)$/i },
  { label: "Voltagem", field: "voltagem", re: /^(voltagem( \(entrada\))?|tens[aã]o( nominal)?)$/i },
  { label: "Alimentação", re: /^(tipo de alimenta[cç][aã]o|fonte de energia)$/i },
  { label: "Autonomia", re: /^(autonomia( da bateria)?|dura[cç][aã]o da bateria)/i },
  { label: "Capacidade", re: /^(capacidade( em volume| do reservat[oó]rio| total)?|reservat[oó]rio|tamanho do tanque|tanque)$/i },
  { label: "Peso", re: /^peso/i },
  { label: "Nível de ruído", re: /^(n[ií]vel de (ru[ií]do|press[aã]o sonora)|ru[ií]do)/i },
  { label: "Cabo", re: /^(comprimento do cabo|cabo el[eé]trico)/i },
  { label: "Filtro", re: /^(tipo de filtro|filtro|filtragem)$/i },
  { label: "Wi-Fi / app", re: /^(com wi-?fi|conectividade)$/i },
  { label: "Aspira líquidos", re: /adequado para l[ií]quido/i }
];

function pick(product, specs, linha) {
  const direto = linha.field && String(product[linha.field] || "").trim();
  if (direto) return direto;
  const key = Object.keys(specs).find(k => linha.re.test(k) && !junk.test(specs[k]));
  return key ? specs[key] : "";
}

export default function Comparar() {
  const { ids, toggle, clear, max } = useCompare();
  const { products, loading } = useProducts();
  const { categories } = useCategories();
  const selected = ids.map(id => products.find(p => p.id === id)).filter(p => p && lojaDe(p.affiliate_url) !== "ml");

  useEffect(() => {
    document.title = "Comparar produtos — Promo Aspiradores";
  }, []);


  const specsByProduct = selected.map(p => parseSpecs(p.specs));
  const linhas = LINHAS
    .map(l => ({ ...l, valores: selected.map((p, i) => pick(p, specsByProduct[i], l)) }))
    .filter(l => l.valores.some(Boolean));
  const usadas = new Set(selected.flatMap((p, i) => LINHAS.flatMap(l => Object.keys(specsByProduct[i]).filter(k => l.re.test(k)))));
  const outrasChaves = [...new Set(specsByProduct.flatMap(s => Object.keys(s)))]
    .filter(k => !usadas.has(k) && !/^(marca|categoria)$/i.test(k));

  const semPreco = (p) => lojaDe(p.affiliate_url) === "amazon";
  const precos = selected.map(p => (semPreco(p) ? Infinity : Number(p.price_to) || Infinity));
  const menorPreco = Math.min(...precos);
  const registrarClique = (id) => fetch(`/api/products/${id}/click`, { method: "POST" });

  return (
    <>
      <Header
        categoriesNav={{ menu: categories.map(c => c.name), showAllCategories: false, itemTo: "/categoria", ofertaTo: "/categoria" }}
      />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 20 }}>
          <h1 style={{ margin: 0, font: "800 24px Montserrat", color: "#012746", letterSpacing: "-.01em" }}>Comparar produtos</h1>
          {selected.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              {selected.length < max && <Link to="/categoria" style={{ font: "600 13.5px Inter", color: "#C84A00", textDecoration: "underline" }}>Adicionar outro produto</Link>}
              <button onClick={clear} style={{ border: 0, background: "transparent", font: "600 13.5px Inter", color: "#C84A00", cursor: "pointer", textDecoration: "underline" }}>Limpar comparação</button>
            </div>
          )}
        </div>

        {loading ? (
          <p style={{ font: "400 15px Inter", color: "#64748B" }}>Carregando...</p>
        ) : selected.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", border: "1px dashed #E2E8F0", borderRadius: 12 }}>
            <p style={{ margin: "0 0 16px", font: "400 15px Inter", color: "#475569" }}>Marque "Comparar" em pelo menos dois produtos (até {max}) para ver as diferenças lado a lado.</p>
            <Link to="/categoria" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 46, padding: "0 24px", borderRadius: 8, background: "#C84A00", color: "#fff", font: "700 13.5px Montserrat", letterSpacing: ".04em" }}>VER PRODUTOS</Link>
          </div>
        ) : (
          <>
            {selected.length === 1 && (
              <p style={{ margin: "0 0 16px", font: "400 14px Inter", color: "#475569" }}>Selecione mais um produto para comparar. <Link to="/categoria" style={{ color: "#C84A00", fontWeight: 600 }}>Escolher outro</Link></p>
            )}
            <div style={{ overflowX: "auto", border: "1px solid #E2E8F0", borderRadius: 12 }}>
              <table style={{ width: "100%", minWidth: 96 + selected.length * 200, borderCollapse: "separate", borderSpacing: 0 }}>
                <thead>
                  <tr>
                    <th style={{ width: 96, minWidth: 96, background: "#fff", position: "sticky", left: 0, zIndex: 1 }}></th>
                    {selected.map((p, i) => (
                      <th key={p.id} style={{ padding: "16px 12px", minWidth: 184, verticalAlign: "top", borderBottom: "2px solid #E2E8F0" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center" }}>
                          {p.image_url && <img src={sizedImage(p.image_url, 250)} alt={p.name} loading="lazy" style={{ width: 100, height: 100, objectFit: "contain" }} />}
                          <Link to={productUrl(p.id, p.name)} style={{ font: "700 13.5px/1.35 Montserrat", color: "#012746", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.name}</Link>
                          <div>
                            {!semPreco(p) && Number(p.price_from) > Number(p.price_to) && <div style={{ font: "400 12.5px Inter", color: "#64748B", textDecoration: "line-through" }}>{formatBRL(p.price_from)}</div>}
                            <div style={{ font: "800 20px Montserrat", color: "#C84A00" }}>{semPreco(p) ? "Ver preço na loja" : formatBRL(p.price_to) || "Consulte"}</div>
                            {selected.length > 1 && Number.isFinite(menorPreco) && precos[i] === menorPreco && <span style={{ display: "inline-block", marginTop: 4, padding: "2px 8px", borderRadius: 4, background: "#012746", color: "#fff", font: "700 10px Montserrat", letterSpacing: ".06em" }}>MENOR PREÇO</span>}
                          </div>
                          <a href={p.affiliate_url} target="_blank" rel="noopener noreferrer sponsored" onClick={() => registrarClique(p.id)} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: 40, borderRadius: 8, background: "#C84A00", color: "#fff", font: "700 12.5px Montserrat", letterSpacing: ".06em" }}>COMPRAR</a>
                          <button onClick={() => toggle(p.id)} style={{ border: "1px solid #E2E8F0", background: "#fff", borderRadius: 20, padding: "5px 12px", font: "600 12px Inter", color: "#475569", cursor: "pointer" }}>Remover</button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={labelCell}>Marca</td>
                    {selected.map(p => <td key={p.id} style={cell}>{p.brand || "-"}</td>)}
                  </tr>
                  <tr>
                    <td style={labelCell}>Categoria</td>
                    {selected.map(p => <td key={p.id} style={cell}>{p.category || "-"}</td>)}
                  </tr>
                  {linhas.map(l => (
                    <tr key={l.label}>
                      <td style={labelCell}>{l.label}</td>
                      {l.valores.map((v, i) => <td key={selected[i].id} style={cell}>{v || "-"}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {outrasChaves.length > 0 && (
              <details style={{ marginTop: 20 }}>
                <summary style={{ cursor: "pointer", font: "700 14px Montserrat", color: "#012746" }}>Ver todas as especificações ({outrasChaves.length})</summary>
                <div style={{ overflowX: "auto", marginTop: 12, border: "1px solid #E2E8F0", borderRadius: 12 }}>
                  <table style={{ width: "100%", minWidth: 96 + selected.length * 200, borderCollapse: "separate", borderSpacing: 0 }}>
                    <tbody>
                      {outrasChaves.map(k => (
                        <tr key={k}>
                          <td style={labelCell}>{k}</td>
                          {specsByProduct.map((s, j) => <td key={selected[j].id} style={cell}>{s[k] || "-"}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            )}
          </>
        )}
      </main>

      <FooterFull columns={[categoriasCol, institucionalCol]} />
    </>
  );
}
