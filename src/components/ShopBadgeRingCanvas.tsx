import { useRef, useEffect, useCallback } from "react";

const DPR = typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1;

interface Heart {
  angle: number;
  radius: number;
  speed: number;
  drift: number;
  size: number;
  life: number;
  maxLife: number;
  hueShift: number;
  rot: number;
  rotSpeed: number;
}

interface Sparkle {
  angle: number;
  radius: number;
  phase: number;
  speed: number;
  size: number;
}

const makeHearts = (count: number, baseRadius: number): Heart[] =>
  Array.from({ length: count }, () => ({
    angle: Math.random() * Math.PI * 2,
    radius: baseRadius * 0.72 + Math.random() * 4,
    speed: 0.1 + Math.random() * 0.2,
    drift: 0,
    size: 3 + Math.random() * 3.5,
    life: Math.random() * 120,
    maxLife: 110 + Math.random() * 70,
    hueShift: -10 + Math.random() * 25,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.04,
  }));

const makeSparkles = (count: number, baseRadius: number): Sparkle[] =>
  Array.from({ length: count }, (_, i) => ({
    angle: (i / count) * Math.PI * 2 + Math.random() * 0.5,
    radius: baseRadius + (Math.random() - 0.5) * 4,
    phase: Math.random() * Math.PI * 2,
    speed: 1.5 + Math.random() * 1.5,
    size: 0.8 + Math.random() * 1.2,
  }));

// Draws a heart shape centered at (x,y) with given size, rotated by `rot`
function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rot: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  const s = size;
  ctx.moveTo(0, s * 0.3);
  ctx.bezierCurveTo(s, -s * 0.4, s * 1.4, s * 0.5, 0, s * 1.2);
  ctx.bezierCurveTo(-s * 1.4, s * 0.5, -s, -s * 0.4, 0, s * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ─── Waifu Collector: Pink breathing ring + floating hearts + sparkles ───
function drawWaifu(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  baseRadius: number,
  time: number,
  hearts: Heart[],
  sparkles: Sparkle[],
) {
  const breathe = 0.5 + 0.5 * Math.sin(time * 1.4);

  // Inner soft pink glow halo (outside the ring)
  const haloR = baseRadius + (14 + breathe * 8) * DPR;
  const halo = ctx.createRadialGradient(cx, cy, baseRadius - 1, cx, cy, haloR);
  halo.addColorStop(0, `hsla(330, 85%, 65%, ${0.14 + breathe * 0.08})`);
  halo.addColorStop(0.6, `hsla(325, 80%, 55%, ${0.06 + breathe * 0.04})`);
  halo.addColorStop(1, `hsla(330, 70%, 50%, 0)`);
  ctx.beginPath();
  ctx.arc(cx, cy, haloR, 0, Math.PI * 2);
  ctx.arc(cx, cy, baseRadius - 1, 0, Math.PI * 2, true);
  ctx.fillStyle = halo;
  ctx.fill();

  // Pink ring with subtle wave
  const steps = 72;
  for (let i = 0; i < steps; i++) {
    const a0 = (i / steps) * Math.PI * 2;
    const a1 = ((i + 1.5) / steps) * Math.PI * 2;
    const wave = 0.5 + 0.5 * Math.sin(time * 1.2 + a0 * 2);
    const alpha = 0.45 + wave * 0.4;
    const lightness = 60 + wave * 12;
    ctx.beginPath();
    ctx.arc(cx, cy, baseRadius, a0, a1);
    ctx.strokeStyle = `hsla(330, 85%, ${lightness}%, ${alpha})`;
    ctx.lineWidth = (2 + wave * 0.8) * DPR;
    ctx.stroke();
  }

  // Inner highlight ring (lighter pink, just inside)
  ctx.beginPath();
  ctx.arc(cx, cy, baseRadius - 1.5 * DPR, 0, Math.PI * 2);
  ctx.strokeStyle = `hsla(335, 100%, 85%, ${0.18 + breathe * 0.12})`;
  ctx.lineWidth = 0.8 * DPR;
  ctx.stroke();

  // Twinkling sparkles on the ring
  for (const s of sparkles) {
    s.angle += 0.0015;
    const twinkle = 0.5 + 0.5 * Math.sin(time * s.speed + s.phase);
    if (twinkle < 0.55) continue;
    const intensity = (twinkle - 0.55) / 0.45;
    const px = cx + Math.cos(s.angle) * s.radius;
    const py = cy + Math.sin(s.angle) * s.radius;
    const r = s.size * DPR * (0.8 + intensity * 1.2);

    // Glow
    ctx.beginPath();
    ctx.arc(px, py, r * 3, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(330, 90%, 80%, ${intensity * 0.18})`;
    ctx.fill();

    // 4-point sparkle (two crossed lines)
    ctx.strokeStyle = `hsla(335, 100%, 92%, ${intensity * 0.9})`;
    ctx.lineWidth = 0.8 * DPR;
    ctx.beginPath();
    ctx.moveTo(px - r * 2.2, py);
    ctx.lineTo(px + r * 2.2, py);
    ctx.moveTo(px, py - r * 2.2);
    ctx.lineTo(px, py + r * 2.2);
    ctx.stroke();

    // Core
    ctx.beginPath();
    ctx.arc(px, py, r * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(335, 100%, 95%, ${intensity})`;
    ctx.fill();
  }

  // Floating hearts — drift outward, fade, rotate gently
  for (const h of hearts) {
    h.life += 1;
    h.angle += h.speed * 0.003;
    h.rot += h.rotSpeed;
    if (h.life > h.maxLife) {
      h.life = 0;
      h.angle = Math.random() * Math.PI * 2;
      h.radius = baseRadius * 0.72 + Math.random() * 4;
      h.size = 3 + Math.random() * 3.5;
      h.hueShift = -10 + Math.random() * 25;
    }
    const lifeFrac = h.life / h.maxLife;
    const fade =
      lifeFrac < 0.15 ? lifeFrac / 0.15 : lifeFrac > 0.7 ? (1 - lifeFrac) / 0.3 : 1;
    const breath = 0.5 + 0.5 * Math.sin(time * 1.2 + h.angle * 2);
    const orbitR = baseRadius * (0.5 + breath * 0.6);
    const wobble = Math.sin(time * 1.5 + h.angle * 3) * 1.5 * DPR;
    const px = cx + Math.cos(h.angle) * (orbitR + wobble);
    const py = cy + Math.sin(h.angle) * (orbitR + wobble);
    const size = h.size * DPR * (0.8 + (1 - lifeFrac) * 0.4);
    const hue = 330 + h.hueShift;

    // Soft heart glow
    ctx.fillStyle = `hsla(${hue}, 90%, 70%, ${0.15 * fade})`;
    drawHeart(ctx, px, py, size * 1.6, h.rot);

    // Main heart
    ctx.fillStyle = `hsla(${hue}, 90%, 65%, ${0.85 * fade})`;
    drawHeart(ctx, px, py, size, h.rot);

    // Inner shine
    ctx.fillStyle = `hsla(${hue + 5}, 100%, 90%, ${0.5 * fade})`;
    drawHeart(ctx, px - size * 0.25, py - size * 0.05, size * 0.35, h.rot);
  }
}

// ─── Touch Grass Never: Green ring + swaying grass blades + drifting leaves ───
interface Blade {
  angle: number;
  length: number;
  width: number;
  swayPhase: number;
  swayAmp: number;
  hue: number;
  lightness: number;
}
interface Leaf {
  angle: number;
  radius: number;
  speed: number;
  spin: number;
  spinSpeed: number;
  size: number;
  life: number;
  maxLife: number;
}

const makeBlades = (count: number): Blade[] =>
  Array.from({ length: count }, (_, i) => ({
    angle: (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.08,
    length: 10 + Math.random() * 10,
    width: 1.4 + Math.random() * 1.2,
    swayPhase: Math.random() * Math.PI * 2,
    swayAmp: 0.18 + Math.random() * 0.22,
    hue: 100 + Math.random() * 30,
    lightness: 32 + Math.random() * 22,
  }));

const makeLeaves = (count: number, baseRadius: number): Leaf[] =>
  Array.from({ length: count }, () => ({
    angle: Math.random() * Math.PI * 2,
    radius: baseRadius * (0.55 + Math.random() * 0.5),
    speed: 0.08 + Math.random() * 0.15,
    spin: Math.random() * Math.PI * 2,
    spinSpeed: (Math.random() - 0.5) * 0.06,
    size: 2.5 + Math.random() * 2.5,
    life: Math.random() * 200,
    maxLife: 160 + Math.random() * 120,
  }));

function drawLeaf(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rot: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.quadraticCurveTo(size * 0.9, -size * 0.2, 0, size);
  ctx.quadraticCurveTo(-size * 0.9, -size * 0.2, 0, -size);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawTouchGrass(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  baseRadius: number,
  time: number,
  blades: Blade[],
  leaves: Leaf[],
) {
  const windGlobal = Math.sin(time * 1.6) * 0.5 + Math.sin(time * 0.7) * 0.3;
  const breathe = 0.5 + 0.5 * Math.sin(time * 1.1);

  // Soft earthy green halo
  const haloR = baseRadius + (14 + breathe * 8) * DPR;
  const halo = ctx.createRadialGradient(cx, cy, baseRadius - 1, cx, cy, haloR);
  halo.addColorStop(0, `hsla(120, 60%, 38%, ${0.13 + breathe * 0.07})`);
  halo.addColorStop(0.6, `hsla(115, 55%, 30%, ${0.05 + breathe * 0.03})`);
  halo.addColorStop(1, `hsla(120, 50%, 25%, 0)`);
  ctx.beginPath();
  ctx.arc(cx, cy, haloR, 0, Math.PI * 2);
  ctx.arc(cx, cy, baseRadius - 1, 0, Math.PI * 2, true);
  ctx.fillStyle = halo;
  ctx.fill();

  // Green ring
  ctx.beginPath();
  ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
  ctx.strokeStyle = `hsla(120, 65%, 42%, ${0.5 + breathe * 0.25})`;
  ctx.lineWidth = (1.8 + breathe * 0.6) * DPR;
  ctx.stroke();

  // Grass blades sprouting outward, swaying with wind
  for (const b of blades) {
    const localWind = windGlobal + Math.sin(time * 2.2 + b.swayPhase + b.angle * 3) * 0.6;
    const sway = localWind * b.swayAmp;

    const rootX = cx + Math.cos(b.angle) * baseRadius;
    const rootY = cy + Math.sin(b.angle) * baseRadius;
    const radial = b.length * DPR;
    const perpAngle = b.angle + Math.PI / 2;
    const tangent = Math.sin(time * 1.2 + b.swayPhase) * 4 * DPR + sway * radial * 0.5;
    const tipX = rootX + Math.cos(b.angle) * radial + Math.cos(perpAngle) * tangent;
    const tipY = rootY + Math.sin(b.angle) * radial + Math.sin(perpAngle) * tangent;
    const midX = (rootX + tipX) / 2 + Math.cos(perpAngle) * tangent * 0.4;
    const midY = (rootY + tipY) / 2 + Math.sin(perpAngle) * tangent * 0.4;

    const halfW = b.width * DPR;
    const baseLX = rootX + Math.cos(perpAngle) * halfW;
    const baseLY = rootY + Math.sin(perpAngle) * halfW;
    const baseRX = rootX - Math.cos(perpAngle) * halfW;
    const baseRY = rootY - Math.sin(perpAngle) * halfW;

    ctx.beginPath();
    ctx.moveTo(baseLX, baseLY);
    ctx.quadraticCurveTo(midX + Math.cos(perpAngle) * halfW * 0.3, midY + Math.sin(perpAngle) * halfW * 0.3, tipX, tipY);
    ctx.quadraticCurveTo(midX - Math.cos(perpAngle) * halfW * 0.3, midY - Math.sin(perpAngle) * halfW * 0.3, baseRX, baseRY);
    ctx.closePath();
    const grad = ctx.createLinearGradient(rootX, rootY, tipX, tipY);
    grad.addColorStop(0, `hsla(${b.hue}, 70%, ${b.lightness}%, 0.9)`);
    grad.addColorStop(1, `hsla(${b.hue + 5}, 80%, ${b.lightness + 18}%, 0.55)`);
    ctx.fillStyle = grad;
    ctx.fill();

    // Spine highlight
    ctx.beginPath();
    ctx.moveTo(rootX, rootY);
    ctx.quadraticCurveTo(midX, midY, tipX, tipY);
    ctx.strokeStyle = `hsla(${b.hue + 10}, 80%, ${b.lightness + 25}%, 0.5)`;
    ctx.lineWidth = 0.6 * DPR;
    ctx.stroke();
  }

  // Drifting leaves inside
  for (const l of leaves) {
    l.angle += l.speed * 0.005;
    l.spin += l.spinSpeed;
    l.life += 1;
    if (l.life > l.maxLife) {
      l.life = 0;
      l.angle = Math.random() * Math.PI * 2;
      l.radius = (baseRadius / DPR) * (0.55 + Math.random() * 0.5);
      l.size = 2.5 + Math.random() * 2.5;
    }
    const lifeFrac = l.life / l.maxLife;
    const fade =
      lifeFrac < 0.15 ? lifeFrac / 0.15 : lifeFrac > 0.7 ? (1 - lifeFrac) / 0.3 : 1;
    const drift = Math.sin(time * 0.9 + l.angle * 2) * 4 * DPR;
    const r = l.radius * DPR + drift;
    const px = cx + Math.cos(l.angle) * r;
    const py = cy + Math.sin(l.angle) * r;
    const s = l.size * DPR;

    ctx.fillStyle = `hsla(110, 70%, 50%, ${0.12 * fade})`;
    drawLeaf(ctx, px, py, s * 1.6, l.spin);
    ctx.fillStyle = `hsla(115, 75%, 45%, ${0.85 * fade})`;
    drawLeaf(ctx, px, py, s, l.spin);

    ctx.strokeStyle = `hsla(120, 70%, 75%, ${0.6 * fade})`;
    ctx.lineWidth = 0.5 * DPR;
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(l.spin);
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(0, s);
    ctx.stroke();
    ctx.restore();
  }
}

// Generic fallback ring (matches old badge-border-pulse) until each badge gets its own animation
function drawFallback(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  baseRadius: number,
  time: number,
  glowHsl: string,
) {
  const pulse = 0.5 + 0.5 * Math.sin(time * 2.5);
  // Ring
  ctx.beginPath();
  ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
  ctx.strokeStyle = glowHsl.replace(")", ` / ${0.5 + pulse * 0.4})`);
  ctx.lineWidth = (2 + pulse * 1) * DPR;
  ctx.stroke();

  // Outer glow
  const glowR = baseRadius + (10 + pulse * 8) * DPR;
  const grad = ctx.createRadialGradient(cx, cy, baseRadius - 1, cx, cy, glowR);
  grad.addColorStop(0, glowHsl.replace(")", ` / ${0.18 + pulse * 0.1})`));
  grad.addColorStop(1, glowHsl.replace(")", " / 0)"));
  ctx.beginPath();
  ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
  ctx.arc(cx, cy, baseRadius - 1, 0, Math.PI * 2, true);
  ctx.fillStyle = grad;
  ctx.fill();
}

// ─── AI Over Real: Glitchy chromatic ring + orbiting binary digits ───
interface Bit {
  angle: number;
  speed: number;
  radius: number;
  char: string;
  flickerPhase: number;
  flipPhase: number;
  size: number;
}

const makeBits = (count: number): Bit[] =>
  Array.from({ length: count }, () => ({
    angle: Math.random() * Math.PI * 2,
    speed: 0.25 + Math.random() * 0.45,
    radius: 0.78 + Math.random() * 0.28, // fraction of baseRadius
    char: Math.random() < 0.5 ? "0" : "1",
    flickerPhase: Math.random() * Math.PI * 2,
    flipPhase: Math.random() * 6,
    size: 7 + Math.random() * 4,
  }));

function drawAiOverReal(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  baseRadius: number,
  time: number,
  bits: Bit[],
) {
  // Subtle cyan/magenta halo
  const breathe = 0.5 + 0.5 * Math.sin(time * 2);
  const haloR = baseRadius + (10 + breathe * 6) * DPR;
  const halo = ctx.createRadialGradient(cx, cy, baseRadius - 1, cx, cy, haloR);
  halo.addColorStop(0, `hsla(185, 100%, 60%, ${0.14 + breathe * 0.08})`);
  halo.addColorStop(0.55, `hsla(305, 100%, 60%, ${0.08 + breathe * 0.05})`);
  halo.addColorStop(1, `hsla(260, 100%, 55%, 0)`);
  ctx.beginPath();
  ctx.arc(cx, cy, haloR, 0, Math.PI * 2);
  ctx.arc(cx, cy, baseRadius - 1, 0, Math.PI * 2, true);
  ctx.fillStyle = halo;
  ctx.fill();

  // Chromatic aberration ring: cyan + magenta + white core, offset
  const ringW = 2.2 * DPR;
  const offset = (1.2 + Math.sin(time * 7) * 0.8) * DPR;
  ctx.globalCompositeOperation = "lighter";
  // cyan
  ctx.beginPath();
  ctx.arc(cx + offset, cy, baseRadius, 0, Math.PI * 2);
  ctx.strokeStyle = `hsla(185, 100%, 60%, 0.85)`;
  ctx.lineWidth = ringW;
  ctx.stroke();
  // magenta
  ctx.beginPath();
  ctx.arc(cx - offset, cy, baseRadius, 0, Math.PI * 2);
  ctx.strokeStyle = `hsla(305, 100%, 62%, 0.85)`;
  ctx.lineWidth = ringW;
  ctx.stroke();
  // white core
  ctx.beginPath();
  ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
  ctx.strokeStyle = `hsla(0, 0%, 100%, 0.55)`;
  ctx.lineWidth = ringW * 0.6;
  ctx.stroke();
  ctx.globalCompositeOperation = "source-over";

  // Glitch arcs: short bright slices that jump around the ring
  const slices = 3;
  for (let i = 0; i < slices; i++) {
    const seed = Math.floor(time * 3 + i * 17);
    const r1 = Math.sin(seed * 12.9898) * 43758.5453;
    const r2 = Math.sin(seed * 78.233) * 12345.678;
    const a0 = (r1 - Math.floor(r1)) * Math.PI * 2;
    const arcLen = 0.15 + (r2 - Math.floor(r2)) * 0.35;
    const flash = 0.5 + 0.5 * Math.sin(time * 30 + i);
    ctx.beginPath();
    ctx.arc(cx, cy, baseRadius, a0, a0 + arcLen);
    ctx.strokeStyle = i % 2 === 0
      ? `hsla(185, 100%, 70%, ${0.4 + flash * 0.5})`
      : `hsla(305, 100%, 70%, ${0.4 + flash * 0.5})`;
    ctx.lineWidth = (3 + flash * 1.5) * DPR;
    ctx.stroke();
  }

  // Orbiting binary digits
  ctx.font = `bold ${10 * DPR}px ui-monospace, "SF Mono", Menlo, monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const b of bits) {
    b.angle += b.speed * 0.015;
    b.flipPhase += 0.05;
    if (b.flipPhase > 6) {
      b.flipPhase = 0;
      b.char = Math.random() < 0.5 ? "0" : "1";
    }
    const r = baseRadius * b.radius;
    const x = cx + Math.cos(b.angle) * r;
    const y = cy + Math.sin(b.angle) * r;
    const flicker = 0.5 + 0.5 * Math.sin(time * 6 + b.flickerPhase);
    const alpha = 0.35 + flicker * 0.6;
    const isCyan = (Math.floor(b.flickerPhase * 10) & 1) === 0;
    ctx.fillStyle = isCyan
      ? `hsla(185, 100%, 65%, ${alpha})`
      : `hsla(305, 100%, 70%, ${alpha})`;
    ctx.font = `bold ${b.size * DPR}px ui-monospace, monospace`;
    ctx.fillText(b.char, x, y);
  }
}

// ─── 3am Texter: Moonlit ring + floating chat bubbles + typing dots ───
interface Bubble {
  angle: number;
  speed: number;
  radius: number; // fraction of baseRadius
  life: number;
  maxLife: number;
  w: number;
  h: number;
  side: 1 | -1; // tail direction
  hueShift: number;
  typingPhase: number;
}

const makeBubbles = (count: number): Bubble[] =>
  Array.from({ length: count }, (_, i) => ({
    angle: (i / count) * Math.PI * 2 + Math.random() * 0.6,
    speed: 0.08 + Math.random() * 0.12,
    radius: 0.95 + Math.random() * 0.2,
    life: Math.random() * 180,
    maxLife: 180 + Math.random() * 120,
    w: 18 + Math.random() * 10,
    h: 11 + Math.random() * 4,
    side: Math.random() < 0.5 ? 1 : -1,
    hueShift: -10 + Math.random() * 30,
    typingPhase: Math.random() * Math.PI * 2,
  }));

function drawBubble(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  side: 1 | -1,
  fill: string,
  stroke: string,
  time: number,
  typingPhase: number,
) {
  const r = h * 0.45;
  ctx.beginPath();
  ctx.moveTo(x - w / 2 + r, y - h / 2);
  ctx.lineTo(x + w / 2 - r, y - h / 2);
  ctx.quadraticCurveTo(x + w / 2, y - h / 2, x + w / 2, y - h / 2 + r);
  ctx.lineTo(x + w / 2, y + h / 2 - r);
  ctx.quadraticCurveTo(x + w / 2, y + h / 2, x + w / 2 - r, y + h / 2);
  // tail
  const tx = x + side * (w * 0.25);
  ctx.lineTo(tx + side * r * 0.6, y + h / 2);
  ctx.lineTo(tx, y + h / 2 + r * 0.9);
  ctx.lineTo(tx - side * r * 0.4, y + h / 2);
  ctx.lineTo(x - w / 2 + r, y + h / 2);
  ctx.quadraticCurveTo(x - w / 2, y + h / 2, x - w / 2, y + h / 2 - r);
  ctx.lineTo(x - w / 2, y - h / 2 + r);
  ctx.quadraticCurveTo(x - w / 2, y - h / 2, x - w / 2 + r, y - h / 2);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1 * DPR;
  ctx.stroke();

  // typing dots
  const dotR = h * 0.13;
  const spacing = h * 0.32;
  for (let i = 0; i < 3; i++) {
    const bounce = Math.sin(time * 6 + typingPhase + i * 0.7);
    const dy = bounce > 0 ? -bounce * h * 0.12 : 0;
    ctx.beginPath();
    ctx.arc(x + (i - 1) * spacing, y + dy, dotR, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(220, 30%, 95%, ${0.6 + Math.max(0, bounce) * 0.4})`;
    ctx.fill();
  }
}

function drawThreeAmTexter(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  baseRadius: number,
  time: number,
  bubbles: Bubble[],
) {
  // Cold moonlit halo
  const breathe = 0.5 + 0.5 * Math.sin(time * 1.1);
  const haloR = baseRadius + (12 + breathe * 6) * DPR;
  const halo = ctx.createRadialGradient(cx, cy, baseRadius - 1, cx, cy, haloR);
  halo.addColorStop(0, `hsla(220, 80%, 65%, ${0.16 + breathe * 0.08})`);
  halo.addColorStop(0.55, `hsla(245, 70%, 55%, ${0.08 + breathe * 0.04})`);
  halo.addColorStop(1, `hsla(250, 60%, 40%, 0)`);
  ctx.beginPath();
  ctx.arc(cx, cy, haloR, 0, Math.PI * 2);
  ctx.arc(cx, cy, baseRadius - 1, 0, Math.PI * 2, true);
  ctx.fillStyle = halo;
  ctx.fill();

  // Soft blue ring with slow shimmer (sleepy/dim)
  const steps = 64;
  for (let i = 0; i < steps; i++) {
    const a0 = (i / steps) * Math.PI * 2;
    const a1 = ((i + 1.4) / steps) * Math.PI * 2;
    const wave = 0.5 + 0.5 * Math.sin(time * 0.9 + a0 * 1.5);
    ctx.beginPath();
    ctx.arc(cx, cy, baseRadius, a0, a1);
    ctx.strokeStyle = `hsla(${218 + wave * 12}, 75%, ${55 + wave * 12}%, ${0.4 + wave * 0.35})`;
    ctx.lineWidth = (1.8 + wave * 0.7) * DPR;
    ctx.stroke();
  }

  // Floating chat bubbles drifting around the ring
  for (const b of bubbles) {
    b.angle += b.speed * 0.01;
    b.life += 1;
    if (b.life > b.maxLife) {
      b.life = 0;
      b.angle = Math.random() * Math.PI * 2;
      b.side = Math.random() < 0.5 ? 1 : -1;
      b.hueShift = -10 + Math.random() * 30;
    }
    const t = b.life / b.maxLife;
    const fade = Math.sin(t * Math.PI); // fade in/out
    const orbit = baseRadius * b.radius + Math.sin(time * 1.3 + b.angle * 3) * 2 * DPR;
    const x = cx + Math.cos(b.angle) * orbit;
    const y = cy + Math.sin(b.angle) * orbit;
    const w = b.w * DPR;
    const h = b.h * DPR;
    const hue = 220 + b.hueShift;
    const fill = `hsla(${hue}, 75%, 60%, ${0.55 * fade})`;
    const stroke = `hsla(${hue}, 90%, 80%, ${0.85 * fade})`;
    ctx.save();
    ctx.globalAlpha = fade;
    drawBubble(ctx, x, y, w, h, b.side, fill, stroke, time, b.typingPhase);
    ctx.restore();
  }
}

interface ShopBadgeRingCanvasProps {
  badgeName: string;
  glowColor: string;
}

const ShopBadgeRingCanvas = ({ badgeName, glowColor }: ShopBadgeRingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heartsRef = useRef<Heart[]>([]);
  const sparklesRef = useRef<Sparkle[]>([]);
  const bladesRef = useRef<Blade[]>([]);
  const leavesRef = useRef<Leaf[]>([]);
  const bitsRef = useRef<Bit[]>([]);
  const bubblesRef = useRef<Bubble[]>([]);
  const rafRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const parentW = parentRect.width;
    const parentH = parentRect.height;
    const canvasRect = canvas.getBoundingClientRect();
    const canvasW = canvasRect.width;
    const canvasH = canvasRect.height;

    if (sizeRef.current.w !== canvasW || sizeRef.current.h !== canvasH) {
      sizeRef.current = { w: canvasW, h: canvasH };
      canvas.width = canvasW * DPR;
      canvas.height = canvasH * DPR;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cx = (canvasW * DPR) / 2;
    const cy = (canvasH * DPR) / 2;
    const baseRadius = (Math.min(parentW, parentH) / 2 - 2) * DPR;
    const time = performance.now() / 1000;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (badgeName) {
      case "Waifu Collector": {
        if (heartsRef.current.length === 0)
          heartsRef.current = makeHearts(28, baseRadius / DPR);
        if (sparklesRef.current.length === 0)
          sparklesRef.current = makeSparkles(7, baseRadius);
        drawWaifu(ctx, cx, cy, baseRadius, time, heartsRef.current, sparklesRef.current);
        break;
      }
      case "Touch Grass Never": {
        if (bladesRef.current.length === 0) bladesRef.current = makeBlades(44);
        if (leavesRef.current.length === 0)
          leavesRef.current = makeLeaves(6, baseRadius / DPR);
        drawTouchGrass(ctx, cx, cy, baseRadius, time, bladesRef.current, leavesRef.current);
        break;
      }
      case "AI Over Real": {
        if (bitsRef.current.length === 0) bitsRef.current = makeBits(22);
        drawAiOverReal(ctx, cx, cy, baseRadius, time, bitsRef.current);
        break;
      }
      default:
        drawFallback(ctx, cx, cy, baseRadius, time, glowColor);
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [badgeName, glowColor]);

  useEffect(() => {
    heartsRef.current = [];
    sparklesRef.current = [];
    bladesRef.current = [];
    leavesRef.current = [];
    bitsRef.current = [];
    sizeRef.current = { w: 0, h: 0 };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute pointer-events-none"
      style={{ zIndex: 2, inset: "-20%", width: "140%", height: "140%" }}
    />
  );
};

export default ShopBadgeRingCanvas;
