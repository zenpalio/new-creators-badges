## /admin/ads-studio — Ad Stitcher Tool

A standalone internal page where you upload a 15s clip, configure a game-style animated intro + text overlays, preview it live, and export a single stitched MP4. Outro slot is scaffolded and hidden until you send assets.

### Page layout

```
┌──────────────────────────────────────────────────────────┐
│  Ads Studio                                    [Export]  │
├────────────────────────┬─────────────────────────────────┤
│                        │  Intro                          │
│   9:16 PREVIEW         │   Roleplay name  [__________]   │
│   (live canvas)        │   Subtitle       [__________]   │
│                        │   Theme          [Anna ▼]       │
│   ▶ ━━━━━●━━━━━━━      │                                 │
│                        │  Clip                           │
│                        │   [ Drop 15s .mp4 here ]        │
│                        │   Headline (top/bottom)         │
│                        │   Timed captions [+ Add]        │
│                        │                                 │
│                        │  Outro (coming soon)            │
└────────────────────────┴─────────────────────────────────┘
```

Vertical 9:16 (1080×1920) preview to match TikTok/Reels/Shorts.

### The "game-style" intro (3 seconds)

Inspired by a mobile-game splash — animated, punchy, clickable-feeling. Rendered as HTML/CSS/Canvas frames, then captured to video by ffmpeg.

Beats (30fps, 90 frames total):
1. **0.0–0.8s** — Black screen, radial glow pulses in. Roleplay title (e.g. "ANNA'S DIARY") kinetic-types in, letter-by-letter, big display font, subtle chromatic aberration.
2. **0.8–1.8s** — Title settles, subtitle fades in ("A POV Roleplay"). A large glowing **START** button scales in with a soft bounce and idle pulse.
3. **1.8–2.5s** — Auto "tap" effect: ripple bursts from button center, button depresses, screen flashes white for 2 frames.
4. **2.5–3.0s** — Radial wipe reveals the uploaded clip underneath. Hard cut into clip audio.

Theme presets (dropdown): **Anna** (electric blue + black), **Neon** (magenta/cyan — for other creators later), **Minimal** (white/black editorial). Uses existing `hsl(213 100% 50%)` primary for the Anna theme so it matches the app.

### Clip stage
- Drop zone accepts .mp4/.mov/.webm up to ~50MB (ffmpeg.wasm memory limit).
- ffprobe-like check via ffmpeg to grab duration; warn if >20s.
- **Headline overlay**: single line, top or bottom, full duration or custom in/out. Bold display font, drop shadow, optional pill background.
- **Timed captions**: repeatable rows `{ text, startSec, endSec, position }`. Rendered as burned-in subtitles via ffmpeg `drawtext` filter.

### Export pipeline (ffmpeg.wasm, all client-side)

1. **Render intro frames** — a hidden `<canvas>` runs the intro animation deterministically per frame (0..89), each frame `toBlob('image/jpeg', 0.92)` → written to ffmpeg FS as `intro_0000.jpg`…`intro_0089.jpg`.
2. **Encode intro** — `ffmpeg -framerate 30 -i intro_%04d.jpg -c:v libx264 -pix_fmt yuv420p -vf scale=1080:1920 intro.mp4`.
3. **Process clip** — write uploaded file to FS, apply overlays in one pass:
   `ffmpeg -i clip.mp4 -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,drawtext=…headline…,drawtext=…caption1…,drawtext=…caption2…" -c:a aac clip_out.mp4`
4. **Concat** — write a concat list, run `ffmpeg -f concat -safe 0 -i list.txt -c copy final.mp4`. If codec mismatch, fall back to re-encode.
5. Read result, `URL.createObjectURL`, offer download as `ads-studio-<timestamp>.mp4`.

Progress bar wired to ffmpeg's `on('progress')` for each stage.

### Preview (before export)
Live preview plays: intro frames rendered in real-time on a canvas → seamlessly transitions to a `<video>` element playing the uploaded clip with an overlaid HTML text layer (same fonts/positions as the burn-in). Fast iteration without waiting for ffmpeg.

### Outro
- Placeholder card labeled "Outro — awaiting assets". When you send the outro video/design later, I plug it in as a third stage in the concat.

### Files to create

- `src/pages/AdsStudio.tsx` — main page, layout, state
- `src/components/ads/IntroCanvas.tsx` — animated intro renderer (used for both live preview and frame export)
- `src/components/ads/IntroConfig.tsx` — title/subtitle/theme controls
- `src/components/ads/ClipDropzone.tsx` — file input + validation
- `src/components/ads/OverlayEditor.tsx` — headline + timed captions UI
- `src/components/ads/PreviewStage.tsx` — canvas + video preview with playhead
- `src/lib/adsStudio/introFrames.ts` — draws frame N of intro to a canvas (pure function of frame + config)
- `src/lib/adsStudio/ffmpegClient.ts` — lazy-loads @ffmpeg/ffmpeg + @ffmpeg/util, exposes `renderVideo(config)` returning a Blob
- `src/lib/adsStudio/drawtextEscape.ts` — safely escape text for ffmpeg drawtext filter
- Add route `/admin/ads-studio` in `src/App.tsx`

### Dependencies to install
- `@ffmpeg/ffmpeg`, `@ffmpeg/util` — WASM video processing
- `@fontsource/bebas-neue` (intro title) + `@fontsource/inter` (already-similar body) — bold display font for the game feel

### Notes / trade-offs
- ffmpeg.wasm is ~30MB and CPU-bound; a 15s 1080p export typically takes 20–60s in-browser. UI stays responsive because ffmpeg runs in a worker.
- Not linked from nav — reachable only by visiting `/admin/ads-studio` directly.
- No auth gating in v1 (matches "internal tool" scope). Say the word and I'll gate it behind admin role.
