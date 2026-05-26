-- CarterTheTownWear — Database Setup
-- Run in phpMyAdmin or: mysql -u root < setup.sql

CREATE DATABASE IF NOT EXISTS carterthetown;
USE carterthetown;

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255)                        NOT NULL,
  brand       VARCHAR(255)                        NOT NULL,
  category    ENUM('men','women','kids')          NOT NULL DEFAULT 'men',
  price       DECIMAL(10,2)                       NOT NULL,
  description TEXT,
  image_url   VARCHAR(500),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table (admin + future customer accounts)
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(255)                       NOT NULL,
  email         VARCHAR(255)                       NOT NULL UNIQUE,
  password_hash VARCHAR(255)                       NOT NULL,
  role          ENUM('admin','customer')           NOT NULL DEFAULT 'customer',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default admin account
-- Password: Admin@1234  (change immediately in production)
INSERT INTO users (name, email, password_hash, role) VALUES
(
  'Carter Admin',
  'admin@carterthetown.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin'
)
ON DUPLICATE KEY UPDATE id=id;

-- Seed products
INSERT INTO products (name, brand, category, price, description, image_url) VALUES
('Classic Slim Tee',       'Carter Wear', 'men',   49.99,  'A timeless slim-fit tee crafted from premium cotton.',        NULL),
('Heritage Chino',         'Carter Wear', 'men',   119.99, 'Tailored chinos with a refined heritage silhouette.',          NULL),
('Noir Overshirt',         'Carter Wear', 'men',   189.99, 'A structured overshirt in midnight black twill.',              NULL),
('Linen Resort Shirt',     'Carter Wear', 'men',   89.99,  'Lightweight linen, perfect for warm-weather occasions.',       NULL),
('Wrapped Midi Dress',     'Carter Wear', 'women', 139.99, 'An elegant wrapped midi silhouette in soft crepe fabric.',     NULL),
('Tailored Blazer',        'Carter Wear', 'women', 219.99, 'Sharp structured blazer with gold-tone hardware accents.',     NULL),
('Floral Blouse',          'Carter Wear', 'women', 79.99,  'Lightweight floral blouse with a relaxed feminine drape.',     NULL),
('Mini Jogger Set',        'Carter Wear', 'kids',  59.99,  'Soft cotton jogger and hoodie set, built for active days.',    NULL),
('Little Denim Jacket',    'Carter Wear', 'kids',  74.99,  'Classic denim jacket sized for kids with snap-button chest.', NULL);

SELECT 'CarterTheTownWear DB ready.' AS status;
