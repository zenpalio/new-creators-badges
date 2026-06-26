-- ============================================================================
-- Mina VTuber Companion: schema, RLS, grants, RPCs, seed
-- ============================================================================

-- 1. PROFILES ----------------------------------------------------------------
CREATE TABLE public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  tokens_balance INT NOT NULL DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 2. COMPANIONS (public catalog) --------------------------------------------
CREATE TABLE public.companions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  agent_id TEXT,
  voice_id TEXT,
  base_persona TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.companions TO authenticated, anon;
GRANT ALL ON public.companions TO service_role;
ALTER TABLE public.companions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "companions public read" ON public.companions FOR SELECT TO authenticated, anon USING (true);

-- 3. USER_COMPANION (per-user bond state) -----------------------------------
CREATE TABLE public.user_companion (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  companion_id UUID NOT NULL REFERENCES public.companions(id) ON DELETE CASCADE,
  affection INT NOT NULL DEFAULT 0,
  mood TEXT NOT NULL DEFAULT 'neutral',
  streak_days INT NOT NULL DEFAULT 0,
  last_visit_at TIMESTAMPTZ,
  last_chat_xp_date DATE,
  chat_xp_today INT NOT NULL DEFAULT 0,
  free_call_seconds_today INT NOT NULL DEFAULT 0,
  last_free_call_date DATE,
  current_outfit TEXT NOT NULL DEFAULT 'base',
  unlocked_tiers TEXT[] NOT NULL DEFAULT ARRAY['stranger']::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, companion_id)
);
GRANT SELECT, INSERT, UPDATE ON public.user_companion TO authenticated;
GRANT ALL ON public.user_companion TO service_role;
ALTER TABLE public.user_companion ENABLE ROW LEVEL SECURITY;
CREATE POLICY "uc own read" ON public.user_companion FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "uc own insert" ON public.user_companion FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "uc own update" ON public.user_companion FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 4. LOGS --------------------------------------------------------------------
CREATE TABLE public.visit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  companion_id UUID NOT NULL REFERENCES public.companions(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  duration_s INT
);
GRANT SELECT, INSERT ON public.visit_log TO authenticated;
GRANT ALL ON public.visit_log TO service_role;
ALTER TABLE public.visit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "visit own read" ON public.visit_log FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "visit own insert" ON public.visit_log FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.gift_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  companion_id UUID NOT NULL REFERENCES public.companions(id) ON DELETE CASCADE,
  gift_id TEXT NOT NULL,
  tokens_spent INT NOT NULL,
  at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gift_log TO authenticated;
GRANT ALL ON public.gift_log TO service_role;
ALTER TABLE public.gift_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gift own read" ON public.gift_log FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.call_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  companion_id UUID NOT NULL REFERENCES public.companions(id) ON DELETE CASCADE,
  seconds INT NOT NULL,
  tokens_spent INT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.call_log TO authenticated;
GRANT ALL ON public.call_log TO service_role;
ALTER TABLE public.call_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "call own read" ON public.call_log FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 5. CHAT MESSAGES (so agent can have memory) ------------------------------
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  companion_id UUID NOT NULL REFERENCES public.companions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX chat_messages_user_companion_idx ON public.chat_messages(user_id, companion_id, created_at DESC);
GRANT SELECT, INSERT ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chat own read" ON public.chat_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "chat own insert" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 6. UNLOCK CATALOG (public) ------------------------------------------------
CREATE TABLE public.unlock_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('outfit','expression','voice','scene')),
  asset_ref TEXT NOT NULL,
  label TEXT NOT NULL,
  affection_required INT NOT NULL
);
GRANT SELECT ON public.unlock_catalog TO authenticated, anon;
GRANT ALL ON public.unlock_catalog TO service_role;
ALTER TABLE public.unlock_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "catalog public read" ON public.unlock_catalog FOR SELECT TO authenticated, anon USING (true);

-- 7. updated_at helper -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER touch_profiles BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER touch_user_companion BEFORE UPDATE ON public.user_companion
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 8. AUTO-CREATE profile + Mina bond on signup ------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE mina_id UUID;
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)))
  ON CONFLICT (user_id) DO NOTHING;

  SELECT id INTO mina_id FROM public.companions WHERE slug = 'mina' LIMIT 1;
  IF mina_id IS NOT NULL THEN
    INSERT INTO public.user_companion (user_id, companion_id)
    VALUES (NEW.id, mina_id)
    ON CONFLICT (user_id, companion_id) DO NOTHING;
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. MOOD COMPUTATION --------------------------------------------------------
CREATE OR REPLACE FUNCTION public.compute_mood(_affection INT, _hours_since INT, _streak INT)
RETURNS TEXT LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE
    WHEN _hours_since >= 72 THEN 'cold'
    WHEN _hours_since >= 24 THEN 'pouty'
    WHEN _streak >= 7 AND _affection >= 40 THEN 'smitten'
    WHEN _affection >= 70 THEN 'obsessed'
    WHEN _affection >= 40 THEN 'lover'
    WHEN _affection >= 20 THEN 'flirty'
    ELSE 'shy'
  END
$$;

-- 10. RPC: register_visit ---------------------------------------------------
CREATE OR REPLACE FUNCTION public.register_visit(_companion_slug TEXT)
RETURNS public.user_companion LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _uid UUID := auth.uid();
  _cid UUID;
  _row public.user_companion;
  _hours INT;
  _new_streak INT;
  _bump INT := 0;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  SELECT id INTO _cid FROM public.companions WHERE slug = _companion_slug;
  IF _cid IS NULL THEN RAISE EXCEPTION 'unknown companion'; END IF;

  INSERT INTO public.user_companion (user_id, companion_id)
  VALUES (_uid, _cid) ON CONFLICT (user_id, companion_id) DO NOTHING;

  SELECT * INTO _row FROM public.user_companion WHERE user_id = _uid AND companion_id = _cid;

  IF _row.last_visit_at IS NULL THEN
    _bump := 5; _new_streak := 1;
  ELSE
    _hours := EXTRACT(EPOCH FROM (now() - _row.last_visit_at))/3600;
    IF _hours >= 1 THEN _bump := 5; END IF;
    IF _hours BETWEEN 20 AND 48 THEN
      _new_streak := _row.streak_days + 1;
      _bump := _bump + _new_streak;
    ELSIF _hours > 48 THEN
      _new_streak := 1;
    ELSE
      _new_streak := GREATEST(_row.streak_days, 1);
    END IF;
  END IF;

  UPDATE public.user_companion
    SET affection = LEAST(100, affection + _bump),
        streak_days = _new_streak,
        last_visit_at = now(),
        mood = public.compute_mood(LEAST(100, affection + _bump), 0, _new_streak)
    WHERE user_id = _uid AND companion_id = _cid
    RETURNING * INTO _row;

  INSERT INTO public.visit_log (user_id, companion_id) VALUES (_uid, _cid);
  RETURN _row;
END $$;
GRANT EXECUTE ON FUNCTION public.register_visit(TEXT) TO authenticated;

-- 11. RPC: add_chat_xp ------------------------------------------------------
CREATE OR REPLACE FUNCTION public.add_chat_xp(_companion_slug TEXT)
RETURNS public.user_companion LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _uid UUID := auth.uid();
  _cid UUID;
  _row public.user_companion;
  _today DATE := CURRENT_DATE;
  _bump INT := 0;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  SELECT id INTO _cid FROM public.companions WHERE slug = _companion_slug;

  SELECT * INTO _row FROM public.user_companion WHERE user_id = _uid AND companion_id = _cid;
  IF _row.last_chat_xp_date IS DISTINCT FROM _today THEN
    UPDATE public.user_companion SET chat_xp_today = 0, last_chat_xp_date = _today
      WHERE user_id = _uid AND companion_id = _cid;
    _row.chat_xp_today := 0;
  END IF;

  IF _row.chat_xp_today < 30 THEN _bump := 1; END IF;

  UPDATE public.user_companion
    SET chat_xp_today = chat_xp_today + _bump,
        affection = LEAST(100, affection + _bump)
    WHERE user_id = _uid AND companion_id = _cid
    RETURNING * INTO _row;
  RETURN _row;
END $$;
GRANT EXECUTE ON FUNCTION public.add_chat_xp(TEXT) TO authenticated;

-- 12. RPC: purchase_gift ----------------------------------------------------
CREATE OR REPLACE FUNCTION public.purchase_gift(_companion_slug TEXT, _gift_id TEXT)
RETURNS public.user_companion LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _uid UUID := auth.uid();
  _cid UUID;
  _row public.user_companion;
  _cost INT; _bump INT;
  _bal INT;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  SELECT id INTO _cid FROM public.companions WHERE slug = _companion_slug;

  CASE _gift_id
    WHEN 'rose'     THEN _cost := 10;  _bump := 10;
    WHEN 'lipstick' THEN _cost := 30;  _bump := 25;
    WHEN 'lingerie' THEN _cost := 100; _bump := 50;
    WHEN 'ring'     THEN _cost := 500; _bump := 200;
    ELSE RAISE EXCEPTION 'unknown gift';
  END CASE;

  SELECT tokens_balance INTO _bal FROM public.profiles WHERE user_id = _uid FOR UPDATE;
  IF _bal < _cost THEN RAISE EXCEPTION 'insufficient tokens'; END IF;

  UPDATE public.profiles SET tokens_balance = tokens_balance - _cost WHERE user_id = _uid;
  UPDATE public.user_companion
    SET affection = LEAST(100, affection + _bump)
    WHERE user_id = _uid AND companion_id = _cid
    RETURNING * INTO _row;
  INSERT INTO public.gift_log (user_id, companion_id, gift_id, tokens_spent)
    VALUES (_uid, _cid, _gift_id, _cost);
  RETURN _row;
END $$;
GRANT EXECUTE ON FUNCTION public.purchase_gift(TEXT, TEXT) TO authenticated;

-- 13. RPC: consume_call_seconds --------------------------------------------
CREATE OR REPLACE FUNCTION public.consume_call_seconds(
  _companion_slug TEXT, _seconds INT, _intimate BOOLEAN DEFAULT FALSE
) RETURNS TABLE(tokens_balance INT, free_remaining INT, stopped BOOLEAN)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _uid UUID := auth.uid();
  _cid UUID;
  _row public.user_companion;
  _today DATE := CURRENT_DATE;
  _free_used INT;
  _free_left INT;
  _billable INT;
  _rate_per_min INT;
  _cost INT;
  _bal INT;
  _stop BOOLEAN := FALSE;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  SELECT id INTO _cid FROM public.companions WHERE slug = _companion_slug;

  SELECT * INTO _row FROM public.user_companion WHERE user_id = _uid AND companion_id = _cid FOR UPDATE;
  IF _row.last_free_call_date IS DISTINCT FROM _today THEN
    UPDATE public.user_companion SET free_call_seconds_today = 0, last_free_call_date = _today
      WHERE user_id = _uid AND companion_id = _cid;
    _row.free_call_seconds_today := 0;
  END IF;

  _free_used := _row.free_call_seconds_today;
  _free_left := GREATEST(0, 60 - _free_used);
  _billable := GREATEST(0, _seconds - _free_left);

  _rate_per_min := CASE WHEN _intimate THEN 2 ELSE 1 END;
  _cost := CEIL(_billable::numeric / 60.0)::INT * _rate_per_min;

  SELECT p.tokens_balance INTO _bal FROM public.profiles p WHERE p.user_id = _uid FOR UPDATE;
  IF _bal < _cost THEN
    _cost := _bal;
    _stop := TRUE;
  END IF;

  UPDATE public.profiles SET tokens_balance = tokens_balance - _cost WHERE user_id = _uid;
  UPDATE public.user_companion
    SET free_call_seconds_today = free_call_seconds_today + LEAST(_seconds, _free_left),
        affection = LEAST(100, affection + (_seconds/30))
    WHERE user_id = _uid AND companion_id = _cid;
  INSERT INTO public.call_log (user_id, companion_id, seconds, tokens_spent)
    VALUES (_uid, _cid, _seconds, _cost);

  RETURN QUERY SELECT (_bal - _cost), GREATEST(0, 60 - (_free_used + LEAST(_seconds,_free_left))), _stop;
END $$;
GRANT EXECUTE ON FUNCTION public.consume_call_seconds(TEXT, INT, BOOLEAN) TO authenticated;

-- 14. RPC: apply_decay (cron) ----------------------------------------------
CREATE OR REPLACE FUNCTION public.apply_decay()
RETURNS INT LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _affected INT;
BEGIN
  WITH updated AS (
    UPDATE public.user_companion
    SET affection = GREATEST(0, affection -
      CASE
        WHEN EXTRACT(EPOCH FROM (now() - last_visit_at))/3600 >= 72 THEN 10
        WHEN EXTRACT(EPOCH FROM (now() - last_visit_at))/3600 >= 24 THEN 3
        ELSE 0
      END),
        streak_days = CASE
          WHEN EXTRACT(EPOCH FROM (now() - last_visit_at))/3600 >= 48 THEN 0
          ELSE streak_days
        END,
        mood = public.compute_mood(
          affection,
          EXTRACT(EPOCH FROM (now() - last_visit_at))/3600::INT,
          streak_days)
    WHERE last_visit_at IS NOT NULL
      AND EXTRACT(EPOCH FROM (now() - last_visit_at))/3600 >= 24
    RETURNING 1
  )
  SELECT COUNT(*) INTO _affected FROM updated;
  RETURN _affected;
END $$;

-- 15. SEED Mina + unlock catalog -------------------------------------------
INSERT INTO public.companions (slug, name, base_persona, voice_id)
VALUES ('mina', 'Mina',
  'Mina is an 18-year-old playful, teasing schoolgirl who caught the user with her phone. She is bratty, flirty, and slowly opens up the more time spent with her. She remembers everything. Tone shifts with affection tier.',
  'Xb7hH8MSUJpSbSDYk0k2');

INSERT INTO public.unlock_catalog (tier, kind, asset_ref, label, affection_required) VALUES
  ('stranger', 'outfit', 'uniform',        'School uniform',     0),
  ('crush',    'outfit', 'tie_loose',      'Tie loose',          20),
  ('crush',    'expression', 'wink',       'Wink',               20),
  ('lover',    'outfit', 'lingerie',       'Lingerie',           40),
  ('lover',    'voice',  'flirty',         'Flirty voice',       40),
  ('lover',    'voice',  'intimate',       'Intimate voice tier',50),
  ('obsessed', 'outfit', 'bedroom',        'Bedroom set',        70),
  ('obsessed', 'expression', 'blush_hard', 'Deep blush',         70),
  ('obsessed', 'scene',  'bedroom',        'Her bedroom',        80);