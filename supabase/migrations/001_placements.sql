-- ============================================================
-- Placements: explicit, admin-controlled image-to-slot mapping.
-- Replaces all filename/category matching logic in the frontend.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.placements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_key text UNIQUE NOT NULL,
  slot_label text NOT NULL,
  page_group text NOT NULL,
  image_id uuid REFERENCES public.images(id) ON DELETE SET NULL,
  sort_order int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.placements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read placements"  ON public.placements;
DROP POLICY IF EXISTS "Allow insert placements" ON public.placements;
DROP POLICY IF EXISTS "Allow update placements" ON public.placements;
DROP POLICY IF EXISTS "Allow delete placements" ON public.placements;

CREATE POLICY "Public read placements"  ON public.placements FOR SELECT USING (true);
CREATE POLICY "Allow insert placements" ON public.placements FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update placements" ON public.placements FOR UPDATE USING (true);
CREATE POLICY "Allow delete placements" ON public.placements FOR DELETE USING (true);

NOTIFY pgrst, 'reload schema';

-- ============================================================
-- Seed every known slot. image_id left null initially, then
-- backfilled below from whatever currently matches by name.
-- ============================================================

INSERT INTO public.placements (slot_key, slot_label, page_group, sort_order) VALUES
  ('home:hero:heritage', 'Hero Carousel — Heritage Slide', 'Homepage', 1),
  ('home:hero:senator',  'Hero Carousel — Senator Slide',  'Homepage', 2),
  ('home:hero:wedding',  'Hero Carousel — Wedding Slide',  'Homepage', 3),
  ('home:collections:senator-wear', 'Collections Grid — Senator Wear', 'Homepage', 4),
  ('home:collections:bespoke-suits', 'Collections Grid — Bespoke Suits', 'Homepage', 5),
  ('home:collections:shirts', 'Collections Grid — Shirts', 'Homepage', 6),
  ('home:collections:casual', 'Collections Grid — Casual', 'Homepage', 7),
  ('home:collections:traditional', 'Collections Grid — Traditional', 'Homepage', 8),
  ('home:collections:corporate', 'Collections Grid — Corporate', 'Homepage', 9),
  ('about:owner-photo', 'About Page — Owner/Designer Photo', 'About', 1),
  ('collections:senator-statesman', 'Collections — The Statesman', 'Collections', 1),
  ('collections:senator-diplomat', 'Collections — The Diplomat', 'Collections', 2),
  ('collections:senator-elder', 'Collections — The Elder', 'Collections', 3),
  ('collections:senator-executive', 'Collections — The Executive', 'Collections', 4),
  ('collections:shirt-oxford-classic', 'Collections — Oxford Classic', 'Collections', 5),
  ('collections:shirt-artisan', 'Collections — The Artisan', 'Collections', 6),
  ('collections:shirt-linen-breeze', 'Collections — Linen Breeze', 'Collections', 7),
  ('collections:suit-chairman', 'Collections — The Chairman', 'Collections', 8),
  ('collections:suit-maverick', 'Collections — The Maverick', 'Collections', 9),
  ('collections:suit-pinnacle', 'Collections — The Pinnacle', 'Collections', 10),
  ('collections:casual-weekend-luxe', 'Collections — Weekend Luxe', 'Collections', 11),
  ('collections:casual-wanderer', 'Collections — The Wanderer', 'Collections', 12),
  ('collections:casual-lounger', 'Collections — The Lounger', 'Collections', 13),
  ('collections:traditional-igbo-heritage', 'Collections — Igbo Heritage', 'Collections', 14),
  ('collections:traditional-chieftain', 'Collections — The Chieftain', 'Collections', 15),
  ('collections:traditional-ancestral', 'Collections — Ancestral Pride', 'Collections', 16),
  ('collections:corporate-authority', 'Collections — Boardroom Authority', 'Collections', 17),
  ('collections:corporate-director', 'Collections — The Director', 'Collections', 18),
  ('collections:corporate-edge', 'Collections — Executive Edge', 'Collections', 19)
ON CONFLICT (slot_key) DO NOTHING;

-- ============================================================
-- Backfill: carry over whatever is CURRENTLY showing (matched
-- by the old name/category logic) so nothing visually changes
-- the moment this migration runs. One-time only.
-- ============================================================

UPDATE public.placements p SET image_id = i.id, updated_at = now()
FROM public.images i
WHERE p.slot_key = 'home:hero:heritage' AND p.image_id IS NULL
  AND i.category = 'hero' AND i.name ILIKE '%heritage%' AND i.url IS NOT NULL
ORDER BY i.created_at DESC LIMIT 1;

UPDATE public.placements p SET image_id = i.id, updated_at = now()
FROM public.images i
WHERE p.slot_key = 'home:hero:senator' AND p.image_id IS NULL
  AND i.category = 'hero' AND i.name ILIKE '%senator%' AND i.url IS NOT NULL
ORDER BY i.created_at DESC LIMIT 1;

UPDATE public.placements p SET image_id = i.id, updated_at = now()
FROM public.images i
WHERE p.slot_key = 'home:hero:wedding' AND p.image_id IS NULL
  AND i.category = 'hero' AND i.name ILIKE '%wedding%' AND i.url IS NOT NULL
ORDER BY i.created_at DESC LIMIT 1;

UPDATE public.placements p SET image_id = sub.id, updated_at = now()
FROM (
  SELECT id FROM public.images
  WHERE category = 'about' AND url IS NOT NULL
  ORDER BY created_at DESC LIMIT 1
) sub
WHERE p.slot_key = 'about:owner-photo' AND p.image_id IS NULL;

UPDATE public.placements p SET image_id = sub.id, updated_at = now()
FROM (
  SELECT id FROM public.images
  WHERE category = 'collections' AND url IS NOT NULL AND name ILIKE '%senator%'
  ORDER BY created_at DESC LIMIT 1
) sub
WHERE p.slot_key = 'home:collections:senator-wear' AND p.image_id IS NULL;

UPDATE public.placements p SET image_id = sub.id, updated_at = now()
FROM (
  SELECT id FROM public.images
  WHERE category = 'collections' AND url IS NOT NULL AND (name ILIKE '%suit%' AND name NOT ILIKE '%senator%')
  ORDER BY created_at DESC LIMIT 1
) sub
WHERE p.slot_key = 'home:collections:bespoke-suits' AND p.image_id IS NULL;

UPDATE public.placements p SET image_id = sub.id, updated_at = now()
FROM (
  SELECT id FROM public.images
  WHERE category = 'collections' AND url IS NOT NULL AND name ILIKE '%shirt%'
  ORDER BY created_at DESC LIMIT 1
) sub
WHERE p.slot_key = 'home:collections:shirts' AND p.image_id IS NULL;

UPDATE public.placements p SET image_id = sub.id, updated_at = now()
FROM (
  SELECT id FROM public.images
  WHERE category = 'collections' AND url IS NOT NULL AND name ILIKE '%casual%'
  ORDER BY created_at DESC LIMIT 1
) sub
WHERE p.slot_key = 'home:collections:casual' AND p.image_id IS NULL;

UPDATE public.placements p SET image_id = sub.id, updated_at = now()
FROM (
  SELECT id FROM public.images
  WHERE category = 'collections' AND url IS NOT NULL AND name ILIKE '%tradition%'
  ORDER BY created_at DESC LIMIT 1
) sub
WHERE p.slot_key = 'home:collections:traditional' AND p.image_id IS NULL;

UPDATE public.placements p SET image_id = sub.id, updated_at = now()
FROM (
  SELECT id FROM public.images
  WHERE category = 'collections' AND url IS NOT NULL AND name ILIKE '%corporate%'
  ORDER BY created_at DESC LIMIT 1
) sub
WHERE p.slot_key = 'home:collections:corporate' AND p.image_id IS NULL;

UPDATE public.placements p SET image_id = sub.id, updated_at = now()
FROM (SELECT id FROM public.images WHERE category='collections' AND url IS NOT NULL AND lower(trim(name))='the statesman' ORDER BY created_at DESC LIMIT 1) sub
WHERE p.slot_key = 'collections:senator-statesman' AND p.image_id IS NULL;

UPDATE public.placements p SET image_id = sub.id, updated_at = now()
FROM (SELECT id FROM public.images WHERE category='collections' AND url IS NOT NULL AND lower(trim(name))='the diplomat' ORDER BY created_at DESC LIMIT 1) sub
WHERE p.slot_key = 'collections:senator-diplomat' AND p.image_id IS NULL;

UPDATE public.placements p SET image_id = sub.id, updated_at = now()
FROM (SELECT id FROM public.images WHERE category='collections' AND url IS NOT NULL AND lower(trim(name))='the elder' ORDER BY created_at DESC LIMIT 1) sub
WHERE p.slot_key = 'collections:senator-elder' AND p.image_id IS NULL;

UPDATE public.placements p SET image_id = sub.id, updated_at = now()
FROM (SELECT id FROM public.images WHERE category='collections' AND url IS NOT NULL AND lower(trim(name))='the executive' ORDER BY created_at DESC LIMIT 1) sub
WHERE p.slot_key = 'collections:senator-executive' AND p.image_id IS NULL;

UPDATE public.placements p SET image_id = sub.id, updated_at = now()
FROM (SELECT id FROM public.images WHERE category='collections' AND url IS NOT NULL AND lower(trim(name))='oxford classic' ORDER BY created_at DESC LIMIT 1) sub
WHERE p.slot_key = 'collections:shirt-oxford-classic' AND p.image_id IS NULL;

UPDATE public.placements p SET image_id = sub.id, updated_at = now()
FROM (SELECT id FROM public.images WHERE category='collections' AND url IS NOT NULL AND lower(trim(name))='the artisan' ORDER BY created_at DESC LIMIT 1) sub
WHERE p.slot_key = 'collections:shirt-artisan' AND p.image_id IS NULL;

UPDATE public.placements p SET image_id = sub.id, updated_at = now()
FROM (SELECT id FROM public.images WHERE category='collections' AND url IS NOT NULL AND lower(trim(name))='linen breeze' ORDER BY created_at DESC LIMIT 1) sub
WHERE p.slot_key = 'collections:shirt-linen-breeze' AND p.image_id IS NULL;

UPDATE public.placements p SET image_id = sub.id, updated_at = now()
FROM (SELECT id FROM public.images WHERE category='collections' AND url IS NOT NULL AND lower(trim(name))='the chairman' ORDER BY created_at DESC LIMIT 1) sub
WHERE p.slot_key = 'collections:suit-chairman' AND p.image_id IS NULL;

UPDATE public.placements p SET image_id = sub.id, updated_at = now()
FROM (SELECT id FROM public.images WHERE category='collections' AND url IS NOT NULL AND lower(trim(name))='the maverick' ORDER BY created_at DESC LIMIT 1) sub
WHERE p.slot_key = 'collections:suit-maverick' AND p.image_id IS NULL;

UPDATE public.placements p SET image_id = sub.id, updated_at = now()
FROM (SELECT id FROM public.images WHERE category='collections' AND url IS NOT NULL AND lower(trim(name))='the pinnacle' ORDER BY created_at DESC LIMIT 1) sub
WHERE p.slot_key = 'collections:suit-pinnacle' AND p.image_id IS NULL;

UPDATE public.placements p SET image_id = sub.id, updated_at = now()
FROM (SELECT id FROM public.images WHERE category='collections' AND url IS NOT NULL AND lower(trim(name))='weekend luxe' ORDER BY created_at DESC LIMIT 1) sub
WHERE p.slot_key = 'collections:casual-weekend-luxe' AND p.image_id IS NULL;

UPDATE public.placements p SET image_id = sub.id, updated_at = now()
FROM (SELECT id FROM public.images WHERE category='collections' AND url IS NOT NULL AND lower(trim(name))='the wanderer' ORDER BY created_at DESC LIMIT 1) sub
WHERE p.slot_key = 'collections:casual-wanderer' AND p.image_id IS NULL;

UPDATE public.placements p SET image_id = sub.id, updated_at = now()
FROM (SELECT id FROM public.images WHERE category='collections' AND url IS NOT NULL AND lower(trim(name))='the lounger' ORDER BY created_at DESC LIMIT 1) sub
WHERE p.slot_key = 'collections:casual-lounger' AND p.image_id IS NULL;

UPDATE public.placements p SET image_id = sub.id, updated_at = now()
FROM (SELECT id FROM public.images WHERE category='collections' AND url IS NOT NULL AND lower(trim(name))='igbo heritage' ORDER BY created_at DESC LIMIT 1) sub
WHERE p.slot_key = 'collections:traditional-igbo-heritage' AND p.image_id IS NULL;

UPDATE public.placements p SET image_id = sub.id, updated_at = now()
FROM (SELECT id FROM public.images WHERE category='collections' AND url IS NOT NULL AND lower(trim(name))='the chieftain' ORDER BY created_at DESC LIMIT 1) sub
WHERE p.slot_key = 'collections:traditional-chieftain' AND p.image_id IS NULL;

UPDATE public.placements p SET image_id = sub.id, updated_at = now()
FROM (SELECT id FROM public.images WHERE category='collections' AND url IS NOT NULL AND lower(trim(name))='ancestral pride' ORDER BY created_at DESC LIMIT 1) sub
WHERE p.slot_key = 'collections:traditional-ancestral' AND p.image_id IS NULL;

UPDATE public.placements p SET image_id = sub.id, updated_at = now()
FROM (SELECT id FROM public.images WHERE category='collections' AND url IS NOT NULL AND lower(trim(name))='boardroom authority' ORDER BY created_at DESC LIMIT 1) sub
WHERE p.slot_key = 'collections:corporate-authority' AND p.image_id IS NULL;

UPDATE public.placements p SET image_id = sub.id, updated_at = now()
FROM (SELECT id FROM public.images WHERE category='collections' AND url IS NOT NULL AND lower(trim(name))='the director' ORDER BY created_at DESC LIMIT 1) sub
WHERE p.slot_key = 'collections:corporate-director' AND p.image_id IS NULL;

UPDATE public.placements p SET image_id = sub.id, updated_at = now()
FROM (SELECT id FROM public.images WHERE category='collections' AND url IS NOT NULL AND lower(trim(name))='executive edge' ORDER BY created_at DESC LIMIT 1) sub
WHERE p.slot_key = 'collections:corporate-edge' AND p.image_id IS NULL;