import mysql from "mysql2/promise";

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
}
