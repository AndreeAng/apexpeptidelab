-- ============================================================
-- Apex Peptide Lab - Supabase Database Schema
-- Run this SQL in the Supabase SQL Editor to set up all tables,
-- functions, triggers, and RLS policies.
-- ============================================================

-- ============================================================
-- 1. TABLES
-- ============================================================

-- Profiles: extends Supabase auth.users with app-specific data
CREATE TABLE profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  name       TEXT,
  last_name  TEXT,
  phone      TEXT,
  email      TEXT,
  addresses  JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Products: peptide catalog
CREATE TABLE products (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT UNIQUE NOT NULL,
  name             TEXT NOT NULL,
  short_name       TEXT,
  composition      TEXT,
  dose_label       TEXT,
  category         TEXT,
  accent_color     TEXT DEFAULT '#b8ca60',
  description      TEXT,
  long_description TEXT,
  highlights       JSONB DEFAULT '[]',
  benefits         JSONB DEFAULT '[]',
  specs            JSONB DEFAULT '[]',
  storage          TEXT,
  purity           TEXT,
  price_bs         NUMERIC NOT NULL DEFAULT 0,
  image            TEXT,
  in_stock         BOOLEAN DEFAULT true,
  is_offer         BOOLEAN DEFAULT false,
  offer_price_bs   NUMERIC,
  faqs             JSONB DEFAULT '[]',
  sort_order       INT DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- Orders: customer purchases
CREATE TABLE orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number     TEXT UNIQUE NOT NULL,
  user_id          UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_name    TEXT NOT NULL,
  customer_phone   TEXT NOT NULL,
  customer_address TEXT,
  customer_city    TEXT,
  notes            TEXT,
  admin_notes      TEXT,
  items            JSONB NOT NULL DEFAULT '[]',
  subtotal         NUMERIC DEFAULT 0,
  discount         NUMERIC DEFAULT 0,
  coupon_code      TEXT,
  total            NUMERIC DEFAULT 0,
  status           TEXT DEFAULT 'pending'
                   CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- Coupons: discount codes
CREATE TABLE coupons (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code       TEXT UNIQUE NOT NULL,
  type       TEXT NOT NULL CHECK (type IN ('percentage','fixed')),
  value      NUMERIC NOT NULL,
  min_order  NUMERIC,
  max_uses   INT,
  used_count INT DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active  BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Order sequence: single-row counter for generating order numbers
CREATE TABLE order_sequence (
  id          INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  last_number INT DEFAULT 0
);

-- Seed the sequence row
INSERT INTO order_sequence (id, last_number) VALUES (1, 0);


-- ============================================================
-- 2. RPC FUNCTION: get_next_order_number()
-- Atomically increments the counter and returns 'APX-0001' style string.
-- ============================================================

CREATE OR REPLACE FUNCTION get_next_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  next_num INT;
BEGIN
  UPDATE order_sequence
     SET last_number = last_number + 1
   WHERE id = 1
  RETURNING last_number INTO next_num;

  RETURN 'APX-' || lpad(next_num::text, 4, '0');
END;
$$;


-- ============================================================
-- 3. TRIGGER: auto-create profile on new user sign-up
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();


-- ============================================================
-- 4. ENABLE ROW-LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE products  ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders    ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons   ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 5. HELPER: check if current user is admin
-- ============================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;


-- ============================================================
-- 6. RLS POLICIES
-- ============================================================

-- ----- PRODUCTS -----
-- Anyone (anon + authenticated) can read products
CREATE POLICY "products_select_all"
  ON products FOR SELECT
  USING (true);

-- Only admins can insert products
CREATE POLICY "products_insert_admin"
  ON products FOR INSERT
  WITH CHECK (is_admin());

-- Only admins can update products
CREATE POLICY "products_update_admin"
  ON products FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Only admins can delete products
CREATE POLICY "products_delete_admin"
  ON products FOR DELETE
  USING (is_admin());


-- ----- ORDERS -----
-- Authenticated users can see their own orders; admins can see all
CREATE POLICY "orders_select_own_or_admin"
  ON orders FOR SELECT
  USING (
    auth.uid() = user_id
    OR is_admin()
  );

-- Anyone (anon + authenticated) can create orders (guest checkout)
CREATE POLICY "orders_insert_all"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Only admins can update orders (change status, add notes, etc.)
CREATE POLICY "orders_update_admin"
  ON orders FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());


-- ----- PROFILES -----
-- Users can read their own profile; admins can read all
CREATE POLICY "profiles_select_own_or_admin"
  ON profiles FOR SELECT
  USING (
    auth.uid() = id
    OR is_admin()
  );

-- Users can update their own profile; admins can update all
CREATE POLICY "profiles_update_own_or_admin"
  ON profiles FOR UPDATE
  USING (
    auth.uid() = id
    OR is_admin()
  )
  WITH CHECK (
    auth.uid() = id
    OR is_admin()
  );


-- ----- COUPONS -----
-- Anyone can read coupons (needed for client-side validation)
CREATE POLICY "coupons_select_all"
  ON coupons FOR SELECT
  USING (true);

-- Only admins can insert coupons
CREATE POLICY "coupons_insert_admin"
  ON coupons FOR INSERT
  WITH CHECK (is_admin());

-- Only admins can update coupons
CREATE POLICY "coupons_update_admin"
  ON coupons FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Only admins can delete coupons
CREATE POLICY "coupons_delete_admin"
  ON coupons FOR DELETE
  USING (is_admin());


-- ============================================================
-- 7. STORAGE BUCKET (manual step)
-- ============================================================
-- Run the following in the Supabase Dashboard under Storage,
-- or use the SQL below:
--
--   INSERT INTO storage.buckets (id, name, public)
--   VALUES ('products', 'products', true);
--
-- Then add a storage policy to allow public reads:
--
--   CREATE POLICY "public_read_products_bucket"
--     ON storage.objects FOR SELECT
--     USING (bucket_id = 'products');
--
-- And allow admins to upload/update/delete:
--
--   CREATE POLICY "admin_insert_products_bucket"
--     ON storage.objects FOR INSERT
--     WITH CHECK (bucket_id = 'products' AND is_admin());
--
--   CREATE POLICY "admin_update_products_bucket"
--     ON storage.objects FOR UPDATE
--     USING (bucket_id = 'products' AND is_admin());
--
--   CREATE POLICY "admin_delete_products_bucket"
--     ON storage.objects FOR DELETE
--     USING (bucket_id = 'products' AND is_admin());
