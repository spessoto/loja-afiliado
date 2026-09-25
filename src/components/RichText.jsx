import { Link } from "react-router-dom";

// Marcação leve em texto simples (a mesma do blog): "## " título, "- " lista, [texto](url) link.
// Links internos (começam com /) usam <Link> para navegar sem recarregar a página.
function inline(text, prefix, linkStyle) {
  const parts = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0, m, i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const [, label, url] = m;
    const key = `${prefix}-${i++}`;
    const externo = /^https?:\/\//.test(url) && !url.includes("promoaspiradores.com.br");
    if (externo) parts.push(<a key={key} href={url} target="_blank" rel="noopener noreferrer" style={linkStyle}>{label}</a>);
    else parts.push(<Link key={key} to={url.replace(/^https?:\/\/[^/]+/, "")} style={linkStyle}>{label}</Link>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export default function RichText({ text, p, h, linkColor = "#C84A00" }) {
  const linkStyle = { color: linkColor, fontWeight: 600 };
  const blocos = String(text || "").replace(/\r\n/g, "\n").split(/\n{2,}/).map(b => b.trim()).filter(Boolean);
  return blocos.map((b, i) => {
    if (b.startsWith("## ")) return <h3 key={i} style={h}>{inline(b.slice(3), `h${i}`, linkStyle)}</h3>;
    const linhas = b.split("\n");
    if (linhas.every(l => l.startsWith("- "))) {
      return <ul key={i} style={{ ...p, paddingLeft: 20, margin: "0 0 14px" }}>{linhas.map((l, j) => <li key={j} style={{ margin: "0 0 6px" }}>{inline(l.slice(2), `l${i}-${j}`, linkStyle)}</li>)}</ul>;
    }
    return <p key={i} style={p}>{inline(b, `p${i}`, linkStyle)}</p>;
  });
}
