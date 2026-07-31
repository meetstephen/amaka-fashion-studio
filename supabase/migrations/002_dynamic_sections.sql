CREATE TABLE IF NOT EXISTS public.hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  eyebrow text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  cta_label text NOT NULL DEFAULT 'Explore Collections',
  cta_href text NOT NULL DEFAULT '/collections',
  secondary_label text NOT NULL DEFAULT '',
  secondary_href text NOT NULL DEFAULT '',
  fabric_name text NOT NULL DEFAULT '',
  fabric_origin text NOT NULL DEFAULT '',
  image_id uuid REFERENCES public.images(id) ON DELETE SET NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.collection_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  tagline text NOT NULL DEFAULT '',
  image_id uuid REFERENCES public.images(id) ON DELETE SET NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read hero_slides"  ON public.hero_slides;
DROP POLICY IF EXISTS "Allow insert hero_slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Allow update hero_slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Allow delete hero_slides" ON public.hero_slides;
CREATE POLICY "Public read hero_slides"  ON public.hero_slides FOR SELECT USING (true);
CREATE POLICY "Allow insert hero_slides" ON public.hero_slides FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update hero_slides" ON public.hero_slides FOR UPDATE USING (true);
CREATE POLICY "Allow delete hero_slides" ON public.hero_slides FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public read collection_cards"  ON public.collection_cards;
DROP POLICY IF EXISTS "Allow insert collection_cards" ON public.collection_cards;
DROP POLICY IF EXISTS "Allow update collection_cards" ON public.collection_cards;
DROP POLICY IF EXISTS "Allow delete collection_cards" ON public.collection_cards;
CREATE POLICY "Public read collection_cards"  ON public.collection_cards FOR SELECT USING (true);
CREATE POLICY "Allow insert collection_cards" ON public.collection_cards FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update collection_cards" ON public.collection_cards FOR UPDATE USING (true);
CREATE POLICY "Allow delete collection_cards" ON public.collection_cards FOR DELETE USING (true);

NOTIFY pgrst, 'reload schema';

INSERT INTO public.hero_slides
  (eyebrow, title, subtitle, cta_label, cta_href, secondary_label, secondary_href, fabric_name, fabric_origin, image_id, sort_order)
SELECT
  'Where Heritage Meets Distinction',
  'Amaka Fashion Atelier',
  'Bespoke menswear from Abakaliki - hand-finished, deeply rooted, quietly luxurious. The blueprint of the modern Nigerian gentleman.',
  'Explore Collections', '/collections',
  'Book Appointment', 'https://wa.me/2349131272407?text=Hello%20Amaka%20Fashion%20Atelier%2C%20I%27d%20like%20to%20book%20an%20appointment',
  'Italian Wool', 'Premium · 14oz',
  (SELECT image_id FROM public.placements WHERE slot_key = 'home:hero:heritage'),
  1
WHERE NOT EXISTS (SELECT 1 FROM public.hero_slides);

INSERT INTO public.hero_slides
  (eyebrow, title, subtitle, cta_label, cta_href, secondary_label, secondary_href, fabric_name, fabric_origin, image_id, sort_order)
SELECT
  'Flagship · Senator Wear',
  'The garment of statesmen',
  'Italian wool in conversation with ancestral cadence. Cut for the man whose silence speaks before he does - and whose presence settles the room.',
  'View Senator Wear', '/collections',
  'Speak to a Stylist', 'https://wa.me/2349131272407?text=Hello%2C%20I%27d%20like%20to%20discuss%20a%20Senator%20piece',
  'Aso-Oke', 'Hand-Woven · Abakaliki',
  (SELECT image_id FROM public.placements WHERE slot_key = 'home:hero:senator'),
  2
WHERE (SELECT count(*) FROM public.hero_slides) < 2;

INSERT INTO public.hero_slides
  (eyebrow, title, subtitle, cta_label, cta_href, secondary_label, secondary_href, fabric_name, fabric_origin, image_id, sort_order)
SELECT
  'The Wedding House',
  'An heirloom, in the making',
  'From the first muslin to the final hand-finished buttonhole, we weave heritage into every thread - bullion-gold agbada, three-piece bespoke, groomsmen perfectly attuned. We begin eight to twelve weeks before the day.',
  'Begin a Wedding Suite', 'https://wa.me/2349131272407?text=Hello%21%20I%27d%20like%20to%20begin%20a%20wedding%20suite',
  'View the Lookbook', '/lookbook',
  'Bullion Gold', '24K Thread · Hand-Laid',
  (SELECT image_id FROM public.placements WHERE slot_key = 'home:hero:wedding'),
  3
WHERE (SELECT count(*) FROM public.hero_slides) < 3;

INSERT INTO public.collection_cards (name, tagline, image_id, sort_order)
SELECT 'Senator Wear', 'The garment of statesmen.', (SELECT image_id FROM public.placements WHERE slot_key = 'home:collections:senator-wear'), 1
WHERE NOT EXISTS (SELECT 1 FROM public.collection_cards);

INSERT INTO public.collection_cards (name, tagline, image_id, sort_order)
SELECT 'Bespoke Suits', 'A second skin in worsted wool.', (SELECT image_id FROM public.placements WHERE slot_key = 'home:collections:bespoke-suits'), 2
WHERE (SELECT count(*) FROM public.collection_cards) < 2;

INSERT INTO public.collection_cards (name, tagline, image_id, sort_order)
SELECT 'Shirts', 'Egyptian cotton. French linen.', (SELECT image_id FROM public.placements WHERE slot_key = 'home:collections:shirts'), 3
WHERE (SELECT count(*) FROM public.collection_cards) < 3;

INSERT INTO public.collection_cards (name, tagline, image_id, sort_order)
SELECT 'Casual', 'Off-duty, never off-form.', (SELECT image_id FROM public.placements WHERE slot_key = 'home:collections:casual'), 4
WHERE (SELECT count(*) FROM public.collection_cards) < 4;

INSERT INTO public.collection_cards (name, tagline, image_id, sort_order)
SELECT 'Traditional', 'Heritage rendered in thread.', (SELECT image_id FROM public.placements WHERE slot_key = 'home:collections:traditional'), 5
WHERE (SELECT count(*) FROM public.collection_cards) < 5;

INSERT INTO public.collection_cards (name, tagline, image_id, sort_order)
SELECT 'Corporate', 'Authority, lined in Ankara.', (SELECT image_id FROM public.placements WHERE slot_key = 'home:collections:corporate'), 6
WHERE (SELECT count(*) FROM public.collection_cards) < 6;

DELETE FROM public.placements WHERE slot_key LIKE 'home:hero:%' OR slot_key LIKE 'home:collections:%';