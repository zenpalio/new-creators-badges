import { useEffect, useRef, useState } from "react";
import { SkipForward, ChevronLeft, ChevronRight } from "lucide-react";
import img1 from "@/assets/saga-anna-car-1.jpg";
import img2 from "@/assets/saga-anna-car-2.jpg";
import img3 from "@/assets/saga-anna-car-3.jpg";
import img4 from "@/assets/saga-anna-car-4.jpg";
import audio1 from "@/assets/saga-anna-car-1.mp3.asset.json";
import audio2 from "@/assets/saga-anna-car-2.mp3.asset.json";
import audio3 from "@/assets/saga-anna-car-3.mp3.asset.json";
import audio4 from "@/assets/saga-anna-car-4.mp3.asset.json";

type Scene = { img: string; audio: string; text: string; kb: string };

const SCENES: Scene[] = [
  { img: img1, audio: audio1.url, text: "Hey! Over here — get in the truck, now!", kb: "kb-a" },
  { img: img2, audio: audio2.url, text: "Move! Move! They're right behind you — come on!", kb: "kb-b" },
  { img: img3, audio: audio3.url, text: "Give me your hand. Quickly!", kb: "kb-c" },
  { img: img4, audio: audio4.url, text: "Buckle up. We're getting the hell out of here.", kb: "kb-d" },
];

export default function SagaAnnaCar({ onComplete }: { onComplete: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [idx, setIdx] = useState(0);
  const [started, setStarted] = useState(false);

  const playCurrent = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      a.currentTime = 0;
      await a.play();
      setStarted(true);
    } catch { /* user gesture required */ }
  };

  useEffect(() => {
    if (started) playCurrent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  const goPrev = () => { if (idx > 0) setIdx(idx - 1); };
  const goNext = () => {
    if (idx >= SCENES.length - 1) {
      try { audioRef.current?.pause(); } catch {}
      onComplete();
    } else setIdx(idx + 1);
  };

  const scene = SCENES[idx];

  return (
    <div className="absolute inset-0 z-40 bg-black flex flex-col animate-fade-in overflow-hidden">
      {/* Background images cross-fade */}
      {SCENES.map((s, i) => (
        <img
          key={i}
          src={s.img}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: i === idx ? 1 : 0,
            transition: "opacity 900ms ease-out",
            transform: "scale(1.06)",
            animation: i === idx ? `${s.kb} 12s ease-out forwards` : undefined,
            filter: "contrast(1.05) saturate(1.02)",
          }}
        />
      ))}

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0.9) 100%)",
          animation: "saga-vignette-pulse 6s ease-in-out infinite",
        }}
      />

      {/* Bottom scrim */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Ember tint */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 60%, hsl(22 90% 45% / 0.25), transparent 70%)",
          animation: "saga-flicker 3.2s ease-in-out infinite",
        }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.14] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")",
          animation: "saga-grain 0.8s steps(6) infinite",
        }}
      />

      <style>{`
        @keyframes kb-a { from { transform: scale(1.06) translate(0,0); } to { transform: scale(1.18) translate(-2%, -2%); } }
        @keyframes kb-b { from { transform: scale(1.18) translate(2%, 1%); } to { transform: scale(1.06) translate(0, 0); } }
        @keyframes kb-c { from { transform: scale(1.05) translate(1%, -1%); } to { transform: scale(1.16) translate(-2%, 2%); } }
        @keyframes kb-d { from { transform: scale(1.15) translate(-1%, 2%); } to { transform: scale(1.05) translate(2%, -1%); } }
        @keyframes anna-line-in {
          from { opacity: 0; transform: translateY(10px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0);   }
        }
      `}</style>

      {/* Top bar */}
      <div className="relative z-30 pt-8 px-5 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-primary-v2/30 bg-primary-v2/10 backdrop-blur">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-v2 animate-pulse" />
          <span className="text-[9px] uppercase tracking-[0.3em] text-primary-v2 font-medium">
            Anna · Rescue
          </span>
        </div>
        <button
          onClick={() => { try { audioRef.current?.pause(); } catch {}; onComplete(); }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/15 text-[10px] uppercase tracking-[0.25em] text-white/80 hover:bg-white/[0.15] transition"
        >
          Skip <SkipForward className="w-3 h-3" />
        </button>
      </div>

      {/* Bottom content */}
      <div className="relative z-30 mt-auto px-6 pb-20 w-full">
        <div className="mx-auto max-w-[360px] min-h-[140px] flex items-end justify-center">
          <p
            key={idx}
            className="text-center text-foreground-v2 text-[17px] leading-[1.45] font-medium"
            style={{
              animation: "anna-line-in 0.6s cubic-bezier(0.16,1,0.3,1) both",
              textShadow: "0 2px 20px hsl(var(--background)/0.9), 0 0 12px hsl(var(--background)/0.6)",
            }}
          >
            "{scene.text}"
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-1.5">
          {SCENES.map((_, i) => (
            <span
              key={i}
              className="h-[2px] rounded-full transition-all duration-500"
              style={{
                width: i === idx ? 22 : 8,
                background: i <= idx ? "hsl(var(--primary-v2))" : "hsl(var(--foreground-v2)/0.2)",
              }}
            />
          ))}
        </div>

        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={goPrev}
            disabled={idx === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/15 text-[10px] uppercase tracking-[0.25em] text-white/85 hover:bg-white/[0.15] transition disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back
          </button>
          <button
            onClick={goNext}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary-v2/90 text-primary-v2-foreground text-[10px] font-semibold uppercase tracking-[0.25em] hover:bg-primary-v2 transition"
          >
            {idx >= SCENES.length - 1 ? "Enter" : "Next"} <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={scene.audio}
        onEnded={goNext}
        preload="auto"
      />

      {!started && (
        <button
          onClick={playCurrent}
          className="absolute inset-0 z-30 flex items-center justify-center bg-background/40 backdrop-blur-sm"
        >
          <span className="px-5 py-2.5 rounded-full bg-primary-v2 text-primary-v2-foreground text-[11px] font-semibold uppercase tracking-[0.2em]">
            Tap to begin
          </span>
        </button>
      )}
    </div>
  );
}
