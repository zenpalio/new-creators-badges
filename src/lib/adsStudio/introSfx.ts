// Generate intro SFX (whoosh + sub-bass thump) into a WAV Uint8Array using WebAudio.
// This avoids relying on ffmpeg lavfi sources (anoisesrc/sine) which are
// hit-or-miss depending on the wasm build.

const SR = 44100;

function encodeWAV(samples: Float32Array): Uint8Array {
  const numChannels = 1;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = SR * blockAlign;
  const dataSize = samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  const writeString = (o: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i));
  };
  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, SR, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bytesPerSample, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }
  return new Uint8Array(buffer);
}

export function generateIntroSfxWav(): Uint8Array {
  const durSec = 1.6;
  const total = Math.floor(SR * durSec);
  const out = new Float32Array(total);

  // --- Whoosh: filtered pink-ish noise, 0 → 0.5s, with fade in/out ---
  const whooshLen = Math.floor(SR * 0.5);
  let lp = 0;
  let hp = 0;
  for (let i = 0; i < whooshLen; i++) {
    const noise = Math.random() * 2 - 1;
    // 1-pole low-pass then high-pass to shape into a mid whoosh band
    lp += (noise - lp) * 0.35; // low-pass ~ few kHz
    const bandpassed = noise - (hp += (lp - hp) * 0.05); // subtract slow-moving avg
    const t = i / whooshLen;
    const env =
      Math.min(1, t / 0.05) * // 50ms fade-in
      Math.min(1, (1 - t) / 0.3); // 150ms fade-out (last 30%)
    out[i] += bandpassed * env * 0.55;
  }

  // --- Sub-bass thump around 1.05s (button press) ---
  const thumpStart = Math.floor(SR * 1.05);
  const thumpLen = Math.floor(SR * 0.28);
  for (let i = 0; i < thumpLen; i++) {
    const t = i / thumpLen;
    // Pitch drops from 110Hz → 55Hz for punch
    const freq = 110 - 55 * t;
    const phase = (2 * Math.PI * freq * i) / SR;
    // Sharp attack, exp decay
    const env = Math.pow(1 - t, 2.2) * (i < SR * 0.005 ? i / (SR * 0.005) : 1);
    const idx = thumpStart + i;
    if (idx < total) out[idx] += Math.sin(phase) * env * 0.95;
  }

  return encodeWAV(out);
}
