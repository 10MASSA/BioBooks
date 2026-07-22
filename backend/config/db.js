import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const isTiDBOrSSL = process.env.DB_SSL === 'true' || (process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud.com'))

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
  ...(isTiDBOrSSL ? { ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: false } } : {}),
})

export default pool
