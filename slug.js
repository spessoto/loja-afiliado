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
