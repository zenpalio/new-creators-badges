import { useEffect, useRef, useState } from "react";
import { SkipForward } from "lucide-react";
import narrAsset from "@/assets/vn/haven7-narration.mp3.asset.json";
import meiShot from "@/assets/vn/h7-mei-shelter-tour.jpg.asset.json";
import abbyShot from "@/assets/vn/h7-abby-intro.jpg.asset.json";
import cleoShot from "@/assets/vn/h7-cleo-intro.jpg.asset.json";

type Line = { t: number; text: string; img: 0 | 1 | 2 };

// Timed to the ~40.7s Adam narration
const LINES: Line[] = [
  { t: 0.0,  text: "Haven Seven. Deep beneath the wasteland — behind blast doors sealed against the poisoned wind.", img: 0 },
  { t: 8.5,  text: "Mei brings you inside. The air is warmer here, thick with dust and old wiring.",                img: 0 },
  { t: 15.0, text: "In the common room, two more survivors are waiting.",                                          img: 1 },
  { t: 18.5, text: "Abby — blonde, sharp-eyed, arms already folded. She doesn't trust strangers, and she won't pretend to.", img: 1 },
  { t: 26.5, text: "And Cleo — purple hair, half a smile, half a warning. The kind of welcome that could go either way.",     img: 2 },
  { t: 33.5, text: "Three girls. One shelter. Every choice from here decides which of them lets you stay.",       img: 2 },
];

const IMAGES = [meiShot.url, abbyShot.url, cleoShot.url] as const;
const NAMES = ["Mei", "Abby", "Cleo"] as const;

export default function SagaHaven7Intro({ onComplete }: { onComplete: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [idx, setIdx] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    audioRef.current?.play().then(() => setStarted(true)).catch(() => setStarted(false));
  }, []);

  const onTime = () => {
    const a = audioRef.current;
    if (!a) return;
    const t = a.currentTime;
    let next = 0;
    for (let i = 0; i < LINES.length; i++) if (t >= LINES[i].t) next = i;
    if (next !== idx) setIdx(next);
  };

  const currentImg = LINES[idx]?.img ?? 0;

  return (
    <div className="absolute inset-0 z-[60] bg-black flex flex-col animate-fade-in overflow-hidden">
      {IMAGES.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-out"
          style={{
            opacity: currentImg === i ? 1 : 0,
            transform: "scale(1.06)",
            animation: currentImg === i ? "saga-h7-drift 14s ease-out forwards" : undefined,
            filter: "brightness(0.72) contrast(1.05) saturate(1.05)",
          }}
        />
      ))}

      {/* Scrim */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.55) 62%, rgba(0,0,0,0.96) 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 45% at 50% 80%, rgba(0,0,0,0.85) 0%, transparent 70%), radial-gradient(ellipse 55% 40% at 50% 50%, hsl(var(--primary-v2)/0.10), transparent 70%)",
        }}
      />
      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")",
        }}
      />

      <style>{`
        @keyframes saga-h7-drift {
          from { transform: scale(1.04) translateY(0); }
          to   { transform: scale(1.14) translateY(-2%); }
        }
        @keyframes saga-h7-line-in {
          from { opacity: 0; transform: translateY(10px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0);   }
        }
      `}</style>

      {/* Header */}
      <div className="relative z-10 pt-5 px-5 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-primary-v2/30 bg-primary-v2/10 backdrop-blur">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-v2 animate-pulse" />
          <span className="text-[9px] uppercase tracking-[0.3em] text-primary-v2 font-medium">
            Haven-7 · Meet the shelter
          </span>
        </div>
        <button
          onClick={onComplete}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/15 text-[10px] uppercase tracking-[0.25em] text-white/80 hover:bg-white/[0.15] transition"
        >
          Skip <SkipForward className="w-3 h-3" />
        </button>
      </div>

      {/* Name chip */}
      <div className="relative z-10 mt-4 px-6">
        <div
          key={`name-${currentImg}`}
          className="mx-auto max-w-[360px] text-center"
          style={{ animation: "saga-h7-line-in 0.5s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <span className="inline-block text-[11px] uppercase tracking-[0.35em] text-white/75 font-semibold">
            {NAMES[currentImg]}
          </span>
        </div>
      </div>

      {/* Subtitle */}
      <div className="relative z-10 mt-auto px-6 pb-16 w-full">
        <div className="mx-auto max-w-[360px] min-h-[150px] flex items-end justify-center">
          <p
            key={idx}
            className="text-center text-foreground-v2 text-[17px] leading-[1.45] font-medium"
            style={{
              animation: "saga-h7-line-in 0.6s cubic-bezier(0.16,1,0.3,1) both",
              textShadow: "0 2px 20px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.6)",
            }}
          >
            {LINES[idx].text}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-1.5">
          {LINES.map((_, i) => (
            <span
              key={i}
              className="h-[2px] rounded-full transition-all duration-500"
              style={{
                width: i === idx ? 22 : 10,
                background: i <= idx ? "hsl(var(--primary-v2))" : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>
      </div>

      <audio
        ref={audioRef}
        src={narrAsset.url}
        onTimeUpdate={onTime}
        onEnded={onComplete}
        preload="auto"
      />

      {!started && (
        <button
          onClick={() => audioRef.current?.play().then(() => setStarted(true)).catch(() => {})}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <span className="px-5 py-2.5 rounded-full bg-primary-v2 text-primary-v2-foreground text-[11px] font-semibold uppercase tracking-[0.2em]">
            Tap to enter Haven-7
          </span>
        </button>
      )}
    </div>
  );
}
