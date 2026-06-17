import { Router } from 'express'
import pool from '../config/db.js'

const router = Router()

const VALID_PRODUCTS = ['book1', 'book2', 'pack']

router.post('/', async (req, res) => {
  try {
    const {
      first_name, last_name, phone, wilaya, commune, address,
      product_type, product_name, unit_price,
      quantity, subtotal, delivery_fee, total,
    } = req.body

    if (!first_name || !last_name || !phone || !wilaya || !commune || !address) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const type = VALID_PRODUCTS.includes(product_type) ? product_type : 'pack'

    const [result] = await pool.execute(
      `INSERT INTO orders (first_name, last_name, phone, wilaya, commune, address, product_type, product_name, unit_price, quantity, subtotal, delivery_fee, total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        first_name, last_name, phone, wilaya, commune, address,
        type, product_name || type, unit_price || 0,
        quantity || 1, subtotal, delivery_fee, total,
      ]
    )

    res.status(201).json({ id: result.insertId, message: 'Order created' })
  } catch (err) {
    console.error('Order creation error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
