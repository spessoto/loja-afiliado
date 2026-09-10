import assert from "node:assert";
import { slugify } from "./slug.js";

assert.strictEqual(slugify("Melhor Aspirador Vertical de 2026!"), "melhor-aspirador-vertical-de-2026");
assert.strictEqual(slugify("Robô Aspirador: Vale a Pena?"), "robo-aspirador-vale-a-pena");
assert.strictEqual(slugify(""), "post");
assert.strictEqual(slugify("   "), "post");

console.log("slug.test.js: ok");
