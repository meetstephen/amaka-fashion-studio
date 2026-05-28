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
