-- Run this in Supabase SQL Editor. Safe to rerun.
-- Adds fields used by the placement tracker interface.
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS short_name TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'Full-time',
  ADD COLUMN IF NOT EXISTS salary NUMERIC(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cgpa NUMERIC(3,1) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS percentage NUMERIC(5,2) NOT NULL DEFAULT 60,
  ADD COLUMN IF NOT EXISTS overview TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS eligibility TEXT DEFAULT '';

DROP POLICY IF EXISTS "Anyone can add companies" ON public.companies;
CREATE POLICY "Anyone can add companies"
ON public.companies FOR INSERT TO anon, authenticated
WITH CHECK (
  LENGTH(TRIM(name)) > 0
  AND eligibility_percentage >= 0 AND eligibility_percentage <= 100
  AND percentage >= 0 AND percentage <= 100
  AND status IN ('Open', 'Closed', 'Upcoming', 'Applications Open', 'Registration Closed', 'Completed')
);

-- Anyone can delete any listing. This is intentionally public as requested.
DROP POLICY IF EXISTS "Anyone can delete companies" ON public.companies;
CREATE POLICY "Anyone can delete companies"
ON public.companies FOR DELETE TO anon, authenticated
USING (true);
