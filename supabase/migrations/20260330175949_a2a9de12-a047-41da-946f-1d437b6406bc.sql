
-- Create pool member role enum
CREATE TYPE public.pool_role AS ENUM ('admin', 'player');

-- Create pools table
CREATE TABLE public.pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  access_password TEXT NOT NULL,
  prize_info TEXT,
  max_players INT NOT NULL DEFAULT 50,
  join_code TEXT UNIQUE NOT NULL,
  scoring_config JSONB NOT NULL DEFAULT '{"exact_score": 25, "winner_goal_diff": 18, "winner_draw": 10, "team_goals": 5, "champion": 50}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pool_members table
CREATE TABLE public.pool_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_id UUID REFERENCES public.pools(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role pool_role NOT NULL DEFAULT 'player',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (pool_id, user_id)
);

-- Enable RLS
ALTER TABLE public.pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pool_members ENABLE ROW LEVEL SECURITY;

-- Pools RLS policies
CREATE POLICY "Authenticated users can view pools they belong to"
  ON public.pools FOR SELECT TO authenticated
  USING (
    id IN (SELECT pool_id FROM public.pool_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Authenticated users can view pools by join_code"
  ON public.pools FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create pools"
  ON public.pools FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Pool owners can update their pools"
  ON public.pools FOR UPDATE TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Pool owners can delete their pools"
  ON public.pools FOR DELETE TO authenticated
  USING (owner_id = auth.uid());

-- Pool members RLS policies
CREATE POLICY "Members can view pool members"
  ON public.pool_members FOR SELECT TO authenticated
  USING (
    pool_id IN (SELECT pool_id FROM public.pool_members pm WHERE pm.user_id = auth.uid())
  );

CREATE POLICY "Authenticated users can join pools"
  ON public.pool_members FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Pool admins can update members"
  ON public.pool_members FOR UPDATE TO authenticated
  USING (
    pool_id IN (SELECT p.id FROM public.pools p WHERE p.owner_id = auth.uid())
  );

CREATE POLICY "Pool admins can remove members"
  ON public.pool_members FOR DELETE TO authenticated
  USING (
    user_id = auth.uid() OR
    pool_id IN (SELECT p.id FROM public.pools p WHERE p.owner_id = auth.uid())
  );

-- Updated_at trigger for pools
CREATE TRIGGER update_pools_updated_at
  BEFORE UPDATE ON public.pools
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
