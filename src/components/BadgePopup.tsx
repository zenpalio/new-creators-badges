import { X, Sparkles, Star, Zap, Lock, Check } from "lucide-react";
import { type BadgeTier, type BadgeImageSet, imageSets } from "./BadgeCard";
import { Button } from "./ui/button";
import TokenIcon from "./TokenIcon";


interface BadgePopupProps {
  name: string;
  aura: number;
  tokens?: number;
  tier: BadgeTier;
  unlocked: boolean;
  claimed?: boolean;
  imageSet?: BadgeImageSet;
  currentAura?: number;
  activeTier?: BadgeTier;
  onClose: () => void;
  onClaim?: () => void;
  onUseBadge?: (tier: BadgeTier) => void;
  onUnlock?: () => void;
}

const tierGlowColors: Record<BadgeTier, string> = {
  newbie: "168, 85%, 45%",
  master: "213, 100%, 60%",
  legend: "43, 96%, 58%",
  elite: "213, 100%, 50%",
  mythic: "281, 85%, 62%",
  grandmaster: "0, 82%, 58%",
  immortal: "48, 96%, 70%",
};

const tierAccentColors: Record<BadgeTier, string> = {
  newbie: "hsl(168 85% 45%)",
  master: "hsl(213 100% 60%)",
  legend: "hsl(43 96% 58%)",
  elite: "hsl(213 100% 50%)",
  mythic: "hsl(281 85% 62%)",
  grandmaster: "hsl(0 82% 58%)",
  immortal: "hsl(48 96% 70%)",
};


const BadgePopup = ({ name, aura, tokens, tier, unlocked, claimed = true, imageSet = "aura", currentAura = 0, activeTier, onClose, onClaim, onUseBadge, onUnlock }: BadgePopupProps) => {
  const tierImages = imageSets[imageSet];
  const glowHsl = tierGlowColors[tier];
  const accent = tierAccentColors[tier];
  
  const isClaimable = unlocked && !claimed;
  const isActiveBadge = activeTier === tier;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-md" onClick={onClose}>
      <div
        className="relative w-[320px] sm:w-[380px] rounded-2xl border border-border/20 p-6 flex flex-col items-center text-center overflow-hidden animate-in zoom-in-90 fade-in duration-500"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "hsl(var(--popover-v2))",
          backgroundImage: "none",
          boxShadow: unlocked
            ? `0 0 60px hsl(${glowHsl} / 0.25), 0 0 120px hsl(${glowHsl} / 0.1)`
            : "0 25px 50px hsl(0 0% 0% / 0.3)",
        }}
      >
        {/* Background effects */}
        {unlocked && (
          <>
            <div
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-[80px] pointer-events-none animate-pulse"
              style={{ backgroundColor: accent, opacity: 0.15, animationDuration: "3s" }}
            />
            {/* Floating particles */}
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full pointer-events-none animate-bounce"
                style={{
                  backgroundColor: accent,
                  opacity: 0.3 + (i * 0.1),
                  left: `${18 + (i * 16)}%`,
                  top: `${12 + ((i * 19) % 55)}%`,
                  animationDelay: `${i * 0.4}s`,
                  animationDuration: `${2.5 + (i * 0.3)}s`,
                }}
              />
            ))}
          </>
        )}

        {/* Top accent line */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-20 rounded-full"
          style={{
            background: unlocked
              ? `linear-gradient(90deg, transparent, ${accent}, transparent)`
              : "linear-gradient(90deg, transparent, hsl(var(--muted-foreground) / 0.2), transparent)",
          }}
        />

        {/* Close */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full"
        >
          <X className="w-4 h-4" />
        </Button>

        {/* Status chip */}
        <div className="mb-4 mt-0.5">
          {isClaimable && (
            <span
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse"
              style={{
                backgroundColor: `hsl(${glowHsl} / 0.12)`,
                color: accent,
                border: `1px solid hsl(${glowHsl} / 0.25)`,
              }}
            >
              <Zap className="w-3 h-3" />
              Ready
            </span>
          )}
          {unlocked && claimed && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-muted-foreground" style={{ backgroundColor: "hsl(var(--muted))" }}>
              <Star className="w-3 h-3" /> Collected
            </span>
          )}
          {!unlocked && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-muted-foreground" style={{ backgroundColor: "hsl(var(--muted) / 0.5)" }}>
              <Lock className="w-3 h-3" /> Locked
            </span>
          )}
        </div>

        {/* Badge image */}
        <div className={`relative w-32 h-32 mb-4 ${!unlocked ? "grayscale opacity-40" : ""}`}>
          {isClaimable && (
            <div
              className="absolute -inset-3 rounded-full"
              style={{
                background: `conic-gradient(from 0deg, transparent, hsl(${glowHsl} / 0.35), transparent, hsl(${glowHsl} / 0.15), transparent)`,
                animation: "spin 4s linear infinite",
              }}
            />
          )}
          {unlocked && (
            <div
              className="absolute inset-2 rounded-full blur-2xl animate-pulse"
              style={{ backgroundColor: accent, opacity: isClaimable ? 0.4 : 0.2, animationDuration: "2.5s" }}
            />
          )}
          <img
            src={typeof tierImages[tier] === "string" ? (tierImages[tier] as string) : (tierImages[tier] as { src: string }).src}
            alt={`${name} badge`}
            className="relative z-10 w-full h-full object-contain"
            style={{
              filter: unlocked ? `drop-shadow(0 0 16px hsl(${glowHsl} / 0.45))` : undefined,
              animation: isClaimable ? "bounce 2s ease-in-out infinite" : undefined,
            }}
          />
        </div>

        {/* Name */}
        <div className="mb-0.5">
          <h2 className="text-lg font-bold text-foreground tracking-tight">
            {name}
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-xs text-muted-foreground mb-4">
          {isClaimable
            ? "Claim your token reward"
            : unlocked
              ? "Badge earned"
              : `Reach ${aura.toLocaleString()} aura to unlock`}
        </p>

        {/* Token reward — glass card */}
        <div
          className="relative mb-5 px-5 py-4 rounded-2xl w-full overflow-hidden backdrop-blur-xl"
          style={{
            background: unlocked
              ? `linear-gradient(135deg, hsl(${glowHsl} / 0.08), hsl(0 0% 100% / 0.04))`
              : "hsl(0 0% 100% / 0.03)",
            border: `1px solid ${unlocked ? `hsl(${glowHsl} / 0.45)` : "hsl(0 0% 100% / 0.25)"}`,
            boxShadow: unlocked
              ? `inset 0 1px 0 hsl(0 0% 100% / 0.06), 0 4px 24px hsl(${glowHsl} / 0.08)`
              : "inset 0 1px 0 hsl(0 0% 100% / 0.04)",
          }}
        >
          <div className="relative flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm"
              style={{
                background: unlocked
                  ? `linear-gradient(135deg, hsl(${glowHsl} / 0.15), hsl(0 0% 100% / 0.05))`
                  : "hsl(0 0% 100% / 0.05)",
                border: `1px solid ${unlocked ? `hsl(${glowHsl} / 0.2)` : "hsl(0 0% 100% / 0.08)"}`,
              }}
            >
              <TokenIcon className="w-6 h-6" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-foreground font-extrabold text-xl leading-tight tracking-tight">+{tokens ?? aura}</span>
              <span className="text-[10px] text-muted-foreground/70 uppercase tracking-widest font-medium">token reward</span>
            </div>
          </div>
        </div>

        {/* Action */}
        {isClaimable ? (
          <Button
            onClick={onClaim}
            size="lg"
            className="w-full rounded-xl font-bold gap-2 hover:scale-[1.02] active:scale-95 transition-transform"
          >
            <Sparkles className="w-4 h-4" />
            Claim Tokens
          </Button>
        ) : unlocked ? (
          <div className="w-full space-y-2">
            <Button variant="ghost" size="lg" className="w-full rounded-xl border border-border/30" disabled style={{ backgroundColor: "hsl(var(--muted))" }}>
              <Check className="w-4 h-4" /> Collected
            </Button>
            {onUseBadge && (
              <Button
                variant={isActiveBadge ? "outline" : "default"}
                size="lg"
                className="w-full rounded-xl font-bold gap-2 hover:scale-[1.02] active:scale-95 transition-transform"
                disabled={isActiveBadge}
                onClick={() => onUseBadge(tier)}
                style={!isActiveBadge ? {
                  background: `linear-gradient(135deg, hsl(${glowHsl}), hsl(${glowHsl} / 0.7))`,
                } : undefined}
              >
                {isActiveBadge ? (
                  <><Check className="w-4 h-4" /> Active Badge</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Use Badge</>
                )}
              </Button>
            )}
          </div>
        ) : (
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
              <span>{currentAura.toLocaleString()} / {aura.toLocaleString()} aura</span>
              <span>{Math.min(100, Math.round((currentAura / aura) * 100))}%</span>
            </div>
            <div className="relative w-full h-2.5 rounded-full overflow-hidden border border-border/50" style={{ backgroundColor: "hsl(var(--muted))" }}>
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 z-10"
                style={{
                  width: `${Math.min(100, (currentAura / aura) * 100)}%`,
                  minWidth: currentAura > 0 ? "0.5rem" : "0",
                  backgroundColor: "hsl(var(--primary))",
                  boxShadow: "0 0 10px hsl(var(--primary) / 0.5)",
                }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground font-medium">
              {(aura - currentAura).toLocaleString()} more aura needed
            </p>
            {onUnlock && (
              <Button
                onClick={onUnlock}
                variant="outline"
                size="lg"
                className="w-full rounded-xl font-bold gap-2 mt-2 hover:scale-[1.02] active:scale-95 transition-transform border-dashed"
              >
                <Lock className="w-4 h-4" />
                Unlock (Dev Only)
              </Button>
            )}
          </div>
        )}

        {/* Date */}
        {unlocked && (
          <p className="text-[9px] text-muted-foreground/50 mt-3 uppercase tracking-widest">
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        )}
      </div>
    </div>
  );
};

export default BadgePopup;
