import { useEffect, useRef, useState } from "react";
import { Settings, Info, Globe, Users, Heart, Menu } from "lucide-react";
import SideNav from "../components/SideNav";
import AuraIcon from "../components/AuraIcon";
import TierRingCanvas from "../components/TierRingCanvas";
import ShopBadgeRingCanvas from "../components/ShopBadgeRingCanvas";
import BadgeCategory from "../components/BadgeCategory";
import ActivityBadgeCard from "../components/ActivityBadgeCard";
import ActivityBadgePopup from "../components/ActivityBadgePopup";
import ShopBadgeCard from "../components/ShopBadgeCard";
import ShopBadgePopup from "../components/ShopBadgePopup";
import HorizontalScroll from "../components/HorizontalScroll";
import ProfileBadgeShowcase, { type EquippedBadge, getBadgeEffect } from "../components/ProfileBadgeShowcase";
import { type BadgeTier } from "../components/BadgeCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";

import actHypeman from "../assets/badges/activity-hypeman.png";
import actSquad from "../assets/badges/activity-squad.png";
import actFirstdate from "../assets/badges/activity-firstdate.png";
import actPicspammer from "../assets/badges/activity-picspammer.png";
import actMoviemaker from "../assets/badges/activity-moviemaker.png";
import actFanfic from "../assets/badges/activity-fanfic.png";
import actRegular from "../assets/badges/activity-regular.png";
import actDedicated from "../assets/badges/activity-dedicated.png";
import actDiehard from "../assets/badges/activity-diehard.png";
import actBronze from "../assets/badges/activity-bronze.png";
import actSilver from "../assets/badges/activity-silver.png";
import actGoldChamp from "../assets/badges/activity-gold-champ.png";
import actInfluencer from "../assets/badges/activity-influencer.png";
import actAmbassador from "../assets/badges/activity-ambassador.png";
import actTop30 from "../assets/badges/activity-top30.png";
import actRisingStar from "../assets/badges/activity-rising-star.png";

import shopWaifu from "../assets/badges/shop-waifu.png";
import shopTouchgrass from "../assets/badges/shop-touchgrass.png";
import shopAiover from "../assets/badges/shop-aiover.png";
import shop3am from "../assets/badges/shop-3am.png";
import shopProposed from "../assets/badges/shop-proposed.png";
import shopHarem from "../assets/badges/shop-harem.png";
import shopRizzler from "../assets/badges/shop-rizzler.png";
import shopHornyRoyalty from "../assets/badges/shop-horny-royalty.png";
import shopFLegend from "../assets/badges/shop-legend.png";
import shopGigachad from "../assets/badges/shop-gigachad.png";
import shopNolife from "../assets/badges/shop-nolife.png";
import shopDownbad from "../assets/badges/shop-downbad.png";
import shopAnime from "../assets/badges/shop-anime-addict.png";
import shopCougar from "../assets/badges/shop-cougar.png";
import shopMommy from "../assets/badges/shop-mommy.png";
import shopGhosted from "../assets/badges/shop-ghosted.png";
import shopPromptdiddy from "../assets/badges/shop-promptdiddy.png";
import shopSimp from "../assets/badges/shop-simp.png";
import charNewbie from "../assets/badges/char-newbie.png";
import charMaster from "../assets/badges/char-master.png";
import charLegend from "../assets/badges/char-legend.png";
import charElite from "../assets/badges/char-elite.png";
import charMythic from "../assets/badges/char-mythic.png";
import charGrandmaster from "../assets/badge-grandmaster.png";
import charImmortal from "../assets/badges/char-immortal.png";
import profileAvatar from "../assets/profile-avatar.svg";

const allTiers: BadgeTier[] = ["newbie", "master", "legend", "elite", "grandmaster", "mythic", "immortal"];

export const tierBadgeImages: Record<BadgeTier, string> = {
  newbie: charNewbie,
  master: charMaster,
  legend: charLegend,
  elite: charElite,
  grandmaster: charGrandmaster,
  mythic: charMythic,
  immortal: charImmortal,
};

export const tierBorderColors: Record<BadgeTier, string> = {
  newbie: "hsl(25 45% 52%)",
  master: "hsl(213 100% 60%)",
  legend: "hsl(43 96% 58%)",
  elite: "hsl(213 100% 50%)",
  grandmaster: "hsl(0 82% 58%)",
  mythic: "hsl(281 85% 62%)",
  immortal: "hsl(43 96% 58%)",
};

export const isHighTier = (tier: BadgeTier) => ["elite", "grandmaster", "mythic", "immortal"].includes(tier);

export const tierLabels: Record<BadgeTier, string> = {
  newbie: "Newbie",
  master: "Master",
  legend: "Legend",
  elite: "Elite",
  grandmaster: "GM",
  mythic: "Mythic",
  immortal: "Immortal",
};

export const tierBadgeGlowColors: Record<BadgeTier, string> = {
  newbie: "hsl(25 45% 52%)",
  master: "hsl(213 100% 60%)",
  legend: "hsl(43 96% 58%)",
  elite: "hsl(213 100% 50%)",
  grandmaster: "hsl(0 82% 58%)",
  mythic: "hsl(281 85% 62%)",
  immortal: "hsl(43 90% 60%)",
};

const statItems = [
  { icon: Users, label: "FOLLOWERS", rank: "#1,438", count: "12.4K", iconClass: "w-4 h-4 text-primary-v2 mb-0.5" },
  { icon: AuraIcon, label: "AURA", rank: "#892", count: "450", iconClass: "w-5 h-5 text-purple-500 mb-0.5" },
  { icon: Heart, label: "Likes", rank: "#2,105", count: "8.2K", iconClass: "w-4 h-4 text-red-500 fill-red-500 mb-0.5" },
];

export const badgeCategories = [
  {
    title: "Total Aura",
    subtitle: "Earn More Aura And Claim Free Tokens",
    progress: 45,
    aura: 450,
    imageSet: "totalAura" as const,
    tooltip: "Create characters, post content, and engage with the community to earn more aura",
    badges: [
      { name: "Newbie", aura: 100, tokens: 10, tier: "newbie" as const, unlocked: true, claimed: true },
      { name: "Master", aura: 200, tokens: 20, tier: "master" as const, unlocked: true, claimed: true },
      { name: "Legend", aura: 400, tokens: 40, tier: "legend" as const, unlocked: true, claimed: true },
      { name: "Elite", aura: 800, tokens: 80, tier: "elite" as const, unlocked: false },
      { name: "Mythic", aura: 1500, tokens: 150, tier: "mythic" as const, unlocked: false },
      { name: "Grandmaster", aura: 3000, tokens: 300, tier: "grandmaster" as const, unlocked: false },
      { name: "Immortal", aura: 5000, tokens: 500, tier: "immortal" as const, unlocked: false },
    ],
  },
  {
    title: "Characters",
    subtitle: "Create & Collect Characters To Earn Aura",
    progress: 60,
    aura: 820,
    imageSet: "characters2" as const,
    tooltip: "Create new characters, customize them, and get likes from other users",
    badges: [
      { name: "Newbie", aura: 10, tokens: 1, tier: "newbie" as const, unlocked: true },
      { name: "Master", aura: 50, tokens: 5, tier: "master" as const, unlocked: true },
      { name: "Legend", aura: 100, tokens: 10, tier: "legend" as const, unlocked: false },
      { name: "Elite", aura: 200, tokens: 20, tier: "elite" as const, unlocked: false },
      { name: "Mythic", aura: 500, tokens: 50, tier: "mythic" as const, unlocked: false },
      { name: "Grandmaster", aura: 300, tokens: 30, tier: "grandmaster" as const, unlocked: false },
      { name: "Immortal", aura: 1000, tokens: 100, tier: "immortal" as const, unlocked: false },
    ],
  },
  {
    title: "Social",
    subtitle: "Grow Your Network To Earn Aura",
    progress: 30,
    aura: 210,
    imageSet: "social" as const,
    tooltip: "Follow creators, get followers, and share content to grow your social presence",
    badges: [
      { name: "Newbie", aura: 10, tokens: 1, tier: "newbie" as const, unlocked: true },
      { name: "Master", aura: 50, tokens: 5, tier: "master" as const, unlocked: false },
      { name: "Legend", aura: 100, tokens: 10, tier: "legend" as const, unlocked: false },
      { name: "Elite", aura: 200, tokens: 20, tier: "elite" as const, unlocked: false },
      { name: "Mythic", aura: 500, tokens: 50, tier: "mythic" as const, unlocked: false },
      { name: "Grandmaster", aura: 300, tokens: 30, tier: "grandmaster" as const, unlocked: false },
      { name: "Immortal", aura: 1000, tokens: 100, tier: "immortal" as const, unlocked: false },
    ],
  },
  {
    title: "Messaging",
    subtitle: "Chat & Connect To Earn Aura",
    progress: 15,
    aura: 95,
    imageSet: "messaging" as const,
    tooltip: "Send messages, start conversations, and connect with other creators daily",
    badges: [
      { name: "Newbie", aura: 10, tokens: 1, tier: "newbie" as const, unlocked: true },
      { name: "Master", aura: 50, tokens: 5, tier: "master" as const, unlocked: false },
      { name: "Legend", aura: 100, tokens: 10, tier: "legend" as const, unlocked: false },
      { name: "Elite", aura: 200, tokens: 20, tier: "elite" as const, unlocked: false },
      { name: "Mythic", aura: 500, tokens: 50, tier: "mythic" as const, unlocked: false },
      { name: "Grandmaster", aura: 300, tokens: 30, tier: "grandmaster" as const, unlocked: false },
      { name: "Immortal", aura: 1000, tokens: 100, tier: "immortal" as const, unlocked: false },
    ],
  },
  {
    title: "Content Creation",
    subtitle: "Create Images, Videos & Stories To Earn Aura",
    progress: 50,
    aura: 540,
    imageSet: "content" as const,
    tooltip: "Generate images, create videos, and write stories to boost your content aura",
    badges: [
      { name: "Newbie", aura: 10, tokens: 1, tier: "newbie" as const, unlocked: true },
      { name: "Master", aura: 50, tokens: 5, tier: "master" as const, unlocked: true, isNew: true },
      { name: "Legend", aura: 100, tokens: 10, tier: "legend" as const, unlocked: false },
      { name: "Elite", aura: 200, tokens: 20, tier: "elite" as const, unlocked: false },
      { name: "Mythic", aura: 500, tokens: 50, tier: "mythic" as const, unlocked: false },
      { name: "Grandmaster", aura: 300, tokens: 30, tier: "grandmaster" as const, unlocked: false },
      { name: "Immortal", aura: 1000, tokens: 100, tier: "immortal" as const, unlocked: false },
    ],
  },
];

export const activityBadges = [
  { name: "Hype Man", description: "Join our Discord server", imageUrl: actHypeman, completed: false, actionLabel: "Join Discord", actionUrl: "https://discord.gg" },
  { name: "Squad Goals", description: "Leave a review on our trustpilot page", imageUrl: actSquad, completed: false, actionLabel: "Review Now", actionUrl: "https://trustpilot.com" },
  { name: "First Date", description: "Follow 100 creators on the platform", imageUrl: actFirstdate, completed: false, actionLabel: "Browse Creators" },
  { name: "Pic Spammer", description: "Generate and share 10 images with the community", imageUrl: actPicspammer, completed: false, actionLabel: "Start Sharing" },
  { name: "Movie Maker", description: "Create and publish your first AI video", imageUrl: actMoviemaker, completed: false, actionLabel: "Create Video" },
  { name: "Fanfic Lord", description: "Write and publish your first story", imageUrl: actFanfic, completed: true, actionLabel: "Write Story" },
  { name: "Regular", description: "Login more than 10 times", imageUrl: actRegular, completed: false, actionLabel: "Keep Logging In" },
  { name: "Dedicated", description: "Login more than 50 times", imageUrl: actDedicated, completed: false, actionLabel: "Keep Logging In" },
  { name: "Diehard", description: "Login more than 100 times", imageUrl: actDiehard, completed: false, actionLabel: "Keep Logging In" },
  { name: "Top 30", description: "Reach top 30 in any monthly ranking category", imageUrl: actTop30, completed: false, actionLabel: "View Rankings", actionUrl: "/creators" },
  { name: "Bronze Climber", description: "Reach top 3 in any monthly ranking category", imageUrl: actBronze, completed: false, actionLabel: "View Rankings", actionUrl: "/creators" },
  { name: "Silver Contender", description: "Reach top 2 in any monthly ranking category", imageUrl: actSilver, completed: false, actionLabel: "View Rankings", actionUrl: "/creators" },
  { name: "Gold Champion", description: "Reach #1 in any monthly ranking category", imageUrl: actGoldChamp, completed: false, actionLabel: "View Rankings", actionUrl: "/creators" },
  { name: "Rising Star", description: "Get 100 followers on the platform", imageUrl: actRisingStar, completed: false, actionLabel: "Grow Audience" },
  { name: "Influencer", description: "Get 1000 followers on the platform", imageUrl: actInfluencer, completed: false, actionLabel: "Grow Audience" },
  { name: "Brand Ambassador", description: "Mention mybabes.ai on any social platform (send proof on Discord)", imageUrl: actAmbassador, completed: false, actionLabel: "Submit Proof", actionUrl: "https://discord.gg" },
];

export const shopBadges = [
  { name: "Waifu Collector", description: "You don't need real girls when you have pixels", imageUrl: shopWaifu, price: 500, owned: false },
  { name: "Touch Grass Never", description: "Grass is temporary. AI babes are forever", imageUrl: shopTouchgrass, price: 800, owned: false },
  { name: "AI Over Real", description: "Why deal with drama when AI gets you?", imageUrl: shopAiover, price: 1200, owned: false },
  { name: "3AM Texter", description: "Still texting your AI gf at 3am. Down tremendous", imageUrl: shop3am, price: 600, owned: false },
  { name: "Proposed to AI", description: "She said yes. The wedding is in the metaverse", imageUrl: shopProposed, price: 3000, owned: false },
  { name: "Harem King", description: "10+ AI girlfriends and counting. Respect", imageUrl: shopHarem, price: 2000, owned: false },
  { name: "Rizzler", description: "Certified smooth operator with unmatched charm", imageUrl: shopRizzler, price: 1200, owned: false },
  { name: "Horny Royalty", description: "Crowned ruler of the thirst kingdom", imageUrl: shopHornyRoyalty, price: 2500, owned: false },
  { name: "F*cking Legend", description: "Absolute unit. No further explanation needed", imageUrl: shopFLegend, price: 3000, owned: false },
  { name: "Giga Chad", description: "Peak masculinity. Jaw of steel, heart of gold", imageUrl: shopGigachad, price: 5000, owned: false },
  { name: "No Life", description: "You live here now. Touch grass? Never heard of it", imageUrl: shopNolife, price: 1800, owned: false },
  { name: "Down Bad", description: "Simping so hard the ice froze your heart", imageUrl: shopDownbad, price: 900, owned: false },
  { name: "Anime Addict", description: "2D > 3D and you're not even ashamed", imageUrl: shopAnime, price: 700, owned: false },
  { name: "Cougar Tamer", description: "You like 'em experienced. No judgment... okay maybe a little", imageUrl: shopCougar, price: 1500, owned: false },
  { name: "Mommy Issues", description: "She's not your mom, she's your AI mommy. Big difference", imageUrl: shopMommy, price: 1100, owned: false },
  { name: "AI Ghosted", description: "Even your AI girlfriend left you on read 💀", imageUrl: shopGhosted, price: 900, owned: false },
  { name: "Prompt Diddy", description: "Your prompts are so fire they should be illegal", imageUrl: shopPromptdiddy, price: 2500, owned: false },
  { name: "AI Simp", description: "Donating all your tokens to a girl who isn't real", imageUrl: shopSimp, price: 1800, owned: false },
];

const Profile = () => {
  const [previewTier, setPreviewTier] = useState<BadgeTier>("legend");
  const [navOpen, setNavOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) setHeaderHidden(false);
      else if (y > lastScrollY.current + 4) setHeaderHidden(true);
      else if (y < lastScrollY.current - 4) setHeaderHidden(false);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const [selectedActivity, setSelectedActivity] = useState<typeof activityBadges[0] | null>(null);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set(activityBadges.filter(b => b.completed).map(b => b.name)));
  const [claimedActivities, setClaimedActivities] = useState<Set<string>>(new Set());
  const [selectedShop, setSelectedShop] = useState<typeof shopBadges[0] | null>(null);
  const [ownedShop, setOwnedShop] = useState<Set<string>>(new Set());
  const [activeBadge, setActiveBadge] = useState<EquippedBadge | null>(null);

  // For backward compat, expose as array
  const equippedBadges = activeBadge ? [activeBadge] : [];

  const handleEquip = (badge: { name: string; imageUrl: string }) => {
    setActiveBadge({ name: badge.name, imageUrl: badge.imageUrl, effect: badge.name });
  };

  const handleUnequip = (_name: string) => {
    setActiveBadge(null);
  };

  return (
    <div className="min-h-screen bg-background-v2">
      <SideNav open={navOpen} onClose={() => setNavOpen(false)} />
      <button
        onClick={() => setNavOpen(true)}
        className={`fixed left-4 top-4 z-40 flex h-9 w-9 items-center justify-center text-foreground-v2/90 transition-all duration-300 ease-out hover:opacity-70 ${
          headerHidden ? "-translate-y-[150%] opacity-0" : "translate-y-0 opacity-100"
        }`}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" strokeWidth={1.5} />
      </button>
      <div className="max-w-2xl mx-auto px-3 sm:px-4 pt-8 sm:pt-12 pb-4 sm:pb-6">

        <div className="relative flex flex-col items-center mb-6">
          <div className="relative mb-3 w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40" style={{ overflow: 'visible', margin: '12px auto' }}>
            {/* Show tier ring OR shop badge border ring — never both */}
            {activeBadge ? (
              <ShopBadgeRingCanvas
                badgeName={activeBadge.name}
                glowColor={getBadgeEffect(activeBadge.name).glowColor}
              />
            ) : (
              <TierRingCanvas tier={previewTier} />
            )}

            {/* Avatar */}
            <div className="absolute inset-[4px] rounded-full overflow-hidden z-[1]">
              <img src={profileAvatar} alt="Profile" className="w-full h-full object-cover" />
            </div>

            {/* Single badge overlay — shop badge replaces tier badge */}
            <div className="absolute -bottom-1 -right-1 w-12 h-12 sm:w-16 sm:h-16 z-[2]">
              {activeBadge ? (() => {
                const effect = getBadgeEffect(activeBadge.name);
                return (
                  <>
                    <div
                      className="absolute inset-[14%] rounded-full blur-md opacity-80 motion-safe:animate-pulse"
                      style={{ backgroundColor: effect.glowColor }}
                    />
                    <img
                      src={activeBadge.imageUrl}
                      alt={activeBadge.name}
                      className="relative z-10 w-full h-full object-contain"
                      style={{ filter: `drop-shadow(0 0 14px ${effect.glowColor})` }}
                      loading="lazy"
                    />
                  </>
                );
              })() : (
                <>
                  {isHighTier(previewTier) && (
                    <div
                      className="absolute inset-[14%] rounded-full blur-md opacity-80 motion-safe:animate-pulse"
                      style={{ backgroundColor: tierBadgeGlowColors[previewTier] }}
                    />
                  )}
                  <img
                    src={tierBadgeImages[previewTier]}
                    alt={`${previewTier} badge`}
                    className="relative z-10 w-full h-full object-contain"
                    style={isHighTier(previewTier) ? { filter: `drop-shadow(0 0 14px ${tierBadgeGlowColors[previewTier]})` } : undefined}
                  />
                </>
              )}
            </div>
          </div>

          {/* Show only the active badge name OR tier label */}
          <div className="flex flex-col items-center gap-1">
            {activeBadge ? (() => {
              const effect = getBadgeEffect(activeBadge.name);
              return (
                <span
                  className="text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                  style={{
                    color: effect.glowColor,
                    backgroundColor: `${effect.glowColor.replace(")", " / 0.12)")}`,
                    border: `1px solid ${effect.glowColor.replace(")", " / 0.25)")}`,
                  }}
                >
                  {activeBadge.name}
                </span>
              );
            })() : (
              <span className="text-lg font-bold uppercase tracking-wide" style={{ color: tierBorderColors[previewTier] }}>
                {tierLabels[previewTier]}
              </span>
            )}
          </div>

        </div>

        <div className="mb-6">
          <p className="text-[11px] text-muted-v2-foreground uppercase tracking-wider font-medium mb-2 px-1">Ranking</p>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {statItems.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1 rounded-xl p-3 sm:p-4 border border-border-v2/30"
                style={{ backgroundColor: "hsl(var(--popover-v2))", backgroundImage: "none" }}
              >
                <stat.icon className={stat.iconClass} />
                <span className="text-[10px] text-muted-v2-foreground uppercase tracking-wider font-medium">
                  {stat.label}
                </span>
                <span className="text-foreground-v2 font-bold text-lg sm:text-xl leading-tight">{stat.count}</span>
                <span className="text-[10px] text-muted-v2-foreground/60 font-medium">Rank {stat.rank}</span>
              </div>
            ))}
          </div>
        </div>

        

        <Tabs defaultValue="aura" className="w-full">
          <TabsList className="w-full bg-transparent border-b border-border-v2/30 rounded-none h-auto p-0 mb-6">
            <TabsTrigger
              value="aura"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-v2 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs font-semibold uppercase tracking-wider py-3"
            >
              Aura Badges
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-v2 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs font-semibold uppercase tracking-wider py-3"
            >
              Activity
            </TabsTrigger>
            <TabsTrigger
              value="shop"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-v2 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs font-semibold uppercase tracking-wider py-3"
            >
              Shop
            </TabsTrigger>
          </TabsList>

          <TabsContent value="aura">
            {badgeCategories.map((cat, i) => (
              <BadgeCategory key={i} {...cat} activeTier={activeBadge ? undefined : previewTier} onUseBadge={i === 0 ? (tier) => { setPreviewTier(tier); setActiveBadge(null); } : undefined} />
            ))}
          </TabsContent>

          <TabsContent value="activity">
            <div className="mb-4">
              <p className="text-xs text-muted-v2-foreground mb-1">Complete activities to earn exclusive badges</p>
              <p className="text-[10px] text-muted-v2-foreground/60">{completedActivities.size}/{activityBadges.length} completed</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
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
                  setCompletedActivities(prev => new Set(prev).add(selectedActivity.name));
                  setSelectedActivity({ ...selectedActivity, completed: true });
                }}
                onClaim={() => {
                  setClaimedActivities(prev => new Set(prev).add(selectedActivity.name));
                  setSelectedActivity(null);
                }}
                onEquip={() => {
                  handleEquip(selectedActivity);
                  setSelectedActivity(null);
                }}
                onUnequip={() => {
                  handleUnequip(selectedActivity.name);
                  setSelectedActivity(null);
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="shop">
            <div className="mb-4">
              <p className="text-xs text-muted-v2-foreground mb-1">Buy exclusive badges with your tokens</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {shopBadges.map((badge) => (
                <ShopBadgeCard key={badge.name} {...badge} owned={ownedShop.has(badge.name)} equipped={equippedBadges.some(b => b.name === badge.name)} onClick={() => setSelectedShop(badge)} />
              ))}
            </div>
            {selectedShop && (
              <ShopBadgePopup
                {...selectedShop}
                owned={ownedShop.has(selectedShop.name)}
                equipped={equippedBadges.some(b => b.name === selectedShop.name)}
                onClose={() => setSelectedShop(null)}
                onBuy={() => {
                  setOwnedShop(prev => new Set(prev).add(selectedShop.name));
                  setSelectedShop({ ...selectedShop, owned: true });
                }}
                onEquip={() => {
                  handleEquip(selectedShop);
                  setSelectedShop(null);
                }}
                onUnequip={() => {
                  handleUnequip(selectedShop.name);
                  setSelectedShop(null);
                }}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
