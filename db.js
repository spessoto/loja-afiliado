import mysql from "mysql2/promise";
import crypto from "node:crypto";

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
}
