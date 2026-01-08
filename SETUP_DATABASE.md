# Supabase Database Setup Guide - PakMegaMart

## 🚀 Step-by-Step Setup Instructions

### **Step 1: Open Supabase SQL Editor**
1. Go to: https://app.supabase.com
2. Login to your account
3. Select your project: **dvieojudteyiaoadeybo**
4. Click on **SQL Editor** in the left sidebar
5. Click **New Query**

### **Step 2: Copy and Run the Schema**
1. Open the file: `database-schema.sql` in your project
2. Copy **ALL** the SQL code
3. Paste it into the Supabase SQL Editor
4. Click the **Run** button (or press Ctrl+Enter)
5. Wait for completion (should see green checkmark)

### **Step 3: Verify Tables Created**
1. Go to **Table Editor** in the left sidebar
2. You should see these tables:
   - ✅ products
   - ✅ customers
   - ✅ orders
   - ✅ order_items
   - ✅ inventory
   - ✅ order_status_history

### **Step 4: Check Sample Data**
1. Click on the **products** table
2. You should see 3 sample products already inserted:
   - Genuine Leather Bifold (PKR 999)
   - Pebbled Leather Long Wallet (PKR 1,499)
   - Vintage Leather Bifold (PKR 999)

---

## 📋 Database Schema Overview

### **Products Table**
Stores all product information:
```
- id (UUID) - Primary key
- name - Product name
- description - Product description
- price - Current price (PKR)
- original_price - Original price for discount calculation
- category - Product category (wallets, etc.)
- type - Product type (bifold, long-wallet, etc.)
- leather_type - Type of leather (genuine, pebbled, vintage, etc.)
- image_url - Path to product image
- color_variants - JSON array of color options
- features - JSON array of product features
- stock_quantity - Available stock
- is_active - Product availability status
- created_at - Creation timestamp
- updated_at - Last update timestamp
```

### **Customers Table**
Stores customer information:
```
- id (UUID) - Primary key
- email - Customer email (unique)
- first_name - First name
- last_name - Last name
- phone - Contact phone
- address - Street address
- city - City
- state - State/Province
- zip_code - Postal code
- country - Country
- created_at - Registration date
- updated_at - Last update
```

### **Orders Table**
Stores order information:
```
- id (UUID) - Primary key
- order_number - Unique order number (e.g., #123456)
- customer_id - Foreign key to customers
- customer_email - Email for quick reference
- status - Order status (pending, processing, shipped, delivered)
- payment_method - Payment method (COD, bank_transfer, card)
- payment_status - Payment status (unpaid, paid, failed)
- subtotal - Product subtotal
- shipping_cost - Shipping cost (PKR 160 default)
- total - Total amount
- shipping_address - JSON object with full address
- billing_address - JSON object with billing address
- notes - Additional notes
- estimated_delivery_date - Estimated delivery date
- created_at - Order creation date
- updated_at - Last update
```

### **Order Items Table**
Stores items in each order:
```
- id (UUID) - Primary key
- order_id - Foreign key to orders
- product_id - Foreign key to products
- product_name - Product name at time of order
- product_price - Price at time of order
- quantity - Quantity ordered
- color - Selected color
- item_total - quantity × product_price
- created_at - Creation timestamp
```

### **Inventory Table**
Tracks stock levels:
```
- id (UUID) - Primary key
- product_id - Foreign key to products (unique)
- quantity_available - Available for purchase
- quantity_reserved - Reserved in pending orders
- quantity_sold - Total sold
- last_restocked - Last restocking date
- created_at - Creation timestamp
- updated_at - Last update
```

### **Order Status History Table**
Tracks order status changes:
```
- id (UUID) - Primary key
- order_id - Foreign key to orders
- status - Status at this update
- notes - Status change notes
- created_at - Timestamp of status change
```

---

## 🔐 Security (Row Level Security - RLS)

The schema includes RLS policies:
- ✅ Anyone can READ products (public catalog)
- ✅ Anyone can INSERT orders (checkout)
- ✅ Anyone can INSERT customers (registration)
- ⚠️ Note: In production, enhance RLS for customer data privacy

---

## ✅ What's Next?

After tables are created:
1. Verify all tables appear in Supabase Table Editor
2. Check that sample products are visible
3. Continue to **STEP 2: Connect Checkout to Supabase**

---

## 🆘 Troubleshooting

### Error: "Table already exists"
- Drop existing tables first in SQL Editor:
  ```sql
  DROP TABLE IF EXISTS order_status_history CASCADE;
  DROP TABLE IF EXISTS order_items CASCADE;
  DROP TABLE IF EXISTS inventory CASCADE;
  DROP TABLE IF EXISTS orders CASCADE;
  DROP TABLE IF EXISTS customers CASCADE;
  DROP TABLE IF EXISTS products CASCADE;
  ```

### Error: "JSONB type not found"
- PostgreSQL JSONB is standard in Supabase - should work automatically

### Can't see tables in Table Editor
- Refresh the page (F5)
- Click the refresh icon in the Table Editor sidebar

---

## 📞 Support

If you need help:
1. Check Supabase documentation: https://supabase.com/docs
2. Verify .env file has correct credentials
3. Check browser console for any JavaScript errors

---

**Status**: ✅ Ready to proceed to STEP 2
