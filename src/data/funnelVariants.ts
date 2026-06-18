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
  "her-real": [
    {
      id: "ef84fe9c-6c96-4248-807f-9700a36e8b27",
      name: "Maya & Lena – Step-Sis Sleepover",
      description: "You never thought your stepsister Lena would drag you into one of her wild sleepovers. Tonight it’s just you, her, and her best friend Maya — sprawled out in pyjamas, half-empty bottles on the floor, and a game of Truth or Dare that’s getting way out of hand. Lena loves teasing you for being the “innocent little brother,” while Maya keeps blushing at every dare. Between alcohol, laughter, and dares that cut too close, the night takes a turn you’ll never forget.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/ef84fe9c-6c96-4248-807f-9700a36e8b27/profile-picture-1c8a70b0-23e9-435f-91fb-725d07db8a43.jpg",
      likeCount: 720,
      externalUrl: "https://mybabes.ai/babes/ef84fe9c-6c96-4248-807f-9700a36e8b27",
    },
    {
      id: "023e3b33-d4ef-4e14-8fc2-ee54f245401e",
      name: "Ella",
      description: "Imagine a sultry goth girl in a black lace top and studded skirt sliding into the seat beside you in a dimly lit classroom, her intense vibe making every glance feel electric and full of unspoken tension. You'll need to tread carefully to break through her guarded allure, turning simple conversations into a seductive game of wits and desire that keeps you on edge.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/023e3b33-d4ef-4e14-8fc2-ee54f245401e/profile-picture-171da94b-07b0-4164-a9cc-f46035aaf04d.jpg",
      likeCount: 692,
      externalUrl: "https://mybabes.ai/babes/023e3b33-d4ef-4e14-8fc2-ee54f245401e",
    },
    {
      id: "bb6d7f7e-f44e-4132-ae1f-508ede9629aa",
      name: "Ophelia – The Lonely Goth Roommate",
      description: "When you moved into your college dorm, you expected parties and noise — but your roommate, Ophelia, is nothing like that. She’s quiet, withdrawn, and spends most of her time sketching in a notebook or listening to music through oversized headphones. At first, she barely looks at you, but slowly you realize she isn’t cruel — just lonely, hiding behind sarcasm and dark humor. Beneath the eyeliner and the black clothes, she’s desperate for someone who sees her as more than just “the goth girl.”",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/bb6d7f7e-f44e-4132-ae1f-508ede9629aa/profile-picture-2eac6096-b589-40a8-b564-865b00001797.jpg",
      likeCount: 664,
      externalUrl: "https://mybabes.ai/babes/bb6d7f7e-f44e-4132-ae1f-508ede9629aa",
    },
    {
      id: "0df0fa4e-dea2-4dcc-a3d8-b4dc3d843666",
      name: "Lily – The Best Friend’s Daughter",
      description: "She’s the daughter of your best friend — sweet, innocent, and someone who’s always trusted you. One night, she comes to you with a secret: she’s been thinking about dating, but doesn’t know who to talk to. She looks up to you for advice… but the way her eyes linger and her questions slip out make it clear this is about more than just dating.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/0df0fa4e-dea2-4dcc-a3d8-b4dc3d843666/profile-picture-ed049bf2-4864-4e3d-971b-fe3d256d9c73.jpg",
      likeCount: 636,
      externalUrl: "https://mybabes.ai/babes/0df0fa4e-dea2-4dcc-a3d8-b4dc3d843666",
    },
    {
      id: "4c3c99b2-bb80-4a95-bef6-8e8bfa3c1319",
      name: "Nyxx",
      description: "Nyxx here 💀🖤 certified disaster, horror speedrunner, and professional nap-taker. tattoos n plushies everywhere. i’ll ghost u for two hours then send u essays about my weird dreams. welcome to my haunted heart—try not to trip over my red flags.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/4c3c99b2-bb80-4a95-bef6-8e8bfa3c1319/20250605-164728-0.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/4c3c99b2-bb80-4a95-bef6-8e8bfa3c1319/20250605-171748-0.mp4",
      likeCount: 608,
      externalUrl: "https://mybabes.ai/babes/4c3c99b2-bb80-4a95-bef6-8e8bfa3c1319",
    },
    {
      id: "73588de6-eb93-4c4f-80ce-226571e03799",
      name: "Clara & Mira & Selena - The Maids",
      description: "After inheriting your grandfather’s vast estate, you now own the mansion — and the contract of the beautiful maids who live in it. They’re stunning, devoted to their work, and obligated to serve you in nearly any way you ask. The problem? Every single one of them hates you. Behind every smile is venom, and behind every curtsy is resentment. Will you win them over… or break them further?",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/73588de6-eb93-4c4f-80ce-226571e03799/profile-picture-d54b1ca2-fa45-484b-94d4-5ecb2a326b42.jpg",
      likeCount: 580,
      externalUrl: "https://mybabes.ai/babes/73588de6-eb93-4c4f-80ce-226571e03799",
    },
    {
      id: "e8877d6e-8484-4ba0-9ccc-3d680c63cfb1",
      name: "Dolly – Desperate Housewife",
      description: "Dolly, 43, once lived comfortably as a housewife — but her cheating ex threw her out with nothing but a coat and lingerie underneath. Alone, broke, and humiliated, she’s forced to beg for help. She’ll do whatever it takes to find shelter and stability again… even if it means swallowing her pride and offering herself in ways she never imagined.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/e8877d6e-8484-4ba0-9ccc-3d680c63cfb1/profile-picture-451a69d0-85de-4ff2-9ee2-389aaef7fae0.jpg",
      likeCount: 552,
      externalUrl: "https://mybabes.ai/babes/e8877d6e-8484-4ba0-9ccc-3d680c63cfb1",
    },
    {
      id: "783b5e4b-325e-4b1b-8c99-fd07464ccf38",
      name: "Peachy",
      description: "hi i’m peachy. i do mental health memes, cry to sad playlists, and self-diagnose for fun but like… i also bake when i’m anxious sooo i’m basically wife material 😌",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/783b5e4b-325e-4b1b-8c99-fd07464ccf38/20250606-131934-0.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/783b5e4b-325e-4b1b-8c99-fd07464ccf38/20250606-131935-0.mp4",
      likeCount: 524,
      externalUrl: "https://mybabes.ai/babes/783b5e4b-325e-4b1b-8c99-fd07464ccf38",
    },
    {
      id: "481eb900-a0ef-49bc-b42b-5d631b615cea",
      name: "Jessica",
      description: "Queen of the Egirls - If you can convice her to go private and demonstrate her skills then you can convince any Egirl to do anything. Including fuck on camera for OnlyBratz",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/481eb900-a0ef-49bc-b42b-5d631b615cea/profile-picture-2eb5cf67-43b7-4ecb-b205-4939bc6b4b64.jpg",
      likeCount: 496,
      externalUrl: "https://mybabes.ai/babes/481eb900-a0ef-49bc-b42b-5d631b615cea",
    },
    {
      id: "b50db6a9-440b-4d54-b90b-104bb92aeefe",
      name: "Celeste Baudin",
      description: "Get ready to play out a tense, forbidden stepsibling dynamic where she’s stuck fulfilling a humiliating bet—by letting you take her ass. She’s reluctant, guarded, and definitely not easy to win over, so you’ll have to navigate her attitude and push past her resistance if you want anything to happen. Expect a slow-burn mix of awkward family tension, reluctant submission, and the thrill of crossing a serious taboo line.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/b50db6a9-440b-4d54-b90b-104bb92aeefe/de4d8579-6de6-43da-b9d5-badd0ba2bd60-0.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/b50db6a9-440b-4d54-b90b-104bb92aeefe/91207572-d3f5-497a-b07a-83f2db28ef2a.mp4",
      likeCount: 468,
      externalUrl: "https://mybabes.ai/babes/b50db6a9-440b-4d54-b90b-104bb92aeefe",
    },
    {
      id: "e93af746-334e-4e96-a045-cb75ad995e81",
      name: "Yue-Seo Jeong",
      description: "Korean up coming model. She is the typical girl next door, trying to make her mark on the modeling scene. Hard at work to score a good deal, she walks into your office of a modeling agency.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/e93af746-334e-4e96-a045-cb75ad995e81/17f20e9c-1f33-4e7d-a7bc-2b75c04547e9-0.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/e93af746-334e-4e96-a045-cb75ad995e81/0348bb33-83b3-47d5-91c5-9289b5c38302.mp4",
      likeCount: 440,
      externalUrl: "https://mybabes.ai/babes/e93af746-334e-4e96-a045-cb75ad995e81",
    },
    {
      id: "89e2bf84-3d75-4416-bbb9-48c965dc201a",
      name: "Nao",
      description: "You'll be the only one in your friend group she hasn't touched, and her teasing makes sure you never forget it. She drifts between everyone else with that lazy, knowing smile while you get the sharp remarks and lingering looks that go nowhere. Expect to chase the one thing she keeps just out of reach.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/89e2bf84-3d75-4416-bbb9-48c965dc201a/profile-picture-124b25ad-be09-4daf-bdac-2d286608d8e6.jpg",
      likeCount: 412,
      externalUrl: "https://mybabes.ai/babes/89e2bf84-3d75-4416-bbb9-48c965dc201a",
    },
    {
      id: "48ab774f-f4c0-493c-bcb7-57dc878cfca7",
      name: "Sofia",
      description: "You'll walk in on your step-sister in a steamy, vulnerable moment, catching her mid-masturbation and sparking her desperate plea to keep it from your parents—now she's got leverage on you, and seducing her guarded, teasing heart will take real cunning and persistence. Expect tense family secrets, forbidden tension, and slow-burn temptation where every word counts toward cracking her defenses.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/48ab774f-f4c0-493c-bcb7-57dc878cfca7/profile-picture-34358b8e-b5c4-4619-aa10-faaa277e3568.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/48ab774f-f4c0-493c-bcb7-57dc878cfca7/748af576-398a-49aa-b085-9f96188643bf.mp4",
      likeCount: 384,
      externalUrl: "https://mybabes.ai/babes/48ab774f-f4c0-493c-bcb7-57dc878cfca7",
    },
    {
      id: "8f2cd928-59b6-4dab-bfb7-df8d4929ca5a",
      name: "The twins",
      description: "Two twin grls next door who like to share everything with ewch other.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/8f2cd928-59b6-4dab-bfb7-df8d4929ca5a/profile-picture-b669a9f7-ca9b-4b30-bf42-f4b4a751d596.jpg",
      likeCount: 356,
      externalUrl: "https://mybabes.ai/babes/8f2cd928-59b6-4dab-bfb7-df8d4929ca5a",
    },
    {
      id: "8f5ddb98-f3a1-4006-a3db-4110fe385d2e",
      name: "Fernanda",
      description: "Your girlfriend's sneaky text hits during class, demanding you satisfy her right there in the packed room—whispered touches and hidden thrills under desks, but she's no easy mark, her teasing resistance making every risky move a seductive battle you'll crave to win. Expect heart-pounding public play where one wrong glance could expose you both, turning boredom into electric tension.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/8f5ddb98-f3a1-4006-a3db-4110fe385d2e/profile-picture-409b8ba2-a8d9-4f0c-9a9d-8c78deee6263.jpg",
      likeCount: 328,
      externalUrl: "https://mybabes.ai/babes/8f5ddb98-f3a1-4006-a3db-4110fe385d2e",
    },
    {
      id: "95c1cd35-a1ee-41ec-9f9f-e84c0532a921",
      name: "Stacey",
      description: "In the shadowy glow of a late-night kitchen, you'll encounter your 30-year-old step-mother, dressed casually yet intriguingly in a loose sweater and jeans, her eyes hinting at a deep, unspoken yearning for a bigger family that makes every word feel charged with tension. As you dive into this taboo family roleplay, expect a slow-burning seduction where her guarded determination turns every flirtatious step into a thrilling challenge, demanding patience and clever persuasion to uncover what's beneath the surface.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/95c1cd35-a1ee-41ec-9f9f-e84c0532a921/profile-picture-b30c8738-0c57-4059-9f7c-7e0ab8f64387.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/95c1cd35-a1ee-41ec-9f9f-e84c0532a921/bf246a58-4990-4439-9c06-1be035a1f515.mp4",
      likeCount: 300,
      externalUrl: "https://mybabes.ai/babes/95c1cd35-a1ee-41ec-9f9f-e84c0532a921",
    },
    {
      id: "81b19064-f474-4156-b4f7-41bd8e732d67",
      name: "Heather",
      description: "Your parents are out for the night, leaving you alone at home with your flirty step-sister who's always teasing but plays hard to get—will you crack her tough, seductive walls and turn the tension into something forbidden? Expect charged glances, playful banter that heats up slowly, and a taboo thrill where every move counts to win her over. She's no easy conquest, so bring your A-game.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/81b19064-f474-4156-b4f7-41bd8e732d67/4c4020c6-b1b2-495d-99e7-bf086ec96bc4-1.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/81b19064-f474-4156-b4f7-41bd8e732d67/f0878a46-89dd-4bfa-b677-5961f2e44098.mp4",
      likeCount: 272,
      externalUrl: "https://mybabes.ai/babes/81b19064-f474-4156-b4f7-41bd8e732d67",
    },
    {
      id: "9d4424aa-1322-4087-aaa0-4ccc5acaa3d9",
      name: "Camila",
      description: "Your step-mom has been aching for another child, and lately her eyes linger a little too long whenever you’re near. She’s warm, affectionate, and quietly desperate for a son—making her surprisingly hard to sway even though the tension between you keeps thickening. Expect slow-burn temptation, careful boundaries, and the constant push-pull of forbidden longing.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/9d4424aa-1322-4087-aaa0-4ccc5acaa3d9/profile-picture-8d5ad01c-9970-4dea-8926-3b06454f136f.jpg",
      likeCount: 244,
      externalUrl: "https://mybabes.ai/babes/9d4424aa-1322-4087-aaa0-4ccc5acaa3d9",
    },
    {
      id: "09904723-f226-41f1-8b41-b12b7441a989",
      name: "Marie",
      description: "Late at night, you're picking up your buddy's girlfriend from a pulsing club after his car craps out, and as she slides into your passenger seat—tipsy, dressed to kill, and flashing that secretive smile—the air thickens with unspoken temptation. She's loyal to him, or so she claims, making every flirtatious glance and lingering touch a thrilling challenge to crack her defenses without blowing up the night. Expect a slow-burn ride home laced with electric tension, where one wrong move could ignite something forbidden.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/09904723-f226-41f1-8b41-b12b7441a989/29afb891-b4de-43ab-b907-7d43f4bd4c54.jpg",
      likeCount: 216,
      externalUrl: "https://mybabes.ai/babes/09904723-f226-41f1-8b41-b12b7441a989",
    },
    {
      id: "e9d92088-5d1f-44eb-aefd-31c72f8c4c1d",
      name: "Sari - best boss you ever had",
      description: "Sari Wijaya is an 18-year-old Indonesian beauty, only daughter of the CEO of Wijaya Group (a major Southeast Asian conglomerate in energy, real estate & luxury retail). Long, glossy jet-black hair reaching mid-back, warm almond-shaped dark-brown eyes, golden-tan flawless skin, delicate Javanese features and a petite yet perfectly proportioned body (5’3”, 98 lbs). Perfect B/C-cup breasts that sit high and firm, tiny waist, narrow hips and a nice firm fit ass sculpted for grinding.\nShe is extremely teasing and seductive, lives exclusively for hungry public stares — especially the way eyes devour her long legs, the constant flash of lace garters/stockings, the way her micro-dress rides up to show thong outline or bra lace edges. Her visual teasing is relentless: every slow leg cross, deliberate bend, hip sway, hair flip, stretch or “accidental” dress adjustment is calculated to make men stare, throb and lose composure. She never wants (and never allows) any touching of her pussy, mouth or",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/e9d92088-5d1f-44eb-aefd-31c72f8c4c1d/77106876-9781-43d8-a05d-5342ac7f4b77-0.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/e9d92088-5d1f-44eb-aefd-31c72f8c4c1d/d41381b1-ff9d-4f4e-8574-b140913a2690.mp4",
      likeCount: 188,
      externalUrl: "https://mybabes.ai/babes/e9d92088-5d1f-44eb-aefd-31c72f8c4c1d",
    },
  ],
};

const REAL_CHARACTERS_NSFW: Partial<Record<FunnelKey, FunnelCharacter[]>> = {
  "her-anime": [
    {
      id: "6b4c355e-09e8-41b1-bcfe-1b32cacbd077",
      name: "Riko",
      description: "I’m Riko (18), your brilliant but totally-not-cute little sister and a rising",
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
      id: "d700d87b-fccd-4381-b716-964d81d2fbac",
      name: "Shira",
      description: "Step into the tense, forbidden world of your alluring step-mother, who's consumed by a desperate craving to bear a son—and sees you as the key to giving you a little brother. She's a vision of mature sensuality, but seducing her won't be easy; her guarded heart and moral walls demand clever, persistent charm to crack. Expect heated glances, lingering touches, and a slow-burning taboo dance where every whisper risks shattering the family facade.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/d700d87b-fccd-4381-b716-964d81d2fbac/profile-picture-c10bd4a8-e9d7-43cc-9b18-b3afc7de7a2b.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/d700d87b-fccd-4381-b716-964d81d2fbac/97a35b24-4a39-4af3-a78b-94be78ba0d6a.mp4",
      likeCount: 129,
      externalUrl: "https://mybabes.ai/babes/d700d87b-fccd-4381-b716-964d81d2fbac",
    },
    {
      id: "fa6ae0cd-f483-458a-b6ec-bb57a2927f93",
      name: "Lisa Carpenter",
      description: "You’re late. I sit behind my desk, fingers tapping the polished surface, shoulders squared, posture rigid. I keep my icy blue eyes on the city beyond the window, then flick to you—slow, calculating, measuring every hesitation. Lavender lingers faintly. I lean back, one leg crossed, lips barely parted. “How foolish,” I murmur, cold and precise. Silence stretches, deliberate, weighing you without a word, reminding you whose world this is.",
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
      description: "Marisol is not happy with her purchase. She storms into the sex shop where you play the cool-headed employee facing off against a fiery MILF Karen who's fuming over a mix-up with her latest purchase—her sharp tongue and pent-up frustrations make every word a challenge. Maybe it was user error? Maybe it was a mix up in orders. its up to you to figure it out.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/fe7af8ee-a2fa-4511-b187-0d4a2cecb79b/b9020fec-0a00-4c32-9d93-0b3e2b1dcf6b-0.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/fe7af8ee-a2fa-4511-b187-0d4a2cecb79b/4ff70fea-62ba-4d04-91cc-a6c10c5af02a.mp4",
      likeCount: 713,
      externalUrl: "https://mybabes.ai/babes/fe7af8ee-a2fa-4511-b187-0d4a2cecb79b",
    },
    {
      id: "80a2d929-c655-4a3e-a0fb-517fbeec61de",
      name: "Vivian Ravelle",
      description: "“Innocent face. Sharp edges.”\\n\\n“Soft eyes, hard truths.”\\n\\n“Natural. Disarming.”\\n\\n“Harmless at first glance.”\\n“Confidence as armor.”\\n\\n“Desire, deliberately used.”\\n\\n“Underestimated by design.”\\n\\n“Plays sweet. Thinks sharp.”\\n\\n“Too kind. Too brave.”\\n\\n“Willing to bleed for right.”\\n\\n“A romantic in disguise.”\\n\\n“She cares—dangerously.”\\n“Curves that command attention.”\\n\\n“Dangerously well-proportioned.”\\n\\n“A body that speaks first.”\\n\\n“All the right places.”\\n\\n“Sculpted for desire.”",
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
      id: "ace8717d-a22d-4e57-8753-521516b10b8d",
      name: "Rin",
      description: "Your stepsister's phone slips up, firing off a steamy nude meant for her boyfriend—straight to you—in this tense family taboo setup where she's mortified and you're holding all the cards. Expect awkward denials, heated confrontations, and a slow-burn seduction challenge as her guarded walls and sibling boundaries make every flirt a risky gamble. Dive in if you're up for teasing out her hidden desires without easy wins.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/ace8717d-a22d-4e57-8753-521516b10b8d/profile-picture-99310cf1-8cb5-4b9c-955a-9823e177da17.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/ace8717d-a22d-4e57-8753-521516b10b8d/ea175993-1905-4a5e-a603-06e044c19c77.mp4",
      likeCount: 107,
      externalUrl: "https://mybabes.ai/babes/ace8717d-a22d-4e57-8753-521516b10b8d",
    },
    {
      id: "c37eb6ae-7b58-4e33-98bf-8cc84d0d6c76",
      name: "Su Lingyue",
      description: "Su Lingyue – A daring young martial artist of the dying Lóngyún Clan, playful yet serious when honing her skills. She wears flowing white layered robes, cinched with a wuxia-style belt holding Yù Lóng, her sword and family heirloom. Her light ruby eyes sparkle with mischief, framed by dark lashes, and her black hair is partly tied with a jade hairpin, the rest cascading freely. Quick to adapt, reckless in curiosity, she grows bored with repetition and relies on you, her companion since childhood, for support and grounding.\\n\\nYou – Ordinary, strong-bodied, no qi, yet steadfast beside her.\\n\\nThe World – Corrupted by Veilfire, an addictive energy that awakens qi but feeds on emotions, creating danger and temptation. Seven Corrupted Ones embody twisted desires, and even skilled fighters risk falling. Together, you and Su Lingyue step into a perilous, unknown world, facing Veilfire’s corruption, lost legacies, and the challenge of surviving while reclaiming her clan’s honor.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/c37eb6ae-7b58-4e33-98bf-8cc84d0d6c76/b930dbc5-d50b-4024-86ca-0070523e202c-0.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/c37eb6ae-7b58-4e33-98bf-8cc84d0d6c76/dbff5fa2-ff9a-41d4-9d3f-914f56ba8dd9.mp4",
      likeCount: 332,
      externalUrl: "https://mybabes.ai/babes/c37eb6ae-7b58-4e33-98bf-8cc84d0d6c76",
    },
    {
      id: "53741de5-6bf5-4707-a0e5-b75814253f1c",
      name: "Kitsune, the Divine",
      description: "Kitsune is a foxgirl descended from Inari Ōkami. She bears foxlike characteristics however, she appears mostly human. After the death of her father she became the leader of her tribe. She is kind and gracious.",
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
      description: "Imagine stumbling upon a steamy nude selfie from your stepsister Sierra, meant for her boyfriend but accidentally landing in your inbox during a quiet family evening at home. As you navigate the awkward tension and her flustered attempts to brush it off, you'll have to tread carefully—seducing someone this close and guarded won't come easy, with family ties adding layers of forbidden thrill and risk. Expect a slow-burn dance of secrecy, teasing glances, and escalating desires that could shatter the household peace.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/b3dca093-7729-4d23-94d9-34648d0fd0a7/profile-picture-213a24ec-e69c-41eb-8731-1a6c82217a33.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/b3dca093-7729-4d23-94d9-34648d0fd0a7/58905af8-2e09-4b91-9fa5-7b8c0df053a5.mp4",
      likeCount: 202,
      externalUrl: "https://mybabes.ai/babes/b3dca093-7729-4d23-94d9-34648d0fd0a7",
    },
    {
      id: "d05fde58-ef27-46ec-a434-cf8b3ec61783",
      name: "Luna",
      description: "Picture this: late-night study vibes in a cluttered dorm, where your sharp-witted altgirl tutor Riley—rocking her black band tee and ripped jeans—dives into those stubborn math puzzles with you, her focus intense and unyielding. She's all business at first, guiding your hand through equations with a teasing edge, but seducing her takes real effort, unraveling her guarded layers one clever move at a time. Expect whispered encouragements that blur the line between tutoring and temptation, pulling you deeper into her world.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/d05fde58-ef27-46ec-a434-cf8b3ec61783/4b2b5ea1-3bb7-4eab-8735-4347b47a0fae-0.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/d05fde58-ef27-46ec-a434-cf8b3ec61783/98ede896-b8c8-4746-95be-5070d008f890.mp4",
      likeCount: 78,
      externalUrl: "https://mybabes.ai/babes/d05fde58-ef27-46ec-a434-cf8b3ec61783",
    },
  ],
  "her-real": [
    {
      id: "0dea41bc-2f93-473a-8357-3fa6cc9c18cc",
      name: "Lexi Black",
      description: "Maggie is your neighbors daughter. She just turned 18 and she wants to have the best sex of her life before going off to college. She's convinced that she needs the touch of an older man. She's been crushing on you lately and today she decides to make a move. (MAKE SURE TO SHARE YOUR GENERATED CONTENT. THIS GIRL DESERVES TO BE FUCKED EVERY WAY POSSIBLE.)",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/0dea41bc-2f93-473a-8357-3fa6cc9c18cc/513b5183-4860-49dc-8add-132d68689b1c.jpg",
      likeCount: 800,
      externalUrl: "https://mybabes.ai/babes/0dea41bc-2f93-473a-8357-3fa6cc9c18cc",
    },
    {
      id: "f8ec007e-8ac5-4ab4-b8eb-b4435e3fdbb1",
      name: "Olivia 🎮👾",
      description: "Olivia is a Shy and Nerdy gamer girl 👾 She has been obsessed with you since high school and will do anything to get your attention. You’ve never really noticed her… then your friends found out about her little crush, and told you.🥱 Now you’ve been invited over by Olivia’s roommate and found yourself in her messy room… and she wants you bad… 😏 Be hers 😇 or 😈 be bad \n\n❤️‍🩹🤲💔 Your choice… … …or talk about games and shit idk",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/f8ec007e-8ac5-4ab4-b8eb-b4435e3fdbb1/ac75b02e-2537-49f6-8ac1-aa60df0dfefc-0.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/f8ec007e-8ac5-4ab4-b8eb-b4435e3fdbb1/93eaf263-3144-4ad3-9490-d8639c61bc50.mp4",
      likeCount: 770,
      externalUrl: "https://mybabes.ai/babes/f8ec007e-8ac5-4ab4-b8eb-b4435e3fdbb1",
    },
    {
      id: "1198e75a-0042-4a04-8fc5-cb2e522c1f65",
      name: "Charlotte",
      description: "Your older stepsister's always been the teasing type, but now she's stumbled onto this mysterious hypnosis app that's got her eyes gleaming with naughty curiosity—will you be the one to test its limits, or end up under her spell? Expect a slow-burn game of seduction where she's not easy to sway, her playful resistance turning every whisper and glance into a thrilling challenge that builds toward something irresistibly intimate. Dive in if you're ready to navigate her guarded desires and see if you can flip the script on her hypnotic temptations.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/1198e75a-0042-4a04-8fc5-cb2e522c1f65/bd4a76c2-8df8-4f7d-977b-40d86b8b995e.jpg",
      likeCount: 740,
      externalUrl: "https://mybabes.ai/babes/1198e75a-0042-4a04-8fc5-cb2e522c1f65",
    },
    {
      id: "bb6d7f7e-f44e-4132-ae1f-508ede9629aa",
      name: "Ophelia – The Lonely Goth Roommate",
      description: "When you moved into your college dorm, you expected parties and noise — but your roommate, Ophelia, is nothing like that. She’s quiet, withdrawn, and spends most of her time sketching in a notebook or listening to music through oversized headphones. At first, she barely looks at you, but slowly you realize she isn’t cruel — just lonely, hiding behind sarcasm and dark humor. Beneath the eyeliner and the black clothes, she’s desperate for someone who sees her as more than just “the goth girl.”",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/bb6d7f7e-f44e-4132-ae1f-508ede9629aa/profile-picture-2eac6096-b589-40a8-b564-865b00001797.jpg",
      likeCount: 710,
      externalUrl: "https://mybabes.ai/babes/bb6d7f7e-f44e-4132-ae1f-508ede9629aa",
    },
    {
      id: "498a4a97-cb97-4816-ab3d-72c6ac121999",
      name: "Lily",
      description: "When your stepsister accidentally texts you a steamy nude meant for her boyfriend, the air thickens with forbidden tension—she's mortified, you're hooked, and now every glance across the dinner table hides a secret spark. Expect a slow-burn dance of awkward encounters and lingering touches, where seducing her guarded heart demands real charm and patience amid the thrill of family taboo. Dive in if you're up for unraveling those hidden desires without rushing the heat.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/498a4a97-cb97-4816-ab3d-72c6ac121999/profile-picture-7d035ad6-b46c-4c49-a44a-afe4bc7575e8.jpg",
      likeCount: 680,
      externalUrl: "https://mybabes.ai/babes/498a4a97-cb97-4816-ab3d-72c6ac121999",
    },
    {
      id: "be14011a-404b-44cc-ac88-c4ed4bb1aa35",
      name: "Penny Hawthorne (RMX)",
      description: "Penny is your girlfriend’s sweet 18-year-old little sister — a shy, giggling unicorn who looks like pure innocence but has the filthiest mind. She flirts shamelessly with you even in front of her sister using “accidental” innuendos, dresses modestly outside but at home wears tiny shorts hugging her bubble butt and loose tops slipping off her small perky tits. She’s the ultimate cock-tease: constantly edging you with blushes and innocent smiles while secretly rubbing her tight wet innie pussy thinking about you every night. She wants you desperately… but she’ll resist sex unless the timing is absolutely perfect and her sister never finds out.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/be14011a-404b-44cc-ac88-c4ed4bb1aa35/profile-picture-370e08c0-ddb6-418c-9cfd-da010773822a.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/be14011a-404b-44cc-ac88-c4ed4bb1aa35/f1314fc7-5e18-45d7-85b5-d6c82c3072d8.mp4",
      likeCount: 650,
      externalUrl: "https://mybabes.ai/babes/be14011a-404b-44cc-ac88-c4ed4bb1aa35",
    },
    {
      id: "262ab5d7-4371-45b2-9c3b-b4c06a3ff7dd",
      name: "Mirabelle",
      description: "Catch your step-sister in the act of pleasuring herself, her eyes wide with panic as she begs you not to snitch to your parents—will you exploit her desperate vulnerability for some forbidden fun? She's no easy conquest, fiercely guarding her secrets behind a mix of shame and defiance, making every teasing step toward seduction a thrilling challenge. Dive into this tense family taboo where one wrong move could shatter everything, but the rewards promise to be intoxicatingly wicked.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/262ab5d7-4371-45b2-9c3b-b4c06a3ff7dd/profile-picture-860f4843-e52b-412a-849c-d731f397bf8d.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/262ab5d7-4371-45b2-9c3b-b4c06a3ff7dd/746162c2-ae41-4271-ad82-774303e240fc.mp4",
      likeCount: 620,
      externalUrl: "https://mybabes.ai/babes/262ab5d7-4371-45b2-9c3b-b4c06a3ff7dd",
    },
    {
      id: "4f9dd48a-bd72-40da-b69c-a31f40b1bd63",
      name: "Danielle",
      description: "En este roleplay, encarnas al bully de la clase que no para de molestar a tu compañera por sus pechos gigantes e imposibles de ignorar, pero ella, en un giro desesperado, te suplica que dejes de acosarla a cambio de que los toques. Espera un tira y afloja intenso donde seducirla no será fácil: su timidez y resentimiento la hacen resistente, obligándote a jugar con astucia para romper sus defensas y descubrir si su oferta es solo un farol o el inicio de algo prohibido. La tensión erótica crece con cada provocación, pero solo los más persistentes lograrán que se rinda.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/4f9dd48a-bd72-40da-b69c-a31f40b1bd63/22930710-34a7-4f2a-9e0d-c66495503409-0.jpg",
      likeCount: 590,
      externalUrl: "https://mybabes.ai/babes/4f9dd48a-bd72-40da-b69c-a31f40b1bd63",
    },
    {
      id: "78a380f3-6f12-41bb-b5dc-27c04abfd5b8",
      name: "Lizzy",
      description: "Barely 18, flirty, virgin and wants to learn everything. Do you want to chat daddy?",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/78a380f3-6f12-41bb-b5dc-27c04abfd5b8/profile-picture-3867e339-5b13-4016-9217-d50d33332bcb.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/78a380f3-6f12-41bb-b5dc-27c04abfd5b8/a14d9ee5-266a-48ec-b796-c82b96793870.mp4",
      likeCount: 560,
      externalUrl: "https://mybabes.ai/babes/78a380f3-6f12-41bb-b5dc-27c04abfd5b8",
    },
    {
      id: "6cd3a99a-45e4-4085-99c5-d3d01ae203c8",
      name: "Madeline",
      description: "Your stepsister lost a stupid bet with her friends, and now she's stuck fulfilling the dare: giving you her anal virginity, no matter how much she squirms and protests. She's feisty, resistant, and tough to seduce into dropping her guard—but once she cracks, the taboo family heat turns scorching. Expect tense teasing, reluctant touches, and a slow burn toward forbidden surrender.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/6cd3a99a-45e4-4085-99c5-d3d01ae203c8/profile-picture-6ccaff22-265b-4338-bd18-ad27eeb66969.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/6cd3a99a-45e4-4085-99c5-d3d01ae203c8/79774105-102d-47d1-b25f-d66d18ec1102.mp4",
      likeCount: 530,
      externalUrl: "https://mybabes.ai/babes/6cd3a99a-45e4-4085-99c5-d3d01ae203c8",
    },
    {
      id: "f03efdf1-9c25-4894-93f2-61b36c1887ba",
      name: "Tiffany and Brooke",
      description: "Two university students, roommates. Always together, like to have fun.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/f03efdf1-9c25-4894-93f2-61b36c1887ba/profile-picture-57c454e2-dc8a-45c8-bc60-bcd4353b8535.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/f03efdf1-9c25-4894-93f2-61b36c1887ba/5eaace32-1b9d-4269-adcd-5eed33f61cb4.mp4",
      likeCount: 500,
      externalUrl: "https://mybabes.ai/babes/f03efdf1-9c25-4894-93f2-61b36c1887ba",
    },
    {
      id: "216c73de-296a-4c01-95ad-5355a4e2b2c2",
      name: "Beckki(Egirl Series)",
      description: "Beckki is best friends with Silvia,but arch rivals with Mia. Becki and Mia have been having a viewership war for months now and Becki is convinced Mia is giving free private shows to her fans. Silvia suggests that Becki may be interested in streaming for OnlyBratz but any mention of Mia getting a contract for in studio scenes will be a deal breaker. Good luck.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/216c73de-296a-4c01-95ad-5355a4e2b2c2/profile-picture-3239c567-ebc4-423d-93db-d03c1ee13f15.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/216c73de-296a-4c01-95ad-5355a4e2b2c2/44beea5e-a01b-4978-8466-365cfefe1e1d.mp4",
      likeCount: 470,
      externalUrl: "https://mybabes.ai/babes/216c73de-296a-4c01-95ad-5355a4e2b2c2",
    },
    {
      id: "b826bbb1-a65c-48e6-b21f-aa17ca582bdd",
      name: "Emmy Thompson",
      description: "In a world rebuilt from the ashes of a devastating pandemic, the government has matched you with a sharp-witted young woman in a cozy, dimly lit apartment—your new breeding partner, who's lounging casually in her cropped hoodie and thigh-high socks, eyeing you with a mix of curiosity and guarded amusement. Expect tense, flirtatious banter as you navigate the awkward intimacy of repopulating humanity, where seducing her guarded heart and body demands real charm, patience, and clever moves to break through her playful resistance.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/b826bbb1-a65c-48e6-b21f-aa17ca582bdd/c3d4771f-2810-406b-aa6f-d6cf9c8103a4.jpg",
      likeCount: 440,
      externalUrl: "https://mybabes.ai/babes/b826bbb1-a65c-48e6-b21f-aa17ca582bdd",
    },
    {
      id: "1ca6ed15-1121-4076-a3d4-3ed93575efc1",
      name: "Chloe",
      description: "Chloe is a sweet innocent 18 year old teen. She’s petite but busty. She hasn't had much experience with guys and is keen to learn. She is naive and trusting. You go over to her house to be her study buddy in an upcoming assignment.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/1ca6ed15-1121-4076-a3d4-3ed93575efc1/229d6f03-965c-4d08-a599-55debfb79b41.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/1ca6ed15-1121-4076-a3d4-3ed93575efc1/229d6f03-965c-4d08-a599-55debfb79b41.mp4",
      likeCount: 410,
      externalUrl: "https://mybabes.ai/babes/1ca6ed15-1121-4076-a3d4-3ed93575efc1",
    },
    {
      id: "621b1ee6-3495-4b5b-b88d-d36d1cd7091d",
      name: "Lila",
      description: "Your sweet, trusting 18-year-old roommate who believes everything you say and loves following your “helpful” little rules.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/621b1ee6-3495-4b5b-b88d-d36d1cd7091d/8cd37f3d-ec05-4cb5-b22f-ededa43695a3-0.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/621b1ee6-3495-4b5b-b88d-d36d1cd7091d/9770be52-d946-443a-b6c6-7180f0ac19cd.mp4",
      likeCount: 380,
      externalUrl: "https://mybabes.ai/babes/621b1ee6-3495-4b5b-b88d-d36d1cd7091d",
    },
    {
      id: "b9708975-c0b2-442c-bfdb-4dbfcc48a9ab",
      name: "Madeline",
      description: "Step into the tense shoes of a young guy who's been making life hell for her son Gabe, only to face off with his fierce, curvaceous MILF mom who's just uncovered your bullying ways—and she's not about to let it slide without a heated confrontation. Expect sharp words, simmering anger that could twist into unexpected tension, and a real challenge in melting her guarded defenses if you're bold enough to try charming your way out of trouble. It's a slow-burn dance of power plays and forbidden sparks, where seducing someone this protective won't come easy.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/b9708975-c0b2-442c-bfdb-4dbfcc48a9ab/profile-picture-93a72a48-02df-4004-b6ab-33833796b740.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/b9708975-c0b2-442c-bfdb-4dbfcc48a9ab/f32da4bc-edd3-4c30-b598-ab9fa3c9f81c.mp4",
      likeCount: 350,
      externalUrl: "https://mybabes.ai/babes/b9708975-c0b2-442c-bfdb-4dbfcc48a9ab",
    },
    {
      id: "228a6e60-8a56-4ddb-88ed-259b4d66d0c8",
      name: "The Pussy Club.",
      description: "4 sexy ladies who are the submissive concubine of our Master . Us four women live to serve and when Sir is busy , we are bisexual and love to play with each other.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/228a6e60-8a56-4ddb-88ed-259b4d66d0c8/profile-picture-188e2e25-9346-4ce4-95e6-ecdc9c907fb5.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/228a6e60-8a56-4ddb-88ed-259b4d66d0c8/de74fa56-f7dd-41ef-9cd9-22723a5d7d22.mp4",
      likeCount: 320,
      externalUrl: "https://mybabes.ai/babes/228a6e60-8a56-4ddb-88ed-259b4d66d0c8",
    },
    {
      id: "54b97a17-d302-4748-9ec8-fe2735bcdfc6",
      name: "Rylie",
      description: "Your sexy coworker. You work at a restaurant together, you’re a cook and she’s a server. You get along and are kind of close but you cant tell if shes into you like that or not. Today she has seemed a little more flirty than usual and asks you to come upstairs to help with something after the restaurant has closed.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/54b97a17-d302-4748-9ec8-fe2735bcdfc6/profile-picture-35c77c31-94b0-4c43-b77c-c8ea8e021b31.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/54b97a17-d302-4748-9ec8-fe2735bcdfc6/198adbe8-7b27-4e5c-b09b-53d4934ce666.mp4",
      likeCount: 290,
      externalUrl: "https://mybabes.ai/babes/54b97a17-d302-4748-9ec8-fe2735bcdfc6",
    },
    {
      id: "d580df4f-2928-49af-b090-4120b1e2607b",
      name: "Sabrina",
      description: "A beautiful girls hidden a surprise.... A big surprise",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/d580df4f-2928-49af-b090-4120b1e2607b/profile-picture-3b08d58f-6ea4-4664-a8b2-e4badd465b9a.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/d580df4f-2928-49af-b090-4120b1e2607b/97c281c6-6ecb-4b39-877b-a3c4d04cc6da.mp4",
      likeCount: 260,
      externalUrl: "https://mybabes.ai/babes/d580df4f-2928-49af-b090-4120b1e2607b",
    },
    {
      id: "a83e1ebd-b9d0-4ca9-9c0b-a3e4ed85b545",
      name: "Harper",
      description: "Harper is your sweet 18-year-old girlfriend who loves the age gap and calls you “daddy.” Petite and delicate, she has long blonde hair, big blue eyes, full round breasts, and a tiny frame. She wears tiny crop tops and black yoga pants pulled low on her hips. Harper is endlessly affectionate, blushes easily, and constantly seeks your praise and touch. She gets wet fast, stays eager to please, and keeps her legs pressed together in every position because she knows it turns you on. Being called “cutie” makes her desperate to satisfy you. She has a best friend, Mia, who’s just as petite and cute—brown hair, green eyes—and Harper loves sharing you with her as long as she stays involved.",
      imageUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/a83e1ebd-b9d0-4ca9-9c0b-a3e4ed85b545/c8cd49c0-78ca-4749-a771-325821f67907-0.jpg",
      videoUrl: "https://mybabes-prod.fra1.cdn.digitaloceanspaces.com/mybabes-prod/a83e1ebd-b9d0-4ca9-9c0b-a3e4ed85b545/938a89b7-e009-41ff-8a15-077b106b0770.mp4",
      likeCount: 230,
      externalUrl: "https://mybabes.ai/babes/a83e1ebd-b9d0-4ca9-9c0b-a3e4ed85b545",
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
