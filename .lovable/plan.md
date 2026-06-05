## Popunder Funnel — Character Selector (v1)

A standalone, chrome-less landing page that hooks the user in the first second with a strong question + a row of provocative character picks. Pick one → quick "matching..." beat → match reveal screen with the chosen char + locked CTA placeholder. Built as one config-driven engine so we can clone for all 4 funnels (hetero SFW/NSFW, female SFW male, gay NSFW).

Inspired by the Nutaku "Which girl are you playing with?" pattern, but more polished and interactive — animated entrance, hover/tap reactions, ambient particles, taptic-style feedback.

### v1 scope
- Build the engine
- Ship **hetero NSFW** variant fully polished at `/p/hetero-nsfw`
- Final CTA is a placeholder button ("Continue →") — real CTA decided later
- Other 3 variants stubbed with the same route pattern but TODO content (so cloning is trivial)

### User flow (single page, no scroll)

```text
┌──────────────────────────────────────────┐
│  [bg: dimmed photo + particles]          │
│                                          │
│   FEELING LUCKY TONIGHT?                 │  ← Hook (animated text reveal)
│   Pick the one you want to meet first.   │
│                                          │
│   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐        │  ← 4 char cards, staggered fade-in
│   │ img │ │ img │ │ img │ │ img │        │     hover: tilt + glow
│   │ Lia │ │Cata │ │Zahra│ │Sakur│        │     tap: zoom + ripple
│   └─────┘ └─────┘ └─────┘ └─────┘        │
│                                          │
│   ● ● ● ●  127 guys picked in last hr    │  ← social proof ticker
└──────────────────────────────────────────┘
        ↓ pick
┌──────────────────────────────────────────┐
│   matching you with Lia...               │  ← 1.2s "shuffle" beat
│   [animated dots + char silhouettes]     │
└──────────────────────────────────────────┘
        ↓
┌──────────────────────────────────────────┐
│   IT'S A MATCH 💋                        │  ← reveal
│   ┌──────────────┐                       │
│   │ big char img │   Lia, 23             │
│   │ (glow ring)  │   "I've been waiting  │
│   └──────────────┘    for you..."        │
│                                          │
│   [ Continue → ]   ← primary CTA         │
│   keep browsing                          │
└──────────────────────────────────────────┘
```

### Interactivity & "wow" details
- Full-bleed page, no sidebar/nav, locked viewport (mobile-first, max-w-md centered on desktop)
- Animated headline (word-by-word reveal)
- Character cards: staggered enter, hover tilt, tap → ripple + scale, others dim
- Ambient particles + soft vignette background
- Live "X guys picked in the last hour" ticker that increments every few seconds (fake but believable)
- Subtle haptic-like vibration on tap (where supported)
- "Matching" beat with rapid-cycling silhouettes before settling on the chosen char
- Match-reveal: glowing ring around char, typewriter quote, pulsing CTA

### File structure

```text
src/
  pages/
    Popunder.tsx                 # route handler, reads :variant param, loads config
  components/popunder/
    PopunderShell.tsx            # full-bleed dark layout, particles, vignette
    CharacterSelector.tsx        # 4-card pick step
    MatchingStep.tsx             # 1.2s shuffle transition
    MatchReveal.tsx              # match screen + CTA
    SocialProofTicker.tsx        # "127 guys picked..." counter
  data/
    popunderVariants.ts          # variant configs (hook copy, char roster, theme, CTA label)
```

`App.tsx` adds: `<Route path="/p/:variant" element={<Popunder />} />`

### Variant config shape

```ts
type PopunderVariant = {
  id: 'hetero-sfw' | 'hetero-nsfw' | 'female-sfw' | 'gay-nsfw';
  hook: { line1: string; line2: string };       // headline + subline
  characters: { name: string; age: number; tagline: string; image: string }[];
  matchQuote: string;                            // shown on reveal
  ctaLabel: string;                              // placeholder for now
  accent: 'pink' | 'electric-blue' | 'gold' | 'violet';
  nsfw: boolean;                                  // toggles blur/age-gate hints
};
```

v1 fills `hetero-nsfw` with real copy + 4 chars from existing `src/assets/char*.jpg`. Other 3 variants get placeholder configs so the routes work and we can iterate per-variant in follow-ups.

### Technical notes
- Frontend only — no backend, no auth, no tracking yet
- Uses existing design tokens (HSL Electric Blue primary, dark background)
- Mobile-first; the popunder is presented at popup-window dimensions (~max-w-md / full height)
- Uses framer-motion (already in stack via radix patterns) — if not present, fall back to Tailwind keyframes + the `animate-fade-in`, `animate-scale-in`, `hover-scale` utilities already defined
- No new dependencies needed

### Out of scope (follow-ups)
- Real CTA wiring (signup, age-gate, credits)
- Other 3 variants' content (just stubbed)
- A/B testing, analytics, tracking pixels
- Triggering this as an actual popunder window from the main app
