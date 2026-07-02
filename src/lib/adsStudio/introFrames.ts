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

interface ThemeTokens {
  bg: string;
  surface: string;
  accent: string;
  accentSoft: string;
  text: string;
  sub: string;
  muted: string;
  button: string;
  buttonText: string;
  grain: number;
}

const THEMES: Record<IntroTheme, ThemeTokens> = {
  anna: {
    bg: "#05070d",
    surface: "rgba(255,255,255,0.04)",
    accent: "#1f8bff",
    accentSoft: "rgba(31, 139, 255, 0.18)",
    text: "#ffffff",
    sub: "rgba(255,255,255,0.72)",
    muted: "rgba(255,255,255,0.42)",
    button: "#1f8bff",
    buttonText: "#ffffff",
    grain: 0.05,
  },
  neon: {
    bg: "#08070f",
    surface: "rgba(255,255,255,0.05)",
    accent: "#7c5cff",
    accentSoft: "rgba(124, 92, 255, 0.20)",
    text: "#ffffff",
    sub: "rgba(255,255,255,0.75)",
    muted: "rgba(255,255,255,0.45)",
    button: "#ffffff",
    buttonText: "#08070f",
    grain: 0.06,
  },
  minimal: {
    bg: "#f5f2ec",
    surface: "rgba(0,0,0,0.04)",
    accent: "#111111",
    accentSoft: "rgba(17,17,17,0.10)",
    text: "#111111",
    sub: "rgba(17,17,17,0.65)",
    muted: "rgba(17,17,17,0.4)",
    button: "#111111",
    buttonText: "#f5f2ec",
    grain: 0.03,
  },
};

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
function easeOutQuint(t: number) {
  return 1 - Math.pow(1 - t, 5);
}
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Deterministic pseudo-random for film grain
function noise(x: number, y: number, seed: number) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 43.1) * 43758.5453;
  return n - Math.floor(n);
}

export function drawIntroFrame(
  ctx: CanvasRenderingContext2D,
  frame: number,
  config: IntroConfig,
  backgroundImage?: HTMLImageElement | null,
  logoImage?: HTMLImageElement | null,
) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  const t = frame / INTRO_FRAMES; // 0..1 progress
  const theme = THEMES[config.theme];

  // 1. Base fill
  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, w, h);

  // 2. Background image — cover-fit, slow drift, cinematic grade
  if (backgroundImage) {
    const zoom = 1.05 + easeOutCubic(t) * 0.07;
    const iw = backgroundImage.width;
    const ih = backgroundImage.height;
    const scale = Math.max(w / iw, h / ih) * zoom;
    const dw = iw * scale;
    const dh = ih * scale;
    // subtle vertical parallax drift
    const drift = (t - 0.5) * 40;
    const dx = (w - dw) / 2;
    const dy = (h - dh) / 2 + drift;
    ctx.drawImage(backgroundImage, dx, dy, dw, dh);

    // Cinematic vignette: darker at edges, deeper at bottom
    const vg = ctx.createLinearGradient(0, 0, 0, h);
    vg.addColorStop(0, "rgba(0,0,0,0.55)");
    vg.addColorStop(0.45, "rgba(0,0,0,0.25)");
    vg.addColorStop(1, "rgba(0,0,0,0.88)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);

    // Corner vignette
    const cv = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.85);
    cv.addColorStop(0, "rgba(0,0,0,0)");
    cv.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = cv;
    ctx.fillRect(0, 0, w, h);
  } else {
    // No image: subtle radial accent wash
    const rg = ctx.createRadialGradient(w / 2, h * 0.4, 0, w / 2, h * 0.4, w * 0.9);
    rg.addColorStop(0, theme.accentSoft);
    rg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, w, h);
  }

  // 3. mybabes.ai logo — real SVG asset, always visible
  if (logoImage && logoImage.complete && logoImage.naturalWidth > 0) {
    const targetW = 420;
    const ratio = logoImage.naturalHeight / logoImage.naturalWidth;
    const targetH = targetW * ratio;
    const lx = w / 2 - targetW / 2;
    const ly = 140;
    ctx.drawImage(logoImage, lx, ly, targetW, targetH);
  }



  // 4. Eyebrow accent line above title
  {
    ctx.save();
    const lineW = 120;
    const lineY = h * 0.36;
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w / 2 - lineW / 2, lineY);
    ctx.lineTo(w / 2 + lineW / 2, lineY);
    ctx.stroke();
    ctx.restore();
  }


  // 5. Title — always visible from frame 0
  const title = (config.title || "Your Roleplay").toUpperCase();
  const titleFontSize = Math.min(200, (w * 0.9) / Math.max(6, title.length) * 1.55);
  ctx.font = `800 ${titleFontSize}px "Bebas Neue", Impact, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const cy = h * 0.44;
  ctx.fillStyle = theme.text;
  ctx.fillText(title, w / 2, cy);

  // 6. Subtitle — always visible, letter-tracked
  {
    ctx.save();
    const subY = cy + titleFontSize * 0.7;
    ctx.fillStyle = theme.sub;
    ctx.font = `500 34px "Inter", system-ui, sans-serif`;
    const sub = (config.subtitle || "A POV Roleplay").toUpperCase();
    const tracking = 6;
    const chars = sub.split("");
    const widths = chars.map((c) => ctx.measureText(c).width);
    const totalW = widths.reduce((a, b) => a + b, 0) + tracking * (chars.length - 1);
    let sx = w / 2 - totalW / 2;
    chars.forEach((c, i) => {
      ctx.fillText(c, sx + widths[i] / 2, subY);
      sx += widths[i] + tracking;
    });
    ctx.restore();
  }

  // 7. START pill button — always visible, with subtle idle breathing + tap press
  {
    const idle = 1 + 0.012 * Math.sin(frame * 0.18);
    let press = 1;
    if (frame >= 62 && frame <= 68) {
      const pt = (frame - 62) / 6;
      press = 1 - Math.sin(pt * Math.PI) * 0.06;
    }

    const btnW = 460 * idle * press;
    const btnH = 128 * idle * press;
    const btnX = w / 2 - btnW / 2;
    const btnY = h * 0.66;
    const radius = btnH / 2;

    ctx.save();

    // Soft ambient glow
    ctx.save();
    ctx.shadowColor = theme.accent;
    ctx.shadowBlur = 80;
    ctx.fillStyle = theme.button;
    roundRect(ctx, btnX, btnY, btnW, btnH, radius);
    ctx.fill();
    ctx.restore();


    // Inner sheen gradient
    const sheen = ctx.createLinearGradient(btnX, btnY, btnX, btnY + btnH);
    sheen.addColorStop(0, "rgba(255,255,255,0.18)");
    sheen.addColorStop(0.5, "rgba(255,255,255,0.02)");
    sheen.addColorStop(1, "rgba(0,0,0,0.15)");
    ctx.fillStyle = sheen;
    roundRect(ctx, btnX, btnY, btnW, btnH, radius);
    ctx.fill();

    // Label + arrow
    ctx.fillStyle = theme.buttonText;
    ctx.font = `700 44px "Inter", system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const label = "START";
    const labelW = ctx.measureText(label).width;
    const cxBtn = w / 2;
    ctx.fillText(label, cxBtn - 22, btnY + btnH / 2);
    // arrow
    const arrowX = cxBtn + labelW / 2 - 4;
    const arrowY = btnY + btnH / 2;
    ctx.strokeStyle = theme.buttonText;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(arrowX + 26, arrowY);
    ctx.moveTo(arrowX + 14, arrowY - 12);
    ctx.lineTo(arrowX + 26, arrowY);
    ctx.lineTo(arrowX + 14, arrowY + 12);
    ctx.stroke();

    ctx.restore();

    // Refined ring pulse (single, subtle) on tap
    if (frame >= 62 && frame <= 82) {
      const rt = (frame - 62) / 20;
      const rEased = easeOutCubic(rt);
      ctx.save();
      ctx.globalAlpha = (1 - rt) * 0.7;
      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(w / 2, btnY + btnH / 2, radius + rEased * 320, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  // (progress dots + film grain removed)


  // 10. Outgoing transition — clean fade to black (no white flash, no cutout)
  if (frame >= 78) {
    const fo = clamp01((frame - 78) / 12);
    ctx.fillStyle = `rgba(0,0,0,${easeInOutCubic(fo)})`;
    ctx.fillRect(0, 0, w, h);
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
