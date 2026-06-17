import { Router } from 'express'
import jwt from 'jsonwebtoken'
import * as XLSX from 'xlsx'
import pool from '../config/db.js'
import { authMiddleware, verifyToken } from '../middleware/auth.js'

const router = Router()

router.post('/login', (req, res) => {
  const { password } = req.body
  if (password !== (process.env.ADMIN_PASSWORD || 'admin123')) {
    return res.status(401).json({ error: 'Invalid password' })
  }

  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' })
  res.json({ token })
})

router.get('/orders', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM orders ORDER BY created_at DESC')
    res.json(rows)
  } catch (err) {
    console.error('Fetch orders error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.patch('/orders/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id])
    res.json({ message: 'Status updated' })
  } catch (err) {
    console.error('Update status error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/orders/:id', authMiddleware, async (req, res) => {
  try {
    await pool.execute('DELETE FROM orders WHERE id = ?', [req.params.id])
    res.json({ message: 'Order deleted' })
  } catch (err) {
    console.error('Delete order error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/orders/export', async (req, res) => {
  const token = req.query.token || req.headers.authorization?.split(' ')[1]
  if (!token || !verifyToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM orders ORDER BY created_at DESC')

    const data = rows.map((o) => ({
      ID: o.id,
      Prénom: o.first_name,
      Nom: o.last_name,
      Téléphone: o.phone,
      Wilaya: o.wilaya,
      Commune: o.commune,
      Adresse: o.address,
      Produit: o.product_name || o.product_type || 'pack',
      'Prix unitaire': o.unit_price,
      Quantité: o.quantity,
      'Sous-total': o.subtotal,
      'Frais livraison': o.delivery_fee,
      Total: o.total,
      Statut: o.status,
      Date: new Date(o.created_at).toLocaleString('fr-DZ'),
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Commandes')

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=commandes_${Date.now()}.xlsx`)
    res.send(buffer)
  } catch (err) {
    console.error('Export error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
