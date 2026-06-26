
ALTER TABLE public.user_companion
  ADD COLUMN IF NOT EXISTS hunger   INT NOT NULL DEFAULT 60,
  ADD COLUMN IF NOT EXISTS energy   INT NOT NULL DEFAULT 70,
  ADD COLUMN IF NOT EXISTS arousal  INT NOT NULL DEFAULT 30,
  ADD COLUMN IF NOT EXISTS calm     INT NOT NULL DEFAULT 70,
  ADD COLUMN IF NOT EXISTS joy      INT NOT NULL DEFAULT 60,
  ADD COLUMN IF NOT EXISTS comfort  INT NOT NULL DEFAULT 60,
  ADD COLUMN IF NOT EXISTS stats_updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Decay & clamp the mood stats based on elapsed time, return the updated row.
CREATE OR REPLACE FUNCTION public.tick_companion_stats(_companion_slug TEXT)
RETURNS public.user_companion
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _uid UUID := auth.uid();
  _cid UUID;
  _row public.user_companion;
  _elapsed_min NUMERIC;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  SELECT id INTO _cid FROM public.companions WHERE slug = _companion_slug;

  SELECT * INTO _row FROM public.user_companion
    WHERE user_id = _uid AND companion_id = _cid FOR UPDATE;
  IF NOT FOUND THEN RETURN NULL; END IF;

  _elapsed_min := EXTRACT(EPOCH FROM (now() - _row.stats_updated_at)) / 60.0;
  IF _elapsed_min < 0.5 THEN RETURN _row; END IF;

  -- gentle drift toward neutral baselines per real-life minute
  UPDATE public.user_companion SET
    hunger  = GREATEST(0, LEAST(100, hunger  - (_elapsed_min * 0.4)::INT)),  -- gets hungrier over time
    energy  = GREATEST(0, LEAST(100, energy  - (_elapsed_min * 0.3)::INT)),
    arousal = GREATEST(0, LEAST(100, arousal - (_elapsed_min * 0.25)::INT)),
    calm    = GREATEST(0, LEAST(100, calm    + (_elapsed_min * 0.2)::INT)),  -- relaxes when alone
    joy     = GREATEST(0, LEAST(100, joy     - (_elapsed_min * 0.15)::INT)),
    comfort = GREATEST(0, LEAST(100, comfort - (_elapsed_min * 0.1)::INT)),
    stats_updated_at = now()
  WHERE user_id = _uid AND companion_id = _cid
  RETURNING * INTO _row;

  RETURN _row;
END $$;
GRANT EXECUTE ON FUNCTION public.tick_companion_stats(TEXT) TO authenticated;

-- Apply a relative nudge to one or more stats (called by chat/gift events).
CREATE OR REPLACE FUNCTION public.nudge_companion_stats(
  _companion_slug TEXT,
  _hunger   INT DEFAULT 0,
  _energy   INT DEFAULT 0,
  _arousal  INT DEFAULT 0,
  _calm     INT DEFAULT 0,
  _joy      INT DEFAULT 0,
  _comfort  INT DEFAULT 0
)
RETURNS public.user_companion
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _uid UUID := auth.uid();
  _cid UUID;
  _row public.user_companion;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  SELECT id INTO _cid FROM public.companions WHERE slug = _companion_slug;

  UPDATE public.user_companion SET
    hunger  = GREATEST(0, LEAST(100, hunger  + _hunger)),
    energy  = GREATEST(0, LEAST(100, energy  + _energy)),
    arousal = GREATEST(0, LEAST(100, arousal + _arousal)),
    calm    = GREATEST(0, LEAST(100, calm    + _calm)),
    joy     = GREATEST(0, LEAST(100, joy     + _joy)),
    comfort = GREATEST(0, LEAST(100, comfort + _comfort)),
    stats_updated_at = now()
  WHERE user_id = _uid AND companion_id = _cid
  RETURNING * INTO _row;

  RETURN _row;
END $$;
GRANT EXECUTE ON FUNCTION public.nudge_companion_stats(TEXT, INT, INT, INT, INT, INT, INT) TO authenticated;
