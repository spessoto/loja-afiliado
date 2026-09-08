import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
      affiliate_url VARCHAR(500) NOT NULL,
      price_from DECIMAL(10,2),
      price_to DECIMAL(10,2),
      installment VARCHAR(120),
      badge VARCHAR(120),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
}
