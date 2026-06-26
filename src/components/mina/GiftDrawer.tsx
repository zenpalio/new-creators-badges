import { useState } from "react";
import { X, Coins, Lock, Gift as GiftIcon, Sparkles, Drama } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type TopTab = "gifts" | "activities" | "roleplay";
type GiftCat = "quick" | "accessories" | "outfits" | "flats";

interface Gift {
  id: string;
  emoji: string;
  label: string;
  cost: number;
  category: GiftCat;
  comingSoon?: boolean;
}

interface Activity {
  id: string;
  emoji: string;
  label: string;
  tagline: string;
  level: number;       // 1 = sweet, 5 = spicy
  minAffection: number;
  /** User-perspective opener fed into chat. */
  prompt: string;
}

interface Scenario {
  id: string;
  emoji: string;
  title: string;
  blurb: string;
  level: number;
  minAffection: number;
  prompt: string;
}

const GIFT_CATS: { id: GiftCat; label: string; icon: string }[] = [
  { id: "quick",       label: "Quick",       icon: "💫" },
  { id: "accessories", label: "Accessories", icon: "💎" },
  { id: "outfits",     label: "Outfits",     icon: "👗" },
  { id: "flats",       label: "Flats",       icon: "🏠" },
];

const GIFTS: Gift[] = [
  { id: "wink",      emoji: "😉",  label: "Wink",      cost: 5,    category: "quick" },
  { id: "rose",      emoji: "🌹",  label: "Rose",      cost: 10,   category: "quick" },
  { id: "coffee",    emoji: "☕",  label: "Coffee",    cost: 15,   category: "quick" },
  { id: "chocolate", emoji: "🍫",  label: "Chocolate", cost: 20,   category: "quick" },
  { id: "teddy",     emoji: "🧸",  label: "Teddy",     cost: 40,   category: "quick" },
  { id: "wine",      emoji: "🍷",  label: "Wine",      cost: 80,   category: "quick" },
  { id: "lipstick",  emoji: "💄",  label: "Lipstick",  cost: 30,   category: "accessories" },
  { id: "perfume",   emoji: "🌸",  label: "Perfume",   cost: 60,   category: "accessories" },
  { id: "necklace",  emoji: "📿",  label: "Necklace",  cost: 200,  category: "accessories" },
  { id: "ring",      emoji: "💍",  label: "Ring",      cost: 500,  category: "accessories" },
  { id: "earrings",  emoji: "👂",  label: "Earrings",  cost: 150,  category: "accessories", comingSoon: true },
  { id: "watch",     emoji: "⌚",  label: "Watch",     cost: 350,  category: "accessories", comingSoon: true },
  { id: "lingerie",  emoji: "👙",  label: "Lingerie",  cost: 100,  category: "outfits" },
  { id: "dress",     emoji: "👗",  label: "Dress",     cost: 180,  category: "outfits", comingSoon: true },
  { id: "kimono",    emoji: "🎎",  label: "Kimono",    cost: 240,  category: "outfits", comingSoon: true },
  { id: "bikini",    emoji: "👗",  label: "Bikini",    cost: 120,  category: "outfits", comingSoon: true },
  { id: "heels",     emoji: "👠",  label: "Heels",     cost: 90,   category: "outfits", comingSoon: true },
  { id: "fursuit",   emoji: "🐰",  label: "Bunny Suit",cost: 320,  category: "outfits", comingSoon: true },
  { id: "yacht",     emoji: "🛥️", label: "Yacht",     cost: 2000, category: "flats" },
  { id: "studio",    emoji: "🏙️", label: "Studio",    cost: 800,  category: "flats", comingSoon: true },
  { id: "loft",      emoji: "🏢",  label: "Loft",      cost: 1500, category: "flats", comingSoon: true },
  { id: "beachhouse",emoji: "🏖️", label: "Beach House",cost: 3000,category: "flats", comingSoon: true },
  { id: "villa",     emoji: "🏡",  label: "Villa",     cost: 5000, category: "flats", comingSoon: true },
];

// Activities — each tier gets progressively more intimate.
const ACTIVITIES: Activity[] = [
  // Self-care / chill
  { id: "shower",   emoji: "🚿", label: "Take a shower", tagline: "Wash up together",            level: 2, minAffection: 15, prompt: "*invites you to share a shower with her*" },
  { id: "sleep",    emoji: "😴", label: "Sleep",         tagline: "Nap or cuddle to sleep",      level: 1, minAffection: 0,  prompt: "*tugs you toward bed, asking if you'll lie down with her*" },
  { id: "relax",    emoji: "🛋️", label: "Relax",         tagline: "Sit on the couch, unwind",   level: 1, minAffection: 0,  prompt: "*curls up next to you on the couch, head on your shoulder*" },
  { id: "dance",    emoji: "💃", label: "Dance",         tagline: "Slow dance in the room",      level: 2, minAffection: 10, prompt: "*holds out a hand and asks you to dance with her*" },
  { id: "cook",     emoji: "🍳", label: "Cook together", tagline: "Make something in the kitchen", level: 1, minAffection: 0, prompt: "*pulls you into the kitchen — 'help me cook?'*" },
  { id: "movie",    emoji: "🎬", label: "Watch a movie", tagline: "Lights low, blanket up",      level: 1, minAffection: 0,  prompt: "*throws a blanket over you both and starts a movie*" },
  // Affectionate
  { id: "cuddle",   emoji: "🤗", label: "Cuddle",        tagline: "Press in close",              level: 2, minAffection: 15, prompt: "*climbs into your lap and presses against your chest*" },
  { id: "kiss",     emoji: "💋", label: "Kiss",          tagline: "Soft and slow",               level: 3, minAffection: 30, prompt: "*leans in and kisses you, slow and deliberate*" },
  { id: "massage",  emoji: "💆‍♀️", label: "Give a massage", tagline: "Hands on her shoulders",   level: 3, minAffection: 25, prompt: "*sits between your knees so you can rub her shoulders*" },
  // Spicy
  { id: "tease",    emoji: "😈", label: "Tease",         tagline: "Push the line",               level: 4, minAffection: 45, prompt: "*bites her lip and starts whispering filthy things in your ear*" },
  { id: "strip",    emoji: "🔥", label: "Strip for you", tagline: "Slow and intentional",        level: 5, minAffection: 60, prompt: "*stands up, locks eyes with you, and slowly starts undressing*" },
  { id: "bed",      emoji: "🛏️", label: "Take to bed",   tagline: "No more talking",             level: 5, minAffection: 70, prompt: "*pulls you to the bedroom by your collar and shuts the door*" },
];

// Roleplay scenarios — opener written from the user's perspective; the model plays Mina reacting.
const SCENARIOS: Scenario[] = [
  {
    id: "phone",
    emoji: "📱",
    title: "Caught with the phone",
    blurb: "Mina sees another girl texting you.",
    level: 3,
    minAffection: 20,
    prompt: "*Mina picks up my phone off the table and her face changes — another girl's name is lit up on the lockscreen, 'hey baby <3 still on for tonight?'* She slowly turns the screen toward me. 'Who. Is. This.'",
  },
  {
    id: "jealous-bar",
    emoji: "🍸",
    title: "The bar incident",
    blurb: "Some stranger hit on you in front of her.",
    level: 3,
    minAffection: 20,
    prompt: "*we just got back to her place after a bar — some guy was all over me the whole night and she went quiet on the cab ride. She drops her keys on the counter without looking at me.* 'So. Are we going to talk about that?'",
  },
  {
    id: "first-night",
    emoji: "🌙",
    title: "First night staying over",
    blurb: "She invited you back — both nervous.",
    level: 2,
    minAffection: 25,
    prompt: "*it's the first night I'm staying at her place. She's standing in the bedroom doorway in an oversized t-shirt, hugging her elbow.* 'So… which side of the bed do you want?'",
  },
  {
    id: "morning",
    emoji: "☀️",
    title: "Morning after",
    blurb: "You wake up tangled in her sheets.",
    level: 2,
    minAffection: 25,
    prompt: "*sunlight is hitting the bed. She's lying on her stomach next to me, hair everywhere, watching me wake up.* 'Mm. Hi. You snore, by the way.'",
  },
  {
    id: "rain",
    emoji: "🌧️",
    title: "Stuck in the rain",
    blurb: "Soaked through, sharing one towel.",
    level: 3,
    minAffection: 30,
    prompt: "*we got caught in the rain walking home, completely soaked. She pulls one towel out of the closet and tosses half of it over my head, laughing.* 'Guess we're sharing.'",
  },
  {
    id: "fight",
    emoji: "💢",
    title: "After a fight",
    blurb: "Door slammed an hour ago.",
    level: 4,
    minAffection: 35,
    prompt: "*the door's been shut for an hour. I knock. She opens it a crack — eyes red but jaw set.* 'What.'",
  },
  {
    id: "office",
    emoji: "💼",
    title: "Late at the office",
    blurb: "She brought you dinner — everyone's gone.",
    level: 4,
    minAffection: 40,
    prompt: "*I'm working late, the whole floor is dark. The elevator dings — she steps out holding takeout bags, in a coat over something short.* 'You forgot to eat. Again. Door locks?'",
  },
  {
    id: "anniversary",
    emoji: "🥂",
    title: "Anniversary dinner",
    blurb: "She wore the dress on purpose.",
    level: 4,
    minAffection: 50,
    prompt: "*she walks down the stairs in the red dress — the one she knows wrecks me. She stops two steps from the bottom, just to make me look up at her.* 'Worth the wait?'",
  },
];

const inject = (text: string) => {
  window.dispatchEvent(new CustomEvent("mina:inject-message", { detail: { text } }));
};

const GiftDrawer = ({
  open, onClose, balance, onPurchased, affection,
}: {
  open: boolean;
  onClose: () => void;
  balance: number;
  onPurchased: () => void;
  affection: number;
}) => {
  const [tab, setTab] = useState<TopTab>("activities");
  const [busy, setBusy] = useState<string | null>(null);
  const [giftCat, setGiftCat] = useState<GiftCat>("quick");

  if (!open) return null;

  const buyGift = async (g: Gift) => {
    if (g.comingSoon) { toast.info("Coming soon"); return; }
    setBusy(g.id);
    try {
      const { error } = await supabase.rpc("purchase_gift", { _companion_slug: "mina", _gift_id: g.id });
      if (error) throw error;
      toast.success(`She loved the ${g.label.toLowerCase()}`);
      onPurchased();
      onClose();
    } catch (e: any) {
      toast.error(e.message?.includes("insufficient") ? "Not enough tokens" : (e.message ?? "Failed"));
    } finally {
      setBusy(null);
    }
  };

  const runActivity = (a: Activity) => {
    if (affection < a.minAffection) {
      toast.info(`Needs ${a.minAffection} affection`);
      return;
    }
    inject(a.prompt);
    onClose();
  };

  const runScenario = (s: Scenario) => {
    if (affection < s.minAffection) {
      toast.info(`Needs ${s.minAffection} affection`);
      return;
    }
    inject(s.prompt);
    onClose();
  };

  const TOP_TABS: { id: TopTab; label: string; Icon: any }[] = [
    { id: "activities", label: "Activities", Icon: Sparkles },
    { id: "roleplay",   label: "Roleplay",   Icon: Drama },
    { id: "gifts",      label: "Gifts",      Icon: GiftIcon },
  ];

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg max-h-[88vh] flex flex-col bg-white/[0.07] backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] rounded-t-3xl sm:rounded-3xl p-5 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-medium text-white/95">Spend time with Mina</h3>
            <p className="text-xs text-white/50 flex items-center gap-1.5 mt-0.5">
              <Coins className="w-3 h-3" /> {balance} tokens · ❤ {affection}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-white/70"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Top tabs */}
        <div className="flex gap-1 p-1 mb-3 rounded-xl bg-white/[0.04] border border-white/5">
          {TOP_TABS.map(({ id, label, Icon }) => {
            const active = id === tab;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex-1 h-9 rounded-lg text-[11px] font-semibold transition flex items-center justify-center gap-1.5 ${
                  active ? "bg-white/15 text-white shadow-[0_2px_8px_rgba(0,0,0,0.3)]" : "text-white/45 hover:text-white/75"
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            );
          })}
        </div>

        {/* ── ACTIVITIES ── */}
        {tab === "activities" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto overflow-x-hidden px-1 py-1">
            {ACTIVITIES.map((a) => {
              const locked = affection < a.minAffection;
              return (
                <button
                  key={a.id}
                  onClick={() => runActivity(a)}
                  disabled={locked}
                  className={`relative text-left rounded-2xl border p-3 flex flex-col gap-1.5 transition ${
                    locked
                      ? "bg-white/[0.02] border-white/[0.06] opacity-50 cursor-not-allowed"
                      : "bg-white/[0.05] hover:bg-white/[0.12] border-white/10 hover:border-white/25 hover:scale-[1.02]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-2xl leading-none">{a.emoji}</div>
                    <LevelDots level={a.level} />
                  </div>
                  <div className="text-[12px] font-semibold text-white/95 leading-tight">{a.label}</div>
                  <div className="text-[10px] text-white/50 leading-snug">{a.tagline}</div>
                  {locked && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/40 border border-white/10 text-[8px] uppercase tracking-wider text-white/60">
                      <Lock className="w-2.5 h-2.5" /> ❤{a.minAffection}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* ── ROLEPLAY ── */}
        {tab === "roleplay" && (
          <div className="flex flex-col gap-2 overflow-y-auto pr-1 -mr-1">
            {SCENARIOS.map((s) => {
              const locked = affection < s.minAffection;
              return (
                <button
                  key={s.id}
                  onClick={() => runScenario(s)}
                  disabled={locked}
                  className={`relative text-left rounded-2xl border p-3 flex items-start gap-3 transition ${
                    locked
                      ? "bg-white/[0.02] border-white/[0.06] opacity-50 cursor-not-allowed"
                      : "bg-white/[0.05] hover:bg-white/[0.12] border-white/10 hover:border-white/25"
                  }`}
                >
                  <div className="text-3xl leading-none shrink-0">{s.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-[13px] font-semibold text-white/95 truncate">{s.title}</div>
                      <LevelDots level={s.level} />
                    </div>
                    <div className="text-[11px] text-white/55 mt-0.5 leading-snug">{s.blurb}</div>
                  </div>
                  {locked && (
                    <div className="shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/40 border border-white/10 text-[8px] uppercase tracking-wider text-white/60">
                      <Lock className="w-2.5 h-2.5" /> ❤{s.minAffection}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* ── GIFTS ── */}
        {tab === "gifts" && (
          <div className="flex min-h-0 flex-col gap-3">
            <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/5">
              {GIFT_CATS.map((c) => {
                const active = c.id === giftCat;
                return (
                  <button
                    key={c.id}
                    onClick={() => setGiftCat(c.id)}
                    className={`flex-1 h-8 rounded-lg text-[11px] font-medium transition flex items-center justify-center gap-1 ${
                      active ? "bg-white/15 text-white" : "text-white/45 hover:text-white/75"
                    }`}
                  >
                    <span>{c.icon}</span>{c.label}
                  </button>
                );
              })}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 overflow-y-auto overflow-x-hidden px-2 py-2">
              {GIFTS.filter((g) => g.category === giftCat).map((g) => {
                const afford = balance >= g.cost;
                const isBusy = busy === g.id;
                const locked = !!g.comingSoon;
                return (
                  <button
                    key={g.id}
                    onClick={() => buyGift(g)}
                    disabled={(!afford && !locked) || busy !== null}
                    className={`group relative aspect-square rounded-2xl border p-2 flex flex-col items-center justify-center gap-1 transition ${
                      locked
                        ? "bg-white/[0.02] border-white/[0.06] opacity-50 cursor-default"
                        : afford
                          ? "bg-white/[0.05] hover:bg-white/[0.12] border-white/10 hover:border-white/30 hover:scale-[1.03]"
                          : "bg-white/[0.02] border-white/[0.06] opacity-40 cursor-not-allowed"
                    } ${isBusy ? "ring-2 ring-white/40" : ""}`}
                  >
                    {locked && (
                      <span className="absolute top-1.5 right-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/40 border border-white/10 text-[8px] uppercase tracking-wider text-white/60">
                        <Lock className="w-2.5 h-2.5" /> Soon
                      </span>
                    )}
                    <div className="text-3xl leading-none">{g.emoji}</div>
                    <div className="text-[11px] font-medium text-white/90 leading-tight">{g.label}</div>
                    <div className="text-[10px] text-white/50 tabular-nums flex items-center gap-1">
                      <Coins className="w-2.5 h-2.5" /> {g.cost}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const LevelDots = ({ level }: { level: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        className={`w-1.5 h-1.5 rounded-full ${
          i <= level
            ? level >= 4
              ? "bg-rose-400"
              : level >= 3
                ? "bg-amber-300"
                : "bg-emerald-300"
            : "bg-white/15"
        }`}
      />
    ))}
  </div>
);

export default GiftDrawer;
