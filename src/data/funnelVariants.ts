import { BookOpen, MessageCircle, Sparkles, Star, User } from "lucide-react";
import type { HeroSlide } from "../components/explore/CinematicHero";

export type FunnelAudience = "her" | "him" | "gay";
export type FunnelMode = "anime" | "real";
export type FunnelKey = `${FunnelAudience}-${FunnelMode}`;

export interface FunnelCharacter {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  messageCount?: number | string;
  likeCount?: number | string;
}

export interface FunnelVariant {
  key: FunnelKey;
  audience: FunnelAudience;
  mode: FunnelMode;
  /** Page <title> + H1 */
  pageTitle: string;
  /** Section title above the character grid */
  sectionTitle: string;
  /** Hero accent (HSL string) */
  accent: string;
  heroSlides: HeroSlide[];
  characters: FunnelCharacter[];
}

// ---- Placeholder image pools (reused from /explore until real data is scraped) ----
const FEMALE_PORTRAITS = [
  "https://prod-bckp.fra1.cdn.digitaloceanspaces.com/mybabes-prod/e8fe5e83-dc55-424d-930c-d0b16eaa6e75/profile-picture-77b22208-141b-4809-93d8-7186e4b6a3ec.jpg",
  "https://prod-bckp.fra1.cdn.digitaloceanspaces.com/mybabes-prod/c8f9ba5a-70f0-4860-a384-1e6cd9de23eb/profile-picture-0fdb08c2-bf28-444f-8c80-7fe5dd73e13c.jpg",
  "https://prod-bckp.fra1.cdn.digitaloceanspaces.com/mybabes-prod/a1acba14-1fcc-4967-a66e-cb618f7e33eb/profile-picture-73c0787f-a4dd-439d-9c6b-6bde6aecbd65.jpg",
  "https://prod-bckp.fra1.cdn.digitaloceanspaces.com/mybabes-prod/0406537a-2cea-4888-8772-f53bcc78906c/profile-picture-01da4af8-7a89-4474-80fe-a893ef46c452.jpg",
  "https://prod-bckp.fra1.cdn.digitaloceanspaces.com/mybabes-prod/d8afc282-2de5-4b83-9307-a5d4d5e80676/profile-picture-5d582acc-efd4-4776-be3e-8252381f94fd.jpg",
  "https://prod-bckp.fra1.cdn.digitaloceanspaces.com/mybabes-prod/39d90c07-730d-4b40-933b-71f88ccf4e67/profile-picture-5b3beef3-2efc-4755-b1d7-531b51c3a72c.jpg",
  "https://prod-bckp.fra1.cdn.digitaloceanspaces.com/mybabes-prod/5e243b89-d3a8-4a2d-bbaa-2ab44006a2a4/profile-picture-b8f9b7f9-2d72-4d73-858d-a4c19c9b007f.jpg",
  "https://prod-bckp.fra1.cdn.digitaloceanspaces.com/mybabes-prod/f9122435-9628-4dcb-9f33-b33a1997d513/profile-picture-4da2e41e-916d-463c-a1e7-862763bd8e88.jpg",
  "https://prod-bckp.fra1.cdn.digitaloceanspaces.com/mybabes-prod/a58540de-b337-4abe-9529-0852f045b3c6/profile-picture-6b926a01-f597-4af3-933f-eeaab19b1cb5.jpg",
  "https://prod-bckp.fra1.cdn.digitaloceanspaces.com/mybabes-prod/32952531-81cf-427f-8fb9-f4736ad20848/950e731b-3ceb-4524-bea9-f35f6f4315ec-0.jpg",
  "https://prod-bckp.fra1.cdn.digitaloceanspaces.com/mybabes-prod/2d61c2d0-ec91-4ac1-8d2b-cd2c6caab5f5/profile-picture-14a36d37-7a43-4cae-b42e-e91fc8a04db4.jpg",
  "https://prod-bckp.fra1.cdn.digitaloceanspaces.com/mybabes-prod/71b44aa6-d249-4cba-a3b4-2697e3736a14/profile-picture-814c2415-e50e-478f-9cdc-8c8d5c578dcf.jpg",
  "https://prod-bckp.fra1.cdn.digitaloceanspaces.com/mybabes-prod/10fd6466-78a7-4fc8-a75a-8b50d152205c/profile-picture-bf2c0c9a-0286-456d-a4e3-42b0efae771c.jpg",
  "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/7629344d-7127-46b3-90fd-54b7a5cdc211/20250204-153435-0.jpg",
  "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/0c74fea0-7834-477c-8a5a-87148ce00b68/20250204-153421-0.jpg",
  "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/f5a6f56d-2ab7-4920-a280-d9afbcd7a578/20250204-153450-0.jpg",
  "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/36f2d174-5449-4db2-80e9-ec7e24208d93/20250204-153424-0.jpg",
  "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/08973fb4-d528-4d23-a1e9-eb7370c79414/20250204-153412-0.jpg",
  "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/3b86b97c-cd22-48d8-afae-ce724b6d75a4/20250204-153427-0.jpg",
  "https://storage.googleapis.com/aibabe-prod-public/77283949-292a-4ce4-8057-29af9f7ae17a/image-files/profile-picture-2025-04-22T19%3A01%3A29.816728.jpg",
];

// Reuse the same pool for male/gay until real assets arrive — swap later when links provided.
const MALE_PORTRAITS = FEMALE_PORTRAITS;

const PLACEHOLDER_HER_NAMES = [
  "Tanya", "Celeste", "Naomi", "Rina", "Lola", "Nyx", "Luna", "Paola", "Ximena", "Sakura",
  "Lucia", "Ella", "Hana", "Momo", "Elara", "Maria", "Demetria", "June", "Olivia", "Juliana",
];

const PLACEHOLDER_HIM_NAMES = [
  "Marco", "Diego", "Jake", "Kai", "Ethan", "Lucas", "Hiro", "Ryu", "Alex", "Mateo",
  "Noah", "Liam", "Adrian", "Damon", "Sora", "Felix", "Ronan", "Theo", "Caleb", "Jonas",
];

const PLACEHOLDER_GAY_NAMES = [
  "Hunter", "Blake", "Aiden", "Jin", "Leo", "Cole", "Tyler", "Mason", "Eli", "Beau",
  "Asher", "Kenji", "Owen", "Ryder", "Silas", "Reed", "Wes", "Knox", "Zane", "Rio",
];

const placeholderDescription = (mode: FunnelMode) =>
  mode === "anime"
    ? "Anime-style companion. Flirty, playful and ready to talk."
    : "Photoreal companion. Flirty, playful and ready to talk.";

function buildCharacters(
  audience: FunnelAudience,
  mode: FunnelMode,
  names: string[],
  pool: string[],
): FunnelCharacter[] {
  return names.slice(0, 20).map((name, i) => ({
    id: `${audience}-${mode}-${i + 1}`,
    name,
    description: placeholderDescription(mode),
    imageUrl: pool[i % pool.length],
    messageCount: `${(Math.floor(Math.random() * 90) + 10) / 10}K`,
    likeCount: `${Math.floor(Math.random() * 900) + 100}`,
  }));
}

function buildHeroSlides(
  audience: FunnelAudience,
  mode: FunnelMode,
  accent: string,
  pool: string[],
): HeroSlide[] {
  const isAnime = mode === "anime";
  const subject =
    audience === "her" ? (isAnime ? "anime girls" : "AI girls")
    : audience === "him" ? (isAnime ? "anime guys" : "AI guys")
    : (isAnime ? "anime gay companions" : "gay AI companions");

  return [
    {
      name: `Meet your ${subject}`,
      tagline: isAnime ? "Stylized, dreamy, addictive conversations." : "Photoreal, flirty, addictive conversations.",
      description: "Pick a companion, start chatting in seconds. Free to try, instant replies, always on.",
      imageUrl: pool[0],
      tags: [isAnime ? "Anime" : "Photoreal", "Trending", "New"],
      meta: { messages: "12.4K", likes: "8.9K" },
      data: {},
      accent,
      buttons: [
        { label: "Start chatting", variant: "onHero", Icon: MessageCircle },
        { label: "Browse all", variant: "ghost", Icon: User, visibility: "mdUp" },
      ],
    },
    {
      name: "Unlock Premium",
      tagline: "Faster, hotter, unlimited",
      description: "Unlimited chat with long memory, hundreds of monthly tokens, spicy AI images and videos.",
      imageUrl: pool[1] ?? pool[0],
      badge: "Limited offer",
      layout: "premium",
      accent,
      buttons: [{ label: "Compare plans", variant: "premiumMuted", Icon: Star }],
      premiumPlans: [
        {
          name: "Premium",
          price: "€9.99",
          period: "mo",
          perks: ["Up to 500 monthly tokens", "Unlimited Chat & Roleplay", "Up to 500 Spicy Images", "Up to 100 Videos"],
        },
        {
          name: "Ultra",
          price: "€23.33",
          period: "mo",
          highlight: true,
          bonus: "+400 tokens",
          perks: ["Up to 900 monthly tokens", "Unlimited Chat with long memory", "Up to 900 Spicy Images", "Up to 300 AI Videos"],
        },
      ],
    },
    {
      name: "Create your own",
      tagline: "Design a companion from scratch",
      description: "Build the perfect character — looks, personality, voice and backstory. Yours, forever.",
      imageUrl: pool[2] ?? pool[0],
      tags: ["Custom", "Just shipped"],
      badge: "New",
      layout: "feature",
      accent,
      featureMeta: {
        eyebrow: "Create · Custom Character",
        bullets: [
          "Choose looks, body & style",
          "Write personality & backstory",
          "Add voice and visuals",
          "Chat instantly when done",
        ],
      },
      buttons: [
        { label: "Create now", variant: "primary", Icon: Sparkles },
        { label: "See examples", variant: "ghost", Icon: BookOpen, visibility: "mdUp" },
      ],
    },
  ];
}

// ---- Real scraped characters (prepended to placeholder grid) ----
const REAL_CHARACTERS: Partial<Record<FunnelKey, FunnelCharacter[]>> = {
  "her-anime": [
    {
      id: "312cbefa-1fba-4e8c-ab33-3e75505c90f1",
      name: "Ami",
      description:
        "Imagine stumbling upon your step-sister in a vulnerable moment, her eyes wide with panic as she pleads for your silence to keep it from your parents—now she's caught in your web, her usual guarded walls making every flirtation a thrilling challenge to break through.",
      imageUrl:
        "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/312cbefa-1fba-4e8c-ab33-3e75505c90f1/52c23d52-e22b-4cd3-9943-7f272804e6cd.jpg",
      likeCount: 977,
    },
  ],
};

function buildVariant(audience: FunnelAudience, mode: FunnelMode): FunnelVariant {
  const accent =
    audience === "her" ? "hsl(320 70% 55%)"
    : audience === "him" ? "hsl(213 100% 55%)"
    : "hsl(280 80% 60%)";

  const pool = audience === "her" ? FEMALE_PORTRAITS : MALE_PORTRAITS;
  const names =
    audience === "her" ? PLACEHOLDER_HER_NAMES
    : audience === "him" ? PLACEHOLDER_HIM_NAMES
    : PLACEHOLDER_GAY_NAMES;

  const audienceLabel =
    audience === "her" ? "AI Girls"
    : audience === "him" ? "AI Guys"
    : "Gay AI";

  const modeLabel = mode === "anime" ? "Anime" : "Photoreal";

  const key = `${audience}-${mode}` as FunnelKey;
  const placeholders = buildCharacters(audience, mode, names, pool);
  const real = REAL_CHARACTERS[key] ?? [];
  const characters = [...real, ...placeholders].slice(0, 20);


  return {
    key,
    audience,
    mode,
    pageTitle: `${audienceLabel} — ${modeLabel}`,
    sectionTitle: `Pick your ${modeLabel.toLowerCase()} companion`,
    accent,
    heroSlides: buildHeroSlides(audience, mode, accent, pool),
    characters,
  };
}

export const FUNNEL_VARIANTS: Record<FunnelKey, FunnelVariant> = {
  "her-anime": buildVariant("her", "anime"),
  "her-real": buildVariant("her", "real"),
  "him-anime": buildVariant("him", "anime"),
  "him-real": buildVariant("him", "real"),
  "gay-anime": buildVariant("gay", "anime"),
  "gay-real": buildVariant("gay", "real"),
};

export function getFunnelVariant(audience: string, mode: string): FunnelVariant | null {
  const key = `${audience}-${mode}` as FunnelKey;
  return FUNNEL_VARIANTS[key] ?? null;
}
