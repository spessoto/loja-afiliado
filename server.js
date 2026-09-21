import express from "express";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import { pool, ensureSchema, hashPassword, verifyPassword, getSettings, setSettings } from "./db.js";
import { generateFaq } from "./faq.js";
import { getPageMeta, injectMeta, buildSitemapXml, productUrl, SITE_URL } from "./seo.js";
import { slugify } from "./slug.js";
import { sizedImage } from "./imageUrl.js";
import { submitToIndexNow } from "./indexnow.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "dist");
const port = process.env.PORT || 3000;
const SESSION_MAX_AGE_MS = 12 * 60 * 60 * 1000;

const app = express();
app.use(express.json());

function sessionSecret() {
  return process.env.SESSION_SECRET || process.env.ADMIN_TOKEN;
}

function signSession(payload) {
  const data = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + SESSION_MAX_AGE_MS })).toString("base64url");
  const sig = crypto.createHmac("sha256", sessionSecret()).update(data).digest("base64url");
  return `${data}.${sig}`;
}

function verifySession(token) {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = crypto.createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  const data = JSON.parse(Buffer.from(payload, "base64url").toString());
  if (data.exp < Date.now()) return null;
  return data;
}

function getCookie(req, name) {
  const raw = req.headers.cookie || "";
  const match = raw.split(";").map(c => c.trim()).find(c => c.startsWith(`${name}=`));
  return match ? match.slice(name.length + 1) : null;
}

function requireAdmin(req, res, next) {
  if (!verifySession(getCookie(req, "admin_session"))) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
}

function requireCustomer(req, res, next) {
  const session = verifySession(getCookie(req, "customer_session"));
  if (!session) return res.status(401).json({ error: "unauthorized" });
  req.customerId = session.id;
  next();
}

function requireTokenEnv(envVar) {
  return (req, res, next) => {
    const expected = process.env[envVar];
    const token = req.headers["x-automation-token"];
    const ok = expected && token && token.length === expected.length && crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
    if (!ok) return res.status(401).json({ error: "unauthorized" });
    next();
  };
}
const requirePriceToken = requireTokenEnv("PRICE_AUTOMATION_TOKEN");
const requireBlogToken = requireTokenEnv("BLOG_AUTOMATION_TOKEN");

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(422).json({ error: "email and password are required" });
  const [rows] = await pool.query("SELECT password_hash FROM admin_users WHERE email = ?", [email]);
  if (!rows.length || !verifyPassword(password, rows[0].password_hash)) {
    return res.status(401).json({ error: "invalid credentials" });
  }
  res.cookie("admin_session", signSession({ email }), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: SESSION_MAX_AGE_MS
  });
  res.json({ ok: true });
});

app.post("/api/logout", (_req, res) => {
  res.clearCookie("admin_session");
  res.json({ ok: true });
});

app.get("/api/session", (req, res) => {
  res.json({ authenticated: !!verifySession(getCookie(req, "admin_session")) });
});

function setCustomerCookie(res, customer) {
  res.cookie("customer_session", signSession({ id: customer.id, name: customer.name }), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: SESSION_MAX_AGE_MS
  });
}

app.post("/api/register", async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) return res.status(422).json({ error: "name, email and password are required" });
  const [existing] = await pool.query("SELECT id FROM customers WHERE email = ?", [email]);
  if (existing.length) return res.status(409).json({ error: "email already registered" });
  const [result] = await pool.query(
    "INSERT INTO customers (name, email, phone, password_hash) VALUES (?, ?, ?, ?)",
    [name, email, phone || null, hashPassword(password)]
  );
  setCustomerCookie(res, { id: result.insertId, name });
  res.status(201).json({ ok: true });
});

app.post("/api/customer-login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(422).json({ error: "email and password are required" });
  const [rows] = await pool.query("SELECT id, name, password_hash FROM customers WHERE email = ?", [email]);
  if (!rows.length || !verifyPassword(password, rows[0].password_hash)) {
    return res.status(401).json({ error: "invalid credentials" });
  }
  setCustomerCookie(res, rows[0]);
  res.json({ ok: true });
});

app.post("/api/customer-logout", (_req, res) => {
  res.clearCookie("customer_session");
  res.json({ ok: true });
});

app.get("/api/me", (req, res) => {
  const session = verifySession(getCookie(req, "customer_session"));
  res.json(session ? { authenticated: true, name: session.name } : { authenticated: false });
});

app.get("/api/favorites", async (req, res) => {
  const session = verifySession(getCookie(req, "customer_session"));
  if (!session) return res.json([]);
  const [rows] = await pool.query(
    "SELECT p.* FROM favorites f JOIN products p ON p.id = f.product_id WHERE f.customer_id = ? ORDER BY f.created_at DESC",
    [session.id]
  );
  res.json(rows);
});

app.post("/api/favorites/:productId", requireCustomer, async (req, res) => {
  await pool.query("INSERT IGNORE INTO favorites (customer_id, product_id) VALUES (?, ?)", [req.customerId, req.params.productId]);
  res.json({ ok: true });
});

app.delete("/api/favorites/:productId", requireCustomer, async (req, res) => {
  await pool.query("DELETE FROM favorites WHERE customer_id = ? AND product_id = ?", [req.customerId, req.params.productId]);
  res.json({ ok: true });
});

// Colunas de listagem: exclui faq/images/indicado/nao_indicado, usados só na página de detalhe
// do produto (que busca via /api/products/:id) — sozinhos eram ~39% do payload desta rota.
const PRODUCT_LIST_FIELDS = "id, name, brand, category, description, image_url, affiliate_url, price_from, price_to, installment, badge, tags, specs, rating_avg, rating_count, rating_dist, reviews, created_at, updated_at";

app.get("/api/products", async (_req, res) => {
  const [rows] = await pool.query(`SELECT ${PRODUCT_LIST_FIELDS} FROM products ORDER BY created_at DESC, id DESC`);
  res.set("Cache-Control", "public, max-age=60");
  res.json(rows);
});

app.get("/api/products/:id", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: "not found" });
  res.json(rows[0]);
});

const FIELDS = ["name", "brand", "category", "description", "image_url", "images", "affiliate_url", "price_from", "price_to", "installment", "badge", "tags", "specs", "indicado", "nao_indicado", "rating_avg", "rating_count", "rating_dist", "reviews", "frete", "garantia", "potencia", "voltagem"];

// An empty string sent for a numeric column (price, rating...) gets silently
// coerced to 0 by MySQL, which then renders as a fake "R$ 0,00" or "0 avaliações"
// on the storefront. Treat "" the same as null/undefined for every field.
function sqlValue(v) {
  return v === "" || v === undefined ? null : v;
}

app.post("/api/products", requireAdmin, async (req, res) => {
  if (!req.body.name || !req.body.affiliate_url) return res.status(422).json({ error: "name and affiliate_url are required" });
  const faq = JSON.stringify(generateFaq(req.body));
  const values = FIELDS.map(f => sqlValue(req.body[f]));
  const [result] = await pool.query(
    `INSERT INTO products (${FIELDS.join(", ")}, faq) VALUES (${FIELDS.map(() => "?").join(", ")}, ?)`,
    [...values, faq]
  );
  submitToIndexNow(`/produto/${result.insertId}`);
  res.status(201).json({ id: result.insertId });
});

app.put("/api/products/:id", requireAdmin, async (req, res) => {
  if (!req.body.name || !req.body.affiliate_url) return res.status(422).json({ error: "name and affiliate_url are required" });
  const [existingRows] = await pool.query("SELECT faq FROM products WHERE id = ?", [req.params.id]);
  const faq = existingRows[0]?.faq || JSON.stringify(generateFaq(req.body));
  const values = FIELDS.map(f => sqlValue(req.body[f]));
  await pool.query(
    `UPDATE products SET ${FIELDS.map(f => `${f}=?`).join(", ")}, faq=? WHERE id=?`,
    [...values, faq, req.params.id]
  );
  submitToIndexNow(`/produto/${req.params.id}`);
  res.json({ ok: true });
});

// Scoped endpoint for the automated price-check routine: only touches price_from/price_to,
// authenticated with a standalone API token instead of the admin session cookie.
app.patch("/api/products/:id/price", requirePriceToken, async (req, res) => {
  const { price_from, price_to } = req.body;
  if (price_from === undefined || price_to === undefined) {
    return res.status(422).json({ error: "price_from and price_to are required" });
  }
  const [result] = await pool.query(
    "UPDATE products SET price_from = ?, price_to = ? WHERE id = ?",
    [sqlValue(price_from), sqlValue(price_to), req.params.id]
  );
  if (!result.affectedRows) return res.status(404).json({ error: "not found" });
  res.json({ ok: true });
});

app.delete("/api/products/:id", requireAdmin, async (req, res) => {
  await pool.query("DELETE FROM products WHERE id = ?", [req.params.id]);
  submitToIndexNow(`/produto/${req.params.id}`);
  res.json({ ok: true });
});

app.post("/api/products/:id/view", async (req, res) => {
  await pool.query("UPDATE products SET view_count = view_count + 1 WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

app.post("/api/products/:id/click", async (req, res) => {
  await pool.query("UPDATE products SET click_count = click_count + 1 WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

app.get("/api/categories", async (_req, res) => {
  const [rows] = await pool.query("SELECT * FROM categories ORDER BY name ASC");
  res.set("Cache-Control", "public, max-age=60");
  res.json(rows);
});

app.post("/api/categories", requireAdmin, async (req, res) => {
  if (!req.body.name) return res.status(422).json({ error: "name is required" });
  const [result] = await pool.query(
    "INSERT INTO categories (name, image_url) VALUES (?, ?)",
    [req.body.name, req.body.image_url || null]
  );
  res.status(201).json({ id: result.insertId });
});

app.put("/api/categories/:id", requireAdmin, async (req, res) => {
  if (!req.body.name) return res.status(422).json({ error: "name is required" });
  await pool.query(
    "UPDATE categories SET name = ?, image_url = ? WHERE id = ?",
    [req.body.name, req.body.image_url || null, req.params.id]
  );
  res.json({ ok: true });
});

app.delete("/api/categories/:id", requireAdmin, async (req, res) => {
  await pool.query("DELETE FROM categories WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

async function uniquePostSlug(base, excludeId) {
  let n = 2;
  let candidate = slugify(base);
  while (true) {
    const [rows] = excludeId
      ? await pool.query("SELECT id FROM posts WHERE slug = ? AND id != ?", [candidate, excludeId])
      : await pool.query("SELECT id FROM posts WHERE slug = ?", [candidate]);
    if (!rows.length) return candidate;
    candidate = `${slugify(base)}-${n++}`;
  }
}

const POST_FIELDS = ["title", "excerpt", "content", "cover_image_url", "author", "category", "meta_description"];

app.get("/api/posts", async (_req, res) => {
  const [rows] = await pool.query("SELECT id, title, slug, excerpt, cover_image_url, author, category, published_at FROM posts WHERE published = 1 ORDER BY published_at DESC");
  res.set("Cache-Control", "public, max-age=60");
  res.json(rows);
});

app.get("/api/posts/:slug", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM posts WHERE slug = ? AND published = 1", [req.params.slug]);
  if (!rows.length) return res.status(404).json({ error: "not found" });
  res.json(rows[0]);
});

app.get("/api/admin/posts", requireAdmin, async (_req, res) => {
  const [rows] = await pool.query("SELECT id, title, slug, published, published_at, updated_at FROM posts ORDER BY updated_at DESC");
  res.json(rows);
});

app.get("/api/admin/posts/:id", requireAdmin, async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM posts WHERE id = ?", [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: "not found" });
  res.json(rows[0]);
});

app.post("/api/admin/posts", requireAdmin, async (req, res) => {
  if (!req.body.title) return res.status(422).json({ error: "title is required" });
  const slug = await uniquePostSlug(req.body.slug || req.body.title);
  const published = req.body.published ? 1 : 0;
  const values = POST_FIELDS.map(f => req.body[f] ?? null);
  const [result] = await pool.query(
    `INSERT INTO posts (${POST_FIELDS.join(", ")}, slug, published, published_at) VALUES (${POST_FIELDS.map(() => "?").join(", ")}, ?, ?, ?)`,
    [...values, slug, published, published ? new Date() : null]
  );
  if (published) submitToIndexNow(`/blog/${slug}`);
  res.status(201).json({ id: result.insertId, slug });
});

app.put("/api/admin/posts/:id", requireAdmin, async (req, res) => {
  if (!req.body.title) return res.status(422).json({ error: "title is required" });
  const [existingRows] = await pool.query("SELECT slug, published, published_at FROM posts WHERE id = ?", [req.params.id]);
  if (!existingRows.length) return res.status(404).json({ error: "not found" });
  const existing = existingRows[0];
  const slug = req.body.slug && slugify(req.body.slug) !== existing.slug ? await uniquePostSlug(req.body.slug, req.params.id) : existing.slug;
  const published = req.body.published ? 1 : 0;
  const publishedAt = published && !existing.published_at ? new Date() : existing.published_at;
  const values = POST_FIELDS.map(f => req.body[f] ?? null);
  await pool.query(
    `UPDATE posts SET ${POST_FIELDS.map(f => `${f}=?`).join(", ")}, slug=?, published=?, published_at=? WHERE id=?`,
    [...values, slug, published, publishedAt, req.params.id]
  );
  if (published) submitToIndexNow(`/blog/${slug}`);
  res.json({ ok: true });
});

// Categorias fixas do blog — a rotina automática só pode usar uma destas.
const BLOG_CATEGORIES = ["Guia de Compra", "Comparativos", "Aspiradores Robô", "Aspiradores Verticais", "Manutenção e Cuidados", "Dicas de Limpeza", "Reviews de Produtos", "Tendências e Tecnologia"];

// Endpoint escopado para a automação de conteúdo do blog: sempre publica direto,
// autenticado com token dedicado (não a sessão de admin).
app.post("/api/posts/automation", requireBlogToken, async (req, res) => {
  const { title, excerpt, content, cover_image_url, author, category, meta_description } = req.body;
  if (!title || !content) return res.status(422).json({ error: "title and content are required" });
  if (!BLOG_CATEGORIES.includes(category)) {
    return res.status(422).json({ error: `category must be one of: ${BLOG_CATEGORIES.join(", ")}` });
  }
  const slug = await uniquePostSlug(req.body.slug || title);
  const values = [title, excerpt ?? null, content, cover_image_url ?? null, author || "Equipe Promo Aspiradores", category, meta_description ?? null];
  const [result] = await pool.query(
    `INSERT INTO posts (${POST_FIELDS.join(", ")}, slug, published, published_at) VALUES (${POST_FIELDS.map(() => "?").join(", ")}, ?, 1, ?)`,
    [...values, slug, new Date()]
  );
  submitToIndexNow(`/blog/${slug}`);
  res.status(201).json({ id: result.insertId, slug });
});

// Edição pontual de um post já publicado pela automação (mesmo token, mesmos campos).
app.patch("/api/posts/automation/:id", requireBlogToken, async (req, res) => {
  const [existingRows] = await pool.query("SELECT slug FROM posts WHERE id = ?", [req.params.id]);
  if (!existingRows.length) return res.status(404).json({ error: "not found" });
  if (req.body.category !== undefined && !BLOG_CATEGORIES.includes(req.body.category)) {
    return res.status(422).json({ error: `category must be one of: ${BLOG_CATEGORIES.join(", ")}` });
  }
  const fields = POST_FIELDS.filter(f => req.body[f] !== undefined);
  if (!fields.length) return res.status(422).json({ error: "no fields to update" });
  await pool.query(
    `UPDATE posts SET ${fields.map(f => `${f}=?`).join(", ")} WHERE id=?`,
    [...fields.map(f => req.body[f]), req.params.id]
  );
  submitToIndexNow(`/blog/${existingRows[0].slug}`);
  res.json({ ok: true, slug: existingRows[0].slug });
});

app.delete("/api/admin/posts/:id", requireAdmin, async (req, res) => {
  const [rows] = await pool.query("SELECT slug FROM posts WHERE id = ?", [req.params.id]);
  await pool.query("DELETE FROM posts WHERE id = ?", [req.params.id]);
  if (rows[0]) submitToIndexNow(`/blog/${rows[0].slug}`);
  res.json({ ok: true });
});

app.get("/api/customers", requireAdmin, async (_req, res) => {
  const [rows] = await pool.query("SELECT id, name, email, phone, created_at FROM customers ORDER BY created_at DESC");
  res.json(rows);
});

app.put("/api/customers/:id", requireAdmin, async (req, res) => {
  if (!req.body.name || !req.body.email) return res.status(422).json({ error: "name and email are required" });
  await pool.query(
    "UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ?",
    [req.body.name, req.body.email, req.body.phone || null, req.params.id]
  );
  res.json({ ok: true });
});

app.delete("/api/customers/:id", requireAdmin, async (req, res) => {
  await pool.query("DELETE FROM favorites WHERE customer_id = ?", [req.params.id]);
  await pool.query("DELETE FROM customers WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

app.get("/api/admin-users", requireAdmin, async (_req, res) => {
  const [rows] = await pool.query("SELECT id, email FROM admin_users ORDER BY email ASC");
  res.json(rows);
});

app.post("/api/admin-users", requireAdmin, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(422).json({ error: "email and password are required" });
  const [existing] = await pool.query("SELECT id FROM admin_users WHERE email = ?", [email]);
  if (existing.length) return res.status(409).json({ error: "email already registered" });
  const [result] = await pool.query(
    "INSERT INTO admin_users (email, password_hash) VALUES (?, ?)",
    [email, hashPassword(password)]
  );
  res.status(201).json({ id: result.insertId });
});

app.put("/api/admin-users/:id", requireAdmin, async (req, res) => {
  const { email, password } = req.body;
  if (!email) return res.status(422).json({ error: "email is required" });
  if (password) {
    await pool.query("UPDATE admin_users SET email = ?, password_hash = ? WHERE id = ?", [email, hashPassword(password), req.params.id]);
  } else {
    await pool.query("UPDATE admin_users SET email = ? WHERE id = ?", [email, req.params.id]);
  }
  res.json({ ok: true });
});

app.delete("/api/admin-users/:id", requireAdmin, async (req, res) => {
  const [[{ n }]] = await pool.query("SELECT COUNT(*) AS n FROM admin_users");
  if (n <= 1) return res.status(422).json({ error: "cannot delete the last remaining admin" });
  await pool.query("DELETE FROM admin_users WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

app.get("/api/dashboard", requireAdmin, async (_req, res) => {
  const [[{ totalProdutos }]] = await pool.query("SELECT COUNT(*) AS totalProdutos FROM products");
  const [[{ totalCategorias }]] = await pool.query("SELECT COUNT(*) AS totalCategorias FROM categories");
  const [[{ totalClientes }]] = await pool.query("SELECT COUNT(*) AS totalClientes FROM customers");
  const [[{ totalFavoritos }]] = await pool.query("SELECT COUNT(*) AS totalFavoritos FROM favorites");
  const [[{ mediaGeral, somaAvaliacoes }]] = await pool.query(
    "SELECT COALESCE(SUM(rating_avg * rating_count) / SUM(rating_count), 0) AS mediaGeral, COALESCE(SUM(rating_count), 0) AS somaAvaliacoes FROM products WHERE rating_count > 0"
  );
  const [[{ totalViews, totalCliques }]] = await pool.query(
    "SELECT COALESCE(SUM(view_count), 0) AS totalViews, COALESCE(SUM(click_count), 0) AS totalCliques FROM products"
  );
  const [maisVistos] = await pool.query("SELECT id, name, view_count FROM products ORDER BY view_count DESC, id ASC LIMIT 5");
  const [maisClicados] = await pool.query("SELECT id, name, click_count FROM products ORDER BY click_count DESC, id ASC LIMIT 5");
  const [maisDesejados] = await pool.query(
    "SELECT p.id, p.name, COUNT(*) AS favoritos FROM favorites f JOIN products p ON p.id = f.product_id GROUP BY p.id, p.name ORDER BY favoritos DESC LIMIT 5"
  );
  res.json({
    totais: { totalProdutos, totalCategorias, totalClientes, totalFavoritos, mediaGeral: Number(mediaGeral), somaAvaliacoes, totalViews, totalCliques },
    maisVistos,
    maisClicados,
    maisDesejados
  });
});

app.get("/api/settings", requireAdmin, async (_req, res) => {
  const settings = await getSettings();
  res.json({ ga_measurement_id: settings.ga_measurement_id || "", search_console_meta: settings.search_console_meta || "" });
});

app.put("/api/settings", requireAdmin, async (req, res) => {
  const { ga_measurement_id = "", search_console_meta = "" } = req.body;
  if (ga_measurement_id && !/^[A-Za-z0-9-]+$/.test(ga_measurement_id)) {
    return res.status(422).json({ error: "ID do Google Analytics inválido" });
  }
  await setSettings({ ga_measurement_id, search_console_meta });
  res.json({ ok: true });
});

app.get("/sitemap.xml", async (_req, res) => {
  const [products] = await pool.query("SELECT id, name, category, image_url, updated_at FROM products");
  const [categories] = await pool.query("SELECT name FROM categories");
  const [posts] = await pool.query("SELECT slug, content, cover_image_url, updated_at FROM posts WHERE published = 1");
  const urls = [
    { loc: `${SITE_URL}/`, priority: 1.0, changefreq: "daily" },
    { loc: `${SITE_URL}/categoria`, priority: 0.8, changefreq: "daily" },
    { loc: `${SITE_URL}/blog`, priority: 0.6, changefreq: "weekly" },
    { loc: `${SITE_URL}/contato`, priority: 0.3, changefreq: "monthly" },
    { loc: `${SITE_URL}/politica-de-cookies`, priority: 0.1, changefreq: "yearly" },
    { loc: `${SITE_URL}/politica-de-privacidade`, priority: 0.1, changefreq: "yearly" },
    { loc: `${SITE_URL}/politica-de-uso`, priority: 0.1, changefreq: "yearly" },
    ...categories.map(c => ({ loc: `${SITE_URL}/categoria?cat=${encodeURIComponent(c.name)}`, priority: 0.7, changefreq: "daily" })),
    ...products.map(p => ({ loc: productUrl(p), priority: 0.9, changefreq: "weekly", lastmod: new Date(p.updated_at).toISOString().slice(0, 10), image: p.image_url || undefined })),
    ...posts.map(p => {
      const inlineImages = [...(p.content || "").matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map(m => m[1]);
      const images = [p.cover_image_url, ...inlineImages].filter(Boolean);
      return { loc: `${SITE_URL}/blog/${p.slug}`, priority: 0.6, changefreq: "monthly", lastmod: new Date(p.updated_at).toISOString().slice(0, 10), image: images.length ? images : undefined };
    })
  ];
  res.set("Content-Type", "application/xml").send(buildSitemapXml(urls));
});

app.use(express.static(distDir, { index: false }));

const escapeAttr = (s) => s.replace(/"/g, "&quot;");

app.get("*", async (req, res) => {
  const indexPath = path.join(distDir, "index.html");
  let html = await fs.readFile(indexPath, "utf-8");

  const seoData = {};
  const produtoMatch = req.path.match(/^\/produto\/(?:.*-)?(\d+)$/);
  if (produtoMatch) {
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [produtoMatch[1]]);
    if (rows[0]) {
      const canonicalPath = productUrl(rows[0]).replace(SITE_URL, "");
      if (req.path !== canonicalPath) return res.redirect(301, canonicalPath);
      seoData.product = rows[0];
    } else {
      seoData.productNotFound = true;
    }
  }
  const postMatch = req.path.match(/^\/blog\/([^/]+)$/);
  if (postMatch) {
    const [rows] = await pool.query("SELECT * FROM posts WHERE slug = ? AND published = 1", [postMatch[1]]);
    if (rows[0]) seoData.post = rows[0];
    else seoData.postNotFound = true;
  }
  if (req.path === "/categoria" && req.query.cat) {
    const [rows] = await pool.query("SELECT id, name FROM products WHERE category = ?", [req.query.cat]);
    seoData.categoryProducts = rows;
  }

  const meta = getPageMeta(req.path, req.query, seoData);
  html = injectMeta(html, meta);

  const settings = await getSettings().catch(() => ({}));
  if (settings.search_console_meta) {
    html = html.replace("</head>", `  <meta name="google-site-verification" content="${escapeAttr(settings.search_console_meta)}" />\n</head>`);
  }
  if (settings.ga_measurement_id && /^[A-Za-z0-9-]+$/.test(settings.ga_measurement_id)) {
    const id = settings.ga_measurement_id;
    // ponytail: gtag.js só carrega na 1ª interação ou 6s após o load (custava ~1s de CPU no carregamento); visitas que saem antes disso não são contadas
    html = html.replace(
      "</head>",
      `  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${id}");(function(){var l=0;function go(){if(l)return;l=1;var s=document.createElement("script");s.async=true;s.src="https://www.googletagmanager.com/gtag/js?id=${id}";document.head.appendChild(s);}["scroll","pointerdown","keydown","touchstart"].forEach(function(e){addEventListener(e,go,{once:true,passive:true});});addEventListener("load",function(){setTimeout(go,6000);});})();</script>\n</head>`
    );
  }
  if (!req.path.startsWith("/admin")) {
    const preloads = [];
    const fetchPreload = (href) => `<link rel="preload" as="fetch" href="${href}" crossorigin="anonymous" />`;
    if (!req.path.startsWith("/blog")) preloads.push(fetchPreload("/api/categories"));
    if (["/", "/categoria", "/busca", "/comparar"].includes(req.path) || req.path.startsWith("/produto/")) preloads.push(fetchPreload("/api/products"));
    if (seoData.product) {
      preloads.push(fetchPreload(`/api/products/${seoData.product.id}`));
      if (seoData.product.image_url) preloads.push(`<link rel="preload" as="image" href="${escapeAttr(sizedImage(seoData.product.image_url, 800))}" fetchpriority="high" />`);
    }
    if (req.path === "/") {
      const [heroRows] = await pool.query("SELECT image_url FROM products ORDER BY created_at DESC, id DESC");
      const hero = heroRows.length ? heroRows[Math.floor(Date.now() / 3600000) % heroRows.length] : null;
      if (hero?.image_url) preloads.push(`<link rel="preload" as="image" href="${escapeAttr(sizedImage(hero.image_url, 700))}" fetchpriority="high" />`);
    }
    if (preloads.length && !meta.notFound) html = html.replace("</head>", `  ${preloads.join("\n  ")}\n</head>`);
  }
  res.status(meta.notFound ? 404 : 200).set("Content-Type", "text/html").send(html);
});

ensureSchema()
  .then(() => app.listen(port, () => console.log(`Server running on port ${port}`)))
  .catch(err => {
    console.error("Failed to initialize database schema:", err);
    process.exit(1);
  });
