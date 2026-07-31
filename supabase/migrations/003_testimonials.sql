CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  quote text NOT NULL DEFAULT '',
  rating int NOT NULL DEFAULT 5,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read testimonials"  ON public.testimonials;
DROP POLICY IF EXISTS "Allow insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow update testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow delete testimonials" ON public.testimonials;
CREATE POLICY "Public read testimonials"  ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Allow insert testimonials" ON public.testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update testimonials" ON public.testimonials FOR UPDATE USING (true);
CREATE POLICY "Allow delete testimonials" ON public.testimonials FOR DELETE USING (true);

NOTIFY pgrst, 'reload schema';