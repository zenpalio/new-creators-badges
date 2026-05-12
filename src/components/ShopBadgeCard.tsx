import { Check, Star } from "lucide-react";
import TokenIcon from "./TokenIcon";

interface ShopBadgeCardProps {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  owned: boolean;
  equipped?: boolean;
  onClick?: () => void;
}

const ShopBadgeCard = ({ name, description, imageUrl, price, owned, equipped, onClick }: ShopBadgeCardProps) => {
  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={onClick}>
      <div
        className="relative w-full aspect-square max-w-[164px] rounded-[1.25rem] sm:rounded-[1.75rem] border border-border/30 flex items-center justify-center transition-transform duration-300 hover:scale-[1.03]"
        style={{ backgroundColor: "hsl(var(--popover-v2))", backgroundImage: "none" }}
      >
        <img src={imageUrl} alt={name} className="w-[100px] h-[100px] sm:w-[116px] sm:h-[116px] object-contain" loading="lazy" width={512} height={512} />
        {equipped ? (
          <div className="absolute -top-1.5 -right-1.5 z-20 text-[9px] font-bold px-2 py-0.5 rounded-full text-primary border border-primary/30" style={{ backgroundColor: "hsl(var(--primary) / 0.15)" }}>
            <Star className="w-3 h-3 fill-current" />
          </div>
        ) : owned ? (
          <div className="absolute -top-1.5 -right-1.5 z-20 text-[9px] font-bold px-2 py-0.5 rounded-full text-muted-foreground border border-border/30" style={{ backgroundColor: "hsl(var(--muted))" }}>
            <Check className="w-3 h-3" />
          </div>
        ) : null}
      </div>
      <p className="text-xs font-semibold text-foreground text-center">{name}</p>
      <p className="text-[10px] text-muted-foreground text-center max-w-[140px]">{description}</p>
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
        <TokenIcon className="w-3.5 h-3.5" />
        <span className="font-semibold">{price.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default ShopBadgeCard;
