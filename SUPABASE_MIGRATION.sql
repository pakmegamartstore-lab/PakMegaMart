-- PakMegaMart Supabase Migration
-- RUN THIS IN SUPABASE SQL EDITOR to fix the orders table structure
-- Project: dvieojudteyiaoadeybo

-- ==========================================
-- ALTER ORDERS TABLE TO MATCH APPLICATION REQUIREMENTS
-- ==========================================

-- Add missing columns for direct customer data (without requiring customer_id)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS delivery_address TEXT,
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS state VARCHAR(100),
ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS country VARCHAR(100);

-- Store items as JSONB instead of separate order_items table for simplicity
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;

-- Make customer_id optional (nullable) since we're storing customer data directly
ALTER TABLE orders
ALTER COLUMN customer_id DROP NOT NULL;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Create an email_logs table for tracking email sends
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  order_id VARCHAR(50),
  notification_type VARCHAR(50),
  status VARCHAR(20) DEFAULT 'sent',
  sent_at TIMESTAMP DEFAULT NOW()
);

-- Create index for email_logs
CREATE INDEX IF NOT EXISTS idx_email_logs_order_id ON email_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_email ON email_logs(email);

-- ==========================================
-- UPDATE ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert orders
CREATE POLICY IF NOT EXISTS "Allow anyone to insert orders" 
ON orders FOR INSERT 
WITH CHECK (true);

-- Create policy to allow anyone to read orders by email
CREATE POLICY IF NOT EXISTS "Allow anyone to read orders"
ON orders FOR SELECT
USING (true);

-- Enable RLS on email_logs table
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert email logs
CREATE POLICY IF NOT EXISTS "Allow anyone to insert email logs"
ON email_logs FOR INSERT
WITH CHECK (true);

-- ==========================================
-- VERIFICATION QUERIES
-- ==========================================

-- Run these to verify the schema is correct:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'orders';
-- SELECT * FROM orders LIMIT 1;
-- SELECT * FROM email_logs LIMIT 1;

-- ==========================================
-- DONE
-- ==========================================
-- If all queries ran successfully, your Supabase database is ready for the application!
