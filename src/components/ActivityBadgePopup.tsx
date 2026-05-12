import { X, Check, ExternalLink, Trophy, Star, StarOff, Gift } from "lucide-react";
import { Button } from "./ui/button";
import { getBadgeEffect } from "./ProfileBadgeShowcase";

interface ActivityBadgePopupProps {
  name: string;
  description: string;
  imageUrl: string;
  completed: boolean;
  claimed: boolean;
  equipped: boolean;
  actionLabel: string;
  actionUrl?: string;
  onClose: () => void;
  onComplete?: () => void;
  onClaim?: () => void;
  onEquip?: () => void;
  onUnequip?: () => void;
}

const ActivityBadgePopup = ({ name, description, imageUrl, completed, claimed, equipped, actionLabel, actionUrl, onClose, onComplete, onClaim, onEquip, onUnequip }: ActivityBadgePopupProps) => {
  const effect = getBadgeEffect(name);

  const handleAction = () => {
    if (actionUrl) window.open(actionUrl, "_blank");
    onComplete?.();
  };

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
            : claimed
              ? "0 0 60px hsl(142 76% 36% / 0.2), 0 0 120px hsl(142 76% 36% / 0.08)"
              : "0 25px 50px hsl(0 0% 0% / 0.3)",
        }}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-20 rounded-full"
          style={{
            background: equipped
              ? `linear-gradient(90deg, transparent, ${effect.glowColor}, transparent)`
              : claimed
                ? "linear-gradient(90deg, transparent, hsl(142 76% 36%), transparent)"
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
          ) : claimed ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: "hsl(142 76% 36% / 0.12)", color: "hsl(142 76% 36%)", border: "1px solid hsl(142 76% 36% / 0.25)" }}>
              <Trophy className="w-3 h-3" /> Claimed
            </span>
          ) : completed ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: "hsl(43 96% 58% / 0.12)", color: "hsl(43 96% 58%)", border: "1px solid hsl(43 96% 58% / 0.25)" }}>
              <Gift className="w-3 h-3" /> Ready to Claim
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: "hsl(var(--primary-v2) / 0.12)", color: "hsl(var(--primary-v2))", border: "1px solid hsl(var(--primary-v2) / 0.25)" }}>
              In Progress
            </span>
          )}
        </div>

        {/* Image */}
        <div className={`relative w-32 h-32 mb-4 ${!completed && !claimed ? "grayscale-[50%] opacity-70" : ""}`}>
          {(claimed || equipped) && (
            <div className="absolute inset-2 rounded-full blur-2xl animate-pulse" style={{ backgroundColor: effect.glowColor, opacity: 0.25, animationDuration: "2.5s" }} />
          )}
          <img src={imageUrl} alt={name} className="relative z-10 w-full h-full object-contain" loading="lazy" width={512} height={512} />
        </div>

        <h2 className="text-lg font-bold text-foreground-v2 tracking-tight mb-0.5">{name}</h2>
        <p className="text-xs text-muted-v2-foreground mb-5">{description}</p>

        {/* Actions */}
        {!completed && !claimed ? (
          <Button size="lg" className="w-full rounded-xl font-bold gap-2 hover:scale-[1.02] active:scale-95 transition-transform" onClick={handleAction}>
            {actionUrl && <ExternalLink className="w-4 h-4" />}
            {actionLabel}
          </Button>
        ) : completed && !claimed ? (
          <Button
            size="lg"
            className="w-full rounded-xl font-bold gap-2 hover:scale-[1.02] active:scale-95 transition-transform"
            onClick={onClaim}
            style={{ background: "linear-gradient(135deg, hsl(43 96% 58%), hsl(25 100% 55%))" }}
          >
            <Gift className="w-4 h-4" />
            Claim Badge
          </Button>
        ) : claimed && !equipped ? (
          <Button
            size="lg"
            className="w-full rounded-xl font-bold gap-2 hover:scale-[1.02] active:scale-95 transition-transform"
            onClick={onEquip}
            style={{ background: `linear-gradient(135deg, ${effect.glowColor}, hsl(var(--primary-v2)))` }}
          >
            <Star className="w-4 h-4" />
            Equip on Profile
          </Button>
        ) : equipped ? (
          <Button
            variant="outline"
            size="lg"
            className="w-full rounded-xl font-bold gap-2 hover:scale-[1.02] active:scale-95 transition-transform"
            onClick={onUnequip}
          >
            <StarOff className="w-4 h-4" />
            Unequip Badge
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default ActivityBadgePopup;
