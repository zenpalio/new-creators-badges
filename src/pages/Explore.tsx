import { Bell, Sparkles, Video, Image as ImageIcon, ArrowUpRight, Play, ChevronRight, Menu, X, Compass, Users, Heart, Settings, LogOut, BookOpen, Crown, Newspaper, Coins, UserCircle2, TrendingUp, Flame, type LucideIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import BabeCard from "@/components/explore/BabeCard";
import HScroll from "@/components/explore/HScroll";
import CinematicHero, { type HeroSlide } from "@/components/explore/CinematicHero";
import CreatorRankCard from "@/components/explore/CreatorRankCard";
import StoryContentCard from "@/components/explore/StoryContentCard";
import FloatingToolsFAB from "@/components/explore/FloatingToolsFAB";
import SystemStatusIndicator from "@/components/explore/SystemStatusIndicator";
import PromoBanner from "@/components/explore/PromoBanner";
import SideNav from "@/components/SideNav";
import NotificationsSidebar from "@/components/NotificationsSidebar";
import AnnouncementDialog from "@/components/AnnouncementDialog";
import { type BadgeTier } from "@/components/BadgeCard";
import bannerPremium from "@/assets/hero/banner-premium.jpg";
import bannerFeature from "@/assets/hero/banner-feature.jpg";
import bannerSale from "@/assets/hero/banner-sale.jpg";
import bannerStory from "@/assets/hero/banner-story.jpg";

// ---- Mock data ----
const img = (seed: string, w = 400, h = 533) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;



const yourBabes = [
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

const yourFollowing = [
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

const followingUsernames = [
  "@phenix_giraffe_BDSM",
  "@energetic_giraffe_3754",
  "@marvelous_ibis",
  "@respectful_leopard_9203",
  "@Sirlight",
  "@Sandwiches",
  "@gentle_horse_1142",
  "@quiet_owl_88",
  "@cosmic_fox",
  "@velvet_raven",
];

const videoCategories = [
  "Anime3d", "Aphrodite", "Furry", "Velvetheat", "Fantasy", "Artea",
  "Truelook", "Dreammix", "Cartoon", "Darkfantasy", "Anthro", "Female",
];

const trendingTags = [
  "Blowjob", "Cowgirl", "Creampie", "Cumshot", "Doggy Style", "Deepthroat",
  "Facials", "Footjob", "Handjob", "Kissing", "Masturbation", "Mating Press",
  "Missionary", "Pissing", "Bukkake", "Boob Bounce", "Breast Play", "Fingering",
];

const babeCategories = [
  "Realistic", "Anime", "Hentai", "Caucasian", "Asian", "Latina",
  "Ebony", "Goth", "MILF", "Teen 18+", "Cosplay", "Fantasy",
];

const newReleaseTags = [
  "New today", "This week", "Rising stars", "Editor's pick",
  "Most chatted", "Most liked", "Trending now", "Hidden gems",
];

const trendingVideos = [
  { id: "v1", likes: "2.1K" },
  { id: "v2", likes: "1.8K" },
  { id: "v3", likes: "1.4K" },
  { id: "v4", likes: "987" },
  { id: "v5", likes: "812" },
  { id: "v6", likes: "640" },
  { id: "v7", likes: "523" },
];

const trendingBabes = [
  { name: "Juliana", description: "Brazilian samba instructor whose hips never lie and never quit...", messageCount: "3.2K", likeCount: "412" },
  { name: "Natalie", description: "Your boss's daughter who keeps texting you after the office party...", messageCount: "2.8K", likeCount: "388" },
  { name: "Elyndra", description: "Elven scout who tracked your scent across three kingdoms to find you...", messageCount: "1.9K", likeCount: "266" },
  { name: "Beckki", description: "Egirl streamer who only goes live for her favorite supporter...", messageCount: "4.1K", likeCount: "521" },
  { name: "Madeline", description: "French pastry chef teaching you to knead, slowly and thoroughly...", messageCount: "2.3K", likeCount: "190" },
  { name: "Celeste", description: "Astronomy student who sees constellations in the freckles on your back...", messageCount: "1.6K", likeCount: "144" },
  { name: "Pocahontas", description: "Wild spirit of the woods who doesn't believe in clothes or apologies...", messageCount: "3.7K", likeCount: "402" },
  { name: "Princess Demetria", description: "Royal heir slumming it in your one-bedroom apartment for the weekend...", messageCount: "2.0K", likeCount: "229" },
];

const newBabes = [
  { name: "Vexa", description: "Cyberpunk netrunner jacking into your dreams uninvited...", messageCount: "412", likeCount: "38" },
  { name: "Hikari", description: "Shrine maiden bored of incense and ready for trouble...", messageCount: "289", likeCount: "44" },
  { name: "Sable", description: "Vampire countess who needs more than just your blood tonight...", messageCount: "611", likeCount: "82" },
  { name: "Iris", description: "Florist with a greenhouse and a very interesting orchid collection...", messageCount: "204", likeCount: "30" },
  { name: "Cleo", description: "Curator of the museum's private after-hours exhibits...", messageCount: "356", likeCount: "51" },
  { name: "Marisol", description: "Beach lifeguard who saved you and now she's collecting interest...", messageCount: "488", likeCount: "67" },
  { name: "Tess", description: "Mechanic who'll fix your bike and break your resolve in one afternoon...", messageCount: "133", likeCount: "21" },
  { name: "Yumi", description: "Idol on hiatus, hiding out in your spare room and out of costume...", messageCount: "722", likeCount: "104" },
];

const featuredStories = [
  {
    id: "s1",
    title: "Midnight at the Manor",
    description: "Wednesday invites you to a candlelit séance — but the spirits aren't the only thing she's summoning tonight.",
    src: "https://prod-bckp.fra1.cdn.digitaloceanspaces.com/mybabes-prod/c4bc02f2-4213-4bdd-b782-1dc4a44d4687/profile-picture-707144ba-b868-4cb5-9e78-3df93aa818d3.avif",
    episodeCount: 6,
    totalScenes: 24,
    avgRating: 4.8,
    ratingCount: 312,
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
  },
];

const newEpisodes = [
  {
    id: "ne1",
    title: "Confession Booth",
    description: "Maria has something to admit — but she'll only say it through the screen.",
    src: img("story-confession", 600, 360),
    episodeCount: 2,
    totalScenes: 8,
    avgRating: 4.3,
    ratingCount: 47,
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
    cta: "Start reading",
    layout: "story",
    accent: "hsl(320 70% 55%)",
    storyMeta: { chapters: 12, episodes: 4, rating: 4.8 },
  },
];


const topCreators: { rank: number; name: string; avatarSeed: string; tier: BadgeTier; verified?: boolean }[] = [
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

const risingCreators: { rank: number; name: string; avatarSeed: string; tier: BadgeTier; verified?: boolean }[] = [
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

const createTools = [
  {
    title: "Create Custom Babe",
    subtitle: "Design your dream character",
    href: "/explore/create-babe",
    Icon: Sparkles,
  },
  {
    title: "Video Generator",
    subtitle: "Bring scenes to life",
    href: "/explore/video-generator",
    Icon: Video,
  },
  {
    title: "Image Generator",
    subtitle: "Render any moment",
    href: "/explore/image-generator",
    Icon: ImageIcon,
  },
  {
    title: "Story Creator",
    subtitle: "Write episodic adventures",
    href: "/explore/story-creator",
    Icon: BookOpen,
  },
  {
    title: "Create Template Babe",
    subtitle: "Start from a preset",
    href: "/explore/create-template",
    Icon: Sparkles,
  },
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

const announcements = whatsNewItems
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



// ---- Section header ----
const iconActiveStyles: Record<string, { color: string; fill: boolean }> = {
  Heart: { color: "text-pink-500", fill: true },
  Crown: { color: "text-yellow-400", fill: true },
  Flame: { color: "text-orange-500", fill: true },
  Sparkles: { color: "text-blue-400", fill: true },
  Star: { color: "text-yellow-400", fill: true },
  BookOpen: { color: "text-amber-400", fill: false },
  Video: { color: "text-blue-400", fill: false },
  ImageIcon: { color: "text-emerald-400", fill: false },
  TrendingUp: { color: "text-green-400", fill: false },
  Newspaper: { color: "text-cyan-400", fill: false },
  UserCircle2: { color: "text-violet-400", fill: true },
};

const SectionTitle = ({
  title,
  action,
  icon: Icon,
}: {
  title: string;
  action?: string;
  icon?: LucideIcon;
}) => {
  const [active, setActive] = React.useState(false);
  const iconName = (Icon as any)?.displayName || (Icon as any)?.render?.displayName || "";
  const activeStyle = iconActiveStyles[iconName] || { color: "text-primary", fill: true };
  return (
  <div className="mb-3 flex items-end justify-between">
    <h2 className="flex items-center gap-2 text-xl font-bold leading-tight text-white">
      {Icon && (
        <button
          type="button"
          onClick={() => setActive((a) => !a)}
          className="transition-transform hover:scale-110 active:scale-95"
          aria-label="Toggle"
        >
          <Icon
            className={`h-5 w-5 transition-colors ${active ? activeStyle.color : "text-grey-light-3"}`}
            strokeWidth={1.75}
            fill={active && activeStyle.fill ? "currentColor" : "none"}
          />
        </button>
      )}
      {title}
    </h2>
    {action && (
      <button className="flex items-center gap-1 text-xs font-medium text-grey-light-3 hover:text-white transition-colors">
        {action}
        <ArrowUpRight className="h-3.5 w-3.5" />
      </button>
    )}
  </div>
  );
};

// ---- Tag pill row ----
const TagRow = ({ tags }: { tags: string[] }) => (
  <div className="mb-3">
    <HScroll>
      {tags.map((t) => (
        <button
          key={t}
          className="inline-flex h-[41px] shrink-0 items-center justify-center whitespace-nowrap rounded-[5px] bg-grey-dark-1 px-[16px] text-sm font-medium text-[#F2F2F2] transition-colors hover:bg-grey-dark-3 hover:text-white"
        >
          <span className="normal-case">{t}</span>
        </button>
      ))}
    </HScroll>
  </div>
);


const sidebarLinks = [
  { label: "Explore", icon: Compass },
  { label: "Creators", icon: Users },
  { label: "Favorites", icon: Heart },
  { label: "Create", icon: Sparkles },
  { label: "Settings", icon: Settings },
];

const Explore = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [inlineAnnouncement, setInlineAnnouncement] = useState<typeof announcements[number] | null>(null);
  const mainRef = useRef<HTMLElement>(null);
  const [headerHidden, setHeaderHidden] = useState(false);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    let lastY = el.scrollTop;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = el.scrollTop;
        const dy = y - lastY;
        // Always show near the top
        if (y < 80) setHeaderHidden(false);
        else if (dy > 6) setHeaderHidden(true); // scrolling down
        else if (dy < -6) setHeaderHidden(false); // scrolling up
        lastY = y;
        ticking = false;
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative flex h-svh w-full overflow-hidden bg-background font-onest text-foreground">
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

      <main ref={mainRef} className="relative flex w-full flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* Sticky top bar — slides away on scroll down, returns on scroll up */}
        <header
          className={`pointer-events-none fixed inset-x-0 top-0 z-30 flex min-h-[62px] items-center justify-between px-6 py-4 bg-gradient-to-b from-background/40 via-background/15 to-transparent transition-transform duration-300 ease-out ${
            headerHidden ? "-translate-y-full" : "translate-y-0"
          }`}
        >
          <div className="pointer-events-auto flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center text-foreground/90 transition-opacity hover:opacity-70"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
          <div className="pointer-events-auto flex items-center gap-1">
            <SystemStatusIndicator />
            <button
              onClick={() => setNotificationsOpen(true)}
              className="relative flex h-9 w-9 items-center justify-center text-foreground/90 transition-opacity hover:opacity-70"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" strokeWidth={1.5} />
              <span className="absolute right-1 top-1 flex h-[12px] min-w-[12px] items-center justify-center rounded-full bg-primary px-[2px] text-[9px] font-semibold leading-[12px] text-primary-foreground">
                14
              </span>
            </button>
          </div>
        </header>

        {/* Cinematic hero (full-bleed) */}
        <CinematicHero slides={heroSlides} />

        {/* Edge-to-edge content rows */}
        <div className="relative z-10 flex w-full flex-col gap-6 px-4 pb-16 pt-6 md:px-8 lg:px-12">

          {/* Your babes */}
          <section>
            <SectionTitle icon={Heart} title="Your babes are waiting" action="See all" />
            <TagRow tags={babeCategories} />
            <HScroll>
              {yourBabes.map((b, i) => (
                <BabeCard key={i} {...b} imageUrl={img(`babe-${b.name}-${i}`)} />
              ))}
            </HScroll>
          </section>

          {/* Featured stories */}
          <section className="mt-4">
            <SectionTitle icon={BookOpen} title="Featured stories" action="See all" />
            <HScroll>
              {featuredStories.map((s) => (
                <StoryContentCard key={s.id} {...s} />
              ))}
            </HScroll>
          </section>

          {/* Promo banners */}
          <div className="mt-2 space-y-3">
            <PromoBanner
              variant="gift"
              icon={Sparkles}
              eyebrow="Welcome gift"
              title="A surprise is waiting for you — claim it now"
              description="Sign up today to unlock characters, chat, roleplay and image generation."
              cta="Claim"
            />
            <PromoBanner
              variant="premium"
              icon={Crown}
              title="Go Premium"
              description="Unlimited chats, longer videos, and exclusive babes — without the queue."
              cta="Upgrade"
            />
            <PromoBanner
              variant="tokens"
              icon={Coins}
              title="Token sale — 20% off"
              description="Stock up on tokens this week and save on every pack. Limited time only."
              cta="Buy tokens"
            />
            <PromoBanner
              variant="feature"
              icon={Sparkles}
              title="New: Scene Builder is live"
              description="Break free from character-only prompts. Build full cinematic scenes in seconds."
              cta="Try this"
            />
          </div>


          <section className="mt-4">
            <SectionTitle icon={Video} title="Top trending videos" action="See all" />
            <TagRow tags={videoCategories} />
            <HScroll>
              {trendingVideos.map((v) => (
                <div
                  key={v.id}
                  className="group relative w-[220px] shrink-0 overflow-hidden rounded-2xl bg-grey-dark-1"
                >
                  <div className="relative aspect-[13/19] w-full overflow-hidden">
                    <img
                      src={img(`vid-${v.id}`, 260, 380)}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur">
                        <Play className="h-5 w-5 fill-black text-black" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                      ❤ {v.likes}
                    </div>
                  </div>
                </div>
              ))}
            </HScroll>
          </section>

          {/* Top creators */}
          <section className="mt-4">
            <SectionTitle icon={Crown} title="Top creators" action="See all" />
            <HScroll>
              {topCreators.map((c) => (
                <CreatorRankCard
                  key={c.rank}
                  rank={c.rank}
                  name={c.name}
                  tier={c.tier}
                  verified={c.verified}
                  avatarUrl={`https://picsum.photos/seed/${encodeURIComponent(c.avatarSeed)}/160/160`}
                />
              ))}
            </HScroll>
          </section>

          {/* Your following */}
          <section className="mt-4">
            <SectionTitle icon={UserCircle2} title="Your following" action="See all" />
            <TagRow tags={followingUsernames} />
            <HScroll>
              {yourFollowing.map((b, i) => (
                <BabeCard
                  key={i}
                  {...b}
                  variant="stats"
                  imageUrl={img(`follow-${b.name}-${i}`)}
                />
              ))}
            </HScroll>
          </section>

          {/* Trending this week */}
          <section className="mt-4">
            <SectionTitle icon={Flame} title="Check out this week trending babes" action="See all" />
            <TagRow tags={trendingTags} />
            <HScroll>
              {trendingBabes.map((b, i) => (
                <BabeCard
                  key={i}
                  {...b}
                  variant="stats"
                  imageUrl={img(`trend-${b.name}-${i}`)}
                />
              ))}
            </HScroll>
          </section>

          {/* New story episodes */}
          <section className="mt-4">
            <SectionTitle icon={BookOpen} title="New story episodes" action="See all" />
            <HScroll>
              {newEpisodes.map((s) => (
                <StoryContentCard key={s.id} {...s} />
              ))}
            </HScroll>
          </section>

          {/* Rising creators */}
          <section className="mt-4">
            <SectionTitle icon={TrendingUp} title="Rising creators this week" action="See all" />
            <HScroll>
              {risingCreators.map((c) => (
                <CreatorRankCard
                  key={c.rank}
                  rank={c.rank}
                  name={c.name}
                  tier={c.tier}
                  verified={c.verified}
                  avatarUrl={`https://picsum.photos/seed/${encodeURIComponent(c.avatarSeed)}/160/160`}
                />
              ))}
            </HScroll>
          </section>

          {/* What's new — news row */}
          <section className="mt-4">
            <SectionTitle icon={Newspaper} title="What's new" action="See all" />
            <HScroll>
              {whatsNewItems.map((n, i) => {
                const newsCard = (
                  <div className="group flex h-full w-[300px] shrink-0 flex-col gap-2 rounded-2xl border border-white/[0.06] bg-grey-dark-1/60 p-4 text-left transition-colors hover:border-white/10 hover:bg-grey-dark-1">
                    <div className="flex items-center gap-2 text-[11px] font-medium">
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-primary">{n.tag}</span>
                      <span className="text-grey-light-4">{n.date}</span>
                    </div>
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white">
                      {n.title}
                    </h3>
                    <p className="line-clamp-2 text-xs leading-snug text-grey-light-3">
                      {n.description}
                    </p>
                    <div className="mt-auto flex items-center gap-1 pt-1 text-xs font-medium text-grey-light-3 transition-colors group-hover:text-white">
                      <span>Read more</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                );

                if (!n.announcement) {
                  return (
                    <button key={i} type="button" className="block shrink-0">
                      {newsCard}
                    </button>
                  );
                }

                const a = n.announcement;
                return (
                  <button
                    key={i}
                    type="button"
                    className="block shrink-0"
                    onClick={() =>
                      setInlineAnnouncement({
                        id: `inline-${i}`,
                        tag: n.tag,
                        date: n.date,
                        title: n.title,
                        description: n.description,
                        headline: a.headline,
                        intro: a.intro,
                        sections: a.sections,
                        cta: a.cta,
                        outro: a.outro,
                      })
                    }
                  >
                    {newsCard}
                  </button>
                );
              })}
            </HScroll>
          </section>


          {/* New releases */}
          <section className="mt-4">
            <SectionTitle icon={ImageIcon} title="New releases" action="See all" />
            <TagRow tags={newReleaseTags} />
            <HScroll>
              {newBabes.map((b, i) => (
                <BabeCard
                  key={i}
                  {...b}
                  variant="stats"
                  imageUrl={img(`new-${b.name}-${i}`)}
                />
              ))}
            </HScroll>
          </section>

          {/* Start creating */}

          <section className="mt-4">
            <SectionTitle icon={Sparkles} title="Start creating" />
            {(() => {
              const cardClass =
                "group relative flex w-full shrink-0 flex-col gap-2.5 overflow-hidden rounded-2xl border border-white/5 bg-grey-dark-1 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-white/10";
              const renderCard = (t: (typeof createTools)[number]) => {
                const Icon = t.Icon;
                return (
                  <button key={t.title} className={cardClass}>
                    {/* Subtle primary accent */}
                    <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/15 blur-2xl transition-opacity duration-300 group-hover:bg-primary/25" />

                    {/* Top row: icon + arrow */}
                    <div className="relative flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                        <Icon className="h-[18px] w-[18px] text-white" />
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 backdrop-blur transition-all group-hover:bg-white group-hover:text-black">
                        <ChevronRight className="h-4 w-4 text-current" />
                      </div>
                    </div>

                    {/* Title + subtitle */}
                    <div className="relative min-w-0">
                      <h3 className="line-clamp-2 text-[15px] font-bold leading-tight text-white">
                        {t.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-snug text-grey-light-3">
                        {t.subtitle}
                      </p>
                    </div>
                  </button>
                );
              };

              return (
                <>
                  {/* Tablet & mobile: horizontal scroll */}
                  <div className="xl:hidden">
                    <HScroll>
                      {createTools.map((t) => (
                        <div key={t.title} className="w-[240px] shrink-0">
                          {renderCard(t)}
                        </div>
                      ))}
                    </HScroll>
                  </div>
                  {/* Desktop: full-width grid */}
                  <div className="hidden gap-3 xl:grid xl:grid-cols-5">
                    {createTools.map(renderCard)}
                  </div>
                </>
              );
            })()}
          </section>

          {/* Footer links */}
          <footer className="mt-8 grid grid-cols-2 gap-6 border-t border-[#242529] pt-6 text-[13px] text-grey-light-4 md:grid-cols-4">
            <div>
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-grey-light-2">Social</h4>
              <ul className="space-y-1.5">
                <li><a href="#" className="hover:text-white">Discord</a></li>
                <li><a href="#" className="hover:text-white">X (Twitter)</a></li>
                <li><a href="#" className="hover:text-white">Reddit</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-grey-light-2">Features</h4>
              <ul className="space-y-1.5">
                <li><a href="#" className="hover:text-white">AI Chat</a></li>
                <li><a href="#" className="hover:text-white">Image Generator</a></li>
                <li><a href="#" className="hover:text-white">Video Generator</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-grey-light-2">Legal</h4>
              <ul className="space-y-1.5">
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">2257</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-grey-light-2">Resources</h4>
              <ul className="space-y-1.5">
                <li><a href="#" className="hover:text-white">Guides</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </footer>
        </div>
      </main>

      <FloatingToolsFAB />
    </div>
  );
};

export default Explore;
