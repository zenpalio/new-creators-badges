import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Activity } from "lucide-react";
import type { MoodStats } from "@/hooks/useCompanion";

type StatKey = keyof MoodStats | "affection";
type TabId = "body" | "heart" | "desire";

interface Props {
  stats: MoodStats;
  affection: number;
  pulseTrigger?: number;
  pulseDeltas?: Partial<Record<StatKey, number>>;
}

type Row = {
  key: StatKey;
  high: string;
  low: string;
  icon: string;
  /** When true, label flips: high value = "low" word (e.g. arousal 90 = "Horny" already feels right; this is for stress/jealousy etc.) */
  invert?: boolean;
};

const TABS: { id: TabId; label: string; icon: string; rows: Row[] }[] = [
  {
    id: "body",
    label: "Body",
    icon: "🌿",
    rows: [
      { key: "hunger",     icon: "🍱", high: "Full",       low: "Hungry"   },
      { key: "energy",     icon: "⚡", high: "Energized",  low: "Drained"  },
      { key: "sleepiness", icon: "😴", high: "Drowsy",     low: "Wide awake", invert: true },
      { key: "hygiene",    icon: "🛁", high: "Fresh",      low: "Grimy"    },
      { key: "comfort",    icon: "🫶", high: "Cozy",       low: "Lonely"   },
      { key: "calm",       icon: "🌊", high: "Serene",     low: "Nervous"  },
    ],
  },
  {
    id: "heart",
    label: "Heart",
    icon: "💗",
    rows: [
      { key: "affection",  icon: "💖", high: "Smitten",    low: "Distant"  },
      { key: "joy",        icon: "✨", high: "Happy",      low: "Sad"      },
      { key: "trust",      icon: "🔐", high: "Open",       low: "Guarded"  },
      { key: "shyness",    icon: "🙈", high: "Blushing",   low: "Bold",     invert: true },
      { key: "jealousy",   icon: "😤", high: "Seething",   low: "Secure",   invert: true },
      { key: "loneliness", icon: "🌙", high: "Aching",     low: "Content",  invert: true },
      { key: "stress",     icon: "🌀", high: "Overwhelmed",low: "Relaxed",  invert: true },
    ],
  },
  {
    id: "desire",
    label: "Desire",
    icon: "🔥",
    rows: [
      { key: "arousal",    icon: "🔥", high: "Horny",      low: "Cool"     },
      { key: "lust",       icon: "🍒", high: "Craving",    low: "Sated"    },
      { key: "wetness",    icon: "💧", high: "Soaked",     low: "Dry"      },
      { key: "obedience",  icon: "😈", high: "Compliant",  low: "Bratty"   },
      { key: "dominance",  icon: "👑", high: "In Control", low: "Yielding" },
    ],
  },
];

const barColor = (v: number, invert?: boolean) => {
  const score = invert ? 100 - v : v;
  if (score < 25) return "from-rose-400/80 to-rose-300/60";
  if (score < 55) return "from-amber-300/80 to-amber-200/60";
  return "from-emerald-300/80 to-emerald-200/60";
};

const NOISE = 1;

const StatsPanel = ({ stats, affection, pulseTrigger = 0, pulseDeltas }: Props) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabId>("heart");
  const [activeDeltas, setActiveDeltas] = useState<Partial<Record<StatKey, number>>>({});
  const [pulseId, setPulseId] = useState(0);
  const autoCloseRef = useRef<number | null>(null);

  const getValue = (key: StatKey): number =>
    key === "affection" ? affection : (stats as any)[key];

  // Auto-switch to the tab containing the strongest delta and surface chips.
  useEffect(() => {
    if (!pulseTrigger || !pulseDeltas) return;
    const filtered: Partial<Record<StatKey, number>> = {};
    let strongestKey: StatKey | null = null;
    let strongestAbs = 0;
    (Object.keys(pulseDeltas) as StatKey[]).forEach((k) => {
      const v = pulseDeltas[k];
      if (typeof v === "number" && Math.abs(v) >= NOISE) {
        filtered[k] = v;
        if (Math.abs(v) > strongestAbs) {
          strongestAbs = Math.abs(v);
          strongestKey = k;
        }
      }
    });
    if (!strongestKey) return;
    setActiveDeltas(filtered);
    setPulseId((n) => n + 1);
    setOpen(true);
    const owner = TABS.find((t) => t.rows.some((r) => r.key === strongestKey));
    if (owner) setTab(owner.id);

    if (autoCloseRef.current) window.clearTimeout(autoCloseRef.current);
    const clearT = window.setTimeout(() => setActiveDeltas({}), 2400);
    return () => window.clearTimeout(clearT);
  }, [pulseTrigger]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeTab = TABS.find((t) => t.id === tab) ?? TABS[1];

  return (
    <div className="absolute top-5 left-3 sm:left-5 z-30 animate-fade-in">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Show vitals"
          className="h-9 w-9 rounded-full border border-white/15 bg-white/[0.08] backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.4)] text-white/80 hover:bg-white/15 transition flex items-center justify-center"
        >
          <Activity className="w-4 h-4" />
        </button>
      )}

      {open && (
        <div className="w-[230px] sm:w-[250px] rounded-2xl bg-white/[0.06] backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)] p-3 sm:p-3.5">
          <div className="flex items-center justify-between mb-2.5 px-0.5">
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/45 font-medium">Vitals</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Hide vitals"
              className="text-white/40 hover:text-white/80 transition-colors -mr-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-3 p-1 rounded-full bg-white/[0.04] border border-white/5">
            {TABS.map((t) => {
              const active = t.id === tab;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 h-7 rounded-full text-[10px] font-semibold uppercase tracking-wider transition flex items-center justify-center gap-1 ${
                    active
                      ? "bg-white/15 text-white shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                      : "text-white/45 hover:text-white/75"
                  }`}
                >
                  <span className="text-[11px] leading-none">{t.icon}</span>
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 sm:gap-2.5">
            {activeTab.rows.map((r) => {
              const v = Math.round(getValue(r.key));
              const label = (r.invert ? v < 50 : v >= 50) ? r.high : r.low;
              const delta = activeDeltas[r.key];
              const hasDelta = typeof delta === "number" && Math.abs(delta) >= NOISE;
              const pos = (delta ?? 0) > 0;
              const prev = hasDelta ? Math.max(0, Math.min(100, v - (delta as number))) : v;
              return (
                <div key={r.key} className={hasDelta ? "stat-row-pulse" : undefined}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-white/75 flex items-center gap-1.5">
                      <span className="text-sm leading-none">{r.icon}</span>
                      {label}
                    </span>
                    <span className="flex items-center gap-1.5">
                      {hasDelta && (
                        <span
                          key={`${pulseId}-${r.key}`}
                          className={`stat-delta text-[10px] font-extrabold tabular-nums px-1.5 py-px rounded-full ${
                            pos
                              ? "bg-emerald-400/20 text-emerald-200 border border-emerald-300/40"
                              : "bg-rose-400/20 text-rose-200 border border-rose-300/40"
                          }`}
                          style={{
                            boxShadow: pos
                              ? "0 0 10px hsl(140 90% 60% / 0.55)"
                              : "0 0 10px hsl(0 90% 60% / 0.55)",
                          }}
                        >
                          {pos ? "+" : ""}{delta}
                        </span>
                      )}
                      <span className="text-[10px] tabular-nums text-white/40">{v}</span>
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden relative">
                    <div
                      key={hasDelta ? `${pulseId}-bar-${r.key}` : `bar-${r.key}`}
                      className={`h-full rounded-full bg-gradient-to-r ${barColor(v, r.invert)} transition-[width] duration-[900ms] ease-out`}
                      style={{
                        width: `${v}%`,
                        animation: hasDelta
                          ? `statBarPulse 900ms ease-out, statBarGlow${pos ? "Pos" : "Neg"} 1.2s ease-out`
                          : undefined,
                        // @ts-ignore
                        ["--from-w" as any]: `${prev}%`,
                        ["--to-w" as any]: `${v}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <style>{`
            @keyframes statBarPulse {
              0%   { width: var(--from-w); }
              100% { width: var(--to-w); }
            }
            @keyframes statBarGlowPos {
              0%   { filter: drop-shadow(0 0 0 hsl(140 90% 60% / 0)); }
              30%  { filter: drop-shadow(0 0 8px hsl(140 90% 60% / 0.9)); }
              100% { filter: drop-shadow(0 0 0 hsl(140 90% 60% / 0)); }
            }
            @keyframes statBarGlowNeg {
              0%   { filter: drop-shadow(0 0 0 hsl(0 90% 60% / 0)); }
              30%  { filter: drop-shadow(0 0 8px hsl(0 90% 60% / 0.9)); }
              100% { filter: drop-shadow(0 0 0 hsl(0 90% 60% / 0)); }
            }
            @keyframes statDeltaPop {
              0%   { opacity: 0; transform: translateX(6px) scale(0.7); }
              25%  { opacity: 1; transform: translateX(0) scale(1.15); }
              80%  { opacity: 1; transform: translateX(0) scale(1); }
              100% { opacity: 0; transform: translateX(0) scale(0.95); }
            }
            .stat-delta { animation: statDeltaPop 2.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
            @keyframes statRowFlash {
              0%, 100% { background: transparent; }
              20%      { background: rgba(255,255,255,0.04); }
            }
            .stat-row-pulse { animation: statRowFlash 1.2s ease-out; border-radius: 6px; }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default StatsPanel;
