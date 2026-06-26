import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

// Short expressive vocal SFX prompts — soft, feminine, ambient.
// Kept generic ("young woman") so ElevenLabs reliably renders a female timbre.
const PROMPTS = [
  "soft female sigh, gentle relaxed exhale, intimate close-mic",
  "young woman humming a short cheerful melody, lips closed, soft",
  "young woman whistling a short playful tune, breathy",
  "soft inhale through nose, young woman, calm and quiet",
  "young woman gentle giggle, brief and warm",
  "soft yawn from a young woman, relaxed and sleepy",
  "young woman taking a slow deep breath in and out, calm",
  "young woman quiet 'mhm' acknowledgement, soft and warm",
  "young woman blowing a soft kiss, single short sound",
  "young woman whistles two playful notes, breathy",
  "young woman soft thoughtful 'hmm', curious",
  "young woman quiet chuckle under her breath",
];

interface Props {
  /** Pause cycling while the character is talking. */
  speaking?: boolean;
  /** Master gain 0..1. */
  volume?: number;
  /** Disable entirely. */
  enabled?: boolean;
}

// In-memory cache of generated clips keyed by prompt so we don't regenerate
// every cycle. Survives navigation within the SPA session.
const blobCache = new Map<string, string>();
const inflight = new Map<string, Promise<string>>();

async function fetchClip(prompt: string, duration: number): Promise<string> {
  const key = `${prompt}::${duration}`;
  const cached = blobCache.get(key);
  if (cached) return cached;
  const existing = inflight.get(key);
  if (existing) return existing;
  const p = (async () => {
    const { data, error } = await supabase.functions.invoke("mina-ambient-sfx", {
      body: { prompt, duration },
    });
    if (error) throw error;
    const blob = data instanceof Blob ? data : new Blob([data as ArrayBuffer], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    blobCache.set(key, url);
    return url;
  })();
  inflight.set(key, p);
  try { return await p; } finally { inflight.delete(key); }
}

const AmbientSounds = ({ speaking = false, volume = 0.35, enabled = true }: Props) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const lastIdxRef = useRef<number>(-1);
  const speakingRef = useRef(speaking);
  const enabledRef = useRef(enabled);
  useEffect(() => { speakingRef.current = speaking; }, [speaking]);
  useEffect(() => { enabledRef.current = enabled; }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const audio = new Audio();
    audio.volume = Math.max(0, Math.min(1, volume));
    audioRef.current = audio;

    const pickNext = () => {
      let idx = Math.floor(Math.random() * PROMPTS.length);
      if (idx === lastIdxRef.current) idx = (idx + 1) % PROMPTS.length;
      lastIdxRef.current = idx;
      return PROMPTS[idx];
    };

    const schedule = (ms: number) => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(playOne, ms);
    };

    const playOne = async () => {
      if (cancelled) return;
      if (speakingRef.current || !enabledRef.current) {
        schedule(8000);
        return;
      }
      const prompt = pickNext();
      const duration = 3 + Math.floor(Math.random() * 4); // 3–6s
      try {
        const url = await fetchClip(prompt, duration);
        if (cancelled) return;
        if (speakingRef.current) { schedule(6000); return; }
        audio.src = url;
        audio.currentTime = 0;
        await audio.play().catch(() => { /* autoplay blocked — try again later */ });
      } catch (e) {
        console.warn("[ambient-sfx]", e);
      }
      // Next ambient sound 18–35s later.
      schedule(18000 + Math.random() * 17000);
    };

    // First sound after a brief settle so the page loads quietly.
    schedule(6000 + Math.random() * 6000);

    return () => {
      cancelled = true;
      if (timerRef.current) window.clearTimeout(timerRef.current);
      try { audio.pause(); } catch {}
      audioRef.current = null;
    };
  }, [enabled, volume]);

  // Mute mid-clip if speaking starts.
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (speaking && !a.paused) {
      try { a.pause(); } catch {}
    }
  }, [speaking]);

  return null;
};

export default AmbientSounds;
