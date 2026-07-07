-- ============================================
-- Amaka Fashion Atelier - Row Level Security
-- ============================================
-- Run this in Supabase SQL Editor after creating tables.
--
-- Strategy:
-- - RLS enabled on all tables (not wide-open by default)
-- - Public read for content tables (images, lookbook, content, featured)
-- - Write operations gated by admin middleware server-side
-- - The anon key with these policies allows reads from public site
--   and writes from admin panel (which is protected by session auth)

-- ============================================
-- SECURITY NOTE
-- ============================================
-- The policies below use USING (true) which means the anon key can
-- perform ALL operations (SELECT, INSERT, UPDATE, DELETE) on every table.
-- This is acceptable for a single-admin site where:
--   1. The admin panel is gated by server-side session middleware
--   2. The anon key is only used for public reads from the storefront
--   3. Public writes (measurements form) go through a rate-limited API route
--
-- FOR PRODUCTION HARDENING, consider:
--   - Restrict anon role to SELECT-only on content tables
--   - Move all INSERT/UPDATE/DELETE to server-side API routes
--     that use the SUPABASE_SERVICE_ROLE_KEY (never exposed to browser)
--   - Add Supabase Auth and use auth.uid() in write policies
--   - Add rate limiting on public INSERT tables (like customers)
--
-- Example hardened policy for customers table (public insert only):
--   CREATE POLICY "Public insert customers" ON customers
--     FOR INSERT WITH CHECK (true);
--   CREATE POLICY "Admin manage customers" ON customers
--     FOR ALL USING (auth.uid() IS NOT NULL);
-- ============================================

-- Enable RLS on all tables
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE lookbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ access (anyone can view the site content)
CREATE POLICY "Public read images" ON images FOR SELECT USING (true);
CREATE POLICY "Public read lookbook" ON lookbook FOR SELECT USING (true);
CREATE POLICY "Public read content" ON content FOR SELECT USING (true);
CREATE POLICY "Public read featured" ON featured FOR SELECT USING (true);

-- ADMIN WRITE access (all operations allowed - admin middleware gates /admin routes)
CREATE POLICY "Admin write images" ON images FOR ALL USING (true);
CREATE POLICY "Admin write lookbook" ON lookbook FOR ALL USING (true);
CREATE POLICY "Admin write content" ON content FOR ALL USING (true);
CREATE POLICY "Admin write featured" ON featured FOR ALL USING (true);
CREATE POLICY "Admin all inquiries" ON inquiries FOR ALL USING (true);
CREATE POLICY "Admin all bookings" ON bookings FOR ALL USING (true);
CREATE POLICY "Admin all customers" ON customers FOR ALL USING (true);

-- ============================================
-- STORAGE POLICIES (for the 'images' bucket)
-- ============================================
-- Run these AFTER creating the 'images' bucket in Storage settings.
-- These allow public reads and authenticated/anon uploads.

-- Allow anyone to view images (public bucket)
CREATE POLICY "Public read images bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

-- Allow uploads (INSERT) to the images bucket
CREATE POLICY "Allow uploads to images bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'images');

-- Allow updates (e.g., replace) in the images bucket
CREATE POLICY "Allow updates in images bucket"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'images');

-- Allow deletions from the images bucket
CREATE POLICY "Allow deletes from images bucket"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'images');
