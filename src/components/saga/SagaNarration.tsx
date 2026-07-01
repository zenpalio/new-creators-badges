import { useEffect, useMemo, useRef, useState } from "react";
import { SkipForward } from "lucide-react";
import narrationAsset from "@/assets/saga-narration-1.mp3.asset.json";
import img1 from "@/assets/saga-narr-1.jpg";
import img2 from "@/assets/saga-narr-2.jpg";
import img3 from "@/assets/saga-narr-3.jpg";
import img4 from "@/assets/saga-narr-4.jpg";

type Line = { t: number; text: string; img: number };

// Timings hand-tuned to ~52.4s narration
const LINES: Line[] = [
  { t: 0.0,  text: "Months passed. The dust settled. The silence stayed.", img: 0 },
  { t: 5.0,  text: "The world you knew is gone — replaced by something rawer, stranger, and far more dangerous.", img: 0 },
  { t: 12.0, text: "Radiation did what the bombs couldn't finish. It changed things.", img: 1 },
  { t: 17.5, text: "Animals that once ran from men now hunt them.", img: 1 },
  { t: 21.5, text: "People who survived the blast didn't always survive what came after — what the fallout made them into.", img: 1 },
  { t: 29.5, text: "Most men are dead. The few that remain fight over whatever's left.", img: 2 },
  { t: 35.0, text: "You are one of the few.", img: 2 },
  { t: 37.5, text: "Out here, every choice has a cost. Every decision shapes who you become.", img: 2 },
  { t: 43.5, text: "The shelter gives you safety — but the world outside will test you.", img: 3 },
  { t: 48.0, text: "The question isn't whether you'll survive. It's what kind of person you'll be when you do.", img: 3 },
];

const IMAGES = [img1, img2, img3, img4];

export default function SagaNarration({ onComplete }: { onComplete: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [idx, setIdx] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.play().then(() => setStarted(true)).catch(() => setStarted(false));
  }, []);

  const onTime = () => {
    const a = audioRef.current;
    if (!a) return;
    const t = a.currentTime;
    let next = 0;
    for (let i = 0; i < LINES.length; i++) if (t >= LINES[i].t) next = i;
    if (next !== idx) setIdx(next);
  };

  const currentImg = useMemo(() => LINES[idx]?.img ?? 0, [idx]);

  return (
    <div className="absolute inset-0 z-40 bg-background flex flex-col animate-fade-in overflow-hidden">
      {/* Cross-faded background images */}
      {IMAGES.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1400ms] ease-out"
          style={{
            opacity: currentImg === i ? 1 : 0,
            transform: "scale(1.08)",
            animation: currentImg === i ? "saga-narr-drift 12s ease-out forwards" : undefined,
            filter: "brightness(0.55) contrast(1.05) saturate(0.9)",
          }}
        />
      ))}

      {/* Scrim for legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--background)/0.55) 0%, hsl(var(--background)/0.25) 30%, hsl(var(--background)/0.55) 65%, hsl(var(--background)/0.95) 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% 78%, hsl(var(--background)/0.85) 0%, transparent 70%)",
        }}
      />
      {/* Blue tint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, hsl(var(--primary-v2)/0.1), transparent 70%)",
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
        @keyframes saga-narr-drift {
          from { transform: scale(1.05) translateY(0); }
          to   { transform: scale(1.15) translateY(-2%); }
        }
        @keyframes saga-line-in {
          from { opacity: 0; transform: translateY(10px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0);   }
        }
      `}</style>

      {/* Top eyebrow */}
      <div className="relative z-10 pt-5 px-5 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-primary-v2/30 bg-primary-v2/10 backdrop-blur">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-v2 animate-pulse" />
          <span className="text-[9px] uppercase tracking-[0.3em] text-primary-v2 font-medium">
            Prologue
          </span>
        </div>
        <button
          onClick={onComplete}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/15 text-[10px] uppercase tracking-[0.25em] text-white/80 hover:bg-white/[0.15] transition"
        >
          Skip <SkipForward className="w-3 h-3" />
        </button>
      </div>

      {/* Subtitle — anchored lower third */}
      <div className="relative z-10 mt-auto px-6 pb-16 w-full">
        <div className="mx-auto max-w-[360px] min-h-[140px] flex items-end justify-center">
          <p
            key={idx}
            className="text-center text-foreground-v2 text-[17px] leading-[1.45] font-medium"
            style={{
              animation: "saga-line-in 0.6s cubic-bezier(0.16,1,0.3,1) both",
              textShadow: "0 2px 20px hsl(var(--background)/0.9), 0 0 12px hsl(var(--background)/0.6)",
            }}
          >
            {LINES[idx].text}
          </p>
        </div>

        {/* Progress dots */}
        <div className="mt-6 flex items-center justify-center gap-1.5">
          {LINES.map((_, i) => (
            <span
              key={i}
              className="h-[2px] rounded-full transition-all duration-500"
              style={{
                width: i === idx ? 22 : 10,
                background: i <= idx ? "hsl(var(--primary-v2))" : "hsl(var(--foreground-v2)/0.2)",
              }}
            />
          ))}
        </div>
      </div>

      <audio
        ref={audioRef}
        src={narrationAsset.url}
        onTimeUpdate={onTime}
        onEnded={onComplete}
        preload="auto"
      />

      {!started && (
        <button
          onClick={() => audioRef.current?.play().then(() => setStarted(true)).catch(() => {})}
          className="absolute inset-0 z-20 flex items-center justify-center bg-background/40 backdrop-blur-sm"
        >
          <span className="px-5 py-2.5 rounded-full bg-primary-v2 text-primary-v2-foreground text-[11px] font-semibold uppercase tracking-[0.2em]">
            Tap to begin
          </span>
        </button>
      )}
    </div>
  );
}
