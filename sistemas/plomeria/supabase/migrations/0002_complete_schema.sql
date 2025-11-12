-- =====================================================================
-- Opsis Plumbing - Supabase SQL Schema
-- Complete database schema with tables, relationships, and indices
-- =====================================================================

-- 1. CUSTOMERS TABLE
-- Stores customer/client information
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  phone TEXT,
  email TEXT,
  address_text TEXT,
  tags TEXT[] DEFAULT '{}'::TEXT[], -- array of tags for filtering
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT email_format CHECK (email IS NULL OR email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_customers_email ON customers(email);

-- 2. CUSTOMER_ADDRESSES TABLE
-- Multiple addresses per customer (billing, shipping, site locations, etc.)
CREATE TABLE IF NOT EXISTS customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  label TEXT NOT NULL, -- e.g., "Oficina", "Sitio 1", "Almacén"
  address TEXT NOT NULL,
  lat NUMERIC(10, 8),
  lng NUMERIC(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_customer_addresses_customer_id ON customer_addresses(customer_id);

-- 3. TRUCKS TABLE
-- Vehicles/trucks in the fleet for work and inventory management
CREATE TABLE IF NOT EXISTS trucks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname TEXT NOT NULL UNIQUE, -- e.g., "Camión 1", "Van Roja"
  license_plate TEXT UNIQUE,
  capacity_liters NUMERIC(8, 2),
  status TEXT DEFAULT 'active', -- active, maintenance, retired
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_trucks_status ON trucks(status);

-- 4. INVENTORY_TRUCK TABLE
-- Inventory items stored on each truck
CREATE TABLE IF NOT EXISTS inventory_truck (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  truck_id UUID NOT NULL REFERENCES trucks(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL, -- e.g., "Tubo PVC 1in", "Válvula esférica"
  qty_on_hand NUMERIC(10, 2) NOT NULL DEFAULT 0,
  min_threshold NUMERIC(10, 2) NOT NULL DEFAULT 0,
  unit TEXT, -- e.g., "pcs", "m", "kg"
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT positive_qty CHECK (qty_on_hand >= 0),
  CONSTRAINT positive_threshold CHECK (min_threshold >= 0)
);

CREATE INDEX idx_inventory_truck_truck_id ON inventory_truck(truck_id);
CREATE INDEX idx_inventory_truck_low_stock ON inventory_truck(qty_on_hand, min_threshold) 
  WHERE qty_on_hand < min_threshold;

-- 5. ORDERS TABLE
-- Main orders/work orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'draft', 
    -- draft, scheduled, en_route, on_site, job_done, invoiced, paid, archived
  priority TEXT NOT NULL DEFAULT 'normal', -- low, normal, high, emergency
  service_type TEXT NOT NULL, -- e.g., "Emergencia", "Mantenimiento", "Instalación"
  address_text TEXT,
  geo_lat NUMERIC(10, 8),
  geo_lng NUMERIC(11, 8),
  window_start TIMESTAMP WITH TIME ZONE, -- scheduled start time
  window_end TIMESTAMP WITH TIME ZONE, -- scheduled end time
  total_final NUMERIC(12, 2) NOT NULL DEFAULT 0, -- final charged amount
  labor_rate_per_hour NUMERIC(8, 2), -- hourly rate used for this order
  labor_hours NUMERIC(8, 2), -- hours worked
  materials_subtotal NUMERIC(12, 2), -- materials cost (before markup)
  notes_internal TEXT, -- internal notes, not shown to customer
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT positive_total CHECK (total_final >= 0),
  CONSTRAINT positive_labor CHECK (labor_hours >= 0),
  CONSTRAINT valid_coords CHECK (
    (geo_lat IS NULL AND geo_lng IS NULL) OR 
    (geo_lat IS NOT NULL AND geo_lng IS NOT NULL AND geo_lat BETWEEN -90 AND 90 AND geo_lng BETWEEN -180 AND 180)
  )
);

CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_priority ON orders(priority);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_window_start ON orders(window_start) WHERE status IN ('draft', 'scheduled');

-- 6. ORDER_MATERIALS TABLE
-- Materials used in each order (for cost tracking)
CREATE TABLE IF NOT EXISTS order_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  qty_used NUMERIC(10, 2) NOT NULL,
  unit_cost NUMERIC(8, 2) NOT NULL, -- cost per unit
  source_location TEXT, -- where the item came from (inventory truck, supplier, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT positive_qty CHECK (qty_used > 0),
  CONSTRAINT positive_cost CHECK (unit_cost >= 0)
);

CREATE INDEX idx_order_materials_order_id ON order_materials(order_id);

-- 7. ORDER_PHOTOS TABLE
-- Photos attached to orders (before/after, site photos, etc.)
CREATE TABLE IF NOT EXISTS order_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  url TEXT NOT NULL, -- path or URL to image
  kind TEXT DEFAULT 'general', -- before, after, site, invoice, etc.
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_photos_order_id ON order_photos(order_id);

-- 8. QUOTES (COTIZACIONES) TABLE
-- Quotations/proposals sent to customers
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  service_type TEXT NOT NULL,
  description TEXT,
  total NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft', 
    -- draft, sent, approved, won, lost, converted_to_order
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE, -- quote validity date
  converted_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT positive_total CHECK (total >= 0)
);

CREATE INDEX idx_quotes_customer_id ON quotes(customer_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_valid_until ON quotes(valid_until) WHERE status IN ('draft', 'sent', 'approved');

-- 9. INVOICES (FACTURAS) TABLE
-- Formal invoices generated from orders
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  invoice_number TEXT NOT NULL UNIQUE, -- e.g., "INV-2024-001"
  issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE, -- payment due date
  total NUMERIC(12, 2) NOT NULL DEFAULT 0,
  paid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open', 
    -- open, due, overdue, partial, paid
  payment_method TEXT, -- cash, check, transfer, credit, other
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT positive_total CHECK (total >= 0),
  CONSTRAINT positive_paid CHECK (paid_amount >= 0),
  CONSTRAINT paid_not_exceed CHECK (paid_amount <= total)
);

CREATE INDEX idx_invoices_order_id ON invoices(order_id);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_due_date ON invoices(due_date) WHERE status IN ('open', 'due', 'overdue');

-- 10. STAFF TABLE
-- Employees/technicians
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT UNIQUE,
  specialties TEXT[] DEFAULT '{}'::TEXT[], -- e.g., electrical, plumbing, hvac
  status TEXT DEFAULT 'active', -- active, inactive, terminated
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_staff_status ON staff(status);
CREATE INDEX idx_staff_email ON staff(email);

-- 11. ROLES TABLE
-- Role-based access control
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name TEXT NOT NULL UNIQUE,
  description TEXT,
  permissions TEXT[] NOT NULL DEFAULT '{}'::TEXT[], 
    -- e.g., ['orders.view', 'orders.create', 'invoices.edit', 'reports.view']
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_roles_role_name ON roles(role_name);

-- 12. RATES TABLE
-- Service rates, labor rates, and pricing
CREATE TABLE IF NOT EXISTS rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concept TEXT NOT NULL, -- e.g., "Hora técnico", "Visita", "Emergencia 24h"
  type TEXT NOT NULL DEFAULT 'hourly', -- hourly, fixed, unit, emergency, other
  price NUMERIC(8, 2) NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT positive_price CHECK (price > 0)
);

CREATE INDEX idx_rates_active ON rates(active);
CREATE INDEX idx_rates_type ON rates(type);

-- 13. SETTINGS TABLE
-- Application-level configuration (theme, company info, etc.)
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT 'system-settings'::UUID, -- single row
  company_name TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  theme TEXT DEFAULT 'light', -- light or dark
  palette TEXT DEFAULT 'default', -- default, ocean, forest, sunset
  custom_rates JSONB DEFAULT '{}'::JSONB, -- JSON object for rate customizations
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT single_row CHECK (id = 'system-settings'::UUID)
);

-- 14. PAYMENT_RECORDS TABLE (Optional but recommended)
-- Track individual payments against invoices
CREATE TABLE IF NOT EXISTS payment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  method TEXT, -- cash, check, transfer, card, other
  reference TEXT, -- e.g., check number, transaction ID
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT positive_amount CHECK (amount > 0)
);

CREATE INDEX idx_payment_records_invoice_id ON payment_records(invoice_id);
CREATE INDEX idx_payment_records_payment_date ON payment_records(payment_date DESC);

-- =====================================================================
-- VIEWS (Optional, for easier querying)
-- =====================================================================

-- View: Orders with customer details
CREATE OR REPLACE VIEW orders_with_customers AS
SELECT 
  o.id,
  o.customer_id,
  c.name AS customer_name,
  c.phone AS customer_phone,
  c.email AS customer_email,
  o.status,
  o.priority,
  o.service_type,
  o.address_text,
  o.geo_lat,
  o.geo_lng,
  o.total_final,
  o.created_at,
  o.updated_at
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id;

-- View: Invoices with order and customer info
CREATE OR REPLACE VIEW invoices_detailed AS
SELECT 
  i.id,
  i.invoice_number,
  i.customer_id,
  c.name AS customer_name,
  i.order_id,
  o.service_type,
  i.total,
  i.paid_amount,
  (i.total - i.paid_amount) AS remaining_balance,
  i.status,
  i.due_date,
  i.created_at
FROM invoices i
LEFT JOIN customers c ON i.customer_id = c.id
LEFT JOIN orders o ON i.order_id = o.id;

-- View: Low stock inventory
CREATE OR REPLACE VIEW low_stock_inventory AS
SELECT 
  it.id,
  t.nickname AS truck_name,
  it.item_name,
  it.qty_on_hand,
  it.min_threshold,
  (it.min_threshold - it.qty_on_hand) AS shortage
FROM inventory_truck it
LEFT JOIN trucks t ON it.truck_id = t.id
WHERE it.qty_on_hand < it.min_threshold
ORDER BY shortage DESC;

-- =====================================================================
-- ENABLE ROW-LEVEL SECURITY (RLS)
-- Recommended: Configure RLS policies based on user roles
-- =====================================================================

-- Uncomment and customize based on your authentication model:
/*
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Example policy (adjust to your auth schema):
CREATE POLICY "Users can view their own customer records"
  ON customers FOR SELECT
  USING (auth.uid() IS NOT NULL);
*/

-- =====================================================================
-- SEED DATA (Optional, for testing)
-- =====================================================================

-- Uncomment to insert sample data:
/*
INSERT INTO trucks (nickname, license_plate, capacity_liters, status)
VALUES 
  ('Camión 1', 'ABX-123', 500, 'active'),
  ('Camión 2', 'ABX-124', 500, 'active'),
  ('Van Roja', 'ABX-125', 200, 'active')
ON CONFLICT DO NOTHING;

INSERT INTO rates (concept, type, price, description)
VALUES 
  ('Hora técnico', 'hourly', 850, 'Tarifa por hora de trabajo técnico'),
  ('Visita domiciliaria', 'fixed', 500, 'Cobro por visita de diagnóstico'),
  ('Emergencia 24h', 'emergency', 2500, 'Tarifa de emergencia fuera de horario'),
  ('Mano de obra instalación', 'hourly', 1200, 'Instalación de sistemas principales')
ON CONFLICT DO NOTHING;

INSERT INTO settings (company_name, phone, email, address, theme)
VALUES 
  ('Opsis Plumbing', '+52 55 1234 5678', 'info@opsisplumbing.com', 'Mexico City', 'light')
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();
*/

