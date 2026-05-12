import { X, Check, ShoppingCart, Star, StarOff } from "lucide-react";
import { Button } from "./ui/button";
import TokenIcon from "./TokenIcon";
import { getBadgeEffect } from "./ProfileBadgeShowcase";

interface ShopBadgePopupProps {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  owned: boolean;
  equipped?: boolean;
  onClose: () => void;
  onBuy?: () => void;
  onEquip?: () => void;
  onUnequip?: () => void;
}

const ShopBadgePopup = ({ name, description, imageUrl, price, owned, equipped, onClose, onBuy, onEquip, onUnequip }: ShopBadgePopupProps) => {
  const effect = getBadgeEffect(name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-v2/85 backdrop-blur-md" onClick={onClose}>
      <div
        className="relative w-[320px] sm:w-[380px] rounded-2xl border border-border-v2/20 p-6 flex flex-col items-center text-center overflow-hidden animate-in zoom-in-90 fade-in duration-500"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "hsl(var(--popover-v2))",
          backgroundImage: "none",
          boxShadow: equipped
            ? `0 0 60px ${effect.glowColor.replace(")", " / 0.3)")}, 0 0 120px ${effect.glowColor.replace(")", " / 0.1)")}`
            : owned
              ? "0 0 60px hsl(43 96% 58% / 0.2), 0 0 120px hsl(43 96% 58% / 0.08)"
              : "0 25px 50px hsl(0 0% 0% / 0.3)",
        }}
      >
        {/* Top accent */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-20 rounded-full"
          style={{
            background: equipped
              ? `linear-gradient(90deg, transparent, ${effect.glowColor}, transparent)`
              : owned
                ? "linear-gradient(90deg, transparent, hsl(43 96% 58%), transparent)"
                : "linear-gradient(90deg, transparent, hsl(var(--primary-v2)), transparent)",
          }}
        />

        <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full">
          <X className="w-4 h-4" />
        </Button>

        {/* Status */}
        <div className="mb-4 mt-0.5">
          {equipped ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: `${effect.glowColor.replace(")", " / 0.15)")}`, color: effect.glowColor, border: `1px solid ${effect.glowColor.replace(")", " / 0.3)")}` }}>
              <Star className="w-3 h-3 fill-current" /> Equipped
            </span>
          ) : owned ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: "hsl(43 96% 58% / 0.12)", color: "hsl(43 96% 58%)", border: "1px solid hsl(43 96% 58% / 0.25)" }}>
              <Check className="w-3 h-3" /> Owned
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: "hsl(var(--primary-v2) / 0.12)", color: "hsl(var(--primary-v2))", border: "1px solid hsl(var(--primary-v2) / 0.25)" }}>
              <ShoppingCart className="w-3 h-3" /> Available
            </span>
          )}
        </div>

        {/* Image */}
        <div className="relative w-32 h-32 mb-4">
          {(owned || equipped) && (
            <div className="absolute inset-2 rounded-full blur-2xl animate-pulse" style={{ backgroundColor: effect.glowColor, opacity: 0.25, animationDuration: "2.5s" }} />
          )}
          <img src={imageUrl} alt={name} className="relative z-10 w-full h-full object-contain" loading="lazy" width={512} height={512} />
        </div>

        <h2 className="text-lg font-bold text-foreground-v2 tracking-tight mb-0.5">{name}</h2>
        <p className="text-xs text-muted-v2-foreground mb-3">{description}</p>

        {/* Effect preview */}
        {owned && (
          <div className="mb-3 px-3 py-2 rounded-xl w-full text-left" style={{ background: "hsl(0 0% 100% / 0.03)", border: "1px solid hsl(0 0% 100% / 0.08)" }}>
            <p className="text-[10px] text-muted-v2-foreground uppercase tracking-wider font-medium mb-1">Badge Effect</p>
            <div className="flex items-center gap-2">
              <span className="text-sm">{effect.particleEmoji}</span>
              <span className="text-xs text-foreground-v2/80 capitalize">{effect.animation.replace(/-/g, " ")} animation</span>
            </div>
          </div>
        )}

        {/* Price card */}
        <div
          className="relative mb-5 px-5 py-4 rounded-2xl w-full overflow-hidden backdrop-blur-xl"
          style={{
            background: "hsl(0 0% 100% / 0.03)",
            border: `1px solid ${owned ? "hsl(43 96% 58% / 0.45)" : "hsl(0 0% 100% / 0.25)"}`,
          }}
        >
          <div className="relative flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm"
              style={{ background: "hsl(0 0% 100% / 0.05)", border: "1px solid hsl(0 0% 100% / 0.08)" }}
            >
              <TokenIcon className="w-6 h-6" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-foreground-v2 font-extrabold text-xl leading-tight tracking-tight">{price.toLocaleString()}</span>
              <span className="text-[10px] text-muted-v2-foreground/70 uppercase tracking-widest font-medium">tokens</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {!owned ? (
          <Button size="lg" className="w-full rounded-xl font-bold gap-2 hover:scale-[1.02] active:scale-95 transition-transform" onClick={onBuy}>
            <ShoppingCart className="w-4 h-4" />
            Buy for {price.toLocaleString()} Tokens
          </Button>
        ) : (
          <div className="flex flex-col gap-2 w-full">
            {equipped ? (
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-xl font-bold gap-2 hover:scale-[1.02] active:scale-95 transition-transform"
                onClick={onUnequip}
              >
                <StarOff className="w-4 h-4" />
                Unequip Badge
              </Button>
            ) : (
              <Button
                size="lg"
                className="w-full rounded-xl font-bold gap-2 hover:scale-[1.02] active:scale-95 transition-transform"
                onClick={onEquip}
                style={{ background: `linear-gradient(135deg, ${effect.glowColor}, hsl(var(--primary-v2)))` }}
              >
                <Star className="w-4 h-4" />
                Equip on Profile
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopBadgePopup;
