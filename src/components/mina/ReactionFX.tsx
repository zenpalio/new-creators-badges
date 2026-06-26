import { useEffect, useState } from "react";
import type { Sentiment } from "./ChatComposer";

type StatKey = "affection" | "joy" | "arousal" | "comfort" | "calm" | "energy" | "hunger";

interface Burst {
  id: number;
  sentiment: Sentiment;
  deltas: Partial<Record<StatKey, number>>;
}

interface Props {
  /** Increment this number to trigger a new burst */
  trigger: number;
  sentiment: Sentiment;
  deltas?: Partial<Record<StatKey, number>>;
}

const SENTIMENT_EMOJI: Record<Sentiment, string> = {
  love: "❤️",
  like: "✨",
  neutral: "·",
  dislike: "💧",
  hate: "💔",
};

const SENTIMENT_GLOW: Record<Sentiment, string> = {
  love:    "hsl(340 90% 65%)",
  like:    "hsl(290 80% 70%)",
  neutral: "hsl(220 10% 70%)",
  dislike: "hsl(220 25% 55%)",
  hate:    "hsl(220 30% 35%)",
};

const STAT_META: Record<StatKey, { label: string; icon: string }> = {
  affection: { label: "Affection", icon: "❤️" },
  joy:       { label: "Joy",       icon: "✨" },
  arousal:   { label: "Arousal",   icon: "🔥" },
  comfort:   { label: "Comfort",   icon: "🫶" },
  calm:      { label: "Calm",      icon: "🌿" },
  energy:    { label: "Energy",    icon: "⚡" },
  hunger:    { label: "Hunger",    icon: "🍱" },
};

// Threshold below which we hide a delta to reduce noise.
const NOISE = 1;

const ReactionFX = ({ trigger, sentiment, deltas }: Props) => {
  const [bursts, setBursts] = useState<Burst[]>([]);

  useEffect(() => {
    if (trigger <= 0) return;
    const filtered: Partial<Record<StatKey, number>> = {};
    Object.entries(deltas ?? {}).forEach(([k, v]) => {
      if (typeof v === "number" && Math.abs(v) >= NOISE) filtered[k as StatKey] = v;
    });
    // Skip rendering entirely if nothing meaningful happened
    if (sentiment === "neutral" && Object.keys(filtered).length === 0) return;

    const b: Burst = { id: Date.now() + Math.random(), sentiment, deltas: filtered };
    setBursts((p) => [...p, b]);
    const t = window.setTimeout(() => {
      setBursts((p) => p.filter((x) => x.id !== b.id));
    }, 3200);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
      {bursts.map((b) => {
        const glow = SENTIMENT_GLOW[b.sentiment];
        // Sort: affection first, then by magnitude desc
        const entries = Object.entries(b.deltas).sort(([a, av], [bk, bv]) => {
          if (a === "affection") return -1;
          if (bk === "affection") return 1;
          return Math.abs(bv as number) - Math.abs(av as number);
        }) as [StatKey, number][];

        return (
          <div key={b.id} className="absolute inset-0">
            {/* Soft aura halo behind character — subtle, single pulse */}
            <div
              className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 w-[45%] aspect-square rounded-full blur-3xl mina-aura-soft"
              style={{ background: `radial-gradient(circle, ${glow}40 0%, transparent 70%)` }}
            />

            {/* Big single sentiment glyph that drifts up — only one, no spam */}
            {b.sentiment !== "neutral" && (
              <div
                className="absolute left-1/2 top-[38%] -translate-x-1/2 mina-sentiment select-none"
                style={{
                  fontSize: "64px",
                  filter: `drop-shadow(0 8px 24px ${glow}cc)`,
                }}
              >
                {SENTIMENT_EMOJI[b.sentiment]}
              </div>
            )}

            {/* Numeric delta chips — stacked, readable, one per stat changed */}
            <div className="absolute left-1/2 top-[44%] -translate-x-1/2 flex flex-col gap-1.5 items-center">
              {entries.map(([key, val], i) => {
                const positive = val > 0;
                const sign = positive ? "+" : "";
                const meta = STAT_META[key];
                return (
                  <div
                    key={key}
                    className="mina-chip flex items-center gap-1.5 pl-2 pr-2.5 h-7 rounded-full bg-black/40 backdrop-blur-xl border border-white/15 shadow-[0_6px_20px_rgba(0,0,0,0.5)]"
                    style={{ animationDelay: `${i * 90}ms` }}
                  >
                    <span className="text-sm leading-none">{meta.icon}</span>
                    <span
                      className={`text-[11px] font-semibold tabular-nums ${
                        positive ? "text-emerald-300" : "text-rose-300"
                      }`}
                    >
                      {sign}{val}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-white/70">
                      {meta.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes minaAuraSoft {
          0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.7); }
          30%  { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.25); }
        }
        .mina-aura-soft { animation: minaAuraSoft 2.6s ease-out forwards; }

        @keyframes minaSentiment {
          0%   { opacity: 0; transform: translate(-50%, 20px) scale(0.5); }
          20%  { opacity: 1; transform: translate(-50%, 0) scale(1); }
          70%  { opacity: 1; transform: translate(-50%, -30px) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -70px) scale(0.95); }
        }
        .mina-sentiment { animation: minaSentiment 2.8s cubic-bezier(0.2, 0.7, 0.3, 1) forwards; }

        @keyframes minaChip {
          0%   { opacity: 0; transform: translateY(12px) scale(0.9); }
          15%  { opacity: 1; transform: translateY(0) scale(1); }
          75%  { opacity: 1; transform: translateY(-6px) scale(1); }
          100% { opacity: 0; transform: translateY(-22px) scale(0.96); }
        }
        .mina-chip { animation: minaChip 3s cubic-bezier(0.2, 0.7, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default ReactionFX;
