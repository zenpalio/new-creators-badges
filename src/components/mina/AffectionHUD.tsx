import { Flame, Heart, Coins } from "lucide-react";
import { type CompanionState, tierFromAffection } from "@/hooks/useCompanion";

const moodEmoji: Record<string, string> = {
  cold: "🥶", pouty: "😒", shy: "😳", flirty: "😏",
  lover: "💕", smitten: "🥰", obsessed: "🔥", neutral: "🙂",
};

const moodCopy: Record<string, string> = {
  cold: "She's icy. You ghosted her.",
  pouty: "You skipped yesterday…",
  shy: "Just getting to know each other.",
  flirty: "She's into you.",
  lover: "She's all yours.",
  smitten: "She's crushing hard.",
  obsessed: "She needs you.",
  neutral: "",
};

const AffectionHUD = ({ state }: { state: CompanionState }) => {
  const tier = tierFromAffection(state.affection);
  return (
    <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
      <div className="p-4 pointer-events-auto">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Affection bar */}
          <div className="flex-1 min-w-[200px] bg-background-v2/70 backdrop-blur-md rounded-xl p-2.5 border border-border-v2/40">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 font-semibold text-foreground-v2">
                <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                Mina · <span className="capitalize text-red-400">{tier}</span>
              </span>
              <span className="text-muted-v2-foreground">{state.affection}/100</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted-v2 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-500 via-pink-500 to-red-400 transition-all duration-500"
                style={{ width: `${state.affection}%` }}
              />
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1.5 bg-background-v2/70 backdrop-blur-md rounded-xl px-3 py-2 border border-border-v2/40">
            <Flame className={`w-4 h-4 ${state.streak_days > 0 ? "text-orange-500 fill-orange-500" : "text-muted-v2-foreground"}`} />
            <span className="text-sm font-bold text-foreground-v2">{state.streak_days}</span>
            <span className="text-xs text-muted-v2-foreground">day{state.streak_days !== 1 ? "s" : ""}</span>
          </div>

          {/* Tokens */}
          <div className="flex items-center gap-1.5 bg-background-v2/70 backdrop-blur-md rounded-xl px-3 py-2 border border-border-v2/40">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-bold text-foreground-v2">{state.tokens_balance}</span>
          </div>
        </div>

        {/* Mood pill */}
        <div className="mt-2 inline-flex items-center gap-2 bg-background-v2/70 backdrop-blur-md rounded-full px-3 py-1 border border-border-v2/40 text-xs">
          <span className="text-base">{moodEmoji[state.mood] ?? "🙂"}</span>
          <span className="text-muted-v2-foreground capitalize">{state.mood}</span>
          {moodCopy[state.mood] && <span className="text-foreground-v2/70">— {moodCopy[state.mood]}</span>}
        </div>
      </div>
    </div>
  );
};

export default AffectionHUD;
