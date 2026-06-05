
-- Wipe existing pools data (start fresh as requested)
DELETE FROM public.pool_members;
DELETE FROM public.pools;

-- Make access_password optional (replaced by invite link flow)
ALTER TABLE public.pools ALTER COLUMN access_password DROP NOT NULL;

-- Add tier + frozen entry fee
ALTER TABLE public.pools
  ADD COLUMN IF NOT EXISTS tier text NOT NULL DEFAULT 'tier_50',
  ADD COLUMN IF NOT EXISTS entry_fee_cents integer NOT NULL DEFAULT 590;

ALTER TABLE public.pools
  ADD CONSTRAINT pools_tier_check CHECK (tier IN ('tier_15','tier_50','tier_150'));

-- Allow anonymous visitors to read pool basics via the invite link landing page
GRANT SELECT ON public.pools TO anon;

DROP POLICY IF EXISTS "Authenticated users can view pools by join_code" ON public.pools;
CREATE POLICY "Anyone can view pools by join_code"
  ON public.pools FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow anonymous visitors to count members on the invite landing (no PII exposed: only ids)
GRANT SELECT ON public.pool_members TO anon;
