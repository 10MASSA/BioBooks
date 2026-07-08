import pool from '../config/db.js';

async function migrate() {
  try {
    console.log('Starting CMS migration...');

    // 1. Add translation columns to products
    console.log('Adding translation columns to products...');
    try {
      await pool.execute('ALTER TABLE products ADD COLUMN name_en VARCHAR(200)');
      await pool.execute('ALTER TABLE products ADD COLUMN name_ar VARCHAR(200)');
      await pool.execute('ALTER TABLE products ADD COLUMN description_en TEXT');
      await pool.execute('ALTER TABLE products ADD COLUMN description_ar TEXT');
      console.log('Added translation columns to products.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('Columns already exist in products table, skipping.');
      } else {
        console.error('Error altering products:', e);
      }
    }

    // 2. Create site_texts table
    console.log('Creating site_texts table...');
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS site_texts (
        key_name VARCHAR(100) PRIMARY KEY,
        fr_value TEXT,
        en_value TEXT,
        ar_value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 3. Create faq table
    console.log('Creating faq table...');
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS faq (
        id INT AUTO_INCREMENT PRIMARY KEY,
        question_fr TEXT NOT NULL,
        question_en TEXT,
        question_ar TEXT,
        answer_fr TEXT NOT NULL,
        answer_en TEXT,
        answer_ar TEXT,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 4. Create gallery_images table
    console.log('Creating gallery_images table...');
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS gallery_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        album_id VARCHAR(50) NOT NULL,
        image_url TEXT NOT NULL,
        alt_fr VARCHAR(255),
        alt_en VARCHAR(255),
        alt_ar VARCHAR(255),
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 5. Create features table
    console.log('Creating features table...');
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS features (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id VARCHAR(50) NOT NULL,
        text_fr TEXT NOT NULL,
        text_en TEXT,
        text_ar TEXT,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('CMS migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

migrate();
