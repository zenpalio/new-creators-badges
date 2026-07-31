import builderIdle from "../assets/builder/builder-idle.mp4.asset.json";
import bodySlim from "../assets/builder/body-slim.mp4.asset.json";
import bodyAthletic from "../assets/builder/body-athletic.mp4.asset.json";
import bodyCurvy from "../assets/builder/body-curvy.mp4.asset.json";

import herRealCreate from "../assets/funnel/her-real-create.jpg";
import herRealImage from "../assets/funnel/her-real-image.jpg";
import herRealStory from "../assets/funnel/her-real-story.jpg";
import herAnimeCreate from "../assets/funnel/her-anime-create.jpg";
import herAnimeImage from "../assets/funnel/her-anime-image.jpg";
import herAnimeStory from "../assets/funnel/her-anime-story.jpg";
import himRealCreate from "../assets/funnel/him-real-create.jpg";
import himRealImage from "../assets/funnel/him-real-image.jpg";
import gayRealCreate from "../assets/funnel/gay-real-create.jpg";
import gayAnimeCreate from "../assets/funnel/gay-anime-create.jpg";

export interface BuilderOption {
  id: string;
  label: string;
  /** Looped preview clip. Falls back to `poster` while loading or if absent. */
  videoUrl?: string;
  poster: string;
}

export interface BuilderStep {
  id: string;
  title: string;
  subtitle: string;
  /** "options" (default) shows a thumbnail picker, "text" shows a name input. */
  input?: "options" | "text";
  options: BuilderOption[];
}

/** Default looped clip shown in the preview before/while nothing else has a video. */
export const BUILDER_IDLE_VIDEO = builderIdle.url;

export const BUILDER_STEPS: BuilderStep[] = [
  {
    id: "style",
    title: "Style",
    subtitle: "Realistic or anime.",
    options: [
      { id: "realistic", label: "Realistic", poster: herRealCreate },
      { id: "anime", label: "Anime", poster: herAnimeCreate },
    ],
  },
  {
    id: "persona",
    title: "Persona",
    subtitle: "Her overall look and attitude.",
    options: [
      { id: "natural", label: "Natural", poster: herRealCreate },
      { id: "bimbo", label: "Bimbo", poster: gayRealCreate },
      { id: "goth", label: "Goth", poster: herRealStory },
      { id: "egirl", label: "E-Girl", poster: herAnimeImage },
      { id: "dominatrix", label: "Dominatrix", poster: himRealCreate },
      { id: "cyberpunk", label: "Cyberpunk", poster: herAnimeCreate },
      { id: "altgirl", label: "Alt Girl", poster: herAnimeStory },
      { id: "hipster", label: "Hipster", poster: himRealImage },
      { id: "instachick", label: "Instachick", poster: herRealImage },
      { id: "punk", label: "Punk", poster: gayAnimeCreate },
    ],
  },
  {
    id: "roleplayType",
    title: "Roleplay type",
    subtitle: "How your story plays out.",
    options: [
      { id: "romance", label: "Romance", poster: herRealCreate },
      { id: "adventure", label: "Adventure", poster: herAnimeCreate },
      { id: "drama", label: "Drama", poster: herRealStory },
      { id: "comedy", label: "Comedy", poster: herAnimeImage },
    ],
  },
  {
    id: "scenario",
    title: "Scenario",
    subtitle: "Where your first scene starts.",
    options: [
      { id: "coffee", label: "Coffee shop", poster: herRealImage },
      { id: "roadtrip", label: "Road trip", poster: himRealImage },
      { id: "party", label: "House party", poster: herRealStory },
      { id: "office", label: "Late at the office", poster: himRealCreate },
      { id: "beach", label: "Beach town", poster: herAnimeImage },
    ],
  },
  {
    id: "name",
    title: "Name",
    subtitle: "What should she be called?",
    input: "text",
    options: [],
  },
];



export interface BuilderVoice {
  id: string;
  label: string;
  hint: string;
}

/** Voice choices shown alongside the name step. */
export const BUILDER_VOICES: BuilderVoice[] = [
  { id: "soft", label: "Soft", hint: "warm, breathy" },
  { id: "sultry", label: "Sultry", hint: "low, slow" },
  { id: "bright", label: "Bright", hint: "playful, upbeat" },
  { id: "husky", label: "Husky", hint: "raspy, close" },
  { id: "cute", label: "Cute", hint: "light, sweet" },
  { id: "commanding", label: "Commanding", hint: "firm, cool" },
];
