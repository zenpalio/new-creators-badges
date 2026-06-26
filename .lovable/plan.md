# Mina — VTuber Companion (Phase 1 → 3 MVP)

A new `/mina` experience: a Live2D character you bond with daily. Affection grows with visits, chat, and gifts — and decays when you ghost her. Text and voice powered by one ElevenLabs Conversational Agent. Voice calls are the primary token sink.

---

## Scope of this plan

Phase 1 (Room) + Phase 2 (Bond) + Phase 3 (Voice) all in one build. Phase 4 (push notifications, jealousy events) deferred to its own plan after we validate the loop.

---

## What the user sees

### Auth gate
- Logged-out users hitting `/mina` get a focused sign-in card: email/password + Google
- After sign-in, a profile row + `user_companion` row for Mina are auto-created
- New users start with **50 free tokens** (≈ 5 min of calls, or 5 roses)

### `/mina` — Her Room
- Full-bleed Live2D canvas with locker-room ambient bg (reuses our existing aesthetic)
- **Top HUD**: Affection bar (0–100) · Streak 🔥 + day count · Token chip with "+" button
- **Mood pill** under HUD: e.g. *"Pouty 😒 — you skipped 2 days"* or *"Smitten 💕 — 7-day streak"*
- **Right rail (desktop) / drawer (mobile)**: Outfit selector. Locked tiers show grayed with the affection level needed
- **Bottom bar**: chat composer · 🎁 Gift drawer · 📞 Call Mina button
- **Click hotspots** on the model (head, cheek, hand) trigger Live2D expressions + flirty one-liners

### Chat
- Text chat through ElevenLabs Conversational Agent (text-only mode)
- Each message bumps affection (+1, capped 30/day)
- She remembers prior messages, current affection tier, mood, streak — injected into agent context

### Voice call
- Tap 📞 → mic permission → live waveform modal with Live2D lipsync
- **First 60 seconds free per day**, then 1 token/min (2 tok/min for "intimate voice" at tier 3+)
- Token balance ticks down live, hard-stop at 0 with "Buy more" upsell
- Audio levels from the call drive the model's mouth movements

### Gifts
- 🌹 Rose (10 tok, +10 affection) · 💄 Lipstick (30 tok, +25) · 👙 Lingerie (100 tok, +50) · 💎 Ring (500 tok, +200)
- Each gift triggers a unique Live2D reaction + voiced thank-you line

---

## Affection mechanics (Tamagotchi-hard)

| Event | Effect |
|---|---|
| Daily visit | +5 (capped 1/hr) |
| Chat message | +1 (capped 30/day) |
| Gift | +10 to +200 |
| Voice call | +2 per minute |
| Streak bonus | +1/day per consecutive day, breaks after 48h gap |
| Decay 0–24h absent | 0 |
| Decay 24–72h | -3/day |
| Decay 72h+ | -10/day |

Unlock ladder gates outfits, expressions, voice tier:
- **0–20 Stranger** — base outfit, SFW
- **20–40 Crush** — lingerie outfit, flirty voice
- **40–70 Lover** — bedroom outfit, dirty talk voice, intimate call tier unlocked
- **70–100 Obsessed** — full set, custom roleplay, jealousy/possessive lines

---

## Build order

1. **DB migration** — all tables, RLS, grants, seed Mina + unlock catalog
2. **Auth gate** — sign-in card on `/mina`, profile/user_companion auto-create trigger
3. **Live2D viewer** — `pixi.js` + `pixi-live2d-display`, Hiyori free model as placeholder, HUD shell
4. **Affection engine** — RPCs + hourly cron for decay
5. **ElevenLabs connector + agent** — text chat first
6. **Voice call modal** — WebRTC token, lipsync, live token meter, upsell
7. **Gifts + outfit unlocks** wired to affection thresholds

---

## Technical section

### New dependencies
- `pixi.js@^7` (Live2D viewer needs v7, not v8)
- `pixi-live2d-display@^0.4`
- `@elevenlabs/react` (already documented in our stack)

Hiyori Live2D model files (free Cubism sample) committed under `public/live2d/mina/`.

### Database (one migration)

```text
profiles              user_id PK (FK auth.users), display_name, tokens_balance int default 50
companions            id PK, slug, name, agent_id, voice_id, base_persona text
user_companion        user_id, companion_id, affection int, mood text,
                      streak_days int, last_visit_at timestamptz,
                      current_outfit text, unlocked_tiers text[]
                      PK (user_id, companion_id)
visit_log             id, user_id, companion_id, started_at, duration_s
gift_log              id, user_id, companion_id, gift_id, tokens_spent, at
call_log              id, user_id, companion_id, seconds, tokens_spent, started_at
unlock_catalog        id, tier, kind (outfit|expression|voice), asset_ref,
                      affection_required        -- public read
```

- RLS on every user-scoped table, all policies `auth.uid() = user_id`
- GRANTs for `authenticated` + `service_role`; `unlock_catalog` also `anon SELECT`
- Trigger on `auth.users` insert → creates `profiles` row with 50 tokens + `user_companion` row for Mina (affection 0)
- Security-definer RPCs (so all writes are validated server-side):
  - `register_visit()` — bumps affection, updates streak/last_visit_at
  - `add_chat_xp(n)` — capped daily
  - `apply_decay()` — called by cron
  - `purchase_gift(gift_id)` — deducts tokens, bumps affection, logs
  - `consume_call_seconds(seconds)` — deducts tokens at correct rate, returns remaining balance

### Edge functions
- `elevenlabs-token` — mints WebRTC conversation token. Injects dynamic system prompt with current affection tier, mood, streak, last 5 messages
- `elevenlabs-chat` — text-mode chat proxy (keeps API key server-side)
- `mina-cron-decay` — runs hourly via `pg_cron` + `pg_net`, calls `apply_decay()` for all rows where `now() - last_visit_at > 24h`

`ELEVENLABS_API_KEY` provisioned via the standard ElevenLabs connector (I'll trigger the connect flow during build). Mina's agent is created in the ElevenLabs dashboard (one-time manual step — I'll guide through it); the resulting `agent_id` + `voice_id` are seeded into the `companions` row.

### Routes
- `/mina` — main room (auth-gated)
- Existing `/` (Explore), `/pricing`, etc. untouched

### Files added (high level)
- `src/pages/Mina.tsx` — room shell
- `src/components/mina/Live2DStage.tsx` — pixi/Live2D wrapper
- `src/components/mina/AffectionHUD.tsx`
- `src/components/mina/MoodPill.tsx`
- `src/components/mina/OutfitRail.tsx`
- `src/components/mina/ChatComposer.tsx`
- `src/components/mina/CallModal.tsx` — WebRTC + waveform + lipsync
- `src/components/mina/GiftDrawer.tsx`
- `src/components/mina/AuthGate.tsx`
- `src/hooks/useCompanionState.ts` — affection/mood/tokens reads + realtime sub
- `src/hooks/useElevenLabsCall.ts`
- `supabase/functions/elevenlabs-token/index.ts`
- `supabase/functions/elevenlabs-chat/index.ts`
- `supabase/functions/mina-cron-decay/index.ts`

---

## What I need from you during the build

1. **ElevenLabs connector** — I'll trigger the connect prompt; you click through and authorize
2. **Mina's voice** — confirm "Alice" (Xb7hH8MSUJpSbSDYk0k2) as placeholder, or pick another
3. **One-time**: create her Conversational Agent in the ElevenLabs UI (I'll give you the exact persona prompt + settings to paste). Then paste the agent ID back to me

---

## Out of scope (next plan)

- Push notifications ("Mina misses you 💋")
- Web push opt-in flow
- Jealousy events when visiting other characters
- Server-side "she undressed while you were gone" state changes
- Migrating the rest of the roster to this system

Approve to start with the DB migration.