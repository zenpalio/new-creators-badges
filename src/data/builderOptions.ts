import builderIdle from "../assets/builder/builder-idle.mp4.asset.json";
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
  options: BuilderOption[];
}

/** Default looped clip shown in the preview before/while nothing else has a video. */
export const BUILDER_IDLE_VIDEO = builderIdle.url;

export const BUILDER_STEPS: BuilderStep[] = [
  {
    id: "style",
    title: "Pick her style",
    subtitle: "This sets the whole look. You can change it later.",
    options: [
      { id: "realistic", label: "Realistic", poster: herRealCreate },
      { id: "anime", label: "Anime", poster: herAnimeCreate },
    ],
  },
  {
    id: "vibe",
    title: "Choose her vibe",
    subtitle: "How she carries herself when you walk in.",
    options: [
      { id: "sweet", label: "Sweet", poster: herRealStory },
      { id: "flirty", label: "Flirty", poster: herRealImage },
      { id: "dominant", label: "Dominant", poster: himRealCreate },
      { id: "shy", label: "Shy", poster: herAnimeStory },
    ],
  },
  {
    id: "body",
    title: "Body type",
    subtitle: "Pick the silhouette you like most.",
    options: [
      { id: "petite", label: "Petite", poster: herRealStory },
      { id: "slim", label: "Slim", poster: herAnimeImage },
      { id: "athletic", label: "Athletic", poster: himRealImage },
      { id: "curvy", label: "Curvy", poster: herRealCreate },
    ],

  },
  {
    id: "hair",
    title: "Hair",
    subtitle: "Colour and length.",
    options: [
      { id: "blonde", label: "Blonde", poster: gayRealCreate },
      { id: "brunette", label: "Brunette", poster: herRealStory },
      { id: "black", label: "Black", poster: himRealCreate },
      { id: "colored", label: "Colored", poster: gayAnimeCreate },
    ],
  },
  {
    id: "scene",
    title: "Where do you meet?",
    subtitle: "Your first scene together.",
    options: [
      { id: "apartment", label: "Her apartment", poster: herRealImage },
      { id: "bar", label: "Late-night bar", poster: herRealStory },
      { id: "beach", label: "Beach house", poster: herAnimeImage },
    ],
  },
];
