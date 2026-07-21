import { useMemo, useState } from "react";
import { Heart, X, Info, Sparkles, Clapperboard } from "lucide-react";
import {
  CREATE_CARDS,
  SCENARIOS,
  type CreateCardId,
  type ScenarioId,
} from "./scenarios";

type DeckItem =
  | { type: "scenario"; id: ScenarioId }
  | { type: "create"; id: CreateCardId };

const DECK: DeckItem[] = [
  { type: "scenario", id: "mai-roommate" },
  { type: "scenario", id: "cleo-app" },
  { type: "create", id: "create-image" },
  { type: "scenario", id: "anna-rescue" },
  { type: "scenario", id: "abby-boss" },
  { type: "create", id: "create-video" },
  { type: "scenario", id: "bo-ex" },
];

export default function MatchDeck({
  onMatch,
  onPreview,
  onCreate,
}: {
  onMatch: (id: ScenarioId) => void;
  onPreview: (id: ScenarioId) => void;
  onCreate: (id: CreateCardId) => void;
}) {
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);

  const current = DECK[index];
  const next = DECK[(index + 1) % DECK.length];

  const currentData = useMemo(() => {
    if (!current) return null;
    if (current.type === "scenario") {
      return SCENARIOS.find((s) => s.id === current.id) ?? null;
    }
    return CREATE_CARDS.find((card) => card.id === current.id) ?? null;
  }, [current]);

  const nextData = useMemo(() => {
    if (!next) return null;
    if (next.type === "scenario") {
      return SCENARIOS.find((s) => s.id === next.id) ?? null;
    }
    return CREATE_CARDS.find((card) => card.id === next.id) ?? null;
  }, [next]);

  if (!current || !currentData) return null;

  const advance = () => {
    setDrag(0);
    setIndex((i) => Math.min(DECK.length - 1, i + 1));
  };

  const swipe = (dir: "left" | "right") => {
    if (current.type === "scenario") {
      if (dir === "right") {
        onMatch(current.id);
        return;
      }
      advance();
      return;
    }

    if (dir === "right") {
      onCreate(current.id);
    } else {
      advance();
    }
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
  const isScenario = current.type === "scenario";
  const isCreate = current.type === "create";

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        {index + 1 < DECK.length && nextData && (
          <div className="absolute inset-0 overflow-hidden opacity-70">
            <img
              src={nextData.imageUrl ?? nextData.hero}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}

        <div
          className="absolute inset-0 cursor-grab select-none overflow-hidden touch-none active:cursor-grabbing"
          style={{
            transform: `translateX(${drag}px) rotate(${rot * 0.3}deg)`,
            transition:
              startX === null ? "transform 0.35s cubic-bezier(0.16,1,0.3,1)" : "none",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <img
            src={currentData.imageUrl ?? currentData.hero}
            alt={currentData.title ?? currentData.name}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

          <div
            className="absolute top-10 left-6 rounded-xl border-4 border-emerald-400 px-4 py-2 text-3xl font-black uppercase tracking-wider text-emerald-400 -rotate-12"
            style={{ opacity: likeOpacity }}
          >
            {isCreate ? "Build" : "Match"}
          </div>
          <div
            className="absolute top-10 right-6 rounded-xl border-4 border-rose-500 px-4 py-2 text-3xl font-black uppercase tracking-wider text-rose-500 rotate-12"
            style={{ opacity: nopeOpacity }}
          >
            Skip
          </div>

          <div className="absolute bottom-32 left-0 right-0 space-y-2 p-6">
            {isScenario ? (
              <>
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-4xl font-black tracking-tight">{currentData.name}</h2>
                    <span className="text-2xl font-light text-white/80">{currentData.age}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreview(current.id);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition hover:bg-white/20"
                    aria-label="View profile"
                  >
                    <Info className="h-5 w-5" />
                  </button>
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/[0.08] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/75 backdrop-blur-md">
                  {currentData.mode === "live" ? <Clapperboard className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                  {currentData.modeLabel}
                </div>
                <p className="pt-1 text-sm leading-relaxed text-white/85">{currentData.roleplay}</p>
              </>
            ) : (
              <>
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/[0.08] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/75 backdrop-blur-md">
                  {current.id === "create-video" ? <Clapperboard className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                  {currentData.badge}
                </div>
                <h2 className="max-w-[280px] text-4xl font-black tracking-tight">{currentData.title}</h2>
                <p className="max-w-[320px] pt-1 text-sm leading-relaxed text-white/85">
                  {currentData.description}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 z-10 flex items-center justify-center gap-8">
        <button
          onClick={() => swipe("left")}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/5 text-rose-400 backdrop-blur-xl transition hover:scale-110 active:scale-95"
          aria-label="Skip"
        >
          <X className="h-8 w-8" strokeWidth={3} />
        </button>
        <button
          onClick={() => swipe("right")}
          className="flex h-20 w-20 items-center justify-center rounded-full text-white shadow-[0_0_40px_hsl(var(--primary-v2)/0.6)] transition hover:scale-110 active:scale-95"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary-v2)), #22d3ee)" }}
          aria-label={isCreate ? "Build" : "Match"}
        >
          {isCreate ? <Sparkles className="h-9 w-9" /> : <Heart className="h-10 w-10 fill-white" />}
        </button>
      </div>
    </div>
  );
}
