import pool from './config/db.js';

async function testConnection() {
  console.log('Tentative de connexion à la base de données...');
  console.log('Détails :', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
  });
  
  try {
    const start = Date.now();
    const connection = await pool.getConnection();
    console.log(`Connecté avec succès en ${Date.now() - start}ms !`);
    
    const [rows] = await connection.query('SELECT 1 + 1 AS solution');
    console.log('Test de requête réussi, solution =', rows[0].solution);
    
    connection.release();
    process.exit(0);
  } catch (err) {
    console.error('La connexion a échoué !');
    console.error('Code d\'erreur :', err.code);
    console.error('Détails complets :', err);
    process.exit(1);
  }
}

testConnection();
