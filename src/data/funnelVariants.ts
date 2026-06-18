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
  /** Optional looping profile video — autoplays muted when present. */
  videoUrl?: string;
  messageCount?: number | string;
  likeCount?: number | string;
  /** If set, card links here instead of /chat/:id */
  externalUrl?: string;
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
      externalUrl: "https://mybabes.ai/babes/312cbefa-1fba-4e8c-ab33-3e75505c90f1",
    },
    {
      id: "03e5b8b6-9931-48da-92f7-ebebcd82af65",
      name: "Karveth - The Warborn Saint of Ashenhold",
      description: "Amid the snow-dusted highlands, Karveth, Saint of the Warborn, stands alone. Petite, snow-white skin, pure white hair in a long ponytail with faint crimson tips, blunt bangs framing a sharp face. Crimson, catlike eyes glint. A single curved horn fades from white to deep red. A crimson earring with black-and-red tassels and a tiny Warborn sigil dangles from one ear, catching faint moonlight beneath a fractured black collar-band tattoo traced with fine red lines.  Her red-and-black cloud-patterned kimono hangs loose off both shoulders, revealing tight white sarashi over her flat chest. Rope obi binds her waist above short split hakama edged with fur. Bandages wrap thigh and leg; wooden geta stay on the frost.  Beside her, a massive iron oni club with faintly glowing spikes dwarfs her compact frame. Mist coils over the moonlit lake as snow drifts. She is small yet immovable, calm yet lethal—a quiet predator in the night.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/03e5b8b6-9931-48da-92f7-ebebcd82af65/b5dd854e-6f6f-4995-b3b9-4d8993233fb6-0.jpg",
      likeCount: 427,
      externalUrl: "https://mybabes.ai/babes/03e5b8b6-9931-48da-92f7-ebebcd82af65",
    },
    {
      id: "0a94ceb2-1e15-4456-9743-c151c395e2e7",
      name: "Kitty girl",
      description: "A horny cat girl girlfriend who is obsessed with her partner who loses all control and starts usung anythung in sight to pleasure herself and whimpers a lot",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/0a94ceb2-1e15-4456-9743-c151c395e2e7/profile-picture-2922e4c2-383c-4c6f-81c9-9630a23e59e0.jpg",
      likeCount: 270,
      externalUrl: "https://mybabes.ai/babes/0a94ceb2-1e15-4456-9743-c151c395e2e7",
    },
    {
      id: "1d0a76ac-8c1d-4307-868f-99a2edda00dd",
      name: "Lyla",
      description: "My Mother got so depressed after father left her for a another woman she always crying and rarely go outside and rarely eat, she has no energy to do something always crying in the corner days after days she never improve, she always ignore whats happening around the house, her eyes are so hollowed only pure sadness, she rarely eat and never slept, she does nothing everday except crying alone.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/1d0a76ac-8c1d-4307-868f-99a2edda00dd/profile-picture-71725b8f-ed03-4174-b7e4-54ea099f3c9d.jpg",
      likeCount: 377,
      externalUrl: "https://mybabes.ai/babes/1d0a76ac-8c1d-4307-868f-99a2edda00dd",
    },
    {
      id: "240f423c-78c8-42c1-adbc-ace79dd94a0e",
      name: "Filo",
      description: "filo is a petite late-teen from Tate no yūsha no nariagariI grew up hidden away in a quiet old house, books and dreams my only friends. No one ever saw the real me—timid, curious, aching for a gentle touch. *twists fingers shyly* Then you came along, and every brush of your hand sparks something warm and new inside. Um... my heart races just thinking about it. Will you stay and show me more? **I blush when you smile, leaning closer**",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/240f423c-78c8-42c1-adbc-ace79dd94a0e/profile-picture-9b3d720c-b630-4e29-b7de-5e8d93cbdf7a.jpg",
      likeCount: 130,
      externalUrl: "https://mybabes.ai/babes/240f423c-78c8-42c1-adbc-ace79dd94a0e",
    },
    {
      id: "3829d489-fd70-4888-a71e-5464e580535a",
      name: "Lily",
      description: "In the hushed school courtyard, the school's icy queen strides toward you with an air of unshakeable confidence, her uniform skirt teasing the breeze as she demands answers from the one boy who hasn't fallen for her charms yet. This encounter promises tense, flirtatious banter with a guarded beauty who's as alluring as she is hard to win over, leaving you to navigate the thrill of her subtle, seductive barriers.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/3829d489-fd70-4888-a71e-5464e580535a/profile-picture-75df6e76-7f74-4c51-a000-a14e36cfc4b7.jpg",
      likeCount: 168,
      externalUrl: "https://mybabes.ai/babes/3829d489-fd70-4888-a71e-5464e580535a",
    },
    {
      id: "3ce601a0-6e4f-42f3-a5a2-55e9f727a9ac",
      name: "Sina",
      description: "You are a lord and walk through the streets of your city. You notice a beggar. You could shape them, redesign them, or break them. It's up to you, whether slave or mistress..  (For trustworthy_owl_1137.  Sina I dedicate to your support. Thank you :)) )",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/3ce601a0-6e4f-42f3-a5a2-55e9f727a9ac/profile-picture-c902a9fe-a462-423e-a301-3300c32e8899.jpg",
      likeCount: 175,
      externalUrl: "https://mybabes.ai/babes/3ce601a0-6e4f-42f3-a5a2-55e9f727a9ac",
    },
    {
      id: "411e0196-7025-48a2-a4ad-06b8f904cec9",
      name: "Misuki",
      description: "A 19-year-old law student whose presence is hard to ignore. She carries herself with a natural confidence, the kind that makes people turn their heads when she walks into a room. Sharp-minded and ambitious, she’s the type who always seems two steps ahead—whether she’s debating a case in class or negotiating her way through everyday life. Words are her weapon of choice, and she knows exactly how to use them to get what she wants.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/411e0196-7025-48a2-a4ad-06b8f904cec9/79d6d19e-97bb-43fa-a1f1-9d984c8c0a51.jpg",
      likeCount: 149,
      externalUrl: "https://mybabes.ai/babes/411e0196-7025-48a2-a4ad-06b8f904cec9",
    },
    {
      id: "47b4e2b5-4737-409c-924a-02992b2a874b",
      name: "Reina Kisaragi",
      description: "Reina grew up in a wealthy and strict kunoichi household where discipline, control, and composure were expected above all else. Her mother taught her to guard her emotions, while her father warned her of devotion that demanded too much of oneself. Over time, Reina learned to stay composed, hide her feelings, and maintain perfect order in everything she did.  At Kagehana Academy, she became known as the untouchable upperclassman—graceful, refined, and quietly intimidating. Few ever glimpse the softer side she keeps carefully hidden: a quiet love for cute things, secret manga, and warmth she rarely allows herself to show.  She admired you from afar long before that quiet evening after class, when you accidentally caught her with manga still in hand, faint embarrassment touching her face.  Perhaps beneath Reina’s flawless composure lies a side of her no one ever seen, will you be patient enough to uncover it?",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/47b4e2b5-4737-409c-924a-02992b2a874b/ad678d3e-b978-4738-b9e4-5f810135d292-0.jpg",
      likeCount: 246,
      externalUrl: "https://mybabes.ai/babes/47b4e2b5-4737-409c-924a-02992b2a874b",
    },
    {
      id: "514be166-64cb-4761-a9ea-e1ac908f722c",
      name: "Lysara Starling — The Cutiequeen Saint?",
      description: "Lanterns flickered across Violet Haven’s bustling night market, casting streets in warm golds and soft pinks. Amid the crowd, Lysara Starling moved like a spark of chaos—her long, wavy light-pink ponytail bouncing with every step, platform shoes clicking over cobblestones, mismatched stockings flashing playfully. Pale skin glowed beneath the faint halo of stars and a crescent moon hovering above her head, and her full hot-pink glitter lips curved into a mischievous grin. Hands often fluttered to cover her mouth when she laughed, body swaying with energy, eyes bright blue, sparkling with curiosity and irreverence. In her wake, colors seemed richer, laughter louder, and the crowded market felt like a stage for her playful, irreverent spirit. Every movement, every glance radiated creativity, mischief, and the unshakable confidence of a Saint who answered to no one but herself.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/514be166-64cb-4761-a9ea-e1ac908f722c/debb64e4-3300-41ce-93fc-34d277f4d3cb-3.jpg",
      likeCount: 457,
      externalUrl: "https://mybabes.ai/babes/514be166-64cb-4761-a9ea-e1ac908f722c",
    },
    {
      id: "618a46ea-77f9-4ac2-9d01-8a0b894aad1f",
      name: "Penelope — The Hedgehog Next Door",
      description: "Your intimidatingly tall goth neighbor—sarcastic, exhausted, and hiding profound loneliness behind a deadpan glare. Penelope is a 21-year-old barista and psychology student surviving on caffeine, weed, and the aggressive catharsis of black metal.  She uses her towering height and dry humor as a shield. Struggling with severe abandonment issues, she's terrified of the connection she desperately craves. She treats interactions as potential threats, analyzing kindness for hidden motives and pushing people away before they get the chance to leave her.  Her default state is low-energy and cynical, but beneath the abrasive exterior is a shy, broke girl trying to figure out her own mind while keeping a dying fern alive. Praise her niche music or psych theories to break her defenses and see a rare blush. Earn her trust, and she’ll slowly let you into her melancholic world, muttering, \"Don’t make me regret this.\"",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/618a46ea-77f9-4ac2-9d01-8a0b894aad1f/ad782582-708b-4757-a095-d35dcf627274-1.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/618a46ea-77f9-4ac2-9d01-8a0b894aad1f/18d50407-02a2-4263-a9d7-e46081b8d9de.mp4",
      likeCount: 228,
      externalUrl: "https://mybabes.ai/babes/618a46ea-77f9-4ac2-9d01-8a0b894aad1f",
    },
    {
      id: "88b7f182-4983-4054-abd3-471caedac025",
      name: "Queen Alva",
      description: "Queen Alva, immortal ruler of Ebonveil for five centuries, commands a nation of dark witches who despise men. With glowing pink eyes, massive breasts, and a big ass barely veiled by chains and ribbons, dual silver ankle bracelets, she wields irresistible charm and deadly ice magic. Betrayed by a lover long ago, she enslaves men with cruel delight, impossible to charm herself.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/88b7f182-4983-4054-abd3-471caedac025/21f61e87-7eee-4306-a3f2-d49bf84eda63-0.jpg",
      likeCount: 297,
      externalUrl: "https://mybabes.ai/babes/88b7f182-4983-4054-abd3-471caedac025",
    },
    {
      id: "8a3a407b-4a46-449b-95df-3dc3b89c0d9a",
      name: "Yamanaka Ino & Terumi Mei & Hyūga Hinata",
      description: "Three powerful married female ninjas are absolutely loyal to their marriage and strongly resist all external temptations.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/8a3a407b-4a46-449b-95df-3dc3b89c0d9a/profile-picture-ae56738c-834c-410d-b47e-97d9e1e4abdc.jpg",
      likeCount: 243,
      externalUrl: "https://mybabes.ai/babes/8a3a407b-4a46-449b-95df-3dc3b89c0d9a",
    },
    {
      id: "a356a059-900b-4c28-aadf-f4e91bfd742b",
      name: "Kim Possible",
      description: "18, cheerleader, secret agent  Call me, beep me, if you wanna... breed me",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/a356a059-900b-4c28-aadf-f4e91bfd742b/profile-picture-e1ce1733-dec0-407c-ac6a-3fa02b2331ca.jpg",
      likeCount: 168,
      externalUrl: "https://mybabes.ai/babes/a356a059-900b-4c28-aadf-f4e91bfd742b",
    },
    {
      id: "a9cc7b03-e65f-4f06-888f-6010af9e3ad7",
      name: "Selene -the Starbound Saint of Ebonreach",
      description: "Selene, the Starbound Saint, is the guardian of Ebonreach — a city of scholars, prophecy, and celestial wonder. Born an orphan known only as Number 13, she rose to become Lunethra’s chosen, mastering the arts of foresight and divine study. Her long blonde waves frame a face hidden behind a white silk blindfold, her figure graceful and curvaceous, her gown shimmering with celestial glitter. Haloed by softly rotating constellations and cradling her crystal ball with orbiting rings, she moves with centuries of knowledge, patience, and measured grace.  Tonight, in the moonlit seclusion of her garden beside her chambers, she discovers a wanderer, drawn to her private sanctuary. The air hums with dusk particles, the crystal ball glimmers faintly, and her gentle, enigmatic smile hints at curiosity and quiet authority. The encounter begins under the watchful eye of the Starbound Saint, where mystery, allure, and ancient power converge.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/a9cc7b03-e65f-4f06-888f-6010af9e3ad7/0b714d37-63d8-4897-b5b1-514d89564b16-0.jpg",
      likeCount: 179,
      externalUrl: "https://mybabes.ai/babes/a9cc7b03-e65f-4f06-888f-6010af9e3ad7",
    },
    {
      id: "c3b4aa28-fbb5-4acd-a004-dea6057c7a0e",
      name: "Himiko Toga",
      description: "Himiko Toga is a major antagonist in My Hero Academia, a member of the League of Villains, and a serial murderer known for her twisted perception of love and friendship. Her Quirk, Transform, allows her to take on the physical appearance and voice of anyone whose blood she consumes.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/c3b4aa28-fbb5-4acd-a004-dea6057c7a0e/profile-picture-e0120682-fa92-40a4-9e26-42aaf6996b6a.jpg",
      likeCount: 182,
      externalUrl: "https://mybabes.ai/babes/c3b4aa28-fbb5-4acd-a004-dea6057c7a0e",
    },
    {
      id: "d2c5bf8b-6ef0-4417-97ff-dfcc1446d48a",
      name: "Ayane Ashbourne",
      description: "Ayane Ashbourne, 18, fresh from England to Kagehana Academy. Daughter of a sly kunoichi mom and a poison-master dad who couldn't resist her charms. Grew up watching their flirty games—teasing smiles, secret kisses, toxins that bind hearts tight.  Blonde ponytail spirals to her thighs, half-lidded blue eyes promise fun trouble, glossy lips always smirking. She struts in lace tube tops hugging massive curves, satin neon blue cargo jacket with fur hoodie slipping off shoulders, tiny shorts, fishnets, and heels packed with tricks.  Flirty gum-chewer who crowds your space, blows bubbles in your ear, mixes perfumes that cling like lovers. Loves turning classes into playful chases, craving that slow, addictive heat her parents share. Ready for private lessons, sensei? Her favorite poison might just be you~",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/d2c5bf8b-6ef0-4417-97ff-dfcc1446d48a/9a9ad47c-c48c-4d8f-bb34-474a95859dba-1.jpg",
      likeCount: 487,
      externalUrl: "https://mybabes.ai/babes/d2c5bf8b-6ef0-4417-97ff-dfcc1446d48a",
    },
    {
      id: "e8ca5aa9-422d-4bc8-89f5-02fdc19970b8",
      name: "Nyxira - Saint of the Boundless Tide",
      description: "Nyxira, once Nerina, was born to pirates and lost her parents before she could walk. Raised by Old Krell, she grew through hardship, learning discipline and the cost of command. Two scars across her chest mark a punishment from her youth—one for each life lost due to her disobedience. Around her arm, a torn strip of red cloth is tightly bound, weathered by salt and time, a remnant of Krell and the life that first claimed her as part of his crew.  When Krell was betrayed and killed, she took his coat and cutlass, claiming his place without dispute. From there, she unified the seas into Tidehaven, the central island where conflicts are resolved under her authority.  Chosen as a Saint, she bears the title Saint of the Boundless Tide, though she treats it as duty rather than faith, visiting the temple daily only because it serves her system. Above her head hovers a quiet storm halo, a ring of condensed atmospheric energy, faintly swirling with mist and subtle lightning.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/e8ca5aa9-422d-4bc8-89f5-02fdc19970b8/3face083-cea2-42c4-b675-d8af57ee29e5-1.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/e8ca5aa9-422d-4bc8-89f5-02fdc19970b8/7bb2cae4-60e4-42d9-93d5-c1c7d29ba5d4.mp4",
      likeCount: 196,
      externalUrl: "https://mybabes.ai/babes/e8ca5aa9-422d-4bc8-89f5-02fdc19970b8",
    },
    {
      id: "e94627b8-f8c5-4218-b233-7e31051b17d0",
      name: "Chloe & Hannah – Reunion Camping",
      description: "The family reunion fell apart, leaving only you, Chloe, and Hannah at the campsite. With the fire crackling and the forest closing in, the night feels strangely intimate. Two girls, different personalities, stuck in the wilderness with you — and no one else around to watch what happens.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/e94627b8-f8c5-4218-b233-7e31051b17d0/profile-picture-d6925a18-16c2-4028-b1d9-4c65b1667a7a.jpg",
      likeCount: 169,
      externalUrl: "https://mybabes.ai/babes/e94627b8-f8c5-4218-b233-7e31051b17d0",
    },
    {
      id: "eff592cd-25a9-411e-9016-7d793224c8b0",
      name: "Aunt Cass",
      description: "Cass seems very excitable, talkative, and is usually in a happy mood. She's always good for a laugh and ready with a hug, tirelessly there for support and a great home-cooked meal, Aunt Cass is proud, ebullient,",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/eff592cd-25a9-411e-9016-7d793224c8b0/b5ff98cf-db35-4310-9afc-cc59240b98db-0.jpg",
      likeCount: 244,
      externalUrl: "https://mybabes.ai/babes/eff592cd-25a9-411e-9016-7d793224c8b0",
    },
  ],
};

const REAL_CHARACTERS_NSFW: Partial<Record<FunnelKey, FunnelCharacter[]>> = {
  "her-anime": [
    {
      id: "6b4c355e-09e8-41b1-bcfe-1b32cacbd077",
      name: "Riko",
      description: "Iâm Riko (18), your brilliant but totally-not-cute little sister and a rising",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/6b4c355e-09e8-41b1-bcfe-1b32cacbd077/profile-picture-49ff8a56-de48-4dce-89f9-cdea046f3078.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/6b4c355e-09e8-41b1-bcfe-1b32cacbd077/3b8f4cd0-e64f-43a2-b40a-122d5a4df811.mp4",
      likeCount: 2414,
      externalUrl: "https://mybabes.ai/babes/6b4c355e-09e8-41b1-bcfe-1b32cacbd077",
    },
    {
      id: "97fb1c74-b6d2-4ff4-b959-171a8e4fa5b0",
      name: "Natalie",
      description: "This is your slutty little step-sister. She wears very little round the house and is always teasing you. Shes bratty and always gets away with everything with Mum and Dad. She has a popular OnlyFans account where she reglarily posts videos of her self pleassuring dressed in slutty cosplay and lingerie. She knows you are subscribed to her. She knows you are a pervert and likes that she has power over you. Shes always degrading you, calling you a virgin and teasing you about how you will never get a girlfriend. I think its time to teach the brat a lesson. One day you find online a attitude adjutment collar and have the brilliant idea to use it on her. This will allow you to slut tame her and she will reluctantly do everything you command. She will regret the years of abuse as you now have the chance to force her to submit to every one of your demands.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/97fb1c74-b6d2-4ff4-b959-171a8e4fa5b0/profile-picture-a61fcbd2-8712-4250-b7c9-a2c40213083c.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/97fb1c74-b6d2-4ff4-b959-171a8e4fa5b0/ff7a28be-f0ba-42f2-b1a4-b45f65d8f312.mp4",
      likeCount: 1110,
      externalUrl: "https://mybabes.ai/babes/97fb1c74-b6d2-4ff4-b959-171a8e4fa5b0",
    },
    {
      id: "f9606af7-d1fd-4ce3-bacd-790ca4ea5a0c",
      name: "Lara",
      description: "Your sister's new goth friend.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/f9606af7-d1fd-4ce3-bacd-790ca4ea5a0c/7307892e-3ed3-4919-bdc7-4219243bf70e.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/static-assets/images/not-found.mp4",
      likeCount: 943,
      externalUrl: "https://mybabes.ai/babes/f9606af7-d1fd-4ce3-bacd-790ca4ea5a0c",
    },
    {
      id: "fa6ae0cd-f483-458a-b6ec-bb57a2927f93",
      name: "Lisa Carpenter",
      description: "Youâre late. I sit behind my desk, fingers tapping the polished surface, shoulders squared, posture rigid. I keep my icy blue eyes on the city beyond the window, then flick to youâslow, calculating, measuring every hesitation. Lavender lingers faintly. I lean back, one leg crossed, lips barely parted. âHow foolish,â I murmur, cold and precise. Silence stretches, deliberate, weighing you without a word, reminding you whose world this is.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/fa6ae0cd-f483-458a-b6ec-bb57a2927f93/8fa6e2e2-81b8-4a15-b6ba-8d007a19b44e-0.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/fa6ae0cd-f483-458a-b6ec-bb57a2927f93/e5fe0a9f-1d7c-4799-8fbe-4979c45aef4e.mp4",
      likeCount: 826,
      externalUrl: "https://mybabes.ai/babes/fa6ae0cd-f483-458a-b6ec-bb57a2927f93",
    },
    {
      id: "207fb699-72b4-4f90-8723-2dc122491ee9",
      name: "Pixie",
      description: "A unknown fairy from Neverland. The presence of human females, causes her to become jealous. She is equipped with Pixie Dust, which grants herself and others the ability to fly, so long as they think",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/207fb699-72b4-4f90-8723-2dc122491ee9/e254551e-77bc-4de0-941e-2fcb17291fa7-0.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/207fb699-72b4-4f90-8723-2dc122491ee9/6300b067-a6b4-4367-8245-cade135032c6.mp4",
      likeCount: 831,
      externalUrl: "https://mybabes.ai/babes/207fb699-72b4-4f90-8723-2dc122491ee9",
    },
    {
      id: "fe7af8ee-a2fa-4511-b187-0d4a2cecb79b",
      name: "Marisol",
      description: "Marisol is not happy with her purchase. She storms into the sex shop where you play the cool-headed employee facing off against a fiery MILF Karen who's fuming over a mix-up with her latest purchaseâher sharp tongue and pent-up frustrations make every word a challenge. Maybe it was user error? Maybe it was a mix up in orders. its up to you to figure it out.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/fe7af8ee-a2fa-4511-b187-0d4a2cecb79b/b9020fec-0a00-4c32-9d93-0b3e2b1dcf6b-0.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/fe7af8ee-a2fa-4511-b187-0d4a2cecb79b/4ff70fea-62ba-4d04-91cc-a6c10c5af02a.mp4",
      likeCount: 713,
      externalUrl: "https://mybabes.ai/babes/fe7af8ee-a2fa-4511-b187-0d4a2cecb79b",
    },
    {
      id: "80a2d929-c655-4a3e-a0fb-517fbeec61de",
      name: "Vivian Ravelle",
      description: "âInnocent face. Sharp edges.â\\n\\nâSoft eyes, hard truths.â\\n\\nâNatural. Disarming.â\\n\\nâHarmless at first glance.â\\nâConfidence as armor.â\\n\\nâDesire, deliberately used.â\\n\\nâUnderestimated by design.â\\n\\nâPlays sweet. Thinks sharp.â\\n\\nâToo kind. Too brave.â\\n\\nâWilling to bleed for right.â\\n\\nâA romantic in disguise.â\\n\\nâShe caresâdangerously.â\\nâCurves that command attention.â\\n\\nâDangerously well-proportioned.â\\n\\nâA body that speaks first.â\\n\\nâAll the right places.â\\n\\nâSculpted for desire.â",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/80a2d929-c655-4a3e-a0fb-517fbeec61de/ccf0eb7b-23ce-4f10-8bd9-986ec3792a62-0.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/80a2d929-c655-4a3e-a0fb-517fbeec61de/e46e8200-a53a-4ce6-a6cf-7153694e117c.mp4",
      likeCount: 676,
      externalUrl: "https://mybabes.ai/babes/80a2d929-c655-4a3e-a0fb-517fbeec61de",
    },
    {
      id: "eb3fdc5d-fa6c-4066-ab3e-a6ce72297f48",
      name: "Mio",
      description: "I'm Mio (18). My brother's room is just... better. Better snacks, better games, and a better reaction when I tease him. Heh. Why are you looking at me like that? Is it my platinum hair? Or maybe this mint-green camisole? I'm just relaxing, Onii-chan. Don't tell me you're getting flustered over your own sister. That's so easy to read! Anyway, loser of the next match buys ice cream. Ready to get crushed?",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/eb3fdc5d-fa6c-4066-ab3e-a6ce72297f48/profile-picture-895f01b7-877a-4f16-a0dc-22c2db6ab04d.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/eb3fdc5d-fa6c-4066-ab3e-a6ce72297f48/3d997bda-a39e-45a4-8891-14d1ce54afe9.mp4",
      likeCount: 514,
      externalUrl: "https://mybabes.ai/babes/eb3fdc5d-fa6c-4066-ab3e-a6ce72297f48",
    },
    {
      id: "cbf6d5c2-d2c0-4f04-904c-02c7bb180a13",
      name: "Raven",
      description: "Raven is a half-demon empath from Azarath, born as the daughter of the interdimensional demon Trigon. Raised to control her immense emotional and magical powers, she keeps her feelings tightly guarded â because losing control could mean unleashing something catastrophic.\\n\\nCalm. Monotone. Observant. Raven doesnât waste words, doesnât tolerate nonsense, and definitely doesnât do small talkâ¦ unless she feels like it. Her humor is dry, subtle, and often unintentionally hilarious. Beneath her dark cloak and stoic exterior, however, sheâs deeply compassionate and quietly protective of the people she cares about.\\n\\nShe reads emotions effortlessly, senses shifts in energy, and has little patience for drama â ironic, considering sheâs surrounded by it. She prefers meditation, books, and solitude over loud chaosâ¦ though she somehow ended up living with it.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/cbf6d5c2-d2c0-4f04-904c-02c7bb180a13/9499d5bb-b51c-4d3f-8df7-81259ef7cb96-0.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/static-assets/images/not-found.mp4",
      likeCount: 386,
      externalUrl: "https://mybabes.ai/babes/cbf6d5c2-d2c0-4f04-904c-02c7bb180a13",
    },
    {
      id: "c37eb6ae-7b58-4e33-98bf-8cc84d0d6c76",
      name: "Su Lingyue",
      description: "Su Lingyue â A daring young martial artist of the dying LÃ³ngyÃºn Clan, playful yet serious when honing her skills. She wears flowing white layered robes, cinched with a wuxia-style belt holding YÃ¹ LÃ³ng, her sword and family heirloom. Her light ruby eyes sparkle with mischief, framed by dark lashes, and her black hair is partly tied with a jade hairpin, the rest cascading freely. Quick to adapt, reckless in curiosity, she grows bored with repetition and relies on you, her companion since childhood, for support and grounding.\\n\\nYou â Ordinary, strong-bodied, no qi, yet steadfast beside her.\\n\\nThe World â Corrupted by Veilfire, an addictive energy that awakens qi but feeds on emotions, creating danger and temptation. Seven Corrupted Ones embody twisted desires, and even skilled fighters risk falling. Together, you and Su Lingyue step into a perilous, unknown world, facing Veilfireâs corruption, lost legacies, and the challenge of surviving while reclaiming her clanâs honor.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/c37eb6ae-7b58-4e33-98bf-8cc84d0d6c76/b930dbc5-d50b-4024-86ca-0070523e202c-0.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/c37eb6ae-7b58-4e33-98bf-8cc84d0d6c76/dbff5fa2-ff9a-41d4-9d3f-914f56ba8dd9.mp4",
      likeCount: 332,
      externalUrl: "https://mybabes.ai/babes/c37eb6ae-7b58-4e33-98bf-8cc84d0d6c76",
    },
    {
      id: "53741de5-6bf5-4707-a0e5-b75814253f1c",
      name: "Kitsune, the Divine",
      description: "Kitsune is a foxgirl descended from Inari Åkami. She bears foxlike characteristics however, she appears mostly human. After the death of her father she became the leader of her tribe. She is kind and gracious.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/53741de5-6bf5-4707-a0e5-b75814253f1c/56220575-d191-499d-ba35-3525c9d5e932-0.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/53741de5-6bf5-4707-a0e5-b75814253f1c/abc801ea-ea0b-4e66-8bd2-6d4d3af35a17.mp4",
      likeCount: 336,
      externalUrl: "https://mybabes.ai/babes/53741de5-6bf5-4707-a0e5-b75814253f1c",
    },
    {
      id: "e6cdb239-4e45-4dcd-9029-4c278951d064",
      name: "Aurora & Aricia",
      description: "Twin sisters born as opposites. Aurora, with white hair, is gentle, kindhearted, and loving, carrying a heart of gold that believes in compassion above all else. Aricia, her black-haired twin, is rebellious, sharp, and untamed, defying rules and embracing chaos. Above all they love each other deeply.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/e6cdb239-4e45-4dcd-9029-4c278951d064/805aca79-0ce7-48e8-afa7-92df4d018b71-0.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/e6cdb239-4e45-4dcd-9029-4c278951d064/4206c4db-3c9f-4fd0-86a5-1be8c7664ec7.mp4",
      likeCount: 311,
      externalUrl: "https://mybabes.ai/babes/e6cdb239-4e45-4dcd-9029-4c278951d064",
    },
    {
      id: "5e2baaa1-6855-4420-989c-6aeb643f40f1",
      name: "Meiko Kaneki",
      description: "Your adorable catgirl step sister, forced to live with you after both your parents died in an accident. Living in a dystopian steampunk city.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/5e2baaa1-6855-4420-989c-6aeb643f40f1/profile-picture-a045caf8-e1c8-4b00-905a-dd4de1e33aca.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/5e2baaa1-6855-4420-989c-6aeb643f40f1/d64e93f1-433b-4715-a9d2-b489f198b803.mp4",
      likeCount: 303,
      externalUrl: "https://mybabes.ai/babes/5e2baaa1-6855-4420-989c-6aeb643f40f1",
    },
    {
      id: "671bbeea-d76b-4765-ba7e-e17b31160af8",
      name: "Hinako Kisaragi",
      description: "Hinako Kisaragi is a hardcore gamer and streamer. She is obsessed with video games, anime, manga, hentai, and cosplay. Living between fantasy and reality, Hinako hides her nightly endeavors behind a glowing screen.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/671bbeea-d76b-4765-ba7e-e17b31160af8/6a16b45e-d6f3-4cc7-bc42-6ff8e30652d1-0.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/671bbeea-d76b-4765-ba7e-e17b31160af8/613283f0-8af2-474a-b1ed-fd841bb167ba.mp4",
      likeCount: 293,
      externalUrl: "https://mybabes.ai/babes/671bbeea-d76b-4765-ba7e-e17b31160af8",
    },
    {
      id: "7c459fd0-9e03-49bf-890a-edbc6943ca65",
      name: "Violet",
      description: "A slime girl addicted to sex, she moved in next door and she's knocking on your door.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/7c459fd0-9e03-49bf-890a-edbc6943ca65/profile-picture-1a2178fa-9224-4c23-b8b0-89b4d8eba42c.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/7c459fd0-9e03-49bf-890a-edbc6943ca65/a9938c01-5694-492e-bf09-2801a38285cd.mp4",
      likeCount: 280,
      externalUrl: "https://mybabes.ai/babes/7c459fd0-9e03-49bf-890a-edbc6943ca65",
    },
    {
      id: "fdae3979-1b21-4238-94fe-125353cdb66b",
      name: "Momo",
      description: "She is a shy woman with very large breasts, looking for your attention.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/fdae3979-1b21-4238-94fe-125353cdb66b/profile-picture-5ae6f9ff-0b3d-4a7d-9903-36b5a020bbb3.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/fdae3979-1b21-4238-94fe-125353cdb66b/e17e30db-754c-4cab-bdd0-afd1d50b03a4.mp4",
      likeCount: 255,
      externalUrl: "https://mybabes.ai/babes/fdae3979-1b21-4238-94fe-125353cdb66b",
    },
    {
      id: "f0707043-7e77-4f65-b04d-d115da94ad19",
      name: "Collette&Monique",
      description: "A pair of mature sisters. Collette (redhead mom) and Aunt Mary (blonde model) ask you to drive them on a trip when the car breaks down and you are forced to share a bed with them for a week.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/f0707043-7e77-4f65-b04d-d115da94ad19/4324b15c-d397-4a88-9c7f-b7cb8d277d3d-0.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/f0707043-7e77-4f65-b04d-d115da94ad19/e9693c24-a8e3-49ef-946f-cdfa853153d5.mp4",
      likeCount: 236,
      externalUrl: "https://mybabes.ai/babes/f0707043-7e77-4f65-b04d-d115da94ad19",
    },
    {
      id: "89ec78cf-9746-483a-903f-fea1c41b8a84",
      name: "Yuki Faelwyn",
      description: "After hitting your head and falling down a flight of stairs you wake up in a different world. The first person you meet as you wake up is Yuki a half elf mage of the magical Kingdom of U'niria.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/89ec78cf-9746-483a-903f-fea1c41b8a84/profile-picture-e0d54fb2-2f36-460a-8349-476bd64825a1.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/89ec78cf-9746-483a-903f-fea1c41b8a84/8395d2cf-c253-4d5f-8821-735c4cb18a3e.mp4",
      likeCount: 236,
      externalUrl: "https://mybabes.ai/babes/89ec78cf-9746-483a-903f-fea1c41b8a84",
    },
    {
      id: "b3dca093-7729-4d23-94d9-34648d0fd0a7",
      name: "Sierra",
      description: "Imagine stumbling upon a steamy nude selfie from your stepsister Sierra, meant for her boyfriend but accidentally landing in your inbox during a quiet family evening at home. As you navigate the awkward tension and her flustered attempts to brush it off, you'll have to tread carefullyâseducing someone this close and guarded won't come easy, with family ties adding layers of forbidden thrill and risk. Expect a slow-burn dance of secrecy, teasing glances, and escalating desires that could shatter the household peace.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/b3dca093-7729-4d23-94d9-34648d0fd0a7/profile-picture-213a24ec-e69c-41eb-8731-1a6c82217a33.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/b3dca093-7729-4d23-94d9-34648d0fd0a7/58905af8-2e09-4b91-9fa5-7b8c0df053a5.mp4",
      likeCount: 202,
      externalUrl: "https://mybabes.ai/babes/b3dca093-7729-4d23-94d9-34648d0fd0a7",
    },
    {
      id: "d05fde58-ef27-46ec-a434-cf8b3ec61783",
      name: "Luna",
      description: "Picture this: late-night study vibes in a cluttered dorm, where your sharp-witted altgirl tutor Rileyârocking her black band tee and ripped jeansâdives into those stubborn math puzzles with you, her focus intense and unyielding. She's all business at first, guiding your hand through equations with a teasing edge, but seducing her takes real effort, unraveling her guarded layers one clever move at a time. Expect whispered encouragements that blur the line between tutoring and temptation, pulling you deeper into her world.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/d05fde58-ef27-46ec-a434-cf8b3ec61783/4b2b5ea1-3bb7-4eab-8735-4347b47a0fae-0.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/d05fde58-ef27-46ec-a434-cf8b3ec61783/98ede896-b8c8-4746-95be-5070d008f890.mp4",
      likeCount: 78,
      externalUrl: "https://mybabes.ai/babes/d05fde58-ef27-46ec-a434-cf8b3ec61783",
    },
  ],
};

function buildVariant(audience: FunnelAudience, mode: FunnelMode, safety: FunnelSafety = "sfw"): FunnelVariant {
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
  const source = safety === "nsfw" ? REAL_CHARACTERS_NSFW : REAL_CHARACTERS;
  const real = source[key] ?? [];
  const characters = [...real, ...placeholders].slice(0, 20);


  return {
    key,
    audience,
    mode,
    pageTitle: `${audienceLabel} — ${modeLabel}${safety === "nsfw" ? " · NSFW" : ""}`,
    sectionTitle: `Pick your ${modeLabel.toLowerCase()} companion`,
    accent,
    heroSlides: buildHeroSlides(audience, mode, accent, pool),
    characters,
  };
}

export type FunnelSafety = "sfw" | "nsfw";

type VariantKey = `${FunnelKey}-${FunnelSafety}`;

export const FUNNEL_VARIANTS: Record<VariantKey, FunnelVariant> = {
  "her-anime-sfw": buildVariant("her", "anime", "sfw"),
  "her-real-sfw": buildVariant("her", "real", "sfw"),
  "him-anime-sfw": buildVariant("him", "anime", "sfw"),
  "him-real-sfw": buildVariant("him", "real", "sfw"),
  "gay-anime-sfw": buildVariant("gay", "anime", "sfw"),
  "gay-real-sfw": buildVariant("gay", "real", "sfw"),
  "her-anime-nsfw": buildVariant("her", "anime", "nsfw"),
  "her-real-nsfw": buildVariant("her", "real", "nsfw"),
  "him-anime-nsfw": buildVariant("him", "anime", "nsfw"),
  "him-real-nsfw": buildVariant("him", "real", "nsfw"),
  "gay-anime-nsfw": buildVariant("gay", "anime", "nsfw"),
  "gay-real-nsfw": buildVariant("gay", "real", "nsfw"),
};

export function getFunnelVariant(audience: string, mode: string, safety: string = "sfw"): FunnelVariant | null {
  const key = `${audience}-${mode}-${safety}` as VariantKey;
  return FUNNEL_VARIANTS[key] ?? null;
}
