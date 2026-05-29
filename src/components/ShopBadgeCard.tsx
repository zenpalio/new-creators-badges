import { Check, Star } from "lucide-react";
import TokenIcon from "./TokenIcon";
import { getBadgeEffect } from "./ProfileBadgeShowcase";

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
  const effect = getBadgeEffect(name);
  const glow = effect.glowColor;
  // Stronger ring for equipped, softer for owned, subtle for available
  const intensity = equipped ? 1 : owned ? 0.7 : 0.45;
  const ringBorder = `2px solid ${glow.replace(")", ` / ${0.55 * intensity})`)}`;
  const ringShadow =
    `0 0 ${14 * intensity}px ${glow.replace(")", ` / ${0.55 * intensity})`)},` +
    `0 0 ${28 * intensity}px ${glow.replace(")", ` / ${0.28 * intensity})`)},` +
    `inset 0 0 ${12 * intensity}px ${glow.replace(")", ` / ${0.12 * intensity})`)}`;

  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={onClick}>
      <div
        className="relative w-full aspect-square max-w-[164px] rounded-[1.25rem] sm:rounded-[1.75rem] border border-border-v2/30 flex items-center justify-center transition-transform duration-300 hover:scale-[1.03]"
        style={{ backgroundColor: "hsl(var(--popover-v2))", backgroundImage: "none" }}
      >
        {/* Animated colored border ring */}
        <div
          className="pointer-events-none absolute -inset-[2px] rounded-[1.25rem] sm:rounded-[1.75rem]"
          style={{
            border: ringBorder,
            boxShadow: ringShadow,
            animation: "badge-border-pulse 2.5s ease-in-out infinite",
          }}
        />
        <img src={imageUrl} alt={name} className="relative z-[1] w-[100px] h-[100px] sm:w-[116px] sm:h-[116px] object-contain" loading="lazy" width={512} height={512} />
        {equipped ? (
          <div className="absolute -top-1.5 -right-1.5 z-20 text-[9px] font-bold px-2 py-0.5 rounded-full text-primary-v2 border border-primary-v2/30" style={{ backgroundColor: "hsl(var(--primary-v2) / 0.15)" }}>
            <Star className="w-3 h-3 fill-current" />
          </div>
        ) : owned ? (
          <div className="absolute -top-1.5 -right-1.5 z-20 text-[9px] font-bold px-2 py-0.5 rounded-full text-muted-v2-foreground border border-border-v2/30" style={{ backgroundColor: "hsl(var(--muted-v2))" }}>
            <Check className="w-3 h-3" />
          </div>
        ) : null}
      </div>
      <p className="text-xs font-semibold text-foreground-v2 text-center">{name}</p>
      <p className="text-[10px] text-muted-v2-foreground text-center max-w-[140px]">{description}</p>
      <div className="flex items-center gap-1 text-[10px] text-muted-v2-foreground">
        <TokenIcon className="w-3.5 h-3.5" />
        <span className="font-semibold">{price.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default ShopBadgeCard;
