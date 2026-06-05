
-- Add payment tracking columns to pool_members
ALTER TABLE public.pool_members
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS stripe_session_id text,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;

ALTER TABLE public.pool_members
  ADD CONSTRAINT pool_members_payment_status_check
  CHECK (payment_status IN ('pending', 'paid', 'exempt'));

-- Update existing rows: owners become exempt, others stay pending
UPDATE public.pool_members pm
SET payment_status = 'exempt'
WHERE EXISTS (
  SELECT 1 FROM public.pools p
  WHERE p.id = pm.pool_id AND p.owner_id = pm.user_id
);

-- Replace "Members can view pool members" so pending members are hidden from peers
DROP POLICY IF EXISTS "Members can view pool members" ON public.pool_members;

CREATE POLICY "View paid members or self or as owner"
ON public.pool_members
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR pool_id IN (SELECT id FROM public.pools WHERE owner_id = auth.uid())
  OR (
    payment_status IN ('paid', 'exempt')
    AND pool_id IN (
      SELECT pm.pool_id FROM public.pool_members pm
      WHERE pm.user_id = auth.uid() AND pm.payment_status IN ('paid', 'exempt')
    )
  )
);
