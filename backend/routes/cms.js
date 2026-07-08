import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

// GET all public CMS content
router.get('/', async (req, res) => {
  try {
    const [textsRows] = await pool.execute('SELECT * FROM site_texts');
    const [faqRows] = await pool.execute('SELECT * FROM faq ORDER BY display_order ASC');
    const [galleryRows] = await pool.execute('SELECT * FROM gallery_images ORDER BY display_order ASC');
    const [featuresRows] = await pool.execute('SELECT * FROM features ORDER BY display_order ASC');
    
    let testimonialsRows = [];
    try {
      const [rows] = await pool.execute('SELECT * FROM testimonials WHERE is_active = TRUE ORDER BY display_order ASC');
      testimonialsRows = rows;
    } catch (e) { /* table may not exist yet */ }

    const content = {
      texts: textsRows,
      faq: faqRows,
      gallery: galleryRows,
      features: featuresRows,
      testimonials: testimonialsRows,
    };

    res.json(content);
  } catch (err) {
    console.error('Fetch CMS content error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
