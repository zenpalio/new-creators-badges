import { useEffect, useState } from "react";
import { SkipForward } from "lucide-react";
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

const DURATION_MS = 5200;

export default function SagaHaven7Intro({ onComplete }: { onComplete: () => void }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      if (idx < SCENES.length - 1) setIdx(idx + 1);
      else onComplete();
    }, DURATION_MS);
    return () => clearTimeout(t);
  }, [idx, onComplete]);

  const next = () => {
    if (idx < SCENES.length - 1) setIdx(idx + 1);
    else onComplete();
  };

  const current = SCENES[idx];

  return (
    <div className="absolute inset-0 z-[60] bg-black flex flex-col animate-fade-in overflow-hidden">
      {SCENES.map((s, i) => (
        <img
          key={i}
          src={s.img}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[900ms] ease-out"
          style={{
            opacity: idx === i ? 1 : 0,
            transform: "scale(1.06)",
            animation: idx === i ? "saga-h7-drift 7s ease-out forwards" : undefined,
            filter: "contrast(1.02) saturate(1.05)",
          }}
        />
      ))}

      {/* Subtitle scrim — only at the bottom so the image stays clean */}
      <div
        className="absolute inset-x-0 bottom-0 h-[45%] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.92) 100%)",
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
        @keyframes saga-h7-bar {
          from { width: 0%; }
          to   { width: 100%; }
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
          key={`name-${idx}`}
          className="mx-auto max-w-[360px] text-center"
          style={{ animation: "saga-h7-line-in 0.5s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <span className="inline-block text-[11px] uppercase tracking-[0.35em] text-white/75 font-semibold">
            {current.name}
          </span>
        </div>
      </div>

      {/* Subtitle */}
      <div className="relative z-10 mt-auto px-6 pb-8 w-full">
        <div className="mx-auto max-w-[360px] min-h-[150px] flex items-end justify-center">
          <p
            key={idx}
            className="text-center text-foreground-v2 text-[17px] leading-[1.45] font-medium"
            style={{
              animation: "saga-h7-line-in 0.6s cubic-bezier(0.16,1,0.3,1) both",
              textShadow: "0 2px 20px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.6)",
            }}
          >
            {current.text}
          </p>
        </div>

      </div>
    </div>
  );
}
