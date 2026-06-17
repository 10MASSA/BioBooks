CREATE DATABASE IF NOT EXISTS biobooks CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE biobooks;

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  wilaya VARCHAR(100) NOT NULL,
  commune VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  product_type ENUM('book1', 'book2', 'pack') NOT NULL DEFAULT 'pack',
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
);
