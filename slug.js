export function slugify(text) {
  return String(text || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200) || "post";
}

const TRAILING = /\s+(com|de|do|da|dos|das|e|para|em|sem|por|a|o|as|os)$/i;

// Corta em limite de palavra, sem terminar em conector/pontuação (títulos e slugs de produto são longos demais)
export function shortName(text, max) {
  let t = String(text || "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  t = t.slice(0, max + 1);
  const i = t.lastIndexOf(" ");
  t = i > 0 ? t.slice(0, i) : t.slice(0, max);
  for (let prev; prev !== t;) {
    prev = t;
    t = t.replace(/[\s,;:\-–—+(]+$/, "").replace(TRAILING, "");
  }
  return t;
}

export function productSlug(name) {
  return slugify(shortName(name, 60));
}

export function categoryPath(name) {
  return `/categoria/${slugify(name)}`;
}

// Títulos acima de ~70 caracteres são cortados nos resultados: tira a marca do fim quando não cabe
export function withSiteTitle(t, site = "Promo Aspiradores") {
  const full = `${t} — ${site}`;
  return full.length <= 70 ? full : shortName(t, 68);
}

export function productTitle(product, all = []) {
  const dup = all.some(o => o.id < product.id && shortName(o.name, 46) === shortName(product.name, 46));
  return dup
    ? `${shortName(product.name, 38)} (ref. ${product.id}) — Promo Aspiradores`
    : `${shortName(product.name, 46)} — Promo Aspiradores`;
}
