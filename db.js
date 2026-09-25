import mysql from "mysql2/promise";
import crypto from "node:crypto";
import { generateFaq } from "./faq.js";

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  const check = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(check, "hex"));
}

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: "utf8mb4",
  waitForConnections: true,
  connectionLimit: 5
});

export async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      brand VARCHAR(120),
      category VARCHAR(120),
      description TEXT,
      image_url VARCHAR(500),
      images TEXT,
      affiliate_url VARCHAR(500) NOT NULL,
      price_from DECIMAL(10,2),
      price_to DECIMAL(10,2),
      installment VARCHAR(120),
      badge VARCHAR(120),
      tags TEXT,
      specs TEXT,
      indicado TEXT,
      nao_indicado TEXT,
      rating_avg DECIMAL(2,1),
      rating_count INT,
      rating_dist TEXT,
      reviews TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
  await pool.query(`ALTER TABLE products CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS tags TEXT`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS specs TEXT`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS indicado TEXT`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS nao_indicado TEXT`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS rating_avg DECIMAL(2,1)`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS rating_count INT`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS rating_dist TEXT`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS reviews TEXT`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS frete VARCHAR(120)`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS garantia VARCHAR(120)`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS potencia VARCHAR(60)`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS voltagem VARCHAR(60)`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS view_count INT DEFAULT 0`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS click_count INT DEFAULT 0`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS faq TEXT`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS analise TEXT`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS canonical_id INT NULL`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
  const seedEmail = "agencia@stagesix.com.br";
  const [existing] = await pool.query("SELECT id FROM admin_users WHERE email = ?", [seedEmail]);
  if (!existing.length) {
    await pool.query("INSERT INTO admin_users (email, password_hash) VALUES (?, ?)", [seedEmail, hashPassword("23456")]);
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(40),
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_id INT NOT NULL,
      product_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_customer_product (customer_id, product_id)
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL UNIQUE,
      image_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
  await pool.query(`ALTER TABLE categories ADD COLUMN IF NOT EXISTS seo_title VARCHAR(160)`);
  await pool.query(`ALTER TABLE categories ADD COLUMN IF NOT EXISTS intro TEXT`);
  const [existingCategories] = await pool.query("SELECT COUNT(*) AS n FROM categories");
  if (existingCategories[0].n === 0) {
    const seedNames = ["Aspiradores", "Robôs", "Vertical", "Portáteis", "Extratoras", "Profissionais", "Acessórios"];
    for (const name of seedNames) {
      await pool.query("INSERT INTO categories (name) VALUES (?)", [name]);
    }
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS settings (
      setting_key VARCHAR(80) PRIMARY KEY,
      setting_value TEXT
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  const [allProducts] = await pool.query("SELECT * FROM products");
  for (const row of allProducts) {
    await pool.query("UPDATE products SET faq = ? WHERE id = ?", [JSON.stringify(generateFaq(row)), row.id]);
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS product_redirects (
      product_id INT PRIMARY KEY,
      category VARCHAR(120),
      deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  // Backfill único: produto 53 foi excluído pela rotina de preços antes do redirecionamento existir
  await pool.query("INSERT IGNORE INTO product_redirects (product_id, category) VALUES (53, 'Robôs')");

  // Backfill único (guardado em settings para não desfazer edições futuras): produtos duplicados apontam para a página principal
  try {
    const [jaFeito] = await pool.query("SELECT 1 FROM settings WHERE setting_key = 'backfill_canonical_v1'");
    if (!jaFeito.length) {
      for (const [id, principal] of [[42, 9], [21, 11], [33, 20], [17, 46]]) {
        await pool.query("UPDATE products SET canonical_id = ? WHERE id = ? AND canonical_id IS NULL AND EXISTS (SELECT 1 FROM (SELECT id FROM products WHERE id = ?) x)", [principal, id, principal]);
      }
      await pool.query("INSERT INTO settings (setting_key, setting_value) VALUES ('backfill_canonical_v1', '1')");
    }
  } catch (err) {
    console.error("Backfill de canonicals falhou:", err.message);
  }

  // Backfill dos textos de categoria: só preenche o que ainda está vazio
  try {
    const { readFile } = await import("node:fs/promises");
    const cats = JSON.parse(await readFile(new URL("./categorias.json", import.meta.url), "utf-8"));
    for (const [nome, c] of Object.entries(cats)) {
      await pool.query("UPDATE categories SET seo_title = ?, intro = ? WHERE name = ? AND (intro IS NULL OR intro = '')", [c.seo_title, c.intro, nome]);
    }
  } catch (err) {
    if (err.code !== "ENOENT") console.error("Backfill de categorias falhou:", err.message);
  }

  // Backfill único da "Análise Promo Aspiradores": só preenche produtos que ainda não têm texto (não sobrescreve edições)
  try {
    const { readFile } = await import("node:fs/promises");
    const analises = JSON.parse(await readFile(new URL("./analises.json", import.meta.url), "utf-8"));
    for (const [id, texto] of Object.entries(analises)) {
      await pool.query("UPDATE products SET analise = ? WHERE id = ? AND (analise IS NULL OR analise = '')", [texto, id]);
    }
  } catch (err) {
    if (err.code !== "ENOENT") console.error("Backfill de análises falhou:", err.message);
  }

  // Versão longa (300+ palavras) dos produtos principais: só troca se o texto ainda for a versão curta original ou vazio
  try {
    const { readFile } = await import("node:fs/promises");
    const longas = JSON.parse(await readFile(new URL("./analises-longas.json", import.meta.url), "utf-8"));
    const curtas = JSON.parse(await readFile(new URL("./analises.json", import.meta.url), "utf-8"));
    for (const [id, texto] of Object.entries(longas)) {
      await pool.query("UPDATE products SET analise = ? WHERE id = ? AND (analise IS NULL OR analise = '' OR analise = ?)", [texto, id, curtas[id]]);
    }
  } catch (err) {
    if (err.code !== "ENOENT") console.error("Backfill de análises longas falhou:", err.message);
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      excerpt TEXT,
      content LONGTEXT,
      cover_image_url VARCHAR(500),
      author VARCHAR(120),
      category VARCHAR(120),
      meta_description VARCHAR(300),
      published TINYINT(1) NOT NULL DEFAULT 0,
      published_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
}

export async function getSettings() {
  const [rows] = await pool.query("SELECT setting_key, setting_value FROM settings");
  return Object.fromEntries(rows.map(r => [r.setting_key, r.setting_value]));
}

export async function setSettings(values) {
  for (const [key, value] of Object.entries(values)) {
    await pool.query(
      "INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)",
      [key, value || ""]
    );
  }
}
