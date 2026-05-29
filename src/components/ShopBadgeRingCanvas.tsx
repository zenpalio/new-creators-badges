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

// ─── Proposed to AI: Gold ring + orbiting diamond gems + sparkle bursts ───
interface Diamond {
  angle: number;
  speed: number;
  radius: number; // fraction of baseRadius
  size: number;
  spin: number;
  spinSpeed: number;
  twinklePhase: number;
}

interface Star {
  angle: number;
  radius: number;
  phase: number;
  speed: number;
  size: number;
}

const makeDiamonds = (count: number): Diamond[] =>
  Array.from({ length: count }, (_, i) => ({
    angle: (i / count) * Math.PI * 2 + Math.random() * 0.3,
    speed: 0.12 + Math.random() * 0.18,
    radius: 0.88 + Math.random() * 0.18,
    size: 4 + Math.random() * 2.5,
    spin: Math.random() * Math.PI * 2,
    spinSpeed: (Math.random() - 0.5) * 0.05,
    twinklePhase: Math.random() * Math.PI * 2,
  }));

const makeStars = (count: number, baseRadius: number): Star[] =>
  Array.from({ length: count }, (_, i) => ({
    angle: (i / count) * Math.PI * 2 + Math.random() * 0.5,
    radius: baseRadius + (Math.random() - 0.5) * 6,
    phase: Math.random() * Math.PI * 2,
    speed: 2 + Math.random() * 2,
    size: 0.9 + Math.random() * 1.3,
  }));

function drawDiamond(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rot: number,
  alpha: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  const s = size * DPR;
  // Body
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.lineTo(s * 0.7, 0);
  ctx.lineTo(0, s);
  ctx.lineTo(-s * 0.7, 0);
  ctx.closePath();
  const grad = ctx.createLinearGradient(-s, -s, s, s);
  grad.addColorStop(0, `hsla(190, 100%, 85%, ${alpha})`);
  grad.addColorStop(0.5, `hsla(0, 0%, 100%, ${alpha})`);
  grad.addColorStop(1, `hsla(330, 90%, 80%, ${alpha})`);
  ctx.fillStyle = grad;
  ctx.fill();
  // Facet highlight
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.lineTo(s * 0.3, -s * 0.2);
  ctx.lineTo(-s * 0.3, -s * 0.2);
  ctx.closePath();
  ctx.fillStyle = `hsla(0, 0%, 100%, ${alpha * 0.9})`;
  ctx.fill();
  // Outline
  ctx.strokeStyle = `hsla(45, 100%, 75%, ${alpha * 0.9})`;
  ctx.lineWidth = 0.8 * DPR;
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.lineTo(s * 0.7, 0);
  ctx.lineTo(0, s);
  ctx.lineTo(-s * 0.7, 0);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function drawProposed(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  baseRadius: number,
  time: number,
  diamonds: Diamond[],
  stars: Star[],
) {
  const breathe = 0.5 + 0.5 * Math.sin(time * 1.3);
  const pulse = 0.5 + 0.5 * Math.sin(time * 2.2);

  // Rotating sunburst light rays behind the ring
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const rayCount = 14;
  const rayRotation = time * 0.35;
  const rayInner = baseRadius + 2 * DPR;
  const rayOuter = baseRadius + (22 + pulse * 10) * DPR;
  for (let i = 0; i < rayCount; i++) {
    const a = (i / rayCount) * Math.PI * 2 + rayRotation;
    const intensity = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(time * 2 + i));
    const grad = ctx.createLinearGradient(
      cx + Math.cos(a) * rayInner,
      cy + Math.sin(a) * rayInner,
      cx + Math.cos(a) * rayOuter,
      cy + Math.sin(a) * rayOuter,
    );
    grad.addColorStop(0, `hsla(45, 100%, 75%, ${0.55 * intensity})`);
    grad.addColorStop(1, `hsla(40, 100%, 60%, 0)`);
    ctx.strokeStyle = grad;
    ctx.lineWidth = (1.6 + intensity * 1.2) * DPR;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * rayInner, cy + Math.sin(a) * rayInner);
    ctx.lineTo(cx + Math.cos(a) * rayOuter, cy + Math.sin(a) * rayOuter);
    ctx.stroke();
  }
  ctx.restore();

  // Warm gold halo (additive bloom)
  const haloR = baseRadius + (18 + breathe * 10) * DPR;
  const halo = ctx.createRadialGradient(cx, cy, baseRadius - 1, cx, cy, haloR);
  halo.addColorStop(0, `hsla(45, 100%, 72%, ${0.28 + breathe * 0.12})`);
  halo.addColorStop(0.55, `hsla(35, 95%, 60%, ${0.14 + breathe * 0.06})`);
  halo.addColorStop(1, `hsla(30, 80%, 50%, 0)`);
  ctx.beginPath();
  ctx.arc(cx, cy, haloR, 0, Math.PI * 2);
  ctx.arc(cx, cy, baseRadius - 1, 0, Math.PI * 2, true);
  ctx.fillStyle = halo;
  ctx.fill();

  // Polished gold ring with shimmer sweep + heart-beat pulse on radius
  const ringR = baseRadius + pulse * 0.6 * DPR;
  const steps = 96;
  const sweep = (time * 1.6) % (Math.PI * 2);
  for (let i = 0; i < steps; i++) {
    const a0 = (i / steps) * Math.PI * 2;
    const a1 = ((i + 1.4) / steps) * Math.PI * 2;
    let d = Math.abs(((a0 - sweep + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
    const sweepBoost = Math.max(0, 1 - d / 0.5);
    const baseL = 58 + Math.sin(a0 * 3 + time * 0.8) * 10;
    const lightness = baseL + sweepBoost * 35;
    const alpha = 0.75 + sweepBoost * 0.25;
    ctx.beginPath();
    ctx.arc(cx, cy, ringR, a0, a1);
    ctx.strokeStyle = `hsla(45, 95%, ${lightness}%, ${alpha})`;
    ctx.lineWidth = (2.6 + sweepBoost * 1.6) * DPR;
    ctx.stroke();
  }

  // Counter-rotating shimmer sweep (second, faster, brighter)
  const sweep2 = (-time * 2.4) % (Math.PI * 2);
  for (let i = 0; i < 24; i++) {
    const a0 = sweep2 + (i / 24) * 0.35;
    ctx.beginPath();
    ctx.arc(cx, cy, ringR, a0, a0 + 0.04);
    ctx.strokeStyle = `hsla(55, 100%, ${85 - i * 1.5}%, ${0.85 - i * 0.03})`;
    ctx.lineWidth = (2.2 - i * 0.05) * DPR;
    ctx.stroke();
  }

  // Inner thin highlight ring (polished metal feel)
  ctx.beginPath();
  ctx.arc(cx, cy, ringR - 2 * DPR, 0, Math.PI * 2);
  ctx.strokeStyle = `hsla(50, 100%, 90%, 0.4)`;
  ctx.lineWidth = 0.8 * DPR;
  ctx.stroke();

  // Orbiting diamonds with glow trail
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const d of diamonds) {
    d.angle += d.speed * 0.012;
    d.spin += d.spinSpeed;
    const r = baseRadius * d.radius;
    const x = cx + Math.cos(d.angle) * r;
    const y = cy + Math.sin(d.angle) * r;
    const twinkle = 0.6 + 0.4 * Math.sin(time * 3 + d.twinklePhase);
    // soft glow under diamond
    const glowR = d.size * 3 * DPR;
    const dg = ctx.createRadialGradient(x, y, 0, x, y, glowR);
    dg.addColorStop(0, `hsla(50, 100%, 80%, ${0.5 * twinkle})`);
    dg.addColorStop(1, `hsla(50, 100%, 70%, 0)`);
    ctx.fillStyle = dg;
    ctx.beginPath();
    ctx.arc(x, y, glowR, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  for (const d of diamonds) {
    const r = baseRadius * d.radius;
    const x = cx + Math.cos(d.angle) * r;
    const y = cy + Math.sin(d.angle) * r;
    const twinkle = 0.6 + 0.4 * Math.sin(time * 3 + d.twinklePhase);
    drawDiamond(ctx, x, y, d.size, d.spin, 0.9 * twinkle);
  }

  // Sparkle stars on the ring (bigger, more dramatic)
  for (const s of stars) {
    const flicker = 0.5 + 0.5 * Math.sin(time * s.speed + s.phase);
    if (flicker < 0.1) continue;
    const x = cx + Math.cos(s.angle) * s.radius;
    const y = cy + Math.sin(s.angle) * s.radius;
    const len = (s.size + flicker * 4) * DPR;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(time * 0.6 + s.phase);
    ctx.strokeStyle = `hsla(50, 100%, 90%, ${flicker})`;
    ctx.lineWidth = 1.1 * DPR;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-len, 0);
    ctx.lineTo(len, 0);
    ctx.moveTo(0, -len);
    ctx.lineTo(0, len);
    // diagonal cross
    const dlen = len * 0.55;
    ctx.moveTo(-dlen, -dlen);
    ctx.lineTo(dlen, dlen);
    ctx.moveTo(-dlen, dlen);
    ctx.lineTo(dlen, -dlen);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 1.2 * DPR, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(0, 0%, 100%, ${flicker})`;
    ctx.fill();
    ctx.restore();
  }
}

// ─── Harem King: Royal purple+gold ring + orbiting crowns + rose petals ───
interface Crown {
  angle: number;
  speed: number;
  radius: number; // fraction of baseRadius
  size: number;
  bobPhase: number;
}

interface Petal {
  angle: number;
  speed: number;
  radius: number; // fraction
  drift: number;
  life: number;
  maxLife: number;
  spin: number;
  spinSpeed: number;
  size: number;
  hue: number;
}

const makeCrowns = (count: number): Crown[] =>
  Array.from({ length: count }, (_, i) => ({
    angle: (i / count) * Math.PI * 2,
    speed: 0.15,
    radius: 1.05,
    size: 6 + Math.random() * 1.5,
    bobPhase: Math.random() * Math.PI * 2,
  }));

const makePetals = (count: number): Petal[] =>
  Array.from({ length: count }, () => ({
    angle: Math.random() * Math.PI * 2,
    speed: 0.1 + Math.random() * 0.2,
    radius: 0.78 + Math.random() * 0.25,
    drift: 0,
    life: Math.random() * 180,
    maxLife: 160 + Math.random() * 120,
    spin: Math.random() * Math.PI * 2,
    spinSpeed: (Math.random() - 0.5) * 0.06,
    size: 3 + Math.random() * 2,
    hue: 200 + Math.random() * 18, // light blue/cyan
  }));

function drawCrown(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  alpha: number,
  rot: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  const s = size * DPR;
  // Crown body (3 spikes + base)
  ctx.beginPath();
  ctx.moveTo(-s, s * 0.5);
  ctx.lineTo(-s, -s * 0.2);
  ctx.lineTo(-s * 0.5, s * 0.1);
  ctx.lineTo(0, -s * 0.7);
  ctx.lineTo(s * 0.5, s * 0.1);
  ctx.lineTo(s, -s * 0.2);
  ctx.lineTo(s, s * 0.5);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, -s, 0, s);
  grad.addColorStop(0, `hsla(200, 100%, 85%, ${alpha})`);
  grad.addColorStop(0.5, `hsla(205, 100%, 65%, ${alpha})`);
  grad.addColorStop(1, `hsla(213, 100%, 50%, ${alpha})`);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = `hsla(195, 100%, 92%, ${alpha})`;
  ctx.lineWidth = 0.8 * DPR;
  ctx.stroke();
  // Center jewel (bright cyan-white)
  ctx.beginPath();
  ctx.arc(0, s * 0.15, s * 0.18, 0, Math.PI * 2);
  ctx.fillStyle = `hsla(190, 100%, 80%, ${alpha})`;
  ctx.fill();
  // Side jewels
  ctx.beginPath();
  ctx.arc(-s * 0.55, -s * 0.15, s * 0.1, 0, Math.PI * 2);
  ctx.arc(s * 0.55, -s * 0.15, s * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = `hsla(210, 100%, 85%, ${alpha})`;
  ctx.fill();
  ctx.restore();
}

function drawPetal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rot: number,
  alpha: number,
  hue: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  const s = size * DPR;
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.bezierCurveTo(s * 0.9, -s * 0.6, s * 0.9, s * 0.6, 0, s);
  ctx.bezierCurveTo(-s * 0.9, s * 0.6, -s * 0.9, -s * 0.6, 0, -s);
  ctx.closePath();
  const grad = ctx.createLinearGradient(-s, 0, s, 0);
  grad.addColorStop(0, `hsla(${hue}, 90%, 75%, ${alpha})`);
  grad.addColorStop(1, `hsla(${hue - 15}, 85%, 55%, ${alpha})`);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();
}

function drawHaremKing(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  baseRadius: number,
  time: number,
  crowns: Crown[],
  petals: Petal[],
) {
  const breathe = 0.5 + 0.5 * Math.sin(time * 1.4);

  // Light blue halo
  const haloR = baseRadius + (18 + breathe * 8) * DPR;
  const halo = ctx.createRadialGradient(cx, cy, baseRadius - 1, cx, cy, haloR);
  halo.addColorStop(0, `hsla(200, 100%, 70%, ${0.24 + breathe * 0.12})`);
  halo.addColorStop(0.5, `hsla(213, 100%, 55%, ${0.14 + breathe * 0.06})`);
  halo.addColorStop(1, `hsla(220, 90%, 45%, 0)`);
  ctx.beginPath();
  ctx.arc(cx, cy, haloR, 0, Math.PI * 2);
  ctx.arc(cx, cy, baseRadius - 1, 0, Math.PI * 2, true);
  ctx.fillStyle = halo;
  ctx.fill();

  // Light blue shimmering ring (matches badge color)
  const steps = 96;
  const sweep = (time * 1.5) % (Math.PI * 2);
  for (let i = 0; i < steps; i++) {
    const a0 = (i / steps) * Math.PI * 2;
    const a1 = ((i + 1.4) / steps) * Math.PI * 2;
    let d = Math.abs(((a0 - sweep + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
    const sweepBoost = Math.max(0, 1 - d / 0.5);
    const wave = 0.5 + 0.5 * Math.sin(a0 * 4 + time * 0.6);
    const hue = 200 + wave * 15; // cyan-blue range
    const lightness = 60 + wave * 12 + sweepBoost * 28;
    const alpha = 0.75 + sweepBoost * 0.25;
    ctx.beginPath();
    ctx.arc(cx, cy, baseRadius, a0, a1);
    ctx.strokeStyle = `hsla(${hue}, 100%, ${lightness}%, ${alpha})`;
    ctx.lineWidth = (2.4 + sweepBoost * 1.4) * DPR;
    ctx.stroke();
  }

  // Inner highlight
  ctx.beginPath();
  ctx.arc(cx, cy, baseRadius - 2 * DPR, 0, Math.PI * 2);
  ctx.strokeStyle = `hsla(195, 100%, 92%, 0.4)`;
  ctx.lineWidth = 0.8 * DPR;
  ctx.stroke();

  // Drifting petals around avatar (light blue tinted)
  for (const p of petals) {
    p.angle += p.speed * 0.012;
    p.spin += p.spinSpeed;
    p.life += 1;
    if (p.life > p.maxLife) {
      p.life = 0;
      p.radius = 0.78 + Math.random() * 0.25;
      p.angle = Math.random() * Math.PI * 2;
    }
    const t = p.life / p.maxLife;
    const fade = Math.sin(t * Math.PI);
    const r = baseRadius * (p.radius + Math.sin(time * 1.2 + p.angle * 2) * 0.02);
    const x = cx + Math.cos(p.angle) * r;
    const y = cy + Math.sin(p.angle) * r;
    drawPetal(ctx, x, y, p.size, p.spin, 0.8 * fade, p.hue);
  }

  // Orbiting crowns (the king's court)
  const baseRot = time * 0.4;
  for (let i = 0; i < crowns.length; i++) {
    const c = crowns[i];
    const a = baseRot + (i / crowns.length) * Math.PI * 2;
    const bob = Math.sin(time * 2 + c.bobPhase) * 1.5 * DPR;
    const r = baseRadius * c.radius + 8 * DPR + bob;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    // Soft cyan-blue glow under crown
    const glowR = c.size * 3 * DPR;
    const g = ctx.createRadialGradient(x, y, 0, x, y, glowR);
    g.addColorStop(0, `hsla(200, 100%, 70%, 0.6)`);
    g.addColorStop(1, `hsla(213, 100%, 55%, 0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, glowR, 0, Math.PI * 2);
    ctx.fill();
    drawCrown(ctx, x, y, c.size, 0.95, Math.sin(time * 2 + c.bobPhase) * 0.15);
  }

  // The KING's crown — bigger, fixed at the top, with extra blue glow
  const kingY = cy - baseRadius - 12 * DPR - breathe * 2 * DPR;
  const kingGlow = ctx.createRadialGradient(cx, kingY, 0, cx, kingY, 18 * DPR);
  kingGlow.addColorStop(0, `hsla(200, 100%, 82%, ${0.75 + breathe * 0.2})`);
  kingGlow.addColorStop(1, `hsla(213, 100%, 55%, 0)`);
  ctx.fillStyle = kingGlow;
  ctx.beginPath();
  ctx.arc(cx, kingY, 18 * DPR, 0, Math.PI * 2);
  ctx.fill();
  drawCrown(ctx, cx, kingY, 9, 1, 0);
}

// ─── Rizzler: Warm orange wavy ring + drifting embers + lens flares ───
interface Ember {
  angle: number;
  radius: number; // fraction of baseRadius
  speed: number;
  rise: number;
  life: number;
  maxLife: number;
  size: number;
  flickerPhase: number;
}

interface Flare {
  angle: number;
  radius: number;
  phase: number;
  speed: number;
  size: number;
}

interface Bolt {
  angle: number;        // angle on ring where bolt strikes (outward)
  length: number;       // length in px
  segments: number[];   // perpendicular offsets for zigzag
  born: number;         // time when bolt was created
  duration: number;     // how long it stays visible (sec)
}

interface Pulse {
  angle: number;        // current head angle on the ring
  speed: number;        // rad/sec
  width: number;        // arc length of the trail
}

interface OrbitHeart {
  angle: number;
  speed: number;
  radius: number; // fraction of baseRadius
  size: number;
  spinPhase: number;
  hueShift: number;
}

const makeEmbers = (count: number): Ember[] =>
  Array.from({ length: count }, () => ({
    angle: Math.random() * Math.PI * 2,
    radius: 0.8 + Math.random() * 0.25,
    speed: 0.15 + Math.random() * 0.25,
    rise: 0.02 + Math.random() * 0.04,
    life: Math.random() * 120,
    maxLife: 100 + Math.random() * 80,
    size: 1.2 + Math.random() * 1.6,
    flickerPhase: Math.random() * Math.PI * 2,
  }));

const makeFlares = (count: number, baseRadius: number): Flare[] =>
  Array.from({ length: count }, (_, i) => ({
    angle: (i / count) * Math.PI * 2 + Math.random() * 0.4,
    radius: baseRadius + (Math.random() - 0.5) * 4,
    phase: Math.random() * Math.PI * 2,
    speed: 1.6 + Math.random() * 1.4,
    size: 1.5 + Math.random() * 1.2,
  }));

const makePulses = (count: number): Pulse[] =>
  Array.from({ length: count }, (_, i) => ({
    angle: (i / count) * Math.PI * 2,
    speed: 2.4 + (i % 2 === 0 ? 0 : 0.8), // alternating speeds
    width: 0.8 + Math.random() * 0.4,
  }));

const makeOrbitHearts = (count: number): OrbitHeart[] =>
  Array.from({ length: count }, (_, i) => ({
    angle: (i / count) * Math.PI * 2,
    speed: 0.35,
    radius: 1.12,
    size: 4 + Math.random() * 1.5,
    spinPhase: Math.random() * Math.PI * 2,
    hueShift: -10 + Math.random() * 20,
  }));

function makeBolt(time: number, baseRadius: number): Bolt {
  const segCount = 6 + Math.floor(Math.random() * 3);
  const segments = Array.from({ length: segCount }, () => (Math.random() - 0.5) * 2);
  return {
    angle: Math.random() * Math.PI * 2,
    length: baseRadius * (0.55 + Math.random() * 0.35),
    segments,
    born: time,
    duration: 0.18 + Math.random() * 0.12,
  };
}

function drawRizzler(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  baseRadius: number,
  time: number,
  embers: Ember[],
  flares: Flare[],
  pulses: Pulse[],
  orbitHearts: OrbitHeart[],
  boltsRef: { bolts: Bolt[]; nextStrike: number },
) {
  const breathe = 0.5 + 0.5 * Math.sin(time * 1.6);
  const fastPulse = 0.5 + 0.5 * Math.sin(time * 4);

  // ── Outer atmospheric glow (very soft, large) ────────────────
  const outerR = baseRadius + (38 + breathe * 14) * DPR;
  const outer = ctx.createRadialGradient(cx, cy, baseRadius * 0.7, cx, cy, outerR);
  outer.addColorStop(0, `hsla(320, 100%, 60%, 0)`);
  outer.addColorStop(0.55, `hsla(310, 100%, 55%, ${0.14 + breathe * 0.06})`);
  outer.addColorStop(1, `hsla(280, 90%, 40%, 0)`);
  ctx.fillStyle = outer;
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.fill();

  // ── Inner sharp halo right around ring ───────────────────────
  const haloR = baseRadius + (14 + breathe * 8) * DPR;
  const halo = ctx.createRadialGradient(cx, cy, baseRadius - 1, cx, cy, haloR);
  halo.addColorStop(0, `hsla(325, 100%, 70%, ${0.4 + breathe * 0.15})`);
  halo.addColorStop(0.55, `hsla(295, 100%, 55%, ${0.2 + breathe * 0.08})`);
  halo.addColorStop(1, `hsla(275, 90%, 45%, 0)`);
  ctx.beginPath();
  ctx.arc(cx, cy, haloR, 0, Math.PI * 2);
  ctx.arc(cx, cy, baseRadius - 1, 0, Math.PI * 2, true);
  ctx.fillStyle = halo;
  ctx.fill();

  // ── Plasma ring: layered with chromatic offset (pink + purple) ─
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const offset = 1.2 * DPR;
  // Pink layer
  ctx.beginPath();
  ctx.arc(cx + offset, cy, baseRadius, 0, Math.PI * 2);
  ctx.strokeStyle = `hsla(325, 100%, 65%, 0.55)`;
  ctx.lineWidth = 3.2 * DPR;
  ctx.stroke();
  // Purple layer
  ctx.beginPath();
  ctx.arc(cx - offset, cy, baseRadius, 0, Math.PI * 2);
  ctx.strokeStyle = `hsla(285, 100%, 60%, 0.55)`;
  ctx.lineWidth = 3.2 * DPR;
  ctx.stroke();
  ctx.restore();

  // Main flowing wavy ring with hue gradient + heartbeat pulse on radius
  const ringR = baseRadius + fastPulse * 0.8 * DPR;
  const steps = 140;
  ctx.lineCap = "round";
  for (let i = 0; i < steps; i++) {
    const a0 = (i / steps) * Math.PI * 2;
    const a1 = ((i + 1.6) / steps) * Math.PI * 2;
    const wave = Math.sin(a0 * 3 - time * 1.6) * 1.6 * DPR;
    const r = ringR + wave;
    const hueShift = 0.5 + 0.5 * Math.sin(a0 * 2 + time * 0.7);
    const hue = 285 + hueShift * 45; // purple -> hot pink
    const lightness = 60 + hueShift * 14;
    ctx.beginPath();
    ctx.arc(cx, cy, r, a0, a1);
    ctx.strokeStyle = `hsla(${hue}, 100%, ${lightness}%, 0.85)`;
    ctx.lineWidth = 2.2 * DPR;
    ctx.stroke();
  }

  // Bright traveling energy pulses (comet-like arcs)
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const p of pulses) {
    p.angle += p.speed * 0.016;
    const head = p.angle;
    const segs = 22;
    for (let i = 0; i < segs; i++) {
      const t = i / segs; // 0 head, 1 tail
      const a0 = head - t * p.width;
      const a1 = a0 - p.width / segs;
      const alpha = (1 - t) * 0.9;
      ctx.beginPath();
      ctx.arc(cx, cy, ringR, a1, a0);
      ctx.strokeStyle = `hsla(${320 - t * 15}, 100%, ${90 - t * 20}%, ${alpha})`;
      ctx.lineWidth = (3 - t * 1.8) * DPR;
      ctx.stroke();
    }
  }
  ctx.restore();

  // Inner highlight (polished)
  ctx.beginPath();
  ctx.arc(cx, cy, ringR - 2 * DPR, 0, Math.PI * 2);
  ctx.strokeStyle = `hsla(320, 100%, 95%, 0.35)`;
  ctx.lineWidth = 0.8 * DPR;
  ctx.stroke();

  // ── Lightning bolts ──────────────────────────────────────────
  // Spawn new bolts on a timer
  if (time >= boltsRef.nextStrike) {
    boltsRef.bolts.push(makeBolt(time, baseRadius));
    if (Math.random() < 0.35) boltsRef.bolts.push(makeBolt(time, baseRadius));
    boltsRef.nextStrike = time + 0.35 + Math.random() * 0.7;
  }
  // Render and prune
  boltsRef.bolts = boltsRef.bolts.filter((b) => time - b.born < b.duration);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const b of boltsRef.bolts) {
    const age = (time - b.born) / b.duration;
    const intensity = Math.sin(age * Math.PI); // fade in/out
    if (intensity <= 0.02) continue;
    // Bolt extends from the ring outward
    const ox = Math.cos(b.angle);
    const oy = Math.sin(b.angle);
    const px = -oy; // perpendicular
    const py = ox;
    const startX = cx + ox * baseRadius;
    const startY = cy + oy * baseRadius;
    const endX = cx + ox * (baseRadius + b.length);
    const endY = cy + oy * (baseRadius + b.length);

    // Build zigzag path
    const segCount = b.segments.length;
    const points: Array<[number, number]> = [[startX, startY]];
    for (let i = 0; i < segCount; i++) {
      const t = (i + 1) / (segCount + 1);
      const lx = startX + (endX - startX) * t;
      const ly = startY + (endY - startY) * t;
      const off = b.segments[i] * 8 * DPR * (1 - Math.abs(t - 0.5)); // taper toward ends
      points.push([lx + px * off, ly + py * off]);
    }
    points.push([endX, endY]);

    // Outer glow stroke
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
    ctx.strokeStyle = `hsla(310, 100%, 70%, ${0.55 * intensity})`;
    ctx.lineWidth = 6 * DPR;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    // Mid stroke
    ctx.strokeStyle = `hsla(320, 100%, 80%, ${0.85 * intensity})`;
    ctx.lineWidth = 2.6 * DPR;
    ctx.stroke();
    // Bright core
    ctx.strokeStyle = `hsla(320, 100%, 96%, ${intensity})`;
    ctx.lineWidth = 1 * DPR;
    ctx.stroke();

    // Spark at strike point on ring
    const sparkR = 8 * DPR * intensity;
    const sg = ctx.createRadialGradient(startX, startY, 0, startX, startY, sparkR);
    sg.addColorStop(0, `hsla(320, 100%, 95%, ${intensity})`);
    sg.addColorStop(0.5, `hsla(310, 100%, 65%, ${0.7 * intensity})`);
    sg.addColorStop(1, `hsla(290, 100%, 50%, 0)`);
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.arc(startX, startY, sparkR, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // ── Orbiting glowing hearts (the rizz hearts) ────────────────
  for (let i = 0; i < orbitHearts.length; i++) {
    const oh = orbitHearts[i];
    oh.angle += oh.speed * 0.012;
    const baseA = oh.angle + (i / orbitHearts.length) * Math.PI * 2 * 0;
    const bob = Math.sin(time * 2 + oh.spinPhase) * 0.02;
    const r = baseRadius * (oh.radius + bob);
    const x = cx + Math.cos(baseA) * r;
    const y = cy + Math.sin(baseA) * r;
    // Glow under heart
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const glowR = oh.size * 3 * DPR;
    const hg = ctx.createRadialGradient(x, y, 0, x, y, glowR);
    hg.addColorStop(0, `hsla(${320 + oh.hueShift}, 100%, 75%, 0.7)`);
    hg.addColorStop(1, `hsla(${300 + oh.hueShift}, 100%, 55%, 0)`);
    ctx.fillStyle = hg;
    ctx.beginPath();
    ctx.arc(x, y, glowR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // Heart shape (reuse drawHeart) — pinker fill
    ctx.fillStyle = `hsla(${320 + oh.hueShift}, 100%, 72%, 0.95)`;
    drawHeart(ctx, x, y, oh.size * DPR, Math.sin(time * 2 + oh.spinPhase) * 0.2);
  }

  // ── Drifting embers spiraling outward ────────────────────────
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const e of embers) {
    e.angle += e.speed * 0.012;
    e.radius += e.rise * 0.01;
    e.life += 1;
    if (e.life > e.maxLife || e.radius > 1.2) {
      e.life = 0;
      e.angle = Math.random() * Math.PI * 2;
      e.radius = 0.78 + Math.random() * 0.08;
      e.flickerPhase = Math.random() * Math.PI * 2;
    }
    const t = e.life / e.maxLife;
    const fade = Math.sin(t * Math.PI);
    const flicker = 0.6 + 0.4 * Math.sin(time * 8 + e.flickerPhase);
    const r = baseRadius * e.radius;
    const x = cx + Math.cos(e.angle) * r;
    const y = cy + Math.sin(e.angle) * r;
    const size = e.size * DPR * (0.7 + flicker * 0.5);
    const g = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
    g.addColorStop(0, `hsla(325, 100%, 85%, ${0.85 * fade * flicker})`);
    g.addColorStop(0.5, `hsla(305, 100%, 60%, ${0.5 * fade * flicker})`);
    g.addColorStop(1, `hsla(285, 100%, 45%, 0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, size * 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `hsla(320, 100%, 96%, ${fade * flicker})`;
    ctx.beginPath();
    ctx.arc(x, y, size * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // ── Lens flares (8-point sparkles) ───────────────────────────
  for (const f of flares) {
    const flicker = 0.5 + 0.5 * Math.sin(time * f.speed + f.phase);
    if (flicker < 0.15) continue;
    const x = cx + Math.cos(f.angle) * f.radius;
    const y = cy + Math.sin(f.angle) * f.radius;
    const len = (f.size + flicker * 4) * DPR;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(time * 0.5 + f.phase);
    ctx.strokeStyle = `hsla(320, 100%, 92%, ${flicker})`;
    ctx.lineWidth = 1.1 * DPR;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-len, 0);
    ctx.lineTo(len, 0);
    ctx.moveTo(0, -len);
    ctx.lineTo(0, len);
    const dl = len * 0.55;
    ctx.moveTo(-dl, -dl);
    ctx.lineTo(dl, dl);
    ctx.moveTo(-dl, dl);
    ctx.lineTo(dl, -dl);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 1.3 * DPR, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(320, 100%, 98%, ${flicker})`;
    ctx.fill();
    ctx.restore();
  }
}

// ─── Horny Royalty: Royal purple aura + gold sigils + crimson horn-flames ───
interface Sigil {
  angle: number;
  speed: number;
  radius: number;
  size: number;
  bobPhase: number;
  spin: number;
  spinSpeed: number;
}

interface HornFlame {
  angle: number;
  radius: number;
  speed: number;
  rise: number;
  life: number;
  maxLife: number;
  size: number;
  flickerPhase: number;
  side: 1 | -1;
}

interface Jewel {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  twinkle: number;
  hue: number;
}

interface NaughtyEmoji {
  emoji: string;
  angle: number;
  radius: number;
  speed: number;
  rise: number;
  life: number;
  maxLife: number;
  size: number;
  spin: number;
  spinSpeed: number;
}

const NAUGHTY_GLYPHS = ["🍑", "🍆", "💦", "😈", "💋"];

const makeNaughtyEmojis = (count: number): NaughtyEmoji[] =>
  Array.from({ length: count }, () => ({
    emoji: NAUGHTY_GLYPHS[Math.floor(Math.random() * NAUGHTY_GLYPHS.length)],
    angle: Math.random() * Math.PI * 2,
    radius: 0.95 + Math.random() * 0.1,
    speed: 0.05 + Math.random() * 0.08,
    rise: 0.0015 + Math.random() * 0.003,
    life: Math.random() * 180,
    maxLife: 160 + Math.random() * 100,
    size: 12 + Math.random() * 6,
    spin: Math.random() * Math.PI * 2,
    spinSpeed: (Math.random() - 0.5) * 0.04,
  }));

const makeSigils = (count: number): Sigil[] =>
  Array.from({ length: count }, (_, i) => ({
    angle: (i / count) * Math.PI * 2,
    speed: 0.18,
    radius: 1.0,
    size: 5.5 + Math.random() * 1.2,
    bobPhase: Math.random() * Math.PI * 2,
    spin: Math.random() * Math.PI * 2,
    spinSpeed: (Math.random() - 0.5) * 0.04,
  }));

const makeHornFlames = (count: number): HornFlame[] =>
  Array.from({ length: count }, () => ({
    angle: Math.random() * Math.PI * 2,
    radius: 0.95 + Math.random() * 0.1,
    speed: 0.05 + Math.random() * 0.1,
    rise: 0.002 + Math.random() * 0.004,
    life: Math.random() * 120,
    maxLife: 90 + Math.random() * 80,
    size: 4 + Math.random() * 3,
    flickerPhase: Math.random() * Math.PI * 2,
    side: Math.random() < 0.5 ? 1 : -1,
  }));

const makeJewels = (count: number): Jewel[] =>
  Array.from({ length: count }, (_, i) => ({
    angle: (i / count) * Math.PI * 2 + Math.random() * 0.3,
    radius: 1.12 + Math.random() * 0.1,
    speed: 0.08 + Math.random() * 0.06,
    size: 2.2 + Math.random() * 1.4,
    twinkle: Math.random() * Math.PI * 2,
    hue: 280 + Math.random() * 25,
  }));

function drawFleurDeLis(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  alpha: number,
  rot: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  const s = size * DPR;
  const grad = ctx.createLinearGradient(0, -s, 0, s);
  grad.addColorStop(0, `hsla(55, 100%, 80%, ${alpha})`);
  grad.addColorStop(0.5, `hsla(45, 100%, 60%, ${alpha})`);
  grad.addColorStop(1, `hsla(38, 90%, 42%, ${alpha})`);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.bezierCurveTo(s * 0.35, -s * 0.5, s * 0.25, s * 0.2, 0, s * 0.4);
  ctx.bezierCurveTo(-s * 0.25, s * 0.2, -s * 0.35, -s * 0.5, 0, -s);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-s * 0.15, -s * 0.2);
  ctx.bezierCurveTo(-s, -s * 0.4, -s * 1.1, s * 0.3, -s * 0.2, s * 0.45);
  ctx.bezierCurveTo(-s * 0.4, s * 0.1, -s * 0.5, -s * 0.1, -s * 0.15, -s * 0.2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(s * 0.15, -s * 0.2);
  ctx.bezierCurveTo(s, -s * 0.4, s * 1.1, s * 0.3, s * 0.2, s * 0.45);
  ctx.bezierCurveTo(s * 0.4, s * 0.1, s * 0.5, -s * 0.1, s * 0.15, -s * 0.2);
  ctx.fill();
  ctx.fillStyle = `hsla(40, 100%, 55%, ${alpha})`;
  ctx.fillRect(-s * 0.55, s * 0.42, s * 1.1, s * 0.16);
  ctx.strokeStyle = `hsla(50, 100%, 90%, ${alpha * 0.9})`;
  ctx.lineWidth = 0.5 * DPR;
  ctx.strokeRect(-s * 0.55, s * 0.42, s * 1.1, s * 0.16);
  ctx.restore();
}

function drawHornFlame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  alpha: number,
  flicker: number,
  rot: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  const s = size * DPR * (0.9 + flicker * 0.25);
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 2.2);
  glow.addColorStop(0, `hsla(15, 100%, 65%, ${alpha * 0.7})`);
  glow.addColorStop(0.5, `hsla(0, 90%, 50%, ${alpha * 0.35})`);
  glow.addColorStop(1, `hsla(350, 80%, 35%, 0)`);
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, s * 2.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0, s);
  ctx.bezierCurveTo(s * 0.9, s * 0.4, s * 0.5, -s * 0.6, 0, -s * 1.4);
  ctx.bezierCurveTo(-s * 0.5, -s * 0.6, -s * 0.9, s * 0.4, 0, s);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, s, 0, -s * 1.4);
  grad.addColorStop(0, `hsla(355, 100%, 35%, ${alpha})`);
  grad.addColorStop(0.55, `hsla(10, 100%, 55%, ${alpha})`);
  grad.addColorStop(1, `hsla(35, 100%, 75%, ${alpha})`);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();
}

function drawHornyRoyalty(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  baseRadius: number,
  time: number,
  sigils: Sigil[],
  flames: HornFlame[],
  jewels: Jewel[],
  emojis: NaughtyEmoji[],
) {
  // Subtle purple breathing aura
  const breath = 0.5 + Math.sin(time * 1.2) * 0.5;
  const auraGrad = ctx.createRadialGradient(cx, cy, baseRadius * 0.95, cx, cy, baseRadius * 1.4);
  auraGrad.addColorStop(0, `hsla(285, 80%, 50%, ${0.08 + breath * 0.05})`);
  auraGrad.addColorStop(0.6, `hsla(275, 70%, 30%, ${0.04 + breath * 0.02})`);
  auraGrad.addColorStop(1, `hsla(265, 60%, 18%, 0)`);
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, baseRadius * 1.4, 0, Math.PI * 2);
  ctx.fill();

  // Subtle gold rim hint
  const rim = ctx.createRadialGradient(cx, cy, baseRadius * 0.95, cx, cy, baseRadius * 1.12);
  rim.addColorStop(0, `hsla(45, 100%, 60%, 0)`);
  rim.addColorStop(0.5, `hsla(45, 100%, 65%, ${0.25 + breath * 0.12})`);
  rim.addColorStop(1, `hsla(38, 100%, 45%, 0)`);
  ctx.fillStyle = rim;
  ctx.beginPath();
  ctx.arc(cx, cy, baseRadius * 1.12, 0, Math.PI * 2);
  ctx.fill();

  // Clean purple ring with very gentle wave
  ctx.beginPath();
  const steps = 120;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const wave = Math.sin(a * 3 - time * 0.9) * 0.6 * DPR;
    const r = baseRadius + wave;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = `hsla(285, 95%, 60%, 0.85)`;
  ctx.lineWidth = 2 * DPR;
  ctx.shadowColor = `hsla(285, 100%, 60%, 0.8)`;
  ctx.shadowBlur = 10 * DPR;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Single elegant gold sweep arc rotating slowly
  const sweepStart = time * 0.7;
  const sweepLen = Math.PI * 0.5;
  ctx.beginPath();
  ctx.arc(cx, cy, baseRadius, sweepStart, sweepStart + sweepLen);
  ctx.strokeStyle = `hsla(48, 100%, 72%, 0.9)`;
  ctx.lineWidth = 2.4 * DPR;
  ctx.shadowColor = `hsla(45, 100%, 70%, 0.9)`;
  ctx.shadowBlur = 12 * DPR;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // A few small purple twinkles on ring
  jewels.forEach((j) => {
    j.angle += j.speed * 0.012;
    const tw = 0.4 + (Math.sin(time * 2 + j.twinkle) * 0.5 + 0.5) * 0.5;
    const x = cx + Math.cos(j.angle) * baseRadius;
    const y = cy + Math.sin(j.angle) * baseRadius;
    const s = j.size * DPR * 0.8;
    const g = ctx.createRadialGradient(x, y, 0, x, y, s * 2.5);
    g.addColorStop(0, `hsla(${j.hue}, 100%, 90%, ${tw})`);
    g.addColorStop(1, `hsla(${j.hue}, 100%, 55%, 0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, s * 2.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // 4 calm gold fleur-de-lis sigils on the ring
  sigils.forEach((sg) => {
    sg.angle += sg.speed * 0.008;
    const x = cx + Math.cos(sg.angle) * baseRadius;
    const y = cy + Math.sin(sg.angle) * baseRadius;
    const rot = sg.angle + Math.PI / 2;
    const halo = ctx.createRadialGradient(x, y, 0, x, y, sg.size * DPR * 1.8);
    halo.addColorStop(0, `hsla(48, 100%, 70%, 0.55)`);
    halo.addColorStop(1, `hsla(40, 100%, 50%, 0)`);
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, sg.size * DPR * 1.8, 0, Math.PI * 2);
    ctx.fill();
    drawFleurDeLis(ctx, x, y, sg.size, 0.95, rot);
  });
  // Naughty emojis rising & orbiting around ring
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  emojis.forEach((e) => {
    e.life += 1;
    e.angle += e.speed * 0.016;
    e.radius += e.rise;
    e.spin += e.spinSpeed;
    if (e.life > e.maxLife || e.radius > 1.5) {
      e.life = 0;
      e.angle = Math.random() * Math.PI * 2;
      e.radius = 0.95 + Math.random() * 0.05;
      e.emoji = NAUGHTY_GLYPHS[Math.floor(Math.random() * NAUGHTY_GLYPHS.length)];
    }
    const t = e.life / e.maxLife;
    const alpha = Math.sin(t * Math.PI) * 0.95;
    const x = cx + Math.cos(e.angle) * baseRadius * e.radius;
    const y = cy + Math.sin(e.angle) * baseRadius * e.radius;
    const wobble = Math.sin(time * 3 + e.spin) * 0.12;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(wobble);
    ctx.globalAlpha = alpha;
    ctx.font = `${e.size * DPR}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
    ctx.shadowColor = "hsla(285, 100%, 60%, 0.6)";
    ctx.shadowBlur = 6 * DPR;
    ctx.fillText(e.emoji, 0, 0);
    ctx.restore();
  });
  ctx.restore();
  // Suppress unused flames param (kept for signature stability)
  void flames;
}

// ─── F*cking Legend: Rising flame tongues + bottom-up fire field + sparks ───
interface Flame {
  // Position is parameterized along the ring perimeter (0..1)
  t: number;            // ring parameter (0=top, 0.5=bottom)
  spawnT: number;       // original ring spot, used for jitter
  life: number;
  maxLife: number;
  width: number;        // base width of tongue
  height: number;       // peak height in px
  swayPhase: number;
  hueShift: number;
}

interface Spark {
  x: number;            // px relative to ring origin
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hueShift: number;
}

const makeFlame = (baseRadius: number): Flame => {
  // Bias spawn toward the bottom half (t around 0.5)
  const bias = Math.random() < 0.7;
  const t = bias
    ? 0.25 + Math.random() * 0.5            // bottom arc
    : Math.random();                         // anywhere
  return {
    t,
    spawnT: t,
    life: 0,
    maxLife: 50 + Math.random() * 60,
    width: (6 + Math.random() * 6) * DPR,
    height: (baseRadius * (0.18 + Math.random() * 0.22)),
    swayPhase: Math.random() * Math.PI * 2,
    hueShift: -10 + Math.random() * 30,
  };
};

const makeSpark = (cx: number, cy: number, baseRadius: number): Spark => {
  const a = Math.PI * (0.15 + Math.random() * 0.7); // bottom arc angles
  const r = baseRadius * (0.95 + Math.random() * 0.1);
  return {
    x: Math.cos(Math.PI / 2 + (Math.random() - 0.5) * Math.PI) * r,
    y: Math.sin(Math.PI / 2 + (Math.random() - 0.5) * Math.PI) * r,
    vx: (Math.random() - 0.5) * 1.4 * DPR,
    vy: -(1.2 + Math.random() * 2.2) * DPR,
    life: 0,
    maxLife: 40 + Math.random() * 50,
    size: (0.8 + Math.random() * 1.4) * DPR,
    hueShift: -5 + Math.random() * 35,
    // a kept implicit; sparks emanate roughly from bottom
    // (a is unused, intentionally just for spec clarity)
    ...({ _a: a } as object),
  } as Spark;
};

function drawFlameTongue(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  outwardX: number,
  outwardY: number,
  width: number,
  height: number,
  alpha: number,
  hueShift: number,
  sway: number,
) {
  // tip is height units along outward vector, with sway perpendicular
  const perpX = -outwardY;
  const perpY = outwardX;
  const tipX = x + outwardX * height + perpX * sway;
  const tipY = y + outwardY * height + perpY * sway;
  const leftX = x + perpX * width;
  const leftY = y + perpY * width;
  const rightX = x - perpX * width;
  const rightY = y - perpY * width;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  // outer red
  ctx.beginPath();
  ctx.moveTo(leftX, leftY);
  ctx.quadraticCurveTo(
    x + outwardX * height * 0.5 + perpX * sway * 0.5,
    y + outwardY * height * 0.5 + perpY * sway * 0.5,
    tipX,
    tipY,
  );
  ctx.quadraticCurveTo(
    x + outwardX * height * 0.5 - perpX * sway * 0.5,
    y + outwardY * height * 0.5 - perpY * sway * 0.5,
    rightX,
    rightY,
  );
  ctx.closePath();
  const grad = ctx.createLinearGradient(x, y, tipX, tipY);
  grad.addColorStop(0, `hsla(${25 + hueShift}, 100%, 70%, ${alpha * 0.95})`);
  grad.addColorStop(0.45, `hsla(${8 + hueShift}, 100%, 50%, ${alpha * 0.9})`);
  grad.addColorStop(1, `hsla(${355 + hueShift}, 95%, 35%, 0)`);
  ctx.fillStyle = grad;
  ctx.fill();

  // hot inner core
  const innerW = width * 0.45;
  ctx.beginPath();
  ctx.moveTo(x + perpX * innerW, y + perpY * innerW);
  ctx.quadraticCurveTo(
    x + outwardX * height * 0.55 + perpX * sway * 0.6,
    y + outwardY * height * 0.55 + perpY * sway * 0.6,
    x + outwardX * height * 0.85 + perpX * sway,
    y + outwardY * height * 0.85 + perpY * sway,
  );
  ctx.quadraticCurveTo(
    x + outwardX * height * 0.55 - perpX * sway * 0.6,
    y + outwardY * height * 0.55 - perpY * sway * 0.6,
    x - perpX * innerW,
    y - perpY * innerW,
  );
  ctx.closePath();
  const core = ctx.createLinearGradient(x, y, tipX, tipY);
  core.addColorStop(0, `hsla(35, 100%, 88%, ${alpha})`);
  core.addColorStop(0.5, `hsla(15, 100%, 60%, ${alpha * 0.85})`);
  core.addColorStop(1, `hsla(0, 100%, 45%, 0)`);
  ctx.fillStyle = core;
  ctx.fill();
  ctx.restore();
}

function drawFckingLegend(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  baseRadius: number,
  time: number,
  flames: Flame[],
  sparks: Spark[],
) {
  // 1. Tight red heat glow (centered, contained within canvas bounds)
  const heat = ctx.createRadialGradient(
    cx,
    cy + baseRadius * 0.15,
    baseRadius * 0.3,
    cx,
    cy + baseRadius * 0.15,
    baseRadius * 1.35,
  );
  const pulse = 0.5 + Math.sin(time * 3) * 0.5;
  heat.addColorStop(0, `hsla(8, 100%, 50%, ${0.22 + pulse * 0.08})`);
  heat.addColorStop(0.5, `hsla(0, 95%, 40%, ${0.12 + pulse * 0.05})`);
  heat.addColorStop(1, `hsla(355, 90%, 25%, 0)`);
  ctx.fillStyle = heat;
  ctx.beginPath();
  ctx.arc(cx, cy, baseRadius * 1.4, 0, Math.PI * 2);
  ctx.fill();

  // 2. Smoldering crimson ring with crackling wave
  const steps = 160;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const crackle =
      Math.sin(a * 9 - time * 6) * 0.8 +
      Math.sin(a * 17 + time * 9) * 0.5;
    const r = baseRadius + crackle * DPR;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.strokeStyle = `hsla(5, 100%, 55%, 0.95)`;
  ctx.lineWidth = 2.4 * DPR;
  ctx.shadowColor = `hsla(0, 100%, 50%, 1)`;
  ctx.shadowBlur = 12 * DPR;
  ctx.stroke();
  // hot inner outline (bright ember)
  ctx.lineWidth = 1.2 * DPR;
  ctx.strokeStyle = `hsla(20, 100%, 75%, 0.6)`;
  ctx.shadowBlur = 4 * DPR;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // 3. Rising flame tongues anchored on ring perimeter
  flames.forEach((f) => {
    f.life += 1;
    if (f.life > f.maxLife) {
      Object.assign(f, makeFlame(baseRadius));
    }
    const t = f.life / f.maxLife;
    // life envelope: quick grow, slow fade
    const env = Math.sin(Math.pow(t, 0.6) * Math.PI);
    const alpha = env * 0.95;
    const heightNow = f.height * (0.4 + env * 0.9);
    const angle = f.t * Math.PI * 2 - Math.PI / 2; // 0 at top
    const ox = Math.cos(angle);
    const oy = Math.sin(angle);
    const x = cx + ox * baseRadius;
    const y = cy + oy * baseRadius;
    const sway =
      Math.sin(time * 4 + f.swayPhase) * heightNow * 0.18 +
      (Math.random() - 0.5) * 0.4 * DPR;
    drawFlameTongue(
      ctx,
      x,
      y,
      ox,
      oy,
      f.width * (0.6 + env * 0.6),
      heightNow,
      alpha,
      f.hueShift,
      sway,
    );
  });

  // 4. Bright sparks rising from bottom arc
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  sparks.forEach((s) => {
    s.life += 1;
    s.x += s.vx;
    s.y += s.vy;
    s.vy += 0.02 * DPR; // gentle gravity easing the rise
    if (s.life > s.maxLife) {
      Object.assign(s, makeSpark(cx, cy, baseRadius));
    }
    const t = s.life / s.maxLife;
    const alpha = Math.sin(t * Math.PI) * 0.95;
    const px = cx + s.x;
    const py = cy + s.y;
    const g = ctx.createRadialGradient(px, py, 0, px, py, s.size * 4);
    g.addColorStop(0, `hsla(${30 + s.hueShift}, 100%, 88%, ${alpha})`);
    g.addColorStop(0.4, `hsla(${10 + s.hueShift}, 100%, 55%, ${alpha * 0.7})`);
    g.addColorStop(1, `hsla(${355 + s.hueShift}, 90%, 40%, 0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(px, py, s.size * 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px, py, s.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(30, 100%, 92%, ${alpha})`;
    ctx.fill();
  });
  ctx.restore();
}

// ─── Giga Chad: Gold sunburst rays + metallic shine sweep + power pulses ───
interface PowerPulse {
  life: number;
  maxLife: number;
  delay: number;
}

interface ChadEmoji {
  emoji: string;
  angle: number;
  speed: number;
  size: number;
  bobPhase: number;
}

const CHAD_GLYPHS = ["💪", "🏆", "⚡"];

const makePowerPulses = (count: number): PowerPulse[] =>
  Array.from({ length: count }, (_, i) => ({
    life: 0,
    maxLife: 90,
    delay: (i / count) * 90,
  }));

const makeChadEmojis = (count: number): ChadEmoji[] =>
  Array.from({ length: count }, (_, i) => ({
    emoji: CHAD_GLYPHS[i % CHAD_GLYPHS.length],
    angle: (i / count) * Math.PI * 2,
    speed: 0.12,
    size: 13 + Math.random() * 2,
    bobPhase: Math.random() * Math.PI * 2,
  }));

function drawGigaChad(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  baseRadius: number,
  time: number,
  pulses: PowerPulse[],
  emojis: ChadEmoji[],
) {
  const breath = 0.5 + Math.sin(time * 2) * 0.5;
  const aura = ctx.createRadialGradient(cx, cy, baseRadius * 0.85, cx, cy, baseRadius * 1.3);
  aura.addColorStop(0, `hsla(45, 100%, 55%, 0)`);
  aura.addColorStop(0.55, `hsla(45, 100%, 55%, ${0.22 + breath * 0.1})`);
  aura.addColorStop(1, `hsla(38, 100%, 40%, 0)`);
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, cy, baseRadius * 1.3, 0, Math.PI * 2);
  ctx.fill();

  // Rotating golden sunburst rays (clipped to contained zone)
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, baseRadius * 1.28, 0, Math.PI * 2);
  ctx.clip();
  ctx.globalCompositeOperation = "lighter";
  const rayCount = 14;
  const rayRot = time * 0.35;
  for (let i = 0; i < rayCount; i++) {
    const a = rayRot + (i / rayCount) * Math.PI * 2;
    const rayPulse = 0.6 + Math.sin(time * 2.5 + i) * 0.4;
    const innerR = baseRadius * 1.0;
    const outerR = baseRadius * 1.26;
    const halfW = 0.06;
    const x1 = cx + Math.cos(a - halfW) * innerR;
    const y1 = cy + Math.sin(a - halfW) * innerR;
    const x2 = cx + Math.cos(a + halfW) * innerR;
    const y2 = cy + Math.sin(a + halfW) * innerR;
    const x3 = cx + Math.cos(a) * outerR;
    const y3 = cy + Math.sin(a) * outerR;
    const grad = ctx.createLinearGradient((x1 + x2) / 2, (y1 + y2) / 2, x3, y3);
    grad.addColorStop(0, `hsla(48, 100%, 70%, ${0.55 * rayPulse})`);
    grad.addColorStop(1, `hsla(45, 100%, 60%, 0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Solid metallic gold ring (double stroke)
  ctx.beginPath();
  ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
  ctx.strokeStyle = `hsla(38, 100%, 38%, 0.9)`;
  ctx.lineWidth = 3.4 * DPR;
  ctx.shadowColor = `hsla(45, 100%, 55%, 0.8)`;
  ctx.shadowBlur = 8 * DPR;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
  ctx.strokeStyle = `hsla(50, 100%, 70%, 0.95)`;
  ctx.lineWidth = 1.6 * DPR;
  ctx.shadowBlur = 0;
  ctx.stroke();

  // Bright metallic shine sweep
  const sweepStart = time * 1.3;
  const sweepLen = Math.PI * 0.35;
  ctx.beginPath();
  ctx.arc(cx, cy, baseRadius, sweepStart, sweepStart + sweepLen);
  ctx.strokeStyle = `hsla(55, 100%, 92%, 0.95)`;
  ctx.lineWidth = 2.4 * DPR;
  ctx.shadowColor = `hsla(50, 100%, 80%, 1)`;
  ctx.shadowBlur = 14 * DPR;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Power pulse rings expanding (contained)
  pulses.forEach((p) => {
    if (p.delay > 0) {
      p.delay -= 1;
      return;
    }
    p.life += 1;
    if (p.life > p.maxLife) {
      p.life = 0;
      p.delay = 60;
    }
    const t = p.life / p.maxLife;
    const r = baseRadius * (1.0 + t * 0.26);
    const alpha = (1 - t) * 0.6;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(48, 100%, 68%, ${alpha})`;
    ctx.lineWidth = 1.6 * DPR;
    ctx.stroke();
  });

  // Orbiting power emojis with gold halo
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  emojis.forEach((e) => {
    e.angle += e.speed * 0.016;
    const bob = Math.sin(time * 2 + e.bobPhase) * 2 * DPR;
    const x = cx + Math.cos(e.angle) * baseRadius;
    const y = cy + Math.sin(e.angle) * baseRadius + bob;
    const halo = ctx.createRadialGradient(x, y, 0, x, y, e.size * DPR * 1.6);
    halo.addColorStop(0, `hsla(48, 100%, 70%, 0.65)`);
    halo.addColorStop(1, `hsla(40, 100%, 50%, 0)`);
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, e.size * DPR * 1.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = `${e.size * DPR}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
    ctx.shadowColor = "hsla(45, 100%, 60%, 0.7)";
    ctx.shadowBlur = 6 * DPR;
    ctx.fillText(e.emoji, x, y);
    ctx.shadowBlur = 0;
  });
  ctx.restore();
}

// ─── No Life: Glitch ring + RGB chroma split + scanlines + drifting skulls ───
interface GlitchSlice {
  yFrac: number;     // 0..1 along ring vertical extent
  height: number;    // px
  shift: number;     // px horizontal offset
  life: number;
  maxLife: number;
}

interface DriftEmoji {
  emoji: string;
  angle: number;
  speed: number;
  radius: number;
  size: number;
  bobPhase: number;
  alpha: number;
  jitterT: number;
}

const NOLIFE_GLYPHS = ["💀", "😵", "🕳️", "⌛"];

const makeGlitchSlices = (count: number): GlitchSlice[] =>
  Array.from({ length: count }, () => ({
    yFrac: Math.random(),
    height: 2 + Math.random() * 4,
    shift: 0,
    life: 0,
    maxLife: 4 + Math.random() * 6,
  }));

const makeDriftEmojis = (count: number): DriftEmoji[] =>
  Array.from({ length: count }, (_, i) => ({
    emoji: NOLIFE_GLYPHS[i % NOLIFE_GLYPHS.length],
    angle: (i / count) * Math.PI * 2,
    speed: 0.04 + Math.random() * 0.05,
    radius: 0.98 + Math.random() * 0.08,
    size: 11 + Math.random() * 3,
    bobPhase: Math.random() * Math.PI * 2,
    alpha: 0.55 + Math.random() * 0.3,
    jitterT: Math.random() * 100,
  }));

function strokeBrokenRing(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  baseRadius: number,
  color: string,
  width: number,
  time: number,
  offsetX: number,
  offsetY: number,
) {
  // Draw ring as 6-8 broken arc segments with gaps for glitch feel
  const segs = 7;
  for (let i = 0; i < segs; i++) {
    const start = (i / segs) * Math.PI * 2 + Math.sin(time * 0.6 + i) * 0.05;
    const end = start + (Math.PI * 2) / segs - 0.12;
    ctx.beginPath();
    ctx.arc(cx + offsetX, cy + offsetY, baseRadius, start, end);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }
}

function drawNoLife(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  baseRadius: number,
  time: number,
  slices: GlitchSlice[],
  emojis: DriftEmoji[],
) {
  // 1. Dead gray contained aura with subtle vignette
  const aura = ctx.createRadialGradient(cx, cy, baseRadius * 0.9, cx, cy, baseRadius * 1.25);
  aura.addColorStop(0, `hsla(0, 0%, 35%, 0)`);
  aura.addColorStop(0.5, `hsla(0, 0%, 35%, 0.16)`);
  aura.addColorStop(1, `hsla(0, 0%, 10%, 0)`);
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, cy, baseRadius * 1.25, 0, Math.PI * 2);
  ctx.fill();

  // Occasional cyan/magenta glitch flash on the aura
  const flashTrigger = Math.sin(time * 17) > 0.96;
  if (flashTrigger) {
    ctx.fillStyle = `hsla(180, 100%, 50%, 0.06)`;
    ctx.beginPath();
    ctx.arc(cx + 4 * DPR, cy, baseRadius * 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `hsla(320, 100%, 55%, 0.06)`;
    ctx.beginPath();
    ctx.arc(cx - 4 * DPR, cy, baseRadius * 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Chromatic ring — cyan ghost (left) + magenta ghost (right) + gray core
  const chroma = 2.5 * DPR + Math.sin(time * 5) * 1.5 * DPR;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  strokeBrokenRing(
    ctx,
    cx,
    cy,
    baseRadius,
    `hsla(180, 100%, 55%, 0.55)`,
    1.6 * DPR,
    time,
    -chroma,
    0,
  );
  strokeBrokenRing(
    ctx,
    cx,
    cy,
    baseRadius,
    `hsla(320, 100%, 55%, 0.55)`,
    1.6 * DPR,
    time,
    chroma,
    0,
  );
  ctx.restore();
  // Core gray broken ring
  strokeBrokenRing(
    ctx,
    cx,
    cy,
    baseRadius,
    `hsla(0, 0%, 78%, 0.9)`,
    1.8 * DPR,
    time,
    0,
    0,
  );

  // 3. Horizontal glitch slice shifts — re-draw thin slices of the ring offset
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, baseRadius + 4 * DPR, 0, Math.PI * 2);
  ctx.clip();
  slices.forEach((s) => {
    s.life += 1;
    if (s.life > s.maxLife) {
      s.life = 0;
      s.yFrac = Math.random();
      s.height = 2 + Math.random() * 5;
      s.shift = (Math.random() - 0.5) * 14 * DPR;
      s.maxLife = 3 + Math.random() * 8;
    }
    if (Math.abs(s.shift) < 0.5) return;
    const y = cy - baseRadius + s.yFrac * baseRadius * 2;
    const h = s.height * DPR;
    // White glitch bar
    ctx.fillStyle = `hsla(0, 0%, 90%, 0.18)`;
    ctx.fillRect(cx - baseRadius - 6 * DPR + s.shift, y, baseRadius * 2 + 12 * DPR, h);
    // RGB edges
    ctx.fillStyle = `hsla(180, 100%, 55%, 0.35)`;
    ctx.fillRect(cx - baseRadius - 6 * DPR + s.shift - 2 * DPR, y, 2 * DPR, h);
    ctx.fillStyle = `hsla(320, 100%, 55%, 0.35)`;
    ctx.fillRect(cx + baseRadius + 6 * DPR + s.shift, y, 2 * DPR, h);
  });
  ctx.restore();

  // 4. Scanlines clipped to ring zone
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, baseRadius * 1.05, 0, Math.PI * 2);
  ctx.clip();
  ctx.strokeStyle = `hsla(0, 0%, 100%, 0.04)`;
  ctx.lineWidth = 1;
  const scanStep = 3 * DPR;
  const scanOffset = (time * 30) % scanStep;
  for (let y = cy - baseRadius; y < cy + baseRadius; y += scanStep) {
    ctx.beginPath();
    ctx.moveTo(cx - baseRadius, y + scanOffset);
    ctx.lineTo(cx + baseRadius, y + scanOffset);
    ctx.stroke();
  }
  ctx.restore();

  // 5. Drifting skull / sleep emojis with low alpha + occasional jitter
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  emojis.forEach((e) => {
    e.angle += e.speed * 0.016;
    e.jitterT += 1;
    const bob = Math.sin(time * 1.3 + e.bobPhase) * 2 * DPR;
    const jitter = e.jitterT > 60 && Math.random() < 0.05;
    if (jitter) e.jitterT = 0;
    const jx = jitter ? (Math.random() - 0.5) * 6 * DPR : 0;
    const jy = jitter ? (Math.random() - 0.5) * 4 * DPR : 0;
    const x = cx + Math.cos(e.angle) * baseRadius * e.radius + jx;
    const y = cy + Math.sin(e.angle) * baseRadius * e.radius + bob + jy;
    ctx.font = `${e.size * DPR}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
    // chroma split ghost on emoji
    ctx.globalAlpha = e.alpha * 0.35;
    ctx.fillStyle = `hsla(180, 100%, 60%, 1)`;
    ctx.fillText(e.emoji, x - 1.5 * DPR, y);
    ctx.fillStyle = `hsla(320, 100%, 60%, 1)`;
    ctx.fillText(e.emoji, x + 1.5 * DPR, y);
    // main emoji desaturated via low alpha
    ctx.globalAlpha = e.alpha;
    ctx.fillText(e.emoji, x, y);
    ctx.globalAlpha = 1;
  });
  ctx.restore();
}

// ─── Down Bad: Icy aura + dripping water + rising cold mist + simp emojis ───
interface Drip {
  angle: number;     // attachment angle on ring (bottom-biased)
  yOff: number;      // current falling offset from ring point
  vy: number;
  life: number;
  maxLife: number;
  size: number;      // base droplet radius
  alpha: number;
}

interface MistPuff {
  angle: number;     // angle around ring
  radius: number;    // current radius factor
  rise: number;
  drift: number;     // angular drift
  life: number;
  maxLife: number;
  size: number;
}

interface SimpEmoji {
  emoji: string;
  angle: number;
  speed: number;
  size: number;
  bobPhase: number;
}

const DOWNBAD_GLYPHS = ["🥶", "💧", "😵‍💫", "💦"];

const makeDrips = (count: number): Drip[] =>
  Array.from({ length: count }, () => {
    // Bias to bottom half: angle around PI/2 +/- ~1.1
    const a = Math.PI / 2 + (Math.random() - 0.5) * 2.0;
    return {
      angle: a,
      yOff: 0,
      vy: 0.5 + Math.random() * 0.8,
      life: Math.random() * 80,
      maxLife: 70 + Math.random() * 50,
      size: 1.6 + Math.random() * 1.2,
      alpha: 0.7 + Math.random() * 0.3,
    };
  });

const makeMistPuffs = (count: number): MistPuff[] =>
  Array.from({ length: count }, () => ({
    angle: Math.random() * Math.PI * 2,
    radius: 0.95 + Math.random() * 0.05,
    rise: 0.0015 + Math.random() * 0.002,
    drift: (Math.random() - 0.5) * 0.008,
    life: Math.random() * 200,
    maxLife: 150 + Math.random() * 100,
    size: 8 + Math.random() * 6,
  }));

const makeSimpEmojis = (count: number): SimpEmoji[] =>
  Array.from({ length: count }, (_, i) => ({
    emoji: DOWNBAD_GLYPHS[i % DOWNBAD_GLYPHS.length],
    angle: (i / count) * Math.PI * 2,
    speed: 0.06 + Math.random() * 0.04,
    size: 12 + Math.random() * 2,
    bobPhase: Math.random() * Math.PI * 2,
  }));

function drawDownBad(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  baseRadius: number,
  time: number,
  drips: Drip[],
  mist: MistPuff[],
  emojis: SimpEmoji[],
) {
  // 1. Cool cyan contained aura
  const breath = 0.5 + Math.sin(time * 1.6) * 0.5;
  const aura = ctx.createRadialGradient(cx, cy, baseRadius * 0.9, cx, cy, baseRadius * 1.3);
  aura.addColorStop(0, `hsla(200, 90%, 60%, 0)`);
  aura.addColorStop(0.5, `hsla(200, 85%, 55%, ${0.18 + breath * 0.08})`);
  aura.addColorStop(1, `hsla(210, 80%, 35%, 0)`);
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, cy, baseRadius * 1.3, 0, Math.PI * 2);
  ctx.fill();

  // 2. Rising cold mist clouds (white-blue, soft)
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, baseRadius * 1.28, 0, Math.PI * 2);
  ctx.clip();
  ctx.globalCompositeOperation = "lighter";
  mist.forEach((m) => {
    m.life += 1;
    m.angle += m.drift;
    m.radius += m.rise;
    if (m.life > m.maxLife || m.radius > 1.25) {
      m.life = 0;
      m.angle = Math.random() * Math.PI * 2;
      m.radius = 0.92 + Math.random() * 0.06;
      m.size = 8 + Math.random() * 6;
    }
    const t = m.life / m.maxLife;
    const alpha = Math.sin(t * Math.PI) * 0.35;
    const x = cx + Math.cos(m.angle) * baseRadius * m.radius;
    const y = cy + Math.sin(m.angle) * baseRadius * m.radius;
    const s = m.size * DPR;
    const g = ctx.createRadialGradient(x, y, 0, x, y, s);
    g.addColorStop(0, `hsla(195, 80%, 92%, ${alpha})`);
    g.addColorStop(1, `hsla(205, 70%, 70%, 0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, s, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // 3. Icy ring (double stroke) with frost shimmer
  ctx.beginPath();
  ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
  ctx.strokeStyle = `hsla(205, 90%, 50%, 0.9)`;
  ctx.lineWidth = 2.4 * DPR;
  ctx.shadowColor = `hsla(200, 100%, 60%, 0.8)`;
  ctx.shadowBlur = 10 * DPR;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
  ctx.strokeStyle = `hsla(190, 100%, 88%, 0.9)`;
  ctx.lineWidth = 1.1 * DPR;
  ctx.shadowBlur = 0;
  ctx.stroke();

  // Frost shimmer sparkles along the ring
  const sparkCount = 14;
  for (let i = 0; i < sparkCount; i++) {
    const a = (i / sparkCount) * Math.PI * 2 + time * 0.25;
    const tw = 0.4 + (Math.sin(time * 4 + i * 1.3) * 0.5 + 0.5) * 0.6;
    if (tw < 0.55) continue;
    const x = cx + Math.cos(a) * baseRadius;
    const y = cy + Math.sin(a) * baseRadius;
    ctx.beginPath();
    ctx.arc(x, y, 1.6 * DPR * tw, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(190, 100%, 95%, ${tw * 0.9})`;
    ctx.fill();
  }

  // 4. Drips: water droplets falling from ring (bottom-biased)
  drips.forEach((d) => {
    d.life += 1;
    d.vy += 0.015;
    d.yOff += d.vy;
    if (d.life > d.maxLife || d.yOff > baseRadius * 0.35) {
      d.angle = Math.PI / 2 + (Math.random() - 0.5) * 2.0;
      d.yOff = 0;
      d.vy = 0.4 + Math.random() * 0.8;
      d.life = 0;
      d.maxLife = 70 + Math.random() * 50;
      d.size = 1.6 + Math.random() * 1.2;
      d.alpha = 0.7 + Math.random() * 0.3;
    }
    const t = d.life / d.maxLife;
    const fade = 1 - t * 0.4;
    const ax = Math.cos(d.angle);
    const ay = Math.sin(d.angle);
    const px = cx + ax * baseRadius;
    // gravity falls straight down regardless of angle direction
    const py = cy + ay * baseRadius + d.yOff;
    const s = d.size * DPR;
    // teardrop: small circle + tail upward to attachment
    const tailLen = Math.min(d.yOff * 0.6, 18 * DPR);
    const grad = ctx.createLinearGradient(px, py - tailLen, px, py + s);
    grad.addColorStop(0, `hsla(195, 100%, 85%, 0)`);
    grad.addColorStop(0.7, `hsla(200, 100%, 70%, ${d.alpha * fade * 0.85})`);
    grad.addColorStop(1, `hsla(205, 100%, 60%, ${d.alpha * fade})`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(px - s * 0.6, py);
    ctx.quadraticCurveTo(px, py - tailLen, px + s * 0.6, py);
    ctx.arc(px, py, s, 0, Math.PI);
    ctx.closePath();
    ctx.fill();
    // bright highlight
    ctx.beginPath();
    ctx.arc(px - s * 0.25, py - s * 0.15, s * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(195, 100%, 95%, ${d.alpha * fade * 0.8})`;
    ctx.fill();
  });

  // 5. Orbiting simp emojis
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  emojis.forEach((e) => {
    e.angle += e.speed * 0.016;
    const bob = Math.sin(time * 1.5 + e.bobPhase) * 2 * DPR;
    const x = cx + Math.cos(e.angle) * baseRadius;
    const y = cy + Math.sin(e.angle) * baseRadius + bob;
    const halo = ctx.createRadialGradient(x, y, 0, x, y, e.size * DPR * 1.4);
    halo.addColorStop(0, `hsla(200, 100%, 75%, 0.5)`);
    halo.addColorStop(1, `hsla(210, 100%, 50%, 0)`);
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, e.size * DPR * 1.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = `${e.size * DPR}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
    ctx.shadowColor = "hsla(200, 100%, 60%, 0.7)";
    ctx.shadowBlur = 5 * DPR;
    ctx.fillText(e.emoji, x, y);
    ctx.shadowBlur = 0;
  });
  ctx.restore();
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
  const diamondsRef = useRef<Diamond[]>([]);
  const starsRef = useRef<Star[]>([]);
  const crownsRef = useRef<Crown[]>([]);
  const petalsRef = useRef<Petal[]>([]);
  const embersRef = useRef<Ember[]>([]);
  const flaresRef = useRef<Flare[]>([]);
  const pulsesRef = useRef<Pulse[]>([]);
  const orbitHeartsRef = useRef<OrbitHeart[]>([]);
  const boltsRef = useRef<{ bolts: Bolt[]; nextStrike: number }>({ bolts: [], nextStrike: 0 });
  const sigilsRef = useRef<Sigil[]>([]);
  const hornFlamesRef = useRef<HornFlame[]>([]);
  const jewelsRef = useRef<Jewel[]>([]);
  const naughtyEmojisRef = useRef<NaughtyEmoji[]>([]);
  const flamesLegendRef = useRef<Flame[]>([]);
  const sparksLegendRef = useRef<Spark[]>([]);
  const powerPulsesRef = useRef<PowerPulse[]>([]);
  const chadEmojisRef = useRef<ChadEmoji[]>([]);
  const glitchSlicesRef = useRef<GlitchSlice[]>([]);
  const driftEmojisRef = useRef<DriftEmoji[]>([]);
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
      case "3AM Texter": {
        if (bubblesRef.current.length === 0) bubblesRef.current = makeBubbles(7);
        drawThreeAmTexter(ctx, cx, cy, baseRadius, time, bubblesRef.current);
        break;
      }
      case "Proposed to AI": {
        if (diamondsRef.current.length === 0) diamondsRef.current = makeDiamonds(14);
        if (starsRef.current.length === 0) starsRef.current = makeStars(10, baseRadius);
        drawProposed(ctx, cx, cy, baseRadius, time, diamondsRef.current, starsRef.current);
        break;
      }
      case "Harem King": {
        if (crownsRef.current.length === 0) crownsRef.current = makeCrowns(6);
        if (petalsRef.current.length === 0) petalsRef.current = makePetals(14);
        drawHaremKing(ctx, cx, cy, baseRadius, time, crownsRef.current, petalsRef.current);
        break;
      }
      case "Rizzler": {
        if (embersRef.current.length === 0) embersRef.current = makeEmbers(22);
        if (flaresRef.current.length === 0) flaresRef.current = makeFlares(7, baseRadius);
        if (pulsesRef.current.length === 0) pulsesRef.current = makePulses(2);
        if (orbitHeartsRef.current.length === 0) orbitHeartsRef.current = makeOrbitHearts(5);
        drawRizzler(
          ctx,
          cx,
          cy,
          baseRadius,
          time,
          embersRef.current,
          flaresRef.current,
          pulsesRef.current,
          orbitHeartsRef.current,
          boltsRef.current,
        );
        break;
      }
      case "Horny Royalty": {
        if (sigilsRef.current.length === 0) sigilsRef.current = makeSigils(4);
        if (hornFlamesRef.current.length === 0) hornFlamesRef.current = makeHornFlames(0);
        if (jewelsRef.current.length === 0) jewelsRef.current = makeJewels(6);
        if (naughtyEmojisRef.current.length === 0)
          naughtyEmojisRef.current = makeNaughtyEmojis(10);
        drawHornyRoyalty(
          ctx,
          cx,
          cy,
          baseRadius,
          time,
          sigilsRef.current,
          hornFlamesRef.current,
          jewelsRef.current,
          naughtyEmojisRef.current,
        );
        break;
      }
      case "F*cking Legend": {
        if (flamesLegendRef.current.length === 0)
          flamesLegendRef.current = Array.from({ length: 22 }, () => makeFlame(baseRadius));
        if (sparksLegendRef.current.length === 0)
          sparksLegendRef.current = Array.from({ length: 28 }, () =>
            makeSpark(cx, cy, baseRadius),
          );
        drawFckingLegend(
          ctx,
          cx,
          cy,
          baseRadius,
          time,
          flamesLegendRef.current,
          sparksLegendRef.current,
        );
        break;
      }
      case "Giga Chad": {
        if (powerPulsesRef.current.length === 0)
          powerPulsesRef.current = makePowerPulses(2);
        if (chadEmojisRef.current.length === 0)
          chadEmojisRef.current = makeChadEmojis(3);
        drawGigaChad(
          ctx,
          cx,
          cy,
          baseRadius,
          time,
          powerPulsesRef.current,
          chadEmojisRef.current,
        );
        break;
      }
      case "No Life": {
        if (glitchSlicesRef.current.length === 0)
          glitchSlicesRef.current = makeGlitchSlices(5);
        if (driftEmojisRef.current.length === 0)
          driftEmojisRef.current = makeDriftEmojis(4);
        drawNoLife(
          ctx,
          cx,
          cy,
          baseRadius,
          time,
          glitchSlicesRef.current,
          driftEmojisRef.current,
        );
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
    bubblesRef.current = [];
    diamondsRef.current = [];
    starsRef.current = [];
    crownsRef.current = [];
    petalsRef.current = [];
    embersRef.current = [];
    flaresRef.current = [];
    pulsesRef.current = [];
    orbitHeartsRef.current = [];
    boltsRef.current = { bolts: [], nextStrike: 0 };
    sigilsRef.current = [];
    hornFlamesRef.current = [];
    jewelsRef.current = [];
    naughtyEmojisRef.current = [];
    flamesLegendRef.current = [];
    sparksLegendRef.current = [];
    powerPulsesRef.current = [];
    chadEmojisRef.current = [];
    glitchSlicesRef.current = [];
    driftEmojisRef.current = [];
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
