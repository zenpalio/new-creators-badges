import char1 from "../assets/char1.jpg";
import char2 from "../assets/char2.jpg";
import char3 from "../assets/char3.jpg";
import char4 from "../assets/char4.jpg";
import char5 from "../assets/char5.jpg";
import char6 from "../assets/char6.jpg";

export type PopunderVariantId =
  | "hetero-sfw"
  | "hetero-nsfw"
  | "female-sfw"
  | "gay-nsfw";

export type PopunderCharacter = {
  name: string;
  age: number;
  tagline: string;
  image: string;
};

export type PopunderVariant = {
  id: PopunderVariantId;
  hook: { line1: string; line2: string };
  characters: PopunderCharacter[];
  matchQuote: (name: string) => string;
  ctaLabel: string;
  accent: "pink" | "electric-blue" | "gold" | "violet";
  nsfw: boolean;
  proofLabel: string; // e.g. "guys picked in the last hour"
};

export const popunderVariants: Record<PopunderVariantId, PopunderVariant> = {
  "hetero-nsfw": {
    id: "hetero-nsfw",
    hook: {
      line1: "Feeling lucky tonight?",
      line2: "Pick the one you want to meet first.",
    },
    characters: [
      { name: "Lia", age: 22, tagline: "Bad decisions, good night.", image: char4 },
      { name: "Catalina", age: 24, tagline: "Don't make me wait.", image: char2 },
      { name: "Zahra", age: 23, tagline: "I dare you.", image: char3 },
      { name: "Sakura", age: 21, tagline: "Caught you looking.", image: char1 },
    ],
    matchQuote: (name) => `Mmm... I've been waiting for you. — ${name}`,
    ctaLabel: "Continue →",
    accent: "pink",
    nsfw: true,
    proofLabel: "guys picked in the last hour",
  },
  "hetero-sfw": {
    id: "hetero-sfw",
    hook: {
      line1: "Which one catches your eye?",
      line2: "Pick your favourite to keep chatting.",
    },
    characters: [
      { name: "Lia", age: 22, tagline: "Coffee shop regular.", image: char4 },
      { name: "Catalina", age: 24, tagline: "Loves a good debate.", image: char2 },
      { name: "Zahra", age: 23, tagline: "Always up for a laugh.", image: char3 },
      { name: "Sakura", age: 21, tagline: "Hopeless romantic.", image: char1 },
    ],
    matchQuote: (name) => `Hey, I was hoping you'd pick me. — ${name}`,
    ctaLabel: "Continue →",
    accent: "electric-blue",
    nsfw: false,
    proofLabel: "people picked in the last hour",
  },
  "female-sfw": {
    id: "female-sfw",
    hook: {
      line1: "Who's your type tonight?",
      line2: "Pick the one you'd love to meet.",
    },
    characters: [
      { name: "Adrian", age: 26, tagline: "Soft eyes, sharp mind.", image: char5 },
      { name: "Marco", age: 28, tagline: "Wants to know your story.", image: char6 },
      { name: "Theo", age: 25, tagline: "Plays guitar at midnight.", image: char5 },
      { name: "Kai", age: 27, tagline: "Always brings flowers.", image: char6 },
    ],
    matchQuote: (name) => `Hey you. I was hoping it'd be me. — ${name}`,
    ctaLabel: "Continue →",
    accent: "violet",
    nsfw: false,
    proofLabel: "women picked in the last hour",
  },
  "gay-nsfw": {
    id: "gay-nsfw",
    hook: {
      line1: "Who do you want first?",
      line2: "Pick the one you can't take your eyes off.",
    },
    characters: [
      { name: "Adrian", age: 26, tagline: "Bad with rules.", image: char5 },
      { name: "Marco", age: 28, tagline: "Built for trouble.", image: char6 },
      { name: "Theo", age: 25, tagline: "Don't keep me waiting.", image: char5 },
      { name: "Kai", age: 27, tagline: "I dare you.", image: char6 },
    ],
    matchQuote: (name) => `Mmm... I've been waiting for you. — ${name}`,
    ctaLabel: "Continue →",
    accent: "gold",
    nsfw: true,
    proofLabel: "guys picked in the last hour",
  },
};

export const accentClasses: Record<
  PopunderVariant["accent"],
  {
    ring: string;
    hoverRing: string;
    text: string;
    glow: string;
    btn: string;
    orbA: string;
    orbB: string;
    /** chunky banner: solid fill colors (hex) for text + shadow + outline */
    banner: { fill: string; shadow: string; stroke: string; bg: string };
    /** big name sticker color (hex) for character name labels */
    nameSticker: { fill: string; shadow: string; stroke: string };
  }
> = {
  pink: {
    ring: "ring-pink-500/80",
    hoverRing: "hover:ring-pink-400",
    text: "text-pink-400",
    glow: "shadow-[0_0_40px_-5px_rgba(236,72,153,0.8)]",
    btn: "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400",
    orbA: "bg-gradient-to-br from-pink-500/40 to-rose-500/10",
    orbB: "bg-gradient-to-tr from-fuchsia-500/30 to-pink-500/10",
    banner: { fill: "#ffd1e0", shadow: "#9d174d", stroke: "#4a044e", bg: "linear-gradient(180deg, rgba(40,10,30,0.85), rgba(20,5,15,0.95))" },
    nameSticker: { fill: "#ffe4ec", shadow: "#be185d", stroke: "#3b0a25" },
  },
  "electric-blue": {
    ring: "ring-blue-500/80",
    hoverRing: "hover:ring-blue-400",
    text: "text-blue-400",
    glow: "shadow-[0_0_40px_-5px_rgba(59,130,246,0.8)]",
    btn: "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400",
    orbA: "bg-gradient-to-br from-blue-500/40 to-cyan-500/10",
    orbB: "bg-gradient-to-tr from-sky-500/30 to-blue-500/10",
    banner: { fill: "#dbeafe", shadow: "#1e3a8a", stroke: "#082f49", bg: "linear-gradient(180deg, rgba(10,20,40,0.85), rgba(5,10,25,0.95))" },
    nameSticker: { fill: "#e0f2fe", shadow: "#1d4ed8", stroke: "#0c1e3d" },
  },
  gold: {
    ring: "ring-amber-500/80",
    hoverRing: "hover:ring-amber-400",
    text: "text-amber-400",
    glow: "shadow-[0_0_40px_-5px_rgba(245,158,11,0.8)]",
    btn: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400",
    orbA: "bg-gradient-to-br from-amber-500/40 to-orange-500/10",
    orbB: "bg-gradient-to-tr from-yellow-500/30 to-amber-500/10",
    banner: { fill: "#fde68a", shadow: "#92400e", stroke: "#1c1006", bg: "linear-gradient(180deg, rgba(40,25,5,0.85), rgba(20,12,3,0.95))" },
    nameSticker: { fill: "#fef3c7", shadow: "#b45309", stroke: "#1c1006" },
  },
  violet: {
    ring: "ring-violet-500/80",
    hoverRing: "hover:ring-violet-400",
    text: "text-violet-400",
    glow: "shadow-[0_0_40px_-5px_rgba(139,92,246,0.8)]",
    btn: "bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400",
    orbA: "bg-gradient-to-br from-violet-500/40 to-fuchsia-500/10",
    orbB: "bg-gradient-to-tr from-purple-500/30 to-violet-500/10",
    banner: { fill: "#ede9fe", shadow: "#5b21b6", stroke: "#1e1033", bg: "linear-gradient(180deg, rgba(25,15,40,0.85), rgba(12,7,22,0.95))" },
    nameSticker: { fill: "#f3e8ff", shadow: "#7e22ce", stroke: "#1e1033" },
  },
};
