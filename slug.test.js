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
