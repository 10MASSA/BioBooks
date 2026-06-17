import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../.env') })

async function main() {
  console.log('Connecting to MySQL to initialize the database...')
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || '3306'),
      multipleStatements: true
    })

    const schemaPath = path.join(__dirname, 'schema.sql')
    const sql = fs.readFileSync(schemaPath, 'utf8')

    console.log('Executing schema.sql...')
    await connection.query(sql)
    console.log('Database and tables initialized successfully! ✅')
    await connection.end()
  } catch (error) {
    console.error('Failed to initialize database:', error)
    process.exit(1)
  }
}

main()
