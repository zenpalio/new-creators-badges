import { useState } from "react";
import { Info } from "lucide-react";
import BadgeCard, { type BadgeTier, type BadgeImageSet } from "./BadgeCard";
import BadgePopup from "./BadgePopup";
import AuraIcon from "./AuraIcon";
import HorizontalScroll from "./HorizontalScroll";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface Badge {
  name: string;
  aura: number;
  tokens?: number;
  tier: BadgeTier;
  unlocked: boolean;
  claimed?: boolean;
  isNew?: boolean;
}

interface BadgeCategoryProps {
  title: string;
  subtitle: string;
  badges: Badge[];
  progress: number;
  imageSet?: BadgeImageSet;
  tooltip?: string;
  aura?: number;
  activeTier?: BadgeTier;
  onUseBadge?: (tier: BadgeTier) => void;
}

const BadgeCategory = ({ title, subtitle, badges: initialBadges, progress, imageSet = "aura", tooltip, aura, activeTier, onUseBadge }: BadgeCategoryProps) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [claimedTiers, setClaimedTiers] = useState<Set<BadgeTier>>(new Set());
  const [unlockedTiers, setUnlockedTiers] = useState<Set<BadgeTier>>(new Set());

  const badges = initialBadges.map((b) => ({
    ...b,
    unlocked: b.unlocked || unlockedTiers.has(b.tier),
    claimed: b.claimed || claimedTiers.has(b.tier),
  }));

  const handleClaim = () => {
    if (selectedBadge) {
      setClaimedTiers((prev) => new Set(prev).add(selectedBadge.tier));
      setSelectedBadge({ ...selectedBadge, claimed: true });
    }
  };

  const handleUnlock = () => {
    if (selectedBadge) {
      setUnlockedTiers((prev) => new Set(prev).add(selectedBadge.tier));
      setSelectedBadge({ ...selectedBadge, unlocked: true, claimed: false, isNew: true });
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <h3 className="text-foreground-v2 font-bold text-sm">{title}</h3>
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-muted-v2-foreground hover:text-foreground-v2 transition-colors">
                <Info className="w-4 h-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent side="right" className="max-w-[200px] text-xs p-3">
              {tooltip || subtitle}
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-3">
          {aura !== undefined && (
            <div className="flex items-center gap-1">
              <AuraIcon className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-[11px] font-bold text-foreground-v2">{aura.toLocaleString()}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "hsl(var(--muted-v2))" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${progress}%`, backgroundColor: "hsl(var(--primary-v2))" }}
              />
            </div>
            <span className="text-[10px] text-muted-v2-foreground font-medium min-w-[28px]">{progress}%</span>
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-v2-foreground mb-4">{subtitle}</p>
      <HorizontalScroll>
        {badges.map((badge, i) => (
          <BadgeCard key={i} {...badge} imageSet={imageSet} onClick={() => setSelectedBadge(badge)} />
        ))}
      </HorizontalScroll>

      {selectedBadge && (
        <BadgePopup
          {...selectedBadge}
          claimed={selectedBadge.claimed || claimedTiers.has(selectedBadge.tier)}
          unlocked={selectedBadge.unlocked || unlockedTiers.has(selectedBadge.tier)}
          imageSet={imageSet}
          currentAura={aura ?? 0}
          activeTier={activeTier}
          onClose={() => setSelectedBadge(null)}
          onClaim={handleClaim}
          onUseBadge={onUseBadge}
          onUnlock={handleUnlock}
        />
      )}
    </div>
  );
};

export default BadgeCategory;
