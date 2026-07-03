import { useEffect, useMemo, useState } from "react";
import { SkipForward, ChevronLeft, ChevronRight } from "lucide-react";
import s01 from "@/assets/vn/h7-s01-mai-corridor.jpg.asset.json";
import s02 from "@/assets/vn/h7-s02-mai-tour.jpg.asset.json";
import s03 from "@/assets/vn/h7-s03-abby-cleo-wide.jpg.asset.json";
import s04 from "@/assets/vn/h7-s04-abby-closeup.jpg.asset.json";
import s05 from "@/assets/vn/h7-s05-cleo-closeup.jpg.asset.json";
import s06 from "@/assets/vn/h7-s06-bo-hallway.jpg.asset.json";
import s07 from "@/assets/vn/h7-s07-bo-closeup.jpg.asset.json";
import s08 from "@/assets/vn/h7-s08-bo-cleo-pair.jpg.asset.json";
import s09 from "@/assets/vn/h7-s09-mai-room.jpg.asset.json";
import s10 from "@/assets/vn/h7-s10-group-lantern.jpg.asset.json";

type Scene = { img: string; name: string; text: string };

const SCENES: Scene[] = [
  { img: s01.url, name: "Mai",             text: "Haven-7. Blast doors seal behind you. Mai leads you into the dark, warm hum of the shelter." },
  { img: s02.url, name: "Mai",             text: "Painted arrows. Survivor stencils. She points them out like a girl showing off her home." },
  { img: s03.url, name: "The common room", text: "In the common room, two girls are already waiting. They stop talking the moment you walk in." },
  { img: s04.url, name: "Abby",            text: "Abby — blonde, arms folded, that look women use when they've already decided you're trouble." },
  { img: s05.url, name: "Cleo",            text: "Cleo — purple hair, teasing smirk. She doesn't hide that she's enjoying this." },
  { img: s06.url, name: "…someone else",   text: "A shadow moves in the side hallway. Someone you haven't met yet." },
  { img: s07.url, name: "Bo",              text: "Bo. Black hair, crop top, cool stare. She sizes you up in one breath and gives nothing back." },
  { img: s08.url, name: "Bo & Cleo",       text: "Cleo leans into Bo, whispers something. Bo's mouth twitches. You're the joke — or the prize." },
  { img: s09.url, name: "Mai",             text: "Mai opens a small bunk room. \"This one's yours,\" she says softly. \"If they let you stay.\"" },
  { img: s10.url, name: "Four girls",      text: "Four girls. One shelter. Every choice from here decides which of them lets you in — and how far." },
];

const DURATION_MS = 6000;
const KEN_BURNS = ["kb-a", "kb-b", "kb-c", "kb-d", "kb-e", "kb-f", "kb-a", "kb-c", "kb-b", "kb-e"] as const;

export default function SagaHaven7Intro({ onComplete }: { onComplete: () => void }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const goNext = () => {
    if (idx < SCENES.length - 1) setIdx(idx + 1);
    else onComplete();
  };
  const goPrev = () => {
    if (idx > 0) setIdx(idx - 1);
  };

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(goNext, DURATION_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, paused]);

  // Reset pause when scene changes via manual nav
  useEffect(() => { setPaused(false); }, [idx]);

  const current = SCENES[idx];
  const isLast = idx === SCENES.length - 1;
  const isFirst = idx === 0;

  const ashParticles = useMemo(
    () => Array.from({ length: 22 }).map((_, i) => ({
      left: (i * 47) % 100,
      delay: (i * 0.37) % 6,
      dur: 9 + ((i * 1.7) % 8),
      size: 1 + ((i * 3) % 4),
    })),
    []
  );

  return (
    <div className="absolute inset-0 z-[60] bg-black flex flex-col animate-fade-in overflow-hidden">
      {/* Images with per-scene ken-burns */}
      {SCENES.map((s, i) => (
        <img
          key={i}
          src={s.img}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: idx === i ? 1 : 0,
            transition: "opacity 1200ms ease-out",
            transform: "scale(1.06)",
            animation: idx === i ? `${KEN_BURNS[i]} 12s ease-out forwards` : undefined,
            filter: "contrast(1.05) saturate(1.02)",
          }}
        />
      ))}

      {/* Vignette (pulsing) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.9) 100%)",
          animation: "saga-vignette-pulse 6s ease-in-out infinite",
        }}
      />

      {/* Bottom scrim for subtitle legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Warm ember tint that flickers */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 60%, hsl(22 90% 45% / 0.22), transparent 70%)",
          animation: "saga-flicker 3.2s ease-in-out infinite",
        }}
      />

      {/* Floating ash / dust particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {ashParticles.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white/60"
            style={{
              left: `${p.left}%`,
              top: "-10px",
              width: p.size,
              height: p.size,
              filter: "blur(0.5px)",
              opacity: 0.35,
              animation: `saga-ash ${p.dur}s linear ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

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
        @keyframes kb-e { from { transform: scale(1.08) translate(0, 2%); } to { transform: scale(1.2) translate(0, -3%); } }
        @keyframes kb-f { from { transform: scale(1.2) translate(-2%, 0); } to { transform: scale(1.06) translate(2%, 1%); } }
        @keyframes saga-h7-line-in {
          from { opacity: 0; transform: translateY(10px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0);   }
        }
        @keyframes saga-vignette-pulse {
          0%,100% { opacity: 0.9; }
          50%     { opacity: 1; }
        }
        @keyframes saga-flicker {
          0%,100% { opacity: 0.7; }
          25%     { opacity: 0.4; }
          50%     { opacity: 0.85; }
          75%     { opacity: 0.55; }
        }
        @keyframes saga-grain {
          0%   { transform: translate(0,0); }
          25%  { transform: translate(-2%, 1%); }
          50%  { transform: translate(1%, -2%); }
          75%  { transform: translate(-1%, 2%); }
          100% { transform: translate(0,0); }
        }
        @keyframes saga-ash {
          0%   { transform: translate3d(0,0,0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.5; }
          100% { transform: translate3d(-30px, 110vh, 0) rotate(120deg); opacity: 0; }
        }
      `}</style>

      {/* Header */}
      <div className="relative z-30 pt-8 px-5 flex items-center justify-between">
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
      <div className="relative z-30 mt-4 px-6">
        <div
          key={`name-${idx}`}
          className="mx-auto max-w-[360px] text-center"
          style={{ animation: "saga-h7-line-in 0.5s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <span className="inline-block text-[11px] uppercase tracking-[0.35em] text-white/75 font-semibold">
            {current.name}
          </span>
        </div>
      </div>

      {/* Side tap zones for prev/next */}
      <button
        aria-label="Previous"
        onClick={goPrev}
        disabled={isFirst}
        className="absolute left-0 top-[15%] bottom-[25%] w-[30%] z-20 group flex items-center justify-start pl-2 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <span className="opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity w-9 h-9 rounded-full bg-black/50 backdrop-blur border border-white/15 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-white/85" />
        </span>
      </button>
      <button
        aria-label="Next"
        onClick={goNext}
        className="absolute right-0 top-[15%] bottom-[25%] w-[30%] z-20 group flex items-center justify-end pr-2"
      >
        <span className="opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity w-9 h-9 rounded-full bg-black/50 backdrop-blur border border-white/15 flex items-center justify-center">
          <ChevronRight className="w-5 h-5 text-white/85" />
        </span>
      </button>

      {/* Subtitle + controls */}
      <div className="relative z-30 mt-auto px-6 pb-8 w-full">
        <div className="mx-auto max-w-[360px] min-h-[140px] flex items-end justify-center">
          <p
            key={idx}
            className="text-center text-foreground-v2 text-[17px] leading-[1.45] font-medium"
            style={{
              animation: "saga-h7-line-in 0.6s cubic-bezier(0.16,1,0.3,1) both",
              textShadow: "0 2px 20px hsl(var(--background)/0.9), 0 0 12px hsl(var(--background)/0.6)",
            }}
          >
            {current.text}
          </p>
        </div>

        {/* Dot / dash indicator (prologue style) */}
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

        {/* Prev / Next explicit buttons */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={goPrev}
            disabled={isFirst}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/15 text-[10px] uppercase tracking-[0.25em] text-white/80 hover:bg-white/[0.15] transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-3 h-3" /> Back
          </button>
          <button
            onClick={goNext}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary-v2 text-primary-v2-foreground text-[10px] font-semibold uppercase tracking-[0.25em] hover:brightness-110 transition"
          >
            {isLast ? "Enter" : "Next"} <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
