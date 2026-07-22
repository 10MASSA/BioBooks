import pool from './config/db.js'

async function setupAllTables() {
  console.log('🚀 Démarrage de l\'initialisation complète de la base de données TiDB Cloud...')

  try {
    // 1. Table orders
    console.log('📦 Création de la table orders...')
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        wilaya VARCHAR(100) NOT NULL,
        commune VARCHAR(100) NOT NULL,
        address TEXT NOT NULL,
        product_type VARCHAR(50) NOT NULL DEFAULT 'pack',
        product_name VARCHAR(200) NOT NULL DEFAULT 'Les deux ensemble',
        unit_price DECIMAL(10, 2) NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        subtotal DECIMAL(10, 2) NOT NULL,
        delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 450,
        total DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      )
    `)

    // 2. Table products
    console.log('📚 Création de la table products...')
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        name_en VARCHAR(200),
        name_ar VARCHAR(200),
        description TEXT,
        description_en TEXT,
        description_ar TEXT,
        price DECIMAL(10,2) NOT NULL,
        original_price DECIMAL(10,2) DEFAULT NULL,
        image_url TEXT,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        display_order INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // Produits par défaut
    await pool.execute(`
      INSERT IGNORE INTO products (id, name, description, price, original_price, is_active, display_order) VALUES
      ('book1', 'Matériels et outils de laboratoire', 'Guide complet des matériels et outils de laboratoire pour les analyses médicales.', 700, NULL, 1, 1),
      ('book2', 'Guide pratique des techniques des analyses médicales', 'Manuel pratique couvrant toutes les techniques d analyses médicales essentielles.', 1600, NULL, 1, 2),
      ('pack', 'Pack Les deux livres ensemble', 'Obtenez les deux livres à prix réduit ! La référence complète pour les techniciens de laboratoire.', 2000, 2300, 1, 3)
    `)

    // 3. Table site_texts
    console.log('📝 Création de la table site_texts...')
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS site_texts (
        key_name VARCHAR(100) PRIMARY KEY,
        fr_value TEXT,
        en_value TEXT,
        ar_value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // 4. Table faq
    console.log('❓ Création de la table faq...')
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
    `)

    // 5. Table gallery_images
    console.log('🖼️ Création de la table gallery_images...')
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
    `)

    // 6. Table features
    console.log('✨ Création de la table features...')
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
    `)

    // 7. Table testimonials
    console.log('⭐ Création de la table testimonials...')
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL DEFAULT 'Acheteur',
        text_fr TEXT NOT NULL,
        text_en TEXT,
        text_ar TEXT,
        rating TINYINT DEFAULT 5,
        image_url VARCHAR(500),
        is_active BOOLEAN DEFAULT TRUE,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log('✅ TOUTES LES TABLES ONT ÉTÉ CRÉÉES ET INITIALISÉES AVEC SUCCÈS SUR TiDB CLOUD ! 🎉')
    process.exit(0)
  } catch (err) {
    console.error('❌ Erreur lors de la création des tables:', err)
    process.exit(1)
  }
}

setupAllTables()
