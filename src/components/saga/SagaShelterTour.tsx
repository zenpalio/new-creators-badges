import { useEffect, useRef, useState } from "react";
import { SkipForward, ChevronLeft, ChevronRight } from "lucide-react";
import doorImg from "@/assets/saga-shelter-door.jpg.asset.json";
import commonImg from "@/assets/saga-shelter-common.jpg.asset.json";
import maiPortrait from "@/assets/chars/mai.png.asset.json";

type Scene = { img: string; speaker: string; text: string; kb: string };

const SCENES: Scene[] = [
  {
    img: doorImg.url,
    speaker: "Mai",
    text: "Welcome to the Haven. You're safe — for now. Come, meet the others.",
    kb: "kb-a",
  },
  {
    img: maiPortrait.url,
    speaker: "Mai",
    text: "This is our shelter. We built it. We defend it. Nobody sleeps here without the room's say-so.",
    kb: "kb-b",
  },
  {
    img: commonImg.url,
    speaker: "Mai",
    text: "That's Abby, Bo, Cleo… and you already met Anna. They'll be voting on you tonight.",
    kb: "kb-c",
  },
  {
    img: commonImg.url,
    speaker: "Mai",
    text: "You need at least three yeses to stay. I'm already a yes — but the others? You'll have to earn them.",
    kb: "kb-d",
  },
  {
    img: commonImg.url,
    speaker: "Mai",
    text: "Talk to each of them. Be real. Then we vote. Ready?",
    kb: "kb-a",
  },
];

export default function SagaShelterTour({ onComplete }: { onComplete: () => void }) {
  const [idx, setIdx] = useState(0);
  const scene = SCENES[idx];
  const done = idx >= SCENES.length - 1;
  const prev = () => idx > 0 && setIdx(idx - 1);
  const next = () => (done ? onComplete() : setIdx(idx + 1));

  // Preload
  useEffect(() => {
    SCENES.forEach((s) => {
      const i = new Image();
      i.src = s.img;
    });
  }, []);

  return (
    <div className="absolute inset-0 z-40 bg-black flex flex-col animate-fade-in overflow-hidden">
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
            animation: i === idx ? `${s.kb} 14s ease-out forwards` : undefined,
            filter: "contrast(1.05) saturate(1.02)",
          }}
        />
      ))}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0.9) 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.9) 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.14] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")",
          animation: "saga-grain 0.8s steps(6) infinite",
        }}
      />

      <style>{`
        @keyframes kb-a { from { transform: scale(1.06) translate(0,0); } to { transform: scale(1.16) translate(-2%, -2%); } }
        @keyframes kb-b { from { transform: scale(1.16) translate(2%, 1%); } to { transform: scale(1.06) translate(0, 0); } }
        @keyframes kb-c { from { transform: scale(1.05) translate(1%, -1%); } to { transform: scale(1.16) translate(-2%, 2%); } }
        @keyframes kb-d { from { transform: scale(1.15) translate(-1%, 2%); } to { transform: scale(1.05) translate(2%, -1%); } }
        @keyframes tour-line-in {
          from { opacity: 0; transform: translateY(10px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0);   }
        }
      `}</style>

      {/* Top bar */}
      <div className="relative z-30 pt-8 px-5 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-primary-v2/30 bg-primary-v2/10 backdrop-blur">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-v2 animate-pulse" />
          <span className="text-[9px] uppercase tracking-[0.3em] text-primary-v2 font-medium">
            The Haven · Meet the Shelter
          </span>
        </div>
        <button
          onClick={onComplete}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/15 text-[10px] uppercase tracking-[0.25em] text-white/80 hover:bg-white/[0.15] transition"
        >
          Skip <SkipForward className="w-3 h-3" />
        </button>
      </div>

      {/* Bottom content */}
      <div className="relative z-30 mt-auto px-6 pb-20 w-full">
        <div className="mx-auto max-w-[360px] flex flex-col items-center">
          <div className="text-[10px] uppercase tracking-[0.35em] text-primary-v2/90 mb-3">
            {scene.speaker}
          </div>
          <p
            key={idx}
            className="text-center text-foreground-v2 text-[17px] leading-[1.45] font-medium min-h-[110px]"
            style={{
              animation: "tour-line-in 0.6s cubic-bezier(0.16,1,0.3,1) both",
              textShadow: "0 2px 20px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.6)",
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
            onClick={prev}
            disabled={idx === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/15 text-[10px] uppercase tracking-[0.25em] text-white/85 hover:bg-white/[0.15] transition disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back
          </button>
          <button
            onClick={next}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary-v2/90 text-primary-v2-foreground text-[10px] font-semibold uppercase tracking-[0.25em] hover:bg-primary-v2 transition"
          >
            {done ? "Meet them" : "Next"} <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
