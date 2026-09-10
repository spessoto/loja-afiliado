import assert from "node:assert";
import { getPageMeta, injectMeta, buildSitemapXml, truncate } from "./seo.js";

const baseHtml = `<!doctype html><html><head><title>x</title><meta name="description" content="y" /></head><body></body></html>`;

const homeMeta = getPageMeta("/", {}, {});
assert.ok(homeMeta.title.includes("Promo Aspiradores"));
assert.ok(homeMeta.jsonLd.length >= 2);

const html1 = injectMeta(baseHtml, homeMeta);
assert.ok(html1.includes("<title>"));
assert.ok(html1.includes('rel="canonical"'));
assert.ok(html1.includes('property="og:title"'));
assert.ok(html1.includes('name="twitter:card"'));
assert.ok(!html1.includes("noindex"));

const noindexMeta = getPageMeta("/favoritos", {}, {});
assert.ok(noindexMeta.noindex);
const html2 = injectMeta(baseHtml, noindexMeta);
assert.ok(html2.includes('content="noindex,nofollow"'));

const product = { id: 42, name: "Aspirador Teste X", brand: "TestBrand", category: "Robôs", image_url: "https://example.com/x.jpg", price_to: "699.9", rating_avg: "4.5", rating_count: 100, description: "Descrição do produto de teste com bastante texto para checar truncamento correto do resumo usado como meta description da página.", faq: JSON.stringify([{ q: "Pergunta?", a: "Resposta completa." }]) };
const prodMeta = getPageMeta("/produto/42", {}, { product });
assert.ok(prodMeta.title.includes("Aspirador Teste X"));
assert.ok(prodMeta.canonical.endsWith("/produto/42"));
assert.ok(prodMeta.jsonLd.some(x => x["@type"] === "Product"));
assert.ok(prodMeta.jsonLd.some(x => x["@type"] === "FAQPage"));
assert.ok(prodMeta.jsonLd.some(x => x["@type"] === "BreadcrumbList"));
const html3 = injectMeta(baseHtml, prodMeta);
assert.ok(html3.includes("application/ld+json"));

const notFoundMeta = getPageMeta("/produto/999", {}, { productNotFound: true });
assert.ok(notFoundMeta.notFound);
assert.ok(notFoundMeta.noindex);

const catMeta = getPageMeta("/categoria", { cat: "Robôs" }, { categoryProducts: [{ id: 1, name: "X" }] });
assert.ok(catMeta.title.includes("Robôs"));
assert.ok(catMeta.jsonLd.some(x => x["@type"] === "ItemList"));

const catAllMeta = getPageMeta("/categoria", {}, {});
assert.ok(catAllMeta.title.includes("Todos os Aspiradores"));

const post = { slug: "melhor-aspirador", title: "Melhor Aspirador de 2026", excerpt: "Um resumo do post.", cover_image_url: "https://example.com/cover.jpg", author: "Redação", published_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-02T00:00:00Z" };
const postMeta = getPageMeta("/blog/melhor-aspirador", {}, { post });
assert.ok(postMeta.title.includes("Melhor Aspirador de 2026"));
assert.ok(postMeta.jsonLd.some(x => x["@type"] === "BlogPosting"));

const postNotFoundMeta = getPageMeta("/blog/inexistente", {}, { postNotFound: true });
assert.ok(postNotFoundMeta.notFound);

assert.strictEqual(truncate("palavra ".repeat(50), 50).length <= 51, true);

const xml = buildSitemapXml([
  { loc: "https://promoaspiradores.com.br/", priority: 1 },
  { loc: "https://promoaspiradores.com.br/produto/1", priority: 0.8, image: "https://example.com/x.jpg" }
]);
assert.ok(xml.includes("<urlset"));
assert.ok(xml.includes("<loc>https://promoaspiradores.com.br/</loc>"));
assert.ok(xml.includes("<image:image>"));
assert.ok(xml.includes('xmlns:image='));

console.log("seo.test.js: ok");
