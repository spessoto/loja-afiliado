import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool, ensureSchema } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "dist");
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

function requireAdmin(req, res, next) {
  if (req.get("x-admin-token") !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
}

app.get("/api/products", async (_req, res) => {
  const [rows] = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
  res.json(rows);
});

app.get("/api/products/:id", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: "not found" });
  res.json(rows[0]);
});

app.post("/api/products", requireAdmin, async (req, res) => {
  const { name, brand, category, description, image_url, affiliate_url, price_from, price_to, installment, badge } = req.body;
  if (!name || !affiliate_url) return res.status(422).json({ error: "name and affiliate_url are required" });
  const [result] = await pool.query(
    `INSERT INTO products (name, brand, category, description, image_url, affiliate_url, price_from, price_to, installment, badge)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, brand ?? null, category ?? null, description ?? null, image_url ?? null, affiliate_url, price_from ?? null, price_to ?? null, installment ?? null, badge ?? null]
  );
  res.status(201).json({ id: result.insertId });
});

app.put("/api/products/:id", requireAdmin, async (req, res) => {
  const { name, brand, category, description, image_url, affiliate_url, price_from, price_to, installment, badge } = req.body;
  if (!name || !affiliate_url) return res.status(422).json({ error: "name and affiliate_url are required" });
  await pool.query(
    `UPDATE products SET name=?, brand=?, category=?, description=?, image_url=?, affiliate_url=?, price_from=?, price_to=?, installment=?, badge=? WHERE id=?`,
    [name, brand ?? null, category ?? null, description ?? null, image_url ?? null, affiliate_url, price_from ?? null, price_to ?? null, installment ?? null, badge ?? null, req.params.id]
  );
  res.json({ ok: true });
});

app.delete("/api/products/:id", requireAdmin, async (req, res) => {
  await pool.query("DELETE FROM products WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

app.use(express.static(distDir));
app.get("*", (_req, res) => res.sendFile(path.join(distDir, "index.html")));

ensureSchema()
  .then(() => app.listen(port, () => console.log(`Server running on port ${port}`)))
  .catch(err => {
    console.error("Failed to initialize database schema:", err);
    process.exit(1);
  });
