-- Migration pour bases existantes
USE biobooks;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS product_type ENUM('book1', 'book2', 'pack') NOT NULL DEFAULT 'pack' AFTER address,
  ADD COLUMN IF NOT EXISTS product_name VARCHAR(200) NOT NULL DEFAULT 'Les deux ensemble' AFTER product_type,
  ADD COLUMN IF NOT EXISTS unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0 AFTER product_name;

-- MySQL < 8.0 ne supporte pas IF NOT EXISTS sur ADD COLUMN :
-- Exécutez manuellement si besoin :
-- ALTER TABLE orders ADD COLUMN product_type ENUM('book1', 'book2', 'pack') NOT NULL DEFAULT 'pack' AFTER address;
-- ALTER TABLE orders ADD COLUMN product_name VARCHAR(200) NOT NULL DEFAULT 'Les deux ensemble' AFTER product_type;
-- ALTER TABLE orders ADD COLUMN unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0 AFTER product_name;
