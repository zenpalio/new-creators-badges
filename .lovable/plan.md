# Shelter Persuasion Mini-Game

Insert a new act between Anna's rescue truck and the current "unlock" screen. Structure:

```text
annaCar → shelterTour → persuadeHub → (chat with any girl) → vote → unlock
```

Everyone the user persuades ends up as YES. Mai is always YES. Story continues regardless of the tally.

## 1. New scene: `SagaShelterTour`
Cinematic slideshow in the same visual language as `SagaAnnaCar` (Ken Burns, vignette, grain, Back/Next/Skip).

Beats:
1. Wide shot: shelter blast-door opening, Mai silhouetted with a lantern.
2. Portrait of Mai: "Welcome. You're safe — for now. Come, meet the others."
3. Common room: Abby (cold, arms crossed), Bo (leaning on a rifle), Cleo (curious, playful), Anna (guarded, still in her jacket).
4. Mai: "House rule. Everyone votes on strangers. Talk to them. Earn your bed."
5. CTA: `Meet them →` transitions to the persuasion hub.

Images to generate (uses `imagegen--edit_image` with the locked character portraits):
- `saga-shelter-door.jpg` — shelter interior wide, Mai silhouette.
- `saga-shelter-common.jpg` — group shot of the four girls in the common room (edit-merge of the 4 portraits).
- Reuse locked `mai.png` for Mai's close-up beats.

## 2. New scene: `SagaPersuadeHub`
Grid of 4 cards (Abby, Bo, Cleo, Anna). Each card shows:
- Portrait avatar
- One-line personality tag
- Status chip: `Undecided` / `YES` / `NO`
- "Talk to her" button

Header shows running tally: `Votes: X / 3 needed`.
Footer `Face the vote →` button — always available; if under 3, warns "They may turn you away."

## 3. New scene: `SagaGirlChat`
Full-screen chat with one girl:
- Top bar: her name, portrait, live "vibe" meter (0–100) + Back to hub.
- Background: one new in-shelter scene image per girl (generated from her locked portrait).
- AI SDK–free path: direct `fetch` to a new Supabase Edge Function `saga-persuade-chat` that streams via `openai/gpt-image-mini-tts`… no — uses `google/gemini-3-flash-preview` for text. Server-side system prompt encodes:
  - Her persona (from `mem://features/characters`).
  - Difficulty: `cleo=easy`, `anna=medium`, `bo=hard`, `abby=hard`.
  - Rules: reply in-character 1–3 short sentences; end each reply with a hidden JSON tag `<<VIBE:+5>>` or `<<VIBE:-3>>` used to update the meter; when vibe ≥ threshold return `<<VERDICT:YES>>`, when ≤ negative threshold return `<<VERDICT:NO>>`.
  - Thresholds by difficulty (YES/NO): cleo 55 / -30, anna 70 / -30, bo 85 / -20, abby 90 / -15.
- Client parses tags, updates local vibe, and on VERDICT locks that girl's status and returns to the hub.

## 4. New scene: `SagaVote`
Sequential reveal:
1. Mai steps forward: `"YES."` (auto)
2. Each of the 4 girls shows portrait + verdict badge with a beat of dialogue (in-character line generated statically per outcome).
3. Tally card: `X / 5 said yes`.
4. If ≥ 3: green banner "You're in." → `unlock`.
5. If < 3: amber banner "They tolerate you — for now." → still `unlock` (score tracked).

## 5. Wiring in `src/pages/Saga.tsx`
- Extend `Phase` union with `"shelterTour" | "persuadeHub" | "girlChat" | "vote"`.
- Store persuasion result in local component state: `{ mai: 'yes', abby, bo, cleo, anna }` and `activeGirl` for the chat sub-screen.
- Replace `endAnnaCar` to go to `shelterTour` instead of `unlock`.
- `shelterTour.onComplete → persuadeHub`.
- `persuadeHub` renders inline; tapping a girl sets `activeGirl` and switches to `girlChat`; `girlChat.onDone(verdict) → persuadeHub`.
- `persuadeHub` "Face the vote" → `vote`; `vote.onComplete → unlock`.

## 6. Backend: `supabase/functions/saga-persuade-chat/index.ts`
- POST `{ girl: 'abby'|'bo'|'cleo'|'anna', messages: UIMessage[] }`.
- Loads difficulty + persona system prompt on the server (never trust client).
- Calls Lovable AI Gateway (`google/gemini-3-flash-preview`) with `streamText` and returns a UI message stream.
- Handles 429/402 with clear JSON errors.
- CORS open (matches existing edge functions).

## Technical notes
- All chat state is ephemeral (component state) — no DB tables, matches user's "always continue, track score" choice.
- Persona memory (`mem://features/characters`) drives system prompts; kept server-side.
- Uses Lovable AI Gateway — no user API keys.
- New assets uploaded via `lovable-assets create` and referenced through `.asset.json` pointers.
- Uses `imagegen--edit_image` on each girl's locked portrait to generate her chat backdrop for character consistency.

## Files to add/edit
- `src/components/saga/SagaShelterTour.tsx` (new)
- `src/components/saga/SagaPersuadeHub.tsx` (new)
- `src/components/saga/SagaGirlChat.tsx` (new)
- `src/components/saga/SagaVote.tsx` (new)
- `src/pages/Saga.tsx` (extend phases + wiring)
- `supabase/functions/saga-persuade-chat/index.ts` (new)
- `supabase/config.toml` (register function, `verify_jwt = false`)
- ~6 new asset JSON files under `src/assets/` for shelter + per-girl chat backdrops

## Not in scope
- Persisting the persuasion result to the database.
- Retry / redo of a girl's chat after her verdict locks (locked = locked for this run).
- Voice/audio for the girls' replies (text only for v1; can add ElevenLabs per-girl later).
