import { productUrl } from "./seo.js";

// HTML estático injetado dentro de <div id="root"> para que rastreadores vejam o conteúdo sem executar JS.
// O React (createRoot) substitui esse bloco assim que carrega; por isso fica visualmente oculto (sem flash).
const HIDDEN = "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap";

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const lines = (t) => String(t || "").split("\n").map(s => s.trim()).filter(Boolean);
const brl = (v) => (Number(v) ? Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "");
const wrap = (inner) => `<div id="prerender" style="${HIDDEN}">${inner}</div>`;
const list = (items) => (items.length ? `<ul>${items.map(i => `<li>${i}</li>`).join("")}</ul>` : "");
const link = (p) => `<a href="${esc(productUrl(p))}">${esc(p.name)}</a>${brl(p.price_to) ? ` — ${brl(p.price_to)}` : ""}`;

export function productBlock(p, related = []) {
  let faq = [];
  try { faq = p.faq ? JSON.parse(p.faq) : []; } catch { faq = []; }
  const specs = lines(p.specs).map(l => { const i = l.indexOf(":"); return i > 0 ? `<strong>${esc(l.slice(0, i))}:</strong> ${esc(l.slice(i + 1).trim())}` : esc(l); });
  const paragraphs = String(p.description || "").replace(/\r\n/g, "\n").split(/\n{2,}/).map(s => s.trim()).filter(Boolean);
  const price = brl(p.price_to);
  const from = Number(p.price_from) > Number(p.price_to) ? brl(p.price_from) : "";
  return wrap([
    `<nav><a href="/">Home</a> › <a href="/categoria?cat=${encodeURIComponent(p.category || "")}">${esc(p.category || "Aspiradores")}</a></nav>`,
    `<article><h1>${esc(p.name)}</h1>`,
    `<p>${[p.brand && `Marca: ${esc(p.brand)}`, p.category && `Categoria: ${esc(p.category)}`, p.potencia && `Potência: ${esc(p.potencia)}`, p.voltagem && `Voltagem: ${esc(p.voltagem)}`].filter(Boolean).join(" | ")}</p>`,
    price ? `<p>Preço: ${price}${from ? ` (de ${from})` : ""}</p>` : "",
    p.rating_avg && p.rating_count ? `<p>Nota ${esc(p.rating_avg)} de 5 em ${esc(p.rating_count)} avaliações.</p>` : "",
    paragraphs.map(t => `<p>${esc(t)}</p>`).join(""),
    p.analise ? `<h2>Nossa análise</h2><p>${esc(p.analise)}</p>` : "",
    specs.length ? `<h2>Especificações técnicas</h2>${list(specs)}` : "",
    lines(p.indicado).length ? `<h2>Indicado para</h2>${list(lines(p.indicado).map(esc))}` : "",
    lines(p.nao_indicado).length ? `<h2>Não indicado para</h2>${list(lines(p.nao_indicado).map(esc))}` : "",
    faq.length ? `<h2>Perguntas frequentes</h2>${faq.map(f => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("")}` : "",
    related.length ? `<h2>Produtos relacionados</h2>${list(related.map(link))}` : "",
    `</article>`
  ].join(""));
}

function inline(text) {
  return esc(text).replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => `<a href="${u}">${t}</a>`);
}

export function postBlock(post) {
  const body = String(post.content || "").replace(/\r\n/g, "\n").split(/\n{2,}/).map(s => s.trim()).filter(Boolean).map(b => {
    const img = b.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (img) return `<img src="${esc(img[2])}" alt="${esc(img[1])}">`;
    if (b.startsWith("### ")) return `<h3>${inline(b.slice(4))}</h3>`;
    if (b.startsWith("## ")) return `<h2>${inline(b.slice(3))}</h2>`;
    return `<p>${inline(b)}</p>`;
  }).join("");
  return wrap(`<nav><a href="/">Home</a> › <a href="/blog">Blog</a></nav><article><h1>${esc(post.title)}</h1>${post.excerpt ? `<p>${esc(post.excerpt)}</p>` : ""}${body}</article>`);
}

export function listingBlock(title, { categories = [], products = [], posts = [] } = {}) {
  return wrap([
    `<h1>${esc(title)}</h1>`,
    categories.length ? `<h2>Categorias</h2>${list(categories.map(c => `<a href="/categoria?cat=${encodeURIComponent(c)}">${esc(c)}</a>`))}` : "",
    products.length ? `<h2>Aspiradores</h2>${list(products.map(link))}` : "",
    posts.length ? `<h2>Artigos</h2>${list(posts.map(p => `<a href="/blog/${esc(p.slug)}">${esc(p.title)}</a>`))}` : ""
  ].join(""));
}
