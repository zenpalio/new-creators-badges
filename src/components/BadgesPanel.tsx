import { useState } from "react";
import BadgeCategory from "./BadgeCategory";
import ActivityBadgeCard from "./ActivityBadgeCard";
import ActivityBadgePopup from "./ActivityBadgePopup";
import ShopBadgeCard from "./ShopBadgeCard";
import ShopBadgePopup from "./ShopBadgePopup";
import { type EquippedBadge } from "./ProfileBadgeShowcase";
import { type BadgeTier } from "./BadgeCard";
import { badgeCategories, activityBadges, shopBadges } from "../pages/Profile";

export type BadgesTab = "aura" | "activity" | "shop";

export const badgesTabs: { value: BadgesTab; label: string }[] = [
  { value: "aura", label: "Aura Badges" },
  { value: "activity", label: "Activity" },
  { value: "shop", label: "Shop" },
];

interface BadgesPanelProps {
  value: BadgesTab;
  activeBadge?: EquippedBadge | null;
  onActiveBadgeChange?: (b: EquippedBadge | null) => void;
  previewTier?: BadgeTier;
  onPreviewTierChange?: (t: BadgeTier) => void;
}

const BadgesPanel = ({
  value,
  activeBadge: activeBadgeProp,
  onActiveBadgeChange,
  previewTier: previewTierProp,
  onPreviewTierChange,
}: BadgesPanelProps) => {
  const [previewTierLocal, setPreviewTierLocal] = useState<BadgeTier>("legend");
  const previewTier = previewTierProp ?? previewTierLocal;
  const setPreviewTier = (t: BadgeTier) => {
    if (onPreviewTierChange) onPreviewTierChange(t);
    else setPreviewTierLocal(t);
  };
  const [selectedActivity, setSelectedActivity] = useState<typeof activityBadges[0] | null>(null);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(
    new Set(activityBadges.filter((b) => b.completed).map((b) => b.name))
  );
  const [claimedActivities, setClaimedActivities] = useState<Set<string>>(new Set());
  const [selectedShop, setSelectedShop] = useState<typeof shopBadges[0] | null>(null);
  const [ownedShop, setOwnedShop] = useState<Set<string>>(new Set());
  const [activeBadgeLocal, setActiveBadgeLocal] = useState<EquippedBadge | null>(null);
  const activeBadge = activeBadgeProp !== undefined ? activeBadgeProp : activeBadgeLocal;
  const setActiveBadge = (b: EquippedBadge | null) => {
    if (onActiveBadgeChange) onActiveBadgeChange(b);
    else setActiveBadgeLocal(b);
  };

  const equippedBadges = activeBadge ? [activeBadge] : [];

  const handleEquip = (badge: { name: string; imageUrl: string }) => {
    setActiveBadge({ name: badge.name, imageUrl: badge.imageUrl, effect: badge.name });
  };
  const handleUnequip = () => setActiveBadge(null);

  if (value === "aura") {
    return (
      <div>
        {badgeCategories.map((cat, i) => (
          <BadgeCategory
            key={i}
            {...cat}
            activeTier={activeBadge ? undefined : previewTier}
            onUseBadge={i === 0 ? (tier) => { setPreviewTier(tier); setActiveBadge(null); } : undefined}
          />
        ))}
      </div>
    );
  }

  if (value === "activity") {
    return (
      <div>
        <div className="mb-4">
          <p className="text-xs text-muted-v2-foreground mb-1">Complete activities to earn exclusive badges</p>
          <p className="text-[10px] text-muted-v2-foreground/60">{completedActivities.size}/{activityBadges.length} completed</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-6 gap-3 sm:gap-4">
          {activityBadges.map((badge) => (
            <ActivityBadgeCard
              key={badge.name}
              {...badge}
              completed={completedActivities.has(badge.name)}
              claimed={claimedActivities.has(badge.name)}
              equipped={activeBadge?.name === badge.name}
              onClick={() => setSelectedActivity(badge)}
            />
          ))}
        </div>
        {selectedActivity && (
          <ActivityBadgePopup
            {...selectedActivity}
            completed={completedActivities.has(selectedActivity.name)}
            claimed={claimedActivities.has(selectedActivity.name)}
            equipped={activeBadge?.name === selectedActivity.name}
            onClose={() => setSelectedActivity(null)}
            onComplete={() => {
              setCompletedActivities((prev) => new Set(prev).add(selectedActivity.name));
              setSelectedActivity({ ...selectedActivity, completed: true });
            }}
            onClaim={() => {
              setClaimedActivities((prev) => new Set(prev).add(selectedActivity.name));
              setSelectedActivity(null);
            }}
            onEquip={() => {
              handleEquip(selectedActivity);
              setSelectedActivity(null);
            }}
            onUnequip={() => {
              handleUnequip();
              setSelectedActivity(null);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <p className="text-xs text-muted-v2-foreground mb-1">Buy exclusive badges with your tokens</p>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-6 gap-3 sm:gap-4">
        {shopBadges.map((badge) => (
          <ShopBadgeCard
            key={badge.name}
            {...badge}
            owned={ownedShop.has(badge.name)}
            equipped={equippedBadges.some((b) => b.name === badge.name)}
            onClick={() => setSelectedShop(badge)}
          />
        ))}
      </div>
      {selectedShop && (
        <ShopBadgePopup
          {...selectedShop}
          owned={ownedShop.has(selectedShop.name)}
          equipped={equippedBadges.some((b) => b.name === selectedShop.name)}
          onClose={() => setSelectedShop(null)}
          onBuy={() => {
            setOwnedShop((prev) => new Set(prev).add(selectedShop.name));
            setSelectedShop({ ...selectedShop, owned: true });
          }}
          onEquip={() => {
            handleEquip(selectedShop);
            setSelectedShop(null);
          }}
          onUnequip={() => {
            handleUnequip();
            setSelectedShop(null);
          }}
        />
      )}
    </div>
  );
};

export default BadgesPanel;
