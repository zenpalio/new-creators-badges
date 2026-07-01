import { useEffect, useMemo, useRef, useState } from "react";
import { SkipForward } from "lucide-react";
import narrationAsset from "@/assets/saga-narration-2.mp3.asset.json";
import img1 from "@/assets/saga-pov-1.jpg";
import img2 from "@/assets/saga-pov-2.jpg";
import img3 from "@/assets/saga-pov-3.jpg";
import img4 from "@/assets/saga-pov-4.jpg";
import img5 from "@/assets/saga-pov-5.jpg";
import img6 from "@/assets/saga-pov-6.jpg";

type Line = { t: number; text: string; img: number };

// Timings aligned to the ~55.6s ElevenLabs narration; proportional to line length.
const LINES: Line[] = [
  { t: 0.0,  text: "You step out. Boots crush glass.",                                img: 0 },
  { t: 2.55, text: "The city is a corpse — hollow towers, ash for snow.",             img: 0 },
  { t: 6.61, text: "Every breath tastes like rust and smoke.",                        img: 0 },

  { t: 9.88, text: "Then — a sound. Wet. Heavy.",                                     img: 1 },
  { t: 12.03,text: "It rises from behind a burnt-out truck.",                         img: 1 },
  { t: 15.13,text: "A bear. But wrong. Four eyes. Ribs bared.",                       img: 1 },
  { t: 18.40,text: "It sees you.",                                                    img: 1 },

  { t: 19.36,text: "Run.",                                                            img: 2 },
  { t: 19.90,text: "Legs burning. Lungs on fire.",                                    img: 2 },
  { t: 21.90,text: "The pavement blurs — you don't look back.",                       img: 2 },

  { t: 25.17,text: "A shadow eclipses the sun.",                                      img: 3 },
  { t: 27.24,text: "Wings — enormous, tattered, screaming down from the sky.",        img: 3 },
  { t: 31.70,text: "The eagle slams into the bear like a meteor.",                    img: 3 },

  { t: 35.21,text: "Bone cracks. Feathers, fur, blood.",                              img: 4 },
  { t: 37.91,text: "The street shakes. Buildings groan.",                             img: 4 },
  { t: 40.70,text: "Two nightmares tearing each other apart.",                        img: 4 },

  { t: 43.89,text: "You keep running.",                                               img: 5 },
  { t: 45.24,text: "Headlights cut through the dust ahead.",                          img: 5 },
  { t: 48.27,text: "An armored car — engine howling, coming fast.",                   img: 5 },
  { t: 51.85,text: "You reach out. Someone inside is reaching back.",                 img: 5 },
];

const IMAGES = [img1, img2, img3, img4, img5, img6];

export default function SagaNarration2({ onComplete }: { onComplete: () => void }) {
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
  const line = LINES[idx];

  return (
    <div className="absolute inset-0 z-40 bg-background flex flex-col animate-fade-in overflow-hidden">
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
            animation: currentImg === i ? "saga-narr2-drift 12s ease-out forwards" : undefined,
            filter: "brightness(0.6) contrast(1.08) saturate(0.95)",
          }}
        />
      ))}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--background)/0.55) 0%, hsl(var(--background)/0.2) 30%, hsl(var(--background)/0.55) 65%, hsl(var(--background)/0.95) 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% 80%, hsl(var(--background)/0.85) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")",
        }}
      />

      <style>{`
        @keyframes saga-narr2-drift {
          from { transform: scale(1.05) translateY(0); }
          to   { transform: scale(1.15) translateY(-2%); }
        }
        @keyframes saga-line2-in {
          from { opacity: 0; transform: translateY(10px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0);   }
        }
      `}</style>

      <div className="relative z-10 pt-5 px-5 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-primary-v2/30 bg-primary-v2/10 backdrop-blur">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-v2 animate-pulse" />
          <span className="text-[9px] uppercase tracking-[0.3em] text-primary-v2 font-medium">
            Chapter One
          </span>
        </div>
        <button
          onClick={onComplete}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/15 text-[10px] uppercase tracking-[0.25em] text-white/80 hover:bg-white/[0.15] transition"
        >
          Skip <SkipForward className="w-3 h-3" />
        </button>
      </div>

      <div className="relative z-10 mt-auto px-6 pb-16 w-full">
        <div className="mx-auto max-w-[360px] min-h-[140px] flex items-end justify-center">
          <p
            key={idx}
            className="text-center text-foreground-v2 text-[17px] leading-[1.45] font-medium"
            style={{
              animation: "saga-line2-in 0.6s cubic-bezier(0.16,1,0.3,1) both",
              textShadow: "0 2px 20px hsl(var(--background)/0.9), 0 0 12px hsl(var(--background)/0.6)",
            }}
          >
            {line.text}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-1.5">
          {LINES.map((_, i) => (
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
