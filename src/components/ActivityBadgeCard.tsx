import { Check, Star } from "lucide-react";

interface ActivityBadgeCardProps {
  name: string;
  description: string;
  imageUrl: string;
  completed: boolean;
  claimed?: boolean;
  equipped?: boolean;
  actionLabel: string;
  actionUrl?: string;
  onClick?: () => void;
}

const ActivityBadgeCard = ({ name, description, imageUrl, completed, claimed, equipped, onClick }: ActivityBadgeCardProps) => {
  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={onClick}>
      <div
        className="relative w-full aspect-square max-w-[164px] rounded-[1.25rem] sm:rounded-[1.75rem] border border-border-v2/30 flex items-center justify-center transition-transform duration-300 hover:scale-[1.03]"
        style={{ backgroundColor: "hsl(var(--popover-v2))", backgroundImage: "none" }}
      >
        <img
          src={imageUrl}
          alt={name}
          className={`w-[100px] h-[100px] sm:w-[116px] sm:h-[116px] object-contain ${!completed && !claimed ? "grayscale opacity-50" : ""}`}
          loading="lazy"
          width={512}
          height={512}
        />
        {equipped ? (
          <div className="absolute -top-1.5 -right-1.5 z-20 text-[9px] font-bold px-2 py-0.5 rounded-full text-primary-v2 border border-primary-v2/30" style={{ backgroundColor: "hsl(var(--primary-v2) / 0.15)" }}>
            <Star className="w-3 h-3 fill-current" />
          </div>
        ) : claimed ? (
          <div className="absolute -top-1.5 -right-1.5 z-20 text-[9px] font-bold px-2 py-0.5 rounded-full border border-border-v2/30" style={{ backgroundColor: "hsl(142 76% 36% / 0.15)", color: "hsl(142 76% 36%)" }}>
            <Check className="w-3 h-3" />
          </div>
        ) : completed ? (
          <div className="absolute -top-1.5 -right-1.5 z-20 w-5 h-5 rounded-full flex items-center justify-center animate-pulse" style={{ backgroundColor: "hsl(43 96% 58%)", color: "hsl(0 0% 10%)" }}>
            <span className="text-[10px] font-bold">!</span>
          </div>
        ) : null}
      </div>
      <p className="text-xs font-semibold text-foreground-v2 text-center">{name}</p>
      <p className="text-[10px] text-muted-v2-foreground text-center max-w-[140px]">{description}</p>
    </div>
  );
};

export default ActivityBadgeCard;
