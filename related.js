// Ligação entre conteúdos (produto <-> post <-> categoria) para links internos. Puro: roda no servidor e no cliente.
const TOPICOS = {
  "Robôs": /rob[oô]/gi,
  "Vertical": /vertical|sem fio/gi,
  "Portáteis": /port[aá]til|automotiv|mini aspirador/gi,
  "Aspiradores": /p[oó] e [aá]gua|sem saco|aspirador de p[oó]/gi,
  "Extratoras": /extrat|estofad|sof[aá]/gi,
  "Profissionais": /profission|oficina|obra/gi
};
const DA_CATEGORIA_DO_POST = { "Aspiradores Robô": "Robôs", "Aspiradores Verticais": "Vertical" };

export function categoriaDoPost(post) {
  if (DA_CATEGORIA_DO_POST[post.category]) return DA_CATEGORIA_DO_POST[post.category];
  const titulo = String(post.title || "");
  const corpo = String(post.content || post.excerpt || "").slice(0, 2500);
  let melhor = null, pontos = 0;
  for (const [cat, re] of Object.entries(TOPICOS)) {
    const p = (titulo.match(re) || []).length * 5 + (corpo.match(re) || []).length;
    if (p > pontos) { melhor = cat; pontos = p; }
  }
  return melhor;
}

const populares = (lista) => [...lista].sort((a, b) => (Number(b.rating_count) || 0) - (Number(a.rating_count) || 0));

export function produtosDoPost(post, products, n = 4) {
  const cat = categoriaDoPost(post);
  const daCategoria = cat ? products.filter(p => p.category === cat) : [];
  return populares(daCategoria.length ? daCategoria : products).slice(0, n);
}

export function postsDoProduto(product, posts, n = 2) {
  const doTopico = posts.filter(p => categoriaDoPost(p) === product.category);
  return [...doTopico, ...posts.filter(p => !doTopico.includes(p))].slice(0, n);
}

export function outrosPosts(post, posts, n = 3) {
  const cat = categoriaDoPost(post);
  const outros = posts.filter(p => p.slug !== post.slug);
  const mesmo = outros.filter(p => categoriaDoPost(p) === cat);
  return [...mesmo, ...outros.filter(p => !mesmo.includes(p))].slice(0, n);
}
