import assert from "node:assert/strict";
import { productBlock, postBlock, listingBlock } from "./prerender.js";

const p = { id: 7, name: "Robô <X> & Cia", brand: "Marca", category: "Robôs", price_to: "699.9", price_from: "999", description: "Linha 1\n\nLinha 2", specs: "Potência: 1400W", faq: JSON.stringify([{ q: "Pergunta?", a: "Resposta." }]) };
const html = productBlock(p, [{ id: 8, name: "Outro", price_to: "100" }]);
assert.ok(html.includes("<h1>Robô &lt;X&gt; &amp; Cia</h1>"));
assert.ok(html.includes("<strong>Potência:</strong> 1400W"));
assert.ok(html.includes("<h3>Pergunta?</h3>"));
assert.ok(html.includes('href="https://promoaspiradores.com.br/produto/outro-8"'));
assert.ok(html.includes('id="prerender"'));

const post = postBlock({ title: "T", content: "## Sub\n\nTexto com [link](/produto/x-1).\n\n![alt](https://x.com/a.jpg)" });
assert.ok(post.includes("<h2>Sub</h2>") && post.includes('<a href="/produto/x-1">link</a>') && post.includes('<img src="https://x.com/a.jpg"'));

assert.ok(listingBlock("Título", { categories: ["Robôs"], products: [p] }).includes("categoria?cat=Rob%C3%B4s"));
console.log("prerender ok");
