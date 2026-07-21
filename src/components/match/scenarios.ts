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
import storyIsland from "@/assets/story-island.jpg";
import storyTokyo from "@/assets/story-tokyo.jpg";
import storyVelvet from "@/assets/story-velvet.jpg";
import createYourOwnBabe from "@/assets/match/create-your-own-babe.jpg";
import createImagesVideosModel from "@/assets/match/create-images-videos-model.jpg";
...
export const CREATE_CARDS: CreateCard[] = [
  {
    id: "create-image",
    title: "Create your own babe",
    badge: "Create your own babe",
    description: "Pick her look, body, vibe, and story — then build a custom girl around your exact fantasy.",
    imageUrl: createYourOwnBabe,
    accent: "#38bdf8",
    benefits: [
      "Design looks, body & style",
      "Write personality and backstory",
      "Lock in her tone and chemistry",
      "Start from your own fantasy",
    ],
    ctaLabel: "Create your babe",
    ctaUrl: "https://mybabes.ai/babes/create",
  },
  {
    id: "create-video",
    title: "Create images & videos",
    badge: "Image & video model",
    description: "Use a ready model to generate custom photos, idle clips, and short cinematic scenes on demand.",
    imageUrl: createImagesVideosModel,
    accent: "#22d3ee",
    benefits: [
      "Generate custom photos instantly",
      "Create idle and intro video clips",
      "Mix images, motion, and vibe",
      "Build media before chat starts",
    ],
    ctaLabel: "Create media",
    ctaUrl: "https://mybabes.ai/babes/create",
  },
  {
    id: "story-island-escape",
    title: "Island Escape",
    badge: "Trending story",
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
    id: "story-tokyo-after-dark",
    title: "Tokyo After Dark",
    badge: "Trending story",
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
    badge: "Trending story",
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
