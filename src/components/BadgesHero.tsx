import { Users, Heart } from "lucide-react";
import AuraIcon from "./AuraIcon";
import TierRingCanvas from "./TierRingCanvas";
import profileAvatar from "../assets/profile-avatar.svg";
import { type EquippedBadge, getBadgeEffect } from "./ProfileBadgeShowcase";
import { type BadgeTier } from "./BadgeCard";
import { tierBadgeImages, tierBorderColors, tierBadgeGlowColors, tierLabels } from "../pages/Profile";

const statItems = [
  { icon: Users, label: "FOLLOWERS", rank: "#1,438", count: "12.4K", iconClass: "w-4 h-4 text-primary-v2" },
  { icon: AuraIcon, label: "AURA", rank: "#892", count: "450", iconClass: "w-5 h-5 text-purple-500" },
  { icon: Heart, label: "LIKES", rank: "#2,105", count: "8.2K", iconClass: "w-4 h-4 text-red-500 fill-red-500" },
];

const BadgesHero = ({ activeBadge, tier = "legend" }: { activeBadge?: EquippedBadge | null; tier?: BadgeTier }) => {
  const badgeEffect = activeBadge ? getBadgeEffect(activeBadge.name) : null;
  const tierGlowColor = tierBadgeGlowColors[tier];
  const tierBorderColor = tierBorderColors[tier];
  const tierBadgeImg = tierBadgeImages[tier];
  const tierLabel = tierLabels[tier];
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-border-v2/30"
      style={{ backgroundColor: "hsl(var(--popover-v2))" }}
    >
      {/* Soft gold ambient glow */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-30"
        style={{ background: badgeEffect?.glowColor ?? tierGlowColor }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-20 h-72 w-72 rounded-full blur-3xl opacity-20"
        style={{ background: "hsl(213 100% 50%)" }}
      />

      <div className="relative flex flex-col md:flex-row md:items-center gap-6 md:gap-8 px-3 py-5 sm:p-6 md:p-8">
        {/* Avatar + tier ring */}
        <div className="flex flex-col items-center md:items-start md:shrink-0">
          <div
            className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40"
            style={{ overflow: "visible" }}
          >
            {activeBadge && badgeEffect ? (
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  inset: "-4px",
                  border: `3px solid ${badgeEffect.glowColor}`,
                  boxShadow: `0 0 15px ${badgeEffect.glowColor.replace(")", " / 0.5)")}, 0 0 30px ${badgeEffect.glowColor.replace(")", " / 0.25)")}`,
                  animation: "badge-border-pulse 2.5s ease-in-out infinite",
                  zIndex: 2,
                }}
              />
            ) : (
              <TierRingCanvas tier={tier} />
            )}
            <div className="absolute inset-[4px] rounded-full overflow-hidden z-[1]">
              <img src={profileAvatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-12 h-12 sm:w-16 sm:h-16 z-[2]">
              <img
                src={activeBadge?.imageUrl ?? tierBadgeImg}
                alt={activeBadge?.name ?? `${tierLabel} badge`}
                className="relative z-10 w-full h-full object-contain"
                style={{ filter: `drop-shadow(0 0 14px ${badgeEffect?.glowColor ?? tierGlowColor})` }}
              />
            </div>
          </div>
        </div>

        {/* Right side: tier label + stats */}
        <div className="flex-1 min-w-0 flex flex-col gap-4 md:gap-5 w-full">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-[11px] text-muted-v2-foreground uppercase tracking-[0.2em] font-medium">
              Current tier
            </span>
            <span
              className="text-3xl md:text-4xl font-bold uppercase tracking-wide leading-none"
              style={{ color: tierBorderColor }}
            >
              {tierLabel}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-3 w-full">
            {statItems.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center md:items-start gap-0.5 sm:gap-1 rounded-xl p-2 sm:p-4 border border-border-v2/30 bg-background-v2/40 backdrop-blur-sm min-w-0"
              >
                <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                  <stat.icon className={stat.iconClass} />
                  <span className="text-[9px] sm:text-[10px] text-muted-v2-foreground uppercase tracking-wider font-medium truncate">
                    {stat.label}
                  </span>
                </div>
                <span className="text-foreground-v2 font-bold text-lg sm:text-2xl leading-tight tabular-nums whitespace-nowrap">
                  {stat.count}
                </span>
                <span className="text-[9px] sm:text-[10px] text-muted-v2-foreground/60 font-medium truncate max-w-full">
                  Rank {stat.rank}
                </span>
              </div>
            ))}
          </div>

          {/* Secondary meta stats */}
          <div className="flex items-stretch justify-center md:justify-start rounded-xl border border-border-v2/30 bg-background-v2/40 backdrop-blur-sm overflow-hidden divide-x divide-border-v2/30 w-full">
            {[
              { value: "14,412", label: "Interactions" },
              { value: "86", label: "Videos" },
              { value: "37", label: "Images" },
            ].map((m) => (
              <div
                key={m.label}
                className="flex flex-col items-center md:items-start gap-0.5 px-2 sm:px-4 py-2 flex-1 min-w-0"
              >
                <span className="font-bold text-foreground-v2 text-sm sm:text-base leading-none tabular-nums">
                  {m.value}
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-v2-foreground font-medium truncate max-w-full">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgesHero;
