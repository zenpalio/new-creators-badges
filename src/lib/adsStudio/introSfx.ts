// Generate a short UI "click" SFX for the intro button press as a WAV Uint8Array.
// Kept intentionally tiny and punchy — no music, no whoosh.

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

// Click at ~2.07s (frame 62 @ 30fps = button press moment).
// Total length matches full intro duration (3s) so ffmpeg timing lines up.
export function generateIntroSfxWav(): Uint8Array {
  const durSec = 3.0;
  const total = Math.floor(SR * durSec);
  const out = new Float32Array(total);

  const clickStart = Math.floor(SR * 2.07);
  const clickLen = Math.floor(SR * 0.09); // 90ms
  for (let i = 0; i < clickLen; i++) {
    const t = i / clickLen;
    // High-pitched blip: 1800Hz sine + a bit of noise, sharp exp decay
    const freq = 1800 - 600 * t;
    const phase = (2 * Math.PI * freq * i) / SR;
    const noise = (Math.random() * 2 - 1) * 0.15;
    const env = Math.pow(1 - t, 3) * (i < SR * 0.002 ? i / (SR * 0.002) : 1);
    const idx = clickStart + i;
    if (idx < total) out[idx] = (Math.sin(phase) + noise) * env * 0.7;
  }

  return encodeWAV(out);
}
