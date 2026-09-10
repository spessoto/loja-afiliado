import assert from "node:assert";
import { generateFaq } from "./faq.js";

const withData = generateFaq({ name: "Aspirador X", potencia: "450W", voltagem: "127V", garantia: "12 meses", frete: "Grátis", indicado: "Casas pequenas", category: "Vertical", brand: "Dreame" });
assert.strictEqual(withData.length, 5);
assert.ok(withData[0].q.includes("potência"));
assert.ok(withData.every(f => f.q && f.a));
assert.ok(withData.every(f => !/frete/i.test(f.q) && !/frete/i.test(f.a)));
assert.ok(withData.every(f => f.a.trim().split(/\s+/).length >= 4), "FAQ answers must be full sentences, not 1-2 word replies");

const empty = generateFaq({ name: "Produto Sem Dados" });
assert.strictEqual(empty.length, 5);
assert.ok(empty.every(f => f.q && f.a));

console.log("faq.test.js: ok");
