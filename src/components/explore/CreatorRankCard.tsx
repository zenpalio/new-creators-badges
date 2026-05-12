import { ChevronRight } from "lucide-react";
import { imageSets, type BadgeTier } from "../BadgeCard";

const tierBorderColors: Record<BadgeTier, string> = {
  newbie: "hsl(25 45% 52%)",
  master: "hsl(213 100% 60%)",
  legend: "hsl(43 96% 58%)",
  elite: "hsl(213 100% 50%)",
  grandmaster: "hsl(0 82% 58%)",
  mythic: "hsl(281 85% 62%)",
  immortal: "hsl(48 96% 70%)",
};

const isHighTier = (tier: BadgeTier) =>
  ["elite", "grandmaster", "mythic", "immortal"].includes(tier);

const resolveSrc = (image: string | { src: string }) =>
  typeof image === "string" ? image : image.src;

const RankBackdrop = ({ rank }: { rank: number }) => (
  <span
    aria-hidden
    className="pointer-events-none absolute -left-1 -bottom-5 z-0 select-none font-black leading-none text-foreground-v2/[0.055]"
    style={{
      fontSize: rank >= 10 ? 118 : 142,
      fontVariantNumeric: "tabular-nums",
    }}
  >
    {rank}
  </span>
);

export interface CreatorRankCardProps {
  rank: number;
  name: string;
  avatarUrl: string;
  tier: BadgeTier;
  /** Visible tier line; when omitted, raw `tier` is shown */
  tierLabel?: string;
  verified?: boolean;
  href?: string;
  onClick?: () => void;
}

const CreatorRankCard = ({
  rank,
  name,
  avatarUrl,
  tier,
  tierLabel,
  href = "#",
  onClick,
}: CreatorRankCardProps) => {
  const borderColor = tierBorderColors[tier];
  const high = isHighTier(tier);
  const badgeSrc = resolveSrc(imageSets.aura[tier]);

  return (
    <a
      href={href}
      onClick={onClick}
      className="group relative flex w-[300px] shrink-0 items-center gap-4 overflow-hidden rounded-2xl bg-grey-dark-1-v2 pl-5 pr-4 py-3 text-left transition-colors hover:bg-grey-dark-2-v2"
    >
      <RankBackdrop rank={rank} />

      {/* Avatar with badge in bottom-right */}
      <div
        className="relative z-10 ml-8 shrink-0"
        style={{
          filter: high ? `drop-shadow(0 0 8px ${borderColor})` : "none",
        }}
      >
        <div
          className="h-16 w-16 overflow-hidden rounded-full"
          style={{ border: `2px solid ${borderColor}` }}
        >
          <img
            src={avatarUrl}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        {/* Real tier badge in bottom-right of avatar */}
        <img
          src={badgeSrc}
          alt=""
          loading="lazy"
          className="absolute -bottom-1.5 -right-2 h-7 w-7 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
        />
      </div>

      {/* Name + tier */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-bold text-white">{name}</span>
        <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-grey-light-3-v2">
          {tierLabel ?? tier}
        </span>
      </div>

      <ChevronRight className="relative z-10 h-5 w-5 text-grey-light-3-v2 transition-colors group-hover:text-white" />
    </a>
  );
};

export default CreatorRankCard;
