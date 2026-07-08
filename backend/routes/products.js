import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

// GET all active products for the storefront
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM products WHERE is_active = TRUE ORDER BY display_order ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Fetch products error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
