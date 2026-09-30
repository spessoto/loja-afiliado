import assert from "node:assert";
import { slugify } from "./slug.js";

assert.strictEqual(slugify("Melhor Aspirador Vertical de 2026!"), "melhor-aspirador-vertical-de-2026");
assert.strictEqual(slugify("Robô Aspirador: Vale a Pena?"), "robo-aspirador-vale-a-pena");
assert.strictEqual(slugify(""), "post");
assert.strictEqual(slugify("   "), "post");

console.log("slug.test.js: ok");

import { shortName, productSlug } from "./slug.js";
assert.strictEqual(shortName("Robô Aspirador Anker eufy X10 Pro 4 em 1 Sucção 8000Pa IA Evita Obstáculos", 46), "Robô Aspirador Anker eufy X10 Pro 4 em 1");
assert.strictEqual(shortName("Aspirador Simples", 46), "Aspirador Simples");
assert.ok(shortName("Aspirador de Pó Vertical Sem Fio com Filtro HEPA e Cabo Longo", 33).length <= 33);
assert.ok(!/\s(com|de|e)$/i.test(shortName("Aspirador de Pó Vertical Sem Fio com Filtro HEPA e Cabo Longo", 40)));
assert.ok(productSlug("Robô Aspirador Anker eufy X10 Pro 4 em 1 Sucção 8000Pa IA Evita Obstáculos Mapeamento AI.Map 3.0 Lava Seca").length <= 60);
console.log("slug.test.js (shortName): ok");

// sizedImage: Amazon troca _AC_SL; Mercado Livre troca o sufixo -O só para imagens pequenas
{
  const { sizedImage } = await import("./imageUrl.js");
  assert.strictEqual(sizedImage("https://m.media-amazon.com/images/I/x._AC_SL1500_.jpg", 800), "https://m.media-amazon.com/images/I/x._AC_SL800_.jpg");
  assert.strictEqual(sizedImage("https://http2.mlstatic.com/D_NQ_NP_1-MLA2_062026-O.webp", 150), "https://http2.mlstatic.com/D_NQ_NP_1-MLA2_062026-E.webp");
  assert.strictEqual(sizedImage("https://http2.mlstatic.com/D_NQ_NP_1-MLA2_062026-O.webp", 300), "https://http2.mlstatic.com/D_NQ_NP_1-MLA2_062026-V.webp");
  assert.strictEqual(sizedImage("https://http2.mlstatic.com/D_NQ_NP_1-MLA2_062026-O.webp", 500), "https://http2.mlstatic.com/D_NQ_NP_1-MLA2_062026-O.webp");
}

// lojaDe: Awin é checado antes (o link carrega a loja de destino no parâmetro ued)
{
  const { lojaDe } = await import("./slug.js");
  assert.strictEqual(lojaDe("https://www.awin1.com/cread.php?awinmid=1&ued=https%3A%2F%2Fwww.mercadolivre.com.br%2Fx"), "awin");
  assert.strictEqual(lojaDe("https://link.amazon/B0x"), "amazon");
  assert.strictEqual(lojaDe("https://meli.la/abc"), "ml");
}
