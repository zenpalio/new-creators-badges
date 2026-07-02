// Deterministic per-frame renderer for the game-style intro.
// 30 fps, 90 frames total (3 seconds).

export type IntroTheme = "anna" | "neon" | "minimal";

export interface IntroConfig {
  title: string;
  subtitle: string;
  theme: IntroTheme;
  backgroundImage?: string | null; // data URL or blob URL
}

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export const INTRO_FPS = 30;
export const INTRO_FRAMES = 90;
export const INTRO_W = 1080;
export const INTRO_H = 1920;

const THEMES: Record<
  IntroTheme,
  { bg: string; glow: string; accent: string; text: string; sub: string; button: string; buttonText: string }
> = {
  anna: {
    bg: "#05070d",
    glow: "rgba(0, 128, 255, 0.55)",
    accent: "#0080ff",
    text: "#ffffff",
    sub: "rgba(255,255,255,0.75)",
    button: "#0080ff",
    buttonText: "#000814",
  },
  neon: {
    bg: "#0a0014",
    glow: "rgba(255, 0, 200, 0.5)",
    accent: "#ff2bd6",
    text: "#ffffff",
    sub: "rgba(255,255,255,0.8)",
    button: "#00e5ff",
    buttonText: "#0a0014",
  },
  minimal: {
    bg: "#f5f2ec",
    glow: "rgba(0,0,0,0.08)",
    accent: "#111111",
    text: "#111111",
    sub: "rgba(17,17,17,0.6)",
    button: "#111111",
    buttonText: "#f5f2ec",
  },
};

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
function easeOutBack(t: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export function drawIntroFrame(
  ctx: CanvasRenderingContext2D,
  frame: number,
  config: IntroConfig,
) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  const theme = THEMES[config.theme];
  const t = frame / INTRO_FRAMES;

export function drawIntroFrame(
  ctx: CanvasRenderingContext2D,
  frame: number,
  config: IntroConfig,
  backgroundImage?: HTMLImageElement | null,
) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  const theme = THEMES[config.theme];

  // Background
  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, w, h);

  // Background image (cover-fit, subtle Ken Burns zoom)
  if (backgroundImage) {
    const zoom = 1 + (frame / INTRO_FRAMES) * 0.08;
    const iw = backgroundImage.width;
    const ih = backgroundImage.height;
    const scale = Math.max(w / iw, h / ih) * zoom;
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (w - dw) / 2;
    const dy = (h - dh) / 2;
    ctx.drawImage(backgroundImage, dx, dy, dw, dh);
    // Dark vignette so UI stays readable
    const vg = ctx.createLinearGradient(0, 0, 0, h);
    vg.addColorStop(0, "rgba(0,0,0,0.55)");
    vg.addColorStop(0.5, "rgba(0,0,0,0.35)");
    vg.addColorStop(1, "rgba(0,0,0,0.75)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);
  }

  // Radial glow (pulses from center)
  const pulse = 0.6 + 0.4 * Math.sin(frame * 0.15);
  const glowR = w * (0.15 + easeOutCubic(Math.min(1, frame / 20)) * 0.65) * pulse;
  const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, glowR);
  grad.addColorStop(0, theme.glow);
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // ---- Beat 1: 0-24 title letters type in ----
  const title = (config.title || "YOUR ROLEPLAY").toUpperCase();
  const letters = title.split("");
  const perLetter = 24 / Math.max(1, letters.length);
  const titleFontSize = Math.min(160, (w * 0.85) / Math.max(6, letters.length) * 1.4);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `900 ${titleFontSize}px "Bebas Neue", Impact, sans-serif`;

  const cy = h * 0.42;
  const totalWidth = ctx.measureText(title).width;
  let cursorX = w / 2 - totalWidth / 2;
  letters.forEach((ch, i) => {
    const localT = Math.min(1, Math.max(0, (frame - i * perLetter) / 8));
    if (localT <= 0) {
      cursorX += ctx.measureText(ch).width;
      return;
    }
    const eased = easeOutBack(localT);
    const yOffset = (1 - eased) * 60;
    const alpha = Math.min(1, localT * 1.5);
    ctx.save();
    ctx.globalAlpha = alpha;
    // subtle chromatic aberration
    ctx.fillStyle = theme.accent;
    ctx.globalAlpha = alpha * 0.35;
    ctx.fillText(ch, cursorX + ctx.measureText(ch).width / 2 - 4, cy + yOffset);
    ctx.fillStyle = theme.text;
    ctx.globalAlpha = alpha;
    ctx.fillText(ch, cursorX + ctx.measureText(ch).width / 2, cy + yOffset);
    ctx.restore();
    cursorX += ctx.measureText(ch).width;
  });

  // ---- Beat 2: 24-54 subtitle + START button ----
  if (frame >= 20) {
    const subT = Math.min(1, (frame - 20) / 12);
    ctx.save();
    ctx.globalAlpha = subT;
    ctx.fillStyle = theme.sub;
    ctx.font = `500 42px "Inter", system-ui, sans-serif`;
    ctx.fillText(config.subtitle || "A POV Roleplay", w / 2, cy + titleFontSize * 0.75);
    ctx.restore();
  }

  // START button (appears frame 30)
  const btnAppearStart = 30;
  const btnEnd = 90;
  if (frame >= btnAppearStart) {
    const bt = Math.min(1, (frame - btnAppearStart) / 12);
    const scale = easeOutBack(bt);
    const idlePulse = 1 + 0.03 * Math.sin(frame * 0.25);
    // Tap effect at frame 60-66: depress
    let pressScale = 1;
    if (frame >= 60 && frame <= 66) pressScale = 0.9;

    const btnW = 520 * scale * idlePulse * pressScale;
    const btnH = 160 * scale * idlePulse * pressScale;
    const btnX = w / 2 - btnW / 2;
    const btnY = h * 0.62;

    // Glow behind button
    ctx.save();
    ctx.shadowColor = theme.accent;
    ctx.shadowBlur = 60 * bt;
    ctx.fillStyle = theme.button;
    roundRect(ctx, btnX, btnY, btnW, btnH, 80);
    ctx.fill();
    ctx.restore();

    // Label
    ctx.save();
    ctx.globalAlpha = bt;
    ctx.fillStyle = theme.buttonText;
    ctx.font = `900 ${64 * scale}px "Bebas Neue", Impact, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("START", w / 2, btnY + btnH / 2 + 4);
    ctx.restore();

    // Ripple burst on tap (frame 58-72)
    if (frame >= 58 && frame <= 78) {
      const rt = (frame - 58) / 20;
      const rippleR = rt * 700;
      ctx.save();
      ctx.globalAlpha = 1 - rt;
      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 8 * (1 - rt);
      ctx.beginPath();
      ctx.arc(w / 2, btnY + btnH / 2, rippleR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    if (frame >= btnEnd - 15) {
      // fade out button as wipe takes over
      const fo = (frame - (btnEnd - 15)) / 15;
      ctx.fillStyle = `rgba(0,0,0,${fo * 0.6})`;
      ctx.fillRect(0, 0, w, h);
    }
  }

  // ---- Beat 3: flash frames 66-68 ----
  if (frame >= 66 && frame <= 68) {
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fillRect(0, 0, w, h);
  }

  // ---- Beat 4: radial wipe reveal (frame 75-90) shows black hole growing (transition placeholder) ----
  if (frame >= 75) {
    const wt = (frame - 75) / 15;
    const r = wt * Math.hypot(w, h);
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // fill exposed area with pure black so concat cut is clean
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
