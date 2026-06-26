import { useEffect, useState } from "react";
import type { Sentiment } from "./ChatComposer";

type StatKey = "affection" | "joy" | "arousal" | "comfort" | "calm" | "energy" | "hunger";

interface Particle {
  id: number;
  emoji: string;
  /** start offset from head center, px */
  startX: number;
  startY: number;
  /** end offset relative to start, px */
  driftX: number;
  driftY: number;
  size: number;
  rotate: number;
  delay: number;
  duration: number;
}

interface Burst {
  id: number;
  sentiment: Sentiment;
  particles: Particle[];
  chips: { key: StatKey; val: number }[];
}

interface Props {
  /** Increment this number to trigger a new burst */
  trigger: number;
  sentiment: Sentiment;
  deltas?: Partial<Record<StatKey, number>>;
}

const SENTIMENT_EMOJIS: Record<Sentiment, string[]> = {
  love:    ["❤️", "💖", "💕", "✨", "💗", "🌹"],
  like:    ["✨", "💫", "🌟", "💗", "😊"],
  neutral: ["·"],
  dislike: ["💧", "😕", "·"],
  hate:    ["💔", "😞", "💢", "🌧️"],
};

const SENTIMENT_GLOW: Record<Sentiment, string> = {
  love:    "hsl(340 90% 65%)",
  like:    "hsl(290 80% 70%)",
  neutral: "hsl(220 10% 70%)",
  dislike: "hsl(220 25% 55%)",
  hate:    "hsl(220 30% 35%)",
};

const STAT_ICON: Record<StatKey, string> = {
  affection: "❤️",
  joy:       "✨",
  arousal:   "🔥",
  comfort:   "🫶",
  calm:      "🌿",
  energy:    "⚡",
  hunger:    "🍱",
};

const NOISE = 1;

function spawnParticles(sentiment: Sentiment, count: number): Particle[] {
  const pool = SENTIMENT_EMOJIS[sentiment];
  const out: Particle[] = [];
  for (let i = 0; i < count; i++) {
    // Start positions in a ring around the head (head ≈ top:30%)
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.6;
    const radius = 30 + Math.random() * 50;
    const startX = Math.cos(angle) * radius;
    const startY = Math.sin(angle) * radius * 0.7 - 10; // slight upward bias
    // Drift outward and upward
    const driftX = startX * (1.5 + Math.random() * 1.2);
    const driftY = -70 - Math.random() * 90;
    out.push({
      id: i,
      emoji: pool[Math.floor(Math.random() * pool.length)],
      startX,
      startY,
      driftX,
      driftY,
      size: 20 + Math.random() * 18,
      rotate: (Math.random() - 0.5) * 60,
      delay: Math.random() * 280,
      duration: 1800 + Math.random() * 900,
    });
  }
  return out;
}

const ReactionFX = ({ trigger, sentiment, deltas }: Props) => {
  const [bursts, setBursts] = useState<Burst[]>([]);

  useEffect(() => {
    if (trigger <= 0) return;
    const chips: { key: StatKey; val: number }[] = [];
    Object.entries(deltas ?? {}).forEach(([k, v]) => {
      if (typeof v === "number" && Math.abs(v) >= NOISE) chips.push({ key: k as StatKey, val: v });
    });
    chips.sort((a, b) => {
      if (a.key === "affection") return -1;
      if (b.key === "affection") return 1;
      return Math.abs(b.val) - Math.abs(a.val);
    });
    if (sentiment === "neutral" && chips.length === 0) return;

    // Particle count scales with positivity
    const count = sentiment === "love" ? 9 : sentiment === "like" ? 6 : sentiment === "hate" ? 7 : sentiment === "dislike" ? 4 : 3;
    const b: Burst = {
      id: Date.now() + Math.random(),
      sentiment,
      particles: spawnParticles(sentiment, count),
      chips: chips.slice(0, 3),
    };
    setBursts((p) => [...p, b]);
    const t = window.setTimeout(() => {
      setBursts((p) => p.filter((x) => x.id !== b.id));
    }, 3400);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
      {bursts.map((b) => {
        const glow = SENTIMENT_GLOW[b.sentiment];
        return (
          <div key={b.id} className="absolute inset-0">
            {/* Soft aura halo behind head */}
            <div
              className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full blur-3xl mina-aura"
              style={{ background: `radial-gradient(circle, ${glow}55 0%, transparent 65%)` }}
            />

            {/* Floating emoji particles around the head */}
            <div className="absolute left-1/2 top-[30%]">
              {b.particles.map((p) => (
                <span
                  key={p.id}
                  className="absolute select-none mina-particle"
                  style={{
                    left: 0,
                    top: 0,
                    fontSize: `${p.size}px`,
                    ["--sx" as any]: `${p.startX}px`,
                    ["--sy" as any]: `${p.startY}px`,
                    ["--dx" as any]: `${p.driftX}px`,
                    ["--dy" as any]: `${p.driftY}px`,
                    ["--rot" as any]: `${p.rotate}deg`,
                    animationDelay: `${p.delay}ms`,
                    animationDuration: `${p.duration}ms`,
                    filter: `drop-shadow(0 4px 12px ${glow}aa)`,
                  }}
                >

                  {p.emoji}
                </span>
              ))}
            </div>

            {/* Floating +N / -N chips above head */}
            <div className="absolute left-1/2 top-[18%] -translate-x-1/2 flex flex-col items-center gap-1.5">
              {b.chips.map((c, i) => {
                const positive = c.val > 0;
                return (
                  <div
                    key={c.key}
                    className="mina-chip flex items-center gap-1.5 pl-2 pr-2.5 h-8 rounded-full bg-black/45 backdrop-blur-xl border border-white/15 shadow-[0_6px_20px_rgba(0,0,0,0.55)]"
                    style={{ animationDelay: `${i * 110}ms` }}
                  >
                    <span className="text-base leading-none">{STAT_ICON[c.key]}</span>
                    <span
                      className={`text-sm font-bold tabular-nums ${
                        positive ? "text-emerald-300" : "text-rose-300"
                      }`}
                      style={{ textShadow: positive
                        ? "0 0 12px hsl(140 80% 60% / 0.6)"
                        : "0 0 12px hsl(0 80% 60% / 0.6)" }}
                    >
                      {positive ? "+" : ""}{c.val}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-white/70 capitalize">
                      {c.key}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes minaAura {
          0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.7); }
          25%  { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.3); }
        }
        .mina-aura { animation: minaAura 2.4s ease-out forwards; }

        @keyframes minaParticle {
          0%   { opacity: 0; transform: translate(var(--sx, 0), var(--sy, 0)) scale(0.4) rotate(0deg); }
          18%  { opacity: 1; transform: translate(calc(var(--sx, 0)), calc(var(--sy, 0) - 4px)) scale(1.05) rotate(calc(var(--rot) * 0.3)); }
          100% { opacity: 0; transform: translate(calc(var(--sx, 0) + var(--dx)), calc(var(--sy, 0) + var(--dy))) scale(0.6) rotate(var(--rot)); }
        }
        .mina-particle {
          --sx: 0px;
          --sy: 0px;
          animation-name: minaParticle;
          animation-timing-function: cubic-bezier(0.2, 0.7, 0.3, 1);
          animation-fill-mode: forwards;
          will-change: transform, opacity;
        }

        @keyframes minaChip {
          0%   { opacity: 0; transform: translateY(16px) scale(0.85); }
          15%  { opacity: 1; transform: translateY(0) scale(1); }
          75%  { opacity: 1; transform: translateY(-8px) scale(1); }
          100% { opacity: 0; transform: translateY(-32px) scale(0.95); }
        }
        .mina-chip { animation: minaChip 3.1s cubic-bezier(0.2, 0.7, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default ReactionFX;
