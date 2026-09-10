import { Router } from 'express'
import pool from '../config/db.js'

const router = Router()

const VALID_PRODUCTS = ['book1', 'book2', 'pack']

// 🟢 GET ALL ORDERS
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM orders')
    res.json(rows)
  } catch (err) {
    console.error('GET orders error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// 🟢 GET ORDER BY ID (BONUS utile)
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM orders WHERE id = ?',
      [req.params.id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json(rows[0])
  } catch (err) {
    console.error('GET order by id error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// 🟢 CREATE ORDER
router.post('/', async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      phone,
      wilaya,
      commune,
      address,
      product_type,
      product_name,
      unit_price,
      quantity,
      subtotal,
      delivery_fee,
      total,
    } = req.body

    // validation minimale
    if (!first_name || !last_name || !phone || !wilaya || !commune || !address) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const type = VALID_PRODUCTS.includes(product_type) ? product_type : 'pack'

    const [result] = await pool.execute(
      `INSERT INTO orders 
      (first_name, last_name, phone, wilaya, commune, address, product_type, product_name, unit_price, quantity, subtotal, delivery_fee, total)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        first_name,
        last_name,
        phone,
        wilaya,
        commune,
        address,
        type,
        product_name || type,
        unit_price || 0,
        quantity || 1,
        subtotal || 0,
        delivery_fee || 0,
        total || 0,
      ]
    )

    res.status(201).json({
      id: result.insertId,
      message: 'Order created successfully',
    })
  } catch (err) {
    console.error('POST order error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// 🟢 DELETE ORDER (utile admin)
router.delete('/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM orders WHERE id = ?', [req.params.id])
    res.json({ message: 'Order deleted' })
  } catch (err) {
    console.error('DELETE order error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
