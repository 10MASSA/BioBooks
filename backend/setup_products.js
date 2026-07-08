import pool from './config/db.js';

async function createTable() {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        original_price DECIMAL(10,2) DEFAULT NULL,
        image_url TEXT,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        display_order INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Table products creee avec succes!');

    await pool.execute(`
      INSERT IGNORE INTO products (id, name, description, price, original_price, is_active, display_order) VALUES
      ('book1', 'Materiels et outils de laboratoire', 'Guide complet des materiels et outils de laboratoire pour les analyses medicales.', 700, NULL, 1, 1),
      ('book2', 'Guide pratique des techniques des analyses medicales', 'Manuel pratique couvrant toutes les techniques d analyses medicales essentielles.', 1600, NULL, 1, 2),
      ('pack', 'Pack Les deux livres ensemble', 'Obtenez les deux livres a prix reduit ! La reference complete pour les techniciens de laboratoire.', 2000, 2300, 1, 3)
    `);
    console.log('Produits par defaut inseres!');
    process.exit(0);
  } catch (err) {
    console.error('Erreur:', err.message);
    process.exit(1);
  }
}

createTable();
