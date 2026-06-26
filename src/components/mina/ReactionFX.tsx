import { useEffect, useState } from "react";
import type { Sentiment } from "./ChatComposer";

interface Burst {
  id: number;
  sentiment: Sentiment;
}

interface Props {
  /** Increment this number to trigger a new burst */
  trigger: number;
  sentiment: Sentiment;
}

const EMOJI: Record<Sentiment, string[]> = {
  love:    ["❤️", "💖", "💗", "💞", "💘"],
  like:    ["✨", "💕", "🌸", "💫", "😊"],
  neutral: ["·", "✦", "○"],
  dislike: ["💢", "😒", "🌧️", "💧"],
  hate:    ["💔", "⚡", "🌩️", "😠"],
};

const COLOR: Record<Sentiment, string> = {
  love:    "hsl(340 90% 65%)",
  like:    "hsl(290 80% 70%)",
  neutral: "hsl(220 10% 70%)",
  dislike: "hsl(220 25% 55%)",
  hate:    "hsl(220 30% 35%)",
};

const ReactionFX = ({ trigger, sentiment }: Props) => {
  const [bursts, setBursts] = useState<Burst[]>([]);

  useEffect(() => {
    if (trigger <= 0 || sentiment === "neutral") return;
    const b: Burst = { id: Date.now() + Math.random(), sentiment };
    setBursts((p) => [...p, b]);
    const t = window.setTimeout(() => {
      setBursts((p) => p.filter((x) => x.id !== b.id));
    }, 2400);
    return () => window.clearTimeout(t);
  }, [trigger, sentiment]);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
      {bursts.map((b) => {
        const emojis = EMOJI[b.sentiment];
        const count = b.sentiment === "love" || b.sentiment === "hate" ? 10 : 7;
        const glow = COLOR[b.sentiment];
        const negative = b.sentiment === "dislike" || b.sentiment === "hate";
        return (
          <div key={b.id} className="absolute inset-0">
            {/* Aura flash behind character */}
            <div
              className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[55%] aspect-square rounded-full blur-3xl mina-aura"
              style={{ background: `radial-gradient(circle, ${glow}55 0%, transparent 65%)` }}
            />
            {/* Particles */}
            {Array.from({ length: count }).map((_, i) => {
              const dx = (Math.random() - 0.5) * 220;
              const dy = negative ? 140 + Math.random() * 120 : -(160 + Math.random() * 160);
              const rot = (Math.random() - 0.5) * 80;
              const delay = Math.random() * 250;
              const size = 22 + Math.random() * 18;
              const ch = emojis[Math.floor(Math.random() * emojis.length)];
              return (
                <span
                  key={i}
                  className="absolute left-1/2 top-[48%] select-none mina-particle"
                  style={{
                    fontSize: `${size}px`,
                    animationDelay: `${delay}ms`,
                    // pass deltas to CSS as custom props
                    ["--dx" as any]: `${dx}px`,
                    ["--dy" as any]: `${dy}px`,
                    ["--rot" as any]: `${rot}deg`,
                    filter: `drop-shadow(0 4px 14px ${glow}aa)`,
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </div>
        );
      })}

      <style>{`
        @keyframes minaAura {
          0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.6); }
          25%  { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.4); }
        }
        .mina-aura { animation: minaAura 2.2s ease-out forwards; }

        @keyframes minaParticle {
          0%   { opacity: 0; transform: translate(-50%, 0) scale(0.4) rotate(0deg); }
          15%  { opacity: 1; transform: translate(-50%, 0) scale(1) rotate(0deg); }
          100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), var(--dy)) scale(1.1) rotate(var(--rot)); }
        }
        .mina-particle { animation: minaParticle 2.2s cubic-bezier(0.2, 0.7, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default ReactionFX;
