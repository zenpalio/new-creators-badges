import maiPortrait from "@/assets/chars/mai.png.asset.json";
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

export type ScenarioId =
  | "mai-roommate"
  | "cleo-app"
  | "anna-rescue"
  | "abby-boss"
  | "bo-ex";

export type Scenario = {
  id: ScenarioId;
  name: string;
  age: number;
  tag: string;
  hook: string;
  opener: string;
  portrait: string;
  hero: string;
  heat: string[]; // [cold, warm, hot]
  accent: string; // hex color for match flash
  bio: string;
  traits: string[];
  roleplay: string;
  slides: string[]; // profile gallery
};

export const SCENARIOS: Scenario[] = [
  {
    id: "mai-roommate",
    name: "Mai",
    age: 22,
    tag: "Your new roommate",
    hook: "first night · she 'accidentally' walked in",
    opener: "hey…sorry. i thought this was my room 🙈 you unpacking?",
    portrait: maiPortrait.url,
    hero: maiHero.url,
    heat: [maiHero.url, maiHero.url, maiHero.url],
    accent: "#f472b6",
    bio: "Art student. Night owl. Keeps a stack of Polaroids on her desk and never explains what's on them.",
    traits: ["shy at first", "flirty when comfy", "midnight talker"],
    roleplay: "You just moved in. Shared bathroom, thin walls, one shared kitchen. Tonight she 'accidentally' walked into your room in a hoodie and nothing else — and didn't leave.",
    slides: [maiHero.url, maiPortrait.url, maiHero.url],
  },
  {
    id: "cleo-app",
    name: "Cleo",
    age: 24,
    tag: "Matched on Sparks",
    hook: "she messaged first · 11:42pm",
    opener: "ok your bio genuinely made me laugh. dangerous move.",
    portrait: cleoPortrait.url,
    hero: cleoBg.url,
    heat: [cleoBg.url, cleoWarm.url, cleoWin.url],
    accent: "#a78bfa",
    bio: "Bartender with purple curls and a sharper tongue than her cocktails. Reads tarot for fun, believes none of it.",
    traits: ["forward", "playful", "loves a dare"],
    roleplay: "You matched an hour ago. She's alone in her apartment, bored, drink in hand — and she messaged first. See how far the banter goes before she suggests you come over.",
    slides: [cleoBg.url, cleoWarm.url, cleoWin.url, cleoPortrait.url],
  },
  {
    id: "anna-rescue",
    name: "Anna",
    age: 27,
    tag: "The stranger who saved you",
    hook: "her cabin · no signal · storm outside",
    opener: "you're awake. drink this. don't talk yet — just nod if it hurts.",
    portrait: annaPortrait.url,
    hero: annaBg.url,
    heat: [annaBg.url, annaWarm.url, annaWin.url],
    accent: "#fb923c",
    bio: "Ex-medic living off-grid. Doesn't do small talk, doesn't do names, doesn't usually let strangers stay the night.",
    traits: ["guarded", "protective", "quietly intense"],
    roleplay: "You crashed near her cabin during the storm. She patched you up. Phones are dead, roads are gone, and it's just the two of you until sunrise.",
    slides: [annaBg.url, annaWarm.url, annaWin.url, annaPortrait.url],
  },
  {
    id: "abby-boss",
    name: "Abby",
    age: 25,
    tag: "The boss's daughter",
    hook: "office party · after hours · she cornered you",
    opener: "so. you're the one everyone's scared of my dad hiring. cute.",
    portrait: abbyPortrait.url,
    hero: abbyBg.url,
    heat: [abbyBg.url, abbyWarm.url, abbyWin.url],
    accent: "#facc15",
    bio: "Law school dropout, daddy's problem. Shows up to your office in heels she can't walk in and knows exactly what she's doing.",
    traits: ["bratty", "spoiled", "hard to impress"],
    roleplay: "It's the office holiday party. Everyone's gone home except her — and she just locked your office door behind her. Bad idea. Very bad idea.",
    slides: [abbyBg.url, abbyWarm.url, abbyWin.url, abbyPortrait.url],
  },
  {
    id: "bo-ex",
    name: "Bo",
    age: 26,
    tag: "Your ex",
    hook: "1:47am · 'you up?'",
    opener: "you up?",
    portrait: boPortrait.url,
    hero: boBg.url,
    heat: [boBg.url, boWarm.url, boWin.url],
    accent: "#f43f5e",
    bio: "The one you shouldn't reply to. Black hair, crop top, still has a hoodie of yours she'll never give back.",
    traits: ["blunt", "unfinished business", "still knows you"],
    roleplay: "It's almost 2am. She texted first. She knows what she's doing. So do you. The question is who folds first.",
    slides: [boBg.url, boWarm.url, boWin.url, boPortrait.url],
  },
];


export const scenarioById = (id: ScenarioId) =>
  SCENARIOS.find((s) => s.id === id)!;
