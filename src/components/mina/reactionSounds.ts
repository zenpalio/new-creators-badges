// Lightweight WebAudio-synthesized SFX for ReactionFX bursts.
// No external assets — pure oscillators/noise for instant playback.

let ctx: AudioContext | null = null;
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext | undefined;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function master(gain = 0.25): { ac: AudioContext; out: GainNode } | null {
  const ac = getCtx();
  if (!ac) return null;
  const out = ac.createGain();
  out.gain.value = gain;
  out.connect(ac.destination);
  return { ac, out };
}

function blip(freq: number, dur: number, type: OscillatorType, delay = 0, vol = 0.5) {
  const m = master(0.3);
  if (!m) return;
  const { ac, out } = m;
  const t0 = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 1.8), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(out);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function noiseBurst(dur: number, delay = 0, vol = 0.4, filterFreq = 1800, type: BiquadFilterType = "bandpass") {
  const m = master(0.35);
  if (!m) return;
  const { ac, out } = m;
  const t0 = ac.currentTime + delay;
  const buf = ac.createBuffer(1, Math.ceil(ac.sampleRate * dur), ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = ac.createBufferSource();
  src.buffer = buf;
  const filt = ac.createBiquadFilter();
  filt.type = type;
  filt.frequency.value = filterFreq;
  filt.Q.value = 1.2;
  const g = ac.createGain();
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(filt).connect(g).connect(out);
  src.start(t0);
  src.stop(t0 + dur + 0.05);
}

/** Confetti pop — cheerful ascending pops + sparkle noise. For love/like. */
export function playConfettiPop() {
  const notes = [523, 659, 784, 1046]; // C5 E5 G5 C6
  notes.forEach((f, i) => blip(f, 0.18, "triangle", i * 0.06, 0.32));
  noiseBurst(0.12, 0, 0.18, 4500, "highpass");
  noiseBurst(0.18, 0.08, 0.12, 6000, "highpass");
}

/** Plumbob ding — clean bell-like chime. For neutral / generic. */
export function playPlumbobDing() {
  const m = master(0.32);
  if (!m) return;
  const { ac, out } = m;
  const t0 = ac.currentTime;
  const partials = [
    { f: 880, v: 0.4, d: 0.9 },
    { f: 1320, v: 0.22, d: 0.7 },
    { f: 1760, v: 0.14, d: 0.5 },
  ];
  partials.forEach((p) => {
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = "sine";
    osc.frequency.value = p.f;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(p.v, t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + p.d);
    osc.connect(g).connect(out);
    osc.start(t0);
    osc.stop(t0 + p.d + 0.05);
  });
  noiseBurst(0.05, 0, 0.1, 8000, "highpass");
}

/** Angry roar — low growl with noise rumble. For hate/dislike. */
export function playAngryRoar() {
  const m = master(0.4);
  if (!m) return;
  const { ac, out } = m;
  const t0 = ac.currentTime;
  // Sawtooth growl that descends
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(180, t0);
  osc.frequency.exponentialRampToValueAtTime(70, t0 + 0.6);
  const filt = ac.createBiquadFilter();
  filt.type = "lowpass";
  filt.frequency.setValueAtTime(900, t0);
  filt.frequency.exponentialRampToValueAtTime(300, t0 + 0.6);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(0.45, t0 + 0.04);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.7);
  osc.connect(filt).connect(g).connect(out);
  osc.start(t0);
  osc.stop(t0 + 0.75);
  // Rumble noise layer
  noiseBurst(0.55, 0, 0.35, 280, "lowpass");
  // Sharp thump at start
  blip(120, 0.15, "square", 0, 0.3);
}

import type { Sentiment } from "./ChatComposer";

export function playReactionSound(sentiment: Sentiment) {
  switch (sentiment) {
    case "love":
    case "like":
      playConfettiPop();
      break;
    case "hate":
    case "dislike":
      playAngryRoar();
      break;
    default:
      playPlumbobDing();
  }
}
