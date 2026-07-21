import { useState } from "react";
import { Heart, X, Info, Sparkles, Clapperboard, BookOpen } from "lucide-react";
import {
  CREATE_CARDS,
  SCENARIOS,
  type CreateCard,
  type CreateCardId,
  type Scenario,
  type ScenarioId,
} from "./scenarios";

type DeckItem =
  | { type: "scenario"; id: ScenarioId }
  | { type: "create"; id: CreateCardId };

const DECK: DeckItem[] = [
  { type: "scenario", id: "mai-roommate" },
  { type: "scenario", id: "cleo-app" },
  { type: "create", id: "story-island-escape" },
  { type: "create", id: "create-image" },
  { type: "scenario", id: "anna-rescue" },
  { type: "scenario", id: "abby-boss" },
  { type: "create", id: "story-tokyo-after-dark" },
  { type: "create", id: "create-video" },
  { type: "scenario", id: "bo-ex" },
  { type: "create", id: "story-velvet-hours" },
];

const getScenario = (id: ScenarioId): Scenario =>
  SCENARIOS.find((s) => s.id === id)!;

const getCreateCard = (id: CreateCardId): CreateCard =>
  CREATE_CARDS.find((card) => card.id === id)!;

const isStoryCard = (id: CreateCardId) => id.startsWith("story-");

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

  if (!current) return null;

  const currentScenario = current.type === "scenario" ? getScenario(current.id) : null;
  const currentCreate = current.type === "create" ? getCreateCard(current.id) : null;
  const nextScenario = next?.type === "scenario" ? getScenario(next.id) : null;
  const nextCreate = next?.type === "create" ? getCreateCard(next.id) : null;

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
  const currentIsStory = currentCreate ? isStoryCard(currentCreate.id) : false;
  const nextImage = nextScenario?.hero ?? nextCreate?.imageUrl;
  const badgeLabel = currentScenario?.modeLabel ?? currentCreate?.badge ?? "";
  const badgeColor = currentScenario?.accent ?? currentCreate?.accent ?? "#ffffff";
  const badgeIcon = currentScenario ? (
    currentScenario.mode === "live" ? (
      <Clapperboard className="h-3.5 w-3.5" />
    ) : currentScenario.mode === "story" ? (
      <Sparkles className="h-3.5 w-3.5" />
    ) : (
      <Info className="h-3.5 w-3.5" />
    )
  ) : currentIsStory ? (
    <BookOpen className="h-3.5 w-3.5" />
  ) : currentCreate?.id === "create-video" ? (
    <Clapperboard className="h-3.5 w-3.5" />
  ) : (
    <Sparkles className="h-3.5 w-3.5" />
  );

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        {index + 1 < DECK.length && nextImage && (
          <div className="absolute inset-0 overflow-hidden opacity-70">
            <img src={nextImage} alt="" className="h-full w-full object-cover" />
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
            src={currentScenario?.hero ?? currentCreate?.imageUrl}
            alt={currentScenario?.name ?? currentCreate?.title ?? "Card"}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

          <div
            className="absolute top-10 left-6 rounded-xl border-4 border-emerald-400 px-4 py-2 text-3xl font-black uppercase tracking-wider text-emerald-400 -rotate-12"
            style={{ opacity: likeOpacity }}
          >
            {isScenario ? "Match" : currentIsStory ? "Read" : "Build"}
          </div>
          <div
            className="absolute top-10 right-6 rounded-xl border-4 border-rose-500 px-4 py-2 text-3xl font-black uppercase tracking-wider text-rose-500 rotate-12"
            style={{ opacity: nopeOpacity }}
          >
            Skip
          </div>

          {badgeLabel ? (
            <div className="absolute right-6 top-24 z-10 max-w-[78vw] sm:max-w-[360px]">
              <div
                className="inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-white shadow-[0_8px_30px_rgba(0,0,0,0.28)] backdrop-blur-xl"
                style={{
                  borderColor: `${badgeColor}55`,
                  backgroundColor: `${badgeColor}26`,
                  boxShadow: `0 10px 30px ${badgeColor}30`,
                }}
              >
                {badgeIcon}
                {badgeLabel}
              </div>
            </div>
          ) : null}

          <div className="absolute bottom-32 left-0 right-0 space-y-2 p-6">
            {currentScenario ? (
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h2 className="text-4xl font-black tracking-tight">{currentScenario.name}</h2>
                    <span className="text-2xl font-light text-white/80">{currentScenario.age}</span>
                  </div>
                  <p className="pt-1 text-base text-white/80">{currentScenario.hook}</p>
                </div>
              </div>
            ) : currentCreate ? (
              <div className="max-w-[320px]">
                <h2 className="text-4xl font-black tracking-tight">{currentCreate.title}</h2>
                <p className="pt-1 text-base text-white/80">{currentCreate.badge}</p>
              </div>
            ) : null}
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
          aria-label={isScenario ? "Match" : currentIsStory ? "Read" : "Build"}
        >
          {isScenario ? (
            <Heart className="h-10 w-10 fill-white" />
          ) : currentIsStory ? (
            <BookOpen className="h-9 w-9" />
          ) : (
            <Sparkles className="h-9 w-9" />
          )}
        </button>
      </div>
    </div>
  );
}
