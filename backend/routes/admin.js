import { Router } from 'express'
import jwt from 'jsonwebtoken'
import * as XLSX from 'xlsx'
import pool from '../config/db.js'
import { authMiddleware, verifyToken } from '../middleware/auth.js'
import { upload } from '../config/cloudinary.js'
import { translateText } from '../utils/translate.js'

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

// === PRODUCTS CRUD ===

router.get('/products', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM products ORDER BY display_order ASC')
    res.json(rows)
  } catch (err) {
    console.error('GET /products error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/products', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { id, name, description, price, original_price, is_active, display_order } = req.body
    const imageUrl = req.file ? req.file.path : ''
    
    // Check for duplicate ID
    const [existing] = await pool.execute('SELECT id FROM products WHERE id = ?', [id])
    if (existing.length > 0) {
      return res.status(409).json({ error: `Un produit avec l'ID "${id}" existe déjà. Changez l'ID et réessayez.` })
    }

    // Auto-translate name and description (non-blocking: null if fails)
    const descStr = description || ''
    let name_en = null, name_ar = null, description_en = null, description_ar = null
    try {
      name_en = await translateText(name, 'en')
      name_ar = await translateText(name, 'ar')
      description_en = await translateText(descStr, 'en')
      description_ar = await translateText(descStr, 'ar')
    } catch (translationErr) {
      console.warn('Translation failed during product creation, will proceed without translations:', translationErr.message)
    }

    await pool.execute(
      `INSERT INTO products 
      (id, name, name_en, name_ar, description, description_en, description_ar, price, original_price, image_url, is_active, display_order) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, name_en, name_ar, descStr, description_en, description_ar, price, original_price || null, imageUrl, is_active === 'true' || is_active === true, display_order || 0]
    )
    res.json({ message: 'Product created' })
  } catch (err) {
    console.error('POST /products error:', err)
    res.status(500).json({ error: 'Erreur lors de la création du produit' })
  }
})


router.put('/products/:id', authMiddleware, async (req, res) => {
  try {
    const { name, description, price, original_price, is_active, display_order } = req.body
    const descStr = description || ''

    // Auto-translate name and description (non-blocking: null if fails)
    let name_en = null, name_ar = null, description_en = null, description_ar = null
    try {
      name_en = await translateText(name, 'en')
      name_ar = await translateText(name, 'ar')
      description_en = await translateText(descStr, 'en')
      description_ar = await translateText(descStr, 'ar')
    } catch (translationErr) {
      console.warn('Translation failed during product update, proceeding without translations:', translationErr.message)
    }

    await pool.execute(
      `UPDATE products 
       SET name=?, name_en=?, name_ar=?, description=?, description_en=?, description_ar=?, price=?, original_price=?, is_active=?, display_order=? 
       WHERE id=?`,
      [name, name_en, name_ar, descStr, description_en, description_ar, price, original_price || null, is_active === 'true' || is_active === true || is_active === 1, display_order, req.params.id]
    )
    res.json({ message: 'Product updated' })
  } catch (err) {
    console.error('PUT /products/:id error:', err)
    res.status(500).json({ error: 'Erreur lors de la modification du produit' })
  }
})


router.put('/products/:id/image', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' })
    await pool.execute('UPDATE products SET image_url=? WHERE id=?', [req.file.path, req.params.id])
    res.json({ message: 'Image updated', image_url: req.file.path })
  } catch (err) {
    console.error('PUT /products/:id/image error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/products/:id', authMiddleware, async (req, res) => {
  try {
    await pool.execute('DELETE FROM products WHERE id=?', [req.params.id])
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// =============================================
// === CMS: SITE TEXTS ===
// =============================================

router.get('/cms/texts', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM site_texts')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/cms/texts/:key', authMiddleware, async (req, res) => {
  try {
    const { fr_value } = req.body
    const en_value = await translateText(fr_value, 'en')
    const ar_value = await translateText(fr_value, 'ar')
    await pool.execute(
      'INSERT INTO site_texts (key_name, fr_value, en_value, ar_value) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE fr_value=?, en_value=?, ar_value=?',
      [req.params.key, fr_value, en_value, ar_value, fr_value, en_value, ar_value]
    )
    res.json({ message: 'Text saved', en_value, ar_value })
  } catch (err) {
    console.error('PUT /cms/texts error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// =============================================
// === CMS: FAQ ===
// =============================================

router.get('/cms/faq', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM faq ORDER BY display_order ASC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/cms/faq', authMiddleware, async (req, res) => {
  try {
    const { question_fr, answer_fr, display_order } = req.body
    const question_en = await translateText(question_fr, 'en')
    const question_ar = await translateText(question_fr, 'ar')
    const answer_en = await translateText(answer_fr, 'en')
    const answer_ar = await translateText(answer_fr, 'ar')
    const [result] = await pool.execute(
      'INSERT INTO faq (question_fr, question_en, question_ar, answer_fr, answer_en, answer_ar, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [question_fr, question_en, question_ar, answer_fr, answer_en, answer_ar, display_order || 0]
    )
    res.json({ message: 'FAQ created', id: result.insertId })
  } catch (err) {
    console.error('POST /cms/faq error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/cms/faq/:id', authMiddleware, async (req, res) => {
  try {
    const { question_fr, answer_fr, display_order } = req.body
    const question_en = await translateText(question_fr, 'en')
    const question_ar = await translateText(question_fr, 'ar')
    const answer_en = await translateText(answer_fr, 'en')
    const answer_ar = await translateText(answer_fr, 'ar')
    await pool.execute(
      'UPDATE faq SET question_fr=?, question_en=?, question_ar=?, answer_fr=?, answer_en=?, answer_ar=?, display_order=? WHERE id=?',
      [question_fr, question_en, question_ar, answer_fr, answer_en, answer_ar, display_order || 0, req.params.id]
    )
    res.json({ message: 'FAQ updated' })
  } catch (err) {
    console.error('PUT /cms/faq/:id error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/cms/faq/:id', authMiddleware, async (req, res) => {
  try {
    await pool.execute('DELETE FROM faq WHERE id=?', [req.params.id])
    res.json({ message: 'FAQ deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// =============================================
// === CMS: GALLERY IMAGES ===
// =============================================

router.get('/cms/gallery', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM gallery_images ORDER BY album_id, display_order ASC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/cms/gallery', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { album_id, alt_fr, display_order } = req.body
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' })
    const image_url = req.file.path
    const alt_en = await translateText(alt_fr || '', 'en')
    const alt_ar = await translateText(alt_fr || '', 'ar')
    const [result] = await pool.execute(
      'INSERT INTO gallery_images (album_id, image_url, alt_fr, alt_en, alt_ar, display_order) VALUES (?, ?, ?, ?, ?, ?)',
      [album_id, image_url, alt_fr || '', alt_en, alt_ar, display_order || 0]
    )
    res.json({ message: 'Image added', id: result.insertId, image_url })
  } catch (err) {
    console.error('POST /cms/gallery error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/cms/gallery/:id', authMiddleware, async (req, res) => {
  try {
    await pool.execute('DELETE FROM gallery_images WHERE id=?', [req.params.id])
    res.json({ message: 'Image deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// =============================================
// === CMS: FEATURES (bullet points) ===
// =============================================

router.get('/cms/features', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM features ORDER BY product_id, display_order ASC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/cms/features', authMiddleware, async (req, res) => {
  try {
    const { product_id, text_fr, display_order } = req.body
    const text_en = await translateText(text_fr, 'en')
    const text_ar = await translateText(text_fr, 'ar')
    const [result] = await pool.execute(
      'INSERT INTO features (product_id, text_fr, text_en, text_ar, display_order) VALUES (?, ?, ?, ?, ?)',
      [product_id, text_fr, text_en, text_ar, display_order || 0]
    )
    res.json({ message: 'Feature added', id: result.insertId })
  } catch (err) {
    console.error('POST /cms/features error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/cms/features/:id', authMiddleware, async (req, res) => {
  try {
    const { text_fr, display_order } = req.body
    const text_en = await translateText(text_fr, 'en')
    const text_ar = await translateText(text_fr, 'ar')
    await pool.execute(
      'UPDATE features SET text_fr=?, text_en=?, text_ar=?, display_order=? WHERE id=?',
      [text_fr, text_en, text_ar, display_order || 0, req.params.id]
    )
    res.json({ message: 'Feature updated' })
  } catch (err) {
    console.error('PUT /cms/features/:id error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/cms/features/:id', authMiddleware, async (req, res) => {
  try {
    await pool.execute('DELETE FROM features WHERE id=?', [req.params.id])
    res.json({ message: 'Feature deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/cms/gallery/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { alt_fr } = req.body
    const updates = []
    const values = []

    if (alt_fr !== undefined) {
      let alt_en = null
      let alt_ar = null
      try {
        alt_en = await translateText(alt_fr || '', 'en')
        alt_ar = await translateText(alt_fr || '', 'ar')
      } catch (e) { /* ignore translation errors */ }
      updates.push('alt_fr=?', 'alt_en=?', 'alt_ar=?')
      values.push(alt_fr || '', alt_en, alt_ar)
    }

    if (req.file) {
      updates.push('image_url=?')
      values.push(req.file.path)
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No changes provided' })
    }

    await pool.execute(
      `UPDATE gallery_images SET ${updates.join(', ')} WHERE id=?`,
      [...values, req.params.id]
    )
    res.json({ message: 'Image updated' })
  } catch (err) {
    console.error('PUT /cms/gallery/:id error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// =============================================
// === CMS: TESTIMONIALS ===
// =============================================

router.get('/cms/testimonials', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM testimonials ORDER BY display_order ASC')
    res.json(rows)
  } catch (err) {
    // Table may not exist yet
    res.json([])
  }
})

router.post('/cms/testimonials', authMiddleware, async (req, res) => {
  try {
    const { name, text_fr, rating, display_order } = req.body
    let text_en = null, text_ar = null
    try {
      text_en = await translateText(text_fr, 'en')
      text_ar = await translateText(text_fr, 'ar')
    } catch (e) { /* ignore translation errors */ }
    const [result] = await pool.execute(
      'INSERT INTO testimonials (name, text_fr, text_en, text_ar, rating, display_order) VALUES (?, ?, ?, ?, ?, ?)',
      [name, text_fr, text_en, text_ar, rating || 5, display_order || 0]
    )
    res.json({ message: 'Testimonial created', id: result.insertId })
  } catch (err) {
    console.error('POST /cms/testimonials error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/cms/testimonials/:id', authMiddleware, async (req, res) => {
  try {
    const { name, text_fr, rating, display_order } = req.body
    let text_en = null, text_ar = null
    try {
      text_en = await translateText(text_fr, 'en')
      text_ar = await translateText(text_fr, 'ar')
    } catch (e) { /* ignore translation errors */ }
    await pool.execute(
      'UPDATE testimonials SET name=?, text_fr=?, text_en=?, text_ar=?, rating=?, display_order=? WHERE id=?',
      [name, text_fr, text_en, text_ar, rating || 5, display_order || 0, req.params.id]
    )
    res.json({ message: 'Testimonial updated' })
  } catch (err) {
    console.error('PUT /cms/testimonials/:id error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/cms/testimonials/:id', authMiddleware, async (req, res) => {
  try {
    await pool.execute('DELETE FROM testimonials WHERE id=?', [req.params.id])
    res.json({ message: 'Testimonial deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router

