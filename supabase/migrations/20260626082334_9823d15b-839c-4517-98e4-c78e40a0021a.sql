
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
    WHEN 'wink'      THEN _cost := 5;    _bump := 5;
    WHEN 'rose'      THEN _cost := 10;   _bump := 10;
    WHEN 'coffee'    THEN _cost := 15;   _bump := 12;
    WHEN 'chocolate' THEN _cost := 20;   _bump := 18;
    WHEN 'lipstick'  THEN _cost := 30;   _bump := 25;
    WHEN 'teddy'     THEN _cost := 40;   _bump := 30;
    WHEN 'perfume'   THEN _cost := 60;   _bump := 45;
    WHEN 'wine'      THEN _cost := 80;   _bump := 60;
    WHEN 'lingerie'  THEN _cost := 100;  _bump := 50;
    WHEN 'necklace'  THEN _cost := 200;  _bump := 90;
    WHEN 'ring'      THEN _cost := 500;  _bump := 200;
    WHEN 'yacht'     THEN _cost := 2000; _bump := 500;
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
