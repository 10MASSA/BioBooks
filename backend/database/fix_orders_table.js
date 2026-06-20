import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, '../.env') })

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'biobooks',
    port: parseInt(process.env.DB_PORT || '3306'),
  })

  const [rows] = await conn.execute('DESCRIBE orders')
  const existing = rows.map((r) => r.Field)
  console.log('Existing columns:', existing.join(', '))

  if (!existing.includes('product_type')) {
    await conn.execute("ALTER TABLE orders ADD COLUMN product_type VARCHAR(50) NOT NULL DEFAULT 'pack' AFTER address")
    console.log('✅ Added product_type')
  } else {
    console.log('⏭ product_type already exists')
  }

  if (!existing.includes('product_name')) {
    await conn.execute("ALTER TABLE orders ADD COLUMN product_name VARCHAR(200) NOT NULL DEFAULT '' AFTER product_type")
    console.log('✅ Added product_name')
  } else {
    console.log('⏭ product_name already exists')
  }

  if (!existing.includes('unit_price')) {
    await conn.execute('ALTER TABLE orders ADD COLUMN unit_price DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER product_name')
    console.log('✅ Added unit_price')
  } else {
    console.log('⏭ unit_price already exists')
  }

  const [updated] = await conn.execute('DESCRIBE orders')
  console.log('\nFinal table structure:')
  updated.forEach((r) => console.log(` - ${r.Field} (${r.Type})`))

  await conn.end()
  console.log('\n✅ Table fixed successfully!')
}

main().catch((e) => {
  console.error('❌ Error:', e.message)
  process.exit(1)
})
