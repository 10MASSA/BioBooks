-- Créer la table testimonials (avis clients éditables)
-- Exécuter dans votre base de données MySQL 'biobooks'

USE biobooks;

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
);

-- Insérer les témoignages existants du site (hardcodés actuellement)
INSERT INTO testimonials (name, text_fr, rating, display_order, is_active) VALUES
  ('Acheteur Biologie', 'السلام عليكم كتاب ماشاء الله فيه تفصيل مختصر لكل تحليل ابتداءا من مراحله الأولى...', 5, 1, TRUE),
  ('Étudiante en Biochimie', 'J''ai vraiment adoré ce livre ! Il contient une richesse d''informations précieuses et claires...', 5, 2, TRUE);
