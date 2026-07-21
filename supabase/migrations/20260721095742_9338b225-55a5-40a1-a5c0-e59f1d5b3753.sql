
-- CAST MEMBERS (workspace-shared, per user)
CREATE TABLE public.cast_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'supporting',
  element_id TEXT,
  preview_url TEXT,
  voice_id TEXT,
  personality TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cast_members TO authenticated;
GRANT ALL ON public.cast_members TO service_role;
ALTER TABLE public.cast_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own cast" ON public.cast_members FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER cast_members_touch BEFORE UPDATE ON public.cast_members FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- LOCATIONS
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  element_id TEXT,
  preview_url TEXT,
  mood_tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.locations TO authenticated;
GRANT ALL ON public.locations TO service_role;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own locations" ON public.locations FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER locations_touch BEFORE UPDATE ON public.locations FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- DRAMAS
CREATE TABLE public.dramas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  logline TEXT,
  description TEXT,
  genre TEXT,
  tone TEXT,
  poster_url TEXT,
  aspect_ratio TEXT NOT NULL DEFAULT '9:16',
  target_episode_seconds INT NOT NULL DEFAULT 75,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dramas TO authenticated;
GRANT ALL ON public.dramas TO service_role;
ALTER TABLE public.dramas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own dramas" ON public.dramas FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER dramas_touch BEFORE UPDATE ON public.dramas FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- EPISODES
CREATE TABLE public.episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  drama_id UUID NOT NULL REFERENCES public.dramas ON DELETE CASCADE,
  index INT NOT NULL,
  title TEXT NOT NULL,
  hook TEXT,
  synopsis TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  final_video_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (drama_id, index)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.episodes TO authenticated;
GRANT ALL ON public.episodes TO service_role;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own episodes" ON public.episodes FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER episodes_touch BEFORE UPDATE ON public.episodes FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- SCENES
CREATE TABLE public.scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  episode_id UUID NOT NULL REFERENCES public.episodes ON DELETE CASCADE,
  order_index INT NOT NULL,
  location_id UUID REFERENCES public.locations ON DELETE SET NULL,
  cast_ids UUID[] DEFAULT '{}',
  shot_prompt TEXT,
  camera TEXT DEFAULT 'medium',
  duration_seconds INT NOT NULL DEFAULT 6,
  dialog JSONB NOT NULL DEFAULT '[]'::jsonb,
  variants JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scenes TO authenticated;
GRANT ALL ON public.scenes TO service_role;
ALTER TABLE public.scenes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own scenes" ON public.scenes FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER scenes_touch BEFORE UPDATE ON public.scenes FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX idx_episodes_drama ON public.episodes(drama_id, index);
CREATE INDEX idx_scenes_episode ON public.scenes(episode_id, order_index);
