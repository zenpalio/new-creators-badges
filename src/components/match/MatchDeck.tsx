import { useState } from "react";
import { Heart, X, Info, Sparkles, Clapperboard, BookOpen, ImageIcon } from "lucide-react";
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

type ExperienceTone = {
  label: string;
  color: string;
  icon: JSX.Element;
};

const DECK: DeckItem[] = [
  { type: "scenario", id: "mai-roommate" },
  { type: "scenario", id: "cleo-app" },
  { type: "create", id: "story-island-escape" },
  { type: "create", id: "create-image" },
  { type: "create", id: "create-video" },
  { type: "scenario", id: "anna-rescue" },
  { type: "scenario", id: "abby-boss" },
  { type: "create", id: "story-tokyo-after-dark" },
  { type: "scenario", id: "bo-ex" },
  { type: "create", id: "story-velvet-hours" },
];

const getScenario = (id: ScenarioId): Scenario =>
  SCENARIOS.find((s) => s.id === id)!;

const getCreateCard = (id: CreateCardId): CreateCard =>
  CREATE_CARDS.find((card) => card.id === id)!;

const isStoryCard = (id: CreateCardId) => id.startsWith("story-");

const getExperienceTone = (
  scenario: Scenario | null,
  createCard: CreateCard | null,
): ExperienceTone | null => {
  if (scenario?.mode === "story") {
    return {
      label: "Interactive shorts",
      color: "#14b8a6",
      icon: <Sparkles className="h-3.5 w-3.5" />,
    };
  }

  if (scenario?.mode === "live") {
    return {
      label: "Live roleplay",
      color: "#f97316",
      icon: <Clapperboard className="h-3.5 w-3.5" />,
    };
  }

  if (scenario?.mode === "simple") {
    return {
      label: "Trending babe",
      color: "#eab308",
      icon: <Heart className="h-3.5 w-3.5 fill-current" />,
    };
  }

  if (createCard) {
    if (isStoryCard(createCard.id)) {
      return {
        label: "Trending story",
        color: "#8b5cf6",
        icon: <BookOpen className="h-3.5 w-3.5" />,
      };
    }

    return {
      label: "Image & video model",
      color: "#38bdf8",
      icon: <ImageIcon className="h-3.5 w-3.5" />,
    };
  }

  return null;
};

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
  const isScenario = current.type === "scenario";
  const currentIsStory = currentCreate ? isStoryCard(currentCreate.id) : false;
  const nextImage = nextScenario?.hero ?? nextCreate?.imageUrl;
  const experienceTone = getExperienceTone(currentScenario, currentCreate);
  const cardDescription = (currentScenario
    ? currentScenario.pitch.slice(0, 3)
    : currentCreate
      ? [currentCreate.description, ...currentCreate.benefits].slice(0, 3)
      : []
  )
    .map((line) => line.trim().replace(/[.!?]+$/, ""))
    .filter(Boolean)
    .join(". ")
    .concat(".");

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

          <div className="absolute right-3 top-3 z-10 flex max-w-[80vw] items-start gap-2 sm:right-4 sm:top-4 sm:max-w-[360px]">
            {experienceTone ? (
              <div
                className="inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-white shadow-[0_8px_30px_rgba(0,0,0,0.28)] backdrop-blur-xl"
                style={{
                  borderColor: `${experienceTone.color}55`,
                  backgroundColor: `${experienceTone.color}26`,
                  boxShadow: `0 10px 30px ${experienceTone.color}30`,
                }}
              >
                {experienceTone.icon}
                {experienceTone.label}
              </div>
            ) : null}
            {currentScenario ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(currentScenario.id);
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className="inline-flex h-[34px] min-w-[34px] shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/35 px-2.5 text-white backdrop-blur-md transition hover:bg-white/20"
                aria-label="View profile"
              >
                <Info className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>

          <div className="absolute bottom-32 left-0 right-0 space-y-3 p-6">
            {currentScenario ? (
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0 max-w-[320px]">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h2 className="text-4xl font-black tracking-tight">{currentScenario.name}</h2>
                    <span className="text-2xl font-light text-white/80">{currentScenario.age}</span>
                  </div>
                  <p className="pt-2 text-sm leading-5 text-white/85">{cardDescription}</p>
                </div>
              </div>
            ) : currentCreate ? (
              <div className="max-w-[320px]">
                <h2 className="text-4xl font-black tracking-tight">{currentCreate.title}</h2>
                <p className="pt-2 text-sm leading-5 text-white/85">{cardDescription}</p>
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
