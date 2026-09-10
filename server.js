import express from "express";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import { pool, ensureSchema, hashPassword, verifyPassword, getSettings, setSettings } from "./db.js";
import { generateFaq } from "./faq.js";
import { getPageMeta, injectMeta, buildSitemapXml, SITE_URL } from "./seo.js";
import { slugify } from "./slug.js";

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

app.get("/api/favorites", requireCustomer, async (req, res) => {
  const [rows] = await pool.query(
    "SELECT p.* FROM favorites f JOIN products p ON p.id = f.product_id WHERE f.customer_id = ? ORDER BY f.created_at DESC",
    [req.customerId]
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

app.get("/api/products", async (_req, res) => {
  const [rows] = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
  res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  res.json(rows);
});

app.get("/api/products/:id", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: "not found" });
  res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  res.json(rows[0]);
});

const FIELDS = ["name", "brand", "category", "description", "image_url", "images", "affiliate_url", "price_from", "price_to", "installment", "badge", "tags", "specs", "indicado", "nao_indicado", "rating_avg", "rating_count", "rating_dist", "reviews", "frete", "garantia", "potencia", "voltagem"];

app.post("/api/products", requireAdmin, async (req, res) => {
  if (!req.body.name || !req.body.affiliate_url) return res.status(422).json({ error: "name and affiliate_url are required" });
  const faq = JSON.stringify(generateFaq(req.body));
  const values = FIELDS.map(f => req.body[f] ?? null);
  const [result] = await pool.query(
    `INSERT INTO products (${FIELDS.join(", ")}, faq) VALUES (${FIELDS.map(() => "?").join(", ")}, ?)`,
    [...values, faq]
  );
  res.status(201).json({ id: result.insertId });
});

app.put("/api/products/:id", requireAdmin, async (req, res) => {
  if (!req.body.name || !req.body.affiliate_url) return res.status(422).json({ error: "name and affiliate_url are required" });
  const [existingRows] = await pool.query("SELECT faq FROM products WHERE id = ?", [req.params.id]);
  const faq = existingRows[0]?.faq || JSON.stringify(generateFaq(req.body));
  const values = FIELDS.map(f => req.body[f] ?? null);
  await pool.query(
    `UPDATE products SET ${FIELDS.map(f => `${f}=?`).join(", ")}, faq=? WHERE id=?`,
    [...values, faq, req.params.id]
  );
  res.json({ ok: true });
});

app.delete("/api/products/:id", requireAdmin, async (req, res) => {
  await pool.query("DELETE FROM products WHERE id = ?", [req.params.id]);
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
  res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
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
  res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
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
  res.json({ ok: true });
});

app.delete("/api/admin/posts/:id", requireAdmin, async (req, res) => {
  await pool.query("DELETE FROM posts WHERE id = ?", [req.params.id]);
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
  const [maisVistos] = await pool.query("SELECT id, name, view_count FROM products ORDER BY view_count DESC, id ASC LIMIT 5");
  const [maisClicados] = await pool.query("SELECT id, name, click_count FROM products ORDER BY click_count DESC, id ASC LIMIT 5");
  const [maisDesejados] = await pool.query(
    "SELECT p.id, p.name, COUNT(*) AS favoritos FROM favorites f JOIN products p ON p.id = f.product_id GROUP BY p.id, p.name ORDER BY favoritos DESC LIMIT 5"
  );
  res.json({
    totais: { totalProdutos, totalCategorias, totalClientes, totalFavoritos, mediaGeral: Number(mediaGeral), somaAvaliacoes },
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
  const [products] = await pool.query("SELECT id, category, image_url, updated_at FROM products");
  const [categories] = await pool.query("SELECT name FROM categories");
  const [posts] = await pool.query("SELECT slug, cover_image_url, updated_at FROM posts WHERE published = 1");
  const urls = [
    { loc: `${SITE_URL}/`, priority: 1.0, changefreq: "daily" },
    { loc: `${SITE_URL}/categoria`, priority: 0.8, changefreq: "daily" },
    { loc: `${SITE_URL}/blog`, priority: 0.6, changefreq: "weekly" },
    { loc: `${SITE_URL}/contato`, priority: 0.3, changefreq: "monthly" },
    { loc: `${SITE_URL}/politica-de-cookies`, priority: 0.1, changefreq: "yearly" },
    { loc: `${SITE_URL}/politica-de-privacidade`, priority: 0.1, changefreq: "yearly" },
    { loc: `${SITE_URL}/politica-de-uso`, priority: 0.1, changefreq: "yearly" },
    ...categories.map(c => ({ loc: `${SITE_URL}/categoria?cat=${encodeURIComponent(c.name)}`, priority: 0.7, changefreq: "daily" })),
    ...products.map(p => ({ loc: `${SITE_URL}/produto/${p.id}`, priority: 0.9, changefreq: "weekly", lastmod: new Date(p.updated_at).toISOString().slice(0, 10), image: p.image_url || undefined })),
    ...posts.map(p => ({ loc: `${SITE_URL}/blog/${p.slug}`, priority: 0.6, changefreq: "monthly", lastmod: new Date(p.updated_at).toISOString().slice(0, 10), image: p.cover_image_url || undefined }))
  ];
  res.set("Content-Type", "application/xml").send(buildSitemapXml(urls));
});

app.use(express.static(distDir, { index: false }));

const escapeAttr = (s) => s.replace(/"/g, "&quot;");

app.get("*", async (req, res) => {
  const indexPath = path.join(distDir, "index.html");
  let html = await fs.readFile(indexPath, "utf-8");

  const seoData = {};
  const produtoMatch = req.path.match(/^\/produto\/(\d+)$/);
  if (produtoMatch) {
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [produtoMatch[1]]);
    if (rows[0]) seoData.product = rows[0];
    else seoData.productNotFound = true;
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
    html = html.replace(
      "</head>",
      `  <script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>\n  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${id}");</script>\n</head>`
    );
  }
  res.status(meta.notFound ? 404 : 200).set("Content-Type", "text/html").send(html);
});

ensureSchema()
  .then(() => app.listen(port, () => console.log(`Server running on port ${port}`)))
  .catch(err => {
    console.error("Failed to initialize database schema:", err);
    process.exit(1);
  });
