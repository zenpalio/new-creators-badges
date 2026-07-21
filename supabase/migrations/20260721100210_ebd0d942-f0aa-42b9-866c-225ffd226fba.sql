
ALTER TABLE public.cast_members ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.locations ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.dramas ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.episodes ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.scenes ALTER COLUMN user_id DROP NOT NULL;

DROP POLICY IF EXISTS "own cast" ON public.cast_members;
DROP POLICY IF EXISTS "own locations" ON public.locations;
DROP POLICY IF EXISTS "own dramas" ON public.dramas;
DROP POLICY IF EXISTS "own episodes" ON public.episodes;
DROP POLICY IF EXISTS "own scenes" ON public.scenes;

CREATE POLICY "public cast" ON public.cast_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public locations" ON public.locations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public dramas" ON public.dramas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public episodes" ON public.episodes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public scenes" ON public.scenes FOR ALL USING (true) WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cast_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.locations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dramas TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.episodes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scenes TO anon;
