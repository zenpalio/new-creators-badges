import { Users, Heart } from "lucide-react";
import AuraIcon from "./AuraIcon";
import TierRingCanvas from "./TierRingCanvas";
import charLegend from "../assets/badges/char-legend.png";
import profileAvatar from "../assets/profile-avatar.svg";

const tierBorderColor = "hsl(43 96% 58%)";
const tierGlowColor = "hsl(43 96% 58%)";

const statItems = [
  { icon: Users, label: "FOLLOWERS", rank: "#1,438", count: "12.4K", iconClass: "w-4 h-4 text-primary-v2 mb-0.5" },
  { icon: AuraIcon, label: "AURA", rank: "#892", count: "450", iconClass: "w-5 h-5 text-purple-500 mb-0.5" },
  { icon: Heart, label: "LIKES", rank: "#2,105", count: "8.2K", iconClass: "w-4 h-4 text-red-500 fill-red-500 mb-0.5" },
];

const BadgesHero = () => {
  return (
    <div className="w-full">
      <div className="relative flex flex-col items-center mb-6">
        <div
          className="relative mb-3 w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40"
          style={{ overflow: "visible", margin: "12px auto" }}
        >
          <TierRingCanvas tier="legend" />
          <div className="absolute inset-[4px] rounded-full overflow-hidden z-[1]">
            <img src={profileAvatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-12 h-12 sm:w-16 sm:h-16 z-[2]">
            <img
              src={charLegend}
              alt="Legend badge"
              className="relative z-10 w-full h-full object-contain"
              style={{ filter: `drop-shadow(0 0 14px ${tierGlowColor})` }}
            />
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-lg font-bold uppercase tracking-wide" style={{ color: tierBorderColor }}>
            Legend
          </span>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-[11px] text-muted-v2-foreground uppercase tracking-wider font-medium mb-2 px-1">
          Ranking
        </p>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {statItems.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 rounded-xl p-3 sm:p-4 border border-border-v2/30"
              style={{ backgroundColor: "hsl(var(--popover-v2))", backgroundImage: "none" }}
            >
              <stat.icon className={stat.iconClass} />
              <span className="text-[10px] text-muted-v2-foreground uppercase tracking-wider font-medium">
                {stat.label}
              </span>
              <span className="text-foreground-v2 font-bold text-lg sm:text-xl leading-tight">{stat.count}</span>
              <span className="text-[10px] text-muted-v2-foreground/60 font-medium">Rank {stat.rank}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BadgesHero;
