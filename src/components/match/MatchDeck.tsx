import { useState } from "react";
import { Heart, X, Flame, Info } from "lucide-react";
import { SCENARIOS, type ScenarioId } from "./scenarios";

export default function MatchDeck({
  onMatch,
  onPreview,
}: {
  onMatch: (id: ScenarioId) => void;
  onPreview: (id: ScenarioId) => void;
}) {

  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);

  const current = SCENARIOS[index];
  const next = SCENARIOS[(index + 1) % SCENARIOS.length];

  if (!current) return null;

  const swipe = (dir: "left" | "right") => {
    if (dir === "right") {
      onMatch(current.id);
      return;
    }
    setDrag(0);
    setIndex((i) => Math.min(SCENARIOS.length - 1, i + 1));
  };

  const onPointerDown = (e: React.PointerEvent) => setStartX(e.clientX);
  const onPointerMove = (e: React.PointerEvent) => {
    if (startX === null) return;
    setDrag(e.clientX - startX);
  };
  const onPointerUp = () => {
    if (drag > 120) swipe("right");
    else if (drag < -120) swipe("left");
    else setDrag(0);
    setStartX(null);
  };

  const rot = drag / 20;
  const likeOpacity = Math.max(0, Math.min(1, drag / 100));
  const nopeOpacity = Math.max(0, Math.min(1, -drag / 100));

  return (
    <div className="min-h-[100dvh] bg-black text-white flex flex-col items-center overflow-hidden">


      {/* Deck */}
      <div className="relative w-[min(92vw,380px)] h-[min(70dvh,560px)] mt-2">
        {/* Behind card */}
        {index + 1 < SCENARIOS.length && (
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl scale-[0.94] opacity-70"
            style={{ transform: "translateY(14px) scale(0.94)" }}
          >
            <img src={next.hero} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}

        {/* Current card */}
        <div
          className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing select-none touch-none"
          style={{
            transform: `translateX(${drag}px) rotate(${rot}deg)`,
            transition: startX === null ? "transform 0.35s cubic-bezier(0.16,1,0.3,1)" : "none",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <img src={current.hero} alt={current.name} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          {/* LIKE / NOPE stamps */}
          <div
            className="absolute top-8 left-6 px-4 py-2 border-4 border-emerald-400 rounded-xl text-emerald-400 font-black text-3xl uppercase tracking-wider -rotate-12"
            style={{ opacity: likeOpacity }}
          >
            Match
          </div>
          <div
            className="absolute top-8 right-6 px-4 py-2 border-4 border-rose-500 rounded-xl text-rose-500 font-black text-3xl uppercase tracking-wider rotate-12"
            style={{ opacity: nopeOpacity }}
          >
            Nope
          </div>

          {/* Card body */}
          <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1">
            <div className="flex items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-black tracking-tight">{current.name}</h2>
                <span className="text-2xl font-light text-white/80">{current.age}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(current.id);
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition"
                aria-label="View profile"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-white/85 font-medium">{current.tag}</p>
            <p className="text-xs uppercase tracking-[0.18em] text-white/50">{current.hook}</p>
          </div>

        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-8 mt-8">
        <button
          onClick={() => swipe("left")}
          className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-xl border border-white/15 flex items-center justify-center text-rose-400 hover:scale-110 active:scale-95 transition"
          aria-label="Nope"
        >
          <X className="w-8 h-8" strokeWidth={3} />
        </button>
        <button
          onClick={() => swipe("right")}
          className="w-20 h-20 rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition shadow-[0_0_40px_hsl(var(--primary-v2)/0.6)]"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary-v2)), #ec4899)" }}
          aria-label="Match"
        >
          <Heart className="w-10 h-10 fill-white" />
        </button>
      </div>

      <p className="mt-6 text-[10px] uppercase tracking-[0.25em] text-white/35">
        Swipe or tap
      </p>
    </div>
  );
}
