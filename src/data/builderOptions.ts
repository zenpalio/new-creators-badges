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
    title: "Style",
    subtitle: "This sets the whole look. You can change it later.",
    options: [
      { id: "realistic", label: "Realistic", poster: herRealCreate },
      { id: "anime", label: "Anime", poster: herAnimeCreate },
    ],
  },
  {
    id: "ethnicity",
    title: "Ethnicity",
    subtitle: "Her origin and features.",
    options: [
      { id: "caucasian", label: "Caucasian", poster: herRealCreate },
      { id: "asian", label: "Asian", poster: herAnimeImage },
      { id: "latina", label: "Latina", poster: herRealImage },
      { id: "black", label: "Black", poster: herRealStory },
      { id: "arab", label: "Arab", poster: herAnimeStory },
    ],
  },
  {
    id: "body",
    title: "Body",
    subtitle: "Pick the silhouette you like most.",
    options: [
      { id: "petite", label: "Petite", poster: herRealStory },
      { id: "slim", label: "Slim", poster: herAnimeImage },
      { id: "athletic", label: "Athletic", poster: himRealImage },
      { id: "curvy", label: "Curvy", poster: herRealCreate },
    ],
  },
  {
    id: "hairColor",
    title: "Hair color",
    subtitle: "Pick her shade.",
    options: [
      { id: "blonde", label: "Blonde", poster: gayRealCreate },
      { id: "brunette", label: "Brunette", poster: herRealStory },
      { id: "black", label: "Black", poster: himRealCreate },
      { id: "red", label: "Red", poster: herRealImage },
      { id: "colored", label: "Colored", poster: gayAnimeCreate },
    ],
  },
  {
    id: "hair",
    title: "Hair",
    subtitle: "Length and style.",
    options: [
      { id: "long", label: "Long", poster: herRealCreate },
      { id: "short", label: "Short", poster: himRealImage },
      { id: "curly", label: "Curly", poster: herAnimeStory },
      { id: "ponytail", label: "Ponytail", poster: herAnimeImage },
    ],
  },
  {
    id: "vibe",
    title: "Vibe",
    subtitle: "How she carries herself when you walk in.",
    options: [
      { id: "sweet", label: "Sweet", poster: herRealStory },
      { id: "flirty", label: "Flirty", poster: herRealImage },
      { id: "dominant", label: "Dominant", poster: himRealCreate },
      { id: "shy", label: "Shy", poster: herAnimeStory },
    ],
  },
];

