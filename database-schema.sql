-- PakMegaMart Database Schema
-- Run this SQL in your Supabase SQL Editor
-- https://app.supabase.com/project/dvieojudteyiaoadeybo/sql/new

-- ==========================================
-- PRODUCTS TABLE
-- ==========================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  category VARCHAR(100),
  type VARCHAR(50),
  leather_type VARCHAR(50),
  image_url VARCHAR(500),
  color_variants JSONB,
  features JSONB,
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- CUSTOMERS TABLE
-- ==========================================
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  country VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- ORDERS TABLE
-- ==========================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  customer_email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'unpaid',
  subtotal DECIMAL(12, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) DEFAULT 160,
  total DECIMAL(12, 2) NOT NULL,
  shipping_address JSONB,
  billing_address JSONB,
  notes TEXT,
  estimated_delivery_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- ORDER ITEMS TABLE
-- ==========================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  product_price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  color VARCHAR(50),
  item_total DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- INVENTORY TABLE (for stock tracking)
-- ==========================================
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID UNIQUE REFERENCES products(id) ON DELETE CASCADE,
  quantity_available INTEGER DEFAULT 0,
  quantity_reserved INTEGER DEFAULT 0,
  quantity_sold INTEGER DEFAULT 0,
  last_restocked TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- ORDER STATUS HISTORY TABLE
-- ==========================================
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);

-- ==========================================
-- INSERT SAMPLE PRODUCTS
-- ==========================================
INSERT INTO products (name, description, price, original_price, category, type, leather_type, image_url, features, stock_quantity, is_active)
VALUES 
(
  'Genuine Leather Bifold',
  'Handcrafted from premium genuine leather with traditional bifold design and hand-stitched details.',
  999,
  1300,
  'wallets',
  'bifold',
  'genuine',
  'public/Genuine Leather Bifold Wallet/Genuine Leather Bifold Wallet Black.png',
  '["6 card slots", "2 bill compartments", "ID window", "Durable leather"]'::jsonb,
  50,
  true
),
(
  'Pebbled Leather Long Wallet',
  'Sleek pebbled leather long wallet with modern organization and premium craftsmanship.',
  1499,
  2000,
  'wallets',
  'long-wallet',
  'pebbled',
  'public/Pebbled Leather Long Wallet/Pebbled Leather Long Wallet Black.jpg',
  '["10 card slots", "3 bill compartments", "Coin pocket", "Premium leather"]'::jsonb,
  30,
  true
),
(
  'Vintage Leather Bifold',
  'Vintage-inspired bifold wallet with classic styling and premium construction methods.',
  999,
  1300,
  'wallets',
  'bifold',
  'vintage',
  'public/Vintage Leather Bifold Wallet/Vintage Leather Bifold Wallet Gray.jpg',
  '["8 card slots", "2 bill compartments", "Heritage design", "Premium stitching"]'::jsonb,
  40,
  true
);

-- ==========================================
-- RLS (Row Level Security) POLICIES
-- ==========================================

-- Allow anyone to read products
CREATE POLICY "Enable read access for all products" ON products
  FOR SELECT USING (true);

-- Allow anyone to read customers (their own)
CREATE POLICY "Enable read access for customers" ON customers
  FOR SELECT USING (true);

-- Allow anyone to read orders (should be enhanced for security)
CREATE POLICY "Enable read access for orders" ON orders
  FOR SELECT USING (true);

-- Enable inserts for orders (checkout)
CREATE POLICY "Enable insert for orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Enable inserts for order items
CREATE POLICY "Enable insert for order items" ON order_items
  FOR INSERT WITH CHECK (true);

-- Enable inserts for customers
CREATE POLICY "Enable insert for customers" ON customers
  FOR INSERT WITH CHECK (true);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
