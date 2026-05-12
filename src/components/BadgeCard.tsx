import { Lock, Check } from "lucide-react";
import badgeNewbie from "../assets/badge-newbie.png";
import badgeMaster from "../assets/badge-master.png";
import badgeLegend from "../assets/badge-legend.png";
import badgeElite from "../assets/badge-elite.png";
import badgeMythic from "../assets/badge-mythic.png";
import badgeGrandmaster from "../assets/badge-grandmaster.png";
import badgeImmortal from "../assets/badge-immortal.png";

// Characters
import charNewbie from "../assets/badges/char-newbie.png";
import charMaster from "../assets/badges/char-master.png";
import charLegend from "../assets/badges/char-legend.png";
import charElite from "../assets/badges/char-elite.png";
import charMythic from "../assets/badges/char-mythic.png";
import charGrandmaster from "../assets/badges/char-grandmaster.png";
import charImmortal from "../assets/badges/char-immortal.png";

// Social
import socialNewbie from "../assets/badges/social-newbie.png";
import socialMaster from "../assets/badges/social-master.png";
import socialLegend from "../assets/badges/social-legend.png";
import socialElite from "../assets/badges/social-elite.png";
import socialMythic from "../assets/badges/social-mythic.png";
import socialGrandmaster from "../assets/badges/social-grandmaster.png";
import socialImmortal from "../assets/badges/social-immortal.png";

// Messaging
import msgNewbie from "../assets/badges/msg-newbie.png";
import msgMaster from "../assets/badges/msg-master.png";
import msgLegend from "../assets/badges/msg-legend.png";
import msgElite from "../assets/badges/msg-elite.png";
import msgMythic from "../assets/badges/msg-mythic.png";
import msgGrandmaster from "../assets/badges/msg-grandmaster.png";
import msgImmortal from "../assets/badges/msg-immortal.png";

// Content Creation
import contentNewbie from "../assets/badges/content-newbie.png";
import contentMaster from "../assets/badges/content-master.png";
import contentLegend from "../assets/badges/content-legend.png";
import contentElite from "../assets/badges/content-elite.png";
import contentMythic from "../assets/badges/content-mythic.png";
import contentGrandmaster from "../assets/badges/content-grandmaster.png";
import contentImmortal from "../assets/badges/content-immortal.png";

// Characters v2 (symbolic)
import char2Newbie from "../assets/badges/char2-newbie.png";
import char2Master from "../assets/badges/char2-master.png";
import char2Legend from "../assets/badges/char2-legend.png";
import char2Elite from "../assets/badges/char2-elite.png";
import char2Mythic from "../assets/badges/char2-mythic.png";
import char2Grandmaster from "../assets/badges/char2-grandmaster.png";
import char2Immortal from "../assets/badges/char2-immortal.png";

export type BadgeTier = "newbie" | "master" | "legend" | "mythic" | "elite" | "grandmaster" | "immortal";
export type BadgeImageSet = "aura" | "characters" | "characters2" | "social" | "messaging" | "content" | "totalAura";
type ImportedImage = string | { src: string };

interface BadgeCardProps {
  name: string;
  aura: number;
  tokens?: number;
  tier: BadgeTier;
  unlocked: boolean;
  claimed?: boolean;
  isNew?: boolean;
  imageSet?: BadgeImageSet;
  onClick?: () => void;
}

const imageSets: Record<BadgeImageSet, Record<BadgeTier, ImportedImage>> = {
  aura: {
    newbie: badgeNewbie, master: badgeMaster, legend: badgeLegend,
    elite: badgeElite, mythic: badgeMythic, grandmaster: badgeGrandmaster, immortal: badgeImmortal,
  },
  characters: {
    newbie: charNewbie, master: charMaster, legend: charLegend,
    elite: charElite, mythic: charMythic, grandmaster: charGrandmaster, immortal: charImmortal,
  },
  totalAura: {
    newbie: charNewbie, master: charMaster, legend: charLegend,
    elite: charElite, mythic: charMythic, grandmaster: badgeGrandmaster, immortal: charImmortal,
  },
  social: {
    newbie: socialNewbie, master: socialMaster, legend: socialLegend,
    elite: socialElite, mythic: socialMythic, grandmaster: socialGrandmaster, immortal: socialImmortal,
  },
  messaging: {
    newbie: msgNewbie, master: msgMaster, legend: msgLegend,
    elite: msgElite, mythic: msgMythic, grandmaster: msgGrandmaster, immortal: msgImmortal,
  },
  content: {
    newbie: contentNewbie, master: contentMaster, legend: contentLegend,
    elite: contentElite, mythic: contentMythic, grandmaster: contentGrandmaster, immortal: contentImmortal,
  },
  characters2: {
    newbie: char2Newbie, master: char2Master, legend: char2Legend,
    elite: char2Elite, mythic: char2Mythic, grandmaster: char2Grandmaster, immortal: char2Immortal,
  },
};

export { imageSets };

const resolveImageSrc = (image: ImportedImage): string =>
  typeof image === "string" ? image : image.src;

const tierSizes: Record<BadgeTier, { base: string; sm: string }> = {
  newbie:      { base: "w-[88px] h-[88px]", sm: "sm:w-[100px] sm:h-[100px]" },
  master:      { base: "w-[94px] h-[94px]", sm: "sm:w-[108px] sm:h-[108px]" },
  legend:      { base: "w-[100px] h-[100px]", sm: "sm:w-[116px] sm:h-[116px]" },
  elite:       { base: "w-[106px] h-[106px]", sm: "sm:w-[124px] sm:h-[124px]" },
  mythic:      { base: "w-[112px] h-[112px]", sm: "sm:w-[132px] sm:h-[132px]" },
  grandmaster: { base: "w-[118px] h-[118px]", sm: "sm:w-[140px] sm:h-[140px]" },
  immortal:    { base: "w-[124px] h-[124px]", sm: "sm:w-[148px] sm:h-[148px]" },
};

const tierImgGlow: Partial<Record<BadgeTier, string>> = {
  elite: "drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]",
  mythic: "drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]",
  grandmaster: "drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]",
  immortal: "drop-shadow-[0_0_12px_rgba(234,179,8,0.55)]",
};

const BadgeCard = ({ name, aura, tier, unlocked, claimed = true, isNew = false, imageSet = "aura", onClick }: BadgeCardProps) => {
  const images = imageSets[imageSet];
  const showNew = isNew;
  const size = tierSizes[tier];
  const imgGlow = unlocked ? tierImgGlow[tier] ?? "" : "";

  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2 min-w-[145px] sm:min-w-[170px] cursor-pointer" onClick={onClick}>
      <div
        className={`relative w-[140px] h-[140px] sm:w-[164px] sm:h-[164px] rounded-[1.25rem] sm:rounded-[1.75rem] border border-border/30 flex items-center justify-center transition-transform duration-300 ${
          unlocked ? "hover:scale-[1.03]" : "opacity-45 grayscale"
        }`}
        style={{ backgroundColor: "hsl(var(--popover-v2))", backgroundImage: "none" }}
      >
        <img
          src={resolveImageSrc(images[tier])}
          alt={`${name} badge`}
          className={`${size.base} ${size.sm} object-cover rounded-lg ${imgGlow}`}
          loading="lazy"
        />

        {!unlocked && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[1.25rem] sm:rounded-[1.75rem] bg-background/35">
            <Lock className="w-5 h-5 text-muted-foreground" />
          </div>
        )}

        {showNew && (
          <div className="absolute -top-1.5 -right-1.5 z-20 bg-primary text-primary-foreground text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg animate-pulse">
            NEW
          </div>
        )}

        {unlocked && !claimed && !showNew && (
          <div className="absolute -top-1.5 -right-1.5 z-20 bg-primary text-primary-foreground text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg animate-pulse">
            NEW
          </div>
        )}

        {unlocked && claimed && !showNew && (
          <div className="absolute -top-1.5 -right-1.5 z-20 text-[9px] font-bold px-2 py-0.5 rounded-full text-muted-foreground border border-border/30" style={{ backgroundColor: "hsl(var(--muted))" }}>
            <Check className="w-3 h-3" />
          </div>
        )}
      </div>
      <p className="text-xs font-semibold text-foreground capitalize">{name}</p>
      <p className="text-[10px] text-muted-foreground">{aura.toLocaleString()} aura</p>
    </div>
  );
};

export default BadgeCard;
