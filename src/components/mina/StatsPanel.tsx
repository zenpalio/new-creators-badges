import type { MoodStats } from "@/hooks/useCompanion";

interface Props {
  stats: MoodStats;
}

type Row = {
  key: keyof MoodStats;
  /** label shown when value is HIGH */
  high: string;
  /** label shown when value is LOW (the opposite mood) */
  low: string;
  icon: string;
  /** if true, "high" is the negative state (e.g. arousal high = horny) */
  invertLabel?: boolean;
};

const ROWS: Row[] = [
  { key: "hunger",  icon: "🍱", high: "Full",     low: "Hungry"  },
  { key: "energy",  icon: "⚡", high: "Energized", low: "Sleepy"  },
  { key: "arousal", icon: "🔥", high: "Horny",    low: "Cool",   invertLabel: true },
  { key: "calm",    icon: "🌿", high: "Calm",     low: "Nervous" },
  { key: "joy",     icon: "✨", high: "Happy",    low: "Sad"     },
  { key: "comfort", icon: "🫶", high: "Cozy",     low: "Lonely"  },
];

const barColor = (v: number) => {
  if (v < 25) return "from-rose-400/80 to-rose-300/60";
  if (v < 55) return "from-amber-300/80 to-amber-200/60";
  return "from-emerald-300/80 to-emerald-200/60";
};

const StatsPanel = ({ stats }: Props) => {
  return (
    <div className="absolute top-20 left-5 z-30 w-[200px] rounded-2xl bg-white/[0.06] backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)] p-3.5 animate-fade-in">
      <div className="flex items-center justify-between mb-3 px-0.5">
        <span className="text-[10px] uppercase tracking-[0.15em] text-white/45 font-medium">Vitals</span>
        <span className="text-[10px] text-white/30">live</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {ROWS.map((r) => {
          const v = Math.round(stats[r.key]);
          const label = r.invertLabel
            ? (v >= 50 ? r.high : r.low)
            : (v >= 50 ? r.high : r.low);
          return (
            <div key={r.key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-white/75 flex items-center gap-1.5">
                  <span className="text-sm leading-none">{r.icon}</span>
                  {label}
                </span>
                <span className="text-[10px] tabular-nums text-white/40">{v}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${barColor(v)} transition-[width] duration-700 ease-out`}
                  style={{ width: `${v}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatsPanel;
