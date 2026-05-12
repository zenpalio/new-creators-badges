import { ChevronRight, Shield } from "lucide-react";

interface CreatorCardProps {
  name: string;
  avatarUrl: string;
  verified?: boolean;
  rank?: number;
}

const RankBackdrop = ({ rank }: { rank: number }) => (
  <span
    aria-hidden
    className="select-none font-black leading-none text-foreground-v2/[0.055]"
    style={{
      fontSize: rank >= 10 ? 84 : 100,
      fontVariantNumeric: "tabular-nums",
      marginRight: "-20px",
      zIndex: 0,
    }}
  >
    {rank}
  </span>
);

const CreatorCard = ({ name, avatarUrl, verified = false, rank }: CreatorCardProps) => {
  return (
    <div className="flex-shrink-0 flex items-end">
      {rank !== undefined && <RankBackdrop rank={rank} />}
      <div className="relative flex items-center gap-4 bg-card-v2 rounded-2xl px-5 py-4 min-w-[240px] cursor-pointer hover:bg-card-v2/80 transition-colors group z-10">
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-muted-v2-foreground/30">
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" loading="lazy" />
          </div>
          {verified && (
            <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-primary-v2 rounded-lg flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-primary-v2-foreground" />
            </div>
          )}
        </div>
        <span className="text-foreground-v2 font-medium text-sm flex-1">{name}</span>
        <ChevronRight className="w-5 h-5 text-muted-v2-foreground group-hover:text-foreground-v2 transition-colors" />
      </div>
    </div>
  );
};

export default CreatorCard;
