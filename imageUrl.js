// Redimensiona pela URL do CDN. Amazon: _AC_SL{px}_. Mercado Livre: sufixo -O (500px) vira -E (280px) ou -V (320px) quando a imagem é pequena.
export function sizedImage(url, px) {
  if (!url) return url;
  if (/\/D_NQ_NP_[^/]*-O\.webp$/.test(url) && px <= 320) return url.replace(/-O\.webp$/, px <= 280 ? "-E.webp" : "-V.webp");
  return url.replace(/\._AC_[A-Z]{2}\d+_\./, `._AC_SL${px}_.`);
}
