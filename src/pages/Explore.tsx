import { useState } from "react";
import {
  Sparkles,
  Video,
  Image as ImageIcon,
  BookOpen,
  Crown,
  Coins,
  Film,
  Users,
} from "lucide-react";
import SideNav from "../components/SideNav";
import NotificationsSidebar, { type Announcement } from "../components/NotificationsSidebar";
import AnnouncementDialog from "../components/AnnouncementDialog";
import { ExploreView } from "../components/ExploreView";
import FloatingToolsFAB, { type FloatingToolsFabItem } from "../components/explore/FloatingToolsFAB";
import {
  PostsSection,
  ExploreCreatorsSection,
  ExploreFooterSection,
  ExplorePromoSection,
  ExploreStartCreatingSection,
  ExploreStoriesSection,
  ExploreVideosSection,
  ExploreWhatsNewSection,
  type ExploreViewBabe,
  type ExploreViewCreatorRank,
  type ExploreViewCreateTool,
  type ExploreViewFooterLinks,
  type ExploreViewPromo,
  type ExploreViewSectionCategory,
  type ExploreViewStory,
  type ExploreViewVideo,
  type ExploreViewWhatsNew,
} from "../components/explore/ExploreSections";
import { type HeroSlide } from "../components/explore/CinematicHero";
import { type BadgeTier } from "../components/BadgeCard";
import bannerStory from "../assets/hero/banner-story.jpg";
import storyCreatorHero from "../assets/story-creator-hero.jpg";

// ---- Mock data ----
const img = (seed: string, w = 400, h = 533) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

const yourBabesBase: Omit<ExploreViewBabe, "imageUrl">[] = [
  { name: "Tanya", description: "Your sultry coworker who always finds a reason to bend over your desk...", messageCount: 12 },
  { name: "Celeste", description: "A stargazer who reads your future in the constellations of her freckles...", messageCount: 0 },
  { name: "Naomi", description: "Your best friend's older sister, back from college with a wicked smile...", messageCount: 4 },
  { name: "Rina", description: "Quiet librarian by day, devil between the stacks after closing time...", messageCount: 0 },
  { name: "Lola", description: "A burlesque dancer with a soft spot for shy admirers backstage...", messageCount: 23 },
  { name: "Nyx", description: "Goth witch from the apartment above, knocking at midnight again...", messageCount: 7 },
  { name: "Luna", description: "Moonlit mermaid washed up on your private beach with a secret to tell...", messageCount: 0 },
  { name: "Paola", description: "Latina chef teaching you how to handle her spice the right way...", messageCount: 1 },
  { name: "Ximena", description: "Fiery activist who'll argue you into bed and out of your hangups...", messageCount: 0 },
  { name: "Sakura", description: "Your flirty roommate just busted you red-handed with her panties...", messageCount: 9 },
  { name: "Wednesday Addams – Smash or Pass", description: "She raises one perfectly arched brow. The verdict is yours...", messageCount: 88 },
  { name: "Lucia", description: "Italian widow next door who needs help with more than the gardening...", messageCount: 0 },
  { name: "Pocahontas", description: "Wild spirit of the woods who doesn't believe in clothes or apologies...", messageCount: 14 },
  { name: "Ella", description: "Cinderella after midnight, no longer playing nice or losing slippers...", messageCount: 0 },
];

const yourFollowingBase: Omit<ExploreViewBabe, "imageUrl">[] = [
  { name: "Hana", description: "Quiet, shy, and dangerously curious about your bookshelf...", messageCount: "1.1K", likeCount: "26" },
  { name: "Riyo Reaper", description: "Death's intern with a soft spot for tortured souls and tortured nights...", messageCount: "412", likeCount: "34" },
  { name: "Luna", description: "Apprentice witch who keeps mistaking lust spells for love spells...", messageCount: "1.8K", likeCount: "322" },
  { name: "Momo", description: "Your gym crush who finally noticed you spotting her squats...", messageCount: "2.8K", likeCount: "32" },
  { name: "Meir Bad dream (DarkFantasy) V1.0", description: "She slips into your nightmares wearing nothing but smoke...", messageCount: "21.8K", likeCount: "20" },
  { name: "Elara Vosslove", description: "Disgraced noble running from her arranged marriage straight to your door...", messageCount: "596", likeCount: "136" },
  { name: "Maria", description: "Your devout neighbor whose confessional has gotten very specific lately...", messageCount: "0", likeCount: "5" },
  { name: "Princess Demetria Agiad", description: "Royal heir slumming it in your one-bedroom apartment for the weekend...", messageCount: "32", likeCount: "8" },
  { name: "June", description: "Summer fling who never left and now never wears clothes either...", messageCount: "904", likeCount: "210" },
  { name: "Alice (DarkFantasy)", description: "She fell down the rabbit hole and landed in your lap...", messageCount: "877", likeCount: "44" },
  { name: "Olivia", description: "Your therapist's eyebrow twitches every time you describe her in session...", messageCount: "830", likeCount: "61" },
];

const followingUsers: ExploreViewSectionCategory[] = [
  { id: "phenix_giraffe_BDSM", label: "@phenix_giraffe_BDSM" },
  { id: "energetic_giraffe_3754", label: "@energetic_giraffe_3754" },
  { id: "marvelous_ibis", label: "@marvelous_ibis" },
  { id: "respectful_leopard_9203", label: "@respectful_leopard_9203" },
  { id: "Sirlight", label: "@Sirlight" },
  { id: "Sandwiches", label: "@Sandwiches" },
  { id: "gentle_horse_1142", label: "@gentle_horse_1142" },
  { id: "quiet_owl_88", label: "@quiet_owl_88" },
  { id: "cosmic_fox", label: "@cosmic_fox" },
  { id: "velvet_raven", label: "@velvet_raven" },
];

const videoCategories: ExploreViewSectionCategory[] = [
  { label: "Anime3d" }, { label: "Aphrodite" }, { label: "Furry" }, { label: "Velvetheat" }, { label: "Fantasy" }, { label: "Artea" },
  { label: "Truelook" }, { label: "Dreammix" }, { label: "Cartoon" }, { label: "Darkfantasy" }, { label: "Anthro" }, { label: "Female" },
];

const trendingTags: ExploreViewSectionCategory[] = [
  { label: "Blowjob" }, { label: "Cowgirl" }, { label: "Creampie" }, { label: "Cumshot" }, { label: "Doggy Style" }, { label: "Deepthroat" },
  { label: "Facials" }, { label: "Footjob" }, { label: "Handjob" }, { label: "Kissing" }, { label: "Masturbation" }, { label: "Mating Press" },
  { label: "Missionary" }, { label: "Pissing" }, { label: "Bukkake" }, { label: "Boob Bounce" }, { label: "Breast Play" }, { label: "Fingering" },
];

const babeCategories: ExploreViewSectionCategory[] = [
  { label: "Realistic" }, { label: "Anime" }, { label: "Hentai" }, { label: "Caucasian" }, { label: "Asian" }, { label: "Latina" },
  { label: "Ebony" }, { label: "Goth" }, { label: "MILF" }, { label: "Teen 18+" }, { label: "Cosplay" }, { label: "Fantasy" },
];

const newReleaseTags: ExploreViewSectionCategory[] = [
  { label: "New today" }, { label: "This week" }, { label: "Rising stars" }, { label: "Editor's pick" },
  { label: "Most chatted" }, { label: "Most liked" }, { label: "Trending now" }, { label: "Hidden gems" },
];

const trendingVideosBase: Omit<ExploreViewVideo, "imageUrl">[] = [
  { id: "v1", likes: "2.1K" },
  { id: "v2", likes: "1.8K" },
  { id: "v3", likes: "1.4K" },
  { id: "v4", likes: "987" },
  { id: "v5", likes: "812" },
  { id: "v6", likes: "640" },
  { id: "v7", likes: "523" },
];

const trendingBabesBase: Omit<ExploreViewBabe, "imageUrl">[] = [
  { name: "Juliana", description: "Brazilian samba instructor whose hips never lie and never quit...", messageCount: "3.2K", likeCount: "412" },
  { name: "Natalie", description: "Your boss's daughter who keeps texting you after the office party...", messageCount: "2.8K", likeCount: "388" },
  { name: "Elyndra", description: "Elven scout who tracked your scent across three kingdoms to find you...", messageCount: "1.9K", likeCount: "266" },
  { name: "Beckki", description: "Egirl streamer who only goes live for her favorite supporter...", messageCount: "4.1K", likeCount: "521" },
  { name: "Madeline", description: "French pastry chef teaching you to knead, slowly and thoroughly...", messageCount: "2.3K", likeCount: "190" },
  { name: "Celeste", description: "Astronomy student who sees constellations in the freckles on your back...", messageCount: "1.6K", likeCount: "144" },
  { name: "Pocahontas", description: "Wild spirit of the woods who doesn't believe in clothes or apologies...", messageCount: "3.7K", likeCount: "402" },
  { name: "Princess Demetria", description: "Royal heir slumming it in your one-bedroom apartment for the weekend...", messageCount: "2.0K", likeCount: "229" },
];

const newBabesBase: Omit<ExploreViewBabe, "imageUrl">[] = [
  { name: "Vexa", description: "Cyberpunk netrunner jacking into your dreams uninvited...", messageCount: "412", likeCount: "38" },
  { name: "Hikari", description: "Shrine maiden bored of incense and ready for trouble...", messageCount: "289", likeCount: "44" },
  { name: "Sable", description: "Vampire countess who needs more than just your blood tonight...", messageCount: "611", likeCount: "82" },
  { name: "Iris", description: "Florist with a greenhouse and a very interesting orchid collection...", messageCount: "204", likeCount: "30" },
  { name: "Cleo", description: "Curator of the museum's private after-hours exhibits...", messageCount: "356", likeCount: "51" },
  { name: "Marisol", description: "Beach lifeguard who saved you and now she's collecting interest...", messageCount: "488", likeCount: "67" },
  { name: "Tess", description: "Mechanic who'll fix your bike and break your resolve in one afternoon...", messageCount: "133", likeCount: "21" },
  { name: "Yumi", description: "Idol on hiatus, hiding out in your spare room and out of costume...", messageCount: "722", likeCount: "104" },
];

const featuredStories: ExploreViewStory[] = [
  {
    id: "s1",
    title: "Midnight at the Manor",
    description: "Wednesday invites you to a candlelit séance — but the spirits aren't the only thing she's summoning tonight.",
    src: "https://prod-bckp.fra1.cdn.digitaloceanspaces.com/mybabes-prod/c4bc02f2-4213-4bdd-b782-1dc4a44d4687/profile-picture-707144ba-b868-4cb5-9e78-3df93aa818d3.avif",
    episodeCount: 6,
    totalScenes: 24,
    avgRating: 4.8,
    ratingCount: 312,
    likes: 2412,
  },
  {
    id: "s2",
    title: "Spellbound",
    description: "Luna's apprentice trial goes sideways when her love potion lands on you instead of the target.",
    src: "https://prod-bckp.fra1.cdn.digitaloceanspaces.com/mybabes-prod/dae34bfb-4650-4e1a-a3fd-fd87785473d1/35b7d1f0-5a47-47e1-bc88-862087bc302c-0.jpg",
    episodeCount: 4,
    totalScenes: 18,
    avgRating: 4.6,
    ratingCount: 218,
    likes: 1830,
  },
  {
    id: "s3",
    title: "Roommates",
    description: "Sakura made a bet she shouldn't have. Now she has to make good on every term.",
    src: "https://prod-bckp.fra1.cdn.digitaloceanspaces.com/mybabes-prod/e8fe5e83-dc55-424d-930c-d0b16eaa6e75/profile-picture-77b22208-141b-4809-93d8-7186e4b6a3ec.avif",
    episodeCount: 8,
    totalScenes: 32,
    avgRating: 4.9,
    ratingCount: 504,
    likes: 3104,
  },
  {
    id: "s4",
    title: "After Hours at the Library",
    description: "Rina locks the doors at closing — and the rules of the quiet section change after dark.",
    src: img("story-library", 600, 360),
    episodeCount: 3,
    totalScenes: 12,
    avgRating: 4.4,
    ratingCount: 96,
    likes: 742,
  },
  {
    id: "s5",
    title: "Moonlit Tides",
    description: "A washed-up mermaid, a private beach, and a secret she'll only tell you at high tide.",
    src: img("story-mermaid", 600, 360),
    episodeCount: 5,
    totalScenes: 20,
    avgRating: 4.7,
    ratingCount: 174,
    likes: 1567,
  },
];

const newEpisodes: ExploreViewStory[] = [
  {
    id: "ne1",
    title: "Confession Booth",
    description: "Maria has something to admit — but she'll only say it through the screen.",
    src: img("story-confession", 600, 360),
    episodeCount: 2,
    totalScenes: 8,
    avgRating: 4.3,
    ratingCount: 47,
    likes: 612,
  },
  {
    id: "ne2",
    title: "Royal Hideaway",
    description: "Princess Demetria is in your apartment for the weekend and won't be sleeping on the couch.",
    src: img("story-royal", 600, 360),
    episodeCount: 3,
    totalScenes: 14,
    avgRating: 4.5,
    ratingCount: 89,
    likes: 1098,
  },
  {
    id: "ne3",
    title: "Down the Rabbit Hole",
    description: "Alice fell into your lap. Now she's rewriting Wonderland's rules — starting with yours.",
    src: img("story-alice", 600, 360),
    episodeCount: 4,
    totalScenes: 16,
    avgRating: 4.6,
    ratingCount: 132,
    likes: 2230,
  },
  {
    id: "ne4",
    title: "Smoke & Silk",
    description: "Sable's invitation arrived in your dreams. Tonight she's collecting an answer in person.",
    src: img("story-vampire", 600, 360),
    episodeCount: 6,
    totalScenes: 22,
    avgRating: 4.8,
    ratingCount: 261,
    likes: 1745,
  },
  {
    id: "ne5",
    title: "Spotting You",
    description: "Momo finally noticed you at the gym — and she's got a workout in mind that's not on the program.",
    src: img("story-gym", 600, 360),
    episodeCount: 2,
    totalScenes: 9,
    avgRating: 4.2,
    ratingCount: 58,
    likes: 2980,
  },
];

const heroSlides: HeroSlide[] = [
  {
    name: "Wednesday Addams",
    tagline: "Smash or Pass — the verdict is yours",
    description: "She raises one perfectly arched brow, fingers laced, daring you to make the first move. The night is long, the verdict is yours, and her interest is unsettlingly genuine.",
    imageUrl: "https://prod-bckp.fra1.cdn.digitaloceanspaces.com/mybabes-prod/c4bc02f2-4213-4bdd-b782-1dc4a44d4687/profile-picture-707144ba-b868-4cb5-9e78-3df93aa818d3.avif",
    tags: ["Goth", "Roleplay", "Dark Romance", "Editor's pick"],
    meta: { messages: "12.4K", likes: "8.9K" },
  },
  {
    name: "Luna",
    tagline: "Apprentice witch, dangerous in love",
    description: "She keeps mistaking lust spells for love spells — and tonight she swears she got it right. The candles are lit. Your move.",
    imageUrl: "https://prod-bckp.fra1.cdn.digitaloceanspaces.com/mybabes-prod/dae34bfb-4650-4e1a-a3fd-fd87785473d1/profile-picture-a2cfaed2-d95a-4a35-b729-3b7619033d42.avif",
    media: [
      { type: "image", url: "https://prod-bckp.fra1.cdn.digitaloceanspaces.com/mybabes-prod/dae34bfb-4650-4e1a-a3fd-fd87785473d1/profile-picture-a2cfaed2-d95a-4a35-b729-3b7619033d42.avif" },
      { type: "image", url: "https://prod-bckp.fra1.cdn.digitaloceanspaces.com/mybabes-prod/dae34bfb-4650-4e1a-a3fd-fd87785473d1/35b7d1f0-5a47-47e1-bc88-862087bc302c-0.jpg" },
      { type: "image", url: "https://prod-bckp.fra1.cdn.digitaloceanspaces.com/mybabes-prod/dae34bfb-4650-4e1a-a3fd-fd87785473d1/80dddad7-a9d2-46bf-a21a-b45edd0cd81a-0.jpg" },
    ],
    tags: ["Fantasy", "Witch", "Trending"],
    meta: { messages: "1.8K", likes: "2.2K" },
  },
  {
    name: "Sakura",
    tagline: "Caught red-handed and not even sorry",
    description: "Your flirty roommate just walked in with that look — the one that means tonight's rules don't apply. Lean in.",
    imageUrl: "https://prod-bckp.fra1.cdn.digitaloceanspaces.com/mybabes-prod/e8fe5e83-dc55-424d-930c-d0b16eaa6e75/profile-picture-77b22208-141b-4809-93d8-7186e4b6a3ec.avif",
    tags: ["Anime", "Roommate", "New"],
    meta: { messages: "9.1K", likes: "4.4K" },
  },
  {
    name: "The Midnight Confession",
    tagline: "An interactive story by VelvetHeat",
    description: "She left a voicemail you weren't supposed to hear. Choose how the night unfolds in this 12-chapter branching story.",
    imageUrl: bannerStory,
    media: [
      { type: "image", url: bannerStory },
      { type: "image", url: "https://prod-bckp.fra1.cdn.digitaloceanspaces.com/mybabes-prod/c4bc02f2-4213-4bdd-b782-1dc4a44d4687/profile-picture-707144ba-b868-4cb5-9e78-3df93aa818d3.avif" },
      { type: "image", url: "https://prod-bckp.fra1.cdn.digitaloceanspaces.com/mybabes-prod/dae34bfb-4650-4e1a-a3fd-fd87785473d1/35b7d1f0-5a47-47e1-bc88-862087bc302c-0.jpg" },
      { type: "image", url: "https://prod-bckp.fra1.cdn.digitaloceanspaces.com/mybabes-prod/e8fe5e83-dc55-424d-930c-d0b16eaa6e75/profile-picture-77b22208-141b-4809-93d8-7186e4b6a3ec.avif" },
    ],
    tags: ["Interactive", "Branching", "12 Chapters"],
    badge: "New story",
    cta: "Play Story",
    layout: "story",
    accent: "hsl(320 70% 55%)",
    storyMeta: { chapters: 12, episodes: 4, rating: 4.8 },
  },
  {
    name: "Top creators this week",
    tagline: "Meet the faces shaping the platform",
    description: "The 3 creators everyone's talking about. Tap in to see their latest babes, scenes and stories.",
    imageUrl: "https://picsum.photos/seed/creator-bigdaddy/600/600",
    tags: ["Trending", "Verified", "Top 3"],
    badge: "Top creators",
    cta: "See leaderboard",
    layout: "creators",
    accent: "hsl(213 100% 55%)",
    creators: [
      { rank: 1, name: "Big Daddy", avatarUrl: "https://picsum.photos/seed/creator-bigdaddy/400/600", subtitle: "Immortal · 1.2M fans" },
      { rank: 2, name: "VelvetHeat", avatarUrl: "https://picsum.photos/seed/creator-velvet/400/600", subtitle: "Mythic · 980K fans" },
      { rank: 3, name: "DarkFantasy", avatarUrl: "https://picsum.photos/seed/creator-darkfantasy/400/600", subtitle: "Grandmaster · 740K fans" },
    ],
  },
  {
    name: "Unlock Premium",
    tagline: "Faster, hotter, unlimited",
    description: "Unlimited chat with long memory, hundreds of monthly tokens, spicy AI images and videos. From €9.99/mo — cancel anytime.",
    imageUrl: "https://prod-bckp.fra1.cdn.digitaloceanspaces.com/mybabes-prod/dae34bfb-4650-4e1a-a3fd-fd87785473d1/profile-picture-a2cfaed2-d95a-4a35-b729-3b7619033d42.avif",
    badge: "Limited offer",
    cta: "Get Premium",
    layout: "premium",
    accent: "hsl(213 100% 55%)",
    premiumPlans: [
      {
        name: "Premium",
        price: "€9.99",
        period: "mo",
        perks: [
          "Up to 500 monthly tokens",
          "Unlimited Chat & Roleplay",
          "Up to 500 Spicy Images",
          "Up to 100 Videos",
        ],
      },
      {
        name: "Ultra",
        price: "€23.33",
        period: "mo",
        highlight: true,
        bonus: "+400 tokens",
        perks: [
          "Up to 900 monthly tokens",
          "Unlimited Chat with long memory",
          "Up to 900 Spicy Images",
          "Up to 300 AI Videos",
        ],
      },
    ],
  },
  {
    name: "Story Creator",
    tagline: "Lights. Camera. Your story.",
    description: "Build multi-episode stories starring your favorite characters. Mix images, video, voice and music into cinematic scenes — you direct every moment.",
    imageUrl: storyCreatorHero,
    badge: "Just shipped",
    cta: "Create your story",
    layout: "feature",
    accent: "hsl(213 100% 55%)",
    featureMeta: {
      eyebrow: "New · Story Creator",
      bullets: [
        "Drop in images, clips, voice notes & music",
        "Star your favorite characters across episodes",
        "Cinematic transitions, captions & SFX",
        "Publish as reels or full episode series",
      ],
    },
  },
];

const topCreatorsBase: { rank: number; name: string; avatarSeed: string; tier: BadgeTier; verified?: boolean }[] = [
  { rank: 1, name: "Big Daddy", avatarSeed: "creator-bigdaddy", tier: "immortal", verified: true },
  { rank: 2, name: "VelvetHeat", avatarSeed: "creator-velvet", tier: "mythic", verified: true },
  { rank: 3, name: "DarkFantasy", avatarSeed: "creator-darkfantasy", tier: "grandmaster", verified: true },
  { rank: 4, name: "ErosForge", avatarSeed: "creator-eros", tier: "elite", verified: true },
  { rank: 5, name: "NightOwl", avatarSeed: "creator-nightowl", tier: "elite" },
  { rank: 6, name: "SilkRoad", avatarSeed: "creator-silk", tier: "legend" },
  { rank: 7, name: "MoonChaser", avatarSeed: "creator-moon", tier: "legend" },
  { rank: 8, name: "Sandwiches", avatarSeed: "creator-sand", tier: "master" },
  { rank: 9, name: "PixelPriest", avatarSeed: "creator-pixel", tier: "master" },
  { rank: 10, name: "Sirlight", avatarSeed: "creator-sirlight", tier: "master" },
];

const risingCreatorsBase: { rank: number; name: string; avatarSeed: string; tier: BadgeTier; verified?: boolean }[] = [
  { rank: 1, name: "@phenix_giraffe_BDSM", avatarSeed: "rising-phenix", tier: "elite" },
  { rank: 2, name: "@energetic_giraffe_3754", avatarSeed: "rising-energetic", tier: "legend" },
  { rank: 3, name: "@marvelous_ibis", avatarSeed: "rising-ibis", tier: "legend" },
  { rank: 4, name: "@respectful_leopard_9203", avatarSeed: "rising-leopard", tier: "master" },
  { rank: 5, name: "@gentle_horse_1142", avatarSeed: "rising-horse", tier: "master" },
  { rank: 6, name: "@quiet_owl_88", avatarSeed: "rising-owl", tier: "master" },
  { rank: 7, name: "@cosmic_fox", avatarSeed: "rising-fox", tier: "newbie" },
  { rank: 8, name: "@velvet_raven", avatarSeed: "rising-raven", tier: "newbie" },
  { rank: 9, name: "@ember_wolf", avatarSeed: "rising-wolf", tier: "newbie" },
  { rank: 10, name: "@silver_lynx", avatarSeed: "rising-lynx", tier: "newbie" },
];

const createTools: ExploreViewCreateTool[] = [
  { title: "Create Custom Babe", subtitle: "Design your dream character", href: "/explore/create-babe", Icon: Sparkles },
  { title: "Video Generator", subtitle: "Bring scenes to life", href: "/explore/video-generator", Icon: Video },
  { title: "Image Generator", subtitle: "Render any moment", href: "/explore/image-generator", Icon: ImageIcon },
  { title: "Story Creator", subtitle: "Write episodic adventures", href: "/explore/story-creator", Icon: BookOpen },
  { title: "Create Template Babe", subtitle: "Start from a preset", href: "/explore/create-template", Icon: Sparkles },
];

type AnnouncementSection = {
  emoji: string;
  title: string;
  items: { name: string; description: string }[];
};

type WhatsNewItem = {
  tag: string;
  date: string;
  title: string;
  description: string;
  announcement?: {
    headline: string;
    intro: string;
    sections: AnnouncementSection[];
    cta?: { label: string; url: string };
    outro?: string;
  };
};

const whatsNewItems: WhatsNewItem[] = [
  {
    tag: "Announcement",
    date: "May 5",
    title: "Introducing Studio — your new creative hub",
    description: "Build, edit, and monetize like never before. Here's everything that's new and live right now.",
    announcement: {
      headline: "✨ The future of creativity is here: introducing Studio",
      intro:
        "Hi everyone — we're so happy to finally introduce Studio, your new creative hub designed to be the heartbeat of the ecosystem, giving you the power to build, edit, and monetize like never before. Here's what's new and live right now.",
      sections: [
        {
          emoji: "🌌",
          title: "Expanded image generation",
          items: [
            { name: "Scene Builder", description: "Break free from character-only prompts. Create immersive worlds, cinematic landscapes, and complex environments." },
            { name: "Inpainting", description: "Your images are no longer \"final.\" Edit specific details, add elements, or refine your vision with surgical precision." },
            { name: "New Artea mods", description: "Exclusive new stylistic mods to push the boundaries of your favorite anime model." },
          ],
        },
        {
          emoji: "📽️",
          title: "The next chapter in video",
          items: [
            { name: "Video Extension", description: "Create deeper narratives with our new video extension tool." },
            { name: "Strategic partnerships", description: "We've joined forces with industry leaders to integrate audio, voiceovers, and high-fidelity video models. (coming soon)" },
          ],
        },
        {
          emoji: "🎭",
          title: "Intuitive character crafting",
          items: [
            { name: "Real-time preview", description: "Watch your character take shape instantly within the builder." },
            { name: "Archetypes & AI synthesis", description: "Personality archetypes and AI-assisted rewriting bridge the gap between an idea and a living, breathing character." },
          ],
        },
        {
          emoji: "💎",
          title: "The creator economy is here",
          items: [
            { name: "Creator Hub", description: "Launch your profile, lock premium content, and set your own pricing." },
            { name: "Redeem codes", description: "Convert your audience across the web with a one-click redeem system." },
            { name: "Affiliate program", description: "Earn recurring revenue for every new user you bring into the ecosystem." },
          ],
        },
      ],
      outro:
        "🗺️ This is just the foundation. We're currently building Stories, Interactive Games, and a Video Editing suite to transform the platform from a gallery into a fully interactive multiverse.",
    },
  },
  {
    tag: "Update",
    date: "Mar 31",
    title: "New image models & 'Heat' chat engine are LIVE",
    description: "Three brand-new realistic image models plus a next-gen English chat model in Beta.",
    announcement: {
      headline: "🚀 Big update: new models are live",
      intro:
        "Hey everyone — we've been busy in the lab and we're thrilled to finally drop some massive upgrades to your experience. We just launched three brand-new image models and a next-gen chat engine.",
      sections: [
        {
          emoji: "🎨",
          title: "New realistic image models",
          items: [
            { name: "Aphrodite — Fully Real", description: "Our most advanced realistic engine yet. High-end photography, perfect lighting, and lifelike textures." },
            { name: "Dark Fantasy", description: "Epic landscapes, mystical characters, and magical effects with a grounded, cinematic feel." },
            { name: "Anthro — Furry Oriented", description: "Tuned for the community with incredible anatomy, fur textures, and expressive characters." },
          ],
        },
        {
          emoji: "✨",
          title: "What's improved",
          items: [
            { name: "Superior realism", description: "Better skin, fur, and material rendering across the board." },
            { name: "Dynamic posing", description: "More natural positions and better understanding of complex body language." },
            { name: "Stable & smooth", description: "Major reduction in artifacts and much more consistent results — including in chat." },
          ],
        },
        {
          emoji: "🔥",
          title: "New chat model: 'Heat' (Beta)",
          items: [
            { name: "Deeper immersion", description: "Smarter, more responsive, and better at staying in character for a fluid chatting experience." },
            { name: "English-only for now", description: "Since this is in Beta, it's currently English-only as we fine-tune the performance." },
          ],
        },
      ],
      outro:
        "👀 Something huge is cooking — we're developing a massive suite of creative tools and advanced video settings. More variety, more control, more ways to bring your imagination to life.",
    },
  },
  {
    tag: "Update",
    date: "Mar 13",
    title: "V2.5 Video Generator is LIVE",
    description: "Faster, sharper, smoother video generation with a fresh batch of new mods.",
    announcement: {
      headline: "🎬 Big news: V2.5 Video Generator is LIVE",
      intro:
        "Get ready to level up your creations! V2.5 has officially hit the platform, and it is a total game-changer.",
      sections: [
        {
          emoji: "🚀",
          title: "What's waiting for you",
          items: [
            { name: "Blazing speed", description: "Spend less time waiting and more time creating." },
            { name: "Stunning quality", description: "Crisper details and high-definition results." },
            { name: "Liquid smoothness", description: "Movement is now more natural and fluid than ever before." },
            { name: "New mods", description: "A ton of fresh styles and mods are ready for you to experiment with." },
          ],
        },
      ],
      outro:
        "🎨 We're not stopping there — brand-new templates are dropping very soon to spark even more inspiration. Happy creating!",
    },
  },
  {
    tag: "Update",
    date: "Feb 20",
    title: "Public Profiles, Following & Token Donations",
    description: "A major update with new community features plus key bug fixes and gallery improvements.",
    announcement: {
      headline: "🚀 New update incoming",
      intro:
        "Hey everyone! We're briefly taking the site offline to roll out a major update packed with new features and some much-needed polish. Here's what's landing.",
      sections: [
        {
          emoji: "🌟",
          title: "New features",
          items: [
            { name: "Public Profiles", description: "You now have a home base — showcase your creations, stats, and style to the entire community." },
            { name: "Following system", description: "Follow your favorite creators to keep up with their latest uploads and activity." },
            { name: "Token donations", description: "Donate tokens directly to creators to support their work and keep the creativity flowing." },
          ],
        },
        {
          emoji: "🛠️",
          title: "Bug fixes & improvements",
          items: [
            { name: "Remixing", description: "Fixed the issue where remixing videos from the Explore page would occasionally fail. Remix away!" },
            { name: "Gallery view", description: "You can now open full-screen previews of images within the Babes Gallery for a high-res look." },
          ],
        },
      ],
      outro: "Estimated downtime: ~10–15 minutes. Thanks for your patience while we build a better experience for you.",
    },
  },
  {
    tag: "Announcement",
    date: "Feb 3",
    title: "The Community Update is LIVE",
    description: "Remix culture, profile personalization, mass delete, and a new Explore UI.",
    announcement: {
      headline: "🎉 The Community Update is officially live",
      intro:
        "We've been working hard to give you more control and better ways to connect. The way you interact with the platform just leveled up.",
      sections: [
        {
          emoji: "🤝",
          title: "Community features are out",
          items: [
            { name: "Remix culture", description: "Love a babe? Remix existing characters — yours or other users' — to make them your own." },
            { name: "Share your creations", description: "Easily share your custom babes with the rest of the community." },
            { name: "New Explore UI", description: "A fresh way to discover the best community babes and videos with improved sorting." },
            { name: "Better prompting", description: "More context for babe creation, babe bio, and overall prompting your babes." },
          ],
        },
        {
          emoji: "🎨",
          title: "Customize your presence",
          items: [
            { name: "Profile personalization", description: "You can finally change your babe profile image, video, and bio." },
          ],
        },
        {
          emoji: "🧹",
          title: "Total control over your gallery",
          items: [
            { name: "Mass delete", description: "Clean up your space instantly with the new mass delete option for both babes and gallery items." },
          ],
        },
        {
          emoji: "🔮",
          title: "What's coming next",
          items: [
            { name: "Creator ecosystem", description: "Full user profiles with the option to follow your favorite creators." },
            { name: "Support & tips", description: "Send tokens to other users to thank them for their amazing work." },
            { name: "New mods & realistic model", description: "We're implementing a brand-new realistic image model for mind-blowing quality." },
            { name: "Manual memory", description: "You'll have the power to manually manage what your babes remember for even deeper roleplay." },
          ],
        },
      ],
      outro: "Go check out the new features now and let us know what you think in the feedback channel. Stay creative — the team.",
    },
  },
];

const announcements: Announcement[] = whatsNewItems
  .filter((n): n is WhatsNewItem & { announcement: NonNullable<WhatsNewItem["announcement"]> } => !!n.announcement)
  .map((n, i) => ({
    id: `ann-${i}`,
    tag: n.tag,
    date: n.date,
    title: n.title,
    description: n.description,
    headline: n.announcement.headline,
    intro: n.announcement.intro,
    sections: n.announcement.sections,
    cta: n.announcement.cta,
    outro: n.announcement.outro,
  }));

const mockNotifications = [
  { id: "n1", actor: "energetic_lion_0991", initials: "EN", action: "liked video of", target: "Mia", unread: true },
  { id: "n2", actor: "calm_beaver_6740", initials: "CA", action: "liked video of", target: "Ellie – The Reclusive Stepsister", unread: true },
  { id: "n3", actor: "amiable_leopard_8696", initials: "AM", action: "liked", target: "Nyx", thumbnail: "https://picsum.photos/seed/nyx/80", unread: true },
  { id: "n4", actor: "cheerful_ibis_4482", initials: "CH", action: "liked video of", target: "Ella" },
  { id: "n5", actor: "charming_capybara_7956", initials: "CH", action: "liked", target: "Hikari" },
  { id: "n6", actor: "Sandwiches", initials: "SA", action: "liked video of", target: "Elipses..." },
  { id: "n7", actor: "blessed_gecko_6782", initials: "BL", action: "liked video of", target: "Lucy" },
  { id: "n8", actor: "Sandwiches", initials: "SA", action: "liked images of", thumbnail: "https://picsum.photos/seed/img1/80" },
  { id: "n9", actor: "Sandwiches", initials: "SA", action: "liked images of", thumbnail: "https://picsum.photos/seed/img2/80" },
  { id: "n10", actor: "appealing_camel_9047", initials: "AP", action: "started following you" },
];

const giftPromo: ExploreViewPromo = {
  variant: "gift",
  Icon: Sparkles,
  eyebrow: "Welcome gift",
  title: "A surprise is waiting for you — claim it now",
  description: "Sign up today to unlock characters, chat, roleplay and image generation.",
  cta: "Claim",
};

const premiumPromo: ExploreViewPromo = {
  variant: "premium",
  Icon: Crown,
  title: "Go Premium",
  description: "Unlimited chats, longer videos, and exclusive babes — without the queue.",
  cta: "Upgrade",
};

const tokensPromo: ExploreViewPromo = {
  variant: "tokens",
  Icon: Coins,
  title: "Token sale — 20% off",
  description: "Stock up on tokens this week and save on every pack. Limited time only.",
  cta: "Buy tokens",
};

const featurePromo: ExploreViewPromo = {
  variant: "feature",
  Icon: Sparkles,
  title: "New: Scene Builder is live",
  description: "Break free from character-only prompts. Build full cinematic scenes in seconds.",
  cta: "Try this",
};

const giftPromo2: ExploreViewPromo = {
  variant: "gift",
  Icon: Sparkles,
  eyebrow: "Still here?",
  title: "Claim your welcome bonus before it expires",
  description: "3 free image generations and a starter token pack — on the house.",
  cta: "Claim now",
};

const premiumPromo2: ExploreViewPromo = {
  variant: "premium",
  Icon: Crown,
  title: "Unlock everything with Premium",
  description: "Skip the queue, unlimited messages, HD video — cancel anytime.",
  cta: "Go Premium",
};

const footerLinks: ExploreViewFooterLinks = {
  social: {
    title: "Social",
    links: [
      { label: "Discord", href: "#" },
      { label: "X (Twitter)", href: "#" },
      { label: "Reddit", href: "#" },
    ],
  },
  features: {
    title: "Features",
    links: [
      { label: "AI Chat", href: "#" },
      { label: "Image Generator", href: "#" },
      { label: "Video Generator", href: "#" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Terms", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "2257", href: "#" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { label: "Guides", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
};

const Explore = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [inlineAnnouncement, setInlineAnnouncement] = useState<Announcement | null>(null);

  const yourBabes: ExploreViewBabe[] = yourBabesBase.map((b, i) => ({
    ...b,
    imageUrl: img(`babe-${b.name}-${i}`),
  }));

  const yourFollowing: ExploreViewBabe[] = yourFollowingBase.map((b, i) => ({
    ...b,
    imageUrl: img(`follow-${b.name}-${i}`),
  }));

  const trendingBabes: ExploreViewBabe[] = trendingBabesBase.map((b, i) => ({
    ...b,
    imageUrl: img(`trend-${b.name}-${i}`),
  }));

  const newBabes: ExploreViewBabe[] = newBabesBase.map((b, i) => ({
    ...b,
    imageUrl: img(`new-${b.name}-${i}`),
  }));

  const recommendedBabes: ExploreViewBabe[] = [...yourBabesBase].reverse().map((b, i) => ({
    ...b,
    imageUrl: img(`rec-${b.name}-${i}`),
  }));

  const fanFavoritesBabes: ExploreViewBabe[] = [...trendingBabesBase, ...newBabesBase].map((b, i) => ({
    ...b,
    imageUrl: img(`fav-${b.name}-${i}`),
  }));

  const trendingVideos: ExploreViewVideo[] = trendingVideosBase.map((v) => ({
    ...v,
    imageUrl: img(`vid-${v.id}`, 260, 380),
  }));

  const hotVideos: ExploreViewVideo[] = [...trendingVideosBase, ...trendingVideosBase].map((v, i) => ({
    ...v,
    imageUrl: img(`hot-${v.id}-${i}`, 260, 380),
  }));

  const continueStories: ExploreViewStory[] = [...featuredStories, ...newEpisodes].map((s, i) => ({
    ...s,
    id: `cont-${s.id}-${i}`,
  }));

  const topCreators: ExploreViewCreatorRank[] = topCreatorsBase.map((c) => ({
    rank: c.rank,
    name: c.name,
    tier: c.tier,
    verified: c.verified,
    avatarUrl: `https://picsum.photos/seed/${encodeURIComponent(c.avatarSeed)}/160/160`,
  }));

  const risingCreators: ExploreViewCreatorRank[] = risingCreatorsBase.map((c) => ({
    rank: c.rank,
    name: c.name,
    tier: c.tier,
    verified: c.verified,
    avatarUrl: `https://picsum.photos/seed/${encodeURIComponent(c.avatarSeed)}/160/160`,
  }));

  const whatsNewPosts: ExploreViewWhatsNew[] = whatsNewItems.map((n, i) => ({
    id: `wn-${i}`,
    tag: n.tag,
    date: n.date,
    title: n.title,
    description: n.description,
  }));

  const floatingToolsItems: FloatingToolsFabItem[] = [
    { icon: Users, label: "Create Babe", ariaLabel: "Create Babe", onClick: () => {} },
    { icon: ImageIcon, label: "Create Image", ariaLabel: "Create Image", onClick: () => {} },
    { icon: Film, label: "Create Video", ariaLabel: "Create Video", onClick: () => {} },
    { icon: BookOpen, label: "Create Story", ariaLabel: "Create Story", onClick: () => {} },
  ];

  return (
    <>
      <SideNav open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AnnouncementDialog
        announcement={inlineAnnouncement}
        open={!!inlineAnnouncement}
        onOpenChange={(o) => !o && setInlineAnnouncement(null)}
      />
      <NotificationsSidebar
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onReopen={() => setNotificationsOpen(true)}
        notifications={mockNotifications}
        announcements={announcements}
      />
      <ExploreView
        heroSlides={heroSlides}
        onMenu={() => setSidebarOpen(true)}
        onNotifications={() => setNotificationsOpen(true)}
        notificationCount={14}
      >
        <PostsSection
          title="Your babes are waiting"
          actionLabel="See all"
          categories={babeCategories}
          posts={yourBabes}
        />
        <ExplorePromoSection promo={giftPromo} />
        <ExploreStoriesSection
          title="Featured stories"
          actionLabel="See all"
          posts={featuredStories}
          className="mt-2"
        />
        <ExploreVideosSection
          title="Top trending videos"
          actionLabel="See all"
          categories={videoCategories}
          posts={trendingVideos}
          className="mt-2"
        />
        <ExplorePromoSection promo={premiumPromo} />
        <ExploreCreatorsSection
          title="Top creators"
          actionLabel="See all"
          posts={topCreators}
          className="mt-2"
        />
        <ExploreWhatsNewSection
          title="What's new"
          actionLabel="See all"
          posts={whatsNewPosts}
          className="mt-2"
          onPostClick={(post) => {
            const idx = whatsNewPosts.findIndex((p) => p.id === post.id);
            if (idx < 0) return;
            const n = whatsNewItems[idx];
            if (!n.announcement) return;
            setInlineAnnouncement({
              id: `inline-${idx}`,
              tag: n.tag,
              date: n.date,
              title: n.title,
              description: n.description,
              headline: n.announcement.headline,
              intro: n.announcement.intro,
              sections: n.announcement.sections,
              cta: n.announcement.cta,
              outro: n.announcement.outro,
            });
          }}
        />
        <PostsSection
          title="Your following"
          actionLabel="See all"
          categories={followingUsers}
          posts={yourFollowing}
          variant="stats"
          className="mt-2"
        />
        <ExplorePromoSection promo={tokensPromo} />
        <PostsSection
          title="Check out this week trending babes"
          actionLabel="See all"
          categories={trendingTags}
          posts={trendingBabes}
          variant="stats"
          className="mt-2"
        />
        <ExploreStoriesSection
          title="New story episodes"
          actionLabel="See all"
          posts={newEpisodes}
          className="mt-2"
        />
        <ExplorePromoSection promo={featurePromo} />
        <ExploreCreatorsSection
          title="Rising creators this week"
          actionLabel="See all"
          posts={risingCreators}
          className="mt-2"
        />
        <PostsSection
          title="Recommended for you"
          actionLabel="See all"
          posts={recommendedBabes}
          className="mt-2"
        />
        <ExplorePromoSection promo={giftPromo2} />
        <ExploreStoriesSection
          title="Continue your stories"
          actionLabel="See all"
          posts={continueStories}
          className="mt-2"
        />
        <ExploreVideosSection
          title="Hot right now"
          actionLabel="See all"
          posts={hotVideos}
          className="mt-2"
        />
        <ExplorePromoSection promo={premiumPromo2} />
        <PostsSection
          title="New releases"
          actionLabel="See all"
          categories={newReleaseTags}
          posts={newBabes}
          variant="stats"
          className="mt-2"
        />
        <PostsSection
          title="Fan favorites"
          actionLabel="See all"
          posts={fanFavoritesBabes}
          variant="stats"
          className="mt-2"
        />
        <ExploreStartCreatingSection
          title="Start creating"
          tools={createTools}
          className="mt-4"
        />
        <ExploreFooterSection footer={footerLinks} />
      </ExploreView>
      <FloatingToolsFAB items={floatingToolsItems} />
    </>
  );
};

export default Explore;
