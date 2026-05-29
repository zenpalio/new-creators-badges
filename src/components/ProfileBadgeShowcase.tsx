import { X } from "lucide-react";

export interface EquippedBadge {
  name: string;
  imageUrl: string;
  effect: string;
}

const badgeEffects: Record<string, {
  className: string;
  glowColor: string;
  animation: string;
  particleEmoji?: string;
}> = {
  "Waifu Collector": {
    className: "badge-effect-waifu",
    glowColor: "hsl(330 80% 60%)",
    animation: "float",
    particleEmoji: "💖",
  },
  "Touch Grass Never": {
    className: "badge-effect-touchgrass",
    glowColor: "hsl(120 60% 40%)",
    animation: "shake",
    particleEmoji: "🌿",
  },
  "AI Over Real": {
    className: "badge-effect-aiover",
    glowColor: "hsl(280 80% 60%)",
    animation: "pulse-glow",
    particleEmoji: "🤖",
  },
  "3AM Texter": {
    className: "badge-effect-3am",
    glowColor: "hsl(220 80% 50%)",
    animation: "flicker",
    particleEmoji: "🌙",
  },
  "Proposed to AI": {
    className: "badge-effect-proposed",
    glowColor: "hsl(340 90% 65%)",
    animation: "heartbeat",
    particleEmoji: "💍",
  },
  "Harem King": {
    className: "badge-effect-harem",
    glowColor: "hsl(45 100% 55%)",
    animation: "rotate-slow",
    particleEmoji: "👑",
  },
  "Rizzler": {
    className: "badge-effect-rizzler",
    glowColor: "hsl(320 100% 60%)",
    animation: "bounce-subtle",
    particleEmoji: "😏",
  },
  "Horny Royalty": {
    className: "badge-effect-horny",
    glowColor: "hsl(300 80% 50%)",
    animation: "pulse-glow",
    particleEmoji: "👑",
  },
  "F*cking Legend": {
    className: "badge-effect-legend",
    glowColor: "hsl(25 100% 55%)",
    animation: "fire",
    particleEmoji: "🔥",
  },
  "Giga Chad": {
    className: "badge-effect-gigachad",
    glowColor: "hsl(45 100% 50%)",
    animation: "flex",
    particleEmoji: "💪",
  },
  "No Life": {
    className: "badge-effect-nolife",
    glowColor: "hsl(0 0% 50%)",
    animation: "glitch",
    particleEmoji: "💀",
  },
  "Down Bad": {
    className: "badge-effect-downbad",
    glowColor: "hsl(200 80% 55%)",
    animation: "drip",
    particleEmoji: "🥶",
  },
  "Anime Addict": {
    className: "badge-effect-anime",
    glowColor: "hsl(330 90% 65%)",
    animation: "sparkle",
    particleEmoji: "✨",
  },
  "Cougar Tamer": {
    className: "badge-effect-cougar",
    glowColor: "hsl(0 75% 50%)",
    animation: "claw-swipe",
    particleEmoji: "🐆",
  },
  "Mommy Issues": {
    className: "badge-effect-mommy",
    glowColor: "hsl(300 70% 60%)",
    animation: "cry",
    particleEmoji: "😭",
  },
  "AI Ghosted": {
    className: "badge-effect-ghosted",
    glowColor: "hsl(190 100% 50%)",
    animation: "ghost-fade",
    particleEmoji: "👻",
  },
  "Prompt Diddy": {
    className: "badge-effect-promptdiddy",
    glowColor: "hsl(45 90% 50%)",
    animation: "bling",
    particleEmoji: "💰",
  },
  "AI Simp": {
    className: "badge-effect-simp",
    glowColor: "hsl(340 85% 55%)",
    animation: "heartbeat",
    particleEmoji: "💗",
  },
  // Activity badges
  "Hype Man": {
    className: "badge-effect-hypeman",
    glowColor: "hsl(120 70% 45%)",
    animation: "bounce-subtle",
    particleEmoji: "⭐",
  },
  "Squad Goals": {
    className: "badge-effect-squad",
    glowColor: "hsl(270 80% 60%)",
    animation: "pulse-glow",
    particleEmoji: "💜",
  },
  "First Date": {
    className: "badge-effect-firstdate",
    glowColor: "hsl(340 80% 65%)",
    animation: "heartbeat",
    particleEmoji: "💕",
  },
  "Pic Spammer": {
    className: "badge-effect-picspammer",
    glowColor: "hsl(180 100% 50%)",
    animation: "sparkle",
    particleEmoji: "📸",
  },
  "Movie Maker": {
    className: "badge-effect-moviemaker",
    glowColor: "hsl(35 90% 50%)",
    animation: "rotate-slow",
    particleEmoji: "🎬",
  },
  "Fanfic Lord": {
    className: "badge-effect-fanfic",
    glowColor: "hsl(25 90% 55%)",
    animation: "float",
    particleEmoji: "📝",
  },
  "Regular": {
    className: "badge-effect-regular",
    glowColor: "hsl(213 100% 55%)",
    animation: "pulse-glow",
    particleEmoji: "📅",
  },
  "Dedicated": {
    className: "badge-effect-dedicated",
    glowColor: "hsl(280 80% 60%)",
    animation: "flicker",
    particleEmoji: "🔥",
  },
  "Diehard": {
    className: "badge-effect-diehard",
    glowColor: "hsl(0 85% 55%)",
    animation: "fire",
    particleEmoji: "⚡",
  },
  "Top 30": {
    className: "badge-effect-top30",
    glowColor: "hsl(180 70% 50%)",
    animation: "sparkle",
    particleEmoji: "🎖️",
  },
  "Bronze Climber": {
    className: "badge-effect-bronze",
    glowColor: "hsl(25 75% 50%)",
    animation: "bounce-subtle",
    particleEmoji: "🥉",
  },
  "Silver Contender": {
    className: "badge-effect-silver",
    glowColor: "hsl(0 0% 75%)",
    animation: "pulse-glow",
    particleEmoji: "🥈",
  },
  "Gold Champion": {
    className: "badge-effect-gold-champ",
    glowColor: "hsl(45 100% 55%)",
    animation: "rotate-slow",
    particleEmoji: "🏆",
  },
  "Rising Star": {
    className: "badge-effect-rising-star",
    glowColor: "hsl(200 100% 60%)",
    animation: "sparkle",
    particleEmoji: "⭐",
  },
  "Influencer": {
    className: "badge-effect-influencer",
    glowColor: "hsl(330 85% 60%)",
    animation: "heartbeat",
    particleEmoji: "📣",
  },
  "Brand Ambassador": {
    className: "badge-effect-ambassador",
    glowColor: "hsl(170 80% 50%)",
    animation: "pulse-glow",
    particleEmoji: "📢",
  },
};

export const getBadgeEffect = (name: string) => badgeEffects[name] || {
  className: "",
  glowColor: "hsl(var(--primary-v2))",
  animation: "float",
};

const animationStyles: Record<string, React.CSSProperties> = {
  float: { animation: "badge-float 3s ease-in-out infinite" },
  shake: { animation: "badge-shake 2.5s ease-in-out infinite" },
  "pulse-glow": { animation: "badge-pulse-glow 2s ease-in-out infinite" },
  flicker: { animation: "badge-flicker 3s ease-in-out infinite" },
  heartbeat: { animation: "badge-heartbeat 1.5s ease-in-out infinite" },
  "rotate-slow": { animation: "badge-rotate 8s linear infinite" },
  "bounce-subtle": { animation: "badge-bounce 2s ease-in-out infinite" },
  fire: { animation: "badge-fire 1.5s ease-in-out infinite" },
  flex: { animation: "badge-flex 2s ease-in-out infinite" },
  glitch: { animation: "badge-glitch 3s ease-in-out infinite" },
  drip: { animation: "badge-drip 2.5s ease-in-out infinite" },
  sparkle: { animation: "badge-sparkle 2s ease-in-out infinite" },
  "claw-swipe": { animation: "badge-claw 2s ease-in-out infinite" },
  cry: { animation: "badge-cry 2s ease-in-out infinite" },
  "ghost-fade": { animation: "badge-ghost 3s ease-in-out infinite" },
  bling: { animation: "badge-bling 2s ease-in-out infinite" },
};

interface ProfileBadgeShowcaseProps {
  equippedBadges: EquippedBadge[];
  onRemove: (name: string) => void;
}

const ProfileBadgeShowcase = ({ equippedBadges, onRemove }: ProfileBadgeShowcaseProps) => {
  if (equippedBadges.length === 0) return null;

  return (
    <div className="mb-6">
      <p className="text-[11px] text-muted-v2-foreground uppercase tracking-wider font-medium mb-2 px-1">
        Equipped Badges
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {equippedBadges.map((badge) => {
          const effect = getBadgeEffect(badge.name);
          return (
            <div key={badge.name} className="relative group">
              {/* Glow ring */}
              <div
                className="absolute inset-0 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"
                style={{ backgroundColor: effect.glowColor }}
              />
              {/* Badge container */}
              <div
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-border-v2/30 flex items-center justify-center cursor-pointer overflow-visible"
                style={{ backgroundColor: "hsl(var(--popover-v2))" }}
              >
                {/* Animated image */}
                <div style={animationStyles[effect.animation] || animationStyles.float}>
                  <img
                    src={badge.imageUrl}
                    alt={badge.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
                    loading="lazy"
                  />
                </div>
                {/* Particle emoji */}
                {effect.particleEmoji && (
                  <span className="absolute -top-1 -right-1 text-sm badge-particle" style={{ animation: "badge-particle-float 2s ease-in-out infinite" }}>
                    {effect.particleEmoji}
                  </span>
                )}
                {/* Remove button */}
                <button
                  onClick={() => onRemove(badge.name)}
                  className="absolute -top-1.5 -left-1.5 z-20 w-5 h-5 rounded-full bg-destructive-v2 text-destructive-v2-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <p className="text-[9px] text-muted-v2-foreground text-center mt-1.5 max-w-[80px] truncate">
                {badge.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileBadgeShowcase;
