import assert from "node:assert";
import { submitToIndexNow, INDEXNOW_KEY } from "./indexnow.js";

let calledWith = null;
const originalFetch = global.fetch;
global.fetch = async (url, opts) => {
  calledWith = { url, body: JSON.parse(opts.body) };
  return { ok: true };
};

submitToIndexNow("/produto/14");
await new Promise(r => setTimeout(r, 50));

assert.strictEqual(calledWith.url, "https://api.indexnow.org/indexnow");
assert.strictEqual(calledWith.body.host, "promoaspiradores.com.br");
assert.strictEqual(calledWith.body.key, INDEXNOW_KEY);
assert.strictEqual(calledWith.body.keyLocation, `https://promoaspiradores.com.br/${INDEXNOW_KEY}.txt`);
assert.deepStrictEqual(calledWith.body.urlList, ["https://promoaspiradores.com.br/produto/14"]);

calledWith = null;
submitToIndexNow([]);
await new Promise(r => setTimeout(r, 10));
assert.strictEqual(calledWith, null, "empty list should not call fetch");

global.fetch = originalFetch;
console.log("indexnow.test.js: ok");
