import { useEffect, useState } from "react";
import type { Sentiment } from "./ChatComposer";
import { playReactionSound } from "./reactionSounds";

type StatKey = "affection" | "joy" | "arousal" | "comfort" | "calm" | "energy" | "hunger";

interface Particle {
  id: number;
  emoji: string;
  startX: number;
  startY: number;
  /** horizontal velocity (px over duration) */
  vx: number;
  /** initial upward velocity */
  vy: number;
  /** gravity acceleration applied during animation */
  g: number;
  size: number;
  rotate: number;
  spin: number;
  delay: number;
  duration: number;
}

interface Burst {
  id: number;
  sentiment: Sentiment;
  particles: Particle[];
  chips: { key: StatKey; val: number }[];
  bannerWord: string | null;
  bannerEmoji: string;
}

interface Props {
  trigger: number;
  sentiment: Sentiment;
  deltas?: Partial<Record<StatKey, number>>;
}

const SENTIMENT_EMOJIS: Record<Sentiment, string[]> = {
  love:    ["❤️", "💖", "💕", "✨", "💗", "🌹", "💞", "💘", "😍"],
  like:    ["✨", "💫", "🌟", "💗", "😊", "🥰", "💛"],
  neutral: ["·", "💭"],
  dislike: ["💧", "😕", "😬", "💨"],
  hate:    ["💔", "😡", "💢", "🌧️", "⚡", "😤"],
};

const SENTIMENT_COLOR: Record<Sentiment, string> = {
  love:    "hsl(340 95% 65%)",
  like:    "hsl(50 95% 65%)",
  neutral: "hsl(220 10% 70%)",
  dislike: "hsl(220 30% 55%)",
  hate:    "hsl(0 85% 60%)",
};

const SENTIMENT_BANNER: Record<Sentiment, string | null> = {
  love:    "Loves it!",
  like:    "Likes it",
  neutral: null,
  dislike: "Hmph…",
  hate:    "Furious!",
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
    // Spawn in a tight cluster around head, then explode outward
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.6; // mostly upward fan
    const speed = 90 + Math.random() * 160;
    const startX = (Math.random() - 0.5) * 40;
    const startY = (Math.random() - 0.5) * 20;
    out.push({
      id: i,
      emoji: pool[Math.floor(Math.random() * pool.length)],
      startX,
      startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 30,
      g: 180 + Math.random() * 120,
      size: 22 + Math.random() * 22,
      rotate: (Math.random() - 0.5) * 60,
      spin: (Math.random() - 0.5) * 720,
      delay: Math.random() * 220,
      duration: 1600 + Math.random() * 900,
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

    const count =
      sentiment === "love" ? 16 :
      sentiment === "like" ? 11 :
      sentiment === "hate" ? 14 :
      sentiment === "dislike" ? 7 : 5;

    const pool = SENTIMENT_EMOJIS[sentiment];
    const b: Burst = {
      id: Date.now() + Math.random(),
      sentiment,
      particles: spawnParticles(sentiment, count),
      chips: chips.slice(0, 3),
      bannerWord: SENTIMENT_BANNER[sentiment],
      bannerEmoji: pool[0],
    };
    setBursts((p) => [...p, b]);
    try { playReactionSound(sentiment); } catch {}
    const t = window.setTimeout(() => {
      setBursts((p) => p.filter((x) => x.id !== b.id));
    }, 3600);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
      {bursts.map((b) => {
        const color = SENTIMENT_COLOR[b.sentiment];
        const positive = b.sentiment === "love" || b.sentiment === "like";
        return (
          <div key={b.id} className="absolute inset-0">
            {/* Edge vignette flash */}
            <div
              className="absolute inset-0 mina-vignette"
              style={{ background: `radial-gradient(ellipse at center, transparent 55%, ${color}33 100%)` }}
            />

            {/* Confetti shockwave ring */}
            <div
              className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 w-[80px] h-[80px] rounded-full mina-shockwave"
              style={{ border: `3px solid ${color}` }}
            />

            {/* Soft aura halo behind head */}
            <div
              className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full blur-3xl mina-aura"
              style={{ background: `radial-gradient(circle, ${color}66 0%, transparent 65%)` }}
            />

            {/* Plumbob — glowing diamond above head, color pulses with mood */}
            <div className="absolute left-1/2 top-[12%] -translate-x-1/2 mina-plumbob">
              <div
                className="w-6 h-6 rotate-45 rounded-sm"
                style={{
                  background: `linear-gradient(135deg, ${color}, ${color}99)`,
                  boxShadow: `0 0 24px ${color}cc, 0 0 60px ${color}99, inset 0 0 8px rgba(255,255,255,0.7)`,
                }}
              />
            </div>

            {/* Confetti emoji particles with physics arcs */}
            <div className="absolute left-1/2 top-[32%]">
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
                    ["--vx" as any]: `${p.vx}px`,
                    ["--vy" as any]: `${p.vy}px`,
                    ["--g" as any]: `${p.g}px`,
                    ["--rot" as any]: `${p.rotate}deg`,
                    ["--spin" as any]: `${p.spin}deg`,
                    animationDelay: `${p.delay}ms`,
                    animationDuration: `${p.duration}ms`,
                    filter: `drop-shadow(0 4px 14px ${color}cc)`,
                  }}
                >
                  {p.emoji}
                </span>
              ))}
            </div>

            {/* Sparkle dots */}
            <div className="absolute left-1/2 top-[30%]">
              {Array.from({ length: 8 }).map((_, i) => {
                const a = (i / 8) * Math.PI * 2;
                const r = 80 + Math.random() * 60;
                return (
                  <span
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full mina-sparkle"
                    style={{
                      left: 0,
                      top: 0,
                      ["--tx" as any]: `${Math.cos(a) * r}px`,
                      ["--ty" as any]: `${Math.sin(a) * r}px`,
                      animationDelay: `${i * 60}ms`,
                      background: color,
                      boxShadow: `0 0 12px ${color}`,
                    }}
                  />
                );
              })}
            </div>

            {/* Big banner word */}
            {b.bannerWord && (
              <div
                className="absolute left-1/2 top-[22%] -translate-x-1/2 mina-banner select-none"
                style={{
                  fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive",
                  fontSize: "44px",
                  fontWeight: 700,
                  color: "#fff",
                  textShadow: `0 0 18px ${color}, 0 0 36px ${color}aa, 0 3px 0 rgba(0,0,0,0.35)`,
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap",
                }}
              >
                {b.bannerWord}
              </div>
            )}

            {/* Stat delta chips with bounce */}
            <div className="absolute left-1/2 top-[16%] -translate-x-1/2 flex flex-col items-center gap-1.5">
              {b.chips.map((c, i) => {
                const pos = c.val > 0;
                return (
                  <div
                    key={c.key}
                    className="mina-chip flex items-center gap-1.5 pl-2 pr-3 h-9 rounded-full bg-black/55 backdrop-blur-xl border-2 shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
                    style={{
                      animationDelay: `${i * 130 + 120}ms`,
                      borderColor: pos ? "hsl(140 85% 60%)" : "hsl(0 85% 62%)",
                      boxShadow: `0 0 22px ${pos ? "hsl(140 85% 60% / 0.55)" : "hsl(0 85% 62% / 0.55)"}, 0 8px 24px rgba(0,0,0,0.6)`,
                    }}
                  >
                    <span className="text-base leading-none">{STAT_ICON[c.key]}</span>
                    <span
                      className={`text-base font-extrabold tabular-nums ${pos ? "text-emerald-200" : "text-rose-200"}`}
                      style={{ textShadow: pos
                        ? "0 0 14px hsl(140 90% 60% / 0.9)"
                        : "0 0 14px hsl(0 90% 60% / 0.9)" }}
                    >
                      {pos ? "+" : ""}{c.val}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-white/75 capitalize">
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
        @keyframes minaVignette {
          0%   { opacity: 0; }
          15%  { opacity: 1; }
          100% { opacity: 0; }
        }
        .mina-vignette { animation: minaVignette 1.4s ease-out forwards; }

        @keyframes minaShockwave {
          0%   { opacity: 0.9; transform: translate(-50%, -50%) scale(0.2); border-width: 4px; }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(5); border-width: 0.5px; }
        }
        .mina-shockwave { animation: minaShockwave 1s cubic-bezier(0.2, 0.7, 0.3, 1) forwards; }

        @keyframes minaAura {
          0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.6); }
          25%  { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.35); }
        }
        .mina-aura { animation: minaAura 2.6s ease-out forwards; }

        @keyframes minaPlumbob {
          0%   { opacity: 0; transform: translate(-50%, 16px) scale(0.4); }
          18%  { opacity: 1; transform: translate(-50%, -4px) scale(1.15); }
          30%  { transform: translate(-50%, 0) scale(1); }
          70%  { transform: translate(-50%, -4px) scale(1.05); }
          100% { opacity: 0; transform: translate(-50%, -16px) scale(0.95); }
        }
        .mina-plumbob { animation: minaPlumbob 3.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

        @keyframes minaParticle {
          0% {
            opacity: 0;
            transform: translate(var(--sx), var(--sy)) scale(0.3) rotate(0deg);
          }
          12% {
            opacity: 1;
            transform: translate(calc(var(--sx) + var(--vx) * 0.12), calc(var(--sy) + var(--vy) * 0.12 + var(--g) * 0.007)) scale(1.15) rotate(calc(var(--spin) * 0.12));
          }
          100% {
            opacity: 0;
            transform: translate(calc(var(--sx) + var(--vx)), calc(var(--sy) + var(--vy) + var(--g))) scale(0.7) rotate(var(--spin));
          }
        }
        .mina-particle {
          animation-name: minaParticle;
          animation-timing-function: cubic-bezier(0.2, 0.7, 0.3, 1);
          animation-fill-mode: forwards;
          will-change: transform, opacity;
        }

        @keyframes minaSparkle {
          0%   { opacity: 0; transform: translate(0, 0) scale(0.2); }
          25%  { opacity: 1; transform: translate(calc(var(--tx) * 0.6), calc(var(--ty) * 0.6)) scale(1.4); }
          100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0.4); }
        }
        .mina-sparkle { animation: minaSparkle 1.4s ease-out forwards; }

        @keyframes minaBanner {
          0%   { opacity: 0; transform: translate(-50%, 30px) rotate(-8deg) scale(0.6); }
          18%  { opacity: 1; transform: translate(-50%, -6px) rotate(-4deg) scale(1.15); }
          30%  { transform: translate(-50%, 0) rotate(-3deg) scale(1); }
          75%  { opacity: 1; transform: translate(-50%, -6px) rotate(-3deg) scale(1.02); }
          100% { opacity: 0; transform: translate(-50%, -28px) rotate(-2deg) scale(0.95); }
        }
        .mina-banner { animation: minaBanner 2.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

        @keyframes minaChip {
          0%   { opacity: 0; transform: translateY(20px) scale(0.7); }
          12%  { opacity: 1; transform: translateY(-4px) scale(1.12); }
          22%  { transform: translateY(0) scale(1); }
          75%  { opacity: 1; transform: translateY(-6px) scale(1); }
          100% { opacity: 0; transform: translateY(-36px) scale(0.95); }
        }
        .mina-chip { animation: minaChip 3.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>
    </div>
  );
};

export default ReactionFX;
