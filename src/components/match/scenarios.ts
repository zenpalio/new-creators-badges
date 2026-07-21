import maiPortrait from "@/assets/chars/mai.png.asset.json";
import meiPortrait from "@/assets/chars/mei.png.asset.json";
import cleoPortrait from "@/assets/chars/cleo.png.asset.json";
import annaPortrait from "@/assets/chars/anna.png.asset.json";
import abbyPortrait from "@/assets/chars/abby.png.asset.json";
import boPortrait from "@/assets/chars/bo.png.asset.json";
import maiHero from "@/assets/vn/h7-s02-mai-tour.jpg.asset.json";
import cleoBg from "@/assets/saga-chat-cleo.jpg.asset.json";
import cleoWarm from "@/assets/saga-chat-cleo-warm.jpg.asset.json";
import cleoWin from "@/assets/saga-chat-cleo-win.jpg.asset.json";
import annaBg from "@/assets/saga-chat-anna.jpg.asset.json";
import annaWarm from "@/assets/saga-chat-anna-warm.jpg.asset.json";
import annaWin from "@/assets/saga-chat-anna-win.jpg.asset.json";
import abbyBg from "@/assets/saga-chat-abby.jpg.asset.json";
import abbyWarm from "@/assets/saga-chat-abby-warm.jpg.asset.json";
import abbyWin from "@/assets/saga-chat-abby-win.jpg.asset.json";
import boBg from "@/assets/saga-chat-bo.jpg.asset.json";
import boWarm from "@/assets/saga-chat-bo-warm.jpg.asset.json";
import boWin from "@/assets/saga-chat-bo-win.jpg.asset.json";
import annaChatBg from "@/assets/anna-chat-bg.mp4.asset.json";
import sagaPov1Video from "@/assets/saga-pov-1.mp4.asset.json";
import sagaPov2Video from "@/assets/saga-pov-2.mp4.asset.json";
import pricingHero from "@/assets/pricing-hero.jpeg.asset.json";
import storyIsland from "@/assets/story-island.jpg";
import storyTokyo from "@/assets/story-tokyo.jpg";
import storyVelvet from "@/assets/story-velvet.jpg";

export type ScenarioId =
  | "mai-roommate"
  | "cleo-app"
  | "anna-rescue"
  | "abby-boss"
  | "bo-ex";

export type ScenarioMode = "live" | "story" | "simple";
export type MediaStage = {
  kind: "image" | "video";
  src: string;
};

export type IntroSlide = {
  media: string;
  title: string;
  caption: string;
};

export type Scenario = {
  id: ScenarioId;
  name: string;
  age: number;
  tag: string;
  hook: string;
  pitch: string[];
  opener: string;
  portrait: string;
  hero: string;
  heat: MediaStage[];
  selfies?: string[];
  accent: string;
  bio: string;
  traits: string[];
  roleplay: string;
  slides: string[];
  mode: ScenarioMode;
  modeLabel: string;
  introSlides?: IntroSlide[];
};

export type CreateCardId =
  | "create-image"
  | "create-video"
  | "story-island-escape"
  | "story-tokyo-after-dark"
  | "story-velvet-hours";

export type CreateCard = {
  id: CreateCardId;
  title: string;
  badge: string;
  description: string;
  imageUrl: string;
  accent: string;
  benefits: string[];
  ctaLabel: string;
  ctaUrl: string;
};

export const SCENARIOS: Scenario[] = [
  {
    id: "mai-roommate",
    name: "Mai",
    age: 22,
    tag: "Your new roommate",
    hook: "first night · she 'accidentally' walked in",
    pitch: [
      "You just moved in together",
      "Thin walls, one shared bathroom",
      "Tonight she 'accidentally' walked in",
    ],
    opener: "hey…sorry. i thought this was my room 🙈 you unpacking?",
    portrait: maiPortrait.url,
    hero: maiHero.url,
    heat: [
      { kind: "image", src: maiHero.url },
      { kind: "image", src: maiHero.url },
      { kind: "image", src: maiHero.url },
    ],
    accent: "#38bdf8",
    bio: "Art student. Night owl. Keeps a stack of Polaroids on her desk and never explains what's on them.",
    traits: ["shy at first", "flirty when comfy", "midnight talker"],
    roleplay: "You just moved in. Shared bathroom, thin walls, one shared kitchen. Tonight she 'accidentally' walked into your room in a hoodie and didn't leave.",
    slides: [maiHero.url, maiPortrait.url, maiHero.url],
    mode: "story",
    modeLabel: "Interactive shorts",
    introSlides: [
      {
        media: maiHero.url,
        title: "New place, one rule",
        caption: "You barely unpacked before Mai started hovering in the doorway like she already had plans for you.",
      },
      {
        media: maiPortrait.url,
        title: "She acts shy first",
        caption: "Soft voice, curious eyes, one step too close every time you answer her.",
      },
      {
        media: maiHero.url,
        title: "Then she lingers",
        caption: "The bathroom is shared, the walls are thin, and she somehow keeps finding excuses to stay.",
      },
      {
        media: maiHero.url,
        title: "Tonight is the opening",
        caption: "One small mistake, one lingering look, and suddenly the room feels a lot smaller.",
      },
    ],
  },
  {
    id: "cleo-app",
    name: "Cleo",
    age: 24,
    tag: "Late-night match",
    hook: "she messaged first · 11:42pm",
    pitch: [
      "You matched an hour ago",
      "She's home alone, bored, buzzed",
      "She texted first — see where it goes",
    ],
    opener: "ok your bio genuinely made me laugh. dangerous move.",
    portrait: cleoPortrait.url,
    hero: cleoBg.url,
    heat: [
      { kind: "image", src: cleoBg.url },
      { kind: "image", src: cleoWarm.url },
      { kind: "image", src: cleoWin.url },
    ],
    accent: "#22d3ee",
    bio: "Bartender with purple curls and a sharper tongue than her cocktails. Reads tarot for fun, believes none of it.",
    traits: ["forward", "playful", "loves a dare"],
    roleplay: "You matched an hour ago. She's alone in her apartment, bored, drink in hand — and she messaged first. See how far the banter goes before she suggests you come over.",
    slides: [cleoBg.url, cleoWarm.url, cleoWin.url, cleoPortrait.url],
    mode: "story",
    modeLabel: "Interactive shorts",
    introSlides: [
      {
        media: cleoBg.url,
        title: "One hour after matching",
        caption: "Cleo doesn't wait around. She opens with a tease and makes it clear she's not here for small talk.",
      },
      {
        media: cleoPortrait.url,
        title: "She's all momentum",
        caption: "Purple curls, fast smile, and the kind of confidence that makes every reply feel like a challenge.",
      },
      {
        media: cleoWarm.url,
        title: "The dare begins",
        caption: "What starts as banter turns into a game of who can make the other crack first.",
      },
      {
        media: cleoWin.url,
        title: "Push your luck",
        caption: "If you keep up, she'll stop flirting around the idea and start talking like she means it.",
      },
    ],
  },
  {
    id: "anna-rescue",
    name: "Anna",
    age: 27,
    tag: "The stranger who saved you",
    hook: "her truck · no signal · storm outside",
    pitch: [
      "You crashed near her route",
      "She's driving through the storm",
      "It's just you and her until shelter",
    ],
    opener: "you're awake. good. stay with me and don't touch the door.",
    portrait: annaPortrait.url,
    hero: annaBg.url,
    heat: [
      { kind: "video", src: annaChatBg.url },
      { kind: "video", src: sagaPov1Video.url },
      { kind: "video", src: sagaPov2Video.url },
    ],
    selfies: [annaBg.url, annaWarm.url, annaWin.url],
    accent: "#fb923c",
    bio: "Ex-medic living off-grid. Doesn't do small talk, doesn't do names, doesn't usually let strangers stay the night.",
    traits: ["guarded", "protective", "quietly intense"],
    roleplay: "You woke up in her truck after the storm. Roads are gone, radio is dead, and she's the only reason you're still breathing.",
    slides: [annaBg.url, annaWarm.url, annaWin.url, annaPortrait.url],
    mode: "live",
    modeLabel: "Live roleplay",
  },
  {
    id: "abby-boss",
    name: "Abby",
    age: 25,
    tag: "The boss's daughter",
    hook: "office party · after hours · she cornered you",
    pitch: [
      "Office holiday party, after hours",
      "Everyone's gone home except her",
      "She just locked your office door",
    ],
    opener: "so. you're the one everyone's scared of my dad hiring. cute.",
    portrait: abbyPortrait.url,
    hero: abbyBg.url,
    heat: [
      { kind: "image", src: abbyBg.url },
      { kind: "image", src: abbyWarm.url },
      { kind: "image", src: abbyWin.url },
    ],
    accent: "#facc15",
    bio: "Law school dropout, daddy's problem. Shows up to your office in heels she can't walk in and knows exactly what she's doing.",
    traits: ["bratty", "spoiled", "hard to impress"],
    roleplay: "It's the office holiday party. Everyone's gone home except her — and she just locked your office door behind her. Bad idea. Very bad idea.",
    slides: [abbyBg.url, abbyWarm.url, abbyWin.url, abbyPortrait.url],
    mode: "simple",
    modeLabel: "Trending babe",
  },
  {
    id: "bo-ex",
    name: "Bo",
    age: 26,
    tag: "Your ex",
    hook: "1:47am · 'you up?'",
    pitch: [
      "It's almost 2am",
      "She texted first — 'you up?'",
      "You both know what happens next",
    ],
    opener: "you up?",
    portrait: boPortrait.url,
    hero: boBg.url,
    heat: [
      { kind: "image", src: boBg.url },
      { kind: "image", src: boWarm.url },
      { kind: "image", src: boWin.url },
    ],
    accent: "#ef4444",
    bio: "The one you shouldn't reply to. Black hair, crop top, still has a hoodie of yours she'll never give back.",
    traits: ["blunt", "unfinished business", "still knows you"],
    roleplay: "It's almost 2am. She texted first. She knows what she's doing. So do you. The question is who folds first.",
    slides: [boBg.url, boWarm.url, boWin.url, boPortrait.url],
    mode: "simple",
    modeLabel: "Quick chat",
  },
];

export const CREATE_CARDS: CreateCard[] = [
  {
    id: "create-image",
    title: "Create your own babe",
    badge: "Generate images",
    description: "Pick her look, body, vibe, and story — then spin up custom images that match your fantasy.",
    imageUrl: meiPortrait.url,
    accent: "#38bdf8",
    benefits: [
      "Design looks, body & style",
      "Write personality and backstory",
      "Generate custom photos instantly",
      "Drop her into chat when ready",
    ],
    ctaLabel: "Start with images",
    ctaUrl: "https://mybabes.ai/babes/create",
  },
  {
    id: "story-island-escape",
    title: "Island Escape",
    badge: "Read stories",
    description: "Stranded on a tropical paradise with a beautiful stranger, every day brings new temptation.",
    imageUrl: storyIsland,
    accent: "#f59e0b",
    benefits: [
      "4 episodes to binge",
      "18 illustrated scenes",
      "Cinematic pacing and reveals",
      "Jump straight into production stories",
    ],
    ctaLabel: "Open story",
    ctaUrl: "https://mybabes.ai/stories",
  },
  {
    id: "create-video",
    title: "Make her move on screen",
    badge: "Generate videos",
    description: "Turn your custom character into idle loops, cinematic intros, and story clips before the chat even starts.",
    imageUrl: pricingHero.url,
    accent: "#22d3ee",
    benefits: [
      "Generate idle and intro scenes",
      "Create roleplay-ready video loops",
      "Match images, voice, and vibe",
      "Build a fully custom funnel",
    ],
    ctaLabel: "Start with video",
    ctaUrl: "https://mybabes.ai/babes/create",
  },
  {
    id: "story-tokyo-after-dark",
    title: "Tokyo After Dark",
    badge: "Read stories",
    description: "Neon-lit alleys, late trains, and a chance meeting that changes everything.",
    imageUrl: storyTokyo,
    accent: "#06b6d4",
    benefits: [
      "3 episodes to unlock",
      "14 atmospheric scenes",
      "Late-night urban romance",
      "Built for direct story entry",
    ],
    ctaLabel: "Open story",
    ctaUrl: "https://mybabes.ai/stories",
  },
  {
    id: "story-velvet-hours",
    title: "Velvet Hours",
    badge: "Read stories",
    description: "Slow-burn elegance behind closed velvet curtains.",
    imageUrl: storyVelvet,
    accent: "#dc2626",
    benefits: [
      "1 premium episode",
      "5 polished story scenes",
      "Luxury, tension, and payoff",
      "Perfect for readers over chat",
    ],
    ctaLabel: "Open story",
    ctaUrl: "https://mybabes.ai/stories",
  },
];

export const scenarioById = (id: ScenarioId) =>
  SCENARIOS.find((s) => s.id === id)!;

export const createCardById = (id: CreateCardId) =>
  CREATE_CARDS.find((card) => card.id === id)!;
