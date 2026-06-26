import { useState } from "react";
import { Sparkles } from "lucide-react";
import type { Sentiment } from "./ChatComposer";

interface Props {
  onPlay: (sentiment: Sentiment) => void;
}

const ANIMS: { label: string; emoji: string; sentiment: Sentiment }[] = [
  { label: "Happy",   emoji: "😊", sentiment: "like" },
  { label: "Excited", emoji: "🤩", sentiment: "love" },
  { label: "Angry",   emoji: "😡", sentiment: "hate" },
];

const AnimationMenu = ({ onPlay }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-11 h-11 rounded-full backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex items-center justify-center transition ${
          open ? "bg-white text-[hsl(220_25%_10%)]" : "bg-white/[0.06] text-white/90 hover:bg-white/[0.12] hover:scale-105"
        }`}
        title="Play animation"
        aria-label="Play animation"
      >
        <Sparkles className="w-4 h-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white/[0.08] backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-1.5 z-40 animate-scale-in">
            <div className="px-2 py-1.5 text-[10px] uppercase tracking-[0.15em] text-white/45 font-medium">
              Animations
            </div>
            {ANIMS.map((a) => (
              <button
                key={a.label}
                onClick={() => {
                  onPlay(a.sentiment);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-[12px] text-white/85 hover:bg-white/10 transition"
              >
                <span className="text-base leading-none">{a.emoji}</span>
                {a.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AnimationMenu;
